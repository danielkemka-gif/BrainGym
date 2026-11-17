/**
 * AKUCHE CONTEXTUAL INTELLIGENCE, SHARED RATE LIMITING & PROMPT ASSEMBLY ENGINE
 *
 * Combines:
 * 1. Short-Term Memory (Current message + recent multi-turn conversation history)
 * 2. Long-Term Memory (User goals, confirmed facts, AI-interpreted patterns, decisions, commitments)
 * 3. User Profile (Occupation, age, onboarding goals, challenges)
 * 4. Five-Stage Reasoning Calibration (Stage 1 Understand -> Stage 5 Develop)
 * 5. Shared Server-Side Rate Limiting for Vercel Serverless (DB-backed per authenticated user ID)
 */

import {
  AKUCHE_MASTER_SYSTEM_PROMPT,
  AkucheInteractionMode,
  AkucheQueryClassification,
  classifyUserQuery,
  getModeInstructionExtension,
} from "./master-intelligence";
import {
  AkucheCommitment,
  AkucheMemoryItem,
  retrieveRelevantMemories,
} from "./memory-engine";

export interface ServerUserProfile {
  name?: string | null;
  age?: number | null;
  occupation?: string | null;
  goals?: string[];
  challenges?: string[];
}

export interface ClientSuppliedContext {
  memoryEnabled?: boolean;
  memories?: AkucheMemoryItem[];
  activeGoals?: { title: string; currentSituation?: string; nextAction?: string }[];
  pendingCommitments?: Pick<AkucheCommitment, "title" | "deadline" | "status">[];
  recentDecisions?: {
    title: string;
    chosenOption: string;
    rationale?: string;
    expectedOutcome?: string;
    status?: string;
  }[];
  profileOverride?: {
    name?: string;
    age?: number;
    occupation?: string;
    primaryFocus?: string;
  };
}

export interface AssembledPromptPackage {
  systemPrompt: string;
  trimmedHistory: { role: "user" | "assistant"; content: string }[];
  classification: AkucheQueryClassification;
}

// ─── IN-MEMORY + SHARED SUPABASE SERVER-SIDE RATE LIMITER (PHASE 1) ───

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Fast synchronous rate limit check (used as Layer 1 and in offline/unit tests).
 */
export function checkAiRateLimit(
  key: string,
  maxRequests = 40,
  windowMs = 60 * 60 * 1000 // 1 hour default
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Shared serverless rate limiter suitable for Vercel deployment (Phase 1, Req 3 & 4).
 * Enforces rate limits per authenticated Supabase `user.id` across serverless instances
 * by querying recent usage in Supabase (`ai_feedback` / `decision_lab_entries`),
 * while keeping the in-memory bucket as a fast Layer-1 guard.
 */
export async function checkSharedServerRateLimit(params: {
  supabase: any;
  userId: string;
  endpoint: "ask" | "coach" | "decision-lab";
  maxRequests?: number;
  windowMs?: number;
}): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds: number }> {
  const {
    supabase,
    userId,
    endpoint,
    maxRequests = 40,
    windowMs = 60 * 60 * 1000,
  } = params;

  // Layer 1: In-memory instance check keyed strictly by authenticated userId
  const localCheck = checkAiRateLimit(`${endpoint}:${userId}`, maxRequests, windowMs);
  if (!localCheck.allowed) {
    return localCheck;
  }

  // Layer 2: Shared database count across Vercel serverless instances
  if (!supabase || !userId) {
    return localCheck;
  }

  try {
    const windowStartIso = new Date(Date.now() - windowMs).toISOString();

    if (endpoint === "decision-lab") {
      const { count, error } = await supabase
        .from("decision_lab_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", windowStartIso);

      if (!error && typeof count === "number" && count >= maxRequests) {
        return { allowed: false, remaining: 0, retryAfterSeconds: 300 };
      }
      if (!error && typeof count === "number") {
        return {
          allowed: true,
          remaining: Math.max(0, maxRequests - count - 1),
          retryAfterSeconds: 0,
        };
      }
    } else {
      const feedbackType =
        endpoint === "ask" ? "ask_akuche_message" : "coach_message";
      // Each exchange logs 2 rows (user + assistant), so user turns = count / 2
      const { count, error } = await supabase
        .from("ai_feedback")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("feedback_type", feedbackType)
        .gte("created_at", windowStartIso);

      if (!error && typeof count === "number") {
        const userRequestsCount = Math.floor(count / 2);
        if (userRequestsCount >= maxRequests) {
          return { allowed: false, remaining: 0, retryAfterSeconds: 300 };
        }
        return {
          allowed: true,
          remaining: Math.max(0, maxRequests - userRequestsCount - 1),
          retryAfterSeconds: 0,
        };
      }
    }
  } catch {
    // If DB count query fails transiently, fall back to Layer 1 result
  }

  return localCheck;
}

// ─── INTELLIGENT CONTEXT SELECTION & FIVE-STAGE ASSEMBLY ───

export function assembleContextualIntelligence(params: {
  message: string;
  history?: { role: string; content: string }[];
  mode?: AkucheInteractionMode;
  serverProfile?: ServerUserProfile | null;
  clientContext?: ClientSuppliedContext | null;
}): AssembledPromptPackage {
  const {
    message,
    history = [],
    mode = "coaching_chat",
    serverProfile,
    clientContext,
  } = params;

  // 1. Short-Term Memory: Keep up to 8 recent turns, truncating overly long individual messages
  const trimmedHistory: { role: "user" | "assistant"; content: string }[] = Array.isArray(history)
    ? history
        .slice(-8)
        .filter((h) => h && typeof h.content === "string" && h.content.trim().length > 0)
        .map((h) => ({
          role: (h.role === "assistant" || h.role === "coach" ? "assistant" : "user") as
            | "user"
            | "assistant",
          content: h.content.length > 1800 ? h.content.slice(0, 1800) + "..." : h.content,
        }))
    : [];

  // 2. Classify Query & Determine 5-Stage Reasoning Maturity using History
  const classification = classifyUserQuery(message, mode, trimmedHistory);

  // 3. Build Base System Prompt + Active Mode Extension
  let systemPrompt = AKUCHE_MASTER_SYSTEM_PROMPT + getModeInstructionExtension(mode);

  // 4. Inject User Profile & Long-Term Memory ONLY when relevant
  const memoryEnabled = clientContext?.memoryEnabled !== false;
  if (memoryEnabled && classification.intent !== "simple_factual") {
    const profileSections: string[] = [];

    const mergedName = serverProfile?.name || clientContext?.profileOverride?.name;
    const mergedAge = serverProfile?.age || clientContext?.profileOverride?.age;
    const mergedOccupation =
      serverProfile?.occupation || clientContext?.profileOverride?.occupation;
    const mergedGoals = serverProfile?.goals || [];
    const mergedChallenges = serverProfile?.challenges || [];

    const profileLines: string[] = [];
    if (mergedName) profileLines.push(`- Name: ${mergedName}`);
    if (mergedAge) profileLines.push(`- Age: ${mergedAge}`);
    if (mergedOccupation) profileLines.push(`- Occupation / Role: ${mergedOccupation}`);
    if (mergedGoals.length > 0) {
      profileLines.push(`- Stated Onboarding Goals: ${mergedGoals.join(", ")}`);
    }
    if (mergedChallenges.length > 0) {
      profileLines.push(`- Key Challenges: ${mergedChallenges.join(", ")}`);
    }

    if (profileLines.length > 0) {
      profileSections.push(`### CONFIRMED USER PROFILE\n${profileLines.join("\n")}`);
    }

    // Retrieve only relevant memories from clientContext
    if (clientContext?.memories && clientContext.memories.length > 0) {
      const relevantMems = retrieveRelevantMemories(message, clientContext.memories, 6);
      const confirmedMems = relevantMems.filter(
        (m) => m.verificationStatus !== "ai_interpreted"
      );
      const interpretedMems = relevantMems.filter(
        (m) => m.verificationStatus === "ai_interpreted"
      );

      if (confirmedMems.length > 0) {
        profileSections.push(
          `### CONFIRMED CONTEXT MEMORIES (Verified by User)\n` +
            confirmedMems
              .map((m) => `- [${m.category.toUpperCase()}] ${m.title}: ${m.content}`)
              .join("\n")
        );
      }

      if (interpretedMems.length > 0) {
        profileSections.push(
          `### AI-INTERPRETED PATTERNS (Working Hypotheses — Not Absolute Facts)\n` +
            interpretedMems
              .map((m) => `- [${m.category.toUpperCase()}] ${m.title}: ${m.content}`)
              .join("\n")
        );
      }
    }

    if (clientContext?.activeGoals && clientContext.activeGoals.length > 0) {
      profileSections.push(
        `### ACTIVE GOALS\n` +
          clientContext.activeGoals
            .slice(0, 3)
            .map(
              (g) =>
                `- ${g.title}${g.nextAction ? ` (Next step: ${g.nextAction})` : ""}`
            )
            .join("\n")
      );
    }

    if (clientContext?.pendingCommitments && clientContext.pendingCommitments.length > 0) {
      profileSections.push(
        `### PENDING COMMITMENTS\n` +
          clientContext.pendingCommitments
            .slice(0, 3)
            .map((c) => `- ${c.title}${c.deadline ? ` (${c.deadline})` : ""}`)
            .join("\n")
      );
    }

    if (clientContext?.recentDecisions && clientContext.recentDecisions.length > 0) {
      profileSections.push(
        `### PREVIOUS DECISIONS IN DECISION LAB\n` +
          clientContext.recentDecisions
            .slice(0, 3)
            .map(
              (d) =>
                `- ${d.title}: Chose "${d.chosenOption}"${
                  d.rationale ? ` (Rationale: ${d.rationale})` : ""
                } [${d.status || "active"}]`
            )
            .join("\n")
      );
    }

    if (profileSections.length > 0) {
      systemPrompt +=
        `\n\n## CONTEXTUAL INTELLIGENCE LAYER (CURRENT SUBJECT: ${classification.subjectSummary})\n` +
        profileSections.join("\n\n") +
        `\n\nContext Usage Rules:\n1. Use this context only when it improves the relevance and personalization of your coaching.\n2. Do not repeat profile facts back to the user unprompted.\n3. Never invent memories that are not listed above.`;
    }
  }

  // 5. Output Schema Instruction calibrated to 5-Stage Reasoning Maturity
  systemPrompt += buildOutputFormatInstruction(classification, mode);

  return {
    systemPrompt,
    trimmedHistory,
    classification,
  };
}

function buildOutputFormatInstruction(
  classification: AkucheQueryClassification,
  mode: AkucheInteractionMode
): string {
  const stageGuidance = getStageSpecificPromptInstruction(classification);

  return `\n\n## CONTEXTUAL INTELLIGENCE CALIBRATION & JSON OUTPUT CONTRACT
Detected Domain Intent: **${classification.intent}**
Active Coaching Focus: **${classification.stageLabel}** (\`${classification.reasoningStage}\`)
Is Genuine Option-Comparison Decision: **${classification.isGenuineDecisionChoice ? "YES" : "NO — DO NOT FORCE OPTION A / OPTION B"}**
Target Cognitive Skills: **${classification.cognitiveFocus.primarySkill}** & **${classification.cognitiveFocus.secondarySkill}**
Coaching Objective: ${classification.cognitiveFocus.coachingObjective}
Emotional Signal: **${classification.emotionalSignal}**
Active System Mode: **${mode}**

${stageGuidance}

Always return a valid JSON object matching this schema:
{
  "text": "Your natural, conversational, domain-intelligent coaching response in clean Markdown. Sound like a thoughtful, experienced human thinking partner. Avoid robotic template headings, avoid repeating the user's question verbatim, and obey the instructions above.",
  "cards": ${
    classification.reasoningStage === "stage_3_challenge"
      ? `{
    "type": "guided_thinking",
    "whatWeKnow": ["Verified facts established so far"],
    "whatWeDontKnow": ["Key uncertainties still open"],
    "assumptions": ["Specific assumptions in the user's thinking that need testing"],
    "risks": ["Realistic downside risks if those assumptions are wrong"],
    "nextQuestion": "The single most important question to test these assumptions"
  }`
      : classification.reasoningStage === "stage_4_reason" &&
        classification.isGenuineDecisionChoice
      ? `{
    "type": "decision_matrix",
    "whatWeKnow": ["Verified facts and constraints established"],
    "whatWeDontKnow": ["Remaining uncertainties that could shift the decision"],
    "assumptions": ["Key premises underlying the options"],
    "risks": ["Short-term and long-term risks"],
    "options": ["Realistic Option 1 with trade-offs", "Realistic Option 2 with trade-offs"],
    "nextQuestion": "Question to help the user weigh which trade-off they prefer"
  }`
      : classification.reasoningStage === "stage_5_develop"
      ? `{
    "type": "action_mission",
    "whatWeKnow": ["Confirmed context supporting this strategy"],
    "assumptions": ["Assumptions to monitor during execution"],
    "risks": ["Risks to mitigate"],
    "options": ["Core strategic path and why it fits best"],
    "mission": {
      "title": "Specific, realistic next step grounded in the user's situation",
      "deadline": "Realistic timeframe based on user's context (no arbitrary clichés)",
      "steps": ["Concrete step 1", "Concrete step 2"],
      "whyItMatters": "How this step solves the core bottleneck or moves the situation forward",
      "doneWhen": "Measurable indicator of completion"
    }
  }`
      : "null"
  },
  "claritySnapshot": ${
    classification.shouldIncludeClaritySnapshot
      ? `{
    "subject": "${classification.subjectSummary.replace(/"/g, "'")}",
    "currentlyDealingWith": [
      { "text": "Brief description of what the user is dealing with", "source": "confirmed" }
    ],
    "majorChallenges": [
      { "text": "Primary challenge or question being addressed", "source": "confirmed" }
    ],
    "areasRequiringAttention": [
      { "text": "Key factor or assumption to verify", "source": "ai_interpreted" }
    ],
    "possibleOpportunities": [
      { "text": "Practical angle worth pursuing", "source": "ai_interpreted" }
    ],
    "recommendedNextActions": [
      "Specific, grounded next step based on the current stage of the conversation"
    ]
  }`
      : "null"
  },
  "thinkingMirrorObservation": ${
    classification.reasoningStage === "stage_3_challenge" ||
    classification.reasoningStage === "stage_4_reason" ||
    classification.reasoningStage === "stage_5_develop"
      ? `{
    "patternName": "Short name of observed thinking habit, strength, or blind spot",
    "type": "${classification.emotionalSignal === "overconfidence" ? "blind_spot" : "strength"}",
    "observation": "1-sentence observation about how the user is reasoning through this situation",
    "selfAwarenessPrompt": "1-sentence reflection question to build independent thinking"
  }`
      : "null"
  }
}`;
}

function getStageSpecificPromptInstruction(
  classification: AkucheQueryClassification
): string {
  switch (classification.reasoningStage) {
    case "stage_1_understand":
      return `### INITIAL PERSPECTIVE & DIAGNOSTIC INSTRUCTIONS (DIAGNOSE BEFORE PRESCRIBING):
1. Do NOT activate Decision Analysis Mode, do NOT invent Option A and Option B, do NOT assume financial difficulties the user hasn't mentioned, and do NOT prescribe arbitrary 24-hour or 90-day experiments.
2. Recognise the specific domain (${classification.intent}) and offer a natural, insightful initial perspective showing you understand how this problem works in the real world.
3. Identify the most plausible reasons/causes behind the situation as possibilities (clearly distinguishing facts from assumptions).
4. Ask ONLY the single most important diagnostic question needed to pinpoint which cause is happening so you can build a practical strategy in the next turn.`;

    case "stage_2_investigate":
      return `### ROOT-CAUSE DIAGNOSIS & PRACTICAL STRATEGY INSTRUCTIONS:
1. The user has just answered your initial diagnostic question. Build directly on their exact answer—never repeat your previous question or restart the analysis.
2. Diagnose what their answer reveals about the underlying root cause (e.g., in corporate sales/proposals: pitching before qualifying budget/urgency, speaking to gatekeepers instead of budget owners, or framing training as an activity rather than a business ROI solution).
3. Provide a practical, domain-intelligent strategy (2–3 concrete, realistic recommendations) directly addressing that root cause, explaining WHY each step matters and HOW to implement it.
4. Do NOT manufacture artificial Option A / Option B matrices unless the user is explicitly comparing two choices.
5. Close with one focused follow-up question to help them apply the strategy to their immediate next conversation or priority.`;

    case "stage_3_challenge":
      return `### CHALLENGING ASSUMPTIONS & BLIND SPOTS INSTRUCTIONS:
1. Respectfully highlight any unverified assumptions, confirmation bias, emotional reasoning, or blind spots in the user's current framing.
2. Present a realistic alternative perspective (such as how the buyer, manager, or partner on the other side views the situation) and explain the potential consequences if the assumption is wrong.
3. Ask one focused question that helps the user test their premise against real evidence.`;

    case "stage_4_reason":
      return classification.isGenuineDecisionChoice
        ? `### DECISION & TRADE-OFF ANALYSIS INSTRUCTIONS:
1. Because the user is genuinely comparing alternatives or making a significant choice, evaluate the realistic options clearly.
2. Compare concrete advantages, disadvantages, short-term vs. long-term consequences, and risks for each realistic path—without inventing fake financial numbers or arbitrary deadlines.
3. Explain clearly why one path fits their stated circumstances better and ask which trade-off they prefer to accept.`
        : `### STRATEGIC REASONING & REFINEMENT INSTRUCTIONS:
1. Deepen the practical strategy based on what the user just shared—do NOT force an artificial Option A / Option B comparison when they are solving a problem rather than choosing between alternatives.
2. Explain the commercial, interpersonal, or professional reasoning behind the recommended approach, including expected outcomes and realistic limitations.
3. Ask a focused question to help them refine execution.`;

    case "stage_5_develop":
      return `### PRACTICAL EXECUTION & CONTINUITY INSTRUCTIONS:
1. Synthesize the agreed strategy into clear, realistic, proportionate next steps tailored specifically to the user's situation.
2. Explain WHY each step matters and HOW to execute it cleanly—without arbitrary clichés ("15-minute action", "before 6 PM", or invented financial math).
3. Suggest a practical review point so the user can evaluate what worked and adjust.`;

    case "direct_response":
    default:
      return `### DIRECT RESPONSE INSTRUCTIONS:
1. Answer the user's straightforward question or deliverable request directly, clearly, and naturally first.
2. Connect the answer or deliverable to practical domain intelligence so the user understands why it works and how to use it effectively.`;
  }
}
