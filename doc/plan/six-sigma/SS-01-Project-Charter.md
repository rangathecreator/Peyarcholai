# SS-01 – Project Charter (Define)

| Field | Content |
| :-- | :-- |
| **Project** | NamingGuru – baby-name discovery, numerology and horoscope-aware naming platform for India |
| **Document ID / version** | SS-01 / 1.0 – 2026-11-09 |
| **Sponsor / Owner** | Product owner (to be named) |
| **Black Belt (process owner)** | Lead architect |
| **Green Belts** | Data steward, QA lead |
| **Methodology** | DMAIC for the data & engine quality; DFSS (DMADV) for new-product design elements |

## 1. Problem statement
Indian parents consult relatives, pandits, multiple websites and apps to choose a name. Existing sources are fragmented, religion/region coverage is uneven, meanings are inconsistently accurate, numerology results differ between sites, and nakshatra-letter lookup is separate from name search. Parents spend **days to weeks** and still doubt correctness.

## 2. Business case
* Underserved, high-intent, high-emotion niche with strong SEO demand and WhatsApp virality.
* Low run cost (doc 08) and clear freemium monetisation.
* Differentiator: **verified, cited, multi-tradition data + deterministic numerology + horoscope integration** in one offline-capable app.

## 3. Goal statement (SMART)
Within **16 weeks after passing gate G0 (validation)** deliver a web-first MVP (Android after traction) with ≥ 20,000 verified names in 3 languages, the evaluation scorecard and social poll, a numerology/nakshatra engine with **zero defects on 500 golden cases**, and measured quality at or above the sigma targets in SS-04; achieve **time-to-shortlist ≤ 10 min** for 80% of beta users. Decision rule from the earlier study: if paid conversion stays well below the assumed 2–3%, reposition as a content/SEO product.

## 4. Scope
| In | Out |
| :-- | :-- |
| Name data pipeline & verification | Consultation marketplace |
| Numerology & nakshatra engine | Legal name-change procedures |
| Web, Android (iOS in v1) | Social network features |
| Quality system & control plan | Offline Kundli (full) in MVP |

## 5. Critical-to-quality (CTQ) summary (detail in SS-02)
1. Correct numerology & nakshatra results
2. Accurate, cited name meanings/religion/gender
3. Fast, relevant search and filters
4. Respectful, inclusive, non-harmful content
5. Reliable app (availability, crash-free, offline)
6. Privacy of birth data

## 6. Baseline & targets (Y metrics; detail SS-04)
| Y | Baseline (benchmark of existing apps/sites – to be measured in Measure phase) | Target |
| :-- | :-- | :-- |
| Name record defect rate (DPMO) | Unknown; hypothesised 20,000–60,000 (3–3.5σ) on scraped lists | ≤ 1,350 (4.5σ) by MVP; ≤ 233 (5σ) by v1 |
| Numerology engine defects | Variance between sites ~ 10–20% (hypothesis) | 0 on 500 golden cases (6σ) |
| Search zero-result rate | – | ≤ 3% |
| Time to shortlist | ~ days (offline research) | ≤ 10 min median |
| Crash-free sessions | – | ≥ 99.5% |

## 7. Stakeholders
| Stakeholder | Interest | Engagement |
| :-- | :-- | :-- |
| Parents & elders | Trust, ease | Beta, surveys, interviews |
| Domain experts | Authentic content, credit | Advisory board, honorarium, “verified by” badge |
| Product owner / sponsors | ROI | Fortnightly review |
| Regulators/stores | Compliance | Checklists (doc 11) |

## 8. Team & resources
Lead dev, mobile/FE dev, curator, QA (part-time), designer (part-time), 8–12 experts, AI agents via OmniRoute (doc 09). Budget: doc 08 §4.

## 9. High-level timeline
Define wk 1–2 → Measure wk 2–5 → Analyze wk 5–7 → Improve wk 7–14 → Control wk 14–16 (+ ongoing). See doc 10.

## 10. Risks & assumptions
Top risks in SS-06. Assumptions: free-tier AI remains available for batch; experts recruited within 4 weeks; open sources yield ≥ 20k names.

## 11. Approvals
| Role | Name | Date | Signature |
| :-- | :-- | :-- | :-- |
| Sponsor | | | |
| Black Belt | | | |
| Product owner | | | |

