# Micro-Design: Empirical Cohort Frequency & Classroom Uniqueness V2 (Task 36)

**Document Path:** `doc/design/micro_designs/03-Task36-Empirical-Cohort-Frequency-V2-Design.md`  
**Status:** Proposed V2 Design (Tracked as **Task 36** in [`TODO.md`](../../implementation/TODO.md))  
**Target Module:** [`app/src/lib/frequency-engine.ts`](../../../app/src/lib/frequency-engine.ts) & [`NamingGuruDashboard.tsx`](../../../app/src/components/NamingGuruDashboard.tsx)

---

## 1. Problem with Current Design (V1)

Currently, for a balanced name (`0.25%` cohort frequency), the UI displays:
- `0.25% Frequency`
- `Classroom Peers (40 Students): ~0.1 peers in 40-student class`
- `School Cohort (1,000 Students): ~2.5 students across entire school`
- `Rarity Classification: Balanced Classic`

**Why Parents Find V1 Confusing:**
1. **`~0.1 peers` and `~2.5 students` are non-human fractions:** Parents do not think in terms of "0.1 of a child" — they want to know **"What is the chance my child shares this name in a 40-student class?"**
2. **Expected value (`λ = 40 × p`) hides collision probability:** For `p = 0.0025`, `1 - (1 - 0.0025)^40 = 9.53%` (roughly **1 in 10 classrooms**), which is immediately clear to any parent.

---

## 2. Proposed V2 Design

### 2.1 New Fields on `EmpiricalRarityScore`
| Field | Formula | Example (`0.25%` / `25 per 10k`) |
| :--- | :--- | :--- |
| `classroomCollisionPercent` | `round((1 - Math.pow(1 - p, 40)) * 100, 1)` | `9.5%` |
| `classroomDisplayEn` | If `expectedPeers < 0.7`: `"1 in ~${oneInClassrooms} classrooms (${collisionPct}% chance)"`<br>Else: `"~${Math.round(expectedPeers)} peers per 40-kid class"` | `"1 in ~10 classrooms (9.5% chance)"` |
| `classroomDisplayTa` | Tamil equivalent (`"~10 வகுப்பறைகளில் 1-இல் வாய்ப்பு (9.5%)"`) | `"~10 வகுப்பறைகளில் 1-இல் வாய்ப்பு (9.5%)"` |
| `schoolDisplayCount` | `Math.max(1, Math.round(gradeSchoolRepetitionIndex))` | `"~3 students across 1,000"` (no `.5` fractions) |

### 2.2 Backward Compatibility
Keep `classroomRepetitionIndex`, `gradeSchoolRepetitionIndex`, and `oneInClassrooms` on `EmpiricalRarityScore` so existing unit tests and API consumers remain 100% compatible while UI cards (`NamingGuruDashboard.tsx`, `/name/[slug]`, and PDF reports) render `classroomDisplayEn` / `classroomDisplayTa` and `schoolDisplayCount`.
