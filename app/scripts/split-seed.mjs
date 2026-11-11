/**
 * One-off / repeatable: split the monolithic src/data/tamil-names-seed.json
 * into shards under src/data/names/ and verify nothing was lost.
 *
 * Usage (from app/):  node scripts/split-seed.mjs [path/to/seed.json]
 */
import fs from "node:fs";
import path from "node:path";
import { writeShards, readShards } from "./lib/name-shards.mjs";

const src =
  process.argv[2] ||
  path.join(process.cwd(), "src", "data", "tamil-names-seed.json");
const records = JSON.parse(fs.readFileSync(src, "utf8"));
const index = writeShards(records);

// Verification: same count, same slugs, identical record content.
const back = readShards();
const bySlug = new Map(back.map((r) => [r.slug, JSON.stringify(r)]));
let mismatches = 0;
for (const r of records) {
  if (bySlug.get(r.slug) !== JSON.stringify(r)) mismatches++;
}
if (back.length !== records.length || mismatches > 0) {
  console.error(
    `❌ Verification failed: ${back.length}/${records.length} records, ${mismatches} mismatches`
  );
  process.exit(1);
}
console.log(
  `✅ Split ${records.length} records into ${index.shards.length} shards (verified, 0 mismatches)`
);

