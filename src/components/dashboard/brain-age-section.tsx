"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/constants";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

interface BrainAgeData {
  currentScore: number;
  weekAgoScore: number;
  categoryScores: { name: string; score: number; color: string }[];
  brainAge: number; // conceptual age: lower is "younger brain"
}

function scoreToBrainAge(averageScore: number): number {
  // Map 0-100 brain score to brain age 20-80
  // Higher score = younger brain age
  return Math.round(80 - (averageScore / 100) * 60);
}

function getAgeLabel(brainAge: number): string {
  if (brainAge <= 25) return "Exceptional";
  if (brainAge <= 35) return "Sharp";
  if (brainAge <= 45) return "Solid";
  if (brainAge <= 55) return "Developing";
  return "Warming Up";
}

function getAgeColor(brainAge: number): string {
  if (brainAge <= 25) return "text-emerald-500";
  if (brainAge <= 35) return "text-primary";
  if (brainAge <= 45) return "text-amber-500";
  return "text-orange-500";
}

export function BrainAgeSection() {
  const { user, supabase } = useAuth();
  const [data, setData] = useState<BrainAgeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

    Promise.all(
      CATEGORIES.map(async (cat) => {
        const [{ data: current }, { data: weekAgoData }] = await Promise.all([
          supabase
            .from("brain_scores")
            .select("score")
            .eq("user_id", user.id)
            .eq("category_id", cat.id)
            .lte("date", today)
            .order("date", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("brain_scores")
            .select("score")
            .eq("user_id", user.id)
            .eq("category_id", cat.id)
            .lte("date", weekAgo)
            .order("date", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);
        return {
          name: cat.label,
          score: current?.score ?? 50,
          weekAgoScore: weekAgoData?.score ?? 50,
          color: cat.color,
        };
      })
    ).then((results) => {
      const currentAvg = results.reduce((s, r) => s + r.score, 0) / results.length;
      const weekAgoAvg = results.reduce((s, r) => s + r.weekAgoScore, 0) / results.length;
      setData({
        currentScore: Math.round(currentAvg),
        weekAgoScore: Math.round(weekAgoAvg),
        categoryScores: results.map((r) => ({ name: r.name, score: r.score, color: r.color })),
        brainAge: scoreToBrainAge(currentAvg),
      });
      setLoading(false);
    });
  }, [user, supabase]);

  const trend = data ? data.currentScore - data.weekAgoScore : 0;
  const trendAbs = Math.abs(trend);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 overflow-x-hidden">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm sm:text-base font-semibold">Brain Age</h3>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      ) : data ? (
        <>
          {/* Big brain age number */}
          <div className="mb-4 text-center">
            <div className={`text-5xl sm:text-6xl lg:text-7xl font-bold tabular-nums text-balance ${getAgeColor(data.brainAge)}`}>
              {data.brainAge}
            </div>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              {getAgeLabel(data.brainAge)} Brain
            </p>

            {/* Trend indicator */}
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-muted/50 px-3 py-1">
              {trend > 0 ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-500">+{trendAbs} pts this week</span>
                </>
              ) : trend < 0 ? (
                <>
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-xs font-medium text-red-500">-{trendAbs} pts this week</span>
                </>
              ) : (
                <>
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Stable this week</span>
                </>
              )}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="space-y-2.5">
            {data.categoryScores.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="font-medium tabular-nums">{cat.score}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${cat.score}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
