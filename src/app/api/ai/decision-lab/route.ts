import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkPremiumAccess } from "@/lib/premium";
import { checkSharedServerRateLimit } from "@/lib/akuche/context-engine";
import { generateAiCompletion, safeParseAiJson } from "@/lib/ai/providers";
import {
  detectPromptInjection,
  evaluateSafetyAndBoundaries,
  sanitizeContextText,
} from "@/lib/akuche/safety";
import { detectDomain } from "@/lib/akuche/domains/registry";

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
      endpoint: "decision-lab",
      maxRequests: 25,
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

    const { scenario, response: userResponse } = await request.json();
    if (!scenario || typeof scenario !== "string" || !scenario.trim()) {
      return NextResponse.json({ error: "Scenario is required" }, { status: 400 });
    }

    const trimmedScenario = scenario.trim();
    const combinedText = `${trimmedScenario}\n${userResponse ? String(userResponse) : ""}`;

    if (trimmedScenario.length > 4000) {
      return NextResponse.json(
        { error: "Scenario exceeds maximum length (4,000 characters)" },
        { status: 400 }
      );
    }

    // 1. SAFETY & CRISIS GUARD (previously missing on /api/ai/decision-lab)
    const safety = evaluateSafetyAndBoundaries(combinedText);
    if (safety.requiresImmediateIntercept && safety.interceptMessage) {
      return NextResponse.json({
        evaluation: {
          pros: [],
          cons: [],
          secondOrder: [],
          biases: [],
          alternatives: [],
          recommendation: safety.interceptMessage,
        },
        safetyCategory: safety.category,
        responseSource: "safety_intercept",
      });
    }

    // 2. PROMPT INJECTION GUARD
    if (detectPromptInjection(combinedText)) {
      return NextResponse.json({
        evaluation: buildFallbackDecisionEvaluation(sanitizeContextText(trimmedScenario, 120)),
        responseSource: "security_guard",
      });
    }

    const domain = detectDomain(combinedText);
    const systemPrompt = `You are Akuche in **Decision Mode** (${domain.label}).
Help the user evaluate an important decision thoughtfully WITHOUT making them dependent on AI.
Be realistic, practical, balanced, and grounded in real-world constraints (${domain.africanAndGlobalContext}).
${safety.boundarySystemInstruction ? `\n${safety.boundarySystemInstruction}\n` : ""}

Evaluate the decision on:
1. Pros & Cons (realistic benefits, risks, cost, opportunity cost, timing, reversibility)
2. Second-Order Thinking (what happens immediately vs 30–90 days later)
3. Cognitive Biases & Hidden Assumptions (1–3 honest blind spots)
4. Alternative Perspectives & Low-Risk Experiments (small reversible test before large commitment)
5. Recommendation (clear, empowering guidance that respects the user's autonomy)

Return strictly valid JSON:
{
  "pros": ["..."],
  "cons": ["..."],
  "secondOrder": ["...", "..."],
  "biases": [{"name": "...", "explanation": "..."}],
  "alternatives": ["..."],
  "reversibility": "High | Medium | Low — brief reason",
  "recommendation": "..."
}`;

    const userMessage = userResponse
      ? `Scenario: ${trimmedScenario}\n\nMy initial thoughts: ${String(userResponse).slice(0, 2000)}`
      : `Scenario: ${trimmedScenario}`;

    const aiResult = await generateAiCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      jsonMode: true,
      maxTokens: 1500,
      temperature: 0.45,
      timeoutMs: 22000,
    });

    let evaluation: Record<string, unknown>;
    let responseSource: "live_ai" | "fallback_engine" = "fallback_engine";

    if (aiResult.ok) {
      const parsed = safeParseAiJson<Record<string, unknown>>(aiResult.content);
      if (parsed && Array.isArray(parsed.pros) && typeof parsed.recommendation === "string") {
        evaluation = parsed;
        responseSource = "live_ai";
      } else {
        evaluation = buildFallbackDecisionEvaluation(trimmedScenario);
      }
    } else {
      evaluation = buildFallbackDecisionEvaluation(trimmedScenario);
    }

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    await supabase.from("decision_lab_entries").insert({
      user_id: user.id,
      scenario: trimmedScenario,
      response: userResponse ?? null,
      ai_evaluation: evaluation,
      week_start: weekStartStr,
    });

    return NextResponse.json({
      evaluation,
      domain: domain.id,
      provider: aiResult.provider,
      responseSource,
    });
  } catch (err) {
    console.error("Decision Lab API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildFallbackDecisionEvaluation(scenario: string) {
  return {
    pros: [
      "Creates forward momentum and resolves prolonged indecision.",
      "Forces clarity on your primary priorities and resource allocation.",
      "Provides direct real-world feedback faster than waiting passively.",
    ],
    cons: [
      "Carries execution and timing risk if key assumptions have not been verified.",
      "Requires trading off competing uses of your time, capital, or energy.",
      "May create short-term friction during the transition period.",
    ],
    secondOrder: [
      "Immediate Impact: Shift in daily focus and initial stakeholder or market response.",
      "30–90 Day Consequence: True resource and execution requirements surface as assumptions meet reality.",
      "Long-Term Outcome: Compounding upside if the core premise holds, or realignment cost if key constraints were missed.",
    ],
    biases: [
      {
        name: "Optimism & Planning Fallacy",
        explanation:
          "Underestimating the time, cash buffer, or effort required when execution hits friction.",
      },
      {
        name: "Unexamined Premise Trap",
        explanation:
          "Treating an assumption (demand, alignment, or timeline) as guaranteed before testing it.",
      },
    ],
    alternatives: [
      "Test the riskiest assumption via a small, low-cost 48-hour experiment before committing fully.",
      "Structure the move in reversible stages with clear stop/adjust checkpoints.",
    ],
    reversibility: "Medium — clarify what you can undo before committing.",
    recommendation: `Before making an irreversible commitment on "${scenario.slice(0, 80)}", identify the single most important assumption your choice depends on and test it on a small scale while protecting your downside.`,
  };
}
