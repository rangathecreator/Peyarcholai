# 04 – Feature Quality Acceptance Criteria (QAC)

**Document Reference:** `doc/testing/04-Feature-Quality-Acceptance-Criteria.md`  
**Governing Documents:**  
- `doc/deployment/site/02-User-Guide-And-Feature-Manual.md` (End-to-End User Journeys)  
- `doc/requirements/02-Naming-Source-Chatgpt.md` (Knowledge Base Architecture)  
- `doc/plan/six-sigma/SS-08-DMAIC-Tracker-Quality-Gates.md` (Quality Gates G1–G5)  
- `doc/testing/01-Test-Plan-And-Validation-Report.md` (Test Suite & Harness)  

---

## 1. Scope & Objective

This document defines the **Functional and Non-Functional Quality Acceptance Criteria (FQAC & NFQAC)** for every user-facing feature in **பெயர்ச்சோலை (Peyarcholai)**. Each feature has measurable Pass/Fail criteria, boundary edge cases, accessibility standards, and defect tolerances.

---

## 2. Feature-by-Feature Acceptance Matrix

### Feature 1: Name Explorer (`/`) & Multi-Dimensional Filtering

| Requirement ID | Capability | Acceptance Criteria (Must Pass) | Edge Cases / Stress Checks | Test Verification |
| :--- | :--- | :--- | :--- | :--- |
| **EXP-01** | **Paginated Catalog Grid** | Displays names in clean cards with Tamil name, English transliteration, gender badge, origin badge, and primary meaning. Page size defaults to 48 names. | Requesting `page=0` or `page=999999` clamps gracefully to valid boundaries without crashing. | `API-01`, `API-02` in `catalog.test.ts` |
| **EXP-02** | **Starting Letter Bar (முதல் எழுத்து)** | 24 Tamil vowel and consonant quick-filter pills (`அ`, `ஆ`, ..., `க`, `ச`, `ஞ`, `ய`, `வ`, `ழ`). Clicking filters the entire catalog instantly. | Non-Tamil character inputs (`q="a".repeat(5000)`, Emoji `"😊"`) return empty result or sanitize safely. | `EXP-04` in `core.test.ts` |
| **EXP-03** | **14-Dimension Search** | Instant filter by Gender, Nakshatra, Numerology number (1–9), Origin category, Uniqueness band, and Misspell risk. | Combining all filters simultaneously produces mathematically sound intersections. | `Repository filters` in `catalog.test.ts` |
| **EXP-04** | **Provenance & Badges** | Every card prominently displays **`🧪 Modern Synthesis`** (`Modern Synthesis (வேர்ச்சொல் புணர்ச்சி)`) or **`📜 Direct Textual Citation`**. | No synthetic compound ever displays a classical verse badge (`A2` gate). | `CIT-01`, `FMT-01` in `catalog.test.ts` |
| **EXP-05** | **Shortlist Quick-Tray** | Clicking heart toggles shortlist stored in `localStorage`. Floating bottom-bar reflects count and candidate names across pages. | Clearing storage or toggling 50 names updates state synchronously without layout shift. | `shortlist.test.ts` |

---

### Feature 2: Birth Star / Nakshatra Finder (`tab=nakshatra`)

| Requirement ID | Capability | Acceptance Criteria (Must Pass) | Edge Cases / Stress Checks | Test Verification |
| :--- | :--- | :--- | :--- | :--- |
| **NAK-01** | **Astronomical Moon Calculation** | Computes sidereal Moon longitude and Nakshatra from IST date/time using Lahiri Ayanamsa ($24^\circ$). | Leap year dates (`2028-02-29`), midnight boundaries (`00:00`), and daylight saving transitions. | `core.test.ts` |
| **NAK-02** | **27 Stars & 108 Padams** | All 27 Tamil *Natchathirams* mapped to their exact 4 *Padam* syllables (e.g. Rohini: `ஓ`, `வா`, `வி`, `வு`). | Syllable matching matches both vowel beginnings and consonant-vowel combinations. | `contains all 27 Tamil Natchathirams` in `core.test.ts` |
| **NAK-03** | **Interactive Padam Syllable Filter** | Clicking a Padam button filters the recommended name list to matching starting sounds. | Gender toggle (`All`, `Girl`, `Boy`) filters star recommendations without resetting selected Padam. | `UI Interactive test` |
| **NAK-04** | **Open in Full Explorer Bridge** | Clicking `"Open in Full Explorer →"` navigates to Explorer with pre-applied `nakshatra=<slug>` and `gender=<gender>`. | URL search parameters serialize and hydrate state without loss. | `navigation.test.ts` |

---

### Feature 3: Dual Numerology Engine (`tab=numerology`)

| Requirement ID | Capability | Acceptance Criteria (Must Pass) | Edge Cases / Stress Checks | Test Verification |
| :--- | :--- | :--- | :--- | :--- |
| **NUM-01** | **Deterministic Calculation** | Both **Chaldean** (1–8 system, no 9 in alphabet values) and **Pythagorean** (1–9 standard) systems calculate letter-by-letter sums and digital roots deterministically. | Case-insensitivity (`yazhini` == `YAZHINI`), whitespace stripping, hyphenated names. | `Dual numerology (D1)` in `catalog.test.ts` |
| **NUM-02** | **Tamil Script Transliteration Input** | Accepts Tamil Unicode directly (`கவின்`, `இனியா`) and transliterates to phonetic Latin before calculating numerology sums. | Grantha characters (`ஜ`, `ஷ`, `ஸ`, `ஹ`), pulli consonants (`ன்`, `ர்`), double vowels (`ஆ`, `ஈ`). | `transliterates Tamil script input` in `core.test.ts` |
| **NUM-03** | **Phonetic Spelling Variant Generator** | Proposes natural spelling variants hitting the parent's target compound number (e.g., `Kavin` $\rightarrow$ `Kavinn`, `Kaavin`). | Never generates unpronounceable variants (no 4 consecutive consonants). | `suggestSpellingVariants` in `core.test.ts` |
| **NUM-04** | **Browse All Catalog Names Bridge** | One-click button `"Browse All Catalog Names with Number X →"` filters the catalog to matching single-digit names. | Switching numerology method switches the target filter parameter (`numerologyMethod=chaldean|pythagorean`). | `repository.ts` |

---

### Feature 4: 7-Dimension Name Scorecard (`tab=scorecard`)

| Requirement ID | Capability | Acceptance Criteria (Must Pass) | Edge Cases / Stress Checks | Test Verification |
| :--- | :--- | :--- | :--- | :--- |
| **SCR-01** | **Unicode Akshara Grapheme Counter** | Accurately counts Tamil aksharas treating consonant + vowel sign + pulli as single linguistic graphemes (`தமிழ்` = 3, `கார்த்திகேயன்` = 6). | Multi-character combining marks, ZWJ/ZWNJ sequences, Grantha ligatures. | `counts Tamil aksharas accurately` in `core.test.ts` |
| **SCR-02** | **7 Evaluation Dimensions** | Computes scores (0–100) across: 1. Cultural Grounding, 2. Pronunciation Ease, 3. Global Portability, 4. Distinctiveness, 5. Spelling Risk, 6. Document Fit, 7. Trend Balance. | Extremely short (2 letters) and long (20 letters) names evaluated without NaN or out-of-bounds scores. | `produces a 7-dimension scorecard` in `core.test.ts` |
| **SCR-03** | **Sibling Harmony Analysis** | Evaluates phonetic and syllabic harmony against existing sibling names entered as comma-separated values. | Empty sibling string or 5+ siblings handled gracefully. | `scorecard.ts` |
| **SCR-04** | **Modal Deep-Dive Scorecard** | Detail modal loads live scorecard for any catalog name, showing separate Ancient Citation and Lexicon URL boxes. | Modal opens and closes without background page scroll lock issues. | `NamingGuruDashboard.tsx` |

---

### Feature 5: OmniRoute AI Name Advisor (`tab=advisor`)

| Requirement ID | Capability | Acceptance Criteria (Must Pass) | Edge Cases / Stress Checks | Test Verification |
| :--- | :--- | :--- | :--- | :--- |
| **ADV-01** | **Multi-Tier Cascade** | Calls OmniRoute gateway with automated cascade: `auto/best-free` $\rightarrow$ `ddgw/gpt-4o-mini` $\rightarrow$ `auto/pro-fast` $\rightarrow$ `auto/chat` $\rightarrow$ verified catalog fallback. | Gateway offline or upstream 502/timeout falls back smoothly to catalog within 25 seconds. | `omniroute.ts` |
| **ADV-02** | **Strict JSON Schema** | Output must adhere to JSON schema: `summaryTa`, `summaryEn`, and array of 4 `recommendations` with Tamil name, Latin name, gender, meaning, and roots. | Output wrapped in markdown codeblocks (````json ... ````) parsed cleanly. | `POST /api/advisor` |
| **ADV-03** | **$\ge 0.80$ Confidence Gate** | Only names with $\ge 80\%$ confidence in both meaning and etymology are recommended to parents. | Sub-80% candidates replaced or flagged before rendering. | `apply-qa-checklist.mjs` |
| **ADV-04** | **Action Integration** | Every AI recommendation card has 1-click `"Shortlist"`, `"7D Scorecard"`, and `"Numerology"` buttons. | Clicking action auto-populates relevant tab states. | UI verification |

---

### Feature 6: Family Poll & Collaborative Voting (`tab=poll`)

| Requirement ID | Capability | Acceptance Criteria (Must Pass) | Edge Cases / Stress Checks | Test Verification |
| :--- | :--- | :--- | :--- | :--- |
| **POL-01** | **Poll Creation & Tokenization** | Creates poll with unique cryptographically random token (`nanoid` / hex), title, candidate slugs, and creator name. | Polling with empty shortlist falls back to default curated candidates. | `POST /api/polls` |
| **POL-02** | **Multi-Device Voting** | Family members access `/poll?token=...` from mobile/desktop and submit votes (`like`, `love`, `dislike`). | Duplicate votes from same session handle idempotently without vote tampering. | `GET /api/polls` |
| **POL-03** | **Consensus Leaderboard** | Live ranked-choice score calculation, leading candidate badge, voter count, and percentage consensus. | Zero-vote and tie states render cleanly with alphabetical tie-breakers. | `NamingGuruDashboard.tsx` |
| **POL-04** | **Sharing Integration** | **📋 Copy Poll Link** with visual copied tooltip, and **💬 Share on WhatsApp** with formatted URL and message. | Long poll titles encode safely into WhatsApp URI. | UI verification |

---

### Feature 7: SEO Detail Pages (`/name/[slug]`)

| Requirement ID | Capability | Acceptance Criteria (Must Pass) | Edge Cases / Stress Checks | Test Verification |
| :--- | :--- | :--- | :--- | :--- |
| **SEO-01** | **Server-Side Generation (SSG)** | Pre-renders canonical URL, OpenGraph tags, JSON-LD structured data (`BabyName` schema), and breadcrumbs. | Non-existent slug returns standard, styled 404 page with search suggestion. | `GET /name/[slug]` |
| **SEO-02** | **Linguistic Root Decomposition** | Visual cards for `Root 1`, `Root 2`, Tolkappiyam Sandhi rule applied, and separation of Literal vs Derived meaning. | Simple single-root names render without empty secondary root cards. | `FMT-03` in `catalog.test.ts` |
| **SEO-03** | **Provenance Citation Box** | Verified verse citation displayed with source text and link to TVA / DSAL Madras Lexicon query. | Unverified names show `"Synthesized modern name from authentic roots"`. | `CLA-03`, `CIT-01` |

---

## 3. Non-Functional Quality Acceptance Criteria (NFQAC)

| Category | Metric / Standard | Acceptance Threshold | Six Sigma Defect Level |
| :--- | :--- | :--- | :--- |
| **Performance** | API Response Time (`/api/names`) | **$p50 < 30\text{ ms}$, $p95 < 120\text{ ms}$** | Latency $> 250\text{ ms}$ is a Class C defect. |
| **Performance** | Full Page Hydration Time | **$< 1.5\text{ seconds}$ on 4G throttle** | Hydration $> 3.0\text{ s}$ is a Class B defect. |
| **Accessibility** | Color Contrast (WCAG 2.1) | **Level AAA ($\ge 7:1$)** for text; **AA ($\ge 4.5:1$)** for secondary labels. | Contrast $< 4.5:1$ is a Class B defect. |
| **Accessibility** | Keyboard Navigation | All tabs, cards, modals operable via `Tab`, `Enter`, `Escape`. | Trapped keyboard focus is a Class A defect. |
| **Security** | OWASP Input Sanitization | Zero SQLi, zero XSS in `q`, `slug`, `pollId`, `notes`. | Any injection vulnerability is a **Blocker**. |
| **Privacy** | DPDP Act 2023 Compliance | Zero PII collected without explicit consent; no child tracking cookies. | Unauthorized PII storage is a **Blocker**. |
| **Cost** | OmniRoute AI Ingestion Cost | **$0.00** paid quota; 100% free model routing. | Incurring paid token billing is a defect. |

