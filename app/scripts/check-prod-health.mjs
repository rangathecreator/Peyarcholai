#!/usr/bin/env node
/**
 * Zero-dependency Vercel Production / Localhost Synthetic Health Monitor
 * Usage:
 *   node scripts/check-prod-health.mjs
 *   node scripts/check-prod-health.mjs --json
 *   BASE_URL=http://127.0.0.1:3020 node scripts/check-prod-health.mjs
 */

import { performance } from "node:perf_hooks";

const BASE_URL = (process.env.BASE_URL || "https://peyar.donorconnect.in").replace(/\/$/, "");
const JSON_MODE = process.argv.includes("--json");

const ROUTES = [
  "/",
  "/name/yazhini",
  "/why-peyarcholai",
  "/docs",
  "/guide",
  "/p/sample-tamil-poll",
  "/api/names?gender=girl&nameCategory=pure_tamil&page=1",
  "/api/survey?slug=yazhini",
];

async function checkRoute(route) {
  const start = performance.now();
  try {
    const response = await fetch(`${BASE_URL}${route}`, {
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "Peyarcholai-HealthMonitor/1.0" },
    });
    const text = await response.text();
    const latencyMs = Math.round(performance.now() - start);
    const xVercelCache = response.headers.get("x-vercel-cache") || "-";
    const cacheControl = response.headers.get("cache-control") || "-";
    const byteLength = Buffer.byteLength(text, "utf8");

    let error = response.status === 200 ? null : `Unexpected HTTP ${response.status}`;
    if (!error && route === "/") {
      const hasHeader = text.includes('aria-controls="mobile-header-drawer"');
      const hasSection = text.includes('aria-controls="mobile-section-menu"');
      if (!hasHeader || !hasSection) {
        error = `Mobile collapsible menu markers missing (header=${hasHeader}, section=${hasSection})`;
      }
    }

    return { route, status: response.status, latencyMs, xVercelCache, cacheControl, byteLength, ok: !error, error };
  } catch (err) {
    return {
      route,
      status: 0,
      latencyMs: Math.round(performance.now() - start),
      xVercelCache: "-",
      cacheControl: "-",
      byteLength: 0,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main() {
  const results = await Promise.all(ROUTES.map(checkRoute));
  const passed = results.filter((r) => r.ok).length;
  const allOk = passed === results.length;

  if (JSON_MODE) {
    console.log(
      JSON.stringify(
        { baseUrl: BASE_URL, timestamp: new Date().toISOString(), allOk, passed, total: results.length, results },
        null,
        2
      )
    );
  } else {
    console.log(`\nPeyarcholai Health Check — ${BASE_URL} (${passed}/${results.length} PASS)\n`);
    for (const r of results) {
      const icon = r.ok ? "PASS" : "FAIL";
      console.log(
        `[${icon}] ${String(r.status).padStart(3)} ${r.route} (${r.latencyMs}ms, ${r.byteLength}B, cache=${r.xVercelCache})${r.error ? ` — ${r.error}` : ""}`
      );
    }
    console.log("");
  }

  process.exit(allOk ? 0 : 1);
}

main();
