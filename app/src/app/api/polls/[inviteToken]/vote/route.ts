import { NextRequest, NextResponse } from "next/server";
import { getSocialPollByToken, submitPollVote } from "@/lib/repository";
import { PostgresPollStore } from "@/lib/db/stores";
import { hashSecret, issueCreatorSecret, sanitizeVoterInput } from "@/lib/poll-access";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ inviteToken: string }> }
) {
  const { inviteToken } = await context.params;
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured in production." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    let voterCookie = req.cookies.get("pc_voter")?.value || "";
    const isNewCookie = !voterCookie;
    if (!voterCookie) {
      voterCookie = issueCreatorSecret();
    }
    const voterTokenHash = hashSecret(voterCookie);

    if (process.env.DATABASE_URL) {
      const store = new PostgresPollStore();
      const poll = await store.getPollByToken(inviteToken);
      if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });
      const clean = sanitizeVoterInput(body, poll.candidateSlugs);
      const res = await store.upsertVote(inviteToken, {
        voterTokenHash,
        voterName: clean.voterName,
        lovedSlugs: clean.lovedSlugs,
        removedSlugs: clean.removedSlugs,
        reason: typeof body.reason === "string" ? body.reason.slice(0, 120) : "Personal preference",
        comment: clean.comment,
      });
      if (!res.ok) {
        return NextResponse.json({ error: res.error }, { status: res.status });
      }
      const response = NextResponse.json({
        ok: true,
        viewerRole: "participant",
        totalVotesCount: res.poll.votes.length,
      });
      if (isNewCookie) {
        response.cookies.set("pc_voter", voterCookie, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 60,
          path: "/",
        });
      }
      return response;
    }

    // Local dev fallback
    const localPoll = getSocialPollByToken(inviteToken);
    if (!localPoll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    const clean = sanitizeVoterInput(body, localPoll.candidateSlugs);
    const updated = submitPollVote(inviteToken, {
      voterName: clean.voterName,
      lovedSlugs: clean.lovedSlugs,
      removedSlugs: clean.removedSlugs,
      reason: typeof body.reason === "string" ? body.reason.slice(0, 120) : "Personal preference",
      comment: clean.comment,
    });
    if (!updated) return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    return NextResponse.json({
      ok: true,
      viewerRole: "participant",
      totalVotesCount: updated.votes.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to record vote right now. Please try again." },
      { status: 503 }
    );
  }
}
