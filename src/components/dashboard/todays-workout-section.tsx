"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { pickDailyActivities, calculateWorkoutXp, calculateWorkoutCoins } from "@/lib/workout";
import { calculateStreakMultiplier } from "@/lib/scoring";
import { AchievementNotification } from "@/components/achievements/achievement-notification";
import type { AchievementId } from "@/components/achievements/achievements-grid";

interface Activity {
  id: string;
  title: string;
  estimated_time: number;
  difficulty: string;
  xp: number;
  coins: number;
  category_id: string;
}

interface WorkoutItem {
  id: string;
  activity_id: string;
  status: string;
  sort_order: number;
  activities: Activity;
}

interface DailyWorkout {
  id: string;
  status: string;
  workout_items: WorkoutItem[];
}

export function TodaysWorkoutSection() {
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [newAchievements, setNewAchievements] = useState<AchievementId[]>([]);
  const [started, setStarted] = useState(false);

  const fetchWorkout = useCallback(async () => {
    try {
      setError(null);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await supabase
        .from("daily_workouts")
        .select(
          `id, status, workout_items (id, activity_id, status, sort_order, activities (*))`
        )
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (existing) {
        const w = existing as unknown as DailyWorkout;
        setWorkout(w);
        if (w.status === "in_progress") setStarted(true);
        setLoading(false);
        return;
      }

      const { data: pool } = await supabase
        .from("activities")
        .select("id, title, estimated_time, difficulty, xp, coins, category_id")
        .eq("is_active", true);

      if (!pool || pool.length === 0) {
        setError("No activities available. Check back later.");
        setLoading(false);
        return;
      }

      const picked = pickDailyActivities(pool as Activity[]);
      const { data: newWorkout } = await supabase
        .from("daily_workouts")
        .insert({ user_id: user.id, date: today, status: "pending" })
        .select()
        .single();

      if (newWorkout) {
        const items = picked.map((a, i) => ({
          workout_id: newWorkout.id,
          activity_id: a.id,
          sort_order: i + 1,
        }));

        await supabase.from("workout_items").insert(items);

        const { data: full } = await supabase
          .from("daily_workouts")
          .select(
            `id, status, workout_items (id, activity_id, status, sort_order, activities (*))`
          )
          .eq("id", newWorkout.id)
          .single();

        if (full) setWorkout(full as unknown as DailyWorkout);
      }
    } catch {
      setError("Failed to load your workout. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkout();
  }, [fetchWorkout]);

  async function startWorkout() {
    if (!workout) return;
    try {
      const supabase = createClient();
      await supabase
        .from("daily_workouts")
        .update({ status: "in_progress", started_at: new Date().toISOString() })
        .eq("id", workout.id);
      setWorkout((prev) => (prev ? { ...prev, status: "in_progress" } : prev));
      setStarted(true);
    } catch {
      // Silently fail
    }
  }

  async function toggleItem(itemId: string) {
    try {
      const supabase = createClient();
      const item = workout?.workout_items.find((i) => i.id === itemId);
      if (!item) return;

      const newStatus = item.status === "completed" ? "pending" : "completed";
      await supabase
        .from("workout_items")
        .update({ status: newStatus, completed_at: newStatus === "completed" ? new Date().toISOString() : null })
        .eq("id", itemId);

      setWorkout((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workout_items: prev.workout_items.map((i) =>
            i.id === itemId ? { ...i, status: newStatus } : i
          ),
        };
      });
    } catch {
      // Silently fail
    }
  }

  async function completeWorkout() {
    setCompleting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !workout) return;

      const now = new Date().toISOString();
      const today = now.split("T")[0];

      // Get streak for multiplier
      const { data: streak } = await supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", user.id)
        .maybeSingle();
      const streakVal = streak?.current_streak ?? 0;
      const multiplier = calculateStreakMultiplier(streakVal);

      // Mark workout completed
      await supabase
        .from("daily_workouts")
        .update({ status: "completed", completed_at: now })
        .eq("id", workout.id);

      // Credit each completed activity
      let totalActivityXp = 0;
      let totalActivityCoins = 0;

      for (const item of workout.workout_items) {
        if (item.status === "completed") {
          const actXp = item.activities?.xp ?? 10;
          const actCoins = item.activities?.coins ?? 5;
          totalActivityXp += actXp;
          totalActivityCoins += actCoins;

          await supabase.from("activity_logs").insert({
            user_id: user.id,
            activity_id: item.activity_id,
            date: today,
            xp_earned: actXp,
            coins_earned: actCoins,
          });

          await supabase.from("xp_ledger").insert({
            user_id: user.id,
            amount: actXp,
            reason: "activity_complete",
            reference_type: "activity",
            reference_id: item.activity_id,
          });

          await supabase.from("coins_ledger").insert({
            user_id: user.id,
            amount: actCoins,
            reason: "activity_complete",
            reference_type: "activity",
            reference_id: item.activity_id,
          });
        }
      }

      // Credit workout completion bonus
      const totalXp = calculateWorkoutXp(totalActivityXp, multiplier);
      const totalCoins = calculateWorkoutCoins(totalActivityCoins);

      await supabase.from("xp_ledger").insert({
        user_id: user.id,
        amount: totalXp - totalActivityXp,
        reason: "workout_complete",
      });

      await supabase.from("coins_ledger").insert({
        user_id: user.id,
        amount: totalCoins - totalActivityCoins,
        reason: "workout_complete",
      });

      // Update streak
      const { data: existingStreak } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingStreak) {
        const lastDate = existingStreak.last_workout_date;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const isConsecutive = lastDate === yesterday || lastDate === today;
        const newStreak = isConsecutive ? existingStreak.current_streak + 1 : 1;

        await supabase
          .from("streaks")
          .update({
            current_streak: newStreak,
            longest_streak: Math.max(existingStreak.longest_streak, newStreak),
            last_workout_date: today,
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("streaks").insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_workout_date: today,
        });
      }

      // Check achievements
      const { checkAndUnlockAchievements } = await import("@/lib/achievements");
      const unlocked = await checkAndUnlockAchievements({
        userId: user.id,
        workoutCompleted: true,
        completedAt: now,
      });

      if (unlocked.length > 0) setNewAchievements(unlocked);
      setWorkout((prev) => (prev ? { ...prev, status: "completed" } : prev));
    } catch {
      // Workout completion failed
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={() => { setLoading(true); fetchWorkout(); }}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Try again
        </button>
      </div>
    );
  }

  // Waiting to start
  if (workout && !started && workout.status !== "completed") {
    const itemCount = workout.workout_items.length;
    const totalTime = workout.workout_items.reduce(
      (s, i) => s + (i.activities?.estimated_time ?? 0),
      0
    );
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <span className="text-4xl">🏋️</span>
        <h2 className="mt-3 text-xl font-bold">Today&apos;s Workout</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {itemCount} activities · ~{totalTime}s total
        </p>
        <button
          onClick={startWorkout}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Start Workout
        </button>
      </div>
    );
  }

  const allDone =
    workout?.workout_items.every((i) => i.status === "completed") ?? false;
  const doneCount = workout?.workout_items.filter((i) => i.status === "completed").length ?? 0;
  const sortedItems = workout
    ? [...workout.workout_items].sort((a, b) => a.sort_order - b.sort_order)
    : [];
  const progress = workout ? doneCount / workout.workout_items.length : 0;

  // Completed state
  if (workout?.status === "completed") {
    return (
      <>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <span className="text-4xl">🎉</span>
          <h2 className="mt-3 text-xl font-bold">Workout Complete!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Great job today — keep the streak alive!
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-left text-sm"
              >
                <span className="text-green-500">✓</span>
                <span className="truncate">{item.activities?.title}</span>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/library"
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Explore more activities
          </Link>
        </div>
        {newAchievements.length > 0 && (
          <AchievementNotification
            newAchievements={newAchievements}
            onDone={() => setNewAchievements([])}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Today&apos;s Workout</h2>
          <span className="text-xs text-muted-foreground">
            {doneCount}/{workout?.workout_items.length ?? 0}
          </span>
        </div>

        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="space-y-2">
          {sortedItems.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              disabled={workout?.status === "completed"}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                item.status === "completed"
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs transition-colors ${
                  item.status === "completed"
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-muted-foreground/30"
                }`}
              >
                {item.status === "completed" ? "✓" : item.sort_order}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-medium ${
                    item.status === "completed" ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {item.activities?.title ?? "Activity"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.activities?.estimated_time ?? "?"}s ·
                  <span className="capitalize"> {item.activities?.difficulty ?? "?"}</span>
                  {item.activities?.xp && (
                    <> · +{item.activities.xp} XP</>
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>

        {workout && workout.status !== "completed" && (
          <button
            onClick={completeWorkout}
            disabled={!allDone || completing}
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {completing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : allDone ? (
              "Complete Workout"
            ) : (
              `${doneCount}/${workout.workout_items.length} done`
            )}
          </button>
        )}
      </div>
      {newAchievements.length > 0 && (
        <AchievementNotification
          newAchievements={newAchievements}
          onDone={() => setNewAchievements([])}
        />
      )}
    </>
  );
}
