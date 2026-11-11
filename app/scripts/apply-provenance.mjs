/**
 * Apply the provenance layer (A2/A4) to the existing sharded catalog in place.
 * Usage (from app/):  node scripts/apply-provenance.mjs
 */
import { readShards, writeShards } from "./lib/name-shards.mjs";
import { applyProvenance } from "./lib/provenance.mjs";

const records = readShards().map(applyProvenance);
const index = writeShards(records);
const tiers = {};
records.forEach((r) => {
  const t = r.structuredReference?.verificationTier;
  tiers[t] = (tiers[t] || 0) + 1;
});
console.log(`✅ Provenance applied to ${records.length} records in ${index.shards.length} shards`, tiers);

