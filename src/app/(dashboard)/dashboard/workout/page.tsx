"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  fetchBrainMomentumEngineState,
  PrescribedDailyWorkout,
  WorkoutDurationMode,
  RealWorldTransferExercise,
} from "@/lib/brain-momentum-engine";
import { InteractiveWorkoutEngine } from "@/components/workout/interactive-workout-engine";
import { Confetti } from "@/components/ui/confetti";
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  Coins,
  Zap,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Brain,
  RotateCcw,
  ShieldCheck,
  Target,
  Clock,
  Shuffle,
  Compass,
} from "lucide-react";

interface WorkoutResultSummary {
  totalXp: number;
  totalCoins: number;
  accuracyPercent: number;
  avgReactionTimeMs: number;
  categoryScores: Record<string, number>;
  weakestCategory: string;
  strongestCategory: string;
}

export default function WorkoutPage() {
  const searchParams = useSearchParams();
  const durationParam = (searchParams?.get("duration") as WorkoutDurationMode) || "standard";

  const [prescribedWorkout, setPrescribedWorkout] = useState<PrescribedDailyWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<WorkoutResultSummary | null>(null);
  const [streakDays, setStreakDays] = useState(15);
  const [momentumGained, setMomentumGained] = useState(6);
  const [transferExercise, setTransferExercise] = useState<RealWorldTransferExercise | null>(null);

  const loadPrescribedWorkout = useCallback(async (mode: WorkoutDurationMode) => {
    setLoading(true);
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    const state = await fetchBrainMomentumEngineState(userId, mode);
    setPrescribedWorkout(state.prescribedWorkout);
    setTransferExercise(state.prescribedWorkout.realWorldTransfer);
    setStreakDays(state.profile.streak);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPrescribedWorkout(durationParam);
  }, [loadPrescribedWorkout, durationParam]);

  const handleShuffleNewWorkout = () => {
    setIsCompleted(false);
    setResults(null);
    loadPrescribedWorkout(durationParam);
  };

  const handleWorkoutComplete = useCallback(
    async (summary: WorkoutResultSummary) => {
      setResults(summary);
      setIsCompleted(true);

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const today = new Date().toISOString().split("T")[0];

          // 1. Award XP in ledger
          await supabase.from("xp_ledger").insert({
            user_id: user.id,
            amount: summary.totalXp,
            source_type: "daily_workout",
            source_id: `adaptive-${durationParam}`,
            description: `Completed ${durationParam.toUpperCase()} Adaptive Brain Workout (${summary.accuracyPercent}% accuracy)`,
          });

          // 2. Log category brain scores
          const entries = Object.entries(summary.categoryScores).map(([cat, score]) => ({
            user_id: user.id,
            category_id: cat.toLowerCase().replace(/\s+/g, "-"),
            score,
            date: today,
          }));

          if (entries.length > 0) {
            await supabase.from("brain_scores").upsert(entries, {
              onConflict: "user_id,category_id,date",
            });
          }

          // 3. Mark daily workout completed
          await supabase.from("daily_workouts").upsert({
            user_id: user.id,
            date: today,
            status: "completed",
            duration_minutes: durationParam === "quick" ? 3 : durationParam === "deep" ? 15 : 8,
            total_xp: summary.totalXp,
            total_coins: summary.totalCoins,
          });

          // 4. Update profile streak and XP
          const { data: profile } = await supabase
            .from("profiles")
            .select("total_xp, coins, current_streak, streak_count")
            .eq("user_id", user.id)
            .single();

          if (profile) {
            await supabase
              .from("profiles")
              .update({
                total_xp: (profile.total_xp || 0) + summary.totalXp,
                coins: (profile.coins || 0) + summary.totalCoins,
                current_streak: (profile.current_streak || profile.streak_count || 14) + 1,
                streak_count: (profile.streak_count || profile.current_streak || 14) + 1,
              })
              .eq("user_id", user.id);
          }
        }
      } catch (err) {
        console.warn("Workout completion sync fallback:", err);
      }
    },
    [durationParam]
  );

  if (loading || !prescribedWorkout) {
    return (
      <div className="mx-auto w-full max-w-xl p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded-xl w-1/2" />
        <div className="h-64 bg-muted rounded-3xl" />
      </div>
    );
  }

  const allChallenges = [
    ...prescribedWorkout.cognitiveExercises,
    prescribedWorkout.challengeExercise,
  ];

  // ─── COMPLETION & REAL-WORLD TRANSFER SCREEN ────────────────────────────────
  if (isCompleted && results) {
    return (
      <div className="mx-auto w-full max-w-xl space-y-6 px-3 sm:px-4 py-4 pb-16 overflow-x-hidden">
        <Confetti active={isCompleted} />

        <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          {/* Header */}
          <div className="space-y-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white shadow-lg shadow-primary/30">
              <Trophy className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              WORKOUT COMPLETE!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              You sharpened your focus across {allChallenges.length} personalized rounds today.
            </p>
          </div>

          {/* Brain Momentum Surge Banner */}
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 p-4 text-left flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Brain Momentum Engine™ Update
              </span>
              <p className="text-sm font-black text-foreground">
                + {momentumGained} Momentum Points Earned
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          {/* 3 Quick Performance Badges */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-2xl bg-background/80 border border-border p-3">
              <span className="text-[10px] text-muted-foreground font-bold block uppercase">Accuracy</span>
              <span className="text-lg font-black text-foreground">{results.accuracyPercent}%</span>
            </div>
            <div className="rounded-2xl bg-background/80 border border-border p-3">
              <span className="text-[10px] text-muted-foreground font-bold block uppercase">Avg Speed</span>
              <span className="text-lg font-black text-foreground">
                {(results.avgReactionTimeMs / 1000).toFixed(1)}s
              </span>
            </div>
            <div className="rounded-2xl bg-background/80 border border-border p-3">
              <span className="text-[10px] text-muted-foreground font-bold block uppercase">XP Earned</span>
              <span className="text-lg font-black text-primary">+{results.totalXp} XP</span>
            </div>
          </div>

          {/* ─── TAKE IT INTO REAL LIFE (TRANSFER SECTION) ────────────────── */}
          {transferExercise && (
            <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10 p-5 text-left space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Compass className="h-4 w-4" />
                  TAKE IT INTO REAL LIFE
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {transferExercise.domain} Drill
                </span>
              </div>

              <h3 className="text-base font-black text-foreground">
                {transferExercise.title}
              </h3>

              <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                {transferExercise.instruction}
              </p>

              <div className="pt-1 text-[10px] text-muted-foreground italic border-t border-border/40">
                {transferExercise.responsibleDisclaimer}
              </div>
            </div>
          )}

          {/* Continuous Adaptation Note */}
          <p className="text-xs text-muted-foreground italic">
            &ldquo;Tomorrow&apos;s workout will adapt based on today&apos;s performance.&rdquo;
          </p>

          {/* Action CTAs: Natural Progression to Next Activity */}
          <div className="space-y-2.5 pt-2">
            <Link
              href="/dashboard/physical"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 px-6 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-[0.98] transition min-h-[52px]"
            >
              <span>CONTINUE TO TODAY&apos;S PHYSICAL TASK 🏃</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-xs font-bold hover:bg-accent transition min-h-[44px]"
            >
              <span>Back to Dashboard</span>
            </Link>

            <button
              onClick={handleShuffleNewWorkout}
              className="w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground pt-1 min-h-[32px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Or replay with fresh adaptive challenges</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── ACTIVE IN-APP INTERACTIVE WORKOUT ──────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-xl space-y-4 px-3 sm:px-4 py-2 overflow-x-hidden touch-manipulation">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[36px]"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-[10px] font-extrabold text-primary capitalize">
            {durationParam} Mode ({prescribedWorkout.estimatedMinutes}m)
          </span>
          <span className="rounded-full bg-orange-500/10 border border-orange-500/25 px-2.5 py-0.5 text-[10px] font-extrabold text-orange-600 dark:text-orange-400">
            🔥 Day {streakDays} Streak
          </span>
        </div>
      </div>

      {/* The 100% In-App Interactive Adaptive Workout Engine */}
      <InteractiveWorkoutEngine
        challenges={allChallenges}
        onComplete={handleWorkoutComplete}
      />
    </div>
  );
}
