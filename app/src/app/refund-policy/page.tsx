import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | பெயர்ச்சோலை (Peyarcholai)",
  description:
    "7-day refund policy for duplicate charges or verified technical failures on பெயர்ச்சோலை (Peyarcholai).",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-amber-200/80 bg-white p-5 shadow-sm sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-950">
            Payment &amp; Refund Policy
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-stone-900 sm:text-3xl">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Merchant: <strong>Saranya Mohan</strong> (Sole Proprietor), Namakkal, Tamil Nadu, India
          </p>
        </div>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            1. 7-Day Refund Eligibility
          </h2>
          <p>
            Refunds are issued within <strong>7 calendar days</strong> of payment <strong>only</strong> for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Duplicate charges for the same pass or order; or</li>
            <li>Verified technical failures where a paid PDF dossier or Family Poll pass could not be generated or delivered.</li>
          </ul>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            2. Non-Refundable Digital Deliveries
          </h2>
          <p>
            Because Suvadi Nilai (₹49) and Kudumba Nool (₹499) provide instant digital access, printable dossiers, and poll links, purchases are non-refundable once the digital report or poll pass has been successfully generated and delivered.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-stone-700">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            3. How to Request a Refund
          </h2>
          <p>
            Email{" "}
            <a href="mailto:support@names.iniya.in" className="font-bold text-teal-800 hover:underline">
              support@names.iniya.in
            </a>{" "}
            within 7 days of the transaction with your payment reference ID, transaction date, and a brief description of the duplicate charge or technical issue. Approved refunds are processed back to the original payment method within 5–7 business days.
          </p>
        </section>

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
          <Link href="/contact" className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-amber-50">
            Contact Us
          </Link>
        </nav>
      </div>
    </div>
  );
}
