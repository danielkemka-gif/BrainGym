// ============================================================================
// BRAINGYM ADAPTIVE DIFFICULTY & ANTI-GAMING SCORING ENGINE
// ============================================================================

import { CognitiveDomainId, COGNITIVE_DOMAINS, DrillItem } from "./cognitive-matrix";

export interface UserPerformanceRecord {
  domainId: CognitiveDomainId;
  totalAttempts: number;
  correctAttempts: number;
  recentAccuracies: number[]; // Last 5 drill accuracies (0 to 100)
  currentDifficulty: number;  // 1 to 10 scale
  averageResponseTimeMs: number;
  lastSessionDate: string;
}

export interface AdaptiveEvaluationResult {
  nextDifficulty: number;
  difficultyDelta: "increased" | "maintained" | "decreased";
  accuracy: number;
  speedMs: number;
  calculatedScore: number;
  efficiencyBonus: number;
  microLessonRecommended: boolean;
  adaptedParameters: {
    timeLimitSeconds: number;
    distractorCount: number;
    complexityTier: "simple" | "standard" | "complex";
  };
}

/**
 * Calculates cognitive score enforcing Anti-Gaming rules (Section 16).
 * Score = Accuracy × Difficulty × Efficiency
 * Speed bonus activates ONLY when accuracy threshold >= 70% is met.
 */
export function calculateAntiGamingScore(params: {
  accuracy: number; // 0 to 1.0
  difficultyTier: number; // 1 to 10
  timeTakenMs: number;
  targetDurationSeconds: number;
}): { score: number; efficiencyBonus: number; isSpeedRewarded: boolean } {
  const { accuracy, difficultyTier, timeTakenMs, targetDurationSeconds } = params;

  // Base difficulty points (10 to 100)
  const basePoints = difficultyTier * 10;

  // Accuracy multiplier (0.0 to 1.0)
  const accuracyMultiplier = Math.max(0, Math.min(1.0, accuracy));

  // Anti-Gaming Gate: Speed is rewarded ONLY if accuracy >= 70%
  const isSpeedRewarded = accuracyMultiplier >= 0.70;

  let efficiencyBonus = 1.0;
  if (isSpeedRewarded && targetDurationSeconds > 0) {
    const targetMs = targetDurationSeconds * 1000;
    // If completed faster than target without sacrificing accuracy, scale up to +50% bonus
    const speedRatio = Math.max(0.2, timeTakenMs / targetMs);
    if (speedRatio < 1.0) {
      efficiencyBonus = 1.0 + (1.0 - speedRatio) * 0.5; // Max 1.5x efficiency
    }
  }

  // Final Anti-Gaming Cognitive Score
  const rawScore = basePoints * accuracyMultiplier * efficiencyBonus;
  const finalScore = Math.round(rawScore * 10); // Scaled 0 to 1500 per drill

  return {
    score: finalScore,
    efficiencyBonus: Math.round((efficiencyBonus - 1.0) * 100),
    isSpeedRewarded,
  };
}

/**
 * Evaluates performance and adapts difficulty dynamically (Section 15).
 * 90-100% -> Increase difficulty
 * 75-89%  -> Maintain or slightly increase
 * 50-74%  -> Maintain current difficulty
 * <50%    -> Reduce difficulty and trigger micro-lesson
 */
export function evaluateAdaptiveDifficulty(
  currentRecord: UserPerformanceRecord,
  lastAttemptAccuracy: number, // 0 to 100
  timeTakenMs: number,
  targetDurationSeconds: number
): AdaptiveEvaluationResult {
  const currentDiff = Math.max(1, Math.min(10, currentRecord.currentDifficulty || 3));
  let nextDiff = currentDiff;
  let difficultyDelta: "increased" | "maintained" | "decreased" = "maintained";
  let microLessonRecommended = false;

  if (lastAttemptAccuracy >= 90) {
    nextDiff = Math.min(10, currentDiff + 1);
    difficultyDelta = nextDiff > currentDiff ? "increased" : "maintained";
  } else if (lastAttemptAccuracy >= 75) {
    // Check momentum: if last 3 rounds all >= 75%, promote
    const recent = [...(currentRecord.recentAccuracies || []), lastAttemptAccuracy].slice(-3);
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    if (avgRecent >= 80 && currentDiff < 10) {
      nextDiff = Math.min(10, currentDiff + 1);
      difficultyDelta = "increased";
    }
  } else if (lastAttemptAccuracy >= 50) {
    nextDiff = currentDiff;
    difficultyDelta = "maintained";
  } else {
    nextDiff = Math.max(1, currentDiff - 1);
    difficultyDelta = nextDiff < currentDiff ? "decreased" : "maintained";
    microLessonRecommended = true;
  }

  const { score, efficiencyBonus } = calculateAntiGamingScore({
    accuracy: lastAttemptAccuracy / 100,
    difficultyTier: currentDiff,
    timeTakenMs,
    targetDurationSeconds,
  });

  // Calculate mutated parameters based on new difficulty tier
  const timeLimitSeconds = Math.max(15, Math.round(targetDurationSeconds * (1.1 - nextDiff * 0.03)));
  const distractorCount = Math.min(6, Math.max(1, Math.floor(nextDiff / 2)));
  const complexityTier: "simple" | "standard" | "complex" =
    nextDiff <= 3 ? "simple" : nextDiff <= 7 ? "standard" : "complex";

  return {
    nextDifficulty: nextDiff,
    difficultyDelta,
    accuracy: lastAttemptAccuracy,
    speedMs: timeTakenMs,
    calculatedScore: score,
    efficiencyBonus,
    microLessonRecommended,
    adaptedParameters: {
      timeLimitSeconds,
      distractorCount,
      complexityTier,
    },
  };
}

/**
 * Generates the 6-Step Daily Training Routine (Section 1).
 * Warm-up → Challenge → Reason → Recall → Apply → Review
 */
export interface DailyTrainingLoopStep {
  stepNumber: number;
  stageName: "Warm-up" | "Challenge" | "Reason" | "Recall" | "Apply" | "Review";
  domainId: CognitiveDomainId;
  targetDurationSeconds: number;
  description: string;
}

export const DAILY_TRAINING_STEPS: DailyTrainingLoopStep[] = [
  {
    stepNumber: 1,
    stageName: "Warm-up",
    domainId: "processing_speed",
    targetDurationSeconds: 45,
    description: "Calibrate your visual reflexes and neural firing speed.",
  },
  {
    stepNumber: 2,
    stageName: "Challenge",
    domainId: "working_memory",
    targetDurationSeconds: 60,
    description: "Hold and manipulate sequences under time pressure.",
  },
  {
    stepNumber: 3,
    stageName: "Reason",
    domainId: "logical_reasoning",
    targetDurationSeconds: 75,
    description: "Deduce strict logical truths and recognize missing data.",
  },
  {
    stepNumber: 4,
    stageName: "Recall",
    domainId: "learn_recall",
    targetDurationSeconds: 60,
    description: "Spaced retrieval of key principles and structured facts.",
  },
  {
    stepNumber: 5,
    stageName: "Apply",
    domainId: "decision_making",
    targetDurationSeconds: 90,
    description: "Evaluate a high-stakes real-world decision trade-off.",
  },
  {
    stepNumber: 6,
    stageName: "Review",
    domainId: "problem_solving",
    targetDurationSeconds: 45,
    description: "Metacognitive reflection on errors and thinking patterns.",
  },
];
