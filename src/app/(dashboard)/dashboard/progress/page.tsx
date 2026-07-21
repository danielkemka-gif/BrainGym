"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RadarChart } from "@/components/progress/radar-chart";
import { StreakCalendar } from "@/components/progress/streak-calendar";
import { XpHistory } from "@/components/progress/xp-history";
import { AchievementsGrid } from "@/components/achievements/achievements-grid";

export default function ProgressPage() {
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("brain_scores")
        .select("category_id, score")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(7)
        .then(({ data }) => {
          if (!data) return;
          const latest: Record<string, number> = {};
          for (const row of data) {
            if (!latest[row.category_id]) {
              latest[row.category_id] = row.score;
            }
          }
          setScores(latest);
        });
    });
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-muted-foreground">
          Track your brain training journey
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Brain Scores</h2>
          <RadarChart scores={scores} />
        </div>
        <div className="space-y-6">
          <XpHistory />
          <StreakCalendar />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Achievements</h2>
        <AchievementsGrid />
      </div>
    </div>
  );
}
