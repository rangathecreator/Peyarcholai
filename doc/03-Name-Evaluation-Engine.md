# 03 – Name Evaluation Engine

Evaluates one candidate name across 7 dimensions and returns a scorecard. Feasibility is rated per dimension.

## Scorecard overview

| # | Dimension | Output | Method | Feasibility | Data needed |
|---|---|---|---|---|---|
| 1 | Ease of pronunciation | 0-100 score + syllable breakdown | Rule-based phonotactics per language, tuned by user feedback | Medium | Phoneme/syllable rules, audio samples |
| 2 | Character count | English count, native-script count, syllables | Deterministic (grapheme-cluster counting) | Easy | Transliteration tables |
| 3 | Meaning | Meaning in regional language + English | Lookup in curated dictionary, LLM fallback flagged "unverified" | Medium-Hard | Dictionary with verified meanings |
| 4 | Historical / scriptural reference | References with source and citation | Curated lookup only (no LLM-only claims) | Hard | Curated reference table |
| 5 | Family match | Compatibility with siblings, parents, grandparents | Initial letter/sound clash, rhyme, numerology, tradition rules | Medium | Family input form |
| 6 | Misspelling risk | Low / Medium / High + likely variants | Variant generator + transliteration ambiguity analysis | Medium | Variant corpus |
| 7 | Uniqueness score | Percentile within region/community/year | Frequency of the name in the corpus | Medium (depends on data) | Frequency data |

## Dimension details

### 1. Pronunciation ease
- Split into syllables per language; penalise consonant clusters, retroflex/aspirate contrasts, long vowels and sounds hard for non-native speakers (e.g. ழ், ṅ, ṇ).
- Provide two scores: for speakers of the **same language** and for **pan-India / international** speakers.
- Add text-to-speech playback (Google Cloud TTS covers Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi; confirm current language list).

### 2. Character count
- Show counts in Latin script and the native script. For Indic scripts count **grapheme clusters (aksharas)**, not Unicode code points, otherwise counts are wrong.
- Flag name length for forms (passport, Aadhaar, school records often have character limits).

### 3. Meaning
- Store meaning per language (`meaning_en`, `meaning_hi`, `meaning_ta`, ...) plus a `verified` flag and `source`.
- Do not present machine-generated meanings as fact. Show "AI-suggested, not verified" until a reviewer approves it.
- Warn about names with unfavourable meanings in another language (e.g. a name that is harmless in Telugu but an insult in Hindi).

### 4. Historical, script and book references
- Examples of legitimate source classes: epics (Ramayana, Mahabharata), Puranas, Sangam literature, Guru Granth Sahib, Quran/Hadith name lists, Bible, Jain and Buddhist texts, historical figures and inscriptions.
- Each entry must store: reference text, chapter/verse or page, edition. Missing citations should show "No verified reference found" rather than being invented.
- This needs human curation by scholars; budget for it.

### 5. Family match
Inputs: names of siblings, parents, grandparents, family tradition (e.g. family name, gotra, kuldevata, naming after grandparent).
Checks:
- Same initial letter or very similar sound as a sibling (confusion risk).
- Rhymes / identical endings.
- Community tradition rules (e.g. naming the first son after paternal grandfather in some communities) – configurable, never forced.
- Numerology harmony between names, if the user chose a numerology method.

### 6. Misspelling risk
- Generate plausible romanisations (e.g. Krishna/Krushna/Krishnaa, Sai/Shai, Vaishnavi/Vaishnawi).
- Risk rises with number of valid variants, silent letters, double letters and aspirates.
- Show the **recommended official spelling** to keep consistent across documents.

### 7. Uniqueness score
- `uniqueness = 100 − percentile_popularity(name | region, language, community)`.
- Requires counts, which need a real data source (see `02-Name-Data-Sources`). Without trustworthy frequency data this score is only an estimate; label it as such.
- Provide 3 bands: Very common, Moderately common, Rare.

## Combined output example

```json
{
  "name": "Aadhya",
  "pronunciation": {"score": 88, "syllables": ["Aa","dhya"]},
  "length": {"latin": 6, "devanagari_aksharas": 3},
  "meaning": {"en": "First power", "hi": "पहली शक्ति", "verified": true},
  "references": [],
  "family_match": {"issues": []},
  "misspelling_risk": "Medium",
  "variants": ["Adhya","Aadya","Aadhya"],
  "uniqueness": {"band": "Moderately common", "percentile": 72}
}
```
(Illustrative only; values are not real data.)

## Risks
- Meaning and reference accuracy is the biggest trust risk; one wrong claim can damage credibility.
- Pronunciation scores are subjective; collect user feedback to calibrate.
- Uniqueness depends on data coverage by community and region.

## Suggested build order
1. Character count, misspelling variants, family-initial checks (deterministic, quick).
2. Meaning lookup from curated data.
3. Pronunciation scoring and TTS.
4. Uniqueness once frequency data exists.
5. Historical references (ongoing curation).
