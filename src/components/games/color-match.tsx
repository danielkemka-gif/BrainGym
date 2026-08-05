"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GameIntro } from "./game-intro";
import { Countdown } from "./countdown";

const COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Yellow", value: "#ca8a04" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#0d9488" },
];

interface Props {
  level: number;
  config: { targetScore: number; targetScore2: number; targetScore3: number; timeLimitMs: number; params: Record<string, number> };
  gradient: string;
  onComplete: (score: number, stars: number, timeLeftMs: number) => void;
  onExit: () => void;
}

type Phase = "intro" | "countdown" | "play" | "result";

export function ColorMatchGame({ level, config, gradient, onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
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

  const scoreRef = useRef(0);
  const timeLeftRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const numColors = config.params.colors || 4;
  const rounds = config.params.rounds || 10;
  const difficulty = level <= 3 ? "easy" : level <= 6 ? "medium" : level <= 8 ? "hard" : level <= 9 ? "expert" : "master";

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  // Timer — reads live values from refs
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearInterval(t);
        setTimerRunning(false);
        endGame(scoreRef.current);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning, config]);

  function generateRound() {
    const available = COLORS.slice(0, Math.min(numColors, COLORS.length));
    const wordIdx = Math.floor(Math.random() * available.length);
    let colorIdx = Math.floor(Math.random() * available.length);
    if (Math.random() > 0.3) {
      while (colorIdx === wordIdx) {
        colorIdx = Math.floor(Math.random() * available.length);
      }
    }

    setWordColor(available[wordIdx]);
    setTextColor(available[colorIdx]);

    const correctAnswer = available[colorIdx].name;
    const distractors = available
      .filter((_, i) => i !== colorIdx)
      .map((c) => c.name)
      .slice(0, Math.min(3, available.length - 1));

    setOptions(shuffleArray([correctAnswer, ...distractors]));
  }

  function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function beginGame() {
    setScore(0);
    scoreRef.current = 0;
    setCorrectCount(0);
    setCurrentRound(0);
    setTotalRounds(rounds);
    const initialTime = Math.floor(config.timeLimitMs / 1000);
    setTimeLeft(initialTime);
    timeLeftRef.current = initialTime;
    setTimerRunning(true);
    setPhase("play");
    generateRound();
  }

  function handleAnswer(selectedColor: string) {
    if (feedback || phase !== "play") return;
    const correct = selectedColor === textColor.name;
    setFeedback(correct ? "correct" : "wrong");

    if (correct) {
      scoreRef.current += 20 + Math.max(0, 10 - Math.floor(timeLeftRef.current / Math.max(1, totalRounds)));
      setScore(scoreRef.current);
      setCorrectCount((c) => c + 1);
    }

    if (transitionRef.current) clearTimeout(transitionRef.current);
    transitionRef.current = setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 >= totalRounds) {
        setTimerRunning(false);
        endGame(scoreRef.current);
      } else {
        setCurrentRound((r) => r + 1);
        generateRound();
      }
    }, 400);
  }

  function endGame(finalScore: number) {
    setTimerRunning(false);
    const stars = finalScore >= config.targetScore3 ? 3 : finalScore >= config.targetScore2 ? 2 : finalScore >= config.targetScore ? 1 : 0;
    onCompleteRef.current(finalScore, stars, timeLeftRef.current * 1000);
  }

  // ─── Intro ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntro
        title="Color Match"
        description="The word says one color, but it's written in another. Pick the real color!"
        steps={[
          "Look at the big word — notice the color it's written in.",
          "Ignore what the word says. Focus on the ink color.",
          "Tap the color name that matches the ink, not the text.",
        ]}
        level={level}
        difficulty={difficulty}
        timeLimitSec={Math.floor(config.timeLimitMs / 1000)}
        goal={`${config.targetScore}+ pts`}
        gradient={gradient}
        onStart={() => setPhase("countdown")}
        onBack={onExit}
      />
    );
  }

  // ─── Countdown ──────────────────────────────────────────────────────
  if (phase === "countdown") {
    return <Countdown label="Get ready to match colors..." onDone={beginGame} />;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* HUD */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setTimerRunning(false);
            onExit();
          }}
          aria-label="Back to level select"
          className="flex min-h-[44px] items-center justify-center rounded-lg p-2 hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            {currentRound + 1}/{totalRounds}
          </div>
          <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${timeLeft <= 5 ? "bg-red-500/10 text-red-500" : "bg-muted"}`}>
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
        <p className="text-sm text-muted-foreground">
          Pick the <strong>real color</strong> of the word below
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="rounded-2xl bg-muted/40 px-6 py-4 shadow-sm"
          >
            <span
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
              style={{ color: textColor.value, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
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
        <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-[280px] sm:max-w-sm">
          {options.map((colorName) => {
            const colorObj = COLORS.find((c) => c.name === colorName);
            return (
              <motion.button
                key={colorName}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAnswer(colorName)}
                className="touch-manipulation min-h-[48px] flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-3 text-sm font-bold text-foreground hover:border-primary/30 transition-all active:scale-[0.97]"
              >
                <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full" style={{ backgroundColor: colorObj?.value }} />
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
