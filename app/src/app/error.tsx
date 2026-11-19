"use client";

import Link from "next/link";

export default function GlobalSegmentError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto my-8 max-w-lg rounded-3xl border border-rose-200 bg-white p-6 text-center shadow-sm sm:my-14 sm:p-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
        🌿
      </div>
      <h1 className="mt-4 text-xl font-extrabold text-stone-900 sm:text-2xl">
        தற்காலிகத் தொழில்நுட்பத் தடை
      </h1>
      <p className="mt-1 text-sm font-semibold text-rose-800">
        Something went wrong while loading this page
      </p>
      <p className="mt-3 text-sm text-stone-600">
        Please try again in a moment, or return to the பெயர்ச்சோலை Tamil Baby Name Explorer.
      </p>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-teal-900"
        >
          <span>↻</span>
          <span>மீண்டும் முயற்சி · Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-bold text-amber-950 transition hover:bg-amber-100"
        >
          <span>🏠</span>
          <span>முகப்பு · Home</span>
        </Link>
      </div>
    </div>
  );
}
