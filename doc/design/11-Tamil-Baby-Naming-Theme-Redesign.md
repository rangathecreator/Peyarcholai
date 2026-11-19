# Design 11: Parent-Friendly Tamil Baby Naming Theme Redesign (Task 40)

**Date:** 2026-11-19  
**Branch:** `dev19Nov2026`  
**Owner:** Peyarcholai (பெயர்ச்சோலை)  
**Target Audience:** Expectant & new Tamil parents, grandparents, and diaspora families naming a newborn baby.

---

## 1. Why Redefine the Current Theme?

The existing hero section (`#180510` → `#3d0d27` dark wine/burgundy) looks sleek for a fintech/analytics app, but feels **too dark and heavy** for a joyful Tamil baby-naming celebration (*Peyar Soottu Vizha* / பெயர் சூட்டு விழா). Parents naming a newborn respond strongly to:
1. **Auspicious Tamil Cultural Warmth:** *Manjal* (Turmeric Gold `#D97706` / `#F59E0B`), *Kungumam / Lotus Coral* (`#E11D48` / `#FB7185`), *Mayil / Peacock Teal* (`#0D9488` / `#0F766E`), and *Karpooram / Silk Ivory* (`#FFFDF7` / `#FEF7E6`).
2. **Gentle Newborn & Nursery Joy:** Soft sunlit pastel washes, subtle **Kolam (கோலம்)** geometric dot-pattern watermark, floating golden starlight / baby-cradle (*விண்மீன் தொட்டில்*) motif, and rounded, huggable card corners (`rounded-3xl`).
3. **High Legibility & WCAG AA/AAA Contrast:** Deep *Karuvelam / Espresso Ink* (`#291B12`) on warm ivory cards, and crisp `#FFFBEB` / `#FFFFFF` text on rich *Temple Saffron-Teal-Indigo Twilight* or *Warm Sunlit Mangala* hero surfaces.

---

## 2. New "Mangala Thottil" (மங்களத் தொட்டில் — Auspicious Cradle) Color System

| Token | Cultural Name | Hex / Tailwind | Usage | Contrast |
| :--- | :--- | :--- | :--- | :--- |
| `--pc-canvas` | *Pattu Ivory* (பட்டு வெண்மை) | `#FFFBF2` | Page background with subtle warm radial sunrise + delicate kolam dot pattern | Primary surface |
| `--pc-hero-bg` | *Mayil-Manjal Twilight* (மயில்-மஞ்சள் வானம்) | Gradient: `#134E4A` (Peacock Deep Teal) → `#1E3A5F` (Celestial Cradle Blue) → `#7C2D12` (Warm Temple Terracotta) with soft golden-turmeric (`rgba(251,191,36,0.22)`) & lotus-pink (`rgba(251,113,133,0.16)`) glow | Hero banner: joyful, celestial baby-cradle feel — warm & welcoming instead of gloomy dark burgundy | `>= 10.5:1` with white/cream text (AAA) |
| `--pc-accent-gold` | *Manjal* (மஞ்சள் பொன்) | `#D97706` / `#FEF3C7` | Primary highlights, auspicious badges, active tabs | `>= 7:1` with `#451A03` |
| `--pc-accent-lotus` | *Thamarai* (தாமரை) | `#E11D48` / `#FFE4E6` | Girl name accents, heart/love poll badges, warm family touches | `>= 5.8:1` |
| `--pc-accent-peacock` | *Mayil* (மயில் நீலம்) | `#0F766E` / `#CCFBF1` | Boy/unisex accents, verified provenance pills, primary CTAs (`வாக்கெடுப்பு →`) | `>= 6.2:1` |
| `--pc-ink` | *Eluthu Ink* (எழுத்து மை) | `#291B12` | Primary Tamil & English body copy | `>= 13:1` (AAA) |

---

## 3. Visual & Cultural Motifs (Zero-Image-Weight Pure CSS/SVG)
1. **Subtle Kolam Dot Background (`.bg-tamil-kolam`):** Lightweight CSS `radial-gradient` warm golden dot grid (`opacity: 0.35`, `0` network bytes, zero LCP impact) on the page canvas.
2. **Auspicious Hero Banner (`.bg-peyarcholai-hero`):** Warm Peacock-Teal → Celestial-Cradle-Indigo → Sunlit-Saffron gradient with soft glowing nursery stars and a gentle SVG lotus/cradle accent wave at the bottom edge.
3. **Header Warmth:** Soft silk-ivory header (`bg-[#fffdf8]/95 border-amber-200/80`) with a thin top **Mangala Ribbon** (`h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-teal-500`) — instantly evoking a festive Tamil naming ceremony!
4. **Gender-Friendly Soft Card Tints:** Subtle warm rose border tint for girl cards, serene peacock-teal tint for boy cards, and sunlit amber tint for unisex cards — making browsing intuitive for parents at a glance.

---

## 4. Implementation Scope (Iteration `2026-11-19-01`)
1. `app/src/app/globals.css`: Update `.bg-peyarcholai-hero`, add `.bg-tamil-kolam`, warm silk-ivory canvas `#fffbf2`, and soft festive glass card styles.
2. `app/src/app/layout.tsx`: Add the festive 1px/3px *Mangala* gradient top ribbon (`from-amber-400 via-rose-400 to-teal-500`) and warm `.bg-tamil-kolam` body surface.
3. `app/src/components/MobileHeaderNav.tsx` & `app/src/components/NamingGuruDashboard.tsx`: Align mobile collapsible menu button, active section accordion (`bg-teal-900` / `bg-amber-800` warm contrast), and hero badges with the *Mangala Thottil* palette.
4. Add theme regression checks to `app/src/lib/mobile-ui.test.ts` ensuring `.bg-tamil-kolam` and warm accessible palette tokens remain intact.
