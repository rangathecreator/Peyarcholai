import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateNumerology,
  calculateBirthNumbers,
  evaluateCompatibility,
  suggestSpellingVariants,
  transliterateTamilToLatin,
} from "./numerology";
import {
  TAMIL_NAKSHATRAS,
  calculateBirthStarFromDateTime,
  getNakshatraBySlug,
} from "./nakshatra-tamil";
import { countTamilAksharas, evaluateNameScorecard } from "./scorecard";

describe("Numerology Engine", () => {
  it("computes Chaldean and Pythagorean values deterministically", () => {
    const chaldean = calculateNumerology("Kavin", "chaldean");
    // K(2) + A(1) + V(6) + I(1) + N(5) = 15 -> 6
    assert.equal(chaldean.compoundNumber, 15);
    assert.equal(chaldean.nameNumber, 6);
    assert.ok(chaldean.planet.planetEn.includes("Venus"));

    const pythagorean = calculateNumerology("Kavin", "pythagorean");
    // K(2) + A(1) + V(4) + I(9) + N(5) = 21 -> 3
    assert.equal(pythagorean.compoundNumber, 21);
    assert.equal(pythagorean.nameNumber, 3);
  });

  it("transliterates Tamil script input for numerology", () => {
    const latin = transliterateTamilToLatin("கவின்");
    assert.ok(latin.length > 0);
    const res = calculateNumerology("இனியா", "chaldean");
    assert.ok(res.nameNumber >= 1 && res.nameNumber <= 9);
  });

  it("computes birth numbers and compatibility", () => {
    const birth = calculateBirthNumbers("2026-07-15");
    assert.equal(birth.mulank, 6); // 1+5 = 6
    assert.equal(birth.bhagyank, 5); // 2+0+2+6+0+7+1+5 = 23 -> 5
    const compat5 = evaluateCompatibility(5, birth);
    assert.equal(compat5.rating, "Excellent");
  });

  it("generates phonetic spelling variants hitting a target number (including Tamil script input)", () => {
    const variants = suggestSpellingVariants("Aarav", 5, "chaldean");
    for (const v of variants) {
      assert.equal(v.nameNumber, 5);
    }
    const tamilVariants = suggestSpellingVariants("கவின்", 6, "chaldean");
    assert.ok(tamilVariants.length > 0, "should transliterate Tamil script and generate spelling variants");
    for (const v of tamilVariants) {
      assert.equal(v.nameNumber, 6);
    }
  });

  it("identifies Pythagorean Master Numbers (11, 22, 33)", () => {
    // Check master number identification
    const res11 = calculateNumerology("Kavita", "pythagorean");
    // K(2)+A(1)+V(4)+I(9)+T(2)+A(1) = 19 -> 1
    // Let's test a word that compounds to 11 in Pythagorean, e.g. "Cac" (3+1+3=7) or "Cab" (3+1+2=6)
    // "Al" -> A(1) + L(3) = 4
    // "K" (2) + "I" (9) = 11!
    const resKi = calculateNumerology("Ki", "pythagorean");
    assert.equal(resKi.compoundNumber, 11);
    assert.equal(resKi.isMasterNumber, true);
    assert.ok(resKi.masterNumberTitleEn?.includes("Master Number 11"));
    assert.ok(resKi.masterNumberTitleTa?.includes("மகா எண் 11"));
  });

  it("calculates classical Katapayadi native Tamil cipher", () => {
    // "கவின்" -> க(1) + வ(4) + ன(8)
    const res = calculateNumerology("கவின்", "katapayadi");
    assert.equal(res.system, "katapayadi");
    assert.ok(res.compoundNumber > 0);
    assert.ok(res.nameNumber >= 1 && res.nameNumber <= 9);
    assert.ok(res.planet.milestoneYears.length > 0);
    assert.ok(res.planet.favorableCareersTa.length > 0);
  });

  it("provides comprehensive compound number interpretations (10 to 75)", () => {
    const res10 = calculateNumerology("Aj", "chaldean"); // 1+1=2 (just checking compound info lookup)
    const res24 = calculateNumerology("Yazhini", "chaldean");
    assert.ok(res24.compoundNumber >= 10);
    assert.ok(res24.compoundInfo !== undefined);
    assert.ok(res24.compoundInfo?.titleTa.length > 0);
    assert.ok(res24.compoundInfo?.summaryEn.length > 0);
  });
});

describe("Tamil Nakshatra & Horoscope Engine", () => {
  it("contains all 27 Tamil Natchathirams with 4 Padams each", () => {
    assert.equal(TAMIL_NAKSHATRAS.length, 27);
    for (const star of TAMIL_NAKSHATRAS) {
      assert.equal(star.padamSyllablesLatin.length, 4);
      assert.equal(star.padamSyllablesTamil.length, 4);
    }
  });

  it("calculates sidereal Moon longitude and Nakshatra from date/time", () => {
    const res = calculateBirthStarFromDateTime("2026-11-09", "09:00", 5.5);
    assert.ok(res.nakshatra.index >= 1 && res.nakshatra.index <= 27);
    assert.ok([1, 2, 3, 4].includes(res.padam));
    assert.ok(res.recommendedSyllableTamil.length > 0);
  });

  it("looks up Nakshatra by slug or Tamil name", () => {
    const rohini = getNakshatraBySlug("rohini");
    assert.equal(rohini?.nameTa, "ரோகிணி");
  });
});

describe("7-Dimension Name Scorecard", () => {
  it("counts Tamil aksharas accurately", () => {
    // தமிழ் = த (1) + மி (1) + ழ் (1) = 3 aksharas
    assert.equal(countTamilAksharas("தமிழ்"), 3);
    // கவின் = க (1) + வி (1) + ன் (1) = 3 aksharas
    assert.equal(countTamilAksharas("கவின்"), 3);
  });

  it("produces a 7-dimension scorecard with overall score", () => {
    const card = evaluateNameScorecard({
      nameLatin: "Yazhini",
      nameTamil: "யாழினி",
      meaningEn: "Sweet melody of the ancient Tamil Yazh harp",
      meaningTa: "யாழ் என்னும் இசைக்கருவியைப் போன்ற இனிமையானவள்",
      originCategory: "Sangam Tamil",
      literaryReference: "Purananuru & Silappathikaram",
      confidence: 0.96,
      popularityRank: "moderate",
      family: { siblingNames: ["Kavin"] },
    });
    assert.equal(card.dimensions.length, 7);
    assert.ok(card.overallScore > 75);
    assert.equal(card.tamilAksharaCount, 3);
  });
});
