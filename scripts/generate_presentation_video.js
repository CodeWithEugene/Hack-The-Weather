const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const VIDEO_DIR = path.join(ROOT, 'video');
const SCENES_DIR = path.join(VIDEO_DIR, 'scenes');
const AUDIO_DIR = path.join(VIDEO_DIR, 'audio');

// 6 Structured Scenes with Real Field Photos, Live Site UI, and USSD Tech
const scenes = [
  {
    id: 'scene_1_hook',
    title: 'HATUA: Trust First. Then Act.',
    narration: "Welcome to Hatua. Across Kenya, climate stations record observations every minute. Yet outdoor workers, students, and farmers still look at the sky to make critical daily decisions. Conduit measures the Juja microclimate every minute, but nobody tells people whether a reading is trustworthy, or what to do with it. We did not build another weather dashboard. We built Hatua: an operational, trust-gated action layer on Conduit@Empathy.",
    html: `
      <div style="display: flex; width: 100%; height: 100%; padding: 48px 64px; gap: 48px; align-items: center;">
        <!-- Left: Real JKUAT Station Field Photo -->
        <div style="flex: 1.15; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2px solid #27272a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); height: 840px;">
            <img src="file://${SCENES_DIR}/jkuat_conduit_station.jpg" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(0deg, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.7) 60%, transparent 100%); padding: 28px 32px;">
              <div style="display: flex; gap: 12px; margin-bottom: 8px;">
                <span style="background: #064e3b; color: #34d399; font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; letter-spacing: 1px;">GROUND TRUTH</span>
                <span style="background: #1e293b; color: #94a3b8; font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 9999px;">CHORDS ID 61</span>
              </div>
              <h3 style="font-size: 24px; font-weight: 700; color: #ffffff;">Conduit@Empathy · JKUAT Main Campus</h3>
              <p style="font-size: 15px; color: #cbd5e1; margin-top: 4px;">3D-PAWS Automatic Weather Station · Juja, Kiambu County (1523m altitude)</p>
            </div>
          </div>
        </div>

        <!-- Right: Real Problem & Mission Statement -->
        <div style="flex: 1.1; display: flex; flex-direction: column; justify-content: center; padding-left: 16px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; width: fit-content; background: #18181b; border: 1px solid #3f3f46; border-radius: 9999px; padding: 6px 18px; margin-bottom: 24px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
            <span style="font-size: 14px; font-weight: 700; color: #e4e4e7; letter-spacing: 1.5px;">HACK THE WEATHER 2026 · JHUB AFRICA</span>
          </div>

          <h1 style="font-size: 96px; font-weight: 900; letter-spacing: -3px; line-height: 0.95; margin-bottom: 16px; color: #ffffff;">
            HATUA
          </h1>
          <p style="font-size: 32px; font-weight: 700; color: #10b981; margin-bottom: 24px; letter-spacing: -0.5px;">
            Trust first. Then act.
          </p>

          <p style="font-size: 22px; color: #a1a1aa; line-height: 1.5; margin-bottom: 40px; max-width: 780px;">
            Conduit measures the Juja microclimate every minute. Yet outdoor workers, students, and nearby farmers still look at the sky to decide whether to work or ventilate crops.
          </p>

          <!-- 3 Real Value Props -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 14px; padding: 18px 24px; display: flex; align-items: center; gap: 20px;">
              <span style="background: #064e3b; color: #34d399; font-weight: 800; font-size: 18px; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">01</span>
              <div>
                <strong style="font-size: 18px; color: #ffffff; display: block;">Hardware Trust Gate</strong>
                <span style="font-size: 14px; color: #a1a1aa;">Catches dead rain gauges, cloned gusts, and garbage health codes before action.</span>
              </div>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 14px; padding: 18px 24px; display: flex; align-items: center; gap: 20px;">
              <span style="background: #0c4a6e; color: #38bdf8; font-weight: 800; font-size: 18px; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">02</span>
              <div>
                <strong style="font-size: 18px; color: #ffffff; display: block;">Operational Decision Cards</strong>
                <span style="font-size: 14px; color: #a1a1aa;">Concrete heat rest orders for campus crews; greenhouse venting for Juja farmers.</span>
              </div>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 14px; padding: 18px 24px; display: flex; align-items: center; gap: 20px;">
              <span style="background: #451a03; color: #fbbf24; font-weight: 800; font-size: 18px; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">03</span>
              <div>
                <strong style="font-size: 18px; color: #ffffff; display: block;">Africa's Talking USSD &amp; Jev AI</strong>
                <span style="font-size: 14px; color: #a1a1aa;">Interactive *384*61# on feature phones with TypeSafe Jev natural Swahili routing.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene_2_hardware_truth',
    title: 'The Reality of Station 61 (5-Day Extract Autopsy)',
    narration: "When we examined the five-day extract provided by the organizers, the physical truth was startling. Rainfall was only zero point four millimeters total across the entire week, with four days of absolute zero. Even more critical: Rain Gauge 2 was completely dead, reporting zero in every single row. Wind gust direction was an exact duplicate of gust speed, and health flags spiked with garbage codes every night. Any application that averages both gauges or predicts floods on this file is deeply flawed. Hatua diagnoses physical faults first.",
    html: `
      <div style="display: flex; flex-direction: column; width: 100%; height: 100%; padding: 48px 64px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: #450a0a; border: 1px solid #dc2626; border-radius: 9999px; padding: 4px 16px; margin-bottom: 12px;">
              <span style="color: #f87171; font-size: 13px; font-weight: 700; letter-spacing: 1.5px;">SENSOR HARDWARE AUTOPSY</span>
            </div>
            <h1 style="font-size: 52px; font-weight: 800; color: #ffffff;">The Physical Truth of Station 61</h1>
          </div>
          <div style="font-size: 16px; color: #94a3b8; text-align: right;">
            Conduit@Empathy 5-Day Telemetry Extract (7,060 raw rows)
          </div>
        </div>

        <!-- Main Body: Live Trust UI + Metric Callouts -->
        <div style="display: flex; gap: 40px; flex: 1;">
          <!-- Left: Real Screenshot of Live Site Trust Page -->
          <div style="flex: 1.25; border-radius: 18px; overflow: hidden; border: 2px solid #27272a; box-shadow: 0 20px 40px rgba(0,0,0,0.7); position: relative;">
            <img src="file://${SCENES_DIR}/live_site_trust.png" style="width: 100%; height: 100%; object-fit: contain; background: #09090b;" />
            <div style="position: absolute; top: 16px; right: 16px; background: rgba(9,9,11,0.85); border: 1px solid #3f3f46; border-radius: 8px; padding: 6px 12px; font-size: 12px; color: #a1a1aa; font-family: monospace;">
              LIVE AUDIT: /trust
            </div>
          </div>

          <!-- Right: Concrete Fault Callouts -->
          <div style="flex: 0.95; display: flex; flex-direction: column; gap: 16px; justify-content: center;">
            <div style="background: #18181b; border: 2px solid #dc2626; border-radius: 16px; padding: 22px 26px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-size: 14px; font-weight: 700; color: #f87171; letter-spacing: 1px;">RAIN GAUGE 2 DEAD</span>
                <span style="font-size: 28px; font-weight: 900; color: #ef4444;">0.0 mm Always</span>
              </div>
              <p style="font-size: 15px; color: #d4d4d8; margin-top: 6px;">
                Secondary tipping bucket reported zero in all 7,060 rows. Averaging both gauges cuts real rain in half!
              </p>
            </div>

            <div style="background: #18181b; border: 2px solid #f59e0b; border-radius: 16px; padding: 22px 26px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-size: 14px; font-weight: 700; color: #fbbf24; letter-spacing: 1px;">DRY WEEK TOTAL</span>
                <span style="font-size: 28px; font-weight: 900; color: #f59e0b;">0.4 mm Total</span>
              </div>
              <p style="font-size: 15px; color: #d4d4d8; margin-top: 6px;">
                Four consecutive days had absolute zero rain. Flood prediction models trained on this file hallucinate.
              </p>
            </div>

            <div style="background: #18181b; border: 2px solid #a855f7; border-radius: 16px; padding: 22px 26px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-size: 14px; font-weight: 700; color: #c084fc; letter-spacing: 1px;">HEALTH BIT CORRUPTION</span>
                <span style="font-size: 28px; font-weight: 900; color: #c084fc;">33,501,705</span>
              </div>
              <p style="font-size: 15px; color: #d4d4d8; margin-top: 6px;">
                Nightly sensor health flags spike into tens of millions. Hatua masks corrupt bits deterministically.
              </p>
            </div>

            <div style="background: #09090b; border: 1px dashed #52525b; border-radius: 14px; padding: 16px 20px;">
              <span style="font-size: 14px; color: #a1a1aa; line-height: 1.4; display: block;">
                💡 <strong>The Hatua Rule:</strong> We never pass raw climate telemetry to downstream users or satellite digital twins without passing through the Trust Gate.
              </span>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene_3_architecture',
    title: 'Architecture: Hexagonal Domain & Versioned Policies',
    narration: "To solve this responsibly, we built a hexagonal architecture in Python and TypeScript. Observations flow into domain entities with strict range validation. Versioned operational policies evaluate real environmental thresholds: wet bulb globe temperature, UV radiation, and rain onset. We do not use probabilistic language models to guess whether it is raining. Policies are deterministic, auditable, and grounded in occupational safety standards and local agricultural practice.",
    html: `
      <div style="display: flex; flex-direction: column; width: 100%; height: 100%; padding: 48px 64px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: #082f49; border: 1px solid #0284c7; border-radius: 9999px; padding: 4px 16px; margin-bottom: 12px;">
              <span style="color: #38bdf8; font-size: 13px; font-weight: 700; letter-spacing: 1.5px;">ZERO-HALLUCINATION DOMAIN ARCHITECTURE</span>
            </div>
            <h1 style="font-size: 52px; font-weight: 800; color: #ffffff;">Hexagonal Domain &amp; Deterministic Rules</h1>
          </div>
          <div style="font-size: 16px; color: #94a3b8; text-align: right;">
            Decoupled Ports &amp; Adapters · Python 3.11 Core + Next.js 16 Web
          </div>
        </div>

        <div style="display: flex; gap: 40px; flex: 1;">
          <!-- Left: Live Why & Architecture Screenshot -->
          <div style="flex: 1.25; border-radius: 18px; overflow: hidden; border: 2px solid #27272a; box-shadow: 0 20px 40px rgba(0,0,0,0.7); position: relative;">
            <img src="file://${SCENES_DIR}/live_site_why.png" style="width: 100%; height: 100%; object-fit: contain; background: #09090b;" />
            <div style="position: absolute; top: 16px; right: 16px; background: rgba(9,9,11,0.85); border: 1px solid #3f3f46; border-radius: 8px; padding: 6px 12px; font-size: 12px; color: #a1a1aa; font-family: monospace;">
              LIVE SYSTEM DOCS: /why
            </div>
          </div>

          <!-- Right: 3 Core Architectural Pillars -->
          <div style="flex: 0.95; display: flex; flex-direction: column; gap: 20px; justify-content: center;">
            <div style="background: #18181b; border: 1px solid #27272a; border-left: 6px solid #10b981; border-radius: 16px; padding: 24px;">
              <span style="font-size: 14px; font-weight: 700; color: #10b981;">01 · INGESTION &amp; TRUST PIPELINE</span>
              <h4 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 4px 0 8px 0;">Dual-Gauge Discordance Check</h4>
              <p style="font-size: 15px; color: #a1a1aa; line-height: 1.4;">
                Station 61 observations are normalized. If Gauge 2 reports 0.0 while Gauge 1 increments, the pipeline automatically flags sensor discordance and uses only verified physical primary data.
              </p>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; border-left: 6px solid #38bdf8; border-radius: 16px; padding: 24px;">
              <span style="font-size: 14px; font-weight: 700; color: #38bdf8;">02 · VERSIONED OPERATIONAL POLICIES</span>
              <h4 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 4px 0 8px 0;">Code-First Decision Math</h4>
              <p style="font-size: 15px; color: #a1a1aa; line-height: 1.4;">
                Policies execute pure Python functions with zero model hallucinations: WBGT &gt; 28°C triggers shade rest; UV &gt; 10 triggers eye protection; rain rate &gt; 2mm/hr triggers greenhouse vent orders.
              </p>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; border-left: 6px solid #f59e0b; border-radius: 16px; padding: 24px;">
              <span style="font-size: 14px; font-weight: 700; color: #f59e0b;">03 · TYPESAFE JEV SYSTEM ONE</span>
              <h4 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 4px 0 8px 0;">Calibrated Semantic Judgments</h4>
              <p style="font-size: 15px; color: #a1a1aa; line-height: 1.4;">
                Where semantic classification is required—such as inbound SMS Swahili intent and multi-hazard regime routing—TypeSafe's Jev model returns typed, probabilistic decisions in milliseconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene_4_replay_demo',
    title: 'Live Replay: 31 Aug Rain Onset & Multi-Persona Actions',
    narration: "Here is Hatua in action. On August thirty-first at two PM, Conduit recorded Juja's only significant rain event of the week: zero point four millimeters. In our interactive replay, you can drag time across the entire week. As rain begins, Hatua immediately dispatches clear operational cards. For JKUAT campus grounds staff, mandatory heat rest is activated when UV hits extreme levels. For local tomato farmers in Juja, greenhouse ventilation is ordered to prevent fungal blight.",
    html: `
      <div style="display: flex; flex-direction: column; width: 100%; height: 100%; padding: 48px 64px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: #064e3b; border: 1px solid #059669; border-radius: 9999px; padding: 4px 16px; margin-bottom: 12px;">
              <span style="color: #34d399; font-size: 13px; font-weight: 700; letter-spacing: 1.5px;">LIVE INTERACTIVE REPLAY SIMULATOR</span>
            </div>
            <h1 style="font-size: 52px; font-weight: 800; color: #ffffff;">31 August Rain Onset: Two Real Personas</h1>
          </div>
          <div style="font-size: 16px; color: #94a3b8; text-align: right;">
            Scrubbing across 7,060 Conduit observations · JKUAT Juja
          </div>
        </div>

        <!-- Full-bleed Real Replay Screenshot from Live Site -->
        <div style="flex: 1; border-radius: 20px; overflow: hidden; border: 2px solid #27272a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); position: relative; background: #09090b;">
          <img src="file://${SCENES_DIR}/live_site_replay.png" style="width: 100%; height: 100%; object-fit: contain; object-position: top;" />
          
          <!-- Bottom Floating Overlay detailing the Personas -->
          <div style="position: absolute; bottom: 20px; left: 24px; right: 24px; display: flex; gap: 24px;">
            <div style="flex: 1; background: rgba(24, 24, 27, 0.95); border: 1px solid #f59e0b; border-radius: 14px; padding: 18px 22px; backdrop-filter: blur(8px);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong style="font-size: 17px; color: #fbbf24;">PERSONA 1: JKUAT ESTATES &amp; MAINTENANCE</strong>
                <span style="font-size: 12px; background: #451a03; color: #fde68a; padding: 2px 10px; border-radius: 9999px;">PROTOCOL ESTATES-HEAT-01</span>
              </div>
              <p style="font-size: 14px; color: #e4e4e7;">
                Triggered when UV index exceeds 10 or WBGT exceeds 28°C: Suspend direct sunlight mowing; mandatory 15-minute hydration shade cycle.
              </p>
            </div>

            <div style="flex: 1; background: rgba(24, 24, 27, 0.95); border: 1px solid #38bdf8; border-radius: 14px; padding: 18px 22px; backdrop-filter: blur(8px);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong style="font-size: 17px; color: #38bdf8;">PERSONA 2: JUJA SMALLHOLDER TOMATO GROWER</strong>
                <span style="font-size: 12px; background: #082f49; color: #bae6fd; padding: 2px 10px; border-radius: 9999px;">PROTOCOL HORT-TOMATO-01</span>
              </div>
              <p style="font-size: 14px; color: #e4e4e7;">
                Triggered on rain onset: Open plastic greenhouse side vents to drop humidity; hold off on chemical foliar spray to prevent pesticide wash-off.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene_5_last_mile',
    title: "Last-Mile Delivery: Africa's Talking & TypeSafe Jev AI",
    narration: "A web dashboard is useless to a groundskeeper with a feature phone in Juja. That is why Hatua is integrated with Africa's Talking. Anyone in Kenya can dial star three eight four star sixty-one hash on any mobile phone to access live USSD advisories. Farmers can text questions in English or Swahili to receive verified, zero-hallucination SMS responses powered by TypeSafe Jev System One.",
    html: `
      <div style="display: flex; flex-direction: column; width: 100%; height: 100%; padding: 48px 64px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: #451a03; border: 1px solid #f59e0b; border-radius: 9999px; padding: 4px 16px; margin-bottom: 12px;">
              <span style="color: #fbbf24; font-size: 13px; font-weight: 700; letter-spacing: 1.5px;">ACCESSIBILITY &amp; LAST-MILE DELIVERY</span>
            </div>
            <h1 style="font-size: 52px; font-weight: 800; color: #ffffff;">Africa's Talking USSD &amp; TypeSafe Jev AI</h1>
          </div>
          <div style="font-size: 16px; color: #94a3b8; text-align: right;">
            Live on Vercel: /v1/africastalking/ussd &amp; /sms
          </div>
        </div>

        <div style="display: flex; gap: 48px; flex: 1; align-items: center;">
          <!-- Left: Real Field Photo of Kenyan Farmer with Nokia Phone -->
          <div style="flex: 1.1; height: 100%; border-radius: 20px; overflow: hidden; border: 2px solid #27272a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); position: relative;">
            <img src="file://${SCENES_DIR}/kenya_ussd_phone.jpg" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(0deg, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.6) 60%, transparent 100%); padding: 24px 28px;">
              <span style="background: #082f49; color: #38bdf8; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px;">FEATURE PHONE REALITY</span>
              <h3 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-top: 6px;">Live USSD Dial Code: *384*61#</h3>
              <p style="font-size: 14px; color: #cbd5e1;">Zero data requirement. Works on any 2G GSM phone across rural Kenya.</p>
            </div>
          </div>

          <!-- Right: Production USSD & SMS Interactive Flows -->
          <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px; justify-content: center;">
            <!-- Africa's Talking USSD Card -->
            <div style="background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 14px; font-weight: 700; color: #38bdf8;">INTERACTIVE USSD MENU (CON/END)</span>
                <span style="font-size: 13px; font-family: monospace; color: #a1a1aa;">POST /v1/africastalking/ussd</span>
              </div>
              <div style="background: #09090b; border: 1px solid #27272a; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 16px; color: #38bdf8; line-height: 1.6;">
                CON Karibu Hatua JKUAT (Conduit 61)<br/>
                1. Hali ya Sasa (Current Advisory)<br/>
                2. Wafanyakazi Campus (Heat/Work)<br/>
                3. Wakulima Juja (Farm/Irrigate)<br/>
                4. Data Trust (Conduit Station 61)
              </div>
            </div>

            <!-- Inbound SMS with Swahili TypeSafe Jev AI -->
            <div style="background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 14px; font-weight: 700; color: #34d399;">TYPESAFE JEV SWAHILI SMS ADVISORY</span>
                <span style="font-size: 13px; font-family: monospace; color: #a1a1aa;">160 CHAR COMPLIANT</span>
              </div>
              <div style="background: #064e3b; border: 1px solid #059669; border-radius: 10px; padding: 16px; font-size: 16px; color: #ecfdf5; line-height: 1.5;">
                <strong>Query: "Kuna mvua leo Juja?"</strong><br/>
                "HATUA: Mvua bado ni kidogo sana (0.4mm). Kipima mvua namba 2 kimeharibika. Usifungulie maji ya mifereji bado. Hakiki: hack-the-weather.vercel.app"
              </div>
            </div>

            <div style="display: flex; gap: 16px; font-size: 14px; color: #a1a1aa;">
              <span>✓ Deployed live on Vercel</span>
              <span>·</span>
              <span>✓ Verified with Africa's Talking API</span>
              <span>·</span>
              <span>✓ Zero hallucination</span>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scene_6_scaling',
    title: 'National Scaling & Regional 3D-PAWS Sensor Mesh',
    narration: "Hatua does not stop at JKUAT. Our architecture scales to the entire national network of 3D-PAWS stations across Kenya: from KALRO Thika's horticultural hub, to Garissa's arid zone, to Wajir Airport in the pastoralist north. Furthermore, by detecting ground sensor failures early, Hatua provides the ground truth needed to calibrate Slovenia and Kenya's AquaTwin satellite digital twin. Hatua: Trust first. Then act.",
    html: `
      <div style="display: flex; flex-direction: column; width: 100%; height: 100%; padding: 48px 64px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: #064e3b; border: 1px solid #059669; border-radius: 9999px; padding: 4px 16px; margin-bottom: 12px;">
              <span style="color: #34d399; font-size: 13px; font-weight: 700; letter-spacing: 1.5px;">REGIONAL SCALING &amp; INSTITUTIONAL IMPACT</span>
            </div>
            <h1 style="font-size: 52px; font-weight: 800; color: #ffffff;">National 3D-PAWS Network &amp; AquaTwin</h1>
          </div>
          <div style="font-size: 16px; color: #94a3b8; text-align: right;">
            Juja · Thika · Garissa · Wajir · SPACE-SI Digital Twin
          </div>
        </div>

        <div style="display: flex; gap: 40px; flex: 1;">
          <!-- Left: 4 Regional Stations Mesh -->
          <div style="flex: 1.2; display: flex; flex-direction: column; gap: 14px; justify-content: center;">
            <div style="background: #18181b; border: 1px solid #10b981; border-radius: 14px; padding: 18px 22px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="font-size: 18px; color: #ffffff;">Station 61: JKUAT Main Campus (Conduit@Empathy)</strong>
                <span style="font-size: 13px; color: #10b981; font-weight: 700;">PRIMARY GROUND TRUTH</span>
              </div>
              <p style="font-size: 14px; color: #a1a1aa; margin-top: 4px;">Kiambu Highlands (1523m) · High heat, extreme UV index, and rain onset monitoring.</p>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 14px; padding: 18px 22px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="font-size: 18px; color: #ffffff;">Station 10: KALRO Thika Agricultural Station</strong>
                <span style="font-size: 13px; color: #38bdf8; font-weight: 700;">HORTICULTURAL ZONE</span>
              </div>
              <p style="font-size: 14px; color: #a1a1aa; margin-top: 4px;">Central Kenya (1548m) · Peri-urban avocado, tomato, and fungal pest prevention.</p>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 14px; padding: 18px 22px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="font-size: 18px; color: #ffffff;">Station 15: Garissa Agricultural ASAL Station</strong>
                <span style="font-size: 13px; color: #f59e0b; font-weight: 700;">ARID LOWLANDS</span>
              </div>
              <p style="font-size: 14px; color: #a1a1aa; margin-top: 4px;">North Eastern Lowlands (147m) · Severe heat stress and drought water depletion warnings.</p>
            </div>

            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 14px; padding: 18px 22px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="font-size: 18px; color: #ffffff;">Station 22: Wajir Airport AWS</strong>
                <span style="font-size: 13px; color: #f59e0b; font-weight: 700;">PASTORALIST ASAL</span>
              </div>
              <p style="font-size: 14px; color: #a1a1aa; margin-top: 4px;">Pastoral Zone (235m) · Extreme livestock heat warning and high wind gust alerts.</p>
            </div>
          </div>

          <!-- Right: Strategic JHUB Africa & AquaTwin Alignment -->
          <div style="flex: 1.0; display: flex; flex-direction: column; justify-content: space-between;">
            <div style="background: #18181b; border: 2px solid #334155; border-radius: 18px; padding: 32px; display: flex; flex-direction: column; gap: 20px;">
              <h3 style="font-size: 26px; font-weight: 800; color: #ffffff;">Strategic Value to JHUB Africa</h3>
              
              <div style="border-left: 4px solid #10b981; padding-left: 16px;">
                <strong style="font-size: 17px; color: #34d399; display: block;">1. AquaTwin River Basin Digital Twin</strong>
                <span style="font-size: 15px; color: #d4d4d8; line-height: 1.4; display: block; margin-top: 4px;">
                  Protects the €603K Slovenia-Kenya satellite calibration from feeding on broken physical sensors like dead rain gauge 2.
                </span>
              </div>

              <div style="border-left: 4px solid #38bdf8; padding-left: 16px;">
                <strong style="font-size: 17px; color: #38bdf8; display: block;">2. Real Human &amp; Campus Safety</strong>
                <span style="font-size: 15px; color: #d4d4d8; line-height: 1.4; display: block; margin-top: 4px;">
                  Automates OHS compliance for JKUAT estates, clinic staff, and Juja farmers directly via Africa's Talking USSD and SMS.
                </span>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #18181b 0%, #064e3b 100%); border: 1px solid #059669; border-radius: 18px; padding: 28px 32px; text-align: center;">
              <h2 style="font-size: 40px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin-bottom: 6px;">HATUA</h2>
              <p style="font-size: 20px; font-weight: 600; color: #34d399; margin-bottom: 12px;">Trust first. Then act.</p>
              <span style="font-family: monospace; font-size: 18px; color: #a7f3d0;">https://hack-the-weather.vercel.app</span>
            </div>
          </div>
        </div>
      </div>
    `
  }
];

async function generate() {
  console.log('=== STARTING HATUA DOCUMENTARY PRESENTATION VIDEO GENERATION ===');
  console.log('Using real field photos, live web app screenshots, and authentic Kenyan voice.\n');
  
  const videoClips = [];

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    console.log(`\n[Scene ${i + 1}/${scenes.length}] ${s.title}`);

    // 1. Render Composite HTML Slide to 1920x1080 PNG via headless Google Chrome
    const htmlPath = path.join(SCENES_DIR, `${s.id}.html`);
    const pngPath = path.join(SCENES_DIR, `${s.id}.png`);
    console.log(` - Rendering 1080p composite slide: ${pngPath}`);
    
    fs.writeFileSync(htmlPath, `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { width: 1920px; height: 1080px; overflow: hidden; background: #09090b; color: #f4f4f5; }
</style>
</head>
<body>
${s.html.trim()}
</body>
</html>`);

    execSync(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot="${pngPath}" --window-size=1920,1080 --allow-file-access-from-files "file://${htmlPath}" 2>/dev/null`);

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
    const clipDuration = duration + 1.0;
    execSync(`ffmpeg -y -loop 1 -i "${pngPath}" -i "${wavPath}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -t ${clipDuration} "${clipPath}" 2>/dev/null`);

    videoClips.push(clipPath);
  }

  // 5. Concatenate all clips into final video
  console.log('\n=== CONCATENATING SCENES INTO FINAL PRESENTATION VIDEO ===');
  const concatListPath = path.join(VIDEO_DIR, 'concat_list.txt');
  const concatContent = videoClips.map(c => `file '${c}'`).join('\n');
  fs.writeFileSync(concatListPath, concatContent);

  const finalVideoPath = path.join(VIDEO_DIR, 'hatua_hackathon_presentation.mp4');
  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${finalVideoPath}" 2>/dev/null`);

  const finalDuration = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${finalVideoPath}"`).toString().trim();
  const finalSize = fs.statSync(finalVideoPath).size / (1024 * 1024);

  console.log(`\n🎉 SUCCESS! Documentary Video Generated:`);
  console.log(`Path: ${finalVideoPath}`);
  console.log(`Duration: ${parseFloat(finalDuration).toFixed(1)}s (${(parseFloat(finalDuration) / 60).toFixed(2)} minutes)`);
  console.log(`Size: ${finalSize.toFixed(2)} MB`);
}

generate().catch(err => {
  console.error('Video generation failed:', err);
  process.exit(1);
});
