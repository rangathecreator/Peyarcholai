/**
 * பெயர்ச்சோலை (Peyarcholai) — Visual Prompt & Internal Query Generator
 * Synthesizes deterministic fast filter queries and deep linguistic AI prompts
 * with multi-generation family tree and sibling harmonic matching.
 */

export interface QueryGeneratorConstraints {
  // Astrological & Numerical
  targetNumerologyNumber?: number; // 1 to 9
  numerologySystem?: 'pythagorean' | 'chaldean';
  nakshatraSlug?: string;
  startingLetters?: string[]; // e.g. ["க", "வி", "செ"]
  gender?: 'boy' | 'girl' | 'unisex' | 'all';

  // Linguistic & Purity
  isNativeTamilOnly?: boolean; // Strictly verified Sangam / Tolkappiyam roots
  minPronunciationScore?: number; // 70 to 100
  allowedSpellingRisk?: 'low' | 'medium' | 'low-medium' | 'any';
  multilingualConnotationSafe?: boolean; // Malayalam, Telugu, Kannada, Hindi, English
  meaningThemes?: string[];

  // Empirical Rarity
  rarityBand?: 'ultra_rare' | 'distinctive' | 'balanced' | 'popular' | 'any';

  // Family Tree & Harmonic Rhyming Context
  fatherName?: string;
  motherName?: string;
  parentNames?: string[];
  grandparentNames?: string[];
  familyInitialOrClan?: string;
  elderSiblingNames?: string[];
  siblingNames?: string[];
}

export interface GeneratedQueryPayload {
  deterministicFilter: {
    gender?: string;
    startingLetters?: string[];
    numerologyNumber?: number;
    minConfidence: number;
    maxSpellingRisk?: string;
    isNativeTamilOnly: boolean;
    rarityBand?: string;
  };
  aiLinguisticPrompt: string;
  activeConstraintCount: number;
}

/**
 * Builds deterministic filtering parameters and rich contextual LLM prompts.
 */
export function buildQueryAndPrompt(
  constraints: QueryGeneratorConstraints
): GeneratedQueryPayload {
  let count = 0;

  // 1. Deterministic DB/Shard Filter
  const isNative = constraints.isNativeTamilOnly ?? true;
  const deterministicFilter: GeneratedQueryPayload['deterministicFilter'] = {
    minConfidence: isNative ? 0.85 : 0.80,
    isNativeTamilOnly: isNative,
  };

  if (constraints.gender && constraints.gender !== 'all') {
    deterministicFilter.gender = constraints.gender;
    count++;
  }
  if (constraints.startingLetters && constraints.startingLetters.length > 0) {
    deterministicFilter.startingLetters = constraints.startingLetters;
    count++;
  }
  if (constraints.targetNumerologyNumber) {
    deterministicFilter.numerologyNumber = constraints.targetNumerologyNumber;
    count++;
  }
  if (constraints.allowedSpellingRisk && constraints.allowedSpellingRisk !== 'any') {
    deterministicFilter.maxSpellingRisk = constraints.allowedSpellingRisk;
    count++;
  }
  if (constraints.rarityBand && constraints.rarityBand !== 'any') {
    deterministicFilter.rarityBand = constraints.rarityBand;
    count++;
  }

  // 2. Synthesize AI Linguistic Prompt for OmniRoute Multi-Model Advisor
  const promptLines: string[] = [
    `You are the Chief Classical Tamil Linguistic Naming Expert for பெயர்ச்சோலை (Peyarcholai).`,
    `Generate culturally pure, meaningful, and phonetically harmonic Tamil baby names strictly complying with the following criteria:`,
    ``,
  ];

  if (constraints.gender && constraints.gender !== 'all') {
    promptLines.push(`- Gender: ${constraints.gender === 'boy' ? 'ஆண் (Boy)' : constraints.gender === 'girl' ? 'பெண் (Girl)' : 'இருபாலர் (Unisex)'}`);
  }
  if (constraints.startingLetters && constraints.startingLetters.length > 0) {
    promptLines.push(`- Starting Tamil Syllables / Letters: ${constraints.startingLetters.join(', ')}`);
  }
  if (constraints.targetNumerologyNumber) {
    promptLines.push(`- Target Numerology Compound Vibration: Number ${constraints.targetNumerologyNumber} (Pythagorean & Chaldean harmonized)`);
  }
  if (constraints.isNativeTamilOnly) {
    promptLines.push(`- Purity: STRICTLY authentic classical Tamil roots attested in Tolkappiyam, Sangam literature, or the Madras University Tamil Lexicon. Reject non-Tamil coinages.`);
  }
  if (constraints.minPronunciationScore) {
    promptLines.push(`- Ease of Pronunciation: Minimum score ${constraints.minPronunciationScore}/100. Must be effortless for global diaspora registration (passports, schools).`);
  }
  if (constraints.multilingualConnotationSafe) {
    promptLines.push(`- Multilingual Safety: Verify zero embarrassing or awkward homophones in Malayalam, Telugu, Kannada, Hindi, and English.`);
  }

  // Family Tree Matching
  const familyContext: string[] = [];
  if (constraints.fatherName) familyContext.push(`Father: ${constraints.fatherName}`);
  if (constraints.motherName) familyContext.push(`Mother: ${constraints.motherName}`);
  if (constraints.grandparentNames && constraints.grandparentNames.length > 0) {
    familyContext.push(`Grandparents: ${constraints.grandparentNames.join(', ')}`);
  }
  if (constraints.familyInitialOrClan) {
    familyContext.push(`Family Clan / Initial Cadence: ${constraints.familyInitialOrClan}`);
  }
  if (constraints.elderSiblingNames && constraints.elderSiblingNames.length > 0) {
    familyContext.push(`Elder Siblings: ${constraints.elderSiblingNames.join(', ')} (Analyze meter, vowels, and semantic rhyming pairs)`);
  }

  if (familyContext.length > 0) {
    promptLines.push(``);
    promptLines.push(`Family Ancestral & Sibling Context:`);
    for (const ctx of familyContext) {
      promptLines.push(`  • ${ctx}`);
    }
    count += familyContext.length;
  }

  promptLines.push(``);
  promptLines.push(`Output Format: Return recommendations with:`);
  promptLines.push(`1. Tamil Script + English Transliteration`);
  promptLines.push(`2. Morphological Root Breakdown (வேர்ச்சொல் பிரிப்பு) adhering to Tolkappiyam sandhi`);
  promptLines.push(`3. Literal Root Meaning vs Derived Philosophical Meaning`);
  promptLines.push(`4. Literary / Lexicon Attestation Source`);

  return {
    deterministicFilter,
    aiLinguisticPrompt: promptLines.join('\n'),
    activeConstraintCount: count,
  };
}
