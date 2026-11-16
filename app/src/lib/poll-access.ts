import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export function issueCreatorSecret(): string {
  return randomBytes(16).toString('hex');
}

export function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

export function verifyCreatorSecret(storedHash: string | undefined, presented: string | null | undefined): boolean {
  if (typeof storedHash !== 'string' || storedHash.length === 0 || typeof presented !== 'string' || presented.length === 0) {
    return false;
  }
  try {
    const a = Buffer.from(storedHash, 'hex');
    const b = Buffer.from(hashSecret(presented), 'hex');
    if (a.length === 0 || a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function resolvePollViewer(poll: { creatorSecretHash?: string }, presentedSecret: string | null | undefined): 'creator' | 'participant' {
  if (poll.creatorSecretHash && verifyCreatorSecret(poll.creatorSecretHash, presentedSecret)) return 'creator';
  return 'participant';
}

export function sanitizeVoterInput(
  input: { voterName?: unknown; comment?: unknown; lovedSlugs?: unknown; removedSlugs?: unknown },
  allowedSlugs: readonly string[]
): { voterName: string; comment: string; lovedSlugs: string[]; removedSlugs: string[] } {
  const cleanName =
    typeof input.voterName === 'string'
      ? input.voterName.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, 60)
      : '';
  const voterName = cleanName.length > 0 ? cleanName : 'Family Member';
  const comment =
    typeof input.comment === 'string'
      ? input.comment.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, 280)
      : '';

  const allowedSet = new Set(allowedSlugs.map((s) => s.toLowerCase()));
  const normalizeList = (raw: unknown): string[] => {
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of raw) {
      if (typeof item !== 'string') continue;
      const slug = item.trim().toLowerCase();
      if (slug && allowedSet.has(slug) && !seen.has(slug)) {
        seen.add(slug);
        out.push(slug);
      }
    }
    return out;
  };

  const lovedSlugs = normalizeList(input.lovedSlugs);
  const lovedSet = new Set(lovedSlugs);
  const removedSlugs = normalizeList(input.removedSlugs).filter((s) => !lovedSet.has(s));
  return { voterName, comment, lovedSlugs, removedSlugs };
}
