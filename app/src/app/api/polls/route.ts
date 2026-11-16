import { NextRequest, NextResponse } from "next/server";
import {
  createSocialPoll,
  getSocialPollByToken,
  submitPollVote,
  getNameBySlug,
} from "@/lib/repository";
import {
  sanitizePollForViewer,
  validatePollCandidateSlugs,
} from "@/lib/poll-security";
import {
  hashSecret,
  issueCreatorSecret,
  resolvePollViewer,
  sanitizeVoterInput,
} from "@/lib/poll-access";

function isProdMissingDb(): boolean {
  return process.env.NODE_ENV === "production" && !process.env.DATABASE_URL;
}

export async function GET(req: NextRequest) {
  if (isProdMissingDb()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured in production." },
      { status: 503 }
    );
  }
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "sample-tamil-poll";

  const poll = getSocialPollByToken(token);
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  // T17-0: Never trust ?viewer=creator; require x-creator-secret verified against stored hash.
  const presentedSecret = req.headers.get("x-creator-secret");
  const viewer = resolvePollViewer(poll, presentedSecret);
  const candidates = poll.candidateSlugs
    .map((slug) => getNameBySlug(slug))
    .filter(Boolean);

  return NextResponse.json({
    viewerRole: viewer,
    poll: sanitizePollForViewer(poll, viewer),
    candidates,
  });
}

export async function POST(req: NextRequest) {
  if (isProdMissingDb()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured in production." },
      { status: 503 }
    );
  }
  try {
    const body = await req.json();
    const resolveCandidates = (slugs: string[]) =>
      slugs.map((slug) => getNameBySlug(slug)).filter(Boolean);

    if (body.action === "vote") {
      const existing = getSocialPollByToken(String(body.token || ""));
      if (!existing) {
        return NextResponse.json({ error: "Poll not found" }, { status: 404 });
      }
      const cleanVote = sanitizeVoterInput(body, existing.candidateSlugs);
      const updated = submitPollVote(existing.token, {
        voterName: cleanVote.voterName,
        removedSlugs: cleanVote.removedSlugs,
        lovedSlugs: cleanVote.lovedSlugs,
        reason: typeof body.reason === "string" ? body.reason.slice(0, 120) : "Personal preference",
        comment: cleanVote.comment,
      });
      if (!updated) {
        return NextResponse.json({ error: "Poll not found" }, { status: 404 });
      }
      return NextResponse.json({
        ok: true,
        viewerRole: "participant",
        poll: sanitizePollForViewer(updated, "participant"),
        candidates: resolveCandidates(updated.candidateSlugs),
      });
    }

    // T17-0b: Fail closed on paid poll creation until server sessions ship (never trust body.tier).
    const devUngated =
      process.env.ALLOW_UNGATED_DEV === "true" && process.env.NODE_ENV !== "production";
    if (!devUngated) {
      return NextResponse.json(
        { error: "Blind Family Vote-Out Polls require an authenticated ₹499 Kudumba Nool session." },
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

    const creatorSecret = issueCreatorSecret();
    const created = createSocialPoll({
      title: body.title || "Our Tamil Baby Name Shortlist",
      parentName: body.parentName || "Parents",
      candidateSlugs: validation.slugs,
      notes: body.notes || "",
      creatorSecretHash: hashSecret(creatorSecret),
    });

    return NextResponse.json({
      ok: true,
      viewerRole: "creator",
      creatorSecret,
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
