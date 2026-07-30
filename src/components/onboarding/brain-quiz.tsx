"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import {
  BrainCircuit,
  ScanEye,
  Orbit,
  GraduationCap,
  HeartPulse,
  WandSparkles,
  Handshake,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORY_SLUGS = [
  "memory",
  "focus",
  "thinking",
  "learning",
  "health",
  "creativity",
  "emotional-intelligence",
] as const;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  memory: BrainCircuit,
  focus: ScanEye,
  thinking: Orbit,
  learning: GraduationCap,
  health: HeartPulse,
  creativity: WandSparkles,
  "emotional-intelligence": Handshake,
};

const QUIZ_QUESTIONS = [
  {
    category: "memory",
    question: "Which number was shown 3 seconds ago?",
    subtitle: "Memory recall test",
    options: ["42", "17", "85", "23"],
    correct: 2,
    tip: "Your working memory capacity",
  },
  {
    category: "focus",
    question: "How many blue items did you see?",
    subtitle: "Selective attention test",
    options: ["2", "4", "6", "3"],
    correct: 1,
    tip: "Your ability to filter distractions",
  },
  {
    category: "thinking",
    question: "What comes next: 2, 6, 18, ?",
    subtitle: "Pattern recognition test",
    options: ["36", "54", "48", "72"],
    correct: 1,
    tip: "Your logical reasoning speed",
  },
  {
    category: "learning",
    question: "Which word is most similar to 'cogent'?",
    subtitle: "Vocabulary & learning ability",
    options: ["Vague", "Convincing", "Distant", "Soft"],
    correct: 1,
    tip: "Your learning & retention ability",
  },
  {
    category: "health",
    question: "How would you rate your sleep quality?",
    subtitle: "Mental wellness check-in",
    options: ["Poor", "Average", "Good", "Excellent"],
    correct: 2,
    tip: "Sleep impacts cognitive performance",
  },
  {
    category: "creativity",
    question: "How many uses can you think of for a paperclip?",
    subtitle: "Divergent thinking test",
    options: ["1-3", "4-7", "8-12", "13+"],
    correct: 2,
    tip: "Your creative thinking fluency",
  },
  {
    category: "emotional-intelligence",
    question: "You receive criticism. First instinct?",
    subtitle: "Emotional awareness check",
    options: ["Defend", "Reflect", "Ignore", "Analyze"],
    correct: 1,
    tip: "Your emotional processing style",
  },
];

function scoreForAnswer(optionIndex: number, correctIndex: number): number {
  const diff = Math.abs(optionIndex - correctIndex);
  if (diff === 0) return 85;
  if (diff === 1) return 65;
  if (diff === 2) return 45;
  return 30;
}

export interface QuizResult {
  scores: Record<string, number>;
  overallLevel: "beginner" | "intermediate" | "advanced";
}

export function BrainQuiz({ onComplete }: { onComplete: (result: QuizResult) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const question = QUIZ_QUESTIONS[currentQ];
  const progress = ((currentQ) / QUIZ_QUESTIONS.length) * 100;

  function handleSelect(optionIdx: number) {
    if (revealed) return;
    setSelected(optionIdx);
    setRevealed(true);

    setTimeout(() => {
      const newAnswers = [...answers, optionIdx];
      setAnswers(newAnswers);

      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
        setRevealed(false);
      } else {
        // Calculate results
        const scores: Record<string, number> = {};
        let totalScore = 0;
        for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
          const q = QUIZ_QUESTIONS[i];
          const answerIdx = newAnswers[i];
          const score = scoreForAnswer(answerIdx, q.correct);
          scores[q.category] = score;
          totalScore += score;
        }

        const avg = totalScore / QUIZ_QUESTIONS.length;
        const level: "beginner" | "intermediate" | "advanced" =
          avg >= 70 ? "advanced" : avg >= 45 ? "intermediate" : "beginner";

        setShowResult(true);
        setTimeout(() => onComplete({ scores, overallLevel: level }), 2500);
      }
    }, 1200);
  }

  if (showResult) {
    const totalScore = QUIZ_QUESTIONS.reduce((sum, q, i) => {
      return sum + scoreForAnswer(answers[i], q.correct);
    }, 0);
    const avg = Math.round(totalScore / QUIZ_QUESTIONS.length);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4 sm:space-y-6 py-6 sm:py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30"
        >
          <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Assessment Complete</p>
          <p className="mt-2 text-2xl sm:text-3xl font-black">{avg}<span className="text-base sm:text-lg text-muted-foreground">/100</span></p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
          {QUIZ_QUESTIONS.map((q, i) => {
            const score = scoreForAnswer(answers[i], q.correct);
            const cat = CATEGORIES.find((c) => c.slug === q.category);
            return (
              <div key={q.category} className="rounded-lg bg-muted/50 px-2 sm:px-3 py-1 text-[11px] sm:text-xs">
                <span className="font-medium">{cat?.label}</span>
                <span className="ml-1 text-muted-foreground">{score}</span>
              </div>
            );
          })}
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-xs sm:text-sm text-muted-foreground">
          Setting up your personalized plan...
        </motion.p>
      </motion.div>
    );
  }

  const cat = CATEGORIES.find((c) => c.slug === question.category);
  const CatIcon = CATEGORY_ICONS[question.category];

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {/* Category indicator */}
          <div className="flex items-center gap-2">
            {CatIcon && <CatIcon className="h-4 w-4" style={{ color: cat?.color }} />}
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: cat?.color }}>
              {question.subtitle}
            </span>
          </div>

          {/* Question */}
          <h3 className="text-lg sm:text-xl font-bold text-balance">{question.question}</h3>

          {/* Options */}
          <div className="space-y-2 sm:space-y-2.5">
            {question.options.map((opt, idx) => {
              const isCorrect = idx === question.correct;
              const isSelected = idx === selected;
              const isRevealed = revealed;

              let optionStyle = "border-border bg-card hover:border-primary/50 hover:bg-primary/5";
              if (isRevealed && isCorrect) {
                optionStyle = "border-green-500 bg-green-500/10 text-green-600";
              } else if (isRevealed && isSelected && !isCorrect) {
                optionStyle = "border-red-500 bg-red-500/10 text-red-500";
              } else if (isSelected) {
                optionStyle = "border-primary bg-primary/10";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={revealed}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 sm:p-4 text-left text-sm font-medium transition-all touch-manipulation active:scale-[0.98] ${optionStyle}`}
                >
                  <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {isRevealed && isCorrect && (
                    <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-green-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tip */}
          {revealed && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground"
            >
              <Sparkles className="mr-1 inline h-3 w-3 text-amber-400" />
              {question.tip}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
