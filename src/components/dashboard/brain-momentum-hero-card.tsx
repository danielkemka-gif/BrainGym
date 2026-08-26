"use client";

import { useState } from "react";
import { BrainMomentumState } from "@/lib/brain-momentum-engine";
import {
  Flame,
  TrendingUp,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface BrainMomentumHeroCardProps {
  momentum: BrainMomentumState;
}

export function BrainMomentumHeroCard({ momentum }: BrainMomentumHeroCardProps) {
  const [showWhyModal, setShowWhyModal] = useState(false);

  const tierColors: Record<string, { badge: string; text: string; bg: string; ring: string }> = {
    peak: {
      badge: "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400",
      text: "text-amber-500",
      bg: "from-amber-500/10 via-card to-orange-500/10",
      ring: "border-amber-500/40",
    },
    strong: {
      badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      text: "text-emerald-500",
      bg: "from-emerald-500/10 via-card to-teal-500/10",
      ring: "border-emerald-500/40",
    },
    good: {
      badge: "bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400",
      text: "text-blue-500",
      bg: "from-blue-500/10 via-card to-indigo-500/10",
      ring: "border-blue-500/40",
    },
    building: {
      badge: "bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400",
      text: "text-purple-500",
      bg: "from-purple-500/10 via-card to-violet-500/10",
      ring: "border-purple-500/40",
    },
    getting_started: {
      badge: "bg-muted text-muted-foreground border-border",
      text: "text-primary",
      bg: "from-primary/10 via-card to-violet-500/10",
      ring: "border-primary/40",
    },
  };

  const style = tierColors[momentum.tier] || tierColors.good;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 ${style.ring} bg-gradient-to-br ${style.bg} p-5 sm:p-6 shadow-lg transition-all`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Score & Label */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              Brain Momentum Engine™
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black ${style.badge}`}>
              {momentum.tierLabel}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              {momentum.score}
              <span className="text-xl sm:text-2xl font-bold text-muted-foreground">/100</span>
            </h2>

            <div className="flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{Math.max(1, momentum.weeklyDelta)} this week</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-lg">
            {momentum.tierDescription}
          </p>
        </div>

        {/* Right Side: Quick Action to see WHY */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => setShowWhyModal(!showWhyModal)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card/80 hover:bg-card px-4 py-2.5 text-xs font-bold text-foreground transition active:scale-95 shadow-sm min-h-[44px]"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Why did my Momentum change?</span>
            {showWhyModal ? <ChevronUp className="h-3.5 w-3.5 ml-0.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Breakdown of Why Momentum Changed */}
      {showWhyModal && (
        <div className="mt-4 pt-4 border-t border-border/60 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between text-xs font-black text-foreground">
            <span>Momentum Factors This Week:</span>
            <span className="text-[10px] text-muted-foreground font-medium">Fitness &amp; Training Metric (Non-Medical)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {momentum.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl bg-background/80 border border-border p-2.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-foreground font-medium text-[11px] leading-snug">{reason}</span>
              </div>
            ))}
          </div>

          {/* 5-Factor Component Sliders */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[10px] font-bold">
            <div className="rounded-xl bg-card p-2 border border-border text-center">
              <span className="text-muted-foreground block text-[9px] uppercase">Consistency</span>
              <span className="text-foreground font-black">{momentum.components.consistency}/25 pts</span>
            </div>
            <div className="rounded-xl bg-card p-2 border border-border text-center">
              <span className="text-muted-foreground block text-[9px] uppercase">Performance</span>
              <span className="text-foreground font-black">{momentum.components.performance}/25 pts</span>
            </div>
            <div className="rounded-xl bg-card p-2 border border-border text-center">
              <span className="text-muted-foreground block text-[9px] uppercase">Improvement</span>
              <span className="text-foreground font-black">{momentum.components.improvement}/20 pts</span>
            </div>
            <div className="rounded-xl bg-card p-2 border border-border text-center">
              <span className="text-muted-foreground block text-[9px] uppercase">Challenge</span>
              <span className="text-foreground font-black">{momentum.components.challenge}/15 pts</span>
            </div>
            <div className="rounded-xl bg-card p-2 border border-border text-center col-span-2 sm:col-span-1">
              <span className="text-muted-foreground block text-[9px] uppercase">Activity</span>
              <span className="text-foreground font-black">{momentum.components.activity}/15 pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
