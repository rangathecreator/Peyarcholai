# SS-03 – SIPOC (Define)

## 1. SIPOC – Name data & engine value stream

| Suppliers | Inputs | Process (high level) | Outputs | Customers |
| :-- | :-- | :-- | :-- | :-- |
| Wikidata/Wikipedia, scripture corpora, lexicon providers, open datasets | Raw names, texts, licences | **1.** Acquire & log provenance | Raw records with source IDs | Data pipeline |
| Data pipeline | Raw records | **2.** Normalise, transliterate, dedupe | Clean unique candidates | Enrichment |
| OmniRoute / LLM providers | Candidate names + prompts | **3.** Classify & draft meaning, ease-of-call | Enriched drafts + confidence | Review queue |
| Domain experts, curators | Drafts needing verification | **4.** Verify & approve | Verified records | Release builder |
| Engineering | Verified dataset, core library | **5.** Build index, snapshot, release | `names-YYYY.MM.N`, SQLite snapshot | Apps / web / API |
| Apps/web/API | Release + user inputs (DOB, filters) | **6.** Compute numerology, nakshatra, search | Shortlist, report | Parents & elders |
| Users | Feedback, reports, suggestions | **7.** Monitor, triage, improve | Fixes, new releases | Curators, engineers |

## 2. SIPOC diagram

```mermaid
flowchart LR
    S["Suppliers<br/>open sources, experts,<br/>AI gateway, users"] --> I["Inputs<br/>raw names, texts,<br/>prompts, birth data"]
    I --> P1[1 Acquire] --> P2[2 Normalise & dedupe] --> P3[3 Enrich] --> P4[4 Verify] --> P5[5 Release] --> P6[6 Serve] --> P7[7 Monitor & improve]
    P7 -.feedback.-> P1
    P6 --> O["Outputs<br/>verified names,<br/>numerology, nakshatra,<br/>shortlist & report"]
    O --> C["Customers<br/>parents, elders,<br/>curators, partners"]
```

## 3. Process-step ownership & key measures

| Step | Owner | Critical output | Key measure (SS-04) |
| :-- | :-- | :-- | :-- |
| 1 Acquire | Data engineer | Source register entry | % records with licence + provenance |
| 2 Normalise & dedupe | Data engineer | Unique canonical names | Duplicate escape rate |
| 3 Enrich | AI/data steward | Draft with confidence | Draft acceptance rate; JSON validity |
| 4 Verify | Curator/experts | Verified record | Audit DPMO; review cycle time |
| 5 Release | Lead dev | Dataset release | Release defects; snapshot size |
| 6 Serve | Lead dev | Results | Latency, correctness, crash-free |
| 7 Monitor | Ops/PO | Fix backlog | Mean time to correct a reported error |

