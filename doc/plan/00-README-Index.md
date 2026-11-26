# பெயர்ச்சோலை (Peyarcholai) – Planning & Feasibility Documentation

**Version:** 3.0 | **Date:** 2026-11-26 | **Status:** Active (`https://peyar.donorconnect.in` · Branch `dev19Nov2026`) | **Master Index:** [`doc/README.md`](../README.md)

Peyarcholai helps Indian parents pick a baby name that fits **tradition (horoscope / nakshatra), numerology, community & region, meaning, empirical cohort rarity (Grade B + Grade A hybrid), and ease of pronunciation**.

## Repo layout

| Folder | Purpose |
| :-- | :-- |
| [`doc/README.md`](../README.md) | **Master Documentation Index** cataloging every folder & file in `doc/`. |
| `doc/plan/` (this folder) | Strategic planning, value audits, feature specs, and Six Sigma (`six-sigma/`). |
| `doc/00…07-*.md` | **Earlier study (input)** – left untouched; reconciled in [doc 12](12-Input-Reconciliation.md). |
| `app/` | Next.js 15 TypeScript web app (`122` routes), 393 `.json.gz` shards (`150,024` active names), `82/82` tests PASS, `graphify-out/` AST index (`1,754` nodes, gitignored). |

## Document map

| # | Document | Answers |
| :-- | :-- | :-- |
| 01 | [Vision, Scope & Requirements](../requirements/01-Vision-Scope-Requirements.md) | What are we building, for whom, functional and non-functional requirements, use-case UML |
| 02 | [Name Sourcing Strategy](../requirements/02-Name-Sourcing-Strategy.md) | 150K+ name sourcing, 3-tier cultural classification, and 14 parent-centric dimensions |
| 03 | [Numerology & Horoscope Engine Spec](../design/01-Numerology-Horoscope-Engine-Spec.md) | How the calculator and horoscope matching work |
| 04 | [Data Model & Taxonomy](../design/02-Data-Model-Taxonomy.md) | Classification dimensions, ER diagram, scoring |
| 05 | [Architecture & UML](../design/03-Architecture-UML.md) | Component, sequence, class, deployment, state and activity diagrams |
| 06 | [Technical Feasibility Study](06-Technical-Feasibility-Study.md) | End-to-end feasibility with verdicts and risks |
| 07 | [Deployment & DevOps](../deployment/01-Deployment-DevOps-Overview.md) | Environments, CI/CD, release of web + mobile |
| 08 | [Cost Model](08-Cost-Model.md) | Build and run cost for web and mobile at 3 scales |
| 09 | [OmniRoute AI Usage Plan](09-OmniRoute-AI-Usage-Plan.md) | Where OmniRoute and reasoning models are used (dev + runtime) |
| 10 | [Roadmap & WBS](10-Roadmap-WBS.md) | Phases, milestones, work breakdown |
| 11 | [Legal, Privacy & Ethics](../legal/02-Legal-Privacy-Ethics.md) | DPDP Act, content licensing, astrology disclaimers, poll privacy |
| 12 | [Input Reconciliation](12-Input-Reconciliation.md) | How the earlier study (`doc/00…07`) was integrated; conflicts and resolutions; open questions |
| 13 | [Web MVP Implementation & Design](../implementation/01-Web-MVP-Implementation.md) | Implemented Tamil-first Next.js Web MVP architecture, OmniRoute AI integration, core engines, and API reference |

## Categorized Documentation Structure (`doc/`)

| Folder | Contents |
| :-- | :-- |
| [`doc/TODO/`](../TODO/) | [Master TODO Tracker](../TODO/TODO.md) & Iteration Logs (`TODO-Iteration*.md`). |
| [`doc/plan/`](./) | Master planning index, roadmap & WBS, cost model, OmniRoute AI usage plan, input reconciliation, and Six Sigma (`six-sigma/`). |
| [`doc/requirements/`](../requirements/) | [01 Vision, Scope & Requirements](../requirements/01-Vision-Scope-Requirements.md), [02 Name Sourcing Strategy](../requirements/02-Name-Sourcing-Strategy.md), [04 Tamil MVP Requirements Summary](../requirements/04-Tamil-MVP-Requirements-Summary.md), [05 Literary Sources](../requirements/05-Literary-Sources-Tolkappiyam-Ramayanam-Directory.md), [06 User Guide](../requirements/06-User-Guide-And-Feature-Manual.md). |
| [`doc/design/`](../design/) | [01 Numerology & Horoscope Engine Spec](../design/01-Numerology-Horoscope-Engine-Spec.md), [02 Data Model & Taxonomy](../design/02-Data-Model-Taxonomy.md), [03 Architecture & UML](../design/03-Architecture-UML.md), [04 Web MVP System Design](../design/04-Web-MVP-System-Design.md), [05 Large Catalog Scaling](../design/05-Large-Catalog-Storage-And-Scaling-Architecture.md), and `micro_designs/`. |
| [`doc/implementation/`](../implementation/) | [01 Web MVP Implementation & Technical Design](../implementation/01-Web-MVP-Implementation.md). |
| [`doc/revenuePlan/`](../revenuePlan/) | [01 Six-Sigma Cost vs Profit Scale Review](../revenuePlan/01-Six-Sigma-Cost-Vs-Profit-Scale-Review.md), [02 Three-Tier Monetization](../revenuePlan/02-Three-Tier-Monetization-Architecture.md), [03 Payment Gateway](../revenuePlan/03-Payment-Gateway-Integration-Web-And-Mobile.md), [04 Beta Release Checklist](../revenuePlan/04-Beta-Release-Checklist-Free-Tier.md). |
| [`doc/legal/`](../legal/) | [01 Legal Compliance & Data Checklist](../legal/01-Legal-Compliance-And-Data-Checklist.md), [02 Legal, Privacy & Ethics](../legal/02-Legal-Privacy-Ethics.md). |
| [`doc/deployment/`](../deployment/) | [01 Deployment & DevOps Overview](../deployment/01-Deployment-DevOps-Overview.md), [04 OmniRoute Cloudflare Tunnel Guide](../deployment/04-OmniRoute-Cloudflare-Tunnel-Guide.md), `local/`, and `site/`. |
| [`doc/testing/`](../testing/) | [01 Test Plan & Validation Report](../testing/01-Test-Plan-And-Validation-Report.md), [06 Six-Sigma Quality Guardrails](../testing/06-Six-Sigma-Quality-Guardrails.md), and QA Acceptance Criteria. |
| [`doc/bugs/`](../bugs/) | [01 Bug Tracker & Known Issues](../bugs/01-Bug-Tracker-And-Known-Issues.md). |

### Six Sigma quality pack (`doc/six-sigma/`)

| ID | Document | DMAIC phase |
| :-- | :-- | :-- |
| SS-01 | [Project Charter](six-sigma/SS-01-Project-Charter.md) | Define |
| SS-02 | [VOC & CTQ Tree](six-sigma/SS-02-VOC-CTQ.md) | Define |
| SS-03 | [SIPOC](six-sigma/SS-03-SIPOC.md) | Define |
| SS-04 | [Measurement Plan & Sigma Targets](six-sigma/SS-04-Measurement-Plan-Sigma-Targets.md) | Measure |
| SS-05 | [FMEA](six-sigma/SS-05-FMEA.md) | Analyze |
| SS-06 | [Risk Register](six-sigma/SS-06-Risk-Register.md) | Analyze / Improve |
| SS-07 | [Control Plan](six-sigma/SS-07-Control-Plan.md) | Control |
| SS-08 | [DMAIC Tracker & Quality Gates](six-sigma/SS-08-DMAIC-Tracker-Quality-Gates.md) | All |

## Executive summary (one page)

| Question | Answer |
| :-- | :-- |
| Is it feasible? | **Conditional yes.** Numerology is deterministic and runs offline on the device. The hard parts are *data quality*, *horoscope licensing* and *proving demand/paid conversion*, not engineering. Validate first (gate G0). |
| Differentiators | Verified cited names, transparent multi-method numerology, nakshatra letters, **7-dimension evaluation scorecard**, **social “vote-out” poll** (from the earlier study). |
| Biggest risks | (1) Name-data accuracy/licensing, (2) low paid conversion vs. fully-loaded cost, (3) AI chatbots and big portals, (4) Swiss Ephemeris AGPL, (5) cultural/religious correctness. |
| Recommended stack | Next.js web first, then Expo React Native (Android/iOS); shared TypeScript core; NestJS modular monolith; PostgreSQL (+`pg_trgm`); Cloudflare CDN; Cloud Run (Mumbai). |
| Name pool target | Distinct canonical names: **MVP 20,000 (3 languages) → v1 60,000 → v2 150,000+**. “1 crore” is reachable only as variants/occurrences (doc 02 §8). |
| Cloud bill | **~₹1–3.5k/month** MVP, **~₹6–25k** at 50k MAU, **~₹0.9–1.8L** at 500k MAU. |
| **Fully-loaded run cost** | **₹8–24L/year solo + AI tools** (marketing and reviewers dominate); ₹60–130L/year with a 4–5 person team (doc 08 §5.2). |
| Revenue (planning assumption) | ₹7L → ₹30L → ₹87L over years 1–3; break-even ≈ year 2 solo if 2–3% paid conversion holds. |
| One-time costs | Google Play ≈ ₹2,200; Apple ≈ ₹8,700/yr; solo build ≈ ₹4.5–9L incl. legal and expert verification (input study) vs ₹53–89L for a team. |
| Time | 4-week validation, then ~16 weeks to a reduced-scope web MVP; slips likely if data curation lags. |

## Method notes

* Costs, store fees and API prices were cross-checked by web research on 2026-11-09. Treat them as **±30% estimates** and re-verify before committing.
* **OmniRoute AI Gateway (`v3.8.53` on `127.0.0.1:20128/v1` → HP Z4 Workstation `100.105.146.7:11434..11437`):** Live and active as primary executor for scripts, components, and doc refreshes (`llama-cpp/qwen2.5-coder-7b` / `14b`). See [Design 10](../design/10-OmniRoute-Directed-Implementation-Protocol.md).
* **Merchant & Legal Baseline (`2026-11-24`):** Operated by **Saranya Mohan** (Sole Proprietor, Namakkal, Tamil Nadu; `support@names.iniya.in`); `/terms`, `/privacy`, `/refund-policy`, `/contact` live on `dev19Nov2026`.
* Astrological tables in this plan (e.g. nakshatra syllables) are reference seeds and **must be validated by a qualified jyotishi** before any "Verified" astrology claim (control SS-07 C-08, `B-13`).
