import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "பயனர் வழிகாட்டி | பெயர்ச்சோலை (Peyarcholai) Tamil Baby Names",
  description:
    "Complete user guide and feature manual for பெயர்ச்சோலை (Peyarcholai). Learn how to use the Name Explorer, Nakshatra Padam Finder, Dual Numerology, 7D Scorecard, Linguistic AI Advisor, and Family Polls.",
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 py-4">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-4">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-amber-800 font-medium">
            ← Home (முகப்பு)
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">User Guide & Feature Documentation</span>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-amber-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-800"
        >
          Open App Explorer →
        </Link>
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-peyarcholai-hero px-6 py-10 text-white shadow-2xl sm:px-10 border border-amber-500/20">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-200 backdrop-blur shadow-xs">
            <span>📖 பெயர்ச்சோலை (Peyarcholai) பயனர் வழிகாட்டி</span>
            <span>|</span>
            <span>Comprehensive Feature Manual v4.0</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-white-transparent.png"
                alt="பெயர்ச்சோலை விண்மீன் தொட்டில் சின்னம்"
                className="h-full w-full object-contain filter drop-shadow-[0_4px_16px_rgba(251,191,36,0.45)]"
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                பெயர்ச்சோலை வழிகாட்டி
              </h1>
              <p className="text-xs sm:text-sm font-semibold tracking-wider text-amber-300 uppercase mt-0.5">
                Peyarcholai Feature Manual &amp; User Guide
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-stone-200 sm:text-base">
            A comprehensive, parent-first guide explaining every tool, calculator, and linguistic rule within பெயர்ச்சோலை (Peyarcholai). Discover authentic classical and modern Tamil baby names with zero misinformation.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <nav className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
          Table of Contents (பொருளடக்கம்)
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 text-xs font-medium text-amber-900">
          <a href="#overview" className="hover:underline flex items-center gap-1.5">
            <span>1.</span> <span>Overview & Core Philosophy</span>
          </a>
          <a href="#feature-explorer" className="hover:underline flex items-center gap-1.5">
            <span>2.</span> <span>Name Explorer & Quick-Letter Bar</span>
          </a>
          <a href="#feature-nakshatra" className="hover:underline flex items-center gap-1.5">
            <span>3.</span> <span>Birth Star & Nakshatra Finder</span>
          </a>
          <a href="#feature-numerology" className="hover:underline flex items-center gap-1.5">
            <span>4.</span> <span>Dual Numerology Engine</span>
          </a>
          <a href="#feature-scorecard" className="hover:underline flex items-center gap-1.5">
            <span>5.</span> <span>7-Dimension & 14-D Scorecard</span>
          </a>
          <a href="#feature-advisor" className="hover:underline flex items-center gap-1.5">
            <span>6.</span> <span>Linguistic AI Name Advisor</span>
          </a>
          <a href="#feature-poll" className="hover:underline flex items-center gap-1.5">
            <span>7.</span> <span>Family Poll & Consensus</span>
          </a>
          <a href="#feature-slug" className="hover:underline flex items-center gap-1.5">
            <span>8.</span> <span>Name SEO Profiles & Lexicon Links</span>
          </a>
          <a href="#linguistic-rules" className="hover:underline flex items-center gap-1.5">
            <span>9.</span> <span>Tolkappiyam Sandhi & QA Rules</span>
          </a>
          <a href="#sources" className="hover:underline flex items-center gap-1.5">
            <span>10.</span> <span>Literary Sources & Epics</span>
          </a>
        </div>
      </nav>

      {/* Section 1: Overview */}
      <section id="overview" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            1
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Overview & Core Philosophy (அறிமுகம்)
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          பெயர்ச்சோலை (Peyarcholai) was designed to eliminate the rampant misinformation found on internet naming websites, where modern compounded words are falsely attributed to ancient epics or Sanskrit terms are mislabelled as pure Sangam Tamil.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <h3 className="font-bold text-amber-900 text-sm">1. Linguistic Purity</h3>
            <p className="text-xs text-stone-600 mt-1">
              Strict enforcement of Tolkappiyam Udambadumei sandhi rules and authentic root etymologies cross-referenced against the University of Madras Tamil Lexicon.
            </p>
          </div>
          <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4">
            <h3 className="font-bold text-orange-900 text-sm">2. Transparent Provenance</h3>
            <p className="text-xs text-stone-600 mt-1">
              Zero fabricated quotes. Clear visual distinction between <strong>Direct Classical Citations (📜)</strong> and <strong>Modern Synthesized Compounds (🧪)</strong>.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <h3 className="font-bold text-emerald-900 text-sm">3. Holistic 14 Dimensions</h3>
            <p className="text-xs text-stone-600 mt-1">
              Evaluation beyond meaning: ease of pronunciation, passport/form fit, dual numerology, Nakshatra Padams, and global portability.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Feature Explorer */}
      <section id="feature-explorer" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            2
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Feature 1: Name Explorer (`/`) & Tamil Starting-Letter Quick-Bar
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          The Name Explorer hosts our full catalog of <strong>10,090+ active verified Tamil names</strong> across 42 sharded partitions.
        </p>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2 text-xs text-stone-700">
          <p className="font-semibold text-stone-900 text-sm">Step-by-Step Guide:</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li><strong>Search Bar:</strong> Type in Tamil script (e.g. <code>கவின்</code>) or English Latin transliteration (e.g. <code>Kavin</code>). Fast phonetic index resolves variants.</li>
            <li><strong>Tamil Starting Letter Quick-Bar (முதல் எழுத்து):</strong> Click any vowel (<code>அ</code>, <code>ஆ</code>, <code>இ</code>, <code>ஈ</code>, <code>உ</code>, <code>ஊ</code>, <code>எ</code>, <code>ஏ</code>, <code>ஐ</code>, <code>ஒ</code>, <code>ஓ</code>, <code>ஔ</code>) or consonant-row header (<code>க</code>, <code>ச</code>, <code>த</code>, <code>ந</code>, <code>ப</code>, <code>ம</code>, <code>ய</code>, <code>வ</code>, <code>ழ</code>, <code>ல</code>) to filter immediately.</li>
            <li><strong>Gender Filter:</strong> Toggle between <code>All</code>, <code>Girl (பெண்)</code>, <code>Boy (ஆண்)</code>, or <code>Unisex (இருபாலர்)</code>.</li>
            <li><strong>Provenance Badges:</strong>
              <span className="ml-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-900">📜 Classical Text Verified</span> denotes attested Sangam verses;
              <span className="ml-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-900">🧪 Modern Synthesis</span> denotes modern coined compounds from authentic roots.
            </li>
            <li><strong>Add to Shortlist:</strong> Click the <strong>★ Shortlist</strong> button on any card to save it into your persistent family tray.</li>
          </ul>
        </div>
      </section>

      {/* Section 3: Feature Nakshatra */}
      <section id="feature-nakshatra" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            3
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Feature 2: Birth Star & Nakshatra Finder (நட்சத்திரக் கணிப்பு)
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          Calculates the child&apos;s birth star according to sidereal astrological longitude (Lahiri Ayanamsa) and maps traditional auspicious starting syllables.
        </p>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2 text-xs text-stone-700">
          <p className="font-semibold text-stone-900 text-sm">Step-by-Step Guide:</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li><strong>Enter Date & Time of Birth:</strong> Input the baby&apos;s birth date, exact time, and timezone. The astronomical engine computes the Moon&apos;s position.</li>
            <li><strong>Select from 27 Nakshatras:</strong> Or click directly on any of the 27 Natchathiram cards (e.g. <em>Karthigai</em>, <em>Rohini</em>, <em>Revati</em>).</li>
            <li><strong>Padam Syllable Filter:</strong> Each Nakshatra displays its 4 Padam syllables. Click any syllable (e.g. <code>அ</code>, <code>இ</code>, <code>உ</code>, <code>எ</code>) to filter catalog names starting with that sound.</li>
            <li><strong>Open in Explorer:</strong> Click <em>&quot;Open in Full Explorer →&quot;</em> to seamlessly explore with the astrological parameters pre-applied.</li>
          </ul>
        </div>
      </section>

      {/* Section 4: Feature Numerology */}
      <section id="feature-numerology" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            4
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Feature 3: Dual Numerology Engine (எண் கணிதம்)
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          Provides comprehensive numerical vibrations across both ancient <strong>Chaldean</strong> (1–8) and <strong>Pythagorean</strong> (1–9) frameworks.
        </p>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2 text-xs text-stone-700">
          <p className="font-semibold text-stone-900 text-sm">Step-by-Step Guide:</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li><strong>Input in Tamil or English:</strong> Enter names in Latin letters or native Tamil script (e.g. <code>யாழினி</code>). Tamil script is transliterated with exact phonetic fidelity.</li>
            <li><strong>Dual Analysis:</strong> Compare the compound total (e.g. 23) and root single digit (e.g. 5) across both systems simultaneously.</li>
            <li><strong>Spelling Variant Suggestion:</strong> Choose a target lucky number (e.g. 1, 5, or 6), and the engine will suggest phonetically sound spelling modifications without altering Tamil pronunciation.</li>
          </ul>
        </div>
      </section>

      {/* Section 5: Feature Scorecard */}
      <section id="feature-scorecard" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            5
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Feature 4: 7-Dimension & 14-Dimension Scorecard (7-பரிமாண மதிப்பீடு)
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          An objective, multi-factorial rating system ensuring a name stands the test of time culturally, legally, and internationally.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <strong>1. Cultural Grounding:</strong> Classical Tamil heritage and linguistic etymology strength.
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <strong>2. Ease of Calling:</strong> Phonetic clarity in Tamil Nadu, pan-India, and global diaspora.
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <strong>3. Spelling Assessment:</strong> Risk of phonetic confusion on passports and birth certificates.
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <strong>4. Document Fit:</strong> Letter count, initial compatibility (e.g. <code>S. Kavin</code>), and form length.
          </div>
        </div>
      </section>

      {/* Section 6: Feature AI Advisor */}
      <section id="feature-advisor" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            6
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Feature 5: Linguistic AI Name Advisor (அறிவார்ந்த AI ஆலோசகர்)
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          Powered by advanced multilingual linguistic AI models, calibrated against classical Tamil dictionaries to ensure zero hallucination and strict literary grounding.
        </p>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2 text-xs text-stone-700">
          <p className="font-semibold text-stone-900 text-sm">Example Prompts for Parents:</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li><em>&quot;Suggest pure Tamil girl names inspired by moonlight or nature, easy for relatives in the USA to say.&quot;</em></li>
            <li><em>&quot;Boy names starting with &apos;Va&apos; vibrating to Chaldean number 5, rooted in Sangam courage.&quot;</em></li>
            <li><em>&quot;Harmonious sibling names for an elder sister named Yazhini.&quot;</em></li>
          </ul>
        </div>
      </section>

      {/* Section 7: Feature Poll */}
      <section id="feature-poll" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            7
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Feature 6: Family Poll & Consensus Engine (குடும்ப வாக்கெடுப்பு)
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          Brings extended families together to vote and reach consensus without endless messaging debates.
        </p>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2 text-xs text-stone-700">
          <p className="font-semibold text-stone-900 text-sm">How to Host a Family Poll:</p>
          <ol className="list-decimal list-inside space-y-1 pl-1">
            <li>Shortlist 2 to 6 candidate names in the Explorer.</li>
            <li>Navigate to the <strong>Family Poll</strong> tab, give the poll a title (e.g. <em>&quot;Baby Anand&apos;s Name Choice&quot;</em>), and click <strong>Create Family Poll</strong>.</li>
            <li>Click <strong>📋 Copy Link</strong> or <strong>💬 Share on WhatsApp</strong> to distribute to grandparents, aunts, uncles, and cousins worldwide.</li>
            <li>Family members vote on favorites and leave comments. The <strong>🏆 Family Consensus Leaderboard</strong> updates in real time with gold, silver, and bronze rankings.</li>
          </ol>
        </div>
      </section>

      {/* Section 8: Feature Slug Profile */}
      <section id="feature-slug" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            8
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Feature 7: Name SEO Profiles (`/name/[slug]`) & Lexicon URLs
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          Every individual name features a dedicated deep-dive page (e.g. <code>/name/yazhini</code>, <code>/name/kavin</code>, <code>/name/kalainagai</code>).
        </p>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2 text-xs text-stone-700">
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li><strong>Distinct Source Cards:</strong> Ancient Classical Text citations (📜) are kept strictly separate from Modern Synthesis Lexicon Headword Links (📘).</li>
            <li><strong>Direct Lexicon Lookup:</strong> Clickable link directly queries the exact UTF-8 headword in the <strong>University of Madras Tamil Lexicon</strong> hosted by the Digital Dictionaries of South Asia (DSAL) at the University of Chicago.</li>
          </ul>
        </div>
      </section>

      {/* Section 9: Tolkappiyam Sandhi & QA */}
      <section id="linguistic-rules" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            9
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Tolkappiyam Sandhi & QA Checklist v1.0 Standards
          </h2>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-2 text-xs text-amber-950">
          <p className="font-semibold text-sm text-amber-900">Tolkappiyam Udambadumei Sandhi (உடம்படுமெய் புணர்ச்சி):</p>
          <p>
            <em>&quot;இ ஈ ஐ வழி யவ்வும் ஏனை உயிர்வழி வவ்வும் உடம்படுமெய் என்றாகும்&quot;</em> — தொல்காப்பியம் (எழுத்ததிகாரம்).
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>When front vowels (<code>இ</code>, <code>ஈ</code>, <code>ஐ</code>) join a vowel-starting suffix, the <strong>ய-glide</strong> (<code>ய்</code>) must be inserted: e.g. <code>கலை + அரசி = கலையரசி</code> (not <code>கலைஅரசி</code> or <code>கலாரசி</code>).</li>
            <li>When back/central vowels (<code>அ</code>, <code>ஆ</code>, <code>உ</code>, <code>ஊ</code>, <code>ஒ</code>, <code>ஓ</code>) join a vowel, the <strong>வ-glide</strong> (<code>வ்</code>) must be inserted: e.g. <code>நிலா + ஒளி = நிலாவொளி</code>.</li>
            <li>Masculine <code>-ன்</code> personal noun double suffixes (e.g. <code>அதியன் + வாணி</code>) are grammatically unnatural and strictly quarantined below the 80% gate.</li>
          </ul>
        </div>
      </section>

      {/* Section 10: Literary Sources */}
      <section id="sources" className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">
            10
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Literary Sources & Authentic Sourcing Directory
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          பெயர்ச்சோலை (Peyarcholai) cross-references all personal names and vocabulary against primary digital repositories and classical literature:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <strong>1. Sangam Classics:</strong> <em>Ettuthokai</em> (Purananuru, Akananuru, Natrinai, Kurunthokai) &amp; <em>Pattuppattu</em>.
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <strong>2. Grammar &amp; Nikaṇṭu:</strong> <em>Tolkappiyam</em>, <em>Nannool</em>, <em>Pingala Nigandu</em>, <em>Chendhan Divakaram</em>.
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <strong>3. Tamil Epics:</strong> <em>Silappathikaram</em>, <em>Manimekalai</em>, and <em>Kamba Ramayanam</em>.
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <strong>4. Digital Archives:</strong> Central Institute of Classical Tamil (CICT), Tamil Virtual Academy (TVA), Project Madurai, and University of Madras Tamil Lexicon (DSAL).
          </div>
        </div>
      </section>

      {/* Footer Return Button */}
      <div className="text-center pt-4 pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-amber-800"
        >
          <span>🚀 Launch Name Explorer</span>
        </Link>
      </div>
    </div>
  );
}

