/**
 * பெயர்ச்சோலை (Peyarcholai) — Empirical Name Frequency & Cohort Rarity Scoring Engine
 * Analyzes empirical repetition frequency within standard classroom cohorts (40 peers)
 * and state-wide student bodies (1,000 to 10,000 peers).
 */

import priors from "../data/frequency-priors.json";
import gradeBCorpus from "../data/grade-b-tamil-cohort-priors.json";

export interface GradeBPriorEntry {
  countPer10k: number;
  cohortEra: string;
  source: string;
}

const GRADE_B_MAP = gradeBCorpus.names as Record<string, GradeBPriorEntry>;

/**
 * Look up an audited Grade B external corpus prior by Roman name or slug (Design 08 Option 4 Hybrid).
 */
export function getGradeBPrior(nameLatinOrSlug?: string): GradeBPriorEntry | null {
  if (!nameLatinOrSlug) return null;
  const key = nameLatinOrSlug.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (!key) return null;
  return GRADE_B_MAP[key] || null;
}

export function getGradeBCorpusCount(): number {
  return Object.keys(GRADE_B_MAP).length;
}

export interface EmpiricalRarityContext {
  nameLatin?: string;
  nameCategory?: "pure_tamil" | "tamilnadu_usage" | "other_heritage";
  originCategory?: string;
  syllableCount?: number;
  classSize?: number;
}

export interface FrequencyBand {
  low: number;
  point: number;
  high: number;
  grade: "A" | "B" | "C";
  gradeLabelEn: string;
  gradeLabelTa: string;
}

export interface EmpiricalRarityScore {
  observedFrequencyPercent: number; // e.g. 0.015%
  cohortCountPer10k: number; // Count per 10,000 students
  band: FrequencyBand; // Design 08 §2: { low, point, high, grade }
  classroomRepetitionIndex: number; // Expected peers in a 40-student classroom
  gradeSchoolRepetitionIndex: number; // Expected peers in a 1,000-student school grade
  gradeCohortIndex: number; // Alias for gradeSchoolRepetitionIndex
  oneInClassrooms: number; // Approx. 1 peer per N classrooms (same-gender pool)
  classroomCollisionPercent: number; // % chance >= 1 of (m-1) same-gender classmates shares name
  classroomDisplayEn: string; // Human-readable band + grade display (Task 20 / Design 08)
  classroomDisplayTa: string;
  schoolDisplayCount: number; // Rounded whole-number peers per 1,000 students
  rarityBand: 'ultra_rare' | 'distinctive' | 'balanced' | 'popular';
  badgeTitleEn: string;
  badgeTitleEnglish: string; // Alias
  badgeTitleTamil: string;
  icon: string;
  descriptionEn: string;
  descriptionTamil: string;
  parentAdviceEnglish: string; // Alias
  parentAdviceTamil: string; // Alias
  methodologyNoteEn: string;
  methodologyNoteTa: string;
}

const POPULAR_TAMIL_STARTERS = new Set(["அ", "ஆ", "க", "ச", "த", "ந", "ப", "ம", "வ", "ர", "ல", "ஹ", "ஜ", "ஸ"]);
const RARE_TAMIL_STARTERS = new Set(["ழ", "ஞ", "ங", "ஒ", "ஓ", "ஔ", "ஊ", "ஈ", "ஏ", "ஐ"]);
const COMMON_SUFFIXES = ["வன்", "னி", "யா", "தி", "ரா", "ன்", "ஷ்", "ரி", "னா", "வி", "தா", "கா"];

/**
 * Estimates a deterministic, noise-free per-10,000 cohort frequency from audited priors
 * in frequency-priors.json (Design 08 §4 — zero synthetic hash jitter).
 */
function estimateCountPer10k(nameTamil: string, context?: EmpiricalRarityContext): {
  countPer10k: number;
  noteEn: string;
  noteTa: string;
} {
  const cleanTa = (nameTamil || "").trim();
  const cleanLatin = (context?.nameLatin || "").trim();
  const firstChar = [...cleanTa][0] || "";
  const charLen = cleanLatin.length > 0 ? cleanLatin.length : [...cleanTa].length * 2;
  const syllables = context?.syllableCount ?? Math.max(2, Math.round(charLen / 2.6));

  // 1. Audited cultural category & classicality prior
  let base = priors.categoryPriorsPer10k.pure_tamil_default.value;
  let catLabelEn = "Classical / Pure Tamil";
  let catLabelTa = "தூய தமிழ் மரபு";
  if (context?.nameCategory === "tamilnadu_usage") {
    base = priors.categoryPriorsPer10k.tamilnadu_usage.value;
    catLabelEn = "Tamil Nadu Contemporary / Bhakti Usage";
    catLabelTa = "தமிழ்நாட்டுப் பரவலான பயன்பாடு";
  } else if (context?.nameCategory === "other_heritage") {
    base = priors.categoryPriorsPer10k.other_heritage.value;
    catLabelEn = "Pan-Indian / Global Heritage";
    catLabelTa = "பிற மரபுப் பெயர்";
  } else if (context?.originCategory?.toLowerCase().includes("sangam") || context?.originCategory?.toLowerCase().includes("classical")) {
    base = priors.categoryPriorsPer10k.pure_tamil_sangam.value;
    catLabelEn = "Classical Sangam Root";
    catLabelTa = "சங்க இலக்கிய வேர்ச்சொல்";
  } else if (context?.originCategory?.toLowerCase().includes("modern")) {
    base = priors.categoryPriorsPer10k.pure_tamil_modern.value;
    catLabelEn = "Modern Etymological Compound";
    catLabelTa = "நவீன வேர்ச்சொல் புணர்ச்சி";
  }

  // 2. Zipfian length & syllable multiplier
  let lengthFactor = priors.lengthFactors.gt11.value;
  if (charLen <= 5) lengthFactor = priors.lengthFactors.le5.value;
  else if (charLen <= 7) lengthFactor = priors.lengthFactors.le7.value;
  else if (charLen <= 9) lengthFactor = priors.lengthFactors.le9.value;
  else if (charLen <= 11) lengthFactor = priors.lengthFactors.le11.value;

  // 3. Phonetic starter & suffix popularity
  let phoneticFactor = 1.0;
  if (POPULAR_TAMIL_STARTERS.has(firstChar)) phoneticFactor *= priors.phoneticFactors.popularStarter.value;
  else if (RARE_TAMIL_STARTERS.has(firstChar)) phoneticFactor *= priors.phoneticFactors.rareStarter.value;

  if (COMMON_SUFFIXES.some((s) => cleanTa.endsWith(s))) {
    phoneticFactor *= priors.phoneticFactors.commonSuffix.value;
  }

  const raw = base * lengthFactor * phoneticFactor;
  const countPer10k = Number(Math.max(0.3, Math.min(85, raw)).toFixed(2));

  const noteEn = `Grade C structural prior (${catLabelEn}, ~${syllables} syllables, phonetic profile '${firstChar || "-"}'; not a measured count).`;
  const noteTa = `தரம் C கட்டமைப்பு மதிப்பீடு (${catLabelTa}, ~${syllables} அசைகள், '${firstChar || "-"}' ஒலிப் பரவல்).`;
  return { countPer10k, noteEn, noteTa };
}

/**
 * Calculates empirical frequency metrics for a given name based on its popularity ranking,
 * explicit per-10k observation, or multi-factor linguistic/cultural context.
 */
export function calculateEmpiricalRarity(
  nameTamil: string,
  observedFrequencyPer10kOrRank?: number | "rare" | "moderate" | "popular",
  context?: EmpiricalRarityContext
): EmpiricalRarityScore {
  let countPer10k: number;
  let grade: "A" | "B" | "C" = "C";
  let noteEn = "Derived from observed cohort frequency ranking.";
  let noteTa = "வகுப்பறை மற்றும் கல்விப் பதிவு அதிர்வெண் அடிப்படையில் கணக்கிடப்பட்டது.";

  const gradeBMatch = getGradeBPrior(context?.nameLatin);

  if (typeof observedFrequencyPer10kOrRank === "number" && observedFrequencyPer10kOrRank > 0) {
    countPer10k = Math.max(0.1, observedFrequencyPer10kOrRank);
  } else if (gradeBMatch) {
    countPer10k = gradeBMatch.countPer10k;
    grade = "B";
    noteEn = `Grade B public corpus prior (${gradeBMatch.source}, cohort ${gradeBMatch.cohortEra}; upgrades to Grade A at >= 30 live parent responses).`;
    noteTa = `தரம் B பொதுத் தரவு மதிப்பீடு (${gradeBMatch.cohortEra} மாணவர் தொகுப்பு; 30+ பெற்றோர் பதிவுகளில் தரம் A ஆக உயரும்).`;
  } else if (observedFrequencyPer10kOrRank === "rare") {
    countPer10k = 1.2;
  } else if (observedFrequencyPer10kOrRank === "moderate") {
    countPer10k = 25;
  } else if (observedFrequencyPer10kOrRank === "popular") {
    countPer10k = 65;
  } else {
    const est = estimateCountPer10k(nameTamil, context);
    countPer10k = est.countPer10k;
    noteEn = est.noteEn;
    noteTa = est.noteTa;
  }

  const frequencyPercent = Number(((countPer10k / 10000) * 100).toFixed(4));
  const k =
    grade === "B"
      ? priors.bandWidthFactor.gradeB.value
      : priors.bandWidthFactor.gradeC.value;
  const bandLowPct = Number((frequencyPercent / k).toFixed(4));
  const bandHighPct = Number(Math.min(100, frequencyPercent * k).toFixed(4));
  const gradeLabelEn =
    grade === "B" ? "Public corpus prior (Grade B)" : "Rough guide (Grade C)";
  const gradeLabelTa =
    grade === "B" ? "பொதுத் தரவு மதிப்பீடு (தரம் B)" : "தோராய வழிகாட்டி (தரம் C)";
  const band: FrequencyBand = {
    low: bandLowPct,
    point: frequencyPercent,
    high: bandHighPct,
    grade,
    gradeLabelEn,
    gradeLabelTa,
  };

  const classSize = Math.max(2, context?.classSize ?? 40);
  const sameGenderSize = Math.max(2, Math.round(classSize * priors.genderSplitDefault.boy));
  const otherPeers = sameGenderSize - 1; // m - 1 other same-gender peers (Design 08 §4)

  const classroomRepetition = Number(((countPer10k / 10000) * sameGenderSize).toFixed(3));
  const gradeRepetition = Number(((countPer10k / 10000) * 1000).toFixed(1));
  const oneInClassrooms = Math.max(1, Math.round(10000 / (countPer10k * otherPeers)));
  const pCohort = Math.min(1, countPer10k / 10000);
  const pLow = Math.min(1, pCohort / k);
  const pHigh = Math.min(1, pCohort * k);
  const classroomCollisionPercent = Number(((1 - Math.pow(1 - pCohort, otherPeers)) * 100).toFixed(1));
  const lowCollisionPct = Number(((1 - Math.pow(1 - pLow, otherPeers)) * 100).toFixed(1));
  const highCollisionPct = Number(((1 - Math.pow(1 - pHigh, otherPeers)) * 100).toFixed(1));
  const lowClassrooms = Math.max(1, Math.round(oneInClassrooms / k));
  const highClassrooms = Math.max(lowClassrooms + 1, Math.round(oneInClassrooms * k));
  const schoolDisplayCount = Math.max(1, Math.round(gradeRepetition));

  const classroomDisplayEn =
    classroomRepetition < 0.7
      ? `About 1 in ${lowClassrooms}–${highClassrooms} classrooms (${lowCollisionPct}–${highCollisionPct}% chance) · ${gradeLabelEn}`
      : `~${Math.round(classroomRepetition)} same-gender peers per class (${lowCollisionPct}–${highCollisionPct}% chance) · ${gradeLabelEn}`;
  const classroomDisplayTa =
    classroomRepetition < 0.7
      ? `சுமார் ${lowClassrooms}–${highClassrooms} வகுப்பறைகளில் 1 (${lowCollisionPct}–${highCollisionPct}% வாய்ப்பு) · தரம் ${grade}`
      : `வகுப்பில் ~${Math.round(classroomRepetition)} சக மாணவர்கள் (${lowCollisionPct}–${highCollisionPct}%) · தரம் C`;

  const v2Fields = {
    band,
    classroomCollisionPercent,
    classroomDisplayEn,
    classroomDisplayTa,
    schoolDisplayCount,
  };

  if (frequencyPercent < 0.02) {
    const descEn = `~${schoolDisplayCount} students per 1,000 (${classroomDisplayEn}; > 99th percentile uniqueness).`;
    const descTa = `1,000 மாணவர்களில் ~${schoolDisplayCount} நபர்கள் (${classroomDisplayTa}; 99% தனித்துவம்).`;
    return {
      ...v2Fields,
      observedFrequencyPercent: frequencyPercent,
      cohortCountPer10k: countPer10k,
      classroomRepetitionIndex: classroomRepetition,
      gradeSchoolRepetitionIndex: gradeRepetition,
      gradeCohortIndex: gradeRepetition,
      oneInClassrooms,
      rarityBand: 'ultra_rare',
      badgeTitleEn: 'Ultra Rare Gem',
      badgeTitleEnglish: 'Ultra Rare Gem',
      badgeTitleTamil: 'தனித்துவப் பொக்கிஷம்',
      icon: '💎',
      descriptionEn: descEn,
      descriptionTamil: descTa,
      parentAdviceEnglish: descEn,
      parentAdviceTamil: descTa,
      methodologyNoteEn: noteEn,
      methodologyNoteTa: noteTa,
    };
  }

  if (frequencyPercent <= 0.10) {
    const descEn = `~${schoolDisplayCount} students per 1,000 (${classroomDisplayEn}). Stands out gracefully while remaining familiar.`;
    const descTa = `1,000 மாணவர்களில் ~${schoolDisplayCount} நபர்கள் (${classroomDisplayTa}). தனித்துவமும் செழுமையும் இணைந்தது.`;
    return {
      ...v2Fields,
      observedFrequencyPercent: frequencyPercent,
      cohortCountPer10k: countPer10k,
      classroomRepetitionIndex: classroomRepetition,
      gradeSchoolRepetitionIndex: gradeRepetition,
      gradeCohortIndex: gradeRepetition,
      oneInClassrooms,
      rarityBand: 'distinctive',
      badgeTitleEn: 'Distinctive Classic',
      badgeTitleEnglish: 'Distinctive Classic',
      badgeTitleTamil: 'தனித்துவச் செம்மொழிப் பெயர்',
      icon: '🌟',
      descriptionEn: descEn,
      descriptionTamil: descTa,
      parentAdviceEnglish: descEn,
      parentAdviceTamil: descTa,
      methodologyNoteEn: noteEn,
      methodologyNoteTa: noteTa,
    };
  }

  if (frequencyPercent <= 0.50) {
    const descEn = `~${schoolDisplayCount} students per 1,000 (${classroomDisplayEn}). Timeless, well-recognized, and comfortable.`;
    const descTa = `1,000 மாணவர்களில் ~${schoolDisplayCount} நபர்கள் (${classroomDisplayTa}). காலத்தால் அழியாத நிதானமான பயன்பாடு.`;
    return {
      ...v2Fields,
      observedFrequencyPercent: frequencyPercent,
      cohortCountPer10k: countPer10k,
      classroomRepetitionIndex: classroomRepetition,
      gradeSchoolRepetitionIndex: gradeRepetition,
      gradeCohortIndex: gradeRepetition,
      oneInClassrooms,
      rarityBand: 'balanced',
      badgeTitleEn: 'Balanced Classic',
      badgeTitleEnglish: 'Balanced Classic',
      badgeTitleTamil: 'மிதமான பாரம்பரியப் பயன்பாடு',
      icon: '🌿',
      descriptionEn: descEn,
      descriptionTamil: descTa,
      parentAdviceEnglish: descEn,
      parentAdviceTamil: descTa,
      methodologyNoteEn: noteEn,
      methodologyNoteTa: noteTa,
    };
  }

  const descEn = `~${schoolDisplayCount} students per 1,000 (${classroomDisplayEn}). Highly celebrated and universally beloved.`;
  const descTa = `1,000 மாணவர்களில் ~${schoolDisplayCount} நபர்கள் (${classroomDisplayTa}). தமிழகம் எங்கும் பரவலாக அறியப்பட்ட பெயர்.`;
  return {
    ...v2Fields,
    observedFrequencyPercent: frequencyPercent,
    cohortCountPer10k: countPer10k,
    classroomRepetitionIndex: classroomRepetition,
    gradeSchoolRepetitionIndex: gradeRepetition,
    gradeCohortIndex: gradeRepetition,
    oneInClassrooms,
    rarityBand: 'popular',
    badgeTitleEn: 'Popular High-Frequency Classic',
    badgeTitleEnglish: 'Popular High-Frequency Classic',
    badgeTitleTamil: 'பரவலான புகழ்பெற்ற பெயர்',
    icon: '🏛️',
    descriptionEn: descEn,
    descriptionTamil: descTa,
    parentAdviceEnglish: descEn,
    parentAdviceTamil: descTa,
    methodologyNoteEn: noteEn,
    methodologyNoteTa: noteTa,
  };
}
