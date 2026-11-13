import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateDualNumerology } from "../core/numerology";
import { filterTamilNames, getAllTamilNames, getNameBySlug, getSeedNames } from "./repository";

describe("Dual numerology (D1)", () => {
  it("computes both methods with per-letter values for Yazhini", () => {
    const d = calculateDualNumerology("Yazhini");
    assert.equal(d.defaultMethod, "Pythagorean (Standard A-Z 1-9)");
    assert.equal(d.pythagorean.total, 47);
    assert.equal(d.pythagorean.singleDigit, 2);
    assert.equal(d.chaldean.total, 21);
    assert.equal(d.chaldean.singleDigit, 3);
    assert.equal(d.pythagorean.letterValues.length, 7);
    assert.equal(
      d.pythagorean.letterValues.reduce((s, l) => s + l.val, 0),
      d.pythagorean.total
    );
    assert.equal(
      d.chaldean.letterValues.reduce((s, l) => s + l.val, 0),
      d.chaldean.total
    );
  });

  it("is deterministic and ignores case and spaces", () => {
    assert.deepEqual(calculateDualNumerology("kavin"), calculateDualNumerology("KAVIN"));
  });
});

describe("Catalog data validation (D2)", () => {
  const all = getSeedNames(); // shards only; user-submitted names are validated separately
  const nonTamil = /[A-Za-z]/;

  it("has at least 10,000 names with unique slugs and Tamil names", () => {
    assert.ok(all.length >= 10000, `only ${all.length} names`);
    assert.equal(new Set(all.map((n) => n.slug)).size, all.length);
    assert.equal(new Set(all.map((n) => n.nameTamil)).size, all.length);
  });

  it("keeps nameTamil in Tamil script only", () => {
    assert.equal(all.filter((n) => nonTamil.test(n.nameTamil)).length, 0);
  });

  it("has all 14 dimensions on every record", () => {
    const missing = all.filter(
      (n) =>
        !n.meaningTa ||
        !n.meaningEn ||
        !n.multilingualMeanings?.length ||
        !n.structuredReference ||
        !n.culturalContext ||
        !n.easeOfCalling ||
        !n.spellingAssessment ||
        !n.uniqueness ||
        !n.trendStatus ||
        !n.nicknames ||
        !n.documentFit ||
        !n.nakshatraSlugs?.length ||
        !n.rasiTa ||
        !n.siblingPairSuggestions ||
        !["boy", "girl", "unisex"].includes(n.gender)
    );
    assert.equal(missing.length, 0, `${missing.length} incomplete, e.g. ${missing[0]?.slug}`);
  });

  it("never labels a generated compound as a direct citation or attaches irrelevant verses (A2 / CLA-01..03 / CIT-01)", () => {
    const bad = all.filter(
      (n) =>
        /^Direct (Classical|Textual)/i.test(n.structuredReference?.verificationTier || "") &&
        n.etymologyRoot?.includes("+")
    );
    assert.equal(bad.length, 0);
    // Regression test for user-reported defect: "கலைநகை" must never cite "திங்களைப் போற்றுதும்"
    const kalainagai = all.find((n) => n.slug === "kalainagai" || n.nameTamil === "கலைநகை");
    assert.ok(kalainagai, "kalainagai exists");
    assert.ok(
      !kalainagai.structuredReference?.lineTitleOrQuote?.includes("திங்களைப் போற்றுதும்"),
      "kalainagai must not cite திங்களைப் போற்றுதும்"
    );
    assert.ok(
      kalainagai.structuredReference?.citationNote?.includes("கலை") &&
        kalainagai.structuredReference?.citationNote?.includes("நகை"),
      "kalainagai reference explains both roots கலை and நகை"
    );
    assert.ok(all.every((n) => n.dataConfidence?.estimatedFields.includes("uniqueness")));
  });

  it("enforces QA Checklist v1.0 across CLA-01..03, ETY-01..03, CIT-01..03, FMT-01..03 & Sample QA Matrix", () => {
    // CLA-01 & CLA-02: Compound names must be categorized as "Modern Tamil", never "Sangam" or "Classical"
    const compoundsWithSangamOrigin = all.filter(
      (n) =>
        n.structuredReference?.citationScope === "etymological-compound" &&
        /Sangam|Classical/i.test(n.originCategory)
    );
    assert.equal(
      compoundsWithSangamOrigin.length,
      0,
      `${compoundsWithSangamOrigin.length} compounds falsely claim Sangam/Classical originCategory`
    );

    // CLA-03 & CIT-01: Compound names must never claim Silappathikaram / Purananuru or attach poem quotes
    const compoundsWithAncientQuotes = all.filter(
      (n) =>
        n.structuredReference?.citationScope === "etymological-compound" &&
        (Boolean(n.structuredReference?.lineTitleOrQuote) ||
          /Silappathikaram|சிலப்பதிகாரம்|Purananuru|புறநானூறு/i.test(n.literaryReference))
    );
    assert.equal(
      compoundsWithAncientQuotes.length,
      0,
      `${compoundsWithAncientQuotes.length} compounds still cite ancient epics/quotes`
    );

    // CIT-01: Every exact-word-in-verse record must literally contain the Tamil name/stem in lineTitleOrQuote
    const classicalRecords = all.filter(
      (n) => n.structuredReference?.citationScope === "exact-word-in-verse"
    );
    assert.ok(classicalRecords.length > 0, "at least one classical verse record exists");
    for (const c of classicalRecords) {
      const quote = c.structuredReference?.lineTitleOrQuote || "";
      const stem = c.nameTamil.replace(/[ன்ள்ர்ம்ய்வ்\u0BC1\u0BCD]$/u, "");
      const sandhiStem = c.nameTamil.replace(/ள்$/, "ட்");
      assert.ok(
        quote.includes(c.nameTamil) ||
          (stem.length >= 2 && quote.includes(stem)) ||
          (sandhiStem.length >= 2 && quote.includes(sandhiStem)),
        `CIT-01 violation on ${c.slug}: quote "${quote}" does not contain "${c.nameTamil}"`
      );
    }

    // CIT-02: Every Pure Tamil record must link to a specific DSAL headword query URL or TamilVU corpus URL
    const pureTamil = all.filter((n) => (n.nameCategory || "pure_tamil") === "pure_tamil");
    const invalidUrls = pureTamil.filter(
      (n) =>
        !n.structuredReference?.sourceWebsite?.includes("dsal.uchicago.edu/cgi-bin/app/tamil-lex_query.py") &&
        !n.structuredReference?.sourceWebsite?.includes("tamilvu.org")
    );
    assert.equal(invalidUrls.length, 0, `${invalidUrls.length} Pure Tamil records have generic/invalid URLs`);

    // ETY-03: Pure Tamil records must provide Literal Root Meaning vs Derived Meaning
    const missingEty03 = pureTamil.filter((n) => !n.literalMeaningEn || !n.derivedMeaningEn);
    assert.equal(missingEty03.length, 0, `${missingEty03.length} Pure Tamil records missing literal/derived split`);

    // Non-Pure Tamil (tamilnadu_usage & other_heritage): must capture explicit source & available meaning, never claim Sangam/Classical Tamil
    const nonPureTamil = all.filter(
      (n) => n.nameCategory === "tamilnadu_usage" || n.nameCategory === "other_heritage"
    );
    const missingSource = nonPureTamil.filter(
      (n) => !n.categoryOriginSource || !n.meaningEn || !n.meaningTa || !n.structuredReference?.sourceWebsite
    );
    assert.equal(missingSource.length, 0, `${missingSource.length} non-pure Tamil records missing source or meaning`);
    const falseSangamClaim = nonPureTamil.filter((n) => /Sangam|Classical Tamil/i.test(n.originCategory));
    assert.equal(falseSangamClaim.length, 0, `${falseSangamClaim.length} non-pure Tamil records falsely claim Sangam/Classical Tamil`);

    // Sample QA Assessment Matrix Row 1: Kalaevani / Kalaivani (கலைவாணி)
    const kalaivani = getNameBySlug("kalaevani") || getNameBySlug("kalaivani");
    assert.ok(kalaivani, "Kalaevani / Kalaivani resolves via FMT-02 alias lookup");
    assert.equal(kalaivani.nameTamil, "கலைவாணி");
    assert.equal(kalaivani.originCategory, "Modern Tamil");
    assert.ok(
      !/Sangam/i.test(kalaivani.literaryReference),
      "Kalaivani must not claim Source: Sangam Literature"
    );
    assert.ok(
      /Modern Synthesis/i.test(kalaivani.verificationStatus),
      "Kalaivani must carry Modern Synthesis status"
    );

    // Sample QA Assessment Matrix Row 2: Kuralarasi (குறளரசி)
    const kuralarasi = getNameBySlug("kuralarasi");
    assert.ok(kuralarasi, "Kuralarasi exists");
    assert.equal(kuralarasi.nameTamil, "குறளரசி");
    assert.equal(kuralarasi.originCategory, "Modern Tamil");
    assert.ok(
      !/Silappathikaram|சிலப்பதிகாரம்/i.test(kuralarasi.literaryReference) &&
        !/Silappathikaram|சிலப்பதிகாரம்/i.test(kuralarasi.structuredReference?.workEn || ""),
      "Kuralarasi must NOT cite Silappathikaram"
    );

    // Sample QA Assessment Matrix Row 3: Kannagi (கண்ணகி)
    const kannagi = getNameBySlug("kannagi");
    assert.ok(kannagi, "Kannagi exists");
    assert.equal(kannagi.nameTamil, "கண்ணகி");
    assert.equal(kannagi.originCategory, "Classical / Sangam Tamil");
    assert.equal(kannagi.structuredReference?.citationScope, "exact-word-in-verse");
    assert.ok(
      /Silappathikaram/i.test(kannagi.structuredReference?.workEn || "") &&
        kannagi.structuredReference?.lineTitleOrQuote?.includes("கண்ணகி"),
      "Kannagi has valid classical Silappathikaram citation"
    );
  });

  it("has valid, natural meanings with zero Devanagari impurities or mechanical 'combined with' boilerplate", () => {
    const devanagari = /[\u0900-\u097F]/;
    const badScript = all.filter(
      (n) => devanagari.test(n.meaningEn) || devanagari.test(n.etymologyRoot || "")
    );
    assert.equal(badScript.length, 0, `${badScript.length} records have Devanagari in meaningEn/etymologyRoot`);
    const mechanical = all.filter((n) => /combined with/i.test(n.meaningEn));
    assert.equal(mechanical.length, 0, `${mechanical.length} records still have mechanical 'combined with' meaningEn`);
    const missingWebsite = all.filter((n) => !n.structuredReference?.sourceWebsite);
    assert.equal(missingWebsite.length, 0, `${missingWebsite.length} records missing sourceWebsite`);
  });

  it("does not claim verification that has not happened (A2)", () => {
    const bad = all.filter((n) => /Verified/i.test(n.verificationStatus) && !/Human/i.test(n.verificationStatus));
    assert.equal(bad.length, 0);
  });

  it("enforces >= 80% (0.80) confidence gate to author valid citations", () => {
    const below80 = all.filter((n) => (n.confidence ?? 0) < 0.8);
    assert.equal(below80.length, 0, `${below80.length} active catalog records have confidence < 0.80`);
    const missingCitation = all.filter((n) => !n.structuredReference || !n.structuredReference.sourceWebsite);
    assert.equal(missingCitation.length, 0, `${missingCitation.length} active records missing authored citation`);
  });
});

describe("Repository filters", () => {
  it("filters by gender, ease score, misspell risk, and slugs", () => {
    const girls = filterTamilNames({ gender: "girl" });
    assert.ok(girls.length > 0);
    assert.ok(girls.every((n) => n.gender === "girl" || n.gender === "unisex"));
    const easy = filterTamilNames({ minEaseScore: 90 });
    assert.ok(easy.every((n) => (n.easeOfCalling?.overallScore ?? 0) >= 90));
    const low = filterTamilNames({ maxMisspellRisk: "low" });
    assert.ok(low.every((n) => n.spellingAssessment?.riskLevel === "Low"));
    const bySlugs = filterTamilNames({ slugs: ["yazhini", "kavin", "iniya"] });
    assert.equal(bySlugs.length, 3);
  });

  it("finds a name by slug and returns undefined for unknown", () => {
    const first = getAllTamilNames()[0];
    assert.equal(getNameBySlug(first.slug)?.slug, first.slug);
    assert.equal(getNameBySlug("no-such-name-xyz"), undefined);
  });

  it("filters search quickly over the full catalog (SS-03 smoke)", () => {
    const t = performance.now();
    filterTamilNames({ q: "mathi", religion: "hindu" });
    assert.ok(performance.now() - t < 200);
  });
});
