// ============================================================================
// BRAINGYM FEEDBACK & METACOGNITIVE REFLECTION ENGINE
// ============================================================================

import { CognitiveDomainId, COGNITIVE_DOMAINS, DrillItem } from "./cognitive-matrix";

export interface StructuredFeedbackCard {
  resultText: string;
  accuracyPercent: number;
  speedDeltaText: string;
  strengthDomain: string;
  mistakeAnalysis: string;
  microLesson: string;
  nextChallengeText: string;
  reflectionQuestion: string;
  cognitivePrinciple: string;
}

export const METACOGNITIVE_QUESTIONS = [
  "What caused you to hesitate or make that mistake?",
  "What critical assumption did you make before seeing the full data?",
  "Did you answer too quickly, or did you carefully test the conditions?",
  "What piece of evidence would make you change your mind on this problem?",
  "How will you apply this specific thinking principle in your work or daily life today?",
  "What mental shortcut (heuristic) worked best for you in this drill?",
];

export function generateStructuredFeedback(params: {
  drill: DrillItem;
  accuracy: number; // 0 to 100
  timeTakenMs: number;
  historicalAvgMs?: number;
  isCorrect: boolean;
  selectedOptionText?: string;
  activeDomain: CognitiveDomainId;
}): StructuredFeedbackCard {
  const {
    drill,
    accuracy,
    timeTakenMs,
    historicalAvgMs = 5000,
    isCorrect,
    activeDomain,
  } = params;

  const domainMeta = COGNITIVE_DOMAINS[activeDomain] || COGNITIVE_DOMAINS.processing_speed;

  // 1. Result text
  const resultText = isCorrect
    ? `Target Mastered (${Math.round(accuracy)}%)`
    : `Learning Opportunity (${Math.round(accuracy)}%)`;

  // 2. Speed improvement delta
  const speedDelta = historicalAvgMs > 0
    ? Math.round(((historicalAvgMs - timeTakenMs) / historicalAvgMs) * 100)
    : 0;
  const speedDeltaText = speedDelta > 0
    ? `Response speed improved by ${speedDelta}% vs baseline.`
    : `Response speed: ${(timeTakenMs / 1000).toFixed(1)}s (steady calibration).`;

  // 3. Strength domain
  const strengthDomain = isCorrect
    ? `${domainMeta.name} (${domainMeta.badgeTitle})`
    : "Pattern Recognition & Focus";

  // 4. Mistake Analysis
  let mistakeAnalysis = "No major cognitive biases detected in this round. Clean execution!";
  if (!isCorrect) {
    if (drill.type === "bias_detector" || drill.type === "trade_off") {
      mistakeAnalysis = "You selected a short-term or emotionally anchored option before calculating the opportunity cost.";
    } else if (drill.type === "rule_switch" || drill.type === "rapid_categorization") {
      mistakeAnalysis = "You responded based on automatic habit before loading the active rule set.";
    } else if (drill.type === "deduction" || drill.type === "missing_information") {
      mistakeAnalysis = "You treated a 'possible' statement as a 'necessary' truth, or assumed baseline rates without proof.";
    } else {
      mistakeAnalysis = "You moved to an answer before double-checking all boundary constraints.";
    }
  }

  // 5. Micro-Lesson
  const microLesson = drill.microLesson || "Pause briefly to identify all constraints before committing your answer.";

  // 6. Next Challenge
  const nextChallengeText = `Your next challenge will test ${domainMeta.shortName} with adapted difficulty tiers.`;

  // 7. Metacognitive Prompt
  const reflectionQuestion =
    drill.metacognitivePrompt ||
    METACOGNITIVE_QUESTIONS[Math.floor(Math.random() * METACOGNITIVE_QUESTIONS.length)];

  return {
    resultText,
    accuracyPercent: Math.round(accuracy),
    speedDeltaText,
    strengthDomain,
    mistakeAnalysis,
    microLesson,
    nextChallengeText,
    reflectionQuestion,
    cognitivePrinciple: drill.cognitivePrinciple,
  };
}
