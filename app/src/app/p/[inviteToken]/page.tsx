import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameBySlug, getSocialPollByToken } from "@/lib/repository";
import { PostgresPollStore } from "@/lib/db/stores";
import PublicPollVoteClient, { type PublicPollCandidate } from "./PublicPollVoteClient";

export const dynamic = "force-dynamic";

const loadPoll = cache(async (inviteToken: string) => {
  if (process.env.DATABASE_URL) {
    try {
      const store = new PostgresPollStore();
      const p = await store.getPollByToken(inviteToken);
      if (p) {
        return {
          title: p.title,
          parentName: p.parentName,
          notes: p.notes,
          candidateSlugs: p.candidateSlugs,
          closesAt: p.closesAt,
          closedAt: p.closedAt ?? null,
        };
      }
    } catch {
      // Fall through only for bundled demo poll; non-demo tokens fail safely to 404
    }
    if (inviteToken !== "sample-tamil-poll") {
      return null;
    }
  }
  const local = getSocialPollByToken(inviteToken);
  if (!local) return null;
  return {
    title: local.title,
    parentName: local.parentName,
    notes: local.notes,
    candidateSlugs: local.candidateSlugs,
    closesAt: local.closesAt,
    closedAt: null,
  };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ inviteToken: string }>;
}): Promise<Metadata> {
  const { inviteToken } = await params;
  const poll = await loadPoll(inviteToken);
  if (!poll) {
    return { title: "Family Poll Not Found | பெயர்ச்சோலை (Peyarcholai)" };
  }
  return {
    title: `🗳️ ${poll.title} | பெயர்ச்சோலை (Peyarcholai)`,
    description: `Vote blindly on ${poll.candidateSlugs.length} shortlisted Tamil baby names shared by ${poll.parentName}.`,
    openGraph: {
      title: `🗳️ ${poll.title}`,
      description: `Vote on ${poll.candidateSlugs.length} Tamil baby names shared by ${poll.parentName} on Peyarcholai.`,
    },
  };
}

export default async function PublicPollPage({
  params,
}: {
  params: Promise<{ inviteToken: string }>;
}) {
  const { inviteToken } = await params;
  const poll = await loadPoll(inviteToken);
  if (!poll) {
    notFound();
  }

  const candidates: PublicPollCandidate[] = poll.candidateSlugs
    .map((slug) => getNameBySlug(slug))
    .filter((rec): rec is NonNullable<typeof rec> => Boolean(rec))
    .map((rec) => ({
      slug: rec.slug,
      nameTamil: rec.nameTamil,
      nameLatin: rec.nameLatin,
      meaningTa: rec.meaningTa,
      meaningEn: rec.meaningEn,
    }));

  const isClosed = Boolean(poll.closedAt) || Date.parse(poll.closesAt) <= Date.now();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
            🔒 Blind Family Vote-Out Poll
          </span>
          <Link href="/" className="text-xs font-semibold text-amber-800 hover:underline">
            Explore Peyarcholai →
          </Link>
        </div>
        <h1 className="mt-2 text-lg sm:text-xl font-extrabold text-stone-900">
          {poll.title}
        </h1>
        <p className="mt-1 text-xs text-stone-600">
          Hosted by <strong>{poll.parentName}</strong> · {candidates.length} shortlisted names
        </p>
        {poll.notes && (
          <p className="mt-2 rounded-xl bg-amber-50/70 p-2.5 text-xs text-stone-700">
            {poll.notes}
          </p>
        )}
      </div>

      <PublicPollVoteClient
        inviteToken={inviteToken}
        candidates={candidates}
        isClosed={isClosed}
      />
    </div>
  );
}
