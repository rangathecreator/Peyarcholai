# 06 – Six-Sigma Quality Guardrails & Iteration Gate Specification

**Document Path:** `doc/testing/06-Six-Sigma-Quality-Guardrails.md`  
**Target Defect Tolerance:** Six Sigma (`DPMO <= 3.4` — Zero Critical Defects in Production)  
**Input Sources Synthesized:**  
- [`doc/implementation/01-Web-MVP-Implementation.md`](../implementation/01-Web-MVP-Implementation.md)  
- [`doc/TODO/TODO-2026-11-14.md`](../TODO/TODO-2026-11-14.md)  
- [`doc/TODO/TODO-Iteration2026-11-14-01.md`](../TODO/TODO-Iteration2026-11-14-01.md)  
- [`doc/TODO/TODO-Iteration2026-11-14-02.md`](../TODO/TODO-Iteration2026-11-14-02.md)  
- [`doc/TODO/TODO.md`](../TODO/TODO.md)  
- [`doc/testing/03-Name-Sourcing-Data-Quality-Acceptance-Criteria.md`](./03-Name-Sourcing-Data-Quality-Acceptance-Criteria.md) & [`04-Feature-Quality-Acceptance-Criteria.md`](./04-Feature-Quality-Acceptance-Criteria.md)

---

## 1. Purpose & Mandatory Enforcement Rule

Every development iteration (`TODO-Iteration*.md`) **MUST** pass all five Six-Sigma Quality Guardrails (`SG-01` through `SG-05`) before code is committed or pushed to `origin dev`. No iteration may skip a guardrail or relax a test assertion to achieve a green build.

---

## 2. The Five Six-Sigma Guardrails (`SG-01` – `SG-05`)

### `SG-01` — Entry Gate: Zero Ambiguity & Recorded Architecture
Derived from `TODO.md` & `TODO-Iteration2026-11-14-01.md`:
1. **Zero Open Questions:** A task may enter an iteration **only** when `Open Questions` in [`TODO.md`](../TODO/TODO.md) is `None` and architectural choices are recorded.
2. **Measurable Acceptance Criteria & Testing Methods:** Every task must define explicit Pass/Fail acceptance criteria and automated/manual verification steps before coding begins.
3. **Micro-Design Before Complex Implementation:** Non-trivial algorithms or cross-cutting infra changes must have a micro-design / tradeoff record under `doc/design/micro_designs/`.

### `SG-02` — Data, Provenance & Linguistic Integrity Gate
Derived from `TODO-2026-11-14.md` QA Checklist v1.0 & `03-Name-Sourcing-Data-Quality-Acceptance-Criteria.md`:
1. **Period & Synthesis Separation (`CLA-01`, `CLA-02`, `CLA-03`, `FMT-01`):** Synthesized root+suffix compounds are strictly `Modern Tamil` (`🧪 Modern Synthesis`); zero synthesized names may claim *Sangam*, *Tirukkural*, or *Silappathikaram* citations.
2. **Tolkappiyam Sandhi & Gender Purity (`ETY-01`, `ETY-03`):** All vowel-joined compounds obey *Udambadumei* sandhi; `literalMeaningEn` and `derivedMeaningEn` are explicitly separated; `0` gender discrepancies across the active catalog.
3. **Strict Confidence & Substring Gate (`CIT-01`, `>= 80%`):** Only records with `confidence >= 0.80` author citations; every `exact-word-in-verse` record satisfies `quote.includes(stem)`.
4. **Script & Lexicon Hygiene (`CIT-02`, `FMT-02`, `FMT-03`):** Zero Devanagari or mechanical `"combined with"` boilerplate; DSAL/TVA lexicon links render as clickable `<a>` elements rather than raw URL walls.

### `SG-03` — Security, Privacy, Entitlement & Legal Guardrails
Derived from Tasks `17`, `23`, `29`, `30` & `02-Tasks16-17-21-22-23-Design-Tradeoffs.md`:
1. **Server-Side Blind Voting (`Task 17`):** `GET /api/polls/[id]` MUST strip other voters' selections and comments on the server for non-creator participants (never rely on client-side hiding). Enforce `MAX 10` shortlisted names per poll on the server.
2. **Entitlement Enforcement:** `₹49` (`suvadi_49`) and `₹499` (`kudumba_499`) gates must be validated server-side on protected API routes (`/api/reports/download-pdf`, `/api/polls`, `/api/advisor`) once auth/payments are wired.
3. **Zero-Trust AI Gateway (`Task 23`):** OmniRoute on HP Z4 binds to `127.0.0.1` with `REQUIRE_API_KEY=true`, exposed only via `cloudflared` + Cloudflare Access Service Tokens + Bearer Auth. Graceful deterministic fallback remains active when the workstation is offline.
4. **Contextual Disclaimers & DPDP (`Tasks 29, 30`):** Every Astrology/Nakshatra, Numerology, Cohort Frequency, AI Advisor, Profile, and Printable Dossier view includes `<ContextualDisclaimer />` (`or` print disclaimer) and respects DPDP 2023 consent.
5. **Zero Secrets in Repo:** Never commit `.env.local`, API keys, service tokens, or credentials.

### `SG-04` — UI/UX, Accessibility & Print Quality Gate
Derived from Tasks `15`, `18`, `19`, `26`, `27`, `31–34`:
1. **Mobile Responsiveness (`390px`):** Zero horizontal overflow, readable Tamil + English typography (`Noto Sans Tamil` + `Inter`), and clean card density (`line-clamp` discipline).
2. **Parent-Friendly Copy (`Task 26`):** Zero internal/technical labels (like `"SEO page"`) in user-facing UI.
3. **Print-Ready Keepsakes (`Task 18`, `31`, `34`):** A4/Letter print stylesheets render without clipped text, overlapping badges, or unformatted JSON.
4. **Deterministic Math & Browser Fallbacks (`Tasks 20, 22, 32, 33`):** All numerology, Nakshatra, and cohort calculations are 100% deterministic; Web Speech API (`ta-IN`) features provide graceful text syllable fallbacks when browser voices are unavailable.
5. **Human-Readable Metrics & Complete Predictions (`Tasks 36, 37`):** Avoid confusing fractional child counts (`~0.1 peers`) in parent-facing UI (prefer collision `%` / `1 in N classrooms`), surface compound-number predictions (`10–75`) wherever compound sums are shown, and ensure WhatsApp/Poll flows always sync the user's active `shortlist` (`Task 17A`).

### `SG-05` — Build, Test & Git Branch Exit Gate
Derived from `TODO-Iteration2026-11-14-01.md` & `01-Test-Plan-And-Validation-Report.md`:
1. **Unit & Integration Test Suite (`npm test`):** **100% pass rate**, `0` failures, `0` skipped tests. Every new engine/API feature MUST add deterministic assertions in `src/core/core.test.ts`, `src/lib/catalog.test.ts`, or `src/lib/features.test.ts`.
2. **Production Build (`npm run build`):** Clean Next.js production compilation, TypeScript type-check, and ESLint pass with **0 errors**.
3. **Branch Discipline:** All active iteration commits land on **`dev` branch ONLY**. Never push directly to `main`.

---

## 3. Per-Iteration Guardrail Sign-Off Template

Copy this block into every `TODO-Iteration*.md` and verify before pushing to `origin dev`:

```markdown
### Six-Sigma Guardrail Sign-Off (`06-Six-Sigma-Quality-Guardrails.md`)
- [ ] **SG-01 (Entry):** All included tasks have `Open Questions: None` and clear Acceptance Criteria.
- [ ] **SG-02 (Data/Provenance):** Zero broken citations, sandhi errors, or script impurities (`catalog.test.ts` pass).
- [ ] **SG-03 (Security/Legal):** Server-side enforcement, contextual disclaimers, and zero leaked secrets verified.
- [ ] **SG-04 (UI/Print):** Mobile (`390px`), desktop, and print-CSS checks clean; graceful fallbacks verified.
- [ ] **SG-05 (Build/Git):** `npm test` (100% pass), `npm run build` (0 errors), pushed to `dev` branch only.
```
