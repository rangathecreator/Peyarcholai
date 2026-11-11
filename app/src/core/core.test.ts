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
