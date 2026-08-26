"use client";

import Link from "next/link";
import { Flame, Target, TrendingUp, ArrowRight, Trophy } from "lucide-react";
import { BrainMomentumState, UserCognitiveProfile } from "@/lib/brain-momentum-engine";

interface SmallProgressSummaryProps {
  momentum: BrainMomentumState;
  profile: UserCognitiveProfile;
}

export function SmallProgressSummary({
  momentum,
  profile,
}: SmallProgressSummaryProps) {
  const weeklyWorkouts = profile.workoutsCompletedThisWeek;
  const weeklyGoal = 5;
  const progressPct = Math.min(100, Math.round((weeklyWorkouts / weeklyGoal) * 100));

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
          Training Momentum &amp; Consistency
        </span>
        <Link
          href="/dashboard/progress"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <span>View Deep Analytics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Streak */}
        <div className="flex items-center gap-3 rounded-2xl bg-background/80 border border-border p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <Flame className="h-5 w-5 fill-current" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
              Active Streak
            </span>
            <span className="text-sm font-black text-foreground">
              {profile.streak} Days Running
            </span>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="flex items-center gap-3 rounded-2xl bg-background/80 border border-border p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Target className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                Weekly Target
              </span>
              <span className="text-[11px] font-black text-foreground">
                {weeklyWorkouts}/{weeklyGoal} Sessions
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Momentum Velocity */}
        <div className="flex items-center gap-3 rounded-2xl bg-background/80 border border-border p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
              Momentum Trend
            </span>
            <span className="text-sm font-black text-foreground">
              {momentum.score} ({momentum.tierLabel})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
