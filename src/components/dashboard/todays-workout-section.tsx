"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Brain, Zap, Target, ShieldCheck, Flame } from "lucide-react";

export function TodaysWorkoutSection() {
  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 p-5 sm:p-7 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white shadow-lg shadow-primary/25">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                100% In-App Interactive Workout
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              Today&apos;s 7-Round Cognitive Routine
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
            🔥 +75 XP · +30 Coins
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        Challenge your brain with 7 rapid mini-games designed to strengthen memory, reaction reflexes, visual logic, and executive decision-making. No external tools needed—everything happens right on your screen.
      </p>

      {/* 4 Mini Round Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="rounded-xl bg-background/80 border border-border p-2.5">
          <span className="font-bold text-foreground">🧠 Visual Memory</span>
          <p className="text-[10px] text-muted-foreground">6s item grid recall</p>
        </div>
        <div className="rounded-xl bg-background/80 border border-border p-2.5">
          <span className="font-bold text-foreground">⚡ Reaction Speed</span>
          <p className="text-[10px] text-muted-foreground">Millisecond reflex</p>
        </div>
        <div className="rounded-xl bg-background/80 border border-border p-2.5">
          <span className="font-bold text-foreground">🧩 Pattern Power</span>
          <p className="text-[10px] text-muted-foreground">Sequence solvers</p>
        </div>
        <div className="rounded-xl bg-background/80 border border-border p-2.5">
          <span className="font-bold text-foreground">🏛️ Decision Room</span>
          <p className="text-[10px] text-muted-foreground">Strategic scenarios</p>
        </div>
      </div>

      <Link
        href="/dashboard/workout"
        className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 px-6 text-sm sm:text-base font-black text-white shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition touch-manipulation min-h-[52px]"
      >
        <Sparkles className="h-5 w-5" />
        <span>START TODAY&apos;S WORKOUT NOW →</span>
      </Link>
    </div>
  );
}
