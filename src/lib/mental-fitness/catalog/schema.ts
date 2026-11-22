/**
 * AKUCHE MENTAL FITNESS GYM — STRUCTURED ACTIVITY SCHEMA
 *
 * Data-driven, expandable specification across 20 cognitive, creative, reflective,
 * and healthy-lifestyle categories. Built with strict scientific honesty.
 */

export type MentalFitnessCategory =
  | "memory"
  | "focus"
  | "attention"
  | "logical_reasoning"
  | "problem_solving"
  | "creativity"
  | "imagination"
  | "learning"
  | "comprehension"
  | "verbal_ability"
  | "vocabulary"
  | "communication"
  | "strategic_thinking"
  | "observation"
  | "cognitive_flexibility"
  | "reaction_coordination"
  | "dexterity"
  | "reflection"
  | "mindfulness"
  | "healthy_lifestyle";

export type ActivityType =
  | "interactive_game"
  | "guided_exercise"
  | "reflection"
  | "offline_activity"
  | "lifestyle_challenge";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type InteractiveWidgetKind =
  | "none"
  | "timer"
  | "breathing_pacer"
  | "mental_arithmetic"
  | "memory_recall"
  | "pattern_logic"
  | "word_challenge"
  | "writing_prompt";

export interface MentalFitnessActivity {
  id: string;
  name: string;
  category: MentalFitnessCategory;
  categoryLabel: string;
  skillFocus: string;
  description: string;
  instructions: string[];
  durationMins: number;
  difficulty: DifficultyLevel;
  activityType: ActivityType;
  scoringLogic: string;
  completionCriteria: string;
  feedbackRules: string;
  progressionRules: string;
  variations: string[];
  recommendedFrequency: string;
  safetyGuidance: string;
  scientificNote: string;
  interactiveRoute?: string;
  interactiveWidget?: InteractiveWidgetKind;
}

export const CATEGORY_LABELS: Record<MentalFitnessCategory, string> = {
  memory: "Memory",
  focus: "Focus",
  attention: "Attention",
  logical_reasoning: "Logical Reasoning",
  problem_solving: "Problem-Solving",
  creativity: "Creativity",
  imagination: "Imagination",
  learning: "Learning",
  comprehension: "Comprehension",
  verbal_ability: "Verbal Ability",
  vocabulary: "Vocabulary",
  communication: "Communication",
  strategic_thinking: "Strategic Thinking",
  observation: "Observation",
  cognitive_flexibility: "Cognitive Flexibility",
  reaction_coordination: "Reaction & Coordination",
  dexterity: "Dexterity",
  reflection: "Reflection",
  mindfulness: "Mindfulness",
  healthy_lifestyle: "Healthy Lifestyle Habits",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  interactive_game: "Interactive Game",
  guided_exercise: "Guided Exercise",
  reflection: "Reflection",
  offline_activity: "Offline Activity",
  lifestyle_challenge: "Lifestyle Challenge",
};

export const SCIENTIFIC_HONESTY_STATEMENT =
  "Mental fitness exercises help you practice specific skills like recall, sustained focus, reasoning, and deliberate reflection. Research shows practice improves performance on the practiced skill, while broader real-world transfer varies. Healthy sleep, movement, nutrition, stress management, and real-world problem solving remain foundational to overall brain health. Akuche activities are for skill building and well-being—not medical diagnosis or treatment.";
