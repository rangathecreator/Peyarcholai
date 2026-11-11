# SS-06 – Risk Register (Analyze / Improve)

**Scoring:** Probability (P) 1–5 × Impact (I) 1–5 = Score. High ≥ 15, Medium 8–14, Low < 8. Reviewed fortnightly.

| ID | Risk | Category | P | I | Score | Mitigation | Contingency | Owner | Status |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| R-01 | Name data inaccurate (religion/meaning) | Quality | 4 | 5 | **20** | Expert verification, citations, audit sampling (SS-07 C-01…C-04) | Unpublish + hotfix within 48 h | Curator | Open |
| R-02 | Unable to recruit enough experts | Resource | 3 | 4 | 12 | Honorarium, recognition badge, partner with temples/mosques/gurdwaras/churches/colleges, prioritise top communities | Reduce scope to well-sourced religions first | Product owner | Open |
| R-03 | Source licence conflict / takedown | Legal | 3 | 5 | **15** | Source register, legal gate, own-written meanings | Remove source batch; rebuild from other sources | Product owner | Open |
| R-04 | Swiss Ephemeris AGPL trap | Legal | 2 | 4 | 8 | MIT lib for Moon-only MVP; decision tree | Buy licence or use Prokerala API | Lead dev | Mitigated |
| R-05 | Numerology tradition disputes (users disagree with result) | Product | 4 | 3 | 12 | Selectable systems, explain calculation, show alternatives | FAQ + feedback loop | Product owner | Open |
| R-06 | Cultural/religious backlash on a name or content | Reputation | 3 | 5 | **15** | Neutral tone, expert review, report button, 24-h takedown SLA | Public clarification, quick fix | Product owner | Open |
| R-07 | Free-tier AI (OmniRoute) unavailable or disallows commercial use | Technical/Legal | 4 | 3 | 12 | Batch use only, paid fallback alias, quarterly ToS check | Switch to paid provider (₹3–8k for first corpus) | Lead dev | Open |
| R-08 | LLM hallucinations pass through | Quality | 4 | 4 | **16** | Evidence-required prompts, schema validation, human gate | Rollback dataset release | Data steward | Open |
| R-09 | Privacy breach of birth data | Security/Legal | 2 | 5 | 10 | On-device default, encryption, no PII to LLM, log scrubbing | Incident response, DPDP notification | Lead dev | Open |
| R-10 | Low organic traffic / seasonal retention | Market | 4 | 4 | **16** | SEO name pages, WhatsApp share loops, regional-language content, partnerships with hospitals/pregnancy apps | Paid acquisition test, B2B2C | Product owner | Open |
| R-11 | Cost overrun (SMS OTP, AI) | Financial | 3 | 3 | 9 | Guest mode, budgets/alerts, caching | Throttle features | Lead dev | Open |
| R-12 | Key-person dependency (small team) | Resource | 3 | 4 | 12 | Docs, shared core, CI, AI agents with human review | Contract developers | Product owner | Open |
| R-13 | App-store rejection (astrology claims, policies) | Compliance | 2 | 3 | 6 | Follow policy, disclaimers, no guarantees | Appeal, adjust wording | Product owner | Open |
| R-14 | Indic text rendering bugs on old devices | Technical | 3 | 3 | 9 | Bundled fonts, device-lab tests | OTA fix | Mobile dev | Open |
| R-15 | Poor performance on low-end phones | Technical | 3 | 4 | 12 | Snapshot size cap, lazy loading, perf budgets in CI | Per-language packs | Mobile dev | Open |
| R-16 | Competitor with larger name database | Market | 4 | 3 | 12 | Differentiate on verification, citations, horoscope integration, regional depth | Partnerships (S12) | Product owner | Open |
| R-17 | Secret leakage (plain-text keys in docs/repo) | Security | 4 | 3 | 12 | Secret scanning, env vars, rotate exposed OmniRoute key | Rotate immediately | Lead dev | **Action required** |
| R-18 | Spam/abuse in UGC | Quality | 3 | 3 | 9 | Moderation, rate limits | Disable UGC temporarily | Curator | Open |
| R-19 | AI chatbots give free name suggestions; established portals/astrology platforms copy features | Market | 4 | 4 | **16** | Moat = verified cited data, transparent numerology, family workflow and poll; avoid competing on generic suggestions | Pivot emphasis to poll + trust + regional depth | Product owner | Open (competitor audit pending; input analysis unverified) |
| R-20 | Poll causes family conflict or exposes personal data | Product/Legal | 3 | 4 | 12 | Parent-only decider, private links, neutral reasons, retention limits (doc 11 §6) | Disable comments, keep counts only | Product owner | Open |
| R-21 | Paid conversion far below 2–3% assumption; revenue below cost | Financial | 4 | 4 | **16** | G0 price test (₹199 vs ₹299), lean solo cost model, stage gates | Treat as content/SEO play (ads + affiliate); freeze paid features | Product owner | Open |
| R-22 | Reconciled estimates diverge (infra-only vs fully-loaded cost) and mislead decisions | Governance | 3 | 3 | 9 | Doc 12 reconciliation; always cite fully-loaded cost (doc 08 §5.2) | Re-baseline budget | Black Belt | Mitigated |

## Heat map (P × I)

| P \ I | 1 | 2 | 3 | 4 | 5 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 5 | | | | | |
| 4 | | | R-05, R-07, R-16, R-17 | R-08, R-10, R-19, R-21 | R-01 |
| 3 | | | R-11, R-14, R-18, R-22 | R-02, R-12, R-15, R-20 | R-03, R-06 |
| 2 | | | R-13 | R-04 | R-09 |
| 1 | | | | | |

## Top risks to steer
1. **R-01 / R-08 (data trust)** → drives the verification pipeline investment.
2. **R-10 (traffic)** → SEO and share loops built into MVP, not afterthoughts.
3. **R-03 / R-06 (legal/cultural)** → legal review and expert board before launch.

