"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  fetchBrainMomentumEngineState,
  EngineFullState,
} from "@/lib/brain-momentum-engine";

// ─── Streamlined Mobile-First Dashboard Components ───────────────────────────
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TodaysDailyMissionCard } from "@/components/dashboard/todays-daily-mission-card";
import { SkillDevelopmentProfile } from "@/components/dashboard/skill-development-profile";
import { NextChallengeRecommender } from "@/components/dashboard/next-challenge-recommender";
import { SevenLatestWorkoutsStrip } from "@/components/dashboard/seven-latest-workouts-strip";
import { DashboardQuickExploreStrip } from "@/components/dashboard/dashboard-quick-explore-strip";

// ─── Guidance & Celebrations ────────────────────────────────────────────────
import { FirstTimeTourModal } from "@/components/guidance/first-time-tour-modal";
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl px-3 sm:px-4 py-6 space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded-xl w-1/2" />
      <div className="h-56 bg-muted rounded-3xl" />
      <div className="h-28 bg-muted rounded-2xl" />
      <div className="h-36 bg-muted rounded-2xl" />
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
    <div className={`mx-auto w-full max-w-xl px-3 sm:px-4 py-3 pb-24 space-y-4 overflow-x-hidden touch-manipulation ${isRtl ? "text-right" : "text-left"}`}>
      {/* 5-Screen First-Time Tour Modal for New Users */}
      <FirstTimeTourModal />

      {/* Level-up celebration */}
      <LevelUpCelebration />

      {/* 1. GREETING & STREAK HEADER */}
      <DashboardHeader
        userName={user?.user_metadata?.name || user?.email?.split("@")[0] || "Thinker"}
        streakDays={engineState.profile.streak}
      />

      {/* 2. TODAY'S CHALLENGE (DOMINANT HERO CARD WITH START TODAY'S CHALLENGE CTA) */}
      <TodaysDailyMissionCard />

      {/* 3. SKILL DEVELOPMENT PROFILE (8 COGNITIVE SKILLS DEVELOPMENT) */}
      <SkillDevelopmentProfile />

      {/* 4. NEXT CHALLENGE RECOMMENDER (INTELLIGENT SKILL BALANCE) */}
      <NextChallengeRecommender />

      {/* 5. 7 LATEST WORKOUTS (COMPACT TAP-TO-REVIEW STRIP) */}
      <SevenLatestWorkoutsStrip />

      {/* 6. SECONDARY EXPLORATION STRIP (BRAIN ARENA & 60-SEC BREAKS) */}
      <DashboardQuickExploreStrip />
    </div>
  );
}
