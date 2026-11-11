# Local Deployment, Startup & Prerequisite Testing Guide

**Version:** 2.0 | **Date:** 2026-11-09 | **Location:** `doc/deployment/local/01-Local-Runbook.md`  
**Application Root:** [`E:\project\Apps\KidNamingApp\app`](../../../app)

---

## 1. Architecture & Local Port Map

| Service | Local URL / Port | Purpose |
| :--- | :--- | :--- |
| **NamingGuru Tamil Web App** | **`http://localhost:3020`** | Next.js 15 App Router UI + Serverless API Routes (`/api/*`) |
| **OmniRoute AI Gateway** | **`http://localhost:20128/v1`** | Primary Multi-Model AI Gateway (1,570+ models) for live AI Advisor & Suggestion Review |
| **Local Data Store** | `app/src/data/tamil-names-seed.json` & `runtime-store.json` | Zero-config local persistence (automatically upgrades to Supabase/Neon PostgreSQL when `DATABASE_URL` is set) |

---

## 2. One-Command Local Startup (`start-local.ps1`)

You can start the entire local stack (OmniRoute Gateway health check + Next.js Web Server on port `3020`) using [`app/start-local.ps1`](../../../app/start-local.ps1):

```powershell
cd E:\project\Apps\KidNamingApp\app
.\start-local.ps1
```

---

## 3. Manual Step-by-Step Local Startup

### Step 1: Ensure OmniRoute AI Gateway is Active on Port `20128`
Check if OmniRoute is already listening:
```powershell
curl.exe -s -m 5 http://localhost:20128/health
```
If it is not running, launch it with a 4GB V8 memory limit (per the OmniRoute runtime guide):
```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
& "C:\Program Files\nodejs\node.exe" "$HOME\AppData\Local\Programs\nodejs\node_modules\omniroute\bin\omniroute.mjs" serve --no-open
```

Verify the model catalog is accessible:
```powershell
curl.exe -s -m 5 http://localhost:20128/v1/models -H "Authorization: Bearer sk-6ee0133d5be48b7b-6d4cb4-75c64f4c"
```

### Step 2: Environment Configuration (`.env.local`)
In `E:\project\Apps\KidNamingApp\app`, ensure `.env.local` exists (or copy from `.env.example`):
```powershell
cd E:\project\Apps\KidNamingApp\app
Copy-Item .env.example .env.local -Force
```
Default values in `.env.local`:
```ini
OMNIROUTE_BASE_URL=http://localhost:20128/v1
OMNIROUTE_API_KEY=sk-6ee0133d5be48b7b-6d4cb4-75c64f4c
OMNIROUTE_DEFAULT_MODEL=auto/best-free
OMNIROUTE_REASONING_MODEL=oc/deepseek-r1
DATABASE_URL=
NEXT_PUBLIC_ENABLE_ADS=true
NEXT_PUBLIC_ENABLE_SUBSCRIPTION_PAYWALL=false
NEXT_PUBLIC_SITE_URL=http://localhost:3020
```

### Step 3: Install Node Dependencies
```powershell
cd E:\project\Apps\KidNamingApp\app
npm install --prefer-offline --no-audit --no-fund
```

### Step 4: Run Automated Unit & Golden Tests
```powershell
npm test
```

### Step 5: Start the Local Development Server
```powershell
npm run dev
```
Open **[http://localhost:3020](http://localhost:3020)** in your browser.

---

## 4. Prerequisite Smoke Testing (`verify-local.ps1`)

Before starting manual testing, run [`app/verify-local.ps1`](../../../app/verify-local.ps1) (or execute the commands below) to verify every API route and UI page:

```powershell
cd E:\project\Apps\KidNamingApp\app
.\verify-local.ps1
```

### What `verify-local.ps1` Tests Automatically:
1. **Check 1 — OmniRoute AI Gateway (`:20128`)**: Confirms `/v1/models` returns `1570` models.
2. **Check 2 — Home Dashboard (`GET http://localhost:3020/`)**: Confirms HTTP `200 OK` and Tamil title rendering.
3. **Check 3 — SEO Name Detail Page (`GET http://localhost:3020/name/yazhini`)**: Confirms HTTP `200 OK`, Chaldean numerology, and 7D Scorecard rendering for `யாழினி (Yazhini)`.
4. **Check 4 — Names Search & Filter API (`GET /api/names?gender=girl&nakshatra=karthigai`)**: Confirms filtered Tamil names JSON response.
5. **Check 5 — Live OmniRoute AI Advisor (`POST /api/advisor`)**: Sends a live prompt to OmniRoute and verifies structured Tamil baby name recommendations with Chaldean numerology numbers.
6. **Check 6 — Public Name Suggestion + AI Moderation (`POST /api/suggestions`)**: Submits a sample Tamil name (`செங்கதிர் / Sengathir`) and verifies real-time AI review & confidence scoring.
7. **Check 7 — Family Social Poll API (`GET & POST /api/polls`)**: Confirms shortlist poll creation and family vote aggregation.

---

## 5. Manual Testing Walkthrough Checklist (For Product Owner)

Once you open **[http://localhost:3020](http://localhost:3020)** in your browser:

1. **Tab 1 — Explore Names (`பெயர் தேடல்`)**:
   - Type `யாழினி`, `Kavin`, or `Purananuru` in the search box.
   - Filter by **Gender** (`பெண் குழந்தை` / `ஆண் குழந்தை`), **Natchathiram** (e.g., `ரோகிணி`), **Numerology Number** (`1–9`), or **Origin Tradition** (`சங்கத் தமிழ்`).
   - Click **♥ Shortlist** on any card to add/remove names from your shortlist counter in the top hero banner.
   - Click **7D Scorecard & Details →** to open the quick modal and test the **"Report a Meaning or Citation Correction"** button, or click **SEO Page ↗** to view `/name/[slug]`.
2. **Tab 2 — Birth Star Finder (`நட்சத்திரக் கணிப்பு`)**:
   - Pick any Date of Birth and Time of Birth (IST).
   - Observe the live **Sidereal Moon Longitude**, **Lahiri Ayanamsa**, calculated **Natchathiram (1–27)**, **Padam (1–4)**, **Rasi**, auspicious starting Tamil syllable, and matching Tamil names.
3. **Tab 3 — Numerology Engine (`எண் கணிதம்`)**:
   - Enter any name in **English** (`Yazhini`) or **Tamil script** (`கவின்`).
   - Switch between **Chaldean (Cheiro)** and **Pythagorean** systems.
   - Check the **Letter-by-Letter breakdown**, **Name Number**, **Birth Number (Mulank)**, **Destiny Number (Bhagyank)**, **Compatibility Rating**, and **Phonetic Spelling Variants**.
4. **Tab 4 — 7D Scorecard (`7-பரிமாண மதிப்பீடு`)**:
   - Test any Tamil name + sibling names to see the 0–100 score across all 7 dimensions (Pronunciation, Tamil Akshara count, Meaning confidence, Literary roots, Sibling harmony, Spelling risk, Uniqueness).
5. **Tab 5 — OmniRoute AI Advisor (`OmniRoute AI ஆலோசகர்`)**:
   - Enter a custom prompt (e.g., *"Pure Sangam Tamil boy name starting with Ka or Ma meaning bravery"*) and click **Generate Tamil Name Recommendations** to see live OmniRoute AI results.
6. **Tab 6 — Family Poll (`குடும்ப வாக்கெடுப்பு`)**:
   - Create a poll from your shortlisted names and cast a sample relative vote (`♥ Love` or `✕ Vote-Out`) with a blessing comment.
7. **Tab 7 — Suggest a Name (`புதிய பெயர் பரிந்துரை`)**:
   - Submit a new Tamil baby name and watch OmniRoute AI review it, assign a confidence score, and auto-approve it into the catalog.
8. **Monetization & DPDP Verification**:
   - Verify the **Sponsored Ad Banner** (`AdSlot #TOP-DIRECTORY-01`), the **Free Community Access (Ads Supported)** status pill in the header, and the **DPDP Act 2023 Consent Banner** at the bottom of the screen.
