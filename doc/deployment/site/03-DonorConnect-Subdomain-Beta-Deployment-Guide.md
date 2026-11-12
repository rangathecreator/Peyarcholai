# DonorConnect Subdomain Beta Deployment Guide (`peyar.donorconnect.in`)

**Document:** `doc/deployment/site/03-DonorConnect-Subdomain-Beta-Deployment-Guide.md`  
**Application:** பெயர்ச்சோலை (Peyarcholai) — Authentic Tamil Baby Names, Katapayadi Numerology & Cultural Insights  
**Subdomain Targets:** `peyar.donorconnect.in` (Active Primary) | `peyarcholai.donorconnect.in` & `names.donorconnect.in` (Optional Aliases)  
**Parent Ecosystem:** DonorConnect Infrastructure (`donorconnect.in` via Cloudflare, Vercel & Supabase)  
**Git Repository:** `https://github.com/rangathecreator/Peyarcholai.git` (`branch: main`)  
**Deployment Target Cost:** **₹0 / month** (Leverages existing DonorConnect Cloudflare and Vercel free-tier allowances)

---

## 1. Architectural Topology for Beta Release

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                   PUBLIC INTERNET                        │
                    └────────────────┬────────────────────────────────────────┘
                                     │  https://peyar.donorconnect.in
                                     │  (Optional aliases: peyarcholai / names)
                                     │
                    ┌────────────────▼────────────────────────────────────────┐
                    │              Cloudflare (donorconnect.in)               │
                    │   • Strict Full SSL + Edge Certificate                  │
                    │   • DNS CNAME Routing: peyar -> cname.vercel-dns.com    │
                    │   • Global CDN Edge Caching + WAF & DDoS Shield         │
                    └────────────────┬────────────────────────────────────────┘
                                     │
                    ┌────────────────▼────────────────────────────────────────┐
                    │               Vercel Edge / Serverless                  │
                    │   • Next.js 16.3.1 (App Router)                         │
                    │   • Root Directory: app/                                │
                    │   • Static ISR Pages (/name/[slug], /docs, /guide)      │
                    │   • Serverless API Routes (/api/names, /api/advisor,    │
                    │     /api/metrics, /api/polls, /api/reports/download-pdf)│
                    └────────────────┬────────────────────────────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
         ┌─────────────────────┐           ┌─────────────────────┐
         │ 70 High-Speed JSON  │           │   OmniRoute AI      │
         │ Shards (22,612 Recs)│           │   Gateway / Fallback│
         │ (<25ms In-Memory)   │           │   (Cultural Advisor)│
         └─────────────────────┘           └─────────────────────┘
```

---

## 2. DonorConnect Subdomain Cloudflare DNS Setup

Log in to the **Cloudflare Dashboard** managing the `donorconnect.in` zone.

### Step 2.1: Add DNS CNAME Records

Navigate to **DNS** -> **Records** and click **Add Record**:

| Type | Name | Target | Proxy Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `peyar` | `cname.vercel-dns.com` | **DNS Only** (Grey Cloud)* | **Active Primary Beta Subdomain** |
| **CNAME** | `names` | `cname.vercel-dns.com` | **DNS Only** (Grey Cloud)* | Optional short alias subdomain |
| **CNAME** | `peyarcholai` | `cname.vercel-dns.com` | **DNS Only** (Grey Cloud)* | Optional full brand alias subdomain |

> [!IMPORTANT]
> **Why DNS Only initially (Grey Cloud):** Per DonorConnect's proven deployment observations in [`cloudflare_validation.md`](file:///E:/project/donorconnect/doc/Deployment/FirstDeployment/validation/cloudflare_validation.md), Vercel requires direct DNS verification to generate its initial Let's Encrypt / DigiCert origin SSL certificate.  
> **Action:** Leave as **DNS Only** for the first 5 minutes until Vercel shows **"Valid Configuration"** with a green checkmark. Then, switch to **Proxied (Orange Cloud)** to activate Cloudflare's global edge caching, DDoS protection, and WAF rules.

### Step 2.2: Verify Cloudflare SSL/TLS Settings
Confirm that the existing settings for `donorconnect.in` are applied to the subdomain:
1. **SSL/TLS Mode**: **Full (Strict)** (`SSL/TLS` -> `Overview`).
2. **Edge Certificates**:
   - **Always Use HTTPS**: `ON`.
   - **Automatic HTTPS Rewrites**: `ON`.
   - **Minimum TLS Version**: `TLS 1.2`.

---

## 3. Vercel Project Setup & Git Deployment

### Step 3.1: Connect Repository to Vercel
1. Log in to [vercel.com](https://vercel.com) using your GitHub account (`rangathecreator`).
2. Click **Add New...** -> **Project**.
3. Import the repository: `rangathecreator/Peyarcholai`.

### Step 3.2: Configure Build & Development Settings
In the Project Configuration screen, set:
- **Framework Preset**: `Next.js`
- **Root Directory**: Click `Edit` and select **`app`** (or ensure root [`vercel.json`](file:///e:/project/Apps/KidNamingApp/vercel.json) points to `"rootDirectory": "app"`).
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

### Step 3.3: Set Environment Variables
In the **Environment Variables** section, copy the values from [`app/.env.production.example`](file:///e:/project/Apps/KidNamingApp/app/.env.production.example):

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://peyar.donorconnect.in
NEXT_PUBLIC_APP_NAME="பெயர்ச்சோலை (Peyarcholai)"
NEXT_PUBLIC_ENABLE_ADS=false
NEXT_PUBLIC_ENABLE_SUBSCRIPTION_PAYWALL=true

# OmniRoute AI Advisor
OMNIROUTE_BASE_URL=https://api.donorconnect.in/v1
OMNIROUTE_API_KEY=your_omniroute_api_key_or_placeholder
OMNIROUTE_DEFAULT_MODEL=auto/best-fast

# Authentication Token Secret
JWT_SECRET=4f9b8c2e1d7a5e3f6b0a8c2d4e1f7a9b0c2e4f6a8b1c3d5e7f9a1b3c5d7e9f1a
```

Click **Deploy**. Vercel will build the project, run TypeScript checks, generate static pages, and deploy to a `*.vercel.app` URL.

### Step 3.4: Attach Custom Subdomains in Vercel
1. In your Vercel Project Dashboard, navigate to **Settings** -> **Domains**.
2. Add Domain: **`peyar.donorconnect.in`** (Primary Domain).
   - Vercel will verify the CNAME pointing to `cname.vercel-dns.com`.
3. (Optional) Add Domain: `names.donorconnect.in` or `peyarcholai.donorconnect.in`.
   - Choose: **Redirect to peyar.donorconnect.in** (301 Permanent redirect).
4. Once Vercel shows **Valid Configuration** (Green checkmark), return to Cloudflare and toggle `peyar` to **Proxied (Orange Cloud)**.

---

## 4. Pre-Launch Beta Verification & Smoke Test Protocol

Before announcing the beta release, run the following validation tests:

### 4.1 DNS Propagation
Check globally via [dnschecker.org](https://dnschecker.org):
- Query `peyar.donorconnect.in` (CNAME): Must resolve cleanly to `cname.vercel-dns.com` (or Cloudflare proxy IPs `104.x.x.x` when proxied).

### 4.2 HTTPS & Certificate Verification
Open an incognito browser window and visit:
- `https://peyar.donorconnect.in`
- Verify the padlock icon indicates a valid SSL/TLS certificate.
- Test HTTP to HTTPS redirection: `http://peyar.donorconnect.in` must automatically redirect to `https://`.

### 4.3 Feature Smoke Test Matrix

| # | Feature / URL | Expected Result | Pass Criteria |
| :--- | :--- | :--- | :--- |
| 1 | **Home Explorer** (`/`) | Loads 22,612 names across 70 shards | Tab counts match; pagination & search work in < 50ms |
| 2 | **First Letter Bar** (`முதல் எழுத்து`) | Clicking `க`, `ம`, `வ` filters names instantly | Correctly filters catalog without full page reload |
| 3 | **Nakshatra Finder** | 27 birth stars with Padam syllables | Selecting a star updates candidate names list |
| 4 | **Numerology Engine** | Katapayadi, Chaldean, Pythagorean | Master Numbers (11, 22, 33) & 10–75 compound cards render |
| 5 | **7D Scorecard Modal** | Click any name -> Detail modal opens | Modal fits within screen viewport; displays Radar and Sandhi analysis |
| 6 | **Name Dossier Page** (`/name/tamilisai`) | Server-rendered SEO deep dive | All 14 dimensions, Madras Lexicon headwords, and citations load |
| 7 | **Download PDF Dossier** (`/api/reports/download-pdf?slug=tamilisai`) | Triggers vector printable certificate | Generates clean A4 portrait PDF |
| 8 | **Health & Metrics** (`/api/metrics`) | Returns Prometheus telemetry | HTTP 200 with uptime and request counts |
| 9 | **Docs & Guide** (`/docs` & `/guide`) | Comprehensive feature manual | Complete bilingual user guide renders cleanly |

---

## 5. Ongoing Beta Release Operations

- **Continuous Deployment**: Any commit pushed to the `main` branch of `rangathecreator/Peyarcholai` triggers an automatic, zero-downtime production deployment on Vercel.
- **Rollback Capability**: In Vercel's **Deployments** tab, any previous build can be instantly rolled back with a single click.
- **Monitoring**: Real-time traffic, function execution durations, and HTTP status codes are available in the Vercel **Analytics** and Cloudflare **Analytics** tabs.


