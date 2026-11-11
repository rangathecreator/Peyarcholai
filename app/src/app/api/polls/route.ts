import { NextRequest, NextResponse } from "next/server";
import {
  createSocialPoll,
  getSocialPollByToken,
  submitPollVote,
  getAllTamilNames,
} from "@/lib/repository";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "sample-tamil-poll";
  const poll = getSocialPollByToken(token);
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const allNames = getAllTamilNames();
  const candidates = poll.candidateSlugs
    .map((slug) => allNames.find((n) => n.slug === slug))
    .filter(Boolean);

  return NextResponse.json({
    poll,
    candidates,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const allNames = getAllTamilNames();
    const resolveCandidates = (slugs: string[]) =>
      slugs.map((slug) => allNames.find((n) => n.slug === slug)).filter(Boolean);

    if (body.action === "vote") {
      const updated = submitPollVote(body.token, {
        voterName: body.voterName || "Family Member",
        removedSlugs: Array.isArray(body.removedSlugs) ? body.removedSlugs : [],
        lovedSlugs: Array.isArray(body.lovedSlugs) ? body.lovedSlugs : [],
        reason: body.reason || "Personal preference",
        comment: body.comment || "",
      });
      if (!updated) {
        return NextResponse.json({ error: "Poll not found" }, { status: 404 });
      }
      return NextResponse.json({
        ok: true,
        poll: updated,
        candidates: resolveCandidates(updated.candidateSlugs),
      });
    }

    const created = createSocialPoll({
      title: body.title || "Our Tamil Baby Name Shortlist",
      parentName: body.parentName || "Parents",
      candidateSlugs: Array.isArray(body.candidateSlugs)
        ? body.candidateSlugs
        : ["yazhini", "kavin", "iniya"],
      notes: body.notes || "",
    });

    return NextResponse.json({
      ok: true,
      poll: created,
      candidates: resolveCandidates(created.candidateSlugs),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Poll error" },
      { status: 400 }
    );
  }
}

