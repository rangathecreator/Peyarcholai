import React from "react";

export type DisclaimerVariant = "astrology" | "frequency" | "ai-advisor" | "lexicon";

const DISCLAIMER_COPY: Record<
  DisclaimerVariant,
  { icon: string; title: string; body: string }
> = {
  astrology: {
    icon: "🪐",
    title: "Cultural & Informational Notice",
    body: "Natchathiram, Padam, and Numerology calculations (Chaldean, Pythagorean, Katapayadi) are provided for cultural, traditional, and informational purposes only. Parents and families are always the final decision-makers; these insights do not constitute deterministic life predictions or professional advice.",
  },
  frequency: {
    icon: "📊",
    title: "Rough Guide (Grade C) — Not an Official Count",
    body: "Cohort frequency bands and same-gender classroom sharing odds (40-student class, ~20 same-gender peers) are heuristic Grade C structural estimates from category priors, syllable length, and phonetic patterns—not official civil birth registry statistics.",
  },
  "ai-advisor": {
    icon: "🤖",
    title: "AI-Assisted Suggestions",
    body: "AI Name Advisor responses are generated/ranked using automated linguistic rules and AI models. Please verify final spelling, pronunciation, and family preference before official birth registration.",
  },
  lexicon: {
    icon: "📘",
    title: "Lexicon Attribution",
    body: "Lexicon definitions and headword references link to external academic resources (University of Madras Tamil Lexicon via DSAL Chicago and Tamil Virtual Academy) for verification and educational attribution.",
  },
};

export function ContextualDisclaimer({
  variant,
  className = "",
}: {
  variant: DisclaimerVariant;
  className?: string;
}) {
  const item = DISCLAIMER_COPY[variant];
  return (
    <aside
      role="note"
      aria-label={item.title}
      className={`rounded-xl border border-stone-200/80 bg-stone-50/90 px-3.5 py-2.5 text-[11px] leading-relaxed text-stone-600 ${className}`}
    >
      <span className="font-semibold text-stone-700">
        {item.icon} {item.title}:
      </span>{" "}
      {item.body}
    </aside>
  );
}
