/**
 * Numerology Engine (Chaldean & Pythagorean + Vedic Planetary Associations)
 * Deterministic, zero-dependency, shared between client and server.
 */

export type NumerologySystem = "chaldean" | "pythagorean";

export interface LetterBreakdown {
  char: string;
  value: number;
  isVowel: boolean;
}

export interface PlanetInfo {
  number: number;
  planetEn: string;
  planetTa: string;
  luckyColors: string[];
  luckyDays: string[];
  gemEn: string;
  gemTa: string;
  traitsEn: string;
  traitsTa: string;
}

export interface CompoundMeaning {
  compound: number;
  titleEn: string;
  titleTa: string;
  summaryEn: string;
  summaryTa: string;
  auspiciousness: "Very Auspicious" | "Auspicious" | "Neutral" | "Caution";
}

export interface NumerologyResult {
  inputName: string;
  cleanedLatin: string;
  system: NumerologySystem;
  compoundNumber: number;
  nameNumber: number; // 1-9
  soulUrgeNumber: number; // Vowels reduced 1-9
  personalityNumber: number; // Consonants reduced 1-9
  letterBreakdown: LetterBreakdown[];
  planet: PlanetInfo;
  compoundInfo?: CompoundMeaning;
}

export interface BirthNumbers {
  dob: string;
  mulank: number; // Birth day reduced 1-9
  bhagyank: number; // Full DOB sum reduced 1-9
  mulankPlanet: PlanetInfo;
  bhagyankPlanet: PlanetInfo;
}

export interface CompatibilityResult {
  rating: "Excellent" | "Good" | "Neutral" | "Caution";
  score: number; // 0-100
  reasonEn: string;
  reasonTa: string;
}

const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export const PLANET_DATA: Record<number, PlanetInfo> = {
  1: {
    number: 1,
    planetEn: "Sun (Surya)",
    planetTa: "சூரியன் (ஞாயிறு)",
    luckyColors: ["Gold", "Orange", "Yellow"],
    luckyDays: ["Sunday", "Monday"],
    gemEn: "Ruby",
    gemTa: "மாணிக்கம்",
    traitsEn: "Leadership, independence, ambition, originality, and strong vitality.",
    traitsTa: "தலைமைப் பண்பு, தன்னம்பிக்கை, தனித்துவம் மற்றும் உயர்ந்த லட்சியம்.",
  },
  2: {
    number: 2,
    planetEn: "Moon (Chandra)",
    planetTa: "சந்திரன் (திங்கள்)",
    luckyColors: ["White", "Cream", "Light Green"],
    luckyDays: ["Monday", "Friday"],
    gemEn: "Pearl",
    gemTa: "முத்து",
    traitsEn: "Gentle, imaginative, diplomatic, empathetic, and artistic nature.",
    traitsTa: "அன்பு, கற்பனைத் திறன், அமைதி மற்றும் கலை ஆர்வம்.",
  },
  3: {
    number: 3,
    planetEn: "Jupiter (Guru)",
    planetTa: "குரு (வியாழன்)",
    luckyColors: ["Yellow", "Saffron", "Purple"],
    luckyDays: ["Thursday", "Tuesday"],
    gemEn: "Yellow Sapphire",
    gemTa: "புஷ்பராகம்",
    traitsEn: "Wisdom, teaching, optimism, discipline, and spiritual growth.",
    traitsTa: "ஞானம், கல்வி, ஒழுக்கம் மற்றும் நேர்மறை சிந்தனை.",
  },
  4: {
    number: 4,
    planetEn: "Rahu (Uranus)",
    planetTa: "ராகு",
    luckyColors: ["Electric Blue", "Grey"],
    luckyDays: ["Saturday", "Sunday"],
    gemEn: "Hessonite (Gomed)",
    gemTa: "கோமேதகம்",
    traitsEn: "Practical, reformative, unconventional thinker, and hardworking.",
    traitsTa: "கடின உழைப்பு, புதுமையான சிந்தனை மற்றும் செயல் திட்டம்.",
  },
  5: {
    number: 5,
    planetEn: "Mercury (Budha)",
    planetTa: "புதன் (அறிவன்)",
    luckyColors: ["Emerald Green", "Light Grey", "White"],
    luckyDays: ["Wednesday", "Friday"],
    gemEn: "Emerald",
    gemTa: "மரகதம்",
    traitsEn: "Sharp intellect, communication, adaptability, commerce, and quick wit.",
    traitsTa: "நுண்ணறிவு, பேச்சாற்றல், வணிகத் திறன் மற்றும் சுறுசுறுப்பு.",
  },
  6: {
    number: 6,
    planetEn: "Venus (Shukra)",
    planetTa: "சுக்கிரன் (வெள்ளி)",
    luckyColors: ["Rose Pink", "Sky Blue", "White"],
    luckyDays: ["Friday", "Tuesday"],
    gemEn: "Diamond / White Zircon",
    gemTa: "வைரம்",
    traitsEn: "Harmony, magnetic charm, family devotion, music, and prosperity.",
    traitsTa: "வசீகரம், குடும்பப் பாசம், இசை, கலை மற்றும் செல்வ வளம்.",
  },
  7: {
    number: 7,
    planetEn: "Ketu (Neptune)",
    planetTa: "கேது",
    luckyColors: ["Pastel Green", "White", "Light Yellow"],
    luckyDays: ["Sunday", "Monday"],
    gemEn: "Cat's Eye",
    gemTa: "வைடூரியம்",
    traitsEn: "Deep intuition, research mindset, philosophical depth, and originality.",
    traitsTa: "ஆழ்ந்த சிந்தனை, ஆராய்ச்சி மனம் மற்றும் ஆன்மீகத் தெளிவு.",
  },
  8: {
    number: 8,
    planetEn: "Saturn (Shani)",
    planetTa: "சனி (காரி)",
    luckyColors: ["Dark Blue", "Navy", "Purple"],
    luckyDays: ["Saturday"],
    gemEn: "Blue Sapphire",
    gemTa: "நீலம்",
    traitsEn: "Perseverance, justice, endurance, organizational mastery, and high achievement.",
    traitsTa: "விடாமுயற்சி, நீதி நேர்மை, பொறுமை மற்றும் நிர்வாகத் திறன்.",
  },
  9: {
    number: 9,
    planetEn: "Mars (Chevvai / Mangala)",
    planetTa: "செவ்வாய்",
    luckyColors: ["Crimson Red", "Coral", "Rose"],
    luckyDays: ["Tuesday", "Thursday"],
    gemEn: "Red Coral",
    gemTa: "பவளம்",
    traitsEn: "Courage, energy, humanitarian spirit, determination, and protective nature.",
    traitsTa: "வீரம், துணிச்சல், மனிதநேயம் மற்றும் செயலாற்றல்.",
  },
};

export const COMPOUND_MEANINGS: Record<number, CompoundMeaning> = {
  10: {
    compound: 10,
    titleEn: "Wheel of Fortune",
    titleTa: "நல்லதிர்ஷ்ட சக்கரம்",
    summaryEn: "Symbolizes honor, faith, self-confidence, and rise in life.",
    summaryTa: "மரியாதை, தன்னம்பிக்கை மற்றும் வாழ்வில் உயர்வைக் குறிக்கும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  14: {
    compound: 14,
    titleEn: "Movement & Magnet of Commerce",
    titleTa: "வணிக ஈர்ப்பு மற்றும் முன்னேற்றம்",
    summaryEn: "Favorable for communication, public dealings, and enterprise.",
    summaryTa: "தகவல் தொடர்பு, மக்கள் செல்வாக்கு மற்றும் தொழிலுக்கு உகந்த எண்.",
    auspiciousness: "Auspicious",
  },
  15: {
    compound: 15,
    titleEn: "Harmony, Art & Eloquence",
    titleTa: "கலை, இனிமை மற்றும் வசீகரம்",
    summaryEn: "Extremely fortunate for attraction, artistic gifts, and prosperity.",
    summaryTa: "கலைத் திறன், இனிய பேச்சு மற்றும் செல்வ வளம் தரும் அதிர்ஷ்ட எண்.",
    auspiciousness: "Very Auspicious",
  },
  19: {
    compound: 19,
    titleEn: "Prince of Heaven (Sun's Blessing)",
    titleTa: "சூரியனின் அருள் பெற்ற வெற்றி எண்",
    summaryEn: "Promises happiness, success, esteem, and fulfillment of plans.",
    summaryTa: "மகிழ்ச்சி, புகழ் மற்றும் எடுத்த காரியங்களில் வெற்றியைத் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  21: {
    compound: 21,
    titleEn: "The Crown of the Magi",
    titleTa: "வெற்றி மகுடம்",
    summaryEn: "Advancement, honors, and general elevation after steady effort.",
    summaryTa: "முயற்சிக்குப் பின் பெரும் உயர்வையும் கௌரவத்தையும் அளிக்கும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  23: {
    compound: 23,
    titleEn: "The Royal Star of the Lion",
    titleTa: "ராஜ நட்சத்திர எண்",
    summaryEn: "Signifies help from superiors, protection, and high success.",
    summaryTa: "பெரியோர்களின் ஆதரவு, பாதுகாப்பு மற்றும் உயர் வெற்றியைத் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  24: {
    compound: 24,
    titleEn: "Love, Family & Prosperity",
    titleTa: "அன்பு மற்றும் குடும்ப செழிப்பு",
    summaryEn: "Fortunate vibration bringing harmony, patronage, and domestic joy.",
    summaryTa: "குடும்ப ஒற்றுமை, அன்பு மற்றும் வளர்ச்சியைத் தரும் சுப எண்.",
    auspiciousness: "Very Auspicious",
  },
  27: {
    compound: 27,
    titleEn: "The Sceptre of Authority",
    titleTa: "அதிகாரம் மற்றும் அறிவாற்றல்",
    summaryEn: "Excellent for creative intellect, command, and rewards from original ideas.",
    summaryTa: "சிறந்த அறிவாற்றல், தலைமைப் பண்பு மற்றும் நற்பெயரைத் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  32: {
    compound: 32,
    titleEn: "Magical Communication & Popularity",
    titleTa: "மக்கள் செல்வாக்கு மற்றும் புகழ்",
    summaryEn: "Comparable to 14 and 23; harmonious combinations of people and ideas.",
    summaryTa: "23-ஐப் போன்றே மக்கள் ஆதரவையும் வெற்றியையும் தரும் சிறந்த எண்.",
    auspiciousness: "Very Auspicious",
  },
  37: {
    compound: 37,
    titleEn: "Good & Fortunate Friendships",
    titleTa: "நல்ல நட்பு மற்றும் அதிர்ஷ்டம்",
    summaryEn: "Potent number for partnership, affection, and enduring success.",
    summaryTa: "நல்ல நட்பு, கூட்டு முயற்சி மற்றும் நீடித்த வெற்றியைக் குறிக்கும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  41: {
    compound: 41,
    titleEn: "Magnetic Leadership",
    titleTa: "வசீகரத் தலைமை",
    summaryEn: "Brings recognition, dignity, and steady upward progress.",
    summaryTa: "மதிப்பு, மரியாதை மற்றும் தொடர்ச்சியான முன்னேற்றம் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  45: {
    compound: 45,
    titleEn: "Honor & Intellectual Reward",
    titleTa: "அறிவு மற்றும் கௌரவம்",
    summaryEn: "Rewards through discipline, wisdom, and noble action.",
    summaryTa: "ஒழுக்கம் மற்றும் அறிவால் உயர்வைத் தரும் எண்.",
    auspiciousness: "Auspicious",
  },
  46: {
    compound: 46,
    titleEn: "Abundance & Harmonious Ties",
    titleTa: "நிறைவான வளம்",
    summaryEn: "Favorable for family, alliances, and steady growth.",
    summaryTa: "நல்ல உறவுகளையும் நிறைவான வளர்ச்சியையும் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
};

const FRIENDLY_NUMBERS: Record<number, number[]> = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 5, 6],
  3: [1, 2, 3, 5, 9],
  4: [1, 5, 6, 7],
  5: [1, 3, 5, 6],
  6: [3, 5, 6, 8, 9],
  7: [1, 2, 4, 5, 7],
  8: [4, 5, 6, 8],
  9: [1, 3, 6, 9],
};

const CAUTION_NUMBERS: Record<number, number[]> = {
  1: [8],
  2: [8, 9],
  3: [6],
  4: [2, 9],
  5: [],
  6: [1, 2],
  7: [8, 9],
  8: [1, 2, 9],
  9: [2, 4, 8],
};

/**
 * Basic Tamil script to Latin phonetic transliterator for numerology fallback
 * when the user types directly in Tamil script.
 */
const TAMIL_TO_LATIN: Record<string, string> = {
  அ: "a", ஆ: "aa", இ: "i", ஈ: "ee", உ: "u", ஊ: "oo", எ: "e", ஏ: "ae", ஐ: "ai", ஒ: "o", ஓ: "oh", ஔ: "au",
  க: "ka", ங: "nga", ச: "sa", ஞ: "gna", ட: "ta", ண: "na", த: "tha", ந: "na", ப: "pa", ம: "ma",
  ய: "ya", ர: "ra", ல: "la", வ: "va", ழ: "zha", ள: "la", ற: "ra", ன: "na",
  ஜ: "ja", ஷ: "sha", ஸ: "sa", ஹ: "ha",
  "ா": "a", "ி": "i", "ீ": "ee", "ு": "u", "ூ": "oo", "ெ": "e", "ே": "ae", "ை": "ai", "ொ": "o", "ோ": "oh", "ௌ": "au", "்": "",
};

export function transliterateTamilToLatin(input: string): string {
  let out = "";
  const chars = Array.from(input);
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const next = chars[i + 1];
    if (TAMIL_TO_LATIN[c] !== undefined) {
      const base = TAMIL_TO_LATIN[c];
      // If consonant followed by pulli or vowel sign, strip trailing 'a'
      if (base.endsWith("a") && base.length > 1 && next && ["ा", "ா", "ி", "ீ", "ு", "ூ", "ெ", "ே", "ை", "ொ", "ோ", "ௌ", "்"].includes(next)) {
        out += base.slice(0, -1);
      } else {
        out += base;
      }
    } else {
      out += c;
    }
  }
  return out;
}

/**
 * Reduce any positive integer to a single digit 1..9
 */
export function reduceToSingleDigit(num: number): number {
  if (num <= 0) return 1;
  let current = Math.abs(Math.floor(num));
  while (current > 9) {
    current = String(current)
      .split("")
      .reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return current;
}

/**
 * Calculate full numerology profile for a given name
 */
export function calculateNumerology(
  rawName: string,
  system: NumerologySystem = "chaldean"
): NumerologyResult {
  const hasTamil = /[\u0B80-\u0BFF]/.test(rawName);
  const latinSource = hasTamil ? transliterateTamilToLatin(rawName) : rawName;
  const cleanedLatin = latinSource.toUpperCase().replace(/[^A-Z]/g, "");
  const map = system === "chaldean" ? CHALDEAN_MAP : PYTHAGOREAN_MAP;

  const letterBreakdown: LetterBreakdown[] = [];
  let compoundNumber = 0;
  let vowelSum = 0;
  let consonantSum = 0;

  for (const char of cleanedLatin) {
    const value = map[char] || 0;
    const isVowel = VOWELS.has(char);
    letterBreakdown.push({ char, value, isVowel });
    compoundNumber += value;
    if (isVowel) {
      vowelSum += value;
    } else {
      consonantSum += value;
    }
  }

  const nameNumber = compoundNumber > 0 ? reduceToSingleDigit(compoundNumber) : 1;
  const soulUrgeNumber = vowelSum > 0 ? reduceToSingleDigit(vowelSum) : 1;
  const personalityNumber = consonantSum > 0 ? reduceToSingleDigit(consonantSum) : 1;

  return {
    inputName: rawName,
    cleanedLatin,
    system,
    compoundNumber,
    nameNumber,
    soulUrgeNumber,
    personalityNumber,
    letterBreakdown,
    planet: PLANET_DATA[nameNumber],
    compoundInfo: COMPOUND_MEANINGS[compoundNumber],
  };
}

/**
 * Calculate Mulank (Birth Day Number) and Bhagyank (Destiny Number) from YYYY-MM-DD
 */
export function calculateBirthNumbers(dobIso: string): BirthNumbers {
  const parts = dobIso.split("-");
  const day = parseInt(parts[2] || "1", 10) || 1;
  const allDigits = dobIso.replace(/[^0-9]/g, "");
  const digitSum = allDigits
    .split("")
    .reduce((acc, d) => acc + parseInt(d, 10), 0);

  const mulank = reduceToSingleDigit(day);
  const bhagyank = reduceToSingleDigit(digitSum || 1);

  return {
    dob: dobIso,
    mulank,
    bhagyank,
    mulankPlanet: PLANET_DATA[mulank],
    bhagyankPlanet: PLANET_DATA[bhagyank],
  };
}

/**
 * Evaluate compatibility between Name Number and Birth Numbers (Mulank & Bhagyank)
 */
export function evaluateCompatibility(
  nameNumber: number,
  birth: BirthNumbers
): CompatibilityResult {
  const friendlyToMulank = FRIENDLY_NUMBERS[birth.mulank]?.includes(nameNumber) ?? false;
  const friendlyToBhagyank = FRIENDLY_NUMBERS[birth.bhagyank]?.includes(nameNumber) ?? false;
  const cautionToMulank = CAUTION_NUMBERS[birth.mulank]?.includes(nameNumber) ?? false;
  const cautionToBhagyank = CAUTION_NUMBERS[birth.bhagyank]?.includes(nameNumber) ?? false;

  if (friendlyToMulank && friendlyToBhagyank) {
    return {
      rating: "Excellent",
      score: 96,
      reasonEn: `Name Number ${nameNumber} (${PLANET_DATA[nameNumber].planetEn}) harmonizes strongly with both Birth Number ${birth.mulank} and Destiny Number ${birth.bhagyank}.`,
      reasonTa: `பெயர் எண் ${nameNumber} (${PLANET_DATA[nameNumber].planetTa}), பிறப்பு எண் ${birth.mulank} மற்றும் விதி எண் ${birth.bhagyank} ஆகிய இரண்டுடனும் மிகச் சிறப்பாகப் பொருந்துகிறது.`,
    };
  }

  if ((friendlyToMulank || friendlyToBhagyank) && !cautionToMulank && !cautionToBhagyank) {
    return {
      rating: "Good",
      score: 82,
      reasonEn: `Name Number ${nameNumber} is supportive with your birth vibration (${birth.mulank} / ${birth.bhagyank}) with no planetary clash.`,
      reasonTa: `பெயர் எண் ${nameNumber} உங்கள் பிறந்த தேதி எண்களுடன் (${birth.mulank} / ${birth.bhagyank}) நல்ல இணக்கத்தைக் கொண்டுள்ளது.`,
    };
  }

  if (cautionToMulank && cautionToBhagyank) {
    return {
      rating: "Caution",
      score: 48,
      reasonEn: `Traditional numerology notes planetary friction between Number ${nameNumber} and Birth/Destiny Numbers (${birth.mulank}, ${birth.bhagyank}). Consider a spelling adjustment.`,
      reasonTa: `எண் ${nameNumber}-க்கும் பிறப்பு/விதி எண்களுக்கும் (${birth.mulank}, ${birth.bhagyank}) கிரக முரண்பாடு உள்ளதால், எழுத்து மாற்றம் செய்து பார்ப்பது நல்லது.`,
    };
  }

  return {
    rating: "Neutral",
    score: 68,
    reasonEn: `Name Number ${nameNumber} has a balanced, neutral relationship with Birth Number ${birth.mulank} and Destiny Number ${birth.bhagyank}.`,
    reasonTa: `பெயர் எண் ${nameNumber} பிறப்பு எண் ${birth.mulank} மற்றும் விதி எண் ${birth.bhagyank} உடன் சமநிலையான பொருத்தத்தைக் கொண்டுள்ளது.`,
  };
}

/**
 * Suggest phonetically similar Latin spelling variants that hit a target numerology number (e.g., 1, 3, 5, 6, 9)
 */
export function suggestSpellingVariants(
  name: string,
  targetNumber: number,
  system: NumerologySystem = "chaldean"
): Array<{ spelling: string; compoundNumber: number; nameNumber: number }> {
  const hasTamil = /[\u0B80-\u0BFF]/.test(name);
  const source = hasTamil ? transliterateTamilToLatin(name) : name;
  const clean = source.trim().replace(/[^a-zA-Z]/g, "");
  if (!clean) return [];

  const candidates = new Set<string>();
  candidates.add(clean);

  // Rule 1: Double a single vowel (a -> aa, i -> ii/ee)
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i].toLowerCase();
    if (["a", "i", "u", "e", "o"].includes(ch) && clean[i + 1]?.toLowerCase() !== ch) {
      candidates.add(clean.slice(0, i + 1) + clean[i] + clean.slice(i + 1));
    }
  }

  // Rule 2: Add 'h' after t, d, k, p, b, g, c, s
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i].toLowerCase();
    if (["t", "d", "k", "p", "b", "g", "v", "r", "n", "l"].includes(ch) && clean[i + 1]?.toLowerCase() !== "h") {
      candidates.add(clean.slice(0, i + 1) + "h" + clean.slice(i + 1));
    }
  }

  // Rule 3: Trailing 'a' -> 'aa' or 'ah' or strip extra 'a'
  if (clean.toLowerCase().endsWith("a") && !clean.toLowerCase().endsWith("aa")) {
    candidates.add(clean + "a");
    candidates.add(clean + "h");
  }
  if (clean.toLowerCase().endsWith("aa")) {
    candidates.add(clean.slice(0, -1));
  }

  // Rule 4: Double consonants n, l, r, s, t, m, v, y
  for (let i = 1; i < clean.length - 1; i++) {
    const ch = clean[i].toLowerCase();
    if (["n", "l", "r", "s", "t", "m", "v", "y", "k"].includes(ch) && clean[i + 1]?.toLowerCase() !== ch) {
      candidates.add(clean.slice(0, i + 1) + clean[i] + clean.slice(i + 1));
    }
  }

  const matches: Array<{ spelling: string; compoundNumber: number; nameNumber: number }> = [];
  for (const variant of candidates) {
    const res = calculateNumerology(variant, system);
    if (res.nameNumber === targetNumber) {
      matches.push({
        spelling: variant.charAt(0).toUpperCase() + variant.slice(1).toLowerCase(),
        compoundNumber: res.compoundNumber,
        nameNumber: res.nameNumber,
      });
    }
  }

  // Prioritize auspicious compound numbers first
  return matches.sort((a, b) => {
    const aFav = COMPOUND_MEANINGS[a.compoundNumber] ? 1 : 0;
    const bFav = COMPOUND_MEANINGS[b.compoundNumber] ? 1 : 0;
    return bFav - aFav;
  });
}

export interface DualNumerologySummary {
  defaultMethod: "Pythagorean (Standard A-Z 1-9)" | "Chaldean (Cheiro 1-8)";
  pythagorean: {
    total: number;
    singleDigit: number;
    soulUrge: number;
    personality: number;
    letterValues: Array<{ char: string; val: number }>;
  };
  chaldean: {
    total: number;
    singleDigit: number;
    soulUrge: number;
    personality: number;
    letterValues: Array<{ char: string; val: number }>;
  };
  rulingPlanetTa: string;
  rulingPlanetEn: string;
}

/**
 * Computes both Standard Pythagorean (A=1..I=9, default per user spec)
 * and Chaldean (1-8) numerology side-by-side with per-letter breakdown.
 */
export function calculateDualNumerology(rawName: string): DualNumerologySummary {
  const pyth = calculateNumerology(rawName, "pythagorean");
  const chald = calculateNumerology(rawName, "chaldean");
  return {
    defaultMethod: "Pythagorean (Standard A-Z 1-9)",
    pythagorean: {
      total: pyth.compoundNumber,
      singleDigit: pyth.nameNumber,
      soulUrge: pyth.soulUrgeNumber,
      personality: pyth.personalityNumber,
      letterValues: pyth.letterBreakdown.map((l) => ({ char: l.char, val: l.value })),
    },
    chaldean: {
      total: chald.compoundNumber,
      singleDigit: chald.nameNumber,
      soulUrge: chald.soulUrgeNumber,
      personality: chald.personalityNumber,
      letterValues: chald.letterBreakdown.map((l) => ({ char: l.char, val: l.value })),
    },
    rulingPlanetTa: pyth.planet.planetTa,
    rulingPlanetEn: pyth.planet.planetEn,
  };
}


