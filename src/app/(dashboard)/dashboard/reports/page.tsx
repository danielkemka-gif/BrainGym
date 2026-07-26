"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, DIFFICULTIES, LEVELS } from "@/lib/constants";
import { getLevelProgress } from "@/lib/scoring";
import { WeeklyReportCard } from "@/components/reports/weekly-report-card";

type TimeRange = "7" | "30" | "all";

interface LogEntry {
  id: string;
  date: string;
  xp_earned: number;
  coins_earned: number;
  created_at: string;
  activities: { title: string; category_id: string; difficulty: string } | null;
}

interface BrainScoreRow {
  category_id: string;
  score: number;
  date: string;
}

export default function ReportsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [brainScores, setBrainScores] = useState<BrainScoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("30");

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
        supabase
          .from("brain_scores")
          .select("category_id, score, date")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(200),
      ]).then(([logsRes, xp, coins, streakRes, scoresRes]) => {
        setLogs((logsRes.data ?? []) as unknown as LogEntry[]);
        setTotalXp(xp);
        setTotalCoins(coins);
        setStreak({
          current: streakRes.data?.current_streak ?? 0,
          longest: streakRes.data?.longest_streak ?? 0,
        });
        setBrainScores((scoresRes.data ?? []) as BrainScoreRow[]);
        setLoading(false);
      });
    });
  }, []);

  // Filter logs by time range
  const filteredLogs = useMemo(() => {
    if (timeRange === "all") return logs;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));
    const cutoff = daysAgo.toISOString().split("T")[0];
    return logs.filter((l) => l.date >= cutoff);
  }, [logs, timeRange]);

  // Also compute filtered XP for predicted growth (all-time XP)
  const filteredTotalXp = useMemo(() => {
    return filteredLogs.reduce((s, l) => s + l.xp_earned, 0);
  }, [filteredLogs]);

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

  const { level, progress, xpInLevel, xpForNext } = getLevelProgress(totalXp);

  // ─── Weekly Insight Banner calculations ───
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const thisWeekLogs = logs.filter((l) => {
    const d = new Date(l.date);
    return d >= thisWeekStart;
  });
  const lastWeekLogs = logs.filter((l) => {
    const d = new Date(l.date);
    return d >= lastWeekStart && d < thisWeekStart;
  });

  const thisWeekXp = thisWeekLogs.reduce((s, l) => s + l.xp_earned, 0);
  const lastWeekXp = lastWeekLogs.reduce((s, l) => s + l.xp_earned, 0);

  const weeklyChangePercent = lastWeekXp > 0
    ? Math.round(((thisWeekXp - lastWeekXp) / lastWeekXp) * 100)
    : thisWeekXp > 0 ? 100 : 0;

  const weeklyChangeText = weeklyChangePercent > 0
    ? `You're ${weeklyChangePercent}% more active this week than last week`
    : weeklyChangePercent < 0
      ? `You were ${Math.abs(weeklyChangePercent)}% more active last week — let's bounce back!`
      : thisWeekXp > 0
        ? "You're maintaining steady activity this week"
        : "Start your week strong — complete a workout today!";

  // Strongest/weakest category from filtered logs
  const catCount: Record<string, number> = {};
  for (const log of filteredLogs) {
    const c = log.activities?.category_id;
    if (c) catCount[c] = (catCount[c] ?? 0) + 1;
  }

  const catEntries = Object.entries(catCount);
  const strongestCat = catEntries.length > 0
    ? catEntries.reduce((a, b) => (b[1] > a[1] ? b : a))
    : null;
  const weakestCat = catEntries.length > 1
    ? catEntries.reduce((a, b) => (b[1] < a[1] ? b : a))
    : null;

  const strongestCatLabel = strongestCat
    ? CATEGORIES.find((c) => c.id === strongestCat[0])?.label ?? strongestCat[0]
    : null;

  const weakestCatLabel = weakestCat && weakestCat[0] !== strongestCat?.[0]
    ? CATEGORIES.find((c) => c.id === weakestCat[0])?.label ?? weakestCat[0]
    : null;

  // Brain score trend
  const latestScoresByCat = new Map<string, { latest: number; previous: number }>();
  for (const cat of CATEGORIES) {
    const catScores = brainScores.filter((s) => s.category_id === cat.id);
    if (catScores.length > 0) {
      latestScoresByCat.set(cat.id, {
        latest: catScores[0].score,
        previous: catScores.length > 1 ? catScores[1].score : catScores[0].score,
      });
    }
  }

  // Build insight sentences
  const insightSentences: string[] = [];
  if (weeklyChangeText) insightSentences.push(weeklyChangeText);
  if (strongestCatLabel && thisWeekLogs.length > 0) {
    insightSentences.push(`Your strongest category is ${strongestCatLabel} — keep it up!`);
  }
  if (weakestCatLabel && thisWeekLogs.length > 0) {
    insightSentences.push(`Try more ${weakestCatLabel} activities to balance your skills`);
  }

  // Check score trend for focus (category index 1 = Focus)
  const focusScores = brainScores.filter((s) => s.category_id === CATEGORIES[1]?.id);
  if (focusScores.length >= 2) {
    const diff = focusScores[0].score - focusScores[1].score;
    if (diff > 2) insightSentences.push("Your focus score is trending up");
    else if (diff < -2) insightSentences.push("Your focus score has dipped — try some focus activities today");
  }

  // ─── Predicted Growth ───
  const avgXpPerWeek = (() => {
    if (logs.length < 2) return 0;
    const dates = logs.map((l) => new Date(l.date).getTime());
    const earliest = Math.min(...dates);
    const latest = Math.max(...dates);
    const weeksSpan = Math.max((latest - earliest) / (7 * 86400000), 1);
    return totalXp / weeksSpan;
  })();

  const nextLevel = LEVELS.find((l) => l.level === level.level + 1);
  const predictedWeeks = nextLevel && avgXpPerWeek > 0
    ? Math.ceil((nextLevel.xpRequired - totalXp) / avgXpPerWeek)
    : null;

  // ─── Calendar data ───
  const workoutDates = new Set(filteredLogs.map((l) => l.date));
  const calendarMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const calendarDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const calendarFirstDayOfWeek = calendarMonth.getDay();

  // Category breakdown (filtered)
  const maxCat = Math.max(...Object.values(catCount), 1);

  // Difficulty breakdown (filtered)
  const diffCount: Record<string, number> = {};
  for (const log of filteredLogs) {
    const d = log.activities?.difficulty;
    if (d) diffCount[d] = (diffCount[d] ?? 0) + 1;
  }
  const maxDiff = Math.max(...Object.values(diffCount), 1);

  // Weekly XP trend (last 12 weeks)
  const weeklyXp: { week: string; xp: number }[] = [];
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

  // Most completed activities (filtered)
  const actCount: Record<string, { count: number; title: string }> = {};
  for (const log of filteredLogs) {
    const t = log.activities?.title ?? "Unknown";
    if (!actCount[t]) actCount[t] = { count: 0, title: t };
    actCount[t].count++;
  }
  const topActivities = Object.values(actCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalWorkouts = new Set(filteredLogs.map((l) => l.date)).size;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Deep insights into your brain training journey
          </p>
        </div>
        {/* Time Range Filter */}
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          {([
            { value: "7" as TimeRange, label: "7 Days" },
            { value: "30" as TimeRange, label: "30 Days" },
            { value: "all" as TimeRange, label: "All Time" },
          ]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setTimeRange(tab.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                timeRange === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Insight Banner */}
      {insightSentences.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h2 className="font-semibold">Weekly Insight</h2>
          </div>
          <div className="space-y-1.5">
            {insightSentences.map((sentence, i) => (
              <p key={i} className="text-sm text-foreground/80">
                {sentence}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Weekly Report Card */}
      <WeeklyReportCard />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{totalWorkouts}</p>
          <p className="text-xs text-muted-foreground">Workouts</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{filteredTotalXp.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{timeRange === "all" ? "Total" : "Period"} XP</p>
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

      {/* Predicted Growth */}
      {predictedWeeks !== null && nextLevel && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Predicted Growth</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                At this pace, you&apos;ll reach <span className="font-medium text-foreground">Level {nextLevel.level} — {nextLevel.title}</span> in{" "}
                <span className="font-medium text-foreground">~{predictedWeeks} week{predictedWeeks !== 1 ? "s" : ""}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Avg XP/week</p>
              <p className="text-lg font-bold text-primary">{Math.round(avgXpPerWeek).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Level {level.level} — {level.title}</span>
              <span>{xpInLevel.toLocaleString()} / {xpForNext.toLocaleString()} XP</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Brain Score Trends */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Brain Score Trends</h2>
        {latestScoresByCat.size === 0 ? (
          <p className="text-sm text-muted-foreground">Complete activities to see your brain scores</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const data = latestScoresByCat.get(cat.id);
              if (!data) return null;
              const trend = data.latest - data.previous;
              const arrow = trend > 2 ? "↑" : trend < -2 ? "↓" : "→";
              const trendColor = trend > 2 ? "text-emerald-500" : trend < -2 ? "text-red-500" : "text-muted-foreground";
              return (
                <div key={cat.id} className="space-y-2 rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: cat.color }}>
                      {cat.label}
                    </span>
                    <span className={`text-sm font-bold ${trendColor}`}>
                      {arrow}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold">{data.latest}</span>
                    {trend !== 0 && (
                      <span className={`text-xs ${trendColor}`}>
                        {trend > 0 ? "+" : ""}{trend}
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${data.latest}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Consistency Streak Calendar */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Activity Calendar</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          {now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground">
              {d}
            </div>
          ))}
          {Array.from({ length: calendarFirstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: calendarDaysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasWorkout = workoutDates.has(dateStr);
            const isToday = day === now.getDate();
            return (
              <div
                key={day}
                className={`flex h-8 w-full items-center justify-center rounded-md text-xs ${
                  isToday ? "border-2 border-primary font-bold" : ""
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                    hasWorkout
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span>Workout completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-muted" />
            <span>No workout</span>
          </div>
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
        {filteredLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity in this period</p>
        ) : (
          <div className="space-y-2">
            {filteredLogs.slice(0, 20).map((log) => (
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
