# Mobile View Deep Research & Validation Master Plan

**Application:** பெயர்ச்சோலை (Peyarcholai) — Tamil Baby Naming & Numerology Web App  
**Tracking Directory:** `E:\project\Apps\KidNamingApp\doc\testing\mobiletesting\`  
**Created:** 2026-11-19  
**Standards Baseline:** WCAG 2.2 AA (SC 2.5.8 Target Size, SC 1.4.10 Reflow), Apple Human Interface Guidelines (iOS 18+), Google Material 3 / Core Web Vitals (INP, CLS, LCP), Tamil Unicode Typography (`Noto Sans Tamil`).

---

## 1. Target Mobile Viewport Matrix

All interactive flows and pages must render with **zero horizontal scroll (`scrollWidth <= clientWidth`)**, **zero clipped text/controls**, and **collapsible navigation** across these canonical viewports:

| Tier | Representative Device | Viewport (CSS px) | DPR | Key Risk Area |
| :--- | :--- | :--- | :--- | :--- |
| **XS (Small)** | iPhone SE / Compact Android | `320 × 568` | 2 | Sticky header brand truncation, 2-col stat cards, long Tamil headings |
| **S (Standard Android)** | Pixel / Samsung Galaxy S24 | `360 × 800` | 3 | Tab bar clipping, filter inputs, pill badges |
| **M (Standard iOS)** | iPhone 14 / 15 / 16 Pro | `390–393 × 844–852` | 3 | User-reported screenshot viewport: header pill overflow, tab bar cut-off, hero H1 clip |
| **L (Large Phone)** | iPhone Pro Max / Pixel Pro XL | `412–430 × 915–932` | 3 | Modal height (`dvh`), bottom consent banner overlap |
| **Tablet Portrait** | iPad Mini / iPad | `768 × 1024` | 2 | Transition breakpoint (`md:`) between collapsible mobile menu and inline desktop bar |

---

## 2. Deep Research: Mobile UX & Technical Validation Pillars

### Pillar 1 — Collapsible Navigation (Zero Clipping)
- **Top Sticky Header (`<header>`):**
  - On `< md` (`< 768px`), keep ONLY brand logo + primary title (`பெயர்ச்சோலை`) on the left and a single **44×44px collapsible menu trigger (`☰ பட்டியல்` / `✕ மூடு`)** on the right.
  - All secondary navigation links (`Why Peyarcholai`, `User Guide & Docs`, `SubscriptionStatusPill`, `100% Provenance`) live inside a collapsible drawer (`id="mobile-header-drawer"`, `aria-expanded`, `aria-controls`).
  - Drawer must auto-close on route change (`usePathname()`), backdrop tap, and `Escape` key press.
- **Primary Dashboard Section Menu (`<nav aria-label="Primary sections">`):**
  - Horizontal scrollable pill strips (`overflow-x-auto`) clip adjacent labels mid-word (e.g., `"Birth Star Finder நட்சத்திரக் கணிப்..."` on `393×852`) and hide 6 of 8 sections off-screen.
  - **Mobile Pattern (`< md`):** Render a **collapsible accordion menu button** displaying the currently active section (icon + English/Tamil title + badge + chevron `▾`/`▴`). Tapping expands a full-width vertical list of all 8 sections + User Guide, and selecting any item switches tab and auto-collapses the drawer.
  - **Desktop Pattern (`md+`):** Preserve the wrapping horizontal pill bar unchanged.

### Pillar 2 — Reflow & Zero Horizontal Overflow (WCAG 2.2 SC 1.4.10)
- `html, body { max-width: 100%; overflow-x: hidden; }`
- Every flex row holding text + badges MUST have `min-w-0` on the text container and `flex-wrap` where items can exceed `320px`.
- Every `<table>` MUST be wrapped in `<div className="overflow-x-auto">` so wide comparison matrices scroll internally without breaking page width.
- Never apply `min-w-[320px]+` unconditionally; scope to `lg:min-w-[320px]`.
- Action buttons with short Tamil phrases + arrows (e.g., `"வாக்கெடுப்பு →"`) MUST use `whitespace-nowrap shrink-0` so the arrow never orphans onto a second line.

### Pillar 3 — Touch Targets & Tap Ergonomics (WCAG 2.5.8 / Apple HIG / Material 3)
- Interactive controls (hamburger button, collapsible menu trigger, menu drawer links, primary CTAs, modal close `✕`) MUST meet **`>= 44px` height** (`min-h-[44px]`) and adequate spacing (`gap-2` / `8px`+) to prevent accidental adjacent taps.
- `touch-action: manipulation;` applied on `button, a, select, input` to eliminate the 300ms double-tap zoom delay.

### Pillar 4 — iOS Safari Input Auto-Zoom Prevention
- **Critical iOS Behavior:** Safari automatically zooms the viewport whenever an `<input>`, `<select>`, or `<textarea>` with computed `font-size < 16px` receives focus, breaking layout alignment until the user manually pinches out.
- **Mitigation:** Enforce `@media (max-width: 767px) { input, select, textarea { font-size: 16px !important; } }` in `globals.css` (and `text-base sm:text-sm` on form controls).

### Pillar 5 — Tamil Unicode Typography & Script Wrapping
- Tamil agglutinative compounds (e.g., `பெயர்ச்சோலை`, `நட்சத்திரக் கணிப்பு`, `குடும்ப வாக்கெடுப்பு`) are wider than Latin equivalents and have tall ascenders/descenders (`ு`, `ூ`, `ை`, `ோ`).
- Headings on mobile MUST scale down (`text-2xl sm:text-5xl` for hero H1) with `leading-tight break-words` so glyphs never clip horizontally or vertically.

### Pillar 6 — Modals, Overlays & Dynamic Viewport Height (`dvh`)
- On mobile browsers, `100vh` ignores the collapsible address bar; modals MUST use `max-h-[90dvh] overflow-y-auto` and `p-2 sm:p-4` so close buttons and submit CTAs remain reachable above the soft keyboard and home indicator.
- Bottom-fixed banners (e.g., DPDP consent banner) must not permanently obscure primary CTAs; keep compact with clear dismiss action.

---

## 3. Automated & Manual Validation Gates

| Gate ID | Category | Verification Method | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **MOB-01** | Viewport Meta | `layout.tsx` `Viewport` export + automated test | `width: "device-width"`, `initialScale: 1`, `maximumScale: 5` |
| **MOB-02** | Collapsible Header | `MobileHeaderNav.tsx` + DOM/HTML test | Hamburger trigger (`aria-expanded`, `aria-controls="mobile-header-drawer"`, `min-h-[44px]`), desktop inline nav hidden `< md` |
| **MOB-03** | Collapsible Section Menu | `NamingGuruDashboard.tsx` + DOM/HTML test | Mobile accordion toggle (`aria-expanded`, `aria-controls="mobile-section-menu"`, `min-h-[48px]`), auto-closes on tab select |
| **MOB-04** | Zero Horizontal Overflow | Static scan + `mobile-ui.test.ts` | No unguarded `min-w-[320px]+`, all `<table>` wrapped in `overflow-x-auto`, `overflow-x-hidden` on `body` |
| **MOB-05** | iOS Input Zoom Guard | `globals.css` assertion in `mobile-ui.test.ts` | `@media (max-width: 767px)` sets `font-size: 16px` on `input, select, textarea` |
| **MOB-06** | Hero & Button Wrapping | HTML/TSX assertion + screenshot review | Hero H1 `text-2xl sm:text-5xl`, CTA `"வாக்கெடுப்பு →"` uses `whitespace-nowrap shrink-0` |
| **MOB-07** | Build & Unit Suite | `npm test` + `npm run build` | 100% unit tests passing (`0` failed), `next build` exits `0` (`116/116` pages) |
| **MOB-08** | Live Route Sanity | Local (`127.0.0.1:3020`) & Prod (`peyar.donorconnect.in`) HTTP checks | HTTP `200` across `/`, `/name/yazhini`, `/why-peyarcholai`, `/docs`, `/guide`, `/p/sample-tamil-poll`, `/api/names`, `/api/survey` + collapsible menu markup present |

---

## 4. Tracking Files in This Directory
- [`00-Mobile-Testing-Master-Plan.md`](./00-Mobile-Testing-Master-Plan.md) — Standards, viewport matrix, and validation gates (this file).
- [`01-Mobile-Audit-Findings-and-Fixes.md`](./01-Mobile-Audit-Findings-and-Fixes.md) — Complete issue register with exact files, root causes, and fix commits.
- [`02-Mobile-Validation-Log.md`](./02-Mobile-Validation-Log.md) — Chronological test execution & production deployment verification logs.
