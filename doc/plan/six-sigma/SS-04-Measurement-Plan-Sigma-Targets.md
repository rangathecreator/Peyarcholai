# SS-04 – Measurement Plan & Sigma Targets (Measure)

## 1. Sigma conversion reference (with 1.5σ long-term shift)

| Sigma level | DPMO | Yield |
| :-- | :-- | :-- |
| 3.0 | 66,807 | 93.32% |
| 3.5 | 22,750 | 97.73% |
| 4.0 | 6,210 | 99.38% |
| 4.5 | 1,350 | 99.865% |
| 5.0 | 233 | 99.977% |
| 5.5 | 32 | 99.9968% |
| 6.0 | 3.4 | 99.99966% |

DPMO = (defects ÷ (units × opportunities per unit)) × 1,000,000.

## 2. Defect definitions

| Unit | Opportunities per unit | Defect = |
| :-- | :-- | :-- |
| Name record | 8 – gender, religion, language, script spelling, meaning, origin, citation, duplicate-check | Any field wrong/missing per audit |
| Numerology result | 4 – letter mapping, total, reduction, text lookup | Mismatch vs golden/expert |
| Nakshatra result | 3 – rashi, nakshatra, pada | Mismatch vs reference panchang |
| Search session | 3 – relevance, latency, zero result | Any failure |
| Release | 5 – build, migration, data check, a11y, crash regression | Any failed check |

## 3. Metric catalogue & targets

| ID | Metric | Type | Target MVP | Target v1 | Data source | Frequency | Sample |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| M-01 | Name-record DPMO | Discrete | ≤ 1,350 (4.5σ) | ≤ 233 (5σ) | Blind audit | Weekly | 300 (MVP) / 500 (v1) |
| M-02 | Numerology mismatches | Discrete | 0 / 500 | 0 / 1,000 | CI | Every commit | 100% |
| M-03 | Nakshatra mismatch | Discrete | 0 nakshatra, ≤ 1% pada | 0 / ≤ 0.5% | CI + Prokerala crosscheck | Per release | 200 → 500 |
| M-04 | Citation completeness | Discrete | 100% | 100% | SQL | Daily | All |
| M-05 | Expert sign-off on sensitive | Discrete | 100% | 100% | Review log | Weekly | All |
| M-06 | AI draft acceptance (expert) | Proportion | ≥ 90% | ≥ 95% | Review queue | Per batch | 300 |
| M-07 | Duplicate escape rate | Proportion | ≤ 0.5% | ≤ 0.1% | Audit | Weekly | 500 |
| M-08 | Search relevance top-10 | Proportion | ≥ 85% | ≥ 90% | Panel | Per release | 200 queries |
| M-09 | Search p95 latency | Continuous | ≤ 300 ms | ≤ 250 ms | APM | Continuous | all |
| M-10 | Cold start (mid Android) | Continuous | ≤ 2.5 s | ≤ 2.0 s | Firebase Perf | Release | device lab |
| M-11 | Crash-free sessions | Proportion | ≥ 99.5% | ≥ 99.7% | Crashlytics | Daily | all |
| M-12 | Availability | Proportion | ≥ 99.5% | ≥ 99.9% | Uptime monitor | Continuous | all |
| M-13 | Time to shortlist (median) | Continuous | ≤ 10 min | ≤ 7 min | Analytics | Weekly | cohort |
| M-14 | Reported-error fix time (median) | Continuous | ≤ 7 d | ≤ 3 d | Tracker | Weekly | all |
| M-15 | CSAT / NPS | Score | CSAT ≥ 4.2 / NPS ≥ 30 | 4.5 / 45 | In-app | Monthly | ≥ 100 |
| M-16 | DSR closed ≤ 30 d | Proportion | 100% | 100% | DPO log | Monthly | all |
| M-17 | Cost per MAU | Continuous | ≤ ₹0.7 | ≤ ₹0.5 | Billing | Monthly | – |

## 4. Sampling plan (acceptance sampling for dataset releases)

| Release size | Audit sample n | Accept if defective records ≤ | Rationale |
| :-- | :-- | :-- | :-- |
| ≤ 5,000 | 200 | 1 | Rejects a lot with 2% defective records ≈ 91% of the time (binomial) |
| 5,001–25,000 | 315 | 2 | Rejects a lot with 1.5% defective ≈ 85% of the time (Poisson approx.) |
| > 25,000 | 500 | 3 | Rejects a lot with 1% defective ≈ 73% of the time; stratify by religion × language |

These are single-sampling plans chosen for practicality; to *demonstrate* 99.5% accuracy with 95% confidence, the zero-defect rule needs n ≈ 600 – used for the G5 release audit.

Stratification: at least 10 records per religion and per top-10 language; oversampling of AI-auto-accepted records (2×).
If the lot is rejected → 100% re-inspection of the affected stratum and root-cause analysis (SS-05).

## 5. Baseline study (weeks 2–5)

1. Benchmark 5 popular Indian baby-name apps/sites: sample 100 names each across 5 religions → measure accuracy, coverage, numerology consistency → baseline DPMO (first real data for SS-01 §6).
2. Run PoC-2/PoC-3 (doc 06) to baseline AI draft accuracy.
3. Capture process capability **Cp/Cpk** for latency (continuous): target Cpk ≥ 1.33.

## 6. Data collection plan

| Data | Collector | Storage | Privacy |
| :-- | :-- | :-- | :-- |
| Audit results | Reviewers via admin console | `audit_log` table | No PII |
| Test results | CI | Artefact store | – |
| Product analytics | Firebase/PostHog | Pseudonymous | Consent-based |
| Performance | APM/RUM | Grafana/Sentry | No PII |

## 7. Dashboards
Weekly Quality Dashboard: DPMO trend (p-chart), latency (X̄-R / I-MR chart), crash-free (p-chart), review backlog, open risks. Owners review each Monday; signals (points beyond 3σ, runs of 8) trigger an 8D / A3 action in SS-07.
