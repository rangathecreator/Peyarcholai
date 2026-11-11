# 08 – Cost Model (Web + Mobile)

**Assumptions:** ₹88 ≈ US$1 · prices researched 2026-11-09 (±30%) · region Mumbai · architecture per doc 05 (offline-first, scale-to-zero) · taxes (GST 18% on foreign SaaS) not included unless noted.

## 1. One-time & annual fixed costs

| Item | Cost | Notes |
| :-- | :-- | :-- |
| Google Play developer account | $25 ≈ **₹2,200** (one-time) | 15% commission tier below US$1M revenue |
| Apple Developer Program | $99/yr ≈ **₹8,700/yr** | Small Business Program 15% commission |
| Domain (.in / .com) + email | ₹800–1,500/yr | |
| Swiss Ephemeris commercial licence (only if closed-source full Kundli) | ≈ CHF 700+ ≈ ₹75,000 one-time | Not needed in MVP (Moon-only via MIT lib) |
| Legal review (privacy policy, ToS, DPDP, content licences) | ₹30,000–60,000 | |
| Brand/UI design | ₹40,000–80,000 | Or freelance/AI-assisted |
| Name data curation (verification ₹3–5 × 20k) | ₹60,000–1,00,000 | |
| Expert advisor honoraria (12) | ₹30,000–60,000 | |
| Audio recordings of top 2k names (optional) | ₹30,000–50,000 | |

## 2. Monthly run cost by scale (INR)

| Component | MVP (≈5k MAU) | Growth (≈50k MAU) | Scale (≈500k MAU) |
| :-- | :-- | :-- | :-- |
| API compute (Cloud Run, scale-to-zero; 2M req/mo free) | 0–500 | 1,500–3,000 | 15,000–30,000 |
| Web hosting (Next.js on Cloud Run/Vercel/Cloudflare) | 0 | 0–1,800 | 3,000–8,000 (incl. in compute above if shared) |
| PostgreSQL (free tier → Supabase Pro $25 → HA instance) | 0–2,200 | 2,200–4,500 | 20,000–35,000 |
| Object storage + CDN (Cloudflare R2/CDN) | 0 | 300–800 | 5,000–10,000 |
| Search cache / extra index (only if needed) | 0 | 0 | 5,000–8,000 |
| Astrology API / ephemeris (Prokerala free → Ruby → Sapphire) | 0 | 0–3,400 | 9,000–18,000 |
| AI inference (OmniRoute free pools → paid fallback for assistant) | 0 | 500–3,000 | 15,000–30,000 |
| OmniRoute gateway VM (optional cloud-hosted) | 0–900 | 900 | 900–1,800 |
| Observability (Sentry/Grafana free → paid) | 0 | 0–2,300 | 8,000–12,000 |
| SMS OTP (₹0.4–1 per verification; default to Google/email login) | 0 | 1,000–5,000 | 10,000–30,000 |
| Misc (email, push is free via FCM, backups) | 200 | 500 | 3,000–5,000 |
| **Total / month** | **≈ ₹1,000 – 3,500** | **≈ ₹6,000 – 25,000** (typical ~₹12k) | **≈ ₹0.9 – 1.8 lakh** (typical ~₹1.3L) |
| **Cost per MAU / month** | ₹0.2–0.7 | ₹0.12–0.5 | ₹0.18–0.36 |

> **Key savers:** on-device numerology/nakshatra, SQLite offline snapshot, CDN-cached static name pages, batch AI at build time (not per request), guest mode (no SMS OTP), response caching of astrology API results.

## 3. Cost comparison – Web vs Mobile

| Aspect | Mobile apps | Web |
| :-- | :-- | :-- |
| Platform fees | ₹2,200 + ₹8,700/yr | None |
| Build effort | Shared with web via TS core (≈ +25% over web-only) | Baseline |
| Distribution | Stores (reviews, ratings) | SEO/organic (largest free acquisition channel for name searches) |
| Run cost | Same backend; push free | CDN-heavy; static pages cheap |
| Update cost | OTA (free tier 1k MAU updates; paid beyond) | Instant |
| **Recommendation** | Launch web + Android first; iOS after Android validation (saves ₹8,700 + review effort for ~2 months) | Launch first for SEO |

## 4. Build cost (people)

| Role | Effort (MVP, 12 wks) | Market cost | Founder-built cash cost |
| :-- | :-- | :-- | :-- |
| Full-stack/lead dev | 3 pm | ₹3.6L | ₹0 (self) |
| Mobile/frontend dev | 3 pm | ₹3.0L | ₹0–3.0L |
| UI/UX designer (part-time) | 1 pm | ₹0.6L | ₹0.4–0.8L |
| Data curator | 2 pm | ₹0.5L | ₹0.5L |
| QA (part-time) | 1 pm | ₹0.6L | ₹0.3L |
| Experts, legal, data verification | – | ₹2.2–3.2L | ₹2.2–3.2L |
| AI agents via OmniRoute (code/doc generation) | –30% dev effort | ₹0 | ₹0 |
| **Total** | | **≈ ₹10.5–12L** | **≈ ₹3.5–7.5L** |

## 5. Revenue sketch & break-even

> **Revised after reconciliation with the earlier study ([doc 12](12-Input-Reconciliation.md)).** The first version of this section used a premium price of ₹49–199 and a 1–2% monthly purchase rate, and showed a “strongly positive” margin because it counted infrastructure only. The input study (`doc/06`) uses ₹199–499 reports, 3% of registered users buying once, and includes marketing and reviewers. Its funnel is adopted below. **All numbers are planning assumptions, not market data.**

### 5.1 Revenue (input funnel, `doc/06` §1–3)

| Item | Year 1 | Year 2 | Year 3 |
| :-- | :-- | :-- | :-- |
| Annual unique users | 200,000 | 800,000 | 2,000,000 |
| Registered (25%) | 50,000 | 200,000 | 500,000 |
| Paying (2%) | 1,000 | 4,000 | 10,000 |
| Premium reports (avg ₹299, 3% of registered buy once) | ₹4.5L | ₹18L | ₹45L |
| Subscriptions (avg ₹400/yr, 0.5% of registered) | ₹1L | ₹4L | ₹10L |
| Ads (1.5M / 6M / 15M page views at ₹50 RPM) | ₹0.75L | ₹3L | ₹7.5L |
| Affiliate / partnerships | ₹0.5L | ₹3L | ₹10L |
| Consultation and B2B | – | ₹2L | ₹15L |
| **Total (approx.)** | **₹7L** | **₹30L** | **₹87L** |

### 5.2 Fully-loaded annual cost vs revenue

| Scenario | Annual cost | Y1 / Y2 / Y3 revenue | Reading |
| :-- | :-- | :-- | :-- |
| Infrastructure only (§2, growth tier) | ₹0.7–3L | ₹7L / ₹30L / ₹87L | Misleading on its own – excludes marketing, reviewers, people |
| **Solo + AI tools, fully loaded** (`doc/06` §8.4) | **₹8–24L** | same | Roughly break-even in year 2, profitable in year 3 if assumptions hold |
| Same, half the revenue | ₹8–24L | ₹3.5L / ₹15L / ₹43L | Break-even in year 2–3 only at the low-cost end |
| Team of 4–5 (`doc/06` §4) | ₹60–130L | same | Loss until year 3+ |

**Conclusion:** infrastructure is not the cost driver. The ₹1–3.5k/month MVP figure in §2 is only the cloud bill; marketing (₹0.3–1L/month) and expert/moderation work (₹0.2–0.5L/month) dominate. Break-even depends on paid conversion (2–3% assumed). If conversion stays well below that after launch, treat the product as a content/SEO play (decision rule from the input study).
Seasonality: naming is episodic, so retention is low and acquisition via SEO and WhatsApp/poll sharing is critical.

## 6. Sensitivity

| Scenario | Impact on monthly cost |
| :-- | :-- |
| Need SMS OTP login for all users | +₹5–30k at 50k–500k MAU |
| Self-host AI assistant on paid LLM at 10 req/MAU | +₹10–40k at 500k MAU |
| Swiss Ephemeris licence bought | +₹75k one-time, −₹9–18k/mo API at scale |
| Free-tier AI withdrawn | Switch to paid alias; batch pipeline ≈ ₹3–8k one-time for 60k names (cheap model) |
| Serving per-language snapshots | −30–50% egress |

## 6a. Fully-loaded monthly view (solo + AI, MVP→growth)

| Item | ₹ lakh / month | Source |
| :-- | :-- | :-- |
| Hosting, DB, search, storage | 0.01–0.25 | §2 |
| LLM/TTS | 0.05–0.2 | input `doc/06` §8.4 (cache; free routes for drafts) |
| Marketing (AI-assisted SEO, small ads) | 0.3–1.0 | input; largest variable item |
| Part-time reviewer / moderator | 0.2–0.5 | input |
| Tools, misc | 0.05 | input |
| **Total** | **≈ 0.7–2.0** (₹8–24L/yr) | input; plan infra figures sit inside this envelope |

Note: the input study lists “~₹25/yr Play/Apple fee”; the correct figures are $25 one-time (Google) and $99/yr (Apple).

## 7. Cost controls
* Budget alerts at 50/80/100% (GCP, Supabase, OmniRoute `x-omniroute-response-cost`).
* Monthly FinOps review in DMAIC Control phase (SS-07 C-12).

