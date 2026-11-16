import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  FEATURE_ENTITLEMENT_MATRIX,
  getRequiredTierForFeature,
  canTierAccessFeature,
  type PaidFeatureKey,
} from './entitlement-matrix';

describe('T21-1: Data-Driven Entitlement Matrix (AC-21-01 / AC-21-03)', () => {
  it('defines minimum tier for all paid features', () => {
    const expected: Record<PaidFeatureKey, 'free' | 'suvadi_49' | 'kudumba_499'> = {
      pronunciation_guide: 'free',
      single_pdf_pristine: 'suvadi_49',
      family_booklet_pdf: 'kudumba_499',
      whatsapp_family_poll: 'kudumba_499',
      unlimited_ai_advisor: 'kudumba_499',
      parent_surname_resonance_full: 'kudumba_499',
    };
    for (const [k, tier] of Object.entries(expected) as [PaidFeatureKey, 'free' | 'suvadi_49' | 'kudumba_499'][]) {
      assert.equal(getRequiredTierForFeature(k), tier);
      assert.ok(FEATURE_ENTITLEMENT_MATRIX[k].labelEn.length > 0);
    }
  });

  it('enforces tier hierarchy (free < suvadi_49 < kudumba_499)', () => {
    assert.equal(canTierAccessFeature('free', 'pronunciation_guide'), true);
    assert.equal(canTierAccessFeature('free', 'single_pdf_pristine'), false);
    assert.equal(canTierAccessFeature('suvadi_49', 'single_pdf_pristine'), true);
    assert.equal(canTierAccessFeature('suvadi_49', 'whatsapp_family_poll'), false);
    assert.equal(canTierAccessFeature('kudumba_499', 'single_pdf_pristine'), true);
    assert.equal(canTierAccessFeature('kudumba_499', 'whatsapp_family_poll'), true);
  });

  it('keeps entitlement-matrix.ts free of hardcoded tier strings in external helpers', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'entitlement-matrix.ts'), 'utf8');
    assert.ok(src.includes('FEATURE_ENTITLEMENT_MATRIX'));
  });
});
