"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ACHIEVEMENTS } from "@/lib/constants";

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];

export function AchievementsGrid() {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("achievements")
        .select("achievement_type")
        .eq("user_id", user.id)
        .then(({ data }) => {
          if (data) setUnlocked(new Set(data.map((a) => a.achievement_type)));
        });
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {ACHIEVEMENTS.map((a) => {
        const isUnlocked = unlocked.has(a.id);
        return (
          <div
            key={a.id}
            className={`rounded-xl border p-4 text-center transition-all ${
              isUnlocked
                ? "border-primary/30 bg-primary/5"
                : "border-border opacity-50 grayscale"
            }`}
          >
            <div className="mb-2 text-2xl">{a.icon}</div>
            <p className="text-sm font-medium">{a.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {a.description}
            </p>
            {isUnlocked && (
              <p className="mt-1 text-xs text-primary">+{a.xp} XP</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
