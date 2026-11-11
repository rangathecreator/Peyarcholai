import { NextRequest, NextResponse } from "next/server";
import { filterTamilNames, saveErrorReport } from "@/lib/repository";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const gender = searchParams.get("gender") || undefined;
  const nakshatra = searchParams.get("nakshatra") || undefined;
  const numerologyRaw = searchParams.get("numerology");
  const numerology = numerologyRaw ? parseInt(numerologyRaw, 10) : undefined;
  const numerologyMethodRaw = searchParams.get("numerologyMethod");
  const numerologyMethod =
    numerologyMethodRaw === "chaldean" ? "chaldean" : "pythagorean";
  const origin = searchParams.get("origin") || undefined;
  const religion = searchParams.get("religion") || undefined;
  // `region` is an alias of `community` (regional / community heritage)
  const community =
    searchParams.get("community") || searchParams.get("region") || undefined;
  const minEaseRaw = parseInt(searchParams.get("minEaseScore") || "0", 10);
  const minEaseScore = Number.isFinite(minEaseRaw)
    ? Math.min(100, Math.max(0, minEaseRaw))
    : 0;
  const tinai = searchParams.get("tinai") || undefined;
  const trend = searchParams.get("trend") || undefined;
  const uniquenessBand = searchParams.get("uniquenessBand") || undefined;
  const maxMisspellRisk = searchParams.get("maxMisspellRisk") || undefined;
  const startingLetter = searchParams.get("startingLetter") || undefined;
  const slugsParam = searchParams.get("slugs");
  const slugs = slugsParam
    ? slugsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") || "48", 10) || 48)
  );

  const matched = filterTamilNames({
    q,
    gender,
    nakshatra,
    numerology,
    numerologyMethod,
    origin,
    religion,
    community,
    tinai,
    trend,
    uniquenessBand,
    maxMisspellRisk,
    minEaseScore,
    startingLetter,
    slugs,
  });

  const totalCount = matched.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize;
  const paginatedNames = matched.slice(start, start + pageSize);

  return NextResponse.json({
    count: totalCount,
    totalCount,
    page,
    pageSize,
    totalPages,
    numerologyMethod,
    names: paginatedNames,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === "report_error") {
      const report = saveErrorReport({
        nameSlug: body.nameSlug || "unknown",
        issueType: body.issueType || "Meaning / Citation Correction",
        details: body.details || "",
      });
      return NextResponse.json({ ok: true, report });
    }
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Bad request" },
      { status: 400 }
    );
  }
}

