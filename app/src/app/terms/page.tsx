import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | பெயர்ச்சோலை (Peyarcholai)",
  description:
    "Terms of Service for பெயர்ச்சோலை (Peyarcholai) — operated by Saranya Mohan, Namakkal, Tamil Nadu, India.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-amber-200/80 bg-white p-5 shadow-sm sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-950">
            Legal &amp; Merchant Terms
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-stone-900 sm:text-3xl">
            Terms of Service
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Last updated: November 2026 · Operated by <strong>Saranya Mohan</strong> (Sole Proprietor), Namakkal, Tamil Nadu, India
          </p>
        </div>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            1. Acceptance &amp; Cultural / Informational Nature
          </h2>
          <p>
            By accessing or using <strong>பெயர்ச்சோலை (Peyarcholai)</strong> (<code>peyar.donorconnect.in</code>), you agree to these Terms of Service. All astrology (Natchathiram/Padam), numerology (Pythagorean, Chaldean, Katapayadi), cohort rarity estimates, and AI-assisted naming insights are provided strictly for cultural, traditional, and informational guidance. Parents and guardians are always the final decision-makers.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            2. Free Explorer &amp; Optional Paid Passes
          </h2>
          <p>
            Core name exploration across 150,000+ entries is free to browse. Optional one-time digital passes — <strong>Suvadi Nilai (₹49)</strong> and <strong>Kudumba Nool Family Pass (₹499)</strong> — unlock ad-free viewing, watermark-free printable dossiers, full parent-surname resonance breakdowns, and collaborative family polls.
          </p>
          <p>
            Applicable taxes, if any, are calculated and charged on top of the listed tariff rate at checkout.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            3. Intellectual Property &amp; Classical Attribution
          </h2>
          <p>
            Classical Tamil lexicon references link to public-domain and scholarly resources including the University of Madras Tamil Lexicon (DSAL Chicago) and Tamil Virtual Academy. Original software, scoring engines, editorial summaries, and page layouts belong to Peyarcholai (Saranya Mohan). Automated bulk scraping or commercial redistribution of the catalog is prohibited.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            4. Governing Law &amp; Support
          </h2>
          <p>
            These Terms are governed by the laws of India, subject to the jurisdiction of courts in <strong>Namakkal, Tamil Nadu</strong>. For questions or support, email{" "}
            <a href="mailto:support@names.iniya.in" className="font-semibold text-teal-800 hover:underline">
              support@names.iniya.in
            </a>
            .
          </p>
        </section>

        <nav aria-label="Legal navigation" className="flex flex-wrap gap-2 border-t border-stone-200 pt-4">
          <Link href="/" className="inline-flex min-h-[44px] items-center rounded-xl bg-teal-800 px-4 py-2 text-xs font-bold text-white hover:bg-teal-900">
            🏠 Home Explorer
          </Link>
          <Link href="/privacy" className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-amber-50">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-amber-50">
            Refund Policy
          </Link>
          <Link href="/contact" className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-amber-50">
            Contact Us
          </Link>
        </nav>
      </div>
    </div>
  );
}
