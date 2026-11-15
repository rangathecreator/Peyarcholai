/**
 * Book-Referenced Astrology & Numerology Method Citations (Task 22 — Option A)
 * Original structured synthesis tables citing public-domain & canonical methodologies:
 * - Cheiro's Book of Numbers (1926) — Chaldean compound archetypes
 * - Sepharial (The Kabala of Numbers, 1911) — Pythagorean Destiny / Soul Urge / Personality
 * - Katapayadi Sankhya — Classical Tamil/Vedic consonant cipher
 * - Vakya & Thirukkanitha Panchangam + Brihat Parashara Hora Shastra — 27 Nakshatra canon
 */

export interface MethodCitation {
  methodId: "chaldean" | "pythagorean" | "katapayadi" | "nakshatra";
  titleEn: string;
  titleTa: string;
  primarySource: string;
  methodologyNoteEn: string;
  methodologyNoteTa: string;
}

export const NUMEROLOGY_METHOD_CITATIONS: Record<
  "chaldean" | "pythagorean" | "katapayadi",
  MethodCitation
> = {
  chaldean: {
    methodId: "chaldean",
    titleEn: "Chaldean Vibration & Compound System",
    titleTa: "சால்டியன் எண் கணித முறை (Cheiro)",
    primarySource:
      "Cheiro's Book of Numbers (1926, Public Domain) — 1–8 Sound-Vibration Mapping",
    methodologyNoteEn:
      "Assigns values 1–8 based on phonetic vibration (omitting 9 as sacred), evaluating both the single-digit root (1–9) and compound archetype (10–75).",
    methodologyNoteTa:
      "ஒலி அதிர்வு அடிப்படையில் 1–8 எண்களைப் பயன்படுத்தி, ஒற்றை எண் மற்றும் கூட்டு எண் (10–75) பலன்களைக் கணிக்கிறது.",
  },
  pythagorean: {
    methodId: "pythagorean",
    titleEn: "Pythagorean Alphabet & Master Number System",
    titleTa: "பிதாகரஸ் எண் கணித முறை (Sepharial)",
    primarySource:
      "Sepharial, The Kabala of Numbers (1911) & Julia Seton, The Science of Numerology (1924)",
    methodologyNoteEn:
      "Maps A–Z sequentially 1–9, separating Destiny (all letters), Soul Urge (vowels), and Personality (consonants), with Master Numbers 11, 22, and 33.",
    methodologyNoteTa:
      "A–Z எழுத்துகளுக்கு 1–9 வரிசை எண்களை வழங்கி, உயிர் எண் (Soul Urge), மெய் எண் மற்றும் முதன்மை எண்களை (11, 22, 33) கணக்கிடுகிறது.",
  },
  katapayadi: {
    methodId: "katapayadi",
    titleEn: "Katapayadi Sankhya (Classical Tamil/Vedic Cipher)",
    titleTa: "கடபயாதி சங்க்யா (மரபுத் தமிழ் எண் முறை)",
    primarySource:
      "Classical Katapayadi Sankhya Tradition (South Indian Carnatic & Astronomical Canon)",
    methodologyNoteEn:
      "Maps Tamil/Indic consonants directly to digits 0–9 (க-1, த-6, ப-1, ய-1...), preserving native Tamil phonetic weight without English transliteration loss.",
    methodologyNoteTa:
      "ஆங்கில எழுத்துமாற்றம் இன்றி, நேரடித் தமிழ் மெய் எழுத்துகளின் ஒலி மதிப்பைக் கொண்டு பாரம்பரிய எண் மதிப்பைக் கணக்கிடுகிறது.",
  },
};

export interface NakshatraCanonicalMeta {
  slug: string;
  ganaEn: "Deva (Divine)" | "Manushya (Human)" | "Rakshasa (Fierce/Dynamic)";
  ganaTa: string;
  elementEn: "Earth" | "Water" | "Fire" | "Air" | "Ether";
  lordEn: string;
  canonicalSource: string;
}

export const NAKSHATRA_CANONICAL_ATTRIBUTES: Record<string, NakshatraCanonicalMeta> = {
  ashwini: { slug: "ashwini", ganaEn: "Deva (Divine)", ganaTa: "தேவ கணம்", elementEn: "Earth", lordEn: "Ketu", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  bharani: { slug: "bharani", ganaEn: "Manushya (Human)", ganaTa: "மனுஷ கணம்", elementEn: "Earth", lordEn: "Venus (Shukra)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  krittika: { slug: "krittika", ganaEn: "Rakshasa (Fierce/Dynamic)", ganaTa: "ராட்சச கணம்", elementEn: "Earth", lordEn: "Sun (Surya)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  rohini: { slug: "rohini", ganaEn: "Manushya (Human)", ganaTa: "மனுஷ கணம்", elementEn: "Earth", lordEn: "Moon (Chandra)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  mrigashirsha: { slug: "mrigashirsha", ganaEn: "Deva (Divine)", ganaTa: "தேவ கணம்", elementEn: "Earth", lordEn: "Mars (Kuja)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  ardra: { slug: "ardra", ganaEn: "Manushya (Human)", ganaTa: "மனுஷ கணம்", elementEn: "Water", lordEn: "Rahu", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  punarvasu: { slug: "punarvasu", ganaEn: "Deva (Divine)", ganaTa: "தேவ கணம்", elementEn: "Water", lordEn: "Jupiter (Guru)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  pushya: { slug: "pushya", ganaEn: "Deva (Divine)", ganaTa: "தேவ கணம்", elementEn: "Water", lordEn: "Saturn (Shani)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  ashlesha: { slug: "ashlesha", ganaEn: "Rakshasa (Fierce/Dynamic)", ganaTa: "ராட்சச கணம்", elementEn: "Water", lordEn: "Mercury (Budha)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  magha: { slug: "magha", ganaEn: "Rakshasa (Fierce/Dynamic)", ganaTa: "ராட்சச கணம்", elementEn: "Water", lordEn: "Ketu", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  purva_phalguni: { slug: "purva_phalguni", ganaEn: "Manushya (Human)", ganaTa: "மனுஷ கணம்", elementEn: "Water", lordEn: "Venus (Shukra)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  uttara_phalguni: { slug: "uttara_phalguni", ganaEn: "Manushya (Human)", ganaTa: "மனுஷ கணம்", elementEn: "Fire", lordEn: "Sun (Surya)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  hasta: { slug: "hasta", ganaEn: "Deva (Divine)", ganaTa: "தேவ கணம்", elementEn: "Fire", lordEn: "Moon (Chandra)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  chitra: { slug: "chitra", ganaEn: "Rakshasa (Fierce/Dynamic)", ganaTa: "ராட்சச கணம்", elementEn: "Fire", lordEn: "Mars (Kuja)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  swati: { slug: "swati", ganaEn: "Deva (Divine)", ganaTa: "தேவ கணம்", elementEn: "Fire", lordEn: "Rahu", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  vishakha: { slug: "vishakha", ganaEn: "Rakshasa (Fierce/Dynamic)", ganaTa: "ராட்சச கணம்", elementEn: "Fire", lordEn: "Jupiter (Guru)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  anuradha: { slug: "anuradha", ganaEn: "Deva (Divine)", ganaTa: "தேவ கணம்", elementEn: "Fire", lordEn: "Saturn (Shani)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  jyeshtha: { slug: "jyeshtha", ganaEn: "Rakshasa (Fierce/Dynamic)", ganaTa: "ராட்சச கணம்", elementEn: "Air", lordEn: "Mercury (Budha)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  mula: { slug: "mula", ganaEn: "Rakshasa (Fierce/Dynamic)", ganaTa: "ராட்சச கணம்", elementEn: "Air", lordEn: "Ketu", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  purva_ashadha: { slug: "purva_ashadha", ganaEn: "Manushya (Human)", ganaTa: "மனுஷ கணம்", elementEn: "Air", lordEn: "Venus (Shukra)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  uttara_ashadha: { slug: "uttara_ashadha", ganaEn: "Manushya (Human)", ganaTa: "மனுஷ கணம்", elementEn: "Air", lordEn: "Sun (Surya)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  shravana: { slug: "shravana", ganaEn: "Deva (Divine)", ganaTa: "தேவ கணம்", elementEn: "Air", lordEn: "Moon (Chandra)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  dhanishta: { slug: "dhanishta", ganaEn: "Rakshasa (Fierce/Dynamic)", ganaTa: "ராட்சச கணம்", elementEn: "Ether", lordEn: "Mars (Kuja)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  shatabhisha: { slug: "shatabhisha", ganaEn: "Rakshasa (Fierce/Dynamic)", ganaTa: "ராட்சச கணம்", elementEn: "Ether", lordEn: "Rahu", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  purva_bhadrapada: { slug: "purva_bhadrapada", ganaEn: "Manushya (Human)", ganaTa: "மனுஷ கணம்", elementEn: "Ether", lordEn: "Jupiter (Guru)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  uttara_bhadrapada: { slug: "uttara_bhadrapada", ganaEn: "Manushya (Human)", ganaTa: "மனுஷ கணம்", elementEn: "Ether", lordEn: "Saturn (Shani)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
  revati: { slug: "revati", ganaEn: "Deva (Divine)", ganaTa: "தேவ கணம்", elementEn: "Ether", lordEn: "Mercury (Budha)", canonicalSource: "Vakya & Thirukkanitha Panchangam · Brihat Parashara Hora Shastra" },
};

export function getNakshatraCanonicalMeta(slug: string): NakshatraCanonicalMeta | undefined {
  return NAKSHATRA_CANONICAL_ATTRIBUTES[slug.toLowerCase()];
}

export function getNumerologyMethodCitation(
  system: "chaldean" | "pythagorean" | "katapayadi"
): MethodCitation {
  return NUMEROLOGY_METHOD_CITATIONS[system];
}
