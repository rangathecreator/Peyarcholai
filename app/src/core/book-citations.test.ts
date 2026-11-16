import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  NUMEROLOGY_METHOD_CITATIONS,
  NAKSHATRA_CANONICAL_ATTRIBUTES,
} from './book-citations';
import { calculateKatapayadiNumber } from './numerology';

describe('T22-1: Book Citation Schema & Public-Domain Attribution (AC-22-01)', () => {
  it('every numerology citation has author, title, year, edition, and publicDomainBasis', () => {
    for (const key of ['chaldean', 'pythagorean', 'katapayadi'] as const) {
      const cit = NUMEROLOGY_METHOD_CITATIONS[key];
      assert.ok(cit.author && cit.author.length > 0, `${key} missing author`);
      assert.ok(cit.title && cit.title.length > 0, `${key} missing title`);
      assert.ok(typeof cit.year === 'number' || (typeof cit.year === 'string' && cit.year.length > 0), `${key} missing year`);
      assert.ok(cit.edition && cit.edition.length > 0, `${key} missing edition`);
      assert.ok(cit.publicDomainBasis && cit.publicDomainBasis.length > 0, `${key} missing publicDomainBasis`);
    }
  });

  it('retains all 27 canonical Nakshatra attribute records', () => {
    assert.equal(Object.keys(NAKSHATRA_CANONICAL_ATTRIBUTES).length, 27);
  });

  it('T22-2: verifies >= 20 documented Tamil Katapayadi Sankhya examples (AC-22-02)', () => {
    const cases: Array<[string, number, number]> = [
      ['கவி', 5, 5],         // க(1) + வ(4) = 5
      ['தமிழ்', 10, 1],      // த(3) + ம(2) + ழ(5) = 10 -> 1
      ['யாழினி', 14, 5],     // ய(1) + ழ(5) + ன(8) = 14 -> 5
      ['மதி', 5, 5],         // ம(2) + த(3) = 5
      ['கதிரவன்', 18, 9],    // க(1) + த(3) + ர(2) + வ(4) + ன(8) = 18 -> 9
      ['நிலா', 7, 7],        // ந(4) + ல(3) = 7
      ['மலர்', 7, 7],        // ம(2) + ல(3) + ர(2) = 7
      ['அருள்', 8, 8],       // ர(2) + ள(6) = 8
      ['இனியா', 9, 9],       // ன(8) + ய(1) = 9
      ['கலை', 4, 4],         // க(1) + ல(3) = 4
      ['வளவன்', 18, 9],      // வ(4) + ள(6) + வ(4) + ன(8)? Wait: 4+6+4+8=22 -> let's check actual sum
      ['தமிழன்', 18, 9],     // த(3) + ம(2) + ழ(5) + ன(8) = 18 -> 9
      ['பொழில்', 9, 9],      // ப(1) + ழ(5) + ல(3) = 9
      ['மணி', 4, 4],         // ம(2) + ண(2) = 4
      ['பரிதி', 6, 6],       // ப(1) + ர(2) + த(3) = 6
      ['கயல்', 5, 5],        // க(1) + ய(1) + ல(3) = 5
      ['மயில்', 6, 6],       // ம(2) + ய(1) + ல(3) = 6
      ['வான்மதி', 11, 2],    // வ(4) + ன(8)? 4+8+2+3=17 -> check actual sum below
      ['நல்வழி', 16, 7],     // ந(4) + ல(3) + வ(4) + ழ(5) = 16 -> 7
      ['செங்கதிர்', 11, 2],  // ச(3) + ங(2) + க(1) + த(3) + ர(2) = 11 -> 2
    ];
    // Ensure exact Katapayadi consonant sums for all 20 documented examples
    const adjusted: Array<[string, number, number]> = cases.map(([w, c, s]) => {
      if (w === 'வளவன்') return [w, 22, 4]; // வ(4)+ள(6)+வ(4)+ன(8) = 22 -> 4
      if (w === 'வான்மதி') return [w, 17, 8]; // வ(4)+ன(8)+ம(2)+த(3) = 17 -> 8
      return [w, c, s];
    });
    assert.ok(adjusted.length >= 20);
    for (const [word, expectedCompound, expectedSingle] of adjusted) {
      const res = calculateKatapayadiNumber(word);
      assert.equal(res.compound, expectedCompound, `${word} compound`);
      assert.equal(res.single, expectedSingle, `${word} single`);
    }
  });

  it('AC-20-04: every constant in frequency-priors.json has source and lastReviewed', () => {
    const priors = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'frequency-priors.json'), 'utf8')
    );
    for (const section of ['categoryPriorsPer10k', 'lengthFactors', 'phoneticFactors', 'bandWidthFactor']) {
      for (const [k, entry] of Object.entries(priors[section]) as [string, { source?: string; lastReviewed?: string }][]) {
        assert.ok(entry.source && entry.source.length > 0, `${section}.${k} missing source`);
        assert.ok(entry.lastReviewed && entry.lastReviewed.length > 0, `${section}.${k} missing lastReviewed`);
      }
    }
  });
});
