# 02 — End-User ₹499 Paid Subscription Value Audit (Kudumba Cholai / குடும்பச் சோலை)

> **Location:** `doc/plan/02-Paid-499-Value-Audit.md`  
> **Perspective:** A Tamil/Indian parent paying **₹499** (one-time family tier) to choose their baby's name with confidence, family consensus, and keepsake quality.

---

## 1. Current Value Audit (What a ₹499 Parent Gets Today)

| Implemented Feature | Current Quality | End-User Value Assessment | Gaps / Friction for a ₹499 Payer |
| :--- | :--- | :--- | :--- |
| **150,024-Name 3-Tier Catalog** | High | Clean separation of `Pure Tamil`, `TN Usage`, and `Other Heritage` with `categoryOriginSource`. | Tile density was improved (Task 27), but parents still lack a **side-by-side comparison tray** (compare 2–4 shortlisted names across all 14 dimensions). |
| **27-Nakshatra & Padam Finder** | High | Accurate Lahiri Ayanamsa sidereal Moon calculation + Padam syllables. | Needs **Baby Birth-Chart Summary Card** (Rasi, Nakshatra, Padam, Lucky Syllables, Planetary Lord) saved to their profile/dossier. |
| **Dual Numerology + Katapayadi** | High | Deterministic Pythagorean, Chaldean, Katapayadi, and spelling variants. | Needs **Parent + Baby Birth Number Compatibility** (DOB *Mulank*/*Bhagyank* + Surname/Initial integration) and canonical book references (Task 22). |
| **7-Dimension Scorecard** | High | Evaluates cultural grounding, ease, global portability, spelling risk, document fit. | Needs **Pronunciation Audio / IPA + Tamil Phonetic Guide** so diaspora & local relatives hear how it sounds. |
| **Printable PDF Dossier (`/api/reports/download-pdf`)** | Good (Upgraded in Task 18) | Now includes full numerology predictions, Katapayadi, meanings, clickable DSAL links, and cohort rarity. | Currently prints **1 name at a time**; ₹499 families want a **Multi-Name Family Shortlist Comparison Booklet (up to 10 names)** for elders/grandparents! |
| **WhatsApp Family Vote-Out Poll** | Basic | Shareable poll link & leaderboard exist, but lacks cross-device persistence, blind voting, and 10-name cap. | **Critical Gap (Task 17):** Must be persistent across login/logout, blind (no seeing others' votes/comments), capped at 10 names, and strictly gated to ₹499 users. |
| **AI Name Advisor** | Medium | Prompt-based recommendations with `>= 0.80` gate. | Requires live HP Workstation OmniRoute deployment (Task 23) so production AI responses never fall back to static/offline mode. |

---

## 2. High-Value, Feasible Additions Recommended for ₹499 Justification

1. **Task 31 — Side-by-Side Name Comparison Matrix (2–4 Names) + Multi-Name Printable Family Booklet:**
   - Let parents select 2–4 shortlisted names and compare Meaning, Nakshatra Match, Pythagorean/Chaldean, 7D Score, Cohort Rarity, and Global Portability in one table — exportable as a single printable PDF booklet for grandparents.
2. **Task 32 — Parent-Surname & Initial Resonance Calculator (`Initial + Baby Name`):**
   - In Tamil Nadu, names are officially written with parent initials (`S. Yazhini` or `Yazhini Senthilkumar`). Evaluating numerology & pronunciation **both with and without surname/initials** is massive real-world value.
3. **Task 33 — Pronunciation Guide (Web Speech API / IPA + Tamil Syllable Breakdown):**
   - Zero-cost browser Web Speech (`ta-IN` / `en-IN`) + syllable stress breakdown (`யா-ழி-னி` / `Yaa-zhi-ni`) so global family members pronounce the name accurately.
4. **Task 34 — Baby Naming Ceremony & Official Registration Checklist (Post-Selection Kit):**
   - Printable *Peyar Soottu Vizha* (பெயர் சூட்டு விழா) keepsake card + Birth Certificate / Aadhaar / Passport naming format checklist (avoiding initial expansion issues).

---

## 3. Verdict
With **Task 17 (Blind Persistent Family Poll)** + **Task 22 (Book-Referenced Astrology/Numerology)** + **Tasks 31–33 (Comparison Booklet, Initial/Surname Numerology, Pronunciation Guide)**, the **₹499** tier delivers unmistakable 10x value over a ₹500–₹2,500 astrologer consultation or generic AI chat.
