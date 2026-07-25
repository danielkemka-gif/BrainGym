"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Snowflake, Trophy, Zap } from "lucide-react";
import { Confetti } from "@/components/ui/confetti";

const MILESTONES = [
  { days: 7, title: "Week Warrior!", xp: 200, coins: 50, freeze: true, message: "7 days straight — you earned a streak freeze!" },
  { days: 14, title: "Two-Week Titan!", xp: 500, coins: 100, freeze: true, message: "14 days — your discipline is building!" },
  { days: 30, title: "Monthly Master!", xp: 1000, coins: 250, freeze: true, message: "30 days — your brain is transforming!" },
  { days: 60, title: "Unstoppable Force!", xp: 2000, coins: 500, freeze: true, message: "60 days — most people never reach this!" },
  { days: 90, title: "Brain Legend!", xp: 5000, coins: 1000, freeze: true, message: "90 days — you're in the top 1% of brain trainers!" },
];

interface StreakMilestoneModalProps {
  show: boolean;
  streakDays: number;
  onDismiss: () => void;
}

export function getStreakMilestone(streakDays: number) {
  return MILESTONES.find((m) => m.days === streakDays) ?? null;
}

export function StreakMilestoneModal({ show, streakDays, onDismiss }: StreakMilestoneModalProps) {
  const milestone = MILESTONES.find((m) => m.days === streakDays);

  const dismiss = useCallback(() => onDismiss(), [onDismiss]);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(dismiss, 8000);
    return () => clearTimeout(timer);
  }, [show, dismiss]);

  if (!milestone) return null;

  return (
    <>
      <Confetti active={show} duration={6000} />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow */}
              <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />

              {/* Fire icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-xl shadow-orange-500/30"
              >
                <Flame className="h-10 w-10 text-white" />
              </motion.div>

              {/* Title */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs font-semibold uppercase tracking-wider text-orange-400"
              >
                Streak Milestone
              </motion.p>

              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-2xl font-bold"
              >
                {milestone.title}
              </motion.h2>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-sm text-muted-foreground"
              >
                {milestone.message}
              </motion.p>

              {/* Streak number */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10, delay: 0.6 }}
                className="my-6"
              >
                <span className="text-6xl font-black tabular-nums text-orange-500">{streakDays}</span>
                <span className="ml-2 text-lg font-medium text-muted-foreground">days</span>
              </motion.div>

              {/* Rewards */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1.5">
                  <Trophy className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs font-bold text-violet-400">+{milestone.xp} XP</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-amber-500">+{milestone.coins}</span>
                </div>
                {milestone.freeze && (
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5">
                    <Snowflake className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs font-bold text-blue-400">+1 Freeze</span>
                  </div>
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-6 text-xs text-muted-foreground"
              >
                Tap anywhere to dismiss
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
