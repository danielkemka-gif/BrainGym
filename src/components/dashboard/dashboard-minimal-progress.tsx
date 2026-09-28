"use client";

import React from "react";
import Link from "next/link";
import {
  getActivePersonalizationProfile,
  generateThinkingPatternProfile,
} from "@/lib/personalization";
import { Flame, Sparkles, Brain, ArrowRight, TrendingUp } from "lucide-react";

interface DashboardMinimalProgressProps {
  totalXp?: number;
  streakDays?: number;
}

export function DashboardMinimalProgress({
  totalXp = 1450,
  streakDays = 7,
}: DashboardMinimalProgressProps) {
  const profile = getActivePersonalizationProfile();
  const thinking = generateThinkingPatternProfile(profile);

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-black uppercase text-foreground">
            YOUR PROGRESS
          </span>
        </div>

        <Link
          href="/dashboard/progress"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <span>View full progress</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* 3 Dominant Clean Progress Metrics */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        {/* Metric 1: Streak */}
        <div className="rounded-2xl bg-background/80 border border-border p-3 space-y-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-center gap-1">
            <Flame className="h-3 w-3 text-amber-500 fill-amber-500" />
            STREAK
          </span>
          <span className="text-base sm:text-lg font-black text-foreground block">
            {streakDays || profile.streakDays} Days
          </span>
        </div>

        {/* Metric 2: Total XP */}
        <div className="rounded-2xl bg-background/80 border border-border p-3 space-y-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            TOTAL XP
          </span>
          <span className="text-base sm:text-lg font-black text-primary block">
            {totalXp.toLocaleString()}
          </span>
        </div>

        {/* Metric 3: Brain Score / Age */}
        <div className="rounded-2xl bg-background/80 border border-border p-3 space-y-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-center gap-1">
            <Brain className="h-3 w-3 text-emerald-500" />
            BRAIN SCORE
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 block">
            72 ↑
          </span>
        </div>
      </div>
    </div>
  );
}
