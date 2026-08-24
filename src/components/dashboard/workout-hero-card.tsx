"use client";

import Link from "next/link";
import { Play, CheckCircle2, Sparkles, ArrowRight, Zap, Trophy, Brain } from "lucide-react";
import { HabitMetricState } from "@/lib/habit-engine";

interface WorkoutHeroCardProps {
  habit: HabitMetricState;
}

export function WorkoutHeroCard({ habit }: WorkoutHeroCardProps) {
  const isDone = habit.workout.isCompleted;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-primary/50 bg-gradient-to-br from-primary/15 via-card to-violet-600/15 p-5 sm:p-7 shadow-xl space-y-4">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative space-y-4">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white shadow-lg shadow-primary/25">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Core Daily Action
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                TODAY&apos;S BRAIN WORKOUT
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-1 text-xs font-black text-violet-600 dark:text-violet-400">
              ⚡ +120 XP · +30 Coins
            </span>
          </div>
        </div>

        {/* Details & Subtitle */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
          <span>🧠 7 rapid in-app challenges</span>
          <span>•</span>
          <span>⏱️ About 5 minutes</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-muted-foreground">Workout Progress</span>
            <span className="text-foreground">{isDone ? "100% Completed" : "0% Completed"}</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-violet-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: isDone ? "100%" : "0%" }}
            />
          </div>
        </div>

        {/* Primary Call To Action */}
        <div className="pt-1">
          <Link
            href="/dashboard/workout"
            className={`w-full inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-base font-black shadow-lg shadow-primary/25 transition-all active:scale-[0.98] touch-manipulation min-h-[54px] ${
              isDone
                ? "bg-muted text-foreground hover:bg-accent border border-border"
                : "bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white hover:brightness-110"
            }`}
          >
            {isDone ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>WORKOUT COMPLETED TODAY ✓ (REPLAY FOR EXTRA XP)</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-white text-white" />
                <span>START WORKOUT (5 MIN)</span>
                <ArrowRight className="h-5 w-5 ml-1" />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
