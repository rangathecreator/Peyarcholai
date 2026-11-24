import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | பெயர்ச்சோலை (Peyarcholai)",
  description:
    "Contact பெயர்ச்சோலை (Peyarcholai) support, merchant details (Saranya Mohan, Namakkal), and DPDP Act 2023 Grievance Officer.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-amber-200/80 bg-white p-5 shadow-sm sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-950">
            Support &amp; Merchant Contact
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-stone-900 sm:text-3xl">
            Contact Us (தொடர்பு கொள்ள)
          </h1>
          <p className="mt-1 text-xs text-stone-600">
            We are happy to help parents with name provenance questions, dossier downloads, or payment/privacy requests.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-1.5">
            <h2 className="text-sm font-bold text-stone-900">
              📧 General &amp; Payment Support
            </h2>
            <p className="text-xs text-stone-600">
              Email us anytime; typical response within 24–48 business hours.
            </p>
            <a
              href="mailto:support@names.iniya.in"
              className="inline-flex min-h-[44px] items-center text-sm font-bold text-teal-800 hover:underline break-all"
            >
              support@names.iniya.in
            </a>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-1.5">
            <h2 className="text-sm font-bold text-stone-900">
              🏛️ Merchant Identity
            </h2>
            <p className="text-sm font-semibold text-stone-800">
              Saranya Mohan (Sole Proprietor)
            </p>
            <p className="text-xs text-stone-600">
              Namakkal, Tamil Nadu, India
            </p>
            <p className="text-[11px] text-stone-500">
              Platform: பெயர்ச்சோலை (Peyarcholai)
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1.5">
          <h2 className="text-sm font-bold text-emerald-950">
            🛡️ DPDP Act 2023 Data Privacy &amp; Grievance Officer
          </h2>
          <p className="text-xs text-stone-700">
            <strong>Saranya Mohan</strong> (Owner &amp; Data Fiduciary) · Namakkal, Tamil Nadu, India ·{" "}
            <a href="mailto:support@names.iniya.in" className="font-bold text-teal-800 hover:underline">
              support@names.iniya.in
            </a>
          </p>
          <p className="text-[11px] text-stone-600">
            For data access, correction, or erasure requests under India&apos;s DPDP Act 2023, include &ldquo;DPDP Request&rdquo; in the email subject line.
          </p>
        </div>

        <nav aria-label="Legal navigation" className="flex flex-wrap gap-2 border-t border-stone-200 pt-4">
          <Link href="/" className="inline-flex min-h-[44px] items-center rounded-xl bg-teal-800 px-4 py-2 text-xs font-bold text-white hover:bg-teal-900">
            🏠 Home Explorer
          </Link>
          <Link href="/terms" className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-amber-50">
            Terms of Service
          </Link>
          <Link href="/privacy" className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-amber-50">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-amber-50">
            Refund Policy
          </Link>
        </nav>
      </div>
    </div>
  );
}
