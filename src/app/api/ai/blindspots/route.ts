import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAiCompletion, safeParseAiJson } from "@/lib/ai/providers";
import { detectPromptInjection, evaluateSafetyAndBoundaries } from "@/lib/akuche/safety";
import { detectDomain } from "@/lib/akuche/domains/registry";
import { analyzeWhatAmIMissing } from "@/lib/akuche/what-am-i-missing";

/**
 * POST /api/ai/blindspots
 * Real AI-powered "What Am I Missing?" blind-spot & Design Thinking (Stage 3: Discover & Insight)
 * analysis, with graceful fallback to structured local templates if offline/unconfigured.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const situation = typeof body?.situation === "string" ? body.situation.trim() : "";
    const workspaceHint = typeof body?.domain === "string" ? body.domain : undefined;

    if (!situation || situation.length < 6) {
      return NextResponse.json(
        { error: "Please describe your situation (at least a few words)." },
        { status: 400 }
      );
    }

    if (situation.length > 3000) {
      return NextResponse.json({ error: "Situation description is too long." }, { status: 400 });
    }

    const safety = evaluateSafetyAndBoundaries(situation);
    if (safety.requiresImmediateIntercept && safety.interceptMessage) {
      return NextResponse.json({
        analysis: {
          blindSpots: [safety.interceptMessage],
          assumptions: [],
          missingQuestions: [],
          alternativeInterpretations: [],
          smallestTest: "Please prioritize immediate safety and reach out to the resources listed above.",
        },
        safetyCategory: safety.category,
        responseSource: "safety_intercept",
      });
    }

    if (detectPromptInjection(situation)) {
      return NextResponse.json(
        { error: "Please share a genuine personal, work, or business situation to analyze." },
        { status: 400 }
      );
    }

    const domain = detectDomain(situation, workspaceHint);
    const systemPrompt = `You are Akuche running **Stage 3: Discover & Insight ("What Am I Missing?")** for ${domain.label}.
Help the user spot realistic blind spots, hidden assumptions, missing facts, and alternative interpretations—without inventing false certainty or preaching.
Be balanced (in relationships/workplace conflicts, consider the other person's perspective too) and practical (${domain.africanAndGlobalContext}).
${safety.boundarySystemInstruction ? `\n${safety.boundarySystemInstruction}\n` : ""}

Return strictly valid JSON:
{
  "blindSpots": ["2–3 concrete overlooked factors specific to their situation"],
  "assumptions": ["2–3 hidden assumptions they may be treating as facts"],
  "missingQuestions": ["2–3 sharp questions worth answering before acting"],
  "alternativeInterpretations": ["1–2 other realistic ways to interpret what is happening"],
  "smallestTest": "1 realistic low-cost step they can take in 24–48 hours to verify reality"
}`;

    const aiResult = await generateAiCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: situation },
      ],
      jsonMode: true,
      maxTokens: 900,
      temperature: 0.45,
      timeoutMs: 18000,
    });

    if (aiResult.ok) {
      const parsed = safeParseAiJson<Record<string, unknown>>(aiResult.content);
      if (parsed && Array.isArray(parsed.blindSpots) && parsed.blindSpots.length > 0) {
        return NextResponse.json({
          analysis: parsed,
          domain: domain.id,
          domainLabel: domain.label,
          provider: aiResult.provider,
          responseSource: "live_ai",
        });
      }
    }

    // Structured fallback
    const mappedDomain =
      workspaceHint === "business" ||
      workspaceHint === "career" ||
      workspaceHint === "potential" ||
      workspaceHint === "life"
        ? workspaceHint
        : undefined;
    const local = analyzeWhatAmIMissing(situation, mappedDomain);
    return NextResponse.json({
      analysis: {
        blindSpots: local.potentialBlindSpots,
        assumptions: local.hiddenAssumptions,
        missingQuestions: local.missingInformation,
        alternativeInterpretations: local.alternativeExplanations,
        smallestTest:
          local.suggestedAction ||
          "Verify your riskiest assumption with one small real-world check before committing.",
      },
      domain: domain.id,
      domainLabel: domain.label,
      responseSource: "fallback_engine",
    });
  } catch (err) {
    console.error("[api/ai/blindspots] error:", err);
    return NextResponse.json({ error: "Unable to analyze blind spots right now." }, { status: 500 });
  }
}
