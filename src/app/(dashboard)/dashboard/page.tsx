"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import {
  fetchBrainMomentumEngineState,
  EngineFullState,
} from "@/lib/brain-momentum-engine";
import {
  getTodaysCurriculumLesson,
  DailyCurriculumLesson,
} from "@/lib/daily-curriculum";

// ─── Streamlined Mobile-First Dashboard Components ───────────────────────────
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TodaysDailyMissionCard } from "@/components/dashboard/todays-daily-mission-card";
import { DashboardProgressSnapshot } from "@/components/dashboard/dashboard-progress-snapshot";
import { FourCoreOutcomesStrip } from "@/components/dashboard/four-core-outcomes-strip";
import { GroupChallengesHeroCard } from "@/components/dashboard/group-challenges-hero-card";

// ─── Guidance & Celebrations ────────────────────────────────────────────────
import { FirstTimeTourModal } from "@/components/guidance/first-time-tour-modal";
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl px-3 sm:px-4 py-6 space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded-xl w-1/2" />
      <div className="h-56 bg-muted rounded-3xl" />
      <div className="h-28 bg-muted rounded-2xl" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [engineState, setEngineState] = useState<EngineFullState | null>(null);
  const [lesson, setLesson] = useState<DailyCurriculumLesson | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    const engine = await fetchBrainMomentumEngineState(user?.id, "standard");
    setEngineState(engine);

    const todaysLesson = getTodaysCurriculumLesson();
    setLesson(todaysLesson);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading || !engineState || !lesson) {
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

      {/* 2. TODAY'S CHALLENGE (THE DOMINANT HERO CARD WITH SINGLE ACTION CTA) */}
      <TodaysDailyMissionCard />

      {/* 3. SIMPLE PROGRESS SNAPSHOT */}
      <DashboardProgressSnapshot />

      {/* 4. FOUR CORE OUTCOMES (THINK · SOLVE · DECIDE · ADAPT) */}
      <FourCoreOutcomesStrip />

      {/* 5. GROUP CHALLENGES SOCIAL CARD */}
      <GroupChallengesHeroCard />
    </div>
  );
}
