"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, X, Lightbulb } from "lucide-react";
import Link from "next/link";

interface AkucheMoment {
  id: string;
  tag: string;
  title: string;
  observation: string;
  suggestedAction: string;
  actionHref: string;
}

const MOMENTS: AkucheMoment[] = [
  {
    id: "m-1",
    tag: "AKUCHE MOMENT",
    title: "Pattern Observation",
    observation: "You reason through business and decision dilemmas with high clarity when you break choices into reversible micro-experiments.",
    suggestedAction: "Explore today's structured challenge",
    actionHref: "/dashboard/think",
  },
  {
    id: "m-2",
    tag: "AKUCHE MOMENT",
    title: "Focus Momentum",
    observation: "Taking 5 minutes away from your screen resets cognitive fatigue and restores executive functioning.",
    suggestedAction: "Take a 2-minute physical reset",
    actionHref: "/dashboard/move",
  },
  {
    id: "m-3",
    tag: "AKUCHE MOMENT",
    title: "Action Loop",
    observation: "Your decisions produce the highest satisfaction when you review their outcomes 7 days after execution.",
    suggestedAction: "Review your decision portfolio",
    actionHref: "/dashboard/profile",
  },
];

export function AkucheMomentBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [momentIndex] = useState(() => Math.floor(Math.random() * MOMENTS.length));

  if (dismissed) return null;

  const currentMoment = MOMENTS[momentIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-card p-4 sm:p-5 shadow-xs text-foreground">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:text-foreground transition"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="space-y-1.5 pr-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-700 dark:text-amber-300">
          <Sparkles className="h-3 w-3" />
          <span>{currentMoment.tag}</span>
        </div>

        <h4 className="text-xs sm:text-sm font-black text-foreground">
          {currentMoment.title}
        </h4>

        <p className="text-xs text-foreground/80 leading-relaxed font-medium max-w-xl">
          &ldquo;{currentMoment.observation}&rdquo;
        </p>

        <div className="pt-1.5">
          <Link
            href={currentMoment.actionHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline active:scale-95 transition"
          >
            <span>{currentMoment.suggestedAction}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
