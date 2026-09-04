# Hack The Weather 2026 — Full Challenge Brief

Research compiled 4 September 2026 (EAT) from every public Devpost tab, every resource link, and the linked Conduit / SPACE-SI / JHUB / JKUAT / 3D-PAWS / C3M / UN materials those pages lead to.

**Primary listing:** [https://hack-the-weather.devpost.com/](https://hack-the-weather.devpost.com/)  
**Devpost challenge id:** `31127`  
**Theme:** From Data to Impact: Turning real-world data into solutions that matter  
**Organiser:** JHUB Africa at Jomo Kenyatta University of Agriculture and Technology (JKUAT), Juja, Kiambu, Kenya  
**Format:** Online, public  
**Listed tags:** Machine Learning/AI · Open Ended · Social Good  
**Listed sponsor:** Samsung  
**Contact:** [info.jhub@jkuat.ac.ke](mailto:info.jhub@jkuat.ac.ke) · climate: [climate@jhubafrica.org](mailto:climate@jhubafrica.org)

This folder is for a first-place solution. Read the judging-weight conflict, the Conduit data-availability gap, and the “what actually wins” section before writing code.

---

## 1. Snapshot

| Item | Value |
| --- | --- |
| Dates | 6–9 September 2026 |
| Submissions | 6 Sep 00:00 EAT → 9 Sep 15:00 EAT |
| Judging | 10 Sep 16:30 EAT → 15 Sep 08:00 EAT |
| Winners announced | 16 Sep 11:30 EAT |
| Prize pool | **$300 cash** — three Grand Prize winners at **$100 each** |
| Team size | **2–5** (mandatory) |
| Age (official rules) | **18–35** at the time of the hackathon |
| Must use | Data from **Conduit@Empathy** at JKUAT |
| Must ship | Working prototype / PoC / MVP — not slides |
| Must submit | 3–5 min video + public GitHub + comprehensive README + Devpost fields |
| Listed participants | **47** on 4 Sep 2026 (the count moved during research: 38 then 47) |
| Project gallery | Not published yet |
| Updates | Empty (“stay tuned”) |
| Discussions | One topic: introductory session (2 Sep 2026) |
| Discord (primary channel) | [https://discord.gg/fCjDk3sCp](https://discord.gg/fCjDk3sCp) |

The overview copy still says “a two day coding challenge.” The published schedule is four calendar days of building plus a judging window after that. Treat the **schedule table** as canonical for deadlines.

---

## 2. What every Devpost tab contains

### 2.1 Overview (`/`)

The overview is the marketing brief. Core claim: this is **not** another weather app. The winning idea turns environmental data into intelligence someone can act on.

**Sidebar eligibility (Devpost widget, not the official rules PDF):**

- Above legal age of majority in country of residence
- Students only
- Team required: 2 to 5 members
- Companies / professional organisations excluded
- Only specific countries / territories included

Those five bullets **conflict** with the official rules (see §4). For a first-place run, satisfy **both** where they overlap, and ask organisers on Discord if anything is ambiguous (age vs student-only, country list).

**Narrative:**

Climate change in Kenya is framed as a connected system: droughts, floods, shifting rainfall, environmental degradation, water pressure. Rainfall → water availability → agriculture → soil/vegetation → infrastructure and communities. Lots of sensor and satellite data already exist. The gap is **useful intelligence**.

Suggested problem spaces (you may pick one, combine several, or invent another **as long as Conduit data is used meaningfully**):

1. Understand environmental conditions and trends
2. Detect and respond to climate-related risks
3. Support farmers and agricultural decision-making
4. Improve water-resource management
5. Monitor environmental change
6. Build early-warning and alert systems
7. Improve community resilience
8. Visualise complex environmental information
9. Support better planning and decision-making
10. Create products and services around climate intelligence

**The Conduit (overview description):**

Climate intelligence / environmental technology initiative on JKUAT main campus. Built with **JHUB Africa** and **SPACE-SI** (Slovenian Centre of Excellence for Space Sciences and Technologies). Sensors claimed on the overview:

- Temperature
- Rainfall
- UV radiation
- Soil moisture
- Vegetation conditions
- Water quantity indicators
- Water quality indicators

Purpose of those measurements: calibrate and validate satellite observations and digital models of river-basin ecosystems; understand interactions among **water, soil, vegetation, and infrastructure**.

**Mandatory data platform:** [https://conduit.jhubafrica.com/](https://conduit.jhubafrica.com/)

**Framing they want:** Ground data + satellite data + historical data + AI + human knowledge. Question is not “what does the data say?” but “what can we do with what the data tells us?”

**Who they want on a team:** developer + data scientist + domain expert + designer + product thinker. Disciplines listed: software engineering, CS, data science, AI, IT, geospatial science, environmental science, agriculture, engineering, design, business, research, other.

**People questions they tell you to answer:**

- Who will use this?
- What decision will it help them make?
- What action will it enable?
- What happens if they don’t have it?

**Bonus judging story they name on the overview:** Data → Insight → Action → Impact.

**Useful-resource links on the overview:**

- Conduit: [https://conduit.jhubafrica.com/](https://conduit.jhubafrica.com/)
- SPACE-SI Kenya article: [https://www.space.si/2025/satelitske-in-digitalne-tehnologije-v-podporo-upravljanju-porecij-v-keniji/](https://www.space.si/2025/satelitske-in-digitalne-tehnologije-v-podporo-upravljanju-porecij-v-keniji/)
- JKUAT climate hub page (timed out when fetched; coverage exists via KBC / Kenya News Agency / JHUB): [https://www.jkuat.ac.ke/slovenia-president-inaugurates-climate-hub-at-jkuat/](https://www.jkuat.ac.ke/slovenia-president-inaugurates-climate-hub-at-jkuat/)
- JHUB Africa: [https://jhubafrica.com/](https://jhubafrica.com/)

**Judges listed:** Dr. Lawrence Nderu · Keith Karani · Simon Mwangi

**Overview judging weights (conflict with official rules — see §8):**

| Criterion | Overview % |
| --- | --- |
| Problem & Relevance | 20% |
| Innovation & Creativity | 20% |
| Technical Implementation & Use of Conduit Data | 25% |
| Scalability & Future Potential | 20% |
| Climate, Environmental & Social Impact | 15% |

### 2.2 My projects

No public content. This is the logged-in Devpost area for a team’s own submission. Use it once we register.

### 2.3 Participants (`/participants`)

Login-walled. Public listing showed **47** registered people. Individual names were not readable without a Devpost login.

### 2.4 Resources (`/resources`)

Three blocks:

1. **Conduit@Empathy platform** — required data source  
   - “JKUAT Conduit” → [https://conduit.jhubafrica.com/](https://conduit.jhubafrica.com/)  
   - “JKUAT Conduit API” — labelled as documentation/API. The public Conduit site does **not** expose a `/docs` or `/api` path. Live programmatic access is the **3D-PAWS CHORDS** API used by `model.html` (see §6). After signup on Conduit (`main.php`), teams may also receive a generated API key. Sign up on the site and confirm on Discord what the “JKUAT Conduit API” link is meant to be.

2. **SPACE-SI** — satellite / digital technologies for Kenyan water-resource management  
   - Slovenian original: [https://www.space.si/2025/satelitske-in-digitalne-tehnologije-v-podporo-upravljanju-porecij-v-keniji/](https://www.space.si/2025/satelitske-in-digitalne-tehnologije-v-podporo-upravljanju-porecij-v-keniji/)  
   - English twin: [https://www.space.si/en/2025/rbmkenya/](https://www.space.si/en/2025/rbmkenya/)

3. **Demo and submission tools**  
   - Loom, OBS Studio, YouTube (Unlisted), Google Drive (sharing set so judges can open it)  
   - Video must show the working solution **and** how Conduit data was used

Submission checklist on this page:

- 3–5 minute demonstration video
- GitHub repository link
- Comprehensive README.md
- Project information required by the hackathon
- Clear evidence of meaningful use of Conduit@Empathy data
- Test every link before submitting

### 2.5 Rules (`/rules`)

Full official rules are summarised in §3–§5 and §8–§10. This is the document to treat as **binding** when it disagrees with overview marketing copy.

### 2.6 Project gallery (`/submissions`)

“The hackathon managers haven’t published this gallery yet.” No public prior submissions to study. Submissions were still marked “open soon” on the overview on 4 Sep, while the schedule says they open 6 Sep 00:00 EAT.

### 2.7 Updates (`/updates`)

Empty. Organisers said they will post here **and** email registered participants.

### 2.8 Discussions (`/forum_topics`)

One topic, posted by **Keith Karani** (Manager), about 8 hours before this research on 4 Sep (session itself was **2 September 2026**).

**Hack The Weather 2026 — Introductory Session**  
[https://hack-the-weather.devpost.com/forum_topics/45046-hack-the-weather-2026-introductory-session](https://hack-the-weather.devpost.com/forum_topics/45046-hack-the-weather-2026-introductory-session)

- Time: 10:30 AM EAT, 2 September 2026, online
- Meeting link: [https://discord.gg/fCjDk3sCp](https://discord.gg/fCjDk3sCp)
- Agenda: intro to the hackathon; intro to Conduit@Empathy; JHUB Discord as **primary communication and collaboration channel**; schedule, mentorship, **final submission deadline**; Q&A
- Discord is the live source of truth for schedule changes and mentorship

No other discussion threads were public.

### 2.9 Schedule (`/details/dates`)

| Period | Begins | Ends |
| --- | --- | --- |
| Submissions | 6 Sep 2026, 00:00 EAT | 9 Sep 2026, 15:00 EAT |
| Judging | 10 Sep 2026, 16:30 EAT | 15 Sep 2026, 08:00 EAT |
| Winners announced | — | 16 Sep 2026, 11:30 EAT |

Build window is roughly **87 hours**. Do not plan a late Sunday-afternoon submit.

### 2.10 Register (`/register`)

Standard Devpost signup (GitHub / Facebook / Google / LinkedIn / email). Join URL includes `challenge_id=31127`.

---

## 3. Official rules — eligibility, teams, IP, conduct

Source: [https://hack-the-weather.devpost.com/rules](https://hack-the-weather.devpost.com/rules)

### 3.1 Eligibility (rules §1)

Open to “young climate innovators **aged 18–35**.”

Eligible profiles listed:

- University and TVET students
- Recent graduates
- Developers and technologists
- Data scientists and AI practitioners
- Designers and creative professionals
- Researchers
- Entrepreneurs and aspiring founders
- Environmental and climate innovators
- Young community changemakers

Explicit line: **“Participants do not need to be students or climate specialists to participate.”**

Age: **18–35 at the time of the hackathon.**

**Conflict with overview widget:** overview says students only + specific countries. Rules do not list a country allow-list and explicitly include recent graduates, entrepreneurs, and non-students. Confirm the country list on Discord / with `info.jhub@jkuat.ac.ke` before assuming a teammate outside Kenya is fine.

### 3.2 Teams (rules §2)

- 2–5 people
- One competing team per person
- Every member registered
- One designated Team Lead
- Teams may form before or during the event
- Every member must make a meaningful contribution
- Cross-institution / cross-discipline teams allowed

### 3.3 Development timing (rules §6)

This is a **build** challenge. Substantial work must happen during 6–9 Sep.

Allowed before the start:

- Research the problem
- Explore Conduit
- Learn tools
- Set up environments
- Review public datasets
- Basic project plans or wireframes
- Open-source libraries, frameworks, boilerplate

Not allowed: submitting a pre-existing project without **substantial new development** in the official window, unless organisers explicitly approve.

### 3.4 AI use (rules §7)

AI is allowed: generative AI, coding assistants, ML models, AI APIs. The team must still **understand and explain** architecture, data, and behaviour. Disclose significant AI use if asked. Respect licences and ToS. AI does not excuse inability to explain the work.

### 3.5 IP (rules §16)

Teams keep ownership. Organisers get permission to showcase, document, and promote projects/teams — **not** a transfer of ownership. Third-party IP stays under its own licences.

### 3.6 Responsible tech and conduct (rules §18–19)

No harm, privacy violation, misuse of sensitive data, deliberately misleading information, IP infringement, illegal activity, or unreasonable user risk. Communicate model limitations and uncertainty. Respect people. Harassment / discrimination / IP theft of other teams can get you removed.

### 3.7 Disqualification (rules §20)

Plagiarism; pre-existing project without substantial new work; **failing the Conduit data requirement**; false registration/submission info; unauthorised proprietary data; influencing judges improperly; code-of-conduct breaches; missing mandatory submission items; illegal activity.

### 3.8 Attendance (rules §21)

Expected to participate throughout. Mandatory sessions (as designated): opening briefing, technical orientation, mentorship, team check-ins, final demos, judging. Actual calendar comes through Discord / email.

### 3.9 Rule changes (rules §22)

Organisers may amend. Significant changes go out on official channels. Their interpretation is final.

---

## 4. What you must build

### 4.1 Project requirements (rules §3)

1. Clearly defined real climate / environmental problem
2. **Meaningful use of Conduit@Empathy data**
3. Functional prototype / PoC / MVP
4. Value to a defined user, community, organisation, or other beneficiary

You are **not** required to pick from a preset problem list.

### 4.2 Conduit data requirement (rules §4) — this is how you lose if you ignore it

Use of Conduit@Empathy data is **mandatory**.

**Displaying Conduit data without using it in functionality, analysis, model, decision-making, or output does not count.**

You **may** combine Conduit with:

- Satellite / Earth observation
- Historical weather or environmental data
- Geospatial data
- Public datasets
- Government datasets
- Open APIs
- Other legally accessible datasets

Acknowledge every external source.

The overview’s suggested product types (any of these is valid if Conduit is load-bearing):

- Smart agriculture (crop planning, farm advisory, irrigation, soil moisture, crop stress, agricultural risk, climate-smart tools)
- Water intelligence (availability, drought risk, water quality, catchment, dashboards, community water alerts, planning)
- Early warning (flood, heavy rain, drought, heat, anomalies, location-specific alerts)
- Environmental monitoring (vegetation, land-use, degradation, ecosystem health, conservation, urban environment)
- AI/ML (prediction, anomaly detection, forecasting, environmental assistants, NL interfaces, recommendations, automated reports)
- Visualisation / decision intelligence (dashboards, maps, visual analytics, decision-support, data storytelling, community tools)
- Community / public-facing apps for farmers, students, researchers, communities, businesses, policymakers, NGOs, water managers

**Explicit anti-pattern:** “another application that simply displays temperature and rainfall.”

Two worked examples they published:

1. Environmental data → AI/analytics → abnormal rainfall → flood prediction → notify communities → earlier action  
2. Weather + soil moisture → ML → crop water requirement → irrigation timing → less water, more yield

### 4.3 Prototype (rules §8)

Must demonstrate **core functionality**. Static decks, mock-ups, and concept-only work are **not enough**.

Acceptable forms: live web app, mobile app, interactive prototype, data dashboard, AI/ML model, API, GIS app, IoT demo, other functional tech prototype.

### 4.4 Technologies they named (not required)

AI, ML, data science, Python, JS/TS, web, mobile, cloud, APIs, geospatial/GIS, satellite/EO, visualisation, IoT, digital twins, predictive analytics. Pick the stack that solves the problem.

---

## 5. Submission spec (treat as a checklist)

Every submission goes through Devpost before the published deadline.

### 5.1 Mandatory artefacts (rules §13)

| Requirement | Mandatory |
| --- | --- |
| Demonstration video | Yes |
| GitHub repository | Yes |
| Comprehensive README.md | Yes |
| Meaningful use of Conduit data | Yes |
| Working prototype | Yes |
| Devpost project information | Yes |

Missing any of these can make the project ineligible.

### 5.2 Video (rules §9.1)

- **3–5 minutes** (hard bounds)
- Shows the solution **running**
- Accessible without a paid account
- Audio clear enough to follow
- Link tested; stays live through judging
- Screen recording + voice-over is fine
- Production quality is **not** a criterion
- **All team members must appear in the video**

Cover:

1. Problem and who is affected
2. What you built and how it works
3. How Conduit@Empathy data is used
4. Key features / demo
5. Main technologies
6. Expected impact
7. Post-hackathon development

Tools they recommend: Loom, OBS, Google Meet, YouTube Unlisted, Drive with judge-accessible sharing.

### 5.3 GitHub (rules §10)

- Accessible to judges (public preferred; private only with organiser approval before deadline)
- Source + relevant files
- Comprehensive README
- Technologies and frameworks identified
- Significant libraries, APIs, datasets, models identified
- **Conduit data used, identified**
- Attribution and licences
- The repo at deadline is the judged artefact; later commits may be ignored
- Commit regularly
- **Do not commit secrets**

### 5.4 README must include (rules §11)

Project name · problem statement · solution · Conduit data (which data, where used, how processed, how it contributes) · features · tech stack · architecture · install/setup · usage · data sources · AI usage · screenshots/demo · team · future development · licence.

Judges should understand the project **without reading the source first**.

### 5.5 Devpost form fields (rules §12)

Project name · team members · problem statement · solution description · Conduit data used · technologies · expected impact · future development · video link · GitHub link.

---

## 6. Conduit@Empathy — what it is, and what data you can actually get

### 6.1 Physical installation

Inaugurated **2 June 2025** at JKUAT (Juja, Kiambu) by **H.E. Dr. Nataša Pirc Musar**, President of Slovenia, on the first Slovenian presidential visit to Kenya (invitation of H.E. Dr. William Samoei Ruto).

- **Name:** Conduit@Empathy (also Conduit@Empathy1 / Conduit@Emphaty1 in SPACE-SI copy; CHORDS instrument name misspells it **Conduti@Empathy1**)
- **Form:** ~6-metre sculptural / “smart art” climate-intelligence hub
- **Artist:** Eva Petrič
- **Partners:** JHUB Africa, SPACE-SI, University of Ljubljana, C3M (Centre for Computational Continuum Mechanics)
- **Funding:** Republic of Slovenia via **CMSR** (Centre for International Cooperation and Development). Related procurement for “support for river-basin management in Kenya via satellite technology and digital models” was awarded at **€603,375** (contract 18 Dec 2023) to SPACE-SI and C3M.
- **Theme of the launch:** “Translating Policy into Practice: Slovenia and Kenya Empowering Communities, Protecting Ecosystems, Fostering Peace.”
- **Role:** ground-truth station to **calibrate satellite measurements** and **C3M digital-twin models**; public-facing symbol that climate data should be human, not only technical.

Kenya News Agency notes sensors **above and below the soil surface** for moisture. SPACE-SI also lists soil moisture, vegetation state, water quantity and quality. **Those extra parameters are advertised. They are not in the public 3D-PAWS stream today.** See §6.4.

### 6.2 Public Conduit website

[https://conduit.jhubafrica.com/](https://conduit.jhubafrica.com/) — branded **JHUB Weather Station / JHUB AFRICA TWIN MODELS**.

Pages:

| Path | What it is |
| --- | --- |
| `/` | Marketing + sensor docs + site gallery (19 photos) + **Get Data** auth modal |
| `/model.html` | Live twin-model dashboard: Three.js GLB of JKUAT campus (`jkuat2.glb`) + Chart.js gauges pulling **live CHORDS GeoJSON** |
| `main.php` | Login / signup POST target (signup issues a 20-char API key generated in-page) |
| `reset_password.php` | Password reset |

Get Data opens login/signup (email, password, phone, organisation). Signup stores a client-generated `apikey`. There is no public `/docs` or `/api` on this host (404).

Site documentation for live sensors (matches CHORDS variables):

**Precipitation (mm):** dual rain gauges; instantaneous; total today (midnight–now); total prior.

**Temperature (°C):** BMX, MCP, SHT, wet bulb, WBGT (heat-stress composite: temp + humidity + wind + sun).

**Wind:** speed (m/s), direction (°), gust (m/s), gust direction (°).

**Solar (SI1145):** visible, infrared, ultraviolet (unitless counts).

**Air pressure:** BMX, hPa.

**Humidity:** SHT relative humidity (%). CHORDS metadata wrongly tags `sh1` as `degC` / “Temperature”. The Conduit site and live values (e.g. 75.7) are humidity percent.

### 6.3 The live data pipe (this is the Conduit data you can code against today)

The station is a **3D-PAWS** (3D-Printed Automated Weather Station) on the **FEWSNET CHORDS** portal run by NCAR/RAL.

| Field | Value |
| --- | --- |
| Portal | [https://3d-fewsnet.icdp.ucar.edu/](https://3d-fewsnet.icdp.ucar.edu/) |
| Instrument | Kenya Kiambu JKUAT IOT AWS - Conduti@Empathy1 |
| Instrument / sensor id | **61** |
| Site | Site JKUAT, site id **62** |
| Coordinates | **37.014528 E, 1.099736 S** (GeoJSON order: lon, lat, elev) |
| Elevation | **1523.0 m** |
| Status | ACTIVE |
| Cadence | one report every **900 seconds** (15 min) |
| First measurement | **2025-05-30 10:18:54 UTC** |
| Last sample seen in this research | **2026-09-04 06:33:49 UTC** (~15 months of archive) |
| Measurement count on instrument page | ~15.5 million (portal aggregate; CSV “last” returns the latest timestamp’s 24 values) |

CHORDS is NSF EarthCube software. Cite if used in a paper: Daniels et al. (2014), DOI [https://doi.org/10.5065/D6V1236Q](https://doi.org/10.5065/D6V1236Q).

**Download patterns** (instrument 61):

- Last point GeoJSON: `https://3d-fewsnet.icdp.ucar.edu/api/v1/data/61.geojson?last`
- Range GeoJSON: `.../61.geojson?start=ISO8601&end=ISO8601`
- CSV equivalents: `.../61.csv?last` or with `start` / `end`
- Older style: `/instruments/61.csv` etc.

The official dashboard (`model.html`) calls the GeoJSON `last` endpoint **with a Kenya Met 3D-PAWS `email` + `api_key` query string that is hardcoded in the page JavaScript.** Do not copy those credentials into git. Read them from the live page if a request is rejected without auth. If the portal allows unauthenticated `?last` / date-range pulls, prefer that.

**Example live observation (4 Sep 2026, 06:33 UTC ≈ 09:33 EAT):**

| Short | Name | Value | Unit |
| --- | --- | --- | --- |
| hth | Health | 0 | # |
| bcs | Battery charge status | 3 | # |
| css | Cell signal strength | 100 | % |
| bv | Battery voltage | *(empty in this sample)* | % |
| rg / rg2 | Rain gauges | 0 / 0 | mm |
| rgt / rgt2 | Rain total today | 0 / 0 | mm |
| rgp / rgp2 | Rain total prior | 0 / 0 | mm |
| bt1 | BMX temperature | 16.6 | °C |
| mt1 | MCP temperature | 16.9 | °C |
| st1 | SHT temperature | 17.2 | °C |
| sh1 | SHT humidity | 75.7 | % (mislabeled degC in CHORDS) |
| bp1 | BMX pressure | 852.8 | hPa |
| sv1 / si1 / su1 | Visible / IR / UV | 391 / 1789 / 0.7 | counts |
| ws / wd | Wind speed / dir | 0 / 281 | m/s, deg |
| wg / wgd | Gust / gust dir | 0 / 0 | m/s, deg |
| hi | Heat index | 17.1 | # |
| wbt | Wet bulb | 14.4 | °C |
| wbgt | Wet bulb globe temp | 12.9 | °C |

`model.html` currently maps: `wbgt`→temperature gauge, `bp1`→pressure, `sh1`→humidity, `ws`→wind, plus heat index, gust, IR, UV, timestamp.

### 6.4 Advertised vs actually streaming — critical for the product

| Parameter | Claimed by Devpost / SPACE-SI / KNA | In public CHORDS id 61 |
| --- | --- | --- |
| Temperature | Yes | Yes (3 sensors + derived) |
| Rainfall | Yes | Yes (dual gauges) |
| UV | Yes | Yes (SI1145) |
| Humidity / pressure / wind | Implied by station | Yes |
| Heat / WBGT | Implied | Yes |
| Soil moisture | Yes (overview + SPACE-SI + KNA subsurface sensors) | **No** |
| Vegetation conditions | Yes | **No** |
| Water quantity | Yes | **No** |
| Water quality | Yes | **No** |

Keith Karani (Software Engineer, JHUB; also a listed judge and Devpost manager) described internally (May intern briefing) a “JHUB Conduit” 3D-FEWSNET network with atmospheric, **soil**, **hydrology**, and **multispectral** telemetry, Golang realtime APIs, WBGT, soil-saturation matrices, webhooks for smart-farm misting, and a public developer portal. That stack is **not** the public Conduit homepage. Treat soil / hydrology / vegetation as **either coming via the login-gated Conduit API, or as satellite/EO layers you fuse with the AWS**. Confirm on Discord on day one: *“Are soil moisture, vegetation, and water-quality series available to hackathon teams, and from which API?”*

If they are not, a first-place team still satisfies the Conduit rule by using the **live AWS (id 61)** as the mandatory ground truth, then adding Sentinel / CHIRPS / Open-Meteo / NDMA / FEWSNET siblings — which the rules explicitly allow.

### 6.5 The rest of the Kenya 3D-PAWS network (legal extra data)

The same CHORDS portal hosts **~75 instruments**, mostly Kenya Met / KALRO / airport / irrigation / ASALs. Combining JKUAT (Kiambu highlands, 1523 m) with stations in Wajir, Garissa, Mandera, Turkana, Narok, Kitui, etc. is a legitimate “additional dataset” and is how you tell a **local campus station** from a **national climate-intelligence product**.

Nearby / thematically useful examples: KALRO Thika (id 10), Kitui, Makindu, Narok, Wajir Airport, Garissa, Mandera Elwak, Amboseli, Lower Kuja Irrigation Scheme.

CHORDS docs: [https://earthcubeprojects-chords.github.io/chords-docs/usingchords/](https://earthcubeprojects-chords.github.io/chords-docs/usingchords/)  
Instrument 61 data URLs: [https://3d-fewsnet.icdp.ucar.edu/about/data_urls?instrument_id=61](https://3d-fewsnet.icdp.ucar.edu/about/data_urls?instrument_id=61)

---

## 7. Broader Conduit / AquaTwin / satellite context (the “beyond ground sensors” brief)

This is what judges mean by Ground + Satellite + Historical + AI + Human knowledge.

### 7.1 AquaTwin

JHUB’s digital-twin programme for Kenyan **trans-boundary river basins**. Virtual replicas of basins, fed by satellite + ground data, for water flow, quality, use, flood, ecosystem stress.

- JHUB page: [https://jhubafrica.com/enhancing-trans-boundary-river-basin-management-in-kenya/](https://jhubafrica.com/enhancing-trans-boundary-river-basin-management-in-kenya/)
- Launch write-up: [https://jhubafrica.com/climate-convergence-slovenia-kenya-summit-launches-groundbreaking-climate-intelligence-hub/](https://jhubafrica.com/climate-convergence-slovenia-kenya-summit-launches-groundbreaking-climate-intelligence-hub/)
- Dr. Lawrence Nderu (21 Oct 2024): [The Power of Digital Twin Models — River Basin Management in Kenya](https://www.linkedin.com/pulse/power-digital-twin-models-river-basin-management-kenya-nderu-llclf)

Named water bodies: **Lake Victoria, Lake Turkana, Omo, Mara, Lumi, Dawa**. Pilot focus also named **Kajiado County**. Pilot ecosystem types: mountains, floodplains, degraded reservoirs. Kenya context they cite: **~85% of land arid or semi-arid**; agriculture-dependent population; climate extremes.

JKUAT scientific team named by Nderu: Dr. Lawrence Nderu, Prof. Naomi Wangari Njogu Maina, Prof. John Mwangi Gathenya, Dr. Mercy W. Mwaniki, with University of Ljubljana colleagues. Launch demo: **Dr. Tomaž Rodič** (SPACE-SI director) + Dr. Nderu.

Related JHUB innovation on the same pillar: **Twinsight AI** — IoT + satellite + ML digital twin for prediction (portfolio listing).

### 7.2 SPACE-SI and NEMO-HD

[https://www.space.si/en/](https://www.space.si/en/) · microsatellite: [https://www.space.si/en/microsatellite/](https://www.space.si/en/microsatellite/)

- First Slovenian microsatellite; launched **3 Sep 2020** on Vega from French Guiana; ~520 km SSO
- **2.8 m** PAN GSD, **5.6 m** multispectral; 4 bands (420–520, 535–607, 634–686, 750–960 nm)
- HD realtime video 1920×1080
- Ground: STREAM stations (Axyom / Stream); processing chain **STORM**
- Applications they name: smart cities, river basins, maritime, forests, agriculture, droughts, floods, invasive plants
- Prior European demos: Soča, Sava, Drina, Danube (Nemo-RBS / ESA Future EO)

Kenya article (EN): Conduit@Empathy1 measurements **calibrate SPACE-SI satellite measurements and C3M digital-twin predictions**, and explain water–soil–vegetation–infrastructure physics under climate change.

### 7.3 C3M

[https://www.c3m.si/](https://www.c3m.si/) — Ljubljana FEM / inverse-modelling / multi-scale (“M5”) company. They are the numerical-twin engine beside SPACE-SI’s satellite layer. Not a public hackathon API; context for “digital twin” language in the brief.

### 7.4 UN partnership (SPACE-SI river-basin twins)

[https://sdgs.un.org/partnerships/satellite-data-and-digital-twin-models-support-river-basin-management](https://sdgs.un.org/partnerships/satellite-data-and-digital-twin-models-support-river-basin-management) (`#SDGAction50361`)

SDGs they map: **6** (water), **13** (climate), **15** (land), **17** (partnerships). Global river-twinning programme (Europe, India/Ganga, ambition of ~22 twins 2023–2028). Kenya is the African transfer of that stack. CMSR tender text specifically mentions watching **trans-boundary effects of the Omo dam in Ethiopia** on Kenyan water, energy, and biosphere.

### 7.5 Launch-day ecosystem (who cares, who might adopt)

Panel “One Climate, One Future” (2 Jun 2025), moderator Mercy Juma Okande (WFP Kenya):

- HE Dr. Maalim Mohamud — Deputy Governor, Mandera (ASAL local government)
- Mirey Atallah — UNEP-WCMC Adaptation & Resilience
- Henriette Geiger — EU Ambassador to Kenya (€72bn climate-action framing)
- Lauren Landis — WFP Kenya (Smart Nyuki / beekeeping in Wajir, Mandera)
- Dr. Stephen Jackson — UN Resident Coordinator Kenya

Also present: CS Deborah Barasa (Environment); PS Beatrice Inyangala (Higher Education); Kiambu Governor Kimani Wamatangi; Kiambu Woman Rep Anne Wamuratha; JKUAT VC Prof. Victoria Wambui Ngumi.

Launch exhibits: Smart Nyuki (WFP + JHUB) and AquaTwin. Follow-on JHUB work with Yatta Beekeepers (IoT hive humidity/temp/acoustics). Northern Kenya agricultural EO tools and Wajir/Samburu livelihoods were named as Conduit-adjacent programmes.

### 7.6 Press (same event, extra facts)

- KBC: [Slovenia President inaugurates climate hub at JKUAT](https://www.kbc.co.ke/slovenia-president-natasa-pirc-musar-inaugurates-climate-hub-at-jkuat/)
- Kenya News Agency: [President of Slovenia launches Strategic Environmental Satellite facility at JKUAT](https://www.kenyanews.go.ke/president-of-slovenia-launches-strategic-environmental-satellite-facility-at-jkuat/)
- The Star: [JKUAT gets new digital climate hub](https://www.the-star.co.ke/climate-change/2025-06-03-jkuat-gets-new-digital-climate-hub)
- JHUB Innovatech June 2025: [LinkedIn newsletter](https://www.linkedin.com/pulse/jhub-africa-innovatech-newsletter-june-2025-jhubafrica-3f5hf)

Useful quotes for a pitch (not for stuffing the README): Musar — “There is only one Earth…”; Inyangala — make data accessible, infuse science with human meaning; Ngumi — “Science must help society.”

---

## 8. Judging — two published scorecards

**Use the official rules table for optimisation.** Flag the overview mismatch in case organisers clarify on Discord.

### 8.1 Official rules (rules §14) — 100 points

| Criterion | Weight | What they score |
| --- | --- | --- |
| Problem and Relevance | **20%** | Clarity, significance, users/beneficiaries, evidence it is worth solving |
| Innovation and Creativity | **20%** | Originality, creative approach, innovative use of tech/data, **differentiation from existing approaches** |
| Technical Implementation and Use of Data | **25%** | Prototype works; quality; **meaningful Conduit use**; extra data/tech used well; team understands the implementation |
| Climate, Environmental, and Social Impact | **25%** | Climate/environment contribution; benefits to people/orgs/ecosystems; clarity of impact; translating data into **action** |
| Scalability and Future Potential | **10%** | Further development, deployment feasibility, adoption/research/venture, expansion beyond first use case |

Rules total: **impact 25% + implementation 25%** dominate. Scalability is only 10% here.

### 8.2 Overview / Devpost judging-criteria widget

| Criterion | Weight |
| --- | --- |
| Problem & Relevance | 20% |
| Innovation & Creativity | 20% |
| Technical Implementation & Use of **Conduit Data** | 25% |
| Scalability & Future Potential | **20%** |
| Climate, Environmental & Social Impact | **15%** |

Overview puts more weight on scale and less on impact. Overview also lists a **bonus**: the Data → Insight → Action → Impact story. Build that story regardless of which table they actually use.

### 8.3 How judging happens (rules §15)

Judges use Devpost + video + GitHub + README. They may ask questions in a final session. They will **not** debug or deploy your app. If the demo link is down, you lose. Decision is final.

### 8.4 The three judges (public identities)

Listed on Devpost as the judging panel. They are also the organising house — design for **people who already know Conduit**.

**Dr. Lawrence Nderu**  
Chair, Department of Computing, JKUAT. Founder/Director, JHUB Africa. Co-founder, gDIH (Konza). PhD Computer Science, University of Paris VIII; MSc Software Engineering and BSc Maths & CS, JKUAT. AI/ML, data science, software engineering. Co-presented AquaTwin at the presidential launch. Will notice shallow “weather dashboard” work and will notice a real data→decision chain.

Profile: [https://evi4devconference.org/speakers/dr-lawrence-nderu](https://evi4devconference.org/speakers/dr-lawrence-nderu) · [LinkedIn](https://www.linkedin.com/in/dr-lawrence-nderu)

**Keith Karani**  
Software Engineer, JHUB Africa. Devpost **Manager** for this hackathon (posted the intro-session thread). Briefed interns on Conduit/3D-FEWSNET architecture (Golang microservices, WBGT, soil matrices, webhooks, developer portal). Will notice fake APIs, unused Conduit calls, and sloppy engineering.

[LinkedIn](https://www.linkedin.com/in/keith-karani-3794041a4)

**Simon Mwangi**  
Hub Manager, JHUB Africa (MBA). Coaches teams to pitch like an investor: clear problem, evidence, sustainability. Will notice a missing user and a missing “what happens on Monday if this exists.”

### 8.5 Prizes (overview)

- **$300** total cash
- **Hack the Weather 2026 Grand Prize:** **$100 × 3 winners**
- Non-cash: mentorship; possible incubation / piloting; swag; exposure to industry / climate stakeholders
- Sponsor named: **Samsung** (JHUB also runs a Samsung Innovation Campus at JKUAT — related ecosystem, not described as a separate prize track)

Cash is small. The real prize they sell is **pathway after the weekend** (incubation, piloting, JHUB). Scalability/impact writing should sound like a post-hackathon plan, not a unicorn deck.

---

## 9. JHUB Africa — organiser context

[https://jhubafrica.com/](https://jhubafrica.com/)

Innovation hub at JKUAT. Climate-tech / agri / digital-trade positioning. Focus areas: Climate Smart Agriculture · Digital Twin Models · Green Digital Innovation · Digital Trade · Digital Transformation.

Role in this hackathon: bridge research, technology, and entrepreneurship; Conduit as the local sensing + twin + satellite node; pathway from prototype toward application.

Portfolio (relevant neighbours, not competitors you must beat on Devpost): AquaTwin, Twinsight AI, Smart Nyuki, GeoPasture, FarmBotika, PolluWatch, AfriData, UtoScope, GreenGrid, EcoWarriors, AgriQuest, and many health/cyber projects. A winning hackathon project should **not** clone AquaTwin’s landing page. It should sit **on Conduit data** and do a job AquaTwin does not yet do for a named user (e.g. heat-health on campus, farmer irrigation timing in Kiambu, flood nowcast that actually notifies, ASAL drought that fuses JKUAT calibration with Wajir/Garissa 3D-PAWS).

---

## 10. What a first-place submission has to prove

This is inferred from the published criteria, the anti-weather-app line, and who is judging. It is not a product spec.

1. **Named user, named decision.** Not “anyone who cares about climate.” A farmer, a campus estates office, a county water officer, a WFP field team, a beekeeper, a student heat-risk officer — with a decision they make this week.
2. **Conduit is load-bearing.** If you unplug instrument 61, the insight breaks. A map that merely overlays JKUAT temperature fails the rule.
3. **Data → insight → action → impact** is visible in the video in under five minutes, with all teammates on camera.
4. **Prototype runs without the judges SSH’ing in.** Hosted demo + README that clones and runs.
5. **Something extra fused in:** another 3D-PAWS site, Sentinel-2 / CHIRPS / Open-Meteo / NDMA, or a simple model (anomaly, nowcast, irrigation advice, heat-index alert). Rules invite this; overview calls it the point.
6. **Honest about missing soil/water/veg series** unless Discord confirms they exist. Use rainfall + WBGT + humidity + radiation that *are* live; pull vegetation/soil from EO if needed; say so in the README.
7. **Impact is local and plausible.** Kenya drought/flood/ag/water story from the brief. Quantify who is helped. Do not claim national early warning you cannot operate.
8. **After-hackathon path** that matches JHUB (pilot with a campus farm, county, or Conduit calibration use-case). Scalability is 10–20% of the score, not 0%.
9. **Differentiated from a dashboard.** The overview’s own flood and irrigation examples both **notify or recommend**, they do not only chart.

### 10.1 Suggested README/video spine (maps onto their required sections)

Problem (who, evidence) → Conduit variables used (shortnames) → processing → extra datasets → the decision the UI produces → live demo → limits/uncertainty → 90-day build-next.

---

## 11. Operational calendar for this folder

| When | What |
| --- | --- |
| Now–5 Sep | Register on Devpost; join Discord; sign up on Conduit; pull CHORDS 61 history; confirm soil/water/veg availability |
| 6 Sep 00:00 EAT | Submissions open; official build starts |
| 6–9 Sep | Substantial development; mentorship / check-ins (watch Discord) |
| **9 Sep 15:00 EAT** | **Hard submit** — video, GitHub, README, Devpost fields frozen |
| 10–15 Sep | Judging (possibly live questions) |
| 16 Sep 11:30 EAT | Winners |

Pre-hackathon is for research, wireframes, env setup, dataset review — not a finished product.

---

## 12. Source index

### Devpost

- Overview: [https://hack-the-weather.devpost.com/](https://hack-the-weather.devpost.com/)
- Rules: [https://hack-the-weather.devpost.com/rules](https://hack-the-weather.devpost.com/rules)
- Resources: [https://hack-the-weather.devpost.com/resources](https://hack-the-weather.devpost.com/resources)
- Participants: [https://hack-the-weather.devpost.com/participants](https://hack-the-weather.devpost.com/participants)
- Gallery: [https://hack-the-weather.devpost.com/submissions](https://hack-the-weather.devpost.com/submissions)
- Updates: [https://hack-the-weather.devpost.com/updates](https://hack-the-weather.devpost.com/updates)
- Discussions: [https://hack-the-weather.devpost.com/forum_topics](https://hack-the-weather.devpost.com/forum_topics)
- Intro session: [https://hack-the-weather.devpost.com/forum_topics/45046-hack-the-weather-2026-introductory-session](https://hack-the-weather.devpost.com/forum_topics/45046-hack-the-weather-2026-introductory-session)
- Schedule: [https://hack-the-weather.devpost.com/details/dates](https://hack-the-weather.devpost.com/details/dates)
- Register: [https://hack-the-weather.devpost.com/register](https://hack-the-weather.devpost.com/register)

### Conduit / data

- Conduit site: [https://conduit.jhubafrica.com/](https://conduit.jhubafrica.com/)
- Twin dashboard: [https://conduit.jhubafrica.com/model.html](https://conduit.jhubafrica.com/model.html)
- CHORDS instrument 61: [https://3d-fewsnet.icdp.ucar.edu/instruments/61](https://3d-fewsnet.icdp.ucar.edu/instruments/61)
- CHORDS site 62: [https://3d-fewsnet.icdp.ucar.edu/sites/62](https://3d-fewsnet.icdp.ucar.edu/sites/62)
- CHORDS data URLs: [https://3d-fewsnet.icdp.ucar.edu/about/data_urls?instrument_id=61](https://3d-fewsnet.icdp.ucar.edu/about/data_urls?instrument_id=61)
- CHORDS about: [https://3d-fewsnet.icdp.ucar.edu/about](https://3d-fewsnet.icdp.ucar.edu/about)
- CHORDS usage docs: [https://earthcubeprojects-chords.github.io/chords-docs/usingchords/](https://earthcubeprojects-chords.github.io/chords-docs/usingchords/)

### Partners and background

- JHUB: [https://jhubafrica.com/](https://jhubafrica.com/)
- Innovations: [https://jhubafrica.com/innovations/](https://jhubafrica.com/innovations/)
- Climate Convergence launch: [https://jhubafrica.com/climate-convergence-slovenia-kenya-summit-launches-groundbreaking-climate-intelligence-hub/](https://jhubafrica.com/climate-convergence-slovenia-kenya-summit-launches-groundbreaking-climate-intelligence-hub/)
- AquaTwin: [https://jhubafrica.com/enhancing-trans-boundary-river-basin-management-in-kenya/](https://jhubafrica.com/enhancing-trans-boundary-river-basin-management-in-kenya/)
- SPACE-SI Kenya (SL): [https://www.space.si/2025/satelitske-in-digitalne-tehnologije-v-podporo-upravljanju-porecij-v-keniji/](https://www.space.si/2025/satelitske-in-digitalne-tehnologije-v-podporo-upravljanju-porecij-v-keniji/)
- SPACE-SI Kenya (EN): [https://www.space.si/en/2025/rbmkenya/](https://www.space.si/en/2025/rbmkenya/)
- SPACE-SI home: [https://www.space.si/en/](https://www.space.si/en/)
- NEMO-HD: [https://www.space.si/en/microsatellite/](https://www.space.si/en/microsatellite/)
- C3M: [https://www.c3m.si/](https://www.c3m.si/)
- UN SDG partnership: [https://sdgs.un.org/partnerships/satellite-data-and-digital-twin-models-support-river-basin-management](https://sdgs.un.org/partnerships/satellite-data-and-digital-twin-models-support-river-basin-management)
- KBC: [https://www.kbc.co.ke/slovenia-president-natasa-pirc-musar-inaugurates-climate-hub-at-jkuat/](https://www.kbc.co.ke/slovenia-president-natasa-pirc-musar-inaugurates-climate-hub-at-jkuat/)
- Kenya News Agency: [https://www.kenyanews.go.ke/president-of-slovenia-launches-strategic-environmental-satellite-facility-at-jkuat/](https://www.kenyanews.go.ke/president-of-slovenia-launches-strategic-environmental-satellite-facility-at-jkuat/)
- Discord: [https://discord.gg/fCjDk3sCp](https://discord.gg/fCjDk3sCp)

---

## 13. Gaps — not available from public pages on 4 Sep 2026

- **Eligible country list** (overview says “specific countries”; rules do not list them)
- **Logged-in participants** (names, schools, team formation)
- **Exact href** of “JKUAT Conduit API” on the resources page (no public `/api` on conduit.jhubafrica.com)
- **Soil / vegetation / water-quality APIs** (claimed, not in CHORDS 61)
- **JKUAT official inauguration HTML** (URL listed, fetch timed out; facts recovered from KBC, KNA, JHUB, SPACE-SI)
- **Updates, gallery, extra forum threads** — empty / unpublished
- **Mentorship timetable, mandatory session times, submission field-by-field Devpost form** — promised via Discord/email
- **Judge bios on Devpost** — names only; bios reconstructed from JHUB/LinkedIn/conference pages
- **Samsung prize mechanics** — logo only; no separate Samsung challenge text
- **Discord internals** — invite only; session on 2 Sep already happened

Re-check Discord and Devpost Updates on 6 Sep before locking the product bet.

---

## 14. Conflicts to resolve with organisers (short)

1. Overview: students only vs rules: 18–35 including graduates and founders.  
2. Overview: country allow-list vs rules: no country list.  
3. Overview judging: impact 15% / scale 20% vs rules: impact 25% / scale 10%.  
4. Overview: soil/veg/water sensors vs live CHORDS: weather/radiation/heat only.  
5. Overview: “two day” vs schedule: 6–9 Sep + judging through 15 Sep.

Until answered, comply with the **stricter** reading: team of students (or 18–35 if they confirm), Conduit AWS data actually used in a decision, working prototype by **9 Sep 15:00 EAT**, video with **every teammate visible**.
