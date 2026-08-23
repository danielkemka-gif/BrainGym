"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RadarChart } from "@/components/progress/radar-chart";
import { StreakCalendar } from "@/components/progress/streak-calendar";
import { XpHistory } from "@/components/progress/xp-history";
import { AchievementsGrid } from "@/components/achievements/achievements-grid";
import { SkillTree } from "@/components/progress/skill-tree";
import { ProAnalyticsPreview } from "@/components/premium/pro-analytics-preview";
import { useEntitlements } from "@/lib/entitlements";
import { BrainJourney } from "@/components/dashboard/brain-journey";

export default function ProgressPage() {
  const { isPro, isTrial } = useEntitlements();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activityCounts, setActivityCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      Promise.all([
        supabase
          .from("brain_scores")
          .select("category_id, score")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(7)
          .then(({ data }) => {
            if (!data) return {} as Record<string, number>;
            const latest: Record<string, number> = {};
            for (const row of data) {
              if (!latest[row.category_id]) {
                latest[row.category_id] = row.score;
              }
            }
            return latest;
          }),
        supabase
          .from("activity_logs")
          .select("activity_id, activities(category_id)")
          .eq("user_id", user.id)
          .then(({ data }) => {
            if (!data) return {} as Record<string, number>;
            const counts: Record<string, number> = {};
            for (const row of data) {
              const categoryId = (row as any).activities?.category_id;
              if (categoryId) {
                counts[categoryId] = (counts[categoryId] ?? 0) + 1;
              }
            }
            return counts;
          }),
      ]).then(([scoresData, countsData]) => {
        setScores(scoresData);
        setActivityCounts(countsData);
      });
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
      <div>
        <h1 className="text-balance text-xl font-bold sm:text-2xl">Progress &amp; Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track your brain training journey, streaks, and cognitive domain growth
        </p>
      </div>

      {/* 90-Day Brain Journey: Full for Pro, Preview for Free */}
      {isPro || isTrial ? (
        <BrainJourney />
      ) : (
        <ProAnalyticsPreview
          title="90-Day Cognitive Vitality &amp; Trend Heatmap"
          subtitle="Pro members unlock full 90-day trend heatmaps, domain radar shifts, and long-term neuroplastic progression."
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Brain Category Scores</h2>
          <RadarChart scores={scores} />
        </div>
        <div className="space-y-6">
          <XpHistory />
          <StreakCalendar />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 text-xl font-bold">Skill Tree</h2>
        <SkillTree activityCounts={activityCounts} scores={scores} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Achievements</h2>
        <AchievementsGrid />
      </div>
    </div>
  );
}
