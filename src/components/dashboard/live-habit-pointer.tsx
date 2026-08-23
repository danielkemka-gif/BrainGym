"use client";

import { HabitMetricState } from "@/lib/habit-engine";
import { Compass, ArrowRight, CheckCircle2, Play, Target, Sparkles, Flame } from "lucide-react";
import Link from "next/link";

interface LiveHabitPointerProps {
  habit: HabitMetricState;
}

export function LiveHabitPointer({ habit }: LiveHabitPointerProps) {
  const isWorkoutDone = habit.workout.isCompleted;
  const isMissionDone = habit.dailyMission.isCompleted;
  const isMissionClaimed = habit.dailyMission.isClaimed;

  // Compute live step
  let currentStep = 1;
  let stepTitle = "Step 1 of 3: Complete Today's Brain Workout";
  let stepDescription = "Start your 7-minute daily workout to establish your baseline score, extend your streak, and activate brain momentum.";
  let actionLabel = "Start Daily Workout Now";
  let actionHref = "/dashboard/workout";
  let icon = Play;

  if (isWorkoutDone && !isMissionClaimed) {
    currentStep = 2;
    stepTitle = "Step 2 of 3: Claim Your Daily Habit Rewards";
    stepDescription = "Great work finishing your workout! Claim your +75 XP and +30 Coins from today's mission.";
    actionLabel = "Claim Habit Mission Reward";
    actionHref = "#daily-mission";
    icon = Target;
  } else if (isWorkoutDone && isMissionClaimed) {
    currentStep = 3;
    stepTitle = "Step 3 of 3: Core Habit Complete! Explore Optional Drills";
    stepDescription = "Your brain is trained for today! You can review your Brain Age progress or try a 1v1 Brain Duel with fellow thinkers.";
    actionLabel = "Try a 1v1 Brain Duel (Optional)";
    actionHref = "/dashboard/challenges";
    icon = Sparkles;
  }

  const IconComponent = icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-r from-indigo-500/15 via-card to-purple-500/15 p-3.5 sm:p-4 shadow-md">
      {/* Live Animated Beacon Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30">
            <Compass className="h-5 w-5 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                👉 WHAT TO DO NEXT (LIVE GUIDE)
              </span>
              <span className="text-[11px] font-bold text-foreground">
                {stepTitle}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {stepDescription}
            </p>
          </div>
        </div>

        {/* 1-Tap Action Button */}
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-indigo-500/25 active:scale-95 transition-all touch-manipulation min-h-[44px] shrink-0"
        >
          <IconComponent className="h-4 w-4" />
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
