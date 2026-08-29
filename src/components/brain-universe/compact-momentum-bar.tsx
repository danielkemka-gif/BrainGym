"use client";

import Link from "next/link";
import { Flame, Zap, ArrowRight, Play } from "lucide-react";
import { BrainMomentumState } from "@/lib/brain-momentum-engine";

interface CompactMomentumBarProps {
  momentum: BrainMomentumState;
  streakDays: number;
  workoutDurationMin?: number;
}

export function CompactMomentumBar({
  momentum,
  streakDays,
  workoutDurationMin = 8,
}: CompactMomentumBarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Left: Compact Stats */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-semibold block uppercase leading-none">
              Momentum
            </span>
            <span className="text-sm font-black text-foreground">
              {momentum.score}/100
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
            <Flame className="h-4 w-4 fill-current" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-semibold block uppercase leading-none">
              Streak
            </span>
            <span className="text-sm font-black text-foreground">
              {streakDays} Days
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <Link
          href="/dashboard/progress"
          className="text-[11px] font-bold text-primary hover:underline block sm:hidden"
        >
          View Progress →
        </Link>
      </div>

      {/* Right: Primary Workout CTA */}
      <div className="w-full sm:w-auto flex items-center gap-2">
        <Link
          href="/dashboard/workout"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[42px]"
        >
          <Play className="h-3.5 w-3.5 fill-white text-white" />
          <span>START TODAY&apos;S WORKOUT ({workoutDurationMin} MIN)</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
