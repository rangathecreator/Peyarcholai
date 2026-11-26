# 13 – Web MVP Implementation & Technical Design Document

**Version:** 3.0 | **Date:** 2026-11-26 (Initial: 2026-11-09) | **Branch:** `dev19Nov2026` | **Live Domain:** `https://peyar.donorconnect.in` | **AI Gateway:** OmniRoute `v3.8.53` (`http://127.0.0.1:20128/v1` → HP Z4 Workstation `100.105.146.7:11434..11437`)

> **2026-11-26 Production & `dev19Nov2026` Baseline:** **150,024 active / 150,650 raw Tamil names** across **393 `.json.gz` shards** (`22.94 MB`) in 3 cultural tiers (`pure_tamil`, `tamilnadu_usage`, `other_heritage`), **`82/82` unit, catalog, security & mobile regression tests PASS** across **20 suites**, and **`122/122` Next.js 15.5.29 build routes** (`0` errors). Includes the *Mangala Thottil* Tamil baby-naming theme (`Task 40`), collapsible mobile header/section/filter navigation (`Task 43`, `MF-01..15`), Six Sigma security/SEO/resilience fixes (`Task 44`, `SS-Q1..04`), **Option 4 Hybrid Cohort Frequency** (`110` Grade B priors + `ClassroomSurveyWidget` Grade A auto-upgrade, `B-16`), Task 32 Free Teaser (`B-15`), all 4 legal/merchant pages (`/terms`, `/privacy`, `/refund-policy`, `/contact`, `Task 29A`), and Vercel monitoring automation (`Task 42`).

---

## 1. Executive Summary & Alignment with Product Owner Decisions

| Product Owner Decision | Implemented Technical Solution |
| :--- | :--- |
| **Q1. Language & Catalog Scope** | Bilingual Tamil + English UI (`Noto Sans Tamil` + `Inter`), `150,024` active names across 3 cultural tiers, 27 *Natchathirams*, 12 *Rasis*, 108 *Padam* syllables, and QA Checklist v1.0 (`CLA/ETY/CIT/FMT`). |
| **Q2. Lean Infra & Scaling** | Next.js 15 App Router on Vercel (`peyar.donorconnect.in` via Cloudflare DNS) + Neon PostgreSQL (`DATABASE_URL` pooled, `V1__kidnaming_auth_poll.sql`) + bundled `.json.gz` shards with graceful fallback. |
| **Q3. Monetization & Merchant (`B-01..05`, `B-15`)** | Operated by **Saranya Mohan** (Sole Proprietor, Namakkal, Tamil Nadu; `support@names.iniya.in`). Free Explorer + **Suvadi Nilai (₹49)** + **Kudumba Nool (₹499)**; applicable taxes charged on top of tariff at checkout; 7-day refund for duplicate/technical failure only; Task 32 Parent-Surname Resonance ships as **Free Teaser + ₹499 full breakdown**. |
| **Q4. AI Gateway & Code Graph** | Local **OmniRoute `v3.8.53`** (`127.0.0.1:20128/v1` → HP Z4 `qwen2.5-coder-7b`/`14b`, capped `8s × 3` in web routes) + **Graphify** AST knowledge graph (`1,754` nodes, `2,563` edges, auto-refreshed via git hooks). |
| **Q5. Cohort Frequency (`B-16`)** | **Option 4 Hybrid:** `110` audited **Grade B** Tamil/South Indian cohort priors (`grade-b-tamil-cohort-priors.json`) + 1-tap zero-PII `ClassroomSurveyWidget` feeding `/api/survey` (auto-upgrades to **Grade A** at ≥ 30 responses, k-anonymity ≥ 5). |

---

## 2. Core Modules & File Map (`app/`)

| Module / Path | Responsibility |
| :--- | :--- |
| [`app/src/core/numerology.ts`](../../app/src/core/numerology.ts) | Deterministic **Chaldean**, **Pythagorean**, and **Katapayadi** calculators, Tamil transliterator, `Mulank`/`Bhagyank`, compound meanings (`10–75`), phonetic spelling variants, and `calculateFullNameResonance` (`Task 32`). |
| [`app/src/core/nakshatra-tamil.ts`](../../app/src/core/nakshatra-tamil.ts) | 27 *Natchathirams*, 12 *Rasis*, 108 *Padams*, offline Meeus lunar ephemeris + Lahiri Ayanamsa, and `nearBoundaryWarning` (`MON-001`). |
| [`app/src/core/book-citations.ts`](../../app/src/core/book-citations.ts) | Structured public-domain book citations (`author`, `title`, `year`, `edition`, `publicDomainBasis`) for numerology & Nakshatra methodologies (`Task 22`). |
| [`app/src/core/scorecard.ts`](../../app/src/core/scorecard.ts) | 7-Dimension & 14-Dimension Name Evaluation Engine. |
| [`app/src/lib/frequency-engine.ts`](../../app/src/lib/frequency-engine.ts) | Empirical Cohort Frequency V2 (`1-(1-p)^(m-1)`), `frequency-priors.json` (Grade C), and `grade-b-tamil-cohort-priors.json` (110 Grade B priors). |
| [`app/src/lib/repository.ts`](../../app/src/lib/repository.ts) | Sharded `.json.gz` catalog loader with `cachedAllNames`, `cachedAllCategoryBuckets`, `cachedSlugMap` `O(1)` lookup, and single-pass filter (`< 30ms`). |
| [`app/src/lib/db/stores.ts`](../../app/src/lib/db/stores.ts) & [`V1__kidnaming_auth_poll.sql`](../../app/src/lib/db/V1__kidnaming_auth_poll.sql) | `PollStore` contract, `InMemoryPollStore`, `PostgresPollStore` (`pg`), and Neon V1 SQL schema (`polls`, `poll_votes`, `class_collision_surveys`). |
| [`app/src/lib/poll-access.ts`](../../app/src/lib/poll-access.ts) & [`poll-security.ts`](../../app/src/lib/poll-security.ts) | Constant-time `x-creator-secret` verification, `sanitizeVoterInput`, `MAX 10` enforcement, and server-side blind stripping. |
| [`app/src/lib/entitlement-matrix.ts`](../../app/src/lib/entitlement-matrix.ts) & [`whatsapp-share.ts`](../../app/src/lib/whatsapp-share.ts) | Data-driven Free/Suvadi/Kudumba tier matrix (`T21-1`) and Web Share API → `wa.me` share builder (`T17-5`). |
| [`app/src/lib/omniroute.ts`](../../app/src/lib/omniroute.ts) | OmniRoute client with Cloudflare Access headers (`CF_ACCESS_CLIENT_ID`/`SECRET`), `8s × 3` timeout cap, and production localhost guard. |
| [`app/src/components/NamingGuruDashboard.tsx`](../../app/src/components/NamingGuruDashboard.tsx) | 8-tab Tamil-first Web App with collapsible mobile section accordion, collapsible Explore filters, `90dvh` ARIA modals, and Task 32 Free Teaser. |
| [`app/src/components/MobileHeaderNav.tsx`](../../app/src/components/MobileHeaderNav.tsx) | Collapsible `< md` hamburger drawer (`aria-expanded`, `aria-controls="mobile-header-drawer"`, `Escape` & route-change close, `44px` touch targets). |
| [`app/src/components/ClassroomSurveyWidget.tsx`](../../app/src/components/ClassroomSurveyWidget.tsx) | 1-tap zero-PII classroom collision micro-survey mounted on `/name/[slug]`. |
| [`app/src/app/name/[slug]/page.tsx`](../../app/src/app/name/%5Bslug%5D/page.tsx) | Dynamic `1d` ISR SEO profile for all 150,024 names with bilingual `generateMetadata()`, Pronunciation Audio, Grade B/A survey widget, and PDF CTA. |
| [`app/src/app/p/[inviteToken]/page.tsx`](../../app/src/app/p/%5BinviteToken%5D/page.tsx) | Lightweight SSR blind Family Poll voting page (`React.cache()` + `PublicPollVoteClient.tsx` + DPDP notice). |
| [`app/src/app/terms/page.tsx`](../../app/src/app/terms/page.tsx), [`privacy`](../../app/src/app/privacy/page.tsx), [`refund-policy`](../../app/src/app/refund-policy/page.tsx), [`contact`](../../app/src/app/contact/page.tsx) | Merchant, DPDP Act 2023 (Grievance Officer: Saranya Mohan), 7-day refund, and support pages (`Task 29A`). |
| [`app/scripts/check-prod-health.mjs`](../../app/scripts/check-prod-health.mjs) & [`.github/workflows/vercel-deploy-monitor.yml`](../../.github/workflows/vercel-deploy-monitor.yml) | Zero-dependency synthetic production health monitor (`8` routes + mobile menu markers) and GitHub Actions Vercel failure monitor (`Task 42`). |

---

## 3. Complete API Reference (10 Next.js App Router Endpoints)

| Endpoint | Method | Security / Caching / Behavior |
| :--- | :--- | :--- |
| `/api/names` | `GET / POST` | Single-pass catalog filter (`Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`); `POST` logs error reports. |
| `/api/advisor` | `POST` | Live OmniRoute AI Name Advisor (`8s × 3` cap) with instant curated catalog fallback; zero raw `err.message` leaks. |
| `/api/suggestions` | `GET / POST` | Public name submission reviewed via OmniRoute AI (`>= 80%` confidence gate); zero raw `err.message` leaks. |
| `/api/polls` | `GET / POST` | Create blind family polls (`MAX 10`, returns `creatorSecret` once, `503` if prod lacks `DATABASE_URL`). |
| `/api/polls/[inviteToken]` | `GET` | Fetch blind poll using `x-creator-secret` header + `pc_voter` cookie (graceful fallback for `sample-tamil-poll`). |
| `/api/polls/[inviteToken]/vote` | `POST` | Upsert sanitized family vote (`pc_voter` httpOnly cookie, `MAX 50` voters, closed-poll `409`). |
| `/api/survey` | `GET / POST` | Zero-PII classroom collision micro-survey (`k-anonymity >= 5`, `Grade A` at `>= 30`, `Grade B` fallback, `s-maxage=60`). |
| `/api/reports/download-pdf` | `GET` | Printable A4 single-name Heritage & Numerology Dossier (`escapeHtml()` + `safeHttpUrl()` XSS protection). |
| `/api/reports/family-booklet` | `GET` | Printable multi-name Comparison Matrix + *Peyar Soottu Vizha* + Registration Checklist (2–5 names, Katapayadi single+compound). |
| `/api/metrics` | `GET` | Prometheus text metrics (`METRICS_TOKEN` Bearer auth required in production; live catalog counts & uptime). |
