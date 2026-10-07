"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { recordActionStreakActivity } from "@/lib/akuche/memory-engine";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Shuffle,
  Sparkles,
  ArrowRight,
  Brain,
  CheckCircle2,
  Smartphone,
  Eye,
  Flame,
  RotateCcw,
  Zap,
} from "lucide-react";

interface SurpriseExperience {
  type: "thinking" | "decision" | "real_world" | "cognitive" | "reflection";
  title: string;
  badge: string;
  description: string;
  actionText: string;
  actionRoute: string;
  isRealWorldPhoneDown?: boolean;
}

const SURPRISES: SurpriseExperience[] = [
  {
    type: "real_world",
    title: "Put Your Phone Down: 2-Minute Customer/Colleague Reality Check",
    badge: "REAL-WORLD ACTION · SECTION 27",
    description: "Your challenge isn't inside your phone today. Walk up to 1 colleague, customer, or friend and ask: «What is 1 thing that frustrates you most about [your industry/product]?» Listen without defending.",
    actionText: "I'm Ready (Put Phone Down)",
    actionRoute: "/dashboard",
    isRealWorldPhoneDown: true,
  },
  {
    type: "decision",
    title: "The 10/10/10 Decision Stress-Test",
    badge: "DECISION LAB · 3-MIN EXERCISE",
    description: "Think of one pending choice you've been delaying. Ask yourself: «How will I feel about this choice in 10 minutes? In 10 months? In 10 years?»",
    actionText: "Test My Choice in Decision Lab →",
    actionRoute: "/dashboard/think",
  },
  {
    type: "thinking",
    title: "Inversion Thinking: How to Guarantee Failure",
    badge: "MENTAL AGILITY · REASONING",
    description: "Instead of asking «How do I succeed?», list 3 things that would 100% guarantee your project fails this quarter. Then check if you are currently doing any of them.",
    actionText: "Work Through Inversion →",
    actionRoute: "/dashboard/think",
  },
  {
    type: "cognitive",
    title: "Pattern Recognition & Executive Focus Drill",
    badge: "COGNITIVE SPEED · DRILL",
    description: "Test how quickly your prefrontal cortex identifies anomalies and suppresses impulse errors under time pressure.",
    actionText: "Begin Focus Drill →",
    actionRoute: "/dashboard/skills",
  },
  {
    type: "real_world",
    title: "Clear 1 Financial Bottleneck",
    badge: "REAL LIFE · ACTION",
    description: "Send 1 WhatsApp invoice or follow-up message to a client who owes you money or pending approval. Do not over-explain.",
    actionText: "Mark Done & Log Progress",
    actionRoute: "/dashboard",
    isRealWorldPhoneDown: true,
  },
];

export default function SurpriseMePage() {
  const { user } = useAuth();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSurprise, setCurrentSurprise] = useState<SurpriseExperience>(SURPRISES[0]);
  const [phoneDownDone, setPhoneDownDone] = useState(false);

  const handleTriggerSurprise = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * SURPRISES.length);
      setCurrentSurprise(SURPRISES[randomIndex]);
      setIsSpinning(false);
      setIsRevealed(true);
      setPhoneDownDone(false);
    }, 650);
  };

  const handleMarkPhoneDownDone = () => {
    setPhoneDownDone(true);
    recordActionStreakActivity({
      type: "action",
      title: `Surprise Real-World Action Completed`,
      details: currentSurprise.title,
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-3 sm:px-4 py-3 pb-28 text-foreground touch-manipulation">
      {/* Header */}
      <div className="space-y-1.5 pt-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>SURPRISE ME · SECTION 28</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Surprise Me
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Let Akuche choose something useful for you today.
        </p>
      </div>

      {/* Main Interactive Box */}
      <div className="rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card to-card p-6 sm:p-8 shadow-md text-center space-y-6">
        <div className="mx-auto flex justify-center">
          <div className={`transition-transform duration-500 ${isSpinning ? "rotate-180 scale-110" : ""}`}>
            <AkucheBrandLogo variant="mark" size="xl" animate />
          </div>
        </div>

        {!isRevealed ? (
          <div className="space-y-4 max-w-sm mx-auto">
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              Ready for today&apos;s unexpected challenge?
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Akuche will pick a high-impact thinking exercise, decision stress-test, or real-world action tailored for you.
            </p>

            <button
              onClick={handleTriggerSurprise}
              disabled={isSpinning}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 text-sm font-bold shadow-lg shadow-purple-900/20 active:scale-95 transition min-h-[48px] w-full sm:w-auto"
            >
              <Shuffle className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`} />
              <span>{isSpinning ? "Selecting..." : "Surprise Me"}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in max-w-lg mx-auto text-left">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-purple-500/15 px-2.5 py-1 text-[10px] font-black uppercase text-purple-700 dark:text-purple-300">
              {currentSurprise.badge}
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-foreground">
                {currentSurprise.title}
              </h2>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {currentSurprise.description}
              </p>
            </div>

            {currentSurprise.isRealWorldPhoneDown ? (
              <div className="rounded-2xl bg-background/80 border border-border/80 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Smartphone className="h-4 w-4" />
                  <span>Real-World Challenge (No screen required)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete this in the real world, then return to record your action streak.
                </p>

                {!phoneDownDone ? (
                  <button
                    onClick={handleMarkPhoneDownDone}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 text-xs font-bold shadow-xs active:scale-95 transition"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>I Completed This Real-World Action ✓</span>
                  </button>
                ) : (
                  <div className="text-center py-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Logged in your Action Streak!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  href={currentSurprise.actionRoute}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white py-3.5 px-6 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition min-h-[46px]"
                >
                  <span>{currentSurprise.actionText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                onClick={handleTriggerSurprise}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Spin Again (Another Surprise)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
