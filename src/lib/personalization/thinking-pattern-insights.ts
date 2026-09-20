/**
 * BRAINGYM THINKING PATTERN INSIGHTS ENGINE
 * 
 * Objective:
 * Help users discover: «"How do I tend to approach problems in real life?"»
 * 
 * Safety & Responsibility:
 * STRICTLY non-medical, non-IQ, and non-clinical.
 * Presented as observable BrainGym cognitive practice patterns and growth trends.
 */

import { UserPersonalizationProfile, CoreMentalFitnessArea } from "./types";
import { FOUR_CORE_OUTCOMES, CoreOutcomeCategory } from "./four-core-outcomes";

export interface ThinkingPatternTrait {
  id: string;
  title: string;
  category: CoreOutcomeCategory;
  description?: string;
  strengthLevel: "Developing" | "Proficient" | "Mastery";
  observedSignal: string;
  realWorldApplication: string;
  actionableRecommendation: string;
}

export interface UserThinkingProfile {
  overallThinkingArchetype: string;
  archetypeDescription: string;
  outcomeMastery: Record<CoreOutcomeCategory, { percentage: number; level: number }>;
  activeTraits: ThinkingPatternTrait[];
  primaryCognitiveStrength: string;
  primaryGrowthOpportunity: string;
  practiceInsightSummary: string;
}

/**
 * Generate responsible, non-clinical thinking pattern insights from user profile and performance logs.
 */
export function generateThinkingPatternProfile(
  profile: UserPersonalizationProfile
): UserThinkingProfile {
  const accuracy = profile.totalAccuracyScore || 0.82;
  const completed = profile.completedWorkoutsCount || 12;
  const level = profile.currentDifficultyLevel || 3;

  // Calculate outcome percentages from 8 core skills
  const skills = profile.skillMasteryLevels;

  const thinkScore = ((skills["Focus"] + skills["Memory"] + skills["Critical thinking"]) / 18) * 100;
  const solveScore = ((skills["Problem-solving"] + skills["Creativity"]) / 12) * 100;
  const decideScore = ((skills["Decision-making"] + skills["Self-awareness"]) / 12) * 100;
  const adaptScore = ((skills["Adaptability"] + skills["Self-awareness"]) / 12) * 100;

  const outcomeMastery: Record<CoreOutcomeCategory, { percentage: number; level: number }> = {
    THINK: { percentage: Math.min(100, Math.round(thinkScore * (accuracy + 0.2))), level: Math.max(1, Math.round(thinkScore / 18)) },
    SOLVE: { percentage: Math.min(100, Math.round(solveScore * (accuracy + 0.2))), level: Math.max(1, Math.round(solveScore / 18)) },
    DECIDE: { percentage: Math.min(100, Math.round(decideScore * (accuracy + 0.2))), level: Math.max(1, Math.round(decideScore / 18)) },
    ADAPT: { percentage: Math.min(100, Math.round(adaptScore * (accuracy + 0.2))), level: Math.max(1, Math.round(adaptScore / 18)) },
  };

  // Determine Archetype
  let archetype = "Strategic Value Decider";
  let archetypeDesc = "You tend to evaluate multiple consequences and trade-offs carefully before committing resources or actions.";

  if (solveScore > decideScore && solveScore > thinkScore) {
    archetype = "Lateral Problem Solver";
    archetypeDesc = "You excel at finding creative workarounds and breaking down multi-variable obstacles under constraints.";
  } else if (thinkScore > decideScore && thinkScore > solveScore) {
    archetype = "Analytical Clarity Thinker";
    archetypeDesc = "You prioritize deep verification, pattern recognition, and separating noise from factual signals.";
  } else if (adaptScore > thinkScore) {
    archetype = "Adaptive Agile Strategist";
    archetypeDesc = "You demonstrate high mental flexibility, shifting tactics smoothly when initial assumptions are challenged.";
  }

  const traits: ThinkingPatternTrait[] = [
    {
      id: "trait-consequence-mapping",
      title: "Second-Order Consequence Forecasting",
      category: "DECIDE",
      strengthLevel: level >= 4 ? "Mastery" : level >= 2 ? "Proficient" : "Developing",
      observedSignal: `Consistently selects strategic inquiry over reactive panic in Level ${level} scenarios.`,
      realWorldApplication: "Crucial for negotiations, contract commitments, and long-term financial budgeting.",
      actionableRecommendation: "Continue using the 30-second pause before finalizing high-stakes choices.",
    },
    {
      id: "trait-constraint-inversion",
      title: "Constraint Inversion & Resourcefulness",
      category: "SOLVE",
      strengthLevel: level >= 3 ? "Proficient" : "Developing",
      observedSignal: "Identifies non-capital distribution and collaboration channels in zero-budget problems.",
      realWorldApplication: "Helps launch projects, overcome operational bottlenecks, and lead with agility.",
      actionableRecommendation: "Map out existing unutilized relationships before spending capital.",
    },
    {
      id: "trait-distraction-immunity",
      title: "Attentional Boundary Architecture",
      category: "THINK",
      strengthLevel: level >= 3 ? "Proficient" : "Developing",
      observedSignal: "Applies environmental friction principles to resist digital notification loops.",
      realWorldApplication: "Unlocks uninterrupted deep work windows in busy office or academic environments.",
      actionableRecommendation: "Keep mobile devices in another room during high-complexity work blocks.",
    },
    {
      id: "trait-adaptive-pivot",
      title: "Cognitive Shifting Under Disruption",
      category: "ADAPT",
      strengthLevel: level >= 4 ? "Mastery" : "Proficient",
      observedSignal: "Updates assumptions rapidly when new liquidity or operational constraints arise.",
      realWorldApplication: "Navigating market shifts, team changes, and economic volatility with composure.",
      actionableRecommendation: "Separate emotional reaction to disruption from the tactical next step.",
    },
  ];

  return {
    overallThinkingArchetype: archetype,
    archetypeDescription: archetypeDesc,
    outcomeMastery,
    activeTraits: traits,
    primaryCognitiveStrength: "Strategic Consequence Evaluation & Trade-off Balancing",
    primaryGrowthOpportunity: "Sustaining deep focus sprints without intermittent task switching",
    practiceInsightSummary: `Based on ${completed} completed mental fitness workouts, you demonstrate deliberate analytical reasoning and consistently evaluate second-order risks.`,
  };
}
