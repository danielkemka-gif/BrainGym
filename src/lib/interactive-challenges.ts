export type ChallengeType =
  | "visual_memory"
  | "reaction_speed"
  | "pattern_recognition"
  | "decision_room"
  | "focus_fire"
  | "memory_recall"
  | "speed_round"
  | "whats_missing"
  | "odd_one_out"
  | "mental_maths"
  | "mental_rotation";

export interface ChallengeOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface InteractiveChallenge {
  id: string;
  type: ChallengeType;
  category: "Memory" | "Focus" | "Speed" | "Reasoning" | "Problem Solving";
  roundNumber: number;
  title: string;
  instruction: string;
  memorizeDurationSec?: number;
  memorizeItems?: string[];
  remainingItems?: string[];
  memorizeStory?: string;
  visualPromptA?: string;
  visualPromptB?: string;
  question: string;
  options: ChallengeOption[];
  educationalWhy: string;
  xpReward: number;
  coinReward: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

import {
  generateDynamicWorkout,
  ALL_COGNITIVE_CHALLENGES,
} from "./challenges-engine";

export { ALL_COGNITIVE_CHALLENGES };

export function generateDailyWorkout(seedDate?: string): InteractiveChallenge[] {
  return generateDynamicWorkout(seedDate);
}

export const SEVEN_ROUND_DAILY_WORKOUT: InteractiveChallenge[] = generateDailyWorkout();
