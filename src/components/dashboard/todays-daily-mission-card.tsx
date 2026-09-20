"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PersonalizedMentalWorkout,
  getTodaysRecommendedWorkout,
  getActivePersonalizationProfile,
  UserPersonalizationProfile,
  CORE_MENTAL_FITNESS_AREAS,
} from "@/lib/personalization";
import {
  getTodaysDailyMissionProgress,
  DailyMissionProgress,
} from "@/lib/mental-fitness";
import { TopicHeroIllustration } from "@/components/dashboard/topic-hero-illustration";
import { SeeHowOthersThinkModal } from "@/components/personalization/see-how-others-think-modal";
import { PersonaPreviewSwitcher } from "@/components/personalization/persona-preview-switcher";
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
  Brain,
  HelpCircle,
  Users,
  Award,
} from "lucide-react";

export function TodaysDailyMissionCard() {
  const [profile, setProfile] = useState<UserPersonalizationProfile | null>(null);
  const [workout, setWorkout] = useState<PersonalizedMentalWorkout | null>(null);
  const [progress, setProgress] = useState<DailyMissionProgress | null>(null);
  const [showOthersThinkModal, setShowOthersThinkModal] = useState(false);

  useEffect(() => {
    const userProfile = getActivePersonalizationProfile();
    setProfile(userProfile);
    setWorkout(getTodaysRecommendedWorkout(userProfile));
    setProgress(getTodaysDailyMissionProgress());
  }, []);

  if (!workout || !progress || !profile) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-muted rounded-xl mx-auto" />
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="h-12 bg-muted rounded-xl" />
      </div>
    );
  }

  const completedCount = progress.completedSteps.length;
  const isAllDone = progress.isCompleted || completedCount >= 5;

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-violet-600/15 p-5 sm:p-7 shadow-2xl space-y-5 touch-manipulation">
      {/* ─── 0. TOP QA & INTERGENERATIONAL CONTROLS (TESTING / EXPLORATION) ──── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <PersonaPreviewSwitcher />
        <button
          onClick={() => setShowOthersThinkModal(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-black text-violet-600 dark:text-violet-300 hover:bg-violet-500/20 transition active:scale-95 touch-manipulation"
        >
          <Users className="h-3.5 w-3.5" />
          <span>See How Others Think ➔</span>
        </button>
      </div>

      {/* ─── 1. UNIFIED CENTRALIZED HEADER (NO AGE LABELS) ──────────────────── */}
      <div className="flex flex-col items-center justify-center text-center gap-1.5 border-b border-border/60 pb-3">
        <div className="inline-flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-primary">
            TODAY&apos;S MENTAL WORKOUT
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-foreground bg-background/80 border border-border px-3 py-1 rounded-full shadow-sm">
            🧠 {workout.universalSkill} · Level {profile.currentDifficultyLevel} · ~{workout.estimatedMinutes} Mins
          </span>
        </div>
      </div>

      {/* ─── 2. MEDIUM-SIZE GRAPHICS BANNER ─────────────────────────────────── */}
      <div className="max-w-md mx-auto w-full">
        <TopicHeroIllustration
          category={workout.universalSkill as any}
          topicTitle={workout.title}
          topicEmoji={workout.coverEmoji}
          topicIllustration={workout.coverIllustration}
        />
      </div>

      {/* ─── 3. BIGGER TITLE AFTER THE GRAPHICS (PROPERLY CENTRALIZED) ──────── */}
      <div className="text-center space-y-1.5 max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
          {workout.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          {isAllDone
            ? "You completed today's mental fitness workout! Real-life assignment unlocked."
            : "Train universal cognitive abilities in your personalized real-world context."}
        </p>
      </div>

      {/* ─── 4. TODAY'S REAL-LIFE DILEMMA PROPERLY EXPLAINED ─────────────────── */}
      <div className="rounded-2xl border-2 border-primary/25 bg-background/95 p-4 sm:p-5 space-y-3 shadow-md text-left">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <Target className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            REAL-LIFE SITUATION ANALYSIS
          </span>
        </div>

        {/* Narrative & Context Breakdown */}
        <div className="space-y-2 text-xs sm:text-sm">
          <p className="text-foreground font-medium leading-relaxed">
            &ldquo;{workout.scenarioNarrative}&rdquo;
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
            <div className="rounded-xl bg-muted/60 p-2.5 border-l-2 border-primary space-y-0.5">
              <span className="text-[10px] font-black uppercase text-foreground block">
                🧩 CORE DILEMMA:
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {workout.situationAnalysis.coreDilemma}
              </p>
            </div>
            <div className="rounded-xl bg-muted/60 p-2.5 border-l-2 border-violet-500 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-foreground block">
                💡 COGNITIVE PRINCIPLE:
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {workout.situationAnalysis.cognitivePrinciple}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5. "YOUR LIFE CHALLENGE" (REAL-LIFE ASSIGNMENT PREVIEW) ─────────── */}
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-2 text-left">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            YOUR LIFE CHALLENGE FOR TODAY
          </span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-foreground">
          {workout.yourLifeChallenge.title}:
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          &ldquo;{workout.yourLifeChallenge.instruction}&rdquo;
        </p>
      </div>

      {/* ─── 6. 5-STEP PROGRESS STEPPER ─────────────────────────────────────── */}
      <div className="space-y-2 pt-1 max-w-xl mx-auto">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-muted-foreground">Workout Progress</span>
          <span className={isAllDone ? "text-emerald-500 font-black" : "text-primary font-black"}>
            {isAllDone ? "5/5 Completed 🎉" : `${completedCount}/5 Steps Completed`}
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
            { step: 2, label: "Decide" },
            { step: 3, label: "Brain Drill" },
            { step: 4, label: "Life Task" },
            { step: 5, label: "Journal" },
          ].map((s) => {
            const isDone = progress.completedSteps.includes(s.step);
            return (
              <div
                key={s.step}
                className={`rounded-xl border py-1 px-0.5 text-[10px] font-black transition ${
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

      {/* ─── 7. SINGLE DOMINANT ACTION BUTTON ────────────────────────────────── */}
      <div className="pt-2 max-w-xl mx-auto">
        {isAllDone ? (
          <Link
            href="/dashboard/workout"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 text-sm sm:text-base font-black shadow-xl shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition min-h-[54px] text-center"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>TODAY&apos;S WORKOUT COMPLETE (REVIEW / SHARE) ➔</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/workout"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white py-4 px-6 text-sm sm:text-base font-black shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition min-h-[54px] text-center"
          >
            <Zap className="h-5 w-5 fill-white animate-bounce" />
            <span>{completedCount > 0 ? "CONTINUE TODAY'S MENTAL WORKOUT ➔" : "START TODAY'S MENTAL WORKOUT ➔"}</span>
          </Link>
        )}
      </div>

      {/* See How Others Think Modal */}
      <SeeHowOthersThinkModal
        isOpen={showOthersThinkModal}
        onClose={() => setShowOthersThinkModal(false)}
      />
    </div>
  );
}
