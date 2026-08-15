"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { Flame, Gift, Check } from "lucide-react";

const MILESTONES = [
  { days: 7, coins: 100 },
  { days: 14, coins: 250 },
  { days: 30, coins: 500 },
  { days: 60, coins: 1000 },
  { days: 100, coins: 2500 },
];

export function StreakMilestones() {
  const { user, supabase } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [claimed, setClaimed] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [awarded, setAwarded] = useState<string | null>(null);
  const awardingRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("streak_milestones")
        .select("milestone")
        .eq("user_id", user.id),
    ]).then(([streakRes, milestoneRes]) => {
      setCurrentStreak(streakRes.data?.current_streak ?? 0);
      setClaimed(new Set((milestoneRes.data ?? []).map((r) => r.milestone)));
      setLoading(false);
    });
  }, [user, supabase]);

  useEffect(() => {
    if (!user || loading || awardingRef.current) return;
    const unlocked = MILESTONES.find(
      (m) => currentStreak >= m.days && !claimed.has(m.days)
    );
    if (!unlocked) return;

    awardingRef.current = true;
    const applyReward = async () => {
      const { error: claimError } = await supabase
        .from("streak_milestones")
        .insert({ user_id: user.id, milestone: unlocked.days });
      if (claimError) {
        awardingRef.current = false;
        return;
      }
      const { error: coinError } = await supabase.from("coins_ledger").insert({
        user_id: user.id,
        amount: unlocked.coins,
        reason: "streak_milestone",
        reference_type: "streak_milestone",
        reference_id: String(unlocked.days),
      });
      if (!coinError) {
        setClaimed((prev) => new Set(prev).add(unlocked.days));
        setAwarded(`${unlocked.days} day streak`);
      }
      awardingRef.current = false;
    };
    applyReward();
  }, [user, loading, currentStreak, claimed, supabase]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-3 flex flex-wrap gap-2">
          {MILESTONES.map((m) => (
            <div key={m.days} className="h-10 w-14 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-500" />
        <h3 className="text-sm font-semibold">Streak Milestones</h3>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Keep your streak alive to unlock coin rewards — each is earned once.
      </p>

      {awarded && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600">
          <Gift className="h-4 w-4" />
          Reward unlocked: {awarded} streak!
        </div>
      )}

      <div className="mt-4 grid grid-cols-5 gap-2">
        {MILESTONES.map((m) => {
          const reached = currentStreak >= m.days;
          const done = claimed.has(m.days);
          return (
            <div
              key={m.days}
              className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-center ${
                done
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : reached
                    ? "border-primary/40 bg-primary/5"
                    : "border-muted bg-muted/30 opacity-60"
              }`}
            >
              {done ? (
                <Check className="h-5 w-5 text-emerald-500" />
              ) : (
                <Flame className={`h-5 w-5 ${reached ? "text-primary" : "text-muted-foreground"}`} />
              )}
              <span className="text-xs font-semibold">{m.days}d</span>
              <span className="text-[10px] text-muted-foreground">{m.coins} coins</span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Current streak: <span className="font-semibold text-foreground">{currentStreak} days</span>
      </p>
    </div>
  );
}
