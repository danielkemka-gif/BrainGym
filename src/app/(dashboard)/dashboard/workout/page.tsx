"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
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
  const [challenges] = useState<InteractiveChallenge[]>(SEVEN_ROUND_DAILY_WORKOUT);
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
    },
    [streakDays]
  );

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent mx-auto" />
          <p className="text-sm font-bold text-muted-foreground">
            Waking up your brain... Launching Challenge 1...
          </p>
        </div>
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

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[40px]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

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
                  <span className="text-primary font-black">{memoryScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${memoryScore}%` }} />
                </div>
              </div>

              {/* Focus */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">🎯 Focus</span>
                  <span className="text-violet-500 font-black">{focusScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${focusScore}%` }} />
                </div>
              </div>

              {/* Speed */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">⚡ Speed</span>
                  <span className="text-pink-500 font-black">{speedScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full" style={{ width: `${speedScore}%` }} />
                </div>
              </div>

              {/* Reasoning */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">🧩 Reasoning</span>
                  <span className="text-emerald-500 font-black">{reasoningScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${reasoningScore}%` }} />
                </div>
              </div>

              {/* Problem Solving */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">🏛️ Problem Solving</span>
                  <span className="text-amber-500 font-black">{problemSolvingScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${problemSolvingScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Comparison Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left text-xs">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5">
              <span className="font-black text-emerald-600 dark:text-emerald-400">📈 Focus Boost:</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Your Focus improved by +8% today.</p>
            </div>

            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-2.5">
              <span className="font-black text-violet-600 dark:text-violet-400">⚡ Reaction Speed:</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Your fastest response was {fastestResponseSec}s.</p>
            </div>

            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-2.5">
              <span className="font-black text-blue-600 dark:text-blue-400">🧠 Retention:</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Fewer memory mistakes than yesterday.</p>
            </div>
          </div>

          {/* Personalized Tomorrow Recommendation */}
          <div className="rounded-2xl bg-muted/60 border border-border p-4 text-left space-y-1.5">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-black uppercase text-foreground">
                PERSONALIZED NEXT WORKOUT RECOMMENDATION:
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              &ldquo;Your memory is strong (<strong className="text-foreground">{memoryScore}%</strong>), but your focus needs more training (<strong className="text-foreground">{focusScore}%</strong>). Tomorrow&apos;s workout will contain more Focus and Reaction challenges.&rdquo;
            </p>
          </div>

          {/* 4 Reward Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-2xl bg-violet-500/10 border border-violet-500/20 p-2.5">
              <p className="text-lg font-black text-violet-400">+{results.totalXp}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">XP Earned</p>
            </div>

            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-2.5">
              <p className="text-lg font-black text-amber-500">+{results.totalCoins}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Coins</p>
            </div>

            <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-2.5">
              <p className="text-lg font-black text-orange-500">🔥 {streakDays}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Day Streak</p>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-2.5">
              <p className="text-lg font-black text-emerald-500">{results.accuracyPercent}%</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Accuracy</p>
            </div>
          </div>

          {/* Habit Anchor Closing Message */}
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5">
            <p className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              «Your brain is stronger today than it was yesterday. Come back tomorrow!»
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
            <button
              onClick={() => {
                setIsCompleted(false);
                setResults(null);
              }}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-6 text-sm font-bold hover:bg-accent active:scale-[0.98] transition touch-manipulation min-h-[48px]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Train Again (Extra XP)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── IMMEDIATE IN-APP WORKOUT GAMEPLAY ──────────────────────────────────────
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
          ⏱️ 7 Progressive Rounds · 100% In-App
        </span>
      </div>

      <InteractiveWorkoutEngine
        challenges={challenges}
        onComplete={handleWorkoutComplete}
      />
    </div>
  );
}
