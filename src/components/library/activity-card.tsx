"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  estimated_time: number;
  xp: number;
  category_id: string;
}

export function ActivityCard({ activity }: { activity: Activity }) {
  const category = CATEGORIES.find((c) => c.id === activity.category_id);

  return (
    <Link
      href={`/dashboard/library/${activity.id}`}
      className="block rounded-2xl border border-border bg-card p-4 transition-all hover:border-muted-foreground/30 hover:shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: category?.color ?? "#666" }}
        />
        <span className="text-xs text-muted-foreground">
          {category?.label ?? "General"}
        </span>
      </div>

      <h3 className="mb-1 font-semibold">{activity.title}</h3>
      {activity.description && (
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {activity.description}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>⏱ {activity.estimated_time}s</span>
        <span
          className={
            activity.difficulty === "beginner"
              ? "text-green-500"
              : activity.difficulty === "intermediate"
                ? "text-yellow-500"
                : "text-red-500"
          }
        >
          {activity.difficulty}
        </span>
        <span>+{activity.xp} XP</span>
      </div>
    </Link>
  );
}
