"use client";

import { useState } from "react";
import { AGE_GROUPS } from "@/lib/constants";
import type { AgeGroup } from "@/lib/constants";

interface Props {
  defaultValues: { age_group: AgeGroup };
  onNext: (data: { age_group: AgeGroup }) => void;
  onBack: () => void;
}

export function AgeGroupStep({ defaultValues, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<AgeGroup>(defaultValues.age_group);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({ age_group: selected });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Which group do you belong to?
        </p>
        <p className="text-xs text-muted-foreground">
          This helps us personalize your experience — activities, goals, and difficulty will be tailored just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {AGE_GROUPS.map((group) => (
          <button
            key={group.value}
            type="button"
            onClick={() => setSelected(group.value)}
            className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
              selected === group.value
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-border bg-card hover:border-muted-foreground/30 hover:bg-accent/50"
            }`}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-3xl">
              {group.icon}
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${
                selected === group.value ? "text-primary" : "text-foreground"
              }`}>
                {group.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {group.description}
              </p>
            </div>
            <div className={`ml-auto h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected === group.value
                ? "border-primary bg-primary"
                : "border-muted-foreground/30"
            }`}>
              {selected === group.value && (
                <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
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
          type="submit"
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
