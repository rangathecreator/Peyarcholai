/**
 * A6 – Six Sigma audit refresh. Measures SS-03 (query speed), SS-06 (UI transparency data),
 * provenance honesty, and folds in the OmniRoute AI pre-screen results.
 * Usage (from app/):  node scripts/audit-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { readShards } from "./lib/name-shards.mjs";

const allShardRecords = readShards();
const records = allShardRecords.filter((r) => (r.confidence ?? 0) >= 0.8);
const quarantinedBelow80Count = allShardRecords.length - records.length;
const tamilOnly = /^[\u0B80-\u0BFF\s]+$/;
const defects = {
  nonTamilScript: 0,
  missingDimension: 0,
  directLabelOnCompound: 0,
  falseVerifiedClaim: 0,
  missingEstimatedFlag: 0,
  compoundClaimingSangam: 0,
  compoundWithAncientQuote: 0,
};
for (const r of records) {
  if (!tamilOnly.test(r.nameTamil)) defects.nonTamilScript++;
  if (
    !r.meaningTa ||
    !r.meaningEn ||
    !r.structuredReference ||
    !r.culturalContext ||
    !r.easeOfCalling ||
    !r.spellingAssessment ||
    !r.uniqueness ||
    !r.trendStatus ||
    !r.documentFit ||
    !r.nakshatraSlugs?.length
  )
    defects.missingDimension++;
  if (
    /^Direct (Classical|Textual)/i.test(r.structuredReference?.verificationTier || "") &&
    String(r.etymologyRoot || "").includes("+")
  )
    defects.directLabelOnCompound++;
  if (/Verified/i.test(r.verificationStatus) && !/Human/i.test(r.verificationStatus))
    defects.falseVerifiedClaim++;
  if (!r.dataConfidence?.estimatedFields?.length) defects.missingEstimatedFlag++;
  if (
    r.structuredReference?.citationScope === "etymological-compound" &&
    /Sangam|Classical/i.test(r.originCategory)
  )
    defects.compoundClaimingSangam++;
  if (
    r.structuredReference?.citationScope === "etymological-compound" &&
    Boolean(r.structuredReference?.lineTitleOrQuote)
  )
    defects.compoundWithAncientQuote++;
}
const totalDefects = Object.values(defects).reduce((a, b) => a + b, 0);
const opportunities = records.length * Object.keys(defects).length;

// SS-03: filter over the in-memory catalog, 200 runs
const t0 = performance.now();
for (let i = 0; i < 200; i++) {
  records.filter((r) => r.gender !== "boy" && /hindu/i.test(r.culturalContext.religion.join(",")) && r.nameLatin.toLowerCase().includes("a"));
}
const avgMs = (performance.now() - t0) / 200;

const swarmDir = path.join(process.cwd(), "reports", "swarm");
const read = (f) => (fs.existsSync(path.join(swarmDir, f)) ? JSON.parse(fs.readFileSync(path.join(swarmDir, f), "utf8")) : null);
const cit = read("citation-audit.json");
const pl = read("plausibility.json");
const tally = (arr, k) => arr.reduce((m, x) => ((m[x[k]] = (m[x[k]] || 0) + 1), m), {});

const report = {
  generatedAt: new Date().toISOString(),
  totalRecords: records.length,
  quarantinedBelow80Count,
  structuralAudit: { opportunities, defects, totalDefects, dpmo: Math.round((totalDefects / opportunities) * 1e6) },
  gates: {
    "SS-03_Query_Speed": { avgMsPerFilterPass: Number(avgMs.toFixed(2)), pass: avgMs < 15 },
    "SS-06_Parent_Transparency": {
      pass: defects.directLabelOnCompound === 0 && defects.falseVerifiedClaim === 0 && defects.missingEstimatedFlag === 0,
      note: "No false 'Direct'/'Verified' labels; estimated fields flagged on every record",
    },
  },
  contentQuality: {
    warning: "AI pre-screen (free OmniRoute models). Not ground truth. Human Tamil review required (A3).",
    citationAudit: cit && {
      sample: cit.summary.judged,
      citationSupport: tally(cit.results, "citationSupportsName"),
      meaningImplausible: cit.results.filter((x) => !x.meaningPlausible).length,
      genderWrong: cit.results.filter((x) => !x.genderOk).length,
    },
    plausibility: pl && {
      judged: pl.summary.judged,
      ofRecords: records.length,
      unnatural: pl.results.filter((x) => !x.natural).length,
      genderMismatch: pl.results.filter((x) => !x.genderOk).length,
    },
  },
  paidApiCostUsd: 0,
};
fs.writeFileSync(path.join(process.cwd(), "src", "data", "six-sigma-audit-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

