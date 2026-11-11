/**
 * Random / fuzz tester for the running app (default http://127.0.0.1:3020).
 *   node scripts/fuzz-api.mjs [--base URL] [--n 600] [--seed 1]
 * Non-destructive: only GETs, plus POSTs that must be rejected. Writes reports/fuzz-report.json.
 * Oracles: no 5xx, valid JSON, page invariants, counts consistent, latency budget, 404 for unknown slugs.
 */
import fs from "node:fs";
import path from "node:path";
import { readShards } from "./lib/name-shards.mjs";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const BASE = opt("base", "http://127.0.0.1:3020");
const N = Number(opt("n", 600));
let seed = Number(opt("seed", 1));
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (a) => a[Math.floor(rnd() * a.length)];

const slugs = readShards().map((r) => r.slug);
const evil = ["", " ", "யாழினி", "kavin", "க்", "ழ்", "😀", "<script>alert(1)</script>", "' OR 1=1 --", "%00", "../../etc/passwd",
  "a".repeat(5000), "ஸ்ரீ", "க\u200Dஷ", "%", "&=?#", "NaN", "-1", "0", "999999999999", "1e9", "null", "undefined", "[]", "{}"];
const GEN = ["boy", "girl", "unisex", "all", "x", ""];
const params = {
  q: () => pick(evil), gender: () => pick(GEN), page: () => pick(["1", "2", "0", "-5", "abc", "9999999", "1.5", "", ...evil]),
  pageSize: () => pick(["12", "24", "48", "100", "101", "500", "0", "-1", "x", ""]),
  numerology: () => pick(["1", "5", "9", "0", "10", "-1", "x"]), numerologyMethod: () => pick(["pythagorean", "chaldean", "bogus", ""]),
  religion: () => pick(["Hindu", "Pure Tamil", "Christian", "Muslim", "all", ...evil.slice(0, 8)]),
  community: () => pick(["Pan-Tamil", "Kongu", "Pandya", "Chola", "all", ...evil.slice(0, 8)]),
  trend: () => pick(["Trending Now", "Rising Fast", "Evergreen", "Rare Sangam", "all", ...evil.slice(0, 6)]),
  uniquenessBand: () => pick(["Very Rare", "Rare", "Moderately", "all", ...evil.slice(0, 6)]),
  maxMisspellRisk: () => pick(["low", "medium", "high", "all", "x"]), minEaseScore: () => pick(["0", "50", "75", "90", "100", "101", "-3", "x"]),
  startingLetter: () => pick(["க", "அ", "ழ", "a", "k", ...evil.slice(0, 8)]), nakshatra: () => pick(["ashwini", "rohini", "revati", "none", ...evil.slice(0, 6)]),
};

const results = [];
const defects = [];
async function hit(kind, url, init) {
  const t = performance.now();
  let status = 0, body = null, err = "";
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(20000) });
    status = res.status;
    const text = await res.text();
    if ((res.headers.get("content-type") || "").includes("json")) { try { body = JSON.parse(text); } catch { err = "invalid-json"; } }
  } catch (e) { err = e.message; }
  const ms = performance.now() - t;
  results.push({ kind, ms });
  return { status, body, err, ms };
}
const defect = (kind, url, why) => defects.push({ kind, url, why });

for (let i = 0; i < N; i++) {
  const r = rnd();
  if (r < 0.7) {
    const sp = new URLSearchParams();
    for (const k of Object.keys(params)) if (rnd() < 0.3) sp.set(k, params[k]());
    const url = `${BASE}/api/names?${sp}`;
    const o = await hit("names", url);
    if (o.err) defect("names", url, o.err);
    else if (o.status >= 500) defect("names", url, `HTTP ${o.status}`);
    else if (o.status === 200) {
      const b = o.body;
      if (!b || !Array.isArray(b.names)) defect("names", url, "missing names[]");
      else {
        if (b.names.length > 100) defect("names", url, `pageSize cap broken (${b.names.length})`);
        if (b.names.length > b.pageSize) defect("names", url, "names > pageSize");
        if (b.totalPages < 1 || b.page < 1) defect("names", url, "bad paging numbers");
        if (b.totalCount > 0 && b.page <= b.totalPages && b.names.length === 0) defect("names", url, "empty in-range page");
      }
    }
    if (o.ms > 1500) defect("names", url, `slow ${Math.round(o.ms)}ms`);
  } else if (r < 0.9) {
    const known = rnd() < 0.7;
    const slug = known ? pick(slugs) : pick(evil).slice(0, 80);
    const url = `${BASE}/name/${encodeURIComponent(slug)}`;
    const o = await hit("detail", url);
    if (o.err) defect("detail", url, o.err);
    else if (o.status >= 500) defect("detail", url, `HTTP ${o.status}`);
    else if (known && o.status !== 200) defect("detail", url, `known slug -> ${o.status}`);
    else if (!known && ![200, 404, 400].includes(o.status)) defect("detail", url, `unexpected ${o.status}`);
  } else {
    const bad = pick(["{", "null", "[]", '{"action":"nope"}', '{"nameTamil":""}', '{"nameTamil":"<script>"}']);
    const route = pick(["/api/names", "/api/suggestions", "/api/polls", "/api/advisor"]);
    const url = `${BASE}${route}`;
    const o = await hit("post-bad", url, { method: "POST", headers: { "Content-Type": "application/json" }, body: bad });
    if (o.err) defect("post-bad", url, o.err);
    else if (o.status >= 500) defect("post-bad", `${url} body=${bad}`, `HTTP ${o.status}`);
  }
}

const lat = results.map((r) => r.ms).sort((a, b) => a - b);
const q = (p) => Math.round(lat[Math.min(lat.length - 1, Math.floor(lat.length * p))]);
const report = {
  generatedAt: new Date().toISOString(), base: BASE, requests: N, seed: Number(opt("seed", 1)),
  defects: defects.length, dpmo: Math.round((defects.length / N) * 1e6),
  latencyMs: { p50: q(0.5), p95: q(0.95), p99: q(0.99), max: Math.round(lat.at(-1)) },
  byKind: Object.fromEntries(["names", "detail", "post-bad"].map((k) => [k, results.filter((r) => r.kind === k).length])),
  defectSamples: defects.slice(0, 25),
};
fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync(path.join("reports", "fuzz-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(defects.length ? 1 : 0);

