/**
 * OmniRoute AI Gateway Client (Primary AI Model Source)
 * Connects to http://localhost:20128/v1 with automatic provider/model fallback.
 */

try {
  if (!process.env.OMNIROUTE_API_KEY && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(".env.local");
  }
} catch {
  // .env.local optional in production
}

export interface OmniRouteChatResponse {
  content: string;
  modelUsed: string;
  providerUsed: string;
  latencyMs: number;
  fallbackUsed: boolean;
}

function getBaseUrl(): string {
  return process.env.OMNIROUTE_BASE_URL || "http://127.0.0.1:20128/v1";
}

function getApiKey(): string {
  return process.env.OMNIROUTE_API_KEY || "";
}

export async function callOmniRouteChat(params: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  jsonMode?: boolean;
  temperature?: number;
  maxTokens?: number;
}): Promise<OmniRouteChatResponse> {
  const {
    systemPrompt,
    userPrompt,
    model = process.env.OMNIROUTE_DEFAULT_MODEL || "auto/best-free",
    jsonMode = true,
    temperature = 0.2,
    maxTokens = 1200,
  } = params;

  const start = Date.now();
  // Multi-tier cascade across OmniRoute auto-router pools:
  // auto/best-free -> auto/chat -> auto/best-fast -> auto/fast -> auto/cheap
  const modelsToTry = [
    model,
    "auto/best-free",
    "auto/chat",
    "auto/best-fast",
    "auto/fast",
    "auto/cheap",
  ];
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();

  let lastError = "";
  for (const candidateModel of modelsToTry) {
    try {
      const body: Record<string, unknown> = {
        model: candidateModel,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      };
      if (jsonMode) {
        body.response_format = { type: "json_object" };
      }

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25000),
      });

      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        continue;
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || "";
      if (!content) {
        lastError = "Empty content from provider";
        continue;
      }

      return {
        content,
        modelUsed: data.model || candidateModel,
        providerUsed:
          res.headers.get("x-omniroute-provider") || "omniroute-gateway",
        latencyMs: Date.now() - start,
        fallbackUsed: false,
      };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  throw new Error(`OmniRoute gateway unreachable (${lastError})`);
}

