/**
 * பெயர்ச்சோலை (Peyarcholai) — Empirical Name Frequency & Cohort Rarity Scoring Engine
 * Analyzes empirical repetition frequency within standard classroom cohorts (40 peers)
 * and state-wide student bodies (1,000 to 10,000 peers).
 */

export interface EmpiricalRarityScore {
  observedFrequencyPercent: number; // e.g. 0.015%
  cohortCountPer10k: number; // Count per 10,000 students
  classroomRepetitionIndex: number; // Expected peers in a 40-student classroom
  gradeSchoolRepetitionIndex: number; // Expected peers in a 1,000-student school grade
  gradeCohortIndex: number; // Alias for gradeSchoolRepetitionIndex
  rarityBand: 'ultra_rare' | 'distinctive' | 'balanced' | 'popular';
  badgeTitleEn: string;
  badgeTitleEnglish: string; // Alias
  badgeTitleTamil: string;
  icon: string;
  descriptionEn: string;
  descriptionTamil: string;
  parentAdviceEnglish: string; // Alias
  parentAdviceTamil: string; // Alias
}

/**
 * Calculates empirical frequency metrics for a given name based on its popularity ranking or frequency observations.
 */
export function calculateEmpiricalRarity(
  nameTamil: string,
  observedFrequencyPer10kOrRank?: number | "rare" | "moderate" | "popular"
): EmpiricalRarityScore {
  let countPer10k = 2;
  if (typeof observedFrequencyPer10kOrRank === "number") {
    countPer10k = Math.max(0.1, observedFrequencyPer10kOrRank);
  } else if (observedFrequencyPer10kOrRank === "rare") {
    countPer10k = 1.2;
  } else if (observedFrequencyPer10kOrRank === "moderate") {
    countPer10k = 25;
  } else if (observedFrequencyPer10kOrRank === "popular") {
    countPer10k = 65;
  }
  const frequencyPercent = Number(((countPer10k / 10000) * 100).toFixed(4));
  const classroomRepetition = Number(((countPer10k / 10000) * 40).toFixed(2));
  const gradeRepetition = Number(((countPer10k / 10000) * 1000).toFixed(1));

  if (frequencyPercent < 0.02) {
    const descEn = '0 peers in 1,000 students share this name (> 99th percentile uniqueness).';
    const descTa = '1,000 மாணவர்களில் எவரும் இந்நீள் பெயரைப் பெற்றிருக்க வாய்ப்பில்லை (99% தனித்துவம்).';
    return {
      observedFrequencyPercent: frequencyPercent,
      cohortCountPer10k: countPer10k,
      classroomRepetitionIndex: classroomRepetition,
      gradeSchoolRepetitionIndex: gradeRepetition,
      gradeCohortIndex: gradeRepetition,
      rarityBand: 'ultra_rare',
      badgeTitleEn: 'Ultra Rare Gem',
      badgeTitleEnglish: 'Ultra Rare Gem',
      badgeTitleTamil: 'தனித்துவப் பொக்கிஷம்',
      icon: '💎',
      descriptionEn: descEn,
      descriptionTamil: descTa,
      parentAdviceEnglish: descEn,
      parentAdviceTamil: descTa,
    };
  }

  if (frequencyPercent <= 0.10) {
    const descEn = '< 1 peer per 1,000 students. Stands out gracefully while remaining familiar.';
    const descTa = '1,000 மாணவர்களில் 1 நபருக்கும் குறைவான பயன்பாடு. தனித்துவமும் செழுமையும் இணைந்தது.';
    return {
      observedFrequencyPercent: frequencyPercent,
      cohortCountPer10k: countPer10k,
      classroomRepetitionIndex: classroomRepetition,
      gradeSchoolRepetitionIndex: gradeRepetition,
      gradeCohortIndex: gradeRepetition,
      rarityBand: 'distinctive',
      badgeTitleEn: 'Distinctive Classic',
      badgeTitleEnglish: 'Distinctive Classic',
      badgeTitleTamil: 'தனித்துவச் செம்மொழிப் பெயர்',
      icon: '🌟',
      descriptionEn: descEn,
      descriptionTamil: descTa,
      parentAdviceEnglish: descEn,
      parentAdviceTamil: descTa,
    };
  }

  if (frequencyPercent <= 0.50) {
    const descEn = '1 to 5 peers in 1,000 students. Timeless, well-recognized, and comfortable.';
    const descTa = '1,000 மாணவர்களில் 1 முதல் 5 பேர். காலத்தால் அழியாத நிதானமான பயன்பாடு.';
    return {
      observedFrequencyPercent: frequencyPercent,
      cohortCountPer10k: countPer10k,
      classroomRepetitionIndex: classroomRepetition,
      gradeSchoolRepetitionIndex: gradeRepetition,
      gradeCohortIndex: gradeRepetition,
      rarityBand: 'balanced',
      badgeTitleEn: 'Balanced Classic',
      badgeTitleEnglish: 'Balanced Classic',
      badgeTitleTamil: 'மிதமான பாரம்பரியப் பயன்பாடு',
      icon: '🌿',
      descriptionEn: descEn,
      descriptionTamil: descTa,
      parentAdviceEnglish: descEn,
      parentAdviceTamil: descTa,
    };
  }

  const descEn = '> 5 peers in 1,000 students. Highly celebrated and universally beloved across Tamil Nadu.';
  const descTa = '1,000 மாணவர்களில் 5 பேருக்கும் மேல். தமிழகம் எங்கும் பரவலாக அறியப்பட்ட செல்லப் பெயர்.';
  return {
    observedFrequencyPercent: frequencyPercent,
    cohortCountPer10k: countPer10k,
    classroomRepetitionIndex: classroomRepetition,
    gradeSchoolRepetitionIndex: gradeRepetition,
    gradeCohortIndex: gradeRepetition,
    rarityBand: 'popular',
    badgeTitleEn: 'Popular High-Frequency Classic',
    badgeTitleEnglish: 'Popular High-Frequency Classic',
    badgeTitleTamil: 'பரவலான புகழ்பெற்ற பெயர்',
    icon: '🏛️',
    descriptionEn: descEn,
    descriptionTamil: descTa,
    parentAdviceEnglish: descEn,
    parentAdviceTamil: descTa,
  };
}
