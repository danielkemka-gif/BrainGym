/**
 * AKUCHE "WHAT AM I MISSING?" SIGNATURE INTELLIGENCE ENGINE
 *
 * Core Purpose:
 * Exposes hidden assumptions, unexamined risks, alternative explanations,
 * conflicting priorities, and missing information behind any real-life problem,
 * business dilemma, career crossroads, or personal decision.
 *
 * Implementation Rule:
 * - Never contrarian for the sake of being contrarian.
 * - Prioritizes the single most critical blind spot over an overwhelming list.
 * - Distinguishes confirmed facts from hypotheses.
 */

export interface WhatAmIMissingAnalysis {
  situationSummary: string;
  domain: "business" | "career" | "potential" | "life" | "general";
  missingInformation: string[];
  hiddenAssumptions: string[];
  alternativeExplanations: string[];
  potentialBlindSpots: string[];
  unexaminedRisks: string[];
  conflictingPriorities: string[];
  singlePriorityQuestion: string;
  suggestedAction: string;
}

export function analyzeWhatAmIMissing(
  input: string,
  userDomain?: "business" | "career" | "potential" | "life"
): WhatAmIMissingAnalysis {
  const text = input.trim().toLowerCase();

  // Detect domain if not provided
  let domain = userDomain || "general";
  if (domain === "general") {
    if (/\b(business|sale(s)?|revenue|profit|customer(s)?|client(s)?|pricing|market|propos(al|als)?|product(s)?|startup|cash\s*flow|b2b|contract(s)?)\b/i.test(text)) {
      domain = "business";
    } else if (/\b(job(s)?|career(s)?|promot(ion|ions)?|boss|manager|salary|colleague(s)?|workplace|interview(s)?|burnout|cv|resume|resign(ing)?)\b/i.test(text)) {
      domain = "career";
    } else if (/\b(graduate(s|d)?|student(s)?|degree(s)?|potential|strength(s)?|passion|direction|skill(s)?|future|university|college)\b/i.test(text)) {
      domain = "potential";
    } else if (/\b(relationship(s)?|partner(s)?|marriage|family|debt|loan(s)?|rent|health|balance|friend(s)?|personal)\b/i.test(text)) {
      domain = "life";
    }
  }

  // 1. BUSINESS DOMAIN ANALYSIS
  if (domain === "business") {
    if (text.includes("sales") || text.includes("money") || text.includes("revenue") || text.includes("customer")) {
      return {
        situationSummary: input.trim(),
        domain: "business",
        missingInformation: [
          "Actual conversion rate at each step (traffic vs inquiries vs closed sales).",
          "Customer feedback on why those who enquired chose not to purchase.",
          "Unit economics: Gross margin per product versus customer acquisition cost.",
        ],
        hiddenAssumptions: [
          "Assuming low sales is a marketing/visibility problem rather than an offer positioning or trust problem.",
          "Assuming lowering prices will automatically attract more paying buyers.",
        ],
        alternativeExplanations: [
          "The target audience has the desire but lacks the purchasing power or urgent necessity to buy now.",
          "The value proposition is clear to you, but ambiguous or unconvincing to first-time prospects.",
        ],
        potentialBlindSpots: [
          "Focusing exclusively on getting new leads while ignoring repeat purchases and referral loops from past buyers.",
        ],
        unexaminedRisks: [
          "Spending additional advertising budget driving traffic to an offer that currently fails to convert.",
        ],
        conflictingPriorities: [
          "Desire for immediate cash flow versus long-term brand credibility and margin protection.",
        ],
        singlePriorityQuestion:
          "Of the last 10 prospective customers who showed initial interest, what specific reason did they give (or demonstrate) for not completing the purchase?",
        suggestedAction:
          "Audit the last 10 lost opportunities before spending any additional money on advertising.",
      };
    }

    if (text.includes("proposal") || text.includes("b2b") || text.includes("contract")) {
      return {
        situationSummary: input.trim(),
        domain: "business",
        missingInformation: [
          "Whether the proposal reached the ultimate budget holder or remained with a mid-level screener.",
          "The specific corporate KPI or urgent headache the client is currently judged on this quarter.",
        ],
        hiddenAssumptions: [
          "Assuming a well-written proposal is sufficient without pre-proposal internal champion alignment.",
          "Assuming lack of response means rejection rather than competing corporate priorities.",
        ],
        alternativeExplanations: [
          "The organization has an unallocated or frozen budget for discretionary external training/services.",
          "The problem you solved is perceived as a 'nice-to-have' rather than a high-consequence corporate problem.",
        ],
        potentialBlindSpots: [
          "Submitting proposals blindly into RFP queues without prior relationship or diagnostic discovery calls.",
        ],
        unexaminedRisks: [
          "Continuing to blast identical proposals across industries without tailoring to specific sector dynamics.",
        ],
        conflictingPriorities: [
          "Need for quick client acquisition versus the time required to build enterprise relationship equity.",
        ],
        singlePriorityQuestion:
          "Before submitting the proposal, did you have a direct diagnostic conversation with the decision-maker who controls the budget?",
        suggestedAction:
          "Select the top 3 highest-value proposal recipients and arrange a 15-minute alignment call focused solely on their Q1 challenges.",
      };
    }
  }

  // 2. CAREER DOMAIN ANALYSIS
  if (domain === "career") {
    if (text.includes("promotion") || text.includes("stagnan") || text.includes("stuck") || text.includes("raise")) {
      return {
        situationSummary: input.trim(),
        domain: "career",
        missingInformation: [
          "Specific criteria leadership uses to decide who gets promoted beyond standard job performance.",
          "Who in the executive decision loop actually knows the measurable impact of your work.",
        ],
        hiddenAssumptions: [
          "Assuming working hard and doing good work will automatically be noticed and rewarded by management.",
          "Assuming tenure and years of service qualify you for executive responsibility.",
        ],
        alternativeExplanations: [
          "You are seen as indispensable in your current role, creating an incentive for management to keep you where you are.",
          "Your technical contribution is recognized, but your strategic communication and leadership presence have not been demonstrated.",
        ],
        potentialBlindSpots: [
          "Over-investing in execution while under-investing in stakeholder relationships and business-level visibility.",
        ],
        unexaminedRisks: [
          "Raising grievances without an alternative career path or competing market offer.",
        ],
        conflictingPriorities: [
          "Desire for higher compensation and authority versus willingness to take on organizational politics and high-visibility responsibility.",
        ],
        singlePriorityQuestion:
          "Does your direct manager explicitly know your promotion aspirations, and have you agreed on 3 objective milestones required to achieve it?",
        suggestedAction:
          "Schedule a 1-on-1 strategic growth conversation with your manager to map specific deliverables to the next career band.",
      };
    }

    if (text.includes("burnout") || text.includes("leave") || text.includes("quit") || text.includes("exhaust")) {
      return {
        situationSummary: input.trim(),
        domain: "career",
        missingInformation: [
          "Financial runway in months if you transition without an immediate replacement income.",
          "Whether the burnout is caused by the company culture, the specific manager, or unsustainable personal boundaries.",
        ],
        hiddenAssumptions: [
          "Assuming leaving immediately is the only way to recover mental clarity and rest.",
          "Assuming the next company will naturally protect your work-life boundaries without you setting them.",
        ],
        alternativeExplanations: [
          "You may have accumulated a heavy habit of saying 'yes' to every project, creating an overwhelming workload that management assumes you welcome.",
        ],
        potentialBlindSpots: [
          "Making a major career exit decision at the peak of emotional exhaustion rather than in a state of calm analysis.",
        ],
        unexaminedRisks: [
          "Trading workplace stress for sudden financial anxiety if emergency reserves are insufficient.",
        ],
        conflictingPriorities: [
          "Immediate emotional relief versus medium-term financial safety and career momentum.",
        ],
        singlePriorityQuestion:
          "If you were able to establish strict boundaries and say 'no' to non-core tasks starting this week, would this role become manageable for the next 90 days?",
        suggestedAction:
          "Enforce a 2-week boundary test while calculating your exact 6-month financial runway before handing in a resignation.",
      };
    }
  }

  // 3. POTENTIAL & STUDENTS DOMAIN ANALYSIS
  if (domain === "potential") {
    return {
      situationSummary: input.trim(),
      domain: "potential",
      missingInformation: [
        "Real-world market demand for your skills in the specific industries you are considering.",
        "Your proven strengths demonstrated through past completed projects or feedback from others.",
      ],
      hiddenAssumptions: [
        "Assuming you must find your 'one true life passion' before you can start taking meaningful career action.",
        "Assuming your degree title strictly dictates the kind of career you are allowed to build.",
      ],
      alternativeExplanations: [
        "Your confusion may not be a lack of direction, but the anxiety of eliminating options by making a committed choice.",
      ],
      potentialBlindSpots: [
        "Spending months researching and planning in isolation instead of testing small real-world projects or internships.",
      ],
      unexaminedRisks: [
        "Waiting for total certainty before starting, which costs valuable time and compound learning experience.",
      ],
      conflictingPriorities: [
        "Family/social expectations versus personal interests and market realities.",
      ],
      singlePriorityQuestion:
        "What is one concrete skill you possess that someone would be willing to pay or trade for right now?",
      suggestedAction:
        "Define a 90-day experiment focused on building one tangible portfolio project rather than trying to plan the next 10 years.",
    };
  }

  // 4. EVERYDAY LIFE & RELATIONSHIPS DOMAIN ANALYSIS
  if (domain === "life") {
    return {
      situationSummary: input.trim(),
      domain: "life",
      missingInformation: [
        "The underlying fears or insecurities driving the other person's behavior or reaction.",
        "Clear, written expectations agreed upon by both parties ahead of time.",
      ],
      hiddenAssumptions: [
        "Assuming the other party shares the same values, financial definitions, or life priorities as you.",
        "Assuming that recurring conflict is proof of incompatibility rather than unaddressed expectations.",
      ],
      alternativeExplanations: [
        "The conflict is not really about the visible topic (e.g. money or chores), but about feeling unheard, unappreciated, or unsafe.",
      ],
      potentialBlindSpots: [
        "Focusing on winning the argument or proving yourself right instead of understanding the root emotional concern.",
      ],
      unexaminedRisks: [
        "Letting resentments build silently until an explosive argument creates irreversible damage.",
      ],
      conflictingPriorities: [
        "Personal freedom and self-expression versus mutual compromise and accountability.",
      ],
      singlePriorityQuestion:
        "If you paused arguing about the specific disagreement, what does the other person feel most anxious or defensive about?",
      suggestedAction:
        "Initiate a calm conversation at a neutral time (not during an argument) focused exclusively on understanding their underlying concern.",
    };
  }

  // 5. GENERAL DEFAULT ANALYSIS
  return {
    situationSummary: input.trim(),
    domain: "general",
    missingInformation: [
      "Objective baseline metrics and concrete facts versus personal interpretations.",
      "Constraints, available resources, and realistic timelines.",
    ],
    hiddenAssumptions: [
      "Assuming the immediate visible symptom is the root cause of the difficulty.",
      "Assuming past outcomes will repeat without examining what variables have changed.",
    ],
    alternativeExplanations: [
      "The difficulty may be structural (system/process) rather than individual effort.",
      "External timing or market conditions may be temporarily masking internal progress.",
    ],
    potentialBlindSpots: [
      "Focusing on low-leverage details while overlooking the single most impactful lever.",
    ],
    unexaminedRisks: [
      "Opportunity cost: what are you missing out on by maintaining this current approach?",
    ],
    conflictingPriorities: [
      "Speed of execution versus thoroughness and sustainable quality.",
    ],
    singlePriorityQuestion:
      "What is the single most critical assumption in this plan that, if proven wrong, would cause the entire approach to fail?",
    suggestedAction:
      "Stress-test your primary assumption by gathering 3 pieces of contradictory evidence before proceeding.",
  };
}
