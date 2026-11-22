/**
 * AKUCHE MULTI-PROVIDER AI ROUTER
 *
 * Provider-agnostic inference layer so Akuche's identity and reliability are never
 * locked to a single AI vendor. Supports OpenAI, Anthropic, and Google Gemini via
 * environment configuration with automatic failover and structured JSON extraction.
 */

export type AiProviderName = "openai" | "anthropic" | "gemini";

export interface AiChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiCompletionOptions {
  messages: AiChatMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  timeoutMs?: number;
  preferredProvider?: AiProviderName;
  preferredModel?: string;
}

export interface AiCompletionResult {
  ok: boolean;
  content: string;
  provider: AiProviderName | "fallback";
  model: string;
  latencyMs: number;
  error?: string;
}

function isPlaceholderKey(key: string | undefined): boolean {
  if (!key) return true;
  const trimmed = key.trim();
  if (!trimmed || trimmed.length < 12) return true;
  const lower = trimmed.toLowerCase();
  return (
    lower.includes("your-openai-key") ||
    lower.includes("your_key") ||
    lower.includes("placeholder") ||
    lower === "sk-test"
  );
}

export function getConfiguredProviders(): AiProviderName[] {
  const ordered: AiProviderName[] = [];
  const primary = (process.env.AI_PROVIDER || "openai").toLowerCase() as AiProviderName;
  const fallback = (process.env.AI_FALLBACK_PROVIDER || "").toLowerCase() as AiProviderName;

  const candidates: AiProviderName[] = [primary];
  if (fallback && !candidates.includes(fallback)) candidates.push(fallback);
  for (const p of ["openai", "anthropic", "gemini"] as AiProviderName[]) {
    if (!candidates.includes(p)) candidates.push(p);
  }

  for (const p of candidates) {
    if (p === "openai" && !isPlaceholderKey(process.env.OPENAI_API_KEY)) {
      ordered.push("openai");
    } else if (p === "anthropic" && !isPlaceholderKey(process.env.ANTHROPIC_API_KEY)) {
      ordered.push("anthropic");
    } else if (p === "gemini" && !isPlaceholderKey(process.env.GEMINI_API_KEY)) {
      ordered.push("gemini");
    }
  }
  return ordered;
}

async function callOpenAI(
  options: AiCompletionOptions,
  signal: AbortSignal
): Promise<{ content: string; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY!;
  const model = options.preferredModel || process.env.AI_MODEL || "gpt-4o-mini";

  const body: Record<string, unknown> = {
    model,
    messages: options.messages,
    temperature: options.temperature ?? 0.45,
    max_tokens: options.maxTokens ?? 1200,
  };

  if (options.jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${res.status}: ${errText.slice(0, 180)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("OpenAI returned empty content");
  }
  return { content, model };
}

async function callAnthropic(
  options: AiCompletionOptions,
  signal: AbortSignal
): Promise<{ content: string; model: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY!;
  const model =
    options.preferredModel ||
    process.env.ANTHROPIC_MODEL ||
    "claude-3-5-haiku-latest";

  const systemParts = options.messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");

  const nonSystem = options.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens ?? 1200,
      temperature: options.temperature ?? 0.45,
      system: options.jsonMode
        ? `${systemParts}\n\nIMPORTANT: Output ONLY valid JSON matching the requested schema, with no markdown fences.`
        : systemParts,
      messages: nonSystem,
    }),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Anthropic HTTP ${res.status}: ${errText.slice(0, 180)}`);
  }

  const data = await res.json();
  const content = data?.content?.[0]?.text;
  if (!content || typeof content !== "string") {
    throw new Error("Anthropic returned empty content");
  }
  return { content, model };
}

async function callGemini(
  options: AiCompletionOptions,
  signal: AbortSignal
): Promise<{ content: string; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const model =
    options.preferredModel || process.env.GEMINI_MODEL || "gemini-2.0-flash";

  const systemParts = options.messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");

  const contents = options.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: systemParts ? { parts: [{ text: systemParts }] } : undefined,
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.45,
        maxOutputTokens: options.maxTokens ?? 1200,
        ...(options.jsonMode ? { responseMimeType: "application/json" } : {}),
      },
    }),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini HTTP ${res.status}: ${errText.slice(0, 180)}`);
  }

  const data = await res.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content || typeof content !== "string") {
    throw new Error("Gemini returned empty content");
  }
  return { content, model };
}

export async function generateAiCompletion(
  options: AiCompletionOptions
): Promise<AiCompletionResult> {
  const start = Date.now();
  const providers = getConfiguredProviders();

  if (options.preferredProvider && providers.includes(options.preferredProvider)) {
    providers.splice(providers.indexOf(options.preferredProvider), 1);
    providers.unshift(options.preferredProvider);
  }

  if (providers.length === 0) {
    return {
      ok: false,
      content: "",
      provider: "fallback",
      model: "none",
      latencyMs: Date.now() - start,
      error: "missing_api_key",
    };
  }

  const timeoutMs = options.timeoutMs ?? 20000;
  let lastError = "unknown_provider_error";

  for (const provider of providers) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let result: { content: string; model: string };
      if (provider === "openai") {
        result = await callOpenAI(options, controller.signal);
      } else if (provider === "anthropic") {
        result = await callAnthropic(options, controller.signal);
      } else {
        result = await callGemini(options, controller.signal);
      }
      clearTimeout(timer);
      return {
        ok: true,
        content: result.content,
        provider,
        model: result.model,
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      clearTimeout(timer);
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[ai/providers] ${provider} failed, trying next if available:`, lastError);
    }
  }

  return {
    ok: false,
    content: "",
    provider: "fallback",
    model: "none",
    latencyMs: Date.now() - start,
    error: lastError,
  };
}

/**
 * Safely parse JSON from an AI response, stripping optional markdown code fences.
 */
export function safeParseAiJson<T = Record<string, unknown>>(raw: string): T | null {
  if (!raw) return null;
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
