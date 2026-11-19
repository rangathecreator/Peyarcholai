"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SubscriptionStatusPill } from "@/components/MonetizationBanner";

export function MobileHeaderNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* Desktop Inline Header Navigation (md+) */}
      <div className="hidden md:flex items-center gap-2.5 shrink-0">
        <Link
          href="/why-peyarcholai"
          className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50/90 px-3 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100 hover:shadow-xs"
        >
          <span>✨</span>
          <span>Why Peyarcholai</span>
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/90 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 hover:shadow-xs"
        >
          <span>📖</span>
          <span>User Guide &amp; Docs</span>
        </Link>
        <SubscriptionStatusPill />
        <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
          🛡️ 100% Provenance
        </span>
      </div>

      {/* Mobile Collapsible Hamburger Trigger (< md) */}
      <div className="flex items-center gap-1.5 md:hidden shrink-0">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-header-drawer"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-amber-300/80 bg-amber-50/90 px-3 py-2 text-xs font-bold text-amber-950 shadow-xs transition hover:bg-amber-100 active:scale-[0.98]"
        >
          {open ? (
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
          <span className="whitespace-nowrap">{open ? "மூடு" : "பட்டியல்"}</span>
        </button>
      </div>

      {/* Mobile Collapsible Navigation Drawer (< md) */}
      {open && (
        <>
          <div
            className="fixed inset-0 top-[57px] z-40 bg-stone-900/35 backdrop-blur-[1px] md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-header-drawer"
            aria-label="Mobile navigation menu"
            className="fixed inset-x-0 top-[57px] z-50 border-b border-amber-200 bg-white/98 px-4 py-4 shadow-xl backdrop-blur-md md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50/90 px-3.5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-amber-50"
              >
                <span aria-hidden="true">🏠</span>
                <span>பெயர் தேடல் · Home Explorer</span>
              </Link>
              <Link
                href="/why-peyarcholai"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50/90 px-3.5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
              >
                <span aria-hidden="true">✨</span>
                <span>ஏன் பெயர்ச்சோலை? · Why Peyarcholai</span>
              </Link>
              <Link
                href="/docs"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50/90 px-3.5 py-2.5 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
              >
                <span aria-hidden="true">📖</span>
                <span>பயனர் வழிகாட்டி · User Guide &amp; Docs</span>
              </Link>

              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 pt-3">
                <SubscriptionStatusPill />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                  🛡️ 100% Provenance
                </span>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}

export default MobileHeaderNav;
