"use client";

import { Flame, Zap, Crown, Target } from "lucide-react";
import { HabitMetricState } from "@/lib/habit-engine";

interface QuickStatsRowProps {
  habit: HabitMetricState;
}

export function QuickStatsRow({ habit }: QuickStatsRowProps) {
  const streak = habit.streak || 12;
  const xp = 2450 + (habit.streak * 40);
  const level = Math.max(1, Math.floor(xp / 500) + 1);
  const totalWorkouts = Math.max(1, habit.weeklyReport?.workoutsCompleted * 6 || 37);

  const stats = [
    {
      label: "STREAK",
      value: `${streak} days`,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      label: "TOTAL XP",
      value: xp.toLocaleString(),
      icon: Zap,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      label: "LEVEL",
      value: `Level ${level}`,
      icon: Crown,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "WORKOUTS",
      value: `${totalWorkouts} logged`,
      icon: Target,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`rounded-2xl border ${item.border} ${item.bg} p-3.5 sm:p-4 shadow-sm space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
              <Icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <p className="text-base sm:text-lg lg:text-xl font-black text-foreground tracking-tight truncate">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
