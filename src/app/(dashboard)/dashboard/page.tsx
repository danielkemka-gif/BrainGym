"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { fetchHabitEngineState, HabitMetricState } from "@/lib/habit-engine";

// ─── Core Dashboard Sections ────────────────────────────────────────────────
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { WorkoutHeroCard } from "@/components/dashboard/workout-hero-card";
import { PhysicalActivitiesHero } from "@/components/dashboard/physical-activities-hero";
import { BrainMomentumWidget } from "@/components/dashboard/brain-momentum-widget";
import { QuickStatsRow } from "@/components/dashboard/quick-stats-row";
import { TodaysBrainPlanCard } from "@/components/dashboard/todays-brain-plan-card";
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
      <div className="h-44 bg-muted rounded-3xl" />
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

      {/* ─── PILLAR 1: TODAY'S IN-APP COGNITIVE WORKOUT ──────────────────── */}
      <WorkoutHeroCard habit={habit} />

      {/* ─── PILLAR 2: BRAINGYM PHYSICAL REAL-WORLD ACTIVITIES ───────────── */}
      <PhysicalActivitiesHero />

      {/* ─── SECTION 3: BRAIN MOMENTUM METER ─────────────────────────────── */}
      <BrainMomentumWidget habit={habit} />

      {/* ─── SECTION 4: QUICK STATS ROW ──────────────────────────────────── */}
      <QuickStatsRow habit={habit} />

      {/* ─── PILLAR 3: TODAY'S HOLISTIC BRAIN PLAN (Think-Move-Learn-Connect)*/}
      <TodaysBrainPlanCard />

      {/* ─── SECTION 5: YOUR PROGRESS (Brain Age & 5 Domains) ─────────────── */}
      <YourProgressSection habit={habit} />

      {/* ─── SECTION 6: ACHIEVEMENTS ─────────────────────────────────────── */}
      <DashboardAchievementsSection />

      {/* ─── SECTION 7: QUICK ACCESS (EXPLORE ARENA) ─────────────────────── */}
      <QuickAccessSection />

      {/* ─── SECTION 8: DAILY MOTIVATION FOOTER ──────────────────────────── */}
      <DailyMotivationFooter />
    </div>
  );
}
