"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  fetchBrainMomentumEngineState,
  EngineFullState,
} from "@/lib/brain-momentum-engine";

// ─── Streamlined Minimal Dashboard Components ─────────────────────────────────
import { RebrandUpdateBanner } from "@/components/dashboard/rebrand-update-banner";
import { TodaysDailyMissionCard } from "@/components/dashboard/todays-daily-mission-card";
import { ActiveGoalCard } from "@/components/goals/active-goal-card";
import { AskBrainGymQuickBar } from "@/components/dashboard/ask-braingym-quick-bar";
import { AppInstallCard } from "@/components/dashboard/app-install-card";

// ─── Guidance & Celebrations ────────────────────────────────────────────────
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl px-3 sm:px-4 py-4 space-y-3.5 animate-pulse">
      <div className="h-48 bg-muted rounded-3xl" />
      <div className="h-32 bg-muted rounded-2xl" />
      <div className="h-14 bg-muted rounded-2xl" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { isRtl } = useI18n();
  const [engineState, setEngineState] = useState<EngineFullState | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    const engine = await fetchBrainMomentumEngineState(user?.id, "standard");
    setEngineState(engine);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading || !engineState) {
    return <DashboardSkeleton />;
  }

  return (
    <div
      className={`mx-auto w-full max-w-xl px-2 sm:px-4 py-2 pb-24 space-y-3.5 overflow-x-hidden touch-manipulation ${
        isRtl ? "text-right" : "text-left"
      }`}
    >
      {/* Level-up celebration */}
      <LevelUpCelebration />

      {/* Migration / Rebrand Update Banner */}
      <RebrandUpdateBanner />

      {/* 1. TODAY'S BRAIN WORKOUT (CLEAN, COMPACT HERO CARD WITH [START] CTA) */}
      <TodaysDailyMissionCard />

      {/* 2. ACTIVE GOAL (ONE CLEAN FOCUSED GOAL WITH NEXT ACTION) */}
      <ActiveGoalCard />

      {/* 3. ASK AKUCHE / BRAINGYM (CLEAN SINGLE ENTRY BAR FOR PROBLEM SOLVING) */}
      <AskBrainGymQuickBar />

      {/* 4. APP INSTALL / SWITCH BRAND QUICK CARD */}
      <AppInstallCard />
    </div>
  );
}
