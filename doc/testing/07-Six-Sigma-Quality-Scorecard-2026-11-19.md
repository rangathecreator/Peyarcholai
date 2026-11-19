# Six Sigma Quality Scorecard & DMAIC Improvement Plan (2026-11-19)

**Branch:** `dev19Nov2026` | **Baseline Commit:** `8e4b2f0` | **Standard:** Six Sigma DMAIC + `SG-01..SG-05`  
**Audit Scope:** 18 core units (5 page routes, 10 API routes, 3 infra/config modules) × 5 CTQ dimensions = **90 CTQ opportunities**

---

## 1. Define & Measure — Baseline CTQ Scorecard (`2026-11-19 09:15 IST`)

| CTQ Dimension | Critical / High | Medium | Low | Total Defects | Baseline Status | Target (Post-`dev19Nov2026`) |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **1. Reliability & Error Handling** | 6 | 3 | 0 | 9 | Neon `500`s on `/p/[token]` & `/api/survey`; missing `error.tsx`/`not-found.tsx` | **0 Critical/High** |
| **2. Performance & Payload** | 3 | 4 | 1 | 8 | `/` HTML `455 KB`, `INITIAL_PAGE_SIZE=48`, missing `revalidate` on `/name/[slug]` | **< 250 KB `/` HTML**, ISR on `/name/[slug]` |
| **3. Security & Privacy** | 2 | 3 | 0 | 5 | Unescaped HTML in `download-pdf`, raw `err.message` leaks, missing HSTS/Permissions-Policy | **0 Critical/High** |
| **4. Data Quality & SEO** | 2 | 1 | 0 | 3 | `[object Object]` Katapayadi in `family-booklet`, missing `generateMetadata` on `/name/[slug]` | **0 Critical/High** |
| **5. Accessibility & Mobile UX** | 2 | 10 | 1 | 13 | Non-collapsible mobile filter wall, modals using `vh` not `dvh`, missing `role="dialog"`, `<44px` touch targets | **0 Critical/High**, 100% `MOB-01..10` PASS |
| **TOTAL (Core 18 Units)** | **13** | **13** | **1** | **27** | **300,000 DPMO (~2.02σ)** | **Target: ≤ 22,000 DPMO (≥ 3.5σ) in 2h sprint; 0 Critical/High** |

---

## 2. Analyze — Top Root Causes (Pareto 80/20)
1. **Unguarded DB/API Calls:** Production Neon `DATABASE_URL` set before `V1__kidnaming_auth_poll.sql` migration → unhandled `42P01` exceptions caused 3 live `500`s.
2. **Missing HTML Escaping & Return-Type Mismatch in Print Routes:** `download-pdf/route.ts` skipped `escapeHtml()`, and `family-booklet/route.ts` interpolated the `KatapayadiResult` object directly.
3. **Oversized Mobile/SSR Surfaces:** 5 always-open filter panels on mobile pushed name cards ~1,800px below the fold; `page.tsx` serialized 48 full records (`309 KB` RSC JSON).
4. **Missing Next.js App Router Conventions:** No `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, or `generateMetadata()` on `/name/[slug]`.

---

## 3. Improve — Iteration Roadmap (`dev19Nov2026`, 09:15–11:10 IST)

- **Iteration `2026-11-19-01` (Security, Reliability, Data Bugs & Theme — NOW):**
  - `T40`: *Mangala Thottil* warm Tamil baby-naming theme (`globals.css`, `layout.tsx`).
  - `T41-1`: Resilient Neon DB fallbacks on `/p/[inviteToken]`, `/api/polls/[inviteToken]`, `/api/survey`.
  - `T42`: Vercel monitoring automation guide (`05-Vercel-Deployment-Monitoring-Automation.md`) + `scripts/check-prod-health.mjs`.
  - `T44-P0`: Fix `download-pdf` XSS (`escapeHtml`), fix `family-booklet` `[object Object]` Katapayadi bug, scrub raw `err.message` leaks, add branded `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`.
  - `T43-A`: Mobile fixes on `/name/[slug]`, `/why-peyarcholai`, `/p/[inviteToken]`, `/docs`.
- **Iteration `2026-11-19-02` (Mobile Collapsible Filters, Modal `dvh`/ARIA & Performance — NEXT):**
  - `T43-B`: Collapsible mobile filter drawer in `NamingGuruDashboard.tsx`, Name Detail Modal `max-h-[90dvh]` + `role="dialog"` + `aria-modal="true"`, Comparison Modal sticky header + backdrop dismiss + sticky first column, Family Poll `44px` vote cards.
  - `T41-2`: Reduce `INITIAL_PAGE_SIZE` to `24` on `/` (`page.tsx`), add `generateMetadata()` + `revalidate = 86400` + full `calculateEmpiricalRarity()` options on `/name/[slug]/page.tsx`, harden `next.config.mjs` (HSTS, Permissions-Policy, immutable logo cache), cap `omniroute.ts` timeouts.
- **Iteration `2026-11-19-03` (Control — Automated Regression Gates & Final Verification):**
  - Expand `mobile-ui.test.ts` (`MOB-01..10`) and add `six-sigma-gates.test.ts` (asserting `escapeHtml`, no raw `err.message`, `error.tsx`/`not-found.tsx` existence, `generateMetadata` on `/name/[slug]`, `Katapayadi` object formatting).
  - Run `npm test` (100% PASS), `npm run build` (`0` errors), and `scripts/check-prod-health.mjs` against localhost `3020`; push cleanly to `origin dev19Nov2026`.

---

## 4. Control — Post-Sprint Sigma Verification
*(Updated after Iteration `2026-11-19-03` completes.)*
