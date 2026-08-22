"use client";

import Link from "next/link";
import { HabitMetricState } from "@/lib/habit-engine";
import { Flame, Brain, Clock, Zap, Play, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface MorningHabitHeroProps {
  habit: HabitMetricState;
}

export function MorningHabitHero({ habit }: MorningHabitHeroProps) {
  const isDone = habit.workout.isCompleted;

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* ─── Top Morning Greeting ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Daily Habit Anchor · Morning Routine
            </p>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight mt-0.5">
            {habit.greeting}. <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">Let&apos;s Wake Up Your Brain.</span>
          </h1>
        </div>

        {/* Date + Streak Shield indicator */}
        <div className="flex items-center gap-2">
          {habit.streakShields > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{habit.streakShields} Streak Shields</span>
            </span>
          )}
        </div>
      </div>

      {/* ─── 4 Core Metric Pills (Mobile & Desktop) ─────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {/* 1. Streak */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-3 sm:p-3.5 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
            <Flame className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-black text-foreground">
                {habit.streak}
              </span>
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">Days</span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate font-medium">
              🔥 {habit.streakMilestone.title}
            </p>
          </div>
        </div>

        {/* 2. Brain Score */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-3 sm:p-3.5 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/20">
            <Brain className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-black text-foreground">
                {habit.brainScore}
              </span>
              <span className="text-[10px] font-extrabold text-violet-600 dark:text-violet-400">
                /100
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate font-medium">
              {habit.scoreDelta >= 0 ? `+${habit.scoreDelta} vs yday` : `${habit.scoreDelta} vs yday`}
            </p>
          </div>
        </div>

        {/* 3. Brain Age */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3 sm:p-3.5 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Clock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-black text-foreground">
                {habit.brainAge}
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Yrs</span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate font-medium">
              -{habit.ageImprovementYears} yrs sharper
            </p>
          </div>
        </div>

        {/* 4. Brain Momentum */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 sm:p-3.5 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-black text-foreground">
                {habit.momentumScore}
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {habit.momentumEmoji}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate font-medium">
              {habit.momentumLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ─── PRIMARY HERO: TODAY'S BRAIN WORKOUT ───────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-violet-600/10 p-4 sm:p-6 shadow-xl">
        {/* Glow effects */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative space-y-4">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/20 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-extrabold text-primary uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" /> Core Habit Action
                </span>
                <span className="text-xs text-muted-foreground">
                  ⏱️ {habit.workout.durationMinutes} Minutes · 5 Activities
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-foreground mt-1">
                TODAY&apos;S BRAIN WORKOUT
              </h2>
            </div>

            {isDone ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 w-fit">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Completed Today ✓</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 w-fit">
                ⚡ Ready to Start
              </span>
            )}
          </div>

          {/* Today's Objective */}
          <div className="rounded-2xl bg-card/80 border border-border/80 p-3 sm:p-3.5 space-y-1">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
              🎯 Today&apos;s Objective:
            </p>
            <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
              &ldquo;{habit.workout.objective}&rdquo;
            </p>
          </div>

          {/* Balanced 5 Activities Preview Badges */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Today&apos;s Balanced Cognitive Mix:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {habit.workout.activities.map((act, i) => (
                <div
                  key={act.id}
                  className="flex items-center gap-2 rounded-xl bg-background/80 border border-border/70 p-2 text-left"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: act.color }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{act.title}</p>
                    <p className="text-[10px] text-muted-foreground">{act.category} · {act.durationSec}s</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Big CTA Button */}
          <div className="pt-2">
            <Link
              href="/dashboard/workout"
              className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm sm:text-base font-black shadow-lg transition-all active:scale-[0.98] touch-manipulation min-h-[52px] ${
                isDone
                  ? "bg-muted text-foreground hover:bg-accent border border-border"
                  : "bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white shadow-primary/30 hover:brightness-110"
              }`}
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>Workout Done · Train Again for Extra XP</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-white text-white" />
                  <span>START TODAY&apos;S WORKOUT (7 MIN)</span>
                  <ArrowRight className="h-5 w-5 ml-1" />
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
