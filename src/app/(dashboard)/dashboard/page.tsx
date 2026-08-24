"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { fetchHabitEngineState, HabitMetricState } from "@/lib/habit-engine";

// ─── The 8 Core Dashboard Sections ──────────────────────────────────────────
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { WorkoutHeroCard } from "@/components/dashboard/workout-hero-card";
import { BrainMomentumWidget } from "@/components/dashboard/brain-momentum-widget";
import { QuickStatsRow } from "@/components/dashboard/quick-stats-row";
import { YourProgressSection } from "@/components/dashboard/your-progress-section";
import { DashboardAchievementsSection } from "@/components/dashboard/dashboard-achievements-section";
import { QuickAccessSection } from "@/components/dashboard/quick-access-section";
import { DailyMotivationFooter } from "@/components/dashboard/daily-motivation-footer";

// ─── Helpers ─────────────────────────────────────────────────────────────────
import { DashboardInstallCard } from "@/components/dashboard/dashboard-install-card";
import { WelcomeTour } from "@/components/dashboard/welcome-tour";
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-6 space-y-5 animate-pulse">
      <div className="h-12 bg-muted rounded-2xl w-1/2" />
      <div className="h-64 bg-muted rounded-3xl" />
      <div className="h-32 bg-muted rounded-3xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
      </div>
      <div className="h-48 bg-muted rounded-3xl" />
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
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 lg:px-6 py-2 pb-16 space-y-5 overflow-x-hidden">
      {/* First-visit onboarding tour & level-up popup */}
      <WelcomeTour />
      <LevelUpCelebration />

      {/* ─── SECTION 1: HEADER / WELCOME ─────────────────────────────────── */}
      <DashboardHeader userName={habit.userName} />

      {/* ─── MOBILE PWA INSTALL HELPER (Non-intrusive) ───────────────────── */}
      <DashboardInstallCard />

      {/* ─── SECTION 2: TODAY'S BRAIN WORKOUT (PRIMARY FOCUS) ────────────── */}
      <WorkoutHeroCard habit={habit} />

      {/* ─── SECTION 3: BRAIN MOMENTUM ───────────────────────────────────── */}
      <BrainMomentumWidget habit={habit} />

      {/* ─── SECTION 4: QUICK STATS ──────────────────────────────────────── */}
      <QuickStatsRow habit={habit} />

      {/* ─── SECTION 5: YOUR PROGRESS ────────────────────────────────────── */}
      <YourProgressSection habit={habit} />

      {/* ─── SECTION 6: ACHIEVEMENTS ─────────────────────────────────────── */}
      <DashboardAchievementsSection />

      {/* ─── SECTION 7: QUICK ACCESS (EXPLORE BRAINGYM) ──────────────────── */}
      <QuickAccessSection />

      {/* ─── SECTION 8: DAILY MOTIVATION ─────────────────────────────────── */}
      <DailyMotivationFooter />
    </div>
  );
}
