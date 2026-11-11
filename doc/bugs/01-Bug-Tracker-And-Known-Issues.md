# Bug Tracker & Issue Log (`bugs/`)

**Version:** 1.0 | **Date:** 2026-11-09 | **Project:** NamingGuru Tamil Web MVP

---

## 1. Resolved Issues

| Bug ID | Severity | Component | Description & Root Cause | Resolution | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | High | Core Scorecard (`scorecard.ts`) | Standard JavaScript `.length` counts UTF-16 code units rather than Tamil orthographic syllables (`தமிழ்`.length === 5 instead of 3 aksharas). | Implemented `countTamilAksharas()` grouping Tamil vowel matras (`ா`..`ௌ`) and pulli (`்`) with their base consonant. Verified by unit tests. | ✅ Resolved |
| **BUG-002** | Medium | OmniRoute Gateway (`localhost:20128`) | Gateway was stopped and can hit SQLite WASM OOM under heavy multi-agent load if started with default Node heap. | Started daemon with `$env:NODE_OPTIONS="--max-old-space-size=4096"` per runtime troubleshooting guide. | ✅ Resolved |
| **BUG-003** | Medium | AI Enrichment Pipeline (`enrich-tamil-names.mjs`) | Free-tier LLM providers occasionally wrap JSON output in markdown fences or time out. | Added JSON fence stripping, `AbortSignal.timeout(25000)`, multi-model fallback in `src/lib/omniroute.ts`, and a deterministic baseline catalog. | ✅ Resolved |

---

## 2. Open / Monitored Items

| Bug ID | Severity | Component | Description | Mitigation / Next Step | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MON-001** | Low | Nakshatra Padam Boundary (`nakshatra-tamil.ts`) | Birth times within `< 9 arc-minutes` ($0.15^\circ$) of a Padam boundary can shift between adjacent starting syllables depending on exact birth seconds. | Engine automatically sets `nearBoundaryWarning` in the UI advising parents to verify exact birth minute with their family Panchangam. | 🔍 Monitored |
| **MON-002** | Medium | AI Curation Accuracy (Q4 Risk) | AI-generated meanings or literary citations could occasionally misattribute a Sangam verse. | Added confidence score badges (`%`), source citation display, and an in-app **"Report a Meaning or Citation Correction"** button on every name modal (`POST /api/names`). | 🔍 Monitored |

