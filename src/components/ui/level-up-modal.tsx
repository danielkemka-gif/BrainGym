"use client";

import { useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LEVELS } from "@/lib/constants";

interface LevelUpModalProps {
  show: boolean;
  fromLevel: number;
  toLevel: number;
  onDismiss: () => void;
}

const CONFETTI_EMOJIS = ["🎉", "⭐", "🧠", "🏆", "✨", "🔥", "💫", "🎊", "💎", "⚡", "🌟", "🎯"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function LevelUpModal({ show, fromLevel, toLevel, onDismiss }: LevelUpModalProps) {
  const fromTitle = LEVELS.find((l) => l.level === fromLevel)?.title ?? "Unknown";
  const toTitle = LEVELS.find((l) => l.level === toLevel)?.title ?? "Unknown";

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        x: randomBetween(-40, 40),
        y: randomBetween(-60, -20),
        rotate: randomBetween(-180, 180),
        delay: randomBetween(0, 0.8),
        size: randomBetween(14, 24),
      })),
    [fromLevel, toLevel]
  );

  const dismiss = useCallback(() => onDismiss(), [onDismiss]);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(dismiss, 5000);
    return () => clearTimeout(timer);
  }, [show, dismiss]);

  return (
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
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="relative mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ x: "50%", y: "50%", opacity: 1, rotate: 0, scale: 1 }}
                  animate={{
                    x: `${50 + p.x}%`,
                    y: `${50 + p.y}%`,
                    opacity: [1, 1, 0],
                    rotate: p.rotate,
                    scale: [1, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: p.delay,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  }}
                  className="absolute top-0 left-0"
                  style={{ fontSize: p.size }}
                >
                  {p.emoji}
                </motion.span>
              ))}
            </div>

            {/* Level Up text */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-lg font-bold text-transparent"
            >
              Level Up!
            </motion.p>

            {/* Level number with glow */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.3 }}
              className="relative my-4 inline-flex items-center justify-center"
            >
              <span
                className="absolute h-24 w-24 rounded-full bg-amber-400/20"
                style={{ boxShadow: "0 0 40px 10px rgba(251, 191, 36, 0.3)" }}
              />
              <span className="relative text-5xl font-black text-amber-400">{toLevel}</span>
            </motion.div>

            {/* Transition */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 flex items-center justify-center gap-3"
            >
              <span className="text-sm text-muted-foreground">{fromTitle}</span>
              <span className="text-lg text-amber-400">→</span>
              <span className="text-sm font-semibold text-amber-400">{toTitle}</span>
            </motion.div>

            {/* Dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-6 text-xs text-muted-foreground"
            >
              Tap anywhere to dismiss
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
