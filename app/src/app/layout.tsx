import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DpdpConsentBanner } from "@/components/MonetizationBanner";
import { MobileHeaderNav } from "@/components/MobileHeaderNav";
import Link from "next/link";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
      <body className="min-h-screen overflow-x-hidden bg-tamil-kolam font-sans text-stone-900 antialiased">
        <div
          className="h-1 w-full bg-gradient-to-r from-amber-400 via-rose-400 to-teal-500"
          aria-hidden="true"
        />
        <header className="sticky top-0 z-40 border-b border-amber-200/80 bg-[#fffdf8]/95 backdrop-blur shadow-[0_2px_15px_-3px_rgba(120,53,15,0.06)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-transparent.png"
                  alt="பெயர்ச்சோலை விண்மீன் தொட்டில் சின்னம்"
                  width={44}
                  height={44}
                  decoding="async"
                  className="h-full w-full object-contain filter drop-shadow-[0_1px_3px_rgba(120,53,15,0.2)]"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-extrabold tracking-tight text-stone-900 transition-colors group-hover:text-amber-800 truncate">
                    பெயர்ச்சோலை
                  </span>
                  <span className="hidden sm:inline-block rounded-full bg-amber-100/90 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-amber-950 border border-amber-300/60 shadow-xs shrink-0">
                    Peyarcholai
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-stone-500 font-medium tracking-wide">
                  விண்மீன் தொட்டில் · சங்கத் தமிழ் · 27 நட்சத்திரங்கள் · எண் கணிதம்
                </p>
              </div>
            </Link>

            <MobileHeaderNav />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">{children}</main>

        <footer className="mt-16 border-t border-stone-200 bg-white py-8 text-xs text-stone-600">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 sm:flex-row">
            <div>
              <p className="font-semibold text-stone-800">
                பெயர்ச்சோலை (Peyarcholai) — தூய தமிழ் குழந்தை பெயர் வழிகாட்டி
              </p>
              <p className="mt-1 text-stone-500">
                Astrology (Natchathiram) and Numerology insights are cultural and informational aids; parents are always the final decision-makers.
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                <Link href="/why-peyarcholai" className="text-emerald-800 font-semibold hover:underline">
                  ✨ Why Peyarcholai vs AI &amp; Portals
                </Link>
                <span>·</span>
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

