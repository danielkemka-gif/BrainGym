"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, DIFFICULTIES } from "@/lib/constants";

interface LogEntry {
  id: string;
  date: string;
  activity_id: string;
  xp_earned: number;
  coins_earned: number;
  created_at: string;
  activity: {
    title: string;
    difficulty: string;
    category_id: string;
  } | null;
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      let query = supabase
        .from("activity_logs")
        .select("id, date, activity_id, xp_earned, coins_earned, created_at, activities!inner(title, difficulty, category_id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200);

      if (categoryFilter) {
        query = query.eq("activities.category_id", categoryFilter);
      }
      if (difficultyFilter) {
        query = query.eq("activities.difficulty", difficultyFilter);
      }

      query.then(({ data, error: err }) => {
        if (err) {
          setError("Failed to load history");
        } else if (data) {
          setLogs(data as unknown as LogEntry[]);
        }
        setLoading(false);
      });
    });
  }, [categoryFilter, difficultyFilter]);

  const filtered = logs.filter((log) => {
    if (dateRange === "week") {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
      return log.date >= weekAgo;
    }
    if (dateRange === "month") {
      const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
      return log.date >= monthAgo;
    }
    return true;
  });

  const totalXp = filtered.reduce((s, l) => s + l.xp_earned, 0);
  const totalCoins = filtered.reduce((s, l) => s + l.coins_earned, 0);
  const uniqueDays = new Set(filtered.map((l) => l.date)).size;

  function getCategoryLabel(catId: string) {
    return CATEGORIES.find((c) => c.id === catId)?.label ?? catId;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workout History</h1>
        <p className="text-sm text-muted-foreground">
          Review your past brain training sessions
        </p>
      </div>

      {/* Stats summary */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{totalXp}</p>
            <p className="text-xs text-muted-foreground">XP earned</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{totalCoins}</p>
            <p className="text-xs text-muted-foreground">Coins earned</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{uniqueDays}</p>
            <p className="text-xs text-muted-foreground">Active days</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All difficulties</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
          ))}
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All time</option>
          <option value="month">Last 30 days</option>
          <option value="week">Last 7 days</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No workout history</p>
          <p className="text-sm text-muted-foreground">
            Complete activities to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm">
                {log.activity?.title[0] ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {log.activity?.title ?? "Unknown activity"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{log.date}</span>
                  {log.activity?.category_id && (
                    <>
                      <span>·</span>
                      <span>{getCategoryLabel(log.activity.category_id)}</span>
                    </>
                  )}
                  {log.activity?.difficulty && (
                    <>
                      <span>·</span>
                      <span className="capitalize">{log.activity.difficulty}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-primary">+{log.xp_earned} XP</p>
                <p className="text-xs text-muted-foreground">+{log.coins_earned} coins</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
