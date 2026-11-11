# பெயர்ச்சோலை (Peyarcholai) — Feature-wise Comprehensive Test Matrix (Unit & Functional)

**Document ID:** `PLAN-TEST-10`  
**Location:** `doc/plan/10-Comprehensive-Feature-Test-Matrix.md`  
**Status:** Approved Quality Assurance Specification  

---

## 1. Test Architecture & Coverage Targets

To maintain Six Sigma data integrity ($DPMO \le 3.4$) across 20,700+ to 50,000+ names, our automated test pyramid covers 4 distinct layers:
1. **Linguistic Unit Tests:** Morphological sandhi, root purity, gender correctness, Devanagari zero-tolerance.
2. **Astrological & Numerological Unit Tests:** Dual Chaldean + Pythagorean math, 27 Nakshatras & 108 Padams.
3. **Core Feature Functional Tests:** Query generator, empirical frequency calculation, WhatsApp family voting, PDF exporter, and 7D scorecard modal.
4. **End-to-End API & Integration Tests:** Auth OAuth flow, Razorpay webhook signature verification, rate limiting, and HTTP health checks.

Target: **Minimum 90% branch coverage** across all core business modules.

---

## 2. Feature-by-Feature Test Matrix

| Feature Module | Test Suite ID | Type | Test Objectives & Assertions | Target File |
| :--- | :--- | :---: | :--- | :--- |
| **User Auth** | `AUTH-01..04` | Functional | Verify Google OAuth, Facebook Login, Phone OTP session minting, and JWT entitlement verification. | `src/features/auth/auth.test.ts` |
| **Billing & Payments**| `PAY-01..06` | Unit & API | Verify Razorpay order creation, HMAC signature verification, idempotency duplicate rejection, 18% GST tax calculation. | `src/features/billing/billing.test.ts` |
| **Query Generator** | `QRY-01..05` | Unit | Validate multi-parameter compiling (numerology, starting letters, frequency, ease score, parent/sibling rhythm matching). | `src/features/query/query.test.ts` |
| **Frequency Scoring**| `FRQ-01..04` | Unit | Validate frequency percentage formula ($F = \frac{\text{count}}{\text{cohort}} \times 100$), percentile rank, and rarity badge assignment. | `src/features/frequency/frequency.test.ts` |
| **PDF Dossier** | `PDF-01..04` | Functional | Verify PDF generation payload, watermark suppression for paid tiers, font embedding for Tamil glyphs. | `src/features/reports/pdf.test.ts` |
| **WhatsApp Poll** | `WAP-01..07` | Functional | Verify 30-day token expiry, friction-free voter access, ranked-choice tie breaking, double-vote block. | `src/features/polls/poll.test.ts` |
| **Gender Integrity**| `GEN-01..04` | Unit | Assert `கதிர்` = boy, `கயல்` = girl, `நம்பி` = boy, `நறுமலர்` = girl, and classical gender suffix rules. | `src/lib/catalog.test.ts` |
| **Modal Viewport** | `UI-01..03` | Functional | Assert 7D scorecard modal dimensions (`max-h-[85vh]`), sticky header, scrollable body, and sticky footer. | `src/components/dashboard.test.tsx` |
| **Observability** | `OBS-01..04` | Unit & API | Verify structured JSON logging format, Prometheus `/api/metrics` RED metric incrementing, ErrorBoundary reporting. | `src/features/obs/obs.test.ts` |

