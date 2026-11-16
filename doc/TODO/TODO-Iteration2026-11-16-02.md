# பெயர்ச்சோலை (Peyarcholai) — Iteration 2026-11-16-02

**Date:** 2026-11-16 | **Branch:** `dev` ONLY | **Parent Tracker:** [`TODO.md`](./TODO.md)  
**Governing Quality Guardrails:** [`06-Six-Sigma-Quality-Guardrails.md`](../testing/06-Six-Sigma-Quality-Guardrails.md) (`SG-01`–`SG-05`)  
**Designs Implemented:** [06 Task 17](../design/06-Task17-Auth-Session-And-Family-Poll-Design.md) · [07 Task 16](../design/07-Task16-Common-Platform-Adoption-Design.md) · [08 Task 20](../design/08-Task20-Reliable-Cohort-Frequency-Data-Design.md) · [09 Tasks 21/22](../design/09-Tasks21-22-Review-And-Hardening-Design.md) · [10 OmniRoute Protocol](../design/10-OmniRoute-Directed-Implementation-Protocol.md)

---

## Completed Deliverables

| Item | Executor | Summary | Verification | Status |
| :--- | :--- | :--- | :--- | :--- |
| **T16-1** | OmniRoute + Claude review | `@platform/auth` `src/access.ts` (`hashToken`, `generateToken`, `activeTier`, `AuthError`, `requireTier`, `resolveResourceRole`) re-exported from `index.ts`. | `vitest run`: `22/22` PASS; `tsc`: 0 errors | ✅ **Completed** |
| **T16-2** | Claude | `git init` in `E:\project\Apps\common`, `.gitignore`, `@common/*` → `@platform/*` doc alignment, initial commit & tag `auth-v0.2.0`. | Local git repo + tag verified | ✅ **Local Done** |
| **T17-0** | OmniRoute + Claude wiring | `app/src/lib/poll-access.ts` (`issueCreatorSecret`, `hashSecret`, `verifyCreatorSecret`, `resolvePollViewer`, `sanitizeVoterInput`), `x-creator-secret` header in `NamingGuruDashboard.tsx` & `/api/polls`, stripped `creatorSecretHash`. | `poll-access.test.ts`: `10/10` PASS | ✅ **Completed** |
| **T17-0b** | Claude | Removed `?tier=` / `body.tier` trust in `/api/polls`, `/api/reports/download-pdf`, `/api/reports/family-booklet` (fail closed unless `ALLOW_UNGATED_DEV=true` in non-prod). | `npm test` + `next build` | ✅ **Completed** |
| **T17-F4** | Claude | `/api/polls` returns `503` when `NODE_ENV=production` and `DATABASE_URL` is missing. | `next build` + route guard | ✅ **Completed** |
| **T20-1 (prep)** | Claude | Added `app/src/data/frequency-priors.json` with `source` and `lastReviewed` on every constant. | JSON schema ready for `T20-1` engine PR | ✅ **Staged** |
| **T21-1** | OmniRoute + Claude review | `app/src/lib/entitlement-matrix.ts` (`FEATURE_ENTITLEMENT_MATRIX`, `getRequiredTierForFeature`, `canTierAccessFeature`). | `entitlement-matrix.test.ts`: `3/3` PASS | ✅ **Completed** |
| **T22-1** | Claude | Extended `NUMEROLOGY_METHOD_CITATIONS` with `author`, `title`, `year`, `edition`, `publicDomainBasis`. | `book-citations.test.ts`: `2/2` PASS | ✅ **Completed** |

---

## Six-Sigma Guardrail Sign-Off (`06-Six-Sigma-Quality-Guardrails.md`)
- [x] **SG-01 (Entry):** Designs `06`–`10` approved; blocked owner inputs isolated in `TODO.md §0` (`B-01`–`B-16`).
- [x] **SG-02 (Data/Provenance):** `book-citations.ts` public-domain editions & `catalog.test.ts` 100% PASS.
- [x] **SG-03 (Security/Legal):** `?viewer=creator` & `?tier=` bypasses closed; `creatorSecretHash` stripped; `503` fail-closed in prod without DB.
- [x] **SG-04 (UI/Print):** Dashboard poll secret stored client-side & sent via `x-creator-secret`.
- [x] **SG-05 (Build/Git):** `npm test` (`61/61` PASS across 17 suites), `npm run build` (`0` errors), pushed to `dev` branch only.
