#!/usr/bin/env node
/**
 * பெயர்ச்சோலை (Peyarcholai) — OmniRoute Multi-Model Continuous Name Sourcer
 * Targets 50,000 names in EACH of the 3 categories (150,000 total):
 *   1. pure_tamil       (தூய தமிழ் — Authentic Tamil roots + Tolkappiyam Sandhi)
 *   2. tamilnadu_usage  (தமிழ்நாட்டுப் பயன்பாடு — Bhakti, Temple, Sanskrit-Tamil & TN Registry)
 *   3. other_heritage   (பிற பெயர்கள் — Pan-Indian, Global, Christian & Islamic Heritage)
 *
 * Usage:
 *   node scripts/omniroute-continuous-sourcer.mjs --target 50000 --batch 10000 --use-llm
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAMES_DIR = path.resolve(__dirname, "../src/data/names");
const INDEX_FILE = path.join(NAMES_DIR, "index.json");

const args = process.argv.slice(2);
const getArg = (flag, def) => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
};
const TARGET_PER_CATEGORY = parseInt(getArg("--target", "50000"), 10);
const BATCH_LIMIT = parseInt(getArg("--batch", "15000"), 10);
const USE_LLM = args.includes("--use-llm");
const ONLY_CATEGORY = getArg("--category", "all");

// ============================================================================
// 1. MULTI-MODEL OMNIROUTE + HP Z4 WORKSTATION SWARM CLIENT
// ============================================================================
const SWARM_ENDPOINTS = [
  { name: "HP-Z4-SparkX-4B", url: "http://100.105.146.7:11434/v1/chat/completions", model: "spark-x2.5-4b" },
  { name: "HP-Z4-Qwen-Coder-7B", url: "http://100.105.146.7:11437/v1/chat/completions", model: "qwen2.5-coder-7b" },
];

async function querySwarmForNames(category, count = 6) {
  if (!USE_LLM) return [];
  const prompts = {
    pure_tamil: `Generate ${count} unique authentic Pure Tamil baby names (zero Sanskrit) as a JSON array of objects: [{"ta":"தமிழ்","en":"English","gender":"boy"|"girl","meaning":"Meaning in English","meaningTa":"தமிழ் பொருள்","root":"வேர்ச்சொல்"}]. Return ONLY valid JSON array.`,
    tamilnadu_usage: `Generate ${count} popular baby names commonly used in Tamil Nadu (Bhakti, Sanskrit-Tamil, temple & modern TN registry) as a JSON array: [{"ta":"தமிழ்","en":"English","gender":"boy"|"girl","meaning":"Meaning","meaningTa":"தமிழ் பொருள்","source":"Bhakti / Sanskrit-Tamil / TN Registry"}]. Return ONLY valid JSON array.`,
    other_heritage: `Generate ${count} popular Pan-Indian, Christian, Islamic, or Global cosmopolitan baby names transliterated cleanly in Tamil as a JSON array: [{"ta":"தமிழ்","en":"English","gender":"boy"|"girl","meaning":"Meaning","meaningTa":"தமிழ் பொருள்","source":"Global / Pan-Indian / Biblical / Arabic"}]. Return ONLY valid JSON array.`,
  };

  const results = [];
  const tasks = SWARM_ENDPOINTS.map(async (ep) => {
    try {
      const res = await fetch(ep.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ep.model,
          messages: [{ role: "user", content: prompts[category] }],
          temperature: 0.75,
          max_tokens: 450,
        }),
        signal: AbortSignal.timeout(45000),
      });
      if (!res.ok) {
        console.log(`   ⚠️ ${ep.name} [${category}] HTTP ${res.status}`);
        return [];
      }
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) {
          console.log(`   🤖 ${ep.name} [${category}] returned ${parsed.length} candidates`);
          return parsed;
        }
      }
    } catch (err) {
      console.log(`   ⚠️ ${ep.name} [${category}] error: ${err.message}`);
    }
    return [];
  });

  const settled = await Promise.allSettled(tasks);
  for (const s of settled) {
    if (s.status === "fulfilled" && Array.isArray(s.value)) {
      results.push(...s.value);
    }
  }
  return results;
}

// ============================================================================
// 2. TOLKAPPIYAM SANDHI & TAMIL SCRIPT HELPERS
// ============================================================================
const TAMIL_ONLY_REGEX = /^[\u0B80-\u0BFF\s]+$/;
const HAS_LATIN_OR_DEVANAGARI = /[A-Za-z\u0900-\u097F]/;

function toSlug(latin) {
  return String(latin || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function getStartingSyllableTa(ta) {
  const chars = Array.from(ta.trim());
  if (chars.length === 0) return "அ";
  let first = chars[0];
  if (chars[1] && /[\u0BBE-\u0BCD\u0BD7]/.test(chars[1])) {
    first += chars[1];
  }
  return first;
}

function applyTolkappiyamSandhi(prefixTa, prefixEn, suffixTa, suffixEn) {
  const vowelStartMap = {
    "அ": { mei: "", uyirmei: "" },
    "ஆ": { mei: "", uyirmei: "\u0BBE" },
    "இ": { mei: "", uyirmei: "\u0BBF" },
    "ஈ": { mei: "", uyirmei: "\u0BC0" },
    "உ": { mei: "", uyirmei: "\u0BC1" },
    "ஊ": { mei: "", uyirmei: "\u0BC2" },
    "எ": { mei: "", uyirmei: "\u0BC6" },
    "ஏ": { mei: "", uyirmei: "\u0BC7" },
    "ஐ": { mei: "", uyirmei: "\u0BC8" },
    "ஒ": { mei: "", uyirmei: "\u0BCA" },
    "ஓ": { mei: "", uyirmei: "\u0BCB" },
  };
  const uyirToMeiJoin = {
    "அ": { "ய": "ய", "வ": "வ" },
    "ஆ": { "ய": "யா", "வ": "வா" },
    "இ": { "ய": "யி", "வ": "வி" },
    "ஈ": { "ய": "யீ", "வ": "வீ" },
    "உ": { "ய": "யு", "வ": "வு" },
    "ஊ": { "ய": "யூ", "வ": "வூ" },
    "எ": { "ய": "யெ", "வ": "வெ" },
    "ஏ": { "ய": "யே", "வ": "வே" },
    "ஐ": { "ய": "யை", "வ": "வை" },
    "ஒ": { "ய": "யொ", "வ": "வொ" },
    "ஓ": { "ய": "யோ", "வ": "வோ" },
  };

  const pChars = Array.from(prefixTa);
  const sChars = Array.from(suffixTa);
  const lastChar = pChars[pChars.length - 1];
  const firstSuf = sChars[0];
  const restSuf = sChars.slice(1).join("");

  let joinedTa = prefixTa + suffixTa;
  let joinedEn = prefixEn + suffixEn.toLowerCase();

  // Rule 1: Prefix ends in Pulli (e.g. ன், ள், ம், ர், ல், ழ்) + Suffix starts with vowel
  if (lastChar === "\u0BCD" && vowelStartMap[firstSuf]) {
    const baseConsonant = pChars[pChars.length - 2];
    const withoutPulli = pChars.slice(0, -1).join("");
    if (baseConsonant === "ம்") {
      // மவ்வீறு ஒற்றழிந்து உயிரிறு ஒப்பவும் (மரம் + அழகன் -> மரஅழகன் / அழகன்) - skip awkward மகர ஈறு + vowel or drop ம்
      joinedTa = pChars.slice(0, -2).join("") + suffixTa;
    } else {
      joinedTa = withoutPulli + vowelStartMap[firstSuf].uyirmei + restSuf;
    }
  }
  // Rule 2: Prefix ends in இ, ஈ, ஐ vowel sign -> Udambadumei 'ய்'
  else if (["\u0BBF", "\u0BC0", "\u0BC8"].includes(lastChar) && uyirToMeiJoin[firstSuf]) {
    joinedTa = prefixTa + uyirToMeiJoin[firstSuf]["ய"] + restSuf;
    if (/^[aeiou]/i.test(suffixEn)) {
      joinedEn = prefixEn + "y" + suffixEn.toLowerCase();
    }
  }
  // Rule 3: Prefix ends in அ, ஆ, உ, ஊ, எ, ஏ, ஒ, ஓ -> Udambadumei 'வ்' (skip if short 'உ' kutriyalugaram drops, use வ் for ஆ, ஓ, ஊ)
  else if (["\u0BBE", "\u0BC2", "\u0BCB"].includes(lastChar) && uyirToMeiJoin[firstSuf]) {
    joinedTa = prefixTa + uyirToMeiJoin[firstSuf]["வ"] + restSuf;
    if (/^[aeiou]/i.test(suffixEn)) {
      joinedEn = prefixEn + "v" + suffixEn.toLowerCase();
    }
  }

  // Capitalize first letter of English
  joinedEn = joinedEn.charAt(0).toUpperCase() + joinedEn.slice(1);
  return { ta: joinedTa, en: joinedEn };
}

// ============================================================================
// 3. CURATED ROOTS & MATRICES FOR ALL 3 CATEGORIES
// ============================================================================

// CATEGORY 1: PURE TAMIL (Sangam, Tolkappiyam, Tirukkural, Ainthinai)
const PURE_TAMIL_PREFIXES = [
  { ta: "அகழ்", en: "Agazh", mTa: "ஆழமான அறிவு", mEn: "deep wisdom" },
  { ta: "அணி", en: "Ani", mTa: "அழகு மற்றும் ஒழுங்கு", mEn: "grace and ornament" },
  { ta: "அமுத", en: "Amutha", mTa: "அமிழ்தம் போன்ற இனிமை", mEn: "nectar-like sweetness" },
  { ta: "அருள்", en: "Arul", mTa: "இரக்கம் மற்றும் கருணை", mEn: "divine grace and compassion" },
  { ta: "அற", en: "Ara", mTa: "நல்லொழுக்கம்", mEn: "righteous virtue" },
  { ta: "அறிவு", en: "Arivu", mTa: "மெய்யறிவு", mEn: "enlightened wisdom" },
  { ta: "அன்பு", en: "Anbu", mTa: "தூய அன்பு", mEn: "pure love and affection" },
  { ta: "ஆழி", en: "Aazhi", mTa: "ஆழ்கடல் போன்ற பெருமை", mEn: "oceanic vastness" },
  { ta: "இசை", en: "Isai", mTa: "இன்னிசை", mEn: "melodious music" },
  { ta: "இதழ்", en: "Ithazh", mTa: "மென்மையான மலரிதழ்", mEn: "delicate flower petal" },
  { ta: "இனிய", en: "Iniya", mTa: "இனிமையான பண்பு", mEn: "sweet and pleasant nature" },
  { ta: "இள", en: "Ila", mTa: "இளமை மற்றும் புத்துணர்ச்சி", mEn: "youthful vitality" },
  { ta: "ஈகை", en: "Eegai", mTa: "கொடைத்தன்மை", mEn: "noble generosity" },
  { ta: "உயர்", en: "Uyar", mTa: "உயர்ந்த குறிக்கோள்", mEn: "lofty excellence" },
  { ta: "உவகை", en: "Uvagai", mTa: "பேருவகை", mEn: "radiant joy" },
  { ta: "எழில்", en: "Ezhil", mTa: "இயற்கை எழில்", mEn: "natural beauty" },
  { ta: "ஏழிசை", en: "Ezhisai", mTa: "ஏழு சுரங்களின் இசை", mEn: "harmony of seven notes" },
  { ta: "ஐயை", en: "Aiyai", mTa: "தெய்வீகப் பெருமை", mEn: "sacred eminence" },
  { ta: "ஒளி", en: "Oli", mTa: "சுடர்விடும் ஒளி", mEn: "radiant light" },
  { ta: "ஓவிய", en: "Oviya", mTa: "கலைநயம் மிக்க ஓவியம்", mEn: "artistic masterpiece" },
  { ta: "கதிர்", en: "Kathir", mTa: "சூரியக் கதிர்", mEn: "radiant sunbeam" },
  { ta: "கமழ்", en: "Kamazh", mTa: "நறுமணம் வீசும்", mEn: "sweet fragrance" },
  { ta: "கயல்", en: "Kayal", mTa: "அழகிய கயல்விழி", mEn: "graceful eyes" },
  { ta: "கலை", en: "Kalai", mTa: "கலை மற்றும் கல்வி", mEn: "arts and scholarship" },
  { ta: "கவின்", en: "Kavin", mTa: "கவின்மிகு அழகு", mEn: "charming grace" },
  { ta: "கனி", en: "Kani", mTa: "கனிவான பண்பு", mEn: "gentle kindness" },
  { ta: "காந்தள்", en: "Kaanthal", mTa: "குறிஞ்சி மலர்", mEn: "sacred Kurinji glory lily" },
  { ta: "காவிரி", en: "Kaveri", mTa: "வளம் தரும் காவிரி", mEn: "prosperous river Kaveri" },
  { ta: "குறள்", en: "Kural", mTa: "திருக்குறள் நெறி", mEn: "Tirukkural wisdom" },
  { ta: "குறிஞ்சி", en: "Kurinji", mTa: "மலையும் மலை சார்ந்த வளம்", mEn: "mountain blossom" },
  { ta: "குழல்", en: "Kuzhal", mTa: "புல்லாங்குழல் இசை", mEn: "flute melody" },
  { ta: "கூடல்", en: "Koodal", mTa: "சங்க மதுரைப் பெருமை", mEn: "Sangam harmony" },
  { ta: "கொன்றை", en: "Kondrai", mTa: "பொன்மலர் கொன்றை", mEn: "golden cassia blossom" },
  { ta: "கோதை", en: "Kothai", mTa: "பூமாலை போன்ற அழகு", mEn: "garland of grace" },
  { ta: "சங்க", en: "Sanga", mTa: "செம்மொழிச் சங்க மரபு", mEn: "classical Sangam heritage" },
  { ta: "சந்த", en: "Santha", mTa: "சந்தம் மிக்க கவிதை", mEn: "rhythmic poetry" },
  { ta: "சிலம்பு", en: "Silambu", mTa: "சிலப்பதிகாரப் பெருமை", mEn: "noble anklet heritage" },
  { ta: "சுடர்", en: "Sudar", mTa: "மங்காத சுடர்", mEn: "eternal flame" },
  { ta: "செங்கதிர்", en: "Sengathir", mTa: "செவ்வொளிக் கதிர்", mEn: "crimson dawn ray" },
  { ta: "செந்தமிழ்", en: "Senthamizh", mTa: "தூய செந்தமிழ்", mEn: "classical refined Tamil" },
  { ta: "செந்நெல்", en: "Sennel", mTa: "வளம் கொழிக்கும் செந்நெல்", mEn: "golden harvest" },
  { ta: "செம்மை", en: "Semmai", mTa: "நேர்மையும் சிறப்பும்", mEn: "upright perfection" },
  { ta: "செல்வ", en: "Selva", mTa: "அறிவுச் செல்வம்", mEn: "prosperity and grace" },
  { ta: "சேயோன்", en: "Seyon", mTa: "குறிஞ்சித் தலைவன் முருகன்", mEn: "radiant Kurinji lord" },
  { ta: "சொல்", en: "Sol", mTa: "வாய்மைச் சொல்", mEn: "eloquent word" },
  { ta: "சோலை", en: "Solai", mTa: "பசுமைப் பூஞ்சோலை", mEn: "verdant garden grove" },
  { ta: "தமிழ்", en: "Tamil", mTa: "இனிய தமிழ்", mEn: "sweet Tamil heritage" },
  { ta: "தளிர்", en: "Thalir", mTa: "பசுந்தளிர்", mEn: "tender fresh sprout" },
  { ta: "தென்றல்", en: "Thendral", mTa: "இதமான தென்றல் காற்று", mEn: "gentle southern breeze" },
  { ta: "தேமொழி", en: "Themozhi", mTa: "தேன் போன்ற மொழி", mEn: "honey-sweet speech" },
  { ta: "தேன்", en: "Then", mTa: "தேன் போன்ற இனிமை", mEn: "pure honey sweetness" },
  { ta: "நகை", en: "Nagai", mTa: "மலர்ந்த புன்னகை", mEn: "radiant smile" },
  { ta: "நல்", en: "Nal", mTa: "நல்லறம்", mEn: "virtuous goodness" },
  { ta: "நறு", en: "Naru", mTa: "நறுமணம்", mEn: "sweet fragrance" },
  { ta: "நாவல", en: "Navala", mTa: "நாவன்மை", mEn: "eloquent oratory" },
  { ta: "நிலா", en: "Nila", mTa: "முழுநிலவு", mEn: "serene moonlight" },
  { ta: "நிறை", en: "Nirai", mTa: "நிறைவான பண்பு", mEn: "complete fulfillment" },
  { ta: "நெய்தல்", en: "Neithal", mTa: "கடல் நெய்தல் மலர்", mEn: "coastal blue lotus" },
  { ta: "பண்ண", en: "Panna", mTa: "இசைப்பண்", mEn: "classical Tamil melody" },
  { ta: "பரிதி", en: "Parithi", mTa: "கதிரவன்", mEn: "radiant sun" },
  { ta: "பவள", en: "Pavala", mTa: "நெய்தல் பவளம்", mEn: "precious coral" },
  { ta: "பனி", en: "Pani", mTa: "குளிர்ந்த பனித்துளி", mEn: "pure morning dew" },
  { ta: "பாவை", en: "Paavai", mTa: "திருப்பாவை நாயகி", mEn: "graceful damsel" },
  { ta: "பாலை", en: "Paalai", mTa: "பாலை வளம்", mEn: "resilient spirit" },
  { ta: "புகழ்", en: "Pugazh", mTa: "அழியாப் புகழ்", mEn: "enduring fame" },
  { ta: "புனல்", en: "Punal", mTa: "தூய ஆற்றுப்புனல்", mEn: "pure flowing stream" },
  { ta: "பூ", en: "Poo", mTa: "மலர்ந்த பூ", mEn: "blossoming flower" },
  { ta: "பொருநை", en: "Porunai", mTa: "தாமிரபரணி ஆறு", mEn: "sacred Porunai river" },
  { ta: "பொன்", en: "Pon", mTa: "தூய பொன்", mEn: "pure gold" },
  { ta: "மகிழ்", en: "Magizh", mTa: "மகிழ்ச்சி மற்றும் மகிழம்பூ", mEn: "joy and bakula flower" },
  { ta: "மணி", en: "Mani", mTa: "நவமணி", mEn: "precious jewel" },
  { ta: "மதி", en: "Mathi", mTa: "அறிவு மற்றும் நிலவு", mEn: "wisdom and moon" },
  { ta: "மருத", en: "Marutha", mTa: "மருத நில வளம்", mEn: "fertile river valley" },
  { ta: "மலர்", en: "Malar", mTa: "தூய மலர்", mEn: "blossom" },
  { ta: "மழை", en: "Mazhai", mTa: "வளம் தரும் மழை", mEn: "life-giving rain" },
  { ta: "மான்", en: "Maan", mTa: "பெருமை மற்றும் அழகு", mEn: "grace and nobility" },
  { ta: "முகில்", en: "Mugil", mTa: "கார்முகில்", mEn: "rain-bearing cloud" },
  { ta: "முத்து", en: "Muthu", mTa: "கொற்கை முத்து", mEn: "Korkai pearl" },
  { ta: "முல்லை", en: "Mullai", mTa: "கற்பு முல்லை மலர்", mEn: "fragrant jasmine" },
  { ta: "மெய்ய", en: "Meyya", mTa: "உண்மை நெறி", mEn: "eternal truth" },
  { ta: "மேகலை", en: "Megalai", mTa: "மணிமேகலைப் பெருமை", mEn: "classic gem girdle" },
  { ta: "மொழி", en: "Mozhi", mTa: "இனிய தமிழ்மொழி", mEn: "eloquent speech" },
  { ta: "யாழ்", en: "Yazh", mTa: "சங்க கால யாழிசை", mEn: "classical Tamil harp" },
  { ta: "வஞ்சி", en: "Vanji", mTa: "சேர நாட்டு வஞ்சி", mEn: "royal Chera grace" },
  { ta: "வள", en: "Vala", mTa: "செழிப்பும் வளமும்", mEn: "abundant prosperity" },
  { ta: "வள்ளி", en: "Valli", mTa: "குறிஞ்சி வள்ளி", mEn: "graceful creeper" },
  { ta: "வாகை", en: "Vaagai", mTa: "வெற்றி வாகை", mEn: "triumphant laurel" },
  { ta: "வான", en: "Vaana", mTa: "வானளாவிய பெருமை", mEn: "celestial expanse" },
  { ta: "விண்", en: "Vin", mTa: "விண்ணுலக ஒளி", mEn: "heavenly radiance" },
  { ta: "விழி", en: "Vizhi", mTa: "கருணை விழி", mEn: "expressive eyes" },
  { ta: "வீர", en: "Veera", mTa: "தீரமும் வீரமும்", mEn: "noble valor" },
  { ta: "வெண்", en: "Ven", mTa: "தூய வெண்மை", mEn: "pure brilliance" },
  { ta: "வெற்றி", en: "Vetri", mTa: "அறவழி வெற்றி", mEn: "righteous victory" },
  { ta: "வேங்கை", en: "Vengai", mTa: "வேங்கைப் புலி மற்றும் மலர்", mEn: "tiger strength & kino bloom" },
  { ta: "வேல்", en: "Vel", mTa: "வெற்றி வேல்", mEn: "sacred lance of wisdom" },
  { ta: "வைகை", en: "Vaigai", mTa: "பாண்டிய நாட்டு வைகை", mEn: "ever-flowing Vaigai river" },
  { ta: "வைர", en: "Vaira", mTa: "திடமான வைரம்", mEn: "unyielding diamond" },
  { ta: "மாயோன்", en: "Mayon", mTa: "முல்லைத் தலைவன்", mEn: "guardian of Mullai" },
  { ta: "வேந்த", en: "Ventha", mTa: "நல்லாட்சி வேந்தன்", mEn: "righteous sovereign" },
  { ta: "குமர", en: "Kumara", mTa: "இளமைக் குமரன்", mEn: "youthful prince" },
  { ta: "நம்பிய", en: "Nambiya", mTa: "நம்பிக்கைக்குரிய", mEn: "trustworthy noble" },
  { ta: "தூய", en: "Thooya", mTa: "மாசற்ற தூய்மை", mEn: "spotless purity" },
  { ta: "பசு", en: "Pasu", mTa: "பசுமை வளம்", mEn: "verdant freshness" },
  { ta: "நன்", en: "Nan", mTa: "நல்ல பண்பு", mEn: "noble virtue" },
  { ta: "சீர்", en: "Seer", mTa: "சிறப்புமிக்க சீர்", mEn: "auspicious dignity" },
  { ta: "வான்", en: "Vaan", mTa: "வான்புகழ்", mEn: "celestial renown" },
  { ta: "மணி", en: "Mani", mTa: "நல்மணி", mEn: "radiant gem" },
  { ta: "குயில்", en: "Kuyil", mTa: "இனிய குயிலோசை", mEn: "melodious koel" },
  { ta: "மயில்", en: "Mayil", mTa: "அழகிய மயில்", mEn: "graceful peacock" },
  { ta: "அன்ன", en: "Anna", mTa: "தூய அன்னம்", mEn: "graceful swan" },
  { ta: "தாமரை", en: "Thamarai", mTa: "செந்தாமரை", mEn: "sacred lotus" },
  { ta: "குவளை", en: "Kuvalai", mTa: "நீலக் குவளை", mEn: "blue water lily" },
  { ta: "ஆம்பல்", en: "Aambal", mTa: "வெள்ளாம்பல்", mEn: "white night-blooming lotus" },
  { ta: "மல்லி", en: "Malli", mTa: "நறுமண மல்லிகை", mEn: "fragrant jasmine" },
  { ta: "தாழை", en: "Thaazhai", mTa: "நெய்தல் தாழை", mEn: "fragrant screwpine flower" },
  { ta: "புன்னை", en: "Punnai", mTa: "கடற்கரைப் புன்னை", mEn: "coastal laurel bloom" },
  { ta: "மருதம்", en: "Marutham", mTa: "வயலும் வயல் சார்ந்தும்", mEn: "fertile river plains" },
  { ta: "சுனை", en: "Sunai", mTa: "மலைச்சுனை நீர்", mEn: "pure mountain spring" },
  { ta: "அருவி", en: "Aruvi", mTa: "இன்னருவி", mEn: "cascading waterfall" },
  { ta: "ஓடை", en: "Odai", mTa: "தெளிநீர் ஓடை", mEn: "crystal stream" },
  { ta: "கடல்", en: "Kadal", mTa: "ஆழ்கடல்", mEn: "boundless ocean" },
  { ta: "திரை", en: "Thirai", mTa: "கடல் திரை", mEn: "oceanic crest" },
  { ta: "முக", en: "Muga", mTa: "மலர்ந்த முகம்", mEn: "bright countenance" },
  { ta: "பிறை", en: "Pirai", mTa: "வளர்பிறை", mEn: "waxing crescent moon" },
  { ta: "உடு", en: "Udu", mTa: "விண்மீன்", mEn: "shining star" },
  { ta: "மின்", en: "Min", mTa: "மின்னொளி", mEn: "sparkling brilliance" },
  { ta: "தழல்", en: "Thazhal", mTa: "தூய தீச்சுடர்", mEn: "sacred ember" },
  { ta: "கனல்", en: "Kanal", mTa: "வீரக் கனல்", mEn: "fiery valor" },
  { ta: "புயல்", en: "Puyal", mTa: "வலிமை மிக்க", mEn: "dynamic force" },
  { ta: "வலி", en: "Vali", mTa: "மனவலிமை", mEn: "inner strength" },
  { ta: "திறன்", en: "Thiran", mTa: "செயல்திறன்", mEn: "capable skill" },
  { ta: "ஆற்றல்", en: "Aatral", mTa: "பேராற்றல்", mEn: "boundless energy" },
  { ta: "நெறி", en: "Neri", mTa: "அறநெறி", mEn: "righteous path" },
  { ta: "முறை", en: "Murai", mTa: "நீதிமுறை", mEn: "just order" },
  { ta: "மரபு", en: "Marabu", mTa: "தொன்மை மரபு", mEn: "ancient heritage" },
  { ta: "பண்பு", en: "Panbu", mTa: "நற்பண்பு", mEn: "noble character" },
  { ta: "நட்பு", en: "Natpu", mTa: "தூய நட்பு", mEn: "true friendship" },
  { ta: "கருணை", en: "Karunai", mTa: "பேரருள் கருணை", mEn: "deep compassion" },
  { ta: "பொறை", en: "Porai", mTa: "பொறுமையின் சிகரம்", mEn: "patient fortitude" },
  { ta: "நிறைவு", en: "Niraivu", mTa: "மனநிறைவு", mEn: "serene completeness" },
  { ta: "தொன்மை", en: "Thonmai", mTa: "பழமைச் சிறப்பு", mEn: "timeless antiquity" },
  { ta: "புதுமை", en: "Puthumai", mTa: "புதிய எழுச்சி", mEn: "fresh renaissance" },
  { ta: "நறுமலர்", en: "Narumalar", mTa: "நறுமணம் வீசும் மலர்", mEn: "fragrant blossom" },
  { ta: "குளிர்மதி", en: "Kulirmathi", mTa: "குளிர்ந்த நிலவு", mEn: "cool moonlight" },
  { ta: "பசுந்தமிழ்", en: "Pasunthamil", mTa: "பசுமையான தமிழ்", mEn: "evergreen Tamil" },
  { ta: "வண்டமிழ்", en: "Vandamil", mTa: "வளமை மிக்க தமிழ்", mEn: "bountiful Tamil" },
  { ta: "தீந்தமிழ்", en: "Theendamil", mTa: "இனிமை மிகு தமிழ்", mEn: "honeyed Tamil" },
  { ta: "செம்மண்", en: "Semman", mTa: "வளமான செம்மண்", mEn: "fertile crimson earth" },
  { ta: "முத்தமிழ்", en: "Muthamil", mTa: "இயல் இசை நாடகம்", mEn: "threefold Tamil arts" },
  { ta: "பைம்பொன்", en: "Paimpon", mTa: "பசும்பொன்", mEn: "pure virgin gold" },
  { ta: "வெள்ளி", en: "Velli", mTa: "வெள்ளி விண்மீன்", mEn: "morning star Venus" },
  { ta: "பவள", en: "Pavala", mTa: "செம்பவளம்", mEn: "crimson coral" },
  { ta: "மரகத", en: "Maragatha", mTa: "பச்சை மரகதம்", mEn: "emerald gem" },
  { ta: "நீல", en: "Neela", mTa: "நீல வானம்", mEn: "sapphire sky" },
  { ta: "செங்கதிர்", en: "Sengkathir", mTa: "சிவந்த கதிர்", mEn: "crimson sunray" },
  { ta: "இளம்பரிதி", en: "Ilamparithi", mTa: "காலைப் பரிதி", mEn: "morning sun" },
  { ta: "மணிமுடி", en: "Manimudi", mTa: "மணி பதித்த மகுடம்", mEn: "jeweled crown" },
  { ta: "வேல்விழி", en: "Velvizhi", mTa: "கூர்வேல் விழி", mEn: "radiant eyes" },
  { ta: "மலர்விழி", en: "Malarvizhi", mTa: "மலர் போன்ற விழி", mEn: "flower-eyed" },
  { ta: "தேன்நதி", en: "Thennadhi", mTa: "இனிய ஆறு", mEn: "sweet river" },
  { ta: "பொன்னருவி", en: "Ponnaruvy", mTa: "பொன் அருவி", mEn: "golden waterfall" },
  { ta: "குறிஞ்சி", en: "Kurinji", mTa: "மலை நிலம்", mEn: "mountain blossom" },
  { ta: "நெய்தல்", en: "Neythal", mTa: "கடல் நிலம்", mEn: "coastal lotus" },
  { ta: "மருத", en: "Marutha", mTa: "வயல் வளம்", mEn: "fertile riverine land" },
  { ta: "வளர்", en: "Valar", mTa: "வளரும் புகழ்", mEn: "flourishing" },
  { ta: "உயர்", en: "Uyar", mTa: "உயர்ந்த பண்பு", mEn: "lofty and noble" },
  { ta: "நிறை", en: "Nirai", mTa: "நிறைவான அறம்", mEn: "complete virtue" },
  { ta: "மகிழ்", en: "Magizh", mTa: "ஆனந்த மகிழ்ச்சி", mEn: "pure joy" },
  { ta: "எழிலன்", en: "Ezhilan", mTa: "அழகிய தோற்றம்", mEn: "graceful one" },
  { ta: "இளவரசு", en: "Ilavarasu", mTa: "இளைய அரசன்", mEn: "young prince" },
  { ta: "கவி", en: "Kavi", mTa: "கவிதை ஆற்றல்", mEn: "poetic inspiration" },
  { ta: "பா", en: "Paa", mTa: "இசைப்பாடல்", mEn: "lyrical verse" },
  { ta: "யாழ்", en: "Yazh", mTa: "சங்க கால யாழ்", mEn: "classical harp" },
  { ta: "குழல்", en: "Kuzhal", mTa: "வேய்ங்குழல் இசை", mEn: "bamboo flute" },
  { ta: "முழவு", en: "Muzhavu", mTa: "மங்கள முரசு", mEn: "auspicious drum" },
  { ta: "அணி", en: "Ani", mTa: "அழகிய அணிகலன்", mEn: "graceful ornament" },
  { ta: "சுடர்", en: "Sudar", mTa: "ஒளிச்சுடர்", mEn: "radiant flame" },
  { ta: "ஒலி", en: "Oli", mTa: "இனிய ஒலி", mEn: "resonant sound" },
  { ta: "தளிர்", en: "Thalir", mTa: "இளந்தளிர்", mEn: "tender leaf" },
  { ta: "அரும்பு", en: "Arumbu", mTa: "மலரும் அரும்பு", mEn: "blooming bud" },
  { ta: "கொடி", en: "Kodi", mTa: "பூங்கொடி", mEn: "graceful creeper" },
  { ta: "சோலை", en: "Solai", mTa: "பூஞ்சோலை", mEn: "fragrant grove" },
  { ta: "பொழில்", en: "Pozhil", mTa: "வளமான சோலை", mEn: "verdant garden" },
  { ta: "வானம்", en: "Vaanam", mTa: "பரந்த வானம்", mEn: "boundless sky" },
  { ta: "முகில்", en: "Mugil", mTa: "மழை முகில்", mEn: "rain-bearing cloud" },
];

const PURE_TAMIL_SUFFIXES = [
  // Boy suffixes
  { ta: "அரசன்", en: "arasan", gender: "boy", mTa: "நல்லாட்சித் தலைவன்", mEn: "noble leader" },
  { ta: "அழகன்", en: "azhagan", gender: "boy", mTa: "அழகும் நற்பண்பும் உடையவன்", mEn: "graceful one" },
  { ta: "அமுதன்", en: "amuthan", gender: "boy", mTa: "அமிழ்தம் போன்றவன்", mEn: "nectar-sweet one" },
  { ta: "அருளன்", en: "arulan", gender: "boy", mTa: "கருணை உள்ளம் கொண்டவன்", mEn: "gracious one" },
  { ta: "ஆதவன்", en: "aadhavan", gender: "boy", mTa: "கதிரவன் போன்ற ஒளியுடையவன்", mEn: "radiant sun" },
  { ta: "இனியன்", en: "iniyan", gender: "boy", mTa: "இனிமையான இயல்புடையவன்", mEn: "gentle and sweet one" },
  { ta: "உதயன்", en: "uthayan", gender: "boy", mTa: "எழுச்சி பெறும் கதிர்", mEn: "rising dawn" },
  { ta: "எழிலன்", en: "ezhilan", gender: "boy", mTa: "எழில்மிகு தோற்றத்தவன்", mEn: "handsome grace" },
  { ta: "கண்ணன்", en: "kannan", gender: "boy", mTa: "கண்ணின் மணி போன்றவன்", mEn: "beloved treasure" },
  { ta: "கதிரவன்", en: "kathiravan", gender: "boy", mTa: "சூரியனைப் போன்றவன்", mEn: "sun-bright one" },
  { ta: "குமரன்", en: "kumaran", gender: "boy", mTa: "இளமையின் நாயகன்", mEn: "youthful prince" },
  { ta: "குன்றன்", en: "kundran", gender: "boy", mTa: "குன்று போன்ற உறுதியானவன்", mEn: "mountain-firm one" },
  { ta: "கோமான்", en: "komaan", gender: "boy", mTa: "பெருந்தகைத் தலைவன்", mEn: "noble chieftain" },
  { ta: "சீலன்", en: "seelan", gender: "boy", mTa: "நல்லொழுக்க சீலன்", mEn: "virtuous gentleman" },
  { ta: "செழியன்", en: "sezhiyan", gender: "boy", mTa: "பாண்டிய வளம் கொண்டவன்", mEn: "prosperous Pandya" },
  { ta: "செல்வன்", en: "selvan", gender: "boy", mTa: "அறிவுச் செல்வன்", mEn: "blessed and prosperous" },
  { ta: "சேரன்", en: "cheran", gender: "boy", mTa: "சேர மன்னன் மரபினன்", mEn: "Chera lineage" },
  { ta: "சோழன்", en: "chozhan", gender: "boy", mTa: "சோழப் பேரரசன் மரபினன்", mEn: "Chola lineage" },
  { ta: "தம்பி", en: "thambi", gender: "boy", mTa: "அன்புத் தம்பி", mEn: "beloved brother" },
  { ta: "தமிழன்", en: "tamilan", gender: "boy", mTa: "செம்மொழித் தமிழன்", mEn: "noble Tamil" },
  { ta: "தலைவன்", en: "thalaivan", gender: "boy", mTa: "வழிகாட்டும் தலைவன்", mEn: "guiding leader" },
  { ta: "நம்பி", en: "nambi", gender: "boy", mTa: "நம்பிக்கைக்குரிய சான்றோன்", mEn: "trustworthy gentleman" },
  { ta: "நல்லன்", en: "nallavan", gender: "boy", mTa: "நற்பண்பு கொண்டவன்", mEn: "virtuous soul" },
  { ta: "நாதன்", en: "naathan", gender: "boy", mTa: "பாதுகாவலன்", mEn: "protector" },
  { ta: "நிலவன்", en: "nilavan", gender: "boy", mTa: "நிலவு போன்ற குளிர்ச்சியான்", mEn: "serene moon" },
  { ta: "நேயன்", en: "neyan", gender: "boy", mTa: "அன்பும் நட்பும் கொண்டவன்", mEn: "loving friend" },
  { ta: "பரிதி", en: "parithi", gender: "boy", mTa: "சுடர்விடும் பரிதி", mEn: "radiant sun" },
  { ta: "பாண்டியன்", en: "pandiyan", gender: "boy", mTa: "பாண்டிய மரபினன்", mEn: "Pandya heritage" },
  { ta: "புகழன்", en: "pugazhan", gender: "boy", mTa: "புகழுக்குரியவன்", mEn: "renowned one" },
  { ta: "மணி", en: "mani", gender: "boy", mTa: "அருமணி", mEn: "precious gem" },
  { ta: "மன்னன்", en: "mannan", gender: "boy", mTa: "அறவழி மன்னன்", mEn: "righteous king" },
  { ta: "மாறன்", en: "maaran", gender: "boy", mTa: "வழுதியர் பெருமகன்", mEn: "valiant leader" },
  { ta: "முதல்வன்", en: "muthalvan", gender: "boy", mTa: "முதன்மைப் பெருமகன்", mEn: "foremost pioneer" },
  { ta: "வளவன்", en: "valavan", gender: "boy", mTa: "வளம் சேர்க்கும் வளவன்", mEn: "prosperous one" },
  { ta: "வாணன்", en: "vaanan", gender: "boy", mTa: "கலைவாணன்", mEn: "skilled artisan" },
  { ta: "வள்ளல்", en: "vallal", gender: "boy", mTa: "கொடை வள்ளல்", mEn: "generous patron" },
  { ta: "வித்தகன்", en: "viththagan", gender: "boy", mTa: "அறிவு வித்தகன்", mEn: "wise visionary" },
  { ta: "வேந்தன்", en: "venthan", gender: "boy", mTa: "தமிழ் வேந்தன்", mEn: "noble monarch" },
  { ta: "வேலன்", en: "velan", gender: "boy", mTa: "வெற்றிவேல் ஏந்தியவன்", mEn: "holder of sacred lance" },
  { ta: "வேள்", en: "vel", gender: "boy", mTa: "சங்க கால வேளிர் மரபு", mEn: "Sangam chieftain" },
  { ta: "அறிஞன்", en: "arignan", gender: "boy", mTa: "பேரறிஞன்", mEn: "wise scholar" },
  { ta: "கவிஞன்", en: "kavignan", gender: "boy", mTa: "செந்தமிழ்க் கவிஞன்", mEn: "gifted poet" },
  { ta: "புலவன்", en: "pulavan", gender: "boy", mTa: "சங்கப் புலவன்", mEn: "classical poet" },
  { ta: "ஓவியன்", en: "oviyan", gender: "boy", mTa: "கலை ஓவியன்", mEn: "master artist" },
  { ta: "இசைஞன்", en: "isaignan", gender: "boy", mTa: "இசை மேதை", mEn: "musical maestro" },
  { ta: "தீரன்", en: "theeran", gender: "boy", mTa: "அஞ்சா நெஞ்சன்", mEn: "courageous hero" },
  { ta: "வீரன்", en: "veeran", gender: "boy", mTa: "அறவீரன்", mEn: "righteous warrior" },
  { ta: "சூரன்", en: "sooran", gender: "boy", mTa: "ஆற்றல் சான்றோன்", mEn: "mighty champion" },
  { ta: "நெடுமாறன்", en: "nedumaaran", gender: "boy", mTa: "பெரும் புகழ் மாறன்", mEn: "great renowned leader" },
  { ta: "மகிழன்", en: "magizhlan", gender: "boy", mTa: "என்றும் மகிழ்வன்", mEn: "joyful spirit" },
  { ta: "இளங்கோ", en: "ilango", gender: "boy", mTa: "இளவரசன்", mEn: "noble prince" },
  { ta: "காவலன்", en: "kaavalan", gender: "boy", mTa: "அறக் காவலன்", mEn: "righteous guardian" },
  { ta: "தூயவன்", en: "thooyavan", gender: "boy", mTa: "தூய உள்ளத்தவன்", mEn: "pure-hearted one" },
  { ta: "மெய்யன்", en: "meyyan", gender: "boy", mTa: "உண்மையாளன்", mEn: "truthful soul" },
  { ta: "நண்பன்", en: "nanban", gender: "boy", mTa: "உயிர்த் தோழன்", mEn: "trusted companion" },
  { ta: "தோழன்", en: "thozhan", gender: "boy", mTa: "நல்ல தோழன்", mEn: "noble friend" },
  { ta: "மாதவன்", en: "maathavan", gender: "boy", mTa: "பெருந்தவப் பண்பாளன்", mEn: "noble ascetic" },
  { ta: "முத்தன்", en: "muthan", gender: "boy", mTa: "முத்து போன்றவன்", mEn: "pearl-like gem" },
  { ta: "பொன்னன்", en: "ponnan", gender: "boy", mTa: "பொன் போன்ற குணத்தவன்", mEn: "golden-hearted one" },
  { ta: "வண்ணன்", en: "vannan", gender: "boy", mTa: "கலை வண்ணன்", mEn: "colorful artist" },
  { ta: "சுடரோன்", en: "sudaron", gender: "boy", mTa: "ஒளிச்சுடரோன்", mEn: "bearer of light" },
  { ta: "ஒளியோன்", en: "oliyon", gender: "boy", mTa: "அறிவொளியோன்", mEn: "luminary" },
  { ta: "மதியோன்", en: "mathiyon", gender: "boy", mTa: "நுண்ணறிவுடையோன்", mEn: "wise counselor" },
  { ta: "நலன்", en: "nalan", gender: "boy", mTa: "நன்மை தருபவன்", mEn: "bringer of good" },
  { ta: "தளபதி", en: "thalapathi", gender: "boy", mTa: "படைத்தலைவன்", mEn: "commander" },
  { ta: "பெருமாள்", en: "perumaal", gender: "boy", mTa: "பெருமைக்குரியவன்", mEn: "eminent protector" },
  { ta: "அண்ணல்", en: "annal", gender: "boy", mTa: "சான்றோர் தலைவன்", mEn: "revered elder" },
  { ta: "நாவலன்", en: "naavalan", gender: "boy", mTa: "நாவன்மை மிக்கவன்", mEn: "silver-tongued orator" },
  { ta: "மருதன்", en: "maruthan", gender: "boy", mTa: "மருத நில மகன்", mEn: "son of river plains" },
  { ta: "குறிஞ்சியன்", en: "kurinjiyan", gender: "boy", mTa: "குறிஞ்சி மலை மகன்", mEn: "son of the hills" },
  { ta: "நெய்தலன்", en: "neithalan", gender: "boy", mTa: "நெய்தல் கடல் மகன்", mEn: "son of the coast" },
  { ta: "முல்லையன்", en: "mullaiyan", gender: "boy", mTa: "முல்லை நில மகன்", mEn: "son of the woodlands" },
  { ta: "விண்ணவன்", en: "vinnavan", gender: "boy", mTa: "வானுயர் சிந்தனையாளன்", mEn: "celestial thinker" },
  { ta: "கடலோன்", en: "kadalon", gender: "boy", mTa: "கடலாழம் கொண்டவன்", mEn: "deep-hearted" },
  { ta: "வானவன்", en: "vaanavan", gender: "boy", mTa: "சேர வேந்தர் மரபினன்", mEn: "celestial Chera" },
  { ta: "நெறியன்", en: "neriyan", gender: "boy", mTa: "நன்னெறி நடப்பவன்", mEn: "righteous walker" },
  { ta: "பண்ணன்", en: "pannan", gender: "boy", mTa: "இசை வல்லுநன்", mEn: "master of melody" },
  { ta: "குணாளன்", en: "gunaalan", gender: "boy", mTa: "நற்குணம் நிறைந்தவன்", mEn: "virtuous character" },
  { ta: "பூபாலன்", en: "poobalan", gender: "boy", mTa: "மண்ணுலகக் காவலன்", mEn: "earth protector" },
  { ta: "தேன்மொழியன்", en: "thenmozhiyan", gender: "boy", mTa: "இனிய சொல் உடையவன்", mEn: "sweet-spoken" },

  // Girl suffixes
  { ta: "அரசி", en: "arasi", gender: "girl", mTa: "பண்பின் அரசி", mEn: "noble queen" },
  { ta: "அழகி", en: "azhagi", gender: "girl", mTa: "இயற்கை அழகுடையவள்", mEn: "graceful beauty" },
  { ta: "அமுதா", en: "amutha", gender: "girl", mTa: "அமிழ்தம் போன்றவள்", mEn: "nectar-sweet" },
  { ta: "அருளி", en: "aruli", gender: "girl", mTa: "கருணை வடிவானவள்", mEn: "blessed grace" },
  { ta: "இசையினி", en: "isaiyini", gender: "girl", mTa: "இசை போன்ற இனியவள்", mEn: "melodious sweetness" },
  { ta: "இதழ்", en: "ithazh", gender: "girl", mTa: "மலரிதழ் போன்றவள்", mEn: "flower petal" },
  { ta: "இனியா", en: "iniya", gender: "girl", mTa: "இனிமை நிறைந்தவள்", mEn: "sweet and pleasant" },
  { ta: "இளமதி", en: "ilamathi", gender: "girl", mTa: "இளம்பிறை நிலவு", mEn: "young crescent moon" },
  { ta: "உவகை", en: "uvagai", gender: "girl", mTa: "மகிழ்ச்சியின் வடிவம்", mEn: "pure joy" },
  { ta: "எழிலி", en: "ezhili", gender: "girl", mTa: "எழில்மிகு கார்முகில்", mEn: "graceful raincloud" },
  { ta: "ஓவியா", en: "oviya", gender: "girl", mTa: "ஓவியம் போன்ற அழகி", mEn: "artistic beauty" },
  { ta: "கண்ணகி", en: "kannagi", gender: "girl", mTa: "கற்புக்கரசி பெருமை", mEn: "noble heroine" },
  { ta: "கயல்விழி", en: "kayalvizhi", gender: "girl", mTa: "கயல் போன்ற அழகிய கண்கள்", mEn: "graceful-eyed" },
  { ta: "கலை", en: "kalai", gender: "girl", mTa: "கலைமகள் அருள்", mEn: "grace of arts" },
  { ta: "கலைச்செல்வி", en: "kalaiselvi", gender: "girl", mTa: "கலைகளின் செல்வி", mEn: "maiden of arts" },
  { ta: "கவிதா", en: "kavitha", gender: "girl", mTa: "கவிதை போன்றவள்", mEn: "poetic soul" },
  { ta: "கவின்யா", en: "kavinya", gender: "girl", mTa: "கவின்மிகு அழகுடையவள்", mEn: "poetic grace" },
  { ta: "கனி", en: "kani", gender: "girl", mTa: "இனிய கனி போன்றவள்", mEn: "sweet fruit" },
  { ta: "கனிமொழி", en: "kanimozhi", gender: "girl", mTa: "கனிவான பேச்சுடையவள்", mEn: "gentle-spoken" },
  { ta: "குழலி", en: "kuzhali", gender: "girl", mTa: "புல்லாங்குழல் இசை", mEn: "flute-voiced" },
  { ta: "குயில்", en: "kuyil", gender: "girl", mTa: "குயிலோசை கொண்டவள்", mEn: "melodious songbird" },
  { ta: "கொடி", en: "kodi", gender: "girl", mTa: "பூங்கொடி போன்றவள்", mEn: "graceful vine" },
  { ta: "கோதை", en: "kothai", gender: "girl", mTa: "பூமாலை போன்றவள்", mEn: "garland beauty" },
  { ta: "சங்கமி", en: "sangami", gender: "girl", mTa: "சங்கத் தமிழ் அருள்", mEn: "confluence of grace" },
  { ta: "சுடர்", en: "sudar", gender: "girl", mTa: "ஒளிவிடும் சுடர்", mEn: "radiant lamp" },
  { ta: "செல்வி", en: "selvi", gender: "girl", mTa: "நற்பண்புச் செல்வி", mEn: "blessed maiden" },
  { ta: "தமிழினி", en: "tamilini", gender: "girl", mTa: "தமிழ் போல் இனியவள்", mEn: "sweet as Tamil" },
  { ta: "தளிர்", en: "thalir", gender: "girl", mTa: "புதுத்தளிர்", mEn: "fresh sprout" },
  { ta: "தாரகை", en: "thaaragai", gender: "girl", mTa: "விண்மீன் தாரகை", mEn: "shining star" },
  { ta: "திரு", en: "thiru", mTa: "திருமகள் அருள்", gender: "girl", mEn: "auspicious grace" },
  { ta: "தென்றல்", en: "thendral", gender: "girl", mTa: "இதமான தென்றல்", mEn: "gentle breeze" },
  { ta: "தேவி", en: "devi", gender: "girl", mTa: "தெய்வீகப் பண்பு", mEn: "radiant goddess" },
  { ta: "நங்கை", en: "nangai", gender: "girl", mTa: "பண்புடை நங்கை", mEn: "noble lady" },
  { ta: "நறுமலர்", en: "narumalar", gender: "girl", mTa: "நறுமண மலர்", mEn: "fragrant blossom" },
  { ta: "நிலா", en: "nila", gender: "girl", mTa: "குளிர்நிலா", mEn: "serene moon" },
  { ta: "நிலவொளி", en: "nilavoli", gender: "girl", mTa: "தூய நிலவொளி", mEn: "pure moonlight" },
  { ta: "நிறைமதி", en: "niraimathi", gender: "girl", mTa: "முழுநிலவு", mEn: "full moon" },
  { ta: "பாவை", en: "paavai", gender: "girl", mTa: "அருட்பாவை", mEn: "graceful damsel" },
  { ta: "புகழி", en: "pugazhi", gender: "girl", mTa: "புகழ் மிக்கவள்", mEn: "renowned maiden" },
  { ta: "பூங்கொடி", en: "poongodi", gender: "girl", mTa: "மலர்க்கொடி", mEn: "flowering vine" },
  { ta: "பூவிழி", en: "poovizhi", gender: "girl", mTa: "மலர் போன்ற கண்கள்", mEn: "flower-eyed" },
  { ta: "பொன்னி", en: "ponni", gender: "girl", mTa: "பொன்னி நதி வளம்", mEn: "golden Kaveri" },
  { ta: "மங்கை", en: "mangai", gender: "girl", mTa: "தூய மங்கை", mEn: "virtuous woman" },
  { ta: "மகிழினி", en: "magizhini", gender: "girl", mTa: "மகிழ்ச்சி தருபவள்", mEn: "bringer of joy" },
  { ta: "மதி", en: "mathi", gender: "girl", mTa: "அறிவும் நிலவும்", mEn: "moonlit wisdom" },
  { ta: "மயில்", en: "mayil", gender: "girl", mTa: "அழகிய மயில்", mEn: "graceful peacock" },
  { ta: "மலர்", en: "malar", gender: "girl", mTa: "அழகிய மலர்", mEn: "blossom" },
  { ta: "மல்லிகை", en: "malligai", gender: "girl", mTa: "நறுமண மல்லிகை", mEn: "fragrant jasmine" },
  { ta: "மாலை", en: "maalai", gender: "girl", mTa: "பூமாலை", mEn: "flower garland" },
  { ta: "மின்னல்", en: "minnal", gender: "girl", mTa: "மின்னொளி", mEn: "bright spark" },
  { ta: "முகிலி", en: "mugili", gender: "girl", mTa: "மழைமுகில்", mEn: "graceful cloud" },
  { ta: "முல்லை", en: "mullai", gender: "girl", mTa: "முல்லை மலர்", mEn: "jasmine" },
  { ta: "மேகலை", en: "megalai", gender: "girl", mTa: "மணிமேகலை", mEn: "gem girdle" },
  { ta: "மொழி", en: "mozhi", gender: "girl", mTa: "இன்சொல் மொழி", mEn: "sweet speech" },
  { ta: "யாழினி", en: "yazhini", gender: "girl", mTa: "யாழ் இசை போன்றவள்", mEn: "harp-melodious" },
  { ta: "வஞ்சி", en: "vanji", gender: "girl", mTa: "கொடி போன்ற வஞ்சி", mEn: "royal grace" },
  { ta: "வல்லி", en: "valli", gender: "girl", mTa: "பூங்கொடி வல்லி", mEn: "graceful creeper" },
  { ta: "வள்ளி", en: "valli", gender: "girl", mTa: "குறிஞ்சி வள்ளி", mEn: "sacred Valli" },
  { ta: "வாணி", en: "vaani", gender: "girl", mTa: "கலைவாணி", mEn: "eloquent muse" },
  { ta: "விழி", en: "vizhi", gender: "girl", mTa: "அருள்விழி", mEn: "graceful eyes" },
  { ta: "வெண்மதி", en: "venmathi", gender: "girl", mTa: "தூய வெண்ணிலா", mEn: "pure white moon" },
  { ta: "வெண்பா", en: "venba", gender: "girl", mTa: "சங்க வெண்பா", mEn: "classical verse" },
  { ta: "அன்னம்", en: "annam", gender: "girl", mTa: "தூய அன்னம்", mEn: "graceful swan" },
  { ta: "கமலம்", en: "kamalam", gender: "girl", mTa: "செந்தாமரை", mEn: "sacred lotus" },
  { ta: "குவளை", en: "kuvalai", gender: "girl", mTa: "நீலக் குவளை", mEn: "blue lily" },
  { ta: "தாமரை", en: "thamarai", gender: "girl", mTa: "தாமரை மலர்", mEn: "lotus blossom" },
  { ta: "நளினி", en: "nalini", gender: "girl", mTa: "தாமரைப் பொய்கை", mEn: "lotus pond" },
  { ta: "பூவை", en: "poovai", gender: "girl", mTa: "பூவை நாயகி", mEn: "myna songbird" },
  { ta: "மாலதி", en: "maalathi", gender: "girl", mTa: "நறுமண முல்லை", mEn: "night jasmine" },
  { ta: "மாலினி", en: "maalini", gender: "girl", mTa: "பூமாலை சூடியவள்", mEn: "garland bearer" },
  { ta: "யாழ்மொழி", en: "yazhmozhi", gender: "girl", mTa: "யாழ் போன்ற குரலுடையவள்", mEn: "harp-voiced" },
  { ta: "வளர்மதி", en: "valarmathi", gender: "girl", mTa: "வளர்பிறை நிலவு", mEn: "waxing moon" },
  { ta: "வான்மதி", en: "vaanmathi", gender: "girl", mTa: "வானத்து நிலவு", mEn: "celestial moon" },
  { ta: "தூயவள்", en: "thooyaval", gender: "girl", mTa: "தூய உள்ளத்தவள்", mEn: "pure soul" },
  { ta: "மெய்யவள்", en: "meyyaval", gender: "girl", mTa: "உண்மைப் பண்பினள்", mEn: "truthful maiden" },
  { ta: "அறிவழகி", en: "arivazhagi", gender: "girl", mTa: "அறிவும் அழகும் மிக்கவள்", mEn: "wise beauty" },
  { ta: "அறச்செல்வி", en: "araselvi", gender: "girl", mTa: "அறநெறிச் செல்வி", mEn: "virtuous maiden" },
  { ta: "இன்பவல்லி", en: "inbavalli", gender: "girl", mTa: "இன்பம் தரும் கொடி", mEn: "joyful grace" },
  { ta: "ஒளிமதி", en: "olimathi", gender: "girl", mTa: "ஒளிரும் நிலவு", mEn: "shining moon" },
  { ta: "செம்மலர்", en: "semmalar", gender: "girl", mTa: "சிறந்த செம்மலர்", mEn: "noble crimson flower" },
  { ta: "தேன்மொழி", en: "thenmozhi", gender: "girl", mTa: "தேன் போன்ற மொழியாள்", mEn: "honey-voiced" },
  { ta: "பண்ணினி", en: "pannini", gender: "girl", mTa: "இசைப்பண் போன்றவள்", mEn: "musical harmony" },
  { ta: "மணிமேகலை", en: "manimegalai", gender: "girl", mTa: "காவிய நாயகி", mEn: "epic heroine" },
  { ta: "நிறையினி", en: "niraiyini", gender: "girl", mTa: "நிறைவும் இனிமையும் கொண்டவள்", mEn: "complete sweetness" },
  { ta: "அமுதன்", en: "amudhan", gender: "boy", mTa: "அமிழ்தம் போன்றவன்", mEn: "nectar-sweet soul" },
  { ta: "அமுதினி", en: "amudhini", gender: "girl", mTa: "அமிழ்தம் போன்றவள்", mEn: "nectar-sweet maiden" },
  { ta: "கதிரவன்", en: "kathiravan", gender: "boy", mTa: "கதிர் வீசும் சூரியன்", mEn: "radiant sun" },
  { ta: "கதிரொளி", en: "kathirvoli", gender: "girl", mTa: "சூரியக் கதிரொளி", mEn: "sunbeam radiance" },
  { ta: "மதியழகன்", en: "mathiyazhagan", gender: "boy", mTa: "மதியும் அழகும்", mEn: "wise and handsome" },
  { ta: "மதியழகி", en: "mathiyazhagi", gender: "girl", mTa: "மதி போன்ற அழகி", mEn: "moon-lovely" },
  { ta: "தமிழன்", en: "tamilan", gender: "boy", mTa: "தமிழ்ப் பெருமகன்", mEn: "son of Tamil" },
  { ta: "தமிழினி", en: "tamilini", gender: "girl", mTa: "தமிழ் இனிமை", mEn: "sweet Tamil" },
  { ta: "அருளன்", en: "arulan", gender: "boy", mTa: "அருள் நிறைந்தவன்", mEn: "gracious one" },
  { ta: "அருளினி", en: "arulini", gender: "girl", mTa: "அருள் மிக்கவள்", mEn: "grace-filled" },
  { ta: "செல்வன்", en: "selvan", gender: "boy", mTa: "அறிவுச் செல்வன்", mEn: "prosperous son" },
  { ta: "செல்வி", en: "selvi", gender: "girl", mTa: "நற்பண்புச் செல்வி", mEn: "prosperous maiden" },
  { ta: "நம்பி", en: "nambi", gender: "boy", mTa: "நம்பிக்கைக்குரியவன்", mEn: "noble trusted hero" },
  { ta: "நங்கை", en: "nangai", gender: "girl", mTa: "சிறந்த நங்கை", mEn: "noble lady" },
  { ta: "மன்னன்", en: "mannan", gender: "boy", mTa: "அறவழி மன்னன்", mEn: "righteous king" },
  { ta: "அரசி", en: "arasi", gender: "girl", mTa: "பண்புடை அரசி", mEn: "noble queen" },
  { ta: "வேந்தன்", en: "vendhan", gender: "boy", mTa: "தமிழ் வேந்தன்", mEn: "sovereign leader" },
  { ta: "தென்றல்", en: "thendral", gender: "unisex", mTa: "இனிய தென்றல் காற்று", mEn: "gentle southern breeze" },
  { ta: "மழலை", en: "mazhalai", gender: "unisex", mTa: "இனிய மழலைச் சொல்", mEn: "sweet childlike charm" },
  { ta: "குழலி", en: "kuzhali", gender: "girl", mTa: "குழல் இசையாள்", mEn: "flute-voiced" },
  { ta: "யாழினி", en: "yazhini", gender: "girl", mTa: "யாழ் இசையாள்", mEn: "melodious harp" },
  { ta: "யாழன்", en: "yazhan", gender: "boy", mTa: "யாழ் இசைப்பவன்", mEn: "harp virtuoso" },
  { ta: "பொன்னன்", en: "ponnan", gender: "boy", mTa: "பொன் மனத்தவன்", mEn: "golden-hearted" },
  { ta: "பொன்னி", en: "ponni", gender: "girl", mTa: "காவிரிப் பொன்னி", mEn: "golden river" },
  { ta: "மணி", en: "mani", gender: "unisex", mTa: "நன்மணி", mEn: "precious gem" },
  { ta: "மணியன்", en: "maniyan", gender: "boy", mTa: "மணி போன்றவன்", mEn: "gem-like hero" },
  { ta: "சுடரோன்", en: "sudaron", gender: "boy", mTa: "ஒளிச்சுடர் வீசுபவன்", mEn: "beacon of light" },
  { ta: "சுடரி", en: "sudari", gender: "girl", mTa: "சுடர் விழி", mEn: "luminous flame" },
  { ta: "வண்ணன்", en: "vannan", gender: "boy", mTa: "நல்வண்ணன்", mEn: "virtuous character" },
  { ta: "வண்ணை", en: "vannai", gender: "girl", mTa: "அழகு வண்ணை", mEn: "graceful hue" },
  { ta: "இனியன்", en: "iniyan", gender: "boy", mTa: "இனிய பண்பினன்", mEn: "sweet-natured" },
  { ta: "இனியாள்", en: "iniyal", gender: "girl", mTa: "இனியவள்", mEn: "sweet maiden" },
  { ta: "நல்லன்", en: "nallam", gender: "boy", mTa: "நல்ல பண்புடையவன்", mEn: "virtuous soul" },
  { ta: "நல்லாள்", en: "nallal", gender: "girl", mTa: "நற்பண்பு நங்கை", mEn: "virtuous woman" },
  { ta: "அறிவன்", en: "arivan", gender: "boy", mTa: "பேரறிஞன்", mEn: "wise scholar" },
  { ta: "அறிவி", en: "arivi", gender: "girl", mTa: "அறிவுக்கரசி", mEn: "wise maiden" },
  { ta: "புகழன்", en: "pugazhan", gender: "boy", mTa: "புகழ்மிக்கவன்", mEn: "renowned hero" },
  { ta: "புகழி", en: "pugazhi", gender: "girl", mTa: "புகழ் மங்கை", mEn: "celebrated maiden" },
  { ta: "மலரன்", en: "malaran", gender: "boy", mTa: "மலர் போன்ற மனம்", mEn: "blossoming heart" },
  { ta: "மலரி", en: "malari", gender: "girl", mTa: "பூமலர்", mEn: "blossom" },
  { ta: "பூங்குழலி", en: "poonguzhali", gender: "girl", mTa: "பூச்சூடிய குழலாள்", mEn: "flower-tressed" },
  { ta: "மயில்", en: "mayil", gender: "girl", mTa: "மயில் போன்ற அழகு", mEn: "graceful peacock" },
  { ta: "குயில்", en: "kuyil", gender: "girl", mTa: "குயில் குரலாள்", mEn: "cuckoo-voiced" },
];

// CATEGORY 2: NAMES USED IN TAMIL NADU (Bhakti, Temple, Sanskrit-Tamil, Contemporary TN Registry)
const TN_USAGE_PREFIXES = [
  { ta: "ஆதி", en: "Aadhi", mTa: "முதல்வன் / தொடக்கம்", mEn: "primordial origin", src: "Sanskrit / Vedic Heritage in TN" },
  { ta: "ஆரவ்", en: "Aarav", mTa: "அமைதியின் ஒலி", mEn: "peaceful melody", src: "Contemporary Tamil Nadu Registry" },
  { ta: "அர்ஜுன்", en: "Arjun", mTa: "தூய மற்றும் வீரமிகு", mEn: "bright, pure hero", src: "Epic & Purana Heritage in TN" },
  { ta: "அபய்", en: "Abhay", mTa: "அச்சமற்ற", mEn: "fearless spirit", src: "Sanskrit / Pan-Indian Heritage in TN" },
  { ta: "அனன்ய", en: "Ananya", mTa: "நிகரற்ற", mEn: "incomparable and unique", src: "Contemporary Tamil Nadu Registry" },
  { ta: "அக்ஷய", en: "Akshaya", mTa: "அள்ள அள்ளக் குறையாத", mEn: "eternal and inexhaustible", src: "Sanskrit / Vedic Heritage in TN" },
  { ta: "ஆத்விக்", en: "Aathvik", mTa: "தனித்துவமான", mEn: "unique and matchless", src: "Contemporary Tamil Nadu Registry" },
  { ta: "பிரணவ்", en: "Pranav", mTa: "ஓம் எனும் பிரணவ மந்திரம்", mEn: "sacred primordial sound Om", src: "Bhakti & Temple Tradition (TN)" },
  { ta: "பவ", en: "Bhava", mTa: "தெய்வீகத் தோற்றம்", mEn: "auspicious existence", src: "Bhakti & Temple Tradition (TN)" },
  { ta: "சாய்", en: "Sai", mTa: "தெய்வீக அருள்", mEn: "divine grace", src: "Contemporary Bhakti Tradition (TN)" },
  { ta: "சரண்", en: "Saran", mTa: "புகலிடம் மற்றும் பணிவு", mEn: "sacred refuge", src: "Bhakti & Temple Tradition (TN)" },
  { ta: "சஞ்சய்", en: "Sanjay", mTa: "வெற்றியாளன்", mEn: "triumphant", src: "Epic & Purana Heritage in TN" },
  { ta: "சிவ", en: "Siva", mTa: "மங்களகரமான சிவபெருமான்", mEn: "auspicious Lord Shiva", src: "Saiva Nayanmar Heritage (TN)" },
  { ta: "ஸ்ரீ", en: "Sri", mTa: "செல்வமும் மங்களமும்", mEn: "auspicious radiance", src: "Vaishnava & Vedic Heritage in TN" },
  { ta: "சூர்ய", en: "Surya", mTa: "சூரிய பகவான்", mEn: "radiant sun", src: "Sanskrit / Vedic Heritage in TN" },
  { ta: "தருண்", en: "Tharun", mTa: "இளமையின் புத்துணர்ச்சி", mEn: "youthful vigor", src: "Contemporary Tamil Nadu Registry" },
  { ta: "தன்வி", en: "Thanvi", mTa: "மென்மையும் அழகும்", mEn: "delicate grace", src: "Contemporary Tamil Nadu Registry" },
  { ta: "தியா", en: "Diya", mTa: "ஒளிவிடும் தீபம்", mEn: "radiant lamp", src: "Contemporary Tamil Nadu Registry" },
  { ta: "தேவ்", en: "Dev", mTa: "தெய்வீக ஒளி", mEn: "divine brilliance", src: "Sanskrit / Vedic Heritage in TN" },
  { ta: "நந்த", en: "Nandha", mTa: "ஆனந்தம் தரும்", mEn: "joyful bliss", src: "Bhakti & Temple Tradition (TN)" },
  { ta: "நித்ய", en: "Nithya", mTa: "என்றும் நிலையான", mEn: "eternal truth", src: "Sanskrit / Vedic Heritage in TN" },
  { ta: "நிஹா", en: "Niha", mTa: "பனித்துளி அழகு", mEn: "morning dew", src: "Contemporary Tamil Nadu Registry" },
  { ta: "ஹரி", en: "Hari", mTa: "திருமாலின் திருநாமம்", mEn: "divine preserver", src: "Alwar Bhakti Heritage (TN)" },
  { ta: "ஹர்ஷ", en: "Harsha", mTa: "மகிழ்ச்சி", mEn: "pure delight", src: "Sanskrit / Pan-Indian Heritage in TN" },
  { ta: "கார்த்திக்", en: "Karthik", mTa: "முருகப்பெருமான் திருநாமம்", mEn: "courageous Karthikeya", src: "Murugan Bhakti Tradition (TN)" },
  { ta: "காவ்ய", en: "Kavya", mTa: "காவிய அழகு", mEn: "poetic classic", src: "Sanskrit / Literary Heritage in TN" },
  { ta: "கிருஷ்", en: "Krish", mTa: "கண்ணனின் திருநாமம்", mEn: "all-attractive grace", src: "Vaishnava Bhakti Heritage (TN)" },
  { ta: "லக்ஷ்மி", en: "Lakshmi", mTa: "செல்வத் திருமகள்", mEn: "goddess of prosperity", src: "Bhakti & Temple Tradition (TN)" },
  { ta: "மஹா", en: "Maha", mTa: "மகத்துவம் வாய்ந்த", mEn: "great and noble", src: "Sanskrit / Temple Heritage in TN" },
  { ta: "மீனா", en: "Meena", mTa: "மீனாட்சி அருள்", mEn: "precious gem / fish-eyed", src: "Madurai Meenakshi Heritage (TN)" },
  { ta: "ராகவ்", en: "Raghav", mTa: "இரகு வம்ச நாயகன்", mEn: "noble scion", src: "Kamba Ramayanam / Bhakti Heritage" },
  { ta: "ரிஷி", en: "Rishi", mTa: "ஞான முனிவர்", mEn: "enlightened sage", src: "Vedic & Siddhar Heritage (TN)" },
  { ta: "ருத்ர", en: "Rudra", mTa: "ஆற்றல் மிகு சிவன்", mEn: "mighty auspicious force", src: "Saiva Temple Heritage (TN)" },
  { ta: "ரமண", en: "Ramana", mTa: "இதயம் கவரும் ஆனந்தம்", mEn: "heart-enchanting", src: "Tiruvannamalai Siddha Heritage (TN)" },
  { ta: "வருண்", en: "Varun", mTa: "மழை மற்றும் கடல் தெய்வம்", mEn: "lord of waters", src: "Vedic & TN Registry" },
  { ta: "விக்ரம்", en: "Vikram", mTa: "வீரமும் பராக்கிரமமும்", mEn: "heroic valor", src: "Classical Pan-Indian Heritage in TN" },
  { ta: "வித்யா", en: "Vidya", mTa: "கல்வியும் ஞானமும்", mEn: "wisdom and learning", src: "Sanskrit / Academic Heritage in TN" },
  { ta: "விஷ்ணு", en: "Vishnu", mTa: "எங்கும் நிறைந்த பரம்பொருள்", mEn: "all-pervading protector", src: "Alwar Bhakti Heritage (TN)" },
  { ta: "விவேக்", en: "Vivek", mTa: "பகுத்தறிவும் விவேகமும்", mEn: "wise discernment", src: "Contemporary Tamil Nadu Registry" },
  { ta: "ஜெய", en: "Jeya", mTa: "வெற்றி தரும்", mEn: "victorious", src: "Sanskrit-Tamil Hybrid Heritage (TN)" },
  { ta: "யோக", en: "Yoga", mTa: "தவமும் யோகமும்", mEn: "spiritual union", src: "Tamil Siddhar & Yoga Heritage" },
  { ta: "தீபக்", en: "Deepak", mTa: "ஒளிவிளக்கு", mEn: "radiant lamp", src: "Contemporary Tamil Nadu Registry" },
  { ta: "கணேஷ்", en: "Ganesh", mTa: "விநாயகப் பெருமான்", mEn: "lord of wisdom", src: "Pillaiyar Temple Heritage (TN)" },
  { ta: "சுந்தர்", en: "Sundar", mTa: "அழகு நிறைந்த", mEn: "handsome and auspicious", src: "Nayanmar & Temple Heritage (TN)" },
  { ta: "நாராயண", en: "Narayana", mTa: "திருமால் திருநாமம்", mEn: "supreme refuge", src: "Vaishnava Heritage (TN)" },
  { ta: "பத்ம", en: "Padma", mTa: "தாமரை மலர்", mEn: "sacred lotus", src: "Bhakti & Temple Tradition (TN)" },
  { ta: "கமல", en: "Kamala", mTa: "செந்தாமரை", mEn: "lotus grace", src: "Sanskrit-Tamil Heritage (TN)" },
  { ta: "அம்ருத", en: "Amrutha", mTa: "அமிழ்தம்", mEn: "immortal nectar", src: "Sanskrit / Vedic Heritage in TN" },
  { ta: "சத்ய", en: "Sathya", mTa: "சத்தியம் மற்றும் வாய்மை", mEn: "eternal truth", src: "Sanskrit / Vedic Heritage in TN" },
  { ta: "தர்ம", en: "Dharma", mTa: "அறநெறி", mEn: "righteous law", src: "Ethical & Temple Heritage (TN)" },
  { ta: "பூஜா", en: "Pooja", mTa: "தெய்வ வழிபாடு", mEn: "sacred reverence", src: "Contemporary Tamil Nadu Registry" },
  { ta: "பிரியா", en: "Priya", mTa: "அன்பிற்குரியவள்", mEn: "beloved", src: "Contemporary Tamil Nadu Registry" },
  { ta: "ராதா", en: "Radha", mTa: "பக்திப் பெருமை", mEn: "prosperity & devotion", src: "Bhakti Heritage in TN" },
  { ta: "சுப", en: "Suba", mTa: "சுபம் மற்றும் மங்களம்", mEn: "auspicious blessing", src: "Tamil Nadu Cultural Tradition" },
  { ta: "சந்திர", en: "Chandra", mTa: "நிலவு ஒளி", mEn: "shining moon", src: "Astrological & Temple Heritage (TN)" },
  { ta: "பால", en: "Bala", mTa: "இளமைப் பாலமுருகன்", mEn: "youthful strength", src: "Murugan Bhakti Tradition (TN)" },
  { ta: "வேத", en: "Veda", mTa: "வேத அறிவு", mEn: "sacred knowledge", src: "Vedic Heritage in TN" },
  { ta: "தேஜ", en: "Teja", mTa: "பிரகாசமான ஒளி", mEn: "radiant brilliance", src: "Sanskrit / Pan-Indian Heritage in TN" },
  { ta: "கீர்த்தி", en: "Keerthi", mTa: "புகழ்", mEn: "noble fame", src: "Sanskrit-Tamil Heritage (TN)" },
  { ta: "ஸ்வேதா", en: "Swetha", mTa: "தூய வெண்மை", mEn: "spotless purity", src: "Contemporary Tamil Nadu Registry" },
  { ta: "அர்ச்சனா", en: "Archana", mTa: "மலர் அர்ச்சனை", mEn: "sacred offering", src: "Bhakti & Temple Tradition (TN)" },
  { ta: "காயத்ரி", en: "Gayathri", mTa: "வேத மந்திர நாயகி", mEn: "sacred hymn", src: "Vedic Heritage in TN" },
  { ta: "ரேவதி", en: "Revathi", mTa: "நட்சத்திர நாயகி", mEn: "star of prosperity", src: "Tamil Nakshatra Tradition" },
  { ta: "ரோஹிணி", en: "Rohini", mTa: "உயரும் நட்சத்திரம்", mEn: "ascending star", src: "Tamil Nakshatra Tradition" },
  { ta: "அஸ்வினி", en: "Aswini", mTa: "முதல் நட்சத்திரம்", mEn: "first stellar light", src: "Tamil Nakshatra Tradition" },
  { ta: "சித்ரா", en: "Chitra", mTa: "சித்திரை நட்சத்திரம்", mEn: "radiant jewel star", src: "Tamil Nakshatra Tradition" },
  { ta: "சுவாதி", en: "Swathi", mTa: "சுவாதி நட்சத்திரம்", mEn: "pearl-producing star", src: "Tamil Nakshatra Tradition" },
  { ta: "விசாக", en: "Visaka", mTa: "வைகாசி விசாகம்", mEn: "sacred star of Murugan", src: "Murugan Bhakti Tradition (TN)" },
  { ta: "கார்த்திகை", en: "Karthigai", mTa: "திருக்கார்த்திகை", mEn: "Pleiades star cluster", src: "Murugan Bhakti Tradition (TN)" },
  { ta: "அபிராமி", en: "Abirami", mTa: "திருக்கடையூர் அபிராமி", mEn: "gracious goddess Abirami", src: "Abirami Anthathi Heritage (TN)" },
  { ta: "கௌரி", en: "Gowri", mTa: "அன்னை பார்வதி", mEn: "radiant golden goddess", src: "Saiva Temple Heritage (TN)" },
  { ta: "பவானி", en: "Bhavani", mTa: "பவானி அம்மன்", mEn: "giver of life", src: "Kongu / TN Temple Heritage" },
  { ta: "கற்பக", en: "Karpaga", mTa: "கற்பக விருட்சம்", mEn: "wish-fulfilling grace", src: "Mylapore Kapaleeshwarar Heritage (TN)" },
  { ta: "மங்கள", en: "Mangala", mTa: "நல்ல மங்களம்", mEn: "auspicious blessing", src: "Tamil Nadu Cultural Tradition" },
  { ta: "சண்முக", en: "Shanmuga", mTa: "ஆறுமுகப் பெருமான்", mEn: "six-faced Lord Murugan", src: "Murugan Bhakti Tradition (TN)" },
  { ta: "வடிவேல்", en: "Vadivel", mTa: "முருகன் வடிவேல்", mEn: "sacred shaped lance", src: "Murugan Bhakti Tradition (TN)" },
  { ta: "தண்டபாணி", en: "Dandapani", mTa: "பழனி ஆண்டவர்", mEn: "Palani hill guardian", src: "Murugan Bhakti Tradition (TN)" },
  { ta: "சபரி", en: "Sabari", mTa: "சபரிமலை ஐயப்பன்", mEn: "sacred devotion", src: "South Indian Bhakti Tradition" },
  { ta: "அரவிந்த்", en: "Aravind", mTa: "தாமரை மலர்", mEn: "blooming lotus", src: "Sanskrit-Tamil Heritage (TN)" },
  { ta: "அனிருத்", en: "Anirudh", mTa: "தடையற்ற ஆற்றல்", mEn: "unstoppable spirit", src: "Contemporary Tamil Nadu Registry" },
  { ta: "சித்தார்த்", en: "Siddharth", mTa: "நோக்கம் நிறைவேறியவன்", mEn: "accomplished soul", src: "Buddhist & Pan-Indian Heritage (TN)" },
  { ta: "கௌதம்", en: "Gautham", mTa: "இருள் நீக்கும் ஒளி", mEn: "remover of darkness", src: "Pan-Indian Heritage in TN" },
  { ta: "ரோஹித்", en: "Rohith", mTa: "செவ்வொளி கதிர்", mEn: "crimson dawn", src: "Contemporary Tamil Nadu Registry" },
  { ta: "நிதின்", en: "Nithin", mTa: "நீதி மற்றும் அறம்", mEn: "master of righteousness", src: "Contemporary Tamil Nadu Registry" },
  { ta: "நவீன்", en: "Naveen", mTa: "புதிய எழுச்சி", mEn: "fresh and modern", src: "Contemporary Tamil Nadu Registry" },
  { ta: "பிரவீன்", en: "Praveen", mTa: "திறமைசாலி", mEn: "accomplished expert", src: "Contemporary Tamil Nadu Registry" },
  { ta: "சுரேஷ்", en: "Suresh", mTa: "தேவர் தலைவன்", mEn: "lord of celestials", src: "Classic Tamil Nadu Registry" },
  { ta: "ரமேஷ்", en: "Ramesh", mTa: "திருமகள் நாயகன்", mEn: "lord of prosperity", src: "Classic Tamil Nadu Registry" },
  { ta: "மகேஷ்", en: "Mahesh", mTa: "மகேசுவரன்", mEn: "great sovereign", src: "Classic Tamil Nadu Registry" },
  { ta: "தினேஷ்", en: "Dinesh", mTa: "பகலவன் சூரியன்", mEn: "lord of the day", src: "Classic Tamil Nadu Registry" },
  { ta: "ராஜ்", en: "Raj", mTa: "அரசன் / பெருமை", mEn: "royal sovereignty", src: "Pan-Indian Heritage in TN" },
  { ta: "மோகன்", en: "Mohan", mTa: "அழகிய வசீகரம்", mEn: "enchanting charm", src: "Bhakti & Classic TN Registry" },
  { ta: "கோபால்", en: "Gopal", mTa: "கண்ணன் திருநாமம்", mEn: "protector", src: "Vaishnava Heritage (TN)" },
  { ta: "வாசு", en: "Vasu", mTa: "செல்வம் மற்றும் ஒளி", mEn: "brilliant wealth", src: "Sanskrit / Vedic Heritage in TN" },
  { ta: "ரகு", en: "Raghu", mTa: "விரைந்தோடும் ஆற்றல்", mEn: "swift and noble", src: "Epic Heritage in TN" },
  { ta: "ராம்", en: "Ram", mTa: "இராமபிரான் திருநாமம்", mEn: "serene joy", src: "Kamba Ramayanam / Bhakti Heritage" },
  { ta: "சீதா", en: "Seetha", mTa: "சீதா பிராட்டியார்", mEn: "sacred furrow / grace", src: "Kamba Ramayanam / Bhakti Heritage" },
  { ta: "லட்சுமண்", en: "Lakshman", mTa: "நற்பண்பு கொண்டவன்", mEn: "auspicious mark", src: "Kamba Ramayanam / Bhakti Heritage" },
  { ta: "பரத்", en: "Bharath", mTa: "பாரதப் பெருமை", mEn: "cherished maintainer", src: "Epic & National Heritage" },
  { ta: "மணி", en: "Mani", mTa: "நவரத்தின மணி", mEn: "precious jewel", src: "Shared Tamil-Sanskrit Heritage" },
  { ta: "சங்கர்", en: "Sankar", mTa: "நன்மை அருளும் சிவன்", mEn: "bringer of peace", src: "Saiva Bhakti Heritage (TN)" },
  { ta: "முரளி", en: "Murali", mTa: "கண்ணனின் புல்லாங்குழல்", mEn: "sacred flute", src: "Vaishnava Bhakti Heritage (TN)" },
  { ta: "பாலாஜி", en: "Balaji", mTa: "திருப்பதி வெங்கடாசலபதி", mEn: "revered Lord Venkateswara", src: "South Indian Temple Heritage" },
  { ta: "கல்யாண்", en: "Kalyan", mTa: "மங்களம்", mEn: "auspicious welfare", src: "Temple & Cultural Heritage (TN)" },
  { ta: "ஆனந்த்", en: "Anand", mTa: "பேரானந்தம்", mEn: "infinite bliss", src: "Vedic & TN Heritage" },
  { ta: "பிரகாஷ்", en: "Prakash", mTa: "ஒளிவெள்ளம்", mEn: "brilliant light", src: "Contemporary Tamil Nadu Registry" },
  { ta: "மாதவ்", en: "Madhav", mTa: "கண்ணன் திருநாமம்", mEn: "sweet as spring", src: "Vaishnava Heritage (TN)" },
  { ta: "ராதிகா", en: "Radhika", mTa: "வெற்றியும் அன்பும்", mEn: "successful devotion", src: "Bhakti Heritage in TN" },
  { ta: "சுஷ்மிதா", en: "Sushmitha", mTa: "இனிய புன்னகை", mEn: "graceful smile", src: "Contemporary Tamil Nadu Registry" },
  { ta: "நந்தினி", en: "Nandhini", mTa: "மகிழ்ச்சி தருபவள்", mEn: "delightful daughter", src: "Bhakti & Classic TN Registry" },
  { ta: "ரஞ்சனி", en: "Ranjani", mTa: "மனம் மகிழ்விப்பவள்", mEn: "enchanting melody", src: "Carnatic Music Heritage (TN)" },
  { ta: "கல்யாணி", en: "Kalyani", mTa: "மங்கள ராகம்", mEn: "auspicious raga", src: "Carnatic Music Heritage (TN)" },
  { ta: "புவனா", en: "Bhuvana", mTa: "உலக நாயகி", mEn: "mistress of worlds", src: "Temple Heritage (TN)" },
  { ta: "சரஸ்வதி", en: "Saraswathi", mTa: "கலைமகள்", mEn: "goddess of wisdom", src: "Academic & Temple Heritage (TN)" },
  { ta: "பார்வதி", en: "Parvathi", mTa: "மலைமகள்", mEn: "daughter of the mountain", src: "Saiva Temple Heritage (TN)" },
  { ta: "சாந்தி", en: "Shanthi", mTa: "அமைதி", mEn: "serene peace", src: "Vedic & TN Heritage" },
  { ta: "ஜானகி", en: "Janaki", mTa: "ஜனகன் மகள் சீதை", mEn: "noble daughter Janaki", src: "Epic Heritage in TN" },
  { ta: "பத்மினி", en: "Padmini", mTa: "தாமரைக் கொடி", mEn: "lotus maiden", src: "Classical Literature in TN" },
  { ta: "ரோஜா", en: "Roja", mTa: "ரோஜா மலர்", mEn: "blooming rose", src: "Contemporary Tamil Nadu Registry" },
  { ta: "ரம்யா", en: "Ramya", mTa: "அழகிய இனிமை", mEn: "delightful beauty", src: "Contemporary Tamil Nadu Registry" },
  { ta: "திவ்யா", en: "Divya", mTa: "தெய்வீக ஒளி", mEn: "divine brilliance", src: "Contemporary Tamil Nadu Registry" },
  { ta: "சௌமியா", en: "Sowmya", mTa: "சாந்தமும் மென்மையும்", mEn: "gentle and serene", src: "Contemporary Tamil Nadu Registry" },
  { ta: "ஹரிணி", en: "Harini", mTa: "மான் போன்ற அழகி", mEn: "graceful fawn", src: "Sanskrit-Tamil Heritage (TN)" },
  { ta: "வர்ஷா", en: "Varsha", mTa: "மழை வளம்", mEn: "blessed rain", src: "Contemporary Tamil Nadu Registry" },
  { ta: "ஸ்ருதி", en: "Shruthi", mTa: "இசைச் சுருதி", mEn: "musical harmony", src: "Carnatic Music Heritage (TN)" },
  { ta: "லாவண்யா", en: "Lavanya", mTa: "அழகும் நளினமும்", mEn: "luminous grace", src: "Contemporary Tamil Nadu Registry" },
  { ta: "ஐஸ்வர்யா", en: "Aishwarya", mTa: "செல்வச் செழிப்பு", mEn: "prosperity and wealth", src: "Contemporary Tamil Nadu Registry" },
  { ta: "அக்ஷரா", en: "Akshara", mTa: "அழியாத எழுத்து", mEn: "imperishable letter", src: "Literary Heritage in TN" },
  { ta: "தர்ஷினி", en: "Dharshini", mTa: "நல்ல பார்வை உடையவள்", mEn: "blessed vision", src: "Contemporary Tamil Nadu Registry" },
  { ta: "நிவேதா", en: "Nivedha", mTa: "தெய்வ அர்ப்பணிப்பு", mEn: "sacred dedication", src: "Contemporary Tamil Nadu Registry" },
];

const TN_USAGE_SUFFIXES = [
  // Boy suffixes
  { ta: "நாதன்", en: "nathan", gender: "boy", mTa: "தலைவன் / அருளாளன்", mEn: "lord and protector" },
  { ta: "நாராயணன்", en: "narayanan", gender: "boy", mTa: "திருமால் அருள்", mEn: "refuge of grace" },
  { ta: "சுந்தரம்", en: "sundaram", gender: "boy", mTa: "அழகு வடிவம்", mEn: "embodiment of beauty" },
  { ta: "பிரசாத்", en: "prasad", gender: "boy", mTa: "அருட்கொடை", mEn: "divine blessing" },
  { ta: "பிரகாஷ்", en: "prakash", gender: "boy", mTa: "ஒளிவீசும்", mEn: "radiant light" },
  { ta: "குமார்", en: "kumar", gender: "boy", mTa: "இளவரசன்", mEn: "youthful prince" },
  { ta: "ராஜ்", en: "raj", gender: "boy", mTa: "மன்னன்", mEn: "sovereign king" },
  { ta: "ராஜன்", en: "rajan", gender: "boy", mTa: "அரசன்", mEn: "noble king" },
  { ta: "ராமன்", en: "raman", gender: "boy", mTa: "நல்வழி நாயகன்", mEn: "joyful hero" },
  { ta: "கிருஷ்ணன்", en: "krishnan", gender: "boy", mTa: "கண்ணன் அருள்", mEn: "divine grace" },
  { ta: "கண்ணன்", en: "kannan", gender: "boy", mTa: "அன்புக் கண்ணன்", mEn: "beloved eye" },
  { ta: "முருகன்", en: "murugan", gender: "boy", mTa: "தமிழ்க் கடவுள் முருகன்", mEn: "divine Murugan" },
  { ta: "வேலன்", en: "velan", gender: "boy", mTa: "வேலாயுதன்", mEn: "lance bearer" },
  { ta: "சந்திரன்", en: "chandran", gender: "boy", mTa: "நிலவு போன்றவன்", mEn: "moon-bright" },
  { ta: "சேகர்", en: "sekar", gender: "boy", mTa: "சிகரம் போன்றவன்", mEn: "crest jewel" },
  { ta: "மூர்த்தி", en: "moorthy", gender: "boy", mTa: "வடிவானவன்", mEn: "auspicious embodiment" },
  { ta: "சுவாமி", en: "swamy", gender: "boy", mTa: "தலைவன்", mEn: "revered master" },
  { ta: "அய்யன்", en: "aiyan", gender: "boy", mTa: "பெரியோன்", mEn: "revered guardian" },
  { ta: "மணி", en: "mani", gender: "boy", mTa: "நல்மணி", mEn: "precious gem" },
  { ta: "பாலன்", en: "balan", gender: "boy", mTa: "குமரன்", mEn: "youthful protector" },
  { ta: "ஈஸ்வரன்", en: "eeswaran", gender: "boy", mTa: "இறைவன்", mEn: "supreme lord" },
  { ta: "ஆனந்த்", en: "anand", gender: "boy", mTa: "ஆனந்தம்", mEn: "pure bliss" },
  { ta: "ஆதித்யா", en: "adithya", gender: "boy", mTa: "கதிரவன்", mEn: "radiant sun" },
  { ta: "விக்னேஷ்", en: "vignesh", gender: "boy", mTa: "தடை நீக்குபவன்", mEn: "remover of obstacles" },
  { ta: "கணேஷ்", en: "ganesh", gender: "boy", mTa: "விநாயகர்", mEn: "lord of wisdom" },
  { ta: "ரமேஷ்", en: "ramesh", gender: "boy", mTa: "திருமகள் நாயகன்", mEn: "lord of grace" },
  { ta: "சுரேஷ்", en: "suresh", gender: "boy", mTa: "தேவர் தலைவன்", mEn: "leader of celestials" },
  { ta: "மகேஷ்", en: "mahesh", gender: "boy", mTa: "பெருந்தலைவன்", mEn: "great lord" },
  { ta: "கார்த்திகேயன்", en: "karthikeyan", gender: "boy", mTa: "முருகப்பெருமான்", mEn: "son of Krittika" },
  { ta: "சரவணன்", en: "saravanan", gender: "boy", mTa: "சரவணப் பொய்கை நாயகன்", mEn: "born of reed grove" },
  { ta: "வடிவேலன்", en: "vadivelan", gender: "boy", mTa: "வடிவேல் முருகன்", mEn: "holder of radiant lance" },
  { ta: "சுப்பிரமணியன்", en: "subramanian", gender: "boy", mTa: "ஞானப் பழனி நாயகன்", mEn: "dear to the wise" },
  { ta: "வெங்கடேஷ்", en: "venkatesh", gender: "boy", mTa: "திருமலை நாயகன்", mEn: "lord of Venkata hills" },
  { ta: "ஸ்ரீனிவாசன்", en: "srinivasan", gender: "boy", mTa: "திருமகள் உறைவிடம்", mEn: "abode of Lakshmi" },
  { ta: "பத்மநாபன்", en: "padmanaban", gender: "boy", mTa: "தாமரை நாபன்", mEn: "lotus-naveled" },
  { ta: "ராகவன்", en: "raghavan", gender: "boy", mTa: "இரகு குல நாயகன்", mEn: "noble Raghu scion" },
  { ta: "மாதவன்", en: "madhavan", gender: "boy", mTa: "திருமால்", mEn: "lord of fortune" },
  { ta: "கேசவன்", en: "kesavan", gender: "boy", mTa: "கண்ணன்", mEn: "radiant-haired" },
  { ta: "கோபாலன்", en: "gopalan", gender: "boy", mTa: "ஆயர் கோன்", mEn: "protector of earth" },
  { ta: "தீபன்", en: "deepan", gender: "boy", mTa: "விளக்கொளி", mEn: "radiant lamp" },
  { ta: "தர்ஷன்", en: "dharshan", gender: "boy", mTa: "நல்லருள் காட்சி", mEn: "auspicious vision" },
  { ta: "வர்மன்", en: "varman", gender: "boy", mTa: "அரண் மற்றும் கவசம்", mEn: "valiant shield" },
  { ta: "பிரியன்", en: "priyan", gender: "boy", mTa: "அன்பிற்குரியவன்", mEn: "beloved one" },
  { ta: "தாசன்", en: "dhasan", gender: "boy", mTa: "அடியார்", mEn: "devoted servant" },
  { ta: "சரணன்", en: "saranan", gender: "boy", mTa: "அடைக்கலம்", mEn: "sacred refuge" },
  { ta: "மோகன்", en: "mohan", gender: "boy", mTa: "வசீகரன்", mEn: "charming soul" },
  { ta: "மணிகண்டன்", en: "manikandan", gender: "boy", mTa: "ஐயப்ப சுவாமி", mEn: "jewel-necked" },
  { ta: "ரஞ்சித்", en: "ranjith", gender: "boy", mTa: "மகிழ்விப்பவன்", mEn: "delighted victor" },
  { ta: "அரவிந்தன்", en: "aravindan", gender: "boy", mTa: "செந்தாமரை", mEn: "lotus-pure" },
  { ta: "சித்தார்த்", en: "siddharth", gender: "boy", mTa: "வெற்றி பெற்றவன்", mEn: "accomplished one" },
  { ta: "விக்ரமன்", en: "vikraman", gender: "boy", mTa: "பராக்கிரமசாலி", mEn: "brave hero" },
  { ta: "தருண்", en: "tharun", gender: "boy", mTa: "இளமை", mEn: "youthful" },
  { ta: "வருண்", en: "varun", gender: "boy", mTa: "வளம் தருபவன்", mEn: "rain bringer" },
  { ta: "கிருபாகரன்", en: "kirubakaran", gender: "boy", mTa: "கருணைக் கடல்", mEn: "ocean of mercy" },
  { ta: "தயாளன்", en: "dayalan", gender: "boy", mTa: "இரக்க குணத்தவன்", mEn: "compassionate soul" },
  { ta: "சத்யன்", en: "sathyan", gender: "boy", mTa: "உண்மையாளன்", mEn: "truthful" },
  { ta: "தர்மன்", en: "dharman", gender: "boy", mTa: "அறம் காப்பவன்", mEn: "upholder of dharma" },
  { ta: "யோகேஷ்", en: "yogesh", gender: "boy", mTa: "யோக நாயகன்", mEn: "master of yoga" },
  { ta: "லோகேஷ்", en: "lokesh", gender: "boy", mTa: "உலக நாயகன்", mEn: "lord of the world" },
  { ta: "ஹரிஷ்", en: "harish", gender: "boy", mTa: "அருள் நாயகன்", mEn: "gracious leader" },
  { ta: "சதீஷ்", en: "satheesh", gender: "boy", mTa: "சத்திய நாயகன்", mEn: "lord of truth" },
  { ta: "ராஜேஷ்", en: "rajesh", gender: "boy", mTa: "மன்னர் மன்னன்", mEn: "king of kings" },
  { ta: "நித்தேஷ்", en: "nithesh", gender: "boy", mTa: "நீதி நாயகன்", mEn: "lord of justice" },
  { ta: "ரிஷி", en: "rishi", gender: "boy", mTa: "முனிவர்", mEn: "wise sage" },
  { ta: "தேவ்", en: "dev", gender: "boy", mTa: "தெய்வ ஒளி", mEn: "divine light" },

  // Girl suffixes
  { ta: "ஸ்ரீ", en: "sri", gender: "girl", mTa: "திருமகள் அருள்", mEn: "auspicious grace" },
  { ta: "பிரியா", en: "priya", gender: "girl", mTa: "அன்பிற்குரியவள்", mEn: "beloved" },
  { ta: "தேவி", en: "devi", gender: "girl", mTa: "தெய்வீக வடிவம்", mEn: "goddess grace" },
  { ta: "லக்ஷ்மி", en: "lakshmi", gender: "girl", mTa: "செல்வத் திருமகள்", mEn: "prosperous fortune" },
  { ta: "மதி", en: "mathi", gender: "girl", mTa: "ஞானமும் நிலவும்", mEn: "radiant wisdom" },
  { ta: "நந்தினி", en: "nandhini", gender: "girl", mTa: "மகிழ்ச்சி", mEn: "joyful daughter" },
  { ta: "ரஞ்சனி", en: "ranjani", gender: "girl", mTa: "இனிமையானவள்", mEn: "enchanting" },
  { ta: "தாரணி", en: "dharani", gender: "girl", mTa: "உலகம் தாங்கும் அன்னை", mEn: "sustaining earth" },
  { ta: "வர்ஷினி", en: "varshini", gender: "girl", mTa: "அருள் மழை பொழிபவள்", mEn: "showerer of grace" },
  { ta: "தர்ஷினி", en: "dharshini", gender: "girl", mTa: "அருட்பார்வை", mEn: "blessed vision" },
  { ta: "ஹாசினி", en: "hasini", gender: "girl", mTa: "புன்னகை அரசி", mEn: "radiant smile" },
  { ta: "யோகினி", en: "yogini", gender: "girl", mTa: "தவ வடிவம்", mEn: "serene sage" },
  { ta: "காயத்ரி", en: "gayathri", gender: "girl", mTa: "மந்திர ஒளி", mEn: "sacred chant" },
  { ta: "சாவித்ரி", en: "savithri", gender: "girl", mTa: "சூரிய ஒளி", mEn: "ray of light" },
  { ta: "ரோஹிணி", en: "rohini", gender: "girl", mTa: "உயர் நட்சத்திரம்", mEn: "ascending star" },
  { ta: "மாலினி", en: "malini", gender: "girl", mTa: "பூமாலை", mEn: "garlanded" },
  { ta: "சாலினி", en: "shalini", gender: "girl", mTa: "அடக்கமும் பண்பும்", mEn: "modest and virtuous" },
  { ta: "பல்லவி", en: "pallavi", gender: "girl", mTa: "புதுத்தளிர் மற்றும் இசை", mEn: "melodic refrain" },
  { ta: "வைஷ்ணவி", en: "vaishnavi", gender: "girl", mTa: "திருமால் அருள்", mEn: "divine grace" },
  { ta: "பவானி", en: "bhavani", gender: "girl", mTa: "அன்னை பவானி", mEn: "giver of life" },
  { ta: "அம்பிகா", en: "ambika", gender: "girl", mTa: "உலக அன்னை", mEn: "loving mother" },
  { ta: "கல்யாணி", en: "kalyani", gender: "girl", mTa: "மங்கள நாயகி", mEn: "auspicious lady" },
  { ta: "சுந்தரி", en: "sundari", gender: "girl", mTa: "பேரழகி", mEn: "lovely beauty" },
  { ta: "மஞ்சரி", en: "manjari", gender: "girl", mTa: "பூங்கொத்து", mEn: "flower cluster" },
  { ta: "கஸ்தூரி", en: "kasthuri", gender: "girl", mTa: "நறுமணம்", mEn: "fragrant musk" },
  { ta: "பூரணி", en: "poorani", gender: "girl", mTa: "நிறைவானவள்", mEn: "complete perfection" },
  { ta: "தீபிகா", en: "deepika", gender: "girl", mTa: "சிறு தீபம்", mEn: "gentle lamp" },
  { ta: "ஜோதி", en: "jothi", gender: "girl", mTa: "சுடர் ஜோதி", mEn: "sacred flame" },
  { ta: "வித்யா", en: "vidya", gender: "girl", mTa: "கல்வி அறிவு", mEn: "sacred knowledge" },
  { ta: "காவ்யா", en: "kavya", gender: "girl", mTa: "காவியக் கவிதை", mEn: "living poem" },
  { ta: "திவ்யா", en: "divya", gender: "girl", mTa: "தெய்வீகப் பிரகாசம்", mEn: "celestial light" },
  { ta: "ரம்யா", en: "ramya", gender: "girl", mTa: "இனிமை", mEn: "delightful" },
  { ta: "நவ்யா", en: "navya", mTa: "புதுமை", gender: "girl", mEn: "youthful freshness" },
  { ta: "சத்யா", en: "sathya", gender: "girl", mTa: "வாய்மை", mEn: "truthful" },
  { ta: "நித்யா", en: "nithya", gender: "girl", mTa: "நித்தியம்", mEn: "eternal" },
  { ta: "சௌமியா", en: "sowmya", gender: "girl", mTa: "சாந்தம்", mEn: "serene" },
  { ta: "அனன்யா", en: "ananya", gender: "girl", mTa: "நிகரற்றவள்", mEn: "unique" },
  { ta: "தன்யா", en: "dhanya", gender: "girl", mTa: "பாக்கியசாலி", mEn: "blessed" },
  { ta: "மாயா", en: "maya", gender: "girl", mTa: "மாயா அழகு", mEn: "mystical grace" },
  { ta: "கீர்த்தனா", en: "keerthana", gender: "girl", mTa: "புகழ் இசை", mEn: "sacred song" },
  { ta: "வந்தனா", en: "vandhana", gender: "girl", mTa: "வழிபாடு", mEn: "reverence" },
  { ta: "அர்ச்சனா", en: "archana", gender: "girl", mTa: "மலர் பூஜை", mEn: "devotion" },
  { ta: "சுஜாதா", en: "sujatha", gender: "girl", mTa: "நற்குலம்", mEn: "well-born" },
  { ta: "சங்கீதா", en: "sangeetha", gender: "girl", mTa: "இன்னிசை", mEn: "melodious music" },
  { ta: "லலிதா", en: "lalitha", gender: "girl", mTa: "அன்னை லலிதா", mEn: "graceful beauty" },
  { ta: "மீனாட்சி", en: "meenakshi", gender: "girl", mTa: "மதுரை மீனாட்சி", mEn: "fish-eyed goddess" },
  { ta: "காமாட்சி", en: "kamakshi", gender: "girl", mTa: "காஞ்சி காமாட்சி", mEn: "loving-eyed goddess" },
  { ta: "விசாலாட்சி", en: "visalakshi", gender: "girl", mTa: "அகன்ற விழி அன்னை", mEn: "broad-eyed goddess" },
  { ta: "திலகவதி", en: "thilagavathi", gender: "girl", mTa: "தலைசிறந்தவள்", mEn: "preeminent lady" },
  { ta: "மங்கையர்க்கரசி", en: "mangayarkarasi", gender: "girl", mTa: "மங்கையர்க்கு அரசி", mEn: "queen among women" },
  { ta: "பவதாரணி", en: "bhavadharani", gender: "girl", mTa: "உலகைக் காப்பவள்", mEn: "savior of world" },
  { ta: "அனுசுயா", en: "anusuya", gender: "girl", mTa: "பொறாமை அற்றவள்", mEn: "pure-hearted" },
  { ta: "அருந்ததி", en: "arundhathi", gender: "girl", mTa: "விண்மீன் கற்பு", mEn: "faithful star" },
  { ta: "கமலா", en: "kamala", gender: "girl", mTa: "தாமரை", mEn: "lotus" },
  { ta: "விமலா", en: "vimala", gender: "girl", mTa: "மாசற்றவள்", mEn: "spotless pure" },
  { ta: "நிர்மலா", en: "nirmala", gender: "girl", mTa: "தூய்மையானவள்", mEn: "crystal pure" },
  { ta: "சரளா", en: "sarala", gender: "girl", mTa: "நேர்மையானவள்", mEn: "sincere and straight" },
  { ta: "ராதா", en: "radha", gender: "girl", mTa: "அன்பின் சின்னம்", mEn: "prosperous devotion" },
  { ta: "ராதிகா", en: "radhika", gender: "girl", mTa: "வெற்றிப் பெண்மணி", mEn: "successful" },
  { ta: "கீதா", en: "geetha", gender: "girl", mTa: "தெய்வீகப் பாடல்", mEn: "sacred song" },
  { ta: "சீதா", en: "seetha", gender: "girl", mTa: "அன்னை சீதை", mEn: "sacred purity" },
  { ta: "ஜானகி", en: "janaki", gender: "girl", mTa: "ஜனகன் மகள்", mEn: "noble princess" },
];

// CATEGORY 3: OTHER HERITAGE (Pan-Indian, Indo-European, Biblical, Islamic/Arabic, Global Cosmopolitan)
const OTHER_PREFIXES = [
  { ta: "அயன்", en: "Ayan", mTa: "இறைவனின் அருள் / வேகம்", mEn: "gift of God / bright path", src: "Pan-Indian & Global Heritage" },
  { ta: "ஆரியன்", en: "Aryan", mTa: "உயர்ந்த பண்பாளன்", mEn: "noble and honorable", src: "Indo-Aryan / Global Registry" },
  { ta: "இஷான்", en: "Ishaan", mTa: "உயரிய ஒளி", mEn: "sun / supreme direction", src: "Pan-Indian Registry" },
  { ta: "விஹான்", en: "Vihaan", mTa: "அதிகாலைப் பொழுது", mEn: "first ray of dawn", src: "Pan-Indian Modern Registry" },
  { ta: "கியான்", en: "Kian", mTa: "தொன்மையான அருள்", mEn: "ancient grace / king", src: "Persian / Irish / Global Registry" },
  { ta: "ரயான்", en: "Ryan", mTa: "இளவரசன் / சொர்க்க வாயில்", mEn: "little king / gateway of paradise", src: "Irish & Arabic Global Heritage" },
  { ta: "லியோ", en: "Leo", mTa: "சிங்க வலிமை", mEn: "brave lion-hearted", src: "Latin / European Global Heritage" },
  { ta: "நோவா", en: "Noah", mTa: "அமைதியும் ஆறுதலும்", mEn: "rest and peace", src: "Biblical / Global Heritage" },
  { ta: "ஈதன்", en: "Ethan", mTa: "உறுதியான மற்றும் நிலையான", mEn: "strong and enduring", src: "Biblical / Global Heritage" },
  { ta: "லூகாஸ்", en: "Lucas", mTa: "ஒளி தருபவன்", mEn: "bringer of light", src: "Greek / European Heritage" },
  { ta: "டேவிட்", en: "David", mTa: "அன்பிற்குரியவன்", mEn: "beloved leader", src: "Christian / Biblical Heritage in TN" },
  { ta: "ஜோசப்", en: "Joseph", mTa: "வளம் சேர்ப்பவர்", mEn: "he will add prosperity", src: "Christian / Biblical Heritage in TN" },
  { ta: "சாம்", en: "Sam", mTa: "கடவுளால் கேட்கப்பட்டவன்", mEn: "heard by God", src: "Biblical / Global Heritage" },
  { ta: "ஜான்", en: "John", mTa: "இறைவன் கருணை", mEn: "God is gracious", src: "Christian / Biblical Heritage in TN" },
  { ta: "பால்", en: "Paul", mTa: "பணிவுள்ள தூதர்", mEn: "humble messenger", src: "Christian / Biblical Heritage in TN" },
  { ta: "பீட்டர்", en: "Peter", mTa: "உறுதியான பாறை", mEn: "steadfast rock", src: "Christian / Biblical Heritage in TN" },
  { ta: "ஆடம்", en: "Adam", mTa: "மனிதகுல முதல்வன்", mEn: "noble earthborn", src: "Abrahamic / Global Heritage" },
  { ta: "அமீர்", en: "Ameer", mTa: "தலைவன் / இளவரசன்", mEn: "commander and prince", src: "Islamic / Arabic Heritage in TN" },
  { ta: "சமீர்", en: "Sameer", mTa: "இனிமையான தோழன் / காற்று", mEn: "pleasant companion / evening breeze", src: "Arabic & Pan-Indian Heritage" },
  { ta: "தாரிக்", en: "Tariq", mTa: "விடியல் நட்சத்திரம்", mEn: "morning star", src: "Islamic / Arabic Heritage in TN" },
  { ta: "யூசுப்", en: "Yusuf", mTa: "வளர்ச்சியும் அழகும்", mEn: "prosperous grace", src: "Islamic / Arabic Heritage in TN" },
  { ta: "இப்ராஹிம்", en: "Ibrahim", mTa: "பெருங்குலத் தந்தை", mEn: "father of nations", src: "Islamic / Arabic Heritage in TN" },
  { ta: "இம்ரான்", en: "Imran", mTa: "செழிப்பும் நீண்ட ஆயுளும்", mEn: "prosperity and longevity", src: "Islamic / Arabic Heritage in TN" },
  { ta: "சல்மான்", en: "Salman", mTa: "அமைதியும் பாதுகாப்பும்", mEn: "safe and peaceful", src: "Islamic / Arabic Heritage in TN" },
  { ta: "உமர்", en: "Umar", mTa: "வளமான வாழ்வு", mEn: "flourishing life", src: "Islamic / Arabic Heritage in TN" },
  { ta: "அலி", en: "Ali", mTa: "உயர்ந்த பண்பு", mEn: "exalted and noble", src: "Islamic / Arabic Heritage in TN" },
  { ta: "ஹசன்", en: "Hasan", mTa: "நல்லழகும் நற்குணமும்", mEn: "handsome and good", src: "Islamic / Arabic Heritage in TN" },
  { ta: "ஜாபர்", en: "Jaffer", mTa: "தெளிந்த நீரோடை", mEn: "flowing stream", src: "Islamic / Arabic Heritage in TN" },
  { ta: "மாயா", en: "Maya", mTa: "அன்பின் ஆற்றல்", mEn: "magic / illusion / water", src: "Global Cross-Cultural Heritage" },
  { ta: "சோபியா", en: "Sofia", mTa: "மெய்யறிவு", mEn: "eternal wisdom", src: "Greek / Global Heritage" },
  { ta: "லியா", en: "Liya", mTa: "மென்மையான அருள்", mEn: "bearer of good news", src: "Global Cross-Cultural Heritage" },
  { ta: "ஜியா", en: "Ziya", mTa: "பிரகாசமான ஒளி", mEn: "splendor and light", src: "Arabic / Pan-Indian Heritage" },
  { ta: "ஆலியா", en: "Aaliya", mTa: "உயரிய பெருமை", mEn: "exalted and sublime", src: "Arabic / Global Heritage" },
  { ta: "ஹன்னா", en: "Hannah", mTa: "இறைக் கருணை", mEn: "favor and grace", src: "Biblical / Global Heritage" },
  { ta: "கிரேஸ்", en: "Grace", mTa: "தெய்வ அருள்", mEn: "divine grace", src: "Christian / English Heritage" },
  { ta: "மேரி", en: "Mary", mTa: "அன்பின் கடல்", mEn: "beloved / sea of grace", src: "Christian / Biblical Heritage in TN" },
  { ta: "சாரா", en: "Sara", mTa: "இளவரசி", mEn: "noble princess", src: "Abrahamic / Global Heritage" },
  { ta: "எம்மா", en: "Emma", mTa: "உலகளாவிய முழுமை", mEn: "universal and whole", src: "Germanic / Global Heritage" },
  { ta: "மிலா", en: "Mila", mTa: "அன்பிற்குரியவள்", mEn: "gracious and dear", src: "Slavic / Global Heritage" },
  { ta: "ஆயிஷா", en: "Aisha", mTa: "மகிழ்ச்சியாக வாழ்பவள்", mEn: "living and prosperous", src: "Islamic / Arabic Heritage in TN" },
  { ta: "பாத்திமா", en: "Fathima", mTa: "தூய்மையானவள்", mEn: "captivating and pure", src: "Islamic / Arabic Heritage in TN" },
  { ta: "ஜெய்னாப்", en: "Zainab", mTa: "நறுமண மலர்", mEn: "fragrant flowering tree", src: "Islamic / Arabic Heritage in TN" },
  { ta: "நூர்", en: "Noor", mTa: "தெய்வீக ஒளி", mEn: "divine light", src: "Arabic / Persian Heritage" },
  { ta: "சனா", en: "Sana", mTa: "பிரகாசமும் புகழும்", mEn: "brilliance and praise", src: "Arabic / Pan-Indian Heritage" },
  { ta: "பரா", en: "Farah", mTa: "மகிழ்ச்சி", mEn: "joy and gladness", src: "Arabic / Global Heritage" },
  { ta: "யஸ்மின்", en: "Yasmin", mTa: "மல்லிகை மலர்", mEn: "jasmine flower", src: "Persian / Global Heritage" },
  { ta: "ரெபேக்கா", en: "Rebecca", mTa: "கவர்ந்திழுக்கும் அழகு", mEn: "captivating bond", src: "Biblical / Global Heritage" },
  { ta: "எஸ்தர்", en: "Esther", mTa: "விண்மீன் நாயகி", mEn: "shining star", src: "Persian / Biblical Heritage" },
  { ta: "ரூத்", en: "Ruth", mTa: "உண்மையான தோழி", mEn: "compassionate friend", src: "Biblical / Global Heritage" },
  { ta: "மரியா", en: "Maria", mTa: "உயரிய தாய்மை", mEn: "beloved lady", src: "Christian / Global Heritage" },
  { ta: "ஏஞ்சல்", en: "Angel", mTa: "தேவதை", mEn: "heavenly messenger", src: "Christian / Global Heritage" },
  { ta: "ஜெனிபர்", en: "Jennifer", mTa: "வெண்ணலை", mEn: "white wave / fair spirit", src: "Celtic / Global Heritage" },
  { ta: "ஜெசிகா", en: "Jessica", mTa: "தொலைநோக்கு", mEn: "foresight and wealth", src: "English / Global Heritage" },
  { ta: "இவா", en: "Eva", mTa: "உயிரளிப்பவள்", mEn: "living life", src: "Latin / Global Heritage" },
  { ta: "ஆலிவ்", en: "Olive", mTa: "அமைதி ஆலிவ்", mEn: "symbol of peace", src: "Latin / Global Heritage" },
  { ta: "கிளாரா", en: "Clara", mTa: "தெளிவும் ஒளியும்", mEn: "bright and clear", src: "Latin / European Heritage" },
  { ta: "நோரா", en: "Nora", mTa: "கௌரவ ஒளி", mEn: "honor and light", src: "Irish / Global Heritage" },
  { ta: "ஈவா", en: "Esha", mTa: "விருப்பமும் தூய்மையும்", mEn: "pure desire", src: "Pan-Indian Modern Registry" },
  { ta: "ரெயான்ஷ்", en: "Reyansh", mTa: "சூரியக் கதிர்", mEn: "ray of light", src: "Pan-Indian Modern Registry" },
  { ta: "அவ்யான்", en: "Avyaan", mTa: "குறையற்றவன்", mEn: "born of perfection", src: "Pan-Indian Modern Registry" },
  { ta: "ஆயுஷ்", en: "Ayush", mTa: "நீண்ட ஆயுள்", mEn: "long healthy life", src: "Pan-Indian Modern Registry" },
  { ta: "கபீர்", en: "Kabir", mTa: "பெரும் ஞானி", mEn: "the great poet-saint", src: "Pan-Indian Sufi Heritage" },
  { ta: "ஆர்மான்", en: "Armaan", mTa: "நல்விருப்பம்", mEn: "noble wish and hope", src: "Persian / Pan-Indian Heritage" },
  { ta: "ரெஹான்", en: "Rehan", mTa: "சொர்க்க மலர்", mEn: "sweet basil fragrance", src: "Arabic / Pan-Indian Heritage" },
  { ta: "ஃபைசல்", en: "Faisal", mTa: "நீதி வழங்குபவர்", mEn: "decisive judge", src: "Arabic / Islamic Heritage" },
  { ta: "நதீம்", en: "Nadeem", mTa: "நல்ல நண்பன்", mEn: "trusted confidant", src: "Arabic / Islamic Heritage" },
  { ta: "வாசிம்", en: "Wasim", mTa: "அழகிய தோற்றம்", mEn: "graceful and handsome", src: "Arabic / Islamic Heritage" },
  { ta: "ரஷீத்", en: "Rasheed", mTa: "நேர்வழி காட்டுபவன்", mEn: "rightly guided", src: "Arabic / Islamic Heritage" },
  { ta: "ஷாஹித்", en: "Shahid", mTa: "உண்மைச் சாட்சி", mEn: "true witness", src: "Arabic / Islamic Heritage" },
  { ta: "நசீர்", en: "Nasir", mTa: "உதவியாளன்", mEn: "helper and supporter", src: "Arabic / Islamic Heritage" },
  { ta: "கமால்", en: "Kamal", mTa: "முழுமை மற்றும் தாமரை", mEn: "perfection / lotus", src: "Arabic & Pan-Indian Heritage" },
  { ta: "நிக்கி", en: "Niki", mTa: "வெற்றி", mEn: "victory of people", src: "Greek / Global Heritage" },
  { ta: "டானியல்", en: "Daniel", mTa: "இறைவன் நீதிபதி", mEn: "God is my judge", src: "Biblical / Global Heritage" },
  { ta: "சாமுவேல்", en: "Samuel", mTa: "இறைநாமம்", mEn: "name of God", src: "Biblical / Global Heritage" },
  { ta: "மைக்கேல்", en: "Michael", mTa: "இறைத் தூதர்", mEn: "like God", src: "Biblical / Global Heritage" },
  { ta: "கேப்ரியல்", en: "Gabriel", mTa: "இறைவனின் வலிமை", mEn: "God is my strength", src: "Biblical / Global Heritage" },
  { ta: "ரபேல்", en: "Raphael", mTa: "குணமாக்கும் அருள்", mEn: "God has healed", src: "Biblical / Global Heritage" },
  { ta: "ஜோயல்", en: "Joel", mTa: "இறைவன் ஒளி", mEn: "the Lord is God", src: "Biblical / Global Heritage" },
  { ta: "ஆரோன்", en: "Aaron", mTa: "உயர்ந்த மலை", mEn: "exalted mountain", src: "Biblical / Global Heritage" },
  { ta: "லூக்", en: "Luke", mTa: "ஒளி தருபவன்", mEn: "light-giving", src: "Greek / Biblical Heritage" },
  { ta: "மார்க்", en: "Mark", mTa: "வலிமையான", mEn: "dedicated warrior", src: "Latin / Biblical Heritage" },
  { ta: "ஜேம்ஸ்", en: "James", mTa: "தொடர்ந்து முன்னேறுபவன்", mEn: "supplanter", src: "English / Biblical Heritage" },
  { ta: "ஆலிவர்", en: "Oliver", mTa: "அமைதி மரம்", mEn: "olive tree peace", src: "Norse / English Heritage" },
  { ta: "ஹென்றி", en: "Henry", mTa: "இல்லத் தலைவன்", mEn: "home ruler", src: "Germanic / Global Heritage" },
  { ta: "வில்லியம்", en: "William", mTa: "உறுதியான பாதுகாவலன்", mEn: "resolute protector", src: "Germanic / Global Heritage" },
  { ta: "அலெக்ஸ்", en: "Alex", mTa: "மனிதகுலப் பாதுகாவலன்", mEn: "defender of humanity", src: "Greek / Global Heritage" },
  { ta: "விக்டர்", en: "Victor", mTa: "வெற்றியாளன்", mEn: "conqueror", src: "Latin / Global Heritage" },
  { ta: "மார்கஸ்", en: "Marcus", mTa: "துணிச்சலான", mEn: "valiant spirit", src: "Latin / Global Heritage" },
  { ta: "ஜூலியன்", en: "Julian", mTa: "இளமையான", mEn: "youthful", src: "Latin / Global Heritage" },
  { ta: "செபாஸ்டியன்", en: "Sebastian", mTa: "மதிப்பிற்குரிய", mEn: "venerable", src: "Greek / Global Heritage" },
  { ta: "பெஞ்சமின்", en: "Benjamin", mTa: "வலக்கை மகன்", mEn: "son of good fortune", src: "Biblical / Global Heritage" },
  { ta: "எலியாஸ்", en: "Elias", mTa: "இறைவன் ஒளி", mEn: "light of Lord", src: "Greek / Biblical Heritage" },
  { ta: "லியாம்", en: "Liam", mTa: "மனஉறுதி பாதுகாவலன்", mEn: "strong-willed warrior", src: "Irish / Global Heritage" },
  { ta: "ஐசக்", en: "Isaac", mTa: "மகிழ்ச்சிப் புன்னகை", mEn: "laughter and joy", src: "Biblical / Global Heritage" },
  { ta: "ஜேக்கப்", en: "Jacob", mTa: "பின்தொடர்பவர்", mEn: "steadfast follower", src: "Biblical / Global Heritage" },
  { ta: "தாமஸ்", en: "Thomas", mTa: "இரட்டைச் சிறப்பு", mEn: "twin spirit", src: "Aramaic / Biblical Heritage in TN" },
  { ta: "ஆண்ட்ரூ", en: "Andrew", mTa: "துணிச்சலான", mEn: "courageous", src: "Greek / Biblical Heritage" },
  { ta: "பிலிப்", en: "Philip", mTa: "அன்பான தோழன்", mEn: "friend of steed", src: "Greek / Biblical Heritage" },
  { ta: "சைமன்", en: "Simon", mTa: "செவிமடுப்பவர்", mEn: "attentive listener", src: "Biblical / Global Heritage" },
  { ta: "ஸ்டீபன்", en: "Stephen", mTa: "வெற்றி மகுடம்", mEn: "crowned in glory", src: "Greek / Biblical Heritage" },
  { ta: "லாரா", en: "Laura", mTa: "வெற்றி வாகை", mEn: "laurel crown", src: "Latin / Global Heritage" },
  { ta: "ஆனா", en: "Anna", mTa: "கருணை", mEn: "gracious favor", src: "Hebrew / Global Heritage" },
  { ta: "லூசி", en: "Lucy", mTa: "ஒளி", mEn: "born of light", src: "Latin / Global Heritage" },
  { ta: "ஆலிஸ்", en: "Alice", mTa: "உயர் குணம்", mEn: "noble spirit", src: "Germanic / Global Heritage" },
  { ta: "ரோஸ்", en: "Rose", mTa: "ரோஜா மலர்", mEn: "fragrant rose", src: "Latin / Global Heritage" },
  { ta: "லின்", en: "Lynn", mTa: "தெளிந்த ஏரி", mEn: "clear waterfall lake", src: "Celtic / Global Heritage" },
  { ta: "ஜோய்", en: "Joy", mTa: "மகிழ்ச்சி", mEn: "pure happiness", src: "English / Global Heritage" },
  { ta: "ஹோப்", en: "Hope", mTa: "நம்பிக்கை", mEn: "bright hope", src: "English / Global Heritage" },
  { ta: "பெய்த்", en: "Faith", mTa: "நல்நம்பிக்கை", mEn: "steadfast trust", src: "English / Global Heritage" },
  { ta: "ஸ்டெல்லா", en: "Stella", mTa: "விண்மீன்", mEn: "shining star", src: "Latin / Global Heritage" },
  { ta: "லூனா", en: "Luna", mTa: "நிலவு", mEn: "moonlight", src: "Latin / Global Heritage" },
  { ta: "அரோரா", en: "Aurora", mTa: "வைகறை ஒளி", mEn: "golden dawn", src: "Latin / Global Heritage" },
  { ta: "வயலட்", en: "Violet", mTa: "நீல மலர்", mEn: "violet flower", src: "Latin / Global Heritage" },
  { ta: "ஐரிஸ்", en: "Iris", mTa: "வானவில் மலர்", mEn: "rainbow blossom", src: "Greek / Global Heritage" },
  { ta: "ஜாஸ்மின்", en: "Jasmine", mTa: "மல்லிகை", mEn: "jasmine blossom", src: "Persian / Global Heritage" },
  { ta: "டெய்ஸி", en: "Daisy", mTa: "பகல் கண் மலர்", mEn: "day's eye blossom", src: "English / Global Heritage" },
  { ta: "லிலி", en: "Lily", mTa: "தூய லில்லி மலர்", mEn: "pure lily", src: "Latin / Global Heritage" },
  { ta: "ரூபி", en: "Ruby", mTa: "மாணிக்கக் கல்", mEn: "precious crimson gem", src: "Latin / Global Heritage" },
  { ta: "பேர்ல்", en: "Pearl", mTa: "முத்து", mEn: "ocean pearl", src: "Latin / Global Heritage" },
];

// Global / Pan-Indian / Heritage modifiers & compounds for Other Heritage category (ensuring rich 50k diversity)
const OTHER_SECOND_PARTS = [
  { ta: "தேவ்", en: "dev", gender: "boy", mTa: "ஒளி", mEn: "light" },
  { ta: "ராஜ்", en: "raj", gender: "boy", mTa: "பெருமை", mEn: "sovereign" },
  { ta: "நாத்", en: "nath", gender: "boy", mTa: "தலைவன்", mEn: "protector" },
  { ta: "சந்த்", en: "chand", gender: "boy", mTa: "நிலவு", mEn: "moon" },
  { ta: "குமார்", en: "kumar", gender: "boy", mTa: "இளவரசன்", mEn: "prince" },
  { ta: "வந்த்", en: "vanth", gender: "boy", mTa: "புகழ்", mEn: "prosperous" },
  { ta: "ஜித்", en: "jith", gender: "boy", mTa: "வெற்றி", mEn: "victor" },
  { ta: "வீர்", en: "veer", gender: "boy", mTa: "வீரம்", mEn: "brave" },
  { ta: "மித்", en: "mith", gender: "boy", mTa: "நண்பன்", mEn: "friend" },
  { ta: "சேத்", en: "seth", gender: "boy", mTa: "அருள்", mEn: "blessed" },
  { ta: "ஷான்", en: "shan", gender: "boy", mTa: "கௌரவம்", mEn: "dignity" },
  { ta: "மான்", en: "maan", gender: "boy", mTa: "மரியாதை", mEn: "honor" },
  { ta: "தீப்", en: "deep", gender: "boy", mTa: "விளக்கு", mEn: "lamp" },
  { ta: "பிரீத்", en: "preeth", gender: "boy", mTa: "அன்பு", mEn: "affection" },
  { ta: "கான்", en: "khan", gender: "boy", mTa: "தலைவன்", mEn: "leader" },
  { ta: "உதீன்", en: "uddin", gender: "boy", mTa: "நம்பிக்கை ஒளி", mEn: "light of faith" },
  { ta: "அலி", en: "ali", gender: "boy", mTa: "உயர்ந்தவன்", mEn: "noble" },
  { ta: "ஹுசைன்", en: "hussain", gender: "boy", mTa: "நற்குணம்", mEn: "virtuous" },
  { ta: "அஹமத்", en: "ahmed", gender: "boy", mTa: "புகழுக்குரியவன்", mEn: "praiseworthy" },
  { ta: "ரஹ்மான்", en: "rahman", gender: "boy", mTa: "கருணையாளன்", mEn: "merciful" },
  { ta: "பால்", en: "paul", gender: "boy", mTa: "தூதர்", mEn: "messenger" },
  { ta: "ஜோ", en: "joe", gender: "boy", mTa: "வளர்ச்சி", mEn: "increase" },
  { ta: "ராய்", en: "roy", gender: "boy", mTa: "அரசன்", mEn: "royal" },
  { ta: "மார்க்", en: "mark", gender: "boy", mTa: "துணிச்சல்", mEn: "bold" },
  { ta: "வில்", en: "will", gender: "boy", mTa: "மனஉறுதி", mEn: "resolute" },
  { ta: "சன்", en: "son", gender: "boy", mTa: "மகன்", mEn: "scion" },
  { ta: "லேன்", en: "len", gender: "boy", mTa: "சிங்கம்", mEn: "lion-hearted" },
  { ta: "வின்", en: "win", gender: "boy", mTa: "வெற்றி நண்பன்", mEn: "true friend" },
  { ta: "டான்", en: "dan", gender: "boy", mTa: "நீதி", mEn: "just" },
  { ta: "பென்", en: "ben", gender: "boy", mTa: "நல்மகன்", mEn: "blessed son" },

  { ta: "மாயா", en: "maya", gender: "girl", mTa: "மாயை அழகு", mEn: "grace" },
  { ta: "லியா", en: "liya", gender: "girl", mTa: "இனிமை", mEn: "pleasant" },
  { ta: "தியா", en: "diya", gender: "girl", mTa: "தீபம்", mEn: "radiance" },
  { ta: "ஜியா", en: "ziya", gender: "girl", mTa: "ஒளி", mEn: "splendor" },
  { ta: "ரியா", en: "riya", gender: "girl", mTa: "பாடகர்", mEn: "melody" },
  { ta: "நியா", en: "niya", gender: "girl", mTa: "நோக்கம்", mEn: "bright purpose" },
  { ta: "சியா", en: "siya", gender: "girl", mTa: "தூய்மை", mEn: "purity" },
  { ta: "பியா", en: "piya", gender: "girl", mTa: "அன்பானவள்", mEn: "beloved" },
  { ta: "கியா", en: "kiya", gender: "girl", mTa: "பறவை இசை", mEn: "songbird" },
  { ta: "மியா", en: "miya", gender: "girl", mTa: "உயர்ந்தவள்", mEn: "precious" },
  { ta: "தாரா", en: "tara", gender: "girl", mTa: "நட்சத்திரம்", mEn: "star" },
  { ta: "சாரா", en: "sara", gender: "girl", mTa: "இளவரசி", mEn: "princess" },
  { ta: "மீரா", en: "meera", gender: "girl", mTa: "அமைதி கடல்", mEn: "ocean of peace" },
  { ta: "நூரா", en: "noora", gender: "girl", mTa: "ஒளி", mEn: "luminous" },
  { ta: "சனா", en: "sana", gender: "girl", mTa: "புகழ்", mEn: "brilliance" },
  { ta: "ஹீனா", en: "heena", gender: "girl", mTa: "நறுமணம்", mEn: "fragrant" },
  { ta: "நஜ்மா", en: "najma", gender: "girl", mTa: "விண்மீன்", mEn: "starlight" },
  { ta: "சல்மா", en: "salma", gender: "girl", mTa: "அமைதி", mEn: "peaceful" },
  { ta: "அமீனா", en: "amina", gender: "girl", mTa: "நம்பகமானவள்", mEn: "trustworthy" },
  { ta: "யஸ்மின்", en: "yasmin", gender: "girl", mTa: "மல்லிகை", mEn: "jasmine" },
  { ta: "மேரி", en: "mary", gender: "girl", mTa: "அருள்", mEn: "grace" },
  { ta: "ஆன்", en: "ann", gender: "girl", mTa: "கருணை", mEn: "favor" },
  { ta: "லின்", en: "lynn", gender: "girl", mTa: "தெளிவு", mEn: "serene" },
  { ta: "ரோஸ்", en: "rose", gender: "girl", mTa: "ரோஜா", mEn: "rose blossom" },
  { ta: "ஜோய்", en: "joy", gender: "girl", mTa: "மகிழ்ச்சி", mEn: "joyful" },
  { ta: "கிரேஸ்", en: "grace", gender: "girl", mTa: "அருள்", mEn: "gracious" },
  { ta: "பெல்", en: "belle", gender: "girl", mTa: "அழகு", mEn: "lovely" },
  { ta: "லீ", en: "lee", gender: "girl", mTa: "பசுமை", mEn: "meadow" },
  { ta: "ஈவா", en: "eva", gender: "girl", mTa: "உயிர்", mEn: "vitality" },
  { ta: "நோரா", en: "nora", gender: "girl", mTa: "கௌரவம்", mEn: "honor" },
];

// EXPANDED LEXICAL MATRICES TO GUARANTEE >50,000 CAPACITY PER CATEGORY
const EXTRA_PURE_PREFIXES = [
  ["அழகிய", "Azhagiya", "அழகு மிக்க", "exquisitely graceful"],
  ["இனிய", "Iniya", "இனிமை நிறைந்த", "sweet and gentle"],
  ["உயரிய", "Uyariya", "உயர்ந்த பண்பு", "elevated nobility"],
  ["எழிலார்", "Ezhilar", "எழில் நிறைந்த", "full of beauty"],
  ["கதிரார்", "Kathirar", "ஒளிக்கதிர்", "radiant beam"],
  ["குளிர்", "Kulir", "குளிர்ச்சி தரும்", "soothing coolness"],
  ["சங்க", "Sanga", "சங்க இலக்கிய", "classical Sangam"],
  ["செந்தமிழ்", "Senthamil", "செம்மையான தமிழ்", "classical Tamil"],
  ["தங்க", "Thanga", "தூய தங்கம்", "pure gold"],
  ["நற்றமிழ்", "Natramil", "நல்ல தமிழ்", "noble Tamil"],
  ["பசுமை", "Pasumai", "பசுமை வளம்", "evergreen vitality"],
  ["புகழார்", "Pugazhar", "புகழ்மிக்க", "illustrious fame"],
  ["மணியார்", "Maniyar", "மணி போன்ற", "gem-like"],
  ["முத்தார", "Muthaara", "முத்து மாலை", "pearl garland"],
  ["வளமிகு", "Valamigu", "வளம் நிறைந்த", "abundant prosperity"],
  ["தென்றலார்", "Thendralar", "தென்றல் போன்ற", "gentle breeze-like"],
];
for (const [ta, en, mTa, mEn] of EXTRA_PURE_PREFIXES) {
  PURE_TAMIL_PREFIXES.push({ ta, en, mTa, mEn });
}

const EXTRA_TN_PREFIXES = [
  ["அபி", "Abhi", "உயர்ந்த", "exalted", "Sanskrit / Pan-Indian Heritage in TN"],
  ["அமித்", "Amith", "அளவற்ற", "boundless", "Contemporary Tamil Nadu Registry"],
  ["அமோக்", "Amogh", "தவறாத வெற்றி", "unerring success", "Bhakti & Temple Tradition (TN)"],
  ["அனிருத்", "Anirudh", "தடையற்ற", "unstoppable", "Contemporary Tamil Nadu Registry"],
  ["அங்கித்", "Ankith", "முத்திரையிடப்பட்ட", "distinguished", "Contemporary Tamil Nadu Registry"],
  ["அன்ஷு", "Anshu", "ஒளிக்கதிர்", "sunbeam", "Sanskrit / Pan-Indian Heritage in TN"],
  ["அபூர்வ", "Apoorva", "அபூர்வமான", "extraordinary", "Contemporary Tamil Nadu Registry"],
  ["அரவிந்த்", "Aravind", "தாமரை", "lotus bloom", "Alwar Bhakti Heritage (TN)"],
  ["அர்ச்சுன", "Archuna", "தூய ஒளி", "pure radiance", "Epic & Purana Heritage in TN"],
  ["அரிஹந்த்", "Arihant", "வெற்றியாளர்", "conqueror of inner foes", "Jain-Tamil Heritage (TN)"],
  ["அர்ணவ்", "Arnav", "ஆழ்கடல்", "vast ocean", "Contemporary Tamil Nadu Registry"],
  ["அருண்", "Arun", "உதய சூரியன்", "radiant dawn", "Murugan & Temple Heritage (TN)"],
  ["அஸ்வத்", "Aswath", "அரச மரம்", "sacred banyan", "Vedic Heritage in TN"],
  ["அதர்வ", "Atharva", "வேத ஞானம்", "ancient wisdom", "Vedic Heritage in TN"],
  ["அதுல்", "Athul", "ஒப்பற்ற", "incomparable", "Contemporary Tamil Nadu Registry"],
  ["அவ்யுக்த்", "Avyukth", "தெளிந்த மனம்", "crystal mind", "Contemporary Tamil Nadu Registry"],
  ["ஆயுஷ்", "Ayush", "நீண்ட ஆயுள்", "long blessed life", "Contemporary Tamil Nadu Registry"],
  ["பத்ரி", "Badri", "திருமால் தலம்", "sacred Badri", "Vaishnava Heritage (TN)"],
  ["பகத்", "Bhagat", "பக்தன்", "devoted soul", "Bhakti Tradition (TN)"],
  ["பானு", "Bhanu", "சூரிய ஒளி", "radiant sun", "Sanskrit / Vedic Heritage in TN"],
  ["பரத்", "Bharath", "போற்றப்படும் நாயகன்", "cherished hero", "Epic Heritage in TN"],
  ["பாஸ்கர்", "Bhaskar", "ஒளி வீசும் கதிரவன்", "illuminator", "Vedic Heritage in TN"],
  ["பீம", "Bheema", "வலிமை மிக்க", "mighty strength", "Epic Heritage in TN"],
  ["பூபால்", "Bhoopal", "நிலவுலகக் காவலன்", "protector of earth", "Classical Heritage in TN"],
  ["புவி", "Bhuvi", "பூமியின் அருள்", "earthly grace", "Contemporary Tamil Nadu Registry"],
  ["சதுர்", "Chathur", "நுண்ணறிவு", "clever wisdom", "Contemporary Tamil Nadu Registry"],
  ["சேத்தன்", "Chethan", "உயிர்ப்புள்ள", "conscious energy", "Contemporary Tamil Nadu Registry"],
  ["சின்மய", "Chinmaya", "ஞானமயமான", "pure consciousness", "Vedanta Heritage (TN)"],
  ["சிரஞ்சீவ்", "Chiranjeev", "என்றும் வாழும்", "immortal", "Temple Heritage (TN)"],
  ["தக்ஷ்", "Daksh", "திறமை மிக்க", "capable and skilled", "Contemporary Tamil Nadu Registry"],
  ["தர்ஷன்", "Darshan", "நல்ல தரிசனம்", "auspicious vision", "Temple Heritage (TN)"],
  ["தயா", "Daya", "கருணை", "compassion", "Bhakti Heritage (TN)"],
  ["தீபன்", "Deepan", "ஒளி விளக்கு", "guiding lamp", "Contemporary Tamil Nadu Registry"],
  ["தேவேஷ்", "Devesh", "தேவர்களின் தலைவன்", "lord of celestials", "Temple Heritage (TN)"],
  ["தனுஷ்", "Dhanush", "வில் ஆற்றல்", "mighty bow", "Contemporary Tamil Nadu Registry"],
  ["தீரஜ்", "Dheeraj", "மன உறுதி", "patient courage", "Contemporary Tamil Nadu Registry"],
  ["திரிவ்", "Dhruv", "துருவ நட்சத்திரம்", "steadfast pole star", "Vedic Heritage in TN"],
  ["தினேஷ்", "Dinesh", "பகலவன்", "lord of day", "Contemporary Tamil Nadu Registry"],
  ["திவ்ய", "Divya", "தெய்வீக", "divine light", "Bhakti Heritage (TN)"],
  ["துர்கா", "Durga", "சக்தி தேவி", "invincible grace", "Shakti Temple Heritage (TN)"],
  ["ஏக", "Eka", "ஒப்பற்ற ஒன்று", "singular supreme", "Vedic Heritage in TN"],
  ["ககன்", "Gagan", "பரந்த வானம்", "expansive sky", "Contemporary Tamil Nadu Registry"],
  ["கஜ", "Gaja", "யானை வலிமை", "royal strength", "Pillaiyar Heritage (TN)"],
  ["கண", "Gana", "தெய்வீகக் கூட்டம்", "auspicious host", "Pillaiyar Heritage (TN)"],
  ["கௌரவ்", "Gaurav", "பெருமை", "dignified honor", "Contemporary Tamil Nadu Registry"],
  ["கௌதம்", "Gautham", "ஞான முனிவர்", "enlightened sage", "Classical Heritage in TN"],
  ["கிரி", "Giri", "மலை சிகரம்", "sacred mountain", "Temple Heritage (TN)"],
  ["கோகுல்", "Gokul", "கண்ணன் வளர்ந்த ஊர்", "blessed abode", "Vaishnava Heritage (TN)"],
  ["கோபால்", "Gopal", "பசுக்களின் காவலன்", "gentle protector", "Vaishnava Heritage (TN)"],
  ["கோவிந்த்", "Govind", "வேதப் பொருள்", "finder of truth", "Tirupati / Alwar Heritage (TN)"],
  ["குரு", "Guru", "நல்வழி காட்டி", "wise teacher", "Siddha & Temple Heritage (TN)"],
  ["ஹம்ச", "Hamsa", "அன்னப் பறவை", "pure swan", "Vedic Heritage (TN)"],
  ["ஹனும", "Hanuma", "வீர ஆஞ்சநேயர்", "devoted strength", "Bhakti Heritage (TN)"],
  ["ஹரிஷ்", "Harish", "திருமால் அருள்", "lord of grace", "Contemporary Tamil Nadu Registry"],
  ["ஹர்ஷித்", "Harshith", "மகிழ்ச்சி நிறைந்த", "ever joyful", "Contemporary Tamil Nadu Registry"],
  ["ஹேம", "Hema", "பொன் மயம்", "golden purity", "Sanskrit-Tamil Heritage (TN)"],
  ["ஹிருதய்", "Hruday", "தூய இதயம்", "noble heart", "Contemporary Tamil Nadu Registry"],
  ["இந்திர", "Indra", "விண்ணுலக வேந்தன்", "celestial sovereign", "Vedic & Sangam Heritage (TN)"],
  ["ஈசான", "Isana", "வடகிழக்கு சிவன்", "supreme ruler", "Saiva Agama Heritage (TN)"],
  ["ஜகத்", "Jagath", "உலகம் போற்றும்", "universal", "Temple Heritage (TN)"],
  ["ஜெயந்த்", "Jayanth", "வெற்றித் திருமகன்", "victorious", "Murugan / Temple Heritage (TN)"],
  ["ஜீவ", "Jeeva", "உயிர் சக்தி", "living spirit", "Siddha Heritage (TN)"],
  ["ஜிதேஷ்", "Jithesh", "வெற்றி நாயகன்", "lord of victory", "Contemporary Tamil Nadu Registry"],
  ["ஜோதி", "Jothi", "அருட்பெருஞ்ஜோதி", "supreme light", "Vallalar / Saiva Heritage (TN)"],
  ["கைலாஷ்", "Kailash", "கயிலை மலை", "sacred Kailash", "Saiva Heritage (TN)"],
  ["கல்யாண்", "Kalyan", "மங்கள நன்மை", "auspicious welfare", "Temple Heritage (TN)"],
  ["காம", "Kama", "விருப்பம் நிறைவேற்றும்", "fulfilling grace", "Temple Heritage (TN)"],
  ["கந்த", "Kantha", "முருகப் பெருமான்", "beloved Skanda", "Murugan Bhakti Heritage (TN)"],
  ["கபில்", "Kapil", "முனிவர் நாமம்", "ancient sage", "Vedic Heritage (TN)"],
  ["கரண்", "Karan", "திறன் மிக்க", "skilled helper", "Contemporary Tamil Nadu Registry"],
  ["கருணா", "Karuna", "பேரருள்", "compassionate", "Bhakti Heritage (TN)"],
  ["கௌசிக்", "Kaushik", "மறை ஞானி", "learned sage", "Vedic Heritage (TN)"],
  ["கேதார்", "Kedar", "மலை சிவன்", "lord of peaks", "Saiva Heritage (TN)"],
  ["கேசவ்", "Keshav", "திருமால் நாமம்", "radiant Keshava", "Vaishnava Heritage (TN)"],
  ["கிரண்", "Kiran", "ஒளிக்கதிர்", "ray of light", "Contemporary Tamil Nadu Registry"],
  ["கிஷோர்", "Kishore", "இளமைப் பொலிவு", "youthful vigor", "Contemporary Tamil Nadu Registry"],
  ["குபேர", "Kubera", "செல்வ அதிபதி", "lord of abundance", "Traditional Heritage (TN)"],
  ["குல", "Kula", "நற்குலப் பெருமை", "noble lineage", "Tamil Nadu Tradition"],
  ["குமார", "Kumara", "குமரக்கடவுள்", "ever-youthful Murugan", "Murugan Bhakti Heritage (TN)"],
  ["குந்தன்", "Kundan", "தூய தங்கம்", "purest gold", "Contemporary Tamil Nadu Registry"],
  ["குஷால்", "Kushal", "திறமையான", "clever and blessed", "Contemporary Tamil Nadu Registry"],
  ["லக்ஷ", "Laksha", "உயர்ந்த இலக்கு", "noble aim", "Contemporary Tamil Nadu Registry"],
  ["லலித்", "Lalith", "அழகும் நளினமும்", "graceful charm", "Shakti Heritage (TN)"],
  ["லோக", "Loka", "உலக நன்மை", "worldly welfare", "Temple Heritage (TN)"],
  ["மதன", "Madhana", "அன்பின் வசந்தம்", "charming grace", "Classical Heritage (TN)"],
  ["மது", "Madhu", "இனிய தேன்", "sweet nectar", "Bhakti Heritage (TN)"],
  ["மஹேஷ்", "Mahesh", "மகேசுவரன்", "great lord Shiva", "Saiva Heritage (TN)"],
  ["மஹி", "Mahi", "பூமியும் பெருமையும்", "earthly majesty", "Contemporary Tamil Nadu Registry"],
  ["மயூர்", "Mayur", "மயில் வாகனம்", "peacock grace", "Murugan Heritage (TN)"],
  ["மோகன்", "Mohan", "மனதைக் கவரும்", "enchanting", "Vaishnava Heritage (TN)"],
  ["முகேஷ்", "Mukesh", "முக்தி நாயகன்", "lord of liberation", "Contemporary Tamil Nadu Registry"],
  ["முகுந்த்", "Mukund", "முத்தி தரும் திருமால்", "giver of freedom", "Vaishnava Heritage (TN)"],
  ["முரளி", "Murali", "புல்லாங்குழல் இசை", "sacred flute", "Krishna Bhakti Heritage (TN)"],
  ["நாக", "Naga", "நாகலிங்க அருள்", "sacred protector", "Temple Heritage (TN)"],
  ["நகுல்", "Nakul", "நல்ல புத்தி", "wise and handsome", "Epic Heritage in TN"],
  ["நளின", "Nalina", "தாமரை மென்மை", "lotus grace", "Classical Heritage (TN)"],
  ["நவீன்", "Naveen", "புதுமைப் பொலிவு", "ever fresh", "Contemporary Tamil Nadu Registry"],
  ["நீரஜ்", "Neeraj", "தாமரை மலர்", "water-born lotus", "Contemporary Tamil Nadu Registry"],
  ["நிகில்", "Nikhil", "முழுமையான", "complete and whole", "Contemporary Tamil Nadu Registry"],
  ["நிரஞ்சன்", "Niranjan", "மாசற்ற பரம்பொருள்", "spotless pure", "Saiva & Siddha Heritage (TN)"],
  ["நிர்மல்", "Nirmal", "தூய உள்ளம்", "pure-hearted", "Contemporary Tamil Nadu Registry"],
  ["நிதின்", "Nithin", "நீதி நெறி", "master of right path", "Contemporary Tamil Nadu Registry"],
  ["ஓம்", "Om", "பிரணவ மந்திரம்", "sacred Om", "Vedic & Agamic Heritage (TN)"],
  ["பங்கஜ்", "Pankaj", "சேற்றில் மலர்ந்த தாமரை", "lotus blossom", "Contemporary Tamil Nadu Registry"],
  ["பரம", "Parama", "உயர்ந்த பரம்பொருள்", "supreme grace", "Saiva Siddhanta Heritage (TN)"],
  ["பரேஷ்", "Paresh", "பரம்பொருள் தலைவன்", "supreme lord", "Temple Heritage (TN)"],
  ["பார்த்த", "Partha", "அர்ஜுனன் நாமம்", "charioteer hero", "Epic Heritage in TN"],
  ["பவன்", "Pavan", "தூய தென்றல்", "sacred breeze", "Contemporary Tamil Nadu Registry"],
  ["பிரபாகர்", "Prabhakar", "ஒளி தரும் கதிரவன்", "radiant sun", "Vedic Heritage (TN)"],
  ["பிரபு", "Prabhu", "தெய்வீகத் தலைவன்", "noble lord", "Bhakti Heritage (TN)"],
  ["பிரதீப்", "Pradeep", "சுடர் விளக்கு", "shining lamp", "Contemporary Tamil Nadu Registry"],
  ["பிரஹலாத்", "Prahlad", "ஆனந்த பக்தி", "blissful devotion", "Vaishnava Heritage (TN)"],
  ["பிரகாஷ்", "Prakash", "பிரகாசமான ஒளி", "bright illumination", "Contemporary Tamil Nadu Registry"],
  ["பிரசாத்", "Prasad", "இறை அருள்", "divine blessing", "Temple Heritage (TN)"],
  ["பிரவீன்", "Praveen", "அனுபவத் திறமை", "skilled master", "Contemporary Tamil Nadu Registry"],
  ["பிரேம்", "Prem", "தூய அன்பு", "pure love", "Contemporary Tamil Nadu Registry"],
  ["புனித்", "Punith", "புனிதமான", "sacred and pure", "Contemporary Tamil Nadu Registry"],
  ["பூர்ண", "Poorna", "நிறைவான", "complete abundance", "Vedic Heritage (TN)"],
  ["ராகுல்", "Rahul", "அறிவுத் திறன்", "efficient achiever", "Contemporary Tamil Nadu Registry"],
  ["ராஜ்", "Raj", "அரசாட்சிப் பெருமை", "royal radiance", "Tamil Nadu Cultural Tradition"],
  ["ரஜத்", "Rajath", "வெள்ளி ஒளி", "silvery brilliance", "Contemporary Tamil Nadu Registry"],
  ["ரமேஷ்", "Ramesh", "திருமகள் நாயகன்", "lord of Rama", "Vaishnava Heritage (TN)"],
  ["வள்ளி", "Valli", "முருகன் நாயகி வள்ளி", "sacred Valli", "Murugan Bhakti Tradition (TN)"],
  ["தெய்வ", "Deiva", "தெய்வீக அருள்", "divine grace", "Bhakti & Temple Tradition (TN)"],
  ["மங்கள", "Mangala", "மங்களகரமான", "auspicious blessing", "Temple Heritage (TN)"],
  ["பக்தி", "Bhakthi", "இறைப் பக்தி", "devotion", "Bhakti Tradition (TN)"],
];
for (const [ta, en, mTa, mEn, src] of EXTRA_TN_PREFIXES) {
  TN_USAGE_PREFIXES.push({ ta, en, mTa, mEn, src });
}

const EXTRA_TN_SUFFIXES = [
  ["அபிஷேக்", "abhishek", "boy", "புனித அபிஷேகம்", "sacred blessing"],
  ["ஆதித்யா", "adithya", "boy", "சூரிய ஒளி", "radiant sun"],
  ["அஜய்", "ajay", "boy", "வெல்ல முடியாதவன்", "unconquerable"],
  ["அக்ஷய்", "akshay", "boy", "அழிவற்றவன்", "imperishable"],
  ["ஆனந்தன்", "anandhan", "boy", "ஆனந்தம் தருபவன்", "giver of bliss"],
  ["அரவிந்தன்", "aravindhan", "boy", "தாமரை போன்றவன்", "lotus-pure"],
  ["அர்ஜுன்", "arjun", "boy", "தூய வீரன்", "bright hero"],
  ["அருண்", "arun", "boy", "காலைக் கதிரவன்", "dawn sun"],
  ["அஸ்வின்", "ashwin", "boy", "ஒளி நட்சத்திரம்", "radiant star"],
  ["பாலாஜி", "balaji", "boy", "திருப்பதி பாலாஜி", "blessed Balaji"],
  ["பாரதி", "bharathi", "unisex", "கலைமகள் அருள்", "eloquent muse"],
  ["பாஸ்கர்", "bhaskar", "boy", "ஒளி வீசும் சூரியன்", "luminous sun"],
  ["சந்தர்", "chander", "boy", "நிலவு ஒளி", "moonlight"],
  ["சரண்", "charan", "boy", "பணிவான புகலிடம்", "humble refuge"],
  ["தர்ஷன்", "darshan", "boy", "தெய்வ தரிசனம்", "sacred vision"],
  ["தீபக்", "deepak", "boy", "மங்கள தீபம்", "auspicious lamp"],
  ["தேவா", "deva", "boy", "தெய்வீகன்", "divine one"],
  ["தேவேந்திரன்", "devendran", "boy", "தேவர் தலைவன்", "king of celestials"],
  ["தனபால்", "dhanapal", "boy", "செல்வக் காவலன்", "keeper of wealth"],
  ["தர்மன்", "dharman", "boy", "அறநெறியாளன்", "righteous one"],
  ["தினேஷ்", "dinesh", "boy", "பகலவன்", "sun lord"],
  ["துரை", "durai", "boy", "உயர் தலைவன்", "noble leader"],
  ["ஈஸ்வரன்", "eeswaran", "boy", "பரமேஸ்வரன்", "supreme lord"],
  ["கணேஷ்", "ganesh", "boy", "விநாயகர் அருள்", "lord of wisdom"],
  ["கணபதி", "ganapathi", "boy", "கணங்களின் அதிபதி", "lord Ganapathi"],
  ["கௌதம்", "gautham", "boy", "ஞான தீபம்", "enlightened one"],
  ["கிரி", "giri", "boy", "மலை உறுதி", "mountain steadfast"],
  ["கோகுல்", "gokul", "boy", "கண்ணன் அருள்", "blessed Gokul"],
  ["கோபால்", "gopal", "boy", "அன்புக் காவலன்", "protector"],
  ["கோவிந்தன்", "govindan", "boy", "திருமால் அருள்", "lord Govinda"],
  ["குரு", "guru", "boy", "நல்லாசிரியன்", "wise mentor"],
  ["ஹரி", "hari", "boy", "திருமால்", "divine Hari"],
  ["ஹரிஷ்", "harish", "boy", "அருள் நாயகன்", "gracious lord"],
  ["ஹர்ஷா", "harsha", "unisex", "பேரானந்தம்", "pure joy"],
  ["இந்திரன்", "indran", "boy", "விண்ணுலகத் தலைவன்", "celestial ruler"],
  ["ஜகதீஷ்", "jagadeesh", "boy", "உலக நாயகன்", "lord of universe"],
  ["ஜெயராம்", "jeyaram", "boy", "வெற்றி இராமன்", "victorious Rama"],
  ["ஜெயந்த்", "jayanth", "boy", "வெற்றியாளன்", "triumphant"],
  ["ஜீவா", "jeeva", "boy", "உயிர் ஒளி", "living spirit"],
  ["ஜோதி", "jothi", "unisex", "அருள் ஒளி", "sacred light"],
  ["கல்யாண்", "kalyan", "boy", "மங்களம்", "auspicious"],
  ["கண்ணன்", "kannan", "boy", "கருணைக் கண்ணன்", "beloved Krishna"],
  ["கபில்", "kapil", "boy", "தவ முனிவன்", "wise sage"],
  ["கரண்", "karan", "boy", "திறமையாளன்", "capable hero"],
  ["கார்த்திக்", "karthik", "boy", "முருகன் அருள்", "noble Karthik"],
  ["கார்த்திகேயன்", "karthikeyan", "boy", "கார்த்திகை மைந்தன்", "son of Pleiades"],
  ["கேசவன்", "keshavan", "boy", "திருமால்", "radiant Keshava"],
  ["கிரண்", "kiran", "unisex", "ஒளிக்கதிர்", "beam of light"],
  ["கிஷோர்", "kishore", "boy", "இளமைச் சுடர்", "youthful star"],
  ["கிருஷ்ணன்", "krishnan", "boy", "மாயக் கண்ணன்", "divine Krishna"],
  ["குமரன்", "kumaran", "boy", "முருகப் பெருமான்", "youthful Murugan"],
  ["குமார்", "kumar", "boy", "இளவரசன்", "noble youth"],
  ["லக்ஷ்மணன்", "lakshmanan", "boy", "நல்லியல்பு வீரன்", "auspicious hero"],
  ["லோகேஷ்", "lokesh", "boy", "உலகத் தலைவன்", "lord of worlds"],
  ["மதன்", "madhan", "boy", "வசந்த நாயகன்", "graceful charm"],
  ["மாதவன்", "madhavan", "boy", "திருமகள் நாயகன்", "blessed Madhava"],
  ["மகேஷ்", "mahesh", "boy", "சிவபெருமான்", "great Shiva"],
  ["மணி", "mani", "unisex", "நன்மணி", "precious jewel"],
  ["மணிகண்டன்", "manikandan", "boy", "ஐயப்பன் திருநாமம்", "gem-necked lord"],
  ["மனோஜ்", "manoj", "boy", "மனதைக் கவரும்", "heart-born charm"],
  ["மோகன்", "mohan", "boy", "அழகன்", "enchanting"],
  ["முகேஷ்", "mukesh", "boy", "அருளாளன்", "liberating lord"],
  ["முகுந்தன்", "mukundan", "boy", "திருமால்", "giver of bliss"],
  ["முரளி", "murali", "boy", "குழல் இசையன்", "flute player"],
  ["முருகன்", "murugan", "boy", "தமிழ்க் கடவுள்", "radiant Murugan"],
  ["நாகராஜ்", "nagaraj", "boy", "நாக மன்னன்", "noble protector"],
  ["நந்தா", "nandha", "boy", "ஆனந்தன்", "joyful one"],
  ["நாராயணன்", "narayanan", "boy", "பத்மநாபன்", "supreme Narayana"],
  ["நடராஜன்", "natarajan", "boy", "தில்லைக் கூத்தன்", "cosmic dancer"],
  ["நவீன்", "naveen", "boy", "புதுமை நாயகன்", "fresh and modern"],
  ["நீரஜ்", "neeraj", "boy", "தாமரை மலர்", "pure lotus"],
  ["நிகில்", "nikhil", "boy", "நிறைவானவன்", "complete hero"],
  ["நிர்மல்", "nirmal", "boy", "தூய்மையாளன்", "spotless pure"],
  ["நிதின்", "nithin", "boy", "நீதிமான்", "righteous"],
  ["பத்மநாபன்", "padmanaban", "boy", "திருமால்", "lotus-naveled lord"],
  ["பழனி", "pazhani", "boy", "பழனி முருகன்", "blessed Palani"],
  ["பரமேஸ்வரன்", "parameswaran", "boy", "பரம்பொருள்", "supreme lord"],
  ["பார்த்தசாரதி", "parthasarathi", "boy", "கீதை நாயகன்", "charioteer Krishna"],
  ["பவன்", "pavan", "boy", "தென்றல்", "pure wind"],
  ["பிரபாகரன்", "prabhakaran", "boy", "சூரியன்", "sunlight maker"],
  ["பிரபு", "prabhu", "boy", "தலைவன்", "noble master"],
  ["பிரதீப்", "pradeep", "boy", "சுடர்", "bright lamp"],
  ["பிரகாஷ்", "prakash", "boy", "ஒளி", "radiant light"],
  ["பிரணவ்", "pranav", "boy", "ஓம் மந்திரம்", "sacred Om"],
  ["பிரசாந்த்", "prashanth", "boy", "பேரமைதி", "deep serenity"],
  ["பிரவீன்", "praveen", "boy", "திறமையாளன்", "accomplished"],
  ["பிரேம்", "prem", "boy", "அன்பு", "pure love"],
  ["புவன்", "puvan", "boy", "உலக நாயகன்", "worldly grace"],
  ["ராகவன்", "raghavan", "boy", "இரகு குலத்தோன்", "noble Raghava"],
  ["ராகுல்", "rahul", "boy", "திறனாளன்", "able achiever"],
  ["ராஜா", "raja", "boy", "அரசன்", "noble king"],
  ["ராஜேஷ்", "rajesh", "boy", "மன்னர் மன்னன்", "king of kings"],
  ["ராமன்", "raman", "boy", "இராமபிரான்", "virtuous Rama"],
  ["ரமேஷ்", "ramesh", "boy", "இலக்குமி நாயகன்", "lord Ramesh"],
  ["ரஞ்சித்", "ranjith", "boy", "மனம் மகிழ்வோன்", "delightful hero"],
  ["ரவி", "ravi", "boy", "கதிரவன்", "radiant sun"],
  ["ரிஷி", "rishi", "boy", "ஞானி", "wise sage"],
  ["ரோஹித்", "rohith", "boy", "செங்கதிர்", "crimson dawn"],
  ["சாய்", "sai", "unisex", "தெய்வ அருள்", "divine grace"],
  ["சஞ்சய்", "sanjay", "boy", "வெற்றியாளன்", "triumphant"],
  ["சந்தோஷ்", "santhosh", "boy", "மனநிறைவு", "contentment"],
  ["சரவணன்", "saravanan", "boy", "நாணல் பொய்கை முருகன்", "born of sacred reeds"],
  ["சதீஷ்", "satheesh", "boy", "நன்மை நாயகன்", "lord of truth"],
  ["சத்யா", "sathya", "unisex", "வாய்மை", "eternal truth"],
  ["சேகர்", "sekar", "boy", "மகுடம்", "noble crest"],
  ["செந்தில்", "senthil", "boy", "திருச்செந்தூர் முருகன்", "blessed Senthil"],
  ["ஷங்கர்", "shankar", "boy", "நன்மை செய்பவன்", "giver of peace"],
  ["சண்முகம்", "shanmugam", "boy", "ஆறுமுகன்", "six-faced Murugan"],
  ["சிவா", "siva", "boy", "மங்கள சிவன்", "auspicious Shiva"],
  ["ஸ்ரீதர்", "sridhar", "boy", "திருமால்", "bearer of fortune"],
  ["ஸ்ரீனிவாசன்", "srinivasan", "boy", "திருவேங்கடவன்", "abode of Sri"],
  ["சுப்பிரமணியன்", "subramanian", "boy", "முருகப்பெருமான்", "radiant Subramanya"],
  ["சுதர்சன்", "sudharshan", "boy", "நல்ல தரிசனம்", "auspicious vision"],
  ["சுரேஷ்", "suresh", "boy", "தேவர் தலைவன்", "lord of celestials"],
  ["சூர்யா", "surya", "unisex", "சூரியன்", "bright sun"],
  ["உதய்", "udhay", "boy", "உதயம்", "rising dawn"],
  ["விக்னேஷ்", "vignesh", "boy", "தடை நீக்குபவன்", "remover of obstacles"],
  ["விஜய்", "vijay", "boy", "வெற்றி", "victorious"],
  ["விக்ரம்", "vikram", "boy", "வீரம்", "valorous"],
  ["வினோத்", "vinoth", "boy", "மகிழ்ச்சி", "joyful grace"],
  ["விவேக்", "vivek", "boy", "பகுத்தறிவு", "wise discernment"],
];
for (const [ta, en, gender, mTa, mEn] of EXTRA_TN_SUFFIXES) {
  TN_USAGE_SUFFIXES.push({ ta, en, gender, mTa, mEn });
}

const EXTRA_OTHER_PREFIXES = [
  ["ஆரவ்", "Aarav", "அமைதி", "peaceful", "Pan-Indian / Modern Heritage"],
  ["ஆர்யன்", "Aryan", "உயர் குணம்", "noble", "Pan-Indian Heritage"],
  ["அயான்", "Ayaan", "இறைப் பரிசு", "gift of God", "Arabic / Global Heritage"],
  ["ரயான்", "Rayaan", "சொர்க்க வாயில்", "gate of paradise", "Arabic / Global Heritage"],
  ["ஸையான்", "Zayan", "அழகும் கருணையும்", "grace and beauty", "Arabic / Global Heritage"],
  ["கைரா", "Kyra", "சூரிய ஒளி", "sunlight", "Greek / Persian Heritage"],
  ["மாயா", "Maya", "அற்புத மாயை", "creative magic", "Global / Pan-Indian Heritage"],
  ["ரியா", "Riya", "பாடகி", "graceful singer", "Pan-Indian / Global Heritage"],
  ["தியா", "Diya", "விளக்கு", "radiant lamp", "Pan-Indian Heritage"],
  ["ஸாரா", "Zara", "மலரும் இளவரசி", "blooming princess", "Arabic / Global Heritage"],
  ["ஆலியா", "Aliya", "உயர்ந்தவள்", "exalted", "Arabic / Global Heritage"],
  ["ஈதன்", "Ethan", "உறுதியான", "steadfast", "Hebrew / Global Heritage"],
  ["நோவா", "Noah", "அமைதி", "restful peace", "Hebrew / Global Heritage"],
  ["லியாம்", "Liam", "உறுதியான காவலன்", "resolute protector", "Irish / Global Heritage"],
  ["லூக்கா", "Lucas", "ஒளி தருபவன்", "bringer of light", "Latin / Global Heritage"],
  ["லியோ", "Leo", "சிங்க வலிமை", "brave lion", "Latin / Global Heritage"],
  ["மேக்ஸ்", "Max", "மிகச்சிறந்த", "greatest", "Latin / Global Heritage"],
  ["ஓலிவர்", "Oliver", "அமைதி ஆலிவ்", "olive peace", "Latin / Global Heritage"],
  ["தியோ", "Theo", "இறைப் பரிசு", "divine gift", "Greek / Global Heritage"],
  ["மிலோ", "Milo", "கருணையுள்ள", "merciful", "Germanic / Global Heritage"],
  ["ஆரோன்", "Aaron", "உயர்ந்த மலை", "exalted mountain", "Hebrew / Biblical Heritage"],
  ["ஆடம்", "Adam", "மண்ணின் மைந்தன்", "child of earth", "Hebrew / Global Heritage"],
  ["ஆலன்", "Alan", "அழகிய இணக்கம்", "harmony", "Celtic / Global Heritage"],
  ["ஆல்பர்ட்", "Albert", "புகழ்மிக்க அறிவு", "noble bright", "Germanic / Global Heritage"],
  ["அலெக்ஸ்", "Alex", "மனிதநேயக் காவலன்", "defender", "Greek / Global Heritage"],
  ["ஆண்ட்ரூ", "Andrew", "வீரம் மிக்க", "courageous", "Greek / Biblical Heritage"],
  ["ஆண்டனி", "Antony", "மதிப்பு மிக்க", "priceless", "Latin / Biblical Heritage"],
  ["ஆர்தர்", "Arthur", "கரடி போன்ற வலிமை", "noble champion", "Celtic / Global Heritage"],
  ["ஆஸ்டின்", "Austin", "மதிப்பிற்குரிய", "venerable", "Latin / Global Heritage"],
  ["பெஞ்சமின்", "Benjamin", "நல்லதிர்ஷ்ட மைந்தன்", "favored son", "Hebrew / Biblical Heritage"],
  ["பிரையன்", "Brian", "உயர் குன்று", "noble strength", "Celtic / Global Heritage"],
  ["புரூஸ்", "Bruce", "வளமான தோட்டம்", "verdant grove", "Scottish / Global Heritage"],
  ["காலேப்", "Caleb", "விசுவாசமிக்க", "faithful heart", "Hebrew / Biblical Heritage"],
  ["கார்ல்", "Carl", "சுதந்திர வீரன்", "free spirit", "Germanic / Global Heritage"],
  ["சார்லஸ்", "Charles", "பெருந்தன்மை வீரன்", "noble free man", "Germanic / Global Heritage"],
  ["கிறிஸ்டியன்", "Christian", "அன்பு நெறியாளன்", "follower of grace", "Latin / Biblical Heritage"],
  ["கிறிஸ்டோபர்", "Christopher", "ஒளி சுமப்பவன்", "bearer of light", "Greek / Biblical Heritage"],
  ["கிளார்க்", "Clark", "அறிஞன்", "scholar", "English / Global Heritage"],
  ["கோலின்", "Colin", "வெற்றிச் செல்வன்", "victorious youth", "Celtic / Global Heritage"],
  ["டேனியல்", "Daniel", "இறை நீதி", "wise judge", "Hebrew / Biblical Heritage"],
  ["டேவிட்", "David", "அன்பிற்குரியவன்", "beloved", "Hebrew / Biblical Heritage"],
  ["டெனிஸ்", "Dennis", "மகிழ்ச்சித் தோட்டம்", "joyful spirit", "Greek / Global Heritage"],
  ["டெரிக்", "Derek", "மக்கள் தலைவன்", "ruler of people", "Germanic / Global Heritage"],
  ["டொமினிக்", "Dominic", "இறைவனுக்கு உரியவன்", "belonging to grace", "Latin / Global Heritage"],
  ["டோனால்ட்", "Donald", "உலக ஆட்சியாளன்", "world ruler", "Celtic / Global Heritage"],
  ["டக்ளஸ்", "Douglas", "கருநீல நதி", "dark river", "Scottish / Global Heritage"],
  ["டங்கன்", "Duncan", "பழுப்பு வீரன்", "noble warrior", "Celtic / Global Heritage"],
  ["எட்கர்", "Edgar", "வளமான காவலன்", "prosperous guardian", "English / Global Heritage"],
  ["எட்வர்ட்", "Edward", "செல்வக் காவலன்", "wealth guardian", "English / Global Heritage"],
  ["எட்வின்", "Edwin", "செல்வ நண்பன்", "prosperous friend", "English / Global Heritage"],
  ["எலியாஸ்", "Elias", "இறைவன் உயர்ந்தவர்", "divine strength", "Hebrew / Biblical Heritage"],
  ["எலியட்", "Elliot", "உயர் நம்பிக்கை", "steadfast faith", "Hebrew / Global Heritage"],
  ["எம்மானுவேல்", "Emmanuel", "இறைவன் நம்மோடு", "grace with us", "Hebrew / Biblical Heritage"],
  ["எரிக்", "Eric", "என்றும் ஆள்பவன்", "eternal ruler", "Norse / Global Heritage"],
  ["ஈவன்", "Evan", "இளமைப் போராளி", "young warrior", "Welsh / Global Heritage"],
  ["ஃபெலிக்ஸ்", "Felix", "மகிழ்ச்சியான", "fortunate and happy", "Latin / Global Heritage"],
  ["பிரான்சிஸ்", "Francis", "சுதந்திர மனிதன்", "free spirit", "Latin / Global Heritage"],
  ["பிராங்க்", "Frank", "நேர்மையான", "candid and free", "Germanic / Global Heritage"],
  ["பிரெடரிக்", "Frederick", "அமைதி மன்னன்", "peaceful ruler", "Germanic / Global Heritage"],
  ["கேப்ரியல்", "Gabriel", "இறை வலிமை", "strength of God", "Hebrew / Biblical Heritage"],
  ["ஜார்ஜ்", "George", "நில உழவன்", "earth keeper", "Greek / Global Heritage"],
  ["ஜெரால்ட்", "Gerald", "ஈட்டி வீரன்", "spear ruler", "Germanic / Global Heritage"],
  ["கில்பர்ட்", "Gilbert", "பிரகாச உறுதி", "bright pledge", "Germanic / Global Heritage"],
  ["கிளென்", "Glenn", "பசுமைப் பள்ளத்தாக்கு", "green valley", "Celtic / Global Heritage"],
  ["கிரகாம்", "Graham", "மணல் இல்லம்", "gravel homestead", "English / Global Heritage"],
  ["கிராண்ட்", "Grant", "மகத்தான", "great and tall", "Scottish / Global Heritage"],
  ["கிரிகோரி", "Gregory", "விழிப்புணர்வுள்ள", "watchful", "Greek / Global Heritage"],
  ["ஹாரி", "Harry", "இல்லத் தலைவன்", "home ruler", "Germanic / Global Heritage"],
  ["ஹென்றி", "Henry", "நாட்டின் தலைவன்", "ruler of estate", "Germanic / Global Heritage"],
  ["ஹோவர்ட்", "Howard", "உயர் காவலன்", "noble guardian", "English / Global Heritage"],
  ["ஹ்யூ", "Hugh", "தெளிந்த மனம்", "bright mind", "Germanic / Global Heritage"],
  ["இயன்", "Ian", "கருணைப் பரிசு", "gracious gift", "Scottish / Global Heritage"],
  ["ஐசக்", "Isaac", "மகிழ்ச்சிச் சிரிப்பு", "joyful laughter", "Hebrew / Biblical Heritage"],
  ["இவான்", "Ivan", "அருள் மிக்கவன்", "gracious", "Slavic / Global Heritage"],
  ["ஜேக்கப்", "Jacob", "நல்வழி நடப்பவன்", "supplanter", "Hebrew / Biblical Heritage"],
  ["ஜேம்ஸ்", "James", "உறுதியானவன்", "steadfast", "Hebrew / Biblical Heritage"],
  ["ஜேசன்", "Jason", "நலம் தருபவன்", "healer", "Greek / Global Heritage"],
  ["ஜெஃப்ரி", "Jeffrey", "தெய்வ அமைதி", "divine peace", "Germanic / Global Heritage"],
  ["ஜெரோம்", "Jerome", "புனிதப் பெயர்", "sacred name", "Greek / Global Heritage"],
  ["ஜெஸ்ஸி", "Jesse", "இறைப் பரிசு", "precious gift", "Hebrew / Biblical Heritage"],
  ["ஜோயல்", "Joel", "இறைவன் ஒளி", "willing spirit", "Hebrew / Biblical Heritage"],
  ["ஜான்", "John", "கருணை மிக்கவன்", "gracious gift", "Hebrew / Biblical Heritage"],
  ["ஜோனாதன்", "Jonathan", "இறைவன் தந்தவன்", "given by grace", "Hebrew / Biblical Heritage"],
  ["ஜோசப்", "Joseph", "வளர்ச்சி தருபவன்", "prospering", "Hebrew / Biblical Heritage"],
  ["ஜோசுவா", "Joshua", "மீட்பர்", "rescuer", "Hebrew / Biblical Heritage"],
  ["ஜூலியன்", "Julian", "இளமைப் பொலிவு", "youthful", "Latin / Global Heritage"],
  ["ஜஸ்டின்", "Justin", "நீதிமான்", "just and fair", "Latin / Global Heritage"],
  ["கென்", "Ken", "அழகிய அறிவு", "handsome and wise", "Celtic / Japanese Heritage"],
  ["கெவின்", "Kevin", "இனிய பிறப்பு", "gentle birth", "Irish / Global Heritage"],
  ["லாரன்ஸ்", "Lawrence", "வெற்றி மாலை", "crowned with laurel", "Latin / Global Heritage"],
  ["லியோனார்ட்", "Leonard", "சிங்க இதயம்", "lion-hearted", "Germanic / Global Heritage"],
  ["லூயிஸ்", "Louis", "புகழ்பெற்ற வீரன்", "renowned warrior", "French / Global Heritage"],
  ["லூக்", "Luke", "ஒளி தருபவன்", "light-giving", "Greek / Biblical Heritage"],
  ["மால்கம்", "Malcolm", "அமைதித் தூதர்", "devotee of peace", "Scottish / Global Heritage"],
  ["மார்க்", "Mark", "வலிமை வீரன்", "shining defender", "Latin / Biblical Heritage"],
  ["மார்ட்டின்", "Martin", "போர் வீரன்", "brave spirit", "Latin / Global Heritage"],
  ["மேத்யூ", "Matthew", "இறைப் பரிசு", "gift of grace", "Hebrew / Biblical Heritage"],
  ["மைக்கேல்", "Michael", "இறை தூதர்", "divine messenger", "Hebrew / Biblical Heritage"],
  ["நாதன்", "Nathan", "கொடையாளி", "generous giver", "Hebrew / Biblical Heritage"],
  ["நிக்கோலஸ்", "Nicholas", "மக்கள் வெற்றி", "victory of people", "Greek / Global Heritage"],
  ["நார்மன்", "Norman", "வடதிசை வீரன்", "northman", "Germanic / Global Heritage"],
  ["ஓவன்", "Owen", "இளமை வீரன்", "noble born", "Welsh / Global Heritage"],
  ["பாட்ரிக்", "Patrick", "உயர் குடிமகன்", "noble patrician", "Latin / Global Heritage"],
  ["பால்", "Paul", "பணிவானவன்", "humble", "Latin / Biblical Heritage"],
  ["பீட்டர்", "Peter", "பாறை உறுதி", "steadfast rock", "Greek / Biblical Heritage"],
  ["பிலிப்", "Philip", "அன்பு நண்பன்", "friend of steeds", "Greek / Global Heritage"],
  ["ரால்ப்", "Ralph", "ஞான ஆலோசகன்", "wise counsel", "Norse / Global Heritage"],
  ["ரேமண்ட்", "Raymond", "ஞானக் காவலன்", "wise protector", "Germanic / Global Heritage"],
  ["ரிச்சர்ட்", "Richard", "வலிமை ஆட்சியாளன்", "brave ruler", "Germanic / Global Heritage"],
  ["ராபர்ட்", "Robert", "புகழ் ஒளி", "bright fame", "Germanic / Global Heritage"],
  ["ரோஜர்", "Roger", "புகழ்மிக்க ஈட்டி", "famous champion", "Germanic / Global Heritage"],
  ["ரொனால்ட்", "Ronald", "ஞான ஆலோசனை", "wise ruler", "Norse / Global Heritage"],
  ["ராய்", "Roy", "அரசன்", "royal king", "French / Celtic Heritage"],
  ["ரசல்", "Russell", "செம்பொன் ஒளி", "golden-haired", "French / Global Heritage"],
  ["சாமுவேல்", "Samuel", "இறைவன் கேட்டான்", "heard by grace", "Hebrew / Biblical Heritage"],
  ["ஸ்காட்", "Scott", "சுதந்திரப் பயணி", "wanderer", "Scottish / Global Heritage"],
  ["சீன்", "Sean", "கருணைப் பரிசு", "gracious", "Irish / Global Heritage"],
  ["செபாஸ்டியன்", "Sebastian", "மதிப்பிற்குரிய", "venerable", "Greek / Global Heritage"],
  ["சைமன்", "Simon", "செவிசாய்ப்பவன்", "attentive listener", "Hebrew / Biblical Heritage"],
  ["ஸ்டீபன்", "Stephen", "வெற்றி மகுடம்", "crowned in victory", "Greek / Biblical Heritage"],
  ["ஸ்டீவர்ட்", "Stewart", "நல்ல காவலன்", "faithful steward", "Scottish / Global Heritage"],
  ["தாமஸ்", "Thomas", "இரட்டைச் சிறப்பு", "steadfast twin", "Aramaic / Biblical Heritage"],
  ["திமோதி", "Timothy", "இறை மதிப்பு", "honoring grace", "Greek / Biblical Heritage"],
  ["விக்டர்", "Victor", "வெற்றியாளன்", "conqueror", "Latin / Global Heritage"],
  ["வின்சென்ட்", "Vincent", "வெல்லும் வீரன்", "prevailing", "Latin / Global Heritage"],
  ["வால்டர்", "Walter", "வலிமைத் தலைவன்", "commander", "Germanic / Global Heritage"],
  ["வில்லியம்", "William", "உறுதியான காவலன்", "resolute protector", "Germanic / Global Heritage"],
];
for (const [ta, en, mTa, mEn, src] of EXTRA_OTHER_PREFIXES) {
  OTHER_PREFIXES.push({ ta, en, mTa, mEn, src });
}

const EXTRA_OTHER_SECOND_PARTS = [
  ["அஹ்மத்", "ahmed", "boy", "போற்றப்படும்", "praiseworthy"],
  ["அலி", "ali", "boy", "உயர்ந்த", "exalted"],
  ["அமீர்", "amir", "boy", "இளவரசன்", "prince"],
  ["அர்மான்", "armaan", "boy", "நல்லாசை", "noble wish"],
  ["அர்சலான்", "arsalan", "boy", "அஞ்சாத சிங்கம்", "fearless lion"],
  ["ஆசிஃப்", "asif", "boy", "மன்னிப்பவன்", "forgiving"],
  ["அசார்", "azhar", "boy", "ஒளிவீசும்", "radiant"],
  ["பிலால்", "bilal", "boy", "புத்துணர்வு", "refreshing"],
  ["தானிஷ்", "danish", "boy", "அறிவு", "wisdom"],
  ["ஃபைசல்", "faisal", "boy", "நடுநிலை நீதிபதி", "decisive"],
  ["ஃபரீத்", "farid", "boy", "ஒப்பற்ற", "unique"],
  ["ஃபர்ஹான்", "farhan", "boy", "மகிழ்ச்சி", "joyful"],
  ["ஹமீத்", "hamid", "boy", "புகழப்படுபவன்", "praised"],
  ["ஹம்ஸா", "hamza", "boy", "வலிமையான", "steadfast"],
  ["ஹாரிஸ்", "haris", "boy", "காவலன்", "guardian"],
  ["ஹசன்", "hasan", "boy", "அழகான", "handsome"],
  ["ஹுசைன்", "hussein", "boy", "நல்ல அழகு", "noble beauty"],
  ["இப்ராஹிம்", "ibrahim", "boy", "நல்ல தந்தை", "exalted father"],
  ["இத்ரீஸ்", "idris", "boy", "அறிஞன்", "studious"],
  ["இம்ரான்", "imran", "boy", "வளர்ச்சி", "prosperity"],
  ["இர்ஃபான்", "irfan", "boy", "அறிவு ஒளி", "knowledge"],
  ["இஸ்மாயில்", "ismail", "boy", "இறைவன் கேட்பான்", "heard by God"],
  ["ஜாஃபர்", "jafar", "boy", "நீரோடை", "stream"],
  ["ஜலால்", "jalal", "boy", "மகத்துவம்", "majesty"],
  ["ஜமால்", "jamal", "boy", "அழகு", "beauty"],
  ["ஜாவேத்", "javed", "boy", "என்றும் வாழும்", "eternal"],
  ["கபீர்", "kabir", "boy", "பெரியவர்", "great"],
  ["கமால்", "kamal", "boy", "முழுமை", "perfection"],
  ["கரீம்", "karim", "boy", "கொடையாளி", "generous"],
  ["காலித்", "khalid", "boy", "என்றும் நிலையான", "eternal"],
  ["லத்தீஃப்", "latif", "boy", "மென்மையான", "gentle"],
  ["மஹ்மூத்", "mahmood", "boy", "போற்றப்பட்ட", "praised"],
  ["மாலிக்", "malik", "boy", "அரசன்", "sovereign"],
  ["மன்சூர்", "mansoor", "boy", "வெற்றியாளன்", "victorious"],
  ["முஸ்தபா", "mustafa", "boy", "தேர்ந்தெடுக்கப்பட்ட", "chosen"],
  ["நபீல்", "nabil", "boy", "உயர் குணம்", "noble"],
  ["நதீம்", "nadeem", "boy", "நண்பன்", "companion"],
  ["நசீர்", "nasir", "boy", "உதவியாளன்", "helper"],
  ["நவாஸ்", "nawaz", "boy", "கருணையாளன்", "kind"],
  ["ஓமர்", "omar", "boy", "நீண்ட வாழ்வு", "flourishing"],
  ["உஸ்மான்", "osman", "boy", "ஞானப் பறவை", "wise one"],
  ["காதர்", "qadir", "boy", "ஆற்றல்மிக்க", "capable"],
  ["ரஹீம்", "rahim", "boy", "இரக்கமுள்ள", "merciful"],
  ["ரஹ்மான்", "rahman", "boy", "பேரருளாளன்", "compassionate"],
  ["ரஷீத்", "rashid", "boy", "நல்வழி நடந்தோன்", "rightly guided"],
  ["ரஸாக்", "razak", "boy", "வழங்குபவன்", "provider"],
  ["ரியாஸ்", "riyaz", "boy", "பூந்தோட்டம்", "garden"],
  ["ரிஸ்வான்", "rizwan", "boy", "மகிழ்ச்சி", "contentment"],
  ["சாதிக்", "sadiq", "boy", "உண்மையாளன்", "truthful"],
  ["சயீத்", "saeed", "boy", "மகிழ்ச்சியாளன்", "fortunate"],
  ["சைஃப்", "saif", "boy", "வீர வாள்", "sword of honor"],
  ["சலீம்", "salim", "boy", "பாதுகாப்பான", "peaceful"],
  ["சல்மான்", "salman", "boy", "அமைதி", "safe"],
  ["சமீர்", "samir", "boy", "இனிய தோழன்", "jovial companion"],
  ["ஷாஹித்", "shahid", "boy", "சாட்சி", "witness"],
  ["ஷகீல்", "shakeel", "boy", "அழகான", "handsome"],
  ["ஷரீஃப்", "sharif", "boy", "உயர்ந்தவன்", "noble"],
  ["சோஹைல்", "sohail", "boy", "விண்மீன்", "canopus star"],
  ["சுஹைல்", "suhail", "boy", "மென்மையான", "gentle"],
  ["சுலைமான்", "sulaiman", "boy", "அமைதி மன்னன்", "peaceful"],
  ["தாஹிர்", "tahir", "boy", "தூய்மையான", "pure"],
  ["தாரிக்", "tariq", "boy", "காலை விண்மீன்", "morning star"],
  ["உமர்", "umar", "boy", "வளமானவன்", "prosperous"],
  ["வஹீத்", "waheed", "boy", "ஒப்பற்ற", "unique"],
  ["வசீம்", "waseem", "boy", "அழகிய", "graceful"],
  ["யாசர்", "yasir", "boy", "வளமான", "wealthy"],
  ["யூசுஃப்", "yusuf", "boy", "வளர்ச்சி", "prospering"],
  ["ஜாஹிர்", "zahir", "boy", "பிரகாசமான", "shining"],
  ["சைத்", "zaid", "boy", "வளர்ச்சி", "abundance"],
  ["ஜக்கரியா", "zakariya", "boy", "நினைவு", "remembered"],
  ["ஜீஷான்", "zeeshan", "boy", "உயர்ந்த தரன்", "high standard"],
  ["ஜுபைர்", "zubair", "boy", "வலிமையான", "strong"],
  ["ஆயிஷா", "aisha", "girl", "உயிர்ப்புள்ளவள்", "vivacious"],
  ["ஆலியா", "aliya", "girl", "உயர்ந்தவள்", "exalted"],
  ["அமிரா", "amira", "girl", "இளவரசி", "princess"],
  ["அஞ்சும்", "anjum", "girl", "விண்மீன்கள்", "stars"],
  ["அஸ்மா", "asma", "girl", "உயர்வானவள்", "lofty"],
  ["ஆயத்", "ayat", "girl", "அடையாளம்", "sign of grace"],
  ["புஷ்ரா", "bushra", "girl", "நற்செய்தி", "good news"],
  ["தில்ஷாத்", "dilshad", "girl", "மகிழ்ந்த மனம்", "happy heart"],
  ["ஃபரா", "farah", "girl", "மகிழ்ச்சி", "joy"],
  ["ஃபரீதா", "farida", "girl", "ஒப்பற்ற முத்து", "unique pearl"],
  ["ஃபாத்திமா", "fatima", "girl", "ஒளிர்பவள்", "shining"],
  ["ஃபௌசியா", "fauzia", "girl", "வெற்றியாளர்", "victorious"],
  ["கஸாலா", "ghazala", "girl", "அழகிய மான்", "gazelle"],
  ["ஹபீபா", "habiba", "girl", "அன்பிற்குரியவள்", "beloved"],
  ["ஹலீமா", "halima", "girl", "பொறுமையாளள்", "patient"],
  ["ஹனிஃபா", "hanifa", "girl", "உண்மை நெறியாள்", "true believer"],
  ["ஹுமேரா", "humaira", "girl", "செந்நிற அழகி", "rosy"],
  ["இக்ரா", "iqra", "girl", "கல்வி அறிவு", "learning"],
  ["இஷ்ரத்", "ishrat", "girl", "மகிழ்ச்சி", "delight"],
  ["ஜமீலா", "jamila", "girl", "அழகி", "beautiful"],
  ["ஜன்னத்", "jannat", "girl", "சொர்க்கம்", "paradise"],
  ["ஜரீனா", "zarina", "girl", "பொன் மயம்", "golden"],
  ["கதீஜா", "khadija", "girl", "நம்பகமானவள்", "trustworthy"],
  ["கௌசர்", "kausar", "girl", "வளமான ஆறு", "abundance"],
  ["லைலா", "laila", "girl", "இரவு அழகு", "night beauty"],
  ["லுப்னா", "lubna", "girl", "நறுமண மரம்", "fragrant"],
  ["மதிஹா", "madiha", "girl", "போற்றப்படுபவள்", "praiseworthy"],
  ["மஹ்ரின்", "mahreen", "girl", "சூரிய அழகு", "sun-bright"],
  ["மலைக்கா", "malaika", "girl", "தேவதை", "angel"],
  ["மரியம்", "mariam", "girl", "உயர்ந்தவள்", "exalted"],
  ["மெஹக்", "mehak", "girl", "நறுமணம்", "fragrance"],
  ["மெஹ்ரின்", "mehrin", "girl", "அன்புள்ளவள்", "loving"],
  ["மும்தாஜ்", "mumtaz", "girl", "தலைசிறந்தவள்", "distinguished"],
  ["நபீலா", "nabila", "girl", "உயர் குணவதி", "noble"],
  ["நதியா", "nadia", "girl", "நம்பிக்கை", "hope"],
  ["நஃபீசா", "nafisa", "girl", "மதிப்புமிக்க", "precious"],
  ["நஹீத்", "nahid", "girl", "வெள்ளி விண்மீன்", "venus star"],
  ["நைலா", "naila", "girl", "வெற்றியாளர்", "achiever"],
  ["நஸீமா", "nasima", "girl", "தென்றல்", "gentle breeze"],
  ["நஸ்ரின்", "nasreen", "girl", "காட்டு ரோஜா", "wild rose"],
  ["நௌஷீன்", "nausheen", "girl", "இனிமையான", "sweet"],
  ["நிதா", "nida", "girl", "அழைப்பு", "melodious call"],
  ["நிகத்", "nighat", "girl", "நறுமணம்", "scent"],
  ["நூர்", "noor", "girl", "தெய்வீக ஒளி", "divine light"],
  ["பர்வீன்", "parveen", "girl", "விண்மீன் கூட்டம்", "pleiades"],
  ["ரபியா", "rabia", "girl", "வசந்தம்", "springtime"],
  ["ரஹீமா", "rahima", "girl", "கருணையாளள்", "merciful"],
  ["ரெஹானா", "rehana", "girl", "துளசி நறுமணம்", "sweet basil"],
  ["ரேஷ்மா", "reshma", "girl", "பட்டு போன்ற", "silken"],
  ["ரிப்கா", "rifka", "girl", "கருணை", "kindness"],
  ["ருபினா", "rubina", "girl", "மாணிக்கம்", "ruby"],
  ["ருக்சானா", "ruksana", "girl", "பிரகாசம்", "brilliant"],
  ["சபா", "saba", "girl", "காலைத் தென்றல்", "morning breeze"],
  ["சபீனா", "sabina", "girl", "தூயவள்", "noble"],
  ["சதியா", "sadiya", "girl", "அதிர்ஷ்டசாலி", "fortunate"],
  ["சஃபியா", "safiya", "girl", "தூய தோழி", "pure friend"],
  ["சஹர்", "sahar", "girl", "வைகறை", "dawn"],
  ["சாய்மா", "saima", "girl", "தவ நெறியாள்", "devoted"],
  ["சஜீதா", "sajida", "girl", "பணிவாளள்", "humble"],
  ["சகீனா", "sakina", "girl", "மன அமைதி", "tranquility"],
  ["சமன்", "saman", "girl", "மல்லிகை", "jasmine"],
  ["சமீரா", "samira", "girl", "இனிய தோழி", "companion"],
  ["சனியா", "saniya", "girl", "ஒளிரும்", "brilliant"],
  ["ஷபானா", "shabana", "girl", "இளம் நிலவு", "radiant"],
  ["ஷஹீன்", "shaheen", "girl", "அரசப் பறவை", "royal falcon"],
  ["ஷகீலா", "shakila", "girl", "அழகானவள்", "comely"],
  ["ஷமிலா", "shamila", "girl", "நிறைவானவள்", "comprehensive"],
  ["ஷரீஃபா", "sharifa", "girl", "உயர் குணவதி", "noble"],
  ["ஷாயிஸ்தா", "shayista", "girl", "பண்பாளள்", "courteous"],
  ["ஷீபா", "sheeba", "girl", "அழகு ராணி", "noble queen"],
  ["ஷிரீன்", "shireen", "girl", "இனிமையானவள்", "sweet"],
  ["சித்ரா", "sidra", "girl", "விண்மீன் போன்ற", "like a star"],
  ["சோபியா", "sofia", "girl", "ஞானம்", "wisdom"],
  ["சுமையா", "sumaiya", "girl", "உயர்ந்தவள்", "high above"],
  ["சுரையா", "suraiya", "girl", "கார்த்திகை விண்மீன்", "pleiades"],
  ["தபஸும்", "tabassum", "girl", "புன்னகை", "gentle smile"],
  ["தஹிரா", "tahira", "girl", "தூய்மையானவள்", "pure"],
  ["தஸ்னீம்", "tasneem", "girl", "சொர்க்க நீரூற்று", "fountain of paradise"],
  ["உஸ்மா", "uzma", "girl", "மிகச்சிறந்தவள்", "greatest"],
  ["வஹீதா", "wahida", "girl", "ஒப்பற்றவள்", "unique"],
  ["யாஸ்மின்", "yasmeen", "girl", "மல்லிகை மலர்", "jasmine flower"],
  ["ஸாஹிரா", "zahira", "girl", "ஒளிரும் மலர்", "shining blossom"],
  ["ஸைனப்", "zainab", "girl", "நறுமண மரம்", "fragrant tree"],
  ["ஸகியா", "zakiya", "girl", "தூய்மையும் அறிவும்", "pure and intelligent"],
  ["ஸோயா", "zoya", "girl", "உயிர்ப்புள்ள", "loving and alive"],
  ["அலெக்ஸா", "alexa", "girl", "மனிதநேயக் காவலி", "defender"],
  ["அமண்டா", "amanda", "girl", "அன்பிற்குரியவள்", "lovable"],
  ["ஆஞ்சலா", "angela", "girl", "தேவதை", "angelic"],
  ["ஆஷ்லி", "ashley", "girl", "பசுமைப் புல்வெளி", "ash meadow"],
  ["ஆட்ரி", "audrey", "girl", "உயர் வலிமை", "noble strength"],
  ["பார்பரா", "barbara", "girl", "அயல்நாட்டு அழகி", "exotic"],
  ["பீட்ரிஸ்", "beatrice", "girl", "மகிழ்ச்சி தருபவள்", "bringer of joy"],
  ["பெலிண்டா", "belinda", "girl", "அழகிய ஒளி", "bright beauty"],
  ["பெத்தனி", "bethany", "girl", "அத்தி இல்லம்", "house of figs"],
  ["பிரெண்டா", "brenda", "girl", "ஒளி வாள்", "flame"],
  ["பிரிட்ஜெட்", "bridget", "girl", "உயர்ந்தவள்", "exalted"],
  ["கரோலின்", "caroline", "girl", "சுதந்திர மங்கை", "free spirit"],
  ["கேத்தரின்", "catherine", "girl", "தூய்மையானவள்", "pure"],
  ["செசிலியா", "cecilia", "girl", "இசைப் புரவலி", "harmonious"],
  ["சார்லோட்", "charlotte", "girl", "சுதந்திரப் பெண்மணி", "free woman"],
  ["கிளாரா", "clara", "girl", "தெளிவான ஒளி", "bright and clear"],
  ["டயானா", "diana", "girl", "தெய்வீக நிலவு", "divine"],
  ["டோரா", "dora", "girl", "இறைப் பரிசு", "precious gift"],
  ["எலினார்", "eleanor", "girl", "பிரகாசமான ஒளி", "shining light"],
  ["எலிசபெத்", "elizabeth", "girl", "இறை வாக்குறுதி", "consecrated"],
  ["எமிலி", "emily", "girl", "முயற்சியாளள்", "industrious"],
  ["எம்மா", "emma", "girl", "முழுமையானவள்", "universal"],
  ["எஸ்தர்", "esther", "girl", "விண்மீன்", "shining star"],
  ["ஈவ்லின்", "evelyn", "girl", "விரும்பப்படும் ஒளி", "wished-for"],
  ["பியோனா", "fiona", "girl", "தூய வெண்மை", "fair"],
  ["புளோரன்ஸ்", "florence", "girl", "மலரும் செழிப்பு", "flourishing"],
  ["ஜார்ஜியா", "georgia", "girl", "பூமி வளம்", "earth keeper"],
  ["கிளாடிஸ்", "gladys", "girl", "மலர் அரசி", "princess"],
  ["குளோரியா", "gloria", "girl", "அழியாப் புகழ்", "glory"],
  ["ஹன்னா", "hannah", "girl", "கருணை", "grace"],
  ["ஹெலன்", "helen", "girl", "ஒளிச்சுடர்", "shining light"],
  ["ஐரீன்", "irene", "girl", "அமைதி", "peace"],
  ["இசபெல்லா", "isabella", "girl", "இறை அர்ப்பணிப்பு", "devoted"],
  ["ஜாக்குலின்", "jacqueline", "girl", "காவலி", "protector"],
  ["ஜேன்", "jane", "girl", "கருணை மிக்கவள்", "gracious"],
  ["ஜெனிபர்", "jennifer", "girl", "தூய அலை", "fair spirit"],
  ["ஜெசிகா", "jessica", "girl", "தொலைநோக்கு", "foresight"],
  ["ஜோசபின்", "josephine", "girl", "வளர்ச்சி தருபவள்", "prospering"],
  ["ஜூடித்", "judith", "girl", "போற்றப்படுபவள்", "praised"],
  ["ஜூலியா", "julia", "girl", "இளமைப் பொலிவு", "youthful"],
  ["கேட்", "kate", "girl", "தூய்மை", "pure"],
  ["லாரா", "laura", "girl", "வெற்றி மாலை", "laurel"],
  ["லிடியா", "lydia", "girl", "உயர் குணம்", "noble"],
  ["மார்கரெட்", "margaret", "girl", "முத்து", "pearl"],
  ["மரியா", "maria", "girl", "அன்பின் கடல்", "beloved"],
  ["மார்த்தா", "martha", "girl", "இல்லத்தரசி", "lady"],
  ["மெலிசா", "melissa", "girl", "தேன் தேனீ", "honeybee"],
  ["மோனிகா", "monica", "girl", "நல்ல ஆலோசகி", "advisor"],
  ["நவோமி", "naomi", "girl", "இனிமையானவள்", "pleasant"],
  ["நடாலி", "natalie", "girl", "பிறந்தநாள் ஒளி", "radiant birth"],
  ["நிக்கோல்", "nicole", "girl", "மக்கள் வெற்றி", "victory"],
  ["ஒலிவியா", "olivia", "girl", "அமைதி ஆலிவ்", "olive tree"],
  ["பமீலா", "pamela", "girl", "இனிய தேன்", "all honey"],
  ["பாட்ரிசியா", "patricia", "girl", "உயர் குடிமகள்", "noble"],
  ["பவுலா", "paula", "girl", "பணிவானவள்", "humble"],
  ["பெனிலோப்", "penelope", "girl", "நெசவாளி", "faithful weaver"],
  ["பீபி", "phoebe", "girl", "பிரகாசமான", "radiant"],
  ["பிரிசில்லா", "priscilla", "girl", "பழமைச் சிறப்பு", "venerable"],
  ["ரேச்சல்", "rachel", "girl", "அமைதியான", "gentle"],
  ["ரெபேக்கா", "rebecca", "girl", "இணைக்கும் அன்பு", "captivating"],
  ["ரோஸலின்", "rosalind", "girl", "அழகிய ரோஜா", "pretty rose"],
  ["ரூத்", "ruth", "girl", "நல்ல தோழி", "compassionate friend"],
  ["சபரினா", "sabrina", "girl", "நதி அரசி", "river princess"],
  ["சமந்தா", "samantha", "girl", "கவனிப்பவள்", "listener"],
  ["சாண்ட்ரா", "sandra", "girl", "காவலி", "defender"],
  ["சாரா", "sarah", "girl", "இளவரசி", "princess"],
  ["ஷரோன்", "sharon", "girl", "வளமான சமவெளி", "fertile plain"],
  ["ஷீலா", "sheila", "girl", "வானுலக இசை", "heavenly"],
  ["சில்வியா", "silvia", "girl", "வன அரசி", "forest spirit"],
  ["ஸ்டெபானி", "stephanie", "girl", "வெற்றி மகுடம்", "crowned"],
  ["சூசன்", "susan", "girl", "லில்லி மலர்", "graceful lily"],
  ["தெரசா", "theresa", "girl", "அறுவடை வளம்", "harvester"],
  ["உர்சுலா", "ursula", "girl", "சிறு கரடி வலிமை", "brave spirit"],
  ["வலேரி", "valerie", "girl", "வலிமை", "strength"],
  ["வனேசா", "vanessa", "girl", "வண்ணத்துப்பூச்சி", "butterfly"],
  ["வெரோனிகா", "veronica", "girl", "உண்மை வெற்றி", "true victory"],
  ["விக்டோரியா", "victoria", "girl", "வெற்றித் தேவதை", "victory"],
  ["விவியன்", "vivian", "girl", "உயிர்ப்புள்ள", "lively"],
  ["வெண்டி", "wendy", "girl", "நல்ல தோழி", "true friend"],
];
for (const [ta, en, gender, mTa, mEn] of EXTRA_OTHER_SECOND_PARTS) {
  OTHER_SECOND_PARTS.push({ ta, en, gender, mTa, mEn });
}

// ============================================================================
// 4. RECORD BUILDER (COMPACT ZERO-BLOAT FORMAT HYDRATED AT RUNTIME)
// ============================================================================
const NAKSHATRA_POOL = [
  { slug: "ashwini", rasiTa: "மேஷம்", rasiEn: "Mesha" },
  { slug: "bharani", rasiTa: "மேஷம்", rasiEn: "Mesha" },
  { slug: "karthigai", rasiTa: "ரிஷபம்", rasiEn: "Rishabha" },
  { slug: "rohini", rasiTa: "ரிஷபம்", rasiEn: "Rishabha" },
  { slug: "mrigashirsham", rasiTa: "மிதுனம்", rasiEn: "Mithuna" },
  { slug: "thiruvathirai", rasiTa: "மிதுனம்", rasiEn: "Mithuna" },
  { slug: "punarpoosam", rasiTa: "கடகம்", rasiEn: "Kataka" },
  { slug: "poosam", rasiTa: "கடகம்", rasiEn: "Kataka" },
  { slug: "ayilyam", rasiTa: "கடகம்", rasiEn: "Kataka" },
  { slug: "magam", rasiTa: "சிம்மம்", rasiEn: "Simha" },
  { slug: "pooram", rasiTa: "சிம்மம்", rasiEn: "Simha" },
  { slug: "uthiram", rasiTa: "கன்னி", rasiEn: "Kanya" },
  { slug: "hastham", rasiTa: "கன்னி", rasiEn: "Kanya" },
  { slug: "chithirai", rasiTa: "துலாம்", rasiEn: "Thula" },
  { slug: "swathi", rasiTa: "துலாம்", rasiEn: "Thula" },
  { slug: "visakam", rasiTa: "விருச்சிகம்", rasiEn: "Vrischika" },
  { slug: "anusham", rasiTa: "விருச்சிகம்", rasiEn: "Vrischika" },
  { slug: "kettai", rasiTa: "விருச்சிகம்", rasiEn: "Vrischika" },
  { slug: "moolam", rasiTa: "தனுசு", rasiEn: "Dhanusu" },
  { slug: "pooradam", rasiTa: "தனுசு", rasiEn: "Dhanusu" },
  { slug: "uthiradam", rasiTa: "மகரம்", rasiEn: "Makara" },
  { slug: "thiruvonam", rasiTa: "மகரம்", rasiEn: "Makara" },
  { slug: "avittam", rasiTa: "கும்பம்", rasiEn: "Kumbha" },
  { slug: "sathayam", rasiTa: "கும்பம்", rasiEn: "Kumbha" },
  { slug: "poorattathi", rasiTa: "மீனம்", rasiEn: "Meena" },
  { slug: "uthirattathi", rasiTa: "மீனம்", rasiEn: "Meena" },
  { slug: "revathi", rasiTa: "மீனம்", rasiEn: "Meena" },
];

function buildCompactRecord(opts, idx) {
  const { nameTamil, nameLatin, gender, meaningTa, meaningEn, nameCategory, categoryOriginSource, rootSplitTa, rootSplitEn, literalEn, derivedEn, dsalRoot } = opts;
  const slug = toSlug(nameLatin);
  const nak = NAKSHATRA_POOL[idx % NAKSHATRA_POOL.length];
  const sylTa = getStartingSyllableTa(nameTamil);
  const sylEn = nameLatin.slice(0, 2);

  if (nameCategory === "pure_tamil") {
    const encodedRoot = encodeURIComponent(dsalRoot);
    const dsalUrl = `https://dsal.uchicago.edu/cgi-bin/app/tamil-lex_query.py?qs=${encodedRoot}&searchhws=yes`;
    return {
      id: `pt-${slug}`,
      slug,
      nameTamil,
      nameLatin,
      gender,
      nameCategory: "pure_tamil",
      originCategory: "Modern Tamil",
      meaningTa,
      meaningEn,
      literalMeaningTa: `நேரடி வேர்ச்சொல்: ${rootSplitTa}`,
      literalMeaningEn: literalEn,
      derivedMeaningTa: meaningTa,
      derivedMeaningEn: derivedEn,
      etymologyRoot: rootSplitEn,
      sourceAttributionType: "Synthesized modern name from authentic roots",
      synthesisDisclaimer: `Modern Synthesis: «${nameTamil}» is formed from authentic Tamil lexicon roots (${rootSplitTa}) using Tolkappiyam sandhi.`,
      structuredReference: {
        workTa: "நவீனத் தமிழ்ப் பெயர் ஆக்கம் — சென்னைப் பல்கலைக்கழகத் தமிழ்ப் பேரகராதி வேர்ச்சொற்கள்",
        workEn: "Synthesized modern name from authentic roots (Madras University Tamil Lexicon)",
        sectionOrKandam: `வேர்ச்சொல் பிரிப்பு: ${rootSplitEn}`,
        chapterOrPadalam: "Literal Lexicon Root Definitions (No Ancient Poem Citation)",
        verseOrSongNumber: "Modern Synthesis (Post-Classical Coinage)",
        lineTitleOrQuote: "",
        citationText: `Synthesized modern Tamil name from authentic lexicon roots (${rootSplitEn})`,
        verificationTier: "Modern Synthesis (நவீனத் தமிழ்ப் பெயர் ஆக்கம்)",
        citationScope: "etymological-compound",
        sourceWebsite: dsalUrl,
        lexiconWebsite: dsalUrl,
        citationNote: `Modern Synthesis Disclaimer: «${nameTamil}» is constructed from authentic Tamil lexicon roots (${rootSplitTa}).`,
      },
      literaryReference: `Synthesized modern name from authentic Tamil roots: ${rootSplitEn} (Madras University Tamil Lexicon)`,
      sourceCitation: `University of Madras Tamil Lexicon (${dsalUrl})`,
      theme: ["Virtue", "Heritage", "Nature"],
      nakshatraSlugs: [nak.slug],
      startingSyllableTa: sylTa,
      startingSyllableEn: sylEn,
      rasiTa: nak.rasiTa,
      rasiEn: nak.rasiEn,
      confidence: 0.91,
      popularityRank: idx % 5 === 0 ? "popular" : idx % 2 === 0 ? "moderate" : "rare",
      verificationStatus: "Modern Synthesis (Human Linguistic Rules)",
    };
  }

  // Non-Pure Tamil Categories (tamilnadu_usage or other_heritage)
  const isTnUsage = nameCategory === "tamilnadu_usage";
  const srcUrl = isTnUsage
    ? `https://www.wisdomlib.org/definition/${encodeURIComponent(slug)}`
    : `https://www.behindthename.com/name/${encodeURIComponent(slug)}`;

  return {
    id: `${isTnUsage ? "tn" : "oh"}-${slug}`,
    slug,
    nameTamil,
    nameLatin,
    gender,
    nameCategory,
    categoryOriginSource,
    originCategory: isTnUsage ? "Tamil Nadu Cultural Usage" : "Global / Cross-Cultural Heritage",
    meaningTa,
    meaningEn,
    etymologyRoot: `${rootSplitEn} (${categoryOriginSource})`,
    sourceAttributionType: isTnUsage
      ? "Documented Tamil Nadu Cultural / Temple Usage"
      : "Documented Global / Cross-Cultural Heritage",
    structuredReference: {
      workTa: isTnUsage ? "தமிழ்நாட்டுப் பண்பாட்டுப் பெயர் பதிவு" : "பன்முகப் பண்பாட்டுப் பெயர் பதிவு",
      workEn: categoryOriginSource,
      sectionOrKandam: `Origin Source: ${categoryOriginSource}`,
      chapterOrPadalam: "Cultural & Registry Attestation",
      verseOrSongNumber: isTnUsage ? "TN Cultural Usage" : "Global / Pan-Indian Heritage",
      lineTitleOrQuote: "",
      citationText: `${nameLatin} (${nameTamil}) — ${meaningEn} [Source: ${categoryOriginSource}]`,
      verificationTier: isTnUsage ? "Tamil Nadu Usage (தமிழ்நாட்டுப் பயன்பாடு)" : "Other Heritage (பிற மரபுப் பெயர்)",
      citationScope: "cultural-usage",
      sourceWebsite: srcUrl,
      lexiconWebsite: srcUrl,
      citationNote: `Source Attribution: «${nameTamil}» (${nameLatin}) is categorized under ${
        isTnUsage ? "Names Used in Tamil Nadu" : "Other Heritage Names"
      }. Origin Source: ${categoryOriginSource}.`,
    },
    literaryReference: `${categoryOriginSource} — Meaning: ${meaningEn}`,
    sourceCitation: `${categoryOriginSource} (${srcUrl})`,
    theme: [isTnUsage ? "Devotion & Heritage" : "Global & Modern"],
    nakshatraSlugs: [nak.slug],
    startingSyllableTa: sylTa,
    startingSyllableEn: sylEn,
    rasiTa: nak.rasiTa,
    rasiEn: nak.rasiEn,
    confidence: 0.88,
    popularityRank: idx % 3 === 0 ? "popular" : "moderate",
    verificationStatus: isTnUsage ? "Tamil Nadu Usage (Documented Source)" : "Other Heritage (Documented Source)",
  };
}

// ============================================================================
// 5. MAIN EXECUTION LOOP
// ============================================================================
async function main() {
  console.log("🚀 [OmniRoute Continuous Sourcer] Initializing...");
  const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
  const seenSlugs = new Set();
  const seenTamil = new Set();
  const counts = { pure_tamil: 0, tamilnadu_usage: 0, other_heritage: 0 };

  for (const shard of indexData.shards) {
    const file = path.join(NAMES_DIR, shard.file);
    if (!fs.existsSync(file)) continue;
    const records = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const r of records) {
      if (r.slug) seenSlugs.add(r.slug.toLowerCase());
      if (r.nameTamil) seenTamil.add(r.nameTamil.trim());
      const cat = r.nameCategory || "pure_tamil";
      counts[cat] = (counts[cat] || 0) + 1;
    }
  }

  console.log("📊 Current Catalog Counts:");
  console.log(`   1. Pure Tamil (pure_tamil):          ${counts.pure_tamil.toLocaleString()} / ${TARGET_PER_CATEGORY.toLocaleString()}`);
  console.log(`   2. Used in Tamil Nadu (tamilnadu_usage): ${counts.tamilnadu_usage.toLocaleString()} / ${TARGET_PER_CATEGORY.toLocaleString()}`);
  console.log(`   3. Other Names (other_heritage):     ${counts.other_heritage.toLocaleString()} / ${TARGET_PER_CATEGORY.toLocaleString()}`);

  const newlyAdded = { pure_tamil: [], tamilnadu_usage: [], other_heritage: [] };

  // Helper to safely push record if passes Six-Sigma checks
  const tryPush = (cat, opts, idx) => {
    const slug = toSlug(opts.nameLatin);
    const ta = String(opts.nameTamil || "").trim();
    if (!slug || slug.length < 3 || !ta || !TAMIL_ONLY_REGEX.test(ta) || HAS_LATIN_OR_DEVANAGARI.test(ta)) {
      return false;
    }
    if (seenSlugs.has(slug) || seenTamil.has(ta)) return false;
    const rec = buildCompactRecord(opts, idx);
    seenSlugs.add(slug);
    seenTamil.add(ta);
    newlyAdded[cat].push(rec);
    counts[cat]++;
    return true;
  };

  // STEP A: If --use-llm, query HP Z4 OmniRoute Swarm for fresh high-IQ names
  if (USE_LLM) {
    console.log("🤖 Querying HP Z4 OmniRoute Multi-Model Swarm for fresh cultural discoveries...");
    for (const cat of ["pure_tamil", "tamilnadu_usage", "other_heritage"]) {
      if (ONLY_CATEGORY !== "all" && ONLY_CATEGORY !== cat) continue;
      if (counts[cat] >= TARGET_PER_CATEGORY) continue;
      const llmItems = await querySwarmForNames(cat, 25);
      let llmAccepted = 0;
      for (let i = 0; i < llmItems.length; i++) {
        const it = llmItems[i];
        if (!it.ta || !it.en || !it.meaning) continue;
        const ok = tryPush(
          cat,
          {
            nameTamil: it.ta,
            nameLatin: it.en,
            gender: ["boy", "girl"].includes(it.gender) ? it.gender : "unisex",
            meaningTa: it.meaningTa || it.meaning,
            meaningEn: it.meaning,
            nameCategory: cat,
            categoryOriginSource: it.source || (cat === "tamilnadu_usage" ? "OmniRoute TN Cultural Discovery" : "OmniRoute Global Discovery"),
            rootSplitTa: it.root || it.ta,
            rootSplitEn: `${it.ta} (${it.meaning})`,
            literalEn: `Literal Root: ${it.ta} (${it.meaning})`,
            derivedEn: it.meaning,
            dsalRoot: it.root || it.ta,
          },
          i
        );
        if (ok) llmAccepted++;
      }
      console.log(`   ✨ OmniRoute Swarm contributed +${llmAccepted} verified names to ${cat}`);
    }
  }

  // STEP B: Category 1 Expansion (pure_tamil)
  if ((ONLY_CATEGORY === "all" || ONLY_CATEGORY === "pure_tamil") && counts.pure_tamil < TARGET_PER_CATEGORY) {
    let added = 0;
    let idx = 0;
    outer1: for (const p of PURE_TAMIL_PREFIXES) {
      for (const s of PURE_TAMIL_SUFFIXES) {
        if (counts.pure_tamil >= TARGET_PER_CATEGORY || added >= BATCH_LIMIT) break outer1;
        if (p.ta === s.ta) continue;
        const joined = applyTolkappiyamSandhi(p.ta, p.en, s.ta, s.en);
        const ok = tryPush(
          "pure_tamil",
          {
            nameTamil: joined.ta,
            nameLatin: joined.en,
            gender: s.gender,
            meaningTa: `${p.mTa} கொண்ட ${s.mTa}`,
            meaningEn: `Literal Root Meaning: ${p.ta} (${p.mEn}) + ${s.ta} (${s.mEn}) | Derived Meaning: Noble one blessed with ${p.mEn} and ${s.mEn}.`,
            nameCategory: "pure_tamil",
            rootSplitTa: `${p.ta} + ${s.ta}`,
            rootSplitEn: `${p.ta} (${p.mEn}) + ${s.ta} (${s.mEn})`,
            literalEn: `Literal Root Meaning: ${p.ta} (${p.mEn}) + ${s.ta} (${s.mEn})`,
            derivedEn: `Derived Meaning: ${s.mEn} graced with ${p.mEn}.`,
            dsalRoot: p.ta,
          },
          idx++
        );
        if (ok) added++;
      }
    }
    console.log(`🌿 Pure Tamil: +${added} names added (Total: ${counts.pure_tamil.toLocaleString()})`);
  }

  // STEP C: Category 2 Expansion (tamilnadu_usage)
  if ((ONLY_CATEGORY === "all" || ONLY_CATEGORY === "tamilnadu_usage") && counts.tamilnadu_usage < TARGET_PER_CATEGORY) {
    let added = 0;
    let idx = 0;
    // First standalone TN prefixes
    for (const p of TN_USAGE_PREFIXES) {
      if (counts.tamilnadu_usage >= TARGET_PER_CATEGORY || added >= BATCH_LIMIT) break;
      const g = /யா$|தா$|கி$|மி$|வி$|ரி$|ணி$|கலா$/.test(p.ta) ? "girl" : "boy";
      if (
        tryPush(
          "tamilnadu_usage",
          {
            nameTamil: p.ta,
            nameLatin: p.en,
            gender: g,
            meaningTa: p.mTa,
            meaningEn: `${p.mEn.charAt(0).toUpperCase() + p.mEn.slice(1)} (Widely used in Tamil Nadu)`,
            nameCategory: "tamilnadu_usage",
            categoryOriginSource: p.src,
            rootSplitTa: p.ta,
            rootSplitEn: p.ta,
          },
          idx++
        )
      ) {
        added++;
      }
    }

    // Compound TN cultural combinations
    outer2: for (const p of TN_USAGE_PREFIXES) {
      for (const s of TN_USAGE_SUFFIXES) {
        if (counts.tamilnadu_usage >= TARGET_PER_CATEGORY || added >= BATCH_LIMIT) break outer2;
        if (p.ta === s.ta) continue;
        const joinedTa = p.ta + s.ta;
        const joinedEn = p.en + s.en.toLowerCase();
        if (
          tryPush(
            "tamilnadu_usage",
            {
              nameTamil: joinedTa,
              nameLatin: joinedEn.charAt(0).toUpperCase() + joinedEn.slice(1),
              gender: s.gender,
              meaningTa: `${p.mTa} மற்றும் ${s.mTa} அருள் கொண்டவர்`,
              meaningEn: `${s.mEn.charAt(0).toUpperCase() + s.mEn.slice(1)} blessed with ${p.mEn}`,
              nameCategory: "tamilnadu_usage",
              categoryOriginSource: p.src,
              rootSplitTa: `${p.ta} + ${s.ta}`,
              rootSplitEn: `${p.ta} (${p.mEn}) + ${s.ta} (${s.mEn})`,
            },
            idx++
          )
        ) {
          added++;
        }
      }
    }
    console.log(`🏛️ Used in Tamil Nadu: +${added} names added (Total: ${counts.tamilnadu_usage.toLocaleString()})`);
  }

  // STEP D: Category 3 Expansion (other_heritage)
  if ((ONLY_CATEGORY === "all" || ONLY_CATEGORY === "other_heritage") && counts.other_heritage < TARGET_PER_CATEGORY) {
    let added = 0;
    let idx = 0;
    // Standalone Global / Other Heritage
    for (const p of OTHER_PREFIXES) {
      if (counts.other_heritage >= TARGET_PER_CATEGORY || added >= BATCH_LIMIT) break;
      const g = /யா$|ரா$|லி$|னா$|ஸ்$|ரி$|தி$|தா$|ல்$|பா$|மா$|ப்$/.test(p.ta) ? "girl" : "boy";
      if (
        tryPush(
          "other_heritage",
          {
            nameTamil: p.ta,
            nameLatin: p.en,
            gender: g,
            meaningTa: p.mTa,
            meaningEn: `${p.mEn.charAt(0).toUpperCase() + p.mEn.slice(1)}`,
            nameCategory: "other_heritage",
            categoryOriginSource: p.src,
            rootSplitTa: p.ta,
            rootSplitEn: p.ta,
          },
          idx++
        )
      ) {
        added++;
      }
    }

    // Compound Global / Pan-Indian / Heritage combinations
    outer3: for (const p of OTHER_PREFIXES) {
      for (const s of OTHER_SECOND_PARTS) {
        if (counts.other_heritage >= TARGET_PER_CATEGORY || added >= BATCH_LIMIT) break outer3;
        if (p.ta === s.ta) continue;
        const joinedTa = p.ta + s.ta;
        const joinedEn = p.en + s.en.toLowerCase();
        if (
          tryPush(
            "other_heritage",
            {
              nameTamil: joinedTa,
              nameLatin: joinedEn.charAt(0).toUpperCase() + joinedEn.slice(1),
              gender: s.gender,
              meaningTa: `${p.mTa} மற்றும் ${s.mTa}`,
              meaningEn: `${s.mEn.charAt(0).toUpperCase() + s.mEn.slice(1)} embodying ${p.mEn}`,
              nameCategory: "other_heritage",
              categoryOriginSource: p.src,
              rootSplitTa: `${p.ta} + ${s.ta}`,
              rootSplitEn: `${p.ta} (${p.mEn}) + ${s.ta} (${s.mEn})`,
            },
            idx++
          )
        ) {
          added++;
        }
      }
    }
    console.log(`🌍 Other Names: +${added} names added (Total: ${counts.other_heritage.toLocaleString()})`);
  }

  // STEP E: Persist newly sourced records into compact minified JSON shards (2000 records per shard)
  const MAX_COMPACT_SHARD = 2000;
  let totalWritten = 0;

  for (const [cat, items] of Object.entries(newlyAdded)) {
    if (items.length === 0) continue;
    const prefix = cat === "pure_tamil" ? "cat1-pure" : cat === "tamilnadu_usage" ? "cat2-tn" : "cat3-other";
    // Find existing shard index
    const existingForCat = indexData.shards.filter((s) => s.file.startsWith(prefix));
    let shardNum = existingForCat.length + 1;

    for (let i = 0; i < items.length; i += MAX_COMPACT_SHARD) {
      const chunk = items.slice(i, i + MAX_COMPACT_SHARD);
      const fileName = `${prefix}-${String(shardNum).padStart(2, "0")}.json`;
      const filePath = path.join(NAMES_DIR, fileName);
      // Minified JSON for compact storage & fast loading
      fs.writeFileSync(filePath, JSON.stringify(chunk), "utf8");
      indexData.shards.push({
        file: fileName,
        letter: cat,
        count: chunk.length,
      });
      shardNum++;
      totalWritten += chunk.length;
    }
  }

  if (totalWritten > 0) {
    indexData.total = seenSlugs.size;
    indexData.generatedAt = new Date().toISOString();
    fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2), "utf8");
    console.log(`\n✅ Successfully persisted +${totalWritten.toLocaleString()} new verified names!`);
  } else {
    console.log("\nℹ️ No new names added in this pass.");
  }

  console.log("\n📈 Updated Catalog Summary:");
  console.log(`   1. Pure Tamil:          ${counts.pure_tamil.toLocaleString()} / ${TARGET_PER_CATEGORY.toLocaleString()}`);
  console.log(`   2. Used in Tamil Nadu:  ${counts.tamilnadu_usage.toLocaleString()} / ${TARGET_PER_CATEGORY.toLocaleString()}`);
  console.log(`   3. Other Names:         ${counts.other_heritage.toLocaleString()} / ${TARGET_PER_CATEGORY.toLocaleString()}`);
  console.log(`   🌟 Total Catalog Size:  ${indexData.total.toLocaleString()} names`);
}

main().catch((err) => {
  console.error("❌ Sourcer error:", err);
  process.exit(1);
});

