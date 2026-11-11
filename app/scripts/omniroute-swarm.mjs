/**
 * OmniRoute swarm: runs several "agents" in parallel through the local OmniRoute
 * gateway using FREE models only (no paid Gemini / Claude quota).
 *
 *   node scripts/omniroute-swarm.mjs [agent ...] [--limit N] [--concurrency N]
 *
 * Agents:
 *   citation-audit   A3  – AI pre-screen of 100 stratified records (meaning, gender, citation scope)
 *   plausibility     A5  – flags awkward / unnatural generated compound names
 *
 * Output: reports/swarm/<agent>.json  (+ progress is resumable: finished batches are cached)
 * NOTE: LLM verdicts are a pre-screen to prioritise human review, not ground truth.
 */
import fs from "node:fs";
import path from "node:path";
import { readShards } from "./lib/name-shards.mjs";

const BASE = process.env.OMNIROUTE_BASE_URL || "http://127.0.0.1:20128/v1";
try { process.loadEnvFile(".env.local"); } catch { /* optional */ }
const KEY = process.env.OMNIROUTE_API_KEY || "";
if (!KEY) { console.error("Set OMNIROUTE_API_KEY in .env.local"); process.exit(1); }
const MODELS = ["auto/best-free"]; // free only (auto/coding:free upstream returns 502)
const OUT_DIR = path.join(process.cwd(), "reports", "swarm");

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? Number(args[i + 1]) : d;
};
const LIMIT = flag("limit", Infinity);
const CONCURRENCY = flag("concurrency", 4);
const agentsWanted = args.filter(
  (a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--"))
);

async function chat(system, user) {
  let last = "";
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(`${BASE}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
          body: JSON.stringify({
            model,
            temperature: 0.1,
            max_tokens: 6000,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          }),
          signal: AbortSignal.timeout(120000),
        });
        if (!res.ok) {
          last = `${model} HTTP ${res.status}`;
          if (res.status === 429) await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return { text, model: data.model || model };
        last = `${model} empty`;
      } catch (e) {
        last = `${model} ${e.message}`;
      }
    }
  }
  throw new Error(last);
}

function parseJson(text) {
  const m = text.match(/\{[\s\S]*\}/);
  return JSON.parse(m ? m[0] : text);
}

async function pool(items, worker, concurrency) {
  let i = 0;
  const run = async () => {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
    }
  };
  await Promise.all(Array.from({ length: concurrency }, run));
}

function seededShuffle(arr, seed = 42) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const brief = (r) => ({
  slug: r.slug,
  tamil: r.nameTamil,
  latin: r.nameLatin,
  gender: r.gender,
  meaningEn: r.meaningEn,
  root: r.etymologyRoot,
});

const AGENTS = {
  "citation-audit": {
    pick: (all) => seededShuffle(all).slice(0, Math.min(100, LIMIT)),
    batchSize: 10,
    system:
      "You are a careful Tamil linguist and literature scholar. Audit baby-name records. " +
      "Be conservative: if you are not sure a citation is real, say 'doubtful'. Reply with JSON only.",
    user: (batch) =>
      "For each record judge: meaningPlausible (bool), genderOk (bool), " +
      "citationSupportsName ('yes' | 'root-only' | 'doubtful' | 'no'), note (<=20 words). " +
      'Return {"results":[{"slug":"","meaningPlausible":true,"genderOk":true,"citationSupportsName":"root-only","note":""}]}.\n' +
      JSON.stringify(
        batch.map((r) => ({
          ...brief(r),
          work: r.structuredReference?.workEn,
          verse: r.structuredReference?.verseOrSongNumber,
          quote: r.structuredReference?.lineTitleOrQuote,
          tier: r.structuredReference?.verificationTier,
        }))
      ),
  },
  plausibility: {
    pick: (all) => all.slice(0, Math.min(all.length, LIMIT)),
    batchSize: 30,
    system:
      "You are a native Tamil speaker and name expert. Decide whether generated Tamil baby names are natural, " +
      "grammatical and free of unintended or embarrassing meanings. Reply with JSON only.",
    user: (batch) =>
      "For each record return natural (bool), genderOk (bool), issue (<=12 words, empty if fine). " +
      'Return {"results":[{"slug":"","natural":true,"genderOk":true,"issue":""}]}.\n' +
      JSON.stringify(batch.map(brief)),
  },
};

async function runAgent(name, all) {
  const cfg = AGENTS[name];
  const items = cfg.pick(all);
  const batches = [];
  for (let i = 0; i < items.length; i += cfg.batchSize) batches.push(items.slice(i, i + cfg.batchSize));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const cacheFile = path.join(OUT_DIR, `${name}.cache.json`);
  const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")) : {};
  const t0 = Date.now();
  let done = 0, failed = 0;
  await pool(
    batches,
    async (batch, idx) => {
      const key = batch.map((r) => r.slug).join("|").slice(0, 200) + `#${batch.length}`;
      if (cache[key]) { done++; return; }
      try {
        const { text, model } = await chat(cfg.system, cfg.user(batch));
        const parsed = parseJson(text);
        cache[key] = { model, results: parsed.results || [] };
        fs.writeFileSync(cacheFile, JSON.stringify(cache));
      } catch (e) {
        failed++;
        console.error(`[${name}] batch ${idx} failed: ${e.message}`);
      }
      done++;
      if (done % 5 === 0 || done === batches.length)
        console.log(`[${name}] ${done}/${batches.length} batches (${failed} failed) ${Math.round((Date.now() - t0) / 1000)}s`);
    },
    CONCURRENCY
  );
  const results = Object.values(cache).flatMap((c) => c.results);
  const models = [...new Set(Object.values(cache).map((c) => c.model))];
  const summary = { agent: name, records: items.length, judged: results.length, failedBatches: failed, models, paidCostUsd: 0, generatedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify({ summary, results }, null, 2));
  console.log(`✅ [${name}] judged ${results.length}/${items.length} records via ${models.join(", ")}`);
}

const all = readShards();
const names = agentsWanted.length ? agentsWanted : Object.keys(AGENTS);
console.log(`🐝 Swarm: ${names.join(", ")} | ${all.length} records | concurrency ${CONCURRENCY}/agent | gateway ${BASE}`);
await Promise.all(names.map((n) => runAgent(n, all)));
