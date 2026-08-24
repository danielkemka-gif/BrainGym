"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import { fetchHabitEngineState, HabitMetricState } from "@/lib/habit-engine";
import { RadarChart } from "@/components/progress/radar-chart";
import { StreakCalendar } from "@/components/progress/streak-calendar";
import { XpHistory } from "@/components/progress/xp-history";
import { AchievementsGrid } from "@/components/achievements/achievements-grid";
import { SkillTree } from "@/components/progress/skill-tree";
import { ProAnalyticsPreview } from "@/components/premium/pro-analytics-preview";
import { useEntitlements } from "@/lib/entitlements";
import { BrainJourney } from "@/components/dashboard/brain-journey";
import { BrainMomentumWidget } from "@/components/dashboard/brain-momentum-widget";
import { QuickStatsRow } from "@/components/dashboard/quick-stats-row";
import { YourProgressSection } from "@/components/dashboard/your-progress-section";

export default function ProgressPage() {
  const { user } = useAuth();
  const { isPro, isTrial } = useEntitlements();
  const [habit, setHabit] = useState<HabitMetricState | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activityCounts, setActivityCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchHabitEngineState(user?.id).then((state) => {
      setHabit(state);
    });

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
  }, [user]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 overflow-x-hidden px-3 sm:px-4 lg:px-6 py-3 pb-20 touch-manipulation">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Progress &amp; Cognitive Analytics
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Detailed breakdown of your Brain Score, Momentum, Streaks, and 5-domain development.
        </p>
      </div>

      {/* Quick Stats Overview */}
      {habit && <QuickStatsRow habit={habit} />}

      {/* Brain Momentum Consistency Meter */}
      {habit && <BrainMomentumWidget habit={habit} />}

      {/* 5-Domain Performance & Brain Age Indicator */}
      {habit && <YourProgressSection habit={habit} />}

      {/* 90-Day Brain Journey: Full for Pro, Preview for Free */}
      {isPro || isTrial ? (
        <BrainJourney />
      ) : (
        <ProAnalyticsPreview
          title="90-Day Cognitive Vitality &amp; Trend Heatmap"
          subtitle="Pro members unlock full 90-day trend heatmaps, domain radar shifts, and long-term neuroplastic progression."
        />
      )}

      {/* Cognitive Radar & History */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="text-base font-black text-foreground mb-4">5-Domain Cognitive Radar</h2>
          <RadarChart scores={scores} />
        </div>
        <div className="space-y-6">
          <XpHistory />
          <StreakCalendar />
        </div>
      </div>

      {/* Skill Tree */}
      <div className="overflow-x-auto rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-base font-black text-foreground mb-4">Neuroplastic Skill Progression</h2>
        <SkillTree activityCounts={activityCounts} scores={scores} />
      </div>

      {/* Achievements Cabinet */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-base font-black text-foreground mb-4">Badges &amp; Milestones</h2>
        <AchievementsGrid />
      </div>
    </div>
  );
}
