# Mobile Validation & Deployment Log

**Tracking Directory:** `E:\project\Apps\KidNamingApp\doc\testing\mobiletesting\`

---

## Run #1 — Local Pre-Promotion Sanity (`2026-11-19 09:04–09:06 IST`)

- **Branch:** `dev`
- **Primary AI Partner:** Local OmniRoute (`127.0.0.1:20128/v1` → HP Z4 `100.105.146.7:11436`, `llama-cpp/qwen2.5-coder-14b`)
- **Automated Unit & Mobile Regression Suite (`npm test`):**
  - Result: **73 / 73 PASSED** (`0` failed, `0` skipped, `6.7s`)
  - Includes `MOB-01` through `MOB-06` (`app/src/lib/mobile-ui.test.ts`) and `Task 39` single-pass filter latency `< 30ms` (`76.18ms` across warmup + 5 runs, ~13ms median).
- **Production Build (`npm run build`):**
  - Result: **PASSED** (`0` errors, `116/116` static pages generated in `20.5s`)
- **Local Production Server E2E (`http://127.0.0.1:3020` via `next start -p 3020`):**

| Route | HTTP | Bytes | `Cache-Control` | Mobile Checks |
| :--- | :---: | ---: | :--- | :--- |
| `/` | `200` | 455,461 | `s-maxage=3600, stale-while-revalidate=31532400` | `headerDrawer=True`, `sectionMenu=True`, `mobileH1=True`, `noWrapCta=True` |
| `/name/yazhini` | `200` | 62,175 | `s-maxage=31536000` | Verified |
| `/why-peyarcholai` | `200` | 49,331 | `s-maxage=31536000` | Verified |
| `/docs` | `200` | 63,224 | `s-maxage=31536000` | Verified |
| `/guide` | `200` | 63,230 | `s-maxage=31536000` | Verified |
| `/p/sample-tamil-poll` | `200` | 27,011 | `private, no-cache, no-store, max-age=0, must-revalidate` | Verified |
| `/api/names?gender=girl&nameCategory=pure_tamil&page=1` | `200` | 329,617 | `public, s-maxage=3600, stale-while-revalidate=86400` | Verified |
| `/api/survey?slug=yazhini` | `200` | 72 | — | `kAnonymityMet: false`, `grade: "C"` |

---

## Run #2 — Live Production Deployment Verification (`https://peyar.donorconnect.in` @ `8e4b2f0`, `2026-11-19 09:09–09:11 IST`)

- **Vercel Deployment:** Commit `8e4b2f0` built cleanly and deployed live on `bom1` (Mumbai edge).
- **Live Route & Mobile Marker Results:**
  - `GET /` → `200` (`PRERENDER`, `454,501 B`) — **`headerDrawer=True`, `sectionMenu=True`, `mobileH1=True`, `noWrapCta=True`**
  - `GET /name/yazhini` → `200` (`PRERENDER`, `61,219 B`)
  - `GET /why-peyarcholai` → `200` (`PRERENDER`, `49,283 B`)
  - `GET /docs` → `200` (`PRERENDER`, `63,176 B`)
  - `GET /guide` → `200` (`PRERENDER`, `63,182 B`)
  - `GET /api/names?gender=girl&nameCategory=pure_tamil&page=1` → `200` (`HIT`, `329,617 B`, `Cache-Control: public`)
  - `GET /p/sample-tamil-poll` → **`500`** (Neon DB table `family_polls` not yet migrated; fix tracked as `T41-1` on `dev19Nov2026`)
  - `GET /api/polls/sample-tamil-poll` → **`500`** (same Neon DB root cause; fix tracked as `T41-1` on `dev19Nov2026`)
  - `GET /api/survey?slug=yazhini` → **`500`** (Neon DB table `class_collision_surveys` not yet migrated; fix tracked as `T41-1` on `dev19Nov2026`)

---

## Run #3 — Iteration `2026-11-19-01` & `02` Verification on `dev19Nov2026` (`2026-11-19 09:21–09:23 IST`)

- **Branch:** `dev19Nov2026`
- **Unit & Mobile/Six-Sigma Suite (`npm test`):** **76 / 76 PASSED** (`0` failed, `0` skipped, `7.5s`) — includes `MOB-01..08` + `SS-Q1`.
- **Production Build (`npm run build`):** **PASSED** (`118/118` routes in `14.5s`, `0` errors; includes `/robots.txt`, `/sitemap.xml`, `/_not-found`, `1d` ISR on `/name/[slug]`).
- **Synthetic Health Monitor (`node scripts/check-prod-health.mjs` against `http://127.0.0.1:3020`):**
  - **8 / 8 PASS** (`/` `274,457 B` — **-40% SSR HTML payload reduction** from `455,461 B`!)
  - `/robots.txt` → `200` (`105 B`) | `/sitemap.xml` → `200` (`86,975 B`)
  - `/p/sample-tamil-poll` → `200` | `/api/survey?slug=yazhini` → `200`
