# Testing Strategy & Validation Report (`testing/`)

**Version:** 3.0 | **Date:** 2026-11-15 | **Test Runner:** Node Test Runner (`npm test`: `src/core/core.test.ts`, `src/lib/catalog.test.ts`, `src/lib/features.test.ts` — **44/44 PASS across 12 Suites**) | **Production Build:** `npm run build` (**114 routes, 0 errors**)

---

## 1. Test Coverage Matrix

| Module | Test File | What is Verified |
| :--- | :--- | :--- |
| **Numerology Engine (Pythagorean + Chaldean + Katapayadi)** | `app/src/core/core.test.ts`, `app/src/lib/catalog.test.ts` | Deterministic Chaldean & Pythagorean sums (`Kavin`, `Yazhini`), per-letter breakdown arrays (`calculateDualNumerology()`), Tamil-to-Latin script transliteration (`இனியா`), Mulank/Bhagyank compatibility, phonetic spelling variants, compound interpretations (`10–75`, e.g., Compound `29`), and Parent-Surname Resonance (`Task 32`). |
| **Tamil Nakshatra & Ephemeris** | `app/src/core/core.test.ts` | All 27 Tamil *Natchathirams* and 108 *Padam* syllables present, Sidereal Moon longitude + Lahiri Ayanamsa calculation from IST date/time, `nearBoundaryWarning` (`MON-001`), and slug/Tamil lookup (`ரோகிணி`). |
| **7-Dimension Scorecard** | `app/src/core/core.test.ts` | Accurate Unicode Tamil Akshara grapheme counting (`தமிழ்` → 3 aksharas, `கவின்` → 3 aksharas) and 7-dimension evaluation scoring (`Yazhini`). |
| **Sharded Catalog & Provenance Integrity (150,024 active / 150,650 raw names)** | `app/src/lib/catalog.test.ts`, `app/scripts/audit-catalog.mjs` | Verifies 150,024+ active unique slugs & Tamil names across 393 `.json.gz` shards (`50,024` `pure_tamil`, `50,000` `tamilnadu_usage`, `50,000` `other_heritage`), 100% pure Tamil Unicode script, all 14 dimensions populated, QA Checklist v1.0 (`CLA-01..03`, `ETY-01..03`, `CIT-01..03`, `FMT-01..03`), `>= 0.80` citation gate, and `SS-03` search latency. |
| **Feature & Security Suites (Tasks 1, 4, 7, 8, 17, 20, 33, 36)** | `app/src/lib/features.test.ts` | Empirical Cohort Frequency V1/V2 (`classroomCollisionPercent`, `classroomDisplayEn/Ta`, `schoolDisplayCount`), Visual Query & AI Prompt Generator, Cultural Tier entitlements (`free`, `suvadi_49`, `kudumba_499`), Pronunciation syllable guide (`Task 33`), and Blind Family Vote-Out Poll security (`MAX 10`, participant stripping — `SG-03`). |
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

