"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  RealLifeScenario,
  getTodaysPersonalizedScenario,
  getActiveUserRole,
  getTodaysDailyMissionProgress,
  DailyMissionProgress,
} from "@/lib/mental-fitness";
import { TopicHeroIllustration } from "@/components/dashboard/topic-hero-illustration";
import {
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  Trophy,
  BookOpen,
  Flame,
  Dumbbell,
  Compass,
} from "lucide-react";

export function TodaysDailyMissionCard() {
  const [scenario, setScenario] = useState<RealLifeScenario | null>(null);
  const [progress, setProgress] = useState<DailyMissionProgress | null>(null);

  useEffect(() => {
    const role = getActiveUserRole();
    setScenario(getTodaysPersonalizedScenario(role));
    setProgress(getTodaysDailyMissionProgress());
  }, []);

  if (!scenario || !progress) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="h-12 bg-muted rounded-xl" />
      </div>
    );
  }

  const completedCount = progress.completedSteps.length;
  const isAllDone = progress.isCompleted || completedCount >= 5;

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-violet-600/15 p-6 sm:p-8 shadow-2xl space-y-5 touch-manipulation">
      {/* Top Header Badge & Role Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-primary">
            TODAY&apos;S BRAINGYM MISSION
          </span>
        </div>

        <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-0.5">
          {scenario.roleCategory} Edition · ~{scenario.estimatedMinutes} Mins
        </span>
      </div>

      {/* Main Title & Teaser */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl shrink-0">{scenario.coverEmoji}</span>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug">
            {scenario.title}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          {isAllDone
            ? "You completed today's 5-step real-life mental fitness mission!"
            : "5 steps • About 10–15 minutes • Train your mind for real-life decisions."}
        </p>
      </div>

      {/* Visual Topic Illustration Banner */}
      <TopicHeroIllustration
        category={scenario.topicCategory as any}
        topicTitle={scenario.title}
        topicEmoji={scenario.coverEmoji}
        topicIllustration={scenario.coverIllustration}
      />

      {/* ─── SCENARIO PREVIEW BOX ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-primary/20 bg-background/95 p-4 sm:p-5 space-y-1.5 shadow-sm">
        <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5">
          <Target className="h-4 w-4" />
          TODAY&apos;S REAL-LIFE DILEMMA
        </span>
        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed line-clamp-3">
          &ldquo;{scenario.scenarioNarrative}&rdquo;
        </p>
      </div>

      {/* ─── 5-STEP PROGRESS BAR & STEPPER ───────────────────────────────────── */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-muted-foreground">Today&apos;s Mission Progress</span>
          <span className={isAllDone ? "text-emerald-500 font-black" : "text-primary font-black"}>
            {isAllDone ? "5/5 Completed 🎉" : `${completedCount}/5 Steps (${Math.round((completedCount / 5) * 100)}%)`}
          </span>
        </div>

        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-violet-600 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(5, (completedCount / 5) * 100)}%` }}
          />
        </div>

        {/* 5-Step Checkmarks */}
        <div className="grid grid-cols-5 gap-1 pt-1 text-center">
          {[
            { step: 1, label: "Scenario" },
            { step: 2, label: "Decision" },
            { step: 3, label: "Challenge" },
            { step: 4, label: "Task" },
            { step: 5, label: "Journal" },
          ].map((s) => {
            const isDone = progress.completedSteps.includes(s.step);
            return (
              <div
                key={s.step}
                className={`rounded-xl border py-1.5 px-1 text-[10px] font-black transition ${
                  isDone
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-background/50 text-muted-foreground"
                }`}
              >
                <span>{isDone ? "✓ " : ""}{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SINGLE DOMINANT ACTION BUTTON ──────────────────────────────────── */}
      <div className="pt-2">
        {isAllDone ? (
          <div className="space-y-2">
            <Link
              href="/dashboard/workout"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 text-sm sm:text-base font-black shadow-xl shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition min-h-[54px] text-center"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>TODAY&apos;S MISSION COMPLETE (REVIEW / SHARE CARD) ➔</span>
            </Link>
          </div>
        ) : (
          <Link
            href="/dashboard/workout"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white py-4 px-6 text-sm sm:text-base font-black shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition min-h-[54px] text-center"
          >
            <Zap className="h-5 w-5 fill-white animate-bounce" />
            <span>{completedCount > 0 ? "CONTINUE TODAY'S BRAIN WORKOUT ➔" : "START TODAY'S BRAIN WORKOUT ➔"}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
