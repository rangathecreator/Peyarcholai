import type { Metadata } from "next";
import Link from "next/link";
import { ContextualDisclaimer } from "@/components/ContextualDisclaimer";

export const metadata: Metadata = {
  title: "ஏன் பெயர்ச்சோலை? (Why Peyarcholai) | Peyarcholai vs ChatGPT & Portals",
  description:
    "Discover why Tamil parents choose Peyarcholai over ChatGPT, Gemini, and generic baby-naming portals: 150,000+ provenance-checked names, Tolkappiyam sandhi, Dual Numerology, 27-Nakshatra Padam, and Family Vote-Out Polls.",
};

const SIX_ADVANTAGES = [
  {
    icon: "📜",
    title: "1. Zero Citation Hallucinations (DSAL & Classical Gate)",
    problem:
      "Generic AI chatbots (ChatGPT / Gemini) routinely invent fake Tirukkural or Silappathikaram quotes and mislabel modern coinages as Sangam Tamil.",
    solution:
      "Programmatic CIT-01 substring verification, strict ≥ 80% confidence gate, explicit 🧪 Modern Synthesis vs 📜 Classical Text badges, and clickable Madras University Tamil Lexicon (DSAL) links.",
  },
  {
    icon: "✍️",
    title: "2. Tolkappiyam Sandhi & Gender Accuracy",
    problem:
      "AI prompts often mash Tamil roots together ungrammatically or assign masculine -ன் endings to baby girl names.",
    solution:
      "Automated Tolkappiyam Udambadumei sandhi rules and corpus-wide gender audits (0 gender discrepancies across 150,000+ active records).",
  },
  {
    icon: "🔢",
    title: "3. Deterministic Dual Numerology + Katapayadi",
    problem:
      "LLMs frequently miscount letter sums, confuse Chaldean vs Pythagorean tables, and hallucinate compound interpretations.",
    solution:
      "Unit-tested deterministic Dual Numerology (Chaldean + Pythagorean + Katapayadi Tamil cipher) with compound meanings (10–75) and spelling variant optimizer.",
  },
  {
    icon: "🌟",
    title: "4. Authentic 27 Natchathiram × 4 Padam Astrology",
    problem:
      "Chatbots guess birth-star syllables from memory without computing sidereal Moon longitude.",
    solution:
      "Built-in Lahiri (Chitrapaksha) Ayanamsa sidereal Moon calculator mapping exact Natchathiram & Padam syllables directly to catalog filters.",
  },
  {
    icon: "🏷️",
    title: "5. Honest 3-Tier Cultural Transparency",
    problem:
      "Generic portals mix Sanskrit, Arabic, English, and Pure Tamil names together without clear origin labels.",
    solution:
      "Three explicit tiers: தூய தமிழ் (Pure Tamil), தமிழ்நாட்டு வழக்கு (Tamil Nadu Usage), and பிற மரபு (Other Heritage) — zero guesswork.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "6. Family Shortlist, Polls & Printable Heritage Dossier",
    problem:
      "Chat threads cannot run blind family voting polls, score global passport/document fit, or generate an A4 keepsake.",
    solution:
      "Built-in 7-Dimension Practical Scorecard, Classroom Cohort Rarity Index, WhatsApp Family Vote-Out Polls, and printable Heritage Dossiers.",
  },
];

const COMPARISON_ROWS = [
  {
    capability: "Catalog Scale & Cultural Tiers",
    peyarcholai: "150,024+ active across 3 clear cultural tiers",
    ai: "Unbounded, unverified (~20 per prompt)",
    portals: "10k–40k names, noisy duplicates, heavy ads",
  },
  {
    capability: "Tamil Lexicon & Provenance Gate",
    peyarcholai: "✅ DSAL Madras Lexicon links + CIT-01 verse gate",
    ai: "❌ Frequent hallucinated verse/etymology claims",
    portals: "❌ Uncited crowd-sourced meanings",
  },
  {
    capability: "Tolkappiyam Sandhi & Script Purity",
    peyarcholai: "✅ Automated sandhi + zero Devanagari/boilerplate",
    ai: "❌ Frequent morphological errors",
    portals: "❌ Many spelling & transliteration typos",
  },
  {
    capability: "Dual Numerology + Katapayadi",
    peyarcholai: "✅ Deterministic Chaldean + Pythagorean + Katapayadi",
    ai: "❌ Frequent arithmetic mistakes",
    portals: "⚠️ Basic single-method calculator only",
  },
  {
    capability: "27 Natchathiram × 4 Padam",
    peyarcholai: "✅ Sidereal Moon longitude + syllable filter",
    ai: "⚠️ Prone to Padam syllable errors",
    portals: "⚠️ Static list, weak filtering",
  },
  {
    capability: "7-Dimension Practical Scorecard",
    peyarcholai: "✅ Pronunciation ease, global portability, document fit",
    ai: "❌ Subjective prose only",
    portals: "❌ None",
  },
  {
    capability: "Classroom Cohort Rarity Index",
    peyarcholai: "✅ Multi-factor frequency & 40-student class estimate",
    ai: "❌ None",
    portals: "❌ None",
  },
  {
    capability: "Family Consensus & Printable Dossier",
    peyarcholai: "✅ Shortlist + WhatsApp Poll + A4 Heritage Dossier",
    ai: "❌ Copy-paste markdown only",
    portals: "❌ Ad-heavy, pop-up cluttered",
  },
];

export default function WhyPeyarcholaiPage() {
  return (
    <div className="space-y-10 pb-10">
      {/* Hero Section */}
      <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 sm:p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100/80 px-3 py-1 text-xs font-bold text-amber-950">
            ✨ ஏன் பெயர்ச்சோலை? · Why Parents Choose Peyarcholai
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Not Just Another Name List or AI Chatbot — A Verified Tamil Naming Workspace.
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-stone-700">
            For Tamil-heritage and global Indian parents, choosing a baby&apos;s name balances{" "}
            <strong>classical Tamil etymology</strong>, <strong>Natchathiram &amp; Numerology</strong>,{" "}
            <strong>global pronunciation</strong>, and <strong>family consensus</strong>. See how
            Peyarcholai compares against generic AI search and ad-cluttered portals.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-900"
            >
              🔍 Explore 150,000+ Names Free
            </Link>
            <Link
              href="/docs"
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl border border-amber-300 bg-white px-5 py-2.5 text-sm font-bold text-amber-900 transition hover:bg-amber-50"
            >
              📖 Read Complete User Guide
            </Link>
          </div>
        </div>
      </section>

      {/* 6 Pillars vs ChatGPT / Gemini */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Why Direct AI Search (ChatGPT / Gemini) Falls Short
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Generic LLMs guess meanings, invent verses, and miscalculate numerology. Peyarcholai
            enforces deterministic verification at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SIX_ADVANTAGES.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="text-2xl">{item.icon}</div>
                <h3 className="text-base font-bold text-stone-900">{item.title}</h3>
                <p className="rounded-lg bg-rose-50/70 p-2.5 text-xs text-rose-950">
                  <strong>Generic AI Risk:</strong> {item.problem}
                </p>
                <p className="rounded-lg bg-emerald-50/70 p-2.5 text-xs text-emerald-950">
                  <strong>Peyarcholai Fix:</strong> {item.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor Matrix */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Side-by-Side Comparison Matrix
          </h2>
          <p className="text-[11px] font-medium text-amber-800 sm:hidden">
            ← Swipe horizontally to compare →
          </p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-xs">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-amber-50/70 text-stone-900">
                <th className="sticky left-0 z-10 bg-amber-50 p-3.5 font-bold">Capability</th>
                <th className="p-3.5 font-extrabold text-amber-950">
                  Peyarcholai (பெயர்ச்சோலை)
                </th>
                <th className="p-3.5 font-bold text-stone-700">ChatGPT / Gemini</th>
                <th className="p-3.5 font-bold text-stone-700">Indian Naming Portals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.capability} className="hover:bg-stone-50/60">
                  <td className="sticky left-0 z-10 bg-white p-3.5 font-semibold text-stone-800">{row.capability}</td>
                  <td className="p-3.5 font-medium text-emerald-900 bg-emerald-50/30">
                    {row.peyarcholai}
                  </td>
                  <td className="p-3.5 text-stone-600">{row.ai}</td>
                  <td className="p-3.5 text-stone-600">{row.portals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing & Value Tiers */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Transparent Tiers Built for Real Families
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Explore and filter the full catalog free. Upgrade only when you want printable
            keepsake dossiers or collaborative family voting.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Free Explorer
            </div>
            <div className="text-3xl font-extrabold text-stone-900">₹0</div>
            <p className="text-xs text-stone-600">
              Full search across 150,024+ names, 27-Nakshatra Padam finder, Dual Numerology, and
              7-Dimension Scorecard.
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-stone-300 py-2 text-center text-xs font-bold text-stone-800 hover:bg-stone-50"
            >
              Start Exploring Free
            </Link>
          </div>

          <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/40 p-6 shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
              சுவடி நிலை · Suvadi Nilai
            </div>
            <div className="text-3xl font-extrabold text-stone-900">
              ₹49 <span className="text-xs font-medium text-stone-500">one-time</span>
            </div>
            <p className="text-xs text-stone-700">
              Unlock ad-free browsing, watermark-free A4 Printable Heritage &amp; Numerology
              Dossiers, and priority PDF export.
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-amber-800 py-2 text-center text-xs font-bold text-white hover:bg-amber-900"
            >
              Upgrade Inside Explorer
            </Link>
          </div>

          <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 p-6 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                குடும்ப நூல் · Kudumba Nool
              </span>
              <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                Best for Families
              </span>
            </div>
            <div className="text-3xl font-extrabold text-stone-900">
              ₹499 <span className="text-xs font-medium text-stone-500">family pass</span>
            </div>
            <p className="text-xs text-stone-700">
              Everything in Suvadi Nilai plus AI Name Advisor, WhatsApp Shortlist &amp; Family
              Vote-Out Polls, and multi-name keepsake exports.
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-emerald-700 py-2 text-center text-xs font-bold text-white hover:bg-emerald-800"
            >
              Unlock Family Pass
            </Link>
          </div>
        </div>
      </section>

      <div className="space-y-2">
        <ContextualDisclaimer variant="astrology" />
        <ContextualDisclaimer variant="frequency" />
      </div>
    </div>
  );
}
