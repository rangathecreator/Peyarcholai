# Testing Strategy & Validation Report (`testing/`)

**Version:** 2.0 | **Date:** 2026-11-10 | **Test Runner:** Node Test Runner (`npm test`: `src/core/core.test.ts` + `src/lib/catalog.test.ts`, `scripts/fuzz-api.mjs`, `scripts/audit-catalog.mjs`)

---

## 1. Test Coverage Matrix

| Module | Test File | What is Verified |
| :--- | :--- | :--- |
| **Numerology Engine (Pythagorean + Chaldean)** | `app/src/core/core.test.ts`, `app/src/lib/catalog.test.ts` | Deterministic Chaldean & Pythagorean sums (`Kavin`, `Yazhini`), per-letter breakdown arrays (`calculateDualNumerology()`), Tamil-to-Latin script transliteration (`இனியா`), Mulank/Bhagyank compatibility, and phonetic spelling variants. |
| **Tamil Nakshatra & Ephemeris** | `app/src/core/core.test.ts` | All 27 Tamil *Natchathirams* and 108 *Padam* syllables present, Sidereal Moon longitude + Lahiri Ayanamsa calculation from IST date/time, and slug/Tamil lookup (`ரோகிணி`). |
| **7-Dimension Scorecard** | `app/src/core/core.test.ts` | Accurate Unicode Tamil Akshara grapheme counting (`தமிழ்` → 3 aksharas, `கவின்` → 3 aksharas) and 7-dimension evaluation scoring (`Yazhini`). |
| **Sharded Catalog & Provenance Integrity (10,705 names)** | `app/src/lib/catalog.test.ts`, `app/scripts/audit-catalog.mjs` | Verifies 10,705 unique slugs & Tamil names across 42 shards (`src/data/names/`), 100% pure Tamil Unicode script, all 14 dimensions populated, zero misleading `"Direct Classical"` labels on compound names (including regression test for `கலைநகை`), `SS-03` filter speed (`3.94 ms` avg < `15 ms`), and `SS-06` parent transparency. |
| **Live HTTP Fuzz & Exploratory Testing** | `app/scripts/fuzz-api.mjs` | 150 randomized/adversarial HTTP requests against `/api/names`, `/name/[slug]`, `/api/suggestions`, `/api/polls`, and `/api/advisor` testing SQLi/XSS strings, boundary `pageSize`/`minEaseScore` clamping, and latency (`0 defects, DPMO = 0, p50 = 31 ms`). |

---

## 2. How to Run Automated Tests

```powershell
cd E:\project\Apps\KidNamingApp\app
npm test
.\verify-local.ps1
```

---

## 3. Executed Prerequisite Smoke Test Results (2026-11-09)

```text
=========================================================
 NamingGuru Tamil Web MVP - Local Prerequisite Verification
=========================================================
[PASS] 1. OmniRoute Gateway (:20128) Active - Models Loaded: 1570
[PASS] 2. Web Home Page (GET /) - HTTP 200 (155330 bytes)
[PASS] 3. SEO Detail Page (GET /name/yazhini) - HTTP 200
[PASS] 4. Names Filter API (GET /api/names?gender=girl) - Returned 28 Tamil girl/unisex names
[PASS] 5. OmniRoute AI Advisor API (POST /api/advisor) - Source: catalog-fallback, Model: verified-catalog, Recommendations: 4
[PASS] 6. Public Suggestion AI Moderation (POST /api/suggestions) - Status: AI-Approved, Confidence: 0.95, Model: openai/gpt-oss-120b
[PASS] 7. Family Vote-Out Poll API (GET /api/polls) - Poll 'Baby Girl Shortlist for Karthigai / Rohini Star' with 2 votes
=========================================================
 ALL LOCAL PREREQUISITE CHECKS PASSED! Ready for Manual Testing at http://localhost:3020
=========================================================
```

