import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildQueryAndPrompt } from './query-generator';
import { calculateEmpiricalRarity } from './frequency-engine';
import { buildPronunciationGuide } from './pronunciation';
import {
  sanitizePollForViewer,
  validatePollCandidateSlugs,
  MAX_POLL_CANDIDATES,
} from './poll-security';
import {
  canDownloadPristinePdf,
  canHostWhatsAppFamilyPoll,
  UserSubscriptionSession,
  TIER_DEFINITIONS,
} from './auth-entitlements';
import { filterTamilNames, getCategoryCounts } from './repository';

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

  it('differentiates names meaningfully without explicit popularityRank (Task 20)', () => {
    const tnShort = calculateEmpiricalRarity('கவி', undefined, {
      nameLatin: 'Kavi',
      nameCategory: 'tamilnadu_usage',
    });
    const rareCompound = calculateEmpiricalRarity('அகழ்மங்கை', undefined, {
      nameLatin: 'Agazhmangai',
      nameCategory: 'pure_tamil',
      originCategory: 'Modern Tamil',
    });
    const sangamShort = calculateEmpiricalRarity('யாழ்', undefined, {
      nameLatin: 'Yaazh',
      nameCategory: 'pure_tamil',
      originCategory: 'Classical / Sangam Tamil',
    });

    assert.notEqual(tnShort.observedFrequencyPercent, rareCompound.observedFrequencyPercent);
    assert.notEqual(sangamShort.observedFrequencyPercent, rareCompound.observedFrequencyPercent);
    assert.ok(tnShort.cohortCountPer10k > rareCompound.cohortCountPer10k);
    assert.ok(rareCompound.oneInClassrooms > tnShort.oneInClassrooms);
    assert.ok(rareCompound.methodologyNoteEn.length > 10);
  });

  it('computes human-readable classroom collision probability and whole-number school counts (Task 36 / Design 08)', () => {
    const balanced = calculateEmpiricalRarity('யாழினி', 25);
    assert.ok(balanced.classroomCollisionPercent > 0 && balanced.classroomCollisionPercent < 100);
    assert.match(balanced.classroomDisplayEn, /About 1 in \d+–\d+ classrooms \(\d+(\.\d+)?–\d+(\.\d+)?% chance\) · Rough guide \(Grade C\)/);
    assert.ok(balanced.classroomDisplayTa.includes('வகுப்பறைகளில்'));
    assert.equal(Number.isInteger(balanced.schoolDisplayCount), true);
    assert.ok(balanced.schoolDisplayCount >= 1);
    assert.ok(balanced.band.low < balanced.band.point && balanced.band.point < balanced.band.high);
    assert.equal(balanced.band.grade, 'C');

    // AC-20-01: identical structural features must yield identical estimates (no hash jitter)
    const a = calculateEmpiricalRarity('கமலா', undefined, { nameLatin: 'Kamala', nameCategory: 'pure_tamil', originCategory: 'Classical / Sangam Tamil' });
    const b = calculateEmpiricalRarity('கமலா', undefined, { nameLatin: 'Kamala', nameCategory: 'pure_tamil', originCategory: 'Classical / Sangam Tamil' });
    assert.equal(a.cohortCountPer10k, b.cohortCountPer10k);

    // AC-20-03: 1 - (1 - p)^(m - 1) property check for m = 20 (otherPeers = 19)
    const expectedCollision = Number(((1 - Math.pow(1 - 25 / 10000, 19)) * 100).toFixed(1));
    assert.equal(balanced.classroomCollisionPercent, expectedCollision);

    const popular = calculateEmpiricalRarity('முருகன்', 400);
    assert.match(popular.classroomDisplayEn, /~\d+ same-gender peers per class/);
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

describe('Pronunciation & Syllable Breakdown Guide (Task 33)', () => {
  it('splits Tamil aksharas and Roman syllables deterministically', () => {
    const guide = buildPronunciationGuide('யாழினி', 'Yazhini');
    assert.deepEqual(guide.tamilSyllables, ['யா', 'ழி', 'னி']);
    assert.equal(guide.formattedTamil, 'யா · ழி · னி');
    assert.ok(guide.romanSyllables.length >= 2);
  });
});

describe('Blind Family Vote-Out Poll Security (Task 17 — SG-03)', () => {
  it('strips other voters choices and comments for non-creator participants', () => {
    const samplePoll = {
      id: 'p1',
      token: 'tok-1',
      title: 'Test Poll',
      parentName: 'Parents',
      candidateSlugs: ['yazhini', 'kavin'],
      notes: '',
      createdAt: '2026-11-15T00:00:00Z',
      votes: [
        {
          id: 'v1',
          voterName: 'Aunt',
          removedSlugs: ['kavin'],
          lovedSlugs: ['yazhini'],
          reason: 'Meaning',
          comment: 'Love Yazhini',
          createdAt: '2026-11-15T00:01:00Z',
        },
      ],
    };

    const participantView = sanitizePollForViewer(samplePoll, 'participant');
    assert.equal(participantView.blindVoting, true);
    assert.equal(participantView.totalVotesCount, 1);
    assert.equal(participantView.votes.length, 0);

    const creatorView = sanitizePollForViewer(samplePoll, 'creator');
    assert.equal(creatorView.votes.length, 1);
  });

  it('enforces MAX 10 shortlisted names per poll', () => {
    const eleven = Array.from({ length: 11 }, (_, i) => `name-${i + 1}`);
    const invalid = validatePollCandidateSlugs(eleven);
    assert.equal(invalid.valid, false);
    assert.ok(invalid.error?.includes(String(MAX_POLL_CANDIDATES)));

    const ten = eleven.slice(0, 10);
    const valid = validatePollCandidateSlugs(ten);
    assert.equal(valid.valid, true);
    assert.equal(valid.slugs.length, 10);
  });

  it('deduplicates repeated slugs and rejects empty or non-array poll candidates', () => {
    const dupes = validatePollCandidateSlugs(['Yazhini', 'yazhini', 'Kavin', '  ']);
    assert.equal(dupes.valid, true);
    assert.deepEqual(dupes.slugs, ['yazhini', 'kavin']);

    const empty = validatePollCandidateSlugs([]);
    assert.equal(empty.valid, false);

    const nonArray = validatePollCandidateSlugs('yazhini');
    assert.equal(nonArray.valid, false);
  });
});

describe('Task 39: Single-Pass Repository Filter & O(1) Category Counts', () => {
  it('returns cached category counts matching full catalog length', () => {
    const counts = getCategoryCounts();
    assert.equal(
      counts.pure_tamil + counts.tamilnadu_usage + counts.other_heritage,
      counts.total
    );
    assert.ok(counts.total >= 150000);
  });

  it('executes multi-criteria single-pass filter under SS-03 budget (< 30 ms)', () => {
    // Warm up seed catalog & V8 JIT
    const query = {
      gender: 'girl',
      nameCategory: 'pure_tamil',
      minEaseScore: 80,
      maxMisspellRisk: 'low',
    };
    const warmup = filterTamilNames(query);
    assert.ok(warmup.length > 0);

    const samples: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      filterTamilNames(query);
      samples.push(performance.now() - t0);
    }
    samples.sort((a, b) => a - b);
    const medianMs = samples[2];
    assert.ok(medianMs < 30, `Expected < 30ms median single-pass filter, got ${medianMs.toFixed(2)}ms`);
  });
});

