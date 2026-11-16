import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppPollMessage,
  buildWhatsAppShareUrl,
  MAX_WHATSAPP_MESSAGE_LENGTH,
  MAX_WHATSAPP_SHARE_NAMES,
} from './whatsapp-share';

describe('T17-5: WhatsApp Share & Message Builder', () => {
  it('formats Tamil + Roman names with invite URL and caps at 10 names', () => {
    const many = Array.from({ length: 14 }, (_, i) => ({
      slug: `name-${i + 1}`,
      nameTamil: `பெயர்${i + 1}`,
      nameLatin: `Name${i + 1}`,
    }));
    const msg = buildWhatsAppPollMessage({
      title: 'Karthigai Girl Shortlist',
      candidates: many,
      inviteUrl: 'https://peyar.donorconnect.in/p/tok123',
    });
    assert.ok(msg.includes('பெயர்1 (Name1)'));
    assert.ok(msg.includes(`பெயர்${MAX_WHATSAPP_SHARE_NAMES} (Name${MAX_WHATSAPP_SHARE_NAMES})`));
    assert.ok(!msg.includes('பெயர்11'));
    assert.ok(msg.includes('https://peyar.donorconnect.in/p/tok123'));
  });

  it('caps message length at <= 2000 chars and URL-encodes wa.me link', () => {
    const longCandidates = Array.from({ length: 10 }, (_, i) => ({
      slug: `long-${i}`,
      nameTamil: 'அ'.repeat(120),
      nameLatin: 'A'.repeat(120),
    }));
    const msg = buildWhatsAppPollMessage({
      title: 'Poll',
      candidates: longCandidates,
      inviteUrl: 'https://peyar.donorconnect.in/p/abc',
    });
    assert.ok(msg.length <= MAX_WHATSAPP_MESSAGE_LENGTH);
    assert.ok(msg.endsWith('https://peyar.donorconnect.in/p/abc'));
    const url = buildWhatsAppShareUrl(msg);
    assert.ok(url.startsWith('https://wa.me/?text='));
    assert.ok(!url.includes(' '));
  });
});
