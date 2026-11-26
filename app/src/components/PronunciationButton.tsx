"use client";

import React, { useMemo, useRef, useState } from "react";
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
  const [playingLang, setPlayingLang] = useState<"ta-IN" | "en-IN" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakBrowserFallback = (lang: "ta-IN" | "en-IN") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("Voice playback unavailable — use the syllable & IPA guide.");
      setPlayingLang(null);
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
          utterance.onend = () => {
            setStatus("");
            setPlayingLang(null);
          };
          utterance.onerror = () => {
            setStatus("Tamil voice playback failed — use the syllable & IPA guide.");
            setPlayingLang(null);
          };
          synth.speak(utterance);
          return;
        }
        // Speak smooth continuous nameLatin (never space-separated letters that spell "Ay roo vee")
        const enInVoice =
          voices.find((v) => v.lang.toLowerCase() === "en-in") ||
          voices.find((v) => v.lang.toLowerCase().startsWith("en"));
        const utterance = new SpeechSynthesisUtterance(nameLatin);
        if (enInVoice) utterance.voice = enInVoice;
        utterance.lang = enInVoice?.lang || "en-IN";
        utterance.rate = 0.82;
        utterance.onstart = () =>
          setStatus("Offline device fallback (no local Tamil voice) — playing smooth guide.");
        utterance.onend = () => {
          setStatus("");
          setPlayingLang(null);
        };
        utterance.onerror = () => {
          setStatus("Voice playback unavailable — use the syllable & IPA guide.");
          setPlayingLang(null);
        };
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
      utterance.onend = () => {
        setStatus("");
        setPlayingLang(null);
      };
      utterance.onerror = () => {
        setStatus("Browser voice unavailable — use the syllable guide.");
        setPlayingLang(null);
      };
      synth.speak(utterance);
    } catch {
      setStatus("Voice playback unavailable — use the syllable guide.");
      setPlayingLang(null);
    }
  };

  const speak = async (lang: "ta-IN" | "en-IN") => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setPlayingLang(lang);
    setStatus(lang === "ta-IN" ? "Loading native Tamil audio..." : "Loading English audio...");

    const text = lang === "ta-IN" ? guide.tamilSpeechText || nameTamil : nameLatin;
    const ttsUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`;

    try {
      const audio = new Audio(ttsUrl);
      audioRef.current = audio;
      audio.onplaying = () =>
        setStatus(lang === "ta-IN" ? "Playing native Tamil (ta-IN)..." : "Playing English (en-IN)...");
      audio.onended = () => {
        setStatus("");
        setPlayingLang(null);
      };
      audio.onerror = () => {
        // Tier 2/3 graceful fallback to browser Web Speech API
        speakBrowserFallback(lang);
      };
      await audio.play();
    } catch {
      speakBrowserFallback(lang);
    }
  };

  return (
    <div
      className={`rounded-xl border border-amber-200/80 bg-amber-50/60 ${
        compact ? "p-2.5 text-[11px]" : "p-3.5 text-xs"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="font-bold text-stone-900">🗣️ உச்சரிப்பு &amp; அசை (Pronunciation):</span>{" "}
          <span className="font-semibold text-amber-950">{guide.formattedTamil}</span>{" "}
          <span className="text-stone-600">({guide.formattedRoman})</span>
          {guide.ipa && (
            <span className="ml-1.5 font-mono text-[11px] text-teal-800">{guide.ipa}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={playingLang === "ta-IN"}
            onClick={() => void speak("ta-IN")}
            className="inline-flex min-h-[40px] sm:min-h-[36px] items-center rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-60"
          >
            🔊 தமிழ் (ta-IN)
          </button>
          <button
            type="button"
            disabled={playingLang === "en-IN"}
            onClick={() => void speak("en-IN")}
            className="inline-flex min-h-[40px] sm:min-h-[36px] items-center rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-60"
          >
            🔊 English
          </button>
        </div>
      </div>
      {!compact && guide.specialSoundTips.length > 0 && (
        <p className="mt-1.5 text-[11px] text-stone-600">
          💡 {guide.specialSoundTips.join(" · ")}
        </p>
      )}
      {status && <p className="mt-1 text-[10px] text-amber-800">{status}</p>}
    </div>
  );
}
