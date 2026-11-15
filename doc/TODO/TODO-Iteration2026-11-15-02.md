# பெயர்ச்சோலை (Peyarcholai) — Iteration 2026-11-15-02

**Date:** 2026-11-15 | **Branch:** `dev` ONLY | **Parent Tracker:** [`TODO.md`](./TODO.md)  
**Governing Quality Guardrails:** [`06-Six-Sigma-Quality-Guardrails.md`](../testing/06-Six-Sigma-Quality-Guardrails.md) (`SG-01`–`SG-05`)

---

## Active Iteration Backlog (All `Open Questions: None`)

| Task | Description | Acceptance Criteria | Testing Methods | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Task 17A** | **Auto-Sync Shortlist → Family Poll, WhatsApp Share & Blind UI** | 1. Poll tab displays active `shortlistRecords` chips (`MAX 10`) and passes them to `POST /api/polls`.<br>2. Does not load `sample-tamil-poll` over user's shortlist.<br>3. WhatsApp share text includes shortlisted names + poll URL.<br>4. Consensus Leaderboard hidden for non-creator participants. | Unit test + `npm run build` + UI check. | ✅ **Completed** |
| **Task 35** | **Navigation Menu Bar Visual Polish** | 1. 8-tab bar (`Explore Names` .. `Suggest a Name`) has clean icons, crisp active contrast, and responsive mobile layout without overflow. | `npm run build` + responsive check. | ✅ **Completed** |
| **Task 36** | **Empirical Cohort Frequency & Classroom Uniqueness V2** | 1. Adds `classroomCollisionPercent`, `classroomDisplayEn/Ta`, `schoolDisplayCount` in `frequency-engine.ts`.<br>2. Eliminates confusing `~0.1 peers` / `~2.5 students` in Modal & PDF. | Unit test in `features.test.ts` + `npm run build`. | ✅ **Completed** |
| **Task 37** | **Compound-Level Numerology Prediction & Birth-Date Match on Profile/PDF** | 1. Renders `compoundInfo` (`titleEn`, `titleTa`, `summaryEn`, `summaryTa`, `auspiciousness`) + friendly birth-number note in `4A/4B` on `/name/[slug]`. | Unit test for compound `29` + `npm run build`. | ✅ **Completed** |
| **Task 38** | **Doc-Scan Alignment (`Swiss Ephemeris`, `MON-001`)** | 1. Confirm `nearBoundaryWarning` in `nakshatra-tamil.ts` & `NamingGuruDashboard.tsx` and mark Task 38 complete. | Grep verification + `npm test`. | ✅ **Completed** |

---

## Six-Sigma Guardrail Sign-Off (`06-Six-Sigma-Quality-Guardrails.md`)
- [x] **SG-01 (Entry):** All included tasks have `Open Questions: None` and clear Acceptance Criteria.
- [x] **SG-02 (Data/Provenance):** Zero broken citations, sandhi errors, or script impurities (`catalog.test.ts` pass).
- [x] **SG-03 (Security/Legal):** Blind poll UI + server enforcement verified; zero leaked secrets.
- [x] **SG-04 (UI/Print):** Human-readable cohort metrics, compound predictions, and menu bar polish verified.
- [x] **SG-05 (Build/Git):** `npm test` (44/44 pass), `npm run build` (0 errors), pushed to `dev` branch only.
