"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { QUICK_FIRE_DURATIONS } from "@/lib/constants";

interface Activity {
  id: string;
  title: string;
  estimated_time: number;
  difficulty: string;
  xp: number;
}

export default function ChallengePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("activities")
      .select("id, title, estimated_time, difficulty, xp")
      .limit(20)
      .then(({ data }) => {
        if (data) setActivities(data);
      });
  }, []);

  const startChallenge = useCallback(() => {
    if (activities.length === 0) {
      setError("No activities loaded yet. Try again.");
      return;
    }
    setStarted(true);
    setTimeLeft(duration);
    setCurrentIndex(0);
    setCompleted(0);
    setXpEarned(0);
    setFinished(false);
    setError(null);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, activities.length]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function completeActivity(id: string) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const activity = activities[currentIndex];
      const bonus = Math.max(2, Math.floor(timeLeft / 10));
      const xp = (activity?.xp ?? 10) + bonus;

      await supabase.from("activity_logs").insert({
        user_id: user.id,
        activity_id: id,
        date: new Date().toISOString().split("T")[0],
        xp_earned: xp,
        coins_earned: 5,
      });

      // Check for speed_demon achievement
      const { data: existing } = await supabase
        .from("achievements")
        .select("id")
        .eq("user_id", user.id)
        .eq("achievement_type", "speed_demon")
        .maybeSingle();

      if (!existing) {
        await supabase.from("achievements").insert({
          user_id: user.id,
          achievement_type: "speed_demon",
          xp_reward: 100,
        });
        await supabase.from("xp_ledger").insert({
          user_id: user.id,
          amount: 100,
          reason: "achievement_speed_demon",
        });
      }

      setCompleted((c) => c + 1);
      setXpEarned((x) => x + xp);

      if (currentIndex < activities.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setFinished(true);
      }
    } catch {
      setError("Failed to save activity. Try again.");
    }
  }

  if (activities.length === 0 && !started) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="rounded-2xl border border-border bg-card p-8">
          <span className="text-5xl">⚡</span>
          <h2 className="mt-4 text-2xl font-bold">Challenge Complete!</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-2xl font-bold">{completed}</p>
              <p className="text-xs text-muted-foreground">Activities done</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-2xl font-bold">+{xpEarned}</p>
              <p className="text-xs text-muted-foreground">XP earned</p>
            </div>
          </div>
          <button
            onClick={startChallenge}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Play again
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="rounded-2xl border border-border bg-card p-8">
          <span className="text-5xl">⚡</span>
          <h1 className="mt-4 text-2xl font-bold">Quick-Fire Challenge</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete as many activities as you can before time runs out.
            Faster completions earn bonus XP!
          </p>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Duration</p>
            <div className="flex justify-center gap-3">
              {QUICK_FIRE_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                    duration === d
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}

          <button
            onClick={startChallenge}
            disabled={activities.length === 0}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            Start Challenge
          </button>
        </div>
      </div>
    );
  }

  const current = activities[currentIndex];

  if (!current) {
    setFinished(true);
    return null;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">Activity {currentIndex + 1}/{activities.length}</span>
          <div className="mt-1 h-2 w-48 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${((currentIndex + 1) / activities.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="text-right">
          <p
            className={`text-2xl font-bold ${
              timeLeft <= 10 ? "text-destructive" : ""
            }`}
          >
            {timeLeft}s
          </p>
          <p className="text-xs text-muted-foreground">remaining</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <h2 className="text-xl font-bold">{current.title}</h2>
        <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
          <span>⏱ {current.estimated_time}s</span>
          <span>+{current.xp + Math.max(2, Math.floor(timeLeft / 10))} XP</span>
        </div>
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
        <button
          onClick={() => completeActivity(current.id)}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Complete ✓
        </button>
      </div>
    </div>
  );
}
