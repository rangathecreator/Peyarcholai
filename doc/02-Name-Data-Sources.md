# 02 – Name Data Sources (target: 1 crore+ names)

> **Correction note:** My first draft included sources that are unrealistic or legally risky (state birth registries as a bulk source, electoral rolls, social-media scraping, and volume estimates that were guesses). They are re-assessed below.

## Key insight on "1 crore names"
10 million **records** is achievable, but 10 million **distinct, curated names** is not: the number of genuinely distinct given names is far smaller (likely in the hundreds of thousands to low millions, including spelling variants). A crore of rows only appears if you count:
- name + spelling variants + transliterations in several scripts, and
- name × community × region combinations, or occurrence counts from population lists.

Recommendation: define the target as **distinct canonical names + variants + frequency counts**, and treat "1 crore" as total occurrences/variants, not unique names.

## Source assessment

| Source | Realistic yield | Access | Legal / ethical status | Verdict |
|---|---|---|---|---|
| Public-domain and open Indian name lists (Wikipedia/Wikidata given-name entries, Wiktionary, Wikisource) | Thousands–tens of thousands, with meanings | Dumps / APIs, CC-licensed | Good (respect CC BY-SA terms) | **Use** |
| Open government datasets (data.gov.in) | Aggregate datasets; names rarely published at scale | Download | Check each dataset licence | Use where available |
| Census | Census does not publish individual names | – | – | **Not a name source** |
| Electoral rolls | Millions of personal records (PDFs by state) | State CEO sites | Personal data; DPDP Act concerns even if public; use only for aggregate counts, if at all, after legal advice | **High risk – avoid** |
| Birth registries | Individual names not bulk-published | – | Personal data | **Not available** |
| Baby-name websites | Large lists, often scraped copies of each other | Crawling | Terms of use and copyright on compilations; may forbid scraping | Licence/partner instead of scraping |
| Scriptural/epic name indexes (Mahabharata, Ramayana, Puranas, Sangam texts, Guru Granth Sahib, religious name lists) | Several thousand names with citations | Public-domain texts, digitised editions | Original old texts are public domain; modern translations are not | **Use** (high trust, supports references) |
| Historical/literary figures lists (Wikidata) | Tens of thousands | SPARQL / dumps | Open | **Use** |
| Social-media public names | Large | API/scraping | Platform terms prohibit scraping; personal data | **Avoid** |
| Crowdsourcing (users submit names + meaning + community) | Grows over time | In-app | Needs consent and moderation | **Use** (long-term growth engine) |
| Partnerships (hospitals, schools, regional language authorities, universities, NGOs) | Aggregate frequency data | Agreements | Anonymised, aggregate only | **Pursue** for uniqueness data |
| Commercial name databases | Varies | Licence | Paid | Evaluate |
| LLM-assisted generation of variants/transliterations | Many variants | API | Must be verified, flag as unverified | Use for variants, not for facts |

## Data model (per name)
`id`, `canonical_name`, `script_forms[]` (per language), `transliterations[]`, `gender`, `languages[]`, `regions[]`, `communities[]`, `religion` (optional), `meaning_en`, `meaning_native[]`, `numerology_values{method→number}`, `references[]` (text, citation), `frequency` (aggregate, per region), `source`, `license`, `verified`, `last_reviewed`.

## Coverage plan
1. **Phase 1 (MVP)** – 50k–100k curated names across major languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu) from open sources and scriptural indexes.
2. **Phase 2** – variants, transliterations, community tags via crowdsourcing and expert review; reach 500k+ records.
3. **Phase 3** – partnerships for aggregate frequency data; expand to tribal/regional communities; scale toward millions of variant records.

## Pipeline sketch
Ingestion → normalisation (Unicode NFC, script detection, transliteration) → de-duplication (phonetic + edit distance) → enrichment (numerology, gender hint) → human review queue → search index (e.g. Elasticsearch/OpenSearch or Postgres full text; BigQuery is better suited to analytics than serving app queries).

## Compliance checklist
- Record source and licence for every row.
- No personal data from individuals; aggregate counts only.
- Respect robots.txt and terms of use.
- Legal review under India's DPDP Act, 2023 and copyright law before bulk ingestion.
