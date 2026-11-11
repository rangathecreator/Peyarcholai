# 01 – Numerology Methods & Prediction Methodology Specification

**Platform:** பெயர்ச்சோலை (Peyarcholai) — Classical Tamil Baby Naming & Astrological Platform  
**Document Code:** `DOC-NUM-01` | **Version:** 2.0 (Production Master)  
**Location:** `doc/01-Numerology-Methods.md`  
**Reference Engines:** [`app/src/core/numerology.ts`](../app/src/core/numerology.ts), [`app/src/core/scorecard.ts`](../app/src/core/scorecard.ts)

---

## 1. Executive Summary & Cultural Foundation

In Indian and Tamil parenting traditions, naming a newborn is an auspicious milestone (*Namakarana Samskara* / *பெயர் சூட்டு விழா*) that harmonizes three interconnected dimensions:
1. **Linguistic & Literary Heritage (செம்மொழி மரபு):** Rooted in ancient Sangam literature, *Tolkappiyam* sandhi grammar, and the Madras University Tamil Lexicon.
2. **Sidereal Astrological Alignment (நட்சத்திரப் பாதம்):** Determining the child's Moon sign (*Rasi*) and birth star (*Natchathiram*) using Lahiri Ayanamsa to identify auspicious starting sounds (*நாம அட்சரம்*).
3. **Numerological Vibrational Harmony (எண் கணிதப் பொருத்தம்):** Calculating the numeric resonance of the name (*Namank*) against the child's birth date (*Mulank* / Janmank) and life path (*Bhagyank* / Destiny Number).

Historically, numerology in India (*Ank Jyotish*) incorporates ancient Western-Babylonian lineages (popularized across India through Count Louis Hamon / **Cheiro** and **Sepharial**), classical Pythagorean harmonics, and native Indic prosodic ciphers such as the **Katapayadi Sankhya (கடபயாதி சங்கியை)**.

This document codifies the exact mathematical formulas, letter mapping tables, compound number dictionaries (10–75), planetary resonance rules, and spelling variant generators powering பெயர்ச்சோலை.

---

## 2. Supported Numerology Systems Comparison

| System | Primary Origin | Letter Values | Number 9 Rule | Core Strength | Key Authority References |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Chaldean (Cheiro System)** | Ancient Mesopotamia / India / Cheiro | **1 to 8** | Sacred number 9 is never assigned to letters; only appears as a sum | Most popular in India; reflects phonetic sound frequency | *Cheiro's Book of Numbers* by Cheiro (Count Louis Hamon); *The Kabala of Numbers* by Sepharial |
| **Pythagorean (Western Modern)** | Ancient Greece / Modern Western | **1 to 9** (cyclical) | 9 assigned to I and R | Preserves **Master Numbers (11, 22, 33, 44)**; separates Soul Urge (vowels) & Personality (consonants) | *The Romance of Numbers* by Florence Campbell; *Numerology and The Divine Triangle* by Faith Javane & Dusty Bunker |
| **Katapayadi Sankhya (கடபயாதி)** | Classical Tamil & Vedic Astronomy | **1 to 9, 0** | Native Tamil/Sanskrit consonants mapped: க=1, ங=2, ச=3, ஞ=4, ட=5, ண=6, த=7, ந=8, ப=9 | Native script calculation direct from Tamil aksharas | *Aryabhatiya* (Aryabhata I); *Vararuchi's Chandra-Vakyas*; *Yapparunkalam* Tamil prosody commentaries |

---

## 3. Mathematical & Letter Value Specifications

### 3.1 Chaldean Letter Values (1 to 8)
In the Chaldean system, letters are valued according to their acoustic vibratory frequencies:

```
Value 1: A, I, J, Q, Y
Value 2: B, K, R
Value 3: C, G, L, S
Value 4: D, M, T
Value 5: E, H, N, X
Value 6: U, V, W
Value 7: O, Z
Value 8: F, P
Value 9: Sacred (unassigned to individual letters)
```

$$\text{Chaldean Compound Number} = \sum_{i=1}^{n} \text{ChaldeanValue}(\text{char}_i)$$

$$\text{Single Name Number (Namank)} = \text{ReduceToSingleDigit}(\text{Chaldean Compound Number})$$

### 3.2 Pythagorean Letter Values (1 to 9)
In the Pythagorean system, letters cycle sequentially through numbers 1 to 9:

```
1: A, J, S
2: B, K, T
3: C, L, U
4: D, M, V
5: E, N, W
6: F, O, X
7: G, P, Y
8: H, Q, Z
9: I, R
```

- **Expression / Destiny Number:** Sum of all letters in the name.
- **Soul Urge Number (Heart's Desire):** Sum of all vowels ($A, E, I, O, U$). Represents inner motivations, spiritual desires, and emotional core.
- **Personality Number (Outer Persona):** Sum of all consonants. Represents how the world perceives the child.
- **Master Numbers Gate:** If the compound sum reaches **11, 22, 33, or 44**, it is recognized as a **Master Number** possessing amplified intuitive, architectural, or compassionate potential.

### 3.3 Katapayadi Sankhya (Tamil Native Letter Mapping)
For names analyzed in native Tamil script, the classical *Ka-Ta-Pa-Ya* cipher maps consonants:

```
க (Ka) = 1 | ங (Nga) = 2 | ச (Sa) = 3 | ஞ (Gna) = 4 | ட (Ta) = 1 | ண (Nna) = 2
த (Tha) = 3 | ந (Na) = 4 | ப (Pa) = 1 | ம (Ma) = 2 | ய (Ya) = 1 | ர (Ra) = 2
ல (La) = 3 | வ (Va) = 4 | ழ (Zha) = 5 | ள (Lla) = 6 | ற (Rra) = 7 | ன (Nna) = 8
Grantha: ஜ = 1, ஷ = 2, ஸ = 3, ஹ = 4
```

Vowels standing alone or non-consonant signs carry 0 value. The consonants in each syllabic akshara determine the energetic count.

---

## 4. The Nine Planetary Archetypes (Navagrahas)

Every single reduced number (1 to 9) corresponds to a ruling planetary energy, psychological temperament, and auspicious attributes:

| No. | Planet (English / Tamil) | Presiding Deity | Auspicious Colors | Favorable Days | Sacred Gemstone | Primary Positive Traits | Favorable Career Paths | Auspicious Milestone Years |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Sun (*Surya* / ஞாயிறு) | Surya / Agni | Gold, Orange, Yellow, Copper | Sunday, Monday | Ruby (*மாணிக்கம்*) | Leadership, independence, ambition, regal dignity | Administration, Government, Medicine, Politics | 19, 28, 37, 46, 55, 64 |
| **2** | Moon (*Chandra* / திங்கள்) | Chandra / Parvati | White, Cream, Silver, Light Green | Monday, Friday | Natural Pearl (*முத்து*) | Empathy, imagination, diplomacy, artistic sensitivity | Arts, Literature, Psychology, Hospitality | 20, 29, 38, 47, 56, 65 |
| **3** | Jupiter (*Guru* / வியாழன்) | Brihaspati / Dakshinamurthy | Yellow, Saffron, Purple | Thursday, Tuesday | Yellow Sapphire (*புஷ்பராகம்*) | Wisdom, ethics, optimism, pedagogical mastery | Education, Judiciary, Finance, Publishing | 21, 30, 39, 48, 57, 66 |
| **4** | Rahu (*North Node* / ராகு) | Durga / Sarpa Devata | Electric Blue, Steel Grey | Saturday, Sunday | Hessonite Garnet (*கோமேதகம்*) | Unconventional brilliance, research, resilience | Engineering, Aviation, IT, Architecture | 22, 31, 40, 49, 58, 67 |
| **5** | Mercury (*Budha* / புதன்) | Budha / Maha Vishnu | Emerald Green, Mint, White | Wednesday, Friday | Natural Emerald (*மரகதம்*) | Quick intellect, eloquence, trade acumen, adaptability | Commerce, Media, Software, Diplomacy | 23, 32, 41, 50, 59, 68 |
| **6** | Venus (*Shukra* / வெள்ளி) | Shukra / Mahalakshmi | Rose Pink, Sky Blue, Silk White | Friday, Tuesday | Diamond (*வைரம்*) / White Zircon | Magnetic charm, artistic genius, domestic peace, prosperity | Cinema, Design, Luxury Enterprise, Music | 24, 33, 42, 51, 60, 69 |
| **7** | Ketu (*South Node* / கேது) | Ganesha / Chitragupta | Pastel Green, Pearl White | Sunday, Monday | Cat's Eye (*வைடூரியம்*) | Intuition, philosophical detachment, deep research | Scientific Research, Psychiatry, Philosophy | 25, 34, 43, 52, 61, 70 |
| **8** | Saturn (*Shani* / சனி) | Shani / Sastha | Deep Blue, Navy, Black, Dark Violet | Saturday | Blue Sapphire (*நீலம்*) | Perseverance, justice, endurance, executive mastery | Judiciary, Mining, Heavy Industry, Governance | 26, 35, 44, 53, 62, 71 |
| **9** | Mars (*Chevvai* / செவ்வாய்) | Murugan (Kartikeya) | Crimson Red, Scarlet, Coral Rose | Tuesday, Thursday | Red Coral (*செம்பவளம்*) | Courage, executive force, fearlessness, humanitarian defense | Defense, Surgery, Sports, Civil Engineering | 27, 36, 45, 54, 63, 72 |

---

## 5. Exhaustive Compound Numbers Dictionary (Numbers 10 to 75)

While single numbers (1–9) describe basic planetary rulers, the **Compound Number** reveals the deeper karmic blueprint and life destiny according to classical Chaldean lore.

### Selected Auspicious Highlights from the Dictionary:
- **10 (Wheel of Fortune / நல்லதிர்ஷ்ட சக்கரம்) — Very Auspicious:** Rise in life through confidence and moral virtue.
- **14 (Movement & Commerce / வணிக ஈர்ப்பு) — Auspicious:** Magnetic adaptability in public relations, travel, and financial enterprise.
- **15 (Harmony & Eloquence / கலை மற்றும் வசீகரம்) — Very Auspicious:** Governed by Venus and Mercury; bestows poetic speech, musical talent, and prosperity.
- **19 (Prince of Heaven / சூரியனின் வெற்றி எண்) — Very Auspicious:** Extremely fortunate; promises honor, health, esteem, and triumph over obstacles.
- **21 (Crown of the Magi / வெற்றி மகுடம்) — Very Auspicious:** Honors, elevation, and lasting victory after steady patient effort.
- **23 (Royal Star of the Lion / ராஜ நட்சத்திரம்) — Very Auspicious:** Guarantees protection, patronage of superiors, and universal triumph.
- **24 (Love & Domestic Bliss / அன்பு மற்றும் வளமை) — Very Auspicious:** Brings harmony in marriage, domestic joy, and enduring wealth.
- **27 (Sceptre of Authority / செங்கோல் அதிகாரம்) — Very Auspicious:** Rewards creative intellect, leadership, and judicial command.
- **32 (Magnetic Messenger / மக்கள் செல்வாக்கு) — Very Auspicious:** Fosters captivating eloquence and viral social popularity.
- **33 (Master Teacher / அன்பின் மகா ஆசான்) — Very Auspicious:** Universal teaching, unselfish service, and divine protection.
- **37 (Harmonious Alliances / மங்கள யோகம்) — Very Auspicious:** Auspicious partnerships, love, and continuous rise.
- **41 (Magnetic Sovereign / வசீகரத் தலைமை) — Very Auspicious:** Dignity, corporate authority, and continuous ascent.
- **45 (Honor & Intellectual Reward / அறிவு மற்றும் கௌரவம்) — Very Auspicious:** Academic excellence, statesmanship, and clean reputation.
- **46 (Abundant Harvest / நிறைவான வளம்) — Very Auspicious:** Smooth accumulation of wealth and fruitful relationships.
- **50 (Mercantile Supremacy / சொல்லாற்றல் மேலாண்மை) — Very Auspicious:** Liberation from barriers through brilliant trade intellect.
- **51 (Supreme Warrior / தளபதி வீரம்) — Very Auspicious:** Unstoppable victory in competitive arenas, civil services, and sports.
- **55 (Sacred Armor / தெய்வீகப் பாதுகாப்பு) — Very Auspicious:** Double 5 power; grants extraordinary intellect and commercial success.
- **60 (Domestic Radiance / இல்லறச் சிறப்பு) — Very Auspicious:** Boundless family joy, elegance, artistic prosperity, and longevity.
- **65 (Radiant Fortune / மங்கள யோகம்) — Very Auspicious:** Unconditional goodwill, charm, and effortless triumph.

*(The complete programmatically verified dataset covering all numbers 10 through 75 is integrated into [`app/src/core/numerology.ts`](../app/src/core/numerology.ts)).*

---

## 6. Name-Birth Compatibility Engine (Panchadha Maitri)

The compatibility engine evaluates the harmony between:
1. **Mulank (Birth Day Number):** $\text{Day of birth reduced to 1..9}$.
2. **Bhagyank (Destiny / Life Path Number):** $\text{Sum of all DOB digits reduced to 1..9}$.
3. **Namank (Name Number):** $\text{Chaldean single-digit sum of the child's name}$.

### Planetary Friendship & Enmity Matrix:
```ts
const FRIENDLY_NUMBERS = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 5, 6],
  3: [1, 2, 3, 5, 9],
  4: [1, 5, 6, 7],
  5: [1, 3, 5, 6],
  6: [3, 5, 6, 8, 9],
  7: [1, 2, 4, 5, 7],
  8: [4, 5, 6, 8],
  9: [1, 3, 6, 9],
};

const CAUTION_NUMBERS = {
  1: [8],
  2: [8, 9],
  3: [6],
  4: [2, 9],
  5: [],
  6: [1, 2],
  7: [8, 9],
  8: [1, 2, 9],
  9: [2, 4, 8],
};
```

### Compatibility Evaluation Output:
- **Excellent (90–98 Score):** Namank is in friendly alignment with both Mulank and Bhagyank with zero planetary friction.
- **Good (78–88 Score):** Namank is supportive of either Mulank or Bhagyank without any negative clashes.
- **Neutral (65–75 Score):** Balanced, neutral relationship.
- **Caution (40–55 Score):** Traditional astrologers observe friction (e.g. Number 1 Sun with Number 8 Saturn). The app advises phonetic variant adjustments.

---

## 7. Phonetic Spelling Variant Generator

When a parent seeks a specific target compound number (e.g. targeting number 5 Mercury for trade or number 6 Venus for art), the engine explores **authentic phonetic variants** without distorting Tamil pronunciation:
1. Double consonants permissible in Tamil transliteration: `n -> nn`, `t -> th`, `l -> ll`, `r -> rr`.
2. Vowel length adjustments: `a -> aa`, `i -> ee`, `u -> oo`.
3. Suffix variations: `an -> aan`, `ini -> iniya`.

Every variant is recalculated through the chosen system in $< 1\text{ms}$ and ranked by visual aesthetics and pronunciation fidelity.

---

## 8. Legal, Ethical & Cultural Disclaimer Policy

> [!IMPORTANT]
> **Product Ethics Policy:**
> 1. **Cultural Guidance, Not Superstition:** Numerology and astrological data are presented as celebratory cultural insights and personal heritage guidance.
> 2. **No Health or Legal Guarantees:** The application strictly disclaims making deterministic promises regarding health, life expectancy, or financial guarantees.
> 3. **Non-Dogmatic Transparency:** Users are always shown both Chaldean and Pythagorean systems side-by-side with transparent letter-value breakdowns.
