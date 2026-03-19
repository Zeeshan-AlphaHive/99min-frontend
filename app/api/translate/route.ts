import { NextResponse } from "next/server";

type TranslateRequestBody = {
  text: string;
  to: string; // BCP 47 locale, e.g. "bg", "es"
};

function extractGoogleTranslateResult(data: unknown): string | null {
  // Google Translate format (dt=t):
  // [
  //   [
  //     ["Translated text", "Original text", null, null, 1],
  //     ...
  //   ],
  //   null,
  //   "en",
  //   ...
  // ]
  try {
    const arr = data as any[];
    const first = arr?.[0];
    if (!Array.isArray(first)) return null;
    const parts = first
      .map((seg: any) => seg?.[0])
      .filter((s: unknown) => typeof s === "string") as string[];
    if (parts.length === 0) return null;
    return parts.join("");
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TranslateRequestBody;
    const text = typeof body?.text === "string" ? body.text : "";
    const to = typeof body?.to === "string" ? body.to : "en";

    if (!text.trim()) {
      return NextResponse.json({ translatedText: text });
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
      to,
    )}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url, {
      headers: {
        // Helps some endpoints decide we are not a bot.
        "User-Agent": "Mozilla/5.0 (compatible; 99min-i18n)",
      },
      // Google may vary by caching; keep default.
    });

    if (!res.ok) {
      return NextResponse.json({ translatedText: text });
    }

    const data = (await res.json()) as unknown;
    const translated = extractGoogleTranslateResult(data);

    return NextResponse.json({ translatedText: translated ?? text });
  } catch {
    return NextResponse.json({ translatedText: "" });
  }
}

