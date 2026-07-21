"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface LeaderboardEntry {
  user_id: string;
  name: string | null;
  total_xp: number;
  rank: number;
}

export function LeaderboardTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const { data: logs } = await supabase
        .from("xp_ledger")
        .select("user_id, amount")
        .gte("created_at", weekAgo);

      if (!logs) {
        setLoading(false);
        return;
      }

      const totals: Record<string, number> = {};
      for (const log of logs) {
        totals[log.user_id] = (totals[log.user_id] ?? 0) + log.amount;
      }

      const userIds = Object.keys(totals);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", userIds);

      const names = Object.fromEntries(
        (profiles ?? []).map((p) => [p.user_id, p.name])
      );

      const sorted = Object.entries(totals)
        .map(([user_id, total_xp], i) => ({
          user_id,
          name: names[user_id] ?? "Anonymous",
          total_xp,
          rank: 0,
        }))
        .sort((a, b) => b.total_xp - a.total_xp)
        .map((e, i) => ({ ...e, rank: i + 1 }));

      setEntries(sorted.slice(0, 20));

      if (user) {
        const my =
          sorted.find((e) => e.user_id === user.id) ??
          ({
            user_id: user.id,
            name: names[user.id] ?? "You",
            total_xp: 0,
            rank: sorted.length + 1,
          } as LeaderboardEntry);
        setMyEntry(my);
      }

      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((e) => (
        <div
          key={e.user_id}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
            myEntry?.user_id === e.user_id
              ? "border-primary/30 bg-primary/5"
              : "border-border"
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              e.rank <= 3 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {e.rank}
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{e.name}</p>
          </div>
          <span className="text-sm font-medium">{e.total_xp} XP</span>
        </div>
      ))}

      {myEntry && !entries.find((e) => e.user_id === myEntry.user_id) && (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
            {myEntry.rank}
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{myEntry.name}</p>
          </div>
          <span className="text-sm font-medium">0 XP</span>
        </div>
      )}
    </div>
  );
}
