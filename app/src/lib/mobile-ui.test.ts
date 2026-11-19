import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.join(process.cwd(), "src");

function readSrc(relPath: string): string {
  return fs.readFileSync(path.join(SRC_DIR, relPath), "utf8");
}

describe("Mobile View & Collapsible Menu Regression Suite (MOB-01..06)", () => {
  it("MOB-01: layout.tsx defines responsive device-width viewport and overflow-x-hidden body", () => {
    const layout = readSrc("app/layout.tsx");
    assert.match(layout, /width:\s*"device-width"/);
    assert.match(layout, /initialScale:\s*1/);
    assert.match(layout, /overflow-x-hidden/);
  });

  it("MOB-02: sticky header uses collapsible MobileHeaderNav with accessible drawer and 44px touch targets", () => {
    const layout = readSrc("app/layout.tsx");
    const headerNav = readSrc("components/MobileHeaderNav.tsx");

    assert.match(layout, /<MobileHeaderNav\s*\/>/);
    assert.match(headerNav, /aria-expanded=\{open\}/);
    assert.match(headerNav, /aria-controls="mobile-header-drawer"/);
    assert.match(headerNav, /id="mobile-header-drawer"/);
    assert.match(headerNav, /min-h-\[44px\]/);
    assert.match(headerNav, /event\.key === "Escape"/);
    assert.match(headerNav, /hidden md:flex/);
  });

  it("MOB-03: dashboard primary section nav is collapsible on mobile (< md) instead of horizontal clipping strip", () => {
    const dashboard = readSrc("components/NamingGuruDashboard.tsx");

    assert.match(dashboard, /const \[mobileNavOpen, setMobileNavOpen\] = useState\(false\)/);
    assert.match(dashboard, /aria-expanded=\{mobileNavOpen\}/);
    assert.match(dashboard, /aria-controls="mobile-section-menu"/);
    assert.match(dashboard, /id="mobile-section-menu"/);
    assert.match(dashboard, /min-h-\[48px\]/);
    assert.match(dashboard, /hidden md:flex md:flex-wrap/);
  });

  it("MOB-04: globals.css enforces horizontal overflow guard and iOS Safari 16px input zoom prevention", () => {
    const css = readSrc("app/globals.css");

    assert.match(css, /overflow-x:\s*hidden/);
    assert.match(css, /touch-action:\s*manipulation/);
    assert.match(css, /@media\s*\(max-width:\s*767px\)/);
    assert.match(css, /font-size:\s*16px/);
  });

  it("MOB-05: hero title, shortlist CTA, and search placeholder are mobile-safe and Devanagari-free", () => {
    const dashboard = readSrc("components/NamingGuruDashboard.tsx");

    assert.match(dashboard, /<h1 className="text-2xl font-extrabold tracking-tight sm:text-5xl/);
    assert.match(dashboard, /whitespace-nowrap shrink-0[^"]*"\s*>\s*வாக்கெடுப்பு →/);
    assert.doesNotMatch(dashboard, /संगम/, "Search placeholder must not contain Devanagari script");
  });

  it("MOB-06: SubscriptionStatusPill provides compact mobile label so it never overflows", () => {
    const banner = readSrc("components/MonetizationBanner.tsx");

    assert.match(banner, /hidden md:inline/);
    assert.match(banner, /md:hidden/);
  });
});
