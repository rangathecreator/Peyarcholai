# பெயர்ச்சோலை (Peyarcholai) — Prompt & Internal Query Generator Specification

**Document ID:** `PLAN-QUERY-06`  
**Location:** `doc/plan/06-Prompt-And-Internal-Query-Generator-Specification.md`  
**Status:** Approved Feature Specification  
**Target Module:** `@app/src/features/query-generator`  

---

## 1. Feature Purpose & User Workflow

Parents often come to பெயர்ச்சோலை with multi-layered, intricate naming constraints:
- Astrological requirement: Must start with `"க"` or `"வி"`.
- Numerological requirement: Must add up to Pythagorean or Chaldean number `5` or `1`.
- Linguistic purity: Must be a 100% verified native Tamil root word (`isNativeTamil: true`).
- Phonetic ease: Must be easy to pronounce globally without awkward consonant clusters.
- Spelling safety: Low clerical risk for birth certificate and passport issuance.
- Cultural safety: Zero negative / awkward double meanings in Telugu, Malayalam, Kannada, Hindi, or English.
- Family tree harmonic resonance:
  - Match rhythmic patterns from father, mother, and grandparents.
  - Form matching rhyming or semantic pairs with existing elder siblings.

The **Prompt & Internal Query Generator** provides parents with a visual, multi-step configurator. It simultaneously compiles:
1. **A Structured Deterministic Filter Query:** For high-speed in-memory database filtering across the 20,700+ name shards.
2. **A Synthesized Natural Language AI Prompt:** Packed with cultural, phonetic, and familial context, ready to dispatch to the AI Name Advisor.

---

## 2. Parameter Selector Matrix

| Parameter Key | UI Input Type | Allowed Values / Range | Purpose & Filtering Logic |
| :--- | :--- | :--- | :--- |
| `targetNumerology` | Dual Multi-Select / Number Pills | 1 to 9 (Pythagorean & Chaldean) | Matches target single-digit or compound numerology vibratory numbers. |
| `startingLetters` | Tamil Alphabet Grid (`அ`, `க`, `வி`...) | Any of the 247 Tamil glyphs | Matches `startingSyllableTa` or birth star Padam syllables. |
| `nameFrequency` | Slider / Segmented Control | `RARE` (Top 5%), `BALANCED`, `POPULAR_CLASSIC` | Filters by empirical cohort frequency and uniqueness band. |
| `easeOfPronunciation` | Threshold Slider | 70 to 100 Score | Filters `easeOfCalling.overallScore >= threshold`. |
| `isNativeTamil` | Toggle Switch (Boolean) | `true` (Strict) / `false` (All) | When `true`, restricts strictly to classical and lexicon-attested Tamil roots. |
| `misspellingRisk` | Checkbox Group | `LOW`, `MEDIUM`, `HIGH` | Filters `spellingAssessment.riskLevel`. |
| `multilingualSafety` | Multi-Select Checkboxes | `MALAYALAM`, `TELUGU`, `KANNADA`, `HINDI`, `ENGLISH` | Enforces zero false-friend warnings across selected languages. |
| `parentNames` | Text Inputs | Father Name, Mother Name | Extracts phonetic meter, vowels, and alliterative initials. |
| `grandparentNames`| Text Inputs | Paternal & Maternal Grandparents | Discovers heritage roots for ancestral continuity. |
| `siblingNames` | Tag List Input | Existing brothers/sisters (e.g., `Yazhini`) | AI matches semantic themes (e.g. musical instruments: `Yazhini` + `Veeraveni` / `Inisai`). |
| `familySurname` | Text Input | Clan / House name | Evaluates phonetic flow when combined with initial or surname. |

---

## 3. Data Flow & Compilation Architecture

```
                               USER CONFIGURATOR
                                       |
    +----------------------------------+----------------------------------+
    |                                                                     |
    v                                                                     v
[ Deterministic Compiler ]                             [ Natural Language AI Prompt Synthesizer ]
- Builds SQL/JSONB predicate                           - Synthesizes rich contextual prompt:
  WHERE numerology = 5                                   "Family context: Father Kavin, Mother Priya.
  AND syllable IN ('க', 'வி')                             Elder sister Yazhini (Music/Harp theme).
  AND ease_score >= 85                                    Target: Native Tamil boy name, vibration 5,
  AND is_native = true                                    starting with 'K', easy global pronunciation,
- Runs in <10ms over catalog shards                       rhyming or harmonizing with Yazhini..."
    |                                                                     |
    v                                                                     v
[ 15 Instant Matching Candidates ]                     [ Top 3 Bespoke AI Synthesized Names ]
    \                                                                     /
     \                                                                   /
      +---------------------------------+-------------------------------+
                                        |
                                        v
                    [ Combined Dual-Engine Result View ]
```

---

## 4. Query Generator Payload Schema

```typescript
export interface AdvancedNameQueryPayload {
  filters: {
    numerologyNumbers?: number[];
    numerologyMethod: "pythagorean" | "chaldean" | "both";
    startingLetters?: string[];
    frequencyBands?: Array<"Rare Gem" | "Moderately Popular" | "High-Frequency Classic">;
    minEaseScore?: number;
    isNativeTamilOnly: boolean;
    allowedMisspellRisks?: Array<"Low" | "Medium">;
    verifiedLanguages: Array<"ta" | "ml" | "te" | "kn" | "hi" | "en">;
  };
  familyContext: {
    fatherName?: string;
    motherName?: string;
    grandparentNames?: string[];
    existingSiblingNames?: string[];
    familySurnameOrInitial?: string;
    rhythmStyle: "ALLITERATIVE" | "RHYMING_SUFFIX" | "SEMANTIC_HARMONY" | "INDEPENDENT";
  };
}
```

