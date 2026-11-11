# 06 – Revenue Potential & Cost Estimation

> **All figures below are planning assumptions, not market data.** Replace with real numbers after competitor audit, keyword research and vendor quotes. The model is meant to show structure and sensitivity.

## 1. Market sizing (approach)
- India records on the order of **2+ crore (20+ million) births per year** (verify with latest SRS / UN figures).
- Reachable audience = expecting/new parents with smartphones and internet access, a fraction of births.
- Secondary audiences: people renaming/choosing business or pet names, people checking an existing name's numerology.

Funnel assumption (Year 1 → Year 3):

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Annual unique users | 200,000 | 800,000 | 2,000,000 |
| Registered users (25%) | 50,000 | 200,000 | 500,000 |
| Paying conversion (2%) of registered | 1,000 | 4,000 | 10,000 |

## 2. Revenue streams
| Stream | Model | Assumption | 
|---|---|---|
| Premium report | One-time ₹199–₹499 per detailed name report (numerology + scorecard + PDF) | Main paid product |
| Premium subscription | ₹99–₹149/month or ₹499/year for unlimited evaluations, poll analytics, ad-free | Smaller share |
| Ads | Display/native ads on web (CPM approx ₹30–₹100, verify) | Content/SEO traffic |
| Affiliate / partnerships | Baby products, photographers, naming-ceremony services, astrologer referrals | Commission-based |
| Expert consultation marketplace | Pundit/numerologist sessions, platform commission 20–30% | Later phase |
| B2B / API | Hospitals, maternity brands, gifting companies (naming certificates, keepsakes) | Later phase |

## 3. Illustrative revenue (base case)
| Item | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Premium reports (avg ₹299; 3% of registered buy 1 each) | ₹4.5 L | ₹18 L | ₹45 L |
| Subscriptions (avg ₹400/yr; 0.5% of registered) | ₹1 L | ₹4 L | ₹10 L |
| Ads (page views × RPM; assume 1.5 M / 6 M / 15 M PV at ₹50 RPM) | ₹0.75 L | ₹3 L | ₹7.5 L |
| Affiliate / partnerships | ₹0.5 L | ₹3 L | ₹10 L |
| Consultation & B2B | – | ₹2 L | ₹15 L |
| **Total (approx.)** | **₹7 L** | **₹30 L** | **₹87 L** |

(L = lakh = ₹100,000.) Sensitivity: results scale almost linearly with conversion rate; a 1% vs 3% conversion changes premium revenue 3×. User growth depends heavily on SEO and the poll's viral loop.

## 4. Cost estimation
### One-time build (MVP, ~5 months)
| Item | Estimate (₹) |
|---|---|
| Engineering team (backend, web, mobile, data) – 4–5 people × 5 months | 30–45 L |
| Design / UX | 3–5 L |
| Content & curation (numerology, meanings, references; linguists/scholars) | 8–15 L |
| Data acquisition / cleaning / OCR | 3–8 L |
| Legal (privacy policy, DPDP compliance, content licences) | 2–4 L |
| Contingency (15%) | 7–12 L |
| **Total one-time** | **≈ 53–89 L** |

### Recurring (monthly)
| Item | Estimate (₹/month) |
|---|---|
| Cloud hosting, database, search, CDN (early stage) | 30,000–1,00,000 |
| LLM / TTS API usage | 10,000–50,000 |
| Maintenance team (2–3 people) | 3–5 L |
| Marketing (SEO content, influencers, ads) | 1–3 L |
| Support, moderation, content curators | 0.5–1.5 L |
| App store / payment gateway fees | ~2–3% + ~₹25/yr Play/Apple fee per developer account tiers (verify) |
| **Total monthly** | **≈ 5–11 L** |

Annual run cost ≈ ₹60–130 L, which exceeds the base-case revenue in Years 1–2.

## 5. Break-even view
| Scenario | Annual revenue | Annual cost | Result |
|---|---|---|---|
| Base (above) | ₹7 L → ₹87 L | ₹60–130 L | Loss until Year 3+; near break-even only in Year 3 with lean spending |
| Lean (small team, 2 devs, outsourced content) | same | ₹25–40 L | Break-even around Year 2–3 |
| Optimistic (3× conversion, B2B deals) | ₹20 L → ₹2.5 Cr | ₹60–130 L | Profitable by Year 2–3 |

## 6. Conclusions
- Revenue potential is **moderate** as a standalone consumer app; paid conversion for name tools is typically low.
- The business becomes attractive if (a) SEO and social-poll virality keep acquisition cost near zero, and (b) premium reports plus B2B/partnerships are added.
- Recommend a **lean MVP** (web-first, numerology + evaluation + poll) and validating willingness to pay before building the full 1 crore dataset.
- Biggest cost drivers: data/content curation and people, not infrastructure.

## 7. Validation experiments (cheap)
1. Landing page + waitlist with price test (₹199 vs ₹299 report).
2. Build numerology + scorecard prototype and test with 100 parents.
3. Measure poll invite-to-signup conversion.
4. Get quotes for content curation and hosting to replace estimates here.

---

## 8. Revised view: building and running it solo with AI tools

> Added 2026-10-24. Sections 4–5 assume a 4–5 person team. This section re-estimates for **one founder using AI coding tools**. A second opinion on the effort split was drawn from OmniRoute (`auto/coding:free`, served by gpt-oss-120b); its table was partly inconsistent and its output was cut off, so the numbers below are my reconciled estimates, still **assumptions to validate**.

### 8.1 Can one person do it? – by work area
| Area | AI tools help? | Realistic effect | Residual human work |
|---|---|---|---|
| Web UI (React/Next.js), CRUD, auth, API | **Strongly** | Roughly 2–3× faster than hand-coding | Review, security checks, structure |
| Numerology calculator (3 methods) | **Strongly** | Deterministic maths; fast | Expert validation of letter tables and interpretation text |
| Social poll feature | **Strongly** | Standard patterns | Abuse prevention, privacy settings |
| PDF reports, ads, payments integration | **Well** | Library glue code | Payment/tax setup, testing real payments |
| Evaluation scorecard (spelling variants, length, family clash) | **Well** | Fast scaffolding | Domain rules per language |
| Pronunciation / meaning / references | **Partly** | AI can draft, but errors are likely | **Must be verified by a human expert** |
| Name data: cleaning, dedup, transliteration | **Partly** | AI writes scripts; does not make data trustworthy | Sampling and review per language |
| UI/UX polish, visual design | **Partly** | AI generates drafts | Taste and accessibility check, possibly a freelancer |
| Testing and QA | **Partly** | AI writes tests | Manual testing on real devices, multiple Indian-language scripts |
| Legal, compliance (DPDP Act), tax/GST | **No** | – | Professional review |
| Marketing, SEO strategy, community | **Partly** | AI drafts content | Distribution is still your effort |
| Native mobile apps | **Well** if using one cross-platform codebase | Slower than web due to store processes | Store compliance, device testing |

**Conclusion:** the *coding* is realistically one-person work with AI help. The *trust* part (meanings, references, numerology text, legal) and *distribution* are not, and they are where the remaining cost sits.

### 8.2 Timeline (solo)
| Scenario | Web MVP | Notes |
|---|---|---|
| Full-time | ~6–9 months | Data curation is the long pole, not coding |
| Part-time (evenings/weekends) | ~12–15 months | Risk of stalling is high |
| Reduced scope (3 languages, ~20k names, 2 numerology methods, poll, report) | ~3–4 months | Recommended first release |

### 8.3 Revised one-time cost (solo, lean)
| Item | Estimate (₹ lakh) | Avoidable? |
|---|---|---|
| Domain, SSL, company/GST basics | 0.1–0.3 | Domain unavoidable |
| Legal: privacy policy, terms, DPDP review, disclaimers | 1–2 | Not safely |
| Expert verification of meanings, references, numerology text | 2–4 | Reducible by shrinking scope (fewer languages/names) |
| UI/visual polish by a freelancer | 0.5–1 | Yes, partly |
| AI tool subscriptions during build (6 months) | 0.3–0.6 | Reducible with free tiers/OmniRoute |
| Contingency (15%) | 0.6–1.2 | – |
| **Total one-time** | **≈ 4.5–9** | vs ₹53–89 L for a team |

The founder's own time is **not** included. If you value it at, say, ₹50,000/month, add ~₹3–4.5 L for the build period.

### 8.4 Revised monthly running cost (solo)
| Item | Estimate (₹ lakh/month) | Notes |
|---|---|---|
| Hosting, database, search, storage | 0.1–0.3 | Start on small plans/free tiers |
| LLM / TTS API | 0.05–0.2 | Cache results; use free routes for non-critical drafts |
| Marketing (SEO content mostly AI-assisted, small ads) | 0.3–1.0 | Largest variable item |
| Part-time content reviewer/moderator | 0.2–0.5 | Quality control |
| Tool subscriptions, misc | 0.05 | – |
| Support and moderation | 0 | Done by you; time cost |
| **Total** | **≈ 0.7–2.0 L/month (₹8–24 L/year)** | vs ₹60–130 L/year with a team |

### 8.5 Break-even (solo vs team)
| Scenario | Year 1 revenue | Year 2 | Year 3 | Annual run cost | Reading |
|---|---|---|---|---|---|
| Base-case revenue (section 3) | ₹7 L | ₹30 L | ₹87 L | ₹8–24 L | Roughly break-even in year 2, profitable in year 3 if assumptions hold |
| Half the base-case revenue | ₹3.5 L | ₹15 L | ₹43 L | ₹8–24 L | Break-even in year 2–3 only with the low-cost end |
| Team model (section 5) | same | same | same | ₹60–130 L | Loss until year 3+ |

Total capital to reach year-2 break-even in the solo case is roughly ₹10–25 L (one-time plus first-year shortfall), versus several times that for a team.

### 8.6 What AI tools cannot remove
- Verified linguistic and scriptural content (trust is the product).
- Legal and privacy compliance, especially for family and children-related data.
- Getting users: SEO takes months; poll virality is unproven.
- Your own time and sustained effort for 1–2 years.

### 8.7 Risks of going solo and mitigations
| Risk | Mitigation |
|---|---|
| Wrong meanings/references damage trust | Show only verified entries as facts; label AI drafts; pay experts for samples |
| Burnout / stall | Narrow MVP, 4-week milestones, public waitlist for accountability |
| AI-generated code bugs and security gaps | Tests, code review prompts, managed auth and payment services, dependency scanning |
| Single point of failure (you) | Documentation, automated deployment, backups, simple architecture |
| Dependence on free AI routes (rate limits, model changes) | Treat OmniRoute free tiers as dev aid; keep a paid fallback for production features; cache outputs |
| Low conversion | Test price on a landing page before building the whole product |

### 8.8 Recommendation
**Conditional go.** Build a reduced-scope web MVP solo, using AI tools for code, and spend money only on expert verification and legal. Use stage gates:
1. Weeks 0–4: landing page, waitlist, 15 parent interviews. Continue if waitlist and interest are meaningful.
2. Months 1–4: MVP with 3 languages, ~20k verified names, numerology, scorecard, poll.
3. Month 5–6: launch, measure signups, poll invite conversion and paid conversion.
4. Expand languages, mobile app or hire help only if conversion supports it.

A reasonable decision rule: if paid conversion stays well below the 2–3% assumed after launch, treat the product as a content/SEO play rather than a paid app.
