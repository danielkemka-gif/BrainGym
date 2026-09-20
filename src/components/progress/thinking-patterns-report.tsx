"use client";

import { useEffect, useState } from "react";
import {
  generateThinkingPatternProfile,
  UserThinkingProfile,
  getActivePersonalizationProfile,
} from "@/lib/personalization";
import {
  Brain,
  Sparkles,
  Target,
  CheckCircle2,
  Compass,
  ArrowRight,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export function ThinkingPatternsReport() {
  const [thinkingProfile, setThinkingProfile] = useState<UserThinkingProfile | null>(null);

  useEffect(() => {
    const userProf = getActivePersonalizationProfile();
    setThinkingProfile(generateThinkingPatternProfile(userProf));
  }, []);

  if (!thinkingProfile) return null;

  return (
    <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-5 sm:p-7 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>BRAINGYM PERFORMANCE INSIGHTS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
            Discover How You Think
          </h2>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit">
          Observable Cognitive Practice Patterns
        </span>
      </div>

      {/* Archetype Banner */}
      <div className="rounded-2xl border border-primary/40 bg-background/90 p-5 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            PRIMARY THINKING ARCHETYPE
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> High Decision Stability
          </span>
        </div>
        <h3 className="text-xl font-black text-foreground">
          {thinkingProfile.overallThinkingArchetype}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {thinkingProfile.archetypeDescription}
        </p>
      </div>

      {/* 4 Core Outcomes Mastery Grid */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase text-foreground">
          Core Outcome Mastery (THINK · SOLVE · DECIDE · ADAPT)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["THINK", "SOLVE", "DECIDE", "ADAPT"] as const).map((key) => {
            const data = thinkingProfile.outcomeMastery[key];
            return (
              <div
                key={key}
                className="rounded-2xl border border-border bg-card p-3.5 space-y-2 text-center"
              >
                <span className="text-xs font-black text-foreground">{key}</span>
                <div className="text-2xl font-black text-primary">
                  {data.percentage}%
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-violet-600 transition-all duration-500"
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground block">
                  Level {data.level} Complexity
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Observed Thinking Traits */}
      <div className="space-y-3">
        <span className="text-xs font-black uppercase text-foreground">
          Observed Problem-Solving Traits
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {thinkingProfile.activeTraits.map((trait) => (
            <div
              key={trait.id}
              className="rounded-2xl border border-border bg-background/80 p-4 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-foreground">
                  {trait.title}
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {trait.strengthLevel}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                🔍 {trait.observedSignal}
              </p>

              <div className="pt-2 border-t border-border/50 text-[11px] text-foreground font-medium flex items-start gap-1.5">
                <Target className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span><strong>Real-World Application:</strong> {trait.realWorldApplication}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer / Responsible Communication Banner */}
      <div className="rounded-xl bg-muted/60 p-3.5 text-[11px] text-muted-foreground leading-relaxed border-l-2 border-primary space-y-0.5">
        <span className="font-bold text-foreground block">
          🛡️ Responsible Cognitive Tracking:
        </span>
        <p>
          These insights reflect your decision patterns and practice consistency within BrainGym exercises. They are designed to foster thoughtful self-awareness, not clinical diagnoses.
        </p>
      </div>
    </div>
  );
}
