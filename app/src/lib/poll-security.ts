import type { SocialPollRecord } from "@/lib/repository";

export const MAX_POLL_CANDIDATES = 10;

export interface SanitizedPollResponse extends Omit<SocialPollRecord, "votes"> {
  blindVoting: boolean;
  totalVotesCount: number;
  votes: SocialPollRecord["votes"];
}

/**
 * Enforces server-side blind voting (Task 17 — SG-03):
 * Non-creator participants never receive other voters' selections, names, or comments.
 */
export function sanitizePollForViewer(
  poll: SocialPollRecord,
  viewerRole: "creator" | "participant" = "participant"
): SanitizedPollResponse {
  if (viewerRole === "creator") {
    return {
      ...poll,
      blindVoting: true,
      totalVotesCount: poll.votes.length,
    };
  }

  return {
    ...poll,
    blindVoting: true,
    totalVotesCount: poll.votes.length,
    votes: [],
  };
}

export function validatePollCandidateSlugs(slugs: unknown): {
  valid: boolean;
  slugs: string[];
  error?: string;
} {
  if (!Array.isArray(slugs)) {
    return { valid: false, slugs: [], error: "candidateSlugs must be an array." };
  }
  const unique = Array.from(
    new Set(slugs.map((s) => String(s).trim().toLowerCase()).filter(Boolean))
  );
  if (unique.length === 0) {
    return { valid: false, slugs: [], error: "Select at least 1 shortlisted name." };
  }
  if (unique.length > MAX_POLL_CANDIDATES) {
    return {
      valid: false,
      slugs: unique.slice(0, MAX_POLL_CANDIDATES),
      error: `Blind Family Polls support a maximum of ${MAX_POLL_CANDIDATES} shortlisted names.`,
    };
  }
  return { valid: true, slugs: unique };
}
