"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { fetchHabitEngineState, HabitMetricState } from "@/lib/habit-engine";

// ─── The Clean Action-Focused Daily Launchpad Components ─────────────────────
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TodaysBrainGameCard } from "@/components/dashboard/todays-brain-game-card";
import { TodaysPhysicalTaskCard } from "@/components/dashboard/todays-physical-task-card";

// ─── Helpers ─────────────────────────────────────────────────────────────────
import { WelcomeTour } from "@/components/dashboard/welcome-tour";
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 py-8 space-y-6 animate-pulse">
      <div className="h-10 bg-muted rounded-2xl w-1/3" />
      <div className="h-64 bg-muted rounded-3xl" />
      <div className="h-64 bg-muted rounded-3xl" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [habit, setHabit] = useState<HabitMetricState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabitEngineState(user?.id).then((state) => {
      setHabit(state);
      setLoading(false);
    });
  }, [user]);

  if (loading || !habit) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 lg:px-6 py-4 pb-20 space-y-6 overflow-x-hidden">
      {/* Onboarding tour & celebration */}
      <WelcomeTour />
      <LevelUpCelebration />

      {/* 1. GREETING / CALM MORNING MESSAGE */}
      <DashboardHeader userName={habit.userName} />

      {/* 2. PRIMARY ACTION: TODAY'S BRAIN GAME (IN-APP) */}
      <TodaysBrainGameCard habit={habit} />

      {/* 3. SECONDARY ACTION: TODAY'S PHYSICAL TASK (OFFLINE) */}
      <TodaysPhysicalTaskCard />
    </div>
  );
}
