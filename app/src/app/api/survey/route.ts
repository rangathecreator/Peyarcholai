import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const K_ANONYMITY_THRESHOLD = 5;

// In-memory fallback for local dev / unit tests when DATABASE_URL is unset
const memorySurveys = new Map<string, { total: number; matches: number }>();

let surveyPool: Pool | null = null;
function getPool(): Pool {
  if (!surveyPool) {
    surveyPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
    });
  }
  return surveyPool;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nameSlug = String(body.nameSlug || "").trim().toLowerCase().slice(0, 128);
    const hadSameNameInClass = Boolean(body.hadSameNameInClass);
    const classSize = Math.min(100, Math.max(5, Math.round(Number(body.classSize) || 40)));

    if (!nameSlug) {
      return NextResponse.json({ error: "nameSlug is required" }, { status: 400 });
    }

    // Store strictly anonymous aggregate observation (zero PII)
    if (process.env.DATABASE_URL) {
      await getPool().query(
        `INSERT INTO class_collision_surveys (name_slug, had_same_name_in_class, class_size)
         VALUES ($1, $2, $3)`,
        [nameSlug, hadSameNameInClass, classSize]
      );
    } else {
      const cur = memorySurveys.get(nameSlug) || { total: 0, matches: 0 };
      cur.total += 1;
      if (hadSameNameInClass) cur.matches += 1;
      memorySurveys.set(nameSlug, cur);
    }

    return NextResponse.json({ ok: true, recorded: true });
  } catch {
    return NextResponse.json({ error: "Invalid survey payload" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nameSlug = String(searchParams.get("slug") || "").trim().toLowerCase();
  if (!nameSlug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  let total = 0;
  let matches = 0;

  if (process.env.DATABASE_URL) {
    try {
      const res = await getPool().query(
        `SELECT COUNT(*)::int AS total,
                SUM(CASE WHEN had_same_name_in_class THEN 1 ELSE 0 END)::int AS matches
         FROM class_collision_surveys WHERE name_slug = $1`,
        [nameSlug]
      );
      total = res.rows[0]?.total || 0;
      matches = res.rows[0]?.matches || 0;
    } catch {
      // Graceful degradation if Neon schema V1 is not yet migrated or DB is temporarily unreachable
      total = 0;
      matches = 0;
    }
  } else {
    const cur = memorySurveys.get(nameSlug);
    if (cur) {
      total = cur.total;
      matches = cur.matches;
    }
  }

  // AC-20-06: Enforce k-anonymity >= 5 before exposing aggregate rate
  if (total < K_ANONYMITY_THRESHOLD) {
    return NextResponse.json({
      slug: nameSlug,
      kAnonymityMet: false,
      minimumRequired: K_ANONYMITY_THRESHOLD,
      grade: "C",
    });
  }

  return NextResponse.json({
    slug: nameSlug,
    kAnonymityMet: true,
    sampleSize: total,
    collisionRatePercent: Number(((matches / total) * 100).toFixed(1)),
    grade: total >= 30 ? "A" : "C",
  });
}
