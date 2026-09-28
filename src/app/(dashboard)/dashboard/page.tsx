"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import {
  fetchBrainMomentumEngineState,
  EngineFullState,
} from "@/lib/brain-momentum-engine";

// ─── Streamlined Mobile-First Dashboard Components ───────────────────────────
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TodaysDailyMissionCard } from "@/components/dashboard/todays-daily-mission-card";
import { DashboardMinimalProgress } from "@/components/dashboard/dashboard-minimal-progress";
import { DashboardQuickExploreStrip } from "@/components/dashboard/dashboard-quick-explore-strip";
import { GroupChallengesHeroCard } from "@/components/dashboard/group-challenges-hero-card";

// ─── Guidance & Celebrations ────────────────────────────────────────────────
import { FirstTimeTourModal } from "@/components/guidance/first-time-tour-modal";
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl px-3 sm:px-4 py-6 space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded-xl w-1/2" />
      <div className="h-56 bg-muted rounded-3xl" />
      <div className="h-24 bg-muted rounded-2xl" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
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
    <div className="mx-auto w-full max-w-xl px-3 sm:px-4 py-3 pb-24 space-y-4 overflow-x-hidden touch-manipulation">
      {/* 5-Screen First-Time Tour Modal for New Users */}
      <FirstTimeTourModal />

      {/* Level-up celebration */}
      <LevelUpCelebration />

      {/* 1. GREETING & STREAK HEADER */}
      <DashboardHeader
        userName={user?.user_metadata?.name || user?.email?.split("@")[0] || "Thinker"}
        streakDays={engineState.profile.streak}
      />

      {/* 2. TODAY'S CHALLENGE (THE DOMINANT HERO CARD WITH SINGLE PROMINENT ACTION CTA) */}
      <TodaysDailyMissionCard />

      {/* 3. HOW AM I PROGRESSING? (3 KEY METRICS: STREAK, XP, BRAIN SCORE) */}
      <DashboardMinimalProgress
        streakDays={engineState.profile.streak}
      />

      {/* 4. WHAT CAN I EXPLORE? (ONE SECONDARY EXPLORATION AREA) */}
      <DashboardQuickExploreStrip />

      {/* 5. COMMUNITY GROUP CHALLENGES (ELEGANTLY ALIGNED & JUSTIFIED) */}
      <GroupChallengesHeroCard />
    </div>
  );
}
