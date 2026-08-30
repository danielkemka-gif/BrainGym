import { CognitiveChallenge, ChallengeCategory, ChallengeDifficulty } from "./types";
import { MEMORY_CHALLENGES } from "./memory";
import { LOGIC_CHALLENGES } from "./logic";
import { CREATIVITY_CHALLENGES } from "./creativity";
import { EQ_CHALLENGES } from "./emotional-intelligence";
import { EXECUTIVE_DECISION_CHALLENGES } from "./executive-decisions";
import { SPEED_CHALLENGES } from "./reaction-speed";
import { FOCUS_CHALLENGES } from "./focus-attention";
import { MENTAL_FLEXIBILITY_CHALLENGES } from "./mental-flexibility";
import { CRITICAL_THINKING_CHALLENGES } from "./critical-thinking";
import { SPATIAL_REASONING_CHALLENGES } from "./spatial-reasoning";
import { MENTAL_WELLNESS_CHALLENGES } from "./mental-wellness";
import { BOSS_CHALLENGES } from "./boss-challenges";
import { WORKPLACE_FINANCE_CHALLENGES } from "./workplace-finance";
import { FAMILY_RELATIONSHIPS_CHALLENGES } from "./family-relationships";
import { ACADEMICS_LEARNING_CHALLENGES } from "./academics-learning";
import { PERSONAL_GROWTH_MINDSET_CHALLENGES } from "./personal-growth-mindset";
import { InteractiveChallenge } from "../interactive-challenges";
import { randomizeOptions, randomizeChallenge } from "../answer-randomizer";

export * from "./types";
export * from "./memory";
export * from "./logic";
export * from "./creativity";
export * from "./emotional-intelligence";
export * from "./executive-decisions";
export * from "./reaction-speed";
export * from "./focus-attention";
export * from "./mental-flexibility";
export * from "./critical-thinking";
export * from "./spatial-reasoning";
export * from "./mental-wellness";
export * from "./boss-challenges";
export * from "./workplace-finance";
export * from "./family-relationships";
export * from "./academics-learning";
export * from "./personal-growth-mindset";

// ─── COMPLETE HUMAN COGNITIVE CHALLENGE REPOSITORY ───────────────────────────
export const ALL_COGNITIVE_CHALLENGES: CognitiveChallenge[] = [
  ...MEMORY_CHALLENGES,
  ...LOGIC_CHALLENGES,
  ...CREATIVITY_CHALLENGES,
  ...EQ_CHALLENGES,
  ...EXECUTIVE_DECISION_CHALLENGES,
  ...SPEED_CHALLENGES,
  ...FOCUS_CHALLENGES,
  ...MENTAL_FLEXIBILITY_CHALLENGES,
  ...CRITICAL_THINKING_CHALLENGES,
  ...SPATIAL_REASONING_CHALLENGES,
  ...MENTAL_WELLNESS_CHALLENGES,
  ...BOSS_CHALLENGES,
  ...WORKPLACE_FINANCE_CHALLENGES,
  ...FAMILY_RELATIONSHIPS_CHALLENGES,
  ...ACADEMICS_LEARNING_CHALLENGES,
  ...PERSONAL_GROWTH_MINDSET_CHALLENGES,
];

// Helper to map category names to 5 core domains for workout engine
function mapToCoreDomain(cat: ChallengeCategory): "Memory" | "Focus" | "Speed" | "Reasoning" | "Problem Solving" {
  switch (cat) {
    case "Memory":
      return "Memory";
    case "Reaction Speed":
      return "Speed";
    case "Focus & Attention":
    case "Mental Flexibility":
      return "Focus";
    case "Logic & Reasoning":
    case "Spatial Reasoning":
    case "Critical Thinking":
      return "Reasoning";
    case "Executive Decisions":
    case "Emotional Intelligence":
    case "Creativity":
    case "Mental Wellness":
    case "Boss Challenge":
    default:
      return "Problem Solving";
  }
}

// ─── PROCEDURAL DAILY WORKOUT GENERATOR WITH RANDOMIZED BALANCED OPTIONS ──────
export function generateDynamicWorkout(
  seedStr?: string,
  difficulty: ChallengeDifficulty = "intermediate"
): InteractiveChallenge[] {
  const seedKey = seedStr || `${new Date().toISOString().split("T")[0]}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) {
    hash = (hash << 5) - hash + seedKey.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  // Pick 7 distinct challenges across varied categories
  const round1Pool = MEMORY_CHALLENGES;
  const round2Pool = SPEED_CHALLENGES;
  const round3Pool = LOGIC_CHALLENGES;
  const round4Pool = EXECUTIVE_DECISION_CHALLENGES.concat(EQ_CHALLENGES);
  const round5Pool = FOCUS_CHALLENGES.concat(MENTAL_FLEXIBILITY_CHALLENGES);
  const round6Pool = CRITICAL_THINKING_CHALLENGES.concat(CREATIVITY_CHALLENGES);
  const round7Pool = BOSS_CHALLENGES.concat(SPATIAL_REASONING_CHALLENGES);

  const c1 = round1Pool[seed % round1Pool.length];
  const c2 = round2Pool[(seed + 1) % round2Pool.length];
  const c3 = round3Pool[(seed + 2) % round3Pool.length];
  const c4 = round4Pool[(seed + 3) % round4Pool.length];
  const c5 = round5Pool[(seed + 4) % round5Pool.length];
  const c6 = round6Pool[(seed + 5) % round6Pool.length];
  const c7 = round7Pool[(seed + 6) % round7Pool.length];

  const rawList = [c1, c2, c3, c4, c5, c6, c7];

  return rawList.map((c, idx) => {
    // Randomize option positions at generation time while preserving the exact correct answer integrity
    const shuffledOptions = randomizeOptions(c.options);

    return {
      id: `${c.id}-r${idx + 1}-${Date.now()}`,
      roundNumber: idx + 1,
      type: (c.type as any) || "visual_memory",
      category: mapToCoreDomain(c.category),
      title: `Round ${idx + 1}: ${c.title}`,
      instruction: c.instruction,
      memorizeDurationSec: c.memorizeDurationSec,
      memorizeItems: c.memorizeItems,
      remainingItems: (c as any).remainingItems,
      memorizeStory: c.memorizeStory,
      visualPromptA: c.visualPromptA,
      visualPromptB: c.visualPromptB,
      question: c.question,
      options: shuffledOptions,
      educationalWhy: c.educationalWhy,
      xpReward: c.xpReward,
      coinReward: c.coinReward,
      difficulty: c.difficulty as any,
    };
  });
}

export function getChallengesByCategory(
  category?: ChallengeCategory,
  difficulty?: ChallengeDifficulty
): CognitiveChallenge[] {
  let list = ALL_COGNITIVE_CHALLENGES;
  if (category && category !== ("All" as any)) {
    list = list.filter((c) => c.category === category);
  }
  if (difficulty) {
    list = list.filter((c) => c.difficulty === difficulty);
  }
  return list.map((c) => randomizeChallenge(c));
}
