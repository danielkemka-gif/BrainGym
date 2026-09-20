"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PersonalizedMentalWorkout,
  getTodaysRecommendedWorkout,
  getActivePersonalizationProfile,
  UserPersonalizationProfile,
} from "@/lib/personalization";
import {
  getTodaysDailyMissionProgress,
  DailyMissionProgress,
} from "@/lib/mental-fitness";
import { SeeHowOthersThinkModal } from "@/components/personalization/see-how-others-think-modal";
import { PersonaPreviewSwitcher } from "@/components/personalization/persona-preview-switcher";
import {
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
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
      <div className="rounded-3xl border border-border bg-card p-5 animate-pulse space-y-3">
        <div className="h-5 w-1/3 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-12 bg-muted rounded-xl" />
      </div>
    );
  }

  const completedCount = progress.completedSteps.length;
  const isAllDone = progress.isCompleted || completedCount >= 5;

  // Determine Primary CTA Label
  let ctaLabel = "START CHALLENGE ➔";
  if (isAllDone) {
    ctaLabel = "YOU'RE DONE FOR TODAY ✓";
  } else if (completedCount > 0) {
    ctaLabel = "CONTINUE CHALLENGE ➔";
  }

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-5 sm:p-6 shadow-xl space-y-4 touch-manipulation">
      {/* ─── 1. COMPACT CATEGORY & DURATION HEADER ─────────────────────────── */}
      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-primary">
            TODAY&apos;S CHALLENGE
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="rounded-full bg-background/90 border border-border px-2.5 py-0.5 text-[11px] font-bold text-foreground">
            {workout.coverEmoji} {workout.universalSkill} · ~{workout.estimatedMinutes} min
          </span>
        </div>
      </div>

      {/* ─── 2. CHALLENGE TITLE & CONCISE CONTEXT ───────────────────────────── */}
      <div className="space-y-1.5 text-left">
        <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight leading-snug">
          {workout.title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">
          &ldquo;{workout.scenarioNarrative}&rdquo;
        </p>
      </div>

      {/* ─── 3. REAL-LIFE FOCUS CALLOUT ─────────────────────────────────────── */}
      <div className="rounded-2xl bg-background/80 border border-border/80 p-3 text-xs space-y-1">
        <div className="flex items-center justify-between text-muted-foreground font-semibold text-[11px]">
          <span className="flex items-center gap-1 text-primary font-bold">
            <Target className="h-3.5 w-3.5" />
            {workout.situationAnalysis.cognitivePrinciple}
          </span>
          <span>Level {profile.currentDifficultyLevel}</span>
        </div>
      </div>

      {/* ─── 4. ONE DOMINANT PRIMARY CTA BUTTON ─────────────────────────────── */}
      <div className="pt-1">
        <Link
          href="/dashboard/workout"
          className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-4 px-6 text-sm sm:text-base font-black shadow-xl transition active:scale-[0.98] min-h-[52px] text-center ${
            isAllDone
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/30 hover:brightness-110"
              : "bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white shadow-primary/30 hover:brightness-110"
          }`}
        >
          {isAllDone ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Zap className="h-5 w-5 fill-white animate-bounce" />
          )}
          <span>{ctaLabel}</span>
        </Link>
      </div>

      {/* ─── 5. SUBTLE EXPLORER LINKS (INTERGENERATIONAL & QA TESTER) ────────── */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground border-t border-border/40">
        <button
          onClick={() => setShowOthersThinkModal(true)}
          className="inline-flex items-center gap-1 font-bold text-violet-600 dark:text-violet-400 hover:underline"
        >
          <Users className="h-3.5 w-3.5" />
          <span>See How Others Think</span>
        </button>

        <PersonaPreviewSwitcher variant="header_badge" />
      </div>

      {/* See How Others Think Modal */}
      <SeeHowOthersThinkModal
        isOpen={showOthersThinkModal}
        onClose={() => setShowOthersThinkModal(false)}
      />
    </div>
  );
}
