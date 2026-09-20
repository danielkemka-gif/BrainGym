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

// ─── Clean Dashboard Components ──────────────────────────────────────────────
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TodaysDailyMissionCard } from "@/components/dashboard/todays-daily-mission-card";
import { GroupChallengesHeroCard } from "@/components/dashboard/group-challenges-hero-card";
import { DashboardAlarmCard } from "@/components/dashboard/dashboard-alarm-card";
import { DashboardShareBanner } from "@/components/dashboard/dashboard-share-banner";
import { CompactMomentumBar } from "@/components/brain-universe/compact-momentum-bar";
import { FourCoreOutcomesStrip } from "@/components/dashboard/four-core-outcomes-strip";
import { QuickPillarsNav } from "@/components/brain-universe/quick-pillars-nav";

// ─── Guidance & Helpers ──────────────────────────────────────────────────────
import { FirstTimeTourModal } from "@/components/guidance/first-time-tour-modal";
import { GuideMeButton } from "@/components/guidance/guide-me-button";
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 py-8 space-y-6 animate-pulse">
      <div className="h-10 bg-muted rounded-2xl w-1/3" />
      <div className="h-72 bg-muted rounded-3xl" />
      <div className="h-20 bg-muted rounded-2xl" />
      <div className="h-24 bg-muted rounded-2xl" />
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
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 lg:px-6 py-4 pb-28 space-y-6 overflow-x-hidden touch-manipulation">
      {/* 5-Screen First-Time Tour Modal for New Users */}
      <FirstTimeTourModal />

      {/* Floating "Guide Me" Navigator Button */}
      <GuideMeButton variant="floating" />

      {/* Level-up celebration */}
      <LevelUpCelebration />

      {/* 1. GREETING HEADER */}
      <DashboardHeader
        userName={user?.user_metadata?.name || user?.email?.split("@")[0] || "Thinker"}
      />

      {/* 2. TODAY'S 5-STEP REAL-LIFE DAILY MISSION (SCENARIO -> DECISION -> CHALLENGE -> TASK -> JOURNAL) */}
      <TodaysDailyMissionCard />

      {/* 3. COMPACT MOMENTUM & STREAK BAR */}
      <CompactMomentumBar
        momentum={engineState.momentum}
        streakDays={engineState.profile.streak}
        workoutDurationMin={lesson.phase2PhysicalTask.durationMinutes}
      />

      {/* 4. FOUR CORE OUTCOMES (THINK · SOLVE · DECIDE · ADAPT) */}
      <FourCoreOutcomesStrip />

      {/* 5. GROUP CHALLENGES HERO CARD */}
      <GroupChallengesHeroCard />

      {/* 5. 4-PILLAR QUICK NAVIGATION (DISCOVER · TRAIN · MY BRAIN · COACH) */}
      <QuickPillarsNav />

      {/* 6. SMARTPHONE ALARM & NOTIFICATION CARD */}
      <DashboardAlarmCard />

      {/* 7. ALWAYS-VISIBLE SHARE BRAINGYM BANNER */}
      <DashboardShareBanner />
    </div>
  );
}
