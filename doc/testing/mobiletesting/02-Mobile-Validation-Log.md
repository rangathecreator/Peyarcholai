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

## Run #2 — Live Production Deployment Verification (`https://peyar.donorconnect.in`)
*(Updated immediately after `dev` → `main` promotion and Vercel deployment completion.)*
