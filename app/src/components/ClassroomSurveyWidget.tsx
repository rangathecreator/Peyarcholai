"use client";

import { useEffect, useState } from "react";

interface SurveyApiState {
  kAnonymityMet: boolean;
  sampleSize?: number;
  collisionRatePercent?: number;
  grade: "A" | "B" | "C";
  gradeBSource?: string | null;
}

export function ClassroomSurveyWidget({
  slug,
  nameTamil,
  nameLatin,
  initialGrade,
}: {
  slug: string;
  nameTamil: string;
  nameLatin: string;
  initialGrade: "A" | "B" | "C";
}) {
  const [survey, setSurvey] = useState<SurveyApiState>({
    kAnonymityMet: false,
    grade: initialGrade,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const storageKey = `pc_survey_${slug}`;

  const refreshSurvey = async () => {
    try {
      const res = await fetch(`/api/survey?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) return;
      const data = (await res.json()) as SurveyApiState;
      setSurvey(data);
    } catch {
      // keep initial grade silently
    }
  };

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === "1") {
        setSubmitted(true);
      }
    } catch {
      // ignore storage errors
    }
    void refreshSurvey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleVote = async (hadSameNameInClass: boolean) => {
    if (submitted || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameSlug: slug,
          hadSameNameInClass,
          classSize: 40,
        }),
      });
      if (res.ok) {
        try {
          localStorage.setItem(storageKey, "1");
        } catch {
          // ignore storage errors
        }
        setSubmitted(true);
        await refreshSurvey();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-indigo-200/80 bg-white/90 p-3 text-xs space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold text-indigo-950">
          🏫 Help Calibrate Grade-A Classroom Data (Zero PII)
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            survey.grade === "A"
              ? "bg-emerald-100 text-emerald-900"
              : survey.grade === "B"
              ? "bg-sky-100 text-sky-900"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          Current Evidence: Grade {survey.grade}
        </span>
      </div>

      {survey.kAnonymityMet && typeof survey.collisionRatePercent === "number" && (
        <p className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-900">
          📊 Live Parent Survey ({survey.sampleSize} anonymous responses):{" "}
          <strong>{survey.collisionRatePercent}%</strong> reported another {nameLatin} in a ~40-student class.
        </p>
      )}

      {submitted ? (
        <p className="rounded-lg bg-emerald-50 px-2.5 py-2 text-[11px] font-semibold text-emerald-800">
          ✓ Thank you! Anonymous classroom observation recorded (zero PII). Names upgrade to Grade A at 30+ responses.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-stone-700">
            Have you seen another <strong>{nameTamil} ({nameLatin})</strong> in a ~40-student school class?
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleVote(true)}
              className="min-h-[44px] rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-950 transition hover:bg-amber-100 disabled:opacity-50"
            >
              Yes — Seen in class
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleVote(false)}
              className="min-h-[44px] rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-950 transition hover:bg-emerald-100 disabled:opacity-50"
            >
              No — Unique in class
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassroomSurveyWidget;
