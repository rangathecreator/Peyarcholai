import fs from "node:fs";
import path from "node:path";

const OMNIROUTE_URL = "http://127.0.0.1:20128/v1";
try { process.loadEnvFile(".env.local"); } catch { /* optional */ }
const OMNIROUTE_KEY = process.env.OMNIROUTE_API_KEY || "";

async function consultOmniRouteArchitect() {
  console.log("[OmniRoute Architect] Consulting free-tier model on http://127.0.0.1:20128/v1 ...");

  const systemPrompt = `You are a Principal Tamil Lexicographer, Data Architect, and Product Strategist for 'NamingGuru Tamil'.
Return a comprehensive, structured JSON object revising the 10,000+ Tamil Baby Name Sourcing & Application Upgrade Plan.
Include these top-level keys:
- "parentPerspectiveInsights": array of 6 high-value parent-centric insights (what Tamil parents in TN & global diaspora worry about when choosing a name)
- "multiLanguageMeaningStrategy": object explaining how to capture meanings across Tamil, Sanskrit, Malayalam, Telugu, Kannada, Hindi, and English (including cross-language false-friend warnings)
- "citationGranularityStrategy": object explaining how to structure exact book, chapter/kandam, padalam, song/paadal number, and line title citations (e.g. Kamba Ramayanam, Tolkappiyam, Purananuru, Kurunthogai, Tirukkural, Silappathikaram, Thevaram)
- "numerologyStandardization": object explaining standard letter-value mapping (Pythagorean A-Z 1-9 standard + Chaldean 1-8 Cheiro standard, letter-by-letter breakdown)
- "culturalAndGeographicalTaxonomy": object covering religions (Hindu/Saiva/Vaishnava/Murugan, Tamil Christian, Tamil Muslim, Secular Pure Tamil), regional sub-traditions (Chola/Cauvery Delta, Pandya/Madurai, Kongu, Cheran/Kumari, Eelam/Sri Lankan Tamil, Global Diaspora), and ethical community tagging
- "additionalParentDimensions": array of 6 extra parent-friendly dimensions (nicknames/pet names, sibling compatibility, official document length for Aadhaar/Passport, initial harmony, teasing check, audio phonetic guide)`;

  const userPrompt = `Revise our 10,000+ Tamil Name Sourcing & Application Schema Plan to satisfy all 10 Product Owner criteria:
1. Meaning (Tamil + English)
2. Meaning by language (list all meanings if the same name exists in Tamil, Sanskrit, Malayalam, Telugu, Hindi, etc. + cross-language warning)
3. Exact reference of the name (e.g. Kamba Ramayanam Kandam/Padalam/Paadal, Tolkappiyam line/sutra, Purananuru song number & title, Tirukkural adhigaram & kural number)
4. Numerology calculation + method followed + letter-by-letter values
5. Religion, community tradition, and geographical significance
6. Suitable gender (Boy, Girl, Unisex)
7. Ease of calling (Tamil native vs Pan-India/Global score + syllable breakdown)
8. Chances of misspell (Low/Medium/High + official recommended spelling + likely variants)
9. Uniqueness of the name in the region (Rarity band + estimated percentile in Tamil Nadu & Diaspora)
10. Is it a trending name (Trending / Rising / Evergreen Classic / Rare Revival)`;

  const res = await fetch(`${OMNIROUTE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OMNIROUTE_KEY}`,
    },
    body: JSON.stringify({
      model: "auto/best-free",
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) {
    throw new Error(`OmniRoute HTTP ${res.status}`);
  }

  const data = await res.json();
  const provider = res.headers.get("x-omniroute-provider") || "omniroute-free";
  const cost = res.headers.get("x-omniroute-response-cost") || "0";
  const modelUsed = data.model || "auto/best-free";

  console.log(`[OmniRoute Architect] Success! Model=${modelUsed} | Provider=${provider} | Cost=$${cost}`);
  const content = data.choices?.[0]?.message?.content || "{}";
  const outFile = path.join(process.cwd(), "src", "data", "omniroute-revised-plan.json");
  fs.writeFileSync(outFile, content, "utf8");
  console.log(`[OmniRoute Architect] Saved architectural review to ${outFile}`);
}

consultOmniRouteArchitect().catch((err) => {
  console.error("[OmniRoute Architect] Error:", err.message);
  process.exit(1);
});

