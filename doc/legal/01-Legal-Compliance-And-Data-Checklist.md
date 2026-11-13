# 01 — Legal, IP, Data Provenance & Compliance Checklist

> **Location:** `doc/legal/01-Legal-Compliance-And-Data-Checklist.md`  
> **Scope:** Application features, catalog data, third-party references, AI outputs, monetization (AdSense/Payments), and Indian/Global privacy compliance.  
> *Note: Technical & product compliance checklist for legal counsel review; not formal legal advice.*

---

## 1. Data, IP & Reference Attribution Checklist

| ID | Area | Risk / Requirement | Current Status | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **LEG-01** | **University of Madras Tamil Lexicon (DSAL Chicago)** | Linking & quoting definitions without claiming ownership or scraping bulk copyrighted UI. | ✅ Links point directly to `dsal.uchicago.edu` headword queries (`CIT-02`). | Keep attribution explicit (`"Source: University of Madras Tamil Lexicon (DSAL)"`) and ensure no full copyrighted dictionary pages are mirrored verbatim. |
| **LEG-02** | **Tamil Virtual Academy (TVA) & Project Madurai** | Classical Sangam / Kamba Ramayanam verses are public-domain heritage, but digital editions have attribution expectations. | ✅ Attributed via `lexiconWebsite` & `structuredReference`. | Include TVA / Project Madurai credit in `/docs` and Footer/About. |
| **LEG-03** | **150K Catalog & Synthetic/Community Names** | Ensure no proprietary third-party baby-name database was scraped verbatim. | ✅ Sourced via classical roots, Tolkappiyam sandhi, and OmniRoute LLM synthesis with provenance tags. | Document provenance methodology clearly in Terms / Data Sources notice. |
| **LEG-04** | **Numerology & Astrology Book References (Task 22)** | Using mathematical methods (Pythagorean, Chaldean, Katapayadi, Lahiri Ayanamsa) is free of copyright; **verbatim text passages** from modern copyrighted books are protected. | 🟡 Pending Task 22 | Write **original** Tamil/English interpretations citing book titles/authors (*Cheiro's Book of Numbers*, *Sepharial*, etc.) as methodological references — **never copy verbatim paragraphs** from copyrighted editions. |

---

## 2. Privacy, Payments & Platform Compliance Checklist

| ID | Area | Requirement | Current Status | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **LEG-05** | **India DPDP Act 2023 & GDPR (User Data)** | Explicit consent before collecting email, baby DOB/time/place, or shortlist data; ability to export/delete account data. | 🟡 Partial (no persistent auth DB yet) | Add Privacy Policy page (`/privacy`), Consent checkbox on signup/poll creation, and Delete My Data flow when Task 17 auth lands. |
| **LEG-06** | **Child Data Sensitivity** | Parents enter baby's DOB/birth time/name; avoid storing identifiable minor profiles without parental consent. | ✅ Birth time is computed statelessly/locally today. | Keep Nakshatra calculations stateless or strictly scoped to parent account with zero third-party sharing. |
| **LEG-07** | **Payments, GST & Refund Policy (₹49 / ₹499)** | Razorpay / Stripe merchant compliance requires published **Terms of Service, Refund/Cancellation Policy, Privacy Policy, and Contact Us** pages. | 🔴 Missing dedicated legal pages | Create `/terms`, `/privacy`, `/refund-policy`, and `/contact` pages before enabling live Razorpay/Stripe checkout. |
| **LEG-08** | **Google AdSense Policies** | Requires Privacy Policy disclosing cookies/personalized ads, Ads.txt, and CMP/cookie consent for EEA/UK users; no ads on error/404/checkout pages. | 🟡 Pending AdSense activation | Add Cookie Consent banner + `ads.txt` + AdSense disclosure in `/privacy`. |

---

## 3. Mandatory Web Page Disclaimers (Task 30)

The following concise, non-intrusive disclaimers must be displayed on relevant pages/sections:

1. **Astrology & Numerology Disclaimer** *(Nakshatra Finder, Numerology Tab, Printable Dossier, `/name/[slug]`)*:
   > *"Numerology (Pythagorean, Chaldean, Katapayadi) and Natchathiram/Padam calculations are provided for cultural, traditional, and informational guidance only. They do not constitute guaranteed predictions or professional/medical/legal advice."*
2. **Cohort Frequency & 7D Scorecard Disclaimer** *(Modal, Scorecard, `/name/[slug]`)*:
   > *"Classroom repetition (40 students), 1,000-student cohort rates, uniqueness, and ease-of-calling scores are algorithmic linguistic estimates, not official government birth-registry statistics."*
3. **AI Name Advisor Disclaimer** *(AI Advisor Tab)*:
   > *"AI-generated suggestions are assisted by language models and filtered through our provenance gate. Always verify final spelling, pronunciation, and family preferences before official birth registration."*
4. **Literary & Lexicon Attribution Notice** *(Footer & Provenance Boxes)*:
   > *"Classical lexicon links reference the University of Madras Tamil Lexicon (DSAL) and Tamil Virtual Academy for educational research. Synthesized modern compounds (`🧪 Modern Synthesis`) are not ancient literary citations."*
