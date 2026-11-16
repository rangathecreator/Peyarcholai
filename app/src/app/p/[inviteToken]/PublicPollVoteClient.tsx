"use client";

import React, { useState } from "react";

export interface PublicPollCandidate {
  slug: string;
  nameTamil: string;
  nameLatin: string;
  meaningTa: string;
  meaningEn: string;
}

export default function PublicPollVoteClient({
  inviteToken,
  candidates,
  isClosed,
}: {
  inviteToken: string;
  candidates: PublicPollCandidate[];
  isClosed: boolean;
}) {
  const [voterName, setVoterName] = useState("");
  const [lovedSlugs, setLovedSlugs] = useState<string[]>([]);
  const [removedSlugs, setRemovedSlugs] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const toggleLoved = (slug: string) => {
    setRemovedSlugs((prev) => prev.filter((s) => s !== slug));
    setLovedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleRemoved = (slug: string) => {
    setLovedSlugs((prev) => prev.filter((s) => s !== slug));
    setRemovedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/polls/${encodeURIComponent(inviteToken)}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voterName,
          lovedSlugs,
          removedSlugs,
          comment,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Could not submit your vote.");
      } else {
        setStatusMsg("✅ Your blind vote has been recorded! Only the parents can see results.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isClosed && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-900">
          This family poll is closed and no longer accepting new votes.
        </div>
      )}

      <div className="space-y-2.5">
        {candidates.map((c) => {
          const loved = lovedSlugs.includes(c.slug);
          const removed = removedSlugs.includes(c.slug);
          return (
            <div
              key={c.slug}
              className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xs"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-base font-bold text-stone-900">
                    {c.nameTamil}{" "}
                    <span className="text-sm font-semibold text-stone-600">
                      ({c.nameLatin})
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    {c.meaningTa} — {c.meaningEn}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={isClosed}
                    onClick={() => toggleLoved(c.slug)}
                    className={`min-h-[44px] rounded-xl px-3.5 text-xs font-bold transition ${
                      loved
                        ? "bg-emerald-700 text-white"
                        : "border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                    }`}
                  >
                    ♥ Love
                  </button>
                  <button
                    type="button"
                    disabled={isClosed}
                    onClick={() => toggleRemoved(c.slug)}
                    className={`min-h-[44px] rounded-xl px-3.5 text-xs font-bold transition ${
                      removed
                        ? "bg-rose-700 text-white"
                        : "border border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100"
                    }`}
                  >
                    ✕ Hard to say
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700">
            Your Name / Relationship (e.g., Ammamma, Uncle Kumar)
          </label>
          <input
            type="text"
            maxLength={60}
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            placeholder="Family Member"
            disabled={isClosed}
            className="mt-1 min-h-[44px] w-full rounded-xl border border-stone-300 px-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-700">
            Optional Note to Parents
          </label>
          <textarea
            rows={2}
            maxLength={280}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Pronunciation thoughts or blessing..."
            disabled={isClosed}
            className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-sm"
          />
        </div>

        <p className="text-[11px] text-stone-500">
          🔒 Blind Voting Privacy (DPDP 2023): Your name and note are visible only to the parents hosting this poll and are deleted 30 days after closing.
        </p>

        {errorMsg && (
          <div className="rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">
            {errorMsg}
          </div>
        )}
        {statusMsg && (
          <div className="rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
            {statusMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isClosed || submitting}
          className="min-h-[44px] w-full rounded-xl bg-amber-800 px-4 text-sm font-bold text-white hover:bg-amber-900 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Blind Family Vote"}
        </button>
      </div>
    </form>
  );
}
