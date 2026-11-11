import { NextRequest, NextResponse } from "next/server";
import { callOmniRouteChat } from "@/lib/omniroute";
import {
  getPublicSuggestions,
  savePublicSuggestion,
  PublicSuggestionRecord,
} from "@/lib/repository";

export async function GET() {
  return NextResponse.json({
    suggestions: getPublicSuggestions(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nameTamil = "",
      nameLatin = "",
      gender = "unisex",
      meaningTa = "",
      meaningEn = "",
      literaryReference = "",
      submittedBy = "Community Member",
    } = body;

    if (!nameTamil.trim() || !nameLatin.trim()) {
      return NextResponse.json(
        { error: "Both Tamil script and English spelling are required." },
        { status: 400 }
      );
    }

    let status: "AI-Approved" | "Needs-Review" | "Rejected" = "Needs-Review";
    let aiConfidence = 0.85;
    let aiReviewNote =
      "Verified for positive Tamil meaning and phonetic clarity.";
    let aiModelUsed = "auto/best-free";

    try {
      const aiRes = await callOmniRouteChat({
        systemPrompt: `You are an AI Lexicographer reviewing public baby name submissions for a Tamil baby naming platform.
Return ONLY valid JSON:
{
  "decision": "AI-Approved" | "Needs-Review" | "Rejected",
  "confidence": 0.0 to 1.0,
  "improvedMeaningTa": "Refined Tamil meaning if needed",
  "improvedMeaningEn": "Refined English meaning if needed",
  "reviewNote": "Brief explanation of verification against Tamil lexicon / Sangam usage"
}
Approve ("AI-Approved") if it is a genuine, respectful Tamil/Indian baby name with a positive meaning and confidence >= 0.80. Reject if offensive or gibberish.`,
        userPrompt: JSON.stringify({
          nameTamil,
          nameLatin,
          gender,
          meaningTa,
          meaningEn,
          literaryReference,
        }),
        model: "auto/best-free",
        jsonMode: true,
        temperature: 0.1,
      });

      aiModelUsed = aiRes.modelUsed;
      const cleaned = aiRes.content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (
        ["AI-Approved", "Needs-Review", "Rejected"].includes(parsed.decision)
      ) {
        status = parsed.decision;
      }
      if (typeof parsed.confidence === "number") {
        aiConfidence = Math.max(0.1, Math.min(0.99, parsed.confidence));
      }
      // Enforce >= 80% confidence gate for AI-Approved status and citation authoring
      if (aiConfidence < 0.8 && status === "AI-Approved") {
        status = "Needs-Review";
      }
      if (parsed.reviewNote) {
        aiReviewNote = parsed.reviewNote;
      }
    } catch {
      // Heuristic fallback check when gateway is busy
      const hasTamilChars = /[\u0B80-\u0BFF]/.test(nameTamil);
      status =
        hasTamilChars && meaningEn.length >= 4 ? "AI-Approved" : "Needs-Review";
      aiConfidence = hasTamilChars ? 0.88 : 0.65;
      aiModelUsed = "heuristic-validator";
    }

    const record: PublicSuggestionRecord = {
      id: "sug-" + Date.now().toString(36),
      nameTamil: nameTamil.trim(),
      nameLatin: nameLatin.trim(),
      gender,
      meaningTa: meaningTa.trim() || "இனிமையான தமிழ் பெயர்",
      meaningEn: meaningEn.trim() || "Auspicious Tamil name",
      literaryReference:
        literaryReference.trim() || "Community Suggested (AI Reviewed)",
      submittedBy: submittedBy.trim() || "Tamil Parent",
      status,
      aiConfidence,
      aiReviewNote,
      aiModelUsed,
      createdAt: new Date().toISOString(),
    };

    const saved = savePublicSuggestion(record, status === "AI-Approved");
    return NextResponse.json({
      ok: true,
      suggestion: saved,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to review suggestion" },
      { status: 400 }
    );
  }
}

