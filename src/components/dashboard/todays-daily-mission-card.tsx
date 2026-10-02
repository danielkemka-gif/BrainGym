"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  getTodaysRealWorldChallenge,
  RealWorldChallengeDefinition,
  LocalizedChallengeContent,
} from "@/lib/real-world-thinking-engine";
import {
  getActivePersonalizationProfile,
  UserPersonalizationProfile,
} from "@/lib/personalization";
import {
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function TodaysDailyMissionCard() {
  const { user } = useAuth();
  const { locale, t, isRtl } = useI18n();

  const [profile, setProfile] = useState<UserPersonalizationProfile | null>(null);
  const [challenge, setChallenge] = useState<RealWorldChallengeDefinition | null>(null);
  const [content, setContent] = useState<LocalizedChallengeContent | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userProfile = getActivePersonalizationProfile();
    setProfile(userProfile);

    getTodaysRealWorldChallenge(user?.id, 2, locale).then(
      ({ challenge: assignedChallenge, isCompletedToday }) => {
        setChallenge(assignedChallenge);
        const localized = assignedChallenge.translations[locale] || assignedChallenge.translations.en;
        setContent(localized || null);
        setIsCompleted(isCompletedToday);
        setLoading(false);
      }
    );
  }, [user, locale]);

  if (loading || !challenge || !content || !profile) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 animate-pulse space-y-3">
        <div className="h-4 w-1/3 bg-muted rounded-lg" />
        <div className="h-16 bg-muted rounded-xl" />
        <div className="h-10 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-3.5 sm:p-4 shadow-md space-y-3 touch-manipulation transition-all hover:border-primary/50 ${
        isRtl ? "text-right" : "text-left"
      }`}
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t.challenge_todays_title || "TODAY'S WORKOUT"}
          </span>
          <span className="rounded-lg bg-background/80 border border-border px-2 py-0.5 text-[10px] font-bold text-foreground">
            {challenge.skill}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground shrink-0">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary" />
            {challenge.estimatedMinutes} min
          </span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400">+{challenge.xpReward} XP</span>
        </div>
      </div>

      {/* Challenge Title */}
      <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight leading-snug line-clamp-2">
        {content.title}
      </h2>

      {/* Concise 2-Line Scenario Narrative */}
      <div className="rounded-xl bg-background/70 p-2.5 sm:p-3 border border-border/60">
        <p className="text-xs text-foreground/90 font-medium line-clamp-2 leading-relaxed">
          &ldquo;{content.scenarioNarrative}&rdquo;
        </p>
      </div>

      {/* Start Workout Button */}
      <div>
        <Link
          href="/dashboard/workout"
          className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-5 text-xs sm:text-sm font-black shadow-md transition-all duration-200 active:scale-[0.98] min-h-[48px] text-center touch-manipulation ${
            isCompleted
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
              <span>{t.challenge_completed_cta || "Workout Completed"}</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 fill-current" />
              <span>{t.challenge_start_cta || "START WORKOUT"}</span>
              <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
