"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  calculateActionStreak,
  getMemoryItems,
  getPersonalInsights,
  AkuchePersonalInsight,
} from "@/lib/akuche/memory-engine";
import { getDecisionRecords } from "@/lib/akuche/decisions-engine";
import { getAllGoals, BrainGoal } from "@/lib/goals/goals-engine";
import { StreakCalendar } from "@/components/progress/streak-calendar";
import { XpHistory } from "@/components/progress/xp-history";
import { AchievementsGrid } from "@/components/achievements/achievements-grid";
import {
  TrendingUp,
  Brain,
  Compass,
  Target,
  Activity,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";

export default function ProgressPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<BrainGoal[]>([]);
  const [streakData, setStreakData] = useState({ currentStreak: 1, bestStreak: 3, totalActionsCompleted: 0 });
  const [insights, setInsights] = useState<AkuchePersonalInsight[]>([]);
  const [decisionCount, setDecisionCount] = useState(0);

  useEffect(() => {
    getAllGoals().then((g) => setGoals(g));
    setStreakData(calculateActionStreak());
    setInsights(getPersonalInsights());
    setDecisionCount(getDecisionRecords().length);
  }, [user]);

  // 4 Core Development Pillars (Section 29)
  const PILLARS = [
    {
      title: "THINKING",
      icon: Brain,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
      skills: ["Problem Solving", "Executive Focus", "Working Memory", "Logical Reasoning"],
      level: "Level 4 · Intentional",
    },
    {
      title: "LIFE SKILLS",
      icon: Compass,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
      skills: ["Decision-Making", "Clear Communication", "Strategic Planning", "Self-Awareness"],
      level: "Level 3 · Developing",
    },
    {
      title: "PERSONAL",
      icon: Target,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
      skills: ["Real-Life Goals", "Action Consistency", "Commitments Met", "Reflection Loop"],
      level: "Level 5 · Consistent",
    },
    {
      title: "PHYSICAL",
      icon: Activity,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/30",
      skills: ["Brain Oxygenation", "Postural Mobility", "Bilateral Coordination", "Clarity Walks"],
      level: "Level 3 · Active",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 overflow-x-hidden px-3 sm:px-4 py-3 pb-28 text-foreground touch-manipulation">
      {/* Header (Section 29) */}
      <div className="space-y-1.5 pt-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>YOUR GROWTH · SECTION 29</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Your Growth
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Here&apos;s how you&apos;ve been developing across thinking, decision-making, and real-life action.
        </p>
      </div>

      {/* ─── 1. FOUR PILLARS OVERVIEW (SECTION 29) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className={`rounded-3xl border p-4 sm:p-5 shadow-sm space-y-3 bg-card ${p.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-background shadow-xs">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-black tracking-wider text-foreground">
                    {p.title}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-background/80 px-2 py-0.5 rounded-md text-foreground">
                  {p.level}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1">
                {p.skills.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                    <span className="truncate">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 2. INTELLIGENCE DISCOVERY (SECTION 30) ─── */}
      <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-card to-card p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            INTELLIGENCE DISCOVERY · OBSERVATION
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-foreground">
          You&apos;ve been practising strategic thinking and downside analysis more often recently.
        </h3>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">You worked on it through:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-foreground/80">
            <li>Business validation challenge &amp; 1-sentence offer pitch</li>
            <li>Decision Lab 10/10/10 worst-case stress test ({decisionCount} decisions logged)</li>
            <li>Daily structured planning sessions</li>
          </ul>
        </div>
      </div>

      {/* ─── 3. PROGRESS TIMELINE (SECTION 31) ─── */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm sm:text-base font-black text-foreground">
              Current Month Milestone Summary
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Active Journey
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
            <span className="text-lg sm:text-xl font-black text-foreground block">
              12
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Challenges
            </span>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
            <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 block">
              {goals.length || 4}
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Active Goals
            </span>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
            <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 block">
              8
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Thinking Areas
            </span>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
            <span className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400 block">
              6
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Real-World Actions
            </span>
          </div>
        </div>
      </div>

      {/* ─── 4. STREAK & CONSISTENCY ─── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StreakCalendar />
        <XpHistory />
      </div>

      {/* ─── 5. ACHIEVEMENTS & BADGES ─── */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-base font-black text-foreground mb-4">Milestones &amp; Badges</h2>
        <AchievementsGrid />
      </div>
    </div>
  );
}
