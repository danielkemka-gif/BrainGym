"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Yellow", value: "#eab308" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
];

interface Props {
  level: number;
  config: { targetScore: number; targetScore2: number; targetScore3: number; timeLimitMs: number; params: Record<string, number> };
  gradient: string;
  onComplete: (score: number, stars: number, timeLeftMs: number) => void;
  onExit: () => void;
}

export function ColorMatchGame({ level, config, gradient, onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<"play" | "result">("play");
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [wordColor, setWordColor] = useState(COLORS[0]);
  const [textColor, setTextColor] = useState(COLORS[1]);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const numColors = config.params.colors || 4;
  const rounds = config.params.rounds || 10;

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setTimerRunning(false);
          endGame(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning, score]); // eslint-disable-line react-hooks/exhaustive-deps

  function generateRound() {
    const available = COLORS.slice(0, Math.min(numColors, COLORS.length));
    const wordIdx = Math.floor(Math.random() * available.length);
    let colorIdx = Math.floor(Math.random() * available.length);
    // Ensure word != color at least sometimes for challenge
    if (Math.random() > 0.3) {
      while (colorIdx === wordIdx) {
        colorIdx = Math.floor(Math.random() * available.length);
      }
    }

    setWordColor(available[wordIdx]);
    setTextColor(available[colorIdx]);

    // Build options: always include the correct answer (actual color)
    const correctAnswer = available[colorIdx].name;
    const distractors = available
      .filter((_, i) => i !== colorIdx)
      .map((c) => c.name)
      .slice(0, Math.min(3, available.length - 1));

    const allOptions = shuffleArray([correctAnswer, ...distractors]);
    setOptions(allOptions);
  }

  function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startGame() {
    setScore(0);
    setCorrectCount(0);
    setCurrentRound(0);
    setTotalRounds(rounds);
    setTimeLeft(Math.floor(config.timeLimitMs / 1000));
    setTimerRunning(true);
    generateRound();
  }

  const handleAnswer = useCallback((selectedColor: string) => {
    const correct = selectedColor === textColor.name;
    setFeedback(correct ? "correct" : "wrong");

    if (correct) {
      setScore((s) => s + 20 + Math.max(0, 10 - Math.floor(timeLeft / totalRounds)));
      setCorrectCount((c) => c + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 >= totalRounds) {
        setTimerRunning(false);
        const finalScore = correct ? score + 20 : score;
        endGame(finalScore);
      } else {
        setCurrentRound((r) => r + 1);
        generateRound();
      }
    }, 400);
  }, [textColor, timeLeft, totalRounds, currentRound, score]); // eslint-disable-line react-hooks/exhaustive-deps

  function endGame(finalScore: number) {
    setTimerRunning(false);
    const stars = finalScore >= config.targetScore3 ? 3 : finalScore >= config.targetScore2 ? 2 : finalScore >= config.targetScore ? 1 : 0;
    onComplete(finalScore, stars, timeLeft * 1000);
  }

  // Start on mount
  useEffect(() => { startGame(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* HUD */}
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="rounded-lg p-2 hover:bg-accent min-h-[44px] flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            {currentRound + 1}/{totalRounds}
          </div>
          <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${timeLeft <= 5 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-muted"}`}>
            {timeLeft}s
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">{score}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          animate={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Stroop challenge */}
      <div className="flex flex-col items-center gap-8 py-8">
        <p className="text-sm text-muted-foreground">Pick the <strong>real color</strong> of the word below</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="text-center"
          >
            <span
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
              style={{ color: textColor.value }}
            >
              {wordColor.name}
            </span>
          </motion.div>
        </AnimatePresence>

        {feedback && (
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-lg font-bold ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
          >
            {feedback === "correct" ? "Correct!" : "Wrong!"}
          </motion.p>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {options.map((colorName) => {
            const colorObj = COLORS.find((c) => c.name === colorName);
            return (
              <motion.button
                key={colorName}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAnswer(colorName)}
                className="flex h-14 items-center justify-center rounded-xl border-2 border-border bg-card text-sm font-bold hover:border-primary/30 transition-all"
                style={{ color: colorObj?.value }}
              >
                {colorName}
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          {correctCount}/{currentRound + 1} correct
        </p>
      </div>
    </div>
  );
}
