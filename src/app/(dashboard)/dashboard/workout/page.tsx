"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { pickDailyActivities, calculateWorkoutXp, calculateWorkoutCoins } from "@/lib/workout";
import { calculateStreakMultiplier } from "@/lib/scoring";
import { CATEGORIES } from "@/lib/constants";
import { recalculateBrainScores } from "@/lib/brain-scores";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import { calculateStreakWithFreeze } from "@/lib/streak-protection";
import {
  ArrowLeft, CheckCircle2, Clock, Zap, Trophy, Coins,
  ChevronRight, ChevronLeft, Pause, Play, SkipForward, Star, Sparkles
} from "lucide-react";
import { Confetti } from "@/components/ui/confetti";
import { LevelUpModal } from "@/components/ui/level-up-modal";
import { StreakMilestoneModal, getStreakMilestone } from "@/components/ui/streak-milestone-modal";
import { getLevelProgress } from "@/lib/scoring";
import { LEVELS } from "@/lib/constants";

interface Activity {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
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

type SessionPhase = "intro" | "activity" | "timer" | "complete" | "summary";

export default function GuidedWorkoutPage() {
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<SessionPhase>("intro");
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelFrom, setLevelFrom] = useState(1);
  const [levelTo, setLevelTo] = useState(1);
  const [showStreakMilestone, setShowStreakMilestone] = useState(false);
  const [streakMilestoneDays, setStreakMilestoneDays] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sortedItems = workout
    ? [...workout.workout_items].sort((a, b) => a.sort_order - b.sort_order)
    : [];
  const activeItem = sortedItems[activeIndex];
  const activeActivity = activeItem?.activities;
  const category = activeActivity
    ? CATEGORIES.find((c) => c.id === activeActivity.category_id)
    : null;

  const fetchOrCreateWorkout = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await supabase
        .from("daily_workouts")
        .select(`id, status, workout_items (id, activity_id, status, sort_order, activities (*))`)
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      // Fetch current total XP for level-up detection
      const { data: xpData } = await supabase
        .from("xp_ledger")
        .select("amount")
        .eq("user_id", user.id);
      const currentTotalXp = xpData ? xpData.reduce((s, r) => s + r.amount, 0) : 0;
      setTotalXp(currentTotalXp);

      if (existing) {
        const w = existing as unknown as DailyWorkout;
        setWorkout(w);

        if (w.status === "completed") {
          setPhase("summary");
          const doneItems = w.workout_items.filter((i) => i.status === "completed");
          setCompletedCount(doneItems.length);
        } else {
          // Find first incomplete item
          const sorted = [...w.workout_items].sort((a, b) => a.sort_order - b.sort_order);
          const firstIncomplete = sorted.findIndex((i) => i.status !== "completed");
          setActiveIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
          setPhase("intro");
        }
        setLoading(false);
        return;
      }

      // Create new workout
      const { data: pool } = await supabase
        .from("activities")
        .select("id, title, description, instructions, estimated_time, difficulty, xp, coins, category_id")
        .eq("is_active", true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("age_group")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!pool || pool.length === 0) {
        setLoading(false);
        return;
      }

      const picked = pickDailyActivities(pool as Activity[], undefined, profile?.age_group || undefined);
      const { data: newWorkout } = await supabase
        .from("daily_workouts")
        .insert({ user_id: user.id, date: today, status: "in_progress", started_at: new Date().toISOString() })
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
          .select(`id, status, workout_items (id, activity_id, status, sort_order, activities (*))`)
          .eq("id", newWorkout.id)
          .single();

        if (full) {
          setWorkout(full as unknown as DailyWorkout);
          setPhase("intro");
        }
      }
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrCreateWorkout();
  }, [fetchOrCreateWorkout]);

  // Timer logic
  useEffect(() => {
    if (!timerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  function startTimer() {
    if (!activeActivity) return;
    setTimerSeconds(activeActivity.estimated_time || 120);
    setTimerRunning(true);
    setPhase("timer");
  }

  function pauseTimer() {
    setTimerRunning(false);
  }

  function resumeTimer() {
    setTimerRunning(true);
  }

  async function completeActivity() {
    if (!activeItem || !workout) return;
    setTimerRunning(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Mark item completed
    await supabase
      .from("workout_items")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", activeItem.id);

    const actXp = activeActivity?.xp ?? 10;
    const actCoins = activeActivity?.coins ?? 5;
    setSessionXp((prev) => prev + actXp);
    setSessionCoins((prev) => prev + actCoins);
    setCompletedCount((prev) => prev + 1);

    // Credit activity
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      activity_id: activeItem.activity_id,
      date: today,
      xp_earned: actXp,
      coins_earned: actCoins,
    });
    await supabase.from("xp_ledger").insert({
      user_id: user.id,
      amount: actXp,
      reason: "activity_complete",
      reference_type: "activity",
      reference_id: activeItem.activity_id,
    });
    await supabase.from("coins_ledger").insert({
      user_id: user.id,
      amount: actCoins,
      reason: "activity_complete",
      reference_type: "activity",
      reference_id: activeItem.activity_id,
    });

    // Update local state
    setWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        workout_items: prev.workout_items.map((i) =>
          i.id === activeItem.id ? { ...i, status: "completed" } : i
        ),
      };
    });

    setPhase("complete");
  }

  async function finishSession() {
    if (!workout) return;
    setPhase("summary");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date().toISOString();
    const today = now.split("T")[0];

    // Mark workout completed
    await supabase
      .from("daily_workouts")
      .update({ status: "completed", completed_at: now })
      .eq("id", workout.id);

    // Get streak for multiplier
    const { data: streak } = await supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", user.id)
      .maybeSingle();
    const multiplier = calculateStreakMultiplier(streak?.current_streak ?? 0);

    // Credit workout bonus
    const bonusXp = calculateWorkoutXp(sessionXp, multiplier) - sessionXp;
    const bonusCoins = calculateWorkoutCoins(sessionCoins) - sessionCoins;

    if (bonusXp > 0) {
      await supabase.from("xp_ledger").insert({
        user_id: user.id,
        amount: bonusXp,
        reason: "workout_complete",
      });
    }
    if (bonusCoins > 0) {
      await supabase.from("coins_ledger").insert({
        user_id: user.id,
        amount: bonusCoins,
        reason: "workout_complete",
      });
    }

    setSessionXp((prev) => prev + bonusXp);
    setSessionCoins((prev) => prev + bonusCoins);

    // Update streak with freeze protection
    const { data: existingStreak } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const streakResult = await calculateStreakWithFreeze(
      user.id,
      existingStreak?.current_streak ?? 0,
      existingStreak?.last_workout_date ?? null,
      today
    );

    if (existingStreak) {
      await supabase
        .from("streaks")
        .update({
          current_streak: streakResult.newStreak,
          longest_streak: Math.max(existingStreak.longest_streak, streakResult.newStreak),
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

    // Check for streak milestone
    const milestone = getStreakMilestone(streakResult.newStreak);
    if (milestone) {
      // Credit milestone rewards
      if (milestone.xp > 0) {
        await supabase.from("xp_ledger").insert({
          user_id: user.id,
          amount: milestone.xp,
          reason: `streak_milestone_${milestone.days}d`,
        });
      }
      if (milestone.coins > 0) {
        await supabase.from("coins_ledger").insert({
          user_id: user.id,
          amount: milestone.coins,
          reason: `streak_milestone_${milestone.days}d`,
        });
      }
      setStreakMilestoneDays(streakResult.newStreak);
      setShowStreakMilestone(true);
    }

    // Recalculate brain scores
    await recalculateBrainScores(user.id);

    // Check achievements
    await checkAndUnlockAchievements({
      userId: user.id,
      workoutCompleted: true,
      completedAt: now,
    });

    // Check for level-up
    const prevLevel = getLevelProgress(totalXp);
    const newTotalXp = totalXp + sessionXp + bonusXp + (milestone?.xp ?? 0);
    const newLevel = getLevelProgress(newTotalXp);
    if (newLevel.level.level > prevLevel.level.level) {
      setLevelFrom(prevLevel.level.level);
      setLevelTo(newLevel.level.level);
      setShowLevelUp(true);
    }

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }

  function skipActivity() {
    if (sortedItems.length === 0) return;
    if (activeIndex < sortedItems.length - 1) {
      setActiveIndex((prev) => prev + 1);
      setPhase("intro");
      setTimerRunning(false);
    } else {
      finishSession();
    }
  }

  function nextActivity() {
    if (activeIndex < sortedItems.length - 1) {
      setActiveIndex((prev) => prev + 1);
      setPhase("intro");
      setTimerRunning(false);
    } else {
      finishSession();
    }
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  // Summary phase
  if (phase === "summary") {
    return (
      <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground min-h-[44px]">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-8 text-center relative overflow-hidden">
          <Confetti active={showConfetti} />
          <LevelUpModal
            show={showLevelUp}
            fromLevel={levelFrom}
            toLevel={levelTo}
            onDismiss={() => setShowLevelUp(false)}
          />
          <StreakMilestoneModal
            show={showStreakMilestone}
            streakDays={streakMilestoneDays}
            onDismiss={() => setShowStreakMilestone(false)}
          />

          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Workout Complete!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Amazing work today — your brain just got stronger!
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
            <div className="rounded-xl bg-violet-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4 text-violet-400" />
                <p className="text-2xl font-bold text-violet-400">+{sessionXp}</p>
              </div>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Coins className="h-4 w-4 text-amber-500" />
                <p className="text-2xl font-bold text-amber-500">+{sessionCoins}</p>
              </div>
              <p className="text-xs text-muted-foreground">Coins</p>
            </div>
            <div className="rounded-xl bg-green-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-2xl font-bold text-green-500">{completedCount}</p>
              </div>
              <p className="text-xs text-muted-foreground">Activities</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/dashboard"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 touch-manipulation">
              Back to Dashboard
            </Link>
            <Link href="/dashboard/progress"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium hover:bg-accent touch-manipulation">
              View Progress
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!activeActivity || sortedItems.length === 0) {
    return (
      <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground min-h-[44px]">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
          <p className="text-muted-foreground">No workout available today.</p>
          <Link href="/dashboard/library"
            className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.97]">
            Browse Activities
          </Link>
        </div>
      </div>
    );
  }

  const progress = sortedItems.length > 0 ? (completedCount / sortedItems.length) : 0;

  // Intro phase — show activity before starting
  if (phase === "intro") {
    return (
      <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground min-h-[44px]">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Activity {activeIndex + 1} of {sortedItems.length}</span>
            <span className="text-muted-foreground">{completedCount} done</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="flex gap-1">
            {sortedItems.map((item, i) => (
              <div key={item.id} className={`h-1 flex-1 rounded-full transition-colors ${
                item.status === "completed" ? "bg-green-500" : i === activeIndex ? "bg-primary" : "bg-muted"
              }`} />
            ))}
          </div>
        </div>

        {/* Activity card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="h-2 w-full" style={{ backgroundColor: category?.color ?? "#6366f1" }} />
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              {category && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: `${category.color}15`, color: category.color }}>
                  {category.label}
                </span>
              )}
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                activeActivity.difficulty === "beginner" ? "text-green-500 bg-green-500/10"
                  : activeActivity.difficulty === "intermediate" ? "text-yellow-500 bg-yellow-500/10"
                  : "text-red-500 bg-red-500/10"
              }`}>{activeActivity.difficulty}</span>
            </div>

            <h2 className="text-xl font-bold">{activeActivity.title}</h2>

            {activeActivity.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{activeActivity.description}</p>
            )}

            {activeActivity.instructions && (
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Instructions</p>
                <p className="text-sm leading-relaxed">{activeActivity.instructions}</p>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {formatTime(activeActivity.estimated_time || 120)}
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-violet-400" /> +{activeActivity.xp} XP
              </span>
              <span className="flex items-center gap-1">
                <Coins className="h-3.5 w-3.5 text-amber-500" /> +{activeActivity.coins}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={startTimer}
            className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl active:scale-[0.98]">
            <Play className="h-4 w-4" /> Start Activity
          </button>
          <button onClick={skipActivity}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground hover:bg-accent active:scale-[0.97]">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Timer phase
  if (phase === "timer") {
    const timePercent = activeActivity.estimated_time > 0
      ? (timerSeconds / activeActivity.estimated_time) * 100
      : 0;
    const isComplete = timerSeconds <= 0;

    return (
      <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground min-h-[44px]">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-sm text-muted-foreground">
            Activity {activeIndex + 1}/{sortedItems.length}
          </span>
        </div>

        {/* Timer circle */}
        <div className="flex flex-col items-center py-4 sm:py-8">
          <div className="relative h-40 w-40 sm:h-48 sm:w-48">
            <svg className="h-40 w-40 sm:h-48 sm:w-48 -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor"
                className="stroke-muted" strokeWidth="8" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor"
                className="stroke-primary transition-all duration-1000"
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - timePercent / 100)}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl sm:text-4xl font-bold tabular-nums">{formatTime(timerSeconds)}</p>
              <p className="text-xs text-muted-foreground mt-1">{category?.label}</p>
            </div>
          </div>

          <h3 className="mt-6 text-lg font-bold text-center">{activeActivity.title}</h3>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {timerRunning ? (
            <button onClick={pauseTimer}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-colors">
              <Pause className="h-6 w-6" />
            </button>
          ) : (
            <button onClick={resumeTimer}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
              <Play className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Complete / Skip */}
        <div className="flex gap-3">
          <button onClick={completeActivity}
            className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl active:scale-[0.98]">
            <CheckCircle2 className="h-4 w-4" /> Done!
          </button>
          <button onClick={skipActivity}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground hover:bg-accent active:scale-[0.97]">
            Skip
          </button>
        </div>
      </div>
    );
  }

  // Complete phase — brief celebration before next activity
  if (phase === "complete") {
    return (
      <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 sm:p-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <Star className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-green-500">Nice work!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            +{activeActivity?.xp ?? 0} XP · +{activeActivity?.coins ?? 0} Coins
          </p>

          {activeIndex < sortedItems.length - 1 ? (
            <button onClick={nextActivity}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-[0.97]">
              Next Activity <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={finishSession}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 text-sm font-bold text-white shadow-lg shadow-green-500/25 active:scale-[0.97]">
              <Star className="h-4 w-4" /> Finish Workout
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
