# பெயர்ச்சோலை (Peyarcholai) — Empirical Name Frequency & Rarity Scoring Specification

**Document ID:** `PLAN-FREQ-07`  
**Location:** `doc/plan/07-Empirical-Name-Frequency-Scoring-Specification.md`  
**Status:** Approved Feature Specification  

---

## 1. The Core Problem & Mathematical Formulation

Currently, many baby naming websites label names as "popular" or "rare" using speculative guesswork. Parents need an **objective, data-backed empirical metric** that answers:
> *"If my child enters a classroom of 40 students or a school of 1,000 peers in Tamil Nadu, how many classmates will share this exact name?"*

### Mathematical Definition of Frequency Percentage:

$$\text{Cohort Observation Frequency (\%)} = \left( \frac{\text{Observed Occurrences of Name } N \text{ in Ingested Cohorts}}{\text{Total Records in Cohort Dataset } C} \right) \times 100$$

### Empirical Rarity Index ($R$):

$$R(N) = 100 - \left( \frac{\text{Percentile Rank of } N \text{ by Frequency}}{100} \times 100 \right)$$

---

## 2. Rarity Band Categorization & Badging

| Observed Frequency (%) | Rarity Score ($R$) | Rarity Band (English) | Tamil Rarity Badge | Peer Context in 1,000 Students |
| :--- | :---: | :--- | :--- | :--- |
| **$< 0.02\%$** | **98.0 – 100** | **Ultra Rare Gem** | 💎 **தனித்துவப் பொக்கிஷம்** | 0 in 1,000 (Completely unique in peer group) |
| **$0.02\% - 0.10\%$** | **90.0 – 97.9** | **Distinctive Classic** | 🌟 **தனித்துவச் செம்மொழிப் பெயர்** | Less than 1 in 1,000 students |
| **$0.11\% - 0.50\%$** | **70.0 – 89.9** | **Balanced Popular** | 🌿 **மிதமான பயன்பாடு** | 1 to 5 students per 1,000 |
| **$> 0.50\%$** | **$< 70.0$** | **High-Frequency Classic** | 🏛️ **பரவலான பாரம்பரியப் பெயர்** | $> 5$ students per 1,000 (Common classic) |

---

## 3. Storage & Integration into the 14-Dimension Dossier Report

Every name record shard stores the computed empirical metrics:

```json
{
  "uniqueness": {
    "band": "Ultra Rare Gem",
    "score": 99,
    "observedCohortFrequencyPct": 0.008,
    "peersPerThousandEstimate": 0,
    "tnEstimatePercentile": 99.2,
    "diasporaEstimatePercentile": 99.5,
    "auditSource": "TN Educational & Sports Cohort Aggregates (DPDP Compliant)"
  }
}
```

In the **14-Dimension Heritage Dossier (`/name/[slug]`)**, this renders as an interactive horizontal frequency gauge:
```
[■□□□□□□□□□] 0.008% Frequency · 💎 Ultra Rare Gem (0 in 1,000 peers share this name)
```

