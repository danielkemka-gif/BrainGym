"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { QUICK_FIRE_DURATIONS, CATEGORIES } from "@/lib/constants";
import { ArrowLeft, Clock, Zap, Trophy, Coins, ChevronRight, RotateCcw } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  tips: string | null;
  benefits: string[] | null;
  estimated_time: number;
  difficulty: string;
  xp: number;
  coins: number;
  category_id: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-green-500 bg-green-500/10",
  intermediate: "text-yellow-500 bg-yellow-500/10",
  advanced: "text-red-500 bg-red-500/10",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  memory: "🧠",
  focus: "🎯",
  thinking: "💡",
  learning: "📚",
  health: "❤️",
  creativity: "🎨",
  "emotional-intelligence": "🤝",
};

export default function ChallengePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [shuffled, setShuffled] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [phase, setPhase] = useState<"setup" | "countdown" | "active" | "finished">("setup");
  const [countdownValue, setCountdownValue] = useState(3);
  const [completed, setCompleted] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [currentXpBonus, setCurrentXpBonus] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activityXpLog, setActivityXpLog] = useState<{ title: string; xp: number; coins: number }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("activities")
      .select("id, title, description, instructions, tips, benefits, estimated_time, difficulty, xp, coins, category_id")
      .then(({ data, error }) => {
        if (error) {
          setError("Failed to load activities: " + error.message);
          return;
        }
        if (data && data.length > 0) {
          setActivities(data as Activity[]);
        } else {
          setError("No activities found in the database.");
        }
      });
  }, []);

  function shuffleArray(arr: Activity[]): Activity[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const startChallenge = useCallback(() => {
    if (activities.length === 0) {
      setError("No activities loaded yet. Try again.");
      return;
    }
    setError(null);
    const picked = shuffleArray(activities).slice(0, 15);
    setShuffled(picked);
    setCurrentIndex(0);
    setCompleted(0);
    setTotalXp(0);
    setTotalCoins(0);
    setActivityXpLog([]);
    setTimeLeft(duration);
    setPhase("countdown");
    setCountdownValue(3);
  }, [duration, activities.length]);

  // Countdown phase
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdownValue <= 0) {
      setPhase("active");
      return;
    }
    const t = setTimeout(() => setCountdownValue((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdownValue]);

  // Active timer
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "active" && shuffled.length > 0) {
      const act = shuffled[currentIndex];
      if (act) {
        const bonus = Math.max(2, Math.floor(timeLeft / 10));
        setCurrentXpBonus(bonus);
      }
    }
  }, [phase, currentIndex, timeLeft, shuffled]);

  function skipActivity() {
    if (currentIndex < shuffled.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("finished");
    }
  }

  async function completeActivity() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const act = shuffled[currentIndex];
      if (!act) return;

      const bonus = Math.max(2, Math.floor(timeLeft / 10));
      const xp = (act.xp ?? 10) + bonus;
      const coins = act.coins ?? 5;

      await supabase.from("activity_logs").insert({
        user_id: user.id,
        activity_id: act.id,
        date: new Date().toISOString().split("T")[0],
        xp_earned: xp,
        coins_earned: coins,
      });

      await supabase.from("xp_ledger").insert({
        user_id: user.id,
        amount: xp,
        reason: "quick_fire_activity",
        reference_type: "activity",
        reference_id: act.id,
      });

      await supabase.from("coins_ledger").insert({
        user_id: user.id,
        amount: coins,
        reason: "quick_fire_activity",
        reference_type: "activity",
        reference_id: act.id,
      });

      setCompleted((c) => c + 1);
      setTotalXp((x) => x + xp);
      setTotalCoins((c) => c + coins);
      setActivityXpLog((log) => [...log, { title: act.title, xp, coins }]);

      if (currentIndex < shuffled.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("finished");
      }
    } catch {
      setError("Failed to save. Try again.");
    }
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  // ── SETUP PHASE ──
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-4xl">
            ⚡
          </div>
          <h1 className="text-2xl font-bold">Quick-Fire Challenge</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Race against the clock! Complete as many brain exercises as you can before time runs out.
            The faster you go, the more bonus XP you earn.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-background p-4 text-left">
            <h3 className="mb-3 text-sm font-semibold">How it works</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</div>
                <p className="text-sm text-muted-foreground">Pick your time limit — 30s, 60s, or 90s</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</div>
                <p className="text-sm text-muted-foreground">Read the exercise instructions, then do it</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</div>
                <p className="text-sm text-muted-foreground">Tap &quot;Done&quot; when finished — earn coins + XP instantly</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</div>
                <p className="text-sm text-muted-foreground">Faster completions = bigger XP bonus!</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Choose your time limit</p>
            <div className="flex justify-center gap-3">
              {QUICK_FIRE_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`rounded-xl border px-6 py-3 text-sm font-medium transition-all ${
                    duration === d
                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <button
            onClick={startChallenge}
            disabled={activities.length === 0}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 disabled:opacity-70"
          >
            <Zap className="h-4 w-4" />
            {activities.length === 0 ? "Loading activities..." : "Start Challenge"}
          </button>
        </div>
      </div>
    );
  }

  // ── COUNTDOWN PHASE ──
  if (phase === "countdown") {
    return (
      <div className="mx-auto flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-6 text-8xl font-bold text-primary animate-pulse">
            {countdownValue}
          </div>
          <p className="text-lg text-muted-foreground">
            {countdownValue === 3 ? "Get ready..." : countdownValue === 2 ? "Set..." : "GO!"}
          </p>
        </div>
      </div>
    );
  }

  // ── FINISHED PHASE ──
  if (phase === "finished") {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-4xl">
            🎉
          </div>
          <h2 className="text-2xl font-bold">Challenge Complete!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {timeLeft === 0 ? "Time's up!" : "Great effort!"}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              <p className="text-3xl font-bold text-primary">{completed}</p>
              <p className="text-xs text-muted-foreground">Exercises done</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-4">
              <p className="text-3xl font-bold text-amber-500">{totalCoins}</p>
              <p className="text-xs text-muted-foreground">Coins earned</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-violet-500/10 p-4">
            <p className="text-3xl font-bold text-violet-400">+{totalXp}</p>
            <p className="text-xs text-muted-foreground">Total XP earned</p>
          </div>

          {activityXpLog.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-background p-4 text-left">
              <h3 className="mb-3 text-sm font-semibold">Activity breakdown</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activityXpLog.map((log, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="truncate text-muted-foreground">{log.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-violet-400">+{log.xp}xp</span>
                      <span className="text-xs text-amber-500">+{log.coins}c</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={startChallenge}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" />
              Play Again
            </button>
            <Link
              href="/dashboard"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium hover:bg-accent"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── ACTIVE PHASE ──
  const current = shuffled[currentIndex];
  if (!current) {
    setPhase("finished");
    return null;
  }

  const category = CATEGORIES.find((c) => c.id === current.category_id);
  const progress = shuffled.length > 0 ? (currentIndex + 1) / shuffled.length : 0;
  const timePercent = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const isUrgent = timeLeft <= 10;

  return (
    <div className="mx-auto max-w-lg space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase("setup");
          }}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${isUrgent ? "bg-red-500/10 text-red-500" : "bg-muted"}`}>
            <Clock className="h-3.5 w-3.5" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {currentIndex + 1}/{shuffled.length}
        </div>
      </div>

      {/* Time bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isUrgent ? "bg-red-500" : "bg-primary"}`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Progress */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Activity card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Category + Difficulty header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{CATEGORY_EMOJIS[current.category_id] || "🧠"}</span>
            <span className="text-sm text-muted-foreground">{category?.label}</span>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${DIFFICULTY_COLORS[current.difficulty] || "text-muted-foreground bg-muted"}`}>
            {current.difficulty}
          </span>
        </div>

        <div className="p-5 space-y-4">
          <h2 className="text-xl font-bold">{current.title}</h2>

          {current.description && (
            <p className="text-sm text-muted-foreground">{current.description}</p>
          )}

          {/* Instructions */}
          {current.instructions && (
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">How to do this</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">{current.instructions}</p>
            </div>
          )}

          {/* Tips */}
          {current.tips && (
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-500">Tips</h3>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{current.tips}</p>
            </div>
          )}

          {/* Benefits */}
          {current.benefits && current.benefits.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {current.benefits.map((b, i) => (
                  <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* XP + Coins preview */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-3 py-1.5">
              <Trophy className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-bold text-violet-400">
                +{currentXpBonus > 0 ? (current.xp ?? 10) + currentXpBonus : current.xp ?? 10} XP
              </span>
              {currentXpBonus > 0 && (
                <span className="text-[10px] text-violet-400/70">
                  (base {current.xp ?? 10} + {currentXpBonus} speed)
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-500">+{current.coins ?? 5} coins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={skipActivity}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium hover:bg-accent"
        >
          Skip
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={completeActivity}
          className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl hover:shadow-green-500/30"
        >
          Done! ✓
        </button>
      </div>
    </div>
  );
}
