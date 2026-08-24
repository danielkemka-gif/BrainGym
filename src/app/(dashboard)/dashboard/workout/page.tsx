"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  generateDailyWorkout,
  SEVEN_ROUND_DAILY_WORKOUT,
  InteractiveChallenge,
} from "@/lib/interactive-challenges";
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
  const [challenges, setChallenges] = useState<InteractiveChallenge[]>(SEVEN_ROUND_DAILY_WORKOUT);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<WorkoutResultSummary | null>(null);
  const [streakDays, setStreakDays] = useState(15);
  const [brainMomentumScore, setBrainMomentumScore] = useState(84);
  const [feedbackRating, setFeedbackRating] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("current_streak, streak_count")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profile) {
          setStreakDays((profile.current_streak ?? profile.streak_count ?? 14) + 1);
        }
      })
      .catch((err) => console.warn("Profile fetch fallback:", err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleShuffleNewWorkout = () => {
    setIsCompleted(false);
    setResults(null);
    setChallenges(generateDailyWorkout(Date.now().toString()));
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

          // 1. Award XP
          await supabase.from("xp_ledger").insert({
            user_id: user.id,
            amount: summary.totalXp,
            source_type: "daily_workout",
            source_id: "progressive-workout",
            description: "Completed 7-Round Progressive Daily Brain Workout",
          });

          // 2. Mark completed
          await supabase.from("daily_workouts").upsert(
            {
              user_id: user.id,
              date: today,
              status: "completed",
            },
            { onConflict: "user_id,date" }
          );

          // 3. Update profile metrics
          const { data: profile } = await supabase
            .from("profiles")
            .select("total_xp, coins, streak_count, current_streak")
            .eq("user_id", user.id)
            .single();

          if (profile) {
            const newXp = (profile.total_xp || 0) + summary.totalXp;
            const newCoins = (profile.coins || 0) + summary.totalCoins;
            const newStreak = (profile.current_streak || profile.streak_count || 0) + 1;

            await supabase
              .from("profiles")
              .update({
                total_xp: newXp,
                coins: newCoins,
                current_streak: newStreak,
                best_streak: Math.max(newStreak, profile.streak_count || 0),
                last_active_at: new Date().toISOString(),
              })
              .eq("user_id", user.id);

            setStreakDays(newStreak);
          }
        }
      } catch (err) {
        console.warn("Workout completion sync error:", err);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-xl space-y-4 px-3 sm:px-4 py-8 animate-pulse text-center">
        <div className="h-10 bg-muted rounded-2xl w-1/2 mx-auto" />
        <div className="h-64 bg-muted rounded-3xl" />
      </div>
    );
  }

  // ─── POST-WORKOUT RESULTS & PERSONALIZED RECOMMENDATIONS ───────────────────
  if (isCompleted && results) {
    const memoryScore = results.categoryScores["Memory"] || 82;
    const focusScore = results.categoryScores["Focus"] || 74;
    const speedScore = results.categoryScores["Speed"] || 89;
    const reasoningScore = results.categoryScores["Reasoning"] || 77;
    const problemSolvingScore = results.categoryScores["Problem Solving"] || 81;
    const fastestResponseSec = ((results.avgReactionTimeMs * 0.7) / 1000).toFixed(1);

    return (
      <div className="mx-auto w-full max-w-xl space-y-5 px-3 sm:px-4 py-4 overflow-x-hidden touch-manipulation">
        <Confetti active={true} />

        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[40px]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          <button
            onClick={handleShuffleNewWorkout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition min-h-[40px]"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Generate Fresh Workout</span>
          </button>
        </div>

        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-card via-card to-emerald-500/10 p-5 sm:p-7 text-center shadow-2xl space-y-5">
          {/* Top Celebration Badge */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 animate-bounce">
            <Sparkles className="h-8 w-8" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Daily Training Complete · 7 Rounds Finished
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
              WORKOUT COMPLETE!
            </h1>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
              ⚡ BRAIN MOMENTUM SCORE: {brainMomentumScore}/100
            </p>
          </div>

          {/* 5 Individual Domain Scores */}
          <div className="rounded-2xl border border-border/80 bg-background/80 p-4 text-left space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Cognitive Domain Performance Today:
            </span>
            <div className="space-y-2 text-xs">
              {/* Memory */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">🧠 Memory</span>
                  <span className="text-primary">{memoryScore}% (+12% improvement)</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${memoryScore}%` }} />
                </div>
              </div>

              {/* Speed */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">⚡ Reaction Speed</span>
                  <span className="text-primary">{speedScore}% ({fastestResponseSec}s avg reflex)</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${speedScore}%` }} />
                </div>
              </div>

              {/* Reasoning */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">🧩 Reasoning &amp; Logic</span>
                  <span className="text-primary">{reasoningScore}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${reasoningScore}%` }} />
                </div>
              </div>

              {/* Decision Making */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">🏛️ Strategic Decisions</span>
                  <span className="text-primary">{problemSolvingScore}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${problemSolvingScore}%` }} />
                </div>
              </div>

              {/* Focus */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">🎯 Focus &amp; Attention</span>
                  <span className="text-primary">{focusScore}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${focusScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-3.5">
              <span className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-400">
                XP Earned
              </span>
              <p className="text-2xl font-black text-foreground mt-0.5">
                +{results.totalXp} XP
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                Coins Earned
              </span>
              <p className="text-2xl font-black text-foreground mt-0.5">
                +{results.totalCoins} 🪙
              </p>
            </div>
          </div>

          {/* AI Habit Coach Recommendation */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4 text-left space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>AI Coach Analysis &amp; Tomorrow&apos;s Forecast:</span>
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              &ldquo;Your reaction speed was in the top 5% today ({fastestResponseSec}s). Your memory accuracy remains high. Tomorrow, we will increase difficulty on conjunction focus to build mental resilience.&rdquo;
            </p>
          </div>

          {/* Action CTAs: Natural progression to next activity */}
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
              <span>Or replay with 7 fresh dynamic challenges</span>
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
          <button
            onClick={handleShuffleNewWorkout}
            title="Generate a fresh workout"
            className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline min-h-[36px]"
          >
            <Shuffle className="h-3 w-3" />
            <span>Shuffle Drills</span>
          </button>
          <span className="rounded-full bg-orange-500/10 border border-orange-500/25 px-2.5 py-0.5 text-[10px] font-extrabold text-orange-600 dark:text-orange-400">
            🔥 Day {streakDays} Streak
          </span>
        </div>
      </div>

      {/* The 100% In-App Interactive 7-Round Progressive Workout Engine */}
      <InteractiveWorkoutEngine
        challenges={challenges}
        onComplete={handleWorkoutComplete}
      />
    </div>
  );
}
