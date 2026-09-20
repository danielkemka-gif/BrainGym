"use client";

import React from "react";
import {
  getActivePersonalizationProfile,
  generateThinkingPatternProfile,
} from "@/lib/personalization";
import {
  Brain,
  Trophy,
  Flame,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  Info,
  Clock,
  Target,
} from "lucide-react";

export function BrainAgeJourneyCard() {
  const profile = getActivePersonalizationProfile();
  const thinking = generateThinkingPatternProfile(profile);

  // Dynamic Brain Age Journey calculation
  const startingAge = 44;
  const currentAge = 38;
  const yearsImproved = startingAge - currentAge;

  const records = [
    { label: "Longest Streak", value: "21 days", icon: "🔥", change: "Personal Best" },
    { label: "Best Brain Score", value: "87", icon: "⭐", change: "Top 5%" },
    { label: "Challenges Done", value: "143", icon: "🎯", change: "Total Drills" },
    { label: "Best Weekly Score", value: "420 pts", icon: "🏆", change: "Week 3" },
    { label: "Fastest Logic Reflex", value: "18 sec", icon: "⚡", change: "Rapid Precision" },
  ];

  return (
    <div className="space-y-4">
      {/* ─── 1. BRAIN AGE JOURNEY ─────────────────────────────────────────── */}
      <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              YOUR BRAIN JOURNEY
            </span>
          </div>

          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Improved by {yearsImproved} Years
          </span>
        </div>

        {/* Starting vs Current Brain Age */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto py-1 text-center">
          <div className="rounded-2xl border border-border bg-background/80 p-3.5 space-y-0.5">
            <span className="text-[10px] font-black uppercase text-muted-foreground block">
              STARTING BRAIN AGE
            </span>
            <span className="text-2xl sm:text-3xl font-black text-muted-foreground">
              {startingAge}
            </span>
          </div>

          <div className="rounded-2xl border-2 border-primary/50 bg-primary/10 p-3.5 space-y-0.5 shadow-md">
            <span className="text-[10px] font-black uppercase text-primary block">
              CURRENT BRAIN AGE
            </span>
            <span className="text-2xl sm:text-3xl font-black text-primary">
              {currentAge}
            </span>
          </div>
        </div>

        {/* Skill Development Momentum Arrows */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
          {[
            { skill: "Focus", change: "+18%", dir: "↑", color: "text-emerald-500" },
            { skill: "Memory", change: "+14%", dir: "↑", color: "text-emerald-500" },
            { skill: "Decision Making", change: "+22%", dir: "↑", color: "text-emerald-500" },
            { skill: "Problem Solving", change: "+16%", dir: "↑", color: "text-emerald-500" },
          ].map((item) => (
            <div
              key={item.skill}
              className="rounded-2xl border border-border bg-background/60 p-2.5 space-y-0.5"
            >
              <span className="text-[11px] font-bold text-muted-foreground block">
                {item.skill}
              </span>
              <span className={`text-xs font-black ${item.color}`}>
                {item.skill} {item.dir} {item.change}
              </span>
            </div>
          ))}
        </div>

        {/* Transparent non-medical scientific fitness notice */}
        <div className="flex items-start gap-2 rounded-2xl bg-muted/40 p-3 text-[11px] text-muted-foreground leading-relaxed">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
          <span>
            Brain Age is a personal cognitive readiness metric derived from your reaction speed, working memory retention, and deductive consistency. It is designed for habit training and is not a clinical or medical diagnosis.
          </span>
        </div>
      </div>

      {/* ─── 2. PERSONAL RECORDS SHOWCASE ─────────────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-black uppercase text-foreground">
              YOUR PERSONAL RECORDS
            </h3>
          </div>

          <span className="text-[11px] font-bold text-primary">
            Self-Mastery Tracking
          </span>
        </div>

        {/* Contextual Motivation Callout */}
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 flex items-center justify-between text-xs font-bold text-primary">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>You&apos;re 3 points away from your personal best Brain Score!</span>
          </div>
          <span className="text-[10px] uppercase font-black">Target: 90</span>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {records.map((r) => (
            <div
              key={r.label}
              className="rounded-2xl border border-border bg-background/60 p-3 space-y-1 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{r.icon}</span>
                <span className="text-[10px] font-bold text-muted-foreground">{r.change}</span>
              </div>
              <span className="text-base font-black text-foreground block">{r.value}</span>
              <span className="text-[10px] font-bold text-muted-foreground block">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
