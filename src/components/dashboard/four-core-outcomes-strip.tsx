"use client";

import { useState } from "react";
import {
  FOUR_CORE_OUTCOMES,
  CoreOutcomeDefinition,
  MASTER_VALUE_PROPOSITION,
} from "@/lib/personalization";
import {
  Brain,
  Puzzle,
  Scale,
  Waves,
  ArrowRight,
  Sparkles,
  Target,
  X,
  Compass,
  CheckCircle2,
} from "lucide-react";

export function FourCoreOutcomesStrip() {
  const [selectedOutcome, setSelectedOutcome] = useState<CoreOutcomeDefinition | null>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case "THINK":
        return <Brain className="h-5 w-5 text-indigo-500" />;
      case "SOLVE":
        return <Puzzle className="h-5 w-5 text-emerald-500" />;
      case "DECIDE":
        return <Scale className="h-5 w-5 text-blue-500" />;
      case "ADAPT":
        return <Waves className="h-5 w-5 text-cyan-500" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        {/* Header & Core Question */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>THE 4 UNIVERSAL CAPABILITIES</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground mt-0.5">
              Mental Fitness for Real Life
            </h2>
          </div>
          <span className="text-[11px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit">
            School → Work → Business → Family → Life
          </span>
        </div>

        {/* 4 Outcome Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {FOUR_CORE_OUTCOMES.map((outcome) => (
            <button
              key={outcome.id}
              onClick={() => setSelectedOutcome(outcome)}
              className="flex flex-col text-left p-3.5 rounded-2xl border border-border bg-background hover:border-primary/50 hover:bg-accent/40 transition active:scale-95 touch-manipulation group"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 transition">
                  {getIcon(outcome.id)}
                </span>
                <span className="text-[10px] font-black uppercase text-primary tracking-wider opacity-0 group-hover:opacity-100 transition">
                  Details ➔
                </span>
              </div>

              <div className="mt-3">
                <span className="text-sm font-black text-foreground block">
                  {outcome.title}
                </span>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5 line-clamp-1">
                  {outcome.tagline}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Value Proposition Quote */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-violet-500/10 to-transparent p-4 border-l-4 border-primary">
          <p className="text-xs sm:text-sm font-semibold text-foreground italic leading-relaxed">
            &ldquo;{MASTER_VALUE_PROPOSITION.theBigQuestion}&rdquo;
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            BrainGym gives you deliberate, daily practice using your mind when real life gives you a problem.
          </p>
        </div>
      </div>

      {/* Outcome In-Depth Modal */}
      {selectedOutcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOutcome(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-sm">
                {selectedOutcome.emoji}
              </span>
              <div>
                <span className="text-xs font-black uppercase text-primary tracking-wider">
                  Universal Capability
                </span>
                <h3 className="text-2xl font-black text-foreground">
                  {selectedOutcome.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-foreground font-medium leading-relaxed">
              {selectedOutcome.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-foreground">
                Capabilities Trained:
              </span>
              <ul className="space-y-1.5">
                {selectedOutcome.capabilitiesTrained.map((cap, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-muted/70 p-4 border-l-2 border-primary space-y-1">
              <span className="text-[10px] font-black uppercase text-foreground block">
                🎯 REAL-LIFE APPLICATION &amp; TRANSFER:
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedOutcome.realLifeTransfer}
              </p>
            </div>

            <button
              onClick={() => setSelectedOutcome(null)}
              className="w-full inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground py-3 text-xs font-black hover:bg-primary/90 transition active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}
