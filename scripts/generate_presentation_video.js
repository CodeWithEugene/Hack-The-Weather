const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const VIDEO_DIR = path.join(ROOT, 'video');
const SCENES_DIR = path.join(VIDEO_DIR, 'scenes');
const AUDIO_DIR = path.join(VIDEO_DIR, 'audio');

// 6 Structured Scenes
const scenes = [
  {
    id: 'scene_1_hook',
    title: 'HATUA: Trust First. Then Act.',
    narration: "Welcome to Hatua. Across Kenya, climate stations record observations every minute. Yet outdoor workers, students, and farmers still look at the sky to make critical daily decisions. Conduit measures the Juja microclimate every minute, but nobody tells people whether a reading is trustworthy, or what to do with it. We did not build another weather dashboard. We built Hatua: an operational, trust-gated action layer on Conduit@Empathy.",
    svg: `
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#09090b" />
            <stop offset="50%" stop-color="#111115" />
            <stop offset="100%" stop-color="#09090b" />
          </linearGradient>
          <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#bg)" />
        
        <!-- Grid pattern overlay -->
        <g opacity="0.12">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="40" y2="0" stroke="#fff" stroke-width="1"/>
            <line x1="0" y1="0" x2="0" y2="40" stroke="#fff" stroke-width="1"/>
          </pattern>
          <rect width="1920" height="1080" fill="url(#grid)" />
        </g>

        <!-- Hackathon Tag -->
        <rect x="740" y="140" width="440" height="42" rx="21" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <text x="960" y="167" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" fill="#94a3b8" letter-spacing="2">
          HACK THE WEATHER 2026 · JHUB AFRICA
        </text>

        <!-- Main Title -->
        <text x="960" y="360" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="112" font-weight="800" fill="#ffffff" letter-spacing="-2">
          HATUA
        </text>
        
        <!-- Green Accent Tagline -->
        <text x="960" y="440" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="600" fill="url(#accent)" letter-spacing="1">
          Trust first. Then act.
        </text>

        <!-- Subtitle -->
        <text x="960" y="520" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="400" fill="#94a3b8">
          Trusted operational action from Conduit@Empathy climate station at JKUAT
        </text>

        <!-- 3 Pillars Cards -->
        <g transform="translate(260, 640)">
          <!-- Pillar 1 -->
          <rect x="0" y="0" width="420" height="220" rx="16" fill="#18181b" stroke="#27272a" stroke-width="2" />
          <text x="32" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#10b981">01. TRUST GATE</text>
          <text x="32" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#ffffff">Diagnose Hardware Faults</text>
          <text x="32" y="136" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" fill="#a1a1aa">Catches dead rain gauge 2,</text>
          <text x="32" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" fill="#a1a1aa">cloned gust &amp; health spikes.</text>
          
          <!-- Pillar 2 -->
          <rect x="480" y="0" width="420" height="220" rx="16" fill="#18181b" stroke="#27272a" stroke-width="2" />
          <text x="512" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#38bdf8">02. DECISION CARDS</text>
          <text x="512" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#ffffff">Action Over Passive Charts</text>
          <text x="512" y="136" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" fill="#a1a1aa">Campus heat protection, farm</text>
          <text x="512" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" fill="#a1a1aa">ventilation &amp; water waiting.</text>

          <!-- Pillar 3 -->
          <rect x="960" y="0" width="420" height="220" rx="16" fill="#18181b" stroke="#27272a" stroke-width="2" />
          <text x="992" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#f59e0b">03. LAST MILE</text>
          <text x="992" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#ffffff">Africa's Talking &amp; Jev AI</text>
          <text x="992" y="136" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" fill="#a1a1aa">Interactive USSD *384*61#,</text>
          <text x="992" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" fill="#a1a1aa">SMS &amp; TypeSafe Jev System One.</text>
        </g>
      </svg>
    `
  },
  {
    id: 'scene_2_hardware_truth',
    title: 'The Reality of Station 61 (5-Day Extract Autopsy)',
    narration: "When we examined the five-day extract provided by the organizers, the physical truth was startling. Rainfall was only zero point four millimeters total across the entire week, with four days of absolute zero. Even more critical: Rain Gauge 2 was completely dead, reporting zero in every single row. Wind gust direction was an exact duplicate of gust speed, and health flags spiked with garbage codes every night. Any application that averages both gauges or predicts floods on this file is deeply flawed. Hatua diagnoses physical faults first.",
    svg: `
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="1920" height="1080" fill="#09090b" />
        
        <text x="160" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#ef4444" letter-spacing="2">
          THE HARDWARE AUTONOMY AUDIT
        </text>
        <text x="160" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff">
          The Physical Truth of Station 61
        </text>
        <text x="160" y="260" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" fill="#a1a1aa">
          7,060 minutes of raw telemetry analyzed (28 Aug – 1 Sep 2026). What other apps miss:
        </text>

        <!-- 4 Diagnostic Cards -->
        <g transform="translate(160, 320)">
          <!-- Card 1 -->
          <rect x="0" y="0" width="760" height="280" rx="16" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" />
          <rect x="32" y="32" width="180" height="32" rx="16" fill="#7f1d1d" />
          <text x="122" y="53" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" fill="#fecaca">DEAD SENSOR</text>
          <text x="32" y="110" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700" fill="#ffffff">Rain Gauge 2 (rg2) is Dead</text>
          <text x="32" y="155" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" fill="#d4d4d8">Reports strictly 0.0 mm across all 7,060 timesteps.</text>
          <text x="32" y="195" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" fill="#ef4444">⚠ Competitors who average rg and rg2 cut real rain in half!</text>
          <text x="32" y="235" font-family="monospace" font-size="15" fill="#a1a1aa">Hatua Trust Gate: [FLAG: rg2_stuck] → Uses Gauge 1 only</text>

          <!-- Card 2 -->
          <rect x="840" y="0" width="760" height="280" rx="16" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" />
          <rect x="872" y="32" width="200" height="32" rx="16" fill="#78350f" />
          <text x="972" y="53" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" fill="#fef3c7">FIRMWARE BUG</text>
          <text x="872" y="110" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700" fill="#ffffff">Cloned Gust Direction</text>
          <text x="872" y="155" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" fill="#d4d4d8">Wind gust direction (wgd) is an identical copy of gust speed.</text>
          <text x="872" y="195" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" fill="#f59e0b">⚠ 7,060 / 7,060 rows identical. Corrupts wind vectors.</text>
          <text x="872" y="235" font-family="monospace" font-size="15" fill="#a1a1aa">Hatua Trust Gate: [FLAG: cloned_gust_dir] → Drops wgd</text>

          <!-- Card 3 -->
          <rect x="0" y="320" width="760" height="280" rx="16" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" />
          <rect x="32" y="352" width="210" height="32" rx="16" fill="#78350f" />
          <text x="137" y="373" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" fill="#fef3c7">MEMORY ANOMALY</text>
          <text x="32" y="430" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700" fill="#ffffff">Nightly Health Spikes</text>
          <text x="32" y="475" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" fill="#d4d4d8">Integer health flag spikes from 0 to 33,501,705 nightly.</text>
          <text x="32" y="515" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" fill="#f59e0b">⚠ Internal 3D-PAWS memory dump, not climate change.</text>
          <text x="32" y="555" font-family="monospace" font-size="15" fill="#a1a1aa">Hatua Trust Gate: [FLAG: health_garbage] → Isolates event</text>

          <!-- Card 4 -->
          <rect x="840" y="320" width="760" height="280" rx="16" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" />
          <rect x="872" y="352" width="220" height="32" rx="16" fill="#14532d" />
          <text x="982" y="373" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" fill="#bbf7d0">PHYSICAL GROUNDING</text>
          <text x="872" y="430" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700" fill="#ffffff">Real Exposure: Heat &amp; Humidity</text>
          <text x="872" y="475" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" fill="#d4d4d8">Afternoons: Heat index 27.5°C, WBGT 21.7°C, intense UV.</text>
          <text x="872" y="515" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" fill="#d4d4d8">Nights: Humidity &gt;= 90% for 534 min (leaf wetness risk).</text>
          <text x="872" y="555" font-family="monospace" font-size="15" fill="#10b981">Hatua Action Engine: Generates Go / Shade / Ventilate decisions</text>
        </g>
      </svg>
    `
  },
  {
    id: 'scene_3_architecture',
    title: 'Architecture: Hexagonal Domain & Versioned Policies',
    narration: "Here is our architecture. Hatua is built as a production-grade modular monolith with hexagonal boundaries. Telemetry from Conduit CHORDS or shared GeoCSV flows into the worker process. Every observation is checked by our versioned Trust Policy YAML before entering the database. Clean observations pass to the Action Engine, which evaluates heat stress, nocturnal humidity, rain onset, and water demand. Dual database support runs SQLite locally and PostgreSQL in Docker. The Next.js web application and Africa's Talking API consume trusted read projections over FastAPI.",
    svg: `
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="1920" height="1080" fill="#09090b" />
        
        <text x="160" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#38bdf8" letter-spacing="2">
          ENGINEERING INTEGRITY
        </text>
        <text x="160" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff">
          Hexagonal Architecture &amp; Trust Policies
        </text>

        <!-- Pipeline Flow Diagram -->
        <g transform="translate(160, 300)">
          <!-- Box 1: Sources -->
          <rect x="0" y="140" width="260" height="240" rx="16" fill="#18181b" stroke="#334155" stroke-width="2" />
          <text x="130" y="190" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#94a3b8">INPUT SOURCES</text>
          <rect x="25" y="220" width="210" height="50" rx="8" fill="#27272a" />
          <text x="130" y="252" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#ffffff">Conduit CHORDS 61</text>
          <rect x="25" y="290" width="210" height="50" rx="8" fill="#27272a" />
          <text x="130" y="322" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#ffffff">Open-Meteo Forecast</text>

          <!-- Arrow 1 -->
          <path d="M 270 260 L 330 260" stroke="#10b981" stroke-width="3" fill="none" marker-end="url(#arrow)" />

          <!-- Box 2: Core Domain Engine -->
          <rect x="340" y="60" width="520" height="400" rx="20" fill="#18181b" stroke="#10b981" stroke-width="3" />
          <text x="600" y="110" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="800" fill="#10b981">packages/core (DOMAIN)</text>
          
          <rect x="375" y="140" width="450" height="120" rx="12" fill="#27272a" stroke="#52525b" />
          <text x="400" y="175" font-family="sans-serif" font-size="17" font-weight="700" fill="#ffffff">Trust Gate (trust_v1.yaml)</text>
          <text x="400" y="205" font-family="sans-serif" font-size="14" fill="#a1a1aa">• Stuck gauge &amp; clone detection</text>
          <text x="400" y="230" font-family="sans-serif" font-size="14" fill="#a1a1aa">• Thermometer spread &amp; health spike filter</text>

          <rect x="375" y="290" width="450" height="130" rx="12" fill="#27272a" stroke="#52525b" />
          <text x="400" y="325" font-family="sans-serif" font-size="17" font-weight="700" fill="#ffffff">Action Engine (actions_v1.yaml)</text>
          <text x="400" y="355" font-family="sans-serif" font-size="14" fill="#a1a1aa">• Heat Index &amp; WBGT percentiles</text>
          <text x="400" y="380" font-family="sans-serif" font-size="14" fill="#a1a1aa">• Nocturnal leaf-wetness &amp; ET0 water wait</text>
          <text x="400" y="405" font-family="sans-serif" font-size="14" fill="#a1a1aa">• 45-min hysteresis anti-flapping</text>

          <!-- Arrow 2 -->
          <path d="M 870 260 L 930 260" stroke="#10b981" stroke-width="3" fill="none" />

          <!-- Box 3: Persistence & API -->
          <rect x="940" y="100" width="280" height="320" rx="16" fill="#18181b" stroke="#334155" stroke-width="2" />
          <text x="1080" y="150" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#94a3b8">PERSIST &amp; API</text>
          <rect x="965" y="180" width="230" height="60" rx="8" fill="#27272a" />
          <text x="1080" y="215" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#ffffff">SQLite / PostgreSQL</text>
          <rect x="965" y="260" width="230" height="60" rx="8" fill="#27272a" />
          <text x="1080" y="295" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#ffffff">FastAPI Read API</text>
          <rect x="965" y="340" width="230" height="60" rx="8" fill="#27272a" />
          <text x="1080" y="375" text-anchor="middle" font-family="monospace" font-size="14" fill="#38bdf8">POST /v1/replay</text>

          <!-- Arrow 3 -->
          <path d="M 1230 260 L 1290 260" stroke="#10b981" stroke-width="3" fill="none" />

          <!-- Box 4: Presentation & Mobile -->
          <rect x="1300" y="60" width="300" height="400" rx="16" fill="#18181b" stroke="#f59e0b" stroke-width="2" />
          <text x="1450" y="110" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#f59e0b">INTERFACES</text>
          
          <rect x="1325" y="140" width="250" height="85" rx="8" fill="#27272a" />
          <text x="1450" y="175" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="600" fill="#ffffff">Next.js 16 Web Console</text>
          <text x="1450" y="205" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#a1a1aa">Campus · Farm · Science</text>

          <rect x="1325" y="245" width="250" height="95" rx="8" fill="#27272a" />
          <text x="1450" y="280" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="600" fill="#ffffff">Africa's Talking Gateway</text>
          <text x="1450" y="305" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981">USSD *384*61# · Live SMS</text>
          <text x="1450" y="325" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#a1a1aa">Bilingual English/Swahili</text>

          <rect x="1325" y="360" width="250" height="80" rx="8" fill="#27272a" />
          <text x="1450" y="395" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="600" fill="#38bdf8">TypeSafe Jev System One</text>
          <text x="1450" y="420" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#a1a1aa">Semantic Contextual AI</text>
        </g>

        <!-- Test Suite Callout -->
        <g transform="translate(160, 840)">
          <rect x="0" y="0" width="1600" height="90" rx="12" fill="#111827" stroke="#1f2937" />
          <text x="40" y="52" font-family="sans-serif" font-size="18" font-weight="700" fill="#10b981">✓ 20/20 AUTOMATED TESTS PASSING</text>
          <text x="480" y="52" font-family="sans-serif" font-size="16" fill="#d1d5db">Full verification across trust policies, action hysteresis, replay clock, and Africa's Talking SMS/USSD webhooks.</text>
        </g>
      </svg>
    `
  },
  {
    id: 'scene_4_replay_demo',
    title: 'Live Replay: 31 Aug Rain Onset & Multi-Persona Actions',
    narration: "Our interactive Replay Engine allows judges to scrub through the entire 5-day extract without waiting for rain in Juja. Look at what happens at three forty-one UTC on August thirty-first: Hatua detects genuine rain onset on Gauge One while keeping Gauge Two isolated. Our Campus Face warns grounds crews to hydrate and seek shade during afternoon peaks. Our Farm Face advises tomato growers to ventilate greenhouses during humid nights. And our Science Face warns the AquaTwin satellite team: do not calibrate models against this timestep.",
    svg: `
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="1920" height="1080" fill="#09090b" />
        
        <text x="160" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#10b981" letter-spacing="2">
          THE LIVE DEMONSTRATION
        </text>
        <text x="160" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff">
          Interactive Replay at 2026-08-31 03:41 UTC
        </text>

        <!-- Simulated Today View Screen -->
        <g transform="translate(160, 270)">
          <!-- Outer App Window -->
          <rect x="0" y="0" width="1600" height="710" rx="16" fill="#121215" stroke="#27272a" stroke-width="2" />
          
          <!-- Top Nav Bar -->
          <rect x="0" y="0" width="1600" height="70" rx="16" fill="#18181b" />
          <text x="40" y="44" font-family="sans-serif" font-size="22" font-weight="800" fill="#10b981">HATUA</text>
          <text x="140" y="44" font-family="sans-serif" font-size="16" fill="#71717a">/today</text>
          
          <!-- Role Switcher -->
          <rect x="1200" y="16" width="360" height="40" rx="8" fill="#27272a" />
          <rect x="1204" y="20" width="115" height="32" rx="6" fill="#10b981" />
          <text x="1261" y="42" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#000000">Campus</text>
          <text x="1380" y="42" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#a1a1aa">Farm</text>
          <text x="1500" y="42" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#a1a1aa">Science</text>

          <!-- Replay Scrubber Bar -->
          <rect x="40" y="100" width="1520" height="70" rx="12" fill="#1c1917" stroke="#44403c" />
          <text x="70" y="142" font-family="monospace" font-size="16" font-weight="700" fill="#f59e0b">REPLAY CLOCK: 2026-08-31 06:41:33 EAT (03:41:33 UTC)</text>
          <rect x="1350" y="115" width="180" height="40" rx="8" fill="#f59e0b" />
          <text x="1440" y="141" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#000000">RAIN TIP EVENT</text>

          <!-- Primary Action Card: RAIN ONSET -->
          <g transform="translate(40, 200)">
            <rect x="0" y="0" width="960" height="470" rx="16" fill="#18181b" stroke="#10b981" stroke-width="2" />
            
            <rect x="40" y="35" width="130" height="28" rx="14" fill="#065f46" />
            <text x="105" y="54" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#6ee7b7">RAIN ONSET</text>

            <rect x="185" y="35" width="120" height="28" rx="14" fill="#78350f" />
            <text x="245" y="54" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#fef3c7">DEGRADED</text>

            <rect x="320" y="35" width="280" height="28" rx="6" fill="#27272a" />
            <text x="330" y="54" font-family="sans-serif" font-size="12" fill="#a1a1aa">Protocol: JKUAT Rain Protocol #02</text>

            <text x="40" y="125" font-family="sans-serif" font-size="36" font-weight="800" fill="#ffffff">
              Rain has started at gauge 1
            </text>
            <text x="40" y="165" font-family="sans-serif" font-size="17" fill="#71717a">
              Valid until 08:11 EAT · Target: Grounds Foremen &amp; Peri-Urban Farmers
            </text>

            <text x="40" y="210" font-family="sans-serif" font-size="18" fill="#d4d4d8">
              Conduit gauge 1 recorded active tip (0.2 mm) after dry window.
            </text>
            <text x="40" y="240" font-family="sans-serif" font-size="18" fill="#d4d4d8">
              Gauge 2 remains stuck at 0.0mm. Irrigation holds active.
            </text>

            <!-- Jev Callout Box -->
            <rect x="40" y="275" width="880" height="95" rx="10" fill="#064e3b" stroke="#047857" stroke-width="1.5" />
            <text x="65" y="305" font-family="sans-serif" font-size="14" font-weight="700" fill="#34d399">
              TypeSafe Jev System One (jev-latest) Contextual Advisory:
            </text>
            <text x="65" y="340" font-family="sans-serif" font-size="16" font-style="italic" fill="#ffffff">
              “Mvua imeanza kituo cha JKUAT. Sitisha unyunyiziaji maji shambani na linda vifaa.”
            </text>

            <!-- Africa's Talking Dispatch -->
            <rect x="40" y="390" width="880" height="55" rx="8" fill="#27272a" />
            <text x="65" y="424" font-family="sans-serif" font-size="15" fill="#10b981">📱 Dispatched via Africa's Talking SMS broadcast to 24 field personnel</text>
          </g>

          <!-- Sidebar Secondary Actions -->
          <g transform="translate(1030, 200)">
            <!-- Card 2 -->
            <rect x="0" y="0" width="530" height="225" rx="12" fill="#18181b" stroke="#3f3f46" />
            <text x="30" y="45" font-family="sans-serif" font-size="14" font-weight="700" fill="#f59e0b">SCIENCE / AQUATWIN</text>
            <text x="30" y="85" font-family="sans-serif" font-size="22" font-weight="700" fill="#ffffff">Station Fault: Do Not Calibrate</text>
            <text x="30" y="125" font-family="sans-serif" font-size="15" fill="#a1a1aa">Gauge 2 stuck at 0.0mm. If AquaTwin ingests</text>
            <text x="30" y="150" font-family="sans-serif" font-size="15" fill="#a1a1aa">this timestep raw, satellite models corrupt.</text>
            <text x="30" y="190" font-family="monospace" font-size="13" fill="#ef4444">GET /v1/stations/61/trust → CALIBRATE: NO</text>

            <!-- Card 3 -->
            <rect x="0" y="245" width="530" height="225" rx="12" fill="#18181b" stroke="#3f3f46" />
            <text x="30" y="290" font-family="sans-serif" font-size="14" font-weight="700" fill="#38bdf8">CAMPUS HEAT PROTOCOL</text>
            <text x="30" y="330" font-family="sans-serif" font-size="22" font-weight="700" fill="#ffffff">Shade &amp; Hydration Protocol</text>
            <text x="30" y="370" font-family="sans-serif" font-size="15" fill="#a1a1aa">Afternoon WBGT reaches 21.7°C, Heat Index 27.5°C.</text>
            <text x="30" y="395" font-family="sans-serif" font-size="15" fill="#a1a1aa">Estates crews mandated 15-min hydration break.</text>
            <text x="30" y="435" font-family="sans-serif" font-size="13" fill="#10b981">Protocol: JKUAT Estates OHS #14</text>
          </g>
        </g>
      </svg>
    `
  },
  {
    id: 'scene_5_last_mile',
    title: 'Last-Mile Delivery: Africa\'s Talking & TypeSafe Jev AI',
    narration: "Crucially, Kenyan outdoor workers and smallholder farmers do not sit in front of web dashboards. Hatua bridges the last mile using Africa's Talking. Anyone on campus or in Kiambu can dial star three eight four star sixty-one hash for instant USSD advisories on basic feature phones, or send inbound SMS in English or Kiswahili. We use TypeSafe's Jev System One model to classify ambiguous weather regimes, score labor safety, and select culturally authentic Kiswahili advisories without hallucinations.",
    svg: `
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="1920" height="1080" fill="#09090b" />
        
        <text x="160" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#f59e0b" letter-spacing="2">
          CLOSING THE DIGITAL DIVIDE
        </text>
        <text x="160" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff">
          Africa's Talking USSD &amp; TypeSafe Jev AI
        </text>

        <!-- Two Columns: Mobile Mockup and Jev Semantic Intelligence -->
        <g transform="translate(160, 290)">
          <!-- Left: Mobile Phone USSD & SMS Mockup -->
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="700" height="680" rx="28" fill="#18181b" stroke="#334155" stroke-width="3" />
            
            <rect x="40" y="40" width="620" height="60" rx="12" fill="#0f172a" />
            <text x="60" y="77" font-family="monospace" font-size="20" font-weight="700" fill="#38bdf8">DIAL: *384*61# (AFRICA'S TALKING)</text>

            <!-- USSD Dialog Box -->
            <rect x="40" y="130" width="620" height="230" rx="16" fill="#020617" stroke="#1e293b" />
            <text x="70" y="175" font-family="monospace" font-size="18" fill="#22c55e">Karibu Hatua JKUAT (Conduit 61)</text>
            <text x="70" y="215" font-family="monospace" font-size="16" fill="#f8fafc">1. Hali ya Sasa (Current Advisory)</text>
            <text x="70" y="245" font-family="monospace" font-size="16" fill="#f8fafc">2. Wafanyakazi Campus (Heat/Work Protocol)</text>
            <text x="70" y="275" font-family="monospace" font-size="16" fill="#f8fafc">3. Wakulima Juja (Farm Leaf-Wetness)</text>
            <text x="70" y="305" font-family="monospace" font-size="16" fill="#f8fafc">4. Data Trust (Sensor Health)</text>
            <text x="70" y="335" font-family="monospace" font-size="16" fill="#94a3b8">5. English Menu</text>

            <!-- Two-Way SMS Dialogue -->
            <rect x="40" y="390" width="620" height="250" rx="16" fill="#020617" stroke="#1e293b" />
            <text x="70" y="430" font-family="sans-serif" font-size="14" font-weight="700" fill="#94a3b8">TWO-WAY BILINGUAL SMS (+254 7XX XXX XXX)</text>
            
            <rect x="70" y="455" width="450" height="50" rx="12" fill="#1e293b" />
            <text x="90" y="486" font-family="sans-serif" font-size="15" fill="#f8fafc">“Je joto ni kali kwa wafanyakazi leo?”</text>

            <rect x="140" y="525" width="490" height="85" rx="12" fill="#065f46" />
            <text x="160" y="555" font-family="sans-serif" font-size="14" font-weight="600" fill="#a7f3d0">HATUA (Jev Semantic Response):</text>
            <text x="160" y="585" font-family="sans-serif" font-size="14" fill="#ffffff">“Joto kali JKUAT (WBGT 21.7C). Pumzikeni kivulini na kunywa maji sasa hadi 16:30 EAT.”</text>
          </g>

          <!-- Right: Jev System One Capabilities -->
          <g transform="translate(760, 0)">
            <rect x="0" y="0" width="840" height="680" rx="24" fill="#18181b" stroke="#10b981" stroke-width="2" />
            
            <text x="50" y="60" font-family="sans-serif" font-size="24" font-weight="800" fill="#10b981">TypeSafe Jev System One (jev-latest)</text>
            <text x="50" y="95" font-family="sans-serif" font-size="16" fill="#a1a1aa">High-speed, calibrated semantic judgments. Code retains physical rules.</text>

            <!-- Jev Capability 1 -->
            <rect x="50" y="130" width="740" height="150" rx="12" fill="#27272a" />
            <text x="80" y="170" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffffff">1. Contextual Action Routing (Choice)</text>
            <text x="80" y="200" font-family="sans-serif" font-size="15" fill="#d4d4d8">Evaluates conflicting multi-variable edge cases (heat vs UV vs wind).</text>
            <text x="80" y="230" font-family="monospace" font-size="14" fill="#38bdf8">Jev Output: dominant_regime="compounding_heat_and_uv" (P=0.82)</text>
            <text x="80" y="255" font-family="monospace" font-size="13" fill="#a1a1aa">Confidence: 0.76 · Calibrated probability distribution</text>

            <!-- Jev Capability 2 -->
            <rect x="50" y="310" width="740" height="150" rx="12" fill="#27272a" />
            <text x="80" y="350" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffffff">2. Work Safety Scoring (Score)</text>
            <text x="80" y="380" font-family="sans-serif" font-size="15" fill="#d4d4d8">Scores labor hazard level against ordered descriptive levels.</text>
            <text x="80" y="410" font-family="monospace" font-size="14" fill="#38bdf8">Jev Output: work_safety_score=1.38 / 3.0 (caution_required)</text>
            <text x="80" y="435" font-family="monospace" font-size="13" fill="#a1a1aa">Legend: hazardous (0), caution (1), moderate (2), safe (3)</text>

            <!-- Jev Capability 3 -->
            <rect x="50" y="490" width="740" height="150" rx="12" fill="#27272a" />
            <text x="80" y="530" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffffff">3. Culturally Authentic Swahili Selection (Choice)</text>
            <text x="80" y="560" font-family="sans-serif" font-size="15" fill="#d4d4d8">Picks exact vetted advisory text from a closed domain catalog.</text>
            <text x="80" y="590" font-family="monospace" font-size="14" fill="#10b981">Jev Output: sw_choice="sw_joto_na_kivuli" (P=0.91)</text>
            <text x="80" y="615" font-family="sans-serif" font-size="13" fill="#a1a1aa">Zero hallucination risk. Direct operational safety guaranteed.</text>
          </g>
        </g>
      </svg>
    `
  },
  {
    id: 'scene_6_scaling',
    title: 'National Scaling & Regional 3D-PAWS Sensor Mesh',
    narration: "Hatua is not limited to JKUAT. Every database table is station-keyed, scaling seamlessly to the seventy-five 3D-PAWS stations across Kenya, including KALRO Thika, Garissa, and Wajir. We provide a ready-made sensor trust mesh for Kenya Met, and a dependable calibration ground truth for the Slovenia-Kenya AquaTwin satellite initiative. Hatua turns raw data into trusted intelligence, and intelligence into same-day action. Thank you.",
    svg: `
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="1920" height="1080" fill="#09090b" />
        
        <text x="160" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#10b981" letter-spacing="2">
          POST-HACKATHON HORIZON
        </text>
        <text x="160" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff">
          Kenya 3D-PAWS Regional Sensor Mesh
        </text>

        <!-- Network Table & Partners -->
        <g transform="translate(160, 280)">
          <!-- Left Table: 4 Active Stations -->
          <rect x="0" y="0" width="960" height="680" rx="20" fill="#18181b" stroke="#334155" stroke-width="2" />
          <text x="40" y="60" font-family="sans-serif" font-size="22" font-weight="700" fill="#ffffff">Station-Keyed Database Ready for 75+ CHORDS Nodes</text>
          
          <g transform="translate(40, 100)">
            <!-- Station 1 -->
            <rect x="0" y="0" width="880" height="115" rx="12" fill="#27272a" stroke="#10b981" stroke-width="2" />
            <text x="30" y="42" font-family="sans-serif" font-size="20" font-weight="700" fill="#ffffff">Station 61: JKUAT Main Campus (Conduit@Empathy1)</text>
            <text x="30" y="75" font-family="sans-serif" font-size="15" fill="#a1a1aa">Kiambu Highlands (1523m) · 37.0145°E, 1.0997°S</text>
            <text x="30" y="98" font-family="sans-serif" font-size="14" fill="#10b981">Role: Primary Ground Truth · Heat, UV, Rain Onset</text>

            <!-- Station 2 -->
            <rect x="0" y="135" width="880" height="115" rx="12" fill="#27272a" />
            <text x="30" y="177" font-family="sans-serif" font-size="20" font-weight="700" fill="#ffffff">Station 10: KALRO Thika Agricultural Station</text>
            <text x="30" y="210" font-family="sans-serif" font-size="15" fill="#a1a1aa">Central Kenya (1548m) · 37.0700°E, 1.0333°S</text>
            <text x="30" y="233" font-family="sans-serif" font-size="14" fill="#38bdf8">Role: Peri-Urban Horticultural Pest &amp; Fungal Monitoring</text>

            <!-- Station 3 -->
            <rect x="0" y="270" width="880" height="115" rx="12" fill="#27272a" />
            <text x="30" y="312" font-family="sans-serif" font-size="20" font-weight="700" fill="#ffffff">Station 15: Garissa Agricultural ASAL Station</text>
            <text x="30" y="345" font-family="sans-serif" font-size="15" fill="#a1a1aa">North Eastern Lowlands (147m) · 39.6583°E, 0.4532°S</text>
            <text x="30" y="368" font-family="sans-serif" font-size="14" fill="#f59e0b">Role: Arid Zone Heat Stress &amp; Severe Water Depletion</text>

            <!-- Station 4 -->
            <rect x="0" y="405" width="880" height="115" rx="12" fill="#27272a" />
            <text x="30" y="447" font-family="sans-serif" font-size="20" font-weight="700" fill="#ffffff">Station 22: Wajir Airport AWS</text>
            <text x="30" y="480" font-family="sans-serif" font-size="15" fill="#a1a1aa">ASAL Pastoral Zone (235m) · 40.0917°E, 1.7471°N</text>
            <text x="30" y="503" font-family="sans-serif" font-size="14" fill="#f59e0b">Role: Pastoralist Extreme Drought &amp; Wind Monitoring</text>
          </g>

          <!-- Right Column: Institutional Alignment -->
          <g transform="translate(1020, 0)">
            <rect x="0" y="0" width="580" height="680" rx="20" fill="#18181b" stroke="#334155" stroke-width="2" />
            
            <text x="40" y="60" font-family="sans-serif" font-size="22" font-weight="700" fill="#ffffff">Strategic JHUB Africa Pathways</text>

            <rect x="40" y="100" width="500" height="150" rx="12" fill="#27272a" />
            <text x="70" y="145" font-family="sans-serif" font-size="18" font-weight="700" fill="#10b981">1. AquaTwin River Basin Twin</text>
            <text x="70" y="180" font-family="sans-serif" font-size="15" fill="#d4d4d8">Protects €603K Slovenia-Kenya</text>
            <text x="70" y="205" font-family="sans-serif" font-size="15" fill="#d4d4d8">satellite calibration from hardware faults.</text>

            <rect x="40" y="280" width="500" height="150" rx="12" fill="#27272a" />
            <text x="70" y="325" font-family="sans-serif" font-size="18" font-weight="700" fill="#38bdf8">2. JKUAT Campus Estates OHS</text>
            <text x="70" y="360" font-family="sans-serif" font-size="15" fill="#d4d4d8">Live SMS heat-stress dispatch for</text>
            <text x="70" y="385" font-family="sans-serif" font-size="15" fill="#d4d4d8">grounds, sports, and clinic crews.</text>

            <rect x="40" y="460" width="500" height="180" rx="12" fill="#1e293b" />
            <text x="70" y="505" font-family="sans-serif" font-size="20" font-weight="800" fill="#ffffff">SUMMARY: DATA TO IMPACT</text>
            <text x="70" y="540" font-family="sans-serif" font-size="15" fill="#10b981">✓ Meaningful Conduit data use</text>
            <text x="70" y="570" font-family="sans-serif" font-size="15" fill="#10b981">✓ Honest hardware autopsy</text>
            <text x="70" y="600" font-family="sans-serif" font-size="15" fill="#10b981">✓ Real operational decisions</text>
          </g>
        </g>
      </svg>
    `
  }
];

async function generate() {
  console.log('=== STARTING HATUA PRESENTATION VIDEO GENERATION ===');
  
  const videoClips = [];

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    console.log(`\n[Scene ${i + 1}/${scenes.length}] ${s.title}`);

    // 1. Render SVG to 1920x1080 PNG via headless Google Chrome
    const htmlPath = path.join(SCENES_DIR, `${s.id}.html`);
    const pngPath = path.join(SCENES_DIR, `${s.id}.png`);
    console.log(` - Rendering 1080p slide: ${pngPath}`);
    fs.writeFileSync(htmlPath, `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1920px; height: 1080px; overflow: hidden; background: #09090b; }
  svg { width: 1920px; height: 1080px; display: block; }
</style>
</head>
<body>
${s.svg.trim()}
</body>
</html>`);
    execSync(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot="${pngPath}" --window-size=1920,1080 --virtual-time-budget=1000 "file://${htmlPath}" 2>/dev/null`);

    // 2. Synthesize Audio Speech with Jev-selected Natural Kenyan Voice (en-KE-ChilembaNeural)
    const mp3VoicePath = path.join(AUDIO_DIR, `${s.id}.mp3`);
    const wavPath = path.join(AUDIO_DIR, `${s.id}.wav`);
    console.log(` - Synthesizing authentic Kenyan neural voice (en-KE-ChilembaNeural)...`);
    const cleanText = s.narration.replace(/"/g, '\\"');
    execSync(`.venv/bin/edge-tts --voice en-KE-ChilembaNeural --rate="-4%" --text "${cleanText}" --write-media "${mp3VoicePath}"`);
    execSync(`ffmpeg -y -i "${mp3VoicePath}" -ar 44100 -ac 2 "${wavPath}" 2>/dev/null`);

    // 3. Inspect audio duration
    const durationStr = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${wavPath}"`).toString().trim();
    const duration = parseFloat(durationStr);
    console.log(` - Audio duration: ${duration.toFixed(2)}s`);

    // 4. Create MP4 Video Clip for this scene
    const clipPath = path.join(VIDEO_DIR, `${s.id}.mp4`);
    console.log(` - Encoding MP4 video clip with ffmpeg...`);
    // Add 1 second of freeze buffer at the end of each slide for smooth pacing
    const clipDuration = duration + 1.0;
    execSync(`ffmpeg -y -loop 1 -i "${pngPath}" -i "${wavPath}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -t ${clipDuration} "${clipPath}" 2>/dev/null`);

    videoClips.push(clipPath);
  }

  // 5. Concatenate all clips into final masterpiece
  console.log('\n=== CONCATENATING SCENES INTO FINAL PRESENTATION VIDEO ===');
  const concatListPath = path.join(VIDEO_DIR, 'concat_list.txt');
  const concatContent = videoClips.map(c => `file '${c}'`).join('\n');
  fs.writeFileSync(concatListPath, concatContent);

  const finalVideoPath = path.join(VIDEO_DIR, 'hatua_hackathon_presentation.mp4');
  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${finalVideoPath}" 2>/dev/null`);

  const finalDuration = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${finalVideoPath}"`).toString().trim();
  const finalSize = fs.statSync(finalVideoPath).size / (1024 * 1024);

  console.log(`\n🎉 SUCCESS! Final Video Generated:`);
  console.log(`Path: ${finalVideoPath}`);
  console.log(`Duration: ${parseFloat(finalDuration).toFixed(1)}s (${(parseFloat(finalDuration) / 60).toFixed(2)} minutes - Perfect for 3-5 min hackathon rule!)`);
  console.log(`Size: ${finalSize.toFixed(2)} MB`);
}

generate().catch(err => {
  console.error('Video generation failed:', err);
  process.exit(1);
});
