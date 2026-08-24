"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PHYSICAL_ACTIVITIES_LIBRARY,
  PhysicalActivity,
} from "@/lib/physical-activities";
import { createClient } from "@/lib/supabase/client";
import { Confetti } from "@/components/ui/confetti";
import {
  ArrowLeft,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Zap,
  Coins,
  Flame,
  ArrowRight,
  ShieldCheck,
  Brain,
  Footprints,
} from "lucide-react";

export default function PhysicalActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const activity =
    PHYSICAL_ACTIVITIES_LIBRARY.find((a) => a.id === resolvedParams.id) ||
    PHYSICAL_ACTIVITIES_LIBRARY[0];

  // Timer states
  const totalSeconds = activity.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reflectionNote, setReflectionNote] = useState("");
  const [awardedXp, setAwardedXp] = useState(activity.xpReward);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      setShowModal(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleFinishActivity = async () => {
    setIsCompleted(true);
    setShowModal(false);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Record XP in ledger
        await supabase.from("xp_ledger").insert({
          user_id: user.id,
          amount: activity.xpReward,
          source_type: "physical_activity",
          source_id: activity.id,
          description: `Completed physical brain activity: ${activity.title}`,
        });

        // Update profile XP & coins
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_xp, coins, current_streak, streak_count")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          const newXp = (profile.total_xp || 0) + activity.xpReward;
          const newCoins = (profile.coins || 0) + activity.coinReward;
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
        }
      }
    } catch (err) {
      console.warn("Activity completion sync error:", err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-3 sm:px-4 py-3 pb-20 overflow-x-hidden touch-manipulation">
      <Confetti active={isCompleted} />

      {/* Top Breadcrumb */}
      <Link
        href="/dashboard/physical"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[36px]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Physical Activities
      </Link>

      {/* Header Card with Illustration Badge */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10 p-5 sm:p-7 space-y-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white text-3xl shadow-lg shadow-emerald-500/25">
            {activity.icon}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {activity.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              {activity.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activity.tagline}
            </p>
          </div>
        </div>

        {/* Quick Meta Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
          <span className="rounded-full bg-muted/80 px-3 py-1 text-foreground border border-border">
            ⏱️ {activity.duration} offline
          </span>
          <span className="rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-1 text-violet-600 dark:text-violet-400">
            ⚡ +{activity.xpReward} XP
          </span>
          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-amber-600 dark:text-amber-400">
            🪙 +{activity.coinReward} Coins
          </span>
        </div>
      </div>

      {/* Interactive Offline Timer Card */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 text-center space-y-4 shadow-sm">
        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
          Real-World Activity Timer
        </span>

        <div className="text-4xl sm:text-5xl font-mono font-black text-foreground">
          {formatTime(secondsRemaining)}
        </div>

        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-black shadow-md transition active:scale-95 min-h-[48px] min-w-[140px] touch-manipulation ${
              isRunning
                ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/25"
                : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/25"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Timer</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start Timer</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsRemaining(totalSeconds);
            }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition active:scale-95 touch-manipulation"
            title="Reset Timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground">
          You can close your phone screen and perform the exercise. Return here when you are done!
        </p>
      </div>

      {/* Step-by-Step What To Do */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-3.5 shadow-sm">
        <h2 className="text-sm sm:text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span>What To Do (Step-by-Step)</span>
        </h2>

        <div className="space-y-2.5">
          {activity.whatToDo.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-2xl bg-muted/30 border border-border/80 p-3 text-xs sm:text-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-xs">
                {idx + 1}
              </span>
              <p className="text-foreground leading-relaxed pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why It Matters (Evidence-Based) */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-3 shadow-sm">
        <h2 className="text-sm sm:text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span>Why This Matters (Brain Health)</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          &ldquo;{activity.whyItMatters}&rdquo;
        </p>

        {activity.culturalContext && (
          <div className="rounded-2xl bg-primary/5 border border-primary/15 p-3 text-xs text-primary font-medium">
            💡 <strong>Context Note:</strong> {activity.culturalContext}
          </div>
        )}
      </div>

      {/* What It Supports Badges */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          Cognitive Skills Being Trained:
        </span>
        <div className="flex flex-wrap gap-2">
          {activity.whatItSupports.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-background border border-border px-3 py-1 text-xs font-bold text-foreground shadow-sm"
            >
              ✓ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Complete Button CTA */}
      <div className="pt-2">
        {isCompleted ? (
          <div className="rounded-3xl border-2 border-emerald-500 bg-emerald-500/10 p-6 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-black text-foreground">
              ACTIVITY COMPLETED!
            </h3>
            <p className="text-xs text-muted-foreground">
              +{activity.xpReward} XP and +{activity.coinReward} Coins have been added to your profile.
            </p>
            <Link
              href="/dashboard/physical"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white px-6 py-3.5 text-xs font-black shadow-md transition active:scale-95"
            >
              <span>Explore More Physical Activities</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 text-sm sm:text-base font-black shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-[0.98] transition min-h-[52px] touch-manipulation"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>I HAVE COMPLETED THIS ACTIVITY</span>
          </button>
        )}
      </div>

      {/* Completion Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <span className="text-3xl">🎉</span>
              <h3 className="text-lg font-black text-foreground">
                Confirm Activity Completion
              </h3>
              <p className="text-xs text-muted-foreground">
                Did you complete: &ldquo;{activity.title}&rdquo;?
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground">
                Optional Reflection / What did you learn?
              </label>
              <textarea
                rows={3}
                placeholder="E.g., Felt calmer, noticed 3 new sights during my walk..."
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                className="w-full rounded-2xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-border bg-muted/60 py-3 text-xs font-bold hover:bg-muted transition"
              >
                Not yet
              </button>
              <button
                onClick={handleFinishActivity}
                className="flex-1 rounded-xl bg-emerald-600 text-white py-3 text-xs font-black shadow-md shadow-emerald-600/25 hover:bg-emerald-500 transition"
              >
                Yes, Claim +{activity.xpReward} XP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
