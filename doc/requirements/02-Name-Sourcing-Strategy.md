# 02 – Name Sourcing Strategy

**Goal:** a verified, classified pool of **20k (MVP) → 60k (v1) → 150k+ (v2)** names that serves every major Indian tradition, not only mainstream Hindu names.

## 1. Principles

1. **Names are facts; descriptions are creative works.** A name string is not copyrightable, but a site's curated list, ordering and meaning text is. We collect names from many sources and **write our own meaning text** (human-verified, AI-drafted).
2. **Every record carries provenance** (`source_id`, URL/citation, licence, retrieval date).
3. **No wholesale scraping** of commercial baby-name sites (ToS and copyright risk).
4. **Human verification** by a community/domain expert for religion-specific names (Gate G3 in SS-08).
5. **Tiered trust:** `verified` → `reviewed` → `candidate` → `rejected`. Only `verified`/`reviewed` appear by default.

## 2. Source options (all channels)

| # | Source channel | Examples | Covers | Licence / legal | Volume | Quality | Cost | Verdict |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| S1 | **Open knowledge bases** | Wikidata given-name items, Wikipedia name-disambiguation pages, Wiktionary | Multi-language, gender, script | CC0 / CC-BY-SA (attribute) | 30–60k | Med (noisy) | Free | ✅ Core |
| S2 | **Public-domain scriptures & epics** | Ramayana, Mahabharata, Puranas, Vishnu/Shiva/Lalita Sahasranama, Upanishads, Bhagavad Gita | Hindu, classical Sanskrit, deity names | Public domain (use original text, not modern translations) | 5–8k | High meaning accuracy | Free | ✅ Core |
| S3 | **Sanskrit lexicons** | Monier-Williams, Apte, Amarakosha (via Cologne Digital Sanskrit Lexicon) | Meaning, etymology | Open-licensed (check per dictionary) | 10k+ roots | High | Free | ✅ Meaning enrichment |
| S4 | **Religious texts of other faiths** | Quranic names & Asma-ul-Husna, Hadith names, Bible (KJV/Public domain), Guru Granth Sahib, Jain Tirthankara/Agam, Pali canon, Avesta | Muslim, Christian, Sikh, Jain, Buddhist, Parsi | Public domain / open | 6–10k | High | Free | ✅ Core |
| S5 | **Regional classical literature** | Tamil Sangam (Tolkappiyam, Thirukkural), Kannada vachanas, Telugu Prabandhas, Malayalam classics, Bengali (Tagore), Marathi saints | Regional/native names | Mostly public domain | 5–10k | High | Free | ✅ v1 |
| S6 | **Open datasets** | Kaggle “Indian names” sets, GitHub name lists, NLTK `names`, HuggingFace name corpora | Broad, mixed | **Mixed – check each**; many “Other/unspecified”. Use as *candidate names only*, not meanings | 30–60k | Low–Med | Free | ⚠️ Candidates only |
| S7 | **Government / institutional** | Electoral rolls, school admissions, census surname lists, university lists, Kerala/TN public-service lists | Real-world frequency, regional distribution | Often restricted; use only openly published aggregates (data.gov.in – NDSAP) | Varies | High for popularity | Free | ⚠️ Aggregates only, DPDP-safe |
| S8 | **Community & expert contributors** | Pandits, maulvis, pastors, granthis, Jain munis, regional language scholars, retired teachers | Authentic, hyper-local | Contributor agreement (CC-BY / assignment) | 10–30k | **Highest** | Honorarium ₹30–60k | ✅ Core for trust |
| S9 | **Crowdsourcing (UGC)** | “Suggest a name”, “Report error”, upvotes | Emerging/regional names | ToS grant + moderation | grows | Low→Med after review | Free + moderation | ✅ v1 |
| S10 | **AI-generated candidates** (via OmniRoute) | LLM proposes names per community/region/theme + drafts meanings | Fills gaps in coverage | Output is ours; must be verified | 20–50k | **Hallucination risk** | ~Free via OmniRoute | ✅ Draft only, never auto-publish |
| S11 | **Trend signals** | Google Trends, celebrity/film/OTT/cricketer names, Instagram/Reels trending baby names, in-app search & favourite analytics | Trend score | Aggregates / own analytics | n/a | Med | Free | ✅ Trend dimension |
| S12 | **Licensed data partnerships** | Baby-name publishers, astrologer networks, panchang providers | Curated meanings, rashi mapping | Commercial licence | 50k+ | High | ₹₹ (negotiated) | 🔶 Option if scaling |
| S13 | **Print & book digitisation** | Public-library name dictionaries (out-of-copyright), Gazetteers | Archaic/regional names | Public domain only after 60 yrs of author's death | 5k | Med (OCR) | OCR cost | 🔶 Optional |
| S14 | **Phonetic/rule generators** | Syllable-based generator following language morphology (e.g., Sanskrit sandhi, Tamil naming) | Unique modern-sounding names | Own IP | unbounded | Needs review | Low | 🔶 v2 “Create unique name” |

## 3. Coverage matrix – ensuring all Indian audiences are served

| Dimension | Values (initial taxonomy) | Primary sources |
| :-- | :-- | :-- |
| Religion | Hindu, Muslim, Christian, Sikh, Jain, Buddhist, Parsi/Zoroastrian, Jewish (Bene Israel), Tribal/Sarna, Non-religious/Secular | S2,S4,S8 |
| Language | Hindi, Sanskrit, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, Urdu, Konkani, Kashmiri, Sindhi, Nepali, Manipuri, Tulu, Bhojpuri | S1,S5,S8 |
| Community / sub-group | Brahmin (Iyer, Iyengar, Deshastha…), Rajput, Maratha, Nair, Reddy, Vokkaliga, Lingayat, Bengali Kayastha, Marwari, Sindhi, Syed/Pathan/Sheikh, Syrian Christian, Anglo-Indian, Khalsa, Agarwal Jain, Tribal communities… | S8 (expert-tagged) |
| Region / State | 28 states + 8 UTs; zone (N/S/E/W/NE/Central) | S1,S5,S7,S8 |
| Gender | Boy, Girl, Unisex | all |
| Theme (meaning) | Deities, nature, virtues, rivers/mountains, stars, music, warrior, wisdom, light, flowers, birth-season… | S2,S3,S10 |
| Trend | Classic, Evergreen, Rising, Modern, Rare/Unique | S11 |
| Ease of call | 1–5 score (see doc 04 §4) | computed |
| Starting letter | Latin + native script | computed |
| Nakshatra syllable | 108 syllable map | computed (doc 03) |

> Sub-community tagging is **expert-verified only** and optional on a record. Never infer caste from a name algorithmically (ethical rule, see doc 11).

## 4. Pipeline – from source to published name

```mermaid
flowchart LR
    S[Sources S1–S14] --> E[Extract<br/>API / dumps / OCR / forms]
    E --> N[Normalise<br/>Unicode NFC, script detect, transliterate ITRANS/IAST/ISO 15919]
    N --> D[Deduplicate<br/>phonetic keys + fuzzy match + variant clusters]
    D --> C[Classify<br/>rules + LLM via OmniRoute]
    C --> M[Enrich<br/>meaning draft, origin, nickname, ease-of-call, numerology]
    M --> V{Verification queue}
    V -- expert OK --> P[(Published: verified)]
    V -- minor edit --> M
    V -- reject --> R[(Rejected + reason)]
    P --> X[Search index + CDN + app bundle]
    P --> Q[Quality sampling & audit<br/>SS-04 / SS-07]
```

### Verification workflow (Gate G3)
1. AI drafts religion, language, gender, meaning, origin with **confidence score** and cites the lexicon/scripture line.
2. Auto-accept only if: ≥ 2 independent sources agree **and** confidence ≥ 0.9 **and** not religion-sensitive.
3. Religion/community-sensitive or low-confidence → expert queue (target throughput 150 names/expert-hour).
4. 5% random sample audited every release (acceptance sampling, SS-07).

## 5. Phased acquisition plan

| Phase | Target | Sources used | Effort |
| :-- | :-- | :-- | :-- |
| P0 (wk 1–4) | 20k names, 6 religions, 8 languages | S1,S2,S4, S6 (candidates), S10 | 2 weeks pipeline + 2 weeks verification |
| P1 (wk 5–12) | +20k, regional depth, trend | S5, S8, S11 | Recruit 8–12 expert advisors |
| P2 (v1.x) | 60k | S9 UGC, S3 meaning enrichment | Moderation workflow |
| P3 (v2) | 150k+ | S12 partnerships, S14 generator | Commercial deals |

## 6. Quality & cost expectations

| Item | Estimate |
| :-- | :-- |
| Expert verification | ≈ ₹3–5 / name → 20k names ≈ ₹60k–1L |
| Advisor honoraria (12 experts) | ≈ ₹30–60k for MVP |
| AI drafting cost (OmniRoute free tiers) | ≈ ₹0 (≈ 40M tokens for 60k names; well within free pools) |
| OCR / digitisation (optional) | ≈ ₹10–30k |

## 8. Refinements from the earlier study (doc 12)

**What does “1 crore names” mean?** 10 million *records* is plausible; 10 million *distinct curated names* is not. Distinct given names are likely hundreds of thousands to low millions including spelling variants. Define the target as **distinct canonical names + variants/transliterations + aggregate frequency counts**, and treat “1 crore” as total variants/occurrences. This plan’s 20k → 60k → 150k+ figures are *distinct canonical names*.

| Source | Verdict (from input `doc/02`) | Effect on this plan |
| :-- | :-- | :-- |
| Census | Not a name source (no individual names) | Do not list |
| Electoral rolls | High risk (personal data; DPDP) – avoid, aggregate counts only after legal advice | S7 restricted to openly published aggregates |
| Birth registries | Not available in bulk | Do not list |
| Social-media public names | Avoid (platform terms, personal data) | Excluded; S11 uses aggregate trend signals only |
| Baby-name websites | Licence/partner rather than scrape | Matches principle 3 |
| Hospitals, schools, language authorities, universities, NGOs | Pursue for **anonymised aggregate frequency** data | New source **S15 – aggregate-frequency partnerships**; feeds the uniqueness score (FR-23) |
| LLM variants/transliterations | Use for variants, not facts; flag unverified | Matches S10 |

**Data model additions:** per name `frequency` (aggregate, per region), `references[]` (text + citation), `license`, `last_reviewed` – see doc 04 §7.

Uniqueness score stays labelled **estimate** until S15 data exists.

## 7. Decision

Adopt **S1+S2+S3+S4+S5 as the licensed-clean backbone**, **S8** for trust and community depth, **S6/S10 as candidate generators only**, **S9/S11** for freshness. Avoid scraping commercial sites. Reassess **S12** after 10k MAU.


---

## 9. Tamil MVP Revision: 10,000+ Names & 14 Parent-Centric Criteria (OmniRoute-Revised)

Per Product Owner direction, the Tamil MVP sources **10,000+ distinct Tamil baby names** into [`app/src/data/tamil-names-seed.json`](../../app/src/data/tamil-names-seed.json) (and optional PostgreSQL `names` table) with **10 mandatory user-requested criteria + 4 extra parent-perspective dimensions**, reviewed via the local OmniRoute Free Gateway (`http://127.0.0.1:20128/v1`, `model=openai/gpt-oss-120b` via Groq, `$0.00` cost — see [`app/src/data/omniroute-revised-plan.json`](../../app/src/data/omniroute-revised-plan.json) and [`doc/implementation/TODO.md`](../implementation/TODO.md)).

| # | Dimension | Field Name | Requirement & Parent Value |
| :--- | :--- | :--- | :--- |
| **1** | **Meaning** | `meaningTa`, `meaningEn`, `etymologyRoot` | Clear Tamil & English meaning + morphological root breakdown (`பகுபத உறுப்பிலக்கணம்`). |
| **2** | **Multi-Language Meanings** | `multilingualMeanings[]` | Meanings across **Tamil, Sanskrit, Malayalam, Telugu, Kannada, Hindi, and English** when the same phonetic name exists across languages, plus a `falseFriendWarning` safety check. |
| **3** | **Granular Literary Reference** | `structuredReference` | Exact work, section (`Kandam` / `Adhigaram` / `Padalam`), verse/line/song number (`Paadal` # / `Sutra` # / `Kural` #), song title, and original Tamil excerpt (e.g., *Kamba Ramayanam*, *Tolkappiyam* line 34, *Purananuru* song 56). |
| **4** | **Numerology & Method** | `numerology` | Defaults to **Standard Pythagorean Method (A–Z = 1–9)** while also providing **Chaldean (1–8)** side-by-side, including explicit per-letter values (`letterBreakdown[]`), method name, and planetary ruler. |
| **5** | **Religion, Community & Geography** | `culturalContext` | Religion (`Hindu`, `Secular Tamil`, `Christian Tamil`, `Muslim Tamil`, `Jain Tamil`), community/cultural tradition (`Kongu`, `Chettinad`, `Chola Nadu`, `Pandya Nadu`, `Nanjil`, `Jaffna/Eelam`), and Sangam Tinai (`Kurinji`, `Mullai`, `Marutham`, `Neithal`, `Palai`). |
| **6** | **Suitable Gender** | `gender`, `genderSuitabilityNote` | `boy`, `girl`, or `unisex` with grammatical suffix justification (`-an`/`-on` vs `-ai`/`-i`/`-ini`/`-al`). |
| **7** | **Ease of Calling** | `easeOfCalling` | Phonetic callability across `nativeTamilScore` (1–10), `panIndiaScore` (1–10), `globalScore` (1–10), syllable breakdown, and retroflex `ழ`/`ள`/`ண` tips. |
| **8** | **Chances of Misspell** | `spellingAssessment` | Misspell risk (`Low`, `Medium`, `High`), `recommendedOfficialSpelling`, common variants (`zh` vs `l`, `sh` vs `s`), and confusion reason. |
| **9** | **Uniqueness in Region** | `uniqueness` | Rarity band (`Very Rare`, `Rare`, `Moderate`, `Popular`, `Very Common`), 0–100 score, and estimated percentile in Tamil Nadu & Diaspora. |
| **10** | **Is It a Trending Name?** | `trendStatus` | Boolean `isTrending`, category (`Trending Now`, `Rising Fast`, `Evergreen Classic`, `Rare Sangam Revival`), and trend driver. |
| **11** | **Affectionate Nicknames** | `nicknames[]` | Ready-to-use home pet names (`செல்லப் பெயர்கள்`) in Tamil and English. |
| **12** | **Official Document Fit** | `documentFit` | Character length, initial-prefix preview (`S. Name`), and Aadhaar/Passport/school form clarity. |
| **13** | **27 Natchathiram & Rasi Fit** | `nakshatraSlugs[]`, `rasiTa`, `matchingSyllables[]` | Direct mapping to 27 Tamil birth stars and 12 Rasis via starting syllable (`நாம நட்சத்திர எழுத்து`). |
| **14** | **Sibling & Twin Harmony** | `siblingPairSuggestions[]` | Rhyming or thematic brother/sister/twin name suggestions from the same literary root. |


Other sources as per Gemini 

1. Classical & Ancient Tamil Literature (Pure / Sanga Tamil)If your app aims to offer authentic, historical, or "Pure Tamil" (தூய தமிழ்) names, classical literature provides rich material across nature, geography, and values.Sangam Literature (சங்க இலக்கியம்):Ettuthokai (Eight Anthologies): Athan, Athiyan, Kapilan, Nannilam, Pari, Ori, Kari, Kayalvizhi, Kavin.   Pattupattu (Ten Idylls): Names rooted in ancient Tamil landscapes (Kurinji, Mullai, Marutham, Neithal, Palai).   Tamil Epics (ஐம்பெருங்காப்பியங்கள்):Silappathikaram & Manimekalai: Kannaki, Manimegalai, Kovalan, Madhavi, Ilango.   Civaka Cintamani & Valayapathi: Classic royal and character names.   Classical Dictionaries & Glossaries (நிகண்டு):Chendhan Divakaram, Pingala Nigandu, & Choodamani Nigandu: Ancient Tamil thesauruses providing root word origins, synonyms, and meanings.2. Tamil Lexicons & Linguistic DatabasesFor verified word roots, semantic accuracy, and script transliterations.University of Madras Tamil Lexicon: Available digitally via the University of Chicago’s Digital Dictionaries of South Asia (DDSA). Excellent for root validation (e.g., distinguishing pure Tamil roots from Indo-Aryan/Sanskrit loanwords).Tamil Virtual Academy (தமிழ் இணையக் கல்விக்கழகம் - TVA): Offers digital repositories of classic Tamil texts, dictionaries, and historical name glossaries.Kriya’s Dictionary of Contemporary Tamil: Helps evaluate whether names sound contemporary or obsolete in modern usage.3. Dedicated Tamil Name Portals & Digital RepositoriesExisting online databases useful for benchmarking, initial dataset seedings, or API structure reference.Tamilcube (tamilcube.com): Large repository of traditional and modern Tamil names categorized by gender, alphabet, and star/nakshatra.Thamizhagam.net: Hosts extensive lists of Pure Tamil names (தூய தமிழ் பெயர்கள்) divided by categories (Nature, Courage, Virtues).Pure Tamil Baby Names (PureTamilBabyNames blogs/portals): Curated open sources focusing strictly on non-Sanskritized Tamil names.Wiktionary (Tamil Edition - ta.wiktionary.org): Useful for mapping root Tamil words to English meanings and linguistic categories.4. Cultural & Devotional SourcesMany parents search for names tied to regional deities, sacred texts, or traditional iconography.   Murugan / Skanda Hymns: Kandar Anubhuthi, Kandar Alangaram, Thirupugazh (Names like Velan, Senthil, Kartikeyan, Kavin, Shanmugan).Saivite Literature (Thirumurai): Tevaram and Thiruvasagam (Names like Chezhian, Arulmozhi, Sivananthan).   Vaishnavite Literature (Divya Prabandham): Naalayira Divya Prabandham, Tiruppavai by Andal (Names like Mayon, Azhwar, Andal, Nappinnai).   5. Categorization Attributes for Your Web App SchemaTo make your app features robust (e.g., filter/search parameters), structure your database source attributes across these dimensions:CategoryExample Attributes / Filter FieldsOrigin / TypePure Tamil (தூய தமிழ்), Sangam (சங்கத் தமிழ்), Devotional, Modern/HybridThemeNature (Malar, Thendral, Nila), Virtues (Anbu, Arivu), Royalty (Arasan, Elango), Art/Music (Isai, Yazh)Linguistic DetailsTamil Script Name, English Transliteration, Meaning, GenderTraditional MetadataStarting Tamil Alphabet (அ, ஆ, இ...), Rasi / Nakshatra (Astrological sound alignment)

Other sources as per chatgpt


