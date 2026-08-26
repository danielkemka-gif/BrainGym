"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  fetchBrainMomentumEngineState,
  EngineFullState,
} from "@/lib/brain-momentum-engine";
import { RadarChart } from "@/components/progress/radar-chart";
import { StreakCalendar } from "@/components/progress/streak-calendar";
import { XpHistory } from "@/components/progress/xp-history";
import { AchievementsGrid } from "@/components/achievements/achievements-grid";
import { SkillTree } from "@/components/progress/skill-tree";
import { ProAnalyticsPreview } from "@/components/premium/pro-analytics-preview";
import { useEntitlements } from "@/lib/entitlements";
import { BrainJourney } from "@/components/dashboard/brain-journey";
import { WeeklyBrainReportCard } from "@/components/progress/weekly-brain-report-card";
import { CognitiveProfileBreakdown } from "@/components/progress/cognitive-profile-breakdown";

export default function ProgressPage() {
  const { user } = useAuth();
  const { isPro, isTrial } = useEntitlements();
  const [engineState, setEngineState] = useState<EngineFullState | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activityCounts, setActivityCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchBrainMomentumEngineState(user?.id).then((state) => {
      setEngineState(state);
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
    <div className="mx-auto w-full max-w-5xl space-y-6 overflow-x-hidden px-3 sm:px-4 lg:px-6 py-3 pb-24 touch-manipulation">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Progress &amp; Cognitive Fitness
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Track your Brain Momentum, personal cognitive baselines, and neuroplastic development over time.
        </p>
      </div>

      {/* 1. Weekly Brain Fitness Report */}
      {engineState && <WeeklyBrainReportCard report={engineState.weeklyReport} />}

      {/* 2. Personal Cognitive Baselines & 7-Domain Trend */}
      {engineState && <CognitiveProfileBreakdown momentum={engineState.momentum} />}

      {/* 3. 90-Day Brain Journey Heatmap */}
      {isPro || isTrial ? (
        <BrainJourney />
      ) : (
        <ProAnalyticsPreview
          title="90-Day Cognitive Vitality &amp; Trend Heatmap"
          subtitle="Pro members unlock full 90-day trend heatmaps, domain radar shifts, and long-term neuroplastic progression."
        />
      )}

      {/* 4. Cognitive Radar & History */}
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

      {/* 5. Skill Tree */}
      <div className="overflow-x-auto rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-base font-black text-foreground mb-4">Neuroplastic Skill Progression</h2>
        <SkillTree activityCounts={activityCounts} scores={scores} />
      </div>

      {/* 6. Achievements Cabinet */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-base font-black text-foreground mb-4">Badges &amp; Milestones</h2>
        <AchievementsGrid />
      </div>
    </div>
  );
}
