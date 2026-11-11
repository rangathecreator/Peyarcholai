"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Reusable Ad Slot + DPDP Consent Banner + Feature-Flagged Subscription Hook
 * Per Product Owner Decisions (doc 12 §4.1):
 * - Ads enabled from day one on SEO / directory pages
 * - Subscription paywall hooks built in, kept disabled until subscriber threshold is met
 */

export function AdBanner({
  slotId,
  label = "Sponsored · தமிழ் குடும்ப நல விளம்பரம்",
}: {
  slotId: string;
  label?: string;
}) {
  const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS !== "false";
  if (!adsEnabled) return null;

  return (
    <div
      data-ad-slot={slotId}
      className="my-4 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 px-4 py-3 text-center shadow-sm"
    >
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-amber-800/70">
        <span>{label}</span>
        <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-[10px]">
          AdSlot #{slotId}
        </span>
      </div>
      <div className="mt-1 flex flex-col items-center justify-center gap-1 sm:flex-row sm:justify-between">
        <p className="text-xs font-medium text-stone-700">
          🌱 <strong>பெயர்ச்சோலை பண்பாட்டுப் பதிப்பு</strong> — தூய தமிழ் மரபில் குழந்தையின் எதிர்காலத்தை ஒளிரச் செய்வோம்.
        </p>
        <Link
          href="/docs"
          className="inline-flex shrink-0 items-center rounded-lg bg-amber-700 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-800"
        >
          பயனர் வழிகாட்டி →
        </Link>
      </div>
    </div>
  );
}

export function DpdpConsentBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("namingguru_dpdp_consent");
    if (!saved) {
      setAccepted(false);
    }
  }, []);

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-700 bg-stone-900/95 px-4 py-3 text-white shadow-2xl backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-xs leading-relaxed text-stone-200">
          🔒 <strong>DPDP Act 2023 Privacy & Ad Notice:</strong> Birth date/time calculations run locally on your device and are never sold. We display contextual ads to keep பெயர்ச்சோலை (Peyarcholai) free.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => {
              localStorage.setItem("namingguru_dpdp_consent", "essential_only");
              setAccepted(true);
            }}
            className="rounded-lg border border-stone-600 px-3 py-1.5 text-xs font-medium text-stone-200 hover:bg-stone-800"
          >
            Non-Personalized Ads
          </button>
          <button
            onClick={() => {
              localStorage.setItem("namingguru_dpdp_consent", "all");
              setAccepted(true);
            }}
            className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export function SubscriptionStatusPill() {
  const paywallEnabled =
    process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTION_PAYWALL === "true";

  return (
    <span
      title={
        paywallEnabled
          ? "பெயர்ச்சோலை (Peyarcholai) Pro Subscription Active"
          : "All Pro features are unlocked free during the early community growth phase!"
      }
      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      {paywallEnabled ? "Pro Tier Enabled" : "Free Community Access (Ads Supported)"}
    </span>
  );
}

