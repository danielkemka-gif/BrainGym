"use client";

import { BrainQuiz, type QuizResult } from "../brain-quiz";

export interface AssessmentData {
  scores: Record<string, number>;
  overallLevel?: "beginner" | "intermediate" | "advanced";
}

interface Props {
  defaultValues: AssessmentData;
  onNext: (data: AssessmentData) => void;
  onBack: () => void;
}

export function AssessmentStep({ defaultValues, onNext, onBack }: Props) {
  function handleQuizComplete(result: QuizResult) {
    onNext({
      scores: result.scores,
      overallLevel: result.overallLevel,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Take this quick brain assessment. Each question tests a different cognitive area.
          Your answers help us set your starting difficulty level.
        </p>
      </div>

      <BrainQuiz onComplete={handleQuizComplete} />

      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-11 sm:h-12 w-full items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent active:scale-[0.97] touch-manipulation"
      >
        Back
      </button>
    </div>
  );
}
