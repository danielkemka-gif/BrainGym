// ─────────────────────────────────────────────────────────────────────────────
// BRAINGYM DAILY TASKS ENGINE: TYPES & DATA CONTRACTS (3,000+ TASKS)
// ─────────────────────────────────────────────────────────────────────────────

export type CognitivePillar =
  | "logic"
  | "memory"
  | "focus"
  | "problem_solving"
  | "decision_making"
  | "critical_thinking"
  | "creativity"
  | "observation"
  | "speed"
  | "emotional_intelligence"
  | "strategic_thinking";

export type TaskDifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type TaskInteractionType =
  | "scenario_decision"
  | "multiple_choice"
  | "sequence_completion"
  | "logic_deduction"
  | "memory_recall"
  | "observation_spot"
  | "pattern_recognition"
  | "timed_reflex"
  | "real_life_action";

export interface TaskOption {
  id: string;
  letter: "A" | "B" | "C" | "D";
  text: string;
  isCorrect?: boolean;
  isRecommended?: boolean;
  thinkingStyle?: string;
  consequences?: string;
  brainExplanation?: string;
}

export interface DailyFitnessTask {
  id: string;
  title: string;
  description: string;
  category: CognitivePillar;
  categoryLabel: string;
  difficulty: TaskDifficultyLevel;
  difficultyLabel: "Beginner" | "Developing" | "Intermediate" | "Advanced" | "Expert";
  estimatedDurationMin: number;
  ageSuitability: "all" | "13+" | "18+" | "25+" | "45+";
  instructions: string;
  interactionType: TaskInteractionType;
  coverEmoji: string;
  
  // Rich context
  scenarioNarrative?: string;
  dilemmaOrProblem?: string;
  cognitivePrinciple: string;
  decisionPrompt: string;
  options: TaskOption[];
  
  // Real-life application
  brainInsightTakeaway: string;
  neuroscienceRationale: string;
  yourLifeChallenge: {
    title: string;
    actionPrompt: string;
    durationMinutes: number;
  };
  suggestedReflectionTemplate: string;
  
  // Rewards & Metadata
  xpReward: number;
  coinReward: number;
  tags: string[];
  isActive: boolean;
}

export interface UserDailyTaskAssignment {
  id: string;
  userId: string;
  taskId: string;
  assignmentDate: string; // YYYY-MM-DD
  status: "assigned" | "in_progress" | "completed";
  score: number;
  xpEarned: number;
  coinsEarned: number;
  startedAt?: string;
  completedAt?: string;
  taskSnapshot: DailyFitnessTask;
}
