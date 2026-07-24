export interface BrainQuestion {
  id: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  question: string;
  type: "multiple-choice" | "text-input";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  xp: number;
  coins: number;
}

export type BrainQuestionLocale = "en" | "pcm" | "en-us" | "fr" | "pt";
