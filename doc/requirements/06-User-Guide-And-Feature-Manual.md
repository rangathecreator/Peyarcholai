# பெயர்ச்சோலை (Peyarcholai) — Comprehensive User Guide, Feature Manual & Site Documentation

**Application Name:** பெயர்ச்சோலை (Peyarcholai — தமிழ் குழந்தை பெயர் வழிகாட்டி)  
**Location:** `doc/deployment/site/02-User-Guide-And-Feature-Manual.md`  
**Web App URL:** `http://localhost:3020` (Local) | `/docs` (In-App Guide)  
**Current Edition:** v4.0 (Six-Sigma 6.0σ Certified • QA Checklist v1.0 Compliant)  
**Catalog Size:** 10,718 Total Records (10,090 Active Verified Names, 628 Quarantined)

---

## 1. Introduction & Core Philosophy

Naming a child is one of the most culturally significant, emotionally resonant, and legally lasting decisions parents will ever make. In Tamil culture, a name is not merely an arbitrary tag; it reflects:
1. **Linguistic Purity (*Semmozhi*)**: Grammatical correctness according to classical treatises like *Tolkappiyam* and *Nannool*.
2. **Astrological Alignment (*Vakya / Thirukanitha Panchangam*)**: Harmonic correspondence with the child's birth star (*Natchathiram*) and specific quarter (*Padam*).
3. **Numerological Balance**: Dual Chaldean and Pythagorean numerical vibrations.
4. **Cultural Grounding & Provenance**: Legitimate connection to Sangam literature, epics, historical inscriptions, and attested lexicon root headwords—distinguishing authentic classical verses from modern synthesized compounds.
5. **Modern Practicality**: Ease of pronunciation in Tamil Nadu, across pan-Indian states, and globally throughout the Tamil diaspora (Singapore, Malaysia, Sri Lanka, UK, USA, Canada, UAE, Australia, etc.).

பெயர்ச்சோலை (Peyarcholai) was built from the ground up to solve the widespread misinformation on commercial baby-naming sites, which frequently fabricate verses, assign Sanskrit meanings to pure Tamil words (or vice versa), and invent false classical citations.

---

## 2. Interactive Feature Walkthrough (Tab by Tab)

### Feature 1: Name Explorer (`/` — Main Tab)
The Name Explorer provides access to the complete **10,090+ active verified Tamil names** partitioned across 42 sharded JSON data stores.

#### How to Use:
1. **Instant Search**: Type any name in Tamil script (`கவின்`, `யாழினி`, `இனியன்`) or English transliteration (`Kavin`, `Yazhini`, `Iniyan`). The search engine uses normalized phonetic indexing and instantly resolves spelling variations.
2. **Tamil Starting Letter Quick-Bar (`முதல் எழுத்து`)**:
   - Click any Tamil vowel (`அ`, `ஆ`, `இ`, `ஈ`, `உ`, `ஊ`, `எ`, `ஏ`, `ஐ`, `ஒ`, `ஓ`, `ஔ`) or consonant-row header (`க`, `ச`, `ஞ`, `த`, `ந`, `ப`, `ம`, `ய`, `வ`, `ழ`, `ல`, `ர`) to instantly filter the entire catalog.
   - Click `↺ Reset Filters` to return to the full view.
3. **Gender Filtering**: Switch between `All`, `Girl (பெண்)`, `Boy (ஆண்)`, or `Unisex (இருபாலர்)`.
4. **Quality & Provenance Badges**:
   - **`📜 Classical Text Verified`**: Appears on names directly attested in classical Sangam literature or epics with verified verse citations.
   - **`🧪 Modern Synthesis`**: Appears on compound names constructed from authentic roots (e.g., `கலை + வாணி -> கலைவாணி`), with clear separation between literal root meanings and derived conceptual meanings.
5. **Card Actions**:
   - Click **`★ Shortlist`** to add a name to your persistent family shortlist tray.
   - Click **`View Details →`** to open the 14-Dimension Scorecard Modal.

---

### Feature 2: Birth Star & Nakshatra Finder
Matches the child's birth date, time, and location to the corresponding Tamil astrological constellation.

#### How to Use:
1. **Interactive Natchathiram Grid**: Select any of the **27 Tamil Natchathirams** (from *Ashwini / அசுவினி* to *Revati / ரேவதி*).
2. **Padam Syllable Selection**:
   - Each Nakshatra displays its **4 Padams** along with their traditional Tamil syllables (e.g., *Karthigai*: `அ (A)`, `இ (I)`, `உ (U)`, `எ (E)`).
   - Clicking a Padam button filters the name catalog to names that begin with that exact phonetic sound.
3. **Astrological Attributes Displayed**:
   - **Tamil Zodiac (*Rasi*)**: e.g., Mesham, Rishabham, Mithunam.
   - **Ruling Planet (*Graha Athipathi*)**: e.g., Sun, Moon, Mars, Jupiter, Venus, Saturn, Mercury, Rahu, Ketu.
   - **Astrological Element (*Pancha Bootham*)**: Fire, Earth, Air, Water, Space.
4. **One-Click Explorer Transition**: Click `"Open in Full Explorer →"` to carry the selected astrological criteria directly into the full filter engine.

---

### Feature 3: Dual Numerology Engine
Provides both **Chaldean** (ancient Babylonian / Vedic tradition) and **Pythagorean** (Western 1–9) calculations.

#### How to Use:
1. **Name Input**: Type any name in English or **Tamil script** (e.g., `செழியன்`). The engine automatically transliterates Tamil characters to their standard phonetic equivalents.
2. **Per-Letter Value Breakdown**: View the numerical assignment for every single letter in the name.
3. **Dual Compound & Single-Digit Comparison**:
   - **Chaldean Number**: Shows both the compound vibratory number (e.g., 23) and single-digit root (e.g., 5).
   - **Pythagorean Number**: Shows the full Pythagorean sum and single-digit reduction.
4. **Phonetic Spelling Variant Generator**:
   - Select a target lucky number (e.g., 1 for Leadership, 5 for Communication, 6 for Harmony).
   - The engine generates phonetically natural spelling variations (e.g., `Kavinn`, `Kaavina`) that hit the exact target number without corrupting the Tamil pronunciation.
5. **Catalog Browse by Number**: Click `"Browse All Catalog Names with Number X →"` to discover hundreds of names vibrating to your chosen number.

---

### Feature 4: 7-Dimension & 14-Dimension Name Scorecards
An objective evaluation framework analyzing every name across 14 critical dimensions.

#### The 14 Dimensions Evaluated:
1. **Cultural Grounding (பண்பாட்டு வேர்)**: Depth of connection to Tamil heritage and classical roots.
2. **Ease of Calling (அழைப்பின் இனிமை)**: Phonetic syllabification score for Tamil Nadu, pan-India, and global pronunciation.
3. **Spelling Assessment (எழுத்துப் பிழை அபாயம்)**: Risk level of misspellings on official identity cards.
4. **Uniqueness Band (தனித்துவ நிலை)**: Percentile rank indicating how rare or common the name is.
5. **Document & Passport Fit (சான்றிதழ் பொருத்தம்)**: Character length analysis and initial formatting compatibility (e.g., `S. Kavin`).
6. **Dual Numerology Vibration**: Alignment across Chaldean and Pythagorean systems.
7. **Astrological Harmony (ராசி / நட்சத்திரப் பொருத்தம்)**: Nakshatra and Rasi suitability.
8. **Origin Category**: Explicit period categorization (*Classical/Sangam*, *Medieval*, *Modern Tamil*).
9. **Literal Root Meaning (வேர்ச்சொல் பொருள்)**: Direct dictionary definition of root words.
10. **Derived Conceptual Meaning (பொருளுரை)**: Poetic or metaphorical understanding.
11. **Madras University Lexicon Citation**: Direct headword query URL on DSAL Chicago.
12. **Multilingual Semantics**: Positive validation in Tamil, English, and other languages.
13. **Sibling Pair Suggestions**: Harmonious brother/sister name combinations.
14. **Affectionate Nicknames (செல்லப் பெயர்கள்)**: Natural shortened diminutive forms.

---

### Feature 5: OmniRoute AI Name Advisor
An intelligent conversational assistant connected to the local **OmniRoute Gateway** (`http://127.0.0.1:20128/v1`).

#### How to Use:
1. **Natural Language Prompts**: Enter prompts in English or Tamil, such as:
   - *"Suggest a girl name inspired by Kurinji mountain flowers, easy for overseas diaspora to pronounce."*
   - *"Need a boy name with number 5 starting with Ma, classical Sangam roots."*
   - *"Unique twin names for boy and girl celebrating Tamil literature."*
2. **Multi-Model Orchestration**: Queries `gpt-5.6-terra` and `openai/gpt-oss-safeguard-20b` via the local zero-cost gateway.
3. **Strict $\ge 80\%$ Confidence Gate**: Recommendations are checked against the verified catalog. Names below 80% confidence or ungrammatical compounds are blocked.
4. **One-Click Actions**: Every AI recommendation includes quick links to Shortlist, view 7D Scorecard, or inspect Numerology.

---

### Feature 6: Family Poll & Consensus Engine
Solves family disagreements by allowing parents, grandparents, and relatives across the globe to vote on shortlisted names.

#### How to Use:
1. **Create Poll**: Select 2 to 6 candidate names from your shortlist, give the poll a title (e.g., *"Baby Anand's Name"*), and click **Create Poll**.
2. **Instant Shareable Link**: Generates a persistent polling link (e.g., `http://localhost:3020/poll/[token]`).
3. **Social Sharing**: One-click **📋 Copy Link** and **💬 Share on WhatsApp** to send to family groups.
4. **Ranked Voting**: Family members vote on names, add comments, and rate favorites.
5. **Live Consensus Leaderboard**: Real-time ranking with medal icons (🥇, 🥈, 🥉) revealing the family's top consensus choice.

---

### Feature 7: Name SEO Profile Deep-Dive (`/name/[slug]`)
Every single name in the catalog has its own dedicated page (e.g., `/name/yazhini`, `/name/kavin`, `/name/kalainagai`).

#### Features on Name Pages:
- **Tolkappiyam Sandhi Breakdown**: Detailed display of constituent roots and join rules (e.g., *Udambadumei* glide `ய்` / `வ்`).
- **Separated Citation & Lexicon Boxes**:
  - **Ancient Literary Citation**: Displayed ONLY if the name appears directly in an ancient text.
  - **Lexicon Headword Link**: Direct hyperlink to the University of Madras Tamil Lexicon digital query on DSAL.
- **Microdata & JSON-LD**: Full OpenGraph and Schema.org metadata for search engines and social sharing.

---

## 3. Linguistic & Grammatical Standards

பெயர்ச்சோலை (Peyarcholai) strictly enforces classical Tamil linguistic rules as defined in *Tolkappiyam*:

### Tolkappiyam *Udambadumei* Sandhi (உடம்படுமெய் புணர்ச்சி)
When a word ending in a vowel joins another word beginning with a vowel, an intervening glide consonant must appear:
1. **Vowels `இ`, `ஈ`, `ஐ` take `ய்` (Ya-glide)**:
   $$\text{கலை} + \text{அரசி} \longrightarrow \text{கலையரசி} \quad (\text{Kalaiyarasi})$$
   $$\text{மதி} + \text{அழகன்} \longrightarrow \text{மதியழகன்} \quad (\text{Mathiyazhagan})$$
2. **Other Vowels take `வ்` (Va-glide)**:
   $$\text{நிலா} + \text{ஒளி} \longrightarrow \text{நிலாவொளி} \quad (\text{Nilaavoli})$$
   $$\text{பூ} + \text{அழகி} \longrightarrow \text{பூவழகி} \quad (\text{Poovazhagi})$$

### QA Checklist v1.0 Compliance
- **CLA-01 / CLA-02**: Modern compounds are never labeled *Sangam Tamil*. They are labeled `Modern Tamil` (`🧪 Modern Synthesis`).
- **CLA-03 / CIT-01**: Ancient poem verses are NEVER attached to modern compounds.
- **ETY-03**: Literal root definitions are explicitly separated from derived conceptual meanings.
- **CIT-02**: Madras University Lexicon search URLs link to exact UTF-8 headword queries.

---

## 4. Multi-Source Literature Matrix

பெயர்ச்சோலை (Peyarcholai) draws from authentic classical and lexicographical authorities:
1. **Grammar & Phonology**: *Tolkappiyam* (Eluthu, Sol, Porul Athikarams), *Nannool*.
2. **Sangam Literature**: *Ettuthokai* (Purananuru, Akananuru, Natrinai, Kurunthokai) & *Pattuppattu*.
3. **Epics & Didactic Texts**: *Silappathikaram*, *Manimekalai*, *Tirukkural*, *Pazhamozhi Naanuru*.
4. **Tamil Epics**: *Kamba Ramayanam* (Kamban's poetic character and virtue terminology).
5. **Historical Inscriptions**: Inscriptional records from the Tamil Nadu Department of Archaeology (TNARCH) and ASI.
6. **Lexicons**: University of Madras Tamil Lexicon, *Pingala Nigandu*, *Chendhan Divakaram*, *Choodamani Nigandu*.
7. **Digital Archives**: Project Madurai, Tamil Virtual Academy (TVA), CICT, and DSAL Chicago.

---

## 5. Technical Architecture & Deployment

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5.
- **Styling**: Tailwind CSS + Lucide Icons + Custom Typography.
- **Storage**: 42 JSON Shards in `src/data/names/`, optimized for fast disk read and sub-5ms query filtering.
- **AI Gateway**: OmniRoute (`http://127.0.0.1:20128/v1`), operating at $0.00 cost using free model cascades (`auto/best-fast`, `openai/gpt-5.6-terra`, `openai/gpt-oss-safeguard-20b`).
- **Autonomous Swarm**: `scripts/omniroute-swarm-engine.mjs` runs continuous DMAIC improvement cycles.
- **Testing**: `npm test` runs 22 comprehensive test suites across numerology, astronomy, scorecard, and QA Checklist v1.0.

