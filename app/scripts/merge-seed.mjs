/**
 * Merge shards back into a single JSON file (for export / external tools).
 * Usage (from app/):  node scripts/merge-seed.mjs [out.json]
 */
import fs from "node:fs";
import { readShards } from "./lib/name-shards.mjs";

const out = process.argv[2] || "tamil-names-merged.json";
const records = readShards();
fs.writeFileSync(out, JSON.stringify(records, null, 2), "utf8");
console.log(`✅ Merged ${records.length} records into ${out}`);

