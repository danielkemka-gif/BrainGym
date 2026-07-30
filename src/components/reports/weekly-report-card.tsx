"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/icons";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Flame,
  Target,
  Calendar,
  ArrowRight,
  Download,
  Sparkles,
} from "lucide-react";

interface WeeklyReport {
  week_start: string;
  week_end: string;
  avg_score: number;
  score_change: number;
  activities_completed: number;
  streak_days: number;
  top_category: string;
  weakest_category: string;
  improvement_pct: number;
  summary: string;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  memory: "from-indigo-500 to-violet-600",
  focus: "from-amber-400 to-orange-500",
  thinking: "from-emerald-400 to-teal-600",
  learning: "from-sky-400 to-blue-600",
  health: "from-rose-400 to-red-500",
  creativity: "from-pink-400 to-fuchsia-600",
  "emotional-intelligence": "from-violet-400 to-purple-600",
};

function getTrendIcon(change: number) {
  if (change > 2) return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (change < -2) return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function WeeklyReportCard() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [prevScores, setPrevScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      const now = new Date();
      const dayOfWeek = now.getDay();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const lastWeekStart = new Date(weekStart);
      lastWeekStart.setDate(weekStart.getDate() - 7);

      // Get this week's activity counts
      const wsStr = weekStart.toISOString().split("T")[0];
      const weStr = weekEnd.toISOString().split("T")[0];
      const lwsStr = lastWeekStart.toISOString().split("T")[0];

      Promise.all([
        supabase
          .from("activity_logs")
          .select("category_id, date, xp_earned")
          .eq("user_id", user.id)
          .gte("date", wsStr)
          .lte("date", weStr),
        supabase
          .from("activity_logs")
          .select("category_id, date")
          .eq("user_id", user.id)
          .gte("date", lwsStr)
          .lt("date", wsStr),
        supabase
          .from("brain_scores")
          .select("category_id, score, date")
          .eq("user_id", user.id)
          .gte("date", lwsStr)
          .order("date", { ascending: false }),
        supabase
          .from("streaks")
          .select("current_streak")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]).then(([weekLogs, lastWeekLogs, scoreData, streakRes]) => {
        const thisWeekActivities = weekLogs.data ?? [];
        const lastWeekActivities = lastWeekLogs.data ?? [];

        // Category scores this week
        const thisWeekScores: Record<string, number> = {};
        const lastWeekScores: Record<string, number> = {};
        const scoreRows = scoreData.data ?? [];

        for (const row of scoreRows) {
          if (new Date(row.date) >= weekStart) {
            if (!thisWeekScores[row.category_id]) thisWeekScores[row.category_id] = row.score;
          } else {
            if (!lastWeekScores[row.category_id]) lastWeekScores[row.category_id] = row.score;
          }
        }

        // Fill in defaults
        for (const cat of CATEGORIES) {
          if (!thisWeekScores[cat.id]) thisWeekScores[cat.id] = 50;
          if (!lastWeekScores[cat.id]) lastWeekScores[cat.id] = 50;
        }

        // Calculate averages
        const scoresArr = Object.values(thisWeekScores);
        const avgScore = scoresArr.length > 0 ? scoresArr.reduce((a, b) => a + b, 0) / scoresArr.length : 50;
        const prevScoresArr = Object.values(lastWeekScores);
        const prevAvg = prevScoresArr.length > 0 ? prevScoresArr.reduce((a, b) => a + b, 0) / prevScoresArr.length : 50;

        // Find top/weakest
        let topCat: typeof CATEGORIES[number] = CATEGORIES[0];
        let weakCat: typeof CATEGORIES[number] = CATEGORIES[0];
        for (const cat of CATEGORIES) {
          if ((thisWeekScores[cat.id] ?? 50) > (thisWeekScores[topCat.id] ?? 50)) topCat = cat;
          if ((thisWeekScores[cat.id] ?? 50) < (thisWeekScores[weakCat.id] ?? 50)) weakCat = cat;
        }

        // Streak days this week
        const uniqueDays = new Set(thisWeekActivities.map((l) => l.date)).size;

        // Unique activity days
        const uniqueDaysLast = new Set(lastWeekActivities.map((l) => l.date)).size;

        setScores(thisWeekScores);
        setPrevScores(lastWeekScores);
        setReport({
          week_start: wsStr,
          week_end: weStr,
          avg_score: Math.round(avgScore * 10) / 10,
          score_change: Math.round((avgScore - prevAvg) * 10) / 10,
          activities_completed: thisWeekActivities.length,
          streak_days: streakRes.data?.current_streak ?? 0,
          top_category: topCat.slug,
          weakest_category: weakCat.slug,
          improvement_pct: prevAvg > 0 ? Math.round(((avgScore - prevAvg) / prevAvg) * 100 * 10) / 10 : 0,
          summary: generateSummary(avgScore, avgScore - prevAvg, thisWeekActivities.length, uniqueDays),
        });
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />)}
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Weekly Report</h2>
            <p className="text-xs text-muted-foreground">{formatDate(report.week_start)} — {formatDate(report.week_end)}</p>
          </div>
        </div>
        {getTrendIcon(report.score_change)}
      </div>

      {/* Stats grid */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Avg Brain Score</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{report.avg_score}</p>
          <p className={`text-xs font-medium ${report.score_change > 0 ? "text-emerald-400" : report.score_change < 0 ? "text-red-400" : "text-muted-foreground"}`}>
            {report.score_change > 0 ? "+" : ""}{report.score_change} from last week
          </p>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Activities Done</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{report.activities_completed}</p>
          <p className="text-xs text-muted-foreground">{report.streak_days}-day streak</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mb-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category Scores</p>
        {CATEGORIES.map((cat) => {
          const score = scores[cat.id] ?? 50;
          const prevScore = prevScores[cat.id] ?? 50;
          const change = score - prevScore;
          const CatIcon = CATEGORY_ICONS[cat.slug];

          return (
            <div key={cat.id} className="flex items-center gap-2">
              <span className="w-20 sm:w-28 truncate text-xs font-medium">{cat.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${score}%`,
                    background: cat.color,
                  }}
                />
              </div>
              <span className="w-8 text-right text-xs font-bold tabular-nums">{score}</span>
              <span className={`w-10 text-right text-[10px] font-medium ${change > 0 ? "text-emerald-400" : change < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                {change > 0 ? "+" : ""}{Math.round(change)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Top and weakest */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[10px] font-semibold uppercase text-emerald-400">Strongest</span>
          </div>
          <p className="mt-1 text-sm font-bold capitalize">{report.top_category.replace("-", " ")}</p>
        </div>
        <div className="flex-1 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px] font-semibold uppercase text-amber-400">Needs Work</span>
          </div>
          <p className="mt-1 text-sm font-bold capitalize">{report.weakest_category.replace("-", " ")}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-xl bg-primary/5 p-4">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">AI Summary</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{report.summary}</p>
      </div>
    </div>
  );
}

function generateSummary(avg: number, change: number, activities: number, days: number): string {
  const parts: string[] = [];

  if (change > 5) {
    parts.push(`Excellent progress this week! Your brain score improved by ${Math.round(change)} points.`);
  } else if (change > 0) {
    parts.push(`Steady improvement — your score inched up by ${Math.round(change)} points.`);
  } else if (change === 0) {
    parts.push(`Your scores held steady this week.`);
  } else {
    parts.push(`Scores dipped slightly by ${Math.abs(Math.round(change))} points — consistency will help.`);
  }

  if (activities >= 20) {
    parts.push(`With ${activities} activities across ${days} days, you're building strong neural pathways.`);
  } else if (activities >= 10) {
    parts.push(`You completed ${activities} activities — try to hit 20+ for faster progress.`);
  } else if (activities > 0) {
    parts.push(`Only ${activities} activities this week. Aim for at least 3 per day for optimal results.`);
  } else {
    parts.push(`No activities completed — even 5 minutes a day makes a difference.`);
  }

  if (avg >= 70) {
    parts.push(`Your overall score of ${Math.round(avg)} is in the strong range. Keep it up!`);
  } else if (avg >= 50) {
    parts.push(`At ${Math.round(avg)}, you have great potential — consistent training will unlock it.`);
  } else {
    parts.push(`Starting at ${Math.round(avg)} means there's huge room for improvement. Every session counts!`);
  }

  return parts.join(" ");
}
