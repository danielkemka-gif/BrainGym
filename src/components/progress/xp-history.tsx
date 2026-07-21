"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function XpHistory() {
  const [dailyXp, setDailyXp] = useState<{ date: string; xp: number }[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("xp_ledger")
        .select("amount, created_at")
        .eq("user_id", user.id)
        .gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString())
        .then(({ data }) => {
          if (!data) return;
          const byDate: Record<string, number> = {};
          for (const row of data) {
            const day = row.created_at.split("T")[0];
            byDate[day] = (byDate[day] ?? 0) + row.amount;
          }
          const days = Object.entries(byDate)
            .map(([date, xp]) => ({ date, xp }))
            .sort((a, b) => a.date.localeCompare(b.date));
          setDailyXp(days);
        });
    });
  }, []);

  if (dailyXp.length === 0) return null;

  const maxXp = Math.max(...dailyXp.map((d) => d.xp), 1);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-semibold">Last 30 Days XP</h2>
      <div className="flex items-end gap-1">
        {dailyXp.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${d.xp} XP`}
            className="flex-1 rounded-t bg-primary transition-all hover:bg-primary/80"
            style={{ height: `${(d.xp / maxXp) * 80}px`, minHeight: "4px" }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{dailyXp[0]?.date ?? ""}</span>
        <span>{dailyXp[dailyXp.length - 1]?.date ?? ""}</span>
      </div>
    </div>
  );
}
