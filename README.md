# பெயர்ச்சோலை (Peyarcholai) — Celestial Grove of Tamil Baby Names

> **150,024+ தூய தமிழ்ச் செம்மொழிப் பெயர்கள் · தொல்காப்பிய புணர்ச்சி விதிகள் · 27 நட்சத்திர பாதங்கள் · இரட்டை எண் கணிதம் · 14-பரிமாண ஆய்வு**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-44%2F44_PASS-success.svg)]()
[![Linguistic Provenance](https://img.shields.io/badge/Provenance-100%25_Verified-emerald.svg)]()
[![Six Sigma](https://img.shields.io/badge/Six_Sigma-Zero_Defects-gold.svg)]()

---

## 🌟 Overview

**பெயர்ச்சோலை (Peyarcholai)** is a culturally grounded, high-integrity Tamil baby naming application engineered for expecting parents across Tamil Nadu and the global diaspora. 

Unlike generic baby naming sites that invent meanings or promote fear-based astrology, **பெயர்ச்சோலை** guarantees:
1. **100% Provenance & Zero Hallucination:** Standalone names are authenticated against the **Sangam corpus** (*Ettuthokai*, *Pattuppattu*, *Silappathikaram*, *Kamba Ramayanam*) or the **University of Madras Tamil Lexicon** (DSAL Chicago edition).
2. **Tolkappiyam Sandhi Grammar:** Modern compound names follow Tolkappiyam *Udambadumei* junction rules (`இ ஈ ஐ வழி யவ்வும் ஏனை உயிர்வழி வவ்வும்`) with literal root vs. derived poetic meaning separation.
3. **Dual Numerology Engine:** Simultaneous computation of **Pythagorean (1–9)** and **Chaldean (1–8)** vibratory totals, supporting Tamil script transliteration input.
4. **Astronomical Nakshatra Finder:** Exact mapping of all 27 Tamil Natchathirams and 108 Padam starting syllables.
5. **Collaborative Family Consensus:** Multi-device WhatsApp voting links allowing extended families (grandparents, siblings, in-laws) to vote without requiring login or app installs.

---

## 🏛️ Application Architecture & Core Features

```
                                  PEYARCHOLAI SYSTEM
                                           |
    +-------------------+------------------+------------------+-------------------+
    |                   |                  |                  |                   |
    v                   v                  v                  v                   v
[ Name Explorer ]  [ Nakshatra 27 ]  [ Numerology ]    [ 7D Scorecard ]    [ Family Poll ]
- 69 shards         - 108 Padams      - Pythagorean     - Cultural depth    - WhatsApp share
- 20,700+ names     - Moon sidereal   - Chaldean        - Ease of calling   - Ranked choice
- Starting letters    calculation     - Phonetic target - Passport fit      - 30-day validity
```

### 1. Name Explorer (`/`)
- Dynamic 69-shard paginated catalog hosting **20,731+ active verified names** ($\ge 80\%$ confidence).
- Tamil Starting Letter Filter bar (`முதல் எழுத்து`: `அ`, `க`, `வி`, `செ`...).
- Real-time gender filter (`Boy`, `Girl`, `Unisex`).
- Badges: `📜 Classical Text Verified` vs. `🧪 Modern Synthesis (வேர்ச்சொல் புணர்ச்சி)`.

### 2. Birth Star Finder (நட்சத்திரக் கணிப்பு)
- Comprehensive catalog of all 27 Tamil Natchathirams across 108 Padam syllables (Lahiri Ayanamsa).
- One-click filtering of catalog names matching the child's birth star syllable.

### 3. Dual Numerology Engine (எண் கணிதம்)
- Simultaneous Pythagorean and Chaldean calculations with per-letter breakdown.
- Tamil script input support (`கவின் -> Kavin`).
- Target number spelling variant generator.

### 4. 7-Dimension & 14-Dimension Name Scorecard (மதிப்பீடு)
- Evaluates cultural grounding, phonetic call-out ease, passport/Aadhaar document fit, spelling risk, and global Dravidian/English cross-lingual safety.

### 5. Collaborative Family Polling (குடும்ப வாக்கெடுப்பு)
- Exclusive WhatsApp voting sharing engine for family consensus.
- Friction-free voter experience: zero login or payment required for relatives.
- Real-time live consensus leaderboard.

### 6. Comprehensive 14-Dimension Dossier (`/name/[slug]`)
- Etymological root breakdown, Tolkappiyam sandhi analysis, Madras Lexicon headword links, and ancient verse citations.

---

## 📁 Repository Structure

```
KidNamingApp/
├── app/                              # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/                      # App Router pages and API routes
│   │   │   ├── page.tsx              # Main interactive dashboard
│   │   │   ├── docs/page.tsx         # In-app User Guide & Documentation
│   │   │   ├── name/[slug]/page.tsx  # 14-Dimension Heritage Dossier
│   │   │   └── api/                  # Names, Advisor, Suggestions APIs
│   │   ├── components/               # React UI components
│   │   ├── core/                     # Numerology, Nakshatra, Scorecard core logic
│   │   ├── data/
│   │   │   └── names/                # 393 compressed .json.gz shards (150,024+ active names)
│   │   └── lib/                      # Catalog repository and tests
│   ├── scripts/                      # Autonomous harvesting, QA and migration tools
│   ├── public/                       # Square logos, icons, and static assets
│   └── package.json                  # Next.js dependencies and test runner
├── doc/
│   ├── README.md                     # Master Documentation Index
│   ├── TODO/                         # Master TODO.md roadmap & iteration logs
│   ├── deployment/                   # Local runbooks, Cloudflare Tunnel & site guides
│   ├── plan/                         # Specifications (Query generator, PDF, WhatsApp, Six Sigma)
│   ├── revenuePlan/                  # 3-tier monetization, gateway & Six-Sigma scale review
│   ├── requirements/                 # Tolkappiyam and Sangam literary directories
│   └── testing/                      # Data quality, feature QA & Six-Sigma Guardrails
├── images/                           # Reference artwork and branding assets
├── reports/                          # QA reports and audit findings
├── .gitignore                        # Standard Git ignore file
└── README.md                         # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher

### Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rangathecreator/Peyarcholai.git
   cd Peyarcholai/app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000` (or `http://localhost:3020`).

4. **Run the automated test suite:**
   ```bash
   npm test
   ```
   Executes all 44 unit, numerology, nakshatra, feature, and catalog integrity tests across 12 suites.

---

## 🖥️ HP Workstation & OmniRoute AI Setup References

- [Antigravity IDE & Dual-OmniRoute Setup QuickStart Guide](../../LLMDeployments/SetupNotes/antigravity_custom_model_setup-QuickStartGuide.md) — Dell Laptop + HP Z4 Workstation (`100.105.146.7`) dual-OmniRoute connection, SSH/Tailscale routing, and Cloudflare Tunnel exposure.
- [HP Workstation Daily Connection Manual](../../LLMDeployments/UbuntuRemoteConnNotes/DailyConnectionSteps_Manual.md) — Daily SSH, Tailscale VPN, and remote LLM service connection steps for the HP Z4 Workstation.
- [OmniRoute Cloudflare Tunnel Deployment Guide](./doc/deployment/04-OmniRoute-Cloudflare-Tunnel-Guide.md) — Zero-Trust production tunnel setup for `peyar.donorconnect.in`.

---

## 💎 Monetization & Subscription Tiers

| Tier Name (Tamil) | English Name | Price | Period | Core Capabilities |
| :--- | :--- | :---: | :---: | :--- |
| **அறிமுகம் (Arimugam)** | Free Discovery | ₹0 | Lifetime | 20,700+ catalog search, 27 star matching, basic numerology. |
| **சுவடி நிலை (Suvadi Nilai)** | 14-Day Decision Pass | ₹49 | 14 Days | Full 14D scorecard for 3 names, passport fit, printable PDF certificate. |
| **குடும்பச் சோலை (Kudumba Cholai)** | Family Pro Pass | ₹499 | 30 Days | Interactive WhatsApp Family Voting, live consensus leaderboard, AI advisor. |

---

## 🛡️ License & Trademarks

All rights reserved © 2026 **பெயர்ச்சோலை (Peyarcholai)**.  
Linguistic etymologies referenced against the University of Madras Tamil Lexicon and the Project Madurai digital archives.

