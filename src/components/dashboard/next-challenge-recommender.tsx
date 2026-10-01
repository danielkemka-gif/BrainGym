"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  getProceduralRealWorldChallenge,
  COGNITIVE_SKILLS,
  RealWorldChallengeDefinition,
} from "@/lib/real-world-thinking-engine";
import { Sparkles, ArrowRight, Clock, Target } from "lucide-react";

export function NextChallengeRecommender() {
  const { user } = useAuth();
  const { locale, t, isRtl } = useI18n();
  const [nextChallenge, setNextChallenge] = useState<RealWorldChallengeDefinition | null>(null);

  useEffect(() => {
    // Recommend next skill in rotation with difficulty 3
    const daySeed = new Date().getDate();
    const nextSkill = COGNITIVE_SKILLS[(daySeed + 1) % COGNITIVE_SKILLS.length];
    const rec = getProceduralRealWorldChallenge(daySeed + 42, nextSkill, 3, locale);
    setNextChallenge(rec);
  }, [user, locale]);

  if (!nextChallenge) return null;

  const content = nextChallenge.translations[locale] || nextChallenge.translations.en;
  if (!content) return null;

  return (
    <div className={`rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-violet-500/5 p-4 sm:p-5 space-y-3 shadow-sm ${isRtl ? "text-right" : "text-left"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="text-xs font-black uppercase tracking-wider text-foreground">
            {t.next_challenge_title}
          </span>
        </div>

        <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-[10px] font-black text-violet-600 dark:text-violet-400">
          {nextChallenge.skill}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm sm:text-base font-black text-foreground">
          {content.title}
        </h3>
        <p className="text-xs text-muted-foreground font-medium line-clamp-2">
          &ldquo;{content.scenarioNarrative}&rdquo;
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {nextChallenge.estimatedMinutes} min · +{nextChallenge.xpReward} XP
        </span>

        <Link
          href="/dashboard/workout"
          className="inline-flex items-center gap-1 text-xs font-black text-primary hover:underline"
        >
          <span>{t.next_challenge_start}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
