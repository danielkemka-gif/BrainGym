"use client";

import { HabitMetricState } from "@/lib/habit-engine";
import { Calendar, Zap, TrendingUp, Target, ArrowRight, Brain } from "lucide-react";
import Link from "next/link";

interface WeeklyBrainReportCardProps {
  habit: HabitMetricState;
}

export function WeeklyBrainReportCard({ habit }: WeeklyBrainReportCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">
              Your Brain Week &amp; Momentum
            </h3>
            <p className="text-xs text-muted-foreground">
              Weekly habit consistency and cognitive growth velocity
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/reports"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 min-h-[36px] touch-manipulation"
        >
          <span>Full Weekly Report</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 4 Weekly Stat Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-2xl bg-muted/40 border border-border/80 p-3 text-center space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            Workouts
          </span>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {habit.weeklyReport.workoutsCompleted}/7
          </p>
          <span className="text-[10px] text-emerald-500 font-bold">Consistent</span>
        </div>

        <div className="rounded-2xl bg-muted/40 border border-border/80 p-3 text-center space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            Training Time
          </span>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {habit.weeklyReport.totalTrainingMinutes}m
          </p>
          <span className="text-[10px] text-muted-foreground font-medium">This Week</span>
        </div>

        <div className="rounded-2xl bg-muted/40 border border-border/80 p-3 text-center space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            Best Score
          </span>
          <p className="text-xl sm:text-2xl font-black text-violet-500">
            {habit.weeklyReport.bestBrainScore}
          </p>
          <span className="text-[10px] text-violet-500 font-bold">Peak</span>
        </div>

        <div className="rounded-2xl bg-muted/40 border border-border/80 p-3 text-center space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            Brain Momentum
          </span>
          <p className="text-xl sm:text-2xl font-black text-amber-500">
            {habit.momentumScore}
          </p>
          <span className="text-[10px] text-amber-500 font-bold">{habit.momentumLabel}</span>
        </div>
      </div>

      {/* Momentum Reason Explanation */}
      <div className="rounded-2xl bg-muted/30 border border-border/70 p-3 flex items-start gap-2.5">
        <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Momentum Driver:</strong> {habit.momentumReason}
        </p>
      </div>

      {/* Next Week's Goal Box */}
      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3.5 flex items-center gap-3">
        <Target className="h-5 w-5 text-primary shrink-0" />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Next Week&apos;s Goal:
          </span>
          <p className="text-xs sm:text-sm font-semibold text-foreground">
            &ldquo;{habit.weeklyReport.nextWeekGoal}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
