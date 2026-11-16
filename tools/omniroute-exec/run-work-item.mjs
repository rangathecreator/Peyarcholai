#!/usr/bin/env node
/**
 * OmniRoute work-item runner (Design 10).
 * Claude writes the spec + read-only acceptance tests; OmniRoute writes ONE target file;
 * all gate commands must pass; the test file must be byte-identical afterwards.
 *
 * Usage: node tools/omniroute-exec/run-work-item.mjs <work-item.json>
 * Env:   OMNIROUTE_BASE_URL (default http://127.0.0.1:20128/v1)  OMNIROUTE_API_KEY  OMNIROUTE_MODEL
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const itemPath = process.argv[2];
if (!itemPath) {
  console.error("Usage: run-work-item.mjs <work-item.json>");
  process.exit(2);
}
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const item = JSON.parse(fs.readFileSync(itemPath, "utf8"));
const BASE = (process.env.OMNIROUTE_BASE_URL || "http://127.0.0.1:20128/v1").replace(/\/$/, "");
const MODEL = process.env.OMNIROUTE_MODEL || item.model || "llama-cpp/qwen2.5-coder-14b";
const MAX = item.maxAttempts || 4;
const resolve = (p) => path.resolve(path.isAbsolute(p) ? p : path.join(repoRoot, p));

const target = resolve(item.targetFile);
const testFile = resolve(item.testFile);
const allow = (item.allowedWriteDirs || []).map(resolve);
if (!allow.some((d) => target.toLowerCase().startsWith(d.toLowerCase() + path.sep))) {
  console.error(`REFUSED: target ${target} is outside allowedWriteDirs`);
  process.exit(2);
}
const sha = (f) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
const testShaBefore = sha(testFile);
const testContentBefore = fs.readFileSync(testFile);
const logDir = path.join(repoRoot, "reports", "omniroute", item.id);
fs.mkdirSync(logDir, { recursive: true });

const system = [
  "You are a senior TypeScript engineer implementing exactly one source file.",
  `Reply with ONLY the complete contents of \`${path.basename(target)}\` inside a single fenced code block. No prose.`,
  "Satisfy the acceptance tests exactly. Do not change the tests. Use only the allowed imports. Prefer simple, readable, side-effect-free code.",
  "Do not add console logging. Do not invent extra exports that would conflict with the required API.",
].join("\n");

const baseUser = [
  `# Work item ${item.id}: ${item.title}`,
  "## Specification (authoritative)",
  item.spec,
  `## Allowed imports\n${(item.allowedImports || ["(none)"]).join("\n")}`,
  ...(item.contextFiles || []).map((f) => `## Context file: ${f}\n\`\`\`ts\n${fs.readFileSync(resolve(f), "utf8")}\n\`\`\``),
  `## Acceptance tests (read-only): ${path.basename(testFile)}\n\`\`\`ts\n${fs.readFileSync(testFile, "utf8")}\n\`\`\``,
].join("\n\n");

async function ask(messages) {
  const headers = { "Content-Type": "application/json" };
  if (process.env.OMNIROUTE_API_KEY) headers.Authorization = `Bearer ${process.env.OMNIROUTE_API_KEY}`;
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.1, max_tokens: item.maxTokens || 3500 }),
    signal: AbortSignal.timeout((item.timeoutSec || 900) * 1000),
  });
  if (!res.ok) throw new Error(`OmniRoute HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}
const extract = (reply) => {
  const m = reply.match(/```(?:ts|typescript|tsx)?\s*\n([\s\S]*?)```/);
  return (m ? m[1] : reply).trim() + "\n";
};
const runGate = (cmd) => {
  const r = spawnSync(cmd.command, { cwd: resolve(cmd.cwd || "."), shell: true, encoding: "utf8", timeout: (cmd.timeoutSec || 240) * 1000 });
  return { ok: r.status === 0, out: `${r.stdout || ""}${r.stderr || ""}` };
};

let messages = [{ role: "system", content: system }, { role: "user", content: baseUser }];
let success = false;
let lastOut = "";
const started = Date.now();
for (let attempt = 1; attempt <= MAX; attempt++) {
  console.log(`[${item.id}] attempt ${attempt}/${MAX} via ${MODEL} …`);
  let reply;
  try {
    reply = await ask(messages);
  } catch (e) {
    lastOut = String(e);
    console.error(lastOut);
    break;
  }
  const code = extract(reply);
  fs.writeFileSync(path.join(logDir, `attempt-${attempt}.reply.txt`), reply);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, code);
  let allOk = true;
  let combined = "";
  for (const g of item.gates) {
    const r = runGate(g);
    combined += `\n$ ${g.command}\n${r.out}`;
    if (!r.ok) { allOk = false; break; }
  }
  fs.writeFileSync(path.join(logDir, `attempt-${attempt}.gates.txt`), combined);
  const testsIntact = sha(testFile) === testShaBefore;
  if (!testsIntact) {
    fs.writeFileSync(testFile, testContentBefore); // restore the read-only acceptance tests
    console.error("FAIL: generated code modified the test file (restored). Aborting.");
    process.exit(3);
  }
  if (allOk) { success = true; lastOut = combined; break; }
  lastOut = combined;
  messages = [
    ...messages,
    { role: "assistant", content: "```ts\n" + code + "```" },
    { role: "user", content: `The gates failed. Fix the file. Output ONLY the full corrected file in one code block.\n\nFailure output (tail):\n${combined.split("\n").slice(-70).join("\n")}` },
  ];
}
const report = { id: item.id, model: MODEL, success, seconds: Math.round((Date.now() - started) / 1000), target: path.relative(repoRoot, target) };
fs.writeFileSync(path.join(logDir, "result.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
if (!success) {
  console.error(lastOut.split("\n").slice(-40).join("\n"));
  process.exit(1);
}
