/**
 * Tamil Nakshatra (27 நட்சத்திரங்கள்), Rasi (12 ராசிகள்), 4 Padams,
 * Auspicious Starting Syllables (நாம நட்சத்திர எழுத்துக்கள்),
 * and Astronomical Sidereal Moon Calculation (Lahiri / Chitrapaksha Ayanamsa).
 */

export interface NakshatraEntry {
  index: number; // 1..27
  slug: string;
  nameEn: string;
  nameTa: string;
  rasiEn: string;
  rasiTa: string;
  rulingPlanetEn: string;
  rulingPlanetTa: string;
  deityEn: string;
  deityTa: string;
  padamSyllablesLatin: [string, string, string, string];
  padamSyllablesTamil: [string, string, string, string];
  allSyllablesLatin: string[];
  allSyllablesTamil: string[];
}

export interface BirthStarCalculation {
  utcIso: string;
  tropicalMoonLonDeg: number;
  lahiriAyanamsaDeg: number;
  siderealMoonLonDeg: number;
  nakshatra: NakshatraEntry;
  padam: 1 | 2 | 3 | 4;
  rasiEn: string;
  rasiTa: string;
  recommendedSyllableLatin: string;
  recommendedSyllableTamil: string;
  allStarSyllablesLatin: string[];
  allStarSyllablesTamil: string[];
  nearBoundaryWarning?: string;
}

export const TAMIL_NAKSHATRAS: NakshatraEntry[] = [
  {
    index: 1,
    slug: "ashwini",
    nameEn: "Ashwini",
    nameTa: "அசுவினி",
    rasiEn: "Mesham (Aries)",
    rasiTa: "மேஷம்",
    rulingPlanetEn: "Ketu",
    rulingPlanetTa: "கேது",
    deityEn: "Ashwini Kumaras",
    deityTa: "அஸ்வினி தேவர்கள்",
    padamSyllablesLatin: ["Chu", "Che", "Cho", "La"],
    padamSyllablesTamil: ["சு", "சே", "சோ", "ல"],
    allSyllablesLatin: ["Chu", "Che", "Cho", "La", "Su", "Se", "So"],
    allSyllablesTamil: ["சு", "சே", "சோ", "ல"],
  },
  {
    index: 2,
    slug: "bharani",
    nameEn: "Bharani",
    nameTa: "பரணி",
    rasiEn: "Mesham (Aries)",
    rasiTa: "மேஷம்",
    rulingPlanetEn: "Venus (Shukra)",
    rulingPlanetTa: "சுக்கிரன்",
    deityEn: "Yama",
    deityTa: "யமன்",
    padamSyllablesLatin: ["Li", "Lu", "Le", "Lo"],
    padamSyllablesTamil: ["லி", "லு", "லே", "லோ"],
    allSyllablesLatin: ["Li", "Lu", "Le", "Lo"],
    allSyllablesTamil: ["லி", "லு", "லே", "லோ"],
  },
  {
    index: 3,
    slug: "karthigai",
    nameEn: "Karthigai (Krittika)",
    nameTa: "கார்த்திகை",
    rasiEn: "Mesham (Padam 1) / Rishabam (Padam 2-4)",
    rasiTa: "மேஷம் (1) / ரிஷபம் (2-4)",
    rulingPlanetEn: "Sun (Surya)",
    rulingPlanetTa: "சூரியன்",
    deityEn: "Agni / Murugan",
    deityTa: "அக்னி / முருகன்",
    padamSyllablesLatin: ["A", "I", "U", "E"],
    padamSyllablesTamil: ["அ", "இ", "உ", "எ"],
    allSyllablesLatin: ["A", "Aa", "I", "Ee", "U", "E", "Ae"],
    allSyllablesTamil: ["அ", "ஆ", "இ", "ஈ", "உ", "எ", "ஏ"],
  },
  {
    index: 4,
    slug: "rohini",
    nameEn: "Rohini",
    nameTa: "ரோகிணி",
    rasiEn: "Rishabam (Taurus)",
    rasiTa: "ரிஷபம்",
    rulingPlanetEn: "Moon (Chandra)",
    rulingPlanetTa: "சந்திரன்",
    deityEn: "Brahma",
    deityTa: "பிரம்மா",
    padamSyllablesLatin: ["O", "Va", "Vi", "Vu"],
    padamSyllablesTamil: ["ஒ", "வ", "வி", "வு"],
    allSyllablesLatin: ["O", "Va", "Vi", "Vu", "Vaa", "Vee"],
    allSyllablesTamil: ["ஒ", "ஓ", "வ", "வா", "வி", "வீ", "வு"],
  },
  {
    index: 5,
    slug: "mrigashirsha",
    nameEn: "Mirugaseersham (Mrigashira)",
    nameTa: "மிருகசீரிஷம்",
    rasiEn: "Rishabam (1-2) / Mithunam (3-4)",
    rasiTa: "ரிஷபம் (1-2) / மிதுனம் (3-4)",
    rulingPlanetEn: "Mars (Chevvai)",
    rulingPlanetTa: "செவ்வாய்",
    deityEn: "Soma (Chandra)",
    deityTa: "சோமன்",
    padamSyllablesLatin: ["Ve", "Vo", "Ka", "Ki"],
    padamSyllablesTamil: ["வே", "வோ", "க", "கி"],
    allSyllablesLatin: ["Ve", "Vo", "Ka", "Ki", "Kaa", "Kee"],
    allSyllablesTamil: ["வே", "வோ", "க", "கா", "கி", "கீ"],
  },
  {
    index: 6,
    slug: "thiruvathirai",
    nameEn: "Thiruvathirai (Ardra)",
    nameTa: "திருவாதிரை",
    rasiEn: "Mithunam (Gemini)",
    rasiTa: "மிதுனம்",
    rulingPlanetEn: "Rahu",
    rulingPlanetTa: "ராகு",
    deityEn: "Rudra (Shiva)",
    deityTa: "ருத்ரன் (சிவன்)",
    padamSyllablesLatin: ["Ku", "Gha", "Nga", "Cha"],
    padamSyllablesTamil: ["கு", "க", "ங", "ச"],
    allSyllablesLatin: ["Ku", "Koo", "Gha", "Cha", "Sa"],
    allSyllablesTamil: ["கு", "கூ", "க", "ங", "ச"],
  },
  {
    index: 7,
    slug: "punarpoosam",
    nameEn: "Punarpoosam (Punarvasu)",
    nameTa: "புனர்பூசம்",
    rasiEn: "Mithunam (1-3) / Kadagam (4)",
    rasiTa: "மிதுனம் (1-3) / கடகம் (4)",
    rulingPlanetEn: "Jupiter (Guru)",
    rulingPlanetTa: "குரு",
    deityEn: "Aditi",
    deityTa: "அதிதி",
    padamSyllablesLatin: ["Ke", "Ko", "Ha", "Hi"],
    padamSyllablesTamil: ["கே", "கோ", "ஹ", "ஹி"],
    allSyllablesLatin: ["Ke", "Ko", "Ha", "Hi", "Ka", "Ki"],
    allSyllablesTamil: ["கே", "கோ", "ஹ", "ஹி", "க", "கி"],
  },
  {
    index: 8,
    slug: "poosam",
    nameEn: "Poosam (Pushya)",
    nameTa: "பூசம்",
    rasiEn: "Kadagam (Cancer)",
    rasiTa: "கடகம்",
    rulingPlanetEn: "Saturn (Shani)",
    rulingPlanetTa: "சனி",
    deityEn: "Brihaspati",
    deityTa: "பிரகஸ்பதி",
    padamSyllablesLatin: ["Hu", "He", "Ho", "Da"],
    padamSyllablesTamil: ["ஹு", "ஹே", "ஹோ", "ட"],
    allSyllablesLatin: ["Hu", "He", "Ho", "Da", "Tha"],
    allSyllablesTamil: ["ஹு", "ஹே", "ஹோ", "ட", "த"],
  },
  {
    index: 9,
    slug: "ayilyam",
    nameEn: "Ayilyam (Ashlesha)",
    nameTa: "ஆயில்யம்",
    rasiEn: "Kadagam (Cancer)",
    rasiTa: "கடகம்",
    rulingPlanetEn: "Mercury (Budha)",
    rulingPlanetTa: "புதன்",
    deityEn: "Nagas",
    deityTa: "நாக தேவதைகள்",
    padamSyllablesLatin: ["Di", "Du", "De", "Do"],
    padamSyllablesTamil: ["டி", "டு", "டே", "டோ"],
    allSyllablesLatin: ["Di", "Du", "De", "Do", "Thi", "Thu", "The", "Tho"],
    allSyllablesTamil: ["டி", "டு", "டே", "டோ", "தி", "து", "தே", "தோ"],
  },
  {
    index: 10,
    slug: "magam",
    nameEn: "Magam (Magha)",
    nameTa: "மகம்",
    rasiEn: "Simmam (Leo)",
    rasiTa: "சிம்மம்",
    rulingPlanetEn: "Ketu",
    rulingPlanetTa: "கேது",
    deityEn: "Pitris (Ancestors)",
    deityTa: "பித்ருக்கள்",
    padamSyllablesLatin: ["Ma", "Mi", "Mu", "Me"],
    padamSyllablesTamil: ["ம", "மி", "மு", "மே"],
    allSyllablesLatin: ["Ma", "Maa", "Mi", "Mee", "Mu", "Moo", "Me"],
    allSyllablesTamil: ["ம", "மா", "மி", "மீ", "மு", "மூ", "மே"],
  },
  {
    index: 11,
    slug: "pooram",
    nameEn: "Pooram (Purva Phalguni)",
    nameTa: "பூரம்",
    rasiEn: "Simmam (Leo)",
    rasiTa: "சிம்மம்",
    rulingPlanetEn: "Venus (Shukra)",
    rulingPlanetTa: "சுக்கிரன்",
    deityEn: "Bhaga",
    deityTa: "பகன்",
    padamSyllablesLatin: ["Mo", "Ta", "Ti", "Tu"],
    padamSyllablesTamil: ["மோ", "ட", "டி", "டு"],
    allSyllablesLatin: ["Mo", "Ta", "Ti", "Tu", "Tha", "Thi", "Thu"],
    allSyllablesTamil: ["மோ", "ட", "டி", "டு", "த", "தி", "து"],
  },
  {
    index: 12,
    slug: "uthiram",
    nameEn: "Uthiram (Uttara Phalguni)",
    nameTa: "உத்திரம்",
    rasiEn: "Simmam (1) / Kanni (2-4)",
    rasiTa: "சிம்மம் (1) / கன்னி (2-4)",
    rulingPlanetEn: "Sun (Surya)",
    rulingPlanetTa: "சூரியன்",
    deityEn: "Aryaman",
    deityTa: "ஆர்யமான்",
    padamSyllablesLatin: ["Te", "To", "Pa", "Pi"],
    padamSyllablesTamil: ["டே", "டோ", "ப", "பி"],
    allSyllablesLatin: ["Te", "To", "The", "Tho", "Pa", "Paa", "Pi", "Pee"],
    allSyllablesTamil: ["டே", "டோ", "தே", "தோ", "ப", "பா", "பி", "பீ"],
  },
  {
    index: 13,
    slug: "hastham",
    nameEn: "Hastham (Hasta)",
    nameTa: "அஸ்தம்",
    rasiEn: "Kanni (Virgo)",
    rasiTa: "கன்னி",
    rulingPlanetEn: "Moon (Chandra)",
    rulingPlanetTa: "சந்திரன்",
    deityEn: "Savitar (Surya)",
    deityTa: "சவிதா (சூரியன்)",
    padamSyllablesLatin: ["Pu", "Sha", "Na", "Tha"],
    padamSyllablesTamil: ["பு", "ஷ", "ண", "த"],
    allSyllablesLatin: ["Pu", "Poo", "Sha", "Sa", "Na", "Tha"],
    allSyllablesTamil: ["பு", "பூ", "ஷ", "ச", "ண", "ந", "த"],
  },
  {
    index: 14,
    slug: "chithirai",
    nameEn: "Chithirai (Chitra)",
    nameTa: "சித்திரை",
    rasiEn: "Kanni (1-2) / Thulam (3-4)",
    rasiTa: "கன்னி (1-2) / துலாம் (3-4)",
    rulingPlanetEn: "Mars (Chevvai)",
    rulingPlanetTa: "செவ்வாய்",
    deityEn: "Vishwakarma",
    deityTa: "விஸ்வகர்மா",
    padamSyllablesLatin: ["Pe", "Po", "Ra", "Ri"],
    padamSyllablesTamil: ["பே", "போ", "ர", "ரி"],
    allSyllablesLatin: ["Pe", "Po", "Ra", "Raa", "Ri", "Ree"],
    allSyllablesTamil: ["பே", "போ", "ர", "ரா", "ரி", "ரீ"],
  },
  {
    index: 15,
    slug: "swathi",
    nameEn: "Swathi (Swati)",
    nameTa: "சுவாதி",
    rasiEn: "Thulam (Libra)",
    rasiTa: "துலாம்",
    rulingPlanetEn: "Rahu",
    rulingPlanetTa: "ராகு",
    deityEn: "Vayu",
    deityTa: "வாயு பகவான்",
    padamSyllablesLatin: ["Ru", "Re", "Ro", "Tha"],
    padamSyllablesTamil: ["ரு", "ரே", "ரோ", "த"],
    allSyllablesLatin: ["Ru", "Re", "Ro", "Tha", "Ta", "Thaa"],
    allSyllablesTamil: ["ரு", "ரே", "ரோ", "த", "தா"],
  },
  {
    index: 16,
    slug: "visakam",
    nameEn: "Visakam (Vishakha)",
    nameTa: "விசாகம்",
    rasiEn: "Thulam (1-3) / Viruchigam (4)",
    rasiTa: "துலாம் (1-3) / விருச்சிகம் (4)",
    rulingPlanetEn: "Jupiter (Guru)",
    rulingPlanetTa: "குரு",
    deityEn: "Indra-Agni",
    deityTa: "இந்திராணி / அக்னி",
    padamSyllablesLatin: ["Thi", "Thu", "The", "Tho"],
    padamSyllablesTamil: ["தி", "து", "தே", "தோ"],
    allSyllablesLatin: ["Thi", "Thu", "The", "Tho", "Ti", "Tu", "Te", "To"],
    allSyllablesTamil: ["தி", "தீ", "து", "தூ", "தே", "தோ"],
  },
  {
    index: 17,
    slug: "anusham",
    nameEn: "Anusham (Anuradha)",
    nameTa: "அனுஷம்",
    rasiEn: "Viruchigam (Scorpio)",
    rasiTa: "விருச்சிகம்",
    rulingPlanetEn: "Saturn (Shani)",
    rulingPlanetTa: "சனி",
    deityEn: "Mitra",
    deityTa: "மித்ரன்",
    padamSyllablesLatin: ["Na", "Ni", "Nu", "Ne"],
    padamSyllablesTamil: ["ந", "நி", "நு", "நே"],
    allSyllablesLatin: ["Na", "Naa", "Ni", "Nee", "Nu", "Ne"],
    allSyllablesTamil: ["ந", "நா", "நி", "நீ", "நு", "நே"],
  },
  {
    index: 18,
    slug: "kettai",
    nameEn: "Kettai (Jyeshtha)",
    nameTa: "கேட்டை",
    rasiEn: "Viruchigam (Scorpio)",
    rasiTa: "விருச்சிகம்",
    rulingPlanetEn: "Mercury (Budha)",
    rulingPlanetTa: "புதன்",
    deityEn: "Indra",
    deityTa: "இந்திரன்",
    padamSyllablesLatin: ["No", "Ya", "Yi", "Yu"],
    padamSyllablesTamil: ["நோ", "ய", "யி", "யு"],
    allSyllablesLatin: ["No", "Ya", "Yaa", "Yi", "Yu"],
    allSyllablesTamil: ["நோ", "ய", "யா", "யி", "யு"],
  },
  {
    index: 19,
    slug: "moolam",
    nameEn: "Moolam (Mula)",
    nameTa: "மூலம்",
    rasiEn: "Dhanusu (Sagittarius)",
    rasiTa: "தனுசு",
    rulingPlanetEn: "Ketu",
    rulingPlanetTa: "கேது",
    deityEn: "Nirriti",
    deityTa: "நிருதி",
    padamSyllablesLatin: ["Ye", "Yo", "Bha", "Bhi"],
    padamSyllablesTamil: ["யே", "யோ", "ப", "பி"],
    allSyllablesLatin: ["Ye", "Yo", "Bha", "Bhi", "Pa", "Pi"],
    allSyllablesTamil: ["யே", "யோ", "ப", "பா", "பி", "பீ"],
  },
  {
    index: 20,
    slug: "pooradam",
    nameEn: "Pooradam (Purva Ashadha)",
    nameTa: "பூராடம்",
    rasiEn: "Dhanusu (Sagittarius)",
    rasiTa: "தனுசு",
    rulingPlanetEn: "Venus (Shukra)",
    rulingPlanetTa: "சுக்கிரன்",
    deityEn: "Apah (Water Goddess)",
    deityTa: "வருணன் / ஜல தேவதை",
    padamSyllablesLatin: ["Bhu", "Dha", "Pha", "Dha"],
    padamSyllablesTamil: ["பு", "த", "ப", "த"],
    allSyllablesLatin: ["Bhu", "Pu", "Dha", "Tha", "Pha", "Pa"],
    allSyllablesTamil: ["பு", "பூ", "த", "தா", "ப"],
  },
  {
    index: 21,
    slug: "uthiradam",
    nameEn: "Uthiradam (Uttara Ashadha)",
    nameTa: "உத்திராடம்",
    rasiEn: "Dhanusu (1) / Magaram (2-4)",
    rasiTa: "தனுசு (1) / மகரம் (2-4)",
    rulingPlanetEn: "Sun (Surya)",
    rulingPlanetTa: "சூரியன்",
    deityEn: "Vishvadevas",
    deityTa: "விஸ்வதேவர்கள்",
    padamSyllablesLatin: ["Be", "Bo", "Ja", "Ji"],
    padamSyllablesTamil: ["பே", "போ", "ஜ", "ஜி"],
    allSyllablesLatin: ["Be", "Bo", "Pe", "Po", "Ja", "Ji", "Sa", "Si"],
    allSyllablesTamil: ["பே", "போ", "ஜ", "ஜி", "ச", "சி"],
  },
  {
    index: 22,
    slug: "thiruvonam",
    nameEn: "Thiruvonam (Shravana)",
    nameTa: "திருவோணம்",
    rasiEn: "Magaram (Capricorn)",
    rasiTa: "மகரம்",
    rulingPlanetEn: "Moon (Chandra)",
    rulingPlanetTa: "சந்திரன்",
    deityEn: "Vishnu (Perumal)",
    deityTa: "மகாவிஷ்ணு",
    padamSyllablesLatin: ["Khi", "Khu", "Khe", "Kho"],
    padamSyllablesTamil: ["கி", "கு", "கே", "கோ"],
    allSyllablesLatin: ["Khi", "Khu", "Khe", "Kho", "Ki", "Ku", "Ke", "Ko"],
    allSyllablesTamil: ["கி", "கீ", "கு", "கூ", "கே", "கோ"],
  },
  {
    index: 23,
    slug: "avittam",
    nameEn: "Avittam (Dhanishta)",
    nameTa: "அவிட்டம்",
    rasiEn: "Magaram (1-2) / Kumbam (3-4)",
    rasiTa: "மகரம் (1-2) / கும்பம் (3-4)",
    rulingPlanetEn: "Mars (Chevvai)",
    rulingPlanetTa: "செவ்வாய்",
    deityEn: "Ashta Vasus",
    deityTa: "அஷ்ட வசுக்கள்",
    padamSyllablesLatin: ["Ga", "Gi", "Gu", "Ge"],
    padamSyllablesTamil: ["க", "கி", "கு", "கே"],
    allSyllablesLatin: ["Ga", "Gi", "Gu", "Ge", "Ka", "Ki", "Ku", "Ke"],
    allSyllablesTamil: ["க", "கா", "கி", "கு", "கே"],
  },
  {
    index: 24,
    slug: "sathayam",
    nameEn: "Sathayam (Shatabhisha)",
    nameTa: "சதயம்",
    rasiEn: "Kumbam (Aquarius)",
    rasiTa: "கும்பம்",
    rulingPlanetEn: "Rahu",
    rulingPlanetTa: "ராகு",
    deityEn: "Varuna",
    deityTa: "வருணன்",
    padamSyllablesLatin: ["Go", "Sa", "Si", "Su"],
    padamSyllablesTamil: ["கோ", "ச", "சி", "சு"],
    allSyllablesLatin: ["Go", "Ko", "Sa", "Saa", "Si", "See", "Su", "Soo"],
    allSyllablesTamil: ["கோ", "ச", "சா", "சி", "சீ", "சு", "சூ"],
  },
  {
    index: 25,
    slug: "poorattathi",
    nameEn: "Poorattathi (Purva Bhadrapada)",
    nameTa: "பூரட்டாதி",
    rasiEn: "Kumbam (1-3) / Meenam (4)",
    rasiTa: "கும்பம் (1-3) / மீனம் (4)",
    rulingPlanetEn: "Jupiter (Guru)",
    rulingPlanetTa: "குரு",
    deityEn: "Aja Ekapada",
    deityTa: "அஜ ஏகபாதர்",
    padamSyllablesLatin: ["Se", "So", "Tha", "Thi"],
    padamSyllablesTamil: ["சே", "சோ", "த", "தி"],
    allSyllablesLatin: ["Se", "So", "Tha", "Thi", "Da", "Di"],
    allSyllablesTamil: ["சே", "சோ", "த", "தா", "தி", "தீ"],
  },
  {
    index: 26,
    slug: "uthirattathi",
    nameEn: "Uthirattathi (Uttara Bhadrapada)",
    nameTa: "உத்திரட்டாதி",
    rasiEn: "Meenam (Pisces)",
    rasiTa: "மீனம்",
    rulingPlanetEn: "Saturn (Shani)",
    rulingPlanetTa: "சனி",
    deityEn: "Ahirbudhnya",
    deityTa: "அஹிர்புத்யன்",
    padamSyllablesLatin: ["Thu", "Sha", "Jha", "Tha"],
    padamSyllablesTamil: ["து", "ஷ", "ஞ", "த"],
    allSyllablesLatin: ["Thu", "Du", "Sha", "Sa", "Jha", "Tha"],
    allSyllablesTamil: ["து", "தூ", "ஷ", "ச", "ஞ", "த"],
  },
  {
    index: 27,
    slug: "revathi",
    nameEn: "Revathi",
    nameTa: "ரேவதி",
    rasiEn: "Meenam (Pisces)",
    rasiTa: "மீனம்",
    rulingPlanetEn: "Mercury (Budha)",
    rulingPlanetTa: "புதன்",
    deityEn: "Pushan",
    deityTa: "பூஷன்",
    padamSyllablesLatin: ["De", "Do", "Cha", "Chi"],
    padamSyllablesTamil: ["தே", "தோ", "ச", "சி"],
    allSyllablesLatin: ["De", "Do", "The", "Tho", "Cha", "Chi", "Sa", "Si"],
    allSyllablesTamil: ["தே", "தோ", "ச", "சா", "சி", "சீ"],
  },
];

export const TAMIL_RASIS = [
  { index: 1, nameEn: "Mesham (Aries)", nameTa: "மேஷம்" },
  { index: 2, nameEn: "Rishabam (Taurus)", nameTa: "ரிஷபம்" },
  { index: 3, nameEn: "Mithunam (Gemini)", nameTa: "மிதுனம்" },
  { index: 4, nameEn: "Kadagam (Cancer)", nameTa: "கடகம்" },
  { index: 5, nameEn: "Simmam (Leo)", nameTa: "சிம்மம்" },
  { index: 6, nameEn: "Kanni (Virgo)", nameTa: "கன்னி" },
  { index: 7, nameEn: "Thulam (Libra)", nameTa: "துலாம்" },
  { index: 8, nameEn: "Viruchigam (Scorpio)", nameTa: "விருச்சிகம்" },
  { index: 9, nameEn: "Dhanusu (Sagittarius)", nameTa: "தனுசு" },
  { index: 10, nameEn: "Magaram (Capricorn)", nameTa: "மகரம்" },
  { index: 11, nameEn: "Kumbam (Aquarius)", nameTa: "கும்பம்" },
  { index: 12, nameEn: "Meenam (Pisces)", nameTa: "மீனம்" },
];

export function getNakshatraBySlug(slug: string): NakshatraEntry | undefined {
  return TAMIL_NAKSHATRAS.find(
    (n) =>
      n.slug.toLowerCase() === slug.toLowerCase() ||
      n.nameEn.toLowerCase().includes(slug.toLowerCase()) ||
      n.nameTa === slug
  );
}

/**
 * Meeus high-precision Lunar Ecliptic Longitude + Lahiri (Chitrapaksha) Ayanamsa
 * Accurate to ~2 arc-minutes, more than sufficient for 13°20' Nakshatra & 3°20' Padam.
 */
export function calculateBirthStarFromDateTime(
  dateStr: string, // YYYY-MM-DD
  timeStr: string = "12:00", // HH:mm (IST default +05:30)
  tzOffsetHours: number = 5.5
): BirthStarCalculation {
  const [y, m, d] = dateStr.split("-").map((v) => parseInt(v, 10));
  const [hh, mm] = timeStr.split(":").map((v) => parseInt(v, 10));

  const utcMs =
    Date.UTC(y || 2026, (m || 1) - 1, d || 1, hh || 12, mm || 0, 0) -
    tzOffsetHours * 3600 * 1000;
  const utcDate = new Date(utcMs);

  // Julian Day (JD)
  const jd = utcMs / 86400000 + 2440587.5;
  // Julian centuries since J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  const deg2rad = (deg: number) => (deg * Math.PI) / 180;
  const norm360 = (deg: number) => ((deg % 360) + 360) % 360;

  // Fundamental lunar arguments (Meeus Ch. 47)
  const Lprime = norm360(
    218.3164477 +
      481267.88123421 * T -
      0.0015786 * T * T +
      (T * T * T) / 538841
  );
  const D = norm360(
    297.8501921 +
      445267.1114034 * T -
      0.0018819 * T * T +
      (T * T * T) / 545868
  );
  const M = norm360(
    357.5291092 + 35999.0502909 * T - 0.0001536 * T * T
  );
  const Mprime = norm360(
    134.9633964 +
      477198.8675055 * T +
      0.0087414 * T * T +
      (T * T * T) / 69699
  );
  const F = norm360(
    93.272095 +
      483202.0175233 * T -
      0.0036539 * T * T -
      (T * T * T) / 3526000
  );

  // Periodic perturbations in longitude (degrees)
  let dLambda =
    6.288774 * Math.sin(deg2rad(Mprime)) +
    1.274027 * Math.sin(deg2rad(2 * D - Mprime)) +
    0.658314 * Math.sin(deg2rad(2 * D)) +
    0.213618 * Math.sin(deg2rad(2 * Mprime)) -
    0.185116 * Math.sin(deg2rad(M)) -
    0.114332 * Math.sin(deg2rad(2 * F)) +
    0.058793 * Math.sin(deg2rad(2 * D - 2 * Mprime)) +
    0.057066 * Math.sin(deg2rad(2 * D - M - Mprime)) +
    0.053322 * Math.sin(deg2rad(2 * D + Mprime)) +
    0.045758 * Math.sin(deg2rad(2 * D - M)) -
    0.040923 * Math.sin(deg2rad(M - Mprime)) -
    0.034720 * Math.sin(deg2rad(D)) -
    0.030383 * Math.sin(deg2rad(M + Mprime)) +
    0.015327 * Math.sin(deg2rad(2 * D - 2 * F));

  const tropicalMoonLonDeg = norm360(Lprime + dLambda);

  // Lahiri (Chitrapaksha) Ayanamsa: ~23.853° at J2000.0 + precession 50.29"/yr
  const lahiriAyanamsaDeg = 23.853056 + (T * 100 * 50.290966) / 3600;
  const siderealMoonLonDeg = norm360(tropicalMoonLonDeg - lahiriAyanamsaDeg);

  const nakshatraSpan = 360 / 27; // 13.333333° (13°20')
  const padamSpan = nakshatraSpan / 4; // 3.333333° (3°20')

  const nakshatraIdx0 = Math.floor(siderealMoonLonDeg / nakshatraSpan) % 27;
  const offsetInNakshatra = siderealMoonLonDeg - nakshatraIdx0 * nakshatraSpan;
  const padam = (Math.min(3, Math.floor(offsetInNakshatra / padamSpan)) + 1) as
    | 1
    | 2
    | 3
    | 4;

  const rasiIdx0 = Math.floor(siderealMoonLonDeg / 30) % 12;
  const rasi = TAMIL_RASIS[rasiIdx0];
  const nakshatra = TAMIL_NAKSHATRAS[nakshatraIdx0];

  // Check if within 0.15 deg (~9 arcmin) of a padam boundary
  const remInPadam = offsetInNakshatra % padamSpan;
  let nearBoundaryWarning: string | undefined;
  if (remInPadam < 0.15 || padamSpan - remInPadam < 0.15) {
    nearBoundaryWarning =
      "Moon is close to a Padam boundary (< 9 arc-minutes). Verify exact birth minute with your family Panchangam / Jyotishi.";
  }

  return {
    utcIso: utcDate.toISOString(),
    tropicalMoonLonDeg: Number(tropicalMoonLonDeg.toFixed(4)),
    lahiriAyanamsaDeg: Number(lahiriAyanamsaDeg.toFixed(4)),
    siderealMoonLonDeg: Number(siderealMoonLonDeg.toFixed(4)),
    nakshatra,
    padam,
    rasiEn: rasi.nameEn,
    rasiTa: rasi.nameTa,
    recommendedSyllableLatin: nakshatra.padamSyllablesLatin[padam - 1],
    recommendedSyllableTamil: nakshatra.padamSyllablesTamil[padam - 1],
    allStarSyllablesLatin: nakshatra.allSyllablesLatin,
    allStarSyllablesTamil: nakshatra.allSyllablesTamil,
    nearBoundaryWarning,
  };
}

