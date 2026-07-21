"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, DIFFICULTIES } from "@/lib/constants";
import { getLevelProgress } from "@/lib/scoring";

interface LogEntry {
  id: string;
  date: string;
  xp_earned: number;
  coins_earned: number;
  created_at: string;
  activities: { title: string; category_id: string; difficulty: string } | null;
}

export default function ReportsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      Promise.all([
        supabase
          .from("activity_logs")
          .select("id, date, xp_earned, coins_earned, created_at, activities!inner(title, category_id, difficulty)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("xp_ledger")
          .select("amount")
          .eq("user_id", user.id)
          .then((r) => r.data?.reduce((s, l) => s + l.amount, 0) ?? 0),
        supabase
          .from("coins_ledger")
          .select("amount")
          .eq("user_id", user.id)
          .then((r) => r.data?.reduce((s, l) => s + l.amount, 0) ?? 0),
        supabase
          .from("streaks")
          .select("current_streak, longest_streak")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]).then(([logsRes, xp, coins, streakRes]) => {
        setLogs((logsRes.data ?? []) as unknown as LogEntry[]);
        setTotalXp(xp);
        setTotalCoins(coins);
        setStreak({
          current: streakRes.data?.current_streak ?? 0,
          longest: streakRes.data?.longest_streak ?? 0,
        });
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const totalWorkouts = new Set(logs.map((l) => l.date)).size;
  const { level } = getLevelProgress(totalXp);

  // Category breakdown
  const catCount: Record<string, number> = {};
  for (const log of logs) {
    const c = log.activities?.category_id;
    if (c) catCount[c] = (catCount[c] ?? 0) + 1;
  }
  const maxCat = Math.max(...Object.values(catCount), 1);

  // Difficulty breakdown
  const diffCount: Record<string, number> = {};
  for (const log of logs) {
    const d = log.activities?.difficulty;
    if (d) diffCount[d] = (diffCount[d] ?? 0) + 1;
  }
  const maxDiff = Math.max(...Object.values(diffCount), 1);

  // Weekly XP trend (last 12 weeks)
  const weeklyXp: { week: string; xp: number }[] = [];
  const now = new Date();
  for (let w = 11; w >= 0; w--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekXp = logs
      .filter((l) => {
        const d = new Date(l.date);
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((s, l) => s + l.xp_earned, 0);

    weeklyXp.push({
      week: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      xp: weekXp,
    });
  }
  const maxWeeklyXp = Math.max(...weeklyXp.map((w) => w.xp), 1);

  // Most completed activities
  const actCount: Record<string, { count: number; title: string }> = {};
  for (const log of logs) {
    const t = log.activities?.title ?? "Unknown";
    if (!actCount[t]) actCount[t] = { count: 0, title: t };
    actCount[t].count++;
  }
  const topActivities = Object.values(actCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Deep insights into your brain training journey
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{totalWorkouts}</p>
          <p className="text-xs text-muted-foreground">Workouts</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{totalXp.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total XP</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{totalCoins.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Coins</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{level.level}</p>
          <p className="text-xs text-muted-foreground">Level</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{streak.current}</p>
          <p className="text-xs text-muted-foreground">Current streak</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{streak.longest}</p>
          <p className="text-xs text-muted-foreground">Best streak</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly XP trend */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Weekly XP Trend</h2>
          <div className="flex items-end gap-1.5" style={{ height: 120 }}>
            {weeklyXp.map((w, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary transition-all"
                  style={{
                    height: `${Math.max((w.xp / maxWeeklyXp) * 100, 4)}%`,
                    opacity: 0.5 + (w.xp / maxWeeklyXp) * 0.5,
                  }}
                />
                <span className="text-[10px] text-muted-foreground">{w.week.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Activities by Category</h2>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const count = catCount[cat.id] ?? 0;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{cat.label}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(count / maxCat) * 100}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty distribution */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Difficulty Distribution</h2>
          <div className="space-y-3">
            {DIFFICULTIES.map((d) => {
              const count = diffCount[d] ?? 0;
              return (
                <div key={d} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize">{d}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(count / maxDiff) * 100}%`,
                        backgroundColor:
                          d === "beginner" ? "#22c55e" : d === "intermediate" ? "#eab308" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most completed activities */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Most Completed Activities</h2>
          {topActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activities yet</p>
          ) : (
            <div className="space-y-2">
              {topActivities.map((a, i) => (
                <div key={a.title} className="flex items-center gap-3">
                  <span className="w-5 text-xs text-muted-foreground">{i + 1}.</span>
                  <div className="flex-1 truncate text-sm">{a.title}</div>
                  <span className="text-xs text-muted-foreground">{a.count}x</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Recent Activity</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet</p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 20).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-muted-foreground">{log.date}</span>
                  <span className="truncate">{log.activities?.title ?? "Unknown"}</span>
                </div>
                <span className="shrink-0 text-xs font-medium text-primary">
                  +{log.xp_earned} XP
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
