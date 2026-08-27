"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import {
  fetchBrainMomentumEngineState,
  EngineFullState,
  WorkoutDurationMode,
} from "@/lib/brain-momentum-engine";

// ─── Brain Momentum Engine Dashboard Components ──────────────────────────────
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { BrainMomentumHeroCard } from "@/components/dashboard/brain-momentum-hero-card";
import { TodaysBrainPlanHero } from "@/components/dashboard/todays-brain-plan-hero";
import { SmallProgressSummary } from "@/components/dashboard/small-progress-summary";
import { BodyBrainHeroCard } from "@/components/body-brain/body-brain-hero-card";
import { getTodaysBodyBrainChallenge } from "@/lib/body-brain";
import { TodaysPhysicalTaskCard } from "@/components/dashboard/todays-physical-task-card";

// ─── Helpers ─────────────────────────────────────────────────────────────────
import { WelcomeTour } from "@/components/dashboard/welcome-tour";
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 py-8 space-y-6 animate-pulse">
      <div className="h-10 bg-muted rounded-2xl w-1/3" />
      <div className="h-44 bg-muted rounded-3xl" />
      <div className="h-64 bg-muted rounded-3xl" />
      <div className="h-32 bg-muted rounded-2xl" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [engineState, setEngineState] = useState<EngineFullState | null>(null);
  const [durationMode, setDurationMode] = useState<WorkoutDurationMode>("standard");
  const [loading, setLoading] = useState(true);

  const loadEngine = useCallback(
    async (mode: WorkoutDurationMode, isSurprise: boolean = false) => {
      const state = await fetchBrainMomentumEngineState(user?.id, mode, isSurprise);
      setEngineState(state);
      setLoading(false);
    },
    [user]
  );

  useEffect(() => {
    loadEngine(durationMode);
  }, [loadEngine, durationMode]);

  const handleDurationChange = (newMode: WorkoutDurationMode) => {
    setDurationMode(newMode);
    loadEngine(newMode, false);
  };

  const handleSurpriseMe = () => {
    loadEngine(durationMode, true);
  };

  if (loading || !engineState) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 lg:px-6 py-4 pb-20 space-y-6 overflow-x-hidden">
      {/* Onboarding Tour & Level-up celebration */}
      <WelcomeTour />
      <LevelUpCelebration />

      {/* 1. GREETING */}
      <DashboardHeader userName={user?.user_metadata?.name || user?.email?.split("@")[0] || "Thinker"} />

      {/* 2. BRAIN MOMENTUM HERO CARD */}
      <BrainMomentumHeroCard momentum={engineState.momentum} />

      {/* 3. TODAY'S PRESCRIBED BRAIN PLAN HERO */}
      <TodaysBrainPlanHero
        workout={engineState.prescribedWorkout}
        onDurationChange={handleDurationChange}
        onSurpriseMe={handleSurpriseMe}
      />

      {/* 4. TODAY'S BODY + BRAIN VERIFIED CHALLENGE */}
      <BodyBrainHeroCard challenge={getTodaysBodyBrainChallenge()} />

      {/* 5. SMALL PROGRESS SUMMARY */}
      <SmallProgressSummary
        momentum={engineState.momentum}
        profile={engineState.profile}
      />
    </div>
  );
}
