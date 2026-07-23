"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLevelProgress } from "@/lib/scoring";
import { LEVELS } from "@/lib/constants";
import { Lock } from "lucide-react";

export function XpStreakSection() {
  const [totalXp, setTotalXp] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      Promise.all([
        supabase
          .from("xp_ledger")
          .select("amount")
          .eq("user_id", user.id)
          .then(({ data }) =>
            data ? data.reduce((s, r) => s + r.amount, 0) : 0
          ),
        supabase
          .from("coins_ledger")
          .select("amount")
          .eq("user_id", user.id)
          .then(({ data }) =>
            data ? data.reduce((s, r) => s + r.amount, 0) : 0
          ),
        supabase
          .from("streaks")
          .select("current_streak, longest_streak")
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data }) => ({
            current: data?.current_streak ?? 0,
            longest: data?.longest_streak ?? 0,
          })),
      ]).then(([xp, coin, str]) => {
        setTotalXp(xp);
        setCoins(coin);
        setStreak(str);
        setLoading(false);
      });
    });
  }, []);

  const { level, progress, xpInLevel, xpForNext } = getLevelProgress(totalXp);
  const nextLevel = LEVELS.find((l) => l.level === level.level + 1);
  const isPremiumLocked = nextLevel?.premium === true;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {/* Level */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">{level.title}</p>
          {level.premium && <span className="text-xs font-medium text-amber-400">PREMIUM</span>}
        </div>
        <p className="text-xs text-muted-foreground">Level {level.level}</p>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{totalXp.toLocaleString()} XP</span>
          {nextLevel && (
            <span>{nextLevel.xpRequired.toLocaleString()} XP</span>
          )}
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: loading ? 0 : `${progress * 100}%` }}
          />
        </div>
        {isPremiumLocked && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5">
            <Lock className="h-3 w-3 text-amber-400" />
            <span className="text-xs text-amber-400">
              Level {nextLevel.level}+ requires Premium
            </span>
          </div>
        )}
      </div>

      {/* Coins + Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-primary/10 p-2">
          <p className="text-lg font-bold text-primary">{coins}</p>
          <p className="text-xs text-muted-foreground">Coins</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-lg font-bold">{streak.current}</p>
          <p className="text-xs text-muted-foreground">Day streak</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-lg font-bold">{streak.longest}</p>
          <p className="text-xs text-muted-foreground">Best streak</p>
        </div>
      </div>
    </div>
  );
}
