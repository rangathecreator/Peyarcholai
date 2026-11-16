import { Pool } from "pg";

export const MAX_POLL_VOTERS = 50;

export interface PollVoteRecord {
  voterTokenHash: string;
  voterName: string;
  lovedSlugs: string[];
  removedSlugs: string[];
  reason: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredPoll {
  id: string;
  inviteToken: string;
  ownerUserId?: string | null;
  creatorSecretHash?: string;
  title: string;
  parentName: string;
  notes: string;
  candidateSlugs: string[];
  createdAt: string;
  closesAt: string;
  closedAt?: string | null;
  votes: PollVoteRecord[];
}

export interface PollStore {
  createPoll(input: {
    inviteToken: string;
    ownerUserId?: string | null;
    creatorSecretHash?: string;
    title: string;
    parentName: string;
    notes: string;
    candidateSlugs: string[];
    closesAt: string;
  }): Promise<StoredPoll>;
  getPollByToken(inviteToken: string): Promise<StoredPoll | null>;
  upsertVote(
    inviteToken: string,
    vote: Omit<PollVoteRecord, "createdAt" | "updatedAt">
  ): Promise<{ ok: true; poll: StoredPoll } | { ok: false; status: 404 | 409 | 429; error: string }>;
  closePoll(inviteToken: string): Promise<boolean>;
}

export class InMemoryPollStore implements PollStore {
  private readonly polls = new Map<string, StoredPoll>();

  async createPoll(input: {
    inviteToken: string;
    ownerUserId?: string | null;
    creatorSecretHash?: string;
    title: string;
    parentName: string;
    notes: string;
    candidateSlugs: string[];
    closesAt: string;
  }): Promise<StoredPoll> {
    if (input.candidateSlugs.length < 1 || input.candidateSlugs.length > 10) {
      throw new Error("Poll must have between 1 and 10 candidates.");
    }
    const now = new Date().toISOString();
    const poll: StoredPoll = {
      id: `mem-${input.inviteToken}`,
      inviteToken: input.inviteToken,
      ownerUserId: input.ownerUserId ?? null,
      creatorSecretHash: input.creatorSecretHash,
      title: input.title,
      parentName: input.parentName,
      notes: input.notes,
      candidateSlugs: [...input.candidateSlugs],
      createdAt: now,
      closesAt: input.closesAt,
      closedAt: null,
      votes: [],
    };
    this.polls.set(input.inviteToken, poll);
    return poll;
  }

  async getPollByToken(inviteToken: string): Promise<StoredPoll | null> {
    return this.polls.get(inviteToken) ?? null;
  }

  async upsertVote(
    inviteToken: string,
    vote: Omit<PollVoteRecord, "createdAt" | "updatedAt">
  ): Promise<{ ok: true; poll: StoredPoll } | { ok: false; status: 404 | 409 | 429; error: string }> {
    const poll = this.polls.get(inviteToken);
    if (!poll) return { ok: false, status: 404, error: "Poll not found" };
    if (poll.closedAt || Date.parse(poll.closesAt) <= Date.now()) {
      return { ok: false, status: 409, error: "This family poll is closed." };
    }
    const now = new Date().toISOString();
    const idx = poll.votes.findIndex((v) => v.voterTokenHash === vote.voterTokenHash);
    if (idx >= 0) {
      poll.votes[idx] = {
        ...poll.votes[idx],
        ...vote,
        updatedAt: now,
      };
    } else {
      if (poll.votes.length >= MAX_POLL_VOTERS) {
        return { ok: false, status: 429, error: `Poll reached the ${MAX_POLL_VOTERS}-voter limit.` };
      }
      poll.votes.push({ ...vote, createdAt: now, updatedAt: now });
    }
    return { ok: true, poll };
  }

  async closePoll(inviteToken: string): Promise<boolean> {
    const poll = this.polls.get(inviteToken);
    if (!poll) return false;
    poll.closedAt = new Date().toISOString();
    return true;
  }
}

let sharedPgPool: Pool | null = null;
function getPgPool(): Pool {
  if (!sharedPgPool) {
    sharedPgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
    });
  }
  return sharedPgPool;
}

export class PostgresPollStore implements PollStore {
  private readonly pool: Pool;

  constructor(pool?: Pool) {
    this.pool = pool || getPgPool();
  }

  async createPoll(input: {
    inviteToken: string;
    ownerUserId?: string | null;
    creatorSecretHash?: string;
    title: string;
    parentName: string;
    notes: string;
    candidateSlugs: string[];
    closesAt: string;
  }): Promise<StoredPoll> {
    const res = await this.pool.query(
      `INSERT INTO polls (owner_user_id, invite_token, creator_secret_hash, title, parent_name, notes, candidate_slugs, closes_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::timestamptz)
       RETURNING id, invite_token, owner_user_id, creator_secret_hash, title, parent_name, notes, candidate_slugs, created_at, closes_at, closed_at`,
      [
        input.ownerUserId ?? null,
        input.inviteToken,
        input.creatorSecretHash ?? null,
        input.title,
        input.parentName,
        input.notes,
        JSON.stringify(input.candidateSlugs),
        input.closesAt,
      ]
    );
    const r = res.rows[0];
    return {
      id: r.id,
      inviteToken: r.invite_token,
      ownerUserId: r.owner_user_id,
      creatorSecretHash: r.creator_secret_hash ?? undefined,
      title: r.title,
      parentName: r.parent_name,
      notes: r.notes || "",
      candidateSlugs: r.candidate_slugs,
      createdAt: new Date(r.created_at).toISOString(),
      closesAt: new Date(r.closes_at).toISOString(),
      closedAt: r.closed_at ? new Date(r.closed_at).toISOString() : null,
      votes: [],
    };
  }

  async getPollByToken(inviteToken: string): Promise<StoredPoll | null> {
    const res = await this.pool.query(
      `SELECT id, invite_token, owner_user_id, creator_secret_hash, title, parent_name, notes, candidate_slugs, created_at, closes_at, closed_at
       FROM polls WHERE invite_token = $1 LIMIT 1`,
      [inviteToken]
    );
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    const votesRes = await this.pool.query(
      `SELECT voter_token_hash, voter_name, loved_slugs, removed_slugs, reason, comment, created_at, updated_at
       FROM poll_votes WHERE poll_id = $1 ORDER BY created_at ASC`,
      [r.id]
    );
    return {
      id: r.id,
      inviteToken: r.invite_token,
      ownerUserId: r.owner_user_id,
      creatorSecretHash: r.creator_secret_hash ?? undefined,
      title: r.title,
      parentName: r.parent_name,
      notes: r.notes || "",
      candidateSlugs: r.candidate_slugs,
      createdAt: new Date(r.created_at).toISOString(),
      closesAt: new Date(r.closes_at).toISOString(),
      closedAt: r.closed_at ? new Date(r.closed_at).toISOString() : null,
      votes: votesRes.rows.map((v) => ({
        voterTokenHash: v.voter_token_hash,
        voterName: v.voter_name,
        lovedSlugs: v.loved_slugs || [],
        removedSlugs: v.removed_slugs || [],
        reason: v.reason || "Personal preference",
        comment: v.comment || "",
        createdAt: new Date(v.created_at).toISOString(),
        updatedAt: new Date(v.updated_at).toISOString(),
      })),
    };
  }

  async upsertVote(
    inviteToken: string,
    vote: Omit<PollVoteRecord, "createdAt" | "updatedAt">
  ): Promise<{ ok: true; poll: StoredPoll } | { ok: false; status: 404 | 409 | 429; error: string }> {
    const existing = await this.getPollByToken(inviteToken);
    if (!existing) return { ok: false, status: 404, error: "Poll not found" };
    if (existing.closedAt || Date.parse(existing.closesAt) <= Date.now()) {
      return { ok: false, status: 409, error: "This family poll is closed." };
    }
    const alreadyVoted = existing.votes.some((v) => v.voterTokenHash === vote.voterTokenHash);
    if (!alreadyVoted && existing.votes.length >= MAX_POLL_VOTERS) {
      return { ok: false, status: 429, error: `Poll reached the ${MAX_POLL_VOTERS}-voter limit.` };
    }

    await this.pool.query(
      `INSERT INTO poll_votes (poll_id, voter_token_hash, voter_name, loved_slugs, removed_slugs, reason, comment)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7)
       ON CONFLICT (poll_id, voter_token_hash)
       DO UPDATE SET voter_name = EXCLUDED.voter_name,
                     loved_slugs = EXCLUDED.loved_slugs,
                     removed_slugs = EXCLUDED.removed_slugs,
                     reason = EXCLUDED.reason,
                     comment = EXCLUDED.comment,
                     updated_at = NOW()`,
      [
        existing.id,
        vote.voterTokenHash,
        vote.voterName,
        JSON.stringify(vote.lovedSlugs),
        JSON.stringify(vote.removedSlugs),
        vote.reason,
        vote.comment,
      ]
    );
    const updated = await this.getPollByToken(inviteToken);
    return updated ? { ok: true, poll: updated } : { ok: false, status: 404, error: "Poll not found" };
  }

  async closePoll(inviteToken: string): Promise<boolean> {
    const res = await this.pool.query(
      `UPDATE polls SET closed_at = NOW() WHERE invite_token = $1`,
      [inviteToken]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
