"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

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

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your daily brain training overview
        </p>
      </div>

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
