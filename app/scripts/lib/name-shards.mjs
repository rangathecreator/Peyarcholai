/**
 * Sharded storage for the Tamil name catalog.
 *
 * Layout (src/data/names/):
 *   index.json          manifest: totals + one entry per shard
 *   <letter>-NN.json    array of name records whose Tamil name starts with <letter>,
 *                       at most MAX_PER_SHARD records per file, sorted by slug
 *
 * Shared by build-10k-tamil-names.mjs, split-seed.mjs and merge-seed.mjs.
 * The runtime reader lives in src/lib/repository.ts (keep the two in sync).
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

export const MAX_PER_SHARD = 400;
export const NAMES_DIR = fs.existsSync(path.join(process.cwd(), "app", "src", "data", "names"))
  ? path.join(process.cwd(), "app", "src", "data", "names")
  : path.join(process.cwd(), "src", "data", "names");

// Latin keys for file names (Tamil file names are avoided for tooling safety).
const LETTER_KEYS = {
  அ: "a", ஆ: "aa", இ: "i", ஈ: "ii", உ: "u", ஊ: "uu", எ: "e", ஏ: "ee", ஐ: "ai",
  ஒ: "o", ஓ: "oo", ஔ: "au",
  க: "ka", ங: "nga", ச: "sa", ஞ: "nya", ட: "ta-retroflex", ண: "na-retroflex",
  த: "tha", ந: "na", ப: "pa", ம: "ma", ய: "ya", ர: "ra", ல: "la", வ: "va",
  ழ: "zha", ள: "la-retroflex", ற: "ra-hard", ன: "na-alveolar",
  ஜ: "ja", ஷ: "sha", ஸ: "sa-grantha", ஹ: "ha",
};

export function letterOf(record) {
  return [...String(record.nameTamil || "")][0] || "?";
}

export function letterKey(letter) {
  return (
    LETTER_KEYS[letter] ||
    `u${letter.codePointAt(0).toString(16).padStart(4, "0")}`
  );
}

/** Write records into shards + index.json atomically. Removes stale shard files only after index.json is written. */
export function writeShards(records, dir = NAMES_DIR) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("writeShards: refusing to write empty records array");
  }
  fs.mkdirSync(dir, { recursive: true });

  const byLetter = new Map();
  for (const r of records) {
    const l = letterOf(r);
    if (!byLetter.has(l)) byLetter.set(l, []);
    byLetter.get(l).push(r);
  }

  const shards = [];
  const writtenFiles = new Set(["index.json"]);
  const letters = [...byLetter.keys()].sort((a, b) => a.localeCompare(b, "ta"));
  for (const letter of letters) {
    const list = byLetter
      .get(letter)
      .sort((a, b) => String(a.slug).localeCompare(String(b.slug)));
    for (let i = 0, n = 1; i < list.length; i += MAX_PER_SHARD, n++) {
      const chunk = list.slice(i, i + MAX_PER_SHARD);
      const file = `${letterKey(letter)}-${String(n).padStart(2, "0")}.json.gz`;
      const targetPath = path.join(dir, file);
      const tmpPath = `${targetPath}.tmp`;
      fs.writeFileSync(tmpPath, zlib.gzipSync(JSON.stringify(chunk)));
      fs.renameSync(tmpPath, targetPath);
      writtenFiles.add(file);
      shards.push({ file, letter, count: chunk.length });
    }
  }

  const index = {
    version: 1,
    generatedAt: new Date().toISOString(),
    total: records.length,
    maxPerShard: MAX_PER_SHARD,
    shards,
  };
  const indexTarget = path.join(dir, "index.json");
  const indexTmp = `${indexTarget}.tmp`;
  fs.writeFileSync(indexTmp, JSON.stringify(index, null, 2) + "\n", "utf8");
  fs.renameSync(indexTmp, indexTarget);

  for (const f of fs.readdirSync(dir)) {
    if (!writtenFiles.has(f) && (/^[a-z0-9-]+-\d{2}\.json(\.gz)?$/.test(f) || f.endsWith(".tmp"))) {
      try {
        fs.unlinkSync(path.join(dir, f));
      } catch { }
    }
  }
  return index;
}

/** Read every shard listed in index.json. Returns [] if no shards exist yet. */
export function readShards(dir = NAMES_DIR) {
  const indexFile = path.join(dir, "index.json");
  if (!fs.existsSync(indexFile)) return [];
  const index = JSON.parse(fs.readFileSync(indexFile, "utf8"));
  const out = [];
  for (const s of index.shards) {
    const filePath = path.join(dir, s.file);
    const raw = s.file.endsWith(".gz")
      ? zlib.gunzipSync(fs.readFileSync(filePath)).toString("utf8")
      : fs.readFileSync(filePath, "utf8");
    out.push(...JSON.parse(raw));
  }
  return out;
}

