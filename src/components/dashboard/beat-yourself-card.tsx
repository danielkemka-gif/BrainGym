"use client";

import { HabitMetricState } from "@/lib/habit-engine";
import { TrendingUp, Trophy, ArrowRight, Brain, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface BeatYourselfCardProps {
  habit: HabitMetricState;
}

export function BeatYourselfCard({ habit }: BeatYourselfCardProps) {
  const isPB = habit.scoreDelta > 0;

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 space-y-4 shadow-sm">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground flex items-center gap-2">
              <span>Beat Yourself · Daily Progress</span>
              {isPB && (
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  🔥 NEW PERSONAL BEST!
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              Your primary competition is your previous self. Consistent training makes you sharper every day.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/progress"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 min-h-[36px] touch-manipulation"
        >
          <span>Deep Analytics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Comparison Scoreboard */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 rounded-2xl bg-muted/40 border border-border/80 p-3 sm:p-4 text-center">
        {/* Yesterday */}
        <div className="space-y-0.5">
          <span className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground">
            Yesterday
          </span>
          <p className="text-xl sm:text-2xl font-black text-muted-foreground">
            {habit.yesterdayScore}
          </p>
          <span className="text-[10px] text-muted-foreground font-medium">Baseline</span>
        </div>

        {/* Today */}
        <div className="space-y-0.5 rounded-xl bg-violet-500/10 border border-violet-500/20 py-1.5 px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase text-violet-600 dark:text-violet-400">
            Today&apos;s Score
          </span>
          <p className="text-2xl sm:text-3xl font-black text-violet-600 dark:text-violet-400">
            {habit.brainScore}
          </p>
          <span className="text-[10px] font-bold text-violet-500">
            {habit.scoreDelta >= 0 ? `+${habit.scoreDelta} Pts` : `${habit.scoreDelta} Pts`}
          </span>
        </div>

        {/* Improvement Delta */}
        <div className="space-y-0.5">
          <span className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground">
            Improvement
          </span>
          <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-black text-emerald-500">
            <TrendingUp className="h-5 w-5" />
            <span>+{Math.max(1, habit.scoreDelta)}</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            Sharper
          </span>
        </div>
      </div>

      {/* Habit Anchor Message */}
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-emerald-500 shrink-0" />
        <p className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          {isPB
            ? `«You scored ${habit.brainScore} today, beating yesterday's score by +${habit.scoreDelta} points! Keep the streak alive tomorrow.»`
            : `«You scored ${habit.brainScore} today. Can you beat ${habit.yesterdayScore + 1} tomorrow morning?»`}
        </p>
      </div>

      {/* 5 Core Domain Breakdown */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span className="uppercase tracking-wider">Cognitive Category Breakdown</span>
          <span>Target: 90+ Master</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {habit.categoryScores.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-border/80 bg-background/80 p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.label}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-foreground">{cat.score}</span>
                  <span className="text-[10px] text-emerald-500 font-bold">+{cat.delta}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.score}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
