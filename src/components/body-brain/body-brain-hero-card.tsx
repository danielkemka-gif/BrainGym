"use client";

import Link from "next/link";
import { BodyBrainChallenge } from "@/lib/body-brain/types";
import { Activity, Brain, Clock, ShieldCheck, ArrowRight, Sparkles, Footprints } from "lucide-react";

interface BodyBrainHeroCardProps {
  challenge: BodyBrainChallenge;
}

export function BodyBrainHeroCard({ challenge }: BodyBrainHeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/15 via-card to-teal-600/15 p-6 sm:p-7 shadow-xl space-y-4">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-emerald-500/15 blur-2xl" />

      <div className="relative space-y-4">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
              <Footprints className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Body + Brain Integration
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {challenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified Challenge</span>
          </div>
        </div>

        {/* 2-Part Action Split: Physical + Cognitive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
            <span className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
              🏃 Physical Execution
            </span>
            <p className="text-foreground font-semibold leading-snug">
              {challenge.physicalAction}
            </p>
          </div>

          <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
            <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
              🧠 Cognitive Mission
            </span>
            <p className="text-foreground font-semibold leading-snug">
              {challenge.cognitiveAction}
            </p>
          </div>
        </div>

        {/* Verification & Reward Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-1 text-xs font-bold text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-foreground" />
            <span>{challenge.durationMinutes} Min</span>
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black text-primary">
            <span>+{challenge.xpReward} XP · +{challenge.coinReward} 🪙 · +{challenge.momentumImpact} Momentum</span>
          </span>
        </div>

        {/* Start CTA */}
        <div className="pt-1">
          <Link
            href={`/dashboard/physical/${challenge.id}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 px-6 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/25 hover:brightness-110 active:scale-[0.98] transition min-h-[52px]"
          >
            <span>START BODY + BRAIN CHALLENGE ({challenge.durationMinutes} MIN)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
