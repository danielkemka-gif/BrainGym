"use client";

import Link from "next/link";
import { TrendingUp, Clock, Brain, ArrowRight, Target, Zap, Lightbulb, Compass } from "lucide-react";
import { HabitMetricState } from "@/lib/habit-engine";

interface YourProgressSectionProps {
  habit: HabitMetricState;
}

const DOMAINS = [
  { name: "Memory", score: 82, color: "bg-indigo-500", icon: Brain },
  { name: "Focus", score: 74, color: "bg-amber-500", icon: Target },
  { name: "Reaction Speed", score: 88, color: "bg-violet-500", icon: Zap },
  { name: "Logic & Reasoning", score: 79, color: "bg-emerald-500", icon: Lightbulb },
  { name: "Executive Decisions", score: 85, color: "bg-blue-500", icon: Compass },
];

export function YourProgressSection({ habit }: YourProgressSectionProps) {
  const brainAge = habit.brainAge || 31;
  const ageImprovement = habit.ageImprovementYears || 6;
  const weeklyDays = habit.weeklyReport?.workoutsCompleted || 5;

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              YOUR PROGRESS
            </h3>
            <p className="text-xs text-muted-foreground">
              Cognitive trends and weekly improvement metrics
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/progress"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 min-h-[32px] touch-manipulation"
        >
          <span>Deep Analytics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2 Progress Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Highlight 1: Brain Age Rejuvenation */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Brain Age Indicator
            </span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">{brainAge}</span>
            <span className="text-xs font-bold text-muted-foreground">Years Old</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            ✓ -{ageImprovement} years sharper than baseline
          </p>
        </div>

        {/* Highlight 2: Weekly Activity Loop */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Weekly Habit Goal
            </span>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">{weeklyDays} / 7</span>
            <span className="text-xs font-bold text-muted-foreground">Days Completed</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            On track to achieve this week&apos;s brain target
          </p>
        </div>
      </div>

      {/* Cognitive Domain Mini Bars */}
      <div className="space-y-2.5 pt-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
          5 Core Cognitive Domains
        </span>
        <div className="space-y-2">
          {DOMAINS.map((domain) => (
            <div key={domain.name} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">{domain.name}</span>
                <span className="text-muted-foreground">{domain.score}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${domain.color} rounded-full transition-all duration-500`}
                  style={{ width: `${domain.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
