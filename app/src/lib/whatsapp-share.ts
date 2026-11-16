export interface ShareableNameItem {
  slug: string;
  nameTamil?: string;
  nameLatin?: string;
}

export const MAX_WHATSAPP_SHARE_NAMES = 10;
export const MAX_WHATSAPP_MESSAGE_LENGTH = 2000;

/**
 * Builds a concise, WhatsApp-ready poll share message with Tamil + Roman names
 * and the poll invite URL, capped at MAX_WHATSAPP_SHARE_NAMES and 2000 chars (T17-5).
 */
export function buildWhatsAppPollMessage(input: {
  title: string;
  candidates: readonly ShareableNameItem[];
  inviteUrl: string;
}): string {
  const cleanTitle = String(input.title || "Our Tamil Baby Name Shortlist").trim().slice(0, 120);
  const capped = input.candidates.slice(0, MAX_WHATSAPP_SHARE_NAMES);
  const namesList = capped
    .map((c) => {
      if (c.nameTamil && c.nameLatin) return `${c.nameTamil} (${c.nameLatin})`;
      return c.nameTamil || c.nameLatin || c.slug;
    })
    .filter(Boolean)
    .join(", ");

  const footer = `\nVote here: ${input.inviteUrl}`;
  const header = `🗳️ ${cleanTitle}`;
  const namesLine = namesList ? `\nNames: ${namesList}` : "";
  const full = `${header}${namesLine}${footer}`;

  if (full.length <= MAX_WHATSAPP_MESSAGE_LENGTH) return full;
  const maxBodyLen = Math.max(0, MAX_WHATSAPP_MESSAGE_LENGTH - footer.length - 3);
  return `${header}${namesLine}`.slice(0, maxBodyLen) + "..." + footer;
}

export function buildWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Prefers native Web Share API on mobile browsers, falling back to https://wa.me/?text=...
 */
export async function sharePollOnWhatsApp(input: {
  title: string;
  candidates: readonly ShareableNameItem[];
  inviteUrl: string;
}): Promise<{ method: "web-share" | "wa-me"; url: string; message: string }> {
  const message = buildWhatsAppPollMessage(input);
  const url = buildWhatsAppShareUrl(message);

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: input.title,
        text: message,
        url: input.inviteUrl,
      });
      return { method: "web-share", url, message };
    } catch {
      // User dismissed or Web Share unavailable; fall back to wa.me
    }
  }

  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  return { method: "wa-me", url, message };
}
