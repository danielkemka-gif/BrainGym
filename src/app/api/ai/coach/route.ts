import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildCoachContext, buildSystemPrompt } from "@/lib/coach-context";
import { checkPremiumAccess } from "@/lib/premium";
import { checkSharedServerRateLimit } from "@/lib/akuche/context-engine";
import {
  checkSafetyCrisisIntercept,
  detectPromptInjectionAttempt,
} from "@/lib/akuche/master-intelligence";
import { generateContextualIntelligentResponse } from "@/lib/akuche/intelligent-responder";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkSharedServerRateLimit({
      supabase,
      userId: user.id,
      endpoint: "coach",
      maxRequests: 30,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again shortly." },
        { status: 429 }
      );
    }

    const access = await checkPremiumAccess(user.id);
    if (!access.subscribed) {
      return NextResponse.json(
        { error: "Premium subscription required", code: "premium_required" },
        { status: 402 }
      );
    }

    const { message } = await request.json();
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 4000) {
      return NextResponse.json(
        { error: "Message exceeds maximum length (4,000 characters)" },
        { status: 400 }
      );
    }

    // Crisis safety intercept
    const crisis = checkSafetyCrisisIntercept(trimmedMessage);
    if (crisis) {
      return NextResponse.json({ reply: crisis.text });
    }

    // Prompt injection guard
    if (detectPromptInjectionAttempt(trimmedMessage)) {
      const guarded = generateContextualIntelligentResponse({
        message: trimmedMessage,
        mode: "brain_coach",
      });
      return NextResponse.json({ reply: guarded.text });
    }

    const ctx = await buildCoachContext(user.id);
    if (!ctx) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const systemPrompt = buildSystemPrompt(ctx);

    const rawApiKey = process.env.OPENAI_API_KEY || "";
    const openaiApiKey = rawApiKey.trim().replace(/^["']|["']$/g, "");

    // Fetch conversation history (last 8 messages) for short-term context
    const { data: historyRows } = await supabase
      .from("ai_feedback")
      .select("message, metadata")
      .eq("user_id", user.id)
      .eq("feedback_type", "coach_message")
      .order("created_at", { ascending: false })
      .limit(8);

    const historyMessages: { role: "user" | "assistant"; content: string }[] = [];
    if (historyRows && historyRows.length > 0) {
      const reversed = [...historyRows].reverse();
      for (const row of reversed) {
        const role = (row.metadata as Record<string, unknown>)?.role;
        if (role === "user") {
          historyMessages.push({ role: "user", content: row.message });
        } else if (role === "coach") {
          historyMessages.push({ role: "assistant", content: row.message });
        }
      }
    }

    if (!openaiApiKey) {
      console.warn(
        "[AKUCHE AI FALLBACK] /api/ai/coach: OPENAI_API_KEY is not configured. Using local 5-stage Socratic fallback responder."
      );
      const fallback = generateContextualIntelligentResponse({
        message: trimmedMessage,
        history: historyMessages,
        mode: "brain_coach",
        serverProfile: ctx.profile,
      });
      return NextResponse.json({
        reply: fallback.text,
        responseSource: "fallback_engine",
        fallbackReason: "missing_api_key",
      });
    }

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
          messages: [
            { role: "system", content: systemPrompt },
            ...historyMessages,
            { role: "user", content: trimmedMessage },
          ],
          max_tokens: 1024,
          temperature: 0.55,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch {
      console.warn(
        "[AKUCHE AI FALLBACK] /api/ai/coach: OpenAI network/timeout error. Activating local fallback responder."
      );
      const fallback = generateContextualIntelligentResponse({
        message: trimmedMessage,
        history: historyMessages,
        mode: "brain_coach",
        serverProfile: ctx.profile,
      });
      return NextResponse.json({
        reply: fallback.text,
        responseSource: "fallback_engine",
        fallbackReason: "openai_network_unavailable",
      });
    }

    if (!response.ok) {
      console.warn(
        `[AKUCHE AI FALLBACK] /api/ai/coach: OpenAI API returned HTTP ${response.status}. Activating local fallback responder.`
      );
      const fallback = generateContextualIntelligentResponse({
        message: trimmedMessage,
        history: historyMessages,
        mode: "brain_coach",
        serverProfile: ctx.profile,
      });
      return NextResponse.json({
        reply: fallback.text,
        responseSource: "fallback_engine",
        fallbackReason: `openai_http_${response.status}`,
      });
    }

    const data = await response.json();
    const liveContent = data.choices?.[0]?.message?.content;
    const reply =
      liveContent ??
      generateContextualIntelligentResponse({
        message: trimmedMessage,
        history: historyMessages,
        mode: "brain_coach",
        serverProfile: ctx.profile,
      }).text;

    await Promise.allSettled([
      supabase.from("ai_feedback").insert({
        user_id: user.id,
        feedback_type: "coach_message",
        message: trimmedMessage,
        metadata: { role: "user" },
      }),
      supabase.from("ai_feedback").insert({
        user_id: user.id,
        feedback_type: "coach_message",
        message: reply,
        metadata: {
          role: "coach",
          responseSource: liveContent ? "live_ai" : "fallback_engine",
        },
      }),
    ]);

    return NextResponse.json({
      reply,
      usage: data.usage,
      responseSource: liveContent ? "live_ai" : "fallback_engine",
    });
  } catch (err) {
    console.error("Coach API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
