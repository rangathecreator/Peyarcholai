import { NextRequest, NextResponse } from "next/server";
import { getNameBySlug } from "@/lib/repository";
import { calculateDualNumerology, calculateKatapayadiNumber } from "@/core/numerology";
import { evaluateNameScorecard } from "@/core/scorecard";
import { calculateEmpiricalRarity } from "@/lib/frequency-engine";
import { buildPronunciationGuide } from "@/lib/pronunciation";

function escapeHtml(value: string): string {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Multi-Name Family Comparison Booklet + Peyar Soottu Vizha & Registration Checklist
 * (Tasks 31 & 34 — ₹499 Kudumba Nool Tier)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slugsParam = searchParams.get("slugs") || "";
  // T17-0b: Never trust ?tier= from query params; fail closed until session ships.
  const isKudumbaPaid =
    process.env.ALLOW_UNGATED_DEV === "true" && process.env.NODE_ENV !== "production";

  const slugs = slugsParam
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 5);

  if (slugs.length === 0) {
    return NextResponse.json(
      { error: "Provide 1 to 5 comma-separated slugs via ?slugs=..." },
      { status: 400 }
    );
  }

  const records = (await Promise.all(slugs.map((slug) => getNameBySlug(slug)))).filter(
    (item): item is NonNullable<typeof item> => Boolean(item)
  );

  if (records.length === 0) {
    return NextResponse.json({ error: "No matching names found." }, { status: 404 });
  }

  const rowsHtml = records
    .map((rec) => {
      const dual = calculateDualNumerology(rec.nameLatin);
      const kata = calculateKatapayadiNumber(rec.nameTamil);
      const rarity = calculateEmpiricalRarity(rec.nameTamil, rec.popularityRank, {
        nameLatin: rec.nameLatin,
        nameCategory: rec.nameCategory,
        originCategory: rec.originCategory,
      });
      const pron = buildPronunciationGuide(rec.nameTamil, rec.nameLatin);
      const scorecard = evaluateNameScorecard({
        nameLatin: rec.nameLatin,
        nameTamil: rec.nameTamil,
        meaningEn: rec.meaningEn,
        meaningTa: rec.meaningTa,
        originCategory: rec.originCategory,
        literaryReference: rec.literaryReference,
        confidence: rec.confidence,
        popularityRank: rec.popularityRank,
      });
      return `
        <tr>
          <td>
            <div style="font-size:15px;font-weight:700;color:#78350f;">${escapeHtml(rec.nameTamil)}</div>
            <div style="font-size:12px;font-weight:600;">${escapeHtml(rec.nameLatin)}</div>
            <div style="font-size:10px;color:#57534e;">${escapeHtml(pron.formattedTamil)} (${escapeHtml(pron.formattedRoman)})</div>
          </td>
          <td>${escapeHtml(rec.gender)} · ${escapeHtml(rec.originCategory)}</td>
          <td>
            <div>${escapeHtml(rec.meaningTa)}</div>
            <div style="color:#57534e;font-size:11px;margin-top:2px;">${escapeHtml(rec.meaningEn)}</div>
          </td>
          <td>
            Chaldean: <strong>${dual.chaldean.total} → ${dual.chaldean.singleDigit}</strong><br/>
            Pythagorean: <strong>${dual.pythagorean.total} → ${dual.pythagorean.singleDigit}</strong><br/>
            Katapayadi: <strong>${kata.single} (கூட்டு: ${kata.compound})</strong>
          </td>
          <td>
            7D Score: <strong>${scorecard.overallScore}/100</strong><br/>
            Class (40): <strong>~${rarity.classroomRepetitionIndex}</strong> peers<br/>
            ${escapeHtml(rarity.badgeTitleEn)}
          </td>
        </tr>
      `;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="UTF-8" />
  <title>பெயர்ச்சோலை — குடும்ப நூல் (Family Comparison Booklet)</title>
  <style>
    @page { size: A4; margin: 14mm; }
    body { font-family: 'Noto Sans Tamil', 'Segoe UI', sans-serif; color: #1c1917; background: #fafaf9; margin: 0; padding: 20px; }
    .sheet { max-width: 900px; margin: 0 auto; background: #fff; border: 2px solid #b45309; padding: 22px; border-radius: 10px; }
    h1 { margin: 0; color: #78350f; font-size: 22px; }
    .subtitle { font-size: 12px; color: #57534e; margin-top: 4px; }
    .banner { margin: 12px 0; padding: 10px 14px; border-radius: 8px; font-size: 12px; background: ${
      isKudumbaPaid ? "#ecfdf5; border: 1px solid #6ee7b7; color: #065f46;" : "#fffbeb; border: 1px solid #fcd34d; color: #92400e;"
    } }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12px; }
    th, td { border: 1px solid #e7e5e4; padding: 9px; text-align: left; vertical-align: top; }
    th { background: #fef3c7; color: #78350f; font-weight: 700; }
    .checklist { margin-top: 20px; border: 1px solid #d6d3d1; border-radius: 8px; padding: 14px; background: #fafaf9; font-size: 12px; }
    .checklist h2 { margin: 0 0 8px 0; font-size: 15px; color: #78350f; }
    .checklist ul { margin: 6px 0 0 18px; padding: 0; line-height: 1.6; }
    .disclaimer { margin-top: 16px; font-size: 10px; color: #57534e; border-top: 1px dashed #d6d3d1; padding-top: 8px; }
    @media print { .no-print { display: none !important; } body { background: #fff; padding: 0; } }
  </style>
</head>
<body>
  <div class="sheet">
    <h1>பெயர்ச்சோலை · குடும்பப் பெயர் ஒப்பீட்டு நூல் (Family Comparison Booklet)</h1>
    <div class="subtitle">Comparing ${records.length} Shortlisted Names · Generated ${new Date().toISOString().slice(0, 10)}</div>

    <div class="banner">
      ${
        isKudumbaPaid
          ? "✅ <strong>குடும்ப நூல் (₹499 Kudumba Nool) Approved Booklet</strong> — Ready for elders, grandparents, and naming ceremony keepsake."
          : "🔒 <strong>Sample Preview Mode</strong> — Upgrade to குடும்ப நூல் (₹499) in Peyarcholai for official watermark-free family booklets & blind polls."
      }
    </div>

    <table>
      <thead>
        <tr>
          <th>Name &amp; Pronunciation</th>
          <th>Gender &amp; Tier</th>
          <th>Tamil &amp; English Meaning</th>
          <th>Dual Numerology &amp; Katapayadi</th>
          <th>7D Fit &amp; Classroom Rarity</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="checklist">
      <h2>🪷 பெயர் சூட்டு விழா &amp; அரசுப் பதிவு வழிகாட்டி (Ceremony &amp; Official Registration Checklist)</h2>
      <ul>
        <li><strong>1. Peyar Soottu Vizha (பெயர் சூட்டு விழா):</strong> Whisper the baby's chosen Tamil name gently 3 times into the right ear alongside elders' blessings; prepare a framed keepsake card with the Tamil &amp; English spelling.</li>
        <li><strong>2. Hospital / Municipal Birth Certificate (TN CRVS):</strong> Verify exact English spelling &amp; Tamil script before hospital discharge submission; avoid inconsistent spacing or mixed-case initials.</li>
        <li><strong>3. Initial vs Expanded Surname Rule (Passport &amp; Aadhaar):</strong> Indian Passports require <em>expanded</em> given/surname fields (no single-letter initials like <code>S.</code> alone). Decide early whether to record <code>[BabyName] [FatherName]</code> on Birth Certificate for seamless Aadhaar &amp; Passport alignment.</li>
        <li><strong>4. Dual-Script Consistency:</strong> Keep the exact transliteration (e.g., <code>Yazhini</code> vs <code>Yaazhini</code>) identical across Birth Certificate, Immunization Card, Aadhaar, and School Admission forms.</li>
      </ul>
    </div>

    <div class="disclaimer">
      <strong>குறிப்பு / Disclaimer:</strong> Natchathiram, Dual Numerology (Chaldean/Pythagorean/Katapayadi), and Cohort Rarity metrics are cultural and informational aids; parents are always the final decision-makers. Registration rules are general guidance—verify local municipal/passport office requirements.
    </div>

    <div class="no-print" style="text-align:center;margin-top:16px;">
      <button onclick="window.print()" style="background:#78350f;color:#fff;border:none;padding:10px 22px;border-radius:6px;font-weight:bold;cursor:pointer;">
        🖨️ Print / Save Multi-Name Family Booklet PDF
      </button>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
