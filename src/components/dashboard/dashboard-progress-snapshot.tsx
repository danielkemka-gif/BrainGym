"use client";

import Link from "next/link";
import {
  getActivePersonalizationProfile,
  generateThinkingPatternProfile,
} from "@/lib/personalization";
import { TrendingUp, ArrowRight, Brain, Target } from "lucide-react";

export function DashboardProgressSnapshot() {
  const profile = getActivePersonalizationProfile();
  const thinking = generateThinkingPatternProfile(profile);

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-black uppercase text-foreground">
            YOUR PROGRESS SNAPSHOT
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

      {/* Score & Archetype summary */}
      <div className="flex items-center justify-between rounded-2xl bg-background/80 border border-border p-3.5">
        <div>
          <span className="text-[10px] font-black uppercase text-muted-foreground block">
            THINKING ARCHETYPE
          </span>
          <span className="text-sm font-black text-foreground">
            {thinking.overallThinkingArchetype}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-black uppercase text-muted-foreground block">
            LEVEL
          </span>
          <span className="text-sm font-black text-primary">
            Level {profile.currentDifficultyLevel}
          </span>
        </div>
      </div>

      {/* 4 Core Outcomes Mini-Indicators */}
      <div className="grid grid-cols-4 gap-2 pt-1 text-center">
        {(["THINK", "SOLVE", "DECIDE", "ADAPT"] as const).map((key) => {
          const item = thinking.outcomeMastery[key];
          return (
            <div key={key} className="rounded-xl border border-border bg-background/50 p-2 space-y-1">
              <span className="text-[10px] font-black text-muted-foreground block">{key}</span>
              <span className="text-xs font-black text-foreground">{item.percentage}%</span>
              <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
