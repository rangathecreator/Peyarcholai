# பெயர்ச்சோலை (Peyarcholai) — Master Documentation Index

**Last Updated:** 2026-11-15 | **Live Production:** `https://peyar.donorconnect.in` | **Catalog:** `150,024` active / `150,650` raw Tamil names (`393` `.json.gz` shards) | **Verification:** `44/44` tests PASS (12 suites), `next build` PASS (`114` routes)

---

## 1. Active Trackers & TODOs (`doc/TODO/`)

| Document | Purpose |
| :--- | :--- |
| [Master TODO Tracker](./TODO/TODO.md) | Authoritative task backlog (`Tasks 1–38`), Open Questions, QA Checklist v1.0 Matrix, and Cycle Log |
| [TODO Archive (2026-11-14)](./TODO/TODO-2026-11-14.md) | Initial detailed QA & implementation log |
| [Iteration 2026-11-14-01](./TODO/TODO-Iteration2026-11-14-01.md) | Wave A execution log (Tasks 19, 22, 24, 25, 32, 33) |
| [Iteration 2026-11-14-02](./TODO/TODO-Iteration2026-11-14-02.md) | Wave B execution log (Tasks 26, 27, 28, 30, 31, 34) |
| [Iteration 2026-11-15-01](./TODO/TODO-Iteration2026-11-15-01.md) | Revenue Plan & Six-Sigma Guardrails (`06-Six-Sigma-Quality-Guardrails.md`) |
| [Iteration 2026-11-15-02](./TODO/TODO-Iteration2026-11-15-02.md) | Tasks 17A, 35, 36, 37, 38 (Shortlist Poll Sync, Menu Bar Polish, Cohort V2, Compound Predictions) |

---

## 2. Requirements & Literary Provenance (`doc/requirements/`)

| Document | Purpose |
| :--- | :--- |
| [01 Vision, Scope & Requirements](./requirements/01-Vision-Scope-Requirements.md) | Product vision, personas, functional/non-functional requirements, use-case UML |
| [02 Name Sourcing Strategy](./requirements/02-Name-Sourcing-Strategy.md) | 150K+ name sourcing, 3-tier cultural classification, and 14 parent-centric dimensions |
| [02 Naming Source ChatGPT](./requirements/02-Naming-Source-Chatgpt.md) | Early AI-assisted sourcing prompt & corpus reference |
| [04 Tamil MVP Requirements Summary](./requirements/04-Tamil-MVP-Requirements-Summary.md) | Concise Tamil-first MVP requirements summary |
| [05 Literary Sources Directory](./requirements/05-Literary-Sources-Tolkappiyam-Ramayanam-Directory.md) | Sangam, Tolkappiyam, Kamba Ramayanam, and Madras Tamil Lexicon source directory |
| [06 User Guide & Feature Manual](./requirements/06-User-Guide-And-Feature-Manual.md) | Parent user guide for search, Nakshatra, numerology, scorecard, and family polls |

---

## 3. Architecture, Design & Micro-Designs (`doc/design/`)

| Document | Purpose |
| :--- | :--- |
| [01 Numerology & Horoscope Engine Spec](./design/01-Numerology-Horoscope-Engine-Spec.md) | Pythagorean, Chaldean, Katapayadi, Compound `10–75`, and Lahiri Moon Star specifications |
| [02 Data Model & Taxonomy](./design/02-Data-Model-Taxonomy.md) | 14-dimension schema, cultural categories, ER model, and scoring |
| [03 Architecture & UML](./design/03-Architecture-UML.md) | Component, sequence, class, deployment, and state diagrams |
| [04 Web MVP System Design](./design/04-Web-MVP-System-Design.md) | Next.js App Router + sharded `.json.gz` + OmniRoute system architecture |
| [05 Large Catalog Storage & Scaling](./design/05-Large-Catalog-Storage-And-Scaling-Architecture.md) | 393-shard `.json.gz` compression and Vercel `<100k` → GCP `>100k` scaling architecture |
| [Micro-Design: Task 20 Cohort Frequency](./design/micro_designs/01-Task20-Cohort-Frequency-Micro-Design.md) | Multi-factor empirical cohort frequency model |
| [Micro-Design: Tasks 16, 17, 21, 22, 23 Tradeoffs](./design/micro_designs/02-Tasks16-17-21-22-23-Design-Tradeoffs.md) | Architecture tradeoffs & selected options (JDK21, PostgreSQL, Blind Poll, Cloudflare Tunnel) |
| [Micro-Design: Task 36 Cohort Frequency V2](./design/micro_designs/03-Task36-Empirical-Cohort-Frequency-V2-Design.md) | Classroom collision percentage (`1 in ~10 classrooms`) & whole-number school counts |

---

## 4. Implementation & Bug Tracking (`doc/implementation/`, `doc/bugs/`)

| Document | Purpose |
| :--- | :--- |
| [01 Web MVP Implementation](./implementation/01-Web-MVP-Implementation.md) | Implemented Web MVP architecture, API routes, and 2026-11-15 production baseline |
| [01 Bug Tracker & Known Issues](./bugs/01-Bug-Tracker-And-Known-Issues.md) | Resolved defects (`BUG-001`–`BUG-006`) and monitored items (`MON-001`, `MON-002`) |

---

## 5. Product Strategy, Planning & Six Sigma (`doc/plan/`)

| Document | Purpose |
| :--- | :--- |
| [00 Planning Index](./plan/00-README-Index.md) | Planning executive summary & Six-Sigma cross-reference |
| [01 Customer Value & Competitor Analysis](./plan/01-Customer-Value-And-Competitor-Analysis.md) | Why parents choose Peyarcholai over ChatGPT/Gemini and baby-name portals |
| [02 Paid ₹499 Value Audit](./plan/02-Paid-499-Value-Audit.md) | End-user ₹499 subscription value audit (yielded Tasks 31–34) |
| [06 Technical Feasibility Study](./plan/06-Technical-Feasibility-Study.md) | End-to-end technical feasibility verdict & risks |
| [06 Prompt & Internal Query Generator Spec](./plan/06-Prompt-And-Internal-Query-Generator-Specification.md) | Visual Prompt Synthesizer specification |
| [07 Empirical Name Frequency Scoring Spec](./plan/07-Empirical-Name-Frequency-Scoring-Specification.md) | Cohort rarity & classroom peer specification |
| [08 Cost Model](./plan/08-Cost-Model.md) | Infrastructure & build cost projections |
| [08 Paid PDF Dossier Report Spec](./plan/08-Paid-PDF-Dossier-Report-Specification.md) | Printable single-name & Family Booklet PDF dossier specification |
| [09 OmniRoute AI Usage Plan](./plan/09-OmniRoute-AI-Usage-Plan.md) | OmniRoute model routing for dev curation & runtime AI Advisor |
| [09 WhatsApp Family Voting Test Matrix](./plan/09-WhatsApp-Family-Voting-Scenarios-And-Test-Matrix.md) | Family Vote-Out Poll & WhatsApp sharing test matrix |
| [10 Comprehensive Feature Test Matrix](./plan/10-Comprehensive-Feature-Test-Matrix.md) | End-to-end feature verification matrix |
| [10 Roadmap & WBS](./plan/10-Roadmap-WBS.md) | Delivery phases, milestones, and work breakdown |
| [11 Application Observability Spec](./plan/11-Application-Observability-And-Dashboard-Specification.md) | `/api/metrics` observability & telemetry specification |
| [12 Input Reconciliation](./plan/12-Input-Reconciliation.md) | Reconciliation of initial feasibility docs (`doc/00`–`07`) |
| [13 Revenue Plan](./plan/13-Revenue-Plan.md) | Three-year revenue assumptions & conversion modeling |
| [14 Marketing & Sales Automation](./plan/14-Marketing-And-Sales-Automation.md) | SEO, `/why-peyarcholai`, and organic parent acquisition strategy |
| [15 Parent Feature Ideas](./plan/15-Parent-Feature-Ideas.md) | Long-term parent feature ideation backlog |
| **Six Sigma (`doc/plan/six-sigma/`)** | [SS-01 Charter](./plan/six-sigma/SS-01-Project-Charter.md) · [SS-02 VOC-CTQ](./plan/six-sigma/SS-02-VOC-CTQ.md) · [SS-03 SIPOC](./plan/six-sigma/SS-03-SIPOC.md) · [SS-04 Measurement](./plan/six-sigma/SS-04-Measurement-Plan-Sigma-Targets.md) · [SS-05 FMEA](./plan/six-sigma/SS-05-FMEA.md) · [SS-06 Risk Register](./plan/six-sigma/SS-06-Risk-Register.md) · [SS-07 Control Plan](./plan/six-sigma/SS-07-Control-Plan.md) · [SS-08 DMAIC](./plan/six-sigma/SS-08-DMAIC-Tracker-Quality-Gates.md) · [SS-09 Current State](./plan/six-sigma/SS-09-Current-State-And-OmniRoute-Model-Assessment.md) |

---

## 6. Revenue Plan & Monetization (`doc/revenuePlan/`)

| Document | Purpose |
| :--- | :--- |
| [01 Six-Sigma Cost vs Profit Scale Review](./revenuePlan/01-Six-Sigma-Cost-Vs-Profit-Scale-Review.md) | Unit economics, break-even, and scale-tier cost vs profit analysis |
| [02 Three-Tier Monetization Architecture](./revenuePlan/02-Three-Tier-Monetization-Architecture.md) | Free / Suvadi (₹49) / Kudumba (₹499) entitlement architecture |
| [03 Payment Gateway Integration](./revenuePlan/03-Payment-Gateway-Integration-Web-And-Mobile.md) | Razorpay / Stripe / Play Billing integration blueprint |
| [04 Beta Release Checklist (Free Tier)](./revenuePlan/04-Beta-Release-Checklist-Free-Tier.md) | Free-tier public beta launch checklist |

---

## 7. Deployment & Operations (`doc/deployment/`)

| Document | Purpose |
| :--- | :--- |
| [01 Deployment & DevOps Overview](./deployment/01-Deployment-DevOps-Overview.md) | Environments, CI/CD, and Vercel/GCP deployment pipeline |
| [04 OmniRoute Cloudflare Tunnel Guide](./deployment/04-OmniRoute-Cloudflare-Tunnel-Guide.md) | Zero-Trust `cloudflared` tunnel + Bearer Auth for HP Workstation OmniRoute (`Task 23`) |
| [Local Runbook](./deployment/local/01-Local-Runbook.md) | Windows/PowerShell local setup, OmniRoute, and Next.js verification |
| [Site Deployment: DonorConnect](./deployment/site/01-Production-Site-Deployment-DonorConnect.md) | Custom subdomain & Vercel production setup |
| [Site Scaling Plan](./deployment/site/02-Scalable-Cloud-Resources-And-Traffic-Sizing-Plan.md) | Traffic sizing & cloud resource scaling tiers |
| [Subdomain Beta Guide](./deployment/site/03-DonorConnect-Subdomain-Beta-Deployment-Guide.md) | `peyar.donorconnect.in` DNS + beta release guide |
| **External:** [HP Z4 + Dual OmniRoute QuickStart](../../../LLMDeployments/SetupNotes/antigravity_custom_model_setup-QuickStartGuide.md) | Dell Laptop + HP Z4 Workstation (`100.105.146.7`) dual-OmniRoute & Cloudflare Tunnel setup |
| **External:** [HP Workstation Daily Connection Manual](../../../LLMDeployments/UbuntuRemoteConnNotes/DailyConnectionSteps_Manual.md) | Daily SSH, Tailscale, and remote LLM service connection steps for HP Z4 Workstation |

---

## 8. Legal, Privacy & Compliance (`doc/legal/`)

| Document | Purpose |
| :--- | :--- |
| [01 Legal Compliance & Data Checklist](./legal/01-Legal-Compliance-And-Data-Checklist.md) | `LEG-01`–`LEG-08` compliance checklist (DPDP 2023, GST/Payments, AdSense, Citations) |
| [02 Legal, Privacy & Ethics](./legal/02-Legal-Privacy-Ethics.md) | DPDP Act, Swiss Ephemeris zero-license decision, and poll safety checklist |

---

## 9. Testing, Quality Guardrails & Reviews (`doc/testing/`, `doc/reviews/`)

| Document | Purpose |
| :--- | :--- |
| [01 Test Plan & Validation Report](./testing/01-Test-Plan-And-Validation-Report.md) | `44/44` test coverage matrix, catalog audit, and HTTP fuzz results |
| [02 Random & Exploratory Test Ideas](./testing/02-Random-And-Exploratory-Test-Ideas.md) | Edge-case & exploratory QA scenarios |
| [03 Name Sourcing Data Quality Criteria](./testing/03-Name-Sourcing-Data-Quality-Acceptance-Criteria.md) | Data provenance & linguistic acceptance criteria |
| [04 Feature Quality Acceptance Criteria](./testing/04-Feature-Quality-Acceptance-Criteria.md) | Feature-level Six-Sigma acceptance gates |
| [05 OmniRoute Automated QA Report](./testing/05-OmniRoute-Automated-QA-Execution-Report.md) | Automated AI QA audit report |
| [06 Six-Sigma Quality Guardrails](./testing/06-Six-Sigma-Quality-Guardrails.md) | Mandatory `SG-01`–`SG-05` iteration release gates |
| [01 Plan Review](./reviews/01-Plan-Review.md) | Architectural & product plan review notes |

---

## 10. Original Feasibility Study Archive (`doc/00`–`doc/07`)

Preserved verbatim as historical input (reconciled in [`12-Input-Reconciliation.md`](./plan/12-Input-Reconciliation.md)):
[00 Master](./00-Feasibility-Study-Master.md) · [01 Numerology](./01-Numerology-Methods.md) · [02 Data Sources](./02-Name-Data-Sources.md) · [03 Evaluation Engine](./03-Name-Evaluation-Engine.md) · [04 Social Poll](./04-Social-Poll-Feature.md) · [05 Competitor Analysis](./05-Competitor-Analysis.md) · [06 Revenue & Cost](./06-Revenue-And-Cost-Model.md) · [07 Value-Add Features](./07-Value-Add-Features.md)
