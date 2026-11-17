/**
 * AKUCHE FIVE-STAGE REASONING ENGINE & PHASE 1-7 STABILISATION VERIFICATION SUITE
 *
 * Verifies:
 *  1. 20 Reasoning Quality Scenarios across all required domains (Directive A, Section 9)
 *  2. Multi-Turn 5-Stage Socratic Progression (UNDERSTAND -> INVESTIGATE -> CHALLENGE -> REASON -> DEVELOP)
 *  3. Absence of premature action plans, manufactured options, or arbitrary cliches ("15-minute", "before 6 PM", "24-hour")
 *  4. Direct factual & deliverable handling without unnecessary Socratic interrogation
 *  5. Phase 1-6 Stabilisation Checks (Decision Store Unification, Memory Confirmation & Supabase Sync, Fallback Honesty, Shared Rate Limiting)
 */

import {
  classifyUserQuery,
  AkucheInteractionMode,
} from "../lib/akuche/master-intelligence";
import {
  assembleContextualIntelligence,
  checkSharedServerRateLimit,
} from "../lib/akuche/context-engine";
import { generateContextualIntelligentResponse } from "../lib/akuche/intelligent-responder";
import {
  getMemoryItems,
  saveMemoryItem,
  confirmMemoryItem,
  saveClaritySnapshot,
  recordThinkingMirrorObservation,
  saveConversationThread,
  syncAkucheIntelligenceWithSupabase,
} from "../lib/akuche/memory-engine";
import {
  getDecisionRecords,
  saveDecisionRecord,
} from "../lib/akuche/decisions-engine";

// Minimal in-memory localStorage polyfill for Node verification
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

(globalThis as any).window = globalThis;
(globalThis as any).localStorage = new MemoryStorage();

interface ReasoningScenario {
  id: number;
  domain: string;
  prompt: string;
  mode?: AkucheInteractionMode;
  expectedTurn1Stages: string[];
  expectNoCardsOnTurn1: boolean;
}

const TWENTY_REASONING_SCENARIOS: ReasoningScenario[] = [
  {
    id: 1,
    domain: "1. Business challenges",
    prompt: "Our B2B agency pipeline has stalled for the last two months and we are not booking discovery calls.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 2,
    domain: "2. Poor sales performance",
    prompt: "I have sent proposals to 20 companies and none of them have responded.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 3,
    domain: "3. Career decisions",
    prompt: "I am considering leaving my job to start a business, even though I don't have savings yet.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 4,
    domain: "4. Relationship disagreements",
    prompt: "My husband and I keep arguing about money.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 5,
    domain: "5. Financial decisions",
    prompt: "Should I use my $15,000 savings to pay off credit card debt or invest in index funds?",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 6,
    domain: "6. Personal productivity & procrastination",
    prompt: "I keep procrastinating on my most important deep-work tasks until late at night.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 7,
    domain: "7. Business expansion",
    prompt: "My business revenue is growing, but I still don't have any profit left at the end of the month. Should I open a second branch?",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 8,
    domain: "8. Hiring decisions",
    prompt: "Should I hire a full-time operations manager now or keep delegating to part-time freelancers?",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 9,
    domain: "9. Personal goals",
    prompt: "I set ambitious 90-day personal goals every quarter but lose momentum after week two.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 10,
    domain: "10. Academic & learning challenges",
    prompt: "I am studying for my professional certification exam while working full-time and keep failing practice tests.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 11,
    domain: "11. Workplace conflicts",
    prompt: "My co-founder and I disagree on whether to focus our engineering team on enterprise clients or self-serve users.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 12,
    domain: "12. Failed business proposals",
    prompt: "Three enterprise prospects went silent right after we sent our annual pricing proposal.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 13,
    domain: "13. Investment considerations",
    prompt: "A friend promised me a guaranteed 10% monthly return in a forex trading pool. Should I invest my savings?",
    expectedTurn1Stages: ["stage_1_understand", "stage_3_challenge"],
    expectNoCardsOnTurn1: false, // stage_3_challenge may surface assumptions
  },
  {
    id: 14,
    domain: "14. Strategic planning",
    prompt: "We have three competing priorities this quarter: fixing customer churn, launching a new tier, and rebranding.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 15,
    domain: "15. Family disagreements",
    prompt: "My parents expect me to financially support extended relatives every month at the expense of my own emergency fund.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 16,
    domain: "16. Uncertainty about the future",
    prompt: "My industry is changing rapidly and I am uncertain whether my current role will still exist in three years.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 17,
    domain: "17. Conflicting information",
    prompt: "My accountant says we must cut marketing spend immediately, while my sales lead says we need to double ad spend to survive.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 18,
    domain: "18. Emotionally charged decisions",
    prompt: "I am furious at my manager after a terrible performance review today and I want to send my resignation email right now.",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
  {
    id: 19,
    domain: "19. Overconfidence or faulty assumptions",
    prompt: "I am 100% certain our new product will go viral on day one with zero marketing budget because everyone needs it and nothing can go wrong.",
    expectedTurn1Stages: ["stage_3_challenge"],
    expectNoCardsOnTurn1: false,
  },
  {
    id: 20,
    domain: "20. Situations with insufficient information",
    prompt: "Should I accept the offer?",
    expectedTurn1Stages: ["stage_1_understand"],
    expectNoCardsOnTurn1: true,
  },
];

const FORBIDDEN_CLICHES = [
  "before 6 pm",
  "15-minute",
  "within 15 minutes",
  "24-hour experiment",
  "today's action assignment",
];

async function runVerification() {
  console.log("================================================================================");
  console.log("AKUCHE REASONING ENGINE & STABILISATION VERIFICATION SUITE");
  console.log("================================================================================\n");

  let passedCount = 0;
  let failedCount = 0;

  const assertCheck = (name: string, condition: boolean, details?: string) => {
    if (condition) {
      passedCount++;
      console.log(`  [PASS] ${name}`);
    } else {
      failedCount++;
      console.error(`  [FAIL] ${name}${details ? ` -> ${details}` : ""}`);
    }
  };

  // ============================================================================
  // PART 1: 20-SCENARIO REASONING QUALITY TEST SUITE (TURN 1 DISCIPLINE)
  // ============================================================================
  console.log("PART 1: 20-SCENARIO SOCRATIC REASONING QUALITY SUITE (TURN 1)");
  console.log("--------------------------------------------------------------------------------");

  for (const scenario of TWENTY_REASONING_SCENARIOS) {
    const mode = scenario.mode || "coaching_chat";
    const classification = classifyUserQuery(scenario.prompt, mode, []);
    const response = generateContextualIntelligentResponse({
      message: scenario.prompt,
      mode,
      serverProfile: { name: "Daniel", occupation: "Founder" },
      history: [],
    });

    const stageMatches = scenario.expectedTurn1Stages.includes(classification.reasoningStage);
    const hasClarifyingQuestion = response.text.includes("?");
    const noPrematureCards = scenario.expectNoCardsOnTurn1 ? response.cards === null : true;
    const textLower = response.text.toLowerCase();
    const noForbiddenCliches = FORBIDDEN_CLICHES.every((c) => !textLower.includes(c));
    const honestFallbackTag = response.isFallback === true;

    const scenarioPassed =
      stageMatches &&
      hasClarifyingQuestion &&
      noPrematureCards &&
      noForbiddenCliches &&
      honestFallbackTag;

    assertCheck(
      `Scenario #${scenario.id.toString().padStart(2, "0")} (${scenario.domain}) -> Stage: ${classification.reasoningStage}, Skill: ${classification.cognitiveFocus.primarySkill}`,
      scenarioPassed,
      `stageMatches=${stageMatches}, hasQuestion=${hasClarifyingQuestion}, noPrematureCards=${noPrematureCards}, noCliches=${noForbiddenCliches}, isFallback=${honestFallbackTag}`
    );
  }

  // ============================================================================
  // PART 2: MULTI-TURN 5-STAGE PROGRESSION VERIFICATION
  // ============================================================================
  console.log("\nPART 2: MULTI-TURN 5-STAGE PROGRESSION (UNDERSTAND -> INVESTIGATE -> CHALLENGE -> REASON -> DEVELOP)");
  console.log("--------------------------------------------------------------------------------");

  const turn1Prompt = "I have sent proposals to 20 companies and none of them have responded.";
  const turn1Res = generateContextualIntelligentResponse({
    message: turn1Prompt,
    mode: "coaching_chat",
    history: [],
  });
  assertCheck(
    "Turn 1 enters Stage 1 (Understand), withholds action cards, and asks a focused clarifying question",
    turn1Res.classification.reasoningStage === "stage_1_understand" &&
      turn1Res.cards === null &&
      turn1Res.text.includes("?")
  );

  const historyAfterTurn1 = [
    { role: "user", content: turn1Prompt },
    { role: "assistant", content: turn1Res.text },
  ];
  const turn2Prompt = "They were cold outreach emails where I attached our PDF proposal directly without speaking to them first.";
  const turn2Res = generateContextualIntelligentResponse({
    message: turn2Prompt,
    mode: "coaching_chat",
    history: historyAfterTurn1,
  });
  assertCheck(
    "Turn 2 progresses to Stage 2 (Investigate), builds on the user's answer without repeating Turn 1, and withholds premature action cards",
    turn2Res.classification.reasoningStage === "stage_2_investigate" &&
      turn2Res.text !== turn1Res.text &&
      turn2Res.cards === null &&
      turn2Res.text.toLowerCase().includes("cold outreach")
  );

  const historyAfterTurn2 = [
    ...historyAfterTurn1,
    { role: "user", content: turn2Prompt },
    { role: "assistant", content: turn2Res.text },
  ];
  const turn3Prompt = "I assumed busy executives prefer reading a full pricing PDF upfront rather than booking a 15-minute discovery call.";
  const turn3Res = generateContextualIntelligentResponse({
    message: turn3Prompt,
    mode: "coaching_chat",
    history: historyAfterTurn2,
  });
  assertCheck(
    "Turn 3 progresses to Stage 3/4 (Challenge / Reason) and surfaces assumptions or trade-offs without repeating Turn 2",
    (turn3Res.classification.reasoningStage === "stage_3_challenge" ||
      turn3Res.classification.reasoningStage === "stage_4_reason") &&
      turn3Res.text !== turn2Res.text &&
      turn3Res.cards !== null
  );

  const historyAfterTurn3 = [
    ...historyAfterTurn2,
    { role: "user", content: turn3Prompt },
    { role: "assistant", content: turn3Res.text },
  ];
  const turn4Prompt = "That makes sense. Let's develop a concrete step-by-step plan for the next two weeks.";
  const turn4Res = generateContextualIntelligentResponse({
    message: turn4Prompt,
    mode: "coaching_chat",
    history: historyAfterTurn3,
  });
  assertCheck(
    "Turn 4 progresses to Stage 5 (Develop) and produces a reasoned execution plan with review checkpoints",
    turn4Res.classification.reasoningStage === "stage_5_develop" &&
      turn4Res.cards?.mission !== null &&
      turn4Res.cards?.mission !== undefined &&
      FORBIDDEN_CLICHES.every((c) => !turn4Res.text.toLowerCase().includes(c))
  );

  // ============================================================================
  // PART 3: DIRECT FACTUAL & DELIVERABLE HANDLING (NO UNNECESSARY INTERROGATION)
  // ============================================================================
  console.log("\nPART 3: DIRECT FACTUAL & DELIVERABLE RESPONSES");
  console.log("--------------------------------------------------------------------------------");

  const factualRes = generateContextualIntelligentResponse({
    message: "What is sunk cost fallacy?",
    mode: "coaching_chat",
    history: [],
  });
  assertCheck(
    "Direct factual question ('What is sunk cost fallacy?') uses direct_response and answers directly",
    factualRes.classification.reasoningStage === "direct_response" &&
      factualRes.text.toLowerCase().includes("sunk cost")
  );

  const deliverableRes = generateContextualIntelligentResponse({
    message: "Write a professional business proposal for a corporate catering service pitching to a tech company.",
    mode: "coaching_chat",
    history: [],
  });
  assertCheck(
    "Deliverable request ('Write a professional business proposal...') generates the requested document directly",
    deliverableRes.classification.reasoningStage === "direct_response" &&
      deliverableRes.text.includes("Executive Summary")
  );

  // ============================================================================
  // PART 4: STABILISATION PHASES 1-6 VERIFICATION
  // ============================================================================
  console.log("\nPART 4: STABILISATION PHASES 1-6 VERIFICATION");
  console.log("--------------------------------------------------------------------------------");

  // Phase 3: Decision Store Unification
  (globalThis as any).localStorage.clear();
  // Seed a legacy record in "akuche_decisions_v2"
  (globalThis as any).localStorage.setItem(
    "akuche_decisions_v2",
    JSON.stringify([
      {
        id: "legacy_dec_1",
        title: "Legacy Pricing Restructuring",
        context: "Testing legacy decision reconciliation",
        optionsConsidered: ["Keep old pricing", "Raise retainer by 20%"],
        chosenOption: "Raise retainer by 20%",
        expectedOutcome: "Higher gross margin",
        reviewDate: "2026-12-01",
        status: "pending_review",
        createdAt: "2026-10-01T00:00:00.000Z",
      },
    ])
  );
  // Save a new Decision Lab record via authoritative decisions-engine.ts
  saveDecisionRecord({
    title: "Enterprise Tier Expansion",
    category: "Business",
    optionA: "Launch Annual Enterprise Tier",
    optionB: "Keep Self-Serve Monthly Only",
    advantagesA: ["Upfront cash flow", "Higher LTV"],
    advantagesB: ["Faster onboarding"],
    risksA: ["Longer sales cycle"],
    risksB: ["Lower ARPU"],
    worstCaseA: "Slow initial adoption",
    worstCaseB: "Competitors capture enterprise accounts",
    isReversible: true,
    experiment24h: "Interview 3 existing accounts on annual billing interest",
    finalChoice: "Launch Annual Enterprise Tier",
    rationale: "Validated by 3 existing clients",
    actionSteps: ["Prepare enterprise SLA", "Present to 3 pilot clients"],
  });

  const unifiedDecisions = getDecisionRecords();
  assertCheck(
    "Phase 3: getDecisionRecords() unifies authoritative Decision Lab store and legacy 'akuche_decisions_v2' without data loss",
    unifiedDecisions.length === 2 &&
      unifiedDecisions.some((d) => d.title === "Enterprise Tier Expansion") &&
      unifiedDecisions.some((d) => d.title === "Legacy Pricing Restructuring")
  );

  // Phase 4 & 5: Memory Deduplication, Confirmation, and Supabase Sync
  (globalThis as any).localStorage.clear();
  const baselineCount = getMemoryItems().length;
  const mem1 = saveMemoryItem({
    category: "goal",
    title: "Reach $25k MRR",
    content: "Expand B2B consulting retainer base to $25k MRR by Q4.",
    confidence: 0.72,
    verificationStatus: "ai_interpreted",
  });
  // Attempt duplicate save with different case/whitespace
  saveMemoryItem({
    category: "goal",
    title: "  reach $25k mrr  ",
    content: "Expand B2B consulting retainer base to $25k MRR by Q4.",
    confidence: 0.85,
    verificationStatus: "ai_interpreted",
  });
  const afterDedup = getMemoryItems();
  assertCheck(
    "Phase 4: saveMemoryItem() deduplicates identical category + title entries",
    afterDedup.length === baselineCount + 1 && afterDedup[0].confidence === 0.85
  );

  confirmMemoryItem(mem1.id);
  const confirmedItem = getMemoryItems().find((m) => m.id === mem1.id);
  assertCheck(
    "Phase 5: confirmMemoryItem() upgrades 'ai_interpreted' interpretation to 'confirmed' with confidence 1.0",
    confirmedItem !== undefined &&
      confirmedItem.verificationStatus === "confirmed" &&
      confirmedItem.confidence === 1.0
  );

  // Test syncAkucheIntelligenceWithSupabase with a mock authenticated Supabase client
  saveClaritySnapshot({
    subject: "B2B Outbound Pipeline",
    currentlyDealingWith: [
      { text: "Evaluating B2B outbound pipeline conversion.", source: "confirmed" },
    ],
    majorChallenges: [
      { text: "Low cold email response rate", source: "confirmed" },
    ],
    areasRequiringAttention: [
      { text: "Discovery call qualification", source: "ai_interpreted" },
    ],
    possibleOpportunities: [
      { text: "Warm referral outreach", source: "ai_interpreted" },
    ],
    recommendedNextActions: ["Interview 5 recent prospects"],
  });
  recordThinkingMirrorObservation({
    patternName: "Solution Jumping Before Diagnosis",
    type: "blind_spot",
    observation: "Sending full proposals before discovery conversations.",
    selfAwarenessPrompt: "What problem did the prospect explicitly confirm before you sent pricing?",
  });
  saveConversationThread({
    id: "thread_test_sync",
    title: "B2B Proposal Diagnosis",
    mode: "coaching_chat",
    messages: [
      {
        id: "m1",
        role: "user",
        content: turn1Prompt,
        createdAt: new Date().toISOString(),
      },
      {
        id: "m2",
        role: "assistant",
        content: turn1Res.text,
        createdAt: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  });

  const upsertedTables: string[] = [];
  const mockSupabase = {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: async () => ({ data: [], error: null }),
          }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
      upsert: (payload: any) => {
        upsertedTables.push(table);
        const resultPromise = Promise.resolve({ data: payload, error: null });
        (resultPromise as any).select = () => ({
          maybeSingle: async () => ({ data: { id: "conv_uuid_1" }, error: null }),
        });
        return resultPromise;
      },
      insert: async (payload: any) => {
        upsertedTables.push(table);
        return { data: payload, error: null };
      },
    }),
  };

  const syncResult = await syncAkucheIntelligenceWithSupabase(
    mockSupabase as any,
    "user_verified_123"
  );
  assertCheck(
    "Phase 4: syncAkucheIntelligenceWithSupabase() synchronises memories, clarity snapshots, thinking patterns, and conversation threads",
    syncResult.synced === true &&
      upsertedTables.includes("akuche_memories") &&
      upsertedTables.includes("akuche_clarity_snapshots") &&
      upsertedTables.includes("akuche_thinking_patterns") &&
      upsertedTables.includes("akuche_conversations")
  );

  // Phase 1: Shared Server Rate Limiter
  const mockRateLimitSupabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            gte: async () => ({ count: 2, error: null }),
          }),
          gte: async () => ({ count: 2, error: null }),
        }),
      }),
    }),
  };
  const rateLimitCheck = await checkSharedServerRateLimit({
    supabase: mockRateLimitSupabase as any,
    userId: "user_verified_123",
    endpoint: "ask",
    maxRequests: 25,
  });
  assertCheck(
    "Phase 1: checkSharedServerRateLimit() enforces authenticated user-bound rate limits across serverless instances",
    rateLimitCheck.allowed === true && rateLimitCheck.remaining > 0
  );

  // Context Engine Stage Calibration Check
  const turn1Ctx = assembleContextualIntelligence({
    message: turn1Prompt,
    mode: "coaching_chat",
    history: [],
  });
  assertCheck(
    "Context Engine: Stage 1 system prompt instructs 'cards: null' and forbids premature action plans",
    turn1Ctx.classification.reasoningStage === "stage_1_understand" &&
      turn1Ctx.systemPrompt.includes('"cards": null')
  );

  console.log("\n================================================================================");
  console.log(`VERIFICATION SUMMARY: ${passedCount} PASSED | ${failedCount} FAILED`);
  console.log("================================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error("Verification failed with exception:", err);
  process.exit(1);
});
