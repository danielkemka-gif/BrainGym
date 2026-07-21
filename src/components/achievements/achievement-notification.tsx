"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS } from "@/lib/constants";
import type { AchievementId } from "./achievements-grid";

export function AchievementNotification({
  newAchievements,
  onDone,
}: {
  newAchievements: AchievementId[];
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);

  const current = newAchievements[index]
    ? ACHIEVEMENTS.find((a) => a.id === newAchievements[index])
    : null;

  useEffect(() => {
    if (!current) {
      onDone();
      return;
    }
    const timer = setTimeout(() => {
      if (index < newAchievements.length - 1) {
        setIndex((i) => i + 1);
      } else {
        onDone();
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [index, current, newAchievements.length, onDone]);

  if (!current) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-2 fade-in rounded-2xl border border-primary/30 bg-card px-5 py-4 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{current.icon}</span>
        <div>
          <p className="text-xs text-muted-foreground">Achievement unlocked!</p>
          <p className="font-semibold">{current.title}</p>
          <p className="text-xs text-primary">+{current.xp} XP</p>
        </div>
      </div>
    </div>
  );
}
