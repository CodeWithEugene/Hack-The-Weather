# Problem statements

Grounded in the challenge brief (`docs/info.md`) and the Conduit extract in `data/3DFEWSNET_SiteJKUAT_KenyaKiambuJKUATIOTAWS-Conduti@Empathy1.csv` (exported 2 Sep 2026).

The hackathon does **not** hand you a single prescribed problem. It forbids a weather dashboard and requires a named user, a decision, and **meaningful use of Conduit data**. The problem we should solve is the one this station can actually support.

---

## What the organisers say the problem is

Kenya already generates environmental observations. The gap is converting them into **insight → decision → action**.

They describe a connected local system: rainfall → water → agriculture → soil/vegetation → infrastructure and communities. Drought, flood, shifting rains, heat, and water stress are the climate backdrop. Conduit@Empathy at JKUAT exists to ground-truth that system (calibrate satellites and digital twins of river basins).

Their test for a good problem:

- Who experiences it?
- What decision does it block today?
- What action becomes possible if it is solved?
- What breaks if it is not solved?

Their anti-pattern: an app that only displays temperature and rainfall.

---

## What this dataset actually is

| Fact | Detail |
| --- | --- |
| Station | CHORDS instrument 61, Site JKUAT (Juja, 37.014528 E, 1.099736 S, 1523 m) |
| Window in this file | **28 Aug 2026 00:00 UTC → 1 Sep 2026 23:58 UTC** (5 days) |
| Cadence | ~**1 minute** (median 61 s). No gap longer than ~13 minutes |
| Rows | 7,060 (header claims 169,440 “measurements” = rows × fields, not extra days) |
| Variables that work | 3 air temperatures, humidity, pressure, vis/IR/UV, wind speed/dir, gust, heat index, wet bulb, WBGT, rain gauge 1 |
| Variables that do not | **Rain gauge 2 = all zeros**. **Battery voltage = empty**. **Wind gust direction = copy of wind gust** (7,060/7,060 identical). **Health** is 0 except five nightly spikes of `33501705` |
| Rain in this week | Two 0.2 mm tips on 31 Aug (00:13 and 03:41 UTC). Daily total **0.4 mm**. Four of five days: **0 mm** |
| Heat / humidity | Nights ~13–15 °C and RH **82–87%** (534 minutes with RH ≥ 90%). Afternoons ~25 °C, RH ~43%, WBGT peaks **20.9–21.7 °C**, UV present 08:00–17:00 EAT |
| Sensor disagreement | SHT vs BMX temperature mean offset **0.43 °C**, max **1.3 °C**; SHT vs MCP max **1.6 °C** |

This file is a **short dry-season slice**. The live portal still has history from **30 May 2025**. Soil moisture, vegetation, and water quality are advertised for Conduit; they are **not in this CSV**. Do not write a problem that requires those series unless Discord confirms another API.

So: the data can carry heat, humidity, radiation, wind, light rain, **and data trust**. It cannot, by itself, carry a flood model or an irrigation schedule that needs soil water.

---

## The problem (one sentence)

**Conduit@Empathy already observes the JKUAT microclimate every minute, but nobody who needs a decision — students and outdoor workers on campus, nearby horticulture, or the scientists who use this station as satellite ground truth — is told whether a reading is trustworthy or what to do with it.**

That is the Data → Impact gap at this exact station. The five-day extract makes it concrete: almost no rain, yet heat, UV, and overnight humidity still created exposure; meanwhile the station silently lied (dead second gauge, cloned gust direction, garbage health flags).

---

## Problem statements worth building on

Ranked for a first-place run: load-bearing Conduit use, a real user, feasible in 87 hours, honest about this file.

### P1 — Recommended: trusted, actionable campus climate (heat + humidity + rain onset)

**Statement.** People on and around JKUAT (students, grounds and construction crews, sports, clinics) live inside a high-frequency climate record they never see as advice. In this sample week, afternoons reached heat index ~27.5 °C and WBGT ~22 °C with UV up, while nights sat at 85–90%+ humidity. Rain was almost absent, so a “flood app” would have had nothing to show — but **when to work outside, hydrate, seek shade, or watch for a rain start** was still a real decision. Today that decision is made by looking at the sky.

**Who.** Campus community first (reachable in a hackathon). Same engine can later serve Juja/Thika horticulture.

**Decision it unblocks.** Go / delay / protect for outdoor activity; hydration and UV; “rain has started” vs “gauge noise”; tonight’s high-humidity hours for anyone storing produce or running greenhouses.

**Why this wins.** Uses the variables that actually stream (T, RH, WBGT, HI, UV, wind, rain). Matches the judges’ Data → Insight → Action story. Does not pretend we have soil or river discharge. Scales to other 3D-PAWS sites after the weekend.

**What happens without it.** Conduit remains a researcher dashboard. The people next to the sculpture get no warning and no trust layer.

### P2 — Strong technical complementary: the ground truth is not trustworthy enough to calibrate anything

**Statement.** Conduit’s published purpose is to **calibrate satellite products and AquaTwin / C3M digital twins**. In the extract they handed us, rain gauge 2 never moved, gust direction is a duplicate of gust speed, battery voltage is missing, and a health flag of 33,501,705 appears once a night. Three thermometers disagree by up to 1.6 °C. If SPACE-SI or a county model ingests this series raw, they will calibrate against faults.

**Who.** JHUB / SPACE-SI / AquaTwin researchers first; any downstream farmer or campus user second (they inherit bad alerts).

**Decision it unblocks.** Use / degrade / discard this timestep; prefer gauge 1; ignore gust direction; treat health spikes as sensor faults not climate events.

**Why this is real.** It is the problem the hardware is already showing. Keith Karani’s intern briefing was about this data firehose. Judges will recognise it.

**Risk.** If this is the *only* product, it can look like an internal QA tool and score lower on climate/social impact. Use it as the **integrity layer under P1**, not as the whole pitch.

### P3 — Viable if we pull more history: Kiambu horticulture water-and-disease timing

**Statement.** Smallholders and campus/KALRO farms around Juja–Thika must time irrigation and fungal-risk management without a soil-moisture feed. This week’s air data already show the pattern: bone-dry afternoons (RH ~30–45%) and soaked nights (RH ≥ 90% for 534 minutes). That is a disease-and-evapotranspiration problem, not a rainfall-total problem. Challenge example #2 (irrigation from soil moisture) **cannot be copied** until soil data exists; an atmospheric proxy (T, RH, wind, radiation → ET and leaf-wetness risk) can.

**Who.** Horticulture around Kiambu / Thika (KALRO Thika is on the same 3D-PAWS network).

**Decision it unblocks.** Irrigate this evening or wait; spray or ventilate overnight because leaf wetness risk is high even when daily rain is 0.4 mm.

**Condition.** Only lead with this if we also fetch the **May 2025–now** CHORDS archive (and optionally Thika). Five dry days are not enough to prove a farm tool.

### P4 — Do not lead with this on the shared file alone: flood / drought early warning

Flood and drought are in the challenge copy and they matter nationally. **This CSV cannot carry them.** 0.4 mm in five days is not a flood signal; five days is not a drought climatology. A national early-warning claim would be unearned and easy for Nderu/Karani to kill.

If Discord or a longer CHORDS pull shows real wet events since May 2025, flood *onset* (gauge 1 tips + pressure/humidity) can become a module under P1. It should not be the headline problem today.

---

## Recommended write-up for Devpost

Use this as the problem statement on the submission (tighten names/numbers once the team is locked):

> Outdoor workers, students, and nearby farmers around JKUAT have a world-class climate station on campus and still decide from the sky. Conduit@Empathy records heat, humidity, rain, wind, and radiation every minute, but those observations are not checked for sensor failure and are not turned into a go/delay/protect decision. In a typical dry week the rain gauges are quiet while afternoon heat and UV and overnight humidity still create exposure and crop-disease risk — and the station can fail silently (a dead gauge, bad health flags). The problem is not missing weather charts. It is the missing last mile from trusted Conduit observations to an action someone takes the same day.

Map to their four questions:

| Question | Answer |
| --- | --- |
| Who? | JKUAT campus users first; Kiambu horticulture and Conduit/AquaTwin operators as the same data product’s other faces |
| What decision? | Whether to go outside / hydrate / expect rain / irrigate or ventilate — and whether to trust the number |
| What action? | Alert + simple recommendation, with a data-quality flag |
| If we don’t? | The sculpture keeps measuring; people keep guessing; satellite calibration keeps eating faults |

---

## Constraints any problem statement must respect

1. Conduit series in this folder is **load-bearing**. If you unplug instrument 61, the insight must break.
2. Do not require soil moisture, vegetation indices, or water quality until they appear in an API we can call.
3. Rain gauge 2 is not a rainfall observation in this file; treat it as a **fault**.
4. Five days is a demo window, not a climate. For trends, use the live CHORDS archive.
5. Judges are the people who built this station. A problem that ignores data quality will look naive. A problem that *only* does data quality will look like it forgot the human.

**Build target:** P1 as the user-facing product, with P2 as the trust layer underneath. P3 only if we ingest longer history. Not P4 as the headline.
