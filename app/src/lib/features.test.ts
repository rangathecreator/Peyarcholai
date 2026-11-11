import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildQueryAndPrompt } from './query-generator';
import { calculateEmpiricalRarity } from './frequency-engine';
import {
  canDownloadPristinePdf,
  canHostWhatsAppFamilyPoll,
  UserSubscriptionSession,
  TIER_DEFINITIONS,
} from './auth-entitlements';

describe('Visual Query & AI Prompt Generator (Task 7)', () => {
  it('builds deterministic filters and linguistic prompt with constraints', () => {
    const payload = buildQueryAndPrompt({
      gender: 'girl',
      startingLetters: ['க', 'வி'],
      targetNumerologyNumber: 5,
      isNativeTamilOnly: true,
      minPronunciationScore: 85,
      allowedSpellingRisk: 'low',
      multilingualConnotationSafe: true,
      fatherName: 'செங்குட்டுவன்',
      motherName: 'கண்ணகி',
      elderSiblingNames: ['யாழினி'],
    });

    // Verify deterministic filter properties
    assert.equal(payload.deterministicFilter.gender, 'girl');
    assert.deepEqual(payload.deterministicFilter.startingLetters, ['க', 'வி']);
    assert.equal(payload.deterministicFilter.numerologyNumber, 5);
    assert.equal(payload.deterministicFilter.isNativeTamilOnly, true);
    assert.equal(payload.deterministicFilter.minConfidence, 0.85);
    assert.equal(payload.deterministicFilter.maxSpellingRisk, 'low');
    assert.ok(payload.activeConstraintCount >= 7);

    // Verify synthesized prompt contents
    assert.ok(payload.aiLinguisticPrompt.includes('பெண் (Girl)'));
    assert.ok(payload.aiLinguisticPrompt.includes('க, வி'));
    assert.ok(payload.aiLinguisticPrompt.includes('Number 5'));
    assert.ok(payload.aiLinguisticPrompt.includes('செங்குட்டுவன்'));
    assert.ok(payload.aiLinguisticPrompt.includes('யாழினி'));
  });

  it('handles empty / default constraints gracefully', () => {
    const payload = buildQueryAndPrompt({});
    assert.equal(payload.deterministicFilter.isNativeTamilOnly, true);
    assert.equal(payload.deterministicFilter.minConfidence, 0.85);
    assert.equal(payload.activeConstraintCount, 0);
    assert.ok(payload.aiLinguisticPrompt.includes('Peyarcholai'));
  });
});

describe('Empirical Name Frequency & Cohort Rarity Scoring (Task 8)', () => {
  it('correctly scores Ultra Rare Gem (<0.02%)', () => {
    const rarity = calculateEmpiricalRarity('யாழினி', 1.5);
    assert.equal(rarity.rarityBand, 'ultra_rare');
    assert.equal(rarity.badgeTitleTamil, 'தனித்துவப் பொக்கிஷம்');
    assert.equal(rarity.icon, '💎');
    assert.ok(rarity.observedFrequencyPercent < 0.02);
    assert.ok(rarity.classroomRepetitionIndex < 0.05);
  });

  it('correctly scores Distinctive Classic (0.02% - 0.10%)', () => {
    const rarity = calculateEmpiricalRarity('கவின்', 5);
    assert.equal(rarity.rarityBand, 'distinctive');
    assert.equal(rarity.badgeTitleTamil, 'தனித்துவச் செம்மொழிப் பெயர்');
    assert.equal(rarity.icon, '🌟');
    assert.ok(rarity.observedFrequencyPercent >= 0.02 && rarity.observedFrequencyPercent <= 0.10);
  });

  it('correctly scores Balanced Classic (0.11% - 0.50%)', () => {
    const rarity = calculateEmpiricalRarity('கார்த்திக்', 25);
    assert.equal(rarity.rarityBand, 'balanced');
    assert.equal(rarity.badgeTitleTamil, 'மிதமான பாரம்பரியப் பயன்பாடு');
    assert.equal(rarity.icon, '🌿');
  });

  it('correctly scores Popular High-Frequency Classic (>0.50%)', () => {
    const rarity = calculateEmpiricalRarity('முருகன்', 80);
    assert.equal(rarity.rarityBand, 'popular');
    assert.equal(rarity.badgeTitleTamil, 'பரவலான புகழ்பெற்ற பெயர்');
    assert.equal(rarity.icon, '🏛️');
    assert.ok(rarity.observedFrequencyPercent > 0.50);
  });
});

describe('Subscription Entitlements & Cultural Tiers (Task 1 & Task 4)', () => {
  it('verifies tier definitions in Tamil', () => {
    assert.equal(TIER_DEFINITIONS.free.tamilTitle, 'அறிமுகம் / தொடக்க நிலை');
    assert.equal(TIER_DEFINITIONS.suvadi_49.tamilTitle, 'சுவடி நிலை (Suvadi Nilai)');
    assert.equal(TIER_DEFINITIONS.kudumba_499.tamilTitle, 'குடும்பச் சோலை / மகுட நிலை (Kudumba Cholai)');
  });

  it('enforces PDF download entitlement gates', () => {
    const freeSession: UserSubscriptionSession = {
      userId: 'usr_free',
      displayName: 'Free User',
      tier: 'free',
      expiresAt: null,
      allowedDossierDownloads: 0,
      hasWhatsAppPollingAccess: false,
      hasUnlimitedAiAdvisor: false,
    };
    assert.equal(canDownloadPristinePdf(freeSession), false);

    const suvadiSession: UserSubscriptionSession = {
      userId: 'usr_suvadi',
      displayName: 'Suvadi Paid User',
      tier: 'suvadi_49',
      expiresAt: new Date(Date.now() + 86400000 * 14).toISOString(),
      allowedDossierDownloads: 3,
      hasWhatsAppPollingAccess: false,
      hasUnlimitedAiAdvisor: false,
    };
    assert.equal(canDownloadPristinePdf(suvadiSession), true);

    // Expired Suvadi session
    const expiredSuvadiSession: UserSubscriptionSession = {
      ...suvadiSession,
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    };
    assert.equal(canDownloadPristinePdf(expiredSuvadiSession), false);
  });

  it('enforces WhatsApp collaborative voting entitlement gates', () => {
    const suvadiSession: UserSubscriptionSession = {
      userId: 'usr_suvadi',
      displayName: 'Suvadi User',
      tier: 'suvadi_49',
      expiresAt: new Date(Date.now() + 86400000 * 14).toISOString(),
      allowedDossierDownloads: 3,
      hasWhatsAppPollingAccess: false,
      hasUnlimitedAiAdvisor: false,
    };
    // Suvadi does not have WhatsApp polling access
    assert.equal(canHostWhatsAppFamilyPoll(suvadiSession), false);

    const kudumbaSession: UserSubscriptionSession = {
      userId: 'usr_kudumba',
      displayName: 'Kudumba User',
      tier: 'kudumba_499',
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
      allowedDossierDownloads: 999,
      hasWhatsAppPollingAccess: true,
      hasUnlimitedAiAdvisor: true,
    };
    assert.equal(canHostWhatsAppFamilyPoll(kudumbaSession), true);
  });
});

