"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLevelProgress } from "@/lib/scoring";
import { LEVELS, STREAK } from "@/lib/constants";
import { Lock } from "lucide-react";
import { STREAK_FREEZE_ICON, STREAK_WARNING_ICON } from "@/lib/icons";

export function XpStreakSection() {
  const [totalXp, setTotalXp] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastWorkoutDate: null as string | null });
  const [coins, setCoins] = useState(0);
  const [streakFreezesRemaining, setStreakFreezesRemaining] = useState(0);
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
          .select("current_streak, longest_streak, last_workout_date")
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data }) => ({
            current: data?.current_streak ?? 0,
            longest: data?.longest_streak ?? 0,
            lastWorkoutDate: data?.last_workout_date ?? null,
          })),
        supabase
          .from("profiles")
          .select("streak_freezes_remaining")
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data }) => data?.streak_freezes_remaining ?? 0),
      ]).then(([xp, coin, str, freezes]) => {
        setTotalXp(xp);
        setCoins(coin);
        setStreak(str);
        setStreakFreezesRemaining(freezes);
        setLoading(false);
      });
    });
  }, []);

  const { level, progress, xpInLevel, xpForNext } = getLevelProgress(totalXp);
  const nextLevel = LEVELS.find((l) => l.level === level.level + 1);
  const isPremiumLocked = nextLevel?.premium === true;

  const today = new Date().toISOString().split("T")[0];
  const isAtRisk =
    streak.current > 0 &&
    streak.lastWorkoutDate !== today &&
    new Date().getHours() >= STREAK.WARNING_AT_HOUR;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      {/* Level */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">{level.title}</p>
          {level.premium && <span className="text-xs font-medium text-amber-400">PREMIUM</span>}
        </div>
        <p className="text-xs text-muted-foreground">Level {level.level}</p>
      </div>

      {/* XP Bar */}
      <div className="mb-3 sm:mb-4">
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
          <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5">
            <Lock className="h-3 w-3 text-amber-400" />
            <span className="text-xs text-amber-400">
              Level {nextLevel.level}+ requires Premium
            </span>
          </div>
        )}
      </div>

      {/* Coins + Stats */}
      <div className="grid grid-cols-3 gap-1.5 text-center sm:gap-2 sm:gap-3">
        <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2">
          <p className="text-base sm:text-lg font-bold text-primary">{coins}</p>
          <p className="text-[11px] text-muted-foreground sm:text-xs">Coins</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-1.5 sm:p-2">
          <p className="text-base sm:text-lg font-bold">
            {streak.current}
            {streakFreezesRemaining > 0 && (
              <span className="ml-1 inline-flex items-center gap-0.5 text-xs font-medium text-blue-400">
                <STREAK_FREEZE_ICON className="h-3 w-3" />×{streakFreezesRemaining}
              </span>
            )}
          </p>
          <p className="text-[11px] text-muted-foreground sm:text-xs">Streak</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-1.5 sm:p-2">
          <p className="text-base sm:text-lg font-bold">{streak.longest}</p>
          <p className="text-[11px] text-muted-foreground sm:text-xs">Best</p>
        </div>
      </div>

      {isAtRisk && (
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-400">
          <STREAK_WARNING_ICON className="h-3.5 w-3.5" />
          Train today to keep your streak!
        </div>
      )}
    </div>
  );
}
