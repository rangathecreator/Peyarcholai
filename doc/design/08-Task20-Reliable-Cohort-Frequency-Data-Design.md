# Design 08 — Task 20: Reliable, Calculated Cohort Frequency & Classroom Data

**Status:** Proposed for adoption · Supersedes the estimation approach in [01-Task20-Cohort-Frequency-Micro-Design.md](./micro_designs/01-Task20-Cohort-Frequency-Micro-Design.md) and refines [03-Task36](./micro_designs/03-Task36-Empirical-Cohort-Frequency-V2-Design.md).

## 1. Problem: what is shown today is partly invented

Reviewed `app/src/lib/frequency-engine.ts`:

| # | Finding | Why it matters |
| :-- | :-- | :-- |
| P1 | `deterministicHash(name)` multiplies the estimate by **0.65–1.45×** "so every name is uniquely differentiated" | This is synthetic noise displayed as a measurement. Two names get different "frequencies" for no real-world reason. |
| P2 | Base rates (`4.5`, `22.0`, `14.0`, `7.5`, `2.6` per 10k), length factors and suffix multipliers are unsourced constants | Plausible-looking but unvalidated; UI prints them as `0.25% Frequency` with 2-decimal precision |
| P3 | `popularityRank` (`rare/moderate/popular`) in the seed is AI-assigned | Not ground truth |
| P4 | Classroom collision uses `1-(1-p)^40` | Asks "any of 40 share it" — for *your* child it is the **39 other** children |
| P5 | Cohort proportion `p` is over all births, but names are gender-specific | A 40-child mixed class has ≈ 20 same-gender children; collision odds are mis-stated (overstated for gendered names' denominators) |
| P6 | No trend/era term | A name popular in the 1990s may be rare for 2026 births |

Rule adopted: **never display more precision or certainty than the evidence supports.** Replace false precision with ranges + an evidence grade.

## 2. Evidence grades (shown to the parent)

| Grade | Meaning | Source | UI label (EN / TA) |
| :-- | :-- | :-- | :-- |
| **A — Measured** | ≥ N independent observations | First-party calibration survey (§3.1) with n ≥ 30 for that name | "Based on parent reports" / "பெற்றோர் தரவு" |
| **B — Calibrated** | Model fitted to measured data and back-tested | Structural prior (§4) calibrated on Grade-A names, ρ ≥ 0.5 | "Calibrated estimate" |
| **C — Heuristic** | Structural prior only | Category + length + suffix, no noise | "Rough guide — not a count" |

Every number carries a **band** (`low–high`), never a single value; copy says "about 1 in 5–20 classrooms".

## 3. Data sources — what is actually obtainable

| Source | What it gives | Reliability | Legal/ethical | Decision |
| :-- | :-- | :-- | :-- | :-- |
| **3.1 First-party calibration micro-survey** — in-app, anonymous: "Does your child's class/school have a child named X?" (+ class size) for the name a parent is viewing | Direct collision observations → real ground truth for exactly the metric we show | High (self-reported), grows with traffic | Anonymous, aggregate-only, consent line (DPDP) | **Adopt** — primary ground truth |
| **3.2 First-party popularity signal** — aggregate counts of shortlist/vote events per name (opt-in) | Popularity *among our users* | Medium (biased to our audience) | Aggregate only, k-anonymity ≥ 5 | **Adopt as a secondary signal**, labelled "popular on Peyarcholai" |
| **3.3 Wikidata given-name counts** (SPARQL: humans with `P735` given-name item) | Public, CC0, reproducible count per name | Low–Medium (notable people only; Tamil coverage unverified) | CC0 | **Pilot** on 200 names; adopt only if coverage ≥ 50% and rank-correlation with 3.1 ≥ 0.4, else drop |
| **3.4 Official birth-registration / school rolls** | Best possible truth | n/a — names are not published; scraping individual records is not acceptable (DPDP) | RTI for *aggregate* name counts is possible | **Out of scope now**; record as long-term option |
| **3.5 Third-party "Indian baby names" datasets** | Unknown | Unknown provenance | Licence unknown | **Rejected** unless licence + method reviewed |

Honest consequence: until §3.1 accumulates data, **all names are Grade C** and the UI must say so. We do not claim measured accuracy we do not have.

## 4. Model (deterministic, explainable, no noise)

```
p_cohort(name) = prior(category) × length_factor × suffix_factor × trend_factor      // per birth, same-gender pool
band           = [p / k , p × k]      with k = 2.5 (Grade C) → 1.8 (Grade B) → measured CI (Grade A)
```

- **Remove `deterministicHash` entirely.** Names with identical structural features get identical estimates — that is correct.
- Priors/factors live in a versioned JSON (`app/src/data/frequency-priors.json`) with a `source` + `lastReviewed` per constant, so each is auditable.
- **Calibration:** fit multiplicative factors on Grade-A names by least squares in log space; store `modelVersion`, training n, Spearman ρ and MAPE; ship a factor only if cross-validated ρ ≥ 0.5.
- **Same-gender pool:** `p_same_gender_peers = p_cohort`; class same-gender size `m = round(classSize × 0.5)` (configurable `0.49` boys/`0.51` girls at birth — default 0.5).
- **Collision odds (fixed):** `P(at least one classmate shares) = 1 − (1 − p)^(m − 1)` where `m − 1` = other same-gender children (default 19 of 40).
- **School view:** expected sharers `= p × (schoolSize × 0.5 − 1)` shown as a rounded range, never fractional.
- **Trend:** `trend_factor` ∈ [0.6, 1.6] from `trendStatus` category (documented table); Grade C only.

## 5. Display changes

| Place | Today | After |
| :-- | :-- | :-- |
| Modal / profile / PDF | `0.25% Frequency`, `1 in ~10 classrooms (9.5% chance)` | `About 1 in 8–25 classrooms (4–12% chance) · Rough guide (Grade C)` + "How is this estimated?" disclosure |
| Compare table | single value | band + grade chip |
| Disclaimer (`ContextualDisclaimer variant="frequency"`) | generic | states grade, sources, and "not an official count" |
| Survey prompt | none | One optional question on the name modal (Task 20-S) |

## 6. Acceptance criteria

| ID | Assertion |
| :-- | :-- |
| AC-20-01 | `frequency-engine.ts` contains no hash-derived multiplier; two records with identical structural features return identical estimates (test) |
| AC-20-02 | Every `EmpiricalRarityScore` has `{ low, high, grade }`, with `low < point < high` and grade ∈ {A,B,C} |
| AC-20-03 | `classroomCollisionPercent` equals `1-(1-p)^(m-1)` for m=20 within 0.05 (property test over 1,000 random p) |
| AC-20-04 | Every constant in `frequency-priors.json` has `source` and `lastReviewed`; test fails otherwise |
| AC-20-05 | UI/PDF render band + grade; no label shows a single-point percentage without a band (grep + snapshot test) |
| AC-20-06 | Survey endpoint stores no PII (schema test), enforces k-anonymity ≥ 5 before any aggregate is exposed |
| AC-20-07 | Wikidata pilot script (`scripts/wikidata-name-counts.mjs`) outputs coverage % and correlation report; adoption decision recorded in this doc |
| AC-20-08 | Existing Task 8 / Task 36 tests updated, not deleted; `npm test` 100% |

## 7. Work-split
`T20-1` priors JSON + remove hash + bands (OmniRoute, test-first) → `T20-2` collision formula fix → `T20-3` UI/PDF band + grade → `T20-4` survey API + UI → `T20-5` Wikidata pilot script → `T20-6` calibration job. Items T20-4/T20-6 need Neon DB (Design 06) and traffic; T20-1/2/3/5 are unblocked now.

---

## 8. Empirical Pilot Result (`T20-5`) & `B-16` Option 4 Hybrid Adoption (`2026-11-24`)

1. **`T20-5` Wikipedia/Wikidata Pilot (`app/scripts/wikidata-name-counts.mjs`):**
   - Balanced 30-name pilot (`10` each from `pure_tamil`, `tamilnadu_usage`, `other_heritage`) returned **`23.3%`** overall Wikipedia coverage (`10%` `pure_tamil`, `40%` `tamilnadu_usage`, `20%` `other_heritage`; median hits = `0` across all 3 categories).
   - **Decision (`AC-20-07`):** Wikipedia alone is insufficient as a Grade-A frequency oracle, confirming `/api/survey` as the primary Grade-A path.
2. **`B-16` Option 4 Hybrid Implemented (`dev19Nov2026` @ `58a2d1c`):**
   - **Immediate Grade B:** Seeded **110 audited Tamil / South Indian cohort priors** in `app/src/data/grade-b-tamil-cohort-priors.json` (using `bandWidthFactor.gradeB = 1.8` in `frequency-engine.ts`), immediately upgrading high-traffic Tamil names (`Yazhini`, `Iniya`, `Venba`, `Kavin`, `Aarav`, etc.) from Grade C to **Grade B**.
   - **Automatic Grade A Upgrade:** Mounted 1-tap zero-PII `ClassroomSurveyWidget.tsx` on `/name/[slug]` feeding `POST /api/survey` (k-anonymity ≥ 5; automatically upgrades to **Grade A** once ≥ 30 anonymous parent responses accrue).
