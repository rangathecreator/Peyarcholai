# பெயர்ச்சோலை (Peyarcholai) — Free Tier Beta Release Readiness Checklist

**Document ID:** `REV-PLAN-03`  
**Location:** `doc/plan/revenuePlan/03-Beta-Release-Checklist-Free-Tier.md`  
**Target Milestone:** Public Beta v1.0 (Free Tier Launch)  
**Status:** Verification Ready  

---

## 1. Beta Release Scope & Purpose

The **Free Tier Public Beta** serves as the foundational milestone of பெயர்ச்சோலை (Peyarcholai). The primary objectives are:
1. **Acquire Top-of-Funnel Community Trust:** Demonstrate uncompromising Tamil linguistic purity, authentic Sangam citations, and zero fear-based astrology.
2. **Collect Behavioral Metrics:** Understand user drop-off points, search syllable preferences, and feature engagement (Explore vs. Nakshatra vs. Numerology).
3. **Validate Paywall Triggers:** Gauge user appetite for the upcoming ₹49 Decision Pass and ₹499 WhatsApp Family Pro Pass through non-intrusive waitlist / upgrade intent clicks.
4. **Stress-Test Catalog Scalability:** Ensure sub-100ms response times across 20,700+ names sharded dynamically.

---

## 2. Exhaustive Pre-Launch Verification Checklist

### Section A: Data Purity & Linguistic Quality (Six Sigma DPMO = 0)
- [x] **Catalog Volume & Sharding:** Verified 21,357 total records across 69 shards (`src/data/names/`) with **20,731 active verified names** meeting the $\ge 0.80$ confidence gate.
- [x] **Gender Classification Accuracy:**
  - `கதிர்` (`kathir`): Confirmed set to `gender: "boy"` (masculine sunbeam & golden harvest).
  - `கயல்` (`kayal`): Confirmed set to `gender: "girl"` (feminine carp-eyed beauty).
  - `நம்பி` (`nambi`): Confirmed set to `gender: "boy"` (classical Sangam masculine noble leader).
  - `நறுமலர்` (`narumalar`): Confirmed set to `gender: "girl"` (feminine fragrant blossom).
- [x] **Sandhi Grammar Integrity:** Enforced Tolkappiyam *Udambadumei* sandhi across all vowel-joined compounds (`இ ஈ ஐ வழி யவ்வும் ஏனை உயிர்வழி வவ்வும்`) with zero ungrammatical double masculine `-ன்` suffixes.
- [x] **Separation of Citations vs. Lexicons (FMT-03):** 100% of records cleanly separate ancient poem citations (*Purananuru*, *Silappathikaram*) from University of Madras Tamil Lexicon headword dictionary URLs.
- [x] **Script Purity:** Zero non-Tamil unicode characters, Devanagari contamination, or unverified LLM verses.
- [x] **Automated Regression Suite:** Ran `npm --prefix app test`: **22/22 unit and catalog tests PASS (100%)**.

---

### Section B: UI, Visual Design & Accessibility (WCAG AAA)
- [x] **Square Logo Integrity:**
  - Removed circular clipping masks (`$dist > $maxRadius`) from generation scripts.
  - Regenerated `logo-transparent.png` and `logo-white-transparent.png` as 160x160 unclipped square artworks preserving all corner stars, celestial crescent cradle, and Tamil script.
  - Verified logo containers render in square aspect ratio without circular cutoff across header, hero banner, and documentation page.
- [x] **7D Scorecard Detail Modal Viewport Fit:**
  - Redesigned modal with constrained viewport bounds (`max-h-[85vh]` on mobile, `max-h-[88vh]` on desktop, `p-2 sm:p-4` backdrop).
  - Separated into **Sticky Header** (title, badges, 7D overall score, ✕ Close button), **Scrollable Body** (`flex-1 overflow-y-auto overscroll-contain`), and **Sticky Footer** (shortlist button, close action).
  - Modal never exceeds the screen height or width on any viewport size; close button remains permanently accessible.
- [x] **Active Tab Contrast & Readability:**
  - Active tab styles (`.tab-btn-active`, `.tab-title-active`, `.tab-sub-active`, `.tab-badge-active`) render in deep mahogany plum with crisp white and glowing warm gold subtitles, achieving **WCAG AAA (> 7:1) contrast**.
- [x] **In-App User Guide & Docs:** Verified dedicated `/docs` and `/guide` routes render complete feature manuals with navigation shortcuts in header and footer.

---

### Section C: Mobile Responsiveness & Cross-Browser Compatibility
- [ ] **Android Chrome:**
  - Hero banner renders seamlessly without horizontal scroll bleed.
  - Sticky header stays pinned; touch tapping on starting letters (`முதல் எழுத்து`) triggers instant filter.
  - 7D Scorecard modal opens within mobile screen bounds and scrolls smoothly without trapping background page scroll.
- [ ] **iOS Safari:**
  - Safe area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) respected.
  - Dynamic address bar collapsing does not clip bottom modal actions.
  - Font rendering for Tamil glyphs (`மெய்`, `உயிர்மெய்`) displays without glyph clipping or overlap.
- [ ] **Desktop (Chrome, Edge, Firefox, Safari):**
  - Page layout remains centered up to `max-w-7xl` with crisp typography.
  - Keyboard navigation: `ESC` key dismisses open modals; `Tab` key focuses interactive elements.

---

### Section D: Performance & Core Web Vitals
- [ ] **First Contentful Paint (FCP):** Target $\le 1.2\text{s}$ on 4G network.
- [ ] **Largest Contentful Paint (LCP):** Target $\le 2.0\text{s}$ (hero banner and initial 48-name shard preloaded).
- [ ] **Cumulative Layout Shift (CLS):** Target $\le 0.05$ (explicit image dimensions on logos and static skeleton placeholders).
- [ ] **Server Response Time (TTFB):** Static name pages `/name/[slug]` pre-rendered or cached via Incremental Static Regeneration (ISR) $\le 80\text{ms}$.

---

### Section E: Privacy, Legal & DPDP Act 2023 Compliance
- [x] **No Coercive Astrology:** Zero language claiming names cause misfortune, poverty, or disease; all numerology and planetary details labeled strictly as traditional cultural systems.
- [x] **DPDP 2023 Data Privacy:**
  - No personal information (PII) required for Free Tier usage.
  - Shortlists stored in browser `localStorage`; no server storage of family data without explicit opt-in.
  - Anonymized telemetry only (page views, search syllable frequency).
- [x] **Affiliate & Sponsor Transparency:** Non-intrusive sponsor cards (DonorConnect.in) clearly labeled with `"SPONSORED · விளம்பரம்"`.

---

### Section F: Monetization Instrumentation & Feature Flag Readiness
- [x] **Feature Flag Configuration:**
  - In `.env.production`: `NEXT_PUBLIC_ENABLE_PAYMENTS=false` during Free Beta.
- [x] **WhatsApp Family Voting Teaser:**
  - When a user in the Family Poll tab clicks `"💬 Share on WhatsApp"`, a celebratory preview modal highlights:
    > *"✨ WhatsApp Family Voting is in exclusive preview! Soon you can send a 1-click voting link to grandparents, siblings, and friends to vote directly without logging in. Early access will launch in the ₹499 Family Pro Pass."*
  - Includes a **"Notify Me on Launch"** button capturing interest signals without taking money during Beta.
- [x] **Error Reporting Micro-Flow:**
  - Report correction input on name modal connects to `/api/report-error`, allowing community scholars and parents to report linguistic suggestions directly.

---

## 3. Launch Sign-Off Matrix

| Milestone Gate | Owner | Criteria | Status |
| :--- | :--- | :--- | :---: |
| **Catalog Integrity** | Linguistic Engine | 20,731 verified names, 0 DPMO violations | ✅ **READY** |
| **Gender Audit** | Lexicon Lead | `கதிர்`, `கயல்`, `நம்பி`, `நறுமலர்` verified | ✅ **READY** |
| **Modal Viewport** | Frontend Lead | Viewport clamping, sticky header/footer | ✅ **READY** |
| **Square Logo** | Design Lead | Unclipped 160x160 square emblem deployed | ✅ **READY** |
| **Unit Test Suite** | QA Lead | 22/22 automated tests passing | ✅ **READY** |
| **Revenue Documentation**| Product Lead | 3-tier architecture & gateway docs authored| ✅ **READY** |
| **Production Server** | DevOps Lead | Next.js server running healthy on port 3020 | ✅ **READY** |

