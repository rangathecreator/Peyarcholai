"use client";

import React, { useMemo, useState } from "react";
import { buildPronunciationGuide } from "@/lib/pronunciation";

export function PronunciationButton({
  nameTamil,
  nameLatin,
  compact = false,
}: {
  nameTamil: string;
  nameLatin: string;
  compact?: boolean;
}) {
  const guide = useMemo(
    () => buildPronunciationGuide(nameTamil, nameLatin),
    [nameTamil, nameLatin]
  );
  const [status, setStatus] = useState<string>("");

  const speak = (text: string, lang: "ta-IN" | "en-IN") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("Voice playback unavailable in this browser — use the syllable guide.");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85;
      utterance.onstart = () => setStatus(`Playing (${lang})...`);
      utterance.onend = () => setStatus("");
      utterance.onerror = () =>
        setStatus("Browser voice unavailable — use the syllable guide.");
      window.speechSynthesis.speak(utterance);
    } catch {
      setStatus("Voice playback unavailable — use the syllable guide.");
    }
  };

  return (
    <div
      className={`rounded-xl border border-amber-200/80 bg-amber-50/60 ${
        compact ? "p-2.5 text-[11px]" : "p-3.5 text-xs"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="font-bold text-stone-900">🗣️ உச்சரிப்பு &amp; அசை (Pronunciation):</span>{" "}
          <span className="font-semibold text-amber-950">{guide.formattedTamil}</span>{" "}
          <span className="text-stone-500">({guide.formattedRoman})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => speak(nameTamil, "ta-IN")}
            className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-950 hover:bg-amber-100"
          >
            🔊 தமிழ் (ta-IN)
          </button>
          <button
            type="button"
            onClick={() => speak(nameLatin, "en-IN")}
            className="rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-800 hover:bg-stone-100"
          >
            🔊 English
          </button>
        </div>
      </div>
      {status && <p className="mt-1 text-[10px] text-amber-800">{status}</p>}
    </div>
  );
}
