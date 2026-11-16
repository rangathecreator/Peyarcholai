import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  NUMEROLOGY_METHOD_CITATIONS,
  NAKSHATRA_CANONICAL_ATTRIBUTES,
} from './book-citations';

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
});
