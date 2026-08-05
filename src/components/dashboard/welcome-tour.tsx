"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Gamepad2, Trophy, X, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    icon: Brain,
    title: "Welcome to BrainGym!",
    description: "Train your brain in just minutes a day. We'll show you around — it takes under 60 seconds.",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: Gamepad2,
    title: "Play brain games",
    description: "Memory Match, Number Memory, Word Scramble and more. Play a level, earn stars and unlock the next one.",
    gradient: "from-emerald-500 to-teal-600",
    href: "/dashboard/games",
    cta: "Try Games",
  },
  {
    icon: Zap,
    title: "Complete the Daily Challenge",
    description: "Play 3 quick games to discover your brain age for today — it takes about 2 minutes.",
    gradient: "from-amber-500 to-orange-600",
    href: "/dashboard/daily-challenge",
    cta: "Daily Challenge",
  },
  {
    icon: Trophy,
    title: "Track your progress",
    description: "Build daily streaks, earn XP and coins, and watch your brain score grow over time.",
    gradient: "from-pink-500 to-rose-600",
  },
];

const STORAGE_KEY = "braingym_welcome_tour_v1";

export function WelcomeTour() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let dismissed = true;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // localStorage unavailable — skip tour
    }
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome tour"
        >
          <div className="relative p-6">
            <button
              onClick={dismiss}
              aria-label="Skip tour"
              className="absolute right-4 top-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className={`mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${slide.gradient} text-white shadow-lg`}>
              <Icon className="h-8 w-8" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="mt-4 text-center"
              >
                <h2 className="text-xl font-bold">{slide.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{slide.description}</p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={dismiss}
                className="min-h-[44px] rounded-xl px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Skip
              </button>

              {!isLast && !slide.href && (
                <button
                  onClick={() => setIndex((s) => s + 1)}
                  className="flex min-h-[48px] items-center gap-1.5 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              )}

              {slide.href && (
                <a
                  href={slide.href}
                  onClick={dismiss}
                  className={`flex min-h-[48px] items-center gap-1.5 rounded-xl bg-gradient-to-r ${slide.gradient} px-6 text-sm font-bold text-white hover:opacity-90`}
                >
                  {slide.cta} <ChevronRight className="h-4 w-4" />
                </a>
              )}

              {isLast && (
                <button
                  onClick={dismiss}
                  className="flex min-h-[48px] items-center gap-1.5 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Start Training <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
