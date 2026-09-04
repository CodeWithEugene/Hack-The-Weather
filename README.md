# Hatua

**Trusted action from Conduit@Empathy.**

Hatua (Kiswahili for *step* / *action*) is the last mile from JKUAT’s Conduit climate station to a decision someone takes the same day: whether a reading is trustworthy, and whether to go outside, hydrate, ventilate, or wait on water.

This repository is our entry for [Hack The Weather 2026](https://hack-the-weather.devpost.com/) (JHUB Africa / JKUAT) — theme **From Data to Impact**.

> Conduit already measures the Juja microclimate every minute. People next to the sculpture still decide from the sky, and AquaTwin would calibrate satellites against silent sensor faults. We do not ship another weather dashboard.

| | |
| --- | --- |
| Hackathon | [Hack The Weather 2026](https://hack-the-weather.devpost.com/) · 6–9 Sep 2026 |
| Mandatory data | [Conduit@Empathy](https://conduit.jhubafrica.com/) · CHORDS instrument **61** (Site JKUAT) |
| Licence | [MIT](LICENSE) |
| Status | Problem and data in place; application not built yet |

---

## Problem

Outdoor workers, students, and nearby farmers around JKUAT have a world-class climate station on campus and still decide from the sky. Conduit@Empathy records heat, humidity, rain, wind, and radiation every minute, but those observations are not checked for sensor failure and are not turned into a go / delay / protect decision.

In the sample week organisers shared (28 Aug–1 Sep 2026):

- Rain was **0.4 mm** total (two 0.2 mm tips). Four days had **0 mm**.
- Rain gauge 2 never moved. Wind gust direction is a copy of gust speed. Battery voltage is empty. A health flag of `33501705` appears once a night.
- Afternoons still reached heat index ~27.5 °C and WBGT ~22 °C with UV up. Nights sat at 85–90%+ relative humidity for hours.

The problem is not missing charts. It is the missing step from **trusted Conduit observations** to an **action the same day**.

Full write-up: [`docs/problem.md`](docs/problem.md). Challenge notes: [`docs/info.md`](docs/info.md).

---

## Solution

Hatua is a **trust-gated action layer** on Conduit — not a twin of AquaTwin and not a national flood model.

1. **Trust gate** — every timestep from instrument 61 is checked before it may drive an alert (stuck gauge, cloned fields, garbage health, thermometer disagreement).
2. **Insight** — heat / UV exposure, overnight humidity (leaf-wetness / storage risk), rain onset from gauge 1 only, and a water-demand proxy from T, RH, wind, and radiation. No fake soil moisture.
3. **Ground vs model** — Conduit gauge 1 is used to residual-check a public forecast or satellite rainfall for Juja, so a model cannot silently overstate rain.
4. **Action** — a recommendation card (and later SMS/WhatsApp): go / shade / hydrate; ventilate overnight; do not irrigate; do not ingest this timestep into AquaTwin.

If you unplug Conduit, Hatua has nothing to say. That is intentional.

### Who it is for

| Face | User | Decision |
| --- | --- | --- |
| Campus | Grounds crews, construction, sports, clinics | Go / shade / hydrate / delay |
| Farm | Juja–Thika horticulture | Irrigate or wait; ventilate overnight |
| Science | AquaTwin / SPACE-SI / JHUB | Use / degrade / discard this timestep |

---

## Conduit data

We **must** use Conduit@Empathy. The live station is a 3D-PAWS AWS on the FEWSNET CHORDS portal.

| Field | Value |
| --- | --- |
| Platform | [https://conduit.jhubafrica.com/](https://conduit.jhubafrica.com/) |
| Twin dashboard | [https://conduit.jhubafrica.com/model.html](https://conduit.jhubafrica.com/model.html) |
| CHORDS instrument | [id 61](https://3d-fewsnet.icdp.ucar.edu/instruments/61) · Site JKUAT (id 62) |
| Location | 37.014528 E, 1.099736 S, 1523 m (Juja, Kiambu) |
| Shared extract | [`data/3DFEWSNET_SiteJKUAT_KenyaKiambuJKUATIOTAWS-Conduti@Empathy1.csv`](data/3DFEWSNET_SiteJKUAT_KenyaKiambuJKUATIOTAWS-Conduti@Empathy1.csv) |
| Extract window | 2026-08-28 00:00 UTC → 2026-09-01 23:58 UTC · ~1 min cadence · 7,060 rows |

**Used in the product:** rain gauge 1, BMX / MCP / SHT temperature, SHT humidity, pressure, SI1145 visible / IR / UV, wind speed and direction, gust, heat index, wet bulb, WBGT.

**Treated as faults, not climate:** rain gauge 2 (all zeros in the extract), wind gust direction (duplicate of gust), battery voltage (missing), health spikes.

Soil moisture, vegetation, and water quality are advertised for Conduit but are **not in this extract**. We do not invent them.

Live pulls use the CHORDS HTTP API (`/api/v1/data/61.csv` or `.geojson` with `start` / `end` / `last`). Do not commit API keys; see [SECURITY.md](SECURITY.md).

---

## Features (planned)

- Trust timeline for station 61, including the faults in the shared file
- Three action streams: heat / UV, humidity / disease risk, rain / water demand
- Conduit vs forecast residual for the same window
- Live `last` observation plus the on-disk extract
- Optional second 3D-PAWS site (e.g. KALRO Thika) as the scale path

---

## Architecture

```
Conduit CHORDS (instrument 61) + shared CSV
        │
        ▼
   ingest + QC / trust gate
        │
        ├── heat / UV action
        ├── humidity / leaf-wetness action
        ├── rain onset (gauge 1 only)
        └── Conduit vs forecast residual
        │
        ▼
   recommendation API + web UI
```

---

## Technology stack

Not locked until implementation. Expected:

- Python for ingest, QC, and decision rules
- CHORDS CSV / GeoJSON
- A small HTTP API and a web UI
- Optional public forecast / satellite rainfall (Open-Meteo, CHIRPS, or similar)

AI coding assistants may be used during the hackathon. Any model that ships in the product will be named here and in the Devpost submission.

---

## Repository layout

```
data/          Conduit extract (GeoCSV 2.0)
docs/          Challenge brief and problem statements
LICENSE        MIT
README.md      This file
CONTRIBUTING.md
SECURITY.md
```

Application code will live under `src/` (and tests under `tests/`) when we start the build. Do not add secrets, `.env` files, or `.claude-flow/` output.

---

## Installation and setup

The application is not runnable yet. To inspect the Conduit extract you need Python 3.11+ (standard library only):

```bash
git clone https://github.com/<org>/Hack-The-Weather.git
cd Hack-The-Weather
python3 -c "import pathlib; p=pathlib.Path('data').glob('*.csv'); print(next(p).name)"
```

When the app exists, this section will list prerequisites, env vars (never committed), and run commands.

---

## Usage

Until the UI ships, treat [`docs/problem.md`](docs/problem.md) as the product spec and the CSV as the demo window. A hosted demo URL and screenshots will be linked here before the 9 Sep 2026 15:00 EAT submission deadline.

---

## Data sources

| Source | Role | Attribution |
| --- | --- | --- |
| Conduit@Empathy / JHUB Africa / JKUAT | Mandatory ground observations | [conduit.jhubafrica.com](https://conduit.jhubafrica.com/) |
| 3D-PAWS FEWSNET CHORDS (NCAR/RAL) | Archive and live API for instrument 61 | [DOI 10.5065/D6V1236Q](https://doi.org/10.5065/D6V1236Q) |
| Public forecast / EO (TBD) | Residual check against gauge 1 | Named in README when wired |

---

## AI usage

None in a shipped model yet. This README and the research docs were drafted with AI assistance. The team remains responsible for architecture, data handling, and the demo. Significant AI use will be disclosed on Devpost as required by the official rules.

---

## Team

| Name | Role |
| --- | --- |
| Eugene Mutembei | Repository owner |

Add teammates here when the 2–5 person hackathon team is locked (one Team Lead, every member registered on Devpost).

---

## Future development

- Campus estates as the first operator of heat / UV actions
- Kiambu horticulture using the longer CHORDS archive (May 2025–present)
- Trusted-timestep feed for AquaTwin / SPACE-SI calibration
- Other Kenya 3D-PAWS stations on the same trust + action engine

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md). Never commit passwords, API keys, or tokens.

## Licence

[MIT](LICENSE) © 2026 Eugene Mutembei. Conduit and CHORDS data remain subject to their own terms. Hatua does not claim ownership of JKUAT, JHUB Africa, SPACE-SI, or NCAR data.
