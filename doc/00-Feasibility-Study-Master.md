# 00 – KidNamingApp Feasibility Study (Master)

**Vision:** Web + mobile app that helps Indian parents choose a child's name with numerology insight, a large categorised name dictionary, a multi-dimension name evaluation, and a social "vote-out" poll.

## Document map
| Doc | Topic |
|---|---|
| [01-Numerology-Methods.md](01-Numerology-Methods.md) | Methods used in India, references, product implications |
| [02-Name-Data-Sources.md](02-Name-Data-Sources.md) | Sources and plan for the name collection (1 crore target) |
| [03-Name-Evaluation-Engine.md](03-Name-Evaluation-Engine.md) | 7-dimension name scorecard |
| [04-Social-Poll-Feature.md](04-Social-Poll-Feature.md) | Shortlist-of-10 poll with removal reasons |
| [05-Competitor-Analysis.md](05-Competitor-Analysis.md) | Competitors, gaps, differentiation |
| [06-Revenue-And-Cost-Model.md](06-Revenue-And-Cost-Model.md) | Revenue streams, cost, break-even |
| [07-Value-Add-Features.md](07-Value-Add-Features.md) | Prioritised additional features |

## Review of the first draft (what was wrong and fixed)
The first version of this study was saved outside this folder (in the tool's artifact area) and contained unreliable content. Fixes:

| Issue in first draft | Fix |
|---|---|
| Saved to the wrong location | Now stored in `E:\project\KidNamingApp\doc` |
| Invented/unverifiable numerology method names and book authors | Replaced with verified-lineage methods; all references flagged "verify" (doc 01) |
| Treated census, electoral rolls, birth registries and social-media scraping as name sources with made-up volumes | Re-assessed; high-risk/unavailable sources rejected (doc 02) |
| Assumed 1 crore *distinct* names is realistic | Clarified: 1 crore is achievable only as variants/occurrences, not unique names |
| Stack suggested BigQuery as the main app search store and an overly Google-specific design | Revised: use a search engine/Postgres for serving, analytics warehouse optional |
| MVP "4–5 months" with no basis | Kept as a rough guess; validate with a team estimate |

## Feasibility summary
| Area | Rating | Comment |
|---|---|---|
| Numerology calculator | **High** | Deterministic algorithms; content needs expert validation |
| Name dictionary | **Medium** | Curated 50k–500k names feasible; "1 crore" needs redefinition; data/content is the main cost |
| Name evaluation | **Medium** | Some dimensions easy (length, spelling variants), meaning/references need curation |
| Social poll | **High** | Simple tech, strong viral potential; privacy/moderation care needed |
| Competitive position | **Medium-High** | Competitors are shallow on evaluation and family workflow; AI chatbots are a threat |
| Revenue | **Moderate** | See doc 06; likely loss-making early without lean team and strong SEO/virality |
| Legal/privacy | **Manageable** | DPDP Act compliance, content licensing, astrology disclaimers; get legal review |

## Recommended approach
1. **Validate first**: landing page, parent interviews, competitor audit.
2. **Web-first MVP**: numerology (3 methods) + evaluation scorecard + shortlist + social poll, with 50–100k curated names.
3. **Grow data** through scriptural/open sources, crowdsourcing and partnerships.
4. **Monetise** through premium reports, ads, affiliate, then B2B/consultation.
5. **Mobile app** after web traction.

## Suggested tech stack (starting point, not mandatory)
Next.js web; Flutter or React Native for mobile; Postgres + OpenSearch for names and search; object storage; a managed auth service; TTS API; an LLM used only for variants/suggestions grounded in the curated DB.

## Open questions for the product owner
- Which languages/regions are in scope for MVP?
  - **Answer:** Tamil only.
- Budget and team size (determines lean vs. full plan)?
  - **Answer:** Lean. MVP budget is the AI models available for development and deployment. Reuse the existing donorconnect.in infrastructure to keep infra cost low.
- Is the app free-with-ads, premium, or B2B-first?
  - **Answer:** Ads from the start. A subscription is introduced once the ecosystem has a considerable subscriber base.
- Who will curate meanings and references (in-house scholars vs. partners)?
  - **Answer:** AI reviews and generates meanings from online sources; no staff for now. Later, the public can suggest meanings and AI will review and approve them.

