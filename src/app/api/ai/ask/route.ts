import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AkucheInteractionMode } from "@/lib/akuche/master-intelligence";
import {
  checkSharedServerRateLimit,
  ClientSuppliedContext,
} from "@/lib/akuche/context-engine";
import { SocraticThinkingCards } from "@/lib/akuche/intelligent-responder";
import { generateAiCompletion, safeParseAiJson } from "@/lib/ai/providers";
import {
  detectPromptInjection,
  evaluateSafetyAndBoundaries,
  sanitizeContextText,
} from "@/lib/akuche/safety";
import {
  buildCoachingSystemPrompt,
  buildStructuredFallbackResponse,
  planCoachingIntervention,
  type CoachingStyle,
  type ProposedAssignmentPayload,
} from "@/lib/akuche/engine/coaching-engine";

export type { SocraticThinkingCards };

interface ServerMemoryRow {
  category: string;
  title: string;
  content: string;
  verification_status: string;
  updated_at?: string;
}

function scoreMemoryRelevance(message: string, item: ServerMemoryRow): number {
  const msgTokens = new Set(
    message
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 3)
  );
  const text = `${item.title} ${item.content}`.toLowerCase();
  let score = item.verification_status === "confirmed" ? 6 : 2;
  if (item.category === "profile") score += 8;
  if (item.category === "goal" || item.category === "commitment") score += 6;
  for (const token of msgTokens) {
    if (text.includes(token)) score += 12;
  }
  return score;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Authentication required. Please sign in to continue your Akuche coaching session.",
          code: "auth_required",
        },
        { status: 401 }
      );
    }

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
    const { message, history, mode, workspace, clientContext } = body as {
      message?: string;
      history?: { role: string; content: string }[];
      mode?: AkucheInteractionMode | string;
      workspace?: string;
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

    // 1. UNIFIED SAFETY & CRISIS INTERCEPT (Self-Harm, Abuse/DV, Medical Emergency)
    const safety = evaluateSafetyAndBoundaries(trimmedMessage);
    if (safety.requiresImmediateIntercept && safety.interceptMessage) {
      return NextResponse.json({
        reply: safety.interceptMessage,
        structuredCards: null,
        claritySnapshot: null,
        thinkingMirrorObservation: null,
        proposedAssignment: null,
        safetyCategory: safety.category,
        responseSource: "safety_intercept",
      });
    }

    // 2. PROMPT INJECTION GUARD (on user input)
    if (detectPromptInjection(trimmedMessage)) {
      return NextResponse.json({
        reply:
          "I stay focused on helping you think through real-life situations, decisions, and plans—I cannot reveal internal instructions or override my safety boundaries. What real challenge or goal would you like to work through today?",
        structuredCards: null,
        claritySnapshot: null,
        thinkingMirrorObservation: null,
        proposedAssignment: null,
        responseSource: "security_guard",
      });
    }

    // 3. SERVER-FIRST CONTEXT LOADING (Profile, Settings, Selective Memories, Goals, Assignments)
    const [profileRes, settingsRes, memoriesRes, goalsRes, assignmentsRes] =
      await Promise.allSettled([
        supabase
          .from("profiles")
          .select("name, age, occupation, goals, challenges")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("user_settings")
          .select("coaching_style, time_budget_mins")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("akuche_memories")
          .select("category, title, content, verification_status, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(40),
        supabase
          .from("akuche_goals")
          .select("title, domain, progress_percent")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("updated_at", { ascending: false })
          .limit(5),
        supabase
          .from("akuche_assignments")
          .select("title, status, deadline")
          .eq("user_id", user.id)
          .in("status", ["proposed", "accepted", "in_progress", "blocked"])
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    const profileData =
      profileRes.status === "fulfilled" ? profileRes.value.data : null;
    const settingsData =
      settingsRes.status === "fulfilled" ? settingsRes.value.data : null;

    const memoryEnabled = clientContext?.memoryEnabled !== false;
    let selectedMemories: Array<{
      title: string;
      content: string;
      category: string;
      verificationStatus: "confirmed" | "ai_interpreted";
    }> = [];

    if (memoryEnabled) {
      const serverRows: ServerMemoryRow[] =
        memoriesRes.status === "fulfilled" && Array.isArray(memoriesRes.value.data)
          ? (memoriesRes.value.data as ServerMemoryRow[])
          : [];

      // Prefer server-stored memories; fall back cleanly to sanitized client memories only if DB table is empty/unmigrated
      const candidateRows: ServerMemoryRow[] =
        serverRows.length > 0
          ? serverRows
          : (clientContext?.memories ?? []).map((m) => ({
              category: m.category,
              title: m.title,
              content: m.content,
              verification_status: m.verificationStatus || "confirmed",
            }));

      selectedMemories = candidateRows
        .map((item) => ({ item, score: scoreMemoryRelevance(trimmedMessage, item) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(({ item }) => ({
          title: sanitizeContextText(item.title, 80),
          content: sanitizeContextText(item.content, 220),
          category: item.category,
          verificationStatus:
            item.verification_status === "ai_interpreted"
              ? "ai_interpreted"
              : "confirmed",
        }));
    }

    const activeGoals =
      goalsRes.status === "fulfilled" && Array.isArray(goalsRes.value.data) && goalsRes.value.data.length > 0
        ? goalsRes.value.data.map((g: any) => ({
            title: sanitizeContextText(g.title, 90),
            domain: g.domain,
            progressPercent: g.progress_percent,
          }))
        : (clientContext?.activeGoals ?? []).slice(0, 3).map((g) => ({
            title: sanitizeContextText(g.title, 90),
          }));

    const activeAssignments =
      assignmentsRes.status === "fulfilled" && Array.isArray(assignmentsRes.value.data)
        ? assignmentsRes.value.data.map((a: any) => ({
            title: sanitizeContextText(a.title, 90),
            status: a.status,
            deadline: a.deadline,
          }))
        : [];

    const sanitizedHistory = Array.isArray(history)
      ? history
          .slice(-8)
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string" &&
              m.content.trim().length > 0
          )
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content:
              m.role === "user"
                ? sanitizeContextText(m.content, 1200)
                : m.content.slice(0, 1200),
          }))
      : [];

    // 4. ORCHESTRATE COACHING MODE + ADAPTIVE DESIGN THINKING + DOMAIN INTELLIGENCE
    const engineInput = {
      message: trimmedMessage,
      history: sanitizedHistory,
      requestedMode: mode || "coaching_chat",
      workspaceHint: workspace || mode,
      coachingStyle: (settingsData?.coaching_style as CoachingStyle) || "balanced",
      userName: profileData?.name || undefined,
      timeBudgetMins: settingsData?.time_budget_mins || 15,
      memories: selectedMemories,
      activeGoals,
      activeAssignments,
      safety,
    };

    const plan = planCoachingIntervention(engineInput);
    const systemPrompt = buildCoachingSystemPrompt(engineInput, plan);

    // 5. CALL MULTI-PROVIDER AI ROUTER (OpenAI / Anthropic / Gemini) WITH STRUCTURED FALLBACK
    const aiResult = await generateAiCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedHistory,
        { role: "user", content: trimmedMessage },
      ],
      jsonMode: true,
      maxTokens: plan.depth === "quick" ? 750 : 1550,
      temperature: plan.designThinkingStage === "direct" ? 0.3 : 0.5,
      timeoutMs: 22000,
    });

    let parsed: Record<string, any> | null = null;
    let responseSource: "live_ai" | "fallback_engine" = "fallback_engine";
    let fallbackReason: string | undefined;

    if (aiResult.ok) {
      parsed = safeParseAiJson<Record<string, any>>(aiResult.content);
      const liveText =
        typeof parsed?.response === "string"
          ? parsed.response.trim()
          : typeof parsed?.text === "string"
          ? parsed.text.trim()
          : "";
      if (liveText) {
        responseSource = "live_ai";
      } else {
        fallbackReason = "invalid_json_output";
        parsed = null;
      }
    } else {
      fallbackReason = aiResult.error || "provider_unavailable";
    }

    const fallback = !parsed ? buildStructuredFallbackResponse(engineInput, plan) : null;
    const replyText =
      (parsed &&
        (typeof parsed.response === "string"
          ? parsed.response.trim()
          : typeof parsed.text === "string"
          ? parsed.text.trim()
          : "")) ||
      fallback!.response;

    const rawCards = parsed ? parsed.cards : fallback!.cards;
    const proposedAssignment: ProposedAssignmentPayload | null =
      parsed?.proposedAssignment && typeof parsed.proposedAssignment?.title === "string"
        ? parsed.proposedAssignment
        : fallback?.proposedAssignment ?? null;

    // Normalize structured cards so existing AskBrainGymInterface renders seamlessly
    const structuredCards = rawCards
      ? {
          ...rawCards,
          mission:
            rawCards.mission ||
            (proposedAssignment
              ? {
                  title: proposedAssignment.title,
                  action: proposedAssignment.what_to_do,
                  deadline: `${proposedAssignment.estimated_duration_mins} min · Within 48 hours`,
                }
              : undefined),
        }
      : null;

    const claritySnapshot = parsed?.claritySnapshot || null;
    const thinkingMirrorObservation = parsed?.thinkingMirrorObservation || null;
    const suggestedMemory =
      parsed?.suggestedMemory &&
      typeof parsed.suggestedMemory?.title === "string" &&
      typeof parsed.suggestedMemory?.content === "string"
        ? parsed.suggestedMemory
        : null;

    // 6. PERSIST EXCHANGE FOR RATE-LIMIT INTEGRITY & COACHING AUDIT TRAIL
    await Promise.allSettled([
      supabase.from("ai_feedback").insert({
        user_id: user.id,
        feedback_type: "ask_akuche_message",
        message: trimmedMessage,
        metadata: {
          role: "user",
          mode: plan.mode,
          designThinkingStage: plan.designThinkingStage,
          domain: plan.domain.id,
          emotion: plan.emotion,
        },
      }),
      supabase.from("ai_feedback").insert({
        user_id: user.id,
        feedback_type: "ask_akuche_message",
        message: replyText,
        metadata: {
          role: "assistant",
          mode: plan.mode,
          designThinkingStage: plan.designThinkingStage,
          domain: plan.domain.id,
          responseSource,
          provider: aiResult.provider,
          model: aiResult.model,
        },
      }),
    ]);

    return NextResponse.json({
      reply: replyText,
      structuredCards,
      claritySnapshot,
      thinkingMirrorObservation,
      proposedAssignment,
      suggestedMemory,
      coachingMode: plan.mode,
      modeLabel: plan.modeLabel,
      designThinkingStage: plan.designThinkingStage,
      stageLabel: plan.stageLabel,
      domain: plan.domain.id,
      domainLabel: plan.domain.label,
      whyThisApproach: parsed?.whyThisApproach || fallback?.whyThisApproach || "",
      memoryCitations: plan.memoryCitations,
      classification: {
        intent: plan.mode,
        reasoningStage: plan.designThinkingStage,
        depth: plan.depth,
        domain: plan.domain.id,
        subjectSummary: claritySnapshot?.subject || plan.domain.label,
      },
      provider: aiResult.provider,
      model: aiResult.model,
      responseSource,
      ...(fallbackReason ? { fallbackReason } : {}),
    });
  } catch (err) {
    console.error("Ask AKUCHE error:", err);
    return NextResponse.json(
      { error: "Unable to process your request right now. Please try again." },
      { status: 500 }
    );
  }
}
