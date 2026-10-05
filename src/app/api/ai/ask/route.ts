import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface SocraticThinkingCards {
  type: "factual" | "guided_thinking" | "action_mission" | "decision_matrix";
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
    whyItMatters?: string;
    howToDoIt?: string;
    doneWhen?: string;
  };
}

const MASTER_SYSTEM_PROMPT = `AKUCHE — CORE INTELLIGENCE & USER EXPERIENCE MASTER PROMPT

ROLE
You are Akuche, an intelligent personal thinking, decision-making and action assistant.
Your purpose is not simply to provide answers.
Your purpose is to help people:
ASK → THINK → DECIDE → ACT → LEARN → GROW

Akuche should help a user move from confusion to clarity, from clarity to action, and from action to measurable progress.
Your guiding principle is:
«Your questions deserve more than answers.»

Akuche should feel intelligent, practical, human, encouraging and context-aware.
Never behave like a generic chatbot.

---
1. THE AKUCHE PROMISE
Every meaningful interaction should help the user do at least one of these:
1. Understand something better.
2. Make a better decision.
3. Solve or manage a problem.
4. Discover an opportunity.
5. Create a practical plan.
6. Take a specific next action.
7. Learn from an experience.
8. Build a useful habit or skill.

Whenever appropriate, move the user from:
QUESTION → CLARITY → PLAN → ACTION → FOLLOW-UP
Do not stop at information when action would be more useful.

---
2. UNDERSTAND THE USER BEFORE ANSWERING
Do not automatically assume that the first question contains everything necessary to give the best answer.
When the question requires context, ask a small number of intelligent follow-up questions.
Do not interrogate the user. Ask only the questions that materially improve the answer.
If the user provides enough information already, do not ask unnecessary questions.

---
3. PERSONALISE EVERY IMPORTANT RESPONSE
Whenever useful, adapt the response to local realities (e.g. Nigerian/African realities: Nigerian market conditions, local payment methods, WhatsApp, Facebook, LinkedIn, local business models, employment realities, internet/mobile realities). Do not stereotype users.

---
4. THE AKUCHE THINKING ENGINE
For significant questions, silently process the user's situation through:
STEP 1 — UNDERSTAND: What is the user actually trying to achieve? What is the real problem?
STEP 2 — CLARIFY: What important information is missing? What assumptions might be wrong?
STEP 3 — ANALYSE: What are the possible causes, options, opportunities, risks and constraints?
STEP 4 — PRIORITISE: Which option is most practical given the user's circumstances?
STEP 5 — DECIDE: Help the user make a reasoned decision.
STEP 6 — ACT: Convert the decision into specific actions.
STEP 7 — REVIEW: Determine how the user will know whether the action worked.
STEP 8 — ADAPT: Help modify the approach if needed.

---
5. ALWAYS END WITH "YOUR NEXT MOVE"
Finish with:
YOUR NEXT MOVE
Give the user ONE clear action they can take immediately. Prioritise. Reduce overwhelm and increase execution.

---
6. MAJOR DOMAINS
- MONEY & FINANCE: Income growth, pricing, customer acquisition, unit economics (R = P × Q). Never guarantee financial returns.
- BUSINESS: Problem diagnosis, offers, positioning, sales channels, bottleneck analysis. Avoid generic "post more content".
- CAREER: Decisions, positioning, transitions, measurable progress.
- EDUCATION & LEARNING: Explain → Example → Test → Practice → Feedback.
- PERSONAL DEVELOPMENT: Habits, discipline, time management, action assignments.
- RELATIONSHIPS & COMMUNICATION: Difficult conversations, boundary setting, balanced perspectives.
- LIFE DECISIONS: Option comparison, trade-offs, consequences.

---
7. CHALLENGE THE USER POLITELY WHEN NECESSARY
If an assumption is weak or numbers are mathematically inconsistent, point it out respectfully. Turn ambition into a measurable plan.

---
8. NEVER CONFUSE MOTIVATION WITH PROGRESS
No empty motivational cliches ("Believe in yourself", "You've got this"). Encouragement must support real practical action.

---
9. TURN GOALS INTO EXECUTION
Break goals into: GOAL, DEADLINE, CURRENT POSITION, GAP, STRATEGY, ACTIONS, MEASUREMENT, REVIEW DATE.
Reverse-engineer large financial numbers (e.g. ₦5m = 10 × ₦500k, 20 × ₦250k, 50 × ₦100k, 100 × ₦50k) with daily run-rates and sales funnel math (Leads → Conversations → Proposals → Deals).

---
10. CREATE ACTION ASSIGNMENTS
When appropriate, use:
TODAY'S ACTION: One specific task.
WHY IT MATTERS: Brief explanation.
HOW TO DO IT: Practical instructions.
DONE WHEN: Clear completion criteria.

---
20. DECISION MODE (When comparing options)
Structure:
OPTION A: Advantages, Disadvantages, Risks, Potential outcome
OPTION B: Advantages, Disadvantages, Risks, Potential outcome
WHAT MATTERS MOST: User's priorities
MY ASSESSMENT: Reasoned recommendation
YOUR DECISION: Final choice

---
21. PROBLEM-SOLVING MODE
Problem → Possible Causes → Options → Best Approach → Next Action

---
OUTPUT FORMAT
Always return valid JSON strictly in this format:
{
  "text": "Your complete, structured, highly actionable response formatted with clear markdown headings (### Title), bold text, calculations, step-by-step execution plan, and 'YOUR NEXT MOVE' action point.",
  "cards": {
    "type": "guided_thinking",
    "whatWeKnow": ["Known fact 1", "Known fact 2"],
    "whatWeDontKnow": ["Key unknown 1", "Key unknown 2"],
    "assumptions": ["Underlying assumption 1"],
    "risks": ["Risk factor 1"],
    "options": ["Option A (e.g. 10 clients × ₦500,000)", "Option B (e.g. 20 clients × ₦250,000)"],
    "questionsToInvestigate": ["High-value clarifying question 1", "High-value clarifying question 2"],
    "nextQuestion": "The single most important question to answer next",
    "mission": {
      "title": "Today's Action Assignment",
      "deadline": "Before 6:00 PM today",
      "steps": [
        "Step 1: Specific action with exact numbers",
        "Step 2: Specific action with exact numbers",
        "Step 3: Specific action with exact numbers"
      ],
      "whyItMatters": "Why this action unlocks progress",
      "howToDoIt": "Specific messaging/outreach/execution script",
      "doneWhen": "Measurable completion definition"
    }
  }
}`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { message, history } = await request.json();
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    const openaiApiKey = process.env.OPENAI_API_KEY;

    // If OpenAI key is not configured or in offline mode, provide high-quality procedural Socratic reverse-engineering response
    if (!openaiApiKey) {
      const fallbackResponse = generateProceduralSocraticResponse(trimmedMessage);
      return NextResponse.json({
        reply: fallbackResponse.text,
        structuredCards: fallbackResponse.cards,
      });
    }

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
          { role: "system", content: MASTER_SYSTEM_PROMPT },
          ...formattedHistory,
          { role: "user", content: trimmedMessage },
        ],
        max_tokens: 2048,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const fallbackResponse = generateProceduralSocraticResponse(trimmedMessage);
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
    console.error("Ask AKUCHE error:", err);
    const fallbackResponse = generateProceduralSocraticResponse(
      "Let's break down this challenge into concrete numbers and actions."
    );
    return NextResponse.json({
      reply: fallbackResponse.text,
      structuredCards: fallbackResponse.cards,
    });
  }
}

// -----------------------------------------------------------------------------
// PROCEDURAL SOCRATIC ENGINE (MASTER PROMPT IMPLEMENTATION)
// -----------------------------------------------------------------------------

function parseFinancialTarget(query: string): {
  amount: number;
  currency: string;
  timeframeDays: number;
  timeframeLabel: string;
} | null {
  const q = query.toLowerCase();

  let currency = "₦";
  if (q.includes("$") || q.includes("dollar") || q.includes("usd")) currency = "$";
  else if (q.includes("£") || q.includes("pound")) currency = "£";
  else if (q.includes("€") || q.includes("euro")) currency = "€";
  else if (q.includes("naira") || q.includes("₦") || q.includes("ngn")) currency = "₦";

  let amount = 0;
  const millionMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:m\b|million|millions)/i);
  const kMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:k\b|thousand|thousands)/i);
  const rawNumMatch = q.match(/(?:₦|\$|£|€)?\s*([\d,]{4,})/);

  if (millionMatch) {
    amount = parseFloat(millionMatch[1]) * 1_000_000;
  } else if (kMatch) {
    amount = parseFloat(kMatch[1]) * 1_000;
  } else if (rawNumMatch) {
    const parsed = parseFloat(rawNumMatch[1].replace(/,/g, ""));
    if (parsed >= 1000) amount = parsed;
  }

  if (amount <= 0) return null;

  let timeframeDays = 30;
  let timeframeLabel = "the next 30 days";

  if (q.includes("december")) {
    timeframeDays = 60;
    timeframeLabel = "before December";
  } else if (q.includes("october") || q.includes("this month") || q.includes("end of month") || q.includes("1 month") || q.includes("a month")) {
    timeframeDays = 30;
    timeframeLabel = "the next 30 days";
  } else if (q.includes("2 weeks") || q.includes("two weeks") || q.includes("14 days")) {
    timeframeDays = 14;
    timeframeLabel = "14 days";
  } else if (q.includes("1 week") || q.includes("one week") || q.includes("7 days")) {
    timeframeDays = 7;
    timeframeLabel = "7 days";
  } else if (q.includes("60 days") || q.includes("2 months")) {
    timeframeDays = 60;
    timeframeLabel = "60 days";
  } else if (q.includes("90 days") || q.includes("3 months") || q.includes("quarter")) {
    timeframeDays = 90;
    timeframeLabel = "90 days (1 quarter)";
  } else if (q.includes("year") || q.includes("12 months")) {
    timeframeDays = 365;
    timeframeLabel = "12 months";
  }

  return { amount, currency, timeframeDays, timeframeLabel };
}

function formatMoney(amount: number, currency: string): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `${currency}${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M (${currency}${amount.toLocaleString()})`;
  }
  if (amount >= 1_000) {
    const k = amount / 1_000;
    return `${currency}${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k (${currency}${amount.toLocaleString()})`;
  }
  return `${currency}${amount.toLocaleString()}`;
}

function generateProceduralSocraticResponse(query: string): {
  text: string;
  cards: SocraticThinkingCards;
} {
  const q = query.toLowerCase().trim();

  // 0. GREETINGS & FIRST SESSION ONBOARDING (Section 26 & 27)
  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q.includes("who are you") ||
    q.includes("how does this work") ||
    q.includes("what can you do") ||
    q === "help" ||
    q.includes("where to start")
  ) {
    return {
      text: `### Welcome to AKUCHE
*«Your questions deserve more than answers.»*

I am your intelligent personal thinking, decision-making and action companion. I am not here to give generic lists or empty motivation — my purpose is to help you move from **Confusion → Clarity → Plan → Action → Growth**.

---

### How We Work Together:
$$\\textbf{ASK} \\rightarrow \\textbf{THINK} \\rightarrow \\textbf{DECIDE} \\rightarrow \\textbf{ACT} \\rightarrow \\textbf{LEARN} \\rightarrow \\textbf{GROW}$$

1. **Diagnose Before Recommending:** We find the real root bottleneck, not just symptoms.
2. **Reverse-Engineer the Math ($R = P \\times Q$):** We break ambitious targets into manageable daily quotas.
3. **Always End with Action:** Every session gives you **YOUR NEXT MOVE** so you always know what to do today.

---

### What are you trying to figure out right now?
* **1. Make more money / hit a revenue target** (e.g. *"I want to generate ₦5,000,000 before the end of the month"*)
* **2. Business & customer acquisition** (e.g. *"How do I get 10 high-paying B2B clients for my service?"*)
* **3. A difficult decision** (e.g. *"Should I borrow money to start a shop?"* or *"Should I leave my job?"*)
* **4. Learning or exam preparation** (e.g. *"I need a study strategy for my exams in 2 weeks"*)
* **5. Overcoming procrastination** (e.g. *"I am overwhelmed and don't know where to start"*)

---

### YOUR NEXT MOVE
Type your exact challenge or financial goal in the box below, and let's break it down into an operating system.`,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "Akuche is active and calibrated to help you think through decisions and take action.",
          "Every session concludes with a measurable action assignment.",
        ],
        whatWeDontKnow: [
          "Your specific goal, target number, or current bottleneck.",
        ],
        assumptions: [
          "You have a real challenge you want to solve systematically.",
        ],
        risks: [
          "Postponing decision-making without testing your core assumptions.",
        ],
        options: [
          "Path 1: Reverse-engineer a financial target (e.g. ₦5m in 30 days)",
          "Path 2: Diagnose a business customer acquisition bottleneck",
          "Path 3: Evaluate a difficult career or financial decision",
        ],
        questionsToInvestigate: [
          "What is the single most important outcome you want to achieve this month?",
        ],
        nextQuestion: "What specific challenge are you working on right now?",
        mission: {
          title: "Define Your Real Question",
          deadline: "Before end of today",
          steps: [
            "State your desired outcome in one clear sentence",
            "State your timeframe and available hours/capital",
            "Send it to Akuche to generate your execution battle plan",
          ],
          whyItMatters: "Clarity on the real question is 80% of solving the problem.",
          howToDoIt: "Type your goal or dilemma directly into the input bar.",
          doneWhen: "Your first challenge has been submitted for Socratic diagnosis.",
        },
      },
    };
  }

  // 1. REVERSE-ENGINEER NUMERICAL FINANCIAL GOALS (Section 2, 9, 13)
  const finTarget = parseFinancialTarget(query);
  if (finTarget && finTarget.amount > 0) {
    const { amount, currency, timeframeDays, timeframeLabel } = finTarget;
    const dailyTarget = Math.round(amount / timeframeDays);
    const weeklyTarget = Math.round(amount / (timeframeDays / 7));

    const tier1_clients = 10;
    const tier1_price = amount / 10;

    const tier2_clients = 20;
    const tier2_price = amount / 20;

    const tier3_clients = 50;
    const tier3_price = amount / 50;

    const tier4_clients = 100;
    const tier4_price = amount / 100;

    const requiredConversions = tier2_clients;
    const expectedCloseRate = 0.2;
    const qualifiedConversations = Math.round(requiredConversions / expectedCloseRate);
    const discoveryCallsPerDay = Math.ceil(qualifiedConversations / (timeframeDays * 0.7));
    const dailyOutreachTargets = discoveryCallsPerDay * 3;

    const text = `### What I Understand
You want to generate **${formatMoney(amount, currency)}** within **${timeframeLabel}**.

### The Real Problem
Large financial targets fail when treated as a single abstract wish. To achieve ${currency}${amount.toLocaleString()}, you do not need generic motivational advice — you need a **mathematical operating pipeline** that balances price, volume, and daily conversion activity.

---

### The Numbers: Reverse-Engineered Breakdown
* **Total Target:** ${formatMoney(amount, currency)}
* **Timeframe:** ${timeframeLabel} (${timeframeDays} days)
* **Required Daily Velocity:** Approximately **${currency}${dailyTarget.toLocaleString()}/day**
* **Required Weekly Velocity:** Approximately **${currency}${weeklyTarget.toLocaleString()}/week**

#### Available Revenue Structures ($R = P \\times Q$):
* **Route A (High-Ticket B2B / Corporate):** 10 clients × **${currency}${tier1_price.toLocaleString()}**
* **Route B (Mid-Market / Core Offer):** 20 clients × **${currency}${tier2_price.toLocaleString()}** *(Recommended)*
* **Route C (Productized Service):** 50 clients × **${currency}${tier3_price.toLocaleString()}**
* **Route D (Mass Volume / Digital / Retail):** 100 clients × **${currency}${tier4_price.toLocaleString()}**

---

### Recommended Execution Path: Route B (20 Clients @ ${currency}${tier2_price.toLocaleString()})
**Why:** Route A requires rare ultra-high trust. Route D requires massive existing audience traffic. **Route B** balances achievable ticket size with manageable pipeline volume.

#### Pipeline Conversion Mathematics:
* **Target Closed Deals:** ${requiredConversions} clients
* **Expected Proposal Close Rate:** 20%
* **Required Qualified Sales Conversations:** ~${qualifiedConversations} qualified discovery chats
* **Daily Conversation Pace:** **${discoveryCallsPerDay} qualified conversations per working day**
* **Daily Direct Outreaches:** **${dailyOutreachTargets} personalized pitches per day via WhatsApp, LinkedIn, or Direct Calls**

---

### Step-by-Step Execution Plan
* **Phase 1 (Days 1–3): Asset & Offer Mobilization**
  * Package an undeniable offer priced at ${currency}${tier2_price.toLocaleString()} solving one urgent business/personal problem.
  * Build a list of 60 high-intent contacts (past buyers, warm phone book contacts, local business owners).
* **Phase 2 (Days 4–20): High-Velocity Outreach & Diagnostic Conversations**
  * Execute ${dailyOutreachTargets} personalized outreaches every morning before 11:00 AM.
  * Conduct ${discoveryCallsPerDay} discovery conversations daily. Diagnose pain before quoting prices.
* **Phase 3 (Days 21–${timeframeDays}): Closing, Cash Collection & Referrals**
  * Send simple 1-page proposals with 48-hour incentive pricing.
  * Collect upfront deposits (minimum 50%).

---

### Risks & Critical Assumptions
* **Assumption:** You have an existing skill, service, or inventory that can deliver clear value at ${currency}${tier2_price.toLocaleString()}.
* **Bottleneck Risk:** Pitching unqualified cold contacts instead of reaching out to warm network and B2B decision-makers.

---

### TODAY'S ACTION
**Draft Your ${currency}${tier2_price.toLocaleString()} Offer & Contact 5 Warm Decision-Makers.**

* **WHY IT MATTERS:** Cash flow velocity depends entirely on starting conversations today rather than perfecting plans.
* **HOW TO DO IT:** Send this message on WhatsApp/LinkedIn to 5 people:
  * *"Hi [Name], I'm currently taking on 2 clients to help with [specific problem]. Since you're in [industry], I wanted to ask if this is currently a focus for you this month?"*
* **DONE WHEN:** 5 personalized messages are sent and 2 conversations are active.

---

### YOUR NEXT MOVE
Write down the names of the first 5 people you will contact, open WhatsApp or LinkedIn, and send the first message before 6:00 PM today.`;

    return {
      text,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          `Revenue Target: ${formatMoney(amount, currency)}`,
          `Timeframe: ${timeframeLabel} (${timeframeDays} days)`,
          `Required Daily Pace: ${currency}${dailyTarget.toLocaleString()}/day`,
        ],
        whatWeDontKnow: [
          "Your current highest-margin skill or existing product.",
          "Size and responsiveness of your existing WhatsApp/network contacts.",
          "Your historical close rate on qualified proposals.",
        ],
        assumptions: [
          `Assuming you can deliver value at ${currency}${tier2_price.toLocaleString()} per client.`,
          "Assuming standard 20% conversion from qualified conversation to sale.",
        ],
        risks: [
          "Spending time on low-ticket mass outreach instead of focused high-ticket conversations.",
          "Underestimating the required daily conversation volume.",
        ],
        options: [
          `Route A (High-Ticket B2B): 10 clients × ${currency}${tier1_price.toLocaleString()}`,
          `Route B (Mid-Market - Recommended): 20 clients × ${currency}${tier2_price.toLocaleString()}`,
          `Route C (Productized Service): 50 clients × ${currency}${tier3_price.toLocaleString()}`,
          `Route D (Mass Retail): 100 clients × ${currency}${tier4_price.toLocaleString()}`,
        ],
        questionsToInvestigate: [
          "What is your fastest route to cash: existing warm contacts vs cold outreach?",
          "Can you package your core skill into a high-ticket B2B service?",
        ],
        nextQuestion: `What specific offer will you price at ${currency}${tier2_price.toLocaleString()}?`,
        mission: {
          title: `Day 1 Milestone: 5 Outreaches for ${formatMoney(amount, currency)} Target`,
          deadline: "Before 6:00 PM today",
          steps: [
            `Package 1 high-value offer priced at ${currency}${tier2_price.toLocaleString()}`,
            "List 20 specific people or business owners who suffer from this problem",
            "Send 5 direct diagnostic outreach messages before 6:00 PM today",
          ],
          whyItMatters: "Validating interest with 5 direct conversations prevents weeks of wasted effort.",
          howToDoIt: "Send personalized WhatsApp/LinkedIn messages diagnosing their current priority.",
          doneWhen: "5 messages sent and at least 2 active conversations started.",
        },
      },
    };
  }

  // 2. MAKING MONEY & WEALTH (Section 22 & 3)
  if (
    q.includes("make money") ||
    q.includes("how to make money") ||
    q.includes("more money") ||
    q.includes("earn money") ||
    q.includes("how can i make money") ||
    q.includes("get rich") ||
    q.includes("broke") ||
    q.includes("side hustle") ||
    q.includes("extra income")
  ) {
    const text = `### What I Understand
You want to increase your income or build a new cash flow stream.

### The Real Problem
People struggle to make money when they search for abstract "methods" rather than **identifying who has budget and what painful problem they will pay to have solved**. Money is always an exchange of value.

---

### The 3 Fastest Economic Pathways to Cash Flow:
* **Pathway 1: High-Value Service (Fastest / ₦0 Startup Capital)**
  * Take a skill you already have (design, sales, accounting, tutoring, writing, repairs, web development, consulting) and sell it to 5 business owners @ **₦100,000 each = ₦500,000**.
* **Pathway 2: Deal Sourcing & Brokerage Arbitrage (High Leverage)**
  * Connect an existing buyer with an existing supplier (real estate, corporate supplies, vehicle trade, freelance talent) and collect a 5%–10% commission.
* **Pathway 3: Productized Knowledge or Digital Procedure**
  * Package a repeatable process, guide, or template and sell to 50 buyers @ **₦10,000 = ₦500,000**.

---

### Recommended Approach: Pathway 1 (High-Value Service)
**Why:** It requires zero inventory, zero upfront capital, and allows you to generate cash within 72 hours using WhatsApp, your phone contacts, and direct outreach.

---

### Step-by-Step Execution Plan
1. **Skill Audit:** Identify the #1 task you can perform that saves a business time or makes them money.
2. **List 20 Potential Buyers:** Look through your phone contacts, LinkedIn connections, and local businesses.
3. **Send 5 Pilot Messages:** Offer a low-friction pilot where they only pay if satisfied.

---

### TODAY'S ACTION
**Identify Your #1 High-Value Skill & Message 5 Contacts.**

* **WHY IT MATTERS:** You already possess skills people will pay for; the missing link is making direct offers.
* **HOW TO DO IT:** Send this message:
  * *"Hi [Name], I'm offering [specific service, e.g. helping businesses optimize their client follow-ups] this week. If you need a hand with this right now, I'd love to handle it for you."*
* **DONE WHEN:** 5 personalized messages are sent.

---

### YOUR NEXT MOVE
Write down your core skill in 1 sentence, list 5 people who could benefit, and send the first message right now.`;

    return {
      text,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "You want to generate new income or expand cash flow.",
          "Selling services to existing businesses generates cash 10x faster than creating unvalidated products.",
        ],
        whatWeDontKnow: [
          "Your specific skills, domain experience, and daily available hours.",
          "Your exact 30-day financial target.",
        ],
        assumptions: [
          "You have at least 1 marketable skill and 2 hours per day to dedicate.",
        ],
        risks: [
          "Spending weeks building a website or product before getting a paying customer.",
        ],
        options: [
          "Pathway 1 (Recommended): High-Value Service (5 clients × ₦100,000)",
          "Pathway 2: Deal Sourcing & Finder's Fee Commission",
          "Pathway 3: Productized Digital Template (50 buyers × ₦10,000)",
        ],
        questionsToInvestigate: [
          "What is the single most valuable problem you can solve for someone this week?",
        ],
        nextQuestion: "What specific skill or service can you deliver immediately?",
        mission: {
          title: "Skill Audit & 5 Warm Outreaches",
          deadline: "Before 6:00 PM today",
          steps: [
            "Write down your #1 strongest marketable skill",
            "List 10 specific people or business owners who need this",
            "Send 5 direct messages offering a pilot solution",
          ],
          whyItMatters: "Direct outreach generates faster cash flow than passive waiting.",
          howToDoIt: "Send personalized WhatsApp/LinkedIn messages proposing a pilot service.",
          doneWhen: "5 messages sent to qualified contacts.",
        },
      },
    };
  }

  // 3. DECISION MODE (Section 20)
  if (
    q.includes("decision") ||
    q.includes("should i") ||
    q.includes("choose between") ||
    q.includes("two options") ||
    q.includes("option a") ||
    q.includes("or should i")
  ) {
    return {
      text: `### Decision Analysis Mode Activated
You are facing a critical choice: **"${query}"**.

---

### OPTION A: The Safe Validation / Phased Route
* **Advantages:** Low downside risk, preserves cash runway, reversible if assumptions fail.
* **Disadvantages:** Slower potential upside, requires balancing multiple priorities simultaneously.
* **Risks:** Delaying decisive commitment if validation drags on too long.
* **Potential Outcome:** Steady, validated progress with zero catastrophic downside.

---

### OPTION B: The Full Commitment / High-Leverage Route
* **Advantages:** Total focus, fastest potential breakthrough, maximum urgency.
* **Disadvantages:** High downside pressure, burns cash runway rapidly if revenue is delayed.
* **Risks:** Cash crunch or forced panic decisions if initial sales take 90+ days.
* **Potential Outcome:** Rapid high return if market demand exists; severe stress if unvalidated.

---

### WHAT MATTERS MOST
1. **Downside Protection:** If this decision produces zero return for 90 days, can you survive financially and mentally?
2. **Reversibility:** Is this a one-way door (irreversible) or a two-way door (reversible)?

---

### MY ASSESSMENT
Choose **Option A (Phased Validation)** first. Run a 14-day micro-experiment to secure 3 customer commitments or prove demand before making an irreversible commitment.

---

### YOUR NEXT MOVE
Do not make a permanent commitment today. Take **one 24-hour test action** that gathers hard evidence on customer demand or financial feasibility.`,
      cards: {
        type: "decision_matrix",
        whatWeKnow: [
          `You are evaluating a significant decision: "${query}"`,
          "Reversible decisions should be tested with small experiments first.",
        ],
        whatWeDontKnow: [
          "Your exact financial buffer and non-negotiable personal boundaries.",
          "Hard data on customer willingness to pay.",
        ],
        assumptions: [
          "Assuming Option B carries significantly higher financial or emotional risk.",
        ],
        risks: [
          "Making an irreversible commitment based on unverified optimism.",
        ],
        options: [
          "Option A: Phased validation with 14-day test milestone",
          "Option B: Immediate full commitment",
        ],
        questionsToInvestigate: [
          "What is the single biggest risk if Option B fails, and how would you handle it?",
        ],
        nextQuestion: "Can you run a 48-hour experiment to test your main assumption?",
        mission: {
          title: "Run a 24-Hour Decision Experiment",
          deadline: "Before 6:00 PM tomorrow",
          steps: [
            "Write down your worst-case scenario for both options",
            "Identify the #1 unproven assumption for Option B",
            "Talk to 2 experienced people or potential customers to gather real data",
          ],
          whyItMatters: "Data eliminates decision anxiety faster than overthinking.",
          howToDoIt: "Ask 2 objective peers: 'What is the biggest blind spot in this plan?'",
          doneWhen: "2 pieces of external objective feedback gathered.",
        },
      },
    };
  }

  // 4. BUSINESS & CUSTOMER ACQUISITION (Section 23)
  if (
    q.includes("customer") ||
    q.includes("client") ||
    q.includes("sales") ||
    q.includes("leads") ||
    q.includes("marketing") ||
    q.includes("business problem") ||
    q.includes("grow business")
  ) {
    const text = `### Business Diagnostic Mode Activated
You are addressing a customer acquisition, sales, or business growth bottleneck.

### The Real Problem
Most business owners seeking "more customers" mistakenly believe they have a visibility or advertising problem. In 80% of cases, the real bottleneck is **Offer Clarity, Direct Outreach Volume, or Lack of Follow-Up**.

---

### The Business Multiplier Engine:
$$Revenue = Leads \\times Conversion\\,Rate \\times Average\\,Order\\,Value \\times Frequency$$
* Doubling qualified conversations + improving closing rate from 15% → 20% + increasing price by 25% produces a **2.6x revenue increase** without spending millions on ads.

---

### Your 3 Acquisition Pathways:
* **Pathway 1: Past Customer Reactivation & Referral Engine (Fastest)**
  * Re-contact satisfied previous buyers with a priority check-in or loyalty offer. Zero advertising cost.
* **Pathway 2: Direct High-Value Outreach (Highest Control)**
  * Identify 30 ideal corporate/B2B prospects on LinkedIn, WhatsApp, or in person, and send personalized diagnostic messages.
* **Pathway 3: Strategic Distribution Partnerships (Highest Leverage)**
  * Partner with non-competing businesses who already serve your exact ideal customer.

---

### Recommended Execution Path: Pathway 1 + Pathway 2
Mobilize your warm contacts and previous buyers immediately for fast cash flow while executing a disciplined 10-per-day direct outreach cadence.

---

### TODAY'S ACTION
**Reactivate 3 Past Customers & Build a 15-Prospect Target Sheet.**

* **WHY IT MATTERS:** Past buyers are 5x more likely to buy again than cold strangers.
* **HOW TO DO IT:** Send a WhatsApp message to 3 past clients:
  * *"Hi [Name], I'm checking in to see how everything is going with [previous project/purchase]. We're opening up 2 priority slots for [service/upgrade] this month and wanted to give you first access."*
* **DONE WHEN:** 3 check-in messages sent and 15 new prospect names listed.

---

### YOUR NEXT MOVE
Open your WhatsApp chat list right now, find your last 3 satisfied customers, and send the check-in message before 5:00 PM today.`;

    return {
      text,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "You want a repeatable system to acquire paying customers and grow revenue.",
          "Reactivating past clients generates cash flow with zero ad spend.",
        ],
        whatWeDontKnow: [
          "Your current conversion rate and average transaction size.",
          "Your primary sales channel (WhatsApp, physical store, website, phone calls).",
        ],
        assumptions: [
          "Assuming your core offer delivers verifiable value to satisfied buyers.",
        ],
        risks: [
          "Spending money on broad paid ads before validating the offer conversion manually.",
        ],
        options: [
          "Pathway 1 (Fastest): Past Buyer Reactivation & Referral Engine",
          "Pathway 2 (High-Control): Direct Outreach to 10 qualified prospects daily",
          "Pathway 3 (High-Leverage): Strategic Distribution Partners",
        ],
        questionsToInvestigate: [
          "Why did your best customer choose you over existing alternatives?",
        ],
        nextQuestion: "How many qualified prospect conversations did you have this week?",
        mission: {
          title: "Customer Acquisition Kickstart",
          deadline: "Before 6:00 PM today",
          steps: [
            "Write down your top 5 most satisfied past clients",
            "Send a warm check-in message to at least 3 of them",
            "List 15 new qualified prospects for direct outreach tomorrow morning",
          ],
          whyItMatters: "Direct relationship engagement produces immediate commercial velocity.",
          howToDoIt: "Send personalized check-in messages on WhatsApp.",
          doneWhen: "3 past clients contacted and 15 new prospect profiles listed.",
        },
      },
    };
  }

  // 5. STARTING A BUSINESS & BUSINESS IDEAS
  if (
    q.includes("start a business") ||
    q.includes("business idea") ||
    q.includes("startup") ||
    q.includes("idea i want to develop") ||
    q.includes("new venture")
  ) {
    const text = `### Business Creation Mode Activated
You want to develop a new business idea or launch a profitable venture.

### The Real Problem
Most startups fail because founders spend time and money building a **solution** before verifying that customers have an **urgent, painful problem they are actively willing to pay for**.

---

### The Lean Validation Economics
* **The 3-Customer Pre-Sale Rule:** Never spend capital on inventory, logos, or rent before securing **at least 3 committed pre-orders or paying pilot clients**.
* **Startup Capital Constraint:** Keep fixed MVP setup costs under **₦50,000**.
* **Target Margin:** Aim for at least **50% to 70% gross profit margin**.

---

### 3 Low-Risk Venture Models
* **Model 1: B2B Productized Agency (Recommended - ₦0 Inventory)**
  * Solve one painful administrative, technical, or sales headache for local companies (e.g. accounting, lead generation, social media management, maintenance).
* **Model 2: Direct Trade with Customer Pre-Orders**
  * Source high-demand physical products only after collecting 50% customer deposits. Zero unsold inventory risk.
* **Model 3: Specialized Training / Cohort Workshop**
  * Package an in-demand practical skill and teach a cohort of 10 students @ **₦30,000 = ₦300,000 per cohort**.

---

### TODAY'S ACTION
**Conduct 3 Customer Pain Discovery Conversations.**

* **WHY IT MATTERS:** Finding out what customers hate dealing with will shape an offer they cannot refuse.
* **HOW TO DO IT:** Ask 3 potential buyers:
  * *"What is the most frustrating or time-consuming part about [activity/business], and what have you tried so far to fix it?"*
* **DONE WHEN:** You have written notes from 3 real prospective buyers.

---

### YOUR NEXT MOVE
Identify 3 people in your network who match your target customer profile, send them a message asking for 5 minutes of feedback, and do not pitch anything until you understand their pain.`;

    return {
      text,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "You are planning to launch a new business or develop a concept.",
          "Validating customer willingness to pay before spending capital eliminates 90% of business failure risk.",
        ],
        whatWeDontKnow: [
          "Your specific domain experience and available startup capital.",
        ],
        assumptions: [
          "You want a cash-flowing, profitable business rather than a speculative startup.",
        ],
        risks: [
          "Spending capital on inventory or branding before securing paying buyers.",
        ],
        options: [
          "Model 1 (Recommended): B2B Productized Agency (Zero Inventory)",
          "Model 2: Pre-Order Direct Trade (Customer-funded inventory)",
          "Model 3: Specialized Cohort Workshop",
        ],
        questionsToInvestigate: [
          "Who is your ideal customer, and why would they buy from you instead of competitors?",
        ],
        nextQuestion: "What specific industry or skill do you want to build this business around?",
        mission: {
          title: "Customer Pain Discovery Sprint",
          deadline: "Before 6:00 PM today",
          steps: [
            "Write down 3 real problems people currently complain about in your field",
            "Draft a 1-sentence solution offer",
            "Ask 3 potential customers for feedback on the problem",
          ],
          whyItMatters: "Direct customer pain data shapes high-converting offers.",
          howToDoIt: "Ask 3 prospective buyers about their biggest operational frustration.",
          doneWhen: "3 customer pain discovery interviews completed.",
        },
      },
    };
  }

  // 6. DEFAULT GENERAL PROBLEM-SOLVING & DECISIONS (Section 21)
  const text = `### What I Understand
You are working through this specific challenge: **"${query}"**.

### The Real Problem
Complex challenges feel overwhelming when facts, unverified assumptions, and emotional pressure are tangled together. To make progress, we must separate **what is verifiable** from **what is assumed**, identify the highest-leverage route, and build a concrete execution plan.

---

### Analytical Diagnosis
* **Core Bottleneck:** What is the single constraint that, if resolved, makes everything else easier or unnecessary?
* **Leverage Principle:** What existing assets, skills, or direct relationships can you deploy immediately?

---

### Your 2 Practical Options
* **Option A: The 24-Hour Low-Risk Experiment (Recommended)**
  * Run a small, reversible test today to gather real data before making an irreversible commitment.
* **Option B: The Direct Alignment Conversation**
  * Address the root issue directly by setting clear boundaries or renegotiating constraints.

---

### Step-by-Step Execution Plan
1. **Clarify Objective:** Write down the exact measurable outcome you need.
2. **Test Assumption:** Identify your #1 unproven assumption and test it within 24 hours.
3. **Execute & Review:** Review outcomes and adapt based on real feedback.

---

### TODAY'S ACTION
**Take One 15-Minute Action on the Hardest Variable.**

* **WHY IT MATTERS:** Action creates clarity faster than overthinking.
* **HOW TO DO IT:** Write down the #1 obstacle, eliminate distractions, and take one concrete step before 6:00 PM.
* **DONE WHEN:** One physical action has been completed.

---

### YOUR NEXT MOVE
State your single most important next step, set a 15-minute timer, and complete it before the end of today.`;

    return {
      text,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          `You are working through this challenge: "${query}"`,
        ],
        whatWeDontKnow: [
          "The underlying root cause vs visible symptoms.",
          "Your non-negotiable constraints (budget, time, boundaries).",
        ],
        assumptions: [
          "Assuming the current obstacle cannot be bypassed or renegotiated.",
        ],
        risks: [
          "Making a major irreversible decision based on unverified assumptions.",
        ],
        options: [
          "Option A: Small, reversible 24-hour test to gather hard evidence",
          "Option B: Direct alignment conversation to resolve the bottleneck",
        ],
        questionsToInvestigate: [
          "What is the single biggest unknown variable about this situation?",
        ],
        nextQuestion: "What is the smallest step you can take today to test your plan?",
        mission: {
          title: "Clarify & Execute 24-Hour Test",
          deadline: "Before 6:00 PM today",
          steps: [
            "State your exact desired outcome in one clear sentence",
            "Identify the #1 risk that could derail it",
            "Take one 15-minute action that moves this forward today",
          ],
          whyItMatters: "Action breaks cognitive friction and builds momentum.",
          howToDoIt: "Focus on one 15-minute micro-task without multitasking.",
          doneWhen: "1 concrete action completed and logged.",
        },
      },
    };
}
