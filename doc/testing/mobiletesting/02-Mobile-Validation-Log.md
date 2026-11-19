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

---

## Run #4 — Cycle 2 & 3 Full Verification (`Iterations 2026-11-19-05` & `06`, `2026-11-19 10:19 IST`)

- **Branch:** `dev19Nov2026`
- **Unit & Mobile/Six-Sigma Suite (`npm test`):** **80 / 80 PASSED** (`0` failed, `0` skipped) — covers `MOB-01..11` + `SS-Q1..04`.
- **Production Build (`npm run build`):** **PASSED** (`118/118` routes, `0` errors; unused `1.94 MB` `public/logo-master.png` removed).
- **All 15 Mobile Findings (`MF-01` through `MF-15`):** **15 / 15 Fixed & Regression-Tested.**

---

## Run #5 — 2-Hour Continuous Improvement Program Closeout (`2026-11-19 10:56 IST`)

- **Branch:** `dev19Nov2026` (all verified commits pushed exclusively to `origin dev19Nov2026`: `d083a80` → `0173fd0` → `632895e` → `6d20275` → `312a9ae`)
- **Automated Regression Suite (`npm test`):** **80 / 80 PASSED** (`0` failed, `0` skipped)
- **Live Production (`https://peyar.donorconnect.in` @ `main` `8e4b2f0`) via `node scripts/check-prod-health.mjs`:**
  - `6 / 8 PASS` (`/` `310ms`, `/name/yazhini` `223ms`, `/why-peyarcholai` `220ms`, `/docs` `221ms`, `/guide` `221ms`, `/api/names` `234ms`)
  - `2 / 8` known Neon-schema `500`s (`/p/sample-tamil-poll`, `/api/survey`) — **already fixed on `dev19Nov2026`** (verified `8 / 8 PASS` locally against `next start`), ready for next owner-approved promotion to `main` + one-time `V1__kidnaming_auth_poll.sql` run in Neon SQL Editor.
