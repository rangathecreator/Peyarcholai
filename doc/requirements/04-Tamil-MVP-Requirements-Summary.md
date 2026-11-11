# Requirements Specification — Tamil Web MVP (Finalized)

**Version:** 1.0 | **Date:** 2026-11-09 | **Status:** Approved & Implemented

---

## 1. Product Owner Decisions & Scope Lock

| Dimension | Approved Requirement |
| :--- | :--- |
| **Target Language & Region** | **Tamil only** (`தமிழ்`) for MVP — serving Tamil Nadu & the global Tamil diaspora. |
| **Platform Scope** | **Web Application only** for MVP (Mobile-responsive Next.js SSR/SSG + PWA-ready). |
| **AI Model Source** | **OmniRoute Gateway (`http://localhost:20128/v1`)** as the primary AI model hub for both dataset enrichment and runtime AI features. |
| **Infrastructure & Budget** | Reuse existing **donorconnect.in** ecosystem (Cloudflare DNS + Vercel + dedicated free Supabase/Neon PostgreSQL instance + bundled Static JSON fallback). Zero new infrastructure spend. |
| **Monetization Model** | **Ads from day one** on directory and SEO pages (gated behind DPDP consent); **Subscription paywall hooks** built into the codebase and kept disabled (`NEXT_PUBLIC_ENABLE_SUBSCRIPTION_PAYWALL=false`) until subscriber threshold is met. |
| **Content Curation** | **AI-curated & verified** meanings and literary references from online/Sangam sources now; **public name suggestion queue** reviewed and approved by OmniRoute AI in real time. |

---

## 2. Functional Requirements (Implemented in `app/`)

1. **FR-01: Bilingual Tamil Baby Name Explorer**
   - Filter by Tamil script (`தமிழ்`), English spelling, Gender (`ஆண்`, `பெண்`, `பொது`), 27 *Natchathirams*, Chaldean Numerology Number (1–9), and Origin (*Sangam Tamil*, *Literary*, *Historical*, *Traditional*).
2. **FR-02: Offline 27 Natchathiram & Padam Calculator**
   - Compute Sidereal Moon Longitude using **Lahiri (Chitrapaksha) Ayanamsa** from Date & Time of Birth (IST) and recommend auspicious starting Tamil syllables (*Naama Nakshatra*).
3. **FR-03: Multi-System Numerology Engine**
   - Support **Chaldean** (Cheiro) and **Pythagorean** systems, Tamil-to-Latin transliteration, Birth Number (*Mulank*), Destiny Number (*Bhagyank*), Planetary Compatibility, Compound Number (10–52) meanings, and Phonetic Spelling Variant suggestions.
4. **FR-04: 7-Dimension Name Evaluation Scorecard**
   - Evaluate candidate names across Pronunciation Ease, Tamil Akshara & Latin Character Count, Meaning & AI Confidence, Literary Reference, Family/Sibling Harmony, Official Spelling Clarity, and Uniqueness Band.
5. **FR-05: OmniRoute AI Tamil Name Advisor**
   - Live interactive assistant calling `POST /api/advisor` → OmniRoute (`auto/best-free` with fallback) to recommend tailored Tamil names with live numerology scoring.
6. **FR-06: Social "Vote-Out" Family Poll**
   - Allow parents to create a shareable poll from their shortlist so family members can vote ("Love" or "Vote-Out") and leave blessings while parents remain the final decider.
7. **FR-07: Public Suggestion + AI Moderation & Error Reporting**
   - Allow public submissions (`POST /api/suggestions`) reviewed in real time by OmniRoute AI (`AI-Approved` entries auto-publish to the catalog) and provide a "Report Error" button on every name card.

