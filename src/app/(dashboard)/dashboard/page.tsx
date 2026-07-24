"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const DashboardHeader = dynamic(
  () =>
    import("@/components/dashboard/dashboard-header").then(
      (m) => ({ default: m.DashboardHeader })
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
        <div className="space-y-1.5">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        </div>
      </div>
    ),
  }
);

const OnboardingPrompt = dynamic(
  () =>
    import("@/components/dashboard/onboarding-prompt").then(
      (m) => ({ default: m.OnboardingPrompt })
    ),
  { ssr: false }
);

const QuickActions = dynamic(
  () =>
    import("@/components/dashboard/quick-actions").then(
      (m) => ({ default: m.QuickActions })
    )
);

const TodaysWorkoutSection = dynamic(
  () =>
    import("@/components/dashboard/todays-workout-section").then(
      (m) => ({ default: m.TodaysWorkoutSection })
    )
);

const BrainScoreSection = dynamic(
  () =>
    import("@/components/dashboard/brain-score-section").then(
      (m) => ({ default: m.BrainScoreSection })
    )
);

const XpStreakSection = dynamic(
  () =>
    import("@/components/dashboard/xp-streak-section").then(
      (m) => ({ default: m.XpStreakSection })
    )
);

const MissionsSection = dynamic(
  () =>
    import("@/components/dashboard/missions-section").then(
      (m) => ({ default: m.MissionsSection })
    )
);

const CentralCTA = dynamic(
  () =>
    import("@/components/dashboard/central-cta").then(
      (m) => ({ default: m.CentralCTA })
    ),
  { ssr: false }
);

const TrialBanner = dynamic(
  () =>
    import("@/components/premium/trial-banner").then(
      (m) => ({ default: m.TrialBanner })
    ),
  { ssr: false }
);

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* User avatar + greeting + coins/level */}
      <Suspense
        fallback={
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
            <div className="space-y-1.5">
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            </div>
          </div>
        }
      >
        <DashboardHeader />
      </Suspense>

      {/* Free trial banner */}
      <Suspense fallback={null}>
        <TrialBanner />
      </Suspense>

      {/* Onboarding prompt — only shows for new users */}
      <Suspense fallback={null}>
        <OnboardingPrompt />
      </Suspense>

      {/* BIG central Start Training button */}
      <Suspense
        fallback={
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
        }
      >
        <CentralCTA />
      </Suspense>

      {/* Today's Workout + XP/Streak/Coins */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <div className="h-80 animate-pulse rounded-2xl bg-muted" />
            }
          >
            <TodaysWorkoutSection />
          </Suspense>
        </div>
        <div className="space-y-6">
          <Suspense
            fallback={
              <div className="h-48 animate-pulse rounded-2xl bg-muted" />
            }
          >
            <XpStreakSection />
          </Suspense>
        </div>
      </div>

      {/* Brain Training quick actions */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        }
      >
        <QuickActions />
      </Suspense>

      {/* Brain Scores + Missions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            }
          >
            <BrainScoreSection />
          </Suspense>
        </div>
        <div>
          <Suspense
            fallback={
              <div className="h-32 animate-pulse rounded-2xl bg-muted" />
            }
          >
            <MissionsSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
