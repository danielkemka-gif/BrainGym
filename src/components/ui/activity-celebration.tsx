"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Coins, Star } from "lucide-react";

interface ActivityCelebrationProps {
  show: boolean;
  xp: number;
  coins: number;
  title: string;
  onDismiss: () => void;
}

export function ActivityCelebration({ show, xp, coins, title, onDismiss }: ActivityCelebrationProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.5 + Math.random() * 1,
        size: 8 + Math.random() * 12,
        color: ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6", "#f97316"][i % 6],
      })),
    []
  );

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onDismiss}
        >
          {/* Floating particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: `${p.x}%`, y: "110%", opacity: 1, scale: 0 }}
                animate={{ y: "-10%", opacity: [1, 1, 0], scale: [0, 1.5, 0.5] }}
                transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{ width: p.size, height: p.size, backgroundColor: p.color }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow */}
            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />

            {/* Check icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
              className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl shadow-green-500/30"
            >
              <CheckCircle2 className="h-10 w-10 text-white" />
            </motion.div>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-semibold uppercase tracking-wider text-green-400"
            >
              Activity Complete!
            </motion.p>

            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 line-clamp-2 text-lg font-bold"
            >
              {title}
            </motion.h2>

            {/* Rewards */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center justify-center gap-4"
            >
              <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-4 py-2">
                <Zap className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-bold text-violet-400">+{xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-4 py-2">
                <Coins className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-bold text-amber-500">+{coins}</span>
              </div>
            </motion.div>

            {/* Star rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 flex items-center justify-center gap-1"
            >
              {[1, 2, 3].map((star) => (
                <motion.div
                  key={star}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 1 + star * 0.15 }}
                >
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-4 text-xs text-muted-foreground"
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
