import { NextRequest, NextResponse } from "next/server";
import { getNameBySlug, getSocialPollByToken } from "@/lib/repository";
import { PostgresPollStore } from "@/lib/db/stores";
import { hashSecret, resolvePollViewer } from "@/lib/poll-access";

export async function GET(
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

  const presentedSecret = req.headers.get("x-creator-secret");
  const voterCookie = req.cookies.get("pc_voter")?.value || "";
  const voterTokenHash = voterCookie ? hashSecret(voterCookie) : "";

  if (process.env.DATABASE_URL) {
    const store = new PostgresPollStore();
    const poll = await store.getPollByToken(inviteToken);
    if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    const viewer = resolvePollViewer(poll, presentedSecret);
    const candidates = poll.candidateSlugs.map((s) => getNameBySlug(s)).filter(Boolean);
    const ownVote = voterTokenHash
      ? poll.votes.find((v) => v.voterTokenHash === voterTokenHash) || null
      : null;

    return NextResponse.json({
      viewerRole: viewer,
      poll: {
        token: poll.inviteToken,
        title: poll.title,
        parentName: poll.parentName,
        notes: poll.notes,
        candidateSlugs: poll.candidateSlugs,
        createdAt: poll.createdAt,
        closesAt: poll.closesAt,
        closedAt: poll.closedAt,
        blindVoting: true,
        totalVotesCount: poll.votes.length,
        votes: viewer === "creator" ? poll.votes : ownVote ? [ownVote] : [],
      },
      candidates,
    });
  }

  // Local dev fallback
  const poll = getSocialPollByToken(inviteToken);
  if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  const viewer = resolvePollViewer(poll, presentedSecret);
  const candidates = poll.candidateSlugs.map((s) => getNameBySlug(s)).filter(Boolean);
  return NextResponse.json({
    viewerRole: viewer,
    poll: {
      token: poll.token,
      title: poll.title,
      parentName: poll.parentName,
      notes: poll.notes,
      candidateSlugs: poll.candidateSlugs,
      createdAt: poll.createdAt,
      closesAt: poll.closesAt,
      blindVoting: true,
      totalVotesCount: poll.votes.length,
      votes: viewer === "creator" ? poll.votes : [],
    },
    candidates,
  });
}
