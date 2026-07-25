"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Lock, Star, Trophy, Zap, Timer } from "lucide-react";

interface Props {
  level: number;
  config: { targetScore: number; targetScore2: number; targetScore3: number; timeLimitMs: number; params: Record<string, number> };
  gradient: string;
  onComplete: (score: number, stars: number, timeLeftMs: number) => void;
  onExit: () => void;
}

export function NumberSequenceGame({ level, config, gradient, onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<"show" | "input" | "result">("show");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const startLen = config.params.startLen || 3;
  const maxLen = config.params.maxLen || 6;
  const totalRounds = Math.min(10, maxLen - startLen + 3);

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setTimerRunning(false);
          onComplete(score, 0, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning, score, onComplete]);

  function startRound(round: number) {
    const len = Math.min(startLen + round, maxLen);
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
    setSequence(seq);
    setUserInput([]);
    setFeedback(null);
    setPhase("show");
    setShowingIndex(0);

    // Show sequence one by one
    let idx = 0;
    const showInterval = setInterval(() => {
      idx++;
      if (idx >= seq.length) {
        clearInterval(showInterval);
        setTimeout(() => {
          setShowingIndex(-1);
          setPhase("input");
        }, 500);
      } else {
        setShowingIndex(idx);
      }
    }, 800);
  }

  function startGame() {
    setScore(0);
    setCurrentRound(0);
    setTimeLeft(Math.floor(config.timeLimitMs / 1000));
    setTimerRunning(true);
    startRound(0);
  }

  const handleNumberClick = useCallback((num: number) => {
    if (phase !== "input") return;
    const newInput = [...userInput, num];
    setUserInput(newInput);

    const expected = sequence[newInput.length - 1];
    if (num !== expected) {
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        const roundScore = Math.max(0, score + (currentRound + 1) * 10);
        if (currentRound + 1 >= totalRounds || roundScore >= config.targetScore3) {
          const finalStars = roundScore >= config.targetScore3 ? 3 : roundScore >= config.targetScore2 ? 2 : roundScore >= config.targetScore ? 1 : 0;
          setTimerRunning(false);
          onComplete(roundScore, finalStars, timeLeft * 1000);
        } else {
          setCurrentRound((r) => r + 1);
          startRound(currentRound + 1);
        }
      }, 600);
      return;
    }

    if (newInput.length === sequence.length) {
      setFeedback("correct");
      const roundScore = score + (currentRound + 1) * 20;
      setScore(roundScore);
      setTimeout(() => {
        setFeedback(null);
        if (currentRound + 1 >= totalRounds || roundScore >= config.targetScore3) {
          const finalStars = roundScore >= config.targetScore3 ? 3 : roundScore >= config.targetScore2 ? 2 : roundScore >= config.targetScore ? 1 : 0;
          setTimerRunning(false);
          onComplete(roundScore, finalStars, timeLeft * 1000);
        } else {
          setCurrentRound((r) => r + 1);
          startRound(currentRound + 1);
        }
      }, 600);
    }
  }, [phase, userInput, sequence, score, currentRound, totalRounds, config, timeLeft, onComplete]);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* HUD */}
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="rounded-lg p-2 hover:bg-accent min-h-[44px] flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">R{currentRound + 1}/{totalRounds}</div>
          <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${timeLeft <= 10 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-muted"}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">{score}</div>
        </div>
      </div>

      {/* Show phase: display the sequence */}
      {phase === "show" && (
        <div className="flex flex-col items-center gap-6 py-8">
          <p className="text-sm text-muted-foreground">Memorize the sequence</p>
          <div className="flex gap-2">
            {sequence.map((num, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{
                  scale: i === showingIndex ? 1.2 : 0.8,
                  opacity: i === showingIndex ? 1 : 0.3,
                }}
                className={`flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold ${
                  i === showingIndex ? `bg-gradient-to-br ${gradient} text-white shadow-lg` : "bg-muted text-muted-foreground"
                }`}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Input phase: user enters sequence */}
      {phase === "input" && (
        <div className="flex flex-col items-center gap-6 py-4">
          <p className="text-sm text-muted-foreground">
            {feedback === "correct" ? "Correct!" : feedback === "wrong" ? "Wrong!" : `Enter the sequence (${sequence.length} numbers)`}
          </p>

          {/* User input display */}
          <div className="flex gap-2 min-h-[56px] items-center">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${
                  i < userInput.length
                    ? userInput[i] === sequence[i]
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < userInput.length ? userInput[i] : "?"}
              </div>
            ))}
          </div>

          {/* Number pad */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNumberClick(num)}
                className="flex h-14 items-center justify-center rounded-xl bg-card border-2 border-border text-xl font-bold hover:border-primary/30 hover:bg-accent transition-all"
              >
                {num}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
