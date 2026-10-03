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

const SYSTEM_PROMPT = `You are ASK AKUCHE — the intelligent problem-solving and decision-support engine inside Akuche.

Your purpose is not merely to answer questions. Your purpose is to help users THINK BETTER, MAKE BETTER DECISIONS, and TAKE PRACTICAL ACTION that can produce measurable results.

Akuche can help users with challenges involving:
- Finance and money
- Business and entrepreneurship
- Career and work
- Sales and marketing
- Relationships
- Education and academic challenges
- Personal development
- Productivity
- Leadership
- Strategy
- Decision-making
- Life planning
- Problem-solving
- Creativity
- Technology
- Communication
- Goal achievement
- Other legitimate human challenges

CORE PRINCIPLE:
Never give a generic answer when the user's question requires a specific solution.
Do not simply provide information. Diagnose the problem, reason through it, identify practical options, and help the user determine what to do next.

OPERATING FRAMEWORK (14 RULES):
1. UNDERSTAND THE REAL QUESTION: Determine what they are trying to achieve, timeframe, resources, constraints, and success criteria. State reasonable assumptions clearly.
2. TURN VAGUE GOALS INTO MEASURABLE TARGETS: Convert numerical goals into smaller unit economics (e.g. ₦5m target = 10 clients × ₦500k, 20 × ₦250k, 50 × ₦100k, 100 × ₦50k).
3. THINK IN TERMS OF LEVERAGE: Look for existing skills, products, audience, contacts, partnerships, corporate B2B, and high-ticket opportunities before building from scratch.
4. CREATE EXECUTION PLANS, NOT JUST IDEAS: Include objective, targets, routes, target customer, pricing, volume, channels, daily targets, sales approach, risks, and what to do TODAY.
5. PRIORITIZE SPECIFICITY: Move from QUESTION → DIAGNOSIS → OPTIONS → NUMBERS → ACTION → EXECUTION.
6. USE USER CONTEXT: Factor in known profession, goals, or stated constraints without pretending to know unstated facts.
7. ASK ONLY HIGH-VALUE QUESTIONS: Provide actionable guidance first, then ask up to 3 high-value questions that materially affect the next execution step.
8. ADAPT TO THE DOMAIN: Use exact domain frameworks (Finance = unit economics/cash flow; Business = acquisition/offers; Career = positioning/outreach; Relationships = boundaries/perspectives; Academics = active recall/Pomodoro; Decisions = trade-off matrix).
9. DISTINGUISH FACTS FROM ASSUMPTIONS: Label estimates and assumptions clearly.
10. CHALLENGE RESPECTFULLY: If a plan is mathematically inconsistent or assumptions are risky, point it out constructively.
11. ALWAYS END WITH ACTION: Provide concrete "DO THIS TODAY" or "YOUR NEXT 3 ACTIONS" with non-vague milestones.
12. STRUCTURED RESPONSE:
   - What I Understand
   - The Real Problem (Bottleneck analysis)
   - The Numbers (Reverse-engineered calculations)
   - Your Options (Route A, Route B, Route C)
   - Recommended Execution Path
   - Step-by-Step Plan
   - Risks & Assumptions
   - Do This Today
   - 3 Questions For You
13. REVERSE-ENGINEER LARGE GOALS: Goal / Time = Daily Run Rate; then model Revenue = Price × Volume; calculate pipeline required (Leads → Conversations → Proposals → Deals).
14. DO NOT CONFUSE ANSWERING WITH SOLVING: Ensure the user can close Ask Akuche and immediately take action.

CORE IDENTITY:
ASK AKUCHE = UNDERSTAND → THINK → CALCULATE → IDENTIFY OPTIONS → DECIDE → ACT → REVIEW.

OUTPUT FORMAT:
Always return valid JSON strictly in this format:
{
  "text": "Your complete, structured, highly actionable response formatted with clear markdown headings (### Title), bold text, calculations, step-by-step execution plan, and 'DO THIS TODAY' action points.",
  "cards": {
    "type": "guided_thinking",
    "whatWeKnow": ["Known constraint 1", "Known constraint 2"],
    "whatWeDontKnow": ["Key unknown 1", "Key unknown 2"],
    "assumptions": ["Assumption 1"],
    "risks": ["Risk factor 1"],
    "options": ["Route A (e.g. 10 clients × ₦500,000)", "Route B (e.g. 50 clients × ₦100,000)"],
    "questionsToInvestigate": ["High-value clarifying question 1", "High-value clarifying question 2"],
    "nextQuestion": "The single most important question to answer next",
    "mission": {
      "title": "Today's Concrete Mission",
      "deadline": "Before 6:00 PM today",
      "steps": [
        "Step 1: Specific action with exact number",
        "Step 2: Specific action with exact number",
        "Step 3: Specific action with exact number"
      ]
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
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    // If OpenAI key is not configured or in offline mode, provide high-quality procedural Socratic reverse-engineering response
    if (!openaiApiKey) {
      const fallbackResponse = generateProceduralSocraticResponse(message);
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
          { role: "system", content: SYSTEM_PROMPT },
          ...formattedHistory,
          { role: "user", content: message },
        ],
        max_tokens: 2048,
        temperature: 0.5,
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
    console.error("Ask AKUCHE error:", err);
    // Even on error, provide procedural response so user is never stranded
    const fallbackResponse = generateProceduralSocraticResponse(
      "Let's break down this decision into actionable steps."
    );
    return NextResponse.json({
      reply: fallbackResponse.text,
      structuredCards: fallbackResponse.cards,
    });
  }
}

// -----------------------------------------------------------------------------
// ADVANCED PROCEDURAL SOCRATIC REVERSE-ENGINEERING ENGINE
// -----------------------------------------------------------------------------

function parseFinancialTarget(query: string): {
  amount: number;
  currency: string;
  timeframeDays: number;
  timeframeLabel: string;
} | null {
  const q = query.toLowerCase();

  // Detect Currency
  let currency = "₦";
  if (q.includes("$") || q.includes("dollar") || q.includes("usd")) currency = "$";
  else if (q.includes("£") || q.includes("pound")) currency = "£";
  else if (q.includes("€") || q.includes("euro")) currency = "€";
  else if (q.includes("naira") || q.includes("₦")) currency = "₦";

  // Detect Amount
  let amount = 0;
  const millionMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:m|million|millions)/i);
  const kMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand|thousands)/i);
  const rawNumMatch = q.match(/[₦$£€]?\s*([\d,]{4,})/);

  if (millionMatch) {
    amount = parseFloat(millionMatch[1]) * 1_000_000;
  } else if (kMatch) {
    amount = parseFloat(kMatch[1]) * 1_000;
  } else if (rawNumMatch) {
    amount = parseFloat(rawNumMatch[1].replace(/,/g, ""));
  }

  if (amount <= 0) return null;

  // Detect Timeframe
  let timeframeDays = 30;
  let timeframeLabel = "30 days";

  if (q.includes("october") || q.includes("this month") || q.includes("end of month") || q.includes("1 month") || q.includes("a month")) {
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

export function generateProceduralSocraticResponse(query: string): {
  text: string;
  cards: SocraticThinkingCards;
} {
  const q = query.toLowerCase();

  // 1. REVERSE-ENGINEER NUMERICAL FINANCIAL GOALS
  const finTarget = parseFinancialTarget(query);
  if (finTarget && finTarget.amount > 0) {
    const { amount, currency, timeframeDays, timeframeLabel } = finTarget;
    const dailyTarget = Math.round(amount / timeframeDays);
    const weeklyTarget = Math.round(amount / (timeframeDays / 7));

    // Calculate 4 distinct unit economics pricing tiers
    const tier1_clients = Math.max(1, Math.round(amount / (amount * 0.1))); // 10 clients
    const tier1_price = amount / 10;

    const tier2_clients = 20;
    const tier2_price = amount / 20;

    const tier3_clients = 50;
    const tier3_price = amount / 50;

    const tier4_clients = 100;
    const tier4_price = amount / 100;

    // Funnel calculations for Recommended Route (e.g. Tier 2: 20 clients)
    const requiredConversions = tier2_clients;
    const expectedCloseRate = 0.2; // 20%
    const qualifiedConversations = Math.round(requiredConversions / expectedCloseRate); // 100
    const discoveryCallsPerDay = Math.ceil(qualifiedConversations / (timeframeDays * 0.7)); // working days
    const dailyOutreachTargets = discoveryCallsPerDay * 3;

    const text = `### What I Understand
You want to generate **${formatMoney(amount, currency)}** within **${timeframeLabel}**.

### The Real Problem
Large revenue targets fail when treated as a single abstract goal. To achieve ${currency}${amount.toLocaleString()}, you do not need generic motivation — you need an **operating pipeline** that balances price, volume, and daily conversion activity.

---

### The Numbers: Reverse-Engineered Breakdown
* **Total Target:** ${formatMoney(amount, currency)}
* **Timeframe:** ${timeframeLabel} (${timeframeDays} days)
* **Required Daily Run Rate:** Approximately **${currency}${dailyTarget.toLocaleString()}/day**
* **Required Weekly Run Rate:** Approximately **${currency}${weeklyTarget.toLocaleString()}/week**

#### Available Revenue Structures ($R = P \\times Q$):
* **Route A (High-Ticket B2B / Premium):** 10 clients × **${currency}${tier1_price.toLocaleString()}**
* **Route B (Mid-Market / Core Offer):** 20 clients × **${currency}${tier2_price.toLocaleString()}**
* **Route C (Productized Service):** 50 clients × **${currency}${tier3_price.toLocaleString()}**
* **Route D (Volume / Digital / Retail):** 100 clients × **${currency}${tier4_price.toLocaleString()}**

---

### Recommended Execution Path: Route B (20 Clients @ ${currency}${tier2_price.toLocaleString()})
**Why:** Route A requires rare ultra-high trust. Route D requires massive existing traffic. **Route B** balances achievable deal size with manageable sales volume.

#### Pipeline Conversion Mathematics:
* **Target Closed Clients:** ${requiredConversions}
* **Expected Proposal Close Rate:** 20%
* **Required Qualified Sales Conversations:** ~${qualifiedConversations} conversations
* **Daily Conversation Pace:** **${discoveryCallsPerDay} qualified conversations per working day**
* **Daily Direct Outreaches:** **${dailyOutreachTargets} personalized pitches per day**

---

### Step-by-Step Execution Plan
* **Phase 1 (Days 1–3): Asset & List Mobilization**
  * Package an undeniable offer priced at ${currency}${tier2_price.toLocaleString()} solving one urgent problem.
  * Build a list of 60 high-intent prospects (past buyers, warm network, corporate contacts).
* **Phase 2 (Days 4–20): High-Velocity Outreach & Discovery**
  * Execute ${dailyOutreachTargets} personalized outreaches every morning before 11:00 AM.
  * Conduct ${discoveryCallsPerDay} discovery calls daily. Focus on diagnosing their pain before pitching.
* **Phase 3 (Days 21–${timeframeDays}): Closing, Cash-Collection & Upsells**
  * Send simple 1-page proposals with 48-hour incentive pricing.
  * Collect upfront payments or 50% deposits.

---

### Risks & Critical Assumptions
* **Assumption:** You have an existing skill, service, or product that can deliver clear value at ${currency}${tier2_price.toLocaleString()}.
* **Bottleneck Risk:** Reaching out to unqualified prospects or delaying follow-ups beyond 24 hours.

---

### Do This Today (Your Next 3 Actions)
1. **Define Your ${currency}${tier2_price.toLocaleString()} Offer:** Write down in 2 sentences: *Who it helps, the exact pain it eliminates, and why it's worth 3x the price.*
2. **Build Your First 20 Prospect Names:** List 20 warm contacts or decision-makers you can message directly today.
3. **Send 5 Direct Diagnostic Messages:** Reach out to the first 5 contacts to initiate a conversation before 6:00 PM.

---

### 3 Questions For You
1. What existing skill, service, or inventory do you currently have that offers the highest profit margin?
2. Who are your last 3 paying clients or best buyers, and how did they find you?
3. How many hours per day can you commit strictly to sales conversations?`;

    return {
      text,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          `Revenue Target: ${formatMoney(amount, currency)}`,
          `Timeframe: ${timeframeLabel} (${timeframeDays} days)`,
          `Required Daily Run Rate: ${currency}${dailyTarget.toLocaleString()}/day`,
        ],
        whatWeDontKnow: [
          "Your current highest-converting offer and profit margin.",
          "Size and responsiveness of your existing warm contacts/audience.",
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
          `Route A (High-Ticket): 10 clients × ${currency}${tier1_price.toLocaleString()}`,
          `Route B (Mid-Market - Recommended): 20 clients × ${currency}${tier2_price.toLocaleString()}`,
          `Route C (Volume): 50 clients × ${currency}${tier3_price.toLocaleString()}`,
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
            "Write down a list of 20 specific people or companies who need this",
            "Send 5 direct diagnostic outreach messages before the end of today",
          ],
        },
      },
    };
  }

  // 2. CUSTOMER & SALES ACQUISITION
  if (
    q.includes("customer") ||
    q.includes("client") ||
    q.includes("sales") ||
    q.includes("leads") ||
    q.includes("marketing") ||
    q.includes("traffic")
  ) {
    return {
      text: `### What I Understand
You are experiencing a bottleneck in customer acquisition, client volume, or sales revenue.

### The Real Problem
Most businesses looking for "more customers" mistakenly assume they have a traffic problem, when they actually have a **conversion, positioning, or follow-up problem**. 

---

### The Numbers & Leverage Diagnostic
* **Revenue Formula:** $Revenue = Leads \\times Conversion\\,Rate \\times Average\\,Order\\,Value \\times Frequency$
* **The 3 Multipliers to Double Revenue:**
  1. Increase qualified conversations by 30%
  2. Increase closing conversion rate by 30% (from 15% → 20%)
  3. Increase average pricing/packaging by 30%
  *(Multiplying all 3 produces a **2.2x total revenue increase** without needing 10x more ad spend).*

---

### Your 3 Acquisition Routes
* **Route 1: Past Buyer Reactivation & Referrals (Fastest / Zero Ad Cost)**
  * Re-contact satisfied previous buyers with a tailored upgrade or referral incentive.
* **Route 2: Direct High-Value Outreach (Highest Control)**
  * Identify 30 ideal corporate/B2B prospects and send personalized diagnostic messages.
* **Route 3: Strategic Distribution Partnerships (Highest Leverage)**
  * Partner with non-competing businesses that already serve your exact target customer.

---

### Recommended Execution Path: Route 1 + Route 2
Mobilize your immediate warm assets first to generate immediate cash flow while building a predictable 10-per-day direct outreach system.

---

### Step-by-Step Execution Plan
1. **Audit Last 10 Customers:** Identify the #1 trigger that made them pay.
2. **Reactivation Campaign:** Message every past client offering a priority service check-in.
3. **Outreach Cadence:** Contact 10 qualified prospective buyers daily via direct message/call.

---

### Do This Today (Your Next 3 Actions)
1. **List Your Last 5 Paying Customers:** Note how much they paid and what problem you solved.
2. **Re-engage 3 Previous Buyers:** Send a quick check-in message asking how their results have been.
3. **Identify 10 New Ideal Prospects:** Find 10 specific decision-makers on LinkedIn/WhatsApp/Instagram and add them to your daily contact sheet.

---

### 3 Questions For You
1. What was the acquisition source of your last 3 paying clients?
2. What is your current closing rate when you get someone on a phone call or into a chat?
3. What is the single biggest objection prospects raise before buying?`,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "You need a repeatable system to generate paying clients/sales.",
          "Acquiring new cold customers costs 5x more than reactivating warm leads.",
        ],
        whatWeDontKnow: [
          "Your current conversion rate from lead to paying customer.",
          "Your average order value and profit margin per transaction.",
          "Your primary sales channel (DMs, calls, website, physical store).",
        ],
        assumptions: [
          "Assuming your core offer delivers verifiable value to past buyers.",
          "Assuming direct outreach is viable for your industry.",
        ],
        risks: [
          "Spending money on paid ads before validating the offer conversion manually.",
          "Pitching features instead of solving immediate customer pain points.",
        ],
        options: [
          "Route 1 (Fastest): Past Buyer Reactivation & Referral Engine",
          "Route 2 (High-Control): Direct Outreach to 10 qualified prospects daily",
          "Route 3 (High-Leverage): Strategic Distribution Partners with shared audience",
        ],
        questionsToInvestigate: [
          "Why did your best customer choose you over competitors?",
        ],
        nextQuestion: "How many qualified prospect conversations are you currently having per week?",
        mission: {
          title: "Customer Engine Kickstart",
          deadline: "Before 6:00 PM today",
          steps: [
            "Write down your top 5 most satisfied past clients",
            "Send a warm check-in message to at least 3 of them",
            "Build a list of 10 new qualified prospects for direct outreach tomorrow morning",
          ],
        },
      },
    };
  }

  // 3. CAPITAL, DEBT, LOAN, OR INVESTMENT DECISION
  if (
    q.includes("borrow") ||
    q.includes("loan") ||
    q.includes("invest") ||
    q.includes("capital") ||
    q.includes("fund") ||
    q.includes("debt")
  ) {
    return {
      text: `### What I Understand
You are evaluating a significant financial decision involving capital allocation, borrowing, or taking on debt.

### The Real Problem
Debt amplifies existing operations: it accelerates profitable businesses, but accelerates failure in unvalidated ones. The core question is **Debt Service Coverage** and **Revenue Velocity**.

---

### The Numbers & Sensitivity Analysis
* **Debt Service Rule:** Your predictable monthly cash flow must cover **at least 1.5x to 2x** the monthly loan repayment amount.
* **Stress Test Scenario:**
  * *Best Case:* Investment yields 30%+ ROI within 60 days.
  * *Realistic Case:* Revenue takes 3–4 months to materialize.
  * *Worst Case:* Zero new revenue for 90 days. *Can your existing personal/business cash flow pay the loan?*

---

### Your Options
* **Option A: Phased Self-Funding (Lowest Risk)**
  * Break the project into 3 micro-milestones. Fund Milestone 1 using presales, supplier terms, or retained earnings.
* **Option B: Supplier Credit / Revenue Share (Moderate Risk)**
  * Negotiate deferred payment terms with suppliers instead of taking fixed-interest bank debt.
* **Option C: Fixed Debt / Loan (Highest Risk)**
  * Take the loan ONLY IF the capital directly purchases proven, fast-turning revenue-generating inventory.

---

### Recommended Execution Path
**Option A or B first.** Validate demand with customer pre-orders before taking debt. If debt is unavoidable, borrow only the minimum required for immediate inventory turnover.

---

### Do This Today (Your Next 3 Actions)
1. **Calculate Monthly Debt Payment:** Determine the exact monthly principal + interest repayment amount.
2. **Stress-Test Your Current Cash Flow:** Verify if you can pay that amount with zero new revenue.
3. **Explore 1 Alternative Non-Debt Source:** Can you secure 3 customer pre-orders or supplier credit?

---

### 3 Questions For You
1. What is the exact interest rate, duration, and monthly repayment schedule of this loan?
2. Exactly how quickly does this capital convert back into liquid cash?
3. What is your reliable net monthly profit over the past 3 months?`,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "You are considering taking on debt or allocating significant capital.",
          "Debt creates a fixed legal obligation regardless of sales fluctuations.",
        ],
        whatWeDontKnow: [
          "The exact APR / monthly interest cost and collateral requirements.",
          "Your current free cash flow buffer.",
          "How fast the capital turns into realized gross profit.",
        ],
        assumptions: [
          "Assuming the invested capital will produce expected returns immediately.",
        ],
        risks: [
          "Cash flow insolvency if customer payments are delayed.",
          "High interest eating all profit margins.",
        ],
        options: [
          "Option A: Phase the project in 3 stages funded by customer pre-orders",
          "Option B: Negotiate 30-day supplier credit instead of a loan",
          "Option C: Take a smaller, capped loan strictly for validated inventory",
        ],
        questionsToInvestigate: [
          "If revenue is delayed by 90 days, how will you service the monthly debt?",
        ],
        nextQuestion: "Can you validate buyer demand with pre-orders before taking the loan?",
        mission: {
          title: "Financial Stress-Test Diagnostic",
          deadline: "Before 6:00 PM today",
          steps: [
            "Calculate your exact monthly debt repayment obligation",
            "Check if your current net income covers 1.5x the monthly payment",
            "Identify one non-debt way to finance the next 14 days of operations",
          ],
        },
      },
    };
  }

  // 4. CAREER, JOB CHANGE, OR BUSINESS LAUNCH
  if (
    q.includes("job") ||
    q.includes("career") ||
    q.includes("quit") ||
    q.includes("start a business") ||
    q.includes("promotion") ||
    q.includes("salary")
  ) {
    return {
      text: `### What I Understand
You are navigating a career transition, evaluating a new venture, or seeking higher income and fulfillment.

### The Real Problem
The biggest mistake in career and venture transitions is jumping without **validated runway and proven market demand**. You need to de-risk the transition while accelerating your income potential.

---

### The Numbers: Transition Economics
* **Survival Runway:** 6 months of baseline living expenses in reserve before resigning.
* **Side-Validation Benchmark:** Generate at least **30% to 50% of your current salary** from your new venture or consulting before making it full-time.
* **Market Positioning Value:** High-income roles and high-ticket clients pay for *measurable outcomes* (e.g. saving money, generating revenue, eliminating compliance risk), not general effort.

---

### Your 3 Strategic Paths
* **Path 1: The Moonlighting Bridge (Recommended - Lowest Risk)**
  * Keep current employment while dedicating 10–15 hours weekly to secure your first 3 paying clients.
* **Path 2: Internal Elevation (Fastest Immediate Cash)**
  * Negotiate a compensation review or promotion by documenting the specific financial value you delivered in the last 6 months.
* **Path 3: Full Pivot with Runway (High Risk / High Reward)**
  * Transition immediately if you have 6+ months of verified cash runway and an active client pipeline.

---

### Recommended Execution Path: Path 1 (The Moonlighting Bridge)
Validate your business or skill offer with real paying clients before cutting off your primary cash flow.

---

### Do This Today (Your Next 3 Actions)
1. **Calculate Your Monthly Baseline Cost:** Know your exact personal survival budget.
2. **Define Your Skill Asset:** What is the #1 problem you can solve for a business in 5 hours?
3. **Reach Out to 2 Potential Clients:** Offer a specific diagnostic or pilot service before committing to resign.

---

### 3 Questions For You
1. How many months of living expenses do you currently have saved?
2. What specific marketable skill has generated the most value in your career?
3. How many hours per week can you consistently commit to building this transition?`,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "You are evaluating a strategic career transition or business launch.",
          "Predictable income reduces panic and enables sound decision-making.",
        ],
        whatWeDontKnow: [
          "Your current monthly savings runway.",
          "Whether your target market has already paid for this skill/service.",
        ],
        assumptions: [
          "Assuming your new venture can generate revenue within 60–90 days.",
        ],
        risks: [
          "Premature resignation creating urgent financial distress.",
          "Launching an offer without talking to prospective buyers first.",
        ],
        options: [
          "Path 1 (Recommended): Moonlighting bridge until securing 3 paying clients",
          "Path 2: Internal negotiation for higher compensation and leverage",
          "Path 3: Immediate pivot if 6-month cash runway is secured",
        ],
        questionsToInvestigate: [
          "Can you acquire your first paying customer while keeping your current job?",
        ],
        nextQuestion: "What is your single most valuable skill that someone will pay for this week?",
        mission: {
          title: "Career & Venture Feasibility Audit",
          deadline: "Before 6:00 PM today",
          steps: [
            "Calculate your exact monthly survival living expense",
            "Write a 1-paragraph summary of your core service offer",
            "Contact 2 people in your network to discuss their business challenges",
          ],
        },
      },
    };
  }

  // 5. STUDYING, CONCENTRATION & ACADEMIC CHALLENGES
  if (
    q.includes("concentrate") ||
    q.includes("studying") ||
    q.includes("study") ||
    q.includes("exam") ||
    q.includes("learn") ||
    q.includes("focus") ||
    q.includes("academic")
  ) {
    return {
      text: `### What I Understand
You are struggling with focus, concentration, information retention, or preparing for high-stakes academic challenges.

### The Real Problem
Concentration failure is rarely a lack of willpower; it is caused by **high friction, cognitive overload, passive studying (re-reading), and environmental distraction triggers**.

---

### The Cognitive Mathematics of Deep Focus
* **Passive Re-reading Retention:** ~10% after 48 hours.
* **Active Recall & Practice Testing:** ~80%+ retention after 48 hours.
* **The 45/15 High-Velocity Protocol:**
  * 45 Minutes: Uninterrupted deep study (Phone in another room, single topic).
  * 15 Minutes: Physical break, hydration, active recall quiz.

---

### Your 2 Learning Paths
* **Path A: The Feynman Active-Recall Sprint (Recommended)**
  * Study a topic for 30 minutes, close the book, and explain it aloud in simple terms as if teaching a 10-year-old. Identify gaps immediately.
* **Path B: Past-Question Reverse Engineering**
  * Start directly with past exam questions. Work backwards to find what you do not know.

---

### Do This Today (Your Next 3 Actions)
1. **Clear Your Physical Desk:** Remove all items except 1 notebook, 1 pen, and the material.
2. **Put Phone in Another Room:** Eliminate digital interruption friction completely.
3. **Execute One 45-Minute Deep Focus Sprint:** Start a timer now for 45 minutes on the hardest topic.

---

### 3 Questions For You
1. What specific exam, topic, or subject is your most urgent priority?
2. How many days remain until your target deadline or test?
3. What is your #1 distraction source when you sit down to study?`,
      cards: {
        type: "guided_thinking",
        whatWeKnow: [
          "You want to maximize concentration and information retention.",
          "Active recall outperforms passive reading by over 400%.",
        ],
        whatWeDontKnow: [
          "The deadline and syllabus volume of your upcoming exam.",
          "Your current daily available study hours.",
        ],
        assumptions: [
          "Assuming digital distractions and multi-tasking are fracturing your attention.",
        ],
        risks: [
          "Passive highlighting giving an illusion of competence without memory retention.",
          "Cramming without sleep, destroying memory consolidation.",
        ],
        options: [
          "Path A: Feynman active recall + 45/15 Pomodoro deep sprints",
          "Path B: Past exam question reverse-engineering",
        ],
        questionsToInvestigate: [
          "Which 20% of the syllabus accounts for 80% of the exam weight?",
        ],
        nextQuestion: "Can you set a 45-minute timer right now with your phone in another room?",
        mission: {
          title: "45-Minute Deep Focus Sprint",
          deadline: "Complete within next 2 hours",
          steps: [
            "Place your phone in another room",
            "Pick the single most difficult concept on your syllabus",
            "Run a 45-minute focused sprint and test yourself without looking at notes",
          ],
        },
      },
    };
  }

  // 6. DEFAULT GENERAL DECISION & PROBLEM SOLVING
  return {
    text: `### What I Understand
You are facing an important decision or complex challenge that requires structured thinking, diagnosis, and practical action.

### The Real Problem
Complex problems feel overwhelming when facts, assumptions, and emotions are tangled together. To solve this, we must separate **what is verified** from **what is assumed**, identify the highest-leverage route, and build a concrete execution plan.

---

### Analytical Breakdown
* **The Core Bottleneck:** Identify the single constraint that, if resolved, makes everything else easier or unnecessary.
* **Leverage Principle:** What existing assets, skills, or direct relationships can you deploy immediately?

---

### Your 2 Realistic Paths
* **Path A: The Low-Risk Validation Experiment (Recommended)**
  * Run a small, reversible test within 24 hours to gather hard data before making a permanent commitment.
* **Path B: The Direct Alignment Path**
  * Address the core constraint directly by having a direct conversation or setting firm boundaries.

---

### Step-by-Step Execution Plan
1. **Clarify Objective:** State the exact measurable outcome you need.
2. **Test Assumption:** Identify the single biggest unproven assumption and test it today.
3. **Execute & Review:** Review outcomes and adjust based on real feedback.

---

### Do This Today (Your Next 3 Actions)
1. **Write Down the Hard Facts:** List what you know for certain vs what you are assuming.
2. **Identify Your #1 Bottleneck:** What is the single biggest obstacle right now?
3. **Take One 15-Minute Action:** Execute one concrete step that moves this forward before 6:00 PM.

---

### 3 Questions For You
1. What would a 10/10 successful outcome look like in 30 days?
2. What is the single biggest risk or downside if this does not work?
3. What is one action you could take in the next 2 hours to test your main assumption?`,
    cards: {
      type: "guided_thinking",
      whatWeKnow: [
        "You are dealing with an important problem requiring analytical diagnosis.",
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
        "Path A: Small, reversible 24-hour test to gather hard evidence",
        "Path B: Direct conversation to resolve the core bottleneck",
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
      },
    },
  };
}
