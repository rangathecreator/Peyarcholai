/**
 * Deterministic Tamil & Roman Syllable Breakdown Helper (Task 33)
 * Works 100% offline/client-side with zero external API cost.
 */

export interface PronunciationGuide {
  tamilSyllables: string[];
  romanSyllables: string[];
  formattedTamil: string;
  formattedRoman: string;
  tamilSpeechText: string;
}

const TAMIL_PULLI = "\u0BCD"; // ் (virama / mei marker)
const TAMIL_INDEPENDENT_VOWEL_RE = /(?<=[\u0B80-\u0BFF])(?=[\u0B85-\u0B94])/g;

/**
 * Formats concatenated Tamil compound names for cleaner TTS speech synthesis
 * (e.g., "ரமேஷ்அபிஷேக்" -> "ரமேஷ் அபிஷேக்") by inserting a natural pause
 * before word-internal independent Tamil vowels (அ–ஔ).
 */
export function formatTamilForSpeech(nameTamil: string): string {
  const clean = (nameTamil || "").trim();
  if (!clean) return "";
  return clean.replace(TAMIL_INDEPENDENT_VOWEL_RE, " ");
}

/**
 * Splits Tamil script into phonological syllables:
 * - Preserves uyirmei vowel signs cleanly via Unicode grapheme clusters.
 * - Attaches mei (consonant + pulli ், e.g., ஷ், க், ங், ர்) as the coda of the
 *   preceding syllable instead of emitting orphan half-consonants.
 *   (e.g., "ரமேஷ்அபிஷேக்" -> ["ர", "மேஷ்", "அ", "பி", "ஷேக்"])
 */
export function splitTamilSyllables(nameTamil: string): string[] {
  const clean = (nameTamil || "").trim();
  if (!clean) return [];

  const graphemes: string[] =
    typeof Intl !== "undefined" && "Segmenter" in Intl
      ? Array.from(new Intl.Segmenter("ta", { granularity: "grapheme" }).segment(clean))
          .map((s) => s.segment.trim())
          .filter(Boolean)
      : clean.match(/[\u0B80-\u0BFF][\u0BBE-\u0BCD\u0BD7]*/g) || [clean];

  const syllables: string[] = [];
  for (const g of graphemes) {
    if (g.endsWith(TAMIL_PULLI) && syllables.length > 0) {
      syllables[syllables.length - 1] += g;
    } else {
      syllables.push(g);
    }
  }
  return syllables;
}

const ROMAN_DIGRAPH_RE = /^(sh|bh|ch|th|dh|kh|gh|ph|zh|jh|nh|lh|rh)/i;
const VOWEL_GROUP_RE = /^[aeiouy]+/i;

/**
 * Splits a Romanized Tamil/Indian name into parent-friendly phonetic syllables
 * while preserving aspirated/retroflex digraphs (sh, bh, th, zh, ch, dh, kh, gh, ph).
 * Examples:
 * - "Yazhini"        -> ["Ya", "zhi", "ni"]
 * - "Rameshabhishek" -> ["Ra", "me", "sha", "bhi", "shek"]
 * - "Karthik"        -> ["Kar", "thik"]
 */
export function splitRomanSyllables(nameLatin: string): string[] {
  const clean = (nameLatin || "").trim().replace(/[^a-zA-Z\s-]/g, "");
  if (!clean) return [];

  const out: string[] = [];
  for (const word of clean.split(/[\s-]+/).filter(Boolean)) {
    // Tokenize into vowel groups and atomic consonant units (digraphs stay intact)
    const tokens: Array<{ text: string; isVowel: boolean }> = [];
    let i = 0;
    while (i < word.length) {
      const rest = word.slice(i);
      const vm = rest.match(VOWEL_GROUP_RE);
      if (vm) {
        tokens.push({ text: vm[0], isVowel: true });
        i += vm[0].length;
        continue;
      }
      const dm = rest.match(ROMAN_DIGRAPH_RE);
      if (dm) {
        tokens.push({ text: dm[0], isVowel: false });
        i += dm[0].length;
        continue;
      }
      tokens.push({ text: word[i], isVowel: false });
      i += 1;
    }

    const vowelIndices = tokens
      .map((t, idx) => (t.isVowel ? idx : -1))
      .filter((idx) => idx >= 0);

    if (vowelIndices.length === 0) {
      out.push(word);
      continue;
    }

    const wordSyllables: string[] = [];
    let start = 0;
    for (let v = 0; v < vowelIndices.length; v++) {
      const vIdx = vowelIndices[v];
      if (v === vowelIndices.length - 1) {
        wordSyllables.push(tokens.slice(start).map((t) => t.text).join(""));
        break;
      }
      const nextVIdx = vowelIndices[v + 1];
      const consonantsBetween = nextVIdx - vIdx - 1;
      // Single atomic consonant/digraph goes to next syllable's onset;
      // multiple consonants split so the first closes the current syllable.
      const splitAfter = consonantsBetween <= 1 ? vIdx : vIdx + 1;
      wordSyllables.push(tokens.slice(start, splitAfter + 1).map((t) => t.text).join(""));
      start = splitAfter + 1;
    }
    out.push(...wordSyllables);
  }

  return out;
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
    tamilSpeechText: formatTamilForSpeech(nameTamil),
  };
}
