"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { Flame } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  streakDays?: number;
}

export function DashboardHeader({
  userName = "Thinker",
  streakDays = 4,
}: DashboardHeaderProps) {
  const { t } = useI18n();
  const firstName = userName ? userName.split(" ")[0] : t.general_anonymous;

  return (
    <div className="flex items-center justify-between gap-3 pt-1 pb-1">
      <div className="space-y-0.5 min-w-0">
        <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate">
          {t.dashboard_greeting}, {firstName} 👋
        </h1>
        <p className="text-xs text-muted-foreground font-medium truncate">
          {t.dashboard_subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Compact High-Contrast Streak Pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-black text-amber-600 dark:text-amber-400 shadow-xs">
          <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span>{streakDays} {t.general_streak.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
