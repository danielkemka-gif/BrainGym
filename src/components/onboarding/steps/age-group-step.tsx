"use client";

import { useState } from "react";
import { AGE_GROUPS } from "@/lib/constants";
import { AGE_GROUP_ICONS } from "@/lib/icons";
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Which group do you belong to?
        </p>
        <p className="text-xs text-muted-foreground">
          This helps us personalize your experience — activities, goals, and difficulty will be tailored just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
        {AGE_GROUPS.map((group) => (
          <button
            key={group.value}
            type="button"
            onClick={() => setSelected(group.value)}
            className={`flex items-center gap-3 sm:gap-4 rounded-2xl border-2 p-3 sm:p-4 text-left transition-all touch-manipulation active:scale-[0.98] ${
              selected === group.value
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-border bg-card hover:border-muted-foreground/30 hover:bg-accent/50"
            }`}
          >
            <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
              {(() => { const GroupIcon = AGE_GROUP_ICONS[group.iconKey]; return GroupIcon ? <GroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> : null; })()}
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
            <div className={`ml-auto h-4 w-4 sm:h-5 sm:w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected === group.value
                ? "border-primary bg-primary"
                : "border-muted-foreground/30"
            }`}>
              {selected === group.value && (
                <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 sm:h-12 flex-1 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent active:scale-[0.97] touch-manipulation"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex h-11 sm:h-12 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.97] touch-manipulation"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
