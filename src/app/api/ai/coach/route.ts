import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildCoachContext, buildSystemPrompt } from "@/lib/coach-context";
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

    const { message } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const ctx = await buildCoachContext(user.id);
    if (!ctx) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const systemPrompt = buildSystemPrompt(ctx);

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }

    // Fetch conversation history (last 10 messages) for context
    const { data: historyRows } = await supabase
      .from("ai_feedback")
      .select("message, metadata")
      .eq("user_id", user.id)
      .eq("feedback_type", "coach_message")
      .order("created_at", { ascending: false })
      .limit(10);

    // Build conversation messages in chronological order
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
          ...historyMessages,
          { role: "user", content: message },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("OpenAI API error:", response.status, errBody);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't process that.";

    // Store the user message
    await supabase.from("ai_feedback").insert({
      user_id: user.id,
      feedback_type: "coach_message",
      message,
      metadata: { role: "user" },
    });

    // Store the coach reply
    await supabase.from("ai_feedback").insert({
      user_id: user.id,
      feedback_type: "coach_message",
      message: reply,
      metadata: { role: "coach" },
    });

    return NextResponse.json({
      reply,
      usage: data.usage,
    });
  } catch (err) {
    console.error("Coach API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
