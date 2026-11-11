/**
 * 7-Dimension Name Evaluation Engine (per doc/03-Name-Evaluation-Engine.md)
 * Evaluates a candidate Tamil name across:
 * 1. Ease of pronunciation (Tamil native + Pan-India/Global)
 * 2. Character & Akshara count (Unicode Tamil grapheme clusters)
 * 3. Meaning depth & verification confidence
 * 4. Historical / Sangam / Literary reference
 * 5. Family match (Parent & Sibling harmony)
 * 6. Misspelling risk & spelling variants
 * 7. Uniqueness band
 */

import { calculateNumerology } from "./numerology";

export interface FamilyContextInput {
  fatherName?: string;
  motherName?: string;
  siblingNames?: string[];
  surnameOrInitial?: string;
}

export interface ScorecardDimension {
  key: string;
  labelEn: string;
  labelTa: string;
  score: number; // 0-100
  badge: string;
  detailEn: string;
  detailTa: string;
}

export interface NameScorecardResult {
  overallScore: number;
  latinLength: number;
  tamilAksharaCount: number;
  syllables: string[];
  misspellingRisk: "Low" | "Medium" | "High";
  spellingVariants: string[];
  uniquenessBand: "Rare Gem" | "Moderately Popular" | "Classic Popular";
  dimensions: ScorecardDimension[];
  familyIssues: string[];
}

/**
 * Count true Tamil aksharas (grapheme clusters) rather than raw UTF-16 code units.
 * Dependent vowel signs (matras) and pulli (்) attach to the preceding consonant.
 */
export function countTamilAksharas(tamilText: string): number {
  if (!tamilText) return 0;
  const clean = tamilText.trim().replace(/\s+/g, "");
  // Tamil dependent vowel signs + pulli + aytham modifier range
  const dependentMarks = new Set([
    "ா", "ி", "ீ", "ு", "ூ", "ெ", "ே", "ை", "ொ", "ோ", "ௌ", "்", "ௗ",
  ]);
  let count = 0;
  for (const ch of Array.from(clean)) {
    if (!dependentMarks.has(ch)) {
      count++;
    }
  }
  return count;
}

/**
 * Split Latin name into readable phonetic syllables
 */
export function splitIntoSyllables(latinName: string): string[] {
  const clean = latinName.trim().replace(/[^a-zA-Z]/g, "");
  if (!clean) return [];
  const regex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
  const parts = clean.match(regex);
  return parts && parts.length > 0 ? parts : [clean];
}

export function evaluateNameScorecard(params: {
  nameLatin: string;
  nameTamil: string;
  meaningEn?: string;
  meaningTa?: string;
  originCategory?: string;
  literaryReference?: string;
  confidence?: number;
  popularityRank?: "rare" | "moderate" | "popular";
  family?: FamilyContextInput;
}): NameScorecardResult {
  const {
    nameLatin,
    nameTamil,
    meaningEn = "",
    meaningTa = "",
    originCategory = "Tamil Traditional",
    literaryReference = "",
    confidence = 0.92,
    popularityRank = "moderate",
    family,
  } = params;

  const cleanLatin = nameLatin.trim();
  const latinLength = cleanLatin.replace(/\s+/g, "").length;
  const tamilAksharaCount = countTamilAksharas(nameTamil);
  const syllables = splitIntoSyllables(cleanLatin);

  // 1. Pronunciation Ease (Native Tamil vs Global)
  let pronScore = 92;
  const lower = cleanLatin.toLowerCase();
  if (lower.includes("zh")) pronScore -= 8; // Beautiful in Tamil (ழ்), slightly harder globally
  if (lower.includes("ng") || lower.includes("gn")) pronScore -= 6;
  if (syllables.length > 4) pronScore -= 10;
  if (latinLength <= 6 && syllables.length <= 3) pronScore += 4;
  pronScore = Math.max(60, Math.min(99, pronScore));

  // 2. Character & Akshara Count (Passport / Aadhaar / School Form Friendliness)
  let lengthScore = 95;
  if (latinLength > 11) lengthScore = 72;
  else if (latinLength > 8) lengthScore = 85;
  else if (latinLength < 3) lengthScore = 75;

  // 3. Meaning & Verification Confidence
  const hasBilingualMeaning = Boolean(meaningEn && meaningTa);
  const meaningScore = hasBilingualMeaning
    ? Math.round(80 + confidence * 19)
    : 70;

  // 4. Historical / Sangam / Scriptural Reference
  const hasRef = Boolean(literaryReference && literaryReference.length > 4);
  const refScore = hasRef ? 96 : 78;

  // 5. Family Harmony Check
  let familyScore = 90;
  const familyIssues: string[] = [];
  if (family?.siblingNames && family.siblingNames.length > 0) {
    const candNum = calculateNumerology(cleanLatin).nameNumber;
    for (const sib of family.siblingNames) {
      const sClean = sib.trim();
      if (!sClean) continue;
      if (sClean.toLowerCase() === lower) {
        familyScore -= 35;
        familyIssues.push(`Identical to sibling name "${sClean}".`);
      } else if (
        sClean.slice(-2).toLowerCase() === lower.slice(-2) &&
        sClean[0]?.toLowerCase() === lower[0]?.toLowerCase()
      ) {
        familyScore -= 12;
        familyIssues.push(
          `Starts and ends identically to sibling "${sClean}" (possible call-out confusion).`
        );
      } else if (sClean[0]?.toLowerCase() === lower[0]?.toLowerCase()) {
        familyScore += 4; // Matching first initial is popular in Tamil families
      }
      const sibNum = calculateNumerology(sClean).nameNumber;
      if (candNum === sibNum) {
        familyScore += 3;
      }
    }
  }
  familyScore = Math.max(50, Math.min(98, familyScore));

  // 6. Misspelling Risk & Variants
  const variants = new Set<string>([cleanLatin]);
  if (lower.includes("aa")) variants.add(cleanLatin.replace(/aa/i, "a"));
  else if (lower.includes("a")) variants.add(cleanLatin.replace(/a/i, "aa"));
  if (lower.includes("th")) variants.add(cleanLatin.replace(/th/i, "t"));
  if (lower.includes("sh")) variants.add(cleanLatin.replace(/sh/i, "s"));
  if (lower.includes("zh")) variants.add(cleanLatin.replace(/zh/i, "l"));

  const variantList = Array.from(variants).slice(0, 4);
  const misspellingRisk: "Low" | "Medium" | "High" =
    variantList.length <= 2 ? "Low" : variantList.length === 3 ? "Medium" : "High";
  const spellingScore =
    misspellingRisk === "Low" ? 94 : misspellingRisk === "Medium" ? 82 : 70;

  // 7. Uniqueness Band
  const uniquenessBand =
    popularityRank === "rare"
      ? "Rare Gem"
      : popularityRank === "popular"
      ? "Classic Popular"
      : "Moderately Popular";
  const uniquenessScore =
    popularityRank === "rare" ? 94 : popularityRank === "moderate" ? 86 : 78;

  const dimensions: ScorecardDimension[] = [
    {
      key: "pronunciation",
      labelEn: "Pronunciation Ease",
      labelTa: "உச்சரிப்பு எளிமை",
      score: pronScore,
      badge: `${syllables.join(" · ")} (${syllables.length} syllables)`,
      detailEn: lower.includes("zh")
        ? "Contains classic Tamil 'ழ' (zh) — rich in Tamil, moderate globally."
        : "Smooth phonetic flow across Tamil and international speakers.",
      detailTa: lower.includes("zh")
        ? "சிறப்பு 'ழ'கர ஓசை கொண்டது; தமிழில் இனிமையானது."
        : "தமிழ் மற்றும் பிற மொழியினரும் எளிதில் உச்சரிக்கக்கூடிய பெயர்.",
    },
    {
      key: "length",
      labelEn: "Character & Akshara Count",
      labelTa: "எழுத்து எண்ணிக்கை",
      score: lengthScore,
      badge: `${tamilAksharaCount} தமிழ் எழுத்துக்கள் · ${latinLength} Latin chars`,
      detailEn:
        latinLength <= 9
          ? "Compact length; fits Aadhaar, Passport, and school records cleanly."
          : "Slightly long; verify spacing with initials on official forms.",
      detailTa:
        latinLength <= 9
          ? "ஆதார், பாஸ்போர்ட் மற்றும் பள்ளிப் பதிவேடுகளுக்கு ஏற்ற அளவு."
          : "சற்று நீளமான பெயர்; தலைப்பெழுத்துடன் சேர்த்துச் சரிபார்க்கவும்.",
    },
    {
      key: "meaning",
      labelEn: "Meaning & AI Verification",
      labelTa: "பொருள் மற்றும் சரிபார்ப்பு",
      score: meaningScore,
      badge: `${Math.round(confidence * 100)}% Confidence`,
      detailEn: meaningEn || "Auspicious positive Tamil meaning.",
      detailTa: meaningTa || "இனிமையான தமிழ் பொருள் கொண்ட பெயர்.",
    },
    {
      key: "reference",
      labelEn: "Literary & Cultural Roots",
      labelTa: "இலக்கிய / பண்பாட்டுச் சான்று",
      score: refScore,
      badge: originCategory,
      detailEn: literaryReference || "Rooted in traditional Tamil lexicon.",
      detailTa: literaryReference || "தமிழ் மரபு மற்றும் இலக்கிய வழக்கில் உள்ள பெயர்.",
    },
    {
      key: "family",
      labelEn: "Family & Sibling Harmony",
      labelTa: "குடும்பப் பெயர் பொருத்தம்",
      score: familyScore,
      badge: familyIssues.length === 0 ? "Harmonious" : "Review Notes",
      detailEn:
        familyIssues.length === 0
          ? "Blends well with family initials and sibling phonetics."
          : familyIssues.join(" "),
      detailTa:
        familyIssues.length === 0
          ? "குடும்பத்தினர் மற்றும் உடன்பிறந்தோர் பெயர்களுடன் இனிமையாகப் பொருந்துகிறது."
          : "உடன்பிறந்தோர் பெயருடன் ஓசை ஒற்றுமை உள்ளது.",
    },
    {
      key: "spelling",
      labelEn: "Official Spelling Clarity",
      labelTa: "ஆங்கில எழுத்துத் தெளிவு",
      score: spellingScore,
      badge: `${misspellingRisk} Risk`,
      detailEn: `Recommended official spelling: ${cleanLatin}. Variants: ${variantList.join(", ")}`,
      detailTa: `பரிந்துரைக்கப்படும் ஆங்கில எழுத்து: ${cleanLatin}.`,
    },
    {
      key: "uniqueness",
      labelEn: "Uniqueness Estimate",
      labelTa: "தனித்துவ மதிப்பீடு",
      score: uniquenessScore,
      badge: uniquenessBand,
      detailEn: `Estimated as ${uniquenessBand} in the Tamil Nadu & diaspora cohort.`,
      detailTa: `தமிழ்நாடு மற்றும் புலம்பெயர் தமிழர்களிடையே '${uniquenessBand}' வகை.`,
    },
  ];

  const overallScore = Math.round(
    dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length
  );

  return {
    overallScore,
    latinLength,
    tamilAksharaCount,
    syllables,
    misspellingRisk,
    spellingVariants: variantList,
    uniquenessBand,
    dimensions,
    familyIssues,
  };
}

