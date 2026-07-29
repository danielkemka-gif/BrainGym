"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/icons";
import { BrainCircuit, Target, Sparkles, ArrowRight, Clock, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TrainingPlanItem {
  categoryId: string;
  categorySlug: string;
  categoryLabel: string;
  currentScore: number;
  targetScore: number;
  gap: number;
  suggestedActivities: { id: string; title: string; difficulty: string; estimated_time: number }[];
  priority: "high" | "medium" | "low";
  reason: string;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  memory: "from-indigo-500 to-violet-600",
  focus: "from-amber-400 to-orange-500",
  thinking: "from-emerald-400 to-teal-600",
  learning: "from-sky-400 to-blue-600",
  health: "from-rose-400 to-red-500",
  creativity: "from-pink-400 to-fuchsia-600",
  "emotional-intelligence": "from-violet-400 to-purple-600",
};

function getPriorityColor(priority: string) {
  if (priority === "high") return "text-red-400 bg-red-500/10";
  if (priority === "medium") return "text-amber-400 bg-amber-500/10";
  return "text-emerald-400 bg-emerald-500/10";
}

function getReason(score: number): string {
  if (score < 30) return "Needs urgent attention — this will boost your overall score fast";
  if (score < 50) return "Below average — regular training here will show quick improvement";
  if (score < 70) return "Good foundation — keep training to reach expert level";
  return "Maintain your edge with occasional sessions";
}

export function PersonalizedPlan() {
  const { user, supabase } = useAuth();
  const [plan, setPlan] = useState<TrainingPlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    // Get latest brain scores
    supabase
      .from("brain_scores")
      .select("category_id, score")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(50)
      .then(async ({ data: scoreData }) => {
        if (!scoreData || scoreData.length === 0) { setLoading(false); return; }

        // Get latest score per category
        const latestScores: Record<string, number> = {};
        for (const row of scoreData) {
          if (!latestScores[row.category_id]) {
            latestScores[row.category_id] = row.score;
          }
        }

        // Get activities for weak categories
        const weakCategories = CATEGORIES
          .map((c) => ({
            ...c,
            score: latestScores[c.id] ?? 50,
          }))
          .filter((c) => c.score < 80)
          .sort((a, b) => a.score - b.score)
          .slice(0, 3);

        const planItems: TrainingPlanItem[] = [];

        for (const cat of weakCategories) {
          // Get uncompleted activities in this category
          const { data: activities } = await supabase
            .from("activities")
            .select("id, title, difficulty, estimated_time")
            .eq("category_id", cat.id)
            .limit(5);

          const targetScore = Math.min(100, cat.score + 20);
          const gap = targetScore - cat.score;
          const priority = cat.score < 30 ? "high" : cat.score < 60 ? "medium" : "low";

          planItems.push({
            categoryId: cat.id,
            categorySlug: cat.slug,
            categoryLabel: cat.label,
            currentScore: cat.score,
            targetScore,
            gap,
            suggestedActivities: (activities ?? []).slice(0, 3),
            priority,
            reason: getReason(cat.score),
          });
        }

        setPlan(planItems);
        setLoading(false);
      });
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (plan.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">Your Training Plan</h2>
          <p className="text-xs text-muted-foreground">Personalized based on your brain scores</p>
        </div>
      </div>

      <div className="space-y-3">
        {plan.map((item) => {
          const CatIcon = CATEGORY_ICONS[item.categorySlug] as LucideIcon | undefined;
          const gradient = CATEGORY_GRADIENTS[item.categorySlug] || "from-gray-500 to-gray-600";

          return (
            <div key={item.categoryId} className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/30">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${gradient}`}>
                  {CatIcon && <CatIcon className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{item.categoryLabel}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.reason}</p>

                  {/* Score bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r transition-all"
                        style={{
                          width: `${item.currentScore}%`,
                          background: `linear-gradient(to right, ${CATEGORIES.find((c) => c.slug === item.categorySlug)?.color ?? "#6366f1"}, ${CATEGORIES.find((c) => c.slug === item.categorySlug)?.color ?? "#6366f1"}aa)`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold tabular-nums">{item.currentScore}</span>
                  </div>

                  {/* Suggested activities */}
                  {item.suggestedActivities.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {item.suggestedActivities.map((act) => (
                        <Link
                          key={act.id}
                          href={`/dashboard/library/${act.id}`}
                          className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs transition-colors hover:bg-muted"
                        >
                          <span className="truncate font-medium">{act.title}</span>
                          <span className="ml-auto flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {act.estimated_time}s
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/dashboard/library?category=${item.categoryId}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    View all activities <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
