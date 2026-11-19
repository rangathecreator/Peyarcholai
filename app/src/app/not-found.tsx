import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto my-8 max-w-lg rounded-3xl border border-amber-200 bg-white p-6 text-center shadow-sm sm:my-14 sm:p-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
        🪷
      </div>
      <h1 className="mt-4 text-2xl font-extrabold text-stone-900">
        404 — இந்தப் பக்கம் கிடைக்கவில்லை
      </h1>
      <p className="mt-1 text-sm font-semibold text-amber-800">
        Page Not Found on பெயர்ச்சோலை (Peyarcholai)
      </p>
      <p className="mt-3 text-sm text-stone-600">
        நீங்கள் தேடிய பெயர் அல்லது பக்கம் மாற்றப்பட்டிருக்கலாம். கீழே உள்ள பெயர் தேடலுக்குச் செல்லுங்கள்.
      </p>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-teal-900"
        >
          <span>🏠</span>
          <span>பெயர் தேடல் · Explore Names</span>
        </Link>
        <Link
          href="/docs"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-bold text-amber-950 transition hover:bg-amber-100"
        >
          <span>📖</span>
          <span>பயனர் வழிகாட்டி · Guide</span>
        </Link>
      </div>
    </div>
  );
}
