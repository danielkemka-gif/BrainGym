"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";

export interface AssessmentData {
  scores: Record<string, number>;
}

interface Props {
  defaultValues: AssessmentData;
  onNext: (data: AssessmentData) => void;
  onBack: () => void;
}

function CategorySlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const emoji =
    value < 30 ? "😰" : value < 50 ? "😐" : value < 70 ? "🙂" : "💪";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {emoji} {value}/100
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Needs work</span>
        <span>Strong</span>
      </div>
    </div>
  );
}

export function AssessmentStep({ defaultValues, onNext, onBack }: Props) {
  const [scores, setScores] =
    useState<Record<string, number>>(defaultValues.scores);

  function handleChange(categoryId: string, value: number) {
    setScores((prev) => ({ ...prev, [categoryId]: value }));
  }

  const hasAll = CATEGORIES.every((c) => scores[c.id] !== undefined);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Rate your current ability in each area. This helps us personalize
          your workouts. Be honest — there are no wrong answers.
        </p>
      </div>

      <div className="space-y-5">
        {CATEGORIES.map((c) => (
          <CategorySlider
            key={c.id}
            label={c.label}
            value={scores[c.id] ?? 50}
            onChange={(v) => handleChange(c.id, v)}
          />
        ))}
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
          type="button"
          onClick={() => onNext({ scores })}
          disabled={!hasAll}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
