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

  it("MOB-07: dashboard collapses secondary filters on mobile (< md) and uses dvh + ARIA dialogs on modals", () => {
    const dashboard = readSrc("components/NamingGuruDashboard.tsx");

    assert.match(dashboard, /const \[mobileFiltersOpen, setMobileFiltersOpen\] = useState\(false\)/);
    assert.match(dashboard, /aria-controls="mobile-extra-filters"/);
    assert.match(dashboard, /max-h-\[90dvh\]/);
    assert.match(dashboard, /role="dialog"/);
    assert.match(dashboard, /aria-modal="true"/);
  });

  it("MOB-08: Mangala Thottil Tamil baby-naming theme classes and top ribbon are wired", () => {
    const css = readSrc("app/globals.css");
    const layout = readSrc("app/layout.tsx");

    assert.match(css, /\.bg-tamil-kolam/);
    assert.match(layout, /bg-tamil-kolam/);
    assert.match(layout, /from-amber-400 via-rose-400 to-teal-500/);
  });

  it("SS-Q1: Six Sigma security & data integrity gates (download-pdf escapeHtml, family-booklet Katapayadi, error/not-found/SEO)", () => {
    const pdf = readSrc("app/api/reports/download-pdf/route.ts");
    const booklet = readSrc("app/api/reports/family-booklet/route.ts");
    const namePage = readSrc("app/name/[slug]/page.tsx");

    assert.match(pdf, /function escapeHtml\(/);
    assert.match(pdf, /escapeHtml\(nameRecord\.nameTamil\)/);
    assert.match(booklet, /kata\.single/);
    assert.doesNotMatch(booklet, /Katapayadi:\s*<strong>\$\{kata\}<\/strong>/);
    assert.match(namePage, /export async function generateMetadata\(/);
    assert.match(namePage, /export const revalidate = 86400/);
    assert.equal(fs.existsSync(path.join(SRC_DIR, "app/error.tsx")), true);
    assert.equal(fs.existsSync(path.join(SRC_DIR, "app/not-found.tsx")), true);
    assert.equal(fs.existsSync(path.join(SRC_DIR, "app/robots.ts")), true);
    assert.equal(fs.existsSync(path.join(SRC_DIR, "app/sitemap.ts")), true);
  });

  it("SS-Q2: API resilience, caching & timeout guardrails (React.cache on poll SSR, survey Cache-Control, omniroute 8s cap, no raw vote err.message)", () => {
    const pollPage = readSrc("app/p/[inviteToken]/page.tsx");
    const surveyApi = readSrc("app/api/survey/route.ts");
    const voteApi = readSrc("app/api/polls/[inviteToken]/vote/route.ts");
    const omni = readSrc("lib/omniroute.ts");

    assert.match(pollPage, /const loadPoll = cache\(/);
    assert.match(surveyApi, /s-maxage=60/);
    assert.doesNotMatch(voteApi, /err\.message/);
    assert.match(omni, /AbortSignal\.timeout\(8000\)/);
  });

  it("SS-Q3: zero raw err.message leaks across public API routes & CLS=0 explicit dimensions on logos", () => {
    for (const rel of [
      "app/api/advisor/route.ts",
      "app/api/suggestions/route.ts",
      "app/api/polls/route.ts",
      "app/api/polls/[inviteToken]/vote/route.ts",
    ]) {
      assert.doesNotMatch(readSrc(rel), /err\.message/, `${rel} must not leak raw err.message`);
    }
    assert.match(readSrc("app/layout.tsx"), /width=\{44\}/);
    assert.match(readSrc("components/NamingGuruDashboard.tsx"), /width=\{64\}/);
    assert.match(readSrc("app/docs/page.tsx"), /width=\{64\}/);
  });

  it("MOB-10 & SS-Q4: /docs badges use shrink-0, Name Card/Pagination meet 44px touch targets, /api/metrics requires METRICS_TOKEN in prod", () => {
    const docs = readSrc("app/docs/page.tsx");
    const dashboard = readSrc("components/NamingGuruDashboard.tsx");
    const metrics = readSrc("app/api/metrics/route.ts");

    assert.match(docs, /h-8 w-8 shrink-0/);
    assert.match(docs, /min-h-\[44px\] items-center gap-1\.5/);
    assert.match(dashboard, /aria-label="Pagination"/);
    assert.match(dashboard, /min-h-\[44px\] rounded-xl border border-stone-300/);
    assert.match(metrics, /METRICS_TOKEN/);
    assert.match(metrics, /status:\s*401/);
  });

  it("MOB-11: PronunciationButton & why-peyarcholai CTAs meet mobile touch targets and unused 1.94MB logo-master.png is removed", () => {
    const pron = readSrc("components/PronunciationButton.tsx");
    const why = readSrc("app/why-peyarcholai/page.tsx");

    assert.match(pron, /min-h-\[40px\]/);
    assert.match(why, /min-h-\[44px\] w-full sm:w-auto/);
    assert.equal(fs.existsSync(path.join(process.cwd(), "public", "logo-master.png")), false);
  });

  it("LEG-01 & B-15: legal pages (/terms, /privacy, /refund-policy, /contact) & Task 32 free teaser mode are wired cleanly", () => {
    const terms = readSrc("app/terms/page.tsx");
    const privacy = readSrc("app/privacy/page.tsx");
    const refund = readSrc("app/refund-policy/page.tsx");
    const contact = readSrc("app/contact/page.tsx");
    const layout = readSrc("app/layout.tsx");
    const dashboard = readSrc("components/NamingGuruDashboard.tsx");

    for (const doc of [terms, privacy, refund, contact]) {
      assert.match(doc, /Saranya Mohan/);
      assert.match(doc, /Namakkal/);
      assert.match(doc, /support@names\.iniya\.in/);
    }
    assert.doesNotMatch(terms, /\bGST\b/, "B-03: Do not mention GST unnecessarily in terms copy");
    assert.match(terms, /Applicable taxes/);
    assert.match(refund, /7 calendar days/);
    assert.match(layout, /href="\/terms"/);
    assert.match(layout, /href="\/privacy"/);
    assert.match(layout, /href="\/refund-policy"/);
    assert.match(layout, /href="\/contact"/);
    assert.match(dashboard, /Free Teaser · ₹499 Full/);
  });

  it("B-16 Option 4 Hybrid: >= 100 Grade B Tamil cohort priors wired + ClassroomSurveyWidget mounted on /name/[slug]", async () => {
    const { calculateEmpiricalRarity, getGradeBCorpusCount } = await import("./frequency-engine");
    assert.ok(getGradeBCorpusCount() >= 100, `Expected >= 100 Grade B names, got ${getGradeBCorpusCount()}`);

    const yazhini = calculateEmpiricalRarity("யாழினி", "moderate", { nameLatin: "Yazhini" });
    assert.equal(yazhini.band.grade, "B");
    assert.match(yazhini.classroomDisplayEn, /Grade B/);

    const rareCustom = calculateEmpiricalRarity("தேன்மலர்", undefined, { nameLatin: "UnlistedSyntheticNameXYZ" });
    assert.equal(rareCustom.band.grade, "C");

    const namePage = readSrc("app/name/[slug]/page.tsx");
    assert.match(namePage, /<ClassroomSurveyWidget/);
  });
});
