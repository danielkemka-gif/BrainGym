"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/constants";
import { Check } from "lucide-react";
import { MILESTONE_ICONS } from "@/lib/icons";

interface Milestone {
  id: string;
  label: string;
  iconKey: string;
  check: (stats: UserStats) => boolean;
}

interface UserStats {
  totalWorkouts: number;
  longestStreak: number;
  level: number;
  categoriesTried: number;
  totalActivities: number;
  brainScore: number;
}

const MILESTONES: Milestone[] = [
  { id: "first_workout", label: "First Workout", iconKey: "first_workout", check: (s) => s.totalWorkouts >= 1 },
  { id: "7day_streak", label: "7-Day Streak", iconKey: "7day_streak", check: (s) => s.longestStreak >= 7 },
  { id: "level_5", label: "Level 5", iconKey: "level_5", check: (s) => s.level >= 5 },
  { id: "all_categories", label: "All Categories", iconKey: "all_categories", check: (s) => s.categoriesTried >= CATEGORIES.length },
  { id: "100_activities", label: "100 Activities", iconKey: "100_activities", check: (s) => s.totalActivities >= 100 },
  { id: "brain_80", label: "Brain Score 80+", iconKey: "brain_80", check: (s) => s.brainScore >= 80 },
  { id: "level_10", label: "Level 10", iconKey: "level_10", check: (s) => s.level >= 10 },
  { id: "brain_god", label: "Brain God", iconKey: "brain_god", check: (s) => s.level >= 15 },
];

const MOTIVATIONAL_MESSAGES = [
  { maxUnlocked: 1, text: "You're just getting started — every workout counts!" },
  { maxUnlocked: 3, text: "Building momentum — you're on your way!" },
  { maxUnlocked: 6, text: "Serious progress — keep pushing!" },
  { maxUnlocked: Infinity, text: "You're among the elite — Brain God awaits!" },
];

function getMotivationalMessage(unlockedCount: number): string {
  for (const msg of MOTIVATIONAL_MESSAGES) {
    if (unlockedCount <= msg.maxUnlocked) return msg.text;
  }
  return MOTIVATIONAL_MESSAGES[MOTIVATIONAL_MESSAGES.length - 1].text;
}

export function BrainJourney() {
  const { user, supabase } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return; }

    Promise.all([
      supabase.from("daily_workouts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "completed"),
      supabase.from("streaks").select("longest_streak").eq("user_id", user.id).maybeSingle(),
      supabase.from("xp_ledger").select("amount").eq("user_id", user.id),
      supabase.from("activity_logs").select("activity_id, activities!inner(category_id)").eq("user_id", user.id),
      supabase.from("brain_scores").select("score").eq("user_id", user.id).order("date", { ascending: false }),
    ]).then(([workouts, streak, xp, logs, scores]) => {
      if (cancelled) return;

      const totalXp = xp.data ? xp.data.reduce((s, r) => s + r.amount, 0) : 0;
      let level = 1;
      const LEVEL_THRESHOLDS = [0, 500, 1500, 4000, 10000, 20000, 35000, 55000, 80000, 120000, 170000, 230000, 300000, 400000, 500000];
      for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalXp >= LEVEL_THRESHOLDS[i]) { level = i + 1; break; }
      }

      const uniqueCategories = new Set<string>();
      let totalActivities = 0;
      if (logs.data) {
        totalActivities = logs.data.length;
        logs.data.forEach((l: any) => {
          const catId = l.activities?.category_id;
          if (catId) uniqueCategories.add(catId);
        });
      }

      const avgScore = scores.data && scores.data.length > 0
        ? Math.round(scores.data.reduce((s, r) => s + r.score, 0) / scores.data.length)
        : 0;

      setStats({
        totalWorkouts: workouts.count ?? 0,
        longestStreak: streak.data?.longest_streak ?? 0,
        level,
        categoriesTried: uniqueCategories.size,
        totalActivities,
        brainScore: avgScore,
      });
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [user, supabase]);

  if (loading || !stats) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="h-5 w-36 animate-pulse rounded bg-muted mb-4" />
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const unlocked = MILESTONES.filter((m) => m.check(stats));
  const currentIndex = unlocked.length;
  const message = getMotivationalMessage(unlocked.length);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 overflow-x-hidden">
      <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Your Brain Journey</h3>

      {/* Timeline */}
      <div className="relative overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex items-center min-w-[640px] relative">
          {/* Background path */}
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-muted" />

          {/* Completed path */}
          {currentIndex > 0 && (
            <div
              className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${(currentIndex / MILESTONES.length) * 100}%` }}
            />
          )}

          {/* Milestone stops */}
          {MILESTONES.map((milestone, i) => {
            const isUnlocked = i < currentIndex;
            const isCurrent = i === currentIndex;
            const leftPercent = (i / (MILESTONES.length - 1)) * 100;

            return (
              <div
                key={milestone.id}
                className="absolute flex flex-col items-center"
                style={{ left: `${leftPercent}%`, transform: "translateX(-50%)" }}
              >
                {/* Icon bubble */}
                <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm transition-all ${
                  isUnlocked
                    ? "bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg shadow-primary/25"
                    : isCurrent
                    ? "bg-card border-2 border-primary text-primary animate-pulse"
                    : "bg-muted text-muted-foreground border border-border"
                }`}>
                  {isUnlocked ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    (() => { const MileIcon = MILESTONE_ICONS[milestone.iconKey]; return MileIcon ? <MileIcon className="h-4 w-4" /> : null; })()
                  )}
                </div>

                {/* Label */}
                <p className={`mt-2 text-[10px] font-medium whitespace-nowrap ${
                  isUnlocked ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {milestone.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational message */}
      <div className="mt-10 sm:mt-14 rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 px-3 sm:px-4 py-2.5 sm:py-3 text-center">
        <p className="text-sm font-medium">{message}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {unlocked.length} / {MILESTONES.length} milestones unlocked
        </p>
      </div>
    </div>
  );
}
