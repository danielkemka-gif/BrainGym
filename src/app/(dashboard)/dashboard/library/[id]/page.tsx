"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  estimated_time: number;
  xp: number;
  coins: number;
  benefits: string[] | null;
  instructions: string | null;
  tips: string | null;
  category_id: string;
}

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("activities")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setActivity(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-lg font-medium">Activity not found</p>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === activity.category_id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to library
      </button>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: category?.color ?? "#666" }}
          />
          <span className="text-xs text-muted-foreground">
            {category?.label ?? "General"}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span
            className={`text-xs ${
              activity.difficulty === "beginner"
                ? "text-green-500"
                : activity.difficulty === "intermediate"
                  ? "text-yellow-500"
                  : "text-red-500"
            }`}
          >
            {activity.difficulty}
          </span>
        </div>

        <h1 className="text-2xl font-bold">{activity.title}</h1>
        {activity.description && (
          <p className="mt-2 text-muted-foreground">{activity.description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          ⏱ {activity.estimated_time}s
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          +{activity.xp} XP
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          +{activity.coins} coins
        </div>
      </div>

      {activity.instructions && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-2 font-semibold">Instructions</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {activity.instructions}
          </p>
        </div>
      )}

      {activity.benefits && activity.benefits.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-2 font-semibold">Benefits</h2>
          <ul className="space-y-1">
            {activity.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 text-green-500">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activity.tips && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-2 font-semibold">Tips</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {activity.tips}
          </p>
        </div>
      )}

      <button
        onClick={() => router.push("/dashboard")}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Add to today&apos;s workout
      </button>
    </div>
  );
}
