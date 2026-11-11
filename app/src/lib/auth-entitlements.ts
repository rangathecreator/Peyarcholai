/**
 * பெயர்ச்சோலை (Peyarcholai) — Subscription Entitlement & Access Control
 * Enforces the 3 Tamil Subscription Tiers:
 * 1. அறிமுகம் / தொடக்க நிலை (Free Discovery Pass)
 * 2. சுவடி நிலை (₹49 Sacred Palm-Leaf 14-Day Decision Pass)
 * 3. குடும்பச் சோலை / மகுட நிலை (₹499 Family Crown 30-Day Pass)
 */

export type PeyarcholaiTier = 'free' | 'suvadi_49' | 'kudumba_499';

export interface UserSubscriptionSession {
  userId: string;
  displayName: string;
  email?: string;
  phoneNumber?: string;
  tier: PeyarcholaiTier;
  expiresAt: string | null; // ISO Date
  allowedDossierDownloads: number;
  hasWhatsAppPollingAccess: boolean;
  hasUnlimitedAiAdvisor: boolean;
}

export const TIER_DEFINITIONS = {
  free: {
    id: 'free',
    tamilTitle: 'அறிமுகம் / தொடக்க நிலை',
    englishTitle: 'Free Discovery Pass',
    priceInr: 0,
    validityDays: 3650,
    features: ['20,700+ தமிழ்ப் பெயர் தேடல்', '27 நட்சத்திரப் பொருத்தங்கள்', 'அடிப்படை எண் கணிதம்'],
  },
  suvadi_49: {
    id: 'suvadi_49',
    tamilTitle: 'சுவடி நிலை (Suvadi Nilai)',
    englishTitle: '14-Day Sacred Palm-Leaf Decision Pass',
    priceInr: 49,
    validityDays: 14,
    features: [
      '3 பெயர்களுக்கான முழு 14-பரிமாண ஆய்வு அறிக்கை',
      'அச்சிடக்கூடிய தூய சான்றிதழ் PDF (Watermark-Free)',
      'பாஸ்போர்ட் பொருத்த ஆய்வு & அதிகாரப்பூர்வ முத்திரை',
    ],
  },
  kudumba_499: {
    id: 'kudumba_499',
    tamilTitle: 'குடும்பச் சோலை / மகுட நிலை (Kudumba Cholai)',
    englishTitle: '30-Day Family Crown Pass',
    priceInr: 499,
    validityDays: 30,
    features: [
      'உறவினர்களுக்கான பிரத்யேக வாட்ஸ்அப் வாக்கெடுப்பு (30 நாட்கள்)',
      'நேரடி வாக்கெடுப்புத் தரவரிசை & குடும்ப முடிவெடுத்தல்',
      'வரம்பற்ற AI தமிழ் ஆலோசகர் (OmniRoute Multi-Model)',
      'அனைத்து 14D ஆவணங்களும் அச்சிடக்கூடிய PDF பதிவிறக்கம்',
    ],
  },
};

/**
 * Checks whether a user has permission to download full watermark-free PDFs.
 */
export function canDownloadPristinePdf(session: UserSubscriptionSession | null): boolean {
  if (!session) return false;
  if (session.tier === 'suvadi_49' || session.tier === 'kudumba_499') {
    if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
      return false; // Expired
    }
    return true;
  }
  return false;
}

/**
 * Checks whether a user has permission to host WhatsApp collaborative voting.
 */
export function canHostWhatsAppFamilyPoll(session: UserSubscriptionSession | null): boolean {
  if (!session) return false;
  if (session.tier === 'kudumba_499') {
    if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
      return false; // Expired
    }
    return true;
  }
  return false;
}
