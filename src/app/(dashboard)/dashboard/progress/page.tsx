"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  fetchBrainMomentumEngineState,
  EngineFullState,
} from "@/lib/brain-momentum-engine";
import { getAllGoals, BrainGoal } from "@/lib/goals/goals-engine";
import { QualitativeThinkingProfile } from "@/components/profile/qualitative-thinking-profile";
import { StreakCalendar } from "@/components/progress/streak-calendar";
import { XpHistory } from "@/components/progress/xp-history";
import { AchievementsGrid } from "@/components/achievements/achievements-grid";
import { Target, CheckCircle2, RefreshCw, Sparkles, BookOpen } from "lucide-react";

export default function ProgressPage() {
  const { user } = useAuth();
  const { t, isRtl } = useI18n();
  const [engineState, setEngineState] = useState<EngineFullState | null>(null);
  const [goals, setGoals] = useState<BrainGoal[]>([]);

  useEffect(() => {
    fetchBrainMomentumEngineState(user?.id).then((state) => {
      setEngineState(state);
    });
    getAllGoals().then((g) => setGoals(g));
  }, [user]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 overflow-x-hidden px-3 sm:px-4 py-3 pb-24 touch-manipulation">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Progress &amp; Thinking Development
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
          Track your qualitative cognitive profile, real-life action results, and daily workout consistency.
        </p>
      </div>

      {/* 1. QUALITATIVE THINKING PROFILE (10 DIMENSIONS & BEHAVIORAL OBSERVATIONS) */}
      <QualitativeThinkingProfile />

      {/* 2. REAL-LIFE GOALS & RESULTS LOOP LOG */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Target className="h-4 w-4" />
            </div>
            <h2 className="text-sm sm:text-base font-black text-foreground">
              Goals &amp; Results Loop
            </h2>
          </div>
          <span className="text-[11px] font-bold text-muted-foreground">
            Think → Act → Measure → Learn
          </span>
        </div>

        {goals.map((g) => (
          <div
            key={g.id}
            className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">{g.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {g.currentSituation}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                {g.currentProgress} / {g.target} {g.unit}
              </span>
            </div>

            {/* Results history logs */}
            {g.resultsHistory && g.resultsHistory.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                  Logged Results &amp; Reflection Takeaways:
                </span>
                {g.resultsHistory.map((res) => (
                  <div
                    key={res.id}
                    className="rounded-xl bg-muted/40 border border-border/50 p-2.5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-foreground">{res.metricValue}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(res.date).toLocaleDateString()}
                      </span>
                    </div>
                    {res.reflection && (
                      <p className="text-foreground/90 font-medium italic text-[11px]">
                        &ldquo;{res.reflection}&rdquo;
                      </p>
                    )}
                    {res.nextAdjustment && (
                      <div className="text-[10px] text-primary font-bold">
                        ➔ Next Action: {res.nextAdjustment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. STREAK & CONSISTENCY */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StreakCalendar />
        <XpHistory />
      </div>

      {/* 4. ACHIEVEMENTS */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-base font-black text-foreground mb-4">Milestones &amp; Badges</h2>
        <AchievementsGrid />
      </div>
    </div>
  );
}
