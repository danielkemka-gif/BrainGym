"use client";

import Link from "next/link";
import {
  getActivePersonalizationProfile,
  generateThinkingPatternProfile,
} from "@/lib/personalization";
import { TrendingUp, ArrowRight, Brain, Target, Award, Calendar } from "lucide-react";

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

      {/* Brain Score & Weekly Progress Strip */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-background/80 border border-border p-3 space-y-0.5">
          <span className="text-[10px] font-black uppercase text-muted-foreground block">
            BRAIN SCORE
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-foreground">72</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">↑ +3 today</span>
          </div>
        </div>

        <div className="rounded-2xl bg-background/80 border border-border p-3 space-y-0.5">
          <span className="text-[10px] font-black uppercase text-muted-foreground block">
            WEEKLY PROGRESS
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-primary">4/5</span>
            <span className="text-xs font-bold text-muted-foreground">Workouts</span>
          </div>
        </div>
      </div>

      {/* 4 Core Outcomes Mini-Indicators */}
      <div className="grid grid-cols-4 gap-2 pt-0.5 text-center">
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
