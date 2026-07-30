"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/constants";

export function BrainScoreSection() {
  const { user, supabase } = useAuth();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    Promise.all(
      CATEGORIES.map((cat) =>
        supabase
          .from("brain_scores")
          .select("score")
          .eq("user_id", user.id)
          .eq("category_id", cat.id)
          .order("date", { ascending: false })
          .limit(1)
          .maybeSingle()
          .then(({ data }) => [cat.id, data?.score ?? 0] as const)
      )
    ).then((results) => {
      if (!cancelled) {
        setScores(Object.fromEntries(results));
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [user, supabase]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <h2 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold">Brain Scores</h2>
      {loading ? (
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <div key={c.id} className="h-8 animate-pulse rounded bg-muted" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const score = scores[cat.id] ?? 0;
            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{cat.label}</span>
                  <span className="text-xs text-muted-foreground">{score}/100</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${score}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
