# 01 — Six-Sigma Revenue, Cost vs. Profit & Scale Review (Peyarcholai)

**Document Path:** `doc/revenuePlan/01-Six-Sigma-Cost-Vs-Profit-Scale-Review.md`  
**Methodology:** Six Sigma DMAIC + Unit Economics (`CTQ` = Contribution Margin `>= 80%`, `DPMO <= 3.4` billing/entitlement defects)  
**Baseline Architecture (2026-11-15):**  
- **Catalog:** `150,024` active names in `393` `.json.gz` shards (`22.94 MB` total — zero managed Elastic/Algolia search cost)  
- **Deterministic Engines (`₹0` marginal API cost):** Dual Numerology + *Katapayadi*, Parent-Surname Resonance (`Task 32`), 27-Nakshatra *Lahiri* Ephemeris, 7D Scorecard, Cohort Frequency (`Task 20`), Web Speech Pronunciation (`Task 33`), Printable Single Dossier & Multi-Name Family Booklet (`Tasks 18, 31, 34`)  
- **AI Gateway:** Self-hosted **OmniRoute** on HP Z4 via **Cloudflare Tunnel (`Task 23`)** (`₹0` token cost for local/free-tier pools; deterministic catalog fallback when offline)  
- **Scaling Path (`Task 16I`):** Vercel (`< 100k` MAU) → GCP Cloud Run + Cloud SQL (`> 100k` MAU)

---

## 1. Define (D) — Six-Sigma CTQ (Critical-to-Quality) Financial Targets

| CTQ ID | Financial / Operational Metric | Six-Sigma Target | Current Architecture Enabler |
| :--- | :--- | :--- | :--- |
| **CTQ-REV-1** | Gross Contribution Margin per Paid Order | `>= 90%` (after gateway + infra) | Zero external astrology/search/TTS API fees; self-hosted OmniRoute + deterministic TS engines. |
| **CTQ-REV-2** | Fixed Monthly Burn (`< 10k MAU`) | `<= ₹2,000 / mo` | Vercel Hobby/Pro + Neon Free/Launch + `22.94 MB` static `.json.gz` catalog. |
| **CTQ-REV-3** | Payment Gateway + Tax Leakage | `<= 2.36%` gateway (`2% + GST on fee`) | Razorpay/UPI domestic rails; clear GST treatment (`TODO.md` Task 29A). |
| **CTQ-REV-4** | Billing / Entitlement Defect Rate | `DPMO <= 3.4` (`0` unlocked leaks / `0` failed paid downloads) | Server-side tier checks (`kudumba_499` / `suvadi_49`) + webhook idempotency. |

---

## 2. Measure (M) — Unit Economics per Tier (`₹0`, `₹49`, `₹499`)

*(Planning assumptions — `1 USD ≈ ₹85`; Razorpay domestic UPI/Card fee assumed at `2.0% + 18% GST on fee = 2.36%`.)*

| Metric | Free Explorer (`₹0`) | `₹49` Suvadi Nilai *(14-Day)* | `₹499` Kudumba Nool *(30-Day)* |
| :--- | :---: | :---: | :---: |
| **Gross Price** | `₹0` | `₹49.00` | `₹499.00` |
| **Payment Gateway Fee (`2.36%`)** | `₹0` | `-₹1.16` | `-₹11.78` |
| **Marginal Compute + PDF + AI Cost** | `~₹0.05` *(AdSense offsets)* | `~₹0.15` *(serverless HTML/PDF)* | `~₹1.50` *(AI Advisor + Poll DB)* |
| **Net Contribution per User/Order** | `+₹0.35 – ₹1.20` *(AdSense RPM)* | **`+₹47.69` (`97.3%` margin)** | **`+₹485.72` (`97.3%` margin)** |
| **If 18% GST Included in Price** *(Pending Task 29A)* | `₹0` | `₹41.53` ex-GST → **`+₹40.22` net** | `₹422.88` ex-GST → **`+₹409.60` net** |

> **Key Insight:** Because our `150k` catalog, Dual Numerology, Nakshatra, Pronunciation, and PDF Booklet engines run **deterministically without paid third-party APIs**, **Peyarcholai achieves `~97%` pre-GST gross margin** (`~82%` post-GST) even on the `₹49` micro-pass!

---

## 3. Analyze (A) — Cost vs. Profit Across 4 Scale Stages

Assumptions across stages (conservative **1.5% total paid conversion**: `1.0%` buy `₹49` + `0.5%` buy `₹499`, plus `₹45` AdSense RPM at `6` pageviews/MAU for Free users):

| Scale Stage | Monthly Active Users (MAU) | Infrastructure Stack | Monthly Fixed + Variable Infra Cost (`₹`) | Monthly Gross Revenue (`₹`) | Monthly Net Profit (`₹`) | Net Margin |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: |
| **Stage 1: Beta / Launch** | **5,000 MAU** | Vercel Hobby (`₹0`) + Neon Free (`₹0`) + Cloudflare Free (`₹0`) + HP Z4 OmniRoute (`₹0`) + Domain (`~₹70/mo`) | **~₹300** *(incl. gateway fees)* | **₹16,275**<br>*(50×₹49 + 25×₹499 + ₹1,350 Ads)* | **`+₹15,975`** | **98.2%** |
| **Stage 2: Growth (Vercel Threshold)** | **50,000 MAU** | Vercel Pro (`₹1,700`) + Neon Launch (`₹1,600`) + Cloudflare Free (`₹0`) + HP Z4 OmniRoute + Gateway (`₹3,520`) | **~₹6,820** | **₹1,62,750**<br>*(500×₹49 + 250×₹499 + ₹13,500 Ads)* | **`+₹1,55,930`** | **95.8%** |
| **Stage 3: Scale Switch (`>100k` GCP)** | **250,000 MAU** | **GCP Cloud Run** (`common-scaling-router`, `₹12,000`) + **Cloud SQL Postgres** (`₹8,500`) + Cloudflare Pro (`₹1,700`) + Cloud LLM burst (`₹8,000`) + Gateway (`₹17,600`) | **~₹47,800** | **₹8,13,750**<br>*(2,500×₹49 + 1,250×₹499 + ₹67,500 Ads)* | **`+₹7,65,950`** | **94.1%** |
| **Stage 4: National / Diaspora Scale** | **1,000,000 MAU** | Multi-Region GCP Cloud Run + Cloud SQL HA (`₹55,000`) + CDN/WAF (`₹8,000`) + Burst LLM (`₹25,000`) + Support/Ops (`₹45,000`) + Gateway (`₹70,400`) | **~₹2,03,400** | **₹32,55,000**<br>*(10k×₹49 + 5k×₹499 + ₹2.7L Ads)* | **`+₹30,51,600`** | **93.8%** |

*(Note: If marketing/CAC spend of `20–30%` of revenue is added in Stages 3–4, operating profit remains `64–74%`.)*

---

## 4. Improve (I) — Six-Sigma Sensitivity & Break-Even Analysis

1. **Break-Even Point:**
   - **Stage 1 (`₹300/mo`):** Breaks even at **just 1 `₹499` order OR 7 `₹49` orders per month**.
   - **Stage 2 (`₹3,300/mo` fixed):** Breaks even at **7 `₹499` orders/month** (`0.014%` conversion at `50k` MAU).
2. **Highest-Leverage Profit Drivers (DMAIC Pareto 80/20):**
   - **`₹49` → `₹499` Upgrade Conversion (`/why-peyarcholai` + Tasks 31–34):** Every `0.1%` lift in `₹499` conversion at `50k` MAU adds **`+₹24,950/month`** in nearly pure profit.
   - **Viral WhatsApp Poll Loop (`Task 17A/17B`):** Each `₹499` family poll invites `4–8` relatives; if `10%` of expecting relatives convert later, effective CAC drops toward `₹0`.
   - **Gzip Shard Bundling (`22.94 MB`):** Eliminates `₹15,000–₹40,000/month` in managed vector/search DB costs during Stages 1–2.

---

## 5. Control (C) — Financial & Operational Control Gates

| Control Trigger | Threshold | Automated / Operational Action |
| :--- | :--- | :--- |
| **Vercel Bandwidth / Invocation Spike** | `>= 80k MAU` or `>= 80%` Vercel Pro quota | Trigger **Task 16I** (`common-scaling-router`) DNS/traffic cutover from Vercel to GCP Cloud Run. |
| **HP Z4 OmniRoute Downtime** | `> 5s` timeout or workstation offline | Automatically fall back to deterministic catalog AI Advisor (`₹0` cost, `0` failed user requests). |
| **Refund / Chargeback Rate (`LEG-07`)** | `> 1.0%` of paid orders | Audit UI expectation alignment (`ContextualDisclaimer`, preview watermark clarity) before scaling paid ads. |
| **AdSense RPM Drop / Policy Flag (`LEG-08`)** | RPM `< ₹20` or policy warning | Verify `ads.txt`, suppress ads on error/checkout routes, and tighten placement density. |
