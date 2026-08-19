"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import { pickDailyActivities, calculateWorkoutXp, calculateWorkoutCoins } from "@/lib/workout";
import { calculateStreakMultiplier } from "@/lib/scoring";
import { useI18n } from "@/lib/i18n";
import { AchievementNotification } from "@/components/achievements/achievement-notification";
import type { AchievementId } from "@/components/achievements/achievements-grid";
import { getWorkoutExample } from "@/lib/workout-examples";
import { ChevronDown, ChevronUp, Lightbulb, ShieldCheck, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

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
  const { t } = useI18n();
  const { user, supabase } = useAuth();
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [newAchievements, setNewAchievements] = useState<AchievementId[]>([]);
  const [started, setStarted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [selectedReflection, setSelectedReflection] = useState<string>("");
  const [verifiedMap, setVerifiedMap] = useState<Record<string, { reflection: string; verifiedAt: string }>>({});

  const fetchWorkout = useCallback(async () => {
    try {
      setError(null);
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

      const { data: profile } = await supabase
        .from("profiles")
        .select("age_group")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!pool || pool.length === 0) {
        setError(t.dashboard_no_activities);
        setLoading(false);
        return;
      }

      const picked = pickDailyActivities(pool as Activity[], undefined, profile?.age_group || undefined);
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
  }, [supabase, user]);

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

  async function verifyItem(itemId: string, reflectionText: string) {
    try {
      const supabase = createClient();
      const now = new Date().toISOString();
      await supabase
        .from("workout_items")
        .update({ status: "completed", completed_at: now })
        .eq("id", itemId);

      const updatedMap = {
        ...verifiedMap,
        [itemId]: {
          reflection: reflectionText || "Carried out with focused deliberate practice.",
          verifiedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      };
      setVerifiedMap(updatedMap);
      setVerifyingId(null);
      setSelectedReflection("");

      setWorkout((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workout_items: prev.workout_items.map((i) =>
            i.id === itemId ? { ...i, status: "completed" } : i
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

      // Update streak with freeze protection
      const { calculateStreakWithFreeze } = await import("@/lib/streak-protection");
      const { data: existingStreak } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      const currentStreakVal = existingStreak?.current_streak ?? 0;
      const lastDate = existingStreak?.last_workout_date ?? null;

      const streakResult = await calculateStreakWithFreeze(
        user.id,
        currentStreakVal,
        lastDate,
        today
      );

      const newStreakVal = streakResult.newStreak;
      const longestStreak = Math.max(existingStreak?.longest_streak ?? 0, newStreakVal);

      if (existingStreak) {
        await supabase
          .from("streaks")
          .update({
            current_streak: newStreakVal,
            longest_streak: longestStreak,
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

      // Recalculate brain scores based on recent activity
      const { recalculateBrainScores } = await import("@/lib/brain-scores");
      await recalculateBrainScores(user.id);

      setWorkout((prev) => (prev ? { ...prev, status: "completed" } : prev));
    } catch {
      // Workout completion failed
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
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
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 text-center">
        <span className="text-3xl sm:text-4xl">🏋️</span>
        <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold">Today&apos;s Workout</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {itemCount} {t.general_of} {totalTime}s
        </p>
        <button
          onClick={startWorkout}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 min-h-[44px] touch-manipulation active:scale-[0.97]"
        >
          {t.dashboard_start_training}
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
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 text-center">
          <span className="text-3xl sm:text-4xl">🎉</span>
          <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold">Workout Complete!</h2>
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
      <div       className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold">Today&apos;s Workout</h2>
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

        <div className="space-y-2.5">
          {sortedItems.map((item) => {
            const isCompleted = item.status === "completed";
            const isExpanded = expandedId === item.id;
            const isVerifying = verifyingId === item.id;
            const verifiedInfo = verifiedMap[item.id];
            const exampleData = getWorkoutExample({
              title: item.activities?.title,
              category_id: item.activities?.category_id,
            });

            const defaultOptions = exampleData.verificationOptions || [
              "Carried out with full focus",
              "Completed all 3 steps",
              "Felt mental clarity return",
              "Practiced deliberate mindfulness",
            ];

            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isCompleted
                    ? "border-green-500/30 bg-green-500/5"
                    : isExpanded || isVerifying
                    ? "border-primary/50 bg-card shadow-sm ring-1 ring-primary/20"
                    : "border-border bg-card/60 hover:border-muted-foreground/30"
                }`}
              >
                {/* Main Card Header */}
                <div className="flex items-center gap-3 p-3.5 sm:p-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isCompleted) {
                        setVerifyingId(item.id);
                        setExpandedId(item.id);
                      } else {
                        toggleItem(item.id);
                      }
                    }}
                    disabled={workout?.status === "completed"}
                    aria-label={isCompleted ? "Mark incomplete" : "Verify exercise"}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all min-h-[32px] min-w-[32px] touch-manipulation active:scale-95 ${
                      isCompleted
                        ? "border-green-500 bg-green-500 text-white shadow-sm"
                        : "border-muted-foreground/30 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {isCompleted ? "✓" : item.sort_order}
                  </button>

                  <div
                    className="min-w-0 flex-1 cursor-pointer select-none"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-sm font-semibold ${
                          isCompleted ? "text-foreground font-bold" : "text-foreground"
                        }`}
                      >
                        {item.activities?.title ?? "Activity"}
                      </p>

                      {/* Verification Status Indicator */}
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 border border-green-500/30 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-300">
                          <ShieldCheck className="h-3 w-3 text-green-500" />
                          <span>Verified Done ✓</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          💡 How-To &amp; Verify
                        </span>
                      )}
                    </div>

                    {/* Reflection note if recorded */}
                    {isCompleted && verifiedInfo?.reflection && (
                      <p className="mt-1 text-[11px] text-green-700 dark:text-green-400 italic">
                        &ldquo;{verifiedInfo.reflection}&rdquo;
                      </p>
                    )}

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.activities?.estimated_time ?? "?"}s ·
                      <span className="capitalize"> {item.activities?.difficulty ?? "?"}</span>
                      {item.activities?.xp && (
                        <> · +{item.activities.xp} XP</>
                      )}
                    </p>
                  </div>

                  {/* Toggle Example Drawer button */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition touch-manipulation"
                    aria-label={isExpanded ? "Hide details" : "Show details"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Rich Example, How-To, and Verification Section */}
                {isExpanded && (
                  <div className="border-t border-border/60 bg-muted/30 p-3.5 sm:p-4 text-xs space-y-3 animate-in fade-in-50 duration-200">
                    {/* Basic Explanation & Real-World Example */}
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 sm:p-3">
                      <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 mb-1">
                        <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                        <span>Basic Explanation &amp; Real-Life Example:</span>
                      </div>
                      <p className="text-foreground/90 leading-relaxed font-medium">
                        &ldquo;{exampleData.example}&rdquo;
                      </p>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground/80 flex items-center gap-1.5">
                        <span>How to carry it out:</span>
                      </p>
                      <ol className="space-y-1 pl-4 list-decimal text-muted-foreground leading-relaxed">
                        {exampleData.steps.map((step, idx) => (
                          <li key={idx}>
                            <span className="text-foreground/90">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Brain Benefit */}
                    <div className="pt-1 text-[11px] text-muted-foreground flex items-start gap-1.5">
                      <span>🧠</span>
                      <p><strong className="text-foreground/80">Why it works:</strong> {exampleData.benefit}</p>
                    </div>

                    {/* Accountability & Verification Checklist Drawer */}
                    {!isCompleted ? (
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 sm:p-3.5 space-y-2.5 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary flex items-center gap-1 text-xs">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Accountability Check:</span>
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            Confirm execution
                          </span>
                        </div>

                        <p className="text-xs text-foreground/90 font-medium">
                          {exampleData.verificationPrompt || "Did you carry out this exercise deliberately?"}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {defaultOptions.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setSelectedReflection(opt)}
                              className={`text-left px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition active:scale-95 touch-manipulation ${
                                selectedReflection === opt
                                  ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                                  : "border-border bg-card hover:border-primary/50 text-foreground"
                              }`}
                            >
                              ✓ {opt}
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              verifyItem(
                                item.id,
                                selectedReflection || defaultOptions[0]
                              )
                            }
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white py-2 px-3 text-xs font-bold shadow-sm transition active:scale-95 min-h-[38px] touch-manipulation"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Verify &amp; Record Completion ✓</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-bold text-green-700 dark:text-green-300">
                            Carried out &amp; verified by you today
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className="text-[11px] text-muted-foreground hover:text-foreground underline"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {workout && workout.status !== "completed" && (
          <button
            onClick={completeWorkout}
            disabled={!allDone || completing}
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] touch-manipulation active:scale-[0.97]"
          >
            {completing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : allDone ? (
              t.dashboard_complete_workout
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
