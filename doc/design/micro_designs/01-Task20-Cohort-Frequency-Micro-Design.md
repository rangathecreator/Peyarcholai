# Micro-Design: Meaningful Empirical Cohort Frequency & Classroom Peers (Task 20)

**Document Path:** `doc/design/micro_designs/01-Task20-Cohort-Frequency-Micro-Design.md`  
**Status:** Implemented & Verified (`36/36` unit tests passing)  
**Primary Module:** [`app/src/lib/frequency-engine.ts`](../../../app/src/lib/frequency-engine.ts)  
**UI Integration:** [`app/src/components/NamingGuruDashboard.tsx`](../../../app/src/components/NamingGuruDashboard.tsx#L423-L434) (`modalEmpiricalRarity`) & [Modal Card](../../../app/src/components/NamingGuruDashboard.tsx#L3224-L3268)  
**Test Suite:** [`app/src/lib/features.test.ts`](../../../app/src/lib/features.test.ts)

---

## 1. Problem Statement & Design Goal

Previously, the cohort frequency indicator returned a flat or rank-only estimate, causing many distinct names (e.g., short modern names like `தியா` vs. rare Sangam names like `குறிஞ்சிவேந்தன்` vs. synthesized compounds like `அருள்மொழிச்செல்வன்`) to display identical `"Classroom Peers (40 Students)"` values.

**Goal:** Replace the generic estimate with a **deterministic, multi-factor empirical cohort model** that:
1. Produces distinct, realistic, explainable cohort metrics (`per 10,000` births, `40`-student classroom peers, `1,000`-student grade cohort, and `1 in N classrooms`).
2. Works **100% client/server-side at zero runtime cost** (no external DB or API call per name).
3. Remains **deterministic** across renders, devices, and PDF exports for the same name + metadata.
4. Reflects real-world Tamil naming distributions (short modern names dominate preschool cohorts; multi-syllable Sangam/classical names are rare).

---

## 2. Data Contracts

### 2.1 Input Context (`EmpiricalRarityContext`)
```ts
export interface EmpiricalRarityContext {
  nameLatin?: string;
  nameCategory?: string;
  originCategory?: string;
}
```
When `context` is omitted (e.g., legacy callers), the engine gracefully degrades using `nameTamil` length, phonetic starters/suffixes, and `popularityRank`.

### 2.2 Output Score (`EmpiricalRarityScore`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `observedFrequencyPercent` | `number` | Percentage of cohort (`round(countPer10k / 100, 2)`), e.g., `0.42%`. |
| `cohortCountPer10k` | `number` | Estimated babies per `10,000` births (`[0.3, 85]`). |
| `classroomRepetitionIndex` | `number` | Expected peers sharing the name in a **40-student classroom** (`round(40 * countPer10k / 10000, 2)`). |
| `gradeSchoolRepetitionIndex` | `number` | Raw expected peers in a **1,000-student grade**. |
| `gradeCohortIndex` | `number` | Rounded integer/decimal grade cohort index used in UI badges. |
| `oneInClassrooms` | `number` | `"1 in N classrooms"` (`max(1, round(10000 / (countPer10k * 40)))`). |
| `rarityBand` | `"ultra-rare" \| "distinctive" \| "balanced" \| "common"` | Tier classification driving UI badge color & icon. |
| `methodologyNoteEn` / `methodologyNoteTa` | `string` | Bilingual explanation of the multi-factor heuristic. |

---

## 3. Multi-Factor Cohort Estimation Algorithm (`estimateCountPer10k`)

The core estimator combines **4 multiplicative factors** and clamps the result to `[0.3, 85]` births per 10,000:

```
countPer10k = clamp(
  baseRate(category, origin, popularityRank)
    * zipfLengthMultiplier(nameTamil, nameLatin)
    * phoneticMultiplier(nameTamil)
    * hashVariance(nameTamil),
  0.3,
  85
)
```

### Factor 1: Cultural Category & Era Baseline (`baseRate`)
- **Modern / Trendy / Short Popular Names** (`Modern Tamil`, `Trendy`): higher baseline (`~18–35 per 10k` depending on `popularityRank`).
- **Traditional / Lexicon Root Names**: moderate baseline (`~8–18 per 10k`).
- **Classical / Sangam / Medieval Names**: lower baseline (`~2–7 per 10k`) reflecting real-world scarcity in contemporary preschools.
- **Popularity Rank Blending:** `popularityRank` scales within the era band rather than overriding cultural era, preventing rare Sangam names with high editorial quality scores from looking as common as `Aarav` or `Diya`.

### Factor 2: Zipfian Syllable & Character-Length Curve
Empirical naming data follows a steep Zipfian drop-off by syllable/character length:
- **Short (2–4 Tamil/Latin units, e.g., `தியா`, `கவி`):** Multiplier `> 1.3x` (parents strongly favor 2-syllable names for modern classrooms).
- **Medium (5–7 units):** Neutral `~0.9x–1.1x`.
- **Long / Compound (`8+` units, e.g., `அருள்மொழிச்செல்வன்`):** Steep decay (`0.35x–0.65x`), ensuring long classical compounds consistently land in `"distinctive"` or `"ultra-rare"`.

### Factor 3: Phonetic Starter & Suffix Popularity (`POPULAR_TAMIL_STARTERS`, `RARE_TAMIL_STARTERS`, `COMMON_SUFFIXES`)
- **High-frequency modern starters** (`அ`, `ஆ`, `க`, `ச`, `த`, `ம`, `நி`, `வி`, `ரி`, `தி`, `ஸ்ரீ`): boost factor (`~1.2x`).
- **Rare / classical Tamil starters** (`ழ`, `ஞ`, `ஒ`, `ஓ`, `ஐ`, `எ`, `ஊ`, `ண`): rarity boost (`~0.55x`), reflecting genuine alphabetical scarcity in birth registries.
- **Common modern suffixes** (`-ன்`, `-னி`, `-யா`, `-தா`, `-கா`, `-வி`): modest frequency lift (`~1.15x`).

### Factor 4: Deterministic FNV-1a Hash Variance (`deterministicHash`)
- Uses a 32-bit FNV-1a hash of `nameTamil` mapped to `[0.65, 1.45]`.
- Ensures two names with identical length, category, and starter still receive subtly differentiated, reproducible cohort estimates without `Math.random()` jitter.

---

## 4. Rarity Band Classification & Classroom Metrics

| `countPer10k` Range | `rarityBand` | Classroom (40 Kids) | Typical Interpretation |
| :--- | :--- | :--- | :--- |
| `< 3.0` | `ultra-rare` | `< 0.012` peers (`1 in 80+ classrooms`) | Virtually guaranteed classroom uniqueness |
| `3.0 – 11.9` | `distinctive` | `0.01 – 0.05` peers (`1 in 21–80 classrooms`) | Memorable yet culturally grounded |
| `12.0 – 29.9` | `balanced` | `0.05 – 0.12` peers (`1 in 8–20 classrooms`) | Familiar without severe repetition |
| `>= 30.0` | `common` | `>= 0.12` peers (`1 in 3–7 classrooms`) | Likely to share with a grade-level peer |

---

## 5. UI Wiring & Future Calibration Path

- **Current UI:** [`NamingGuruDashboard.tsx`](../../../app/src/components/NamingGuruDashboard.tsx#L3224-L3268) renders the **Cohort Frequency Index** panel inside the Name Detail Modal, showing `% Frequency`, `Classroom (40 Kids) ~X peers`, `Grade Cohort (1,000 Kids) ~Y students`, `Rarity Band`, and bilingual `பெற்றோர் வழிகாட்டல்` advice.
- **Future Empirical Upgrade (Phase 2):** When TN Civil Registration / Election Roll aggregate first-name histograms (anonymized, `>= 5` count threshold for DPDP compliance) are ingested as a compact JSON lookup table (`< 150 KB`), `estimateCountPer10k` can check the empirical table first and fall back to the 4-factor heuristic for long-tail / newly synthesized names.
