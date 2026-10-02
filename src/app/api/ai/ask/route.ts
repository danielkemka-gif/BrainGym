import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface SocraticThinkingCards {
  type: "factual" | "guided_thinking" | "action_mission";
  directAnswer?: string;
  whatWeKnow?: string[];
  whatWeDontKnow?: string[];
  assumptions?: string[];
  risks?: string[];
  options?: string[];
  questionsToInvestigate?: string[];
  nextQuestion?: string;
  mission?: {
    title: string;
    deadline: string;
    steps: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { message, history } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    // If OpenAI key is not configured or in offline mode, provide high-quality procedural Socratic fallback
    if (!openaiApiKey) {
      const fallbackResponse = generateProceduralSocraticResponse(message);
      return NextResponse.json({
        reply: fallbackResponse.text,
        structuredCards: fallbackResponse.cards,
      });
    }

    const systemPrompt = `You are BrainGym's Socratic Thinking & Problem-Solving Engine.
BrainGym exists to help users:
TRAIN THEIR MINDS → THINK BETTER → SOLVE REAL PROBLEMS → TAKE ACTION → MEASURE RESULTS → LEARN → GROW

Core Differentiation:
"ChatGPT can give you an answer. BrainGym helps you become better at finding, evaluating and applying answers."

Guidelines:
1. Determine query nature:
   - If it is a simple factual question (e.g. "What is the capital of Kenya?"), answer directly and concisely.
   - If it is a decision, business problem, career question, relationship issue, money dilemma, or goal (e.g. "Should I borrow 2 million?", "I need more customers"):
     - Do NOT make the decision for the user.
     - Guide them through thinking.
     - Break down the situation into structured parts.
     - Ask ONE clear, high-impact follow-up question.
     - If sufficient context exists, formulate a concrete "TODAY'S MISSION" assignment with specific steps before a deadline.
2. Safety & Responsible AI:
   - You are a thinking coach and mental fitness partner, NOT a medical doctor, therapist, lawyer, or financial adviser.
   - Avoid pretending certainty on volatile investments or legal matters.
   - For relationship challenges, guide clear communication and safety.
3. Output Format:
   Always respond in valid JSON format with this structure:
   {
     "text": "Your conversational, warm, concise reply or next Socratic question",
     "cards": {
       "type": "factual" | "guided_thinking" | "action_mission",
       "directAnswer": "Optional direct answer if factual",
       "whatWeKnow": ["Fact 1", "Fact 2"],
       "whatWeDontKnow": ["Missing fact 1", "Missing fact 2"],
       "assumptions": ["Underlying assumption 1"],
       "risks": ["Potential risk 1"],
       "options": ["Option A", "Option B"],
       "questionsToInvestigate": ["Key question to check"],
       "nextQuestion": "The single most important question to consider next",
       "mission": {
         "title": "Today's Mission Title",
         "deadline": "Before 6 PM",
         "steps": ["Step 1", "Step 2", "Step 3"]
       }
     }
   }`;

    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { role: string; content: string }) => ({
          role: h.role === "assistant" ? "assistant" : "user",
          content: h.content,
        }))
      : [];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
          ...formattedHistory,
          { role: "user", content: message },
        ],
        max_tokens: 1024,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const fallbackResponse = generateProceduralSocraticResponse(message);
      return NextResponse.json({
        reply: fallbackResponse.text,
        structuredCards: fallbackResponse.cards,
      });
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    return NextResponse.json({
      reply: parsed.text || "Let's break this situation down step by step.",
      structuredCards: parsed.cards || null,
    });
  } catch (err) {
    console.error("Ask BrainGym error:", err);
    return NextResponse.json(
      { error: "Could not process thinking session" },
      { status: 500 }
    );
  }
}

function generateProceduralSocraticResponse(query: string): {
  text: string;
  cards: SocraticThinkingCards;
} {
  const q = query.toLowerCase();

  if (q.includes("customer") || q.includes("client") || q.includes("sales")) {
    return {
      text: "Let's think through your customer acquisition systematically. Before spending money on ads or changing your pricing, let's identify what has worked with your best customers.",
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "You want to increase paying customers or sales volume.",
          "Every business has a core group of most profitable customers.",
        ],
        whatWeDontKnow: [
          "Where your last 5 customers originally found you.",
          "What specific pain point triggered their decision to buy.",
          "Your current conversion rate from initial conversation to sale.",
        ],
        assumptions: [
          "Assuming you need more traffic, when you might actually need higher conversion or referral retention.",
        ],
        risks: [
          "Reaching out to unqualified prospects and burning time/energy.",
        ],
        options: [
          "Option A: Re-engage previous satisfied buyers for referrals or repeat orders.",
          "Option B: Direct outreach to 10 highly qualified specific prospects.",
        ],
        questionsToInvestigate: [
          "What do your top 3 most profitable customers have in common?",
        ],
        mission: {
          title: "Customer Diagnostic Mission",
          deadline: "Before 6:00 PM today",
          steps: [
            "List your last 5 paying customers and how much each paid.",
            "Identify the single biggest reason they gave for buying.",
            "Reach out to 5 new prospects who share those exact traits.",
          ],
        },
      },
    };
  }

  if (q.includes("borrow") || q.includes("loan") || q.includes("money") || q.includes("invest")) {
    return {
      text: "Let's analyze this financial decision carefully before committing capital. The goal is to determine if the expected return reliably exceeds the cost and repayment pressure.",
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "You are evaluating a capital commitment or borrowing decision.",
          "Debt carries fixed repayment deadlines regardless of revenue fluctuations.",
        ],
        whatWeDontKnow: [
          "The exact monthly cash flow available for debt service.",
          "The worst-case revenue scenario over the next 6 months.",
        ],
        assumptions: [
          "Assuming the invested capital will produce immediate revenue.",
        ],
        risks: [
          "Cash flow crunch if revenue arrives later than loan repayment dates.",
        ],
        options: [
          "Option 1: Bootstrap in smaller phases to validate demand first.",
          "Option 2: Negotiate supplier credit instead of a high-interest cash loan.",
        ],
        questionsToInvestigate: [
          "If revenue takes twice as long to materialize, how will you service the debt?",
        ],
        mission: {
          title: "Financial Sensitivity Check",
          deadline: "Before 6:00 PM today",
          steps: [
            "Calculate your exact monthly net profit over the last 90 days.",
            "Test whether you can cover the monthly payment with zero new revenue.",
            "Identify one non-debt alternative to fund the next step.",
          ],
        },
      },
    };
  }

  return {
    text: "Let's think through this together. To find the highest-leverage solution, let's separate what is verifiable from what is currently an assumption.",
    cards: {
      type: "guided_thinking",
      whatWeKnow: [
        "You are dealing with an important problem that requires structured analysis.",
      ],
      whatWeDontKnow: [
        "The underlying root cause versus visible symptoms.",
        "Your hard constraints (time, budget, non-negotiable boundaries).",
      ],
      assumptions: [
        "Assuming the current obstacle cannot be bypassed or renegotiated.",
      ],
      risks: [
        "Acting before identifying missing variables.",
      ],
      options: [
        "Option A: Test a small, reversible low-risk experiment today.",
        "Option B: Gather the 2 critical missing facts before deciding.",
      ],
      questionsToInvestigate: [
        "What is the single biggest unknown fact about this situation?",
      ],
      mission: {
        title: "Clarify & Take Action",
        deadline: "Before 6:00 PM today",
        steps: [
          "Write down the exact outcome you want in one sentence.",
          "Identify the #1 risk that could prevent it.",
          "Take one 15-minute action that moves this forward today.",
        ],
      },
    },
  };
}
