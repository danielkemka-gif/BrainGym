"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { generateDailyInteractiveWorkout, InteractiveChallenge } from "@/lib/interactive-challenges";
import { InteractiveWorkoutEngine } from "@/components/workout/interactive-workout-engine";
import { Confetti } from "@/components/ui/confetti";
import { ArrowLeft, Sparkles, Trophy, Coins, Zap, Flame, CheckCircle2, TrendingUp, ArrowRight, Brain, RotateCcw } from "lucide-react";

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
  const [challenges, setChallenges] = useState<InteractiveChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<WorkoutResultSummary | null>(null);
  const [streakDays, setStreakDays] = useState(14);
  const [brainScore, setBrainScore] = useState(84);
  const [feedbackRating, setFeedbackRating] = useState<string | null>(null);

  useEffect(() => {
    // Generate today's balanced 6-round workout
    const daySeed = new Date().getDate();
    const dailyChallenges = generateDailyInteractiveWorkout(daySeed);
    setChallenges(dailyChallenges);

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user profile streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, streak_count")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setStreakDays((profile.current_streak ?? profile.streak_count ?? 14) + 1);
      }

      setLoading(false);
    });
  }, []);

  const handleWorkoutComplete = useCallback(async (summary: WorkoutResultSummary) => {
    setResults(summary);
    setIsCompleted(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const today = new Date().toISOString().split("T")[0];

        // 1. Award XP to ledger
        await supabase.from("xp_ledger").insert({
          user_id: user.id,
          amount: summary.totalXp,
          source_type: "daily_workout",
          source_id: "today-workout",
          description: "Completed Daily Interactive Brain Workout",
        });

        // 2. Mark daily workout completed
        await supabase.from("daily_workouts").upsert(
          {
            user_id: user.id,
            date: today,
            status: "completed",
          },
          { onConflict: "user_id,date" }
        );

        // 3. Update streak
        await supabase
          .from("profiles")
          .update({
            current_streak: streakDays,
            streak_count: streakDays,
          })
          .eq("user_id", user.id);
      }
    } catch (err) {
      console.warn("Failed to persist workout result:", err);
    }
  }, [streakDays]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent mx-auto" />
          <p className="text-sm font-bold text-muted-foreground">Preparing today&apos;s interactive challenges...</p>
        </div>
      </div>
    );
  }

  // ─── POST-WORKOUT CELEBRATION RITUAL ─────────────────────────────────────────
  if (isCompleted && results) {
    return (
      <div className="mx-auto w-full max-w-xl space-y-5 px-3 sm:px-4 py-4 overflow-x-hidden touch-manipulation">
        <Confetti active={true} />

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[40px]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-card via-card to-emerald-500/10 p-5 sm:p-7 text-center shadow-xl space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 animate-bounce">
            <Sparkles className="h-8 w-8" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Session Finished · Baseline Locked In
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
              WORKOUT COMPLETE!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              🎉 Today&apos;s Brain Score: {brainScore} <span className="text-xs text-muted-foreground font-normal">(+5 vs yesterday · NEW PERSONAL BEST!)</span>
            </p>
          </div>

          {/* 4 Reward Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-2xl bg-violet-500/10 border border-violet-500/20 p-3">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4 text-violet-400" />
                <p className="text-lg sm:text-xl font-black text-violet-400">+{results.totalXp}</p>
              </div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">XP Earned</p>
            </div>

            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3">
              <div className="flex items-center justify-center gap-1">
                <Coins className="h-4 w-4 text-amber-500" />
                <p className="text-lg sm:text-xl font-black text-amber-500">+{results.totalCoins}</p>
              </div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">Coins</p>
            </div>

            <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-3">
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">🔥</span>
                <p className="text-lg sm:text-xl font-black text-orange-500">{streakDays}</p>
              </div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">Day Streak</p>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3">
              <div className="flex items-center justify-center gap-1">
                <Zap className="h-4 w-4 text-emerald-500" />
                <p className="text-lg sm:text-xl font-black text-emerald-500">{results.accuracyPercent}%</p>
              </div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">Accuracy</p>
            </div>
          </div>

          {/* Tomorrow's Personalized Recommendation */}
          <div className="rounded-2xl bg-muted/60 border border-border p-4 text-left space-y-1.5">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-black uppercase text-foreground">
                Tomorrow&apos;s Training Recommendation:
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              &ldquo;Your <strong className="text-foreground">{results.strongestCategory}</strong> performance was peak today. However, your <strong className="text-foreground">{results.weakestCategory}</strong> skills will benefit from targeted conditioning. Tomorrow&apos;s workout will prioritize {results.weakestCategory} challenges.&rdquo;
            </p>
          </div>

          {/* Optional 1-Tap Feedback */}
          <div className="rounded-2xl bg-card border border-border/80 p-3.5 space-y-2 text-left">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              How did today&apos;s challenges feel?
            </span>
            <div className="grid grid-cols-3 gap-2">
              {["Too Easy", "Just Right", "Challenging"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFeedbackRating(opt)}
                  className={`p-2 rounded-xl text-xs font-bold border transition touch-manipulation min-h-[38px] ${
                    feedbackRating === opt
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Habit Anchor Closing Message */}
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5">
            <p className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              «Your brain is stronger today than it was yesterday. Come back tomorrow to beat today&apos;s score!»
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Link
              href="/dashboard"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 px-6 text-sm font-black text-white shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition touch-manipulation min-h-[48px]"
            >
              <span>Done · Return to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/progress"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-border px-6 text-sm font-bold hover:bg-accent active:scale-[0.98] transition touch-manipulation min-h-[48px]"
            >
              View Brain Score Progress
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── ACTIVE INTERACTIVE WORKOUT GAMEPLAY ─────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-2xl px-3 sm:px-4 py-4 space-y-4 overflow-x-hidden touch-manipulation">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[38px]"
        >
          <ArrowLeft className="h-4 w-4" /> Exit Workout
        </Link>
        <span className="text-[11px] font-bold text-muted-foreground">
          ⏱️ 7 Minutes · 6 Rounds
        </span>
      </div>

      <InteractiveWorkoutEngine
        challenges={challenges}
        onComplete={handleWorkoutComplete}
      />
    </div>
  );
}
