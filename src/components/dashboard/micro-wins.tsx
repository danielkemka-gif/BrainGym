"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Flame, Target, Link2, Circle } from "lucide-react";

const DAILY_GOAL_TARGET = 3;

function RingProgress({ progress }: { progress: number }) {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(progress, 1));

  return (
    <svg width="48" height="48" className="shrink-0 -rotate-90">
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        className="text-muted"
      />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-all duration-700"
      />
    </svg>
  );
}

export function MicroWins() {
  const [showToast, setShowToast] = useState(false);
  const [toastXp, setToastXp] = useState(0);
  const [dailyCompleted, setDailyCompleted] = useState(2);
  const [streakDays, setStreakDays] = useState(3);

  const dailyGoalTarget = DAILY_GOAL_TARGET;
  const goalMet = dailyCompleted >= dailyGoalTarget;
  const dailyProgress = dailyCompleted / dailyGoalTarget;

  const fakeXp = 320;
  const nextLevelThreshold = 500;
  const xpProgress = fakeXp / nextLevelThreshold;

  useEffect(() => {
    const handler = (e: CustomEvent<{ xp: number }>) => {
      setToastXp(e.detail.xp);
      setShowToast(true);
      setDailyCompleted((c) => c + 1);
    };
    window.addEventListener("micro-xp" as string, handler as EventListener);
    return () => window.removeEventListener("micro-xp" as string, handler as EventListener);
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  return (
    <>
      {/* Daily Goal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Daily Goal</h3>
        </div>

        <div className="mt-3 flex items-center gap-4">
          <RingProgress progress={dailyProgress} />
          <div>
            {goalMet ? (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500">
                <CheckCircle className="h-4 w-4" />
                Daily goal crushed!
              </p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  {dailyCompleted}/{dailyGoalTarget} activities done
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Complete {dailyGoalTarget} activities today
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Momentum Streak */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <h3 className="text-sm font-semibold">Momentum Streak</h3>
        </div>

        <div className="mt-3">
          {streakDays >= 7 ? (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
              <Flame className="h-4 w-4" />
              Unstoppable! 7-day streak!
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              You&apos;ve been active {streakDays} days in a row — don&apos;t break the chain!
            </p>
          )}
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className={i < streakDays ? "text-primary" : "text-muted-foreground/30"}>
                {i < streakDays ? <Link2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* XP Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-border bg-card px-5 py-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-semibold">+{toastXp} XP earned!</p>
                <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${xpProgress * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
