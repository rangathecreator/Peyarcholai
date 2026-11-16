import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  issueCreatorSecret,
  hashSecret,
  verifyCreatorSecret,
  resolvePollViewer,
  sanitizeVoterInput,
} from './poll-access';

describe('Interim creator-secret access control (T17-0, AC-17-01/02/05)', () => {
  it('issueCreatorSecret returns 32 lowercase hex chars (128-bit) and is unique', () => {
    const s = issueCreatorSecret();
    assert.match(s, /^[0-9a-f]{32}$/);
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) seen.add(issueCreatorSecret());
    assert.equal(seen.size, 1000);
  });

  it('hashSecret is SHA-256 lowercase hex, deterministic', () => {
    assert.equal(
      hashSecret('abc'),
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
    assert.equal(hashSecret('abc'), hashSecret('abc'));
  });

  it('verifyCreatorSecret accepts only the matching secret', () => {
    const secret = issueCreatorSecret();
    const stored = hashSecret(secret);
    assert.equal(verifyCreatorSecret(stored, secret), true);
    assert.equal(verifyCreatorSecret(stored, secret + 'x'), false);
    assert.equal(verifyCreatorSecret(stored, issueCreatorSecret()), false);
  });

  it('verifyCreatorSecret fails closed on missing/empty/non-string input', () => {
    const stored = hashSecret('s3cret');
    assert.equal(verifyCreatorSecret(undefined, 's3cret'), false);
    assert.equal(verifyCreatorSecret('', 's3cret'), false);
    assert.equal(verifyCreatorSecret(stored, undefined), false);
    assert.equal(verifyCreatorSecret(stored, null), false);
    assert.equal(verifyCreatorSecret(stored, ''), false);
    assert.equal(verifyCreatorSecret(stored, 123 as unknown as string), false);
  });

  it('verifyCreatorSecret does not accept the stored hash itself as the secret', () => {
    const secret = issueCreatorSecret();
    const stored = hashSecret(secret);
    assert.equal(verifyCreatorSecret(stored, stored), false);
  });

  it('resolvePollViewer: creator only with the right secret; ?viewer=creator style claims never matter', () => {
    const secret = issueCreatorSecret();
    const poll = { creatorSecretHash: hashSecret(secret) };
    assert.equal(resolvePollViewer(poll, secret), 'creator');
    assert.equal(resolvePollViewer(poll, 'creator'), 'participant');
    assert.equal(resolvePollViewer(poll, null), 'participant');
    assert.equal(resolvePollViewer({}, secret), 'participant'); // legacy poll without hash => never creator
  });
});

describe('sanitizeVoterInput (T17-0, AC-17-06)', () => {
  const allowed = ['yazhini', 'kavin', 'iniya'];

  it('trims and caps voterName at 60 chars, defaults to "Family Member"', () => {
    assert.equal(sanitizeVoterInput({ voterName: '  Ammamma  ' }, allowed).voterName, 'Ammamma');
    assert.equal(sanitizeVoterInput({ voterName: 'x'.repeat(200) }, allowed).voterName.length, 60);
    assert.equal(sanitizeVoterInput({}, allowed).voterName, 'Family Member');
    assert.equal(sanitizeVoterInput({ voterName: '   ' }, allowed).voterName, 'Family Member');
    assert.equal(sanitizeVoterInput({ voterName: 42 }, allowed).voterName, 'Family Member');
  });

  it('caps comment at 280 chars and strips control characters', () => {
    const c = sanitizeVoterInput({ comment: 'a\u0000b\u0007c' + 'z'.repeat(500) }, allowed).comment;
    assert.equal(c.length, 280);
    assert.ok(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(c));
    assert.equal(sanitizeVoterInput({}, allowed).comment, '');
  });

  it('keeps only allowed slugs, lowercased, deduplicated; ignores non-arrays and non-strings', () => {
    const r = sanitizeVoterInput(
      { lovedSlugs: ['Yazhini', 'yazhini', 'evil', 5, null], removedSlugs: ['KAVIN', 'nope'] },
      allowed
    );
    assert.deepEqual(r.lovedSlugs, ['yazhini']);
    assert.deepEqual(r.removedSlugs, ['kavin']);
    assert.deepEqual(sanitizeVoterInput({ lovedSlugs: 'yazhini' }, allowed).lovedSlugs, []);
  });

  it('a slug cannot be both loved and removed: loved wins', () => {
    const r = sanitizeVoterInput({ lovedSlugs: ['kavin'], removedSlugs: ['kavin', 'iniya'] }, allowed);
    assert.deepEqual(r.lovedSlugs, ['kavin']);
    assert.deepEqual(r.removedSlugs, ['iniya']);
  });
});
