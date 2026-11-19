#!/usr/bin/env node
/**
 * T20-5: Empirical Wikipedia / Wikidata Name-Notability Pilot
 * Samples up to N unique names across pure_tamil, tamilnadu_usage, and other_heritage
 * shards, queries Wikipedia Search API (searchinfo.totalhits) with polite batching,
 * and writes coverage + median hits report to reports/wikidata-pilot.json.
 *
 * Usage:
 *   node scripts/wikidata-name-counts.mjs --dry-run
 *   node scripts/wikidata-name-counts.mjs --limit=60
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const NAMES_DIR = path.join(process.cwd(), "src", "data", "names");
const OUT_FILE = path.join(process.cwd(), "reports", "wikidata-pilot.json");
const DRY_RUN = process.argv.includes("--dry-run");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = Math.max(10, Math.min(200, Number(limitArg?.split("=")[1] || 200)));

function loadSampleNames(limit) {
  const index = JSON.parse(fs.readFileSync(path.join(NAMES_DIR, "index.json"), "utf8"));
  const perCategoryTarget = Math.ceil(limit / 3);
  const buckets = { pure_tamil: [], tamilnadu_usage: [], other_heritage: [] };
  const seen = new Set();

  for (const shard of index.shards || []) {
    if (
      buckets.pure_tamil.length >= perCategoryTarget &&
      buckets.tamilnadu_usage.length >= perCategoryTarget &&
      buckets.other_heritage.length >= perCategoryTarget
    ) {
      break;
    }
    const filePath = path.join(NAMES_DIR, shard.file);
    const raw = shard.file.endsWith(".gz")
      ? zlib.gunzipSync(fs.readFileSync(filePath)).toString("utf8")
      : fs.readFileSync(filePath, "utf8");
    const records = JSON.parse(raw);
    for (const r of records) {
      const cat = r.nameCategory || "pure_tamil";
      if (!buckets[cat] || buckets[cat].length >= perCategoryTarget) continue;
      const key = String(r.nameLatin || "").trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      buckets[cat].push({
        slug: r.slug,
        nameLatin: r.nameLatin,
        nameTamil: r.nameTamil,
        nameCategory: cat,
        popularityRank: r.popularityRank || "moderate",
      });
    }
  }

  return [
    ...buckets.pure_tamil,
    ...buckets.tamilnadu_usage,
    ...buckets.other_heritage,
  ].slice(0, limit);
}

function median(nums) {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

async function queryWikipediaHits(sample) {
  if (DRY_RUN) {
    return sample.map((s) => ({ ...s, totalhits: null, dryRun: true }));
  }
  const results = [];
  const batchSize = 5;
  for (let i = 0; i < sample.length; i += batchSize) {
    const batch = sample.slice(i, i + batchSize);
    const batchRes = await Promise.all(
      batch.map(async (item) => {
        try {
          const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            `"${item.nameLatin}"`
          )}&format=json&srlimit=1`;
          const res = await fetch(url, {
            signal: AbortSignal.timeout(10_000),
            headers: { "user-agent": "Peyarcholai-ResearchPilot/1.0 (https://peyar.donorconnect.in)" },
          });
          if (!res.ok) return { ...item, totalhits: 0, error: `HTTP ${res.status}` };
          const json = await res.json();
          const hits = Number(json?.query?.searchinfo?.totalhits || 0);
          return { ...item, totalhits: hits };
        } catch (err) {
          return { ...item, totalhits: 0, error: err instanceof Error ? err.message : String(err) };
        }
      })
    );
    results.push(...batchRes);
    if (i + batchSize < sample.length) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  return results;
}

async function main() {
  const sample = loadSampleNames(LIMIT);
  const results = await queryWikipediaHits(sample);

  const byCategory = {};
  for (const cat of ["pure_tamil", "tamilnadu_usage", "other_heritage"]) {
    const rows = results.filter((r) => r.nameCategory === cat);
    const hits = rows.map((r) => r.totalhits || 0);
    const nonZero = hits.filter((h) => h > 0).length;
    byCategory[cat] = {
      sampled: rows.length,
      coveragePercent: rows.length ? Number(((nonZero / rows.length) * 100).toFixed(1)) : 0,
      medianHits: median(hits),
    };
  }

  const totalNonZero = results.filter((r) => (r.totalhits || 0) > 0).length;
  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    sampleSize: results.length,
    overallCoveragePercent: results.length
      ? Number(((totalNonZero / results.length) * 100).toFixed(1))
      : 0,
    byCategory,
    sample: results.slice(0, 20),
  };

  if (!DRY_RUN) {
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(report, null, 2), "utf8");
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        sampleSize: report.sampleSize,
        overallCoveragePercent: report.overallCoveragePercent,
        byCategory: report.byCategory,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
