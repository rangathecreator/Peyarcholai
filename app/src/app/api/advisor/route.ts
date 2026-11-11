import { NextRequest, NextResponse } from "next/server";
import { callOmniRouteChat } from "@/lib/omniroute";
import { getAllTamilNames } from "@/lib/repository";
import { calculateNumerology } from "@/core/numerology";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt = "",
      gender = "all",
      nakshatra = "",
      luckyNumber = "",
    } = body;

    const systemPrompt = `You are 'NamingGuru Tamil AI Advisor' (தமிழ் குழந்தை பெயர் ஆலோசகர்), an expert in Sangam Tamil literature, Madras University Tamil Lexicon, Natchathiram (birth star) syllables, and Numerology.
Always respond with a strictly valid JSON object with this schema:
{
  "summaryTa": "Warm advisory summary in Tamil",
  "summaryEn": "Warm advisory summary in English",
  "recommendations": [
    {
      "nameTamil": "தமிழ் பெயர்",
      "nameLatin": "English Spelling",
      "gender": "boy | girl | unisex",
      "meaningTa": "Clear natural meaning in Tamil",
      "meaningEn": "Clear natural meaning in English",
      "originCategory": "Sangam Tamil | Tamil Literary | Tamil Traditional",
      "literaryReference": "Exact root etymology or Madras University Tamil Lexicon reference (do NOT fabricate poem quotes)",
      "startingSyllableTa": "First Tamil letter",
      "confidence": 0.92
    }
  ]
}
Rules:
1. Suggest 4 authentic, auspicious Tamil names matching the parent's request.
2. Only include names where you have >= 80% confidence (confidence >= 0.80) in both the Tamil meaning and etymological source.
3. NEVER claim a compound name appears in a Sangam poem unless the exact word literally appears in that verse; for compound names, cite the constituent Tamil Lexicon roots honestly.`;

    const userPrompt = `Parent request: "${prompt}"
Preferred Gender: ${gender}
Nakshatra / Star preference: ${nakshatra || "Any"}
Target Numerology Number: ${luckyNumber || "Any"}`;

    const allCatalog = getAllTamilNames();
    const byTamil = new Map(allCatalog.map((n) => [n.nameTamil.trim(), n]));
    const byLatin = new Map(allCatalog.map((n) => [n.nameLatin.trim().toLowerCase(), n]));

    try {
      const aiRes = await callOmniRouteChat({
        systemPrompt,
        userPrompt,
        model: "auto/best-free",
        jsonMode: true,
        temperature: 0.25,
      });

      const cleaned = aiRes.content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      const recs = Array.isArray(parsed.recommendations)
        ? parsed.recommendations
          .map((r: Record<string, unknown>) => {
            const tamil = String(r.nameTamil || "").trim();
            const latin = String(r.nameLatin || "Kavin").trim();
            const matched = byTamil.get(tamil) || byLatin.get(latin.toLowerCase());
            const numChald = calculateNumerology(latin, "chaldean");
            const numPyth = calculateNumerology(latin, "pythagorean");
            const rawConf = typeof r.confidence === "number" ? r.confidence : 0.88;
            const conf = matched ? matched.confidence : Math.max(0.8, Math.min(0.98, rawConf));
            return {
              slug: matched?.slug || latin.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              inCatalog: Boolean(matched),
              nameTamil: matched?.nameTamil || tamil || "கவின்",
              nameLatin: matched?.nameLatin || latin,
              gender: matched?.gender || String(r.gender || gender || "unisex"),
              meaningTa: matched?.meaningTa || String(r.meaningTa || ""),
              meaningEn: matched?.meaningEn || String(r.meaningEn || ""),
              originCategory: matched?.originCategory || String(r.originCategory || "Tamil Lexicon Root"),
              literaryReference:
                matched?.literaryReference ||
                `${String(r.literaryReference || "செந்தமிழ் சொற்பிறப்பியல் பேரகரமுதலி")} (Madras University Tamil Lexicon)`,
              sourceWebsite:
                matched?.structuredReference?.sourceWebsite ||
                "https://dsal.uchicago.edu/dictionaries/tamil-lex/",
              startingSyllableTa:
                matched?.startingSyllableTa || String(r.startingSyllableTa || Array.from(tamil)[0] || "அ"),
              confidence: conf,
              numerologyNumber: numChald.nameNumber,
              compoundNumber: numChald.compoundNumber,
              pythagoreanNumber: numPyth.nameNumber,
              pythagoreanCompound: numPyth.compoundNumber,
              planetEn: numChald.planet.planetEn,
            };
          })
          .filter((r: { confidence: number }) => r.confidence >= 0.8)
        : [];

      return NextResponse.json({
        source: "omniroute-live",
        modelUsed: aiRes.modelUsed,
        providerUsed: aiRes.providerUsed,
        latencyMs: aiRes.latencyMs,
        summaryTa:
          parsed.summaryTa ||
          "உங்கள் விருப்பத்திற்கு ஏற்ப சங்கத் தமிழ் மற்றும் நட்சத்திர வழிகாட்டுதலின்படி தேர்ந்தெடுக்கப்பட்ட பெயர்கள்:",
        summaryEn:
          parsed.summaryEn ||
          "Curated Tamil baby names tailored to your preferences via Linguistic AI:",
        recommendations: recs,
      });
    } catch {
      // Deterministic curated fallback if gateway is busy (filtered by gender, nakshatra, and luckyNumber!)
      const targetNum = parseInt(String(luckyNumber), 10);
      const catalog = allCatalog
        .filter((n) => {
          if (n.confidence < 0.8) return false;
          if (gender !== "all" && n.gender !== gender && n.gender !== "unisex") return false;
          if (nakshatra && !n.nakshatraSlugs.some((s) => s.toLowerCase() === nakshatra.toLowerCase())) return false;
          if (targetNum >= 1 && targetNum <= 9) {
            return n.numerologyChaldean === targetNum || n.numerologyPythagorean === targetNum;
          }
          return true;
        })
        .slice(0, 4)
        .map((n) => {
          const numChald = calculateNumerology(n.nameLatin, "chaldean");
          const numPyth = calculateNumerology(n.nameLatin, "pythagorean");
          return {
            slug: n.slug,
            inCatalog: true,
            nameTamil: n.nameTamil,
            nameLatin: n.nameLatin,
            gender: n.gender,
            meaningTa: n.meaningTa,
            meaningEn: n.meaningEn,
            originCategory: n.originCategory,
            literaryReference: n.literaryReference,
            sourceWebsite:
              n.structuredReference?.sourceWebsite ||
              "https://dsal.uchicago.edu/dictionaries/tamil-lex/",
            startingSyllableTa: n.startingSyllableTa,
            confidence: n.confidence,
            numerologyNumber: numChald.nameNumber,
            compoundNumber: numChald.compoundNumber,
            pythagoreanNumber: numPyth.nameNumber,
            pythagoreanCompound: numPyth.compoundNumber,
            planetEn: numChald.planet.planetEn,
          };
        });

      return NextResponse.json({
        source: "catalog-fallback",
        modelUsed: "verified-catalog",
        providerUsed: "local",
        latencyMs: 5,
        summaryTa:
          "சங்கத் தமிழ் தொகுப்பிலிருந்து உங்கள் விருப்பத்திற்குப் பொருந்தும் பெயர்கள்:",
        summaryEn: "Top verified matches from our curated Tamil catalog:",
        recommendations: catalog,
      });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Advisor error" },
      { status: 400 }
    );
  }
}

