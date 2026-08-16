"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";

/* ---------- skeleton helpers ---------- */
function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted ${className}`} />;
}

function MiniCard() {
  return <Skeleton className="h-20" />;
}

function MedCard() {
  return <Skeleton className="h-44" />;
}

function TallCard() {
  return <Skeleton className="h-64" />;
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
      <div className="space-y-1.5">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3 w-28 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

/* ---------- dynamic imports ---------- */
const DashboardHeader = dynamic(() => import("@/components/dashboard/dashboard-header").then((m) => ({ default: m.DashboardHeader })), { ssr: false, loading: () => <HeaderSkeleton /> });
const WelcomeTour = dynamic(() => import("@/components/dashboard/welcome-tour").then((m) => ({ default: m.WelcomeTour })), { ssr: false });
const FeatureGuideCard = dynamic(() => import("@/components/dashboard/feature-guide-card").then((m) => ({ default: m.FeatureGuideCard })), { ssr: false, loading: () => <MiniCard /> });
const OnboardingPrompt = dynamic(() => import("@/components/dashboard/onboarding-prompt").then((m) => ({ default: m.OnboardingPrompt })), { ssr: false, loading: () => <MiniCard /> });
const HabitNudges = dynamic(() => import("@/components/dashboard/habit-nudges").then((m) => ({ default: m.HabitNudges })), { ssr: false, loading: () => <MiniCard /> });
const QuickActions = dynamic(() => import("@/components/dashboard/quick-actions").then((m) => ({ default: m.QuickActions })));
const TodaysWorkoutSection = dynamic(() => import("@/components/dashboard/todays-workout-section").then((m) => ({ default: m.TodaysWorkoutSection })));
const BrainScoreSection = dynamic(() => import("@/components/dashboard/brain-score-section").then((m) => ({ default: m.BrainScoreSection })));
const XpStreakSection = dynamic(() => import("@/components/dashboard/xp-streak-section").then((m) => ({ default: m.XpStreakSection })));
const MissionsSection = dynamic(() => import("@/components/dashboard/missions-section").then((m) => ({ default: m.MissionsSection })));
const CentralCTA = dynamic(() => import("@/components/dashboard/central-cta").then((m) => ({ default: m.CentralCTA })), { ssr: false, loading: () => <MedCard /> });
const TrialBanner = dynamic(() => import("@/components/premium/trial-banner").then((m) => ({ default: m.TrialBanner })), { ssr: false, loading: () => <MiniCard /> });
const BrainJourney = dynamic(() => import("@/components/dashboard/brain-journey").then((m) => ({ default: m.BrainJourney })), { ssr: false, loading: () => <MedCard /> });
const StreakCalendar = dynamic(() => import("@/components/dashboard/streak-calendar").then((m) => ({ default: m.StreakCalendar })), { ssr: false, loading: () => <Skeleton className="h-40" /> });
const BrainAgeSection = dynamic(() => import("@/components/dashboard/brain-age-section").then((m) => ({ default: m.BrainAgeSection })), { ssr: false, loading: () => <Skeleton className="h-72" /> });
const CoachNudge = dynamic(() => import("@/components/dashboard/coach-nudge").then((m) => ({ default: m.CoachNudge })), { ssr: false, loading: () => <MiniCard /> });
const PersonalizedPlan = dynamic(() => import("@/components/dashboard/personalized-plan").then((m) => ({ default: m.PersonalizedPlan })), { ssr: false, loading: () => <MedCard /> });
const InviteFriendsCard = dynamic(() => import("@/components/dashboard/invite-friends-card").then((m) => ({ default: m.InviteFriendsCard })), { ssr: false, loading: () => <MedCard /> });
const AccountabilityPartner = dynamic(() => import("@/components/dashboard/accountability-partner").then((m) => ({ default: m.AccountabilityPartner })), { ssr: false, loading: () => <MedCard /> });
const BrainMomentumCard = dynamic(() => import("@/components/dashboard/brain-momentum-card").then((m) => ({ default: m.BrainMomentumCard })), { ssr: false, loading: () => <MedCard /> });
const DailyQuestsSection = dynamic(() => import("@/components/dashboard/daily-quests-section").then((m) => ({ default: m.DailyQuestsSection })), { ssr: false, loading: () => <MedCard /> });
const CognitiveIdentityCard = dynamic(() => import("@/components/dashboard/cognitive-identity-card").then((m) => ({ default: m.CognitiveIdentityCard })), { ssr: false, loading: () => <TallCard /> });
const MomentumRecovery = dynamic(() => import("@/components/dashboard/momentum-recovery").then((m) => ({ default: m.MomentumRecovery })), { ssr: false, loading: () => <TallCard /> });
const MissedDaySimulator = dynamic(() => import("@/components/dashboard/missed-day-simulator").then((m) => ({ default: m.MissedDaySimulator })), { ssr: false, loading: () => <MedCard /> });
const BrainHealthInsights = dynamic(() => import("@/components/dashboard/brain-health-insights").then((m) => ({ default: m.BrainHealthInsights })), { ssr: false, loading: () => <TallCard /> });
const AdaptiveHabitIntelligence = dynamic(() => import("@/components/dashboard/adaptive-habit-intelligence").then((m) => ({ default: m.AdaptiveHabitIntelligence })), { ssr: false, loading: () => <TallCard /> });
const SmartRemindersSection = dynamic(() => import("@/components/dashboard/smart-reminders-section").then((m) => ({ default: m.SmartRemindersSection })), { ssr: false, loading: () => <MedCard /> });
const StreakProtectionCard = dynamic(() => import("@/components/dashboard/streak-protection-card").then((m) => ({ default: m.StreakProtectionCard })), { ssr: false, loading: () => <TallCard /> });
const ThreeSixFiveJourney = dynamic(() => import("@/components/dashboard/three-six-five-journey").then((m) => ({ default: m.ThreeSixFiveJourney })), { ssr: false, loading: () => <TallCard /> });
const WeeklyThemeBanner = dynamic(() => import("@/components/dashboard/weekly-theme-banner").then((m) => ({ default: m.WeeklyThemeBanner })), { ssr: false, loading: () => <Skeleton className="h-24" /> });
const WhatToDoSection = dynamic(() => import("@/components/dashboard/what-to-do-section").then((m) => ({ default: m.WhatToDoSection })), { ssr: false, loading: () => <MedCard /> });
const BrainAgeTrend = dynamic(() => import("@/components/dashboard/brain-age-trend").then((m) => ({ default: m.BrainAgeTrend })), { ssr: false, loading: () => <Skeleton className="h-44" /> });
const StreakMilestones = dynamic(() => import("@/components/dashboard/streak-milestones").then((m) => ({ default: m.StreakMilestones })), { ssr: false, loading: () => <Skeleton className="h-44" /> });
const HabitCalendar = dynamic(() => import("@/components/dashboard/habit-calendar").then((m) => ({ default: m.HabitCalendar })), { ssr: false, loading: () => <Skeleton className="h-64" /> });
const LevelUpCelebration = dynamic(() => import("@/components/dashboard/level-up-celebration").then((m) => ({ default: m.LevelUpCelebration })), { ssr: false });
const PushNotificationCard = dynamic(() => import("@/components/dashboard/push-notification-card").then((m) => ({ default: m.PushNotificationCard })), { ssr: false, loading: () => <MedCard /> });

function ShowMoreToggle({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors lg:hidden min-h-[44px]">
      {expanded ? "Show less" : "Show more"}
      <svg className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export default function DashboardPage() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-3 sm:space-y-4 lg:space-y-6 overflow-x-hidden pb-4 sm:pb-6">
      {/* First-visit welcome tour */}
      <WelcomeTour />
      <LevelUpCelebration />

      {/* Header */}
      <Suspense fallback={<HeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>

      {/* Trial banner, Feature Guide, Onboarding, Habit nudges, Coach tip */}
      <Suspense fallback={<MiniCard />}><TrialBanner /></Suspense>
      <Suspense fallback={<MiniCard />}><FeatureGuideCard /></Suspense>
      <Suspense fallback={<MiniCard />}><OnboardingPrompt /></Suspense>
      <Suspense fallback={<MiniCard />}><HabitNudges /></Suspense>
      <Suspense fallback={<MiniCard />}><CoachNudge /></Suspense>

      {/* Weekly theme + What to do today */}
      <Suspense fallback={<Skeleton className="h-24" />}><WeeklyThemeBanner /></Suspense>
      <Suspense fallback={<MedCard />}><WhatToDoSection /></Suspense>

      {/* Central CTA */}
      <Suspense fallback={<MedCard />}><CentralCTA /></Suspense>

      {/* Hero row: Brain Age + XP/Streak */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-72" />}>
            <BrainAgeSection />
          </Suspense>
        </div>
        <div className="space-y-3 lg:space-y-6">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <XpStreakSection />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-32" />}>
            <TodaysWorkoutSection />
          </Suspense>
        </div>
      </div>

      {/* Brain Age Trend + Streak Milestones */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-44" />}><BrainAgeTrend /></Suspense>
        <Suspense fallback={<Skeleton className="h-44" />}><StreakMilestones /></Suspense>
      </div>

      {/* Invite friends */}
      <Suspense fallback={<MedCard />}>
        <InviteFriendsCard />
      </Suspense>

      {/* Brain Momentum */}
      <Suspense fallback={<MedCard />}>
        <BrainMomentumCard />
      </Suspense>

      {/* Streak Calendar + Brain Scores */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-40" />}>
            <StreakCalendar />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<Skeleton className="h-64" />}>
            <BrainScoreSection />
          </Suspense>
        </div>
      </div>

      {/* Habit calendar */}
      <Suspense fallback={<Skeleton className="h-64" />}>
        <HabitCalendar />
      </Suspense>

      {/* Quick actions */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        }
      >
        <QuickActions />
      </Suspense>

      {/* Mobile: show more/less toggle */}
      <div className="lg:hidden">
        <ShowMoreToggle expanded={showAll} onClick={() => setShowAll(!showAll)} />
      </div>

      {/* ── below the fold (hidden on mobile unless expanded) ── */}
      <div
        className={`grid transition-all duration-300 ease-in-out lg:block ${
          showAll ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 lg:opacity-100"
        }`}
      >
        <div className="overflow-hidden space-y-3 sm:space-y-4 lg:space-y-6">

      {/* Personalized plan */}
      <Suspense fallback={<MedCard />}>
        <PersonalizedPlan />
      </Suspense>

      {/* Daily Quests */}
      <Suspense fallback={<MedCard />}>
        <DailyQuestsSection />
      </Suspense>

      {/* Brain Journey */}
      <Suspense fallback={<MedCard />}>
        <BrainJourney />
      </Suspense>

      {/* Cognitive Identity + Momentum Recovery */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-2">
        <Suspense fallback={<TallCard />}><CognitiveIdentityCard /></Suspense>
        <Suspense fallback={<TallCard />}><MomentumRecovery /></Suspense>
      </div>

      {/* Missed Day Simulator */}
      <Suspense fallback={<MedCard />}>
        <MissedDaySimulator />
      </Suspense>

      {/* Brain Health + Adaptive Habits */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-2">
        <Suspense fallback={<TallCard />}><BrainHealthInsights /></Suspense>
        <Suspense fallback={<TallCard />}><AdaptiveHabitIntelligence /></Suspense>
      </div>

      {/* Smart Reminders */}
      <Suspense fallback={<MedCard />}>
        <SmartRemindersSection />
      </Suspense>

      {/* Push notifications */}
      <Suspense fallback={<MedCard />}>
        <PushNotificationCard />
      </Suspense>

      {/* Streak Protection + 365-Day Journey */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-2">
        <Suspense fallback={<TallCard />}><StreakProtectionCard /></Suspense>
        <Suspense fallback={<TallCard />}><ThreeSixFiveJourney /></Suspense>
      </div>

      {/* Weekly missions */}
      <Suspense fallback={<Skeleton className="h-32" />}>
        <MissionsSection />
      </Suspense>

      {/* Accountability partner */}
      <Suspense fallback={<MedCard />}>
        <AccountabilityPartner />
      </Suspense>

      </div>{/* end inner */}
      </div>{/* end below-the-fold wrapper */}
    </div>
  );
}
