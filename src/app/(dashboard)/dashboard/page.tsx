"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth";
import { fetchHabitEngineState, HabitMetricState } from "@/lib/habit-engine";
import { MorningHabitHero } from "@/components/dashboard/morning-habit-hero";
import { LiveHabitPointer } from "@/components/dashboard/live-habit-pointer";
import { DailyHabitMission } from "@/components/dashboard/daily-habit-mission";
import { BeatYourselfCard } from "@/components/dashboard/beat-yourself-card";
import { BrainAgeMilestones } from "@/components/dashboard/brain-age-milestones";
import { WeeklyBrainReportCard } from "@/components/dashboard/weekly-brain-report-card";
import { WelcomeTour } from "@/components/dashboard/welcome-tour";
import { LevelUpCelebration } from "@/components/dashboard/level-up-celebration";
import { Swords, MessageCircle, Gamepad2, Scale, Compass, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

/* ---------- Dynamic secondary modules ---------- */
const DashboardPremiumHero = dynamic(
  () => import("@/components/dashboard/dashboard-premium-hero").then((m) => ({ default: m.DashboardPremiumHero })),
  { ssr: false }
);

function HabitSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-muted rounded-xl w-3/4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-20 bg-muted rounded-2xl" />
      </div>
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
    return (
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-4 py-4 space-y-4">
        <HabitSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 sm:space-y-5 lg:space-y-6 overflow-x-hidden pb-6">
      {/* First-visit welcome tour & level celebration */}
      <WelcomeTour />
      <LevelUpCelebration />

      {/* ─── 1. MORNING HABIT HERO (Greeting, 4 Core Metrics & TODAY'S WORKOUT) ─ */}
      <MorningHabitHero habit={habit} />

      {/* ─── 2. LIVE NEXT-STEP POINTER (Zero trial & error guidance) ─────────── */}
      <LiveHabitPointer habit={habit} />

      {/* ─── 3. PRO MEMBERSHIP PERKS & BENEFITS HERO ─────────────────────────── */}
      <Suspense fallback={<div className="h-32 bg-muted rounded-2xl animate-pulse" />}>
        <DashboardPremiumHero />
      </Suspense>

      {/* ─── 4. TODAY'S DAILY HABIT MISSION ─────────────────────────────────── */}
      <DailyHabitMission habit={habit} />

      {/* ─── 4. BEAT YOURSELF & BRAIN SCORE BREAKDOWN ──────────────────────── */}
      <BeatYourselfCard habit={habit} />

      {/* ─── 5. BRAIN AGE JOURNEY & STREAK MILESTONES ───────────────────────── */}
      <BrainAgeMilestones habit={habit} />

      {/* ─── 6. WEEKLY BRAIN REPORT & NEXT WEEK'S GOAL ───────────────────────── */}
      <WeeklyBrainReportCard habit={habit} />

      {/* ─── 7. SECONDARY QUICK ACCESS BAR ──────────────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Explore More Cognitive Activities
          </h3>
          <span className="text-[11px] text-muted-foreground">177+ Drills</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Link
            href="/dashboard/challenges"
            className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-muted/30 p-3 hover:bg-muted/60 transition active:scale-[0.98] min-h-[48px] touch-manipulation"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Swords className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">1v1 Brain Duel</p>
              <p className="text-[10px] text-muted-foreground truncate">2-Player Live Arena</p>
            </div>
          </Link>

          <Link
            href="/dashboard/chat"
            className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-muted/30 p-3 hover:bg-muted/60 transition active:scale-[0.98] min-h-[48px] touch-manipulation"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">Community Chat</p>
              <p className="text-[10px] text-muted-foreground truncate">Connect with Thinkers</p>
            </div>
          </Link>

          <Link
            href="/dashboard/decision-lab"
            className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-muted/30 p-3 hover:bg-muted/60 transition active:scale-[0.98] min-h-[48px] touch-manipulation"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Scale className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">Decision Lab</p>
              <p className="text-[10px] text-muted-foreground truncate">Cognitive Biases</p>
            </div>
          </Link>

          <Link
            href="/dashboard/library"
            className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-muted/30 p-3 hover:bg-muted/60 transition active:scale-[0.98] min-h-[48px] touch-manipulation"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Gamepad2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">All Drills</p>
              <p className="text-[10px] text-muted-foreground truncate">Browse 177+ Games</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
