export type ChallengeCategory =
  | "Memory"
  | "Logic & Reasoning"
  | "Creativity"
  | "Emotional Intelligence"
  | "Executive Decisions"
  | "Reaction Speed"
  | "Focus & Attention"
  | "Mental Flexibility"
  | "Critical Thinking"
  | "Spatial Reasoning"
  | "Mental Wellness"
  | "Boss Challenge";

export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type ChallengeInteractionType =
  | "visual_memory"
  | "reaction_speed"
  | "pattern_recognition"
  | "decision_room"
  | "focus_fire"
  | "memory_recall"
  | "speed_round"
  | "mental_flexibility"
  | "critical_scenario"
  | "spatial_rotation"
  | "wellness_reflection"
  | "boss_multitask";

export interface ChallengeOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface CognitiveChallenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  subcategory: string;
  difficulty: ChallengeDifficulty;
  type: ChallengeInteractionType;
  estimatedTimeSec: number;
  cognitiveSkill: string;
  instruction: string;
  memorizeDurationSec?: number;
  memorizeItems?: string[];
  memorizeStory?: string;
  visualPromptA?: string;
  visualPromptB?: string;
  question: string;
  options: ChallengeOption[];
  educationalWhy: string;
  xpReward: number;
  coinReward: number;
}
