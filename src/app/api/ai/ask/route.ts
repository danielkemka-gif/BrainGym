import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  AkucheInteractionMode,
  checkSafetyCrisisIntercept,
  detectPromptInjectionAttempt,
} from "@/lib/akuche/master-intelligence";
import {
  assembleContextualIntelligence,
  checkSharedServerRateLimit,
  ClientSuppliedContext,
  ServerUserProfile,
} from "@/lib/akuche/context-engine";
import {
  generateContextualIntelligentResponse,
  SocraticThinkingCards,
} from "@/lib/akuche/intelligent-responder";

export type { SocraticThinkingCards };

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // PHASE 1 (REQ 1 & 4): Require valid authenticated Supabase session; do not rely on spoofable IP headers
    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required. Please sign in to continue your Akuche coaching session.",
          code: "auth_required",
        },
        { status: 401 }
      );
    }

    // PHASE 1 (REQ 3): Shared server-side rate limiting suitable for Vercel serverless deployment
    const rateLimit = await checkSharedServerRateLimit({
      supabase,
      userId: user.id,
      endpoint: "ask",
      maxRequests: 45,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please pause for a moment and try again shortly.",
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, history, mode, clientContext } = body as {
      message?: string;
      history?: { role: string; content: string }[];
      mode?: AkucheInteractionMode;
      clientContext?: ClientSuppliedContext;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 4000) {
      return NextResponse.json(
        { error: "Message is too long (maximum 4,000 characters)." },
        { status: 400 }
      );
    }

    const activeMode: AkucheInteractionMode = mode || "coaching_chat";

    // 1. PRIORITY SAFETY INTERCEPT: Crisis, Self-Harm, or Medical Emergency Detection
    const crisisCheck = checkSafetyCrisisIntercept(trimmedMessage);
    if (crisisCheck) {
      return NextResponse.json({
        reply: crisisCheck.text,
        structuredCards: null,
        claritySnapshot: null,
        thinkingMirrorObservation: null,
        responseSource: "safety_intercept",
      });
    }

    // 2. PROMPT INJECTION & SYSTEM INSTRUCTION PROTECTION
    if (detectPromptInjectionAttempt(trimmedMessage)) {
      const guarded = generateContextualIntelligentResponse({
        message: trimmedMessage,
        mode: activeMode,
      });
      return NextResponse.json({
        reply: guarded.text,
        structuredCards: null,
        claritySnapshot: null,
        thinkingMirrorObservation: null,
        classification: guarded.classification,
        responseSource: "security_guard",
      });
    }

    // 3. RETRIEVE SERVER-SIDE USER PROFILE FOR AUTHENTICATED USER
    let serverProfile: ServerUserProfile | null = null;
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, age, occupation, goals, challenges")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        serverProfile = {
          name: profileData.name,
          age: profileData.age,
          occupation: profileData.occupation,
          goals: Array.isArray(profileData.goals) ? profileData.goals : [],
          challenges: Array.isArray(profileData.challenges)
            ? profileData.challenges
            : [],
        };
      }
    } catch {
      // Non-blocking fallback if profile fetch fails
    }

    // 4. ASSEMBLE CONTEXTUAL INTELLIGENCE & FIVE-STAGE REASONING PACKAGE
    const { systemPrompt, trimmedHistory, classification } =
      assembleContextualIntelligence({
        message: trimmedMessage,
        history,
        mode: activeMode,
        serverProfile,
        clientContext,
      });

    const rawApiKey = process.env.OPENAI_API_KEY || "";
    const openaiApiKey = rawApiKey.trim().replace(/^["']|["']$/g, "");

    // 5. PHASE 2 (REQ 5 & 6): IF OPENAI KEY IS MISSING, LOG WARNING & EXPLICITLY TAG FALLBACK
    if (!openaiApiKey) {
      console.warn(
        "[AKUCHE AI FALLBACK] /api/ai/ask: OPENAI_API_KEY is not configured. Using local 5-stage Socratic fallback responder."
      );
      const fallback = generateContextualIntelligentResponse({
        message: trimmedMessage,
        history: trimmedHistory,
        mode: activeMode,
        serverProfile,
        clientContext,
      });
      return NextResponse.json({
        reply: fallback.text,
        structuredCards: fallback.cards,
        claritySnapshot: fallback.claritySnapshot,
        thinkingMirrorObservation: fallback.thinkingMirrorObservation ?? null,
        classification: fallback.classification,
        responseSource: "fallback_engine",
        fallbackReason: "missing_api_key",
      });
    }

    // 6. CALL LIVE OPENAI MODEL WITH CALIBRATED TEMPERATURE, TIMEOUT & GRACEFUL FALLBACK
    let response: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            ...trimmedHistory,
            { role: "user", content: trimmedMessage },
          ],
          max_tokens: classification.depth === "simple" ? 700 : 1600,
          temperature: classification.intent === "simple_factual" ? 0.3 : 0.55,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (networkErr) {
      console.warn(
        "[AKUCHE AI FALLBACK] /api/ai/ask: OpenAI network/timeout error. Activating local 5-stage Socratic fallback responder.",
        networkErr instanceof Error ? networkErr.message : "network_error"
      );
      const fallback = generateContextualIntelligentResponse({
        message: trimmedMessage,
        history: trimmedHistory,
        mode: activeMode,
        serverProfile,
        clientContext,
      });
      return NextResponse.json({
        reply: fallback.text,
        structuredCards: fallback.cards,
        claritySnapshot: fallback.claritySnapshot,
        thinkingMirrorObservation: fallback.thinkingMirrorObservation ?? null,
        classification: fallback.classification,
        responseSource: "fallback_engine",
        fallbackReason: "openai_network_unavailable",
      });
    }

    if (!response.ok) {
      console.warn(
        `[AKUCHE AI FALLBACK] /api/ai/ask: OpenAI API returned HTTP ${response.status}. Activating local 5-stage Socratic fallback responder.`
      );
      const fallback = generateContextualIntelligentResponse({
        message: trimmedMessage,
        history: trimmedHistory,
        mode: activeMode,
        serverProfile,
        clientContext,
      });
      return NextResponse.json({
        reply: fallback.text,
        structuredCards: fallback.cards,
        claritySnapshot: fallback.claritySnapshot,
        thinkingMirrorObservation: fallback.thinkingMirrorObservation ?? null,
        classification: fallback.classification,
        responseSource: "fallback_engine",
        fallbackReason: `openai_http_${response.status}`,
      });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "{}";
    let parsed: Record<string, any> = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = { text: rawContent };
    }

    const hasValidLiveText =
      typeof parsed.text === "string" && parsed.text.trim().length > 0;

    const replyText = hasValidLiveText
      ? parsed.text.trim()
      : generateContextualIntelligentResponse({
          message: trimmedMessage,
          history: trimmedHistory,
          mode: activeMode,
          serverProfile,
          clientContext,
        }).text;

    const structuredCards = classification.shouldIncludeStructuredCards
      ? parsed.cards || null
      : null;
    const claritySnapshot = classification.shouldIncludeClaritySnapshot
      ? parsed.claritySnapshot || null
      : null;
    const thinkingMirrorObservation = parsed.thinkingMirrorObservation || null;

    // 7. PERSIST EXCHANGE FOR AUTHENTICATED USER (NON-BLOCKING)
    Promise.allSettled([
      supabase.from("ai_feedback").insert({
        user_id: user.id,
        feedback_type: "ask_akuche_message",
        message: trimmedMessage,
        metadata: {
          role: "user",
          mode: activeMode,
          intent: classification.intent,
          reasoningStage: classification.reasoningStage,
          subject: classification.subjectSummary,
        },
      }),
      supabase.from("ai_feedback").insert({
        user_id: user.id,
        feedback_type: "ask_akuche_message",
        message: replyText,
        metadata: {
          role: "assistant",
          mode: activeMode,
          intent: classification.intent,
          reasoningStage: classification.reasoningStage,
          subject: classification.subjectSummary,
          responseSource: hasValidLiveText ? "live_ai" : "fallback_engine",
        },
      }),
    ]).catch(() => {});

    return NextResponse.json({
      reply: replyText,
      structuredCards,
      claritySnapshot,
      thinkingMirrorObservation,
      classification,
      responseSource: hasValidLiveText ? "live_ai" : "fallback_engine",
    });
  } catch (err) {
    console.error("Ask AKUCHE error:", err);
    return NextResponse.json(
      { error: "Unable to process your request right now. Please try again." },
      { status: 500 }
    );
  }
}
