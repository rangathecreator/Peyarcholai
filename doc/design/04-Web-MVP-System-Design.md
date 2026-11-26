# Web MVP System Design (`app/`)

**Version:** 2.0 | **Date:** 2026-11-26 | **Branch:** `dev19Nov2026` | **Stack:** Next.js 15.5.29 (App Router, TypeScript) + Tailwind CSS (*Mangala Thottil* Theme) + OmniRoute AI (`v3.8.53`) + Neon PostgreSQL / Sharded `.json.gz` Hybrid

---

## 1. Component & Route Architecture (Synced via Graphify `1,754` nodes / `2,563` edges)

```mermaid
flowchart LR
    subgraph Client["Browser Client (src/components & src/core)"]
        HEADER["MobileHeaderNav.tsx<br/>(Collapsible Drawer < md)"]
        DASH["NamingGuruDashboard.tsx<br/>(8 Tabs + Collapsible Mobile Filters & Modals)"]
        DETAIL["/name/[slug]/page.tsx<br/>(1d ISR + generateMetadata)"]
        SURVEY_UI["ClassroomSurveyWidget.tsx<br/>(1-Tap Zero-PII Survey)"]
        POLL_UI["/p/[inviteToken]/PublicPollVoteClient.tsx<br/>(Blind Mobile Voting)"]
        LEGAL["/terms · /privacy · /refund-policy · /contact"]
        CORE["core/ (numerology, nakshatra-tamil, scorecard, book-citations)"]
        DASH --> CORE
        DETAIL --> CORE
        DETAIL --> SURVEY_UI
    end

    subgraph Server["Next.js 15 App Router API (10 Routes)"]
        API_NAMES["/api/names (ISR/CDN Cache-Control)"]
        API_ADV["/api/advisor"]
        API_SUG["/api/suggestions"]
        API_POLL["/api/polls & /api/polls/[inviteToken](/vote)"]
        API_SURVEY["/api/survey (k-anonymity >= 5, Grade A/B/C)"]
        API_PDF["/api/reports/download-pdf & family-booklet"]
        API_METRICS["/api/metrics (METRICS_TOKEN gated)"]
    end

    subgraph Services["Service & Data Layer (src/lib & src/data)"]
        OR_CLIENT["lib/omniroute.ts (8s x 3 cap)"]
        REPO["lib/repository.ts (O(1) Counts & Cached Buckets)"]
        FREQ["lib/frequency-engine.ts + grade-b-tamil-cohort-priors.json (110 Grade B)"]
        PG_STORE["lib/db/stores.ts (PostgresPollStore + InMemoryPollStore)"]
        SHARDS[("393 .json.gz Shards<br/>150,024 Active Names")]
        NEON[("Neon PostgreSQL<br/>V1__kidnaming_auth_poll.sql")]
    end

    DASH --> API_NAMES
    DASH --> API_ADV
    DASH --> API_SUG
    DASH --> API_POLL
    POLL_UI --> API_POLL
    SURVEY_UI --> API_SURVEY
    API_ADV --> OR_CLIENT
    API_SUG --> OR_CLIENT
    API_NAMES --> REPO
    API_PDF --> REPO
    API_PDF --> FREQ
    API_SURVEY --> FREQ
    API_SURVEY --> NEON
    API_POLL --> PG_STORE
    PG_STORE --> NEON
    REPO --> SHARDS
```

---

## 2. Database & Hybrid Persistence Design (`app/src/lib/db/V1__kidnaming_auth_poll.sql`)

- **Bundled Sharded Catalog (`app/src/data/names/*.json.gz`):** `150,024` active / `150,650` raw records across `393` gzipped shards (`22.94 MB`), cached in memory with `cachedAllNames`, `cachedAllCategoryBuckets`, `cachedSlugMap`, and throttled `statSync` (`< 30ms` single-pass filter latency).
- **Neon PostgreSQL (`DATABASE_URL` pooled, `B-07`):**
  - `polls` & `poll_votes` (`PostgresPollStore` with `creator_secret_hash`, `voter_token_hash` upsert, `MAX 10` candidates, `MAX 50` voters, 30-day post-close retention).
  - `class_collision_surveys` (anonymous zero-PII observations; `k-anonymity >= 5` threshold; upgrades name to **Grade A** at `>= 30` responses).
  - Graceful `try/catch` degradation on `/p/[inviteToken]`, `/api/polls/[inviteToken]`, and `/api/survey` ensures zero HTTP `500`s even before `V1` SQL migration runs.
- **Grade B External Cohort Priors (`app/src/data/grade-b-tamil-cohort-priors.json`):** `110` audited Tamil & South Indian first names (`bandWidthFactor.gradeB = 1.8`), seamlessly superseded by Grade A when live survey responses reach `>= 30`.

---

## 3. Caching, Security & Mobile-First Guardrails

1. **Performance & SEO (`122` Next.js Routes):**
   - `/` uses `revalidate = 3600` (`INITIAL_PAGE_SIZE = 24`, ~274 KB SSR HTML); `/name/[slug]` uses `revalidate = 86400` + unique bilingual `generateMetadata()`.
   - `GET /api/names` sends `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`; `GET /api/survey` sends `s-maxage=60, stale-while-revalidate=300`; static `.png` logos are `immutable` with explicit `width`/`height` (`CLS = 0`).
   - Branded `error.tsx`, `not-found.tsx`, `robots.ts`, and `sitemap.ts` (508 URLs including legal pages).
2. **Security (`SS-Q1`–`SS-Q4`):**
   - `escapeHtml()` + `safeHttpUrl()` on all printable HTML/PDF outputs (`download-pdf`, `family-booklet`).
   - Zero raw `err.message` leaks across public API routes; `HSTS` & `Permissions-Policy` in `next.config.mjs`; `METRICS_TOKEN` bearer gate on `/api/metrics`.
   - Constant-time `x-creator-secret` verification (`poll-access.ts`) + server-side blind stripping (`poll-security.ts`).
3. **Mobile-First Collapsible UX (`MOB-01`–`MOB-11`):**
   - Collapsible `MobileHeaderNav` drawer (`< md`), collapsible dashboard section accordion, collapsible Explore secondary filters (`mobile-extra-filters`), `max-h-[90dvh]` ARIA modals (`role="dialog"`, `aria-modal="true"`), `>= 44px` touch targets, and `@media (max-width: 767px)` `16px` iOS input auto-zoom guard.
