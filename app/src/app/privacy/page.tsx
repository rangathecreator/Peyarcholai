import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy (DPDP Act 2023) | பெயர்ச்சோலை (Peyarcholai)",
  description:
    "Privacy Policy and India DPDP Act 2023 disclosures for பெயர்ச்சோலை (Peyarcholai).",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-amber-200/80 bg-white p-5 shadow-sm sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-950">
            India DPDP Act 2023 Compliant
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-stone-900 sm:text-3xl">
            Privacy Policy
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Data Fiduciary: <strong>Saranya Mohan</strong> (Sole Proprietor), Namakkal, Tamil Nadu, India
          </p>
        </div>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            1. Data We Collect &amp; Minimize
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Stateless Calculations:</strong> Birth-star (Natchathiram) and numerology inputs are computed on the fly without storing identifiable child profiles.
            </li>
            <li>
              <strong>Local Shortlist:</strong> Your shortlisted names are stored locally in your browser (<code>localStorage</code>) unless you explicitly create a Family Poll.
            </li>
            <li>
              <strong>Blind Family Polls:</strong> Voter names and comments are visible only to the parents who created the poll and are scheduled for automatic deletion 30 days after the poll closes.
            </li>
            <li>
              <strong>Anonymous Cohort Micro-Survey:</strong> Optional classroom-collision responses store zero personal identifiers and are only aggregated publicly when k-anonymity (&ge; 5 responses) is met.
            </li>
          </ul>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            2. Children&apos;s Data Protection
          </h2>
          <p>
            Peyarcholai is designed for adult parents and family members. We do not knowingly collect, store, profile, or sell personally identifiable information of minors.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            3. Cookies &amp; Advertising Disclosure
          </h2>
          <p>
            We use strictly necessary cookies/local storage for poll voting integrity and preference state. Free-tier pages may display clearly labeled sponsorship or third-party ad placements; paid passes are ad-free.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            4. Your Rights &amp; DPDP Grievance Officer
          </h2>
          <p>
            Under India&apos;s Digital Personal Data Protection (DPDP) Act 2023, you have the right to access, correct, or request erasure of any personal data you have submitted.
          </p>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-stone-800 space-y-1">
            <p><strong>Grievance Officer:</strong> Saranya Mohan (Owner &amp; Data Fiduciary)</p>
            <p><strong>Location:</strong> Namakkal, Tamil Nadu, India</p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@names.iniya.in" className="font-bold text-teal-800 hover:underline">
                support@names.iniya.in
              </a>
            </p>
          </div>
        </section>

        <nav aria-label="Legal navigation" className="flex flex-wrap gap-2 border-t border-stone-200 pt-4">
          <Link href="/" className="inline-flex min-h-[44px] items-center rounded-xl bg-teal-800 px-4 py-2 text-xs font-bold text-white hover:bg-teal-900">
            🏠 Home Explorer
          </Link>
          <Link href="/terms" className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-amber-50">
            Terms of Service
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
