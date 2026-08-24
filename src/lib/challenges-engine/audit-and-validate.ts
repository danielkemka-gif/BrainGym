import { ALL_COGNITIVE_CHALLENGES } from "./index";
import { BRAIN_QUESTIONS_EN } from "../brain-questions/en";
import { PREMIUM_SCENARIOS } from "../premium-scenarios";
import {
  auditOptionDistribution,
  randomizeOptions,
  DistributionReport,
} from "../answer-randomizer";

export function runFullQuestionSystemAudit(): {
  fourOptionChallengesAudit: DistributionReport;
  allCognitiveChallengesAudit: DistributionReport;
  triviaQuestionsAudit: DistributionReport;
  premiumScenariosAudit: DistributionReport;
  combinedTotalSimulations: number;
  overallPassed: boolean;
} {
  // 1. Audit 4-option Cognitive Challenges
  const fourOptionChallenges = ALL_COGNITIVE_CHALLENGES.filter(
    (c) => c.options && c.options.length === 4
  );
  const fourOptionAudit = auditOptionDistribution(fourOptionChallenges, 200);

  // 2. Audit All Cognitive Challenges (including 2-option and 3-option scenarios)
  const allCognitiveAudit = auditOptionDistribution(ALL_COGNITIVE_CHALLENGES, 100);

  // 3. Audit Brain Trivia Questions
  const triviaChallenges = BRAIN_QUESTIONS_EN.filter(
    (q) => q.options && q.options.length >= 2
  ).map((q) => ({
    options: q.options!.map((opt) => ({
      label: opt,
      isCorrect: opt.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim(),
    })),
  }));
  const triviaAudit = auditOptionDistribution(triviaChallenges, 200);

  // 4. Audit Premium Scenarios
  const premiumChallenges = PREMIUM_SCENARIOS.map((ps) => ({
    options: ps.options.map((opt) => ({
      label: opt,
      isCorrect: opt === ps.correctAnswer,
    })),
  }));
  const premiumAudit = auditOptionDistribution(premiumChallenges, 200);

  const combinedTotalSimulations =
    fourOptionAudit.totalQuestionsEvaluated +
    triviaAudit.totalQuestionsEvaluated +
    premiumAudit.totalQuestionsEvaluated;

  const overallPassed =
    fourOptionAudit.integrityVerified &&
    fourOptionAudit.isBalanced &&
    triviaAudit.integrityVerified &&
    triviaAudit.isBalanced &&
    premiumAudit.integrityVerified &&
    premiumAudit.isBalanced;

  return {
    fourOptionChallengesAudit: fourOptionAudit,
    allCognitiveChallengesAudit: allCognitiveAudit,
    triviaQuestionsAudit: triviaAudit,
    premiumScenariosAudit: premiumAudit,
    combinedTotalSimulations,
    overallPassed,
  };
}
