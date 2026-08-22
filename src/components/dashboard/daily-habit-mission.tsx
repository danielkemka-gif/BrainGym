"use client";

import { useState } from "react";
import { HabitMetricState } from "@/lib/habit-engine";
import { Target, Trophy, Coins, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DailyHabitMissionProps {
  habit: HabitMetricState;
}

export function DailyHabitMission({ habit }: DailyHabitMissionProps) {
  const [claimed, setClaimed] = useState(habit.dailyMission.isClaimed);
  const isDone = habit.dailyMission.isCompleted;

  const handleClaim = () => {
    setClaimed(true);
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-orange-500/10 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Today&apos;s Single Mission
            </span>
            <h3 className="text-sm sm:text-base font-black text-foreground">
              {habit.dailyMission.title}
            </h3>
          </div>
        </div>

        {/* Reward Badges */}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-lg bg-violet-500/15 px-2 py-1 text-[11px] font-extrabold text-violet-600 dark:text-violet-400">
            <Trophy className="h-3 w-3" /> +{habit.dailyMission.xpReward} XP
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2 py-1 text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
            <Coins className="h-3 w-3" /> +{habit.dailyMission.coinReward}
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {habit.dailyMission.description}
      </p>

      {/* Action / Claim button */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="flex-1 max-w-[200px] h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: isDone ? "100%" : "0%" }}
          />
        </div>

        {claimed ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
            <CheckCircle2 className="h-4 w-4" /> Mission Completed &amp; Claimed ✓
          </span>
        ) : isDone ? (
          <button
            onClick={handleClaim}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition touch-manipulation min-h-[38px]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Claim Rewards (+{habit.dailyMission.xpReward} XP)</span>
          </button>
        ) : (
          <Link
            href="/dashboard/workout"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline min-h-[36px] touch-manipulation"
          >
            <span>Start Workout to Complete</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
