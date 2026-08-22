"use client";

import { HabitMetricState } from "@/lib/habit-engine";
import { Clock, Flame, Shield, Award, Sparkles, CheckCircle2 } from "lucide-react";

interface BrainAgeMilestonesProps {
  habit: HabitMetricState;
}

const MILESTONES = [
  { days: 7, title: "Brain Starter", tier: 1, reward: "500 XP + Bronze Badge" },
  { days: 14, title: "Brain Builder", tier: 2, reward: "1,000 XP + Streak Shield" },
  { days: 30, title: "Brain Athlete", tier: 3, reward: "2,500 XP + Silver Badge" },
  { days: 60, title: "Brain Master", tier: 4, reward: "5,000 XP + Gold Badge" },
  { days: 100, title: "Brain Elite", tier: 5, reward: "10,000 XP + Master Title" },
];

export function BrainAgeMilestones({ habit }: BrainAgeMilestonesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
      {/* ─── Card 1: Brain Age Journey ───────────────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-foreground">
              Brain Age Journey
            </h3>
            <p className="text-xs text-muted-foreground">
              Cognitive vitality based on working memory and speed data
            </p>
          </div>
        </div>

        {/* Age Stat Box */}
        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Current Brain Age
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
                {habit.brainAge}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                (Previous: {habit.previousBrainAge})
              </span>
            </div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              🎉 Improved by -{habit.ageImprovementYears} years younger
            </p>
          </div>

          <span className="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-xs font-bold shadow-sm">
            {habit.brainAgeLabel}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          «You&apos;ve improved by {habit.ageImprovementYears} years. Keep your morning streak consistent to lock in neural neuroplasticity.»
        </p>
      </div>

      {/* ─── Card 2: Streak Milestones & Shields ──────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-foreground">
                Streak Milestone Path
              </h3>
              <p className="text-xs text-muted-foreground">
                Current: <span className="font-bold text-orange-500">🔥 {habit.streak}-Day Streak</span>
              </p>
            </div>
          </div>

          {/* Active Shield */}
          <div className="flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <Shield className="h-3.5 w-3.5" />
            <span>{habit.streakShields} Shields</span>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-1.5">
          {MILESTONES.map((m) => {
            const isUnlocked = habit.streak >= m.days;
            const isCurrentTarget = !isUnlocked && (habit.streakMilestone.nextMilestone === m.days);
            return (
              <div
                key={m.days}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition ${
                  isUnlocked
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                    : isCurrentTarget
                    ? "bg-orange-500/10 border border-orange-500/30 text-foreground font-bold"
                    : "bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isUnlocked ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 text-[9px] font-bold">
                      {m.tier}
                    </span>
                  )}
                  <span>
                    {m.days} Days — {m.title}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{m.reward}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
