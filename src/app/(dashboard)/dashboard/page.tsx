"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import {
  fetchBrainMomentumEngineState,
  EngineFullState,
} from "@/lib/brain-momentum-engine";
import {
  getTodaysDailyBrainDrop,
  DailyBrainDrop,
} from "@/lib/brain-universe";
import {
  fetchLifePerformanceState,
  LifePerformanceState,
} from "@/lib/life-performance";
import {
  getLifeTransferChallengeForUser,
  LifeTransferChallenge,
} from "@/lib/life-transfer";

// ─── Dashboard Components ───────────────────────────────────────────────────
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TodaysBrainHeroCard } from "@/components/brain-universe/todays-brain-hero-card";
import { DualMetricHero } from "@/components/life-performance/dual-metric-hero";
import { RealLifeChallengeCard } from "@/components/life-transfer/real-life-challenge-card";
import { CompactMomentumBar } from "@/components/brain-universe/compact-momentum-bar";
import { QuickPillarsNav } from "@/components/brain-universe/quick-pillars-nav";

// ─── Helpers ─────────────────────────────────────────────────────────────────
import { WelcomeTour } from "@/components/dashboard/welcome-tour";
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 py-8 space-y-6 animate-pulse">
      <div className="h-10 bg-muted rounded-2xl w-1/3" />
      <div className="h-64 bg-muted rounded-3xl" />
      <div className="h-44 bg-muted rounded-3xl" />
      <div className="h-40 bg-muted rounded-3xl" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [engineState, setEngineState] = useState<EngineFullState | null>(null);
  const [dailyDrop, setDailyDrop] = useState<DailyBrainDrop | null>(null);
  const [lifeState, setLifeState] = useState<LifePerformanceState | null>(null);
  const [lifeChallenge, setLifeChallenge] = useState<LifeTransferChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    const [engine, life] = await Promise.all([
      fetchBrainMomentumEngineState(user?.id, "standard"),
      fetchLifePerformanceState(user?.id),
    ]);

    setEngineState(engine);
    setLifeState(life);

    const drop = getTodaysDailyBrainDrop(
      engine.profile.primaryGoal ? [engine.profile.primaryGoal] : undefined,
      engine.momentum.domainNeedingAttention
    );
    setDailyDrop(drop);

    const challenge = getLifeTransferChallengeForUser(
      undefined,
      undefined,
      engine.momentum.domainNeedingAttention || "Focus"
    );
    setLifeChallenge(challenge);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading || !engineState || !dailyDrop || !lifeState || !lifeChallenge) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 lg:px-6 py-4 pb-24 space-y-6 overflow-x-hidden touch-manipulation">
      {/* Onboarding Tour & Level-up celebration */}
      <WelcomeTour />
      <LevelUpCelebration />

      {/* 1. GREETING */}
      <DashboardHeader
        userName={user?.user_metadata?.name || user?.email?.split("@")[0] || "Thinker"}
      />

      {/* 2. TODAY'S BRAIN DROP (ONE SCREEN. ONE BIG IDEA. ONE ACTION.) */}
      <TodaysBrainHeroCard drop={dailyDrop} />

      {/* 3. COMPACT MOMENTUM BAR & WORKOUT CTA */}
      <CompactMomentumBar
        momentum={engineState.momentum}
        streakDays={engineState.profile.streak}
        workoutDurationMin={engineState.prescribedWorkout.estimatedMinutes}
      />

      {/* 4. DUAL-PERFORMANCE INDEX (BRAIN FITNESS VS LIFE PERFORMANCE) */}
      <DualMetricHero lifeState={lifeState} />

      {/* 5. TODAY'S BRAIN-TO-LIFE APPLICATION CHALLENGE */}
      <RealLifeChallengeCard challenge={lifeChallenge} />

      {/* 6. 4-PILLAR QUICK NAVIGATION (DISCOVER · TRAIN · MY BRAIN · COACH) */}
      <QuickPillarsNav />
    </div>
  );
}
