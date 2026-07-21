"use client";

import { useState } from "react";
import { GOALS, CHALLENGES, WORKOUT_TIMES } from "@/lib/constants";

export interface GoalsScheduleData {
  goals: string[];
  challenges: string[];
  preferred_workout_time: string;
}

interface Props {
  defaultValues: GoalsScheduleData;
  onNext: (data: GoalsScheduleData) => void;
  onBack: () => void;
}

export function GoalsScheduleStep({ defaultValues, onNext, onBack }: Props) {
  const [goals, setGoals] = useState<string[]>(defaultValues.goals);
  const [challenges, setChallenges] = useState<string[]>(
    defaultValues.challenges
  );
  const [workoutTime, setWorkoutTime] = useState(
    defaultValues.preferred_workout_time
  );

  function toggleItem(list: string[], value: string) {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({ goals, challenges, preferred_workout_time: workoutTime });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium">
          What are your main goals? <span className="text-muted-foreground">(select all that apply)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGoals(toggleItem(goals, g.value))}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                goals.includes(g.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">
          What challenges do you face?{" "}
          <span className="text-muted-foreground">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {CHALLENGES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() =>
                setChallenges(toggleItem(challenges, c.value))
              }
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                challenges.includes(c.value)
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">
          Preferred workout time
        </p>
        <div className="flex flex-wrap gap-2">
          {WORKOUT_TIMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setWorkoutTime(t.value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                workoutTime === t.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
