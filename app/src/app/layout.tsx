import type { Metadata } from "next";
import "./globals.css";
import {
  DpdpConsentBanner,
  SubscriptionStatusPill,
} from "@/components/MonetizationBanner";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "பெயர்ச்சோலை (Peyarcholai) | Authentic Tamil Baby Names, Natchathiram & Numerology",
  description:
    "பெயர்ச்சோலை (Peyarcholai) — AI-curated Sangam & Traditional Tamil baby names (தமிழ் குழந்தை பெயர்கள்) with 27 Natchathiram syllables, Chaldean/Pythagorean Numerology, 7-Dimension Scorecard, and Family Vote-Out Polls.",
  keywords: [
    "பெயர்ச்சோலை",
    "Peyarcholai",
    "Tamil baby names",
    "தமிழ் குழந்தை பெயர்கள்",
    "Sangam Tamil names",
    "Natchathiram baby names",
    "Tamil numerology calculator",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ta">
      <body className="min-h-screen bg-[#faf7f2] font-sans text-stone-900 antialiased">
        <header className="sticky top-0 z-40 border-b border-amber-200/70 bg-white/95 backdrop-blur shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative flex h-11 w-11 items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-transparent.png"
                  alt="பெயர்ச்சோலை விண்மீன் தொட்டில் சின்னம்"
                  className="h-full w-full object-contain filter drop-shadow-[0_1px_3px_rgba(120,53,15,0.2)]"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-stone-900 transition-colors group-hover:text-amber-800">
                    பெயர்ச்சோலை
                  </span>
                  <span className="rounded-full bg-amber-100/90 px-2.5 py-0.5 text-[11px] font-bold text-amber-950 border border-amber-300/60 shadow-xs">
                    Peyarcholai
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-stone-500 font-medium tracking-wide">
                  விண்மீன் தொட்டில் · சங்கத் தமிழ் · 27 நட்சத்திரங்கள் · எண் கணிதம்
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/90 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 hover:shadow-xs"
              >
                <span>📖</span>
                <span className="hidden md:inline">User Guide &amp; Docs</span>
                <span className="md:hidden">வழிகாட்டி</span>
              </Link>
              <SubscriptionStatusPill />
              <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                🛡️ 100% Provenance
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>

        <footer className="mt-16 border-t border-stone-200 bg-white py-8 text-xs text-stone-600">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 sm:flex-row">
            <div>
              <p className="font-semibold text-stone-800">
                பெயர்ச்சோலை (Peyarcholai) — தூய தமிழ் குழந்தை பெயர் வழிகாட்டி
              </p>
              <p className="mt-1 text-stone-500">
                Astrology (Natchathiram) and Numerology insights are cultural and informational aids; parents are always the final decision-makers.
              </p>
              <div className="mt-2 flex gap-3 text-xs">
                <Link href="/docs" className="text-amber-800 font-semibold hover:underline">
                  📖 Complete Feature Manual &amp; Documentation
                </Link>
                <span>·</span>
                <Link href="/" className="text-stone-600 hover:underline">
                  Name Explorer
                </Link>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-semibold text-stone-700">செம்மொழித் தமிழ் மரபு · தூய வேர்ச்சொல் ஆய்வுக் களஞ்சியம்</p>
              <p className="mt-1 text-stone-400">
                அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை © 2026 பெயர்ச்சோலை (Peyarcholai)
              </p>
            </div>
          </div>
        </footer>

        <DpdpConsentBanner />
      </body>
    </html>
  );
}

