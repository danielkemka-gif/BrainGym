"use client";

import { useState } from "react";
import { Award, CheckCircle2, Flame, Trophy, Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface ThirtyDayChallengeProps {
  currentDay?: number;
  completedDays?: number[];
  streak?: number;
}

export function ThirtyDayChallenge({
  currentDay = 14,
  completedDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  streak = 14,
}: ThirtyDayChallengeProps) {
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);
  const progressPercent = Math.round((completedDays.length / 30) * 100);

  const milestones = [
    { day: 7, title: "Brain Starter", xp: 500, badge: "🥉 Bronze Mind" },
    { day: 14, title: "Brain Builder", xp: 1000, badge: "🛡️ Streak Shield" },
    { day: 21, title: "Brain Habit Master", xp: 2000, badge: "🥈 Silver Mind" },
    { day: 30, title: "30-Day Brain Transformation", xp: 5000, badge: "🥇 Gold Mastermind & Certificate" },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Hero Banner ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-purple-500/15 via-card to-indigo-500/15 p-5 sm:p-7 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-purple-700 dark:text-purple-300">
                Official Program
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                🔥 {streak}-Day Streak Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mt-1">
              THE 30-DAY BRAINGYM CHALLENGE
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
              Train your brain for 5–10 minutes every day for 30 consecutive days. Unlock permanent neuroplastic gains and earn your official graduation certificate.
            </p>
          </div>

          <div className="rounded-2xl bg-card border border-border p-3.5 text-center min-w-[140px] shadow-sm">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Challenge Progress</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              Day {completedDays.length}/30
            </p>
            <span className="text-[10px] font-bold text-emerald-500">{progressPercent}% Complete</span>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="h-3 w-full rounded-full bg-muted/80 overflow-hidden border border-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── 30-Day Visual Grid (Day 1 → Day 30) ─────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-foreground">
              30-Day Training Path
            </h3>
            <p className="text-xs text-muted-foreground">
              Tap any day to view workout focus and milestone rewards
            </p>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {completedDays.length} Days Unlocked
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-2 sm:gap-2.5">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isDone = completedDays.includes(day);
            const isCurrent = day === completedDays.length + 1;
            const isMilestone = [7, 14, 21, 30].includes(day);
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all active:scale-95 touch-manipulation min-h-[56px] ${
                  isSelected
                    ? "ring-2 ring-purple-500 shadow-md"
                    : ""
                } ${
                  isDone
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : isCurrent
                    ? "border-purple-500 bg-purple-500/10 text-purple-600 font-black animate-pulse"
                    : "border-border bg-muted/40 text-muted-foreground opacity-70"
                }`}
              >
                {isMilestone && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] text-white font-bold shadow-sm">
                    ★
                  </span>
                )}
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mb-0.5" />
                ) : isCurrent ? (
                  <Flame className="h-4 w-4 text-purple-600 mb-0.5" />
                ) : (
                  <Lock className="h-3.5 w-3.5 mb-0.5 opacity-40" />
                )}
                <span className="text-xs font-black">D{day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Milestone Reward Tiers ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {milestones.map((m) => {
          const reached = completedDays.length >= m.day;
          return (
            <div
              key={m.day}
              className={`rounded-2xl border p-4 space-y-2 transition ${
                reached
                  ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                  : "border-border bg-card/60 text-muted-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">Day {m.day} Goal</span>
                {reached ? (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Unlocked ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-medium">Upcoming</span>
                )}
              </div>
              <h4 className="text-sm font-black text-foreground">{m.title}</h4>
              <p className="text-xs text-muted-foreground">
                Reward: <strong className="text-foreground">+{m.xp} XP</strong> · {m.badge}
              </p>
            </div>
          );
        })}
      </div>

      {/* ─── Quick Workout Action ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-primary/10 via-card to-violet-600/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-foreground">Ready for Day {completedDays.length + 1}?</h3>
          <p className="text-xs text-muted-foreground">
            Complete today&apos;s 7-minute workout to advance to Day {completedDays.length + 1} of your 30-day journey.
          </p>
        </div>
        <Link
          href="/dashboard/workout"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white px-6 py-3.5 text-xs sm:text-sm font-black shadow-lg shadow-primary/25 active:scale-95 transition touch-manipulation min-h-[48px] shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Train Day {completedDays.length + 1} Now</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
