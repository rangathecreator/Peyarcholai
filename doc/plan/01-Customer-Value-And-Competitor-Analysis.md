# 01 — Customer Value Proposition & Competitor Analysis (Peyarcholai)

> **Location:** `doc/plan/01-Customer-Value-And-Competitor-Analysis.md`  
> **Scope:** Why parents choose **பெயர்ச்சோலை (Peyarcholai)** over direct AI search (ChatGPT / Gemini / Perplexity) and existing baby-naming portals.

---

## 1. Why Parents Do NOT Get Reliable Results from Direct AI Search (ChatGPT / Gemini)

Parents frequently try prompting ChatGPT or Gemini for *"pure Tamil baby girl names starting with Ka with numerology 5"*. In practice, generic LLMs fail on 6 critical dimensions:

1. **Citation Hallucination & Fake Sangam Attribution:**
   - Generic LLMs routinely invent non-existent *Tirukkural* or *Silappathikaram* verses or claim modern coinages (e.g., *Kalainagai*, *Kuralarasi*) are "Sangam Tamil".
   - **Peyarcholai Advantage:** Programmatic `CIT-01` substring verification (`quote.includes(stem)`), strict `confidence >= 0.80` gate, explicit `🧪 Modern Synthesis` vs `📜 Classical Text Verified` separation, and direct clickable **University of Madras Tamil Lexicon (DSAL)** headword links.
2. **Broken Tolkappiyam Sandhi & Gender Errors:**
   - Generic LLMs frequently mash Tamil roots together ungrammatically or assign masculine `-ன்` suffixes to girl names.
   - **Peyarcholai Advantage:** Automated Tolkappiyam *Udambadumei* sandhi validation (`ETY-01`) and `corpus-gender-audit.mjs` (`0` gender discrepancies across `150,650` records).
3. **Unreliable Arithmetic in Dual Numerology:**
   - LLMs frequently miscount letter sums (especially Chaldean vs Pythagorean, vowel/consonant Soul Urge, and *Katapayadi* Tamil cipher).
   - **Peyarcholai Advantage:** Deterministic, unit-tested Dual Numerology Engine (`Pythagorean` + `Chaldean` + `Katapayadi`) with compound number interpretations (`10–75`) and phonetic spelling variant generator.
4. **No Authentic 27-Nakshatra Padam Astrology Integration:**
   - Chatbots guess starting syllables from memory without computing sidereal Moon longitude (Lahiri Ayanamsa).
   - **Peyarcholai Advantage:** Built-in 27 Natchathiram × 4 Padam astronomical & syllable lookup tied directly to catalog filtering.
5. **No 3-Tier Cultural Transparency:**
   - Generic portals and LLMs mix Sanskrit, Arabic, English, and Pure Tamil names together without labeling origin.
   - **Peyarcholai Advantage:** Explicit 3-tier classification (`pure_tamil`: 50,024; `tamilnadu_usage`: 50,000; `other_heritage`: 50,000) with `categoryOriginSource`.
6. **Zero Family Workflow or Printable Keepsake:**
   - Chat threads cannot run ranked family polls, compute 7-dimension global/document fit scores, or generate printable heritage dossiers.

---

## 2. Competitor & Existing System Comparison Matrix

| Capability | **Peyarcholai (பெயர்ச்சோலை)** | **ChatGPT / Gemini Direct Search** | **Indian Naming Portals** *(Bachpan, BabyNamesDirect, ProKerala)* | **Global Name Databases** *(BehindTheName, Nameberry)* |
| :--- | :--- | :--- | :--- | :--- |
| **Catalog Scale & Structure** | **150,024+ active** across 3 clear cultural tiers | Unbounded, unverified, ~20 names per prompt | ~10k–40k names, heavy ads, noisy duplicates | High Western coverage; very thin Tamil coverage |
| **Tamil Lexicon & Provenance** | ✅ DSAL Madras Lexicon links + `CIT-01` verse gate | ❌ Frequent hallucinated verse/etymology claims | ❌ Uncited crowd-sourced meanings | ⚠️ Good etymology for Western names; weak Tamil |
| **Tolkappiyam Sandhi & Script Purity** | ✅ Automated sandhi + zero Devanagari/boilerplate gate | ❌ Frequent morphological errors | ❌ Many spelling/transliteration typos | N/A |
| **Dual Numerology + Katapayadi** | ✅ Deterministic Pythagorean + Chaldean + Katapayadi + Spelling Variants | ❌ Frequent arithmetic mistakes | ⚠️ Basic single-method calculator only | ❌ None |
| **27 Natchathiram × 4 Padam** | ✅ Sidereal Moon longitude + syllable filter | ⚠️ Prone to Padam syllable errors | ⚠️ Static list, poor filtering | ❌ None |
| **7-Dimension Practical Scorecard** | ✅ Pronunciation ease, global portability, spelling risk, document fit | ❌ Subjective prose only | ❌ None | ❌ None |
| **Classroom Cohort Rarity Index** | ✅ Multi-factor cohort frequency & 40-student class estimate | ❌ None | ❌ None | ⚠️ US/UK SSA stats only |
| **Family Shortlist & Consensus Poll** | ✅ Shortlist + WhatsApp shareable Family Poll | ❌ None | ❌ None | ⚠️ Basic favorites list |
| **Ad-Free / Printable Dossier** | ✅ Structured A4/Letter heritage & numerology dossier | ❌ Copy-paste markdown | ❌ Ad-heavy, pop-up cluttered | ❌ No Tamil dossier |

---

## 3. Core Customer Positioning Statement

> **For Tamil-heritage and global Indian parents**, **Peyarcholai** is not just a name list or an AI chatbox — it is a **verified linguistic, astrological, and family decision workspace** combining 150,000+ provenance-checked names, deterministic dual numerology, 27-Nakshatra Padam matching, 7-dimension global usability scoring, and collaborative family voting in one calm, mobile-ready experience.

