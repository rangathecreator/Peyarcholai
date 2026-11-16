# Design 09 — Tasks 21 & 22: Review, Gaps & Hardening

**Status:** Proposed for adoption · Scope: re-review of the delivered ₹499 features (Task 21 → Tasks 31–34) and book-referenced predictions (Task 22).

## 1. Task 21 — ₹499 value features: what is delivered vs. what is enforced

| Feature (Task) | Delivered (UI/engine) | Server-side enforcement today | Gap |
| :-- | :-- | :-- | :-- |
| Comparison matrix + Family Booklet (31) | Yes (`/api/reports/family-booklet`) | `?tier=` query param | **Bypassable** (Design 06 F3) |
| Parent-surname resonance (32) | Yes (`calculateFullNameResonance`) | Client-only | Gate is cosmetic; acceptable only if the feature is *intended* free-preview — product decision below |
| Pronunciation + syllable guide (33) | Yes (Web Speech API) | n/a (free feature) | Voice quality varies by device; fallback text exists |
| Naming-ceremony / registration checklist (34) | Yes (bundled in booklet) | Same as 31 | Static regulatory notes need annual review (`LEG`) |
| Download PDF (₹49/₹499) | Yes | `?tier=` | **Bypassable** |

**Hardening requirements**
1. All paid gates use `activeTier(session)` (Design 06 §5); `?tier=` and `body.tier` removed.
2. Free tier PDF keeps the watermark; paid PDFs never rendered without an entitled session.
3. Entitlement matrix is data-driven (`entitlement-matrix.ts`): feature → min tier, with a test that **every** `/api/reports/*` and `/api/polls` POST route references it (route-scan test).
4. Product decision (record, don't assume): Task 32 resonance — keep as ₹499 (current positioning) *or* free teaser with full breakdown paid. Default: **teaser** (show result number, hide breakdown) to improve conversion; owner may override.
5. Value audit refresh: after login ships, add funnel metrics (view paywall → login → purchase) via `/api/metrics` (no PII).

## 2. Task 22 — Book-referenced predictions: integrity review

| Topic | Current | Risk | Hardening |
| :-- | :-- | :-- | :-- |
| Chaldean compound meanings (`COMPOUND_MEANINGS` 10–75, e.g. 29) | Original paraphrase "after Cheiro / Sepharial" | Cheiro's *Book of Numbers* (1926) and Sepharial's *Kabala of Numbers* (1911) are public domain, but the 29-specific wording and "birth-date match" claims must not imply the book says it | Add `edition` (publisher, year, PD basis) to each citation; label body text **"Peyarcholai editorial summary of the tradition"**; never present as a quotation |
| Birth-date harmony (`FRIENDLY_NUMBERS`) | Chaldean friendly-number table | Presented near predictions; users may take it as fact | Keep the traditional/cultural disclaimer adjacent (`ContextualDisclaimer`), assert in test that every prediction block renders it |
| Katapayadi mapping | Implemented deterministically | Mapping for Tamil letters must match the published rule (consonant→digit; vowels/conjuncts rules) | Add table-driven tests against ≥ 20 documented examples (e.g. the classical word↔number examples); record source in `book-citations.ts` |
| Nakshatra/Padam syllables | 27×4 table | Plan doc SS-07 **C-08 requires validation by a qualified jyotishi before release** — not yet done | New **human gate** work item (T22-4): obtain written sign-off, store reviewer name/date in `doc/legal`; blocks "verified" claims |
| Ayanamsa/ephemeris | Pure-JS Meeus + Lahiri | Accuracy near boundaries (`MON-001`) | Keep `nearBoundaryWarning`; add regression vectors vs. a published Panchangam for ≥ 10 dates |
| Claims language | Mixed "per Cheiro" phrasing | Over-claiming | Lint rule/test: citation strings must come from `book-citations.ts` ids, no free-text "according to <author>" in components |

## 3. Acceptance criteria

| ID | Assertion |
| :-- | :-- |
| AC-21-01 | No route under `app/src/app/api` reads `tier` from query/body (route-scan test) |
| AC-21-02 | Free session ⇒ watermarked PDF; `suvadi_49` ⇒ ≤ 3 names booklet; `kudumba_499` ⇒ full; expired ⇒ free (integration) |
| AC-21-03 | `entitlement-matrix.ts` is the only source of feature→tier rules (grep test) |
| AC-22-01 | Every citation object has `author`, `title`, `year`, `edition`, `publicDomainBasis`; test fails otherwise |
| AC-22-02 | Katapayadi ≥ 20 documented examples pass |
| AC-22-03 | Prediction components render disclaimer + "editorial summary" label (render test) |
| AC-22-04 | Jyotishi sign-off recorded in `doc/legal/` before the UI may show "Verified" for Nakshatra data (human gate) |
| AC-22-05 | ≥ 10 Panchangam regression dates within the documented tolerance |

## 4. Work-split
`T21-1` entitlement matrix + route-scan test → `T21-2` replace `?tier=` with session gate (depends on Design 06 `T17-1`) → `T21-3` funnel metrics; `T22-1` citation schema + edition fields → `T22-2` Katapayadi tests → `T22-3` disclaimer/label render tests → `T22-4` jyotishi sign-off (human) → `T22-5` Panchangam vectors.
