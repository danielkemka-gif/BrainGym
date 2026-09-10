"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Zap,
  Target,
  Dumbbell,
  BookOpen,
  X,
} from "lucide-react";

const STORAGE_KEY_TOUR = "braingym_first_time_tour_seen_v2";

const SCREENS = [
  {
    step: 1,
    badge: "WELCOME TO BRAINGYM",
    title: "Mental Fitness for Real Life",
    description: "BrainGym doesn't train you just to become better at games. We train your mind so you can make better decisions, stay calm under pressure, and perform better in real life.",
    emoji: "🧠",
    color: "from-primary/20 via-card to-violet-600/20",
  },
  {
    step: 2,
    badge: "STEP 1 & 2",
    title: "Face Real Scenarios & Make Decisions",
    description: "Every day, face an authentic situation tailored to your career and life stage. Ask yourself: 'What would I do?' and discover the underlying neuroscience mechanism.",
    emoji: "🎯",
    color: "from-amber-500/20 via-card to-orange-500/20",
  },
  {
    step: 3,
    badge: "STEP 3",
    title: "Train Connected Brain Challenges",
    description: "Immediately sharpen the specific cognitive skill involved — memory recall, executive focus, emotional regulation, or quantitative logic.",
    emoji: "⚡",
    color: "from-blue-500/20 via-card to-indigo-500/20",
  },
  {
    step: 4,
    badge: "STEP 4",
    title: "Take Action in the Real World",
    description: "Execute a simple 3 to 5-minute physical or behavioral task today (active listening, blind handwritten recall, or front-door reset).",
    emoji: "🏃",
    color: "from-emerald-500/20 via-card to-teal-500/20",
  },
  {
    step: 5,
    badge: "STEP 5",
    title: "Reflect in Your Journal & Share Wisdom",
    description: "Write your takeaway in My BrainGym Journal, earn +150 XP, protect your streak, and turn your insight into a beautiful social share card!",
    emoji: "📖",
    color: "from-violet-500/20 via-card to-pink-500/20",
  },
];

export function FirstTimeTourModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY_TOUR);
      if (!seen) {
        setIsOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY_TOUR, "true");
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentScreenIndex + 1 < SCREENS.length) {
      setCurrentScreenIndex((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  if (!isOpen) return null;

  const current = SCREENS[currentScreenIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border-2 border-primary/40 bg-card p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* Progress Stepper Pills */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {SCREENS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentScreenIndex
                    ? "w-6 bg-primary"
                    : idx < currentScreenIndex
                    ? "w-2 bg-primary/60"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleDismiss}
            className="text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>

        {/* Visual Graphic Banner */}
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-gradient-to-br ${current.color} shadow-lg text-4xl`}>
          {current.emoji}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
            {current.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug">
            {current.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleNext}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[48px]"
          >
            <span>
              {currentScreenIndex + 1 === SCREENS.length
                ? "START MY FIRST CHALLENGE ➔"
                : "NEXT ➔"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
