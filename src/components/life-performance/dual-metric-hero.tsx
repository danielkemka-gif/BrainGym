"use client";

import Link from "next/link";
import { LifePerformanceState } from "@/lib/life-performance/types";
import {
  Brain,
  Briefcase,
  Zap,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface DualMetricHeroProps {
  lifeState: LifePerformanceState;
}

export function DualMetricHero({ lifeState }: DualMetricHeroProps) {
  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-5 sm:p-7 shadow-xl space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Personal Brain Fitness &amp; Real-Life Transfer
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
            Dual-Performance Index
          </h2>
        </div>

        <Link
          href="/dashboard/transformation"
          className="inline-flex items-center gap-1 text-xs font-black text-primary hover:underline w-fit"
        >
          <span>View Transformation Report</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 3 Core Pillars: Brain Fitness vs Life Performance vs Momentum */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Pillar 1: In-App Brain Fitness */}
        <div className="rounded-2xl border border-border bg-background/90 p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
              <Brain className="h-3.5 w-3.5" />
              Brain Fitness (In-App)
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              +11% vs Base
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-foreground">
              {lifeState.brainFitnessScore}
            </span>
            <span className="text-xs text-muted-foreground font-bold">/100</span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            Cognitive capacity across memory, speed, logic &amp; executive control.
          </p>
        </div>

        {/* Pillar 2: Real-World Life Performance */}
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/10 p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              Life Performance
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Real-World
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-foreground">
              {lifeState.overallScore}
            </span>
            <span className="text-xs text-muted-foreground font-bold">/100</span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            Real-life application: deep work duration, recall accuracy &amp; focus stamina.
          </p>
        </div>

        {/* Pillar 3: Brain Momentum (Consistency) */}
        <div className="rounded-2xl border border-border bg-background/90 p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-400 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              Brain Momentum
            </span>
            <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md">
              Rhythm
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-foreground">
              {lifeState.brainMomentumScore}
            </span>
            <span className="text-xs text-muted-foreground font-bold">/100</span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            Daily consistency, habit streaks &amp; real-life challenge participation.
          </p>
        </div>
      </div>

      {/* Real-World Transfer Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="rounded-xl bg-card p-3 border border-border space-y-0.5">
          <span className="text-[10px] text-muted-foreground font-bold uppercase block">
            Deep-Work Session
          </span>
          <span className="text-sm font-black text-foreground">
            {lifeState.metrics.deepWorkMinutesAvg.current} mins
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
            +{lifeState.metrics.deepWorkMinutesAvg.deltaPercent}% vs base
          </span>
        </div>

        <div className="rounded-xl bg-card p-3 border border-border space-y-0.5">
          <span className="text-[10px] text-muted-foreground font-bold uppercase block">
            Study Recall (Blind)
          </span>
          <span className="text-sm font-black text-foreground">
            {lifeState.metrics.studyRecallAccuracy.current}%
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
            +{lifeState.metrics.studyRecallAccuracy.deltaPercent}% vs base
          </span>
        </div>

        <div className="rounded-xl bg-card p-3 border border-border space-y-0.5">
          <span className="text-[10px] text-muted-foreground font-bold uppercase block">
            Ideas / Problem
          </span>
          <span className="text-sm font-black text-foreground">
            {lifeState.metrics.ideasPerChallenge.current} ideas
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
            +{lifeState.metrics.ideasPerChallenge.deltaPercent}% vs base
          </span>
        </div>

        <div className="rounded-xl bg-card p-3 border border-border space-y-0.5">
          <span className="text-[10px] text-muted-foreground font-bold uppercase block">
            Distractions Resisted
          </span>
          <span className="text-sm font-black text-foreground">
            {lifeState.metrics.interruptionResilience.current} urges
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
            +{lifeState.metrics.interruptionResilience.deltaPercent}% vs base
          </span>
        </div>
      </div>
    </div>
  );
}
