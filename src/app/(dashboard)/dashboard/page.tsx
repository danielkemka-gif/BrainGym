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

const HabitNudges = dynamic(
  () =>
    import("@/components/dashboard/habit-nudges").then(
      (m) => ({ default: m.HabitNudges })
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

const BrainJourney = dynamic(
  () =>
    import("@/components/dashboard/brain-journey").then(
      (m) => ({ default: m.BrainJourney })
    ),
  { ssr: false }
);

const StreakCalendar = dynamic(
  () =>
    import("@/components/dashboard/streak-calendar").then(
      (m) => ({ default: m.StreakCalendar })
    ),
  { ssr: false }
);

const BrainAgeSection = dynamic(
  () =>
    import("@/components/dashboard/brain-age-section").then(
      (m) => ({ default: m.BrainAgeSection })
    ),
  { ssr: false }
);

const CoachNudge = dynamic(
  () =>
    import("@/components/dashboard/coach-nudge").then(
      (m) => ({ default: m.CoachNudge })
    ),
  { ssr: false }
);

const PersonalizedPlan = dynamic(
  () =>
    import("@/components/dashboard/personalized-plan").then(
      (m) => ({ default: m.PersonalizedPlan })
    ),
  { ssr: false }
);

const InviteFriendsCard = dynamic(
  () =>
    import("@/components/dashboard/invite-friends-card").then(
      (m) => ({ default: m.InviteFriendsCard })
    ),
  { ssr: false }
);

const AccountabilityPartner = dynamic(
  () =>
    import("@/components/dashboard/accountability-partner").then(
      (m) => ({ default: m.AccountabilityPartner })
    ),
  { ssr: false }
);

const BrainMomentumCard = dynamic(
  () =>
    import("@/components/dashboard/brain-momentum-card").then(
      (m) => ({ default: m.BrainMomentumCard })
    ),
  { ssr: false }
);

const DailyQuestsSection = dynamic(
  () =>
    import("@/components/dashboard/daily-quests-section").then(
      (m) => ({ default: m.DailyQuestsSection })
    ),
  { ssr: false }
);

const CognitiveIdentityCard = dynamic(
  () =>
    import("@/components/dashboard/cognitive-identity-card").then(
      (m) => ({ default: m.CognitiveIdentityCard })
    ),
  { ssr: false }
);

const MomentumRecovery = dynamic(
  () =>
    import("@/components/dashboard/momentum-recovery").then(
      (m) => ({ default: m.MomentumRecovery })
    ),
  { ssr: false }
);

const MissedDaySimulator = dynamic(
  () =>
    import("@/components/dashboard/missed-day-simulator").then(
      (m) => ({ default: m.MissedDaySimulator })
    ),
  { ssr: false }
);

const BrainHealthInsights = dynamic(
  () =>
    import("@/components/dashboard/brain-health-insights").then(
      (m) => ({ default: m.BrainHealthInsights })
    ),
  { ssr: false }
);

const AdaptiveHabitIntelligence = dynamic(
  () =>
    import("@/components/dashboard/adaptive-habit-intelligence").then(
      (m) => ({ default: m.AdaptiveHabitIntelligence })
    ),
  { ssr: false }
);

const SmartRemindersSection = dynamic(
  () =>
    import("@/components/dashboard/smart-reminders-section").then(
      (m) => ({ default: m.SmartRemindersSection })
    ),
  { ssr: false }
);

const StreakProtectionCard = dynamic(
  () =>
    import("@/components/dashboard/streak-protection-card").then(
      (m) => ({ default: m.StreakProtectionCard })
    ),
  { ssr: false }
);

const ThreeSixFiveJourney = dynamic(
  () =>
    import("@/components/dashboard/three-six-five-journey").then(
      (m) => ({ default: m.ThreeSixFiveJourney })
    ),
  { ssr: false }
);

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header: greeting + coins + level */}
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

      {/* Habit nudge — smart encouragement */}
      <Suspense fallback={null}>
        <HabitNudges />
      </Suspense>

      {/* AI Coach proactive tip */}
      <Suspense fallback={null}>
        <CoachNudge />
      </Suspense>

      {/* Today's Workout — prominent CTA */}
      <Suspense
        fallback={
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
        }
      >
        <CentralCTA />
      </Suspense>

      {/* Brain Age + XP/Streak — hero row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <div className="h-72 animate-pulse rounded-2xl bg-muted" />
            }
          >
            <BrainAgeSection />
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
          <Suspense
            fallback={
              <div className="h-32 animate-pulse rounded-2xl bg-muted" />
            }
          >
            <TodaysWorkoutSection />
          </Suspense>
        </div>
      </div>

      {/* Brain Momentum — high-visibility score */}
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        }
      >
        <BrainMomentumCard />
      </Suspense>

      {/* Streak Calendar + Brain Scores — 2-column on desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <div className="h-40 animate-pulse rounded-2xl bg-muted" />
            }
          >
            <StreakCalendar />
          </Suspense>
        </div>
        <div>
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            }
          >
            <BrainScoreSection />
          </Suspense>
        </div>
      </div>

      {/* Quick actions grid — 7 categories */}
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

      {/* Personalized training plan */}
      <Suspense fallback={null}>
        <PersonalizedPlan />
      </Suspense>

      {/* Daily Brain Quests — daily engagement hook */}
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        }
      >
        <DailyQuestsSection />
      </Suspense>

      {/* Brain Journey timeline */}
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        }
      >
        <BrainJourney />
      </Suspense>

      {/* Cognitive Identity + Consistency Forecast — 2-column on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <CognitiveIdentityCard />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <MomentumRecovery />
        </Suspense>
      </div>

      {/* Missed Day Simulator — shows impact of missing training */}
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        }
      >
        <MissedDaySimulator />
      </Suspense>

      {/* Brain Health + Adaptive Habits — 2-column on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <BrainHealthInsights />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <AdaptiveHabitIntelligence />
        </Suspense>
      </div>

      {/* Smart Reminders */}
      <Suspense fallback={null}>
        <SmartRemindersSection />
      </Suspense>

      {/* Streak Protection + 365-Day Journey — 2-column on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <StreakProtectionCard />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <ThreeSixFiveJourney />
        </Suspense>
      </div>

      {/* Weekly missions preview */}
      <Suspense
        fallback={
          <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        }
      >
        <MissionsSection />
      </Suspense>

      {/* Invite friends */}
      <Suspense fallback={null}>
        <InviteFriendsCard />
      </Suspense>

      {/* Accountability partner */}
      <Suspense fallback={null}>
        <AccountabilityPartner />
      </Suspense>
    </div>
  );
}
