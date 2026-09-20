"use client";

import { useState } from "react";
import {
  AGE_RANGE_OPTIONS,
  AgeRangeBracket,
  LIFE_SITUATIONS,
  LifeSituationType,
} from "@/lib/personalization";
import type { AgeGroup } from "@/lib/constants";
import { Users, Briefcase, Check } from "lucide-react";

export interface LifeContextData {
  age_range: AgeRangeBracket;
  life_situations: LifeSituationType[];
  age_group: AgeGroup;
}

interface Props {
  defaultValues: {
    age_range?: AgeRangeBracket;
    life_situations?: LifeSituationType[];
    age_group?: AgeGroup;
  };
  onNext: (data: LifeContextData) => void;
  onBack: () => void;
}

function mapBracketToLegacyGroup(range: AgeRangeBracket): AgeGroup {
  if (range === "13-17") return "teen";
  if (range === "18-25") return "young_adult";
  if (range === "26-45") return "adult";
  return "senior";
}

export function AgeGroupStep({ defaultValues, onNext, onBack }: Props) {
  const [selectedRange, setSelectedRange] = useState<AgeRangeBracket>(
    defaultValues.age_range || "26-45"
  );
  const [selectedSituations, setSelectedSituations] = useState<LifeSituationType[]>(
    defaultValues.life_situations?.length
      ? defaultValues.life_situations
      : ["Professional"]
  );

  const toggleSituation = (sit: LifeSituationType) => {
    setSelectedSituations((prev) =>
      prev.includes(sit)
        ? prev.length > 1
          ? prev.filter((s) => s !== sit)
          : prev
        : [...prev, sit]
    );
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({
      age_range: selectedRange,
      life_situations: selectedSituations,
      age_group: mapBracketToLegacyGroup(selectedRange),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* 1. Age Range Selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase">
          <Users className="h-4 w-4" />
          <span>1. Your Age Range</span>
        </div>
        <p className="text-xs text-muted-foreground">
          BrainGym adapts real-life context so exercises feel natural to your stage in life.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {AGE_RANGE_OPTIONS.map((range) => {
            const isSelected = selectedRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => setSelectedRange(range.id)}
                className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-muted-foreground/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    {range.label}
                  </span>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  {range.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Current Life Situation (Multi-Select) */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase">
            <Briefcase className="h-4 w-4" />
            <span>2. Current Life Situation</span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            Select all that apply
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Helps us customize scenarios around work, business, school, or personal decisions.
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {LIFE_SITUATIONS.map((sit) => {
            const isSelected = selectedSituations.includes(sit.id);
            return (
              <button
                key={sit.id}
                type="button"
                onClick={() => toggleSituation(sit.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95 touch-manipulation ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                <span>{sit.emoji}</span>
                <span>{sit.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 sm:gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 sm:h-12 flex-1 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent active:scale-[0.97] touch-manipulation"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex h-11 sm:h-12 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.97] touch-manipulation"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
