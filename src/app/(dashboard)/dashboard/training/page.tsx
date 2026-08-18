"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  COGNITIVE_DOMAINS,
  CognitiveDomainId,
  DRILL_BANK,
  DrillItem,
  getRankByScore,
  COGNITIVE_RANKS,
} from "@/lib/cognitive-matrix";
import {
  DAILY_TRAINING_STEPS,
  DailyTrainingLoopStep,
} from "@/lib/cognitive-engine";
import { InteractiveDrillPlayer } from "@/components/training/interactive-drills";
import { Confetti } from "@/components/ui/confetti";
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  CheckCircle2,
  Brain,
  Zap,
  Target,
  Scale,
  RotateCcw,
  Compass,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

export default function DailyTrainingPage() {
  const { user, supabase } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionAccuracies, setSessionAccuracies] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Pick drills for today's 6-step loop
  const [sessionDrills, setSessionDrills] = useState<DrillItem[]>([]);

  useEffect(() => {
    // Select 6 drills representing the 6 training steps
    const selected: DrillItem[] = [];
    for (const step of DAILY_TRAINING_STEPS) {
      const candidates = DRILL_BANK.filter((d) => d.domain === step.domainId);
      if (candidates.length > 0) {
        selected.push(candidates[Math.floor(Math.random() * candidates.length)]);
      } else {
        selected.push(DRILL_BANK[selected.length % DRILL_BANK.length]);
      }
    }
    setSessionDrills(selected);
  }, []);

  const activeDrill = sessionDrills[currentStepIndex];
  const activeStepConfig = DAILY_TRAINING_STEPS[currentStepIndex];

  const handleDrillComplete = (result: {
    score: number;
    accuracy: number;
    timeTakenMs: number;
  }) => {
    setSessionXp((prev) => prev + result.score);
    setSessionAccuracies((prev) => [...prev, result.accuracy]);

    // Grant XP and coins in database
    if (user) {
      (async () => {
        try {
          await supabase.rpc("grant_xp", {
            p_user_id: user.id,
            p_amount: result.score,
            p_reason: `cognitive_drill_${activeDrill?.domain || "general"}`,
          });
          await supabase.rpc("grant_coins", {
            p_user_id: user.id,
            p_amount: Math.round(result.score / 10),
            p_reason: "cognitive_drill_bonus",
          });
        } catch (err) {
          console.warn("Grant XP/coins warning:", err);
        }
      })();
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex + 1 < DAILY_TRAINING_STEPS.length) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    }
  };

  const averageAccuracy =
    sessionAccuracies.length > 0
      ? Math.round(
          sessionAccuracies.reduce((a, b) => a + b, 0) / sessionAccuracies.length
        )
      : 85;
  const userRank = getRankByScore(averageAccuracy);

  if (sessionCompleted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 py-6 px-4">
        <Confetti active={showConfetti} />

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 text-center shadow-lg space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-purple-600 text-white shadow-xl shadow-orange-500/20">
            <Trophy className="h-10 w-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Core Training Loop Complete!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You exercised all 6 cognitive stages in today&apos;s deliberate practice.
            </p>
          </div>

          {/* Performance Summary Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/40 border border-border">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Total XP Earned
              </span>
              <p className="text-lg sm:text-xl font-black text-violet-600 dark:text-violet-400">
                +{sessionXp}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Average Accuracy
              </span>
              <p className="text-lg sm:text-xl font-black text-green-600 dark:text-green-400">
                {averageAccuracy}%
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Cognitive Rank
              </span>
              <p className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                {userRank.emoji} {userRank.title}
              </p>
            </div>
          </div>

          {/* Principle Learned */}
          <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 text-left text-xs sm:text-sm space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <Lightbulb className="h-4 w-4 shrink-0" />
              <span>Key Takeaway for Today:</span>
            </div>
            <p className="text-foreground/90 leading-relaxed font-medium">
              &ldquo;Cognitive fitness is built by challenging automatic assumptions, recognizing missing data, and updating beliefs when new evidence arrives.&rdquo;
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-6 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 min-h-[48px] touch-manipulation active:scale-95"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/dashboard/progress"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border py-3 px-6 text-sm font-bold text-foreground hover:bg-accent min-h-[48px] touch-manipulation active:scale-95"
            >
              View 10-Pillar Radar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4 px-4 sm:px-6">
      {/* Top Nav Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground min-h-[40px]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <span className="text-xs font-bold text-muted-foreground">
          Stage {currentStepIndex + 1} of {DAILY_TRAINING_STEPS.length}: {activeStepConfig?.stageName}
        </span>
      </div>

      {/* Step Indicator Chips */}
      <div className="grid grid-cols-6 gap-1.5">
        {DAILY_TRAINING_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={step.stepNumber}
              className={`rounded-lg p-1.5 text-center transition-all ${
                isDone
                  ? "bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/40"
                  : isCurrent
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "bg-muted text-muted-foreground/60"
              }`}
            >
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold">
                {step.stageName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Drill Player */}
      {activeDrill && (
        <InteractiveDrillPlayer
          drill={activeDrill}
          stepNumber={currentStepIndex + 1}
          totalSteps={DAILY_TRAINING_STEPS.length}
          onComplete={handleDrillComplete}
          onNext={handleNextStep}
        />
      )}
    </div>
  );
}
