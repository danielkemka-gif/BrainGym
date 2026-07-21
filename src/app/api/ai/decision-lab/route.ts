import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkPremiumAccess } from "@/lib/premium";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await checkPremiumAccess(user.id);
    if (!access.subscribed) {
      return NextResponse.json({ error: "Premium subscription required", code: "premium_required" }, { status: 402 });
    }

    const { scenario, response: userResponse } = await request.json();
    if (!scenario || typeof scenario !== "string") {
      return NextResponse.json({ error: "Scenario is required" }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }

    const systemPrompt = `You are an expert decision-making coach. Analyze the user's decision scenario using these frameworks:

1. **Pros & Cons** — List 3-5 pros and 3-5 cons for their likely options
2. **Second-Order Thinking** — What happens next? And after that? Trace 2-3 levels of consequences
3. **Cognitive Biases** — Identify 1-3 biases that might be affecting their thinking (confirmation bias, loss aversion, anchoring, etc.)
4. **Alternative Perspectives** — How would someone with different priorities see this?
5. **Recommendation** — A balanced, well-reasoned suggestion

Return your analysis as structured JSON with this schema:
{
  "pros": ["..."],
  "cons": ["..."],
  "secondOrder": ["...", "..."],
  "biases": [{"name": "...", "explanation": "..."}],
  "alternatives": ["..."],
  "recommendation": "..."
}

Be honest and thorough. Don't just tell them what they want to hear.`;

    const userMessage = userResponse
      ? `Scenario: ${scenario}\n\nMy initial thoughts: ${userResponse}`
      : `Scenario: ${scenario}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("OpenAI API error:", response.status, errBody);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const evaluationText = data.choices?.[0]?.message?.content;
    if (!evaluationText) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 502 });
    }

    let evaluation: Record<string, unknown>;
    try {
      evaluation = JSON.parse(evaluationText);
    } catch {
      evaluation = { raw: evaluationText };
    }

    // Store the entry
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const { error: insertError } = await supabase.from("decision_lab_entries").insert({
      user_id: user.id,
      scenario,
      response: userResponse ?? null,
      ai_evaluation: evaluation,
      week_start: weekStartStr,
    });

    if (insertError) {
      console.error("Failed to save decision lab entry:", insertError);
    }

    return NextResponse.json({
      evaluation,
    });
  } catch (err) {
    console.error("Decision Lab API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
