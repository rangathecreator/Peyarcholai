/**
 * Deterministic Tamil & Roman Phonological Pronunciation Engine (Task 33 v2)
 * - Tamil mei-coda syllable grouping (attaches pulli ் consonants to preceding syllable)
 * - Digraph-aware Roman syllable splitter (keeps sh, bh, th, zh, ch, dh, kh, gh, ph atomic; treats y as consonant)
 * - Tamil-to-IPA converter & diaspora special-sound tips (ழ, ள, ற, ண)
 * - Concatenated compound spacing for cleaner TTS synthesis
 * Works 100% offline/client-side with zero external API cost.
 */

export interface PronunciationGuide {
  tamilSyllables: string[];
  romanSyllables: string[];
  formattedTamil: string;
  formattedRoman: string;
  tamilSpeechText: string;
  ipa: string;
  specialSoundTips: string[];
}

const TAMIL_PULLI = "\u0BCD"; // ் (virama / mei marker)
const TAMIL_INDEPENDENT_VOWEL_RE = /(?<=[\u0B80-\u0BFF])(?=[\u0B85-\u0B94])/g;

const TAMIL_INDEP_VOWEL_IPA: Record<string, string> = {
  "அ": "a", "ஆ": "aː", "இ": "i", "ஈ": "iː", "உ": "u", "ஊ": "uː",
  "எ": "e", "ஏ": "eː", "ஐ": "aɪ", "ஒ": "o", "ஓ": "oː", "ஔ": "aʊ",
};

const TAMIL_VOWEL_SIGN_IPA: Record<string, string> = {
  "\u0BBE": "aː", // ா
  "\u0BBF": "i",  // ி
  "\u0BC0": "iː", // ீ
  "\u0BC1": "u",  // ு
  "\u0BC2": "uː", // ூ
  "\u0BC6": "e",  // ெ
  "\u0BC7": "eː", // ே
  "\u0BC8": "aɪ", // ை
  "\u0BCA": "o",  // ொ
  "\u0BCB": "oː", // ோ
  "\u0BCC": "aʊ", // ௌ
};

const TAMIL_CONSONANT_IPA: Record<string, string> = {
  "க": "k", "ங": "ŋ", "ச": "tʃ", "ஞ": "ɲ", "ட": "ʈ", "ண": "ɳ",
  "த": "t̪", "ந": "n̪", "ப": "p", "ம": "m", "ய": "j", "ர": "ɾ",
  "ல": "l", "வ": "ʋ", "ழ": "ɻ", "ள": "ɭ", "ற": "r", "ன": "n",
  "ஜ": "dʒ", "ஷ": "ʂ", "ஸ": "s", "ஹ": "h", "ஶ": "ʃ",
};

const INTERVOCALIC_VOICING: Record<string, string> = {
  "க": "ɡ",
  "ட": "ɖ",
  "த": "ð",
  "ப": "b",
  "ச": "s",
};

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

/**
 * Generates an International Phonetic Alphabet (IPA) transcription directly from
 * Tamil Unicode syllables (with basic intervocalic voicing for க/ட/த/ப/ச).
 * Example: "அருவி" -> "/a.ɾu.ʋi/", "யாழினி" -> "/jaː.ɻi.ni/".
 */
export function toTamilIPA(nameTamil: string): string {
  const syllables = splitTamilSyllables(nameTamil);
  if (syllables.length === 0) return "";

  const ipaSyllables = syllables.map((syl, idx) => {
    const chars = Array.from(syl);
    let out = "";
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const next = chars[i + 1];
      if (TAMIL_INDEP_VOWEL_IPA[ch]) {
        out += TAMIL_INDEP_VOWEL_IPA[ch];
      } else if (TAMIL_CONSONANT_IPA[ch]) {
        const isIntervocalic = idx > 0 && i === 0 && next !== TAMIL_PULLI;
        const base =
          isIntervocalic && INTERVOCALIC_VOICING[ch]
            ? INTERVOCALIC_VOICING[ch]
            : TAMIL_CONSONANT_IPA[ch];
        if (next === TAMIL_PULLI) {
          out += TAMIL_CONSONANT_IPA[ch];
          i += 1;
        } else if (next && TAMIL_VOWEL_SIGN_IPA[next]) {
          out += base + TAMIL_VOWEL_SIGN_IPA[next];
          i += 1;
        } else {
          out += base + "a";
        }
      }
    }
    return out;
  });

  return `/${ipaSyllables.filter(Boolean).join(".")}/`;
}

/**
 * Returns helpful articulation tips when a Tamil name contains uniquely Tamil
 * retroflex/alveolar sounds (ழ, ள, ற, ண).
 */
export function getSpecialTamilSoundTips(nameTamil: string): string[] {
  const tips: string[] = [];
  if (nameTamil.includes("ழ")) {
    tips.push("ழ (zh /ɻ/): curl tongue tip back gently toward the roof without touching");
  }
  if (nameTamil.includes("ள")) {
    tips.push("ள (l /ɭ/): retroflex 'L' with tongue curled slightly back");
  }
  if (nameTamil.includes("ற")) {
    tips.push("ற (r /r/): crisp trilled Tamil 'R'");
  }
  if (nameTamil.includes("ண")) {
    tips.push("ண (n /ɳ/): retroflex 'N' pronounced with tongue tip curled back");
  }
  return tips;
}

const ROMAN_DIGRAPH_RE = /^(sh|bh|ch|th|dh|kh|gh|ph|zh|jh|nh|lh|rh)/i;
// Note: 'y' is intentionally excluded from VOWEL_GROUP_RE because in Tamil/Indian
// Romanization (Iniya, Yazhini, Kavya, Surya), 'y' is the consonant ய (/j/).
const VOWEL_GROUP_RE = /^[aeiou]+/i;

/**
 * Splits a Romanized Tamil/Indian name into parent-friendly phonetic syllables
 * while preserving aspirated/retroflex digraphs (sh, bh, th, zh, ch, dh, kh, gh, ph).
 * Examples:
 * - "Aruvi"          -> ["A", "ru", "vi"]
 * - "Iniya"          -> ["I", "ni", "ya"]
 * - "Yazhini"        -> ["Ya", "zhi", "ni"]
 * - "Rameshabhishek" -> ["Ra", "me", "sha", "bhi", "shek"]
 */
export function splitRomanSyllables(nameLatin: string): string[] {
  const clean = (nameLatin || "").trim().replace(/[^a-zA-Z\s-]/g, "");
  if (!clean) return [];

  const out: string[] = [];
  for (const word of clean.split(/[\s-]+/).filter(Boolean)) {
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
    ipa: toTamilIPA(nameTamil),
    specialSoundTips: getSpecialTamilSoundTips(nameTamil),
  };
}
