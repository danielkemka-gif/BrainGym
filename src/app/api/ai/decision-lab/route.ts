import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkPremiumAccess } from "@/lib/premium";
import {
  AKUCHE_MASTER_SYSTEM_PROMPT,
  getModeInstructionExtension,
} from "@/lib/akuche/master-intelligence";
import { checkSharedServerRateLimit } from "@/lib/akuche/context-engine";

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
    if (trimmedScenario.length > 4000) {
      return NextResponse.json(
        { error: "Scenario exceeds maximum length (4,000 characters)" },
        { status: 400 }
      );
    }

    const systemPrompt = `${AKUCHE_MASTER_SYSTEM_PROMPT}
${getModeInstructionExtension("decision_lab")}

Analyze the user's decision scenario using the Akuche Decision Development Loop (UNDERSTAND → CHALLENGE → SIMULATE → DECIDE → ACT):
1. **Pros & Cons** — List 3–5 concrete pros and 3–5 concrete cons for their primary options.
2. **Second-Order Thinking (Simulation)** — What happens immediately, and what happens 30–90 days later? Trace 2–3 levels of realistic consequences.
3. **Cognitive Biases & Devil's Advocate** — Identify 1–3 cognitive biases or unverified assumptions that might be affecting their judgment.
4. **Alternative Perspectives** — How would an experienced mentor or someone with different priorities frame this?
5. **Recommendation** — A practical, well-reasoned recommendation including a low-risk validation step.

Return your analysis strictly as JSON with this schema:
{
  "pros": ["..."],
  "cons": ["..."],
  "secondOrder": ["...", "..."],
  "biases": [{"name": "...", "explanation": "..."}],
  "alternatives": ["..."],
  "recommendation": "..."
}`;

    const userMessage = userResponse
      ? `Scenario: ${trimmedScenario}\n\nMy initial thoughts: ${String(userResponse).slice(0, 2000)}`
      : `Scenario: ${trimmedScenario}`;

    const rawApiKey = process.env.OPENAI_API_KEY || "";
    const openaiApiKey = rawApiKey.trim().replace(/^["']|["']$/g, "");
    let evaluation: Record<string, unknown>;
    let responseSource: "live_ai" | "fallback_engine" = "live_ai";

    if (!openaiApiKey) {
      console.warn(
        "[AKUCHE AI FALLBACK] /api/ai/decision-lab: OPENAI_API_KEY is not configured. Using structured fallback evaluation."
      );
      evaluation = buildFallbackDecisionEvaluation(trimmedScenario);
      responseSource = "fallback_engine";
    } else {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage },
            ],
            max_tokens: 1500,
            temperature: 0.55,
            response_format: { type: "json_object" },
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(
            `[AKUCHE AI FALLBACK] /api/ai/decision-lab: OpenAI API returned HTTP ${response.status}. Using structured fallback evaluation.`
          );
          evaluation = buildFallbackDecisionEvaluation(trimmedScenario);
          responseSource = "fallback_engine";
        } else {
          const data = await response.json();
          const evaluationText = data.choices?.[0]?.message?.content;
          try {
            if (evaluationText) {
              evaluation = JSON.parse(evaluationText);
              responseSource = "live_ai";
            } else {
              evaluation = buildFallbackDecisionEvaluation(trimmedScenario);
              responseSource = "fallback_engine";
            }
          } catch {
            evaluation = buildFallbackDecisionEvaluation(trimmedScenario);
            responseSource = "fallback_engine";
          }
        }
      } catch {
        console.warn(
          "[AKUCHE AI FALLBACK] /api/ai/decision-lab: OpenAI network/timeout error. Using structured fallback evaluation."
        );
        evaluation = buildFallbackDecisionEvaluation(trimmedScenario);
        responseSource = "fallback_engine";
      }
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
      "Medium-Term Consequence: True resource and execution requirements become visible as initial assumptions meet reality.",
      "Long-Term Outcome: Compounding returns if the core premise was sound, or realignment cost if key constraints were overlooked.",
    ],
    biases: [
      {
        name: "Optimism & Planning Fallacy",
        explanation:
          "Underestimating the time, buffer, or effort required when execution does not go smoothly on the first attempt.",
      },
      {
        name: "Unexamined Premise Trap",
        explanation:
          "Assuming a key condition (such as buyer urgency, partner alignment, or timeline) is guaranteed without verifying it first.",
      },
    ],
    alternatives: [
      "Verify the single riskiest assumption through a direct conversation or small-scale pilot before making an irreversible commitment.",
      "Structure the commitment in stages with clear review checkpoints to protect your downside.",
    ],
    recommendation: `Before making an irreversible commitment on "${scenario.slice(0, 80)}", identify the single most important assumption your choice depends on and verify it directly while protecting your downside.`,
  };
}
