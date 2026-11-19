import { NextRequest, NextResponse } from "next/server";
import { getCategoryCounts } from "@/lib/repository";

const startedAtMs = Date.now();
let metricsScrapesTotal = 0;

export async function GET(req: NextRequest) {
  const expectedToken = process.env.METRICS_TOKEN || "";
  if (process.env.NODE_ENV === "production") {
    const authHeader = req.headers.get("authorization") || "";
    const presented = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!expectedToken || presented !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  metricsScrapesTotal++;
  const counts = getCategoryCounts();
  const uptimeSeconds = Math.floor((Date.now() - startedAtMs) / 1000);

  const lines = [
    "# HELP peyarcholai_metrics_scrapes_total Total metrics endpoint scrapes in this process",
    "# TYPE peyarcholai_metrics_scrapes_total counter",
    `peyarcholai_metrics_scrapes_total ${metricsScrapesTotal}`,
    "",
    "# HELP peyarcholai_catalog_names_total Active verified names in catalog by cultural category",
    "# TYPE peyarcholai_catalog_names_total gauge",
    `peyarcholai_catalog_names_total{category="pure_tamil"} ${counts.pure_tamil}`,
    `peyarcholai_catalog_names_total{category="tamilnadu_usage"} ${counts.tamilnadu_usage}`,
    `peyarcholai_catalog_names_total{category="other_heritage"} ${counts.other_heritage}`,
    `peyarcholai_catalog_names_total{category="total"} ${counts.total}`,
    "",
    "# HELP peyarcholai_process_uptime_seconds Process uptime in seconds",
    "# TYPE peyarcholai_process_uptime_seconds gauge",
    `peyarcholai_process_uptime_seconds ${uptimeSeconds}`,
    "",
    "# HELP peyarcholai_system_up Process uptime status",
    "# TYPE peyarcholai_system_up gauge",
    "peyarcholai_system_up 1",
  ];

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
