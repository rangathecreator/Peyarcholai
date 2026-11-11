/**
 * பெயர்ச்சோலை (Peyarcholai) — Corpus-Wide Gender Integrity Audit
 *
 * Scans all 22,612+ names across all shards in src/data/names/ to enforce
 * strict cultural gender rules per classical Tamil grammatical standards.
 */

import fs from "node:fs";
import path from "node:path";
import { readShards, writeShards } from "./lib/name-shards.mjs";

console.log("🔍 [Gender Audit] Starting corpus-wide gender integrity scan...");

const allNames = readShards();
console.log(`Auditing ${allNames.length.toLocaleString("en-IN")} records...`);

const MASCULINE_SUFFIXES = [
  "மாறன்", "வளவன்", "செழியன்", "நாதன்", "கோன்", "வேல்", "அரசு",
  "செல்வன்", "அறிஞன்", "பிரியன்", "கதிர்", "வாணன்", "தம்பி", "கண்ணன்", "நம்பி"
];

const FEMININE_SUFFIXES = [
  "அரசி", "செல்வி", "நிலா", "மலர்", "யாழினி", "வள்ளி", "தேவி",
  "வாணி", "நாச்சியார்", "கொடி", "நங்கை", "பூவை", "கிளி", "அம்மை", "கயல்"
];

let correctedCount = 0;

for (const record of allNames) {
  const name = record.nameTamil || "";

  // Check if masculine suffix accidentally labeled girl
  const isMasculineSuffix = MASCULINE_SUFFIXES.some(s => name.endsWith(s));
  if (isMasculineSuffix && record.gender === "girl") {
    console.log(`⚠️ Correcting masculine name '${name}' (${record.slug}): girl -> boy`);
    record.gender = "boy";
    record.genderSuitabilityNote = "Masculine traditional name ending in classical noble suffix.";
    correctedCount++;
  }

  // Check if feminine suffix accidentally labeled boy
  const isFeminineSuffix = FEMININE_SUFFIXES.some(s => name.endsWith(s));
  if (isFeminineSuffix && record.gender === "boy") {
    console.log(`⚠️ Correcting feminine name '${name}' (${record.slug}): boy -> girl`);
    record.gender = "girl";
    record.genderSuitabilityNote = "Feminine classical poetic name ending in traditional grace suffix.";
    correctedCount++;
  }
}

console.log(`✅ Gender audit complete. Corrections made: ${correctedCount}`);

if (correctedCount > 0) {
  console.log("Saving corrected shards...");
  writeShards(allNames);
  console.log("✅ Shards updated successfully!");
} else {
  console.log("🎉 Zero gender discrepancies found. Corpus is 100% culturally aligned!");
}
