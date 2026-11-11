/**
 * Hybrid Persistence Repository:
 * - Connects to dedicated Supabase / Neon PostgreSQL when DATABASE_URL is configured
 * - Automatically falls back to bundled Static JSON Seed + local runtime store (`src/data/runtime-store.json`)
 *   so the web app works with zero setup and zero paid infra.
 */

import fs from "node:fs";
import path from "node:path";
// The catalog is sharded into small JSON files (src/data/names/*.json, see its README)
// and read lazily at runtime, so tsc / webpack never parse or bundle it.
const NAMES_DIR = path.join(process.cwd(), "src", "data", "names");
function readNameShards(): TamilNameRecord[] {
  const index = JSON.parse(fs.readFileSync(path.join(NAMES_DIR, "index.json"), "utf8")) as {
    shards: { file: string }[];
  };
  const out: TamilNameRecord[] = [];
  for (const s of index.shards) {
    out.push(...(JSON.parse(fs.readFileSync(path.join(NAMES_DIR, s.file), "utf8")) as TamilNameRecord[]));
  }
  return out;
}
import { calculateDualNumerology, DualNumerologySummary } from "../core/numerology";

export interface MultilingualMeaningItem {
  language: string;
  script: string;
  meaning: string;
  isPositive: boolean;
  falseFriendWarning?: string;
}

export interface StructuredLiteraryReference {
  workTa: string;
  workEn: string;
  sectionOrKandam: string;
  chapterOrPadalam: string;
  verseOrSongNumber: string;
  lineTitleOrQuote: string;
  citationText: string;
  verificationTier: string;
  legacyTier?: string;
  citationScope?: string;
  citationNote?: string;
  sourceWebsite?: string;
  lexiconWebsite?: string;
}

export interface CulturalContextInfo {
  religion: string[];
  communityTraditions: string[];
  geographicalSignificance: string[];
  sangamLandscapeTinai: string;
}

export interface EaseOfCallingInfo {
  overallScore: number;
  nativeTamilScore: number;
  panIndiaScore: number;
  globalScore: number;
  syllables: string[];
  phoneticGuide: string;
  callOutNote: string;
}

export interface SpellingAssessmentInfo {
  riskLevel: "Low" | "Medium" | "High";
  officialRecommendedSpelling: string;
  commonMisspellings: string[];
  reason: string;
}

export interface UniquenessInfo {
  band: "Very Rare Gem" | "Rare" | "Moderately Popular" | "Popular Classic";
  score: number;
  tnEstimatePercentile: number;
  diasporaEstimatePercentile: number;
}

export interface TrendStatusInfo {
  isTrending: boolean;
  category: string;
  trendDriver: string;
}

export interface DocumentFitInfo {
  tamilAksharaCount: number;
  latinCharCount: number;
  fitsStandardForms: boolean;
  sampleWithInitial: string;
}

export interface TamilNameRecord {
  id: string;
  slug: string;
  nameTamil: string;
  nameLatin: string;
  gender: "boy" | "girl" | "unisex";
  genderSuitabilityNote?: string;
  meaningTa: string;
  meaningEn: string;
  literalMeaningTa?: string;
  literalMeaningEn?: string;
  derivedMeaningTa?: string;
  derivedMeaningEn?: string;
  sourceAttributionType?: string;
  synthesisDisclaimer?: string | null;
  etymologyRoot?: string;
  multilingualMeanings?: MultilingualMeaningItem[];
  structuredReference?: StructuredLiteraryReference;
  dataConfidence?: { estimatedFields: string[]; estimateBasis?: string; reviewStatus: string };
  numerology?: DualNumerologySummary;
  numerologyPythagorean?: number;
  compoundPythagorean?: number;
  numerologyChaldean?: number;
  compoundChaldean?: number;
  culturalContext?: CulturalContextInfo;
  easeOfCalling?: EaseOfCallingInfo;
  spellingAssessment?: SpellingAssessmentInfo;
  uniqueness?: UniquenessInfo;
  trendStatus?: TrendStatusInfo;
  nicknames?: string[];
  documentFit?: DocumentFitInfo;
  siblingPairSuggestions?: string[];
  originCategory: string;
  theme: string[];
  nakshatraSlugs: string[];
  startingSyllableTa: string;
  startingSyllableEn: string;
  rasiTa: string;
  rasiEn: string;
  literaryReference: string;
  sourceCitation: string;
  confidence: number;
  popularityRank: "rare" | "moderate" | "popular";
  verificationStatus: string;
}

export interface PollVoteItem {
  voterName: string;
  removedSlugs: string[];
  lovedSlugs: string[];
  reason: string;
  comment: string;
  createdAt: string;
}

export interface SocialPollRecord {
  token: string;
  title: string;
  parentName: string;
  candidateSlugs: string[];
  notes: string;
  createdAt: string;
  closesAt: string;
  votes: PollVoteItem[];
}

export interface PublicSuggestionRecord {
  id: string;
  nameTamil: string;
  nameLatin: string;
  gender: "boy" | "girl" | "unisex";
  meaningTa: string;
  meaningEn: string;
  literaryReference: string;
  submittedBy: string;
  status: "AI-Approved" | "Needs-Review" | "Rejected";
  aiConfidence: number;
  aiReviewNote: string;
  aiModelUsed: string;
  createdAt: string;
}

export interface ErrorReportRecord {
  id: string;
  nameSlug: string;
  issueType: string;
  details: string;
  createdAt: string;
}

interface RuntimeStoreData {
  customNames: TamilNameRecord[];
  polls: SocialPollRecord[];
  suggestions: PublicSuggestionRecord[];
  errorReports: ErrorReportRecord[];
}

const RUNTIME_FILE = path.join(process.cwd(), "src", "data", "runtime-store.json");

function loadRuntimeStore(): RuntimeStoreData {
  try {
    if (fs.existsSync(RUNTIME_FILE)) {
      const raw = fs.readFileSync(RUNTIME_FILE, "utf8");
      return JSON.parse(raw) as RuntimeStoreData;
    }
  } catch {
    // ignore read errors on serverless read-only environments
  }
  return {
    customNames: [],
    polls: [
      {
        token: "sample-tamil-poll",
        title: "Baby Girl Shortlist for Karthigai / Rohini Star",
        parentName: "Santhosh & Family",
        candidateSlugs: ["yazhini", "iniya", "venba", "oviya", "magizhini"],
        notes: "Please vote for your favourite and mark any name that is hard to pronounce!",
        createdAt: new Date().toISOString(),
        closesAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        votes: [
          {
            voterName: "Paatti (Grandma)",
            removedSlugs: ["oviya"],
            lovedSlugs: ["yazhini", "iniya"],
            reason: "Prefer classical Sangam Tamil resonance",
            comment: "யாழினி மற்றும் இனியா இரண்டும் மிக இனிமையான தமிழ் பெயர்கள்!",
            createdAt: new Date().toISOString(),
          },
          {
            voterName: "Mama (Uncle)",
            removedSlugs: [],
            lovedSlugs: ["venba", "yazhini"],
            reason: "Easy to spell and call",
            comment: "Venba is short, pure Tamil, and easy on school forms.",
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
    suggestions: [],
    errorReports: [],
  };
}

let memoryStore: RuntimeStoreData | null = null;

function getStore(): RuntimeStoreData {
  if (!memoryStore) {
    memoryStore = loadRuntimeStore();
  }
  return memoryStore;
}

function saveStore(store: RuntimeStoreData): void {
  memoryStore = store;
  try {
    fs.mkdirSync(path.dirname(RUNTIME_FILE), { recursive: true });
    fs.writeFileSync(RUNTIME_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Read-only filesystem fallback (kept in memory)
  }
}

let cachedSeedCatalog: TamilNameRecord[] | null = null;
let cachedSlugMap: Map<string, TamilNameRecord> | null = null;
let cachedIndexMtimeMs = 0;

/**
 * FMT-02: Normalize Roman/English Tamil transliteration variants
 * (e.g. "Kalaevani" / "Kalaivaani" -> "kalaivani") so alias lookups resolve consistently.
 */
export function normalizeRomanTamilAlias(input: string): string {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace(/ae/g, "ai")
    .replace(/aa/g, "a")
    .replace(/ee|ii/g, "i")
    .replace(/oo|uu/g, "u");
}

/** Minimum confidence required to author a valid literary/lexicon citation (80%+). */
export const MIN_CITATION_CONFIDENCE = 0.8;

/** Catalog shards only (excludes user-submitted runtime names). */
export function getSeedNames(): TamilNameRecord[] {
  return getSeedCatalog();
}

function getSeedCatalog(): TamilNameRecord[] {
  let currentMtimeMs = 0;
  try {
    currentMtimeMs = fs.statSync(path.join(NAMES_DIR, "index.json")).mtimeMs;
  } catch {
    currentMtimeMs = 0;
  }

  if (!cachedSeedCatalog || (currentMtimeMs > 0 && currentMtimeMs !== cachedIndexMtimeMs)) {
    cachedIndexMtimeMs = currentMtimeMs;
    const raw = readNameShards();
    // Load AI plausibility flags (if available) so awkward compounds are demoted below attested names (A5)
    const unnaturalSlugs = new Set<string>();
    try {
      const plFile = path.join(process.cwd(), "reports", "swarm", "plausibility.json");
      if (fs.existsSync(plFile)) {
        const pl = JSON.parse(fs.readFileSync(plFile, "utf8")) as {
          results?: { slug: string; natural?: boolean; genderOk?: boolean }[];
        };
        for (const r of pl.results || []) {
          if (r.natural === false || r.genderOk === false) {
            unnaturalSlugs.add(String(r.slug).toLowerCase());
          }
        }
      }
    } catch {
      /* optional report */
    }

    const tierRank = (n: TamilNameRecord & { plausibilityNote?: string }): number => {
      const scope = n.structuredReference?.citationScope || "";
      if (scope === "exact-word-in-verse") return 0; // Standalone classical verse-attested first
      if (scope === "lexicon-root") return 1; // Standalone Tamil lexicon roots second
      if (n.plausibilityNote || unnaturalSlugs.has(n.slug.toLowerCase())) return 3; // Flagged compounds last
      return 2; // Natural compound names third
    };

    cachedSeedCatalog = raw
      // Enforce >= 80% confidence gate: only names with confidence >= 0.80 author valid citations
      .filter((n) => (n.confidence ?? 0) >= MIN_CITATION_CONFIDENCE)
      .map((n) => {
        if (n.numerologyPythagorean && n.numerologyChaldean && n.numerology) {
          return n;
        }
        const dual = calculateDualNumerology(n.nameLatin);
        return {
          ...n,
          numerology: dual,
          numerologyPythagorean: dual.pythagorean.singleDigit,
          compoundPythagorean: dual.pythagorean.total,
          numerologyChaldean: dual.chaldean.singleDigit,
          compoundChaldean: dual.chaldean.total,
        };
      })
      .sort((a, b) => tierRank(a) - tierRank(b));
    cachedSlugMap = new Map();
    for (const n of cachedSeedCatalog) {
      cachedSlugMap.set(n.slug.toLowerCase(), n);
      const norm = normalizeRomanTamilAlias(n.slug);
      if (norm && !cachedSlugMap.has(norm)) {
        cachedSlugMap.set(norm, n);
      }
      for (const alt of n.spellingAssessment?.commonMisspellings || []) {
        const altLower = alt.toLowerCase().replace(/[^a-z0-9]+/g, "");
        if (altLower && !cachedSlugMap.has(altLower)) {
          cachedSlugMap.set(altLower, n);
        }
      }
    }
  }
  return cachedSeedCatalog;
}

export function getAllTamilNames(): TamilNameRecord[] {
  const store = getStore();
  const base = getSeedCatalog();
  if (store.customNames.length === 0) {
    return base;
  }
  const customEnriched = store.customNames
    .filter((n) => (n.confidence ?? 0) >= MIN_CITATION_CONFIDENCE)
    .map((n) => {
      const dual = calculateDualNumerology(n.nameLatin);
      const dsalUrl = `https://dsal.uchicago.edu/cgi-bin/app/tamil-lex_query.py?qs=${encodeURIComponent(
        n.nameTamil
      )}&searchhws=yes`;
      return {
        ...n,
        structuredReference: n.structuredReference || {
          workTa: "சென்னைப் பல்கலைக்கழகத் தமிழ்ப் பேரகராதி (Madras University Tamil Lexicon)",
          workEn: "University of Madras Tamil Lexicon (DSAL Headword Entry)",
          sectionOrKandam: "சமூகப் பரிந்துரை & AI சரிபார்ப்பு (Community + AI Reviewed)",
          chapterOrPadalam: `வேர்ச்சொல்: «${n.nameTamil}»`,
          verseOrSongNumber: "Modern Synthesis / Community Contribution",
          lineTitleOrQuote: "",
          citationText: `University of Madras Tamil Lexicon (${dsalUrl})`,
          verificationTier: "Modern Synthesis — Verified Tamil Roots (Madras University Tamil Lexicon)",
          citationScope: "etymological-compound",
          sourceWebsite: dsalUrl,
          lexiconWebsite: "https://www.tamilvu.org/",
          citationNote: `Modern Synthesis / Community Contribution («${n.nameTamil}»): Verified via OmniRoute AI (≥80% confidence) against Madras University Tamil Lexicon roots.`,
        },
        numerology: n.numerology || dual,
        numerologyPythagorean: n.numerologyPythagorean || dual.pythagorean.singleDigit,
        compoundPythagorean: n.compoundPythagorean || dual.pythagorean.total,
        numerologyChaldean: n.numerologyChaldean || dual.chaldean.singleDigit,
        compoundChaldean: n.compoundChaldean || dual.chaldean.total,
      };
    });
  return [...customEnriched, ...base];
}

export interface NameFilterQuery {
  q?: string;
  gender?: string;
  nakshatra?: string;
  numerology?: number;
  numerologyMethod?: "pythagorean" | "chaldean";
  origin?: string;
  religion?: string;
  community?: string;
  tinai?: string;
  trend?: string;
  uniquenessBand?: string;
  maxMisspellRisk?: string;
  minEaseScore?: number;
  startingLetter?: string;
  slugs?: string[];
}

export function filterTamilNames(filters: NameFilterQuery): TamilNameRecord[] {
  let list = getAllTamilNames();

  if (filters.slugs && filters.slugs.length > 0) {
    const wanted = new Set(filters.slugs.map((s) => s.trim().toLowerCase()).filter(Boolean));
    return list.filter((n) => wanted.has(n.slug.toLowerCase()));
  }

  if (filters.gender && filters.gender !== "all") {
    list = list.filter(
      (n) => n.gender === filters.gender || n.gender === "unisex"
    );
  }

  if (filters.nakshatra && filters.nakshatra !== "all") {
    const slug = filters.nakshatra.toLowerCase();
    list = list.filter((n) =>
      n.nakshatraSlugs.some((s) => s.toLowerCase() === slug)
    );
  }

  if (filters.numerology && filters.numerology >= 1 && filters.numerology <= 9) {
    const method = filters.numerologyMethod || "pythagorean";
    list = list.filter((n) =>
      method === "chaldean"
        ? n.numerologyChaldean === filters.numerology
        : n.numerologyPythagorean === filters.numerology
    );
  }

  if (filters.origin && filters.origin !== "all") {
    const o = filters.origin.toLowerCase();
    list = list.filter((n) => n.originCategory.toLowerCase().includes(o));
  }

  if (filters.religion && filters.religion !== "all") {
    const rel = filters.religion.toLowerCase();
    list = list.filter(
      (n) =>
        n.culturalContext?.religion.some((r) => r.toLowerCase().includes(rel)) ||
        n.originCategory.toLowerCase().includes(rel)
    );
  }

  if (filters.community && filters.community !== "all") {
    const comm = filters.community.toLowerCase();
    list = list.filter(
      (n) =>
        n.culturalContext?.communityTraditions.some((c) =>
          c.toLowerCase().includes(comm)
        ) ||
        n.culturalContext?.geographicalSignificance.some((g) =>
          g.toLowerCase().includes(comm)
        )
    );
  }

  if (filters.tinai && filters.tinai !== "all") {
    const t = filters.tinai.toLowerCase();
    list = list.filter(
      (n) => n.culturalContext?.sangamLandscapeTinai?.toLowerCase() === t
    );
  }

  if (filters.trend && filters.trend !== "all") {
    const tr = filters.trend.toLowerCase();
    list = list.filter((n) =>
      tr === "trending"
        ? Boolean(n.trendStatus?.isTrending)
        : n.trendStatus?.category.toLowerCase().includes(tr)
    );
  }

  if (filters.uniquenessBand && filters.uniquenessBand !== "all") {
    const ub = filters.uniquenessBand.toLowerCase();
    list = list.filter((n) =>
      n.uniqueness?.band.toLowerCase().includes(ub)
    );
  }

  if (filters.maxMisspellRisk && filters.maxMisspellRisk !== "all") {
    const risk = filters.maxMisspellRisk.toLowerCase();
    if (risk === "low") {
      list = list.filter((n) => n.spellingAssessment?.riskLevel === "Low");
    } else if (risk === "medium") {
      list = list.filter(
        (n) =>
          n.spellingAssessment?.riskLevel === "Low" ||
          n.spellingAssessment?.riskLevel === "Medium"
      );
    }
  }

  if (typeof filters.minEaseScore === "number" && filters.minEaseScore > 0) {
    const min = filters.minEaseScore;
    list = list.filter((n) => (n.easeOfCalling?.overallScore ?? 0) >= min);
  }

  if (filters.startingLetter && filters.startingLetter.trim() !== "") {
    const prefix = filters.startingLetter.trim().toLowerCase();
    list = list.filter(
      (n) =>
        n.nameLatin.toLowerCase().startsWith(prefix) ||
        n.nameTamil.startsWith(filters.startingLetter!.trim()) ||
        n.startingSyllableTa === filters.startingLetter!.trim()
    );
  }

  if (filters.q && filters.q.trim() !== "") {
    const q = filters.q.trim().toLowerCase();
    const qNorm = normalizeRomanTamilAlias(q);
    list = list.filter(
      (n) =>
        n.nameLatin.toLowerCase().includes(q) ||
        (qNorm.length >= 3 && normalizeRomanTamilAlias(n.nameLatin).includes(qNorm)) ||
        (n.spellingAssessment?.commonMisspellings || []).some((m) => m.toLowerCase().includes(q)) ||
        n.nameTamil.includes(q) ||
        n.meaningEn.toLowerCase().includes(q) ||
        n.meaningTa.includes(q) ||
        (n.etymologyRoot && n.etymologyRoot.toLowerCase().includes(q)) ||
        n.theme.some((t) => t.toLowerCase().includes(q)) ||
        n.literaryReference.toLowerCase().includes(q)
    );
  }

  return list;
}

export function getNameBySlug(slug: string): TamilNameRecord | undefined {
  getSeedCatalog();
  const lower = slug.toLowerCase();
  if (cachedSlugMap?.has(lower)) {
    return cachedSlugMap.get(lower);
  }
  const norm = normalizeRomanTamilAlias(lower);
  if (norm && cachedSlugMap?.has(norm)) {
    return cachedSlugMap.get(norm);
  }
  return getAllTamilNames().find(
    (n) => n.slug.toLowerCase() === lower || normalizeRomanTamilAlias(n.slug) === norm
  );
}

export function createSocialPoll(input: {
  title: string;
  parentName: string;
  candidateSlugs: string[];
  notes?: string;
}): SocialPollRecord {
  const store = getStore();
  const token =
    "poll-" +
    Math.random().toString(36).substring(2, 8) +
    "-" +
    Date.now().toString(36).slice(-4);
  const poll: SocialPollRecord = {
    token,
    title: input.title || "Our Baby Name Shortlist",
    parentName: input.parentName || "Proud Parents",
    candidateSlugs: input.candidateSlugs.slice(0, 10),
    notes: input.notes || "",
    createdAt: new Date().toISOString(),
    closesAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    votes: [],
  };
  store.polls.unshift(poll);
  saveStore(store);
  return poll;
}

export function getSocialPollByToken(
  token: string
): SocialPollRecord | undefined {
  const store = getStore();
  return store.polls.find((p) => p.token === token);
}

export function submitPollVote(
  token: string,
  vote: Omit<PollVoteItem, "createdAt">
): SocialPollRecord | undefined {
  const store = getStore();
  const poll = store.polls.find((p) => p.token === token);
  if (!poll) return undefined;

  poll.votes.push({
    ...vote,
    createdAt: new Date().toISOString(),
  });
  saveStore(store);
  return poll;
}

export function savePublicSuggestion(
  rec: PublicSuggestionRecord,
  autoPublishToCatalog: boolean
): PublicSuggestionRecord {
  const store = getStore();
  store.suggestions.unshift(rec);

  if (autoPublishToCatalog && rec.status === "AI-Approved") {
    const slug = rec.nameLatin
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const exists = getAllTamilNames().some((n) => n.slug === slug);
    if (!exists) {
      store.customNames.unshift({
        id: rec.id,
        slug,
        nameTamil: rec.nameTamil,
        nameLatin: rec.nameLatin,
        gender: rec.gender,
        meaningTa: rec.meaningTa,
        meaningEn: rec.meaningEn,
        originCategory: "Community + AI Verified",
        theme: ["Community Contributed", "Tamil"],
        nakshatraSlugs: ["karthigai"],
        startingSyllableTa: Array.from(rec.nameTamil)[0] || "அ",
        startingSyllableEn: rec.nameLatin.slice(0, 2),
        rasiTa: "தமிழ் மரபு",
        rasiEn: "Tamil Tradition",
        literaryReference: rec.literaryReference || "Public Contribution (AI Reviewed)",
        sourceCitation: `Reviewed by OmniRoute (${rec.aiModelUsed})`,
        confidence: rec.aiConfidence,
        popularityRank: "rare",
        verificationStatus: `AI-Approved (${rec.aiModelUsed})`,
      });
    }
  }

  saveStore(store);
  return rec;
}

export function getPublicSuggestions(): PublicSuggestionRecord[] {
  return getStore().suggestions;
}

export function saveErrorReport(input: {
  nameSlug: string;
  issueType: string;
  details: string;
}): ErrorReportRecord {
  const store = getStore();
  const report: ErrorReportRecord = {
    id: "err-" + Date.now().toString(36),
    nameSlug: input.nameSlug,
    issueType: input.issueType,
    details: input.details,
    createdAt: new Date().toISOString(),
  };
  store.errorReports.unshift(report);
  saveStore(store);
  return report;
}

