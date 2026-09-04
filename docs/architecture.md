# Hatua architecture

Design for a working prototype that still reads as a real system: one pipeline from Conduit to a decision, with trust as a domain — not a Flask app with Chart.js.

Judges (Nderu, Karani, Mwangi) will open the repo. They should see bounded contexts, a versioned trust policy, replay of the file they handed us, and a UI that leads with **action**, not gauges.

**Non-goals:** Kubernetes, Kafka, eight microservices, a custom digital twin of the Omo, a mobile app, fake soil moisture.

---

## 1. Design principles

1. **Conduit is load-bearing.** Every decision cites instrument 61 (or another CHORDS id). Unplug the station, the product goes silent — with an explicit degraded state, not a cached fantasy.
2. **One write path.** CSV backfill and live CHORDS polls are the same ingest → trust → decide pipeline. Replay is not a second codebase.
3. **Trust before insight.** An observation with `trust = reject` cannot emit a climate action. It can emit a *station* action (`DO_NOT_CALIBRATE`, `GAUGE_STUCK`).
4. **Explain every number.** Each action carries a structured trace: inputs, policy version, thresholds, window. No black-box “AI said so.”
5. **UTC in storage, EAT on screen.**
6. **Station-keyed from day one.** `station_id` on every row even if we only ship JKUAT. Scale story is a second 3D-PAWS id, not a rewrite.
7. **Modular monolith.** Two processes (API + worker), one Python domain. Not a distributed systems demo.

---

## 2. Users and UI surfaces

Three faces, one engine. The frontend is a **role switch**, not three apps.

| Surface | Primary user | Home screen |
| --- | --- | --- |
| Campus | Grounds, construction, sports, clinic | Current **go / shade / hydrate / delay** |
| Farm | Juja–Thika horticulture | **Irrigate / wait** and **ventilate tonight** |
| Science | JHUB / AquaTwin / SPACE-SI | Trust timeline, residuals, calibrate? **yes/no** |

The science face is how we show Karani we read *his* station. The campus face is how we show Mwangi a user. Farm is climate impact.

---

## 3. System context

```
                    ┌─────────────┐     ┌──────────────────┐
                    │  Organiser  │     │ Public forecast  │
                    │  GeoCSV     │     │ (Open-Meteo)     │
                    └──────┬──────┘     └────────┬─────────┘
                           │                     │
                           ▼                     ▼
┌──────────────┐    ┌─────────────────────────────────────┐    ┌─────────────┐
│ CHORDS 3D-   │───▶│              Hatua                   │───▶│ Campus /    │
│ PAWS id 61   │    │  worker + API + Postgres + web      │    │ farm user   │
└──────────────┘    └──────────────┬──────────────────────┘    └─────────────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │ Science /   │
                            │ AquaTwin    │
                            │ (trust API) │
                            └─────────────┘
```

Hatua does not own Conduit. It is a **consumer and decision layer**. AquaTwin remains the twin; we emit a calibration-ready flag they could ingest later.

---

## 4. Containers (what actually runs)

```
┌──────────── apps/web (Next.js) ────────────┐
│  App Router · role shells · SSE client     │
│  talks only to Hatua API (never CHORDS)    │
└─────────────────────┬──────────────────────┘
                      │ HTTPS / SSE
┌──────────── apps/api (FastAPI) ────────────┐
│  Read models, commands, OpenAPI, SSE       │
│  No CHORDS I/O on the request path         │
└─────────────────────┬──────────────────────┘
                      │ Postgres
┌────────── apps/worker (Python) ────────────┐
│  Ingest · TrustPolicy · Decide · Fuse      │
│  Outbox dispatcher                         │
└────────┬────────────┬────────────┬─────────┘
         │            │            │
    CHORDS HTTP    GeoCSV     Open-Meteo
         │
    ┌────┴─────┐
    │ Postgres │  observations, verdicts, actions, events, outbox
    └──────────┘
```

| Process | Responsibility | Failure mode |
| --- | --- | --- |
| **worker** | All side effects: fetch, parse, QC, decide, write events | If down, UI shows last good state + “ingest lag” |
| **api** | Reads + light commands (ack action, switch replay clock) | If down, demo is dead — keep it dumb and stable |
| **web** | Presentation, replay cursor, role | If API 502, full-page degraded, no fake live numbers |
| **postgres** | Source of truth | Single node in compose; backups out of scope for the weekend |

Redis is **not** required. Live UI uses **SSE** from the API polling `actions` / `events` (`LISTEN/NOTIFY` if we have time). Skip a message bus.

---

## 5. Repository structure

Monorepo. Judges should walk this tree and understand it in one minute.

```
apps/
  web/                    Next.js 15 · TypeScript · App Router
    app/
      (shell)/            role layout, clock, trust chip
      page.tsx            NOW — current action (not a chart)
      trust/              verdict timeline
      residuals/          Conduit vs forecast
      replay/             28 Aug–1 Sep cursor
      station/[id]/       science dossier
    src/
      components/         ActionCard, TrustBadge, ExplainDrawer, ReplayClock
      lib/api.ts          generated from OpenAPI
      lib/time.ts         UTC ↔ Africa/Nairobi
  api/                    FastAPI · thin
    main.py
    routers/              now, actions, trust, residuals, stream, health
    sse.py
  worker/
    main.py               run loop
    jobs/                 backfill_csv, poll_live, poll_forecast, dispatch_outbox
packages/
  core/                   THE product (shared by api + worker)
    domain/
      observation.py
      trust.py
      action.py
      residual.py
      events.py
    policy/
      trust_v1.yaml       versioned, readable by judges
      actions_v1.yaml
    application/          use cases
      ingest_batch.py
      evaluate_trust.py
      issue_actions.py
      fuse_forecast.py
    adapters/
      chords.py           HTTP + circuit breaker
      geocsv.py
      openmeteo.py
      postgres.py
    projections/          read models the API serves
infra/
  docker-compose.yml      postgres, api, worker, web
  migrate/                SQL
data/                     organiser GeoCSV (read-only input)
docs/
```

**Rule:** `packages/core` has no FastAPI and no React. Domain tests live next to domain. If a judge asks “where is the trust logic?”, the answer is `packages/core/policy/trust_v1.yaml` + `domain/trust.py`.

---

## 6. Domain model

### 6.1 Entities

**Station** — `id` (CHORDS instrument id), `site_id`, lat/lon/elev, timezone `Africa/Nairobi`, `cadence_s`.

**Variable** — CHORDS shortname (`rg`, `sh1`, `wbgt`, …), units, role (`climate` | `derived` | `health` | `forbidden`).

Forbidden in this extract (cannot drive climate actions): `rg2`, `wgd` (clone of `wg`), `bv` (missing), `hth` except as a fault signal.

**Observation** — one timestep, one station. Canonical time `observed_at` (timestamptz UTC). Payload is **JSONB** keyed by shortname (schema will grow). Hot paths also copy `rg`, `bt1`, `st1`, `sh1`, `wbgt`, `hi`, `su1`, `ws` into typed columns for indexes.

**TrustVerdict** — `accept` | `degrade` | `reject`, score 0–1, `flags[]`, `policy_id` (`trust_v1`), `inputs` JSON (spreads, stuck windows).

**Action** — typed, user-facing, time-bounded.

| `kind` | Face | Meaning |
| --- | --- | --- |
| `HEAT_PROTECT` | Campus | Shade + water; delay heavy outdoor work |
| `UV_PROTECT` | Campus | Peak UV window |
| `HUMIDITY_VENTILATE` | Farm | Night RH window / leaf-wetness risk |
| `WATER_WAIT` | Farm | ET demand vs gauge-1 rain; do not irrigate |
| `RAIN_ONSET` | Campus/Farm | Gauge 1 tip that passed trust |
| `STATION_FAULT` | Science | Do not calibrate; named component |

**Residual** — `valid_at`, `conduit_mm` (gauge 1, trusted only), `model_mm`, `model_id` (`openmeteo_era5` / `gfs` — whatever we actually call), `delta_mm`.

**Domain event** (append-only) — `ObservationIngested`, `TrustEvaluated`, `ActionIssued`, `ActionSuppressed`, `ResidualComputed`, `IngestLagged`, `SourceDegraded`.

Actions are **not** issued inside the HTTP request. The worker is the only writer of actions. The API may **acknowledge** or **pin replay time**.

### 6.2 Trust policy v1 (what the YAML encodes)

Evaluated per observation, with rolling state per station (worker memory + DB).

| Check | Signal in the shared file | Verdict |
| --- | --- | --- |
| Gauge stuck | `rg2 == 0` for N hours while `rg` or time advances | flag `rg2`; **do not average rain** |
| Cloned field | `wgd == wg` identically | drop `wgd`; flag `cloned_gust_dir` |
| Missing power | `bv` null | flag `battery_unknown`; degrade health story |
| Health garbage | `hth ∉ {0,1,2,3}` or `hth > 100` | reject health as climate; `STATION_FAULT` |
| Thermometer spread | max(\|st1−bt1\|, \|st1−mt1\|) > 1.0 °C | degrade temperature; use median, show range |
| Implausible phys | T < −5 or > 45 at 1523 m; RH ∉ 0–100; rain tip > 20 mm/min | reject timestep for climate actions |
| Stale live | last poll age > 3 × cadence | UI: ingest lag, no “live” badge |

`reject` → no HEAT/UV/HUMIDITY/WATER/RAIN actions from that row. `degrade` → actions allowed but badge **DEGRADED** and explanation includes the flag. `accept` → clean.

Policy is **versioned**. An action stores `policy_id`. Changing a threshold is a new yaml, not a silent code edit. That is what “real effort” looks like in the README.

### 6.3 Action policy v1 (honest about this week)

Do not use ISO heat-stroke cutoffs that never fire. This campus week peaks WBGT ~21.7 °C. Thresholds must be **relative to this station’s diurnal climatology** (percentile of the backfill) **and** absolute floors.

- **HEAT_PROTECT** — WBGT ≥ 90th percentile of that station’s afternoons in the loaded archive, or heat index ≥ 26 °C **and** UV > 0 (EAT 12:00–16:00). Fires in the shared file.
- **UV_PROTECT** — `su1` above a station percentile, daytime only.
- **HUMIDITY_VENTILATE** — `sh1 ≥ 90` for ≥ 60 consecutive minutes in 21:00–06:00 EAT. Fires (534 minutes ≥ 90% in the extract).
- **WATER_WAIT** — daily gauge-1 total < 1 mm **and** daytime ET0 proxy above threshold. Fires all five days.
- **RAIN_ONSET** — trusted `rg > 0` after ≥ 6 h of zeros. Fires twice on 31 Aug.
- **Hysteresis** — min 45 min between same `kind` to avoid alert flapping at 1-minute cadence.
- **Suppression** — if trust is reject, climate kinds are `ActionSuppressed` with reason (still visible on science face).

ET0 proxy: FAO-56 Hargreaves or a simplified Penman using T, RH, wind, and SI1145 visible as radiation stand-in. **Label it a proxy.** Do not call it soil moisture.

---

## 7. Data pipeline (write path)

Same function: `ingest(records: Iterable[RawRow], source: csv|chords) -> None`.

```
RawRow
  → parse + units + shortname map          adapters/geocsv | chords
  → upsert Observation  (idempotent)       unique (station_id, observed_at)
  → evaluate TrustPolicy                   rolling windows from DB
  → persist TrustVerdict
  → append TrustEvaluated
  → if climate-eligible: ActionPolicy
  → persist Action or ActionSuppressed
  → append ActionIssued | ActionSuppressed
  → outbox row if user-facing and new
  → (async) forecast fuse at hourly ticks → Residual
```

**Idempotency:** unique constraint on `(station_id, observed_at)`. Re-running backfill is a no-op. Live poll of `?last` may repeat the same timestamp — upsert, do not duplicate actions (action identity: `(station_id, kind, window_start)`).

**Backfill:** worker job reads `data/*.csv`, streams in chunks of 500, commits per chunk. 7,060 rows is trivial; the same job must tolerate the full May 2025–now series without loading it into RAM.

**Live:** poll CHORDS `61.geojson?last` every 30–60 s (station reports ~15 min on the portal, ~60 s in the extract — take `max(cadence, 30s)`). Circuit breaker: 3 failures → `SourceDegraded`, backoff to 5 min, UI banner.

**Forecast fuse:** hourly, Open-Meteo precipitation for lat/lon of site 62, aligned to EAT days, compared to **trusted** gauge-1 daily total. If gauge-1 is reject, residual is not computed (null, not zero).

**Outbox:** `alert_outbox(id, action_id, channel, payload, status)`. Dispatcher is a worker loop. Weekend channel = `log` + optional webhook. SMS later without changing issue_actions.

---

## 8. Backend internals

### 8.1 Hexagon

```
            policy yaml
                 │
    domain ←─────┘
       ▲
application (ingest, evaluate, issue, fuse)
       ▲
adapters: postgres | chords | geocsv | openmeteo | clock
       ▲
   worker jobs    api routers
```

- Domain never imports `httpx`, FastAPI, or SQLAlchemy models.
- Clock is injected (`Clock.now()`) so replay can drive **virtual time** for the demo: scrub to `2026-08-31T03:41:33Z` and the NOW card shows RAIN_ONSET.
- CHORDS credentials: env `CHORDS_EMAIL`, `CHORDS_API_KEY`. Never in git. Live adapter omitted in tests; use GeoCSV fixture.

### 8.2 Postgres (source of truth)

```
stations (id PK, site_id, name, lon, lat, elev_m, timezone)
variables (station_id, shortname, units, role)
observations (
  station_id, observed_at,
  payload jsonb NOT NULL,
  rg, rg2, st1, bt1, mt1, sh1, wbgt, hi, su1, ws, wg, hth,
  source TEXT,          -- csv | chords
  ingest_run_id,
  PRIMARY KEY (station_id, observed_at)
)
trust_verdicts (
  station_id, observed_at,
  status, score, flags text[], policy_id, details jsonb,
  PRIMARY KEY (station_id, observed_at)
)
actions (
  id uuid,
  station_id, kind, status, -- issued | suppressed | acked
  valid_from, valid_until,
  policy_id, trust_status,
  explanation jsonb NOT NULL,
  UNIQUE (station_id, kind, valid_from)
)
residuals (
  station_id, valid_at, conduit_mm, model_mm, model_id, delta_mm
)
events (
  id bigserial, ts, type, station_id, payload jsonb
)
ingest_runs (id, source, started_at, rows_ok, rows_dead, error)
dead_letters (raw, reason, seen_at)
outbox (...)
```

Indexes: `observations (station_id, observed_at DESC)`, `actions (station_id, valid_from DESC)`, `events (station_id, id)`.

### 8.3 API (read-optimised, OpenAPI 3)

All JSON. No CHORDS on this process.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | api + postgres; `worker_lag_s` |
| GET | `/v1/stations` | list |
| GET | `/v1/stations/{id}/now` | **the product**: current action set, trust chip, observed_at, lag |
| GET | `/v1/stations/{id}/actions` | `from`,`to`,`kind` |
| GET | `/v1/stations/{id}/trust` | verdict series for science face |
| GET | `/v1/stations/{id}/observations` | downsampled (1 in N or 5-min max) — never dump 7k points unasked |
| GET | `/v1/stations/{id}/residuals` | daily Conduit vs model |
| GET | `/v1/stations/{id}/explain/{action_id}` | full trace |
| POST | `/v1/replay` | `{ t: iso }` virtual clock (demo only, flag `HATUA_REPLAY=1`) |
| GET | `/v1/stream` | SSE: action, trust, lag events |

`GET /now` shape (contract the frontend is built on):

```json
{
  "station_id": 61,
  "observed_at": "2026-09-01T12:00:00Z",
  "as_of_eat": "2026-09-01T15:00:00+03:00",
  "trust": { "status": "degrade", "flags": ["rg2_stuck", "cloned_gust_dir"] },
  "actions": [
    {
      "id": "...",
      "kind": "HEAT_PROTECT",
      "headline": "Shade and water for outdoor work",
      "until_eat": "16:30",
      "explanation": { "wbgt": 21.7, "hi": 27.5, "su1": 5.1, "policy": "actions_v1" }
    }
  ],
  "ingest": { "lag_s": 42, "source": "csv" }
}
```

If `actions` is empty, the API still returns **why** (quiet day vs suppressed). Empty NOW is a first-class state: “No outdoor restriction. Gauge 2 still untrusted.”

### 8.4 Worker loop

```
every 1s:  dispatch outbox
every 30s: poll live (if HATUA_LIVE=1)
every 1h:  fuse forecast
on boot:   backfill CSV if observations empty
```

Structured logs: `json` with `run_id`, `station_id`, `observed_at`. `/health` on API reads `max(observed_at)` vs wall clock.

### 8.5 Testing the domain (this is the “effort” judges can run)

- `trust_v1` against **fixtures sliced from the real CSV**: 31 Aug 00:13 rain tip; nightly `hth=33501705`; 5 days of `rg2=0`; identical `wg`/`wgd`.
- Action hysteresis: 60 consecutive HEAT minutes → one action, not 60.
- Ingest idempotency: load CSV twice, `count(*)` unchanged.
- Residual: if trust rejects rain, residual row absent.
- Clock injection: replay `2026-08-31T03:41:33Z` → `RAIN_ONSET` on `/now`.

---

## 9. Frontend internals

### 9.1 Stack

Next.js 15 (App Router), TypeScript, TanStack Query, MapLibre (single point), a small chart lib **only** on Trust and Residuals (uPlot or visx — not a dashboard template). CSS: one design token file. No generic purple “AI SaaS” kit.

**The web app never calls CHORDS.** That keeps keys off the browser and matches the hexagon.

### 9.2 Information architecture

```
/                     NOW (role-aware ActionCard stack + trust chip + lag)
/trust                Science: flags over time, gauge 2 autopsy, thermometer spread
/residuals            Conduit mm vs model mm (daily bars, 28 Aug–1 Sep)
/replay               Scrubber over the extract; drives POST /v1/replay
/station/61           Dossier: meta, cadence, policy versions, CHORDS attribution
```

Role switcher in the shell: **Campus | Farm | Science**. It only filters which `kind`s are primary and the copy. Same `/now` payload.

### 9.3 NOW screen (the demo)

Not four doughnut charts. One vertical stack:

1. **Station + as-of EAT + live/replay/lag badge**
2. **Trust chip** — ACCEPT / DEGRADED / REJECT with the two-word reason (`gauge 2 stuck`)
3. **Primary action** — huge headline, until-time, who should move (crew / grower / scientist)
4. **Secondary actions** — compact
5. **Explain** — drawer: the actual shortnames (`wbgt`, `sh1`, `rg`) and policy ids
6. **Quiet footer** — sparkline of last 6 h WBGT or RH, visually subordinate

If CHORDS is down and we are on live mode: full-width **Source degraded — last trusted action at 10:12 EAT**. Never freeze a green “all good.”

### 9.4 Replay (how we win the video)

The organiser file is a **closed world**. Replay clock is a first-class product:

- Track: 28 Aug 00:00 → 1 Sep 24:00 EAT
- Marks on 31 Aug 03:13 EAT and 06:41 EAT (rain tips, UTC+3)
- Marks on each `hth` spike
- Play / pause / skip to next event
- Worker or API applies virtual time so `/now` and SSE follow the cursor

Judges watch: dry afternoon → HEAT_PROTECT; night → HUMIDITY_VENTILATE; 31 Aug → RAIN_ONSET; science tab → gauge 2 still dead. That is Data → Insight → Action in four minutes.

### 9.5 Component rules

| Component | Rule |
| --- | --- |
| `TrustBadge` | Every numeric tile. No bare `21.7°C` |
| `ActionCard` | Headline in language a crew lead can read. Shortnames only in Explain |
| `ExplainDrawer` | Policy id + thresholds + values. Screenshot-friendly for the README |
| `ReplayClock` | Keyboard accessible |
| `LagBanner` | If `lag_s > 180` |

State: TanStack Query for REST; EventSource for `/v1/stream`; replay time in URL `?t=` so a demo link is shareable.

### 9.6 Visual tone

Operational climate console for JKUAT: dense, calm, one accent, tabular figures, EAT labels. Not a marketing landing page. Science face may be denser (flags table). Campus face is large type, few numbers.

---

## 10. End-to-end sequences

**Live minute**

```
CHORDS last → worker parse → upsert obs → trust_v1 → maybe action
     → NOTIFY → API SSE → web NOW replaces card
```

**Demo boot**

```
compose up → migrate → worker backfill CSV → policies applied
     → web /replay at 31 Aug tip → NOW shows RAIN_ONSET + STATION_FAULT(rg2)
```

**Forecast hour**

```
Open-Meteo day total ↔ sum(trusted rg) → residuals row → /residuals chart
```

---

## 11. Failure modes (design them, don’t discover them on stage)

| Failure | Behaviour |
| --- | --- |
| CHORDS 5xx / timeout | Circuit open, `SourceDegraded`, last CSV/DB state, banner |
| Duplicate live timestamp | Upsert; no second HEAT card |
| Gauge 2 zeros | Climate rain uses `rg` only; science `STATION_FAULT` |
| `hth` spike | Fault action; ignore as weather |
| Empty `/now` actions | Honest quiet state + still show trust flags |
| Forecast API down | Residuals page: “model unavailable”; campus/farm still work |
| Replay + live both on | Replay wins; live poll paused (`HATUA_REPLAY=1`) |
| Secrets missing | Worker starts in `csv-only`; never log env values |

---

## 12. Observability and security

- `GET /health`: `{ api, db, last_obs, worker_lag_s, source }`
- JSON logs, no query strings with keys
- CORS: web origin only
- Rate-limit `/v1/replay` and `/v1/stream`
- Attribution footer: Conduit@Empathy, CHORDS DOI `10.5065/D6V1236Q`
- See `SECURITY.md` for credentials

---

## 13. Build order (so the architecture ships)

| Slice | Done when |
| --- | --- |
| 0 | Compose + Postgres + migrate + CSV backfill + `GET /now` JSON |
| 1 | `trust_v1` fixtures from the real extract (gauge 2, health, clone, rain tips) |
| 2 | Action kinds fire on that extract; hysteresis tests green |
| 3 | Web NOW + TrustBadge + ExplainDrawer on real `/now` |
| 4 | Replay clock + event marks |
| 5 | Residuals (even if Open-Meteo is stubbed then swapped) |
| 6 | Live poll + lag banner |
| 7 | Science `/trust` autopsy of gauge 2 |

If time dies, cut 5–6. Do not cut 1–4. The video can run entirely on replay of their file.

---

## 14. What “senior” means here

Not more boxes. It means: **one pipeline**, **versioned policy**, **idempotent ingest**, **explainable actions**, **replay as a product**, **CHORDS never in the browser**, **honest degraded states**, **station_id everywhere**. That is the architecture Karani can code-review and Nderu can map to Data → Impact without us saying the slogan.
