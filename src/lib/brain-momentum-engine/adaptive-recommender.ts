import {
  BrainMomentumState,
  CognitiveDomain,
  PrescribedDailyWorkout,
  WorkoutDurationMode,
  UserCognitiveProfile,
} from "./types";
import {
  ALL_COGNITIVE_CHALLENGES,
  MEMORY_CHALLENGES,
  FOCUS_CHALLENGES,
  SPEED_CHALLENGES,
  LOGIC_CHALLENGES,
  EXECUTIVE_DECISION_CHALLENGES,
  CRITICAL_THINKING_CHALLENGES,
  SPATIAL_REASONING_CHALLENGES,
  BOSS_CHALLENGES,
  CognitiveChallenge,
} from "../challenges-engine";
import { InteractiveChallenge } from "../interactive-challenges";
import { randomizeOptions } from "../answer-randomizer";
import { getTransferExerciseForDomain } from "./transfer-exercises";
import { getDailyPhysicalMission } from "../physical-activities";

function mapDomainToPool(domain: CognitiveDomain): CognitiveChallenge[] {
  switch (domain) {
    case "Memory":
    case "Working Memory":
      return MEMORY_CHALLENGES;
    case "Focus":
    case "Attention":
      return FOCUS_CHALLENGES;
    case "Processing Speed":
    case "Reaction Time":
      return SPEED_CHALLENGES;
    case "Problem Solving":
    case "Reasoning" as any:
      return LOGIC_CHALLENGES.concat(CRITICAL_THINKING_CHALLENGES);
    default:
      return EXECUTIVE_DECISION_CHALLENGES.concat(SPATIAL_REASONING_CHALLENGES);
  }
}

function convertToInteractive(
  c: CognitiveChallenge,
  roundNumber: number
): InteractiveChallenge {
  return {
    id: `${c.id}-r${roundNumber}-${Date.now()}`,
    roundNumber,
    type: (c.type as any) || "visual_memory",
    category: (c.category === "Logic & Reasoning" ? "Reasoning" : c.category === "Reaction Speed" ? "Speed" : c.category) as any,
    title: `Round ${roundNumber}: ${c.title}`,
    instruction: c.instruction,
    memorizeDurationSec: c.memorizeDurationSec,
    memorizeItems: c.memorizeItems,
    remainingItems: (c as any).remainingItems,
    memorizeStory: c.memorizeStory,
    visualPromptA: c.visualPromptA,
    visualPromptB: c.visualPromptB,
    question: c.question,
    options: randomizeOptions(c.options),
    educationalWhy: c.educationalWhy,
    xpReward: c.xpReward,
    coinReward: c.coinReward,
    difficulty: c.difficulty as any,
  };
}

export function generatePrescribedWorkout(
  momentumState: BrainMomentumState,
  profile?: Partial<UserCognitiveProfile>,
  durationMode: WorkoutDurationMode = "standard",
  isSurpriseMode: boolean = false
): PrescribedDailyWorkout {
  const weakDomain = momentumState.domainNeedingAttention || "Focus";
  const strongDomain = momentumState.strongestDomain || "Memory";
  const goal = profile?.primaryGoal || "Focus & Agility";

  // Determine focus domains based on performance and goals
  let focusDomains: CognitiveDomain[];
  let reasoningWhy = "";

  if (isSurpriseMode) {
    focusDomains = ["Processing Speed", "Problem Solving", "Memory"];
    reasoningWhy = "Surprise Mode: An exploratory multi-domain cross-training session to test cognitive flexibility and unexpected pattern switching.";
  } else if (durationMode === "quick") {
    focusDomains = [weakDomain];
    reasoningWhy = `Quick Win Protocol: High-density 3-minute sprint targeting ${weakDomain} to maintain your daily streak with zero friction.`;
  } else if (weakDomain === strongDomain) {
    focusDomains = [weakDomain, "Processing Speed"];
    reasoningWhy = `Balanced Adaptive Routine: Reinforcing ${weakDomain} while calibrating cognitive reaction velocity.`;
  } else {
    focusDomains = [weakDomain, strongDomain];
    const weakPerf = momentumState.domainProfiles[weakDomain];
    const dropText =
      weakPerf && weakPerf.trend === "needs_attention"
        ? `Your ${weakDomain.toLowerCase()} performance is slightly below your normal range (${Math.abs(weakPerf.trendPercentage)}% delta), while your ${strongDomain.toLowerCase()} is strong.`
        : `Targeting ${weakDomain} for dedicated reinforcement while maintaining momentum in ${strongDomain}.`;
    reasoningWhy = `${dropText} Today's workout has been custom calibrated to train both areas.`;
  }

  // Count rounds by duration mode
  // quick: 3 rounds (3 min)
  // standard: 6 rounds (7 min)
  // deep: 9 rounds (15 min)
  const exerciseCount = durationMode === "quick" ? 3 : durationMode === "deep" ? 8 : 6;
  const estimatedMinutes = durationMode === "quick" ? 3 : durationMode === "deep" ? 15 : 8;

  const poolA = mapDomainToPool(focusDomains[0]);
  const poolB = mapDomainToPool(focusDomains[1] || focusDomains[0]);
  const bossPool = BOSS_CHALLENGES;

  const selectedExercises: InteractiveChallenge[] = [];
  const seed = new Date().getDate() + (isSurpriseMode ? 42 : 0);

  for (let i = 0; i < exerciseCount; i++) {
    const pool = i % 2 === 0 ? poolA : poolB;
    const rawChallenge = pool[(seed + i) % pool.length] || ALL_COGNITIVE_CHALLENGES[i % ALL_COGNITIVE_CHALLENGES.length];
    selectedExercises.push(convertToInteractive(rawChallenge, i + 1));
  }

  // Boss challenge at the end
  const bossRaw = bossPool[seed % bossPool.length];
  const challengeExercise = convertToInteractive(bossRaw, exerciseCount + 1);

  // Real-world transfer drill
  const realWorldTransfer = getTransferExerciseForDomain(focusDomains[0]);

  // Daily physical activity
  const physicalTask = getDailyPhysicalMission();

  // Rewards calculation
  const totalXpReward =
    selectedExercises.reduce((sum, e) => sum + e.xpReward, 0) +
    challengeExercise.xpReward +
    realWorldTransfer.xpReward;
  const totalCoinsReward = selectedExercises.reduce((sum, e) => sum + e.coinReward, 0) + challengeExercise.coinReward;

  return {
    id: `workout-${new Date().toISOString().split("T")[0]}-${durationMode}${isSurpriseMode ? "-surprise" : ""}`,
    date: new Date().toISOString().split("T")[0],
    focusDomains,
    durationMode,
    estimatedMinutes,
    reasoningWhy,
    cognitiveExercises: selectedExercises,
    challengeExercise,
    realWorldTransfer,
    physicalTask,
    isCompletedToday: false,
    totalXpReward,
    totalCoinsReward,
  };
}
