"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PrescribedDailyWorkout,
  WorkoutDurationMode,
} from "@/lib/brain-momentum-engine";
import {
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Shuffle,
  HelpCircle,
  Zap,
  Flame,
  CheckCircle2,
} from "lucide-react";

interface TodaysBrainPlanHeroProps {
  workout: PrescribedDailyWorkout;
  onDurationChange: (mode: WorkoutDurationMode) => void;
  onSurpriseMe: () => void;
}

export function TodaysBrainPlanHero({
  workout,
  onDurationChange,
  onSurpriseMe,
}: TodaysBrainPlanHeroProps) {
  const [showWhyDetail, setShowWhyDetail] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-primary/50 bg-gradient-to-br from-primary/15 via-card to-violet-600/15 p-6 sm:p-8 shadow-xl space-y-5">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative space-y-5">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white shadow-lg shadow-primary/25">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                  Prescribed Daily Plan
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                TODAY&apos;S BRAIN PLAN
              </h2>
            </div>
          </div>

          {/* Mode Switcher: Quick (3m) | Standard (8m) | Deep (15m) */}
          <div className="inline-flex rounded-xl bg-background/80 border border-border p-1 text-xs font-bold shadow-sm">
            <button
              onClick={() => onDurationChange("quick")}
              className={`px-3 py-1.5 rounded-lg transition ${
                workout.durationMode === "quick"
                  ? "bg-primary text-white shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ⚡ Quick (3m)
            </button>
            <button
              onClick={() => onDurationChange("standard")}
              className={`px-3 py-1.5 rounded-lg transition ${
                workout.durationMode === "standard"
                  ? "bg-primary text-white shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🎯 Standard (8m)
            </button>
            <button
              onClick={() => onDurationChange("deep")}
              className={`px-3 py-1.5 rounded-lg transition ${
                workout.durationMode === "deep"
                  ? "bg-primary text-white shadow-sm font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🔥 Deep (15m)
            </button>
          </div>
        </div>

        {/* Focus Domains & Estimated Time */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3.5 py-1 text-xs font-black text-primary">
            <span>Focus: {workout.focusDomains.join(" + ")}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1 text-xs font-bold text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-foreground" />
            <span>~{workout.estimatedMinutes} Minutes</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 px-3 py-1 text-xs font-black text-violet-600 dark:text-violet-400">
            <span>+{workout.totalXpReward} XP · +{workout.totalCoinsReward} 🪙</span>
          </div>
        </div>

        {/* Why this workout? (Transparent Explanation) */}
        <div className="rounded-2xl border border-border bg-background/90 p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-black text-foreground">
            <span className="flex items-center gap-1.5 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Why this workout today?
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            &ldquo;{workout.reasoningWhy}&rdquo;
          </p>
        </div>

        {/* Primary Action Button CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <Link
            href={`/dashboard/workout?duration=${workout.durationMode}`}
            className="w-full flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 px-6 py-4 sm:py-5 text-base sm:text-lg font-black text-white shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition min-h-[56px] touch-manipulation"
          >
            <Play className="h-6 w-6 fill-white text-white" />
            <span>START TODAY&apos;S WORKOUT ({workout.estimatedMinutes} MIN)</span>
            <ArrowRight className="h-5 w-5 ml-1" />
          </Link>

          <button
            onClick={onSurpriseMe}
            title="Generate an exploratory cross-training workout"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 hover:bg-card px-5 py-4 text-xs font-black text-foreground shadow-sm transition active:scale-95 min-h-[56px]"
          >
            <Shuffle className="h-4 w-4 text-amber-500" />
            <span>Surprise Me 🎲</span>
          </button>
        </div>
      </div>
    </div>
  );
}
