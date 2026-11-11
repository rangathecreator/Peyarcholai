# SS-07 – Control Plan (Control)

Purpose: sustain gains after Improve. Each control has a spec, measurement method, sample/frequency, reaction plan and owner. Controls trace to CTQs (SS-02), metrics (SS-04) and FMEA items (SS-05).

| ID | Process / CTQ | Control | Spec / limit | Measurement method | Sample & frequency | Reaction plan | Owner | FMEA |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| C-01 | Name verification (CTQ-2) | Blind audit by 2 reviewers | DPMO ≤ 1,350 (MVP) | Attribute check, Kappa ≥ 0.8 | 300–500 records weekly | Reject lot; 100% re-inspect stratum; 5-Why | Data steward | F-01,F-02 |
| C-02 | Sensitive names (CTQ-7) | Mandatory expert sign-off for religion/community-sensitive records | 100% | DB workflow state | Every record | Block publish | Curator | F-01 |
| C-03 | Citation (CTQ-3) | DB constraint: `verified` requires ≥1 citation + reviewer | 0 exceptions | Constraint + nightly query | Daily | Auto-demote to `reviewed` | Data engineer | F-02 |
| C-04 | AI enrichment (M-06) | JSON-schema validation, confidence gate, temp ≤ 0.2, model provenance logged | Acceptance ≥ 90% | Review queue stats | Per batch | Tune prompt, escalate to reasoning model, raise human share | Data steward | F-01,F-02,F-13 |
| C-05 | Engine correctness (CTQ-1) | 500 golden + property tests as blocking CI check | 0 failures | CI | Every commit | Block merge; fix; add test | Lead dev | F-03,F-04 |
| C-06 | Nakshatra (M-03) | Cross-check against reference panchang/API | 0 nakshatra errors | Automated comparison | 200 cases per release | Block release | Lead dev | F-05,F-06 |
| C-07 | Mapping data change control | Mapping/syllable tables are versioned files, two-person approval | 100% | PR rules | Every change | Revert | Lead dev | F-03 |
| C-08 | Astrological reference tables | Validation by qualified jyotishi/numerologist before each major release | Signed checklist | Review record | Per release | Hold release | Product owner | F-03,F-06 |
| C-09 | Search quality (CTQ-4/5) | Relevance panel + p95 monitor; zero-result log | ≥ 85% / ≤ 300 ms / ≤ 3% zero-result | Panel + APM | Per release; continuous | Tune synonyms/phonetics; scale DB | Lead dev | F-11 |
| C-10 | Availability (CTQ-9) | Uptime monitor, error-budget policy | ≥ 99.5% | Synthetic checks | 1-min | Incident process, rollback | Ops | F-16 |
| C-11 | Release quality | CI gates, canary, auto-rollback | Gate pass | Pipeline | Each release | Roll back; post-mortem | Lead dev | F-16 |
| C-12 | Cost control (M-17) | Budget alerts at 50/80/100%; monthly FinOps review | ≤ ₹0.7/MAU (MVP) | Billing export | Monthly | Throttle features, cache, change provider | Product owner | F-13,F-15 |
| C-13 | Privacy (CTQ-8) | Log-scrubbing tests, data-flow review, DSR tracker | 0 incidents; DSR ≤ 30 d | Tests, tracker | Per release; monthly | Incident response | DPO/lead dev | F-14 |
| C-14 | Secrets | Secret scanning (CI + pre-commit), no keys in docs, quarterly rotation | 0 findings | Scanner | Every commit | Rotate immediately | Lead dev | F-17 |
| C-15 | Source licensing | Source register; legal gate before ingest | 100% licence recorded | Register audit | Per source | Quarantine batch | Product owner | F-08 |
| C-16 | Community tagging | Automated test blocks auto-generated community/caste tags | 0 | Unit test + query | Every release | Remove tags | Curator | F-09 |
| C-17 | Content tone | Lint for fear/harm words + editorial review | 0 violations | Linter + review | Every content change | Rewrite | Content editor | F-10 |
| C-18 | Mobile quality | Perf budget (size ≤ 35 MB, start ≤ 2.5 s), crash-free ≥ 99.5% | Thresholds | Firebase, CI size check | Each build | Block release / OTA fix | Mobile dev | F-12 |
| C-19 | UGC | Profanity filter + rate limit + review queue | 100% reviewed before publish | Workflow | Continuous | Pause UGC | Curator | F-19 |
| C-20 | Measurement system | Recalibrate raters (Kappa) quarterly | Kappa ≥ 0.8 | Attribute agreement | Quarterly | Retrain reviewers | Black Belt | – |

## Statistical process control

| Chart | Data | Rule for out-of-control |
| :-- | :-- | :-- |
| p-chart | Weekly defective-record proportion | Point beyond UCL; 8 points on one side of centre line |
| I-MR chart | Search p95 latency per day | Point > 3σ; trend of 6 rising |
| p-chart | Crash-free sessions | Beyond control limits |
| c-chart | Defects found per release | > UCL triggers retrospective |

## Response plan template (8D-lite)
1. Contain (unpublish/rollback) → 2. Describe → 3. Root cause (5-Why / fishbone) → 4. Corrective action → 5. Verify → 6. Prevent (update FMEA/control) → 7. Communicate → 8. Close.

## Ownership & cadence
| Forum | Frequency | Attendees | Agenda |
| :-- | :-- | :-- | :-- |
| Quality stand-up | Weekly | Lead dev, data steward, curator | Dashboard, signals, actions |
| Risk review | Fortnightly | Product owner + leads | SS-06 |
| Release review (gate) | Per release | All + expert rep | SS-08 gates |
| Management review | Quarterly | Sponsor | Sigma level, cost, roadmap |

