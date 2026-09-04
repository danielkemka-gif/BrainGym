"use client";

import { useState } from "react";
import Link from "next/link";
import { DailyCurriculumLesson } from "@/lib/daily-curriculum/types";
import { TopicHeroIllustration } from "@/components/dashboard/topic-hero-illustration";
import { AgeTierSelector } from "@/components/dashboard/age-tier-selector";
import {
  AgeTierId,
  getActiveUserAgeTier,
  getAgeAdaptedLesson,
} from "@/lib/age-tiers";
import {
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  Quote,
  Clock,
  Dumbbell,
  HelpCircle,
  Footprints,
  ShieldCheck,
  Brain,
} from "lucide-react";

interface TodaysUnifiedLessonHeroProps {
  lesson: DailyCurriculumLesson;
}

export function TodaysUnifiedLessonHero({ lesson }: TodaysUnifiedLessonHeroProps) {
  const [activeTier, setActiveTier] = useState<AgeTierId>(getActiveUserAgeTier());

  // Adapt the lesson dynamically based on active age tier
  const adapted = getAgeAdaptedLesson(lesson, activeTier);

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header Badge & Age Tier Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-primary">
            TODAY&apos;S BRAINGYM TOPIC
          </span>
          <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
            {lesson.category}
          </span>
        </div>

        {/* INTERACTIVE AGE TIER SELECTOR */}
        <AgeTierSelector
          selectedTier={activeTier}
          onTierChange={(tier) => setActiveTier(tier)}
        />
      </div>

      {/* Main Topic Title & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {lesson.topicEmoji && (
            <span className="text-2xl sm:text-3xl shrink-0 animate-bounce">
              {lesson.topicEmoji}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
            {lesson.topicTitle}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Personalized for <strong className="text-foreground">{adapted.roleTarget}</strong>.
        </p>
      </div>

      {/* ─── VIVID TOPIC GRAPHIC / EMOJI ILLUSTRATION BANNER ──────────────────── */}
      <TopicHeroIllustration
        category={lesson.category}
        topicTitle={lesson.topicTitle}
        topicEmoji={lesson.topicEmoji}
        topicIllustration={lesson.topicIllustration}
      />

      {/* ─── 3-STEP LESSON: CHALLENGE -> SOLUTION -> ACTION ─────────────────── */}
      <div className="space-y-3.5 text-xs sm:text-sm">
        {/* 1. The Challenge (Age-Adapted) */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            1. REAL-LIFE SCENARIO &amp; CHALLENGE ({activeTier} YEARS)
          </span>
          <p className="text-foreground/90 font-medium leading-relaxed">
            {adapted.challenge}
          </p>
        </div>

        {/* 2. The Solution & Brain Mechanism */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-primary fill-primary" />
            2. THE SOLUTION &amp; NEUROSCIENCE MECHANISM
          </span>
          <p className="text-foreground/90 font-medium leading-relaxed">
            {adapted.solution}
          </p>
        </div>

        {/* 3. The Action Rule */}
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
            3. THE PRACTICAL 2-MINUTE ACTION RULE
          </span>
          <p className="text-foreground font-bold leading-relaxed">
            {adapted.actionRule}
          </p>
        </div>

        {/* Cultural Wisdom Proverb */}
        {adapted.culturalWisdom && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1">
                <Quote className="h-3.5 w-3.5" />
                CULTURAL WISDOM
              </span>
              <span>{adapted.culturalWisdom.origin}</span>
            </div>
            <p className="text-xs sm:text-sm font-black text-foreground italic">
              &ldquo;{adapted.culturalWisdom.quote}&rdquo;
            </p>
            <p className="text-[11px] text-muted-foreground">
              {adapted.culturalWisdom.meaning}
            </p>
          </div>
        )}
      </div>

      {/* ─── UNIFIED 2-PHASE WORKOUT PREVIEW & CALL-TO-ACTION ────────────────── */}
      <div className="rounded-3xl border-2 border-primary bg-gradient-to-r from-primary/20 via-card to-violet-600/20 p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span className="text-xs font-black uppercase text-foreground">
              Today&apos;s 2-Phase Training Session
            </span>
          </div>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-0.5 w-fit">
            +100 XP Total Reward
          </span>
        </div>

        {/* 2 Phases Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
            <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              PHASE 1: QUESTIONS (A, B, C, D) · AGE {activeTier}
            </span>
            <p className="text-muted-foreground font-medium">
              {adapted.phase1Questions.length} tailored scenario questions testing today&apos;s lesson.
            </p>
          </div>

          <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Footprints className="h-3.5 w-3.5" />
              PHASE 2: PHYSICAL TASK ({adapted.phase2PhysicalTask.durationMinutes} MINS)
            </span>
            <p className="text-muted-foreground font-medium">
              {adapted.phase2PhysicalTask.title}
            </p>
          </div>
        </div>

        {/* PRIMARY DOMINANT ACTION BUTTON */}
        <div className="pt-2">
          <Link
            href={`/dashboard/workout?ageTier=${activeTier}`}
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white py-4 px-6 text-sm sm:text-base font-black shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition min-h-[54px] touch-manipulation text-center"
          >
            <Zap className="h-5 w-5 fill-white text-white animate-bounce" />
            <span>START TODAY&apos;S WORKOUT ({activeTier} YEARS) ➔</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
