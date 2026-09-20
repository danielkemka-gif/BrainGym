"use client";

import React, { useEffect, useState } from "react";
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
import { ContextualChallengeVisual } from "@/components/visuals/contextual-challenge-visual";
import { SeeHowOthersThinkModal } from "@/components/personalization/see-how-others-think-modal";
import { PersonaPreviewSwitcher } from "@/components/personalization/persona-preview-switcher";
import { QuickBrainBreakModal } from "@/components/brain-breaks/quick-brain-break-modal";
import {
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  Users,
  Sparkles,
  Clock,
  Compass,
} from "lucide-react";

export function TodaysDailyMissionCard() {
  const [profile, setProfile] = useState<UserPersonalizationProfile | null>(null);
  const [workout, setWorkout] = useState<PersonalizedMentalWorkout | null>(null);
  const [progress, setProgress] = useState<DailyMissionProgress | null>(null);
  const [showOthersThinkModal, setShowOthersThinkModal] = useState(false);
  const [showBrainBreakModal, setShowBrainBreakModal] = useState(false);

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
        <div className="h-24 bg-muted rounded-2xl" />
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
    <div className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-4 sm:p-5 shadow-xl space-y-4 touch-manipulation">
      {/* ─── 1. TOP HEADER & RIGHT CONTEXTUAL VISUAL (20-25% AREA) ─────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-primary">
              TODAY&apos;S CHALLENGE
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight leading-snug">
            {workout.title}
          </h2>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
            <span className="rounded-full bg-background/90 border border-border px-2.5 py-0.5 text-[11px] font-bold text-foreground">
              {workout.coverEmoji} {workout.universalSkill}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {workout.estimatedMinutes} min
            </span>
          </div>
        </div>

        {/* 20-25% Contextual Editorial Micro-Animated Visual */}
        <ContextualChallengeVisual
          category={workout.universalSkill}
          size="md"
          className="shrink-0"
        />
      </div>

      {/* ─── 2. CONCISE SCENARIO PREVIEW ───────────────────────────────────── */}
      <p className="text-xs sm:text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed text-left bg-background/60 rounded-2xl p-2.5 border border-border/50">
        &ldquo;{workout.scenarioNarrative}&rdquo;
      </p>

      {/* ─── 3. ONE DOMINANT PRIMARY CTA BUTTON ─────────────────────────────── */}
      <div>
        <Link
          href="/dashboard/workout"
          className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 sm:py-4 px-6 text-sm sm:text-base font-black shadow-xl transition active:scale-[0.98] min-h-[50px] text-center ${
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

      {/* ─── 4. POST-COMPLETION OR TOMORROW PREVIEW TEASER ──────────────────── */}
      {isAllDone && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-left space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
              TODAY COMPLETE ✓ STREAK PROTECTED
            </span>
            <span className="text-xs font-bold text-foreground">🔥 {profile.streak} Days</span>
          </div>
          
          <div className="rounded-xl bg-background/80 p-2.5 border border-border text-xs space-y-0.5">
            <span className="text-[10px] font-black uppercase text-primary block">
              TOMORROW&apos;S SNEAK PEEK 🧠
            </span>
            <p className="font-bold text-foreground">
              Decision Traps & Biases — &ldquo;Can you spot the cognitive trap before making the choice?&rdquo;
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={() => setShowBrainBreakModal(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>Try a 60-second Brain Break</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─── 5. SUBTLE EXPLORER FOOTER ───────────────────────────────────────── */}
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

      {/* 60-Second Quick Brain Break Modal */}
      <QuickBrainBreakModal
        isOpen={showBrainBreakModal}
        onClose={() => setShowBrainBreakModal(false)}
      />
    </div>
  );
}
