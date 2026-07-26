"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/icons";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Flame,
  Target,
  Calendar,
  Download,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface MonthlyReport {
  id: string;
  month: string;
  avg_score: number;
  score_change: number;
  activities_completed: number;
  streak_days: number;
  total_xp: number;
  total_coins: number;
  workouts_completed: number;
  top_category: string;
  weakest_category: string;
  improvement_pct: number;
  narrative: string;
}

export function MonthlyReportCard() {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [monthOffset]);

  async function fetchReport() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Calculate month
    const now = new Date();
    now.setMonth(now.getMonth() + monthOffset);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

    const { data } = await supabase
      .from("monthly_reports")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", monthStart)
      .maybeSingle();

    if (data) {
      setReport(data);
      setLoading(false);
    } else {
      // Generate report if not exists
      setGenerating(true);
      const { data: genData } = await supabase.rpc("generate_monthly_report", {
        p_user_id: user.id,
        p_month: monthStart,
      });
      setReport(genData);
      setGenerating(false);
      setLoading(false);
    }
  }

  function getMonthLabel(monthStr: string) {
    const d = new Date(monthStr);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  if (loading || generating) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-3">
          <div className="h-6 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">No report for this month</p>
        <p className="text-xs text-muted-foreground">Complete workouts to generate your monthly report</p>
      </div>
    );
  }

  const topCat = CATEGORIES.find((c) => c.slug === report.top_category);
  const weakCat = CATEGORIES.find((c) => c.slug === report.weakest_category);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonthOffset(monthOffset - 1)}
          className="rounded-lg p-1.5 hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <h3 className="text-lg font-bold">{getMonthLabel(report.month)}</h3>
          <p className="text-xs text-muted-foreground">Monthly Report</p>
        </div>
        <button
          onClick={() => setMonthOffset(monthOffset + 1)}
          disabled={monthOffset >= 0}
          className="rounded-lg p-1.5 hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Avg Brain Score</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold">{report.avg_score}</span>
            {report.score_change > 0 ? (
              <span className="flex items-center gap-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                <TrendingUp className="h-3 w-3" />+{report.score_change}
              </span>
            ) : report.score_change < 0 ? (
              <span className="flex items-center gap-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                <TrendingDown className="h-3 w-3" />{report.score_change}
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Minus className="h-3 w-3" />0
              </span>
            )}
          </div>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Workouts</p>
          <p className="text-2xl font-bold mt-1">{report.workouts_completed}</p>
          <p className="text-[10px] text-muted-foreground">{report.activities_completed} activities</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-2.5">
          <Flame className="h-4 w-4 text-orange-500" />
          <div>
            <p className="text-sm font-bold">{report.streak_days}</p>
            <p className="text-[10px] text-muted-foreground">Active days</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-2.5">
          <Trophy className="h-4 w-4 text-amber-500" />
          <div>
            <p className="text-sm font-bold">{report.total_xp.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">XP earned</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-2.5">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <div>
            <p className="text-sm font-bold">{report.total_coins.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Coins earned</p>
          </div>
        </div>
      </div>

      {/* Top & Weakest Categories */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {topCat && (
          <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 p-3">
            <Trophy className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-[10px] text-muted-foreground">Strongest</p>
              <p className="text-sm font-medium">{topCat.label}</p>
            </div>
          </div>
        )}
        {weakCat && (
          <div className="flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
            <Target className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-[10px] text-muted-foreground">Needs Work</p>
              <p className="text-sm font-medium">{weakCat.label}</p>
            </div>
          </div>
        )}
      </div>

      {/* Narrative */}
      {report.narrative && (
        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">AI Insight</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.narrative}</p>
        </div>
      )}
    </div>
  );
}
