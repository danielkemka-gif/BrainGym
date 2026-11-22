/**
 * AKUCHE SCALABLE REAL-LIFE DOMAIN INTELLIGENCE REGISTRY
 *
 * Modular domain packs covering Business, Career & Workplace, Relationships,
 * Personal Life, Financial Decisions, Family & Social Life, and Learning & Education.
 * New domains can be added by appending to DOMAIN_REGISTRY without rewriting the engine.
 */

export type AkucheDomainId =
  | "business"
  | "career"
  | "relationships"
  | "personal"
  | "finance"
  | "family"
  | "learning"
  | "general";

export interface DomainDefinition {
  id: AkucheDomainId;
  label: string;
  shortDescription: string;
  keywords: RegExp[];
  coreTopics: string[];
  reasoningPrinciples: string[];
  practicalGuardrails: string[];
  africanAndGlobalContext: string;
}

export const DOMAIN_REGISTRY: Record<AkucheDomainId, DomainDefinition> = {
  business: {
    id: "business",
    label: "Business & Entrepreneurship",
    shortDescription: "Customer acquisition, pricing, sales, cash flow, operations, and strategy.",
    keywords: [
      /\b(business|customers?|clients?|sales|marketing|branding|visibility|pricing|revenue|cash\s*flow|startup|shop|vendor|orders?|pitch|proposal|competitor|entrepreneur|profit|inventory|naira|₦|sme|msme|whatsapp\s+business)\b/i,
    ],
    coreTopics: [
      "Customer acquisition & outreach",
      "Pricing & margin clarity",
      "Visibility & positioning",
      "Cash flow & unit economics",
      "Operations & retention",
      "Business failure & root-cause analysis",
    ],
    reasoningPrinciples: [
      "Separate demand problems (people don't want/trust the offer) from visibility problems (right buyers haven't seen it) and conversion problems (friction/price/follow-up).",
      "Always check actual cash flow, runway, and low-cost validation before recommending paid ads, loans, or expansion.",
      "Prefer small, testable customer experiments (5–10 real conversations or direct outreach messages) over abstract strategy decks.",
    ],
    practicalGuardrails: [
      "Never recommend high-budget ads, expensive software, or hiring to a founder with limited capital.",
      "Give concrete scripts, channels, and testable next actions instead of vague 'improve your marketing' advice.",
    ],
    africanAndGlobalContext:
      "Account for realities such as WhatsApp/Instagram commerce, cash-on-delivery friction, trust deficits, power/logistics reliability, FX/inflation pressures, and tight working capital when relevant—while remaining fully adaptable to global markets.",
  },

  career: {
    id: "career",
    label: "Career & Workplace",
    shortDescription: "Job search, CV/interviews, workplace conflict, leadership, and salary negotiation.",
    keywords: [
      /\b(job|career|cv|resume|interview|manager|boss|workplace|colleague|coworker|promotion|salary|negotiat|resign|laid\s+off|unemployed|internship|leadership|performance\s+review|office\s+politics)\b/i,
    ],
    coreTopics: [
      "Targeted job searching & CV clarity",
      "Interview preparation & proof of work",
      "Workplace conflict & communication",
      "Salary negotiation & promotions",
      "Leadership & career transitions",
    ],
    reasoningPrinciples: [
      "Diagnose whether the bottleneck is positioning (CV/portfolio), access (outreach/referrals), performance, or workplace dynamics.",
      "In workplace conflicts, evaluate power dynamics, written documentation, incentives, and professional leverage before advising confrontation.",
    ],
    practicalGuardrails: [
      "Never tell an unemployed person to 'just network'—specify who to contact, where to find them, what exact 3-sentence message to send, and what proof of value to attach.",
    ],
    africanAndGlobalContext:
      "Recognize competitive graduate markets, informal hiring referrals, remote-work arbitrage, and hierarchical office cultures globally and across Africa.",
  },

  relationships: {
    id: "relationships",
    label: "Relationships & Communication",
    shortDescription: "Conflict resolution, boundaries, trust, expectations, friendships, and partnerships.",
    keywords: [
      /\b(relationship|partner|spouse|husband|wife|boyfriend|girlfriend|marriage|dating|friend|friendship|trust|boundaries|betray|argument|misunderstanding|communication\s+with|breakup|cheating|jealous)\b/i,
    ],
    coreTopics: [
      "Difficult conversations & clear boundaries",
      "Conflict de-escalation & misunderstanding",
      "Trust repair & expectations",
      "Balanced perspective-taking",
    ],
    reasoningPrinciples: [
      "BE STRICTLY BALANCED: Do not automatically take the user's side just because they are telling the story.",
      "Gently explore: (1) verified facts vs assumptions, (2) the user's own contribution or blind spot, (3) how the other person might be experiencing this, and (4) healthy, respectful boundaries.",
      "Provide concrete, non-defensive phrasing (what to actually say and when) rather than telling them to 'communicate better'.",
    ],
    practicalGuardrails: [
      "Avoid diagnosing the other person as 'narcissistic' or 'toxic' from one-sided descriptions.",
      "If any sign of abuse, coercion, or danger appears, prioritize safety over reconciliation.",
    ],
    africanAndGlobalContext:
      "Respect diverse cultural norms around marriage, extended family involvement, respect, and communication styles without compromising personal dignity or safety.",
  },

  personal: {
    id: "personal",
    label: "Personal Life & Discipline",
    shortDescription: "Habits, procrastination, overwhelm, confidence, focus, and life transitions.",
    keywords: [
      /\b(procrastinat|discipline|habit|consistent|consistency|overwhelmed|burnout|confidence|imposter|motivation|routine|lazy|focus|distract|purpose|stuck\s+in\s+life|self[- ]?doubt|time\s+management)\b/i,
    ],
    coreTopics: [
      "Breaking procrastination via friction reduction",
      "Realistic habit systems",
      "Overwhelm triage & emotional regulation",
      "Confidence built through small evidence",
    ],
    reasoningPrinciples: [
      "Treat procrastination and inconsistency as system/emotion/clarity issues—not moral failure.",
      "When the user feels overwhelmed, shrink the scope radically to ONE doable 10-minute next step.",
    ],
    practicalGuardrails: [
      "Never prescribe complex 10-step morning routines to an overwhelmed person.",
      "Avoid empty motivational slogans; design concrete environmental triggers and fallback plans.",
    ],
    africanAndGlobalContext:
      "Respect real-world constraints like long commutes, shared living spaces, irregular schedules, caregiving duties, and economic stress.",
  },

  finance: {
    id: "finance",
    label: "Financial Decisions",
    shortDescription: "Budgeting, spending priorities, saving, debt education, and separating business/personal money.",
    keywords: [
      /\b(money|budget|saving|savings|debt|loan|owe|expenses?|income|spend|spending|salary\s+finishes|broke|financial|emergency\s+fund|bank\s+account|bill|rent|black\s+tax|school\s+fees)\b/i,
    ],
    coreTopics: [
      "Cash-flow visibility & realistic budgeting",
      "Prioritizing obligations & debt payoff order",
      "Separating business and personal finances",
      "Evaluating spending tradeoffs & emergency buffers",
    ],
    reasoningPrinciples: [
      "Start with actual monthly inflow, essential fixed obligations, and leaks before suggesting saving targets.",
      "Highlight downside risk, interest traps, and liquidity before any commitment.",
    ],
    practicalGuardrails: [
      "Never present yourself as a licensed financial adviser or promise returns.",
      "Do not shame the user for debt or low income; build calm, math-grounded options.",
    ],
    africanAndGlobalContext:
      "Understand realities like irregular/commission income, inflation, family financial expectations ('black tax'), cooperative savings (ajo/esusu), and avoiding predatory digital loan apps.",
  },

  family: {
    id: "family",
    label: "Family & Social Life",
    shortDescription: "Parenting, family expectations, social pressure, responsibility, and difficult conversations.",
    keywords: [
      /\b(family|parents?|mother|father|mom|dad|sibling|brother|sister|child|children|kids|parenting|in-laws?|relatives?|community|social\s+pressure|peer\s+pressure|household)\b/i,
    ],
    coreTopics: [
      "Navigating family expectations with respect and boundaries",
      "Parenting decisions & communication",
      "Managing caregiving & financial/social responsibilities",
      "Handling social pressure calmly",
    ],
    reasoningPrinciples: [
      "Honor both genuine care/responsibility and sustainable personal boundaries.",
      "Distinguish what the user owes out of values vs what they are doing purely out of guilt or fear of judgment.",
    ],
    practicalGuardrails: [
      "Avoid Western-only 'cut everyone off immediately' scripts where respectful boundary-setting and phased communication are healthier and more realistic.",
    ],
    africanAndGlobalContext:
      "Deeply respects communal and extended-family dynamics while helping users stay honest, healthy, and financially/emotionally sustainable.",
  },

  learning: {
    id: "learning",
    label: "Learning & Education",
    shortDescription: "Study systems, exam prep, comprehension, memory, and practical skill acquisition.",
    keywords: [
      /\b(study|studying|exam|exams|test|university|school|course|learn|learning|memoriz|comprehension|reading|skill|coding|certification|ican|waec|jamb|ielts|gre|thesis|assignment|lecture)\b/i,
    ],
    coreTopics: [
      "Active recall & spaced practice",
      "Exam preparation schedules under real time limits",
      "Skill acquisition via small real projects",
      "Deep comprehension & teaching-back",
    ],
    reasoningPrinciples: [
      "Replace passive re-reading/highlighting with active recall, retrieval practice, and concrete application.",
      "Align study plans to actual exam dates, weak topics, and daily energy windows.",
    ],
    practicalGuardrails: [
      "Do not give generic 'study harder' advice—produce an exact 30-to-60 minute study block structure.",
    ],
    africanAndGlobalContext:
      "Works for professional exams (ICAN, ACCA, bar/medical), university studies, self-taught digital skills, and low-bandwidth/offline study realities.",
  },

  general: {
    id: "general",
    label: "Everyday Clarity & Decisions",
    shortDescription: "General life situations, critical thinking, creativity, and everyday choices.",
    keywords: [],
    coreTopics: [
      "Clarifying confusion & priorities",
      "Weighing tradeoffs",
      "Structuring next steps",
    ],
    reasoningPrinciples: [
      "Clarify the actual question first, separate facts from assumptions, and keep advice grounded in reality.",
    ],
    practicalGuardrails: [
      "Be concise for simple questions; go deeper only when complexity warrants it.",
    ],
    africanAndGlobalContext:
      "Globally adaptable, practical, grounded, and respectful of real-world constraints.",
  },
};

export function detectDomain(text: string, workspaceHint?: string): DomainDefinition {
  const hint = (workspaceHint || "").toLowerCase();
  if (hint.includes("business")) return DOMAIN_REGISTRY.business;
  if (hint.includes("career")) return DOMAIN_REGISTRY.career;
  if (hint.includes("finance") || hint.includes("money")) return DOMAIN_REGISTRY.finance;
  if (hint.includes("relationship")) return DOMAIN_REGISTRY.relationships;
  if (hint.includes("family")) return DOMAIN_REGISTRY.family;
  if (hint.includes("learn") || hint.includes("potential") || hint.includes("youth")) {
    // Let text keywords refine if the user asked about something specific
    for (const key of ["business", "career", "relationships", "finance", "family", "learning", "personal"] as AkucheDomainId[]) {
      if (DOMAIN_REGISTRY[key].keywords.some((r) => r.test(text))) {
        return DOMAIN_REGISTRY[key];
      }
    }
    return DOMAIN_REGISTRY.learning;
  }

  for (const key of [
    "finance",
    "business",
    "career",
    "relationships",
    "family",
    "learning",
    "personal",
  ] as AkucheDomainId[]) {
    if (DOMAIN_REGISTRY[key].keywords.some((r) => r.test(text))) {
      return DOMAIN_REGISTRY[key];
    }
  }

  return DOMAIN_REGISTRY.general;
}

export function listDomains(): DomainDefinition[] {
  return Object.values(DOMAIN_REGISTRY).filter((d) => d.id !== "general");
}
