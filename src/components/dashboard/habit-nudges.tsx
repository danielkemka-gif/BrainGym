"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { X, Zap, ArrowRight, Dumbbell, Users, Flame, TrendingUp, Globe } from "lucide-react";

interface Nudge {
  type: "time" | "missed" | "consistency" | "progress" | "social";
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

const DISMISS_KEY = "braingym_nudge_dismiss";
const DISMISS_DURATION_MS = 4 * 60 * 60 * 1000;

function wasDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = parseInt(raw, 10);
    return Date.now() - dismissedAt < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  } catch {}
}

export function HabitNudges() {
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wasDismissed()) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      Promise.all([
        supabase.from("daily_workouts").select("status").eq("user_id", user.id).eq("date", today).maybeSingle(),
        supabase.from("daily_workouts").select("status").eq("user_id", user.id).eq("date", yesterday).maybeSingle(),
        supabase.from("streaks").select("current_streak").eq("user_id", user.id).maybeSingle(),
        supabase.from("profiles").select("preferred_workout_time").eq("user_id", user.id).maybeSingle(),
        supabase.from("brain_scores").select("score, category_id").eq("user_id", user.id).order("date", { ascending: false }),
        supabase.from("daily_workouts").select("id").eq("user_id", user.id).limit(1),
      ]).then(([todayWorkout, yesterdayWorkout, streak, profile, scores, hasHistory]) => {
        const todayDone = todayWorkout.data?.status === "completed";
        if (todayDone) { setLoading(false); return; }

        const now = new Date();
        const currentHour = now.getHours();
        const preferredTime = profile.data?.preferred_workout_time;
        let preferredHour = 9;
        if (preferredTime) {
          const h = parseInt(preferredTime.split(":")[0], 10);
          if (!isNaN(h)) preferredHour = h;
        }

        const currentStreak = streak.data?.current_streak ?? 0;
        const missedYesterday = !yesterdayWorkout.data || yesterdayWorkout.data.status !== "completed";

        // Priority 1: Time-based nudge
        if (currentHour >= preferredHour + 1) {
          setNudge({
            type: "time",
            message: "It's workout time! Your brain is waiting.",
            actionLabel: "Start Training",
            actionHref: "/dashboard/workout",
          });
          setLoading(false);
          return;
        }

        // Priority 2: Missed day nudge — show for streak holders AND returning users
        const hasWorkoutHistory = (hasHistory.data?.length ?? 0) > 0;
        if (missedYesterday && (currentStreak > 0 || hasWorkoutHistory)) {
          const message = currentStreak > 0
            ? "Welcome back! A quick session keeps your streak alive."
            : "We missed you! Even 5 minutes keeps your progress going.";
          setNudge({
            type: "missed",
            message,
            actionLabel: "Quick 5-min workout",
            actionHref: "/dashboard/workout",
          });
          setLoading(false);
          return;
        }

        // Priority 3: Consistency nudge
        if (currentStreak >= 3) {
          setNudge({
            type: "consistency",
            message: `You're on fire! Day ${currentStreak} streak — keep the momentum!`,
            actionLabel: "Continue streak",
            actionHref: "/dashboard/workout",
          });
          setLoading(false);
          return;
        }

        // Priority 4: Progress nudge (score improvements)
        if (scores.data && scores.data.length > 0) {
          const byCategory: Record<string, number[]> = {};
          scores.data.forEach((s) => {
            if (!byCategory[s.category_id]) byCategory[s.category_id] = [];
            byCategory[s.category_id].push(s.score);
          });
          for (const [, vals] of Object.entries(byCategory)) {
            if (vals.length >= 2 && vals[0] > vals[1]) {
              const diff = vals[0] - vals[1];
              setNudge({
                type: "progress",
                message: `Your score went up ${diff} points — great improvement!`,
                actionLabel: "View Progress",
                actionHref: "/dashboard/progress",
              });
              setLoading(false);
              return;
            }
          }
        }

        // Priority 5: Social nudge
        setNudge({
          type: "social",
          message: "Join thousands training their brains right now!",
          actionLabel: "Start Training",
          actionHref: "/dashboard/workout",
        });
        setLoading(false);
      });
    });
  }, []);

  function handleDismiss() {
    setDismissed(true);
    markDismissed();
  }

  if (loading || !nudge || dismissed) return null;

  const gradients: Record<string, string> = {
    time: "from-orange-500/10 to-red-500/10 border-orange-500/20",
    missed: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    consistency: "from-green-500/10 to-emerald-500/10 border-green-500/20",
    progress: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
    social: "from-pink-500/10 to-rose-500/10 border-pink-500/20",
  };

  const iconComponents: Record<string, React.ReactNode> = {
    time: <Dumbbell className="h-5 w-5 text-orange-400" />,
    missed: <Users className="h-5 w-5 text-blue-400" />,
    consistency: <Flame className="h-5 w-5 text-green-400" />,
    progress: <TrendingUp className="h-5 w-5 text-violet-400" />,
    social: <Globe className="h-5 w-5 text-pink-400" />,
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-r p-4 ${gradients[nudge.type]}`}>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="mt-0.5">{iconComponents[nudge.type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium pr-6">{nudge.message}</p>
          {nudge.actionLabel && nudge.actionHref && (
            <Link
              href={nudge.actionHref}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Zap className="h-3 w-3" />
              {nudge.actionLabel}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
