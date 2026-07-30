"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/constants";
import { Bot, ArrowRight, TrendingUp, TrendingDown, Target, Flame } from "lucide-react";

interface CoachTip {
  icon: React.ReactNode;
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
  gradient: string;
}

const TIPS = {
  weakCategory: (cat: string, score: number) => ({
    icon: <Target className="h-5 w-5 text-amber-400" />,
    title: "Focus Area Detected",
    message: `Your ${cat} score is ${score}/100. Training this area 3x this week could boost it by 10+ points.`,
    actionLabel: "Train Now",
    actionHref: "/dashboard/workout",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
  }),
  strongCategory: (cat: string, score: number) => ({
    icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
    title: "Strength Highlight",
    message: `Your ${cat} is at ${score}/100 — that's excellent! Keep maintaining it with weekly sessions.`,
    actionLabel: "Keep Sharp",
    actionHref: "/dashboard/library",
    gradient: "from-emerald-500/10 to-green-500/10 border-emerald-500/20",
  }),
  streakAtRisk: (streak: number) => ({
    icon: <Flame className="h-5 w-5 text-red-400" />,
    title: "Streak At Risk",
    message: `Your ${streak}-day streak needs a workout today. Don't break the chain!`,
    actionLabel: "Quick Workout",
    actionHref: "/dashboard/workout",
    gradient: "from-red-500/10 to-rose-500/10 border-red-500/20",
  }),
  noActivityToday: () => ({
    icon: <Bot className="h-5 w-5 text-primary" />,
    title: "Daily Brain Tip",
    message: "Even 5 minutes of focused training strengthens neural pathways. Your brain adapts to what you practice.",
    actionLabel: "Start Training",
    actionHref: "/dashboard/workout",
    gradient: "from-primary/10 to-violet-500/10 border-primary/20",
  }),
  scoredDrop: (cat: string, drop: number) => ({
    icon: <TrendingDown className="h-5 w-5 text-orange-400" />,
    title: "Score Dropped",
    message: `Your ${cat} dropped ${drop} points recently. Consistent daily practice prevents score decay.`,
    actionLabel: "Recover Now",
    actionHref: "/dashboard/workout",
    gradient: "from-orange-500/10 to-amber-500/10 border-orange-500/20",
  }),
  default: () => ({
    icon: <Bot className="h-5 w-5 text-primary" />,
    title: "Brain Training Tip",
    message: "Did you know? Your brain forms new neural connections with each training session. Keep going!",
    actionLabel: "Train Today",
    actionHref: "/dashboard/workout",
    gradient: "from-primary/10 to-violet-500/10 border-primary/20",
  }),
};

const DISMISS_KEY = "braingym_coach_tip_dismiss";
const DISMISS_DURATION_MS = 12 * 60 * 60 * 1000;

function wasDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    return Date.now() - parseInt(raw, 10) < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

export function CoachNudge() {
  const { user, supabase } = useAuth();
  const [tip, setTip] = useState<CoachTip | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    if (wasDismissed()) { setLoading(false); return; }

    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

    Promise.all([
      supabase.from("brain_scores").select("score, category_id").eq("user_id", user.id).order("date", { ascending: false }),
      supabase.from("streaks").select("current_streak, last_workout_date").eq("user_id", user.id).maybeSingle(),
      supabase.from("daily_workouts").select("status").eq("user_id", user.id).eq("date", today).maybeSingle(),
    ]).then(([scoresRes, streakRes, todayWorkout]) => {
        const scores = scoresRes.data ?? [];
        const streak = streakRes.data;
        const didWorkoutToday = todayWorkout.data?.status === "completed";

        if (didWorkoutToday) { setLoading(false); return; }

        // Find weakest category
        const byCategory: Record<string, number[]> = {};
        scores.forEach((s) => {
          if (!byCategory[s.category_id]) byCategory[s.category_id] = [];
          byCategory[s.category_id].push(s.score);
        });

        let weakest: { cat: string; score: number } | null = null;
        let strongest: { cat: string; score: number } | null = null;

        for (const [catId, vals] of Object.entries(byCategory)) {
          const latest = vals[0] ?? 50;
          const catDef = CATEGORIES.find((c) => c.id === catId);
          if (!weakest || latest < weakest.score) weakest = { cat: catDef?.label ?? "Unknown", score: latest };
          if (!strongest || latest > strongest.score) strongest = { cat: catDef?.label ?? "Unknown", score: latest };
        }

        // Check for score drops
        let dropInfo: { cat: string; drop: number; catName: string } | null = null;
        for (const [catId, vals] of Object.entries(byCategory)) {
          if (vals.length >= 2) {
            const drop = vals[1] - vals[0];
            if (drop >= 5) {
              const catDef = CATEGORIES.find((c) => c.id === catId);
              dropInfo = { cat: catId, drop, catName: catDef?.label ?? "Unknown" };
              break;
            }
          }
        }

        const currentStreak = streak?.current_streak ?? 0;
        const lastDate = streak?.last_workout_date;
        const missedToday = lastDate !== today;
        const isStreakAtRisk = currentStreak >= 3 && missedToday && new Date().getHours() >= 14;

        // Priority: streak at risk > score drop > weak category > strong category > default
        if (isStreakAtRisk) {
          setTip(TIPS.streakAtRisk(currentStreak));
        } else if (dropInfo) {
          setTip(TIPS.scoredDrop(dropInfo.catName, dropInfo.drop));
        } else if (weakest && weakest.score < 50) {
          setTip(TIPS.weakCategory(weakest.cat, weakest.score));
        } else if (strongest && strongest.score >= 70) {
          setTip(TIPS.strongCategory(strongest.cat, strongest.score));
        } else {
          setTip(TIPS.noActivityToday());
        }

        setLoading(false);
      });
  }, [user]);

  function handleDismiss() {
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, Date.now().toString()); } catch {}
  }

  if (loading || !tip || dismissed) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-r p-4 sm:p-5 ${tip.gradient}`}>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
        aria-label="Dismiss"
      >
        <span className="sr-only">Dismiss</span>
        ×
      </button>

      <div className="flex items-start gap-3">
        <div className="mt-0.5">{tip.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{tip.title}</p>
          <p className="text-sm font-medium pr-6">{tip.message}</p>
          <Link
            href={tip.actionHref}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline min-h-[44px] touch-manipulation"
          >
            {tip.actionLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
