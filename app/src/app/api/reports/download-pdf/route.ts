import { NextRequest, NextResponse } from 'next/server';
import { getNameBySlug } from '@/lib/repository';
import { calculateEmpiricalRarity } from '@/lib/frequency-engine';
import { calculateKatapayadiNumber, calculateNumerology } from '@/core/numerology';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const tier = searchParams.get('tier') || 'free';
  const isPaid = tier === 'suvadi_49' || tier === 'kudumba_499';

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  const nameRecord = getNameBySlug(slug);
  if (!nameRecord) {
    return NextResponse.json({ error: 'Name not found' }, { status: 404 });
  }

  const rarity = calculateEmpiricalRarity(
    nameRecord.nameTamil,
    nameRecord.popularityRank,
    {
      nameLatin: nameRecord.nameLatin,
      nameCategory: nameRecord.nameCategory,
      originCategory: nameRecord.originCategory,
    }
  );

  const pythagorean = calculateNumerology(nameRecord.nameLatin, 'pythagorean');
  const chaldean = calculateNumerology(nameRecord.nameLatin, 'chaldean');
  const katapayadi = calculateKatapayadiNumber(nameRecord.nameTamil);

  const categoryLabel =
    nameRecord.nameCategory === 'tamilnadu_usage'
      ? `தமிழ்நாட்டுப் பயன்பாடு (${nameRecord.categoryOriginSource || 'TN Usage'})`
      : nameRecord.nameCategory === 'other_heritage'
      ? `பிற மரபுப் பெயர் (${nameRecord.categoryOriginSource || 'Heritage'})`
      : 'தூய தமிழ் (Pure Tamil)';

  const sourceUrl = nameRecord.structuredReference?.sourceWebsite;
  const lexiconUrl = nameRecord.structuredReference?.lexiconWebsite;

  // High-Resolution A4 Printable HTML / Vector Certificate
  const html = `<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="UTF-8">
  <title>${nameRecord.nameTamil} (${nameRecord.nameLatin}) — பெயர்ச்சோலை சான்றிதழ் ஆவணம்</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@400;600;700&family=Cinzel:wght@600;700&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    
    body {
      font-family: 'Mukta Malar', 'Noto Sans Tamil', serif;
      margin: 0;
      padding: 0;
      background: #fdfbf7;
      color: #292524;
      line-height: 1.45;
    }

    .certificate-container {
      position: relative;
      border: 6px double #78350f;
      padding: 20px;
      border-radius: 12px;
      background: #fffefb;
      box-sizing: border-box;
      min-height: 274mm;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }

    .corner-ornament {
      position: absolute;
      width: 28px;
      height: 28px;
      border-color: #d97706;
    }
    .top-left { top: 8px; left: 8px; border-top: 3px solid; border-left: 3px solid; }
    .top-right { top: 8px; right: 8px; border-top: 3px solid; border-right: 3px solid; }
    .bottom-left { bottom: 8px; left: 8px; border-bottom: 3px solid; border-left: 3px solid; }
    .bottom-right { bottom: 8px; right: 8px; border-bottom: 3px solid; border-right: 3px solid; }

    .header {
      text-align: center;
      border-bottom: 2px solid #fef3c7;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }

    .brand-title {
      font-size: 22px;
      font-weight: 700;
      color: #78350f;
      margin: 0;
      letter-spacing: 1px;
    }

    .brand-sub {
      font-size: 10.5px;
      color: #92400e;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 2px;
    }

    .certificate-title {
      font-size: 13px;
      font-weight: 600;
      color: #b45309;
      background: #fef3c7;
      display: inline-block;
      padding: 3px 12px;
      border-radius: 9999px;
      margin-top: 6px;
    }

    .name-hero {
      text-align: center;
      margin: 12px 0;
      background: linear-gradient(to right, #fffbeb, #fef3c7, #fffbeb);
      padding: 14px;
      border-radius: 8px;
      border: 1px solid #fde68a;
    }

    .name-ta {
      font-size: 34px;
      font-weight: 700;
      color: #451a03;
      margin: 0;
    }

    .name-en {
      font-size: 17px;
      font-family: 'Cinzel', serif;
      color: #78350f;
      margin-top: 2px;
    }

    .badge-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
      font-size: 10.5px;
    }

    .badge {
      background: #fff;
      border: 1px solid #d97706;
      color: #78350f;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }

    .card {
      background: #fff;
      border: 1px solid #e7e5e4;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 11px;
    }

    .card-full {
      grid-column: 1 / -1;
    }

    .card p {
      margin: 4px 0;
    }

    .card-title {
      font-weight: 700;
      color: #78350f;
      font-size: 11.5px;
      border-bottom: 1px dashed #e7e5e4;
      padding-bottom: 4px;
      margin-top: 0;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .source-link {
      color: #0369a1;
      font-weight: 600;
      text-decoration: underline;
    }

    .seal-box {
      margin-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid #fde68a;
      padding-top: 10px;
      font-size: 10px;
      color: #78716c;
    }

    .seal-emblem {
      border: 2px solid #b45309;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 8.5px;
      color: #78350f;
      font-weight: bold;
      line-height: 1.1;
      padding: 4px;
      box-sizing: border-box;
    }

    /* Watermark for Free Tier */
    .watermark {
      position: absolute;
      top: 45%;
      left: 10%;
      width: 80%;
      text-align: center;
      font-size: 44px;
      font-weight: 700;
      color: rgba(180, 83, 9, 0.11);
      transform: rotate(-30deg);
      pointer-events: none;
      z-index: 10;
      text-transform: uppercase;
      letter-spacing: 4px;
    }

    @media print {
      body { background: transparent; }
      .certificate-container { box-shadow: none; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="certificate-container">
    <div class="corner-ornament top-left"></div>
    <div class="corner-ornament top-right"></div>
    <div class="corner-ornament bottom-left"></div>
    <div class="corner-ornament bottom-right"></div>

    ${!isPaid ? '<div class="watermark">பெயர்ச்சோலை மாதிரி<br>FREE SAMPLE PREVIEW</div>' : ''}

    <div class="header">
      <div class="brand-title">பெயர்ச்சோலை · PEYARCHOLAI</div>
      <div class="brand-sub">செம்மொழித் தமிழ் மரபு · 14-பரிமாண பெயர் வரலாற்று ஆவணம்</div>
      <div class="certificate-title">📜 முழுமையான பெயர் & எண் கணித சான்றிதழ் (Comprehensive Name Dossier)</div>
    </div>

    <div class="name-hero">
      <h1 class="name-ta">${nameRecord.nameTamil}</h1>
      <div class="name-en">${nameRecord.nameLatin}</div>
      <div class="badge-bar">
        <span class="badge">பால்: ${nameRecord.gender === 'boy' ? 'ஆண் (Boy)' : nameRecord.gender === 'girl' ? 'பெண் (Girl)' : 'இருபாலர் (Unisex)'}</span>
        <span class="badge">பிரிவு: ${categoryLabel}</span>
        <span class="badge">நம்பகத்தன்மை: ${Math.round(nameRecord.confidence * 100)}%</span>
        <span class="badge">மரபு: ${nameRecord.originCategory}</span>
      </div>
    </div>

    <div class="grid-2">
      <!-- Etymology & Meanings -->
      <div class="card">
        <div class="card-title">📖 பொருள் & வேர்ச்சொல் விளக்கம் (Meaning & Etymology)</div>
        <p><strong>தமிழ் பொருள்:</strong> ${nameRecord.meaningTa}</p>
        <p><strong>ஆங்கிலப் பொருள்:</strong> ${nameRecord.meaningEn}</p>
        <p><strong>வேர்ச்சொல் (Roots):</strong> ${nameRecord.etymologyRoot || nameRecord.nameTamil}</p>
        <p><strong>நேரடி / தத்துவப் பொருள்:</strong> ${nameRecord.derivedMeaningEn || nameRecord.literalMeaningEn || nameRecord.meaningEn}</p>
      </div>

      <!-- Provenance & Clickable Source Links -->
      <div class="card">
        <div class="card-title">🏛️ ஆதாரம் & அகராதி இணைப்புகள் (Provenance & Sources)</div>
        <p><strong>ஆதார வகை:</strong> ${nameRecord.sourceAttributionType || nameRecord.structuredReference?.verificationTier || 'Lexicon Attested'}</p>
        <p><strong>இலக்கியக் குறிப்பு:</strong> ${nameRecord.literaryReference || nameRecord.categoryOriginSource || 'Tamil Lexicon Heritage'}</p>
        ${nameRecord.structuredReference?.lineTitleOrQuote ? `<p><strong>மேற்கோள்:</strong> <em>"${nameRecord.structuredReference.lineTitleOrQuote}"</em></p>` : ''}
        <p><strong>இணைப்புகள்:</strong>
          ${sourceUrl ? `<a class="source-link" href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Madras University Tamil Lexicon ↗</a>` : 'DSAL Lexicon Reference'}
          ${lexiconUrl && lexiconUrl !== sourceUrl ? ` · <a class="source-link" href="${lexiconUrl}" target="_blank" rel="noopener noreferrer">Tamil Virtual Academy ↗</a>` : ''}
        </p>
      </div>

      <!-- Numerology Predictions (Full Width) -->
      <div class="card card-full">
        <div class="card-title">🔢 எண் கணித மதிப்புகள் & பலன்கள் (Numerology Values & Predictions)</div>
        <p>
          <strong>பைதகோரியன் (Pythagorean):</strong> விதி எண் <strong>${pythagorean.nameNumber}</strong> (கூட்டு எண் <strong>${pythagorean.compoundNumber}</strong>) · ஆன்ம எண்: ${pythagorean.soulUrgeNumber} · ஆளுமை எண்: ${pythagorean.personalityNumber}
          ${pythagorean.isMasterNumber ? ` · <strong>Master Number (${pythagorean.masterNumberTitleEn})</strong>` : ''}
        </p>
        <p>
          <strong>கல்தேயன் (Chaldean):</strong> விதி எண் <strong>${chaldean.nameNumber}</strong> (கூட்டு எண் <strong>${chaldean.compoundNumber}</strong>) ·
          <strong>கடபயாதி (Katapayadi):</strong> ${katapayadi.single} (கூட்டு: ${katapayadi.compound})
        </p>
        <p><strong>ஆட்சி கிரகம் (Ruling Planet):</strong> ${pythagorean.planet.planetTa} (${pythagorean.planet.planetEn}) — ${pythagorean.planet.traitsTa}</p>
        ${pythagorean.compoundInfo ? `<p><strong>கூட்டு எண் பலன் (${pythagorean.compoundNumber} — ${pythagorean.compoundInfo.auspiciousness}):</strong> ${pythagorean.compoundInfo.titleTa} (${pythagorean.compoundInfo.titleEn}) — ${pythagorean.compoundInfo.summaryTa} / ${pythagorean.compoundInfo.summaryEn}</p>` : ''}
        ${chaldean.compoundInfo && chaldean.compoundNumber !== pythagorean.compoundNumber ? `<p><strong>கல்தேய கூட்டு பலன் (${chaldean.compoundNumber} — ${chaldean.compoundInfo.auspiciousness}):</strong> ${chaldean.compoundInfo.titleEn} — ${chaldean.compoundInfo.summaryEn}</p>` : ''}
        <p><strong>நல்ல நிறம் & நாள்:</strong> ${pythagorean.planet.luckyColors.join(', ')} · ${pythagorean.planet.luckyDays.join(', ')} · ரத்தினம்: ${pythagorean.planet.gemEn}</p>
      </div>

      <!-- Astrology & Nakshatra -->
      <div class="card">
        <div class="card-title">✨ நட்சத்திரம் & ஒலி அமைப்பு (Astrology & Phonetics)</div>
        <p><strong>தொடக்க எழுத்து:</strong> ${nameRecord.startingSyllableTa} (${nameRecord.startingSyllableEn})</p>
        <p><strong>பொருந்திய நட்சத்திரம்:</strong> ${nameRecord.nakshatraSlugs?.join(', ') || 'அனைத்தும்'}</p>
        <p><strong>செல்லப் பெயர்கள்:</strong> ${nameRecord.nicknames?.join(', ') || nameRecord.nameLatin}</p>
        <p><strong>சகோதர இணைப் பெயர்கள்:</strong> ${nameRecord.siblingPairSuggestions?.join(', ') || '—'}</p>
      </div>

      <!-- Empirical Frequency & Global Fit -->
      <div class="card">
        <div class="card-title">🌟 வகுப்பறைத் தனித்துவம் & உலகப் பயன்பாடு</div>
        <p><strong>பயன்பாட்டு விகிதம்:</strong> ${rarity.observedFrequencyPercent}% — ${rarity.icon} ${rarity.badgeTitleTamil} (${rarity.badgeTitleEn})</p>
        <p><strong>வகுப்பறை (40 மாணவர்):</strong> ~${rarity.classroomRepetitionIndex} சக மாணவர்கள் (1 in ~${rarity.oneInClassrooms} வகுப்பறைகள்)</p>
        <p><strong>பள்ளி (1,000 மாணவர்):</strong> ~${rarity.gradeSchoolRepetitionIndex} நபர்கள் · ${rarity.methodologyNoteEn}</p>
        <p><strong>உச்சரிப்பு & எழுத்துப்பிழை:</strong> Ease ${nameRecord.easeOfCalling?.overallScore || 85}/100 · Risk: ${nameRecord.spellingAssessment?.riskLevel || 'Low'}</p>
      </div>
    </div>

    <div class="seal-box">
      <div>
        <strong>ஆவண சரிபார்ப்பு முத்திரை:</strong> PEYAR-CERT-${nameRecord.slug.toUpperCase()}-2026<br>
        <strong>நிலை:</strong> ${isPaid ? 'அங்கீகரிக்கப்பட்ட தூய ஆவணம் (Official Paid Keepsake)' : 'மாதிரி முன்னோட்டம் (Sample Preview — Unlock via Suvadi Nilai ₹49)'}<br>
        <strong>வழங்கிய தளம்:</strong> பெயர்ச்சோலை (Peyarcholai) · Classical Tamil Research Hub
      </div>
      <div class="seal-emblem">
        செம்மொழி<br>தமிழ்<br>முத்திரை
      </div>
    </div>
  </div>

  <div class="no-print" style="text-align: center; margin: 18px 0;">
    <button onclick="window.print()" style="background: #78350f; color: white; border: none; padding: 10px 24px; font-size: 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">
      🖨️ அச்சிடுக / PDF ஆகச் சேமிக்க (Print / Save as PDF)
    </button>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="${nameRecord.slug}-heritage-dossier.html"`,
      'Cache-Control': 'no-store',
    },
  });
}
