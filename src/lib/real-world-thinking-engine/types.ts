/**
 * REAL-WORLD THINKING ENGINE™ — TYPE DEFINITIONS
 * 
 * Core 4-Stage Framework: THINK → DECIDE → ACT → REFLECT
 * 8-Step Daily Challenge Architecture
 */

import { Locale } from "../i18n/types";

export type CognitiveSkill =
  | "Memory"
  | "Focus"
  | "Reasoning"
  | "Problem Solving"
  | "Decision Making"
  | "Cognitive Flexibility"
  | "Processing Speed"
  | "Creativity";

export type ChallengeCategoryContext =
  | "Business & Enterprise"
  | "Workplace & Leadership"
  | "Personal Finance & Resource"
  | "Negotiation & Influence"
  | "Everyday Life & Social"
  | "Critical Media & Info"
  | "Career & Growth"
  | "Team Dynamics";

export type ChallengeDifficulty = 1 | 2 | 3 | 4 | 5;

export interface DecisionOption {
  id: string;
  letter: "A" | "B" | "C" | "D";
  text: string;
  isRecommended: boolean;
  strategyRationale: string;
  immediateConsequence: string;
  longTermImpact: string;
}

export interface CognitiveMiniDrill {
  type: "deduction" | "pattern_spotter" | "working_memory" | "reaction_speed" | "bias_detector";
  question: string;
  prompt: string;
  options: Array<{ id: string; text: string; isCorrect: boolean; explanation: string }>;
  timeLimitSeconds?: number;
}

export interface RealLifeActionPlan {
  id: string;
  actionTitle: string;
  instruction: string;
  contextWhy: string;
  estimatedMinutes: number;
  reflectionPrompt: string;
}

export interface LocalizedChallengeContent {
  title: string;
  scenarioNarrative: string;
  contextPill: string;
  
  // Step 2: Think
  thinkPrompt: string;
  keyFactsToIdentify: string[];
  hiddenAssumptions: string[];
  
  // Step 3: Analyse
  analysePrompt: string;
  perspectives: Array<{ title: string; viewpoint: string; risk: string }>;
  
  // Step 4: Decide
  decideQuestion: string;
  decisionOptions: DecisionOption[];
  
  // Step 5: Brain Challenge
  cognitiveDrill: CognitiveMiniDrill;
  
  // Step 6: Act
  realLifeAction: RealLifeActionPlan;
  
  // Step 7: Reflect
  reflectionQuestions: string[];
  suggestedTakeaway: string;
}

export interface RealWorldChallengeDefinition {
  id: string;
  skill: CognitiveSkill;
  category: ChallengeCategoryContext;
  difficulty: ChallengeDifficulty;
  ageSuitability: "all" | "teen" | "young_adult" | "adult" | "senior";
  estimatedMinutes: number;
  xpReward: number;
  coinReward: number;
  tags: string[];
  culturalContext?: "global" | "african" | "workplace" | "entrepreneur";
  
  // Localized Content by Locale
  translations: Partial<Record<Locale, LocalizedChallengeContent>>;
}

export interface UserChallengeAttemptRecord {
  id: string;
  userId: string;
  challengeId: string;
  assignmentDate: string;
  locale: Locale;
  selectedDecisionId?: string;
  isRecommendedChoice?: boolean;
  cognitiveDrillScore: number;
  cognitiveDrillCompleted: boolean;
  actionCommitted: boolean;
  userReflectionText?: string;
  xpEarned: number;
  coinsEarned: number;
  completedAt?: string;
}
