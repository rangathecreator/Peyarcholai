import { NextRequest, NextResponse } from "next/server";
import { formatTamilForSpeech } from "@/lib/pronunciation";

const MAX_CACHE_ENTRIES = 500;
const audioCache = new Map<string, ArrayBuffer>();

function getCached(key: string): ArrayBuffer | undefined {
  const hit = audioCache.get(key);
  if (!hit) return undefined;
  // Refresh LRU order
  audioCache.delete(key);
  audioCache.set(key, hit);
  return hit;
}

function setCached(key: string, buf: ArrayBuffer): void {
  if (audioCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = audioCache.keys().next().value;
    if (oldest !== undefined) audioCache.delete(oldest);
  }
  audioCache.set(key, buf);
}

/**
 * GET /api/tts?text=...&lang=ta-IN|en-IN
 * Serves native Tamil (ta) or Indian English (en-IN) audio/mpeg MP3 with
 * aggressive LRU + immutable CDN edge caching (1 year) so every name is
 * synthesized once and works identically across Windows, Firefox, Safari, iOS & Android.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawText = (searchParams.get("text") || "").trim();
  const langParam = (searchParams.get("lang") || "ta-IN").trim();

  if (!rawText || rawText.length > 60) {
    return NextResponse.json(
      { error: "text is required (1..60 chars)" },
      { status: 400 }
    );
  }

  // Allow only Tamil Unicode, Latin letters, spaces, hyphens, and dots
  if (!/^[\u0B80-\u0BFFa-zA-Z\s.\-]+$/.test(rawText)) {
    return NextResponse.json(
      { error: "Invalid characters in text" },
      { status: 400 }
    );
  }

  const isTamil = langParam.toLowerCase().startsWith("ta");
  const tl = isTamil ? "ta" : "en-IN";
  const speechText = isTamil ? formatTamilForSpeech(rawText) : rawText;
  const cacheKey = `${tl}:${speechText.toLowerCase()}`;

  const cached = getCached(cacheKey);
  if (cached) {
    return new NextResponse(cached, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        "X-TTS-Cache": "HIT",
      },
    });
  }

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      speechText
    )}&tl=${encodeURIComponent(tl)}&client=tw-ob`;

    const upstream = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "audio/mpeg, audio/*;q=0.9",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "TTS service temporarily unavailable" },
        { status: 503 }
      );
    }

    const buf = await upstream.arrayBuffer();
    if (buf.byteLength < 256) {
      return NextResponse.json(
        { error: "Empty TTS audio response" },
        { status: 503 }
      );
    }

    setCached(cacheKey, buf);

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        "X-TTS-Cache": "MISS",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "TTS service unreachable" },
      { status: 503 }
    );
  }
}
