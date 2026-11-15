/**
 * Deterministic Tamil & Roman Syllable Breakdown Helper (Task 33)
 * Works 100% offline/client-side with zero external API cost.
 */

export interface PronunciationGuide {
  tamilSyllables: string[];
  romanSyllables: string[];
  formattedTamil: string;
  formattedRoman: string;
}

/**
 * Splits Tamil script into akshara / syllable units using Unicode grapheme clusters
 * (preserving uyirmei vowel signs and pulli virama cleanly).
 */
export function splitTamilSyllables(nameTamil: string): string[] {
  const clean = (nameTamil || "").trim();
  if (!clean) return [];
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("ta", { granularity: "grapheme" });
    return Array.from(segmenter.segment(clean))
      .map((s) => s.segment.trim())
      .filter(Boolean);
  }
  const matches = clean.match(/[\u0B80-\u0BFF][\u0BBE-\u0BCD\u0BD7]*/g);
  return matches ? matches : [clean];
}

/**
 * Splits a Romanized Tamil name into parent-friendly phonetic syllables
 * (e.g. "Yazhini" -> ["Ya", "zhi", "ni"], "Kalaivani" -> ["Ka", "lai", "va", "ni"]).
 */
export function splitRomanSyllables(nameLatin: string): string[] {
  const clean = (nameLatin || "").trim().replace(/[^a-zA-Z\s-]/g, "");
  if (!clean) return [];

  const chunks = clean
    .split(/\s+/)
    .flatMap((word) => {
      const parts = word.match(/[^aeiouyAEIOUY]*[aeiouyAEIOUY]+(?:[^aeiouyAEIOUY]+(?![aeiouyAEIOUY]))?/g);
      return parts && parts.length > 0 ? parts : [word];
    })
    .filter(Boolean);

  return chunks;
}

export function buildPronunciationGuide(
  nameTamil: string,
  nameLatin: string
): PronunciationGuide {
  const tamilSyllables = splitTamilSyllables(nameTamil);
  const romanSyllables = splitRomanSyllables(nameLatin);
  return {
    tamilSyllables,
    romanSyllables,
    formattedTamil: tamilSyllables.join(" · "),
    formattedRoman: romanSyllables.join("-"),
  };
}
