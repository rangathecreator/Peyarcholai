# 12 – Input Reconciliation (KidNamingApp/doc → plan)

The earlier study in `doc/00…07` (the “input docs”) was taken as input. This file records what was adopted, what changed, and where the two disagreed. Input docs are left untouched.

## 1. Traceability

| Input doc | Key content | Where integrated |
| :-- | :-- | :-- |
| 00 Feasibility Master | Validate-first approach, web-first, conditional go, open questions | Roadmap Phase 0/gate G0 (doc 10, SS-08); open questions §4 below |
| 01 Numerology Methods | Chaldean/Pythagorean/Cheiro-style, nakshatra as astrology not numerology, no standard for Indic scripts, references “verify” | Doc 03 §1, §4 (reference-verification rule, Indic-script caveat); letter tables cross-checked ✔ identical |
| 02 Name Data Sources | “1 crore” = variants/occurrences, avoid electoral rolls/social scraping, census not a source, partnerships for aggregate frequency | Doc 02 §8 (new); doc 04 (frequency table) |
| 03 Evaluation Engine | 7-dimension scorecard (pronunciation, length/akshara, meaning, references, family match, misspelling, uniqueness) | Doc 01 FR-20…23; doc 04 §7; doc 06; SS-05 F-22 |
| 04 Social Poll | Shortlist ≤10, relatives pick names to *remove* with reason categories, parent decides | Doc 01 FR-19; doc 05 §11 (sequence + module); doc 04 ER; doc 11 §6; SS-05 F-21 |
| 05 Competitor Analysis | Competitor groups, differentiators, AI-chatbot threat; not verified | SS-06 R-19; doc 10 Phase 0 task “competitor audit”; still **unverified** |
| 06 Revenue & Cost | Team ₹53–89L build, ₹60–130L/yr run; solo ₹4.5–9L build, ₹8–24L/yr run; base revenue ₹7L→₹30L→₹87L | Doc 08 §5, §6a (reconciled) |
| 07 Value-Add Features | Prioritised list (initials check, Aadhaar-friendliness, namakaran planner, NRI usability…) | Doc 01 FR-24…27 and §3 backlog |

## 2. Conflicts and how they were resolved

| # | Topic | Input docs say | First plan said | Resolution |
| :-- | :-- | :-- | :-- | :-- |
| 1 | **Run cost** | Solo ₹0.7–2.0L/month (₹8–24L/yr), mostly marketing and reviewers | Infra only: ₹1–3.5k/month MVP | **Both are right for different scopes.** Infra ≠ total. Doc 08 now shows infra, plus fully-loaded cost (marketing, reviewers, tools). The infra figure must not be read as “cost to run the business” |
| 2 | **Build cost** | Solo ₹4.5–9L; team ₹53–89L | ₹3.5–7.5L founder / ₹10.5–12L market | Same order as the input’s *solo* case. Team case (₹53–89L) assumed 4–5 people × 5 months with larger content budget; kept as an upper bound |
| 3 | **Profitability** | Break-even year 2 (solo), loss until year 3+ (team) | “Strongly positive margin” at 50k MAU | **First plan was too optimistic**: it ignored marketing, moderation and paid-conversion risk. Corrected in doc 08 §5 using the input funnel (2% paid conversion) |
| 4 | **Timeline** | Web MVP 3–4 months reduced scope; 6–9 months full-time | 12 weeks to MVP, launch wk 16 | Compatible only with reduced scope and AI-assisted coding. Plan now states: 16 weeks **after** a 4-week validation phase; slips likely if data curation lags |
| 5 | **MVP scope** | 3 languages, ~20k verified names | 20k names, 8 languages | **Adopt input: 3 languages in MVP** (Hindi + 2 chosen by owner, see §4); other languages from v1 |
| 6 | **Platform order** | Web first, mobile later | Web + Android at launch | **Adopt input: web-first**; Android after traction evidence (keeps shared TS core ready) |
| 7 | **Search store** | Postgres + OpenSearch | Postgres only | Keep Postgres (trgm/FTS) to ≤150k names; OpenSearch only if p95 > 300 ms. Different scale assumptions |
| 8 | **Social poll** | P1 differentiator | Not in first plan | **Added** to MVP scope |
| 9 | **Store fees** | “~₹25/yr Play/Apple” | $25 one-time Play, $99/yr Apple | Input figure is wrong; plan figures stand (verify at purchase) |
| 10 | **Numerology letter tables** | Chaldean/Pythagorean tables | Same tables | ✔ identical; no conflict |
| 11 | **Free AI quality** | OmniRoute `auto/coding:free` second opinion was “partly inconsistent and cut off” | Free tiers for drafting | Plan retains human verification; **analysis-grade review must use a reasoning model**, not `auto/*:free` (doc 09 §2) |
| 12 | **Location** | Input says docs in `E:\project\KidNamingApp\doc` | – | Actual location is `E:\project\Apps\KidNamingApp`; this plan lives in `doc/plan/` |

## 3. Decisions carried forward from the input docs
1. **Validate before building** (landing page, waitlist, 15–20 parent interviews, competitor audit, price test ₹199 vs ₹299).
2. **Decision rule:** if paid conversion stays well below 2–3% after launch, treat the product as a content/SEO play.
3. **Trust is the product:** only verified entries are shown as fact; AI drafts are labelled.
4. **Parent is always the decider** (poll design); no pressure/shaming features.
5. Uniqueness score is labelled *estimate* until real frequency data exists.

## 4. Open questions for the product owner (carried from input doc 00)
| # | Question | Impact | Default if unanswered |
| :-- | :-- | :-- | :-- |
| Q1 | Which 3 languages in MVP? | Content/curation cost, expert hiring | Hindi + Tamil + Telugu |
| Q2 | Solo or team? | Cost model (doc 08 §8), timeline | Solo + AI agents + freelancers |
| Q3 | Free-with-ads, premium, or B2B-first? | Revenue, architecture (paywall) | Freemium web, ads on SEO pages |
| Q4 | Who curates meanings/references? | Quality, SS-07 controls | Paid expert advisors per language |
| Q5 | Working name: *NamingGuru* or *KidNamingApp*? | Branding, domain | NamingGuru (folder name kept) |

### 4.1 Product-owner answers (2026-11-09)
| # | Decision | Consequences for the plan |
| :-- | :-- | :-- |
| Q1 | **Tamil only** for MVP (single language/region: Tamil Nadu + Tamil diaspora). | Name pool target shifts to ~20k Tamil canonical names; Tamil script + transliteration search; Tamil nakshatra/rasi syllables; Tamil-first UI (English secondary). Hindi/Telugu deferred to v1. |
| Q2 | **Lean, near-zero budget.** AI models for dev and runtime; **reuse existing donorconnect.in infra**. | Deploy as a service beside donorconnect.in (shared host/DB server, separate DB/schema, subdomain e.g. names.donorconnect.in); drop Cloud Run/managed-DB costs from doc 07/08 MVP; use cost-capped AI calls with caching. |
| Q3 | **Ads from day one; subscription later** once subscriber base is considerable. | Ad slots on SEO pages; build entitlement/paywall hooks but keep them disabled; consent banner (DPDP) for ad personalization. |
| Q4 | **AI curates**: AI generates/reviews meanings from online sources with citations. No staff now; later public suggestions, AI-reviewed and approved. | Pipeline: source fetch → AI draft → AI cross-check (multi-source) → confidence score → publish only if above threshold; label "AI-verified"; suggestion queue with AI moderation later. |

> [!WARNING]
> Q4 conflicts with the earlier "trust is the product" and SS-07 C-08 (expert validation of astrological tables). Mitigation: show confidence + source links, publish low-confidence entries as "unverified", add a user "report error" button, and spot-check a sample with a Tamil scholar/volunteer before launch when possible.
