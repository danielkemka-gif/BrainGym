"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface LeaderboardEntry {
  user_id: string;
  total_xp: number;
  display_name: string | null;
  avatar_url: string | null;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("xp_ledger")
      .select("user_id, amount")
      .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString())
      .then(({ data: logs, error: err }) => {
        if (err) {
          setError("Failed to load leaderboard");
          setLoading(false);
          return;
        }

        if (!logs || logs.length === 0) {
          setLoading(false);
          return;
        }

        const xpMap: Record<string, number> = {};
        const userIds: string[] = [];
        for (const log of logs) {
          if (!xpMap[log.user_id]) {
            xpMap[log.user_id] = 0;
            userIds.push(log.user_id);
          }
          xpMap[log.user_id] += log.amount;
        }

        const sorted = userIds
          .map((id) => ({ user_id: id, total_xp: xpMap[id] }))
          .sort((a, b) => b.total_xp - a.total_xp)
          .slice(0, 50);

        supabase
          .from("profiles")
          .select("user_id, display_name, avatar_url")
          .in(
            "user_id",
            sorted.map((e) => e.user_id)
          )
          .then(({ data: profiles }) => {
            const profileMap = Object.fromEntries(
              (profiles ?? []).map((p) => [p.user_id, p])
            );
            setEntries(
              sorted.map((e) => ({
                ...e,
                display_name: profileMap[e.user_id]?.display_name ?? null,
                avatar_url: profileMap[e.user_id]?.avatar_url ?? null,
              }))
            );
            setLoading(false);
          });
      });
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">
          Weekly XP rankings — compete with other brain trainers
        </p>
      </div>

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
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No entries yet</p>
          <p className="text-sm text-muted-foreground">
            Complete workouts to earn XP and climb the ranks
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div
              key={entry.user_id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  i === 0
                    ? "bg-yellow-500/20 text-yellow-500"
                    : i === 1
                      ? "bg-gray-400/20 text-gray-400"
                      : i === 2
                        ? "bg-amber-700/20 text-amber-700"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {entry.display_name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {entry.display_name ?? "Anonymous"}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold">
                {entry.total_xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
