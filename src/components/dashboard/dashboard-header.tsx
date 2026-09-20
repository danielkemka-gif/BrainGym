"use client";

import { Flame, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  streakDays?: number;
}

export function DashboardHeader({
  userName = "Thinker",
  streakDays = 4,
}: DashboardHeaderProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = userName ? userName.split(" ")[0] : "Thinker";

  return (
    <div className="flex items-center justify-between gap-3 pt-1 pb-1">
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-xs text-muted-foreground font-medium">
          Ready to train your brain today?
        </p>
      </div>

      {/* Compact High-Contrast Streak Pill */}
      <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-black text-amber-600 dark:text-amber-400 shadow-sm shrink-0">
        <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
        <span>{streakDays} DAY STREAK</span>
      </div>
    </div>
  );
}
