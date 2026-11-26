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

  const speak = (lang: "ta-IN" | "en-IN") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("Voice playback unavailable in this browser — use the syllable guide.");
      return;
    }
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const voices = synth.getVoices();

      if (lang === "ta-IN") {
        const tamilVoice = voices.find((v) => v.lang.toLowerCase().startsWith("ta"));
        if (tamilVoice) {
          const utterance = new SpeechSynthesisUtterance(guide.tamilSpeechText || nameTamil);
          utterance.voice = tamilVoice;
          utterance.lang = tamilVoice.lang;
          utterance.rate = 0.85;
          utterance.onstart = () => setStatus(`Playing Tamil (${tamilVoice.name})...`);
          utterance.onend = () => setStatus("");
          utterance.onerror = () =>
            setStatus("Tamil voice playback failed — use the syllable guide.");
          synth.speak(utterance);
          return;
        }
        // Fallback when OS/browser has no Tamil TTS voice installed:
        // avoid letting an English voice mangle raw Tamil Unicode.
        const enInVoice =
          voices.find((v) => v.lang.toLowerCase() === "en-in") ||
          voices.find((v) => v.lang.toLowerCase().startsWith("en"));
        const phoneticText = guide.romanSyllables.join(" ");
        const utterance = new SpeechSynthesisUtterance(phoneticText || nameLatin);
        if (enInVoice) utterance.voice = enInVoice;
        utterance.lang = enInVoice?.lang || "en-IN";
        utterance.rate = 0.82;
        utterance.onstart = () =>
          setStatus(
            "No Tamil (ta-IN) voice installed on this device — playing phonetic guide instead."
          );
        utterance.onend = () => setStatus("");
        utterance.onerror = () =>
          setStatus("Voice playback unavailable — use the syllable guide.");
        synth.speak(utterance);
        return;
      }

      const enVoice =
        voices.find((v) => v.lang.toLowerCase() === "en-in") ||
        voices.find((v) => v.lang.toLowerCase().startsWith("en"));
      const utterance = new SpeechSynthesisUtterance(nameLatin);
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = enVoice?.lang || "en-IN";
      utterance.rate = 0.85;
      utterance.onstart = () => setStatus(`Playing (${utterance.lang})...`);
      utterance.onend = () => setStatus("");
      utterance.onerror = () =>
        setStatus("Browser voice unavailable — use the syllable guide.");
      synth.speak(utterance);
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
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => speak("ta-IN")}
            className="inline-flex min-h-[40px] sm:min-h-[36px] items-center rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-100"
          >
            🔊 தமிழ் (ta-IN)
          </button>
          <button
            type="button"
            onClick={() => speak("en-IN")}
            className="inline-flex min-h-[40px] sm:min-h-[36px] items-center rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-100"
          >
            🔊 English
          </button>
        </div>
      </div>
      {status && <p className="mt-1 text-[10px] text-amber-800">{status}</p>}
    </div>
  );
}
