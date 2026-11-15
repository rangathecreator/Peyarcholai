# பெயர்ச்சோலை (Peyarcholai) — Iteration 2026-11-15-01 (Kickstart Ready)

**Date:** 2026-11-15 | **Branch:** `dev` ONLY | **Parent Tracker:** [`TODO.md`](./TODO.md)  
**Governing Quality Guardrails:** [`06-Six-Sigma-Quality-Guardrails.md`](../testing/06-Six-Sigma-Quality-Guardrails.md) (`SG-01`–`SG-05`)  
**Tradeoff Decisions:** [`02-Tasks16-17-21-22-23-Design-Tradeoffs.md`](../design/micro_designs/02-Tasks16-17-21-22-23-Design-Tradeoffs.md)

---

## Wave A — Zero-Infra / Pure TypeScript & UI Features (Start Immediately)

| Task | Scope & Recorded Decision | Acceptance Criteria | Testing Methods | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Task 31** | **Side-by-Side Name Comparison Matrix & Multi-Name Family Booklet (`₹499`)** — Priority #1 | 1. Compare 2–5 shortlisted names across all 14 dimensions in a responsive comparison matrix.<br>2. Export a single multi-name A4 printable Family Booklet.<br>3. Entitlement-gated to `kudumba_499` with clean upgrade CTA for Free/₹49 users. | Unit test for comparison matrix payload + print-CSS check + `npm test` & `npm run build`. | ✅ **Completed** |
| **Task 32** | **Parent-Surname & Initial Resonance Numerology (`₹499`)** — Priority #2 | 1. Computes Chaldean, Pythagorean & Katapayadi harmony for `[Initial] + [Baby Name] + [Surname]`.<br>2. Displays `ContextualDisclaimer` (`astrology`). | Deterministic unit tests in `core.test.ts` verifying initial/surname combinations. | ✅ **Completed** |
| **Task 33** | **Pronunciation Audio & Syllable Breakdown Guide** — Priority #3 | 1. Zero-cost Web Speech API (`ta-IN` / `en-IN`) playback button + deterministic syllable breakdown (`யா-ழி-னி` / `Yaa-zhi-ni`).<br>2. Graceful text fallback when browser speech synthesis is unavailable. | Unit tests for syllable splitter + UI fallback check. | ✅ **Completed** |
| **Task 34** | **Baby Naming Ceremony & Official Registration Checklist (`₹499`)** — Priority #4 | 1. Printable *Peyar Soottu Vizha* keepsake card + TN/Indian Birth Certificate, Aadhaar & Passport initial-formatting checklist bundled in Task 31 Family Booklet. | Print-CSS A4 check + `npm run build`. | ✅ **Completed** |
| **Task 22** | **Book-Referenced Astrology & Numerology Predictions (Option A)** | 1. Structured original synthesis tables citing Cheiro's *Book of Numbers*, Sepharial, *Katapayadi Sankhya*, *Vakya/Thirukkanitha Panchangam*, and *Brihat Parashara Hora Shastra*.<br>2. Zero verbatim copyrighted text; explicit method citations + `ContextualDisclaimer`. | Unit tests in `core.test.ts` validating compound tables & Nakshatra/Pada metadata. | ✅ **Completed** |

---

## Wave B — Database, Auth & External Infrastructure

| Task | Scope & Recorded Decision | Acceptance Criteria | Testing Methods | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Task 17** | **WhatsApp Shortlist & Blind Family Vote-Out Poll (`₹499`) — Option A** (`PostgreSQL` + `NextAuth` + Server-Side Blind Poll API) | 1. Per-user persistent shortlist surviving logout/login.<br>2. `MAX 10` shortlisted names enforced server-side.<br>3. `GET /api/polls/[id]` strips other voters' choices/comments on the server for non-creator participants (`SG-03`). | API integration tests verifying server-side blind stripping & `MAX 10` cap. | 🟡 **Server Blind-Poll & Max-10 Done** *(Pending `DATABASE_URL` + NextAuth)* |
| **Task 23** | **Deploy OmniRoute via Cloudflare Tunnel (`Option A`)** | 1. HP Z4 OmniRoute bound to `127.0.0.1` with `REQUIRE_API_KEY=true`.<br>2. `cloudflared` tunnel + Cloudflare Access Service Tokens + Bearer Auth.<br>3. Deterministic fallback when HP Z4 is offline. | Health/inference curl through tunnel + fallback test when offline. | 🟡 **Zero-Trust Client & Guide Done** *(Pending HP Z4 online)* |
| **Task 16** | **Reusable Common Platform Modules (`E:\project\Apps\common\`) — JDK 21 + PostgreSQL + Hybrid Monorepo→GitHub Packages** | 1. Phase 1 Java 21 Spring Boot + PostgreSQL (`common-auth`, `common-logging`, `common-payments`, etc.) & TypeScript packages build cleanly locally (`mvn install` / `npm run build`).<br>2. Tagged release workflow configured for GitHub Packages. | `mvn test` + `npm test` in `E:\project\Apps\common\code\`. | 🟡 **POM Upgraded to JDK 21 + Postgres** *(Module code build next)* |

---

## Six-Sigma Guardrail Sign-Off (`06-Six-Sigma-Quality-Guardrails.md`)
- [x] **SG-01 (Entry):** All included tasks have `Open Questions: None` and clear Acceptance Criteria.
- [x] **SG-02 (Data/Provenance):** Zero broken citations, sandhi errors, or script impurities (`catalog.test.ts` pass).
- [x] **SG-03 (Security/Legal):** Server-side enforcement, contextual disclaimers, and zero leaked secrets verified.
- [x] **SG-04 (UI/Print):** Mobile (`390px`), desktop, and print-CSS checks clean; graceful fallbacks verified.
- [x] **SG-05 (Build/Git):** `npm test` (`39/39` pass across `11` suites), `npm run build` (`0` errors, `114` routes), pushed to `dev` branch only.
