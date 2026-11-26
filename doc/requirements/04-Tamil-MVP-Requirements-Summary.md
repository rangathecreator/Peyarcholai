# Requirements Specification — Tamil Web MVP (Updated Baseline)

**Version:** 2.0 | **Date:** 2026-11-26 (Initial: 2026-11-09) | **Branch:** `dev19Nov2026` | **Live Domain:** `https://peyar.donorconnect.in` | **Status:** Approved & Implemented (`82/82` tests PASS · `122/122` routes)

---

## 1. Product Owner Decisions & Scope Lock (`B-01`–`B-16`)

| Dimension | Approved Requirement |
| :--- | :--- |
| **Target Language & Catalog** | **Tamil-first (`தமிழ்` + English)** serving Tamil Nadu & the global Tamil diaspora — **`150,024` active / `150,650` raw names** across 3 cultural tiers (`pure_tamil`, `tamilnadu_usage`, `other_heritage`) compressed into 393 `.json.gz` shards. |
| **Platform & Mobile UX** | Mobile-first Next.js 15 App Router web application with collapsible mobile header (`MobileHeaderNav`), collapsible dashboard section accordion, collapsible Explore filters, `90dvh` ARIA modals, `>= 44px` touch targets, and *Mangala Thottil* Tamil baby-naming theme. |
| **AI Model Gateway & Code Graph** | **OmniRoute `v3.8.53`** (`http://127.0.0.1:20128/v1` → HP Z4 Workstation `100.105.146.7:11434..11437`, capped `8s × 3` in web routes) + **Graphify** AST knowledge graph (`graphify-out/`, gitignored, auto-refreshed via git hooks). |
| **Infrastructure & Persistence** | Vercel (`peyar.donorconnect.in` via Cloudflare DNS) + Neon PostgreSQL (`DATABASE_URL` pooled, `V1__kidnaming_auth_poll.sql`) + bundled `.json.gz` fallback with graceful zero-`500` degradation. |
| **Merchant, Tax, Refund & DPDP (`B-01..05`)** | Operated by **Saranya Mohan** (Sole Proprietor, Namakkal, Tamil Nadu; `support@names.iniya.in`). Free Explorer + **Suvadi Nilai (₹49)** + **Kudumba Nool (₹499)**; applicable taxes charged on top of tariff at checkout (no unnecessary GST marketing copy); **7-day refund** for duplicate charges or verified technical failures only; **DPDP Grievance Officer:** Saranya Mohan (`support@names.iniya.in`). |
| **Task 32 Positioning (`B-15`)** | **Free Teaser + ₹499 Full Breakdown** — free users see live single-digit Chaldean/Pythagorean resonance numbers; Kudumba Nool (₹499) unlocks full compound numbers, friendly-number harmony, and personalized recommendation. |
| **Cohort Frequency (`B-16`)** | **Option 4 Hybrid:** `110` audited **Grade B** Tamil/South Indian cohort priors (`grade-b-tamil-cohort-priors.json`) + 1-tap zero-PII `ClassroomSurveyWidget` feeding `/api/survey` (`k-anonymity >= 5`, auto-upgrades to **Grade A** at `>= 30` responses). |

---

## 2. Functional & Non-Functional Requirements (Implemented in `app/`)

1. **FR-01 — Bilingual 150K+ Tamil Baby Name Explorer:** Single-pass `< 30ms` filtering by Tamil/English text, gender, 3-tier cultural category, 27 *Natchathirams*, Chaldean/Pythagorean numerology, origin, starting syllable, and parent-centric quality filters (with collapsible mobile filter drawer).
2. **FR-02 — Offline 27 Natchathiram & 108 Padam Calculator:** Offline Meeus lunar ephemeris + **Lahiri (Chitrapaksha) Ayanamsa** with near-boundary warning (`MON-001`) and zero commercial ephemeris license dependency.
3. **FR-03 — Multi-System Numerology Engine:** Pythagorean, Chaldean, and classical Tamil **Katapayadi** calculators, compound meanings (`10–75`), Birth-Date (`Mulank`/`Bhagyank`) harmony, phonetic spelling variants, public-domain book citations (`Task 22`), and Parent-Surname Resonance Free Teaser (`Task 32`, `B-15`).
4. **FR-04 — 7D / 14D Scorecard & Pronunciation Audio Guide:** 7D/14D scoring (`scorecard.ts`), Web Speech API (`ta-IN` / `en-IN`) playback, and Tamil/Roman syllable guide (`PronunciationButton.tsx`).
5. **FR-05 — OmniRoute AI Name Advisor & Visual Prompt Synthesizer:** Live `POST /api/advisor` (`8s × 3` timeout cap, instant catalog fallback) plus deterministic Visual Query & Prompt Synthesizer (`Task 7`).
6. **FR-06 — Blind Family Vote-Out Poll (`Task 17`):** Shareable `/p/[inviteToken]` SSR voting page, `MAX 10` candidates, `MAX 50` voters, constant-time `x-creator-secret` access control, `pc_voter` httpOnly cookie upsert, WhatsApp Web Share / `wa.me` builder, and 30-day post-close retention.
7. **FR-07 — Public Name Suggestions + AI Moderation & Error Reporting:** `POST /api/suggestions` reviewed via OmniRoute (`>= 80%` confidence gate) and per-name error correction reporting.
8. **FR-08 — Printable A4 PDF Dossier & Family Booklet (`Tasks 18, 31, 34`):** `/api/reports/download-pdf` (XSS-hardened with `escapeHtml` + `safeHttpUrl`) and `/api/reports/family-booklet` (2–5 name comparison matrix, *Peyar Soottu Vizha* keepsake, and Birth Certificate / Aadhaar / Passport checklist).
9. **FR-09 — Empirical Cohort Frequency Option 4 Hybrid (`Task 20`, `Task 36`, `B-16`):** Same-gender classroom collision formula `1 - (1 - p)^(m - 1)`, `110` Grade B external priors, and 1-tap zero-PII `ClassroomSurveyWidget` feeding `/api/survey`.
10. **FR-10 — Mobile-First Collapsible UX (`Task 43`, `MOB-01..11`):** Zero horizontal overflow (`320px–430px`), collapsible header/section/filter menus, `90dvh` ARIA dialogs, `>= 44px` touch targets, and iOS `16px` input zoom guard.
11. **FR-11 — *Mangala Thottil* Tamil Baby-Naming Theme (`Task 40`):** Warm silk-ivory Kolam dot-grid canvas (`.bg-tamil-kolam`), Peacock-Teal / Celestial-Indigo / Turmeric-Gold hero, and festive top Mangala ribbon (`Design 11`).
12. **FR-12 — Merchant, Legal & DPDP Compliance (`Tasks 29A, 29B, 30`):** Published `/terms`, `/privacy`, `/refund-policy`, `/contact`, and contextual disclaimers (`ContextualDisclaimer.tsx`).
13. **FR-13 — SEO, Resilience & Observability (`Task 41`, `Task 44`):** Bilingual `generateMetadata()` + `1d` ISR on 150K `/name/[slug]` pages, `robots.ts`, `sitemap.ts`, branded `error.tsx`/`not-found.tsx`, `HSTS`/`Permissions-Policy`, `METRICS_TOKEN`-gated `/api/metrics`, and zero raw `err.message` leaks.
14. **FR-14 — Automated Quality & Vercel Deployment Monitoring (`Task 42`):** `82/82` unit/mobile/Six-Sigma tests (`npm test`), `122/122` Next.js build routes, zero-dep `scripts/check-prod-health.mjs`, and `.github/workflows/vercel-deploy-monitor.yml`.
