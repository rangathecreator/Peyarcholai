# NamingGuru – Planning & Feasibility Documentation

**Version:** 1.0 | **Date:** 2026-11-09 | **Status:** Draft for review | **Owner:** Product/Architecture

NamingGuru helps Indian parents pick a baby name that fits **tradition (horoscope / nakshatra), numerology, community & region, meaning, trend and ease of pronunciation**.

## Repo layout

| Folder | Purpose |
| :-- | :-- |
| `doc/plan/` (this folder) | Planning, feasibility and quality documents produced in this study. |
| `doc/00…07-*.md` | **Earlier study (input)** – numerology methods, data sources, evaluation engine, social poll, competitors, revenue/cost, value-add features. Left untouched; reconciled in [doc 12](12-Input-Reconciliation.md). |
| `app/` | All application work: code, data pipelines, infra (see [`app/README.md`](../../app/README.md)). |

## Document map

| # | Document | Answers |
| :-- | :-- | :-- |
| 01 | [Vision, Scope & Requirements](01-Vision-Scope-Requirements.md) | What are we building, for whom, functional and non-functional requirements, use-case UML |
| 02 | [Name Sourcing Strategy](02-Name-Sourcing-Strategy.md) | What options exist to source names that satisfy all kinds of Indian families |
| 03 | [Numerology & Horoscope Engine Spec](03-Numerology-Horoscope-Engine-Spec.md) | How the calculator and horoscope matching work |
| 04 | [Data Model & Taxonomy](04-Data-Model-Taxonomy.md) | Classification dimensions, ER diagram, scoring |
| 05 | [Architecture & UML](05-Architecture-UML.md) | Component, sequence, class, deployment, state and activity diagrams |
| 06 | [Technical Feasibility Study](06-Technical-Feasibility-Study.md) | End-to-end feasibility with verdicts and risks |
| 07 | [Deployment & DevOps](07-Deployment-DevOps.md) | Environments, CI/CD, release of web + mobile |
| 08 | [Cost Model](08-Cost-Model.md) | Build and run cost for web and mobile at 3 scales |
| 09 | [OmniRoute AI Usage Plan](09-OmniRoute-AI-Usage-Plan.md) | Where OmniRoute and reasoning models are used (dev + runtime) |
| 10 | [Roadmap & WBS](10-Roadmap-WBS.md) | Phases, milestones, work breakdown |
| 11 | [Legal, Privacy & Ethics](11-Legal-Privacy-Ethics.md) | DPDP Act, content licensing, astrology disclaimers, poll privacy |
| 12 | [Input Reconciliation](12-Input-Reconciliation.md) | How the earlier study (`doc/00…07`) was integrated; conflicts and resolutions; open questions |
| 13 | [Web MVP Implementation & Design](../implementation/01-Web-MVP-Implementation.md) | Implemented Tamil-first Next.js Web MVP architecture, OmniRoute AI integration, core engines, and API reference |

## Categorized Documentation Structure (`doc/`)

| Folder | Contents |
| :-- | :-- |
| [`doc/plan/`](./) | Master planning index, roadmap & WBS, cost model, OmniRoute AI usage plan, input reconciliation, and Six Sigma (`six-sigma/`). |
| [`doc/requirements/`](../requirements/) | [01 Vision, Scope & Requirements](../requirements/01-Vision-Scope-Requirements.md), [02 Name Sourcing Strategy](../requirements/02-Name-Sourcing-Strategy.md), [03 Legal, Privacy & Ethics](../requirements/03-Legal-Privacy-Ethics.md), [04 Tamil MVP Requirements Summary](../requirements/04-Tamil-MVP-Requirements-Summary.md). |
| [`doc/design/`](../design/) | [01 Numerology & Horoscope Engine Spec](../design/01-Numerology-Horoscope-Engine-Spec.md), [02 Data Model & Taxonomy](../design/02-Data-Model-Taxonomy.md), [03 Architecture & UML](../design/03-Architecture-UML.md), [04 Web MVP System Design](../design/04-Web-MVP-System-Design.md). |
| [`doc/implementation/`](../implementation/) | [01 Web MVP Implementation & Technical Design](../implementation/01-Web-MVP-Implementation.md). |
| [`doc/deployment/`](../deployment/) | [01 Deployment & DevOps Overview](../deployment/01-Deployment-DevOps-Overview.md). |
| [`doc/deployment/local/`](../deployment/local/) | [01 Local Runbook (Windows/PowerShell + OmniRoute + Next.js)](../deployment/local/01-Local-Runbook.md). |
| [`doc/deployment/site/`](../deployment/site/) | [01 Production Site Deployment (`names.donorconnect.in` + Vercel + Supabase/Neon)](../deployment/site/01-Production-Site-Deployment-DonorConnect.md). |
| [`doc/testing/`](../testing/) | [01 Test Plan & Validation Report](../testing/01-Test-Plan-And-Validation-Report.md). |
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
* The reasoning-model analysis through OmniRoute is **prepared but pending a gateway API key**. See [doc 09 §6](09-OmniRoute-AI-Usage-Plan.md#6-status-of-ai-assisted-analysis-for-this-plan).
* Astrological tables in this plan (e.g. nakshatra syllables) are reference seeds and **must be validated by a qualified jyotishi** before release (control SS-07 C-08).
