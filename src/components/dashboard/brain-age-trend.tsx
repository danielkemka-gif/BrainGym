"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendPoint {
  date: string;
  label: string;
  score: number;
}

function scoreToBrainAge(averageScore: number): number {
  return Math.round(80 - (averageScore / 100) * 60);
}

export function BrainAgeTrend() {
  const { user, supabase } = useAuth();
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const since = new Date(Date.now() - 13 * 86400000).toISOString().split("T")[0];

    supabase
      .from("brain_scores")
      .select("date, score")
      .eq("user_id", user.id)
      .gte("date", since)
      .then(({ data }) => {
        const byDay = new Map<string, { total: number; count: number }>();
        for (const row of data ?? []) {
          const cur = byDay.get(row.date) ?? { total: 0, count: 0 };
          cur.total += row.score;
          cur.count += 1;
          byDay.set(row.date, cur);
        }
        const days: TrendPoint[] = [];
        for (let i = 13; i >= 0; i--) {
          const d = new Date(Date.now() - i * 86400000);
          const key = d.toISOString().split("T")[0];
          const agg = byDay.get(key);
          days.push({
            date: key,
            label: d.toLocaleDateString("en-US", { weekday: "short" }),
            score: agg ? Math.round(agg.total / agg.count) : 0,
          });
        }
        setPoints(days);
        setLoading(false);
      });
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-28 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  const scored = points.filter((p) => p.score > 0);
  const first = scored[0];
  const last = scored[scored.length - 1];

  const W = 300;
  const H = 96;
  const PAD = 6;
  const maxScore = Math.max(100, ...scored.map((p) => p.score + 5));
  const minScore = Math.min(0, ...scored.map((p) => p.score - 5));
  const x = (i: number) => PAD + (i / (points.length - 1)) * (W - PAD * 2);
  const y = (s: number) =>
    H - PAD - ((s - minScore) / (maxScore - minScore)) * (H - PAD * 2);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.score || 0).toFixed(1)}`)
    .join(" ");

  const startAge = first ? scoreToBrainAge(first.score) : null;
  const endAge = last ? scoreToBrainAge(last.score) : null;
  const delta =
    startAge !== null && endAge !== null ? endAge - startAge : 0;

  const deltaIcon =
    delta < 0 ? <TrendingDown className="h-4 w-4 text-emerald-500" /> :
    delta > 0 ? <TrendingUp className="h-4 w-4 text-orange-500" /> :
    <Minus className="h-4 w-4 text-muted-foreground" />;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Brain Age Trend</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {deltaIcon}
          <span>
            {delta === 0 ? "no change" : `${Math.abs(delta)} days younger`}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label="Brain age trend over the last 14 days">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {points.length > 1 && (
          <>
            <path d={`${path} L${x(points.length - 1)},${H - PAD} L${x(0)},${H - PAD} Z`} fill="url(#trendFill)" />
            <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
          </>
        )}
        {points.map((p, i) =>
          p.score > 0 ? (
            <circle key={p.date} cx={x(i)} cy={y(p.score)} r="2.5" fill="currentColor" className="text-primary">
              <title>{`${p.label}: brain score ${p.score} (brain age ~${scoreToBrainAge(p.score)})`}</title>
            </circle>
          ) : null
        )}
      </svg>

      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>{points[0]?.label}</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
      {scored.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Play a few brain games to see your trend here.
        </p>
      )}
    </div>
  );
}
