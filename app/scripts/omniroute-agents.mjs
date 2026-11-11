/**
 * OmniRoute role agents – document-producing agents that run on FREE models via the local gateway.
 *
 *   node scripts/omniroute-agents.mjs [agent ...]
 *
 * Agents -> output (all drafts for human review):
 *   plan-reviewer       doc/reviews/01-Plan-Review.md
 *   revenue-planner     doc/plan/13-Revenue-Plan.md
 *   marketing-automation doc/plan/14-Marketing-And-Sales-Automation.md
 *   parent-features     doc/plan/15-Parent-Feature-Ideas.md
 *   test-strategist     doc/testing/02-Random-And-Exploratory-Test-Ideas.md
 */
import fs from "node:fs";
import path from "node:path";

try { process.loadEnvFile(".env.local"); } catch { /* optional */ }
const BASE = process.env.OMNIROUTE_BASE_URL || "http://127.0.0.1:20128/v1";
const KEY = process.env.OMNIROUTE_API_KEY || "";
if (!KEY) { console.error("Set OMNIROUTE_API_KEY in .env.local"); process.exit(1); }
const MODELS = ["auto/best-free"]; // free only (auto/coding:free upstream returns 502)
const ROOT = path.resolve(process.cwd(), "..");

const read = (rel, max = 6000) => {
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8").slice(0, max) : "(missing)";
};

const CONTEXT = () => `
# PROJECT CONTEXT (NamingGuru - Tamil baby naming web app, Next.js, 10,600 Tamil names, 14 parent-focused dimensions: meaning, multilingual check, literary reference, Pythagorean+Chaldean numerology, religion/community/region, gender, ease of calling, misspell risk, uniqueness, trend, nicknames, document fit, nakshatra/rasi, sibling names. Features: explorer with filters, name detail SEO pages, 7D scorecard, shortlist, social poll for relatives, AI advisor, public suggestions, ad banner. Free tier first, India-first, Tamil diaspora second.)
## Vision & requirements
${read("doc/plan/01-Vision-Scope-Requirements.md", 5000)}
## Cost model
${read("doc/plan/08-Cost-Model.md", 4000)}
## Roadmap
${read("doc/plan/10-Roadmap-WBS.md", 4000)}
## Current implementation status
${read("doc/implementation/TODO.md", 5000)}
`;

const AGENTS = {
  "plan-reviewer": {
    out: "doc/reviews/01-Plan-Review.md",
    model: "auto/best-free",
    system: "You are a principal product + engineering reviewer. Be concrete, critical and prioritised. Markdown only.",
    task: "Review the existing application plan end to end. Sections: 1) Executive verdict, 2) What is solid, 3) Gaps and contradictions (docs duplicated across plan/design/requirements, data honesty: uniqueness/trend are formula-based not real data, citations are root-level), 4) Risks table (likelihood x impact x mitigation), 5) Missing requirements (privacy of children data, DPDP Act India, content moderation of public suggestions, accessibility, Tamil fonts, performance, SEO, analytics), 6) Prioritised 30/60/90 day recommendations, 7) Six Sigma CTQ metrics to track.",
  },
  "revenue-planner": {
    out: "doc/plan/13-Revenue-Plan.md",
    model: "auto/best-free",
    system: "You are a startup finance and monetisation strategist for the Indian consumer market. Use INR, state assumptions explicitly, never invent precise market statistics - give ranges and label them assumptions. Markdown only.",
    task: "Create a revenue plan for this app. Include: revenue streams (display ads, affiliate for baby products / astrology / name certificates, premium PDF 'Naming Report' one-time purchase, subscription tiers, B2B for hospitals / maternity clinics / baby photographers, sponsored listings with clear labelling, API licensing), pricing tables, funnel conversion assumptions, 3 scenarios (conservative / base / optimistic) month 1-24 in tables with traffic, conversion, ARPU, revenue, cost (use the cost model), break-even month, unit economics (CAC, LTV), sensitivity analysis, legal/ethical guardrails (no fear-based astrology upsells), and a KPI dashboard list.",
  },
  "marketing-automation": {
    out: "doc/plan/14-Marketing-And-Sales-Automation.md",
    model: "auto/best-free",
    system: "You are a growth marketer specialising in Tamil-language and Indian parenting audiences, focused on automation and low cost. Markdown only.",
    task: "Produce marketing techniques and ideas to automate sales. Include: SEO programmatic strategy (10,600 name pages, schema.org, Tamil + English keywords, internal linking), content automation (weekly name lists, nakshatra pages, festival-time campaigns like Tamil New Year/Pongal/Aadi), social automation (Instagram reels / YouTube Shorts / WhatsApp channel templates, poll sharing virality loop), email/WhatsApp drip flows with timing (pregnancy trimester based), referral loop, influencer and community outreach in Tamil Nadu + diaspora (Singapore, Malaysia, UK, US, Canada), partnerships (hospitals, doulas, photographers), paid ads tests with budgets, automation stack using free/open-source tools (n8n, Buffer alternatives, Brevo free tier), funnel diagrams as markdown tables, 30-day launch calendar, KPIs, and compliance (DPDP, WhatsApp opt-in, ad disclosure).",
  },
  "parent-features": {
    out: "doc/plan/15-Parent-Feature-Ideas.md",
    model: "auto/best-free",
    system: "You are a product designer thinking strictly from the perspective of expecting Tamil parents and grandparents. Markdown only.",
    task: "Think from the parents' perspective and propose additional relevant features for kid naming. For each feature give: problem it solves, user story, MVP scope, effort (S/M/L), impact (1-5), and data needed. Cover at least 25 ideas, e.g. surname/initial combination preview, name + grandparents' names harmony, family tree conflicts (avoid repeating elders' names or honour them), pronunciation audio, handwriting/Tamil calligraphy preview, school-form/Aadhaar/passport spelling checker, name-with-rhyming-siblings, couple shortlist voting, elders' approval mode with big-font Tamil UI, nakshatra-based first-letter finder with birth time input, numerology compatibility with parents' numbers, meaning-based search ('brave', 'river'), offline PWA, printable naming certificate, naming-ceremony (Namakaranam) planner, WhatsApp share cards, name popularity trends over time, regret protection (nickname teasing check), cross-language meaning safety, twin naming, adoption/inter-cultural names. End with a ranked top-10 roadmap.",
  },
  "test-strategist": {
    out: "doc/testing/02-Random-And-Exploratory-Test-Ideas.md",
    model: "auto/best-free",
    system: "You are a senior QA architect (Six Sigma Black Belt). Markdown only, concrete test cases.",
    task: "Design the random / exploratory / fuzz test plan for this web app: API parameter fuzzing for /api/names (page, pageSize, q with Tamil/Latin/emoji/SQL-like/very long strings, numerology, filters), /api/suggestions and /api/polls abuse cases (XSS payloads, Latin text in Tamil field, duplicates, spam), name detail page for random slugs, Tamil Unicode edge cases (grantha letters, combining marks, zero-width joiners), pagination boundaries, concurrency, mobile viewport, accessibility (keyboard, screen reader), performance budgets, data-quality property tests (numerology totals equal letter sums), oracle checks, and a Six Sigma defect taxonomy with DPMO targets. Provide tables of test IDs, input, expected result, severity.",
  },
};

async function chat(system, user, model) {
  let last = "";
  for (const m of [model, ...MODELS.filter((x) => x !== model)]) {
    for (let a = 0; a < 3; a++) {
      try {
        const res = await fetch(`${BASE}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
          body: JSON.stringify({ model: m, temperature: 0.4, max_tokens: 4500, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
          signal: AbortSignal.timeout(300000),
        });
        if (!res.ok) { last = `${m} HTTP ${res.status}`; await new Promise((r) => setTimeout(r, 8000 * (a + 1))); continue; }
        const d = await res.json();
        const t = d?.choices?.[0]?.message?.content;
        if (t && t.length > 800) return { text: t, model: d.model || m };
        last = `${m} short/empty`;
      } catch (e) { last = `${m} ${e.message}`; }
    }
  }
  throw new Error(last);
}

const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(AGENTS);
console.log(`🤖 Role agents: ${wanted.join(", ")}`);
async function runPool(items, fn, n) { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); })); }
await runPool(
  wanted,
  async (name) => {
    const cfg = AGENTS[name];
    if (!cfg) return console.error(`unknown agent ${name}`);
    const t0 = Date.now();
    try {
      const { text, model } = await chat(cfg.system, `${CONTEXT()}\n\n# TASK\n${cfg.task}`, cfg.model);
      const out = path.join(ROOT, cfg.out);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, `> **Draft generated by OmniRoute free model \`${model}\` on ${new Date().toISOString().slice(0, 16)} — needs human review. Figures are assumptions, not market data.**\n\n${text}\n`, "utf8");
      console.log(`✅ ${name} -> ${cfg.out} (${text.length} chars, ${Math.round((Date.now() - t0) / 1000)}s, ${model})`);
    } catch (e) {
      console.error(`❌ ${name} failed: ${e.message}`);
    }
  },
  2
);
