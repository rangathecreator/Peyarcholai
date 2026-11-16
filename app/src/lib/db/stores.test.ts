import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryPollStore, MAX_POLL_VOTERS } from './stores';

describe('T17-1 / T17-2: PollStore Contract Tests (InMemoryPollStore)', () => {
  it('creates a poll, enforces 1..10 candidates, upserts by voterTokenHash, and rejects closed polls (AC-17-06)', async () => {
    const store = new InMemoryPollStore();
    await assert.rejects(() =>
      store.createPoll({
        inviteToken: 'bad-empty',
        title: 'Empty',
        parentName: 'Parents',
        notes: '',
        candidateSlugs: [],
        closesAt: new Date(Date.now() + 86400000).toISOString(),
      })
    );

    const poll = await store.createPoll({
      inviteToken: 'tok-abc123',
      title: 'Karthigai Shortlist',
      parentName: 'Senthil',
      notes: 'Pick your top 2',
      candidateSlugs: ['yazhini', 'kavin'],
      closesAt: new Date(Date.now() + 86400000).toISOString(),
    });
    assert.equal(poll.candidateSlugs.length, 2);

    const v1 = await store.upsertVote('tok-abc123', {
      voterTokenHash: 'hash-1',
      voterName: 'Grandma',
      lovedSlugs: ['yazhini'],
      removedSlugs: [],
      reason: 'Meaning',
      comment: 'Lovely',
    });
    assert.equal(v1.ok, true);
    if (v1.ok) assert.equal(v1.poll.votes.length, 1);

    // Upsert same voterTokenHash overwrites instead of duplicating
    const v1Edit = await store.upsertVote('tok-abc123', {
      voterTokenHash: 'hash-1',
      voterName: 'Grandma',
      lovedSlugs: ['kavin'],
      removedSlugs: [],
      reason: 'Pronunciation',
      comment: 'Updated',
    });
    assert.equal(v1Edit.ok, true);
    if (v1Edit.ok) {
      assert.equal(v1Edit.poll.votes.length, 1);
      assert.deepEqual(v1Edit.poll.votes[0].lovedSlugs, ['kavin']);
    }

    // Close poll -> subsequent vote returns 409
    assert.equal(await store.closePoll('tok-abc123'), true);
    const closedRes = await store.upsertVote('tok-abc123', {
      voterTokenHash: 'hash-2',
      voterName: 'Uncle',
      lovedSlugs: ['yazhini'],
      removedSlugs: [],
      reason: 'Meaning',
      comment: '',
    });
    assert.equal(closedRes.ok, false);
    if (!closedRes.ok) assert.equal(closedRes.status, 409);
  });

  it('enforces MAX_POLL_VOTERS (50) cap', async () => {
    const store = new InMemoryPollStore();
    await store.createPoll({
      inviteToken: 'tok-cap',
      title: 'Cap Test',
      parentName: 'Parents',
      notes: '',
      candidateSlugs: ['yazhini'],
      closesAt: new Date(Date.now() + 86400000).toISOString(),
    });
    for (let i = 0; i < MAX_POLL_VOTERS; i++) {
      const r = await store.upsertVote('tok-cap', {
        voterTokenHash: `h-${i}`,
        voterName: `Voter ${i}`,
        lovedSlugs: ['yazhini'],
        removedSlugs: [],
        reason: 'Pref',
        comment: '',
      });
      assert.equal(r.ok, true);
    }
    const over = await store.upsertVote('tok-cap', {
      voterTokenHash: 'h-overflow',
      voterName: 'Extra',
      lovedSlugs: ['yazhini'],
      removedSlugs: [],
      reason: 'Pref',
      comment: '',
    });
    assert.equal(over.ok, false);
    if (!over.ok) assert.equal(over.status, 429);
  });
});
