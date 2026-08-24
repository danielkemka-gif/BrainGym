"use client";

import Link from "next/link";
import { Play, CheckCircle2, ArrowRight, Brain, Sparkles, Clock, Target } from "lucide-react";
import { HabitMetricState } from "@/lib/habit-engine";

interface TodaysBrainGameCardProps {
  habit: HabitMetricState;
}

export function TodaysBrainGameCard({ habit }: TodaysBrainGameCardProps) {
  const isDone = habit.workout.isCompleted;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-6 sm:p-8 shadow-xl transition-all hover:border-primary/60">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative space-y-5">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white shadow-lg shadow-primary/25">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                  Activity 1 · In-App Training
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                TODAY&apos;S BRAIN GAME
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-violet-500/15 border border-violet-500/30 px-3.5 py-1 text-xs font-black text-violet-600 dark:text-violet-400">
              ⚡ +120 XP
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          7 interactive cognitive rounds to train your working memory, pattern logic, decision making, and mental reaction speed.
        </p>

        {/* Key Info Meta Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-bold">
          <div className="flex items-center gap-2 rounded-xl bg-background/80 border border-border p-3">
            <Target className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Skill</span>
              <span className="text-foreground font-black">Memory &amp; Logic</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-background/80 border border-border p-3">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Level</span>
              <span className="text-foreground font-black">Daily Adaptive</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-background/80 border border-border p-3">
            <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Est. Time</span>
              <span className="text-foreground font-black">~5 Minutes</span>
            </div>
          </div>
        </div>

        {/* Big Action CTA Button */}
        <div className="pt-2">
          <Link
            href="/dashboard/workout"
            className={`w-full inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 sm:py-5 text-base sm:text-lg font-black shadow-lg shadow-primary/25 transition-all active:scale-[0.98] touch-manipulation min-h-[56px] ${
              isDone
                ? "bg-muted text-foreground hover:bg-accent border border-border"
                : "bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white hover:brightness-110"
            }`}
          >
            {isDone ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <span>BRAIN GAME COMPLETED TODAY ✓ (REPLAY)</span>
                <ArrowRight className="h-5 w-5 ml-1" />
              </>
            ) : (
              <>
                <Play className="h-6 w-6 fill-white text-white" />
                <span>START BRAIN GAME (5 MIN)</span>
                <ArrowRight className="h-6 w-6 ml-1" />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
