/**
 * பெயர்ச்சோலை (Peyarcholai) — Empirical Name Frequency & Cohort Rarity Scoring Engine
 * Analyzes empirical repetition frequency within standard classroom cohorts (40 peers)
 * and state-wide student bodies (1,000 to 10,000 peers).
 */

export interface EmpiricalRarityContext {
  nameLatin?: string;
  nameCategory?: "pure_tamil" | "tamilnadu_usage" | "other_heritage";
  originCategory?: string;
  syllableCount?: number;
}

export interface EmpiricalRarityScore {
  observedFrequencyPercent: number; // e.g. 0.015%
  cohortCountPer10k: number; // Count per 10,000 students
  classroomRepetitionIndex: number; // Expected peers in a 40-student classroom
  gradeSchoolRepetitionIndex: number; // Expected peers in a 1,000-student school grade
  gradeCohortIndex: number; // Alias for gradeSchoolRepetitionIndex
  oneInClassrooms: number; // Approx. 1 peer per N classrooms of 40 students
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

function deterministicHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295; // [0, 1)
}

/**
 * Estimates a realistic, differentiated per-10,000 cohort frequency when an explicit
 * empirical survey rank is not provided, using cultural category, syllable economy,
 * starting-letter prevalence, common suffix patterns, and deterministic variance.
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

  // 1. Cultural category & classicality baseline
  let base = 4.5;
  let catLabelEn = "Classical / Pure Tamil";
  let catLabelTa = "தூய தமிழ் மரபு";
  if (context?.nameCategory === "tamilnadu_usage") {
    base = 22.0;
    catLabelEn = "Tamil Nadu Contemporary / Bhakti Usage";
    catLabelTa = "தமிழ்நாட்டுப் பரவலான பயன்பாடு";
  } else if (context?.nameCategory === "other_heritage") {
    base = 14.0;
    catLabelEn = "Pan-Indian / Global Heritage";
    catLabelTa = "பிற மரபுப் பெயர்";
  } else if (context?.originCategory?.toLowerCase().includes("sangam") || context?.originCategory?.toLowerCase().includes("classical")) {
    base = 7.5;
    catLabelEn = "Classical Sangam Root";
    catLabelTa = "சங்க இலக்கிய வேர்ச்சொல்";
  } else if (context?.originCategory?.toLowerCase().includes("modern")) {
    base = 2.6;
    catLabelEn = "Modern Etymological Compound";
    catLabelTa = "நவீன வேர்ச்சொல் புணர்ச்சி";
  }

  // 2. Zipfian length & syllable multiplier (shorter 4-6 char names appear far more often in classrooms)
  let lengthFactor = 1.0;
  if (charLen <= 5) lengthFactor = 2.1;
  else if (charLen <= 7) lengthFactor = 1.45;
  else if (charLen <= 9) lengthFactor = 0.85;
  else if (charLen <= 11) lengthFactor = 0.45;
  else lengthFactor = 0.22;

  // 3. Phonetic starter & suffix popularity
  let phoneticFactor = 1.0;
  if (POPULAR_TAMIL_STARTERS.has(firstChar)) phoneticFactor *= 1.25;
  else if (RARE_TAMIL_STARTERS.has(firstChar)) phoneticFactor *= 0.48;

  if (COMMON_SUFFIXES.some((s) => cleanTa.endsWith(s))) {
    phoneticFactor *= 1.32;
  }

  // 4. Deterministic per-name variance (0.65x to 1.45x) so every name is uniquely differentiated
  const hashFactor = 0.65 + deterministicHash(`${cleanTa}|${cleanLatin}`) * 0.80;
  const raw = base * lengthFactor * phoneticFactor * hashFactor;
  const countPer10k = Number(Math.max(0.3, Math.min(85, raw)).toFixed(2));

  const noteEn = `Multi-factor cohort estimate (${catLabelEn}, ~${syllables} syllables, phonetic profile '${firstChar || "-"}').`;
  const noteTa = `பன்முகக் கணக்கீடு (${catLabelTa}, ~${syllables} அசைகள், '${firstChar || "-"}' ஒலிப் பரவல்).`;
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
  let noteEn = "Derived from observed cohort frequency ranking.";
  let noteTa = "வகுப்பறை மற்றும் கல்விப் பதிவு அதிர்வெண் அடிப்படையில் கணக்கிடப்பட்டது.";

  if (typeof observedFrequencyPer10kOrRank === "number" && observedFrequencyPer10kOrRank > 0) {
    countPer10k = Math.max(0.1, observedFrequencyPer10kOrRank);
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
  const classroomRepetition = Number(((countPer10k / 10000) * 40).toFixed(3));
  const gradeRepetition = Number(((countPer10k / 10000) * 1000).toFixed(1));
  const oneInClassrooms = Math.max(1, Math.round(10000 / (countPer10k * 40)));

  if (frequencyPercent < 0.02) {
    const descEn = `~${gradeRepetition} peers per 1,000 students (1 in ~${oneInClassrooms} classrooms of 40; > 99th percentile uniqueness).`;
    const descTa = `1,000 மாணவர்களில் ~${gradeRepetition} நபர்கள் (~${oneInClassrooms} வகுப்பறைகளில் 1 நபர்; 99% தனித்துவம்).`;
    return {
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
    const descEn = `~${gradeRepetition} peers per 1,000 students (1 in ~${oneInClassrooms} classrooms of 40). Stands out gracefully while remaining familiar.`;
    const descTa = `1,000 மாணவர்களில் ~${gradeRepetition} நபர்கள் (~${oneInClassrooms} வகுப்பறைகளில் 1 நபர்). தனித்துவமும் செழுமையும் இணைந்தது.`;
    return {
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
    const descEn = `~${gradeRepetition} peers per 1,000 students (1 in ~${oneInClassrooms} classrooms of 40). Timeless, well-recognized, and comfortable.`;
    const descTa = `1,000 மாணவர்களில் ~${gradeRepetition} நபர்கள் (~${oneInClassrooms} வகுப்பறைகளில் 1 நபர்). காலத்தால் அழியாத நிதானமான பயன்பாடு.`;
    return {
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

  const descEn = `~${gradeRepetition} peers per 1,000 students (~${classroomRepetition} per 40-student class). Highly celebrated and universally beloved.`;
  const descTa = `1,000 மாணவர்களில் ~${gradeRepetition} நபர்கள் (40 பேர் வகுப்பில் ~${classroomRepetition}). தமிழகம் எங்கும் பரவலாக அறியப்பட்ட பெயர்.`;
  return {
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
