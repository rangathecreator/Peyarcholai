import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTamilNames, getNameBySlug } from "@/lib/repository";
import { calculateNumerology } from "@/core/numerology";
import { evaluateNameScorecard } from "@/core/scorecard";
import { calculateEmpiricalRarity } from "@/lib/frequency-engine";
import { AdBanner } from "@/components/MonetizationBanner";

export const dynamicParams = true;

export async function generateStaticParams() {
  const names = getAllTamilNames().slice(0, 100);
  return names.map((n) => ({ slug: n.slug }));
}

export default async function NameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNameBySlug(slug);
  if (!item) {
    notFound();
  }

  const numPythagorean = calculateNumerology(item.nameLatin, "pythagorean");
  const numChaldean = calculateNumerology(item.nameLatin, "chaldean");
  const scorecard = evaluateNameScorecard({
    nameLatin: item.nameLatin,
    nameTamil: item.nameTamil,
    meaningEn: item.meaningEn,
    meaningTa: item.meaningTa,
    originCategory: item.originCategory,
    literaryReference: item.literaryReference,
    confidence: item.confidence,
    popularityRank: item.popularityRank,
  });

  const empiricalRarity = calculateEmpiricalRarity(
    item.nameTamil,
    item.popularityRank
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:underline"
        >
          ← Back to பெயர்ச்சோலை (Peyarcholai) Explorer
        </Link>
        <a
          href={`/api/reports/download-pdf?slug=${item.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-900 transition"
        >
          <span>📜</span>
          <span>Download Official PDF Dossier (சுவடி அறிக்கை)</span>
          <span className="rounded-md bg-amber-950/60 px-1.5 py-0.5 text-[10px] text-amber-200">
            A4 Print Ready
          </span>
        </a>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                {item.originCategory} · {item.verificationStatus}
              </span>
              {item.structuredReference?.citationScope ===
              "etymological-compound" ? (
                <span className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-900">
                  🧪 Modern Synthesis (வேர்ச்சொல் புணர்ச்சி)
                </span>
              ) : item.structuredReference?.citationScope ===
                "exact-word-in-verse" ? (
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900">
                  📜 Direct Textual Citation
                </span>
              ) : (
                <span className="rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-900">
                  📘 Attested Lexicon Root
                </span>
              )}
              {item.trendStatus && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                  🔥 {item.trendStatus.category}
                </span>
              )}
              <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-900">
                {empiricalRarity.icon} {empiricalRarity.badgeTitleTamil} ({empiricalRarity.badgeTitleEnglish})
              </span>
            </div>
            <h1 className="mt-3 text-4xl font-black text-stone-900">
              {item.nameTamil}{" "}
              <span className="text-2xl font-bold text-amber-800">
                ({item.nameLatin})
              </span>
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              <strong>6. Gender:</strong> {item.gender.toUpperCase()} ·{" "}
              <strong>13. Starting Syllable:</strong> {item.startingSyllableTa} (
              {item.startingSyllableEn}) · <strong>Rasi:</strong> {item.rasiTa} (
              {item.rasiEn})
            </p>
            {item.genderSuitabilityNote && (
              <p className="mt-1 text-xs text-stone-500">
                {item.genderSuitabilityNote}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="rounded-2xl bg-emerald-600 px-5 py-3 text-center text-white">
              <div className="text-[11px] font-semibold uppercase">
                14D Parent Score
              </div>
              <div className="text-3xl font-black">
                {scorecard.overallScore}/100
              </div>
            </div>
            <a
              href={`/api/reports/download-pdf?slug=${item.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-amber-800 hover:underline"
            >
              📄 Printable Suvadi Certificate ↗
            </a>
          </div>
        </div>

        {/* Empirical Cohort Rarity & Classroom Frequency Gauge */}
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{empiricalRarity.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                நிகழ்காலப் பயன்பாட்டு அதிர்வெண் & வகுப்பறைத் தனித்துவம் (Empirical Cohort Frequency)
              </span>
            </div>
            <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
              {empiricalRarity.observedFrequencyPercent}% Frequency
            </span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl bg-white/80 p-2.5 border border-indigo-100">
              <div className="text-[10px] uppercase font-bold text-stone-500">
                Classroom Peers (40 Students)
              </div>
              <div className="mt-1 font-bold text-indigo-950">
                ~{empiricalRarity.classroomRepetitionIndex} peers in 40-student class
              </div>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-indigo-100">
              <div className="text-[10px] uppercase font-bold text-stone-500">
                School Cohort (1,000 Students)
              </div>
              <div className="mt-1 font-bold text-indigo-950">
                ~{empiricalRarity.gradeCohortIndex} students across entire school
              </div>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-indigo-100">
              <div className="text-[10px] uppercase font-bold text-stone-500">
                Rarity Classification
              </div>
              <div className="mt-1 font-bold text-indigo-950">
                {empiricalRarity.badgeTitleEnglish}
              </div>
            </div>
          </div>
          <p className="mt-2.5 text-xs text-indigo-900 leading-relaxed">
            💡 <strong>பெற்றோர் வழிகாட்டல்:</strong> {empiricalRarity.parentAdviceTamil} ({empiricalRarity.parentAdviceEnglish})
          </p>
        </div>

        {/* 1 & 3: Meaning, Root Breakdown & Granular Literary Reference */}
        <div className="mt-6 space-y-3 rounded-2xl bg-amber-50/90 p-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
              1. தமிழ் பொருள் & வேர்ச்சொல் (Primary Meaning & Etymology)
            </div>
            <p className="mt-1 text-base font-semibold text-stone-900">
              {item.meaningTa}
            </p>
            <p className="mt-1 text-sm text-stone-800">{item.meaningEn}</p>
            {(item.literalMeaningEn || item.derivedMeaningEn) && (
              <div className="mt-2 grid grid-cols-1 gap-2 rounded-xl border border-amber-200 bg-white/80 p-3 text-xs sm:grid-cols-2">
                <div>
                  <span className="font-bold text-stone-800">
                    📖 Literal Root Meaning (நேரடி வேர்ச்சொல் பொருள்):
                  </span>
                  <div className="mt-0.5 text-stone-700">
                    {item.literalMeaningEn || item.meaningEn}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-amber-900">
                    ✨ Derived / Poetic Meaning (வழிப்பொருள்):
                  </span>
                  <div className="mt-0.5 text-stone-700">
                    {item.derivedMeaningEn || item.meaningEn}
                  </div>
                </div>
              </div>
            )}
            {item.etymologyRoot && (
              <p className="mt-2 text-xs font-semibold text-amber-900">
                🌱 Root Breakdown (பகுபத உறுப்பிலக்கணம்): {item.etymologyRoot}
              </p>
            )}
          </div>

          <div className="space-y-2.5 border-t border-amber-200/80 pt-3 text-xs text-stone-700">
            <div className="font-bold uppercase tracking-wider text-amber-900">
              3. இலக்கிய சான்று & அகராதி மூலங்கள் (Citation & Lexicon Verification —{" "}
              {Math.round(item.confidence * 100)}% Confidence)
            </div>
            {item.confidence >= 0.8 && item.structuredReference ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* 3A: Ancient Textual Citation */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                  <div className="font-bold text-emerald-950">
                    3A. 📜 Ancient Textual Citation (பண்டைய இலக்கியச் சான்று)
                  </div>
                  {item.structuredReference.citationScope ===
                  "exact-word-in-verse" ? (
                    <div className="mt-1.5 space-y-1 text-emerald-900">
                      <p>
                        <strong>Work:</strong> {item.structuredReference.workTa}{" "}
                        ({item.structuredReference.workEn})
                      </p>
                      <p>
                        <strong>Section:</strong>{" "}
                        {item.structuredReference.sectionOrKandam} —{" "}
                        {item.structuredReference.chapterOrPadalam}
                      </p>
                      <p>
                        <strong>Verse #:</strong>{" "}
                        {item.structuredReference.verseOrSongNumber}
                      </p>
                      {item.structuredReference.lineTitleOrQuote && (
                        <blockquote className="mt-1 border-l-2 border-emerald-600 pl-2 italic text-emerald-950">
                          &ldquo;{item.structuredReference.lineTitleOrQuote}
                          &rdquo;
                        </blockquote>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-stone-700">
                      {item.structuredReference.citationScope ===
                      "etymological-compound"
                        ? "None — Synthesized modern compound name from authentic Tamil roots (FMT-01: Modern Synthesis; no ancient verse claim)."
                        : "Standalone root attested in the Madras University Tamil Lexicon (no specific Sangam poem verse claimed)."}
                    </p>
                  )}
                </div>

                {/* 3B: Lexicon Source URLs */}
                <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3">
                  <div className="font-bold text-sky-950">
                    3B. 📘 Lexicon Headword Source URLs (தமிழ் அகராதி மூலங்கள்)
                  </div>
                  <p className="mt-1 text-[11px] text-sky-900">
                    <strong>Attribution:</strong>{" "}
                    {item.sourceAttributionType ||
                      item.structuredReference.verificationTier}
                  </p>
                  {item.structuredReference.citationNote && (
                    <p className="mt-1 text-[11px] text-stone-700">
                      ℹ️ {item.structuredReference.citationNote}
                    </p>
                  )}
                  {item.structuredReference.sourceWebsite && (
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <a
                        href={item.structuredReference.sourceWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-sky-300 bg-white px-2.5 py-1 font-semibold text-sky-900 hover:bg-sky-100"
                      >
                        🔗 Primary Lexicon Entry ↗
                      </a>
                      {item.structuredReference.lexiconWebsite &&
                        item.structuredReference.lexiconWebsite !==
                          item.structuredReference.sourceWebsite && (
                          <a
                            href={item.structuredReference.lexiconWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-sky-300 bg-white px-2.5 py-1 font-semibold text-sky-900 hover:bg-sky-100"
                          >
                            🔗 Secondary Root / Corpus Link ↗
                          </a>
                        )}
                    </div>
                  )}
                </div>
              </div>
            ) : item.confidence >= 0.8 ? (
              <p className="mt-1">
                {item.literaryReference} ({item.sourceCitation})
              </p>
            ) : (
              <p className="mt-1 italic text-stone-500">
                Citation withheld (requires ≥ 80% meaning & source verification confidence).
              </p>
            )}
          </div>
        </div>

        {/* 2: Multi-Language Meanings */}
        {item.multilingualMeanings && item.multilingualMeanings.length > 0 && (
          <div className="mt-6 rounded-2xl border border-stone-200 p-5">
            <h2 className="text-sm font-bold text-stone-900">
              2. பன்மொழிப் பொருள் (Multi-Language Meanings & Cross-Language Safety Check)
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {item.multilingualMeanings.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-stone-50 p-3 text-xs text-stone-700"
                >
                  <div className="font-bold text-stone-900">
                    {m.language} — <span className="text-amber-800">{m.script}</span>
                  </div>
                  <p className="mt-0.5">{m.meaning}</p>
                  {m.falseFriendWarning && (
                    <p className="mt-1 font-semibold text-emerald-700">
                      ✅ Safety: {m.falseFriendWarning}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4: Dual Numerology Breakdown (Default Pythagorean + Chaldean) */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900">
                4A. Standard Letter Numerology (Pythagorean A–Z 1–9)
              </h2>
              <span className="rounded bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                DEFAULT METHOD
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-amber-800">
              Number {numPythagorean.nameNumber}{" "}
              <span className="text-sm font-normal text-stone-600">
                (Total Sum: {numPythagorean.compoundNumber})
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {numPythagorean.letterBreakdown.map((l, idx) => (
                <span
                  key={idx}
                  className="rounded border border-amber-300 bg-white px-2 py-0.5 text-xs font-bold text-stone-800"
                >
                  {l.char}={l.value}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-600">
              Ruling Planet: <strong>{numPythagorean.planet.planetTa}</strong> (
              {numPythagorean.planet.planetEn})
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 p-4">
            <h2 className="text-sm font-bold text-stone-900">
              4B. Chaldean Numerology (Cheiro 1–8 System)
            </h2>
            <p className="mt-1 text-2xl font-black text-stone-800">
              Number {numChaldean.nameNumber}{" "}
              <span className="text-sm font-normal text-stone-500">
                (Compound: {numChaldean.compoundNumber})
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {numChaldean.letterBreakdown.map((l, idx) => (
                <span
                  key={idx}
                  className="rounded border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-semibold text-stone-700"
                >
                  {l.char}={l.value}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-600">
              Planet: <strong>{numChaldean.planet.planetTa}</strong> (
              {numChaldean.planet.planetEn})
            </p>
          </div>
        </div>

        {/* 5, 7, 8, 9, 10, 11, 12, 14 Parent Decision Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {item.culturalContext && (
            <div className="rounded-2xl border border-stone-200 p-4 text-xs">
              <h3 className="font-bold text-stone-900">
                5. Religion, Community & Sangam Geography
              </h3>
              <p className="mt-1">
                <strong>Religion / Tradition:</strong>{" "}
                {item.culturalContext.religion?.join(", ") || "Pure Tamil"}
              </p>
              <p className="mt-1">
                <strong>Community Usage:</strong>{" "}
                {item.culturalContext.communityTraditions?.join(", ") || "Pan-Tamil"}
              </p>
              <p className="mt-1">
                <strong>Sangam Tinai & Region:</strong>{" "}
                {item.culturalContext.geographicalSignificance?.join(" · ") || "Tamil Nadu"}
              </p>
            </div>
          )}

          {item.easeOfCalling && (
            <div className="rounded-2xl border border-stone-200 p-4 text-xs">
              <h3 className="font-bold text-stone-900">
                7. Ease of Calling ({item.easeOfCalling.overallScore}/100) · Illustrative (formula-based)
              </h3>
              <p className="mt-1">
                <strong>Syllable Guide:</strong>{" "}
                <span className="font-bold text-amber-800">
                  {item.easeOfCalling.phoneticGuide}
                </span>
              </p>
              <p className="mt-1">
                Tamil Native: <strong>{item.easeOfCalling.nativeTamilScore}%</strong> ·
                Pan-India: <strong>{item.easeOfCalling.panIndiaScore}%</strong> ·
                Global: <strong>{item.easeOfCalling.globalScore}%</strong>
              </p>
              <p className="mt-1 text-stone-600">{item.easeOfCalling.callOutNote}</p>
            </div>
          )}

          {item.spellingAssessment && (
            <div className="rounded-2xl border border-stone-200 p-4 text-xs">
              <h3 className="font-bold text-stone-900">
                8. Chances of Misspell: {item.spellingAssessment.riskLevel} Risk
              </h3>
              <p className="mt-1">
                <strong>Official Spelling:</strong>{" "}
                {item.spellingAssessment.officialRecommendedSpelling}
              </p>
              <p className="mt-1">
                <strong>Possible Variants:</strong>{" "}
                {item.spellingAssessment.commonMisspellings?.join(", ") || "None"}
              </p>
              <p className="mt-1 text-stone-600">
                {item.spellingAssessment.reason}
              </p>
            </div>
          )}

          {item.uniqueness && item.trendStatus && (
            <div className="rounded-2xl border border-stone-200 p-4 text-xs">
              <h3 className="font-bold text-stone-900">
                9 & 10. Regional Uniqueness & Trend Status · Illustrative (formula-based)
              </h3>
              <p className="mt-1">
                <strong>Rarity Band:</strong> {item.uniqueness.band} (TN{" "}
                {item.uniqueness.tnEstimatePercentile}th percentile · Diaspora{" "}
                {item.uniqueness.diasporaEstimatePercentile}th percentile)
              </p>
              <p className="mt-1">
                <strong>Trend Category:</strong> {item.trendStatus.category}
              </p>
              <p className="mt-1 text-stone-600">{item.trendStatus.trendDriver}</p>
            </div>
          )}

          {item.nicknames && item.documentFit && (
            <div className="rounded-2xl border border-stone-200 p-4 text-xs sm:col-span-2">
              <h3 className="font-bold text-stone-900">
                11, 12 & 14. Nicknames, Official Document Fit & Sibling Pairs
              </h3>
              <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div>
                  <strong>Affectionate Nicknames:</strong>{" "}
                  {item.nicknames?.join(", ") || item.nameLatin}
                </div>
                <div>
                  <strong>Aadhaar / Passport Preview:</strong>{" "}
                  {item.documentFit.sampleWithInitial} (
                  {item.documentFit.tamilAksharaCount} Tamil aksharas)
                </div>
                <div>
                  <strong>Sibling / Twin Pairs:</strong>{" "}
                  {item.siblingPairSuggestions?.join(", ") || "None"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AdBanner slotId={`DETAIL-${item.slug.toUpperCase()}`} />
    </div>
  );
}
