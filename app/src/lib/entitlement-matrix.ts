import type { PeyarcholaiTier } from './auth-entitlements';

export type PaidFeatureKey = 'pronunciation_guide' | 'single_pdf_pristine' | 'family_booklet_pdf' | 'whatsapp_family_poll' | 'unlimited_ai_advisor' | 'parent_surname_resonance_full';

export interface FeatureEntitlementRule {
  feature: PaidFeatureKey;
  minTier: PeyarcholaiTier;
  labelEn: string;
  labelTa: string;
}

export const FEATURE_ENTITLEMENT_MATRIX: Record<PaidFeatureKey, FeatureEntitlementRule> = {
  pronunciation_guide: {
    feature: 'pronunciation_guide',
    minTier: 'free',
    labelEn: 'Pronunciation Audio & Syllable Guide',
    labelTa: 'உச்சரிப்பு & அசை வழிகாட்டி',
  },
  single_pdf_pristine: {
    feature: 'single_pdf_pristine',
    minTier: 'suvadi_49',
    labelEn: 'Pristine Single-Name PDF Dossier',
    labelTa: 'தூய தனிப் பெயர் PDF அறிக்கை',
  },
  family_booklet_pdf: {
    feature: 'family_booklet_pdf',
    minTier: 'kudumba_499',
    labelEn: 'Multi-Name Family Comparison Booklet',
    labelTa: 'குடும்ப ஒப்பீட்டுப் புத்தகம் PDF',
  },
  whatsapp_family_poll: {
    feature: 'whatsapp_family_poll',
    minTier: 'kudumba_499',
    labelEn: 'Blind WhatsApp Family Poll',
    labelTa: 'வாட்ஸ்அப் குடும்ப வாக்கெடுப்பு',
  },
  unlimited_ai_advisor: {
    feature: 'unlimited_ai_advisor',
    minTier: 'kudumba_499',
    labelEn: 'Unlimited AI Name Advisor',
    labelTa: 'வரம்பற்ற AI பெயர் ஆலோசகர்',
  },
  parent_surname_resonance_full: {
    feature: 'parent_surname_resonance_full',
    minTier: 'kudumba_499',
    labelEn: 'Full Parent-Surname & Initial Resonance',
    labelTa: 'தந்தை/தாய் தலைப்பெழுத்து எண் கணிதம்',
  },
};

const TIER_RANK: Record<PeyarcholaiTier, number> = {
  free: 0,
  suvadi_49: 1,
  kudumba_499: 2,
};

export function getRequiredTierForFeature(feature: PaidFeatureKey): PeyarcholaiTier {
  return FEATURE_ENTITLEMENT_MATRIX[feature].minTier;
}

export function canTierAccessFeature(tier: PeyarcholaiTier, feature: PaidFeatureKey): boolean {
  return TIER_RANK[tier] >= TIER_RANK[getRequiredTierForFeature(feature)];
}
