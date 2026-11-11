/**
 * Seed generation agent (OmniRoute, FREE models): proposes MORE real Tamil names, de-duplicates
 * them against the catalog, then has a second "verifier" pass reject doubtful ones.
 *
 *   node scripts/generate-name-candidates.mjs [--passes 2] [--concurrency 3]
 *   node scripts/build-10k-tamil-names.mjs --candidates reports/candidates/accepted.json   (ingest)
 *
 * Output: reports/candidates/{raw,accepted,rejected}.json   (AI suggestions – need human review)
 */
import fs from "node:fs";
import path from "node:path";
import { readShards } from "./lib/name-shards.mjs";

try { process.loadEnvFile(".env.local"); } catch { /* optional */ }
const BASE = process.env.OMNIROUTE_BASE_URL || "http://127.0.0.1:20128/v1";
const KEY = process.env.OMNIROUTE_API_KEY || "";
if (!KEY) { console.error("Set OMNIROUTE_API_KEY in .env.local"); process.exit(1); }
const MODELS = ["auto/best-free"]; // free only (auto/coding:free upstream returns 502)
const OUT = path.join(process.cwd(), "reports", "candidates");
fs.mkdirSync(OUT, { recursive: true });

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? Number(args[i + 1]) : d; };
const PASSES = flag("passes", 2);
const CONC = flag("concurrency", 3);

const LETTERS = ["அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ","ஓ","க","ச","ஞ","த","ந","ப","ம","ய","வ","ழ","ர","ல","ஜ"];
const GENDERS = ["boy", "girl", "unisex"];
const tamilOnly = /^[\u0B80-\u0BFF]+$/;
const slugOf = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "");

async function chat(system, user) {
  let last = "";
  for (const model of MODELS) {
    for (let a = 0; a < 3; a++) {
      try {
        const res = await fetch(`${BASE}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
          body: JSON.stringify({ model, temperature: 0.7, max_tokens: 6000, response_format: { type: "json_object" },
            messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
          signal: AbortSignal.timeout(180000),
        });
        if (!res.ok) { last = `${model} HTTP ${res.status}`; await new Promise((r) => setTimeout(r, 3000 * (a + 1))); continue; }
        const d = await res.json();
        const t = d?.choices?.[0]?.message?.content;
        if (t) { const m = t.match(/\{[\s\S]*\}/); return JSON.parse(m ? m[0] : t); }
      } catch (e) { last = `${model} ${e.message}`; }
    }
  }
  throw new Error(last);
}

async function pool(items, fn, n) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; await fn(items[k], k); } }));
}

const catalog = readShards();
const seenSlug = new Set(catalog.map((r) => r.slug));
const seenTamil = new Set(catalog.map((r) => r.nameTamil));

// ---------- Stage 1: generate ----------
const jobs = [];
for (let p = 0; p < PASSES; p++) for (const l of LETTERS) for (const g of GENDERS) jobs.push({ p, l, g });
const rawFile = path.join(OUT, "raw.json");
const raw = fs.existsSync(rawFile) ? JSON.parse(fs.readFileSync(rawFile, "utf8")) : { done: {}, items: [] };
let n = 0;
await pool(jobs, async (j) => {
  const key = `${j.p}|${j.l}|${j.g}`;
  if (raw.done[key]) return;
  try {
    const r = await chat(
      "You are an expert in Tamil onomastics. Give only REAL Tamil given names that are genuinely used by people or attested in Tamil literature. Never invent compounds. JSON only.",
      `List 30 different authentic Tamil given names for ${j.g === "unisex" ? "boys or girls (unisex)" : j.g + "s"} whose Tamil spelling STARTS with the letter "${j.l}". ` +
      `Pass ${j.p + 1}: ${j.p === 0 ? "prefer well-known names" : "prefer less common but real names"}. ` +
      'Return {"names":[{"nameTamil":"Tamil script only","nameLatin":"common English spelling","meaningEn":"","meaningTa":"Tamil","root":"root word","religion":"Pure Tamil|Hindu|Christian|Muslim|Universal","origin":"Sangam|Literary|Traditional|Modern"}]}'
    );
    for (const x of r.names || []) raw.items.push({ ...x, gender: j.g, letter: j.l });
    raw.done[key] = true;
    fs.writeFileSync(rawFile, JSON.stringify(raw));
  } catch (e) { console.error(`[gen ${key}] ${e.message}`); }
  if (++n % 10 === 0) console.log(`[gen] ${n}/${jobs.length} jobs, ${raw.items.length} raw names`);
}, CONC);

// ---------- Stage 2: validate + dedupe ----------
const fresh = [];
for (const x of raw.items) {
  const tamil = String(x.nameTamil || "").trim();
  const latin = String(x.nameLatin || "").trim();
  const slug = slugOf(latin);
  if (!tamilOnly.test(tamil) || !/^[A-Za-z][A-Za-z '-]{1,24}$/.test(latin) || !x.meaningEn || !x.meaningTa) continue;
  if (!tamil.startsWith(x.letter) && x.gender) { /* keep: models sometimes use a vowel variant */ }
  if (!slug || seenSlug.has(slug) || seenTamil.has(tamil)) continue;
  seenSlug.add(slug); seenTamil.add(tamil);
  fresh.push({ ...x, nameTamil: tamil, nameLatin: latin.replace(/\s+/g, " "), slug });
}
console.log(`[validate] ${raw.items.length} raw -> ${fresh.length} new unique candidates`);

// ---------- Stage 3: verifier agent ----------
const accepted = [], rejected = [];
const batches = [];
for (let i = 0; i < fresh.length; i += 25) batches.push(fresh.slice(i, i + 25));
let vb = 0;
await pool(batches, async (batch) => {
  try {
    const r = await chat(
      "You are a strict native-Tamil reviewer. Reject anything that is not a real, respectable, commonly recognised Tamil given name, has the wrong gender or wrong meaning. JSON only.",
      'For each item return {"slug":"","realName":true|false,"genderOk":true|false,"meaningOk":true|false}. Wrap as {"results":[...]}.\n' +
      JSON.stringify(batch.map((b) => ({ slug: b.slug, tamil: b.nameTamil, latin: b.nameLatin, gender: b.gender, meaningEn: b.meaningEn })))
    );
    const verdict = new Map((r.results || []).map((v) => [v.slug, v]));
    for (const b of batch) {
      const v = verdict.get(b.slug);
      (v && v.realName && v.genderOk && v.meaningOk ? accepted : rejected).push(b);
    }
  } catch (e) { for (const b of batch) rejected.push({ ...b, reason: "verifier-failed" }); console.error(`[verify] ${e.message}`); }
  if (++vb % 5 === 0) console.log(`[verify] ${vb}/${batches.length} batches, accepted ${accepted.length}`);
}, CONC);

fs.writeFileSync(path.join(OUT, "accepted.json"), JSON.stringify(accepted, null, 2));
fs.writeFileSync(path.join(OUT, "rejected.json"), JSON.stringify(rejected, null, 2));
console.log(`✅ candidates: accepted ${accepted.length}, rejected ${rejected.length} (free models, $0)`);

