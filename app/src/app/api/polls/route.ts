import { NextRequest, NextResponse } from "next/server";
import {
  createSocialPoll,
  getSocialPollByToken,
  submitPollVote,
  getAllTamilNames,
} from "@/lib/repository";
import {
  sanitizePollForViewer,
  validatePollCandidateSlugs,
} from "@/lib/poll-security";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "sample-tamil-poll";
  const viewer =
    searchParams.get("viewer") === "creator" ? "creator" : "participant";

  const poll = getSocialPollByToken(token);
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const allNames = getAllTamilNames();
  const candidates = poll.candidateSlugs
    .map((slug) => allNames.find((n) => n.slug === slug))
    .filter(Boolean);

  return NextResponse.json({
    poll: sanitizePollForViewer(poll, viewer),
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
        poll: sanitizePollForViewer(updated, "participant"),
        candidates: resolveCandidates(updated.candidateSlugs),
      });
    }

    // Server-side ₹499 entitlement gate when paywall is enabled
    if (
      process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTION_PAYWALL === "true" &&
      body.tier !== "kudumba_499"
    ) {
      return NextResponse.json(
        { error: "Blind Family Vote-Out Polls require the ₹499 Kudumba Nool tier." },
        { status: 403 }
      );
    }

    const validation = validatePollCandidateSlugs(
      Array.isArray(body.candidateSlugs)
        ? body.candidateSlugs
        : ["yazhini", "kavin", "iniya"]
    );
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const created = createSocialPoll({
      title: body.title || "Our Tamil Baby Name Shortlist",
      parentName: body.parentName || "Parents",
      candidateSlugs: validation.slugs,
      notes: body.notes || "",
    });

    return NextResponse.json({
      ok: true,
      poll: sanitizePollForViewer(created, "creator"),
      candidates: resolveCandidates(created.candidateSlugs),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Poll error" },
      { status: 400 }
    );
  }
}
