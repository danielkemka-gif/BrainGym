/**
 * AKUCHE UNIFIED SAFETY, BOUNDARY & PROMPT-INJECTION GUARD
 *
 * Enforces responsible coaching boundaries across ALL AI endpoints:
 * - Immediate crisis / self-harm / imminent danger routing (multi-lingual signals)
 * - Domestic violence & abuse safety guidance
 * - Medical emergency triage
 * - Regulated professional boundary notices (medical, therapy, legal, financial)
 * - Prompt-injection detection & sanitization on BOTH user messages AND injected context/memory
 */

export type SafetyCategory =
  | "none"
  | "self_harm_crisis"
  | "abuse_violence"
  | "medical_emergency"
  | "medical_boundary"
  | "mental_health_boundary"
  | "legal_boundary"
  | "financial_boundary";

export interface SafetyAssessment {
  triggered: boolean;
  requiresImmediateIntercept: boolean;
  category: SafetyCategory;
  interceptMessage?: string;
  boundarySystemInstruction?: string;
}

const SELF_HARM_PATTERNS: RegExp[] = [
  /\b(kill\s+myself|end\s+my\s+life|commit\s+suicide|want\s+to\s+die|wish\s+i\s+was\s+dead|no\s+reason\s+to\s+live|ending\s+it\s+all|take\s+my\s+own\s+life|hurt\s+myself|self[- ]?harm|cut\s+myself|overdose\s+on|jump\s+off\s+(a|the)\s+(bridge|building|roof))\b/i,
  /\b(suicidal|suicide\s+note|don'?t\s+want\s+to\s+wake\s+up|better\s+off\s+dead)\b/i,
  // Nigerian Pidgin & French safety signals
  /\b(i\s+wan\s+die|make\s+i\s+just\s+die|kill\s+my\s+body|je\s+veux\s+mourir|me\s+suicider|mettre\s+fin\s+[aà]\s+mes\s+jours)\b/i,
];

const ABUSE_VIOLENCE_PATTERNS: RegExp[] = [
  /\b(he|she|my\s+husband|my\s+wife|my\s+partner|my\s+dad|my\s+father|my\s+brother|someone)\s+(beats?|hits?|chokes?|strangles?|threatens?\s+to\s+kill|abuses?|sexually\s+assaults?|rapes?)\s+me\b/i,
  /\b(domestic\s+violence|being\s+abused\s+at\s+home|trapped\s+with\s+an\s+abuser|afraid\s+for\s+my\s+safety|going\s+to\s+hurt\s+me\s+tonight|physical\s+abuse\s+right\s+now)\b/i,
];

const MEDICAL_EMERGENCY_PATTERNS: RegExp[] = [
  /\b(chest\s+pain\s+(right\s+now|radiating)|can'?t\s+breathe|having\s+a\s+stroke|heart\s+attack\s+symptoms|uncontrolled\s+bleeding|coughing\s+up\s+blood|swallowed\s+poison|seizure\s+right\s+now|severe\s+allergic\s+reaction)\b/i,
];

const MEDICAL_BOUNDARY_PATTERNS: RegExp[] = [
  /\b(diagnose\s+me|what\s+medication\s+should\s+i\s+take|dosage\s+of|prescription\s+for|should\s+i\s+stop\s+taking\s+my\s+(meds|medication)|do\s+i\s+have\s+(cancer|diabetes|bipolar|adhd|depression|hypertension))\b/i,
];

const LEGAL_BOUNDARY_PATTERNS: RegExp[] = [
  /\b(legal\s+advice|sue\s+(him|her|them|my\s+employer)|draft\s+a\s+contract|court\s+case|custody\s+battle|eviction\s+notice|criminal\s+charge|divorce\s+filing)\b/i,
];

const FINANCIAL_BOUNDARY_PATTERNS: RegExp[] = [
  /\b(which\s+stock\s+to\s+buy|invest\s+all\s+my\s+savings|crypto\s+guarantee|guaranteed\s+returns|tax\s+evasion|ponzi|forex\s+signal|double\s+my\s+money)\b/i,
];

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules|directions)/i,
  /disregard\s+(all\s+)?(previous|prior|system)\s+(instructions|prompts)/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|developer\s+prompt|api\s+key|environment\s+variables)/i,
  /(print|dump|output|show|repeat)\s+(your\s+)?(exact\s+)?(system\s+prompt|system\s+instructions|openai_api_key|service_role_key)/i,
  /\b(jailbreak|DAN\s+mode|developer\s+mode\s+override|act\s+as\s+unrestricted)\b/i,
  /<\s*\/?\s*(system|assistant|instruction)\s*>/i,
  /\[SYSTEM\s+OVERRIDE\]|###\s*NEW\s+SYSTEM\s+PROMPT/i,
];

export function evaluateSafetyAndBoundaries(input: string): SafetyAssessment {
  const text = (input || "").trim();
  if (!text) {
    return { triggered: false, requiresImmediateIntercept: false, category: "none" };
  }

  if (SELF_HARM_PATTERNS.some((p) => p.test(text))) {
    return {
      triggered: true,
      requiresImmediateIntercept: true,
      category: "self_harm_crisis",
      interceptMessage:
        "I am really glad you spoke up, and your safety matters more than anything else right now. I am an AI coach, not a crisis counselor, and you deserve real human support right away.\n\n" +
        "**Please reach out immediately:**\n" +
        "- **Nigeria:** Call **112** (Emergency) or SURPIN Suicide Research & Prevention Initiative: **+234 908 021 7555** / **+234 903 440 0009**, or Mentally Aware Nigeria (MANI): **+234 809 111 6264**\n" +
        "- **United States / Canada:** Call or text **988** (Suicide & Crisis Lifeline)\n" +
        "- **United Kingdom:** Call **111** (NHS Mental Health) or text **SHOUT** to **85258**\n" +
        "- **Worldwide:** Find free, confidential support near you at **https://findahelpline.com**\n\n" +
        "If you can, please also contact a trusted friend, family member, or go to the nearest hospital right now. You do not have to carry this alone.",
    };
  }

  if (ABUSE_VIOLENCE_PATTERNS.some((p) => p.test(text))) {
    return {
      triggered: true,
      requiresImmediateIntercept: true,
      category: "abuse_violence",
      interceptMessage:
        "Your physical safety comes first. No one deserves to be threatened, hurt, or controlled, and you should not try to navigate immediate danger alone.\n\n" +
        "**Immediate safety & confidential help:**\n" +
        "- **If you are in immediate physical danger:** Call local emergency services (**112** in Nigeria/EU, **911** in US/Canada, **999** in UK) or move to a safe location with someone you trust.\n" +
        "- **Nigeria:** Lagos Domestic & Sexual Violence Agency (DSVA) toll-free **08000 333 333**, or Mirabel Centre **+234 815 577 0000**\n" +
        "- **US:** National Domestic Violence Hotline **1-800-799-7233** (or text START to 88788)\n" +
        "- **UK:** Refuge National Domestic Abuse Helpline **0808 2000 247**\n" +
        "- **Worldwide:** **https://findahelpline.com**\n\n" +
        "When you are in a safe place, I can help you organize practical next steps or questions to prepare for a professional advocate.",
    };
  }

  if (MEDICAL_EMERGENCY_PATTERNS.some((p) => p.test(text))) {
    return {
      triggered: true,
      requiresImmediateIntercept: true,
      category: "medical_emergency",
      interceptMessage:
        "What you are describing could be a medical emergency. Please stop using this app and seek immediate medical care—call your local emergency number (**112**, **911**, or **999**) or go to the nearest emergency hospital immediately. I cannot assess or treat medical emergencies.",
    };
  }

  if (MEDICAL_BOUNDARY_PATTERNS.some((p) => p.test(text))) {
    return {
      triggered: true,
      requiresImmediateIntercept: false,
      category: "medical_boundary",
      boundarySystemInstruction:
        "SAFETY BOUNDARY (MEDICAL): You are NOT a doctor or licensed clinician. Never diagnose conditions, recommend starting/stopping medication, or prescribe dosages. Briefly clarify this boundary, offer practical help organizing symptoms/questions for a qualified doctor, and keep guidance strictly educational and supportive.",
    };
  }

  if (LEGAL_BOUNDARY_PATTERNS.some((p) => p.test(text))) {
    return {
      triggered: true,
      requiresImmediateIntercept: false,
      category: "legal_boundary",
      boundarySystemInstruction:
        "SAFETY BOUNDARY (LEGAL): You are NOT a lawyer and cannot give formal legal advice or draft binding legal filings. Briefly clarify this boundary, help the user clarify their facts, document a timeline, identify risks, and prepare specific questions for a qualified legal professional in their jurisdiction.",
    };
  }

  if (FINANCIAL_BOUNDARY_PATTERNS.some((p) => p.test(text))) {
    return {
      triggered: true,
      requiresImmediateIntercept: false,
      category: "financial_boundary",
      boundarySystemInstruction:
        "SAFETY BOUNDARY (FINANCIAL): You are NOT a licensed financial adviser. Never promise investment returns, pick specific speculative trades, or endorse risky schemes. Give honest financial-literacy reasoning, highlight downside risk and red flags clearly, and help the user make a disciplined budget or risk-bounded decision.",
    };
  }

  return { triggered: false, requiresImmediateIntercept: false, category: "none" };
}

export function detectPromptInjection(input: string): boolean {
  if (!input) return false;
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Sanitizes untrusted user-controlled context (memories, goals, history) BEFORE
 * interpolating into system prompts so malicious strings cannot hijack instructions.
 */
export function sanitizeContextText(value: string, maxLen = 280): string {
  if (!value || typeof value !== "string") return "";
  let clean = value
    .replace(/[\r\n]+/g, " ")
    .replace(/<\s*\/?\s*(system|assistant|user|instruction)[^>]*>/gi, "")
    .replace(/\[SYSTEM[^\]]*\]/gi, "")
    .trim();

  if (detectPromptInjection(clean)) {
    clean = "[redacted unsafe instruction text]";
  }

  if (clean.length > maxLen) {
    clean = `${clean.slice(0, maxLen - 1)}…`;
  }
  return clean;
}
