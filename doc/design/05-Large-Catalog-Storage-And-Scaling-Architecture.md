# 05 — Large Catalog Storage & Scaling Architecture (150K → 1M+ Names)

> **Context & Observation Date:** 2026-11-13  
> **Observed Catalog Baseline:** `150,650` raw records (`150,024` active at `confidence >= 0.80`) across `393` shards.

---

## 1. Problem Statement & Observed Bottleneck

When scaling the Peyarcholai catalog from ~22k names to **150,650 names**, bundling static JSON shards directly inside Next.js serverless functions hit a hard platform ceiling:

| Format / Storage Strategy | On-Disk / Bundle Size | Cold-Start V8 Heap Impact | Vercel Serverless Compatibility |
| :--- | :--- | :--- | :--- |
| Pretty-printed `.json` shards (393 files) | **535.48 MB** | ~550+ MB | ❌ Exceeds Vercel's **250 MB** unzipped serverless function limit (`vercel build failed`) |
| Minified `.json` shards | **451.58 MB** | ~500+ MB | ❌ Still exceeds **250 MB** limit |
| Gzipped `.json.gz` shards (current interim fix) | **22.94 MB** | ~450–550 MB (decompressed into RAM) | ✅ Fits under 250 MB bundle limit, **but** still decompresses & parses all 150k objects into RAM on every cold start |

### Why `.json.gz` Is Only an Interim Bridge
1. **Cold-Start CPU & Latency:** Every serverless cold start must `gunzipSync` and `JSON.parse` 393 files (`~451 MB` of JSON text) before serving a single 48-item page.
2. **RAM Ceiling:** Holding 150k+ hydrated/compact objects in Node.js heap consumes ~450–550 MB per function instance. Scaling to 300k–500k+ names risks hitting the 1024 MB serverless memory limit (OOM).
3. **Wasted Work per Query:** A user filtering `gender=girl&nameCategory=pure_tamil&limit=48` only needs **48 rows** and **1 count**, not 150,650 full records in memory.

---

## 2. Architectural Options & Cost Comparison

Because Peyarcholai's name catalog is **99.9% read-heavy** (batch-enriched offline via OmniRoute, read at runtime by users), the ideal architecture decouples **storage + indexing** from the **Next.js serverless compute bundle**.

### Option 1: Turso (libSQL / Edge SQLite) — *Best \$0/mo Ultra-Low-Cost Scaling*
- **Design:** Store compact name records in Turso (`libSQL`) with composite B-Tree indexes on `(nameCategory, gender, startingSyllable, numerologyPythagorean, confidence)` and an **FTS5** virtual table for instant Tamil/Roman/meaning search.
- **Next.js Runtime:** Query only `LIMIT 48 OFFSET ?` over HTTP/libSQL (`@libsql/client`). **0 MB** catalog data bundled in Vercel functions.
- **Cost:**
  - **Starter (Free):** **\$0/mo** — **9 GB storage**, **500M row reads/mo**, 10M row writes/mo (easily holds 150k → 5M+ names).
  - **Developer:** **\$29/mo** — 24 GB storage, 2.5B row reads/mo.
- **Pros:** Highest free-tier storage/read allowance; zero pause/sleep; sub-20ms edge reads; built-in FTS5 search.
- **Cons:** Separate SQLite/libSQL dialect if user polls/auth already live in PostgreSQL.

### Option 2: Serverless PostgreSQL (Neon or Supabase) — *Best Unified DB + Rich Multi-Facet Querying*
- **Design:** Store the catalog in PostgreSQL alongside existing user/poll tables (`DATABASE_URL` is already anticipated in `repository.ts`). Use B-Tree indexes for category/gender/numerology/nakshatra + `pg_trgm` GIN indexes for fast Tamil/Tanglish substring search.
- **Next.js Runtime:** Parameterized SQL returning 48 rows + cached category counts. **0 MB** catalog data in serverless bundle.
- **Cost:**
  - **Neon Free:** **\$0/mo** (0.5 GB storage — 150k compact rows take ~80–120 MB; 191.9 compute hrs/mo). **Neon Launch:** **~\$19/mo** (10 GB storage, always-on).
  - **Supabase Free:** **\$0/mo** (500 MB DB, pauses after 7 days inactivity). **Supabase Pro:** **\$25/mo** (8 GB DB, no auto-pause).
- **Pros:** Single database for both catalog and transactional user data (polls, favorites, subscriptions); industry-standard SQL, `pg_trgm`, and JSONB.
- **Cons:** Free tiers have tighter storage (500 MB) and compute/pause limits at high traffic compared to Turso.

### Option 3: Object Storage Split-Index + CDN (Cloudflare R2 / Vercel Blob) — *Best Zero-DB Static Pattern*
- **Design:** Split the catalog into two tiers on CDN/R2:
  1. **Thin Filter Index** (`slug, nameTamil, nameRoman, gender, category, numerology, nakshatra` — ~4–6 MB gzipped, or partitioned into 3 `category` indexes of ~1.5–2 MB each) cached in Edge/CDN.
  2. **Sharded/Per-Slug Detail JSONs** fetched on-demand from R2/CDN only when a user opens `/name/[slug]` or clicks a name card.
- **Cost:**
  - **Cloudflare R2:** **\$0/mo** up to 10 GB storage & 10M Class B reads/mo, with **\$0 egress fees**.
- **Pros:** Essentially infinite static scaling at near-zero cost; great for `/name/[slug]` detail pages.
- **Cons:** Multi-facet search + arbitrary keyword search across 150k+ meanings still requires loading the thin index or pairing with a search/SQL engine.

### Option 4: Embedded Read-Only SQLite (`catalog.db`) on Persistent Compute (Fly.io / Railway / VPS)
- **Design:** Pre-build a single indexed `catalog.db` (~65–90 MB) during CI and mount it on a persistent Node/Docker container (rather than ephemeral Vercel serverless functions).
- **Cost:** **\$5–\$7/mo** (Fly.io / Railway / Hetzner VPS).
- **Pros:** Zero network hop (<2ms local SQLite reads), predictable flat monthly bill, no serverless bundle/timeout limits.
- **Cons:** Requires leaving Vercel Serverless for container hosting (or running it as a dedicated microservice API).

### Option 5: Dedicated Search Engine (Typesense / Meilisearch) — *Best for Typo-Tolerant Search at 500K+*
- **Design:** Index all names in Typesense/Meilisearch for <10ms typo-tolerant faceted search (e.g., matching `"yaazhini"` ↔ `"yazhini"` ↔ `"யாழினி"`).
- **Cost:** **\$4–\$6/mo** self-hosted on a small VPS, or **\$20–\$30/mo** managed cloud.
- **Pros:** Best-in-class search UX and instant facet counts.
- **Cons:** Extra operational component; unnecessary until traffic or corpus size (>500k) demands typo-tolerant full-text ranking.

---

## 3. Summary Decision Matrix

| Solution | Monthly Cost (MVP / 150K) | Monthly Cost (Scale / 1M+) | Cold-Start RAM | Query Latency | Multi-Facet + Search |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Current (`.json.gz` in bundle)** | \$0 | ❌ Fails (>RAM/timeout) | ~500 MB | 1–3s cold / 50ms warm | In-memory scan |
| **Turso (libSQL + FTS5)** | **\$0** (9 GB free) | \$0–\$29 | **~0 MB** | 10–30ms | SQL + FTS5 |
| **Neon / Supabase Postgres** | **\$0** (0.5 GB free) | \$19–\$25 | **~0 MB** | 15–50ms | SQL + `pg_trgm` GIN |
| **Cloudflare R2 Split-Index** | **\$0** (10 GB free) | \$0–\$2 | ~5–20 MB (thin index) | 10–40ms | Limited text search |
| **Persistent VPS + SQLite** | **\$5–\$7** | \$5–\$15 | **~0 MB** (OS page cache) | **1–5ms** | SQL + FTS5 |
| **Typesense / Meilisearch** | \$5–\$29 | \$15–\$50 | **~0 MB** | **<10ms** | Best-in-class |

---

## 4. Recommended Target Architecture for Peyarcholai

For **maximum cost efficiency + clean scaling from 150K to 1M+ names** on Vercel:

1. **Primary Catalog Store → Turso (`libSQL`) or Neon/Supabase PostgreSQL:**
   - Move the 150k+ compact records out of the Git/Vercel function bundle into an indexed SQL database (`Turso` for **\$0/mo up to 9 GB**, or `Neon/Supabase` if unifying with user polls & auth).
   - Keep `hydrateCompactRecord()` in [`app/src/lib/repository.ts`](../../app/src/lib/repository.ts) so only compact fields are stored in DB rows (~500 bytes/row → ~75 MB total for 150k records).
   - Add composite indexes:
     - `(nameCategory, gender, confidence)`
     - `(startingSyllable, gender)`
     - `(numerologyPythagorean, numerologyChaldean)`
     - Full-text index (`FTS5` in Turso or `pg_trgm` in Postgres) on `nameTamil`, `nameRoman`, `meaningEn`, `meaningTa`.
2. **Edge / ISR Caching on Read Endpoints:**
   - Cache `/api/names` and `getCategoryCounts()` with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` so repeated homepage/filter hits serve from Vercel Edge CDN with **0 DB queries**.
   - Keep `/name/[slug]` using **On-Demand ISR** (`revalidate = 86400`, pre-rendering only top 100 slugs at build time) so build time stays <15s regardless of catalog size.
3. **Offline Sourcing Pipeline:**
   - Keep `omniroute-continuous-sourcer.mjs` writing/syncing to the DB in batches (and optionally exporting `.json.gz` snapshots for offline Git backup/audits outside the `app/` serverless bundle).

### Phased Migration Path
- **Phase 1 (Completed):** `.json.gz` shard compression (`535.48 MB` → `22.94 MB`) to unblock Vercel's 250 MB bundle limit immediately.
- **Phase 2 (Recommended Next):** Seed compact catalog into **Turso** (or **Neon Postgres** via `DATABASE_URL`) and switch `repository.ts` queries to SQL `LIMIT/OFFSET` + `FTS5`/`pg_trgm`, reducing Vercel function bundle to **<5 MB** and cold-start RAM to **~0 MB**.
- **Phase 3 (500K–1M+ Scale):** Add Edge cache warming + optional Typesense/Meilisearch if typo-tolerant phonetic search demand grows.

