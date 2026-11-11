/**
 * Numerology Engine (Chaldean & Pythagorean + Vedic Planetary Associations)
 * Deterministic, zero-dependency, shared between client and server.
 */

export type NumerologySystem = "chaldean" | "pythagorean" | "katapayadi";

export interface LetterBreakdown {
  char: string;
  value: number;
  isVowel: boolean;
}

export interface PlanetInfo {
  number: number;
  planetEn: string;
  planetTa: string;
  deityTa: string;
  deityEn: string;
  luckyColors: string[];
  luckyDays: string[];
  gemEn: string;
  gemTa: string;
  traitsEn: string;
  traitsTa: string;
  favorableCareersEn: string[];
  favorableCareersTa: string[];
  milestoneYears: number[];
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
  isMasterNumber: boolean;
  masterNumberTitleEn?: string;
  masterNumberTitleTa?: string;
  katapayadiNumber?: number;
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
    deityEn: "Surya Bhagavan / Agni",
    deityTa: "சூரிய பகவான் / ஞாயிறு",
    luckyColors: ["Gold", "Orange", "Yellow", "Copper"],
    luckyDays: ["Sunday", "Monday"],
    gemEn: "Ruby (Manikkam)",
    gemTa: "மாணிக்கம்",
    traitsEn: "Leadership, independence, ambition, originality, and regal vitality.",
    traitsTa: "தலைமைப் பண்பு, தன்னம்பிக்கை, தனித்துவம், நேர்மை மற்றும் உயர்ந்த லட்சியம்.",
    favorableCareersEn: ["Administration", "Government", "Entrepreneurship", "Medicine", "Politics"],
    favorableCareersTa: ["நிர்வாகம்", "அரசுப் பணி", "தொழில் முனைவு", "மருத்துவம்", "அரசியல்"],
    milestoneYears: [19, 28, 37, 46, 55, 64],
  },
  2: {
    number: 2,
    planetEn: "Moon (Chandra)",
    planetTa: "சந்திரன் (திங்கள்)",
    deityEn: "Chandra / Parvati",
    deityTa: "சந்திர பகவான் / உமையவள்",
    luckyColors: ["White", "Cream", "Silver", "Light Green"],
    luckyDays: ["Monday", "Friday"],
    gemEn: "Natural Pearl (Muthu)",
    gemTa: "இயற்கை முத்து",
    traitsEn: "Gentle, imaginative, diplomatic, deeply empathetic, and artistic nature.",
    traitsTa: "கருணை, கற்பனைத் திறன், அமைதி, தாய்மை உள்ளம் மற்றும் நுண்கலை ஆர்வம்.",
    favorableCareersEn: ["Arts", "Writing", "Psychology", "Hospitality", "Public Relations"],
    favorableCareersTa: ["கலைத்துறை", "எழுத்து", "உளவியல்", "விருந்தோம்பல்", "மக்கள் தொடர்பு"],
    milestoneYears: [20, 29, 38, 47, 56, 65],
  },
  3: {
    number: 3,
    planetEn: "Jupiter (Guru / Brihaspati)",
    planetTa: "குரு (வியாழன் / பொன்னன்)",
    deityEn: "Brihaspati / Dakshinamurthy",
    deityTa: "குரு பகவான் / தட்சிணாமூர்த்தி",
    luckyColors: ["Yellow", "Saffron", "Golden Yellow", "Purple"],
    luckyDays: ["Thursday", "Tuesday"],
    gemEn: "Yellow Sapphire (Pushparagam)",
    gemTa: "கனக புஷ்பராகம்",
    traitsEn: "Wisdom, spiritual growth, optimism, mentorship, and high ethical standard.",
    traitsTa: "பேரறிவு, கல்விச் சிறப்பு, நீதி நெறி, ஆன்மீக மேன்மை மற்றும் வழிகாட்டும் பண்பு.",
    favorableCareersEn: ["Education", "Law", "Finance", "Publishing", "Spiritual Mentorship"],
    favorableCareersTa: ["கல்வி", "சட்டம்", "நிதி மேலாண்மை", "பதிப்புத்துறை", "ஆன்மீக வழிகாட்டல்"],
    milestoneYears: [21, 30, 39, 48, 57, 66],
  },
  4: {
    number: 4,
    planetEn: "Rahu (North Node / Uranus Resonance)",
    planetTa: "ராகு",
    deityEn: "Durga / Sarpa Devata",
    deityTa: "துர்க்கை / ராகு பகவான்",
    luckyColors: ["Electric Blue", "Steel Grey", "Charcoal"],
    luckyDays: ["Saturday", "Sunday"],
    gemEn: "Hessonite Garnet (Gomedhakam)",
    gemTa: "கோமேதகம்",
    traitsEn: "Practical innovation, structural reforms, unconventional brilliance, and resilience.",
    traitsTa: "கடின உழைப்பு, புதுமைப் பார்வை, நவீனத் தொழில்நுட்பத் திறன் மற்றும் தளரா உறுதி.",
    favorableCareersEn: ["Engineering", "Aviation", "Computer Science", "Research", "Architecture"],
    favorableCareersTa: ["பொறியியல்", "விண்வெளி & வானூர்தி", "கணினித் தொழில்", "ஆராய்ச்சி", "கட்டடக்கலை"],
    milestoneYears: [22, 31, 40, 49, 58, 67],
  },
  5: {
    number: 5,
    planetEn: "Mercury (Budha)",
    planetTa: "புதன் (அறிவன்)",
    deityEn: "Budha / Maha Vishnu",
    deityTa: "புதன் பகவான் / திருமால்",
    luckyColors: ["Emerald Green", "Mint", "Light Grey", "White"],
    luckyDays: ["Wednesday", "Friday"],
    gemEn: "Natural Emerald (Maragatham)",
    gemTa: "மரகதம்",
    traitsEn: "Quick wit, communicative eloquence, analytical prowess, adaptability, and trade mastery.",
    traitsTa: "கூர்ந்த மதிநுட்பம், நாவன்மை, வணிகத் திறன், கணித அறிவு மற்றும் சுறுசுறுப்பு.",
    favorableCareersEn: ["Commerce", "Journalism", "Software Architecture", "Marketing", "Diplomacy"],
    favorableCareersTa: ["வணிகம்", "இதழியல்", "மென்பொருள் வடிவமைப்பு", "சந்தைப்படுத்தல்", "தூதரகம்"],
    milestoneYears: [23, 32, 41, 50, 59, 68],
  },
  6: {
    number: 6,
    planetEn: "Venus (Shukra)",
    planetTa: "சுக்கிரன் (வெள்ளி)",
    deityEn: "Shukra / Mahalakshmi",
    deityTa: "சுக்கிர பகவான் / மகாலட்சுமி",
    luckyColors: ["Rose Pink", "Sky Blue", "Silk White", "Pastel Turquoise"],
    luckyDays: ["Friday", "Tuesday"],
    gemEn: "Diamond (Vairam) / White Zircon",
    gemTa: "வைரம்",
    traitsEn: "Magnetic charm, artistic genius, love for beauty, family harmony, and boundless prosperity.",
    traitsTa: "வசீகரம், அழகியல் உணர்வு, இசை ஞானம், இல்லறச் சிறப்பு மற்றும் செல்வ வளம்.",
    favorableCareersEn: ["Cinema & Media", "Fashion", "Design", "Hospitality", "Luxury Enterprise"],
    favorableCareersTa: ["திரைத்துறை & ஊடகம்", "வடிவமைப்பு", "ஆடம்பரப் பொருட்கள்", "கலை", "உணவகத் தொழில்"],
    milestoneYears: [24, 33, 42, 51, 60, 69],
  },
  7: {
    number: 7,
    planetEn: "Ketu (South Node / Neptune Resonance)",
    planetTa: "கேது",
    deityEn: "Ganesha / Chitragupta",
    deityTa: "விநாயகர் / கேது பகவான்",
    luckyColors: ["Pastel Green", "Pearl White", "Light Amber"],
    luckyDays: ["Sunday", "Monday"],
    gemEn: "Chrysoberyl Cat's Eye (Vaidooryam)",
    gemTa: "வைடூரியம்",
    traitsEn: "Profound intuition, spiritual transcendence, deep research orientation, and philosophical depth.",
    traitsTa: "ஆழ்ந்த உள்ளுணர்வு, மெய்யியல் சிந்தனை, ஆராய்ச்சி மனம், அமைதி மற்றும் ஆன்மீக நாட்டம்.",
    favorableCareersEn: ["Scientific Research", "Philosophy", "Data Science", "Psychiatry", "Occult Studies"],
    favorableCareersTa: ["அறிவியல் ஆராய்ச்சி", "தத்துவம்", "தரவு அறிவியல்", "மனநல மருத்துவம்", "தொல்பொருளியல்"],
    milestoneYears: [25, 34, 43, 52, 61, 70],
  },
  8: {
    number: 8,
    planetEn: "Saturn (Shani)",
    planetTa: "சனி (காரி / மந்தன்)",
    deityEn: "Shani / Yama / Sastha",
    deityTa: "சனீஸ்வர பகவான் / சாஸ்தா",
    luckyColors: ["Deep Blue", "Navy", "Indigo", "Black", "Dark Violet"],
    luckyDays: ["Saturday"],
    gemEn: "Blue Sapphire (Neelam)",
    gemTa: "இந்திர நீலம்",
    traitsEn: "Perseverance, cosmic justice, endurance, organizational mastery, and towering institutional achievement.",
    traitsTa: "விடாமுயற்சி, நீதி நேர்மை, சகிப்புத்தன்மை, தலைமை நிர்வாகம் மற்றும் பெரும் சாதனை.",
    favorableCareersEn: ["Judiciary", "Heavy Industry", "Mining & Geology", "Corporate Governance", "Real Estate"],
    favorableCareersTa: ["நீதித்துறை", "கனரகத் தொழில்", "சுரங்கம் & புவியியல்", "நிறுவன மேலாண்மை", "ரியல் எஸ்டேட்"],
    milestoneYears: [26, 35, 44, 53, 62, 71],
  },
  9: {
    number: 9,
    planetEn: "Mars (Chevvai / Mangala / Angaraka)",
    planetTa: "செவ்வாய் (அங்காரகன்)",
    deityEn: "Murugan (Kartikeya) / Subramanya",
    deityTa: "முருகப் பெருமான் / செவ்வாய் பகவான்",
    luckyColors: ["Crimson Red", "Coral Red", "Rose", "Bright Scarlet"],
    luckyDays: ["Tuesday", "Thursday"],
    gemEn: "Natural Red Coral (Pavazham)",
    gemTa: "செம்பவளம்",
    traitsEn: "Dynamic courage, executive energy, humanitarian defense, fearlessness, and pioneering spirit.",
    traitsTa: "வீரம், தளராத் துணிவு, தலைமை ஆற்றல், அறப்போர் குணம் மற்றும் காக்கும் பண்பு.",
    favorableCareersEn: ["Defense & Military", "Surgery & Healthcare", "Sports", "Civil Engineering", "Police Service"],
    favorableCareersTa: ["இராணுவம் & காவல்", "அறுவை சிகிச்சை", "விளையாட்டு", "கட்டுமானப் பொறியியல்", "நிர்வாகப் பாதுகாப்பு"],
    milestoneYears: [27, 36, 45, 54, 63, 72],
  },
};

export const COMPOUND_MEANINGS: Record<number, CompoundMeaning> = {
  10: {
    compound: 10,
    titleEn: "Wheel of Fortune",
    titleTa: "நல்லதிர்ஷ்ட சக்கரம்",
    summaryEn: "Symbolizes honor, faith, self-confidence, and rise in life.",
    summaryTa: "மரியாதை, தன்னம்பிக்கை மற்றும் வாழ்வில் உயர்வைக் குறிக்கும் சுப எண்.",
    auspiciousness: "Very Auspicious",
  },
  11: {
    compound: 11,
    titleEn: "The Clenched Hand / Master Visionary",
    titleTa: "உள்நோக்கு விழிப்புணர்வு",
    summaryEn: "Master number of intuition, high spiritual trials, and creative breakthrough.",
    summaryTa: "உள்ளுணர்வு, ஆன்மீகச் சோதனைகளை வெல்லும் மனவலிமை மற்றும் கலைப் பார்வை.",
    auspiciousness: "Auspicious",
  },
  12: {
    compound: 12,
    titleEn: "The Noble Sacrifice",
    titleTa: "தியாகமும் சேவை மனப்பான்மையும்",
    summaryEn: "Symbolizes victim of circumstances or selfless service resulting in spiritual growth.",
    summaryTa: "சுயநலமற்ற சேவை, விட்டுக்கொடுத்தல் மூலம் உயரும் பண்பு.",
    auspiciousness: "Neutral",
  },
  13: {
    compound: 13,
    titleEn: "Regeneration & Transformation",
    titleTa: "மறுமலர்ச்சி மற்றும் மாற்றம்",
    summaryEn: "Number of power through change, restructuring, and enduring reform.",
    summaryTa: "மாற்றங்கள் வழியே வலிமை பெறுதல் மற்றும் புத்துயிர் பெறுதல்.",
    auspiciousness: "Auspicious",
  },
  14: {
    compound: 14,
    titleEn: "Movement & Magnet of Commerce",
    titleTa: "வணிக ஈர்ப்பு மற்றும் முன்னேற்றம்",
    summaryEn: "Favorable for communication, financial enterprise, and travel.",
    summaryTa: "தகவல் தொடர்பு, மக்கள் செல்வாக்கு, பயணம் மற்றும் தொழிலுக்கு உகந்த எண்.",
    auspiciousness: "Auspicious",
  },
  15: {
    compound: 15,
    titleEn: "Harmony, Art & Eloquence",
    titleTa: "கலை, இனிமை மற்றும் வசீகரம்",
    summaryEn: "Extremely fortunate for attraction, artistic gifts, literature, and prosperity.",
    summaryTa: "கலைத் திறன், இனிய பேச்சு, வசீகர ஈர்ப்பு மற்றும் செல்வ வளம் தரும் அதிர்ஷ்ட எண்.",
    auspiciousness: "Very Auspicious",
  },
  16: {
    compound: 16,
    titleEn: "The Shattered Citadel",
    titleTa: "எச்சரிக்கையுடன் வழிநடத்தும் விழிப்பு",
    summaryEn: "Requires humility and vigilance against false pride; urges grounded planning.",
    summaryTa: "அகந்தையைத் தவிர்த்து, விவேகத்துடன் திட்டமிட்டுச் செயல்பட வேண்டிய எண்.",
    auspiciousness: "Caution",
  },
  17: {
    compound: 17,
    titleEn: "The Star of the Magi (Venus & Sun)",
    titleTa: "வழிகாட்டும் மங்கள விண்மீன்",
    summaryEn: "Symbolizes hope, peace, immortality of fame, and divine protection.",
    summaryTa: "புகழ், மன அமைதி மற்றும் வாழ்நாள் சாதனையைத் தரும் அதிர்ஷ்ட விண்மீன் எண்.",
    auspiciousness: "Very Auspicious",
  },
  18: {
    compound: 18,
    titleEn: "Spiritual Fortitude",
    titleTa: "ஆன்ம பலம் மற்றும் உறுதி",
    summaryEn: "Warns of deception from trusted circles; calls for supreme inner discernment.",
    summaryTa: "சுய ஒழுக்கமும் எச்சரிக்கையுணர்வும் வழியே சோதனைகளைக் கடக்கும் மனபலம்.",
    auspiciousness: "Neutral",
  },
  19: {
    compound: 19,
    titleEn: "Prince of Heaven (Surya's Radiant Gift)",
    titleTa: "சூரியனின் அருள் பெற்ற வெற்றி எண்",
    summaryEn: "Extremely fortunate; promises esteem, happiness, health, and triumph.",
    summaryTa: "மகிழ்ச்சி, நற்புகழ், தலைமை மற்றும் எடுத்த காரியங்களில் வெற்றியைத் தரும் மங்கள எண்.",
    auspiciousness: "Very Auspicious",
  },
  20: {
    compound: 20,
    titleEn: "The Awakening Call",
    titleTa: "விழிப்புணர்வும் புதிய தொடக்கமும்",
    summaryEn: "Symbolizes spiritual awakening, duty, and renewal of life purpose.",
    summaryTa: "ஆன்மீக விழிப்புணர்வு, கடமையுணர்ச்சி மற்றும் புத்துணர்ச்சியான தொடக்கம்.",
    auspiciousness: "Auspicious",
  },
  21: {
    compound: 21,
    titleEn: "The Crown of the Magi",
    titleTa: "வெற்றி மகுடம்",
    summaryEn: "Advancement, honors, and victory after patient and persistent effort.",
    summaryTa: "முயற்சிக்குப் பின் பெரும் உயர்வையும் சர்வதேச கௌரவத்தையும் அளிக்கும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  22: {
    compound: 22,
    titleEn: "Master Builder & Global Architect",
    titleTa: "மகா சிற்பி மற்றும் தொலைநோக்கு",
    summaryEn: "Master builder turning lofty visionary ideals into concrete reality.",
    summaryTa: "உயர் சிந்தனைகளை நடைமுறைக் கட்டுமானங்களாக மாற்றும் மகா ஆற்றல்.",
    auspiciousness: "Very Auspicious",
  },
  23: {
    compound: 23,
    titleEn: "The Royal Star of the Lion",
    titleTa: "ராஜ நட்சத்திர எண்",
    summaryEn: "Signifies patronage of powerful leaders, invulnerability, and high success.",
    summaryTa: "பெரியோர்களின் ஆதரவு, தெய்வீகப் பாதுகாப்பு மற்றும் உயர் வெற்றியைத் தரும் உன்னத எண்.",
    auspiciousness: "Very Auspicious",
  },
  24: {
    compound: 24,
    titleEn: "Love, Family & Domestic Bliss",
    titleTa: "அன்பு, குடும்பம் மற்றும் வளமை",
    summaryEn: "Brings harmony, social support, domestic tranquility, and wealth.",
    summaryTa: "குடும்ப ஒற்றுமை, அன்பு, ஆதரவு மற்றும் நிலையான பொருளாதார வளர்ச்சியைத் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  25: {
    compound: 25,
    titleEn: "Discrimination & Experiential Wisdom",
    titleTa: "பகுத்தறிவு மற்றும் அனுபவ ஞானம்",
    summaryEn: "Success gained through deep study, research, and quiet perseverance.",
    summaryTa: "ஆராய்ச்சி, கல்வி மற்றும் ஆழ்ந்த அனுபவங்களின் வழியே நிலவும் ஞானம்.",
    auspiciousness: "Auspicious",
  },
  26: {
    compound: 26,
    titleEn: "Partnership & Earthly Ambition",
    titleTa: "கூட்டு முயற்சியும் பொறுப்பும்",
    summaryEn: "Advises careful evaluation of partnerships and financial custody.",
    summaryTa: "கூட்டுத் தொழில்களில் எச்சரிக்கையும் நிதி ஒழுக்கமும் தேவைப்படும் எண்.",
    auspiciousness: "Neutral",
  },
  27: {
    compound: 27,
    titleEn: "The Sceptre of Authority (Kavalan)",
    titleTa: "செங்கோல் அதிகாரம் மற்றும் ஞானம்",
    summaryEn: "Rewards original thinkers, executive leaders, and courageous intellectuals.",
    summaryTa: "சிறந்த அறிவாற்றல், நீதி பரிபாலனம், தலைமைப் பண்பு மற்றும் நற்பெயரைத் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  28: {
    compound: 28,
    titleEn: "Trust & Steadfast Diligence",
    titleTa: "கவனமுடன் கூடிய உழைப்பு",
    summaryEn: "Great potential when trusting one's own legal and ethical judgment.",
    summaryTa: "தன்னம்பிக்கையும் சட்டப்பூர்வ நேர்மையும் கொண்டு முன்னேற வேண்டிய எண்.",
    auspiciousness: "Neutral",
  },
  29: {
    compound: 29,
    titleEn: "Grace Under Trial",
    titleTa: "சோதனைகளை வெல்லும் பண்பு",
    summaryEn: "Cultivates profound emotional depth, inner strength, and patient resolve.",
    summaryTa: "மனஉறுதி, சகிப்புத்தன்மை மற்றும் பொறுமை வழியே வெற்றி பெறும் எண்.",
    auspiciousness: "Neutral",
  },
  30: {
    compound: 30,
    titleEn: "Thoughtful Longevity & Scholarly Radiance",
    titleTa: "ஆழ்ந்த சிந்தனை மற்றும் நீண்ட ஆயுள்",
    summaryEn: "Reflective mental brilliance, mental supremacy over material desires.",
    summaryTa: "அறிவார்ந்த சிந்தனை, உலகியல் ஆசைகளைத் தாண்டிய ஞானம் மற்றும் நீண்ட புகழ்.",
    auspiciousness: "Auspicious",
  },
  31: {
    compound: 31,
    titleEn: "Solitary Genius & Independent Will",
    titleTa: "தனித்துவ சிந்தனை மற்றும் உறுதி",
    summaryEn: "Philosophic detachment, independent decisions, and unconventional gifts.",
    summaryTa: "தனித்துவம், சுய சிந்தனை மற்றும் பிறரின் செல்வாக்கிற்கு உட்படாத மனவலிமை.",
    auspiciousness: "Auspicious",
  },
  32: {
    compound: 32,
    titleEn: "Magnetic Messenger & Public Acclaim",
    titleTa: "மக்கள் செல்வாக்கு மற்றும் தூதறிவு",
    summaryEn: "Possesses immense charm, persuasive oratory, and viral public acclaim.",
    summaryTa: "23-ஐப் போன்றே மக்கள் ஆதரவு, நாவன்மை மற்றும் பெரும் வெற்றியைத் தரும் சுப எண்.",
    auspiciousness: "Very Auspicious",
  },
  33: {
    compound: 33,
    titleEn: "Master Teacher of Compassion",
    titleTa: "அன்பின் ஆசான் மற்றும் வழிகாட்டி",
    summaryEn: "Master number of sacrificial love, universal teaching, and spiritual elevation.",
    summaryTa: "பேரன்பு, கல்வி வழிகாட்டல் மற்றும் மக்கள் நலச் சேவைக்குரிய மகா சுப எண்.",
    auspiciousness: "Very Auspicious",
  },
  34: {
    compound: 34,
    titleEn: "Practical Wisdom & Systematic Mastery",
    titleTa: "செயல் ஞானமும் நிர்வாகமும்",
    summaryEn: "Builds enduring foundations through honesty, routine, and discipline.",
    summaryTa: "நேர்மையான உழைப்பு மற்றும் ஒழுக்கத்தின் மூலம் உறுதியான அடித்தளம் அமைக்கும் எண்.",
    auspiciousness: "Auspicious",
  },
  35: {
    compound: 35,
    titleEn: "Steadfast Peace & Commercial Growth",
    titleTa: "நிலையான அமைதியும் வணிகமும்",
    summaryEn: "Combines creative insight with practical mercantile stability.",
    summaryTa: "கற்பனைத் திறனும் வணிக நேர்த்தியும் இணைந்து நிலையான வளர்ச்சியை அளிக்கும்.",
    auspiciousness: "Auspicious",
  },
  36: {
    compound: 36,
    titleEn: "Intellectual Eminence & Cosmic Order",
    titleTa: "உயர்ந்த அறிவு மற்றும் நீதி",
    summaryEn: "Sharp judicial mind, ethical excellence, and patronage of learning.",
    summaryTa: "கல்விப் புலமை, நீதி நேர்மை மற்றும் சமுதாய நன்மதிப்பைப் பெற்றுத் தரும் எண்.",
    auspiciousness: "Auspicious",
  },
  37: {
    compound: 37,
    titleEn: "Harmonious Alliances & Pure Fortune",
    titleTa: "நல்ல நட்பு மற்றும் மங்கள யோகம்",
    summaryEn: "Extremely lucky for partnership, love, business mergers, and lasting fame.",
    summaryTa: "நல்ல நட்பு, தூய அன்பு, கூட்டு முயற்சி மற்றும் நீடித்த வெற்றியைத் தரும் அதிர்ஷ்ட எண்.",
    auspiciousness: "Very Auspicious",
  },
  38: {
    compound: 38,
    titleEn: "Intuitive Courage & Protective Grace",
    titleTa: "உள்ளுணர்வு வீரம் மற்றும் பாதுகாப்பு",
    summaryEn: "Combines intuitive perception with brave protective impulses.",
    summaryTa: "உள்ளுணர்வும் துணிச்சலும் ஒருங்கே அமைந்து பிறரைக் காக்கும் ஆற்றல்.",
    auspiciousness: "Auspicious",
  },
  39: {
    compound: 39,
    titleEn: "Humanitarian Benevolence",
    titleTa: "மனிதநேயமும் தொண்டும்",
    summaryEn: "Expansive global empathy, philanthropic drive, and civic honors.",
    summaryTa: "பரந்த மக்கள் நலப் பார்வை, கருணை உள்ளம் மற்றும் சமுதாய மரியாதை.",
    auspiciousness: "Auspicious",
  },
  40: {
    compound: 40,
    titleEn: "Contemplative Focus & Depth",
    titleTa: "கவனக் குவிப்பும் ஆழ்ந்த அமைதியும்",
    summaryEn: "Quiet scholar; thrives in focused specialization and research.",
    summaryTa: "ஆராய்ச்சி, அமைதியான உழைப்பு மற்றும் தனித்திறனால் சிறக்கும் பண்பு.",
    auspiciousness: "Auspicious",
  },
  41: {
    compound: 41,
    titleEn: "Magnetic Sovereign & Victor",
    titleTa: "வசீகரத் தலைமை மற்றும் அரசு மரியாதை",
    summaryEn: "Bestows commanding authority, executive dignity, and continuous ascent.",
    summaryTa: "மதிப்பு, அரசு மரியாதை, தலைமை ஆளுமை மற்றும் தொடர்ச்சியான முன்னேற்றம் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  42: {
    compound: 42,
    titleEn: "Artistic Harmony & Domestic Radiance",
    titleTa: "கலை அமைதி மற்றும் குடும்பப் பெருமை",
    summaryEn: "Blessed in home life, creative arts, and joyful community bonding.",
    summaryTa: "இன்பமான குடும்ப வாழ்க்கை, கலை ஆர்வம் மற்றும் சமூக நல்லுறவைத் தரும் சுப எண்.",
    auspiciousness: "Very Auspicious",
  },
  43: {
    compound: 43,
    titleEn: "Unyielding Fortitude",
    titleTa: "திண்ணிய மனஉறுதியும் போராட்டக் குணமும்",
    summaryEn: "Revolutionary spirit that overcomes setbacks through raw determination.",
    summaryTa: "தளரா மன உறுதி கொண்டு தடைகளைத் தகர்த்து வெல்லும் ஆற்றல்.",
    auspiciousness: "Neutral",
  },
  44: {
    compound: 44,
    titleEn: "Master Architect of Public Welfare",
    titleTa: "மக்கள் நலப் பேரமைப்பாளர்",
    summaryEn: "Double 4 vibration constructing long-term societal institutions.",
    summaryTa: "சமூக நிறுவனங்கள் மற்றும் நீடித்த மக்கள் நலத் திட்டங்களை உருவாக்கும் ஆற்றல்.",
    auspiciousness: "Very Auspicious",
  },
  45: {
    compound: 45,
    titleEn: "Honor & Intellectual Triumph",
    titleTa: "அறிவு, கௌரவம் மற்றும் கல்வி",
    summaryEn: "Rewards earned through ethical scholarship, wisdom, and statesmanship.",
    summaryTa: "ஒழுக்கம், கல்வி மற்றும் நேரிய வழியிலான அறிவுசார் உயர்வைத் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  46: {
    compound: 46,
    titleEn: "Abundance & Fruitful Ties",
    titleTa: "நிறைவான செல்வ வளம்",
    summaryEn: "Highly auspicious for wealth accumulation, graceful connections, and ease.",
    summaryTa: "நல்லுறவு, செல்வ வளம், நிறைவான குடும்ப வாழ்க்கை தரும் மங்கள எண்.",
    auspiciousness: "Very Auspicious",
  },
  47: {
    compound: 47,
    titleEn: "Spiritual Discernment & Scientific Inquiry",
    titleTa: "ஞானத் தெளிவும் அறிவியல் சிந்தனையும்",
    summaryEn: "Combines structural logic with profound spiritual realization.",
    summaryTa: "தருக்க அறிவும் ஆன்மீக நுண்ணறிவும் இணைந்து வெற்றியளிக்கும் பண்பு.",
    auspiciousness: "Auspicious",
  },
  48: {
    compound: 48,
    titleEn: "Diligence & Ethical Duty",
    titleTa: "கடமையுணர்ச்சியும் உழைப்பும்",
    summaryEn: "Earned success through consistent hard work and unblemished duty.",
    summaryTa: "தொடர் உழைப்பு மற்றும் கடமை தவறாத நேர்மையால் வரும் உயர்வு.",
    auspiciousness: "Auspicious",
  },
  49: {
    compound: 49,
    titleEn: "Philosophic Vision & Reform",
    titleTa: "தத்துவப் பார்வையும் சீர்திருத்தமும்",
    summaryEn: "Global humanitarian awareness, literary power, and cultural voice.",
    summaryTa: "உலகளாவிய பார்வை, இலக்கியப் புலமை மற்றும் சமுதாய விழிப்புணர்வு.",
    auspiciousness: "Auspicious",
  },
  50: {
    compound: 50,
    titleEn: "Eloquence & Mercantile Supremacy",
    titleTa: "சொல்லாற்றல் மற்றும் வணிக மேலாண்மை",
    summaryEn: "Liberation from obstacles through persuasive intellect and adaptability.",
    summaryTa: "பேச்சாற்றல், சமயோசித புத்தி மற்றும் வணிகத்தில் பெரும் வெற்றியைத் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  51: {
    compound: 51,
    titleEn: "Supreme Warrior & General's Triumph",
    titleTa: "தளபதி வீரம் மற்றும் வெற்றி",
    summaryEn: "Extremely auspicious; promises victory in competitive arenas and enterprise.",
    summaryTa: "போட்டி, தேர்வு மற்றும் சவாலான காரியங்களில் முதல் நிலை வெற்றியைத் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  52: {
    compound: 52,
    titleEn: "Protective Nurturing & Devotion",
    titleTa: "பாதுகாக்கும் அன்பு மற்றும் அரவணைப்பு",
    summaryEn: "Gentle yet unshakeable domestic fortress; highly regarded for loyalty.",
    summaryTa: "குடும்பத்தைக் காக்கும் பாசம், விசுவாசம் மற்றும் அமைதியான வளர்ச்சி.",
    auspiciousness: "Auspicious",
  },
  53: {
    compound: 53,
    titleEn: "Pioneering Innovation",
    titleTa: "முன்னோடிப் புதுமை",
    summaryEn: "Gift for exploring uncharted territories, inventions, and bold concepts.",
    summaryTa: "புதிய பாதைகளை உருவாக்கும் துணிச்சல் மற்றும் அறிவியல் புதுமை.",
    auspiciousness: "Auspicious",
  },
  54: {
    compound: 54,
    titleEn: "Universal Compassion & Nobility",
    titleTa: "பேரன்பு மற்றும் உயர்ந்த பண்பு",
    summaryEn: "Combines intellectual brilliance with heartfelt civic responsibility.",
    summaryTa: "அறிவும் கருணையும் ஒருங்கே இணைந்து உலக நன்மைக்கு வழிவகுக்கும் எண்.",
    auspiciousness: "Auspicious",
  },
  55: {
    compound: 55,
    titleEn: "Sacred Shield & Divine Armor",
    titleTa: "தெய்வீகப் பாதுகாப்பு மற்றும் வெற்றி",
    summaryEn: "Double Mercury energy granting miraculous intellectual and commercial success.",
    summaryTa: "இரட்டைப் புதன் வலிமை; கல்வி, வணிகம் மற்றும் நுண்ணறிவில் இணையற்ற வெற்றி.",
    auspiciousness: "Very Auspicious",
  },
  56: {
    compound: 56,
    titleEn: "Artistic Diplomacy & Charm",
    titleTa: "கலை நேர்த்தியும் தூதறிவும்",
    summaryEn: "Fosters peaceful negotiations, harmonious partnerships, and cultural grace.",
    summaryTa: "இனிமையான பேச்சு, கலை உணர்வு மற்றும் இணக்கமான உறவுகள்.",
    auspiciousness: "Auspicious",
  },
  57: {
    compound: 57,
    titleEn: "Scholarly Fame & Intuitive Light",
    titleTa: "கல்விப் புகழ் மற்றும் மெய்யறிவு",
    summaryEn: "Brings renown in academic research, authorship, and spiritual inquiry.",
    summaryTa: "எழுத்து, கல்வி மற்றும் மெய்ப்பொருள் ஆராய்ச்சியில் பெரும் புகழ் தரும் எண்.",
    auspiciousness: "Very Auspicious",
  },
  58: {
    compound: 58,
    titleEn: "Executive Governance & Mastery",
    titleTa: "ஆளுமைத் திறன் மற்றும் நிர்வாகம்",
    summaryEn: "High capability in financial stewardship, institutions, and industrial leadership.",
    summaryTa: "நிதி மேலாண்மை, பெரிய நிறுவனங்களை வழிநடத்தும் தலைமை ஆளுமை.",
    auspiciousness: "Auspicious",
  },
  59: {
    compound: 59,
    titleEn: "Cosmic Philanthropy & Fame",
    titleTa: "ஈகை உள்ளம் மற்றும் உலகப் புகழ்",
    summaryEn: "Brings public affection, philanthropic leadership, and artistic prominence.",
    summaryTa: "மக்கள் ஆதரவு, கொடைத்திறன் மற்றும் உலகளாவிய அங்கீகாரம்.",
    auspiciousness: "Very Auspicious",
  },
  60: {
    compound: 60,
    titleEn: "Supreme Domestic Bliss & Radiance",
    titleTa: "இல்லறச் சிறப்பு மற்றும் மங்களம்",
    summaryEn: "Number of harmonious love, beauty, wealth, and spiritual grace.",
    summaryTa: "குடும்ப மகிழ்ச்சி, அழகு, கலை, ஆன்மீக அருள் மற்றும் நிறைவான வாழ்வு.",
    auspiciousness: "Very Auspicious",
  },
  61: {
    compound: 61,
    titleEn: "Visionary Innovation",
    titleTa: "தொலைநோக்குப் பார்வை",
    summaryEn: "Inspires breakthrough discoveries and creative independence.",
    summaryTa: "புதிய கண்டுபிடிப்புகள் மற்றும் தனித்துவமான பாதையில் வெற்றி.",
    auspiciousness: "Auspicious",
  },
  62: {
    compound: 62,
    titleEn: "Enduring Loyalties & Peace",
    titleTa: "நீடித்த நட்பும் அமைதியும்",
    summaryEn: "Creates unshakeable alliances, steady community respect, and balanced progress.",
    summaryTa: "நம்பகமான நட்புறவு, அமைதியான வாழ்க்கை மற்றும் சமூக மதிப்பு.",
    auspiciousness: "Auspicious",
  },
  63: {
    compound: 63,
    titleEn: "Enlightened Counsel & Sacerdotal Grace",
    titleTa: "ஞான வழிகாட்டல் மற்றும் அருள்",
    summaryEn: "Brings spiritual wisdom, revered council, and universal respect.",
    summaryTa: "பெரியோர்களின் ஆசி, ஆன்மீக வழிகாட்டுதல் மற்றும் அனைவரின் நன்மதிப்பு.",
    auspiciousness: "Very Auspicious",
  },
  64: {
    compound: 64,
    titleEn: "Unshakable Foundation & Triumph",
    titleTa: "நிலைத்த வெற்றி மற்றும் வளம்",
    summaryEn: "Patient construction of long-term prosperity through structural excellence.",
    summaryTa: "சீரிய திட்டமிடல் மற்றும் விடாமுயற்சியால் நிலையான சாம்ராஜ்யம் அமைத்தல்.",
    auspiciousness: "Auspicious",
  },
  65: {
    compound: 65,
    titleEn: "Radiant Fortune & Universal Goodwill",
    titleTa: "மங்கள யோகம் மற்றும் நற்பெயர்",
    summaryEn: "Highly favorable; brings luck, charismatic standing, and smooth triumph.",
    summaryTa: "தொட்டதெல்லாம் துலங்கும் மங்கள யோகம் மற்றும் பரவலான நற்பெயர்.",
    auspiciousness: "Very Auspicious",
  },
  66: {
    compound: 66,
    titleEn: "Sublime Aesthetics & Joy",
    titleTa: "அழகியல் நிறைவு மற்றும் மகிழ்ச்சி",
    summaryEn: "Deep artistic joy, affectionate magnetism, and harmonious living.",
    summaryTa: "கலை இன்பம், வசீகரக் குணம் மற்றும் மகிழ்ச்சியான குடும்ப வாழ்க்கை.",
    auspiciousness: "Very Auspicious",
  },
  67: {
    compound: 67,
    titleEn: "Scholarly Eminence & Reverence",
    titleTa: "கல்விச் செல்வம் மற்றும் மேன்மை",
    summaryEn: "Brings profound literary, spiritual, or scientific distinction.",
    summaryTa: "ஆழ்ந்த கல்வி ஞானம், ஆன்மீக மேன்மை மற்றும் சமூகத்தில் உயர்ந்த கௌரவம்.",
    auspiciousness: "Very Auspicious",
  },
  68: {
    compound: 68,
    titleEn: "Strategic Justice & Balance",
    titleTa: "நீதி நேர்மை மற்றும் சமநிலை",
    summaryEn: "Excellence in law, fair contracts, and industrial governance.",
    summaryTa: "சட்ட நேர்மை, நியாயமான ஒப்பந்தங்கள் மற்றும் நிர்வாகத் தெளிவு.",
    auspiciousness: "Auspicious",
  },
  69: {
    compound: 69,
    titleEn: "Humanitarian Nobility & Global Heart",
    titleTa: "மனிதநேய மாண்பு மற்றும் சேவை",
    summaryEn: "Boundless empathy, international acclaim, and compassionate service.",
    summaryTa: "எல்லையற்ற கருணை, உலகளாவிய புகழ் மற்றும் மனிதநேயத் தொண்டு.",
    auspiciousness: "Very Auspicious",
  },
  70: {
    compound: 70,
    titleEn: "Mystic Serenity & Contemplation",
    titleTa: "சாந்த குணம் மற்றும் அமைதி",
    summaryEn: "Peaceful inner illumination, literary detachment, and deep wisdom.",
    summaryTa: "உள்நோக்கு அமைதி, உலகியல் பற்றற்ற ஞானம் மற்றும் சாந்தமான வாழ்வு.",
    auspiciousness: "Auspicious",
  },
  71: {
    compound: 71,
    titleEn: "Divine Illumination & Sovereign Will",
    titleTa: "அறிவொளித் தலைமை மற்றும் வெற்றி",
    summaryEn: "Brings natural majesty, clear vision, and triumphant leadership.",
    summaryTa: "சுய பிரகாசம், தெளிவான பார்வை மற்றும் வெற்றி தரும் தலைமைப் பண்பு.",
    auspiciousness: "Very Auspicious",
  },
  72: {
    compound: 72,
    titleEn: "Collective Prosperity & Fellowship",
    titleTa: "மக்கள் நலம் மற்றும் கூட்டு வளர்ச்சி",
    summaryEn: "Unites diverse communities towards shared prosperity and harmony.",
    summaryTa: "அனைவரையும் ஒருங்கிணைத்து பொதுநலன் காக்கும் ஒற்றுமைப் பண்பு.",
    auspiciousness: "Auspicious",
  },
  73: {
    compound: 73,
    titleEn: "Eloquent Wisdom & Golden Counsel",
    titleTa: "இனிய ஞானம் மற்றும் வழிகாட்டல்",
    summaryEn: "Brilliant communicative insight, teaching acumen, and honorable renown.",
    summaryTa: "இனிய சொல்வளம், கல்வி கற்பிக்கும் ஆற்றல் மற்றும் மரியாதைக்குரிய புகழ்.",
    auspiciousness: "Very Auspicious",
  },
  74: {
    compound: 74,
    titleEn: "Methodical Mastery & Fortitude",
    titleTa: "முறையான உழைப்பு மற்றும் மேன்மை",
    summaryEn: "Earned stability through unyielding perseverance and technical skill.",
    summaryTa: "முறையான பயிற்சி மற்றும் தொழில்நுட்பத் திறமையால் வரும் நிலையான மேன்மை.",
    auspiciousness: "Auspicious",
  },
  75: {
    compound: 75,
    titleEn: "Auspicious Completion & Abundance",
    titleTa: "நிறைவான வெற்றி மற்றும் செழிப்பு",
    summaryEn: "Culmination of effort into celebrated abundance and lasting heritage.",
    summaryTa: "தொடர் முயற்சிகளின் நிறைவான பலனாகக் கிட்டும் நீடித்த வளமும் புகழும்.",
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

export const KATAPAYADI_TAMIL_MAP: Record<string, number> = {
  // Consonants group 1 (1): க, ட, ப, ய
  "க": 1, "ட": 1, "ப": 1, "ய": 1,
  // Consonants group 2 (2): ங, ண, ம, ர
  "ங": 2, "ண": 2, "ம": 2, "ர": 2,
  // Consonants group 3 (3): ச, த, ல
  "ச": 3, "த": 3, "ல": 3,
  // Consonants group 4 (4): ஞ, ந, வ
  "ஞ": 4, "ந": 4, "வ": 4,
  // Consonants group 5 (5): ழ
  "ழ": 5,
  // Consonants group 6 (6): ள
  "ள": 6,
  // Consonants group 7 (7): ற
  "ற": 7,
  // Consonants group 8 (8): ன
  "ன": 8,
  // Grantha letters
  "ஜ": 1, "ஷ": 2, "ஸ": 3, "ஹ": 4,
};

export function calculateKatapayadiNumber(tamilText: string): {
  compound: number;
  single: number;
  breakdown: Array<{ char: string; value: number }>;
} {
  const breakdown: Array<{ char: string; value: number }> = [];
  let compound = 0;
  for (const ch of tamilText) {
    if (KATAPAYADI_TAMIL_MAP[ch] !== undefined) {
      const val = KATAPAYADI_TAMIL_MAP[ch];
      breakdown.push({ char: ch, value: val });
      compound += val;
    }
  }
  const single = compound > 0 ? reduceToSingleDigit(compound) : 1;
  return { compound, single, breakdown };
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

  // Katapayadi computation
  let katapayadiResult: { compound: number; single: number } | undefined;
  if (hasTamil) {
    katapayadiResult = calculateKatapayadiNumber(rawName);
  }

  if (system === "katapayadi") {
    const kRes = calculateKatapayadiNumber(rawName);
    const letterBreakdown: LetterBreakdown[] = kRes.breakdown.map((b) => ({
      char: b.char,
      value: b.value,
      isVowel: false,
    }));
    return {
      inputName: rawName,
      cleanedLatin,
      system: "katapayadi",
      compoundNumber: kRes.compound,
      nameNumber: kRes.single,
      soulUrgeNumber: kRes.single,
      personalityNumber: kRes.single,
      isMasterNumber: false,
      katapayadiNumber: kRes.single,
      letterBreakdown,
      planet: PLANET_DATA[kRes.single],
      compoundInfo: COMPOUND_MEANINGS[kRes.compound],
    };
  }

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

  // Master Numbers handling in Pythagorean
  const isMaster =
    system === "pythagorean" &&
    [11, 22, 33, 44].includes(compoundNumber);

  let masterNumberTitleEn: string | undefined;
  let masterNumberTitleTa: string | undefined;

  if (isMaster) {
    if (compoundNumber === 11) {
      masterNumberTitleEn = "Master Number 11: The Intuitive Illuminator";
      masterNumberTitleTa = "மகா எண் 11: உள்ளுணர்வு மற்றும் ஆன்ம ஒளி";
    } else if (compoundNumber === 22) {
      masterNumberTitleEn = "Master Number 22: The Master Builder";
      masterNumberTitleTa = "மகா எண் 22: மகா சிற்பி மற்றும் சாதனையாளர்";
    } else if (compoundNumber === 33) {
      masterNumberTitleEn = "Master Number 33: The Master Teacher of Compassion";
      masterNumberTitleTa = "மகா எண் 33: பேரன்பின் மகா ஆசான்";
    } else if (compoundNumber === 44) {
      masterNumberTitleEn = "Master Number 44: The Master Architect of Public Welfare";
      masterNumberTitleTa = "மகா எண் 44: மக்கள் நலப் பேரமைப்பாளர்";
    }
  }

  return {
    inputName: rawName,
    cleanedLatin,
    system,
    compoundNumber,
    nameNumber,
    soulUrgeNumber,
    personalityNumber,
    isMasterNumber: isMaster,
    masterNumberTitleEn,
    masterNumberTitleTa,
    katapayadiNumber: katapayadiResult?.single,
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


