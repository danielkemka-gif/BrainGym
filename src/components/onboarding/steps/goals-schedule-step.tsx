"use client";

import { useState } from "react";
import {
  CORE_MENTAL_FITNESS_AREAS,
  CoreMentalFitnessArea,
  USER_INTEREST_OPTIONS,
  UserInterestType,
} from "@/lib/personalization";
import { WORKOUT_TIMES } from "@/lib/constants";
import { Brain, Sparkles, Clock, Compass } from "lucide-react";

export interface GoalsScheduleData {
  goals: string[];
  interests: UserInterestType[];
  challenges: string[];
  preferred_workout_time: string;
}

interface Props {
  defaultValues: {
    goals?: string[];
    interests?: UserInterestType[];
    challenges?: string[];
    preferred_workout_time?: string;
  };
  onNext: (data: GoalsScheduleData) => void;
  onBack: () => void;
}

export function GoalsScheduleStep({ defaultValues, onNext, onBack }: Props) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    defaultValues.goals?.length
      ? defaultValues.goals
      : ["Decision-making", "Focus", "Problem-solving"]
  );

  const [selectedInterests, setSelectedInterests] = useState<UserInterestType[]>(
    defaultValues.interests?.length
      ? defaultValues.interests
      : ["Business", "Money", "Everyday life"]
  );

  const [workoutTime, setWorkoutTime] = useState(
    defaultValues.preferred_workout_time || "07:00"
  );

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.length > 1
          ? prev.filter((g) => g !== goal)
          : prev
        : [...prev, goal]
    );
  }

  function toggleInterest(interest: UserInterestType) {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.length > 1
          ? prev.filter((i) => i !== interest)
          : prev
        : [...prev, interest]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({
      goals: selectedGoals,
      interests: selectedInterests,
      challenges: [],
      preferred_workout_time: workoutTime,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* 1. 8 Core Mental Fitness Areas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase">
            <Brain className="h-4 w-4" />
            <span>1. Mental Fitness Areas to Train</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Select 1 or more</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Universal cognitive skills trained across all ages:
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {CORE_MENTAL_FITNESS_AREAS.map((area) => {
            const isSelected = selectedGoals.includes(area.id);
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => toggleGoal(area.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition active:scale-95 touch-manipulation ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                    : "border-border bg-card text-foreground hover:border-muted-foreground/40"
                }`}
              >
                <span className="text-base">{area.emoji}</span>
                <div className="min-w-0">
                  <span className="text-xs font-bold block truncate">{area.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interests & Context Themes */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase">
            <Compass className="h-4 w-4" />
            <span>2. Topics &amp; Interests</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Influences daily scenarios</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {USER_INTEREST_OPTIONS.map((int) => {
            const isSelected = selectedInterests.includes(int.id);
            return (
              <button
                key={int.id}
                type="button"
                onClick={() => toggleInterest(int.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95 touch-manipulation ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                <span>{int.emoji}</span>
                <span>{int.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Workout Time */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase">
          <Clock className="h-4 w-4" />
          <span>3. Preferred Workout Time</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {WORKOUT_TIMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setWorkoutTime(t.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95 touch-manipulation ${
                workoutTime === t.value
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border hover:border-muted-foreground text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
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
