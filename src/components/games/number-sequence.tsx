"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GameIntro } from "./game-intro";
import { Countdown } from "./countdown";

interface Props {
  level: number;
  config: { targetScore: number; targetScore2: number; targetScore3: number; timeLimitMs: number; params: Record<string, number> };
  gradient: string;
  onComplete: (score: number, stars: number, timeLeftMs: number) => void;
  onExit: () => void;
}

type Phase = "intro" | "countdown" | "show" | "input" | "result";

export function NumberSequenceGame({ level, config, gradient, onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const scoreRef = useRef(0);
  const timeLeftRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const revealTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLen = config.params.startLen || 3;
  const maxLen = config.params.maxLen || 6;
  const totalRounds = Math.min(10, maxLen - startLen + 3);
  const difficulty = level <= 3 ? "easy" : level <= 6 ? "medium" : level <= 8 ? "hard" : level <= 9 ? "expert" : "master";

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearInterval(revealTimerRef.current);
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  // Game timer — reads live values from refs
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearInterval(t);
        setTimerRunning(false);
        const finalStars =
          scoreRef.current >= config.targetScore3 ? 3 : scoreRef.current >= config.targetScore2 ? 2 : scoreRef.current >= config.targetScore ? 1 : 0;
        onCompleteRef.current(scoreRef.current, finalStars, 0);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning, config]);

  function clearTransitions() {
    if (revealTimerRef.current) {
      clearInterval(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    if (transitionRef.current) {
      clearTimeout(transitionRef.current);
      transitionRef.current = null;
    }
  }

  function startRound(round: number) {
    clearTransitions();
    const len = Math.min(startLen + round, maxLen);
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
    setSequence(seq);
    setUserInput([]);
    setFeedback(null);
    setPhase("show");
    setShowingIndex(0);

    let idx = 0;
    revealTimerRef.current = setInterval(() => {
      idx++;
      if (idx >= seq.length) {
        clearInterval(revealTimerRef.current!);
        revealTimerRef.current = null;
        transitionRef.current = setTimeout(() => {
          setShowingIndex(-1);
          setPhase("input");
        }, 500);
      } else {
        setShowingIndex(idx);
      }
    }, 800);
  }

  function beginGame() {
    setScore(0);
    scoreRef.current = 0;
    setCurrentRound(0);
    const initialTime = Math.floor(config.timeLimitMs / 1000);
    setTimeLeft(initialTime);
    timeLeftRef.current = initialTime;
    setTimerRunning(true);
    setPhase("show");
    startRound(0);
  }

  function finish(finalScore: number, finalStars: number, finalTimeLeftMs: number) {
    setTimerRunning(false);
    clearTransitions();
    onCompleteRef.current(finalScore, finalStars, finalTimeLeftMs);
  }

  function handleNumberClick(num: number) {
    if (phase !== "input") return;
    const newInput = [...userInput, num];
    setUserInput(newInput);

    const expected = sequence[newInput.length - 1];
    if (num !== expected) {
      setFeedback("wrong");
      transitionRef.current = setTimeout(() => {
        setFeedback(null);
        const roundScore = Math.max(0, scoreRef.current + (currentRound + 1) * 10);
        if (currentRound + 1 >= totalRounds || roundScore >= config.targetScore3) {
          const finalStars = roundScore >= config.targetScore3 ? 3 : roundScore >= config.targetScore2 ? 2 : roundScore >= config.targetScore ? 1 : 0;
          finish(roundScore, finalStars, timeLeftRef.current * 1000);
        } else {
          const next = currentRound + 1;
          setCurrentRound(next);
          startRound(next);
        }
      }, 600);
      return;
    }

    if (newInput.length === sequence.length) {
      setFeedback("correct");
      const roundScore = scoreRef.current + (currentRound + 1) * 20;
      scoreRef.current = roundScore;
      setScore(roundScore);
      transitionRef.current = setTimeout(() => {
        setFeedback(null);
        if (currentRound + 1 >= totalRounds || roundScore >= config.targetScore3) {
          const finalStars = roundScore >= config.targetScore3 ? 3 : roundScore >= config.targetScore2 ? 2 : roundScore >= config.targetScore ? 1 : 0;
          finish(roundScore, finalStars, timeLeftRef.current * 1000);
        } else {
          const next = currentRound + 1;
          setCurrentRound(next);
          startRound(next);
        }
      }, 600);
    }
  }

  // ─── Intro ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntro
        title="Number Memory"
        description="Memorize the digits shown one by one, then repeat them back in order."
        steps={[
          "Watch carefully as digits light up, one at a time.",
          "When the pad appears, tap the digits in the exact same order.",
          "Each correct round earns more points — beat the target for stars!",
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
    return <Countdown label="Get ready to memorize..." onDone={beginGame} />;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* HUD */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            clearTransitions();
            setTimerRunning(false);
            onExit();
          }}
          aria-label="Back to level select"
          className="flex min-h-[44px] items-center justify-center rounded-lg p-2 hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">R{currentRound + 1}/{totalRounds}</div>
          <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${timeLeft <= 10 ? "bg-red-500/10 text-red-500" : "bg-muted"}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">{score}</div>
        </div>
      </div>

      {/* Show phase: display the sequence */}
      {phase === "show" && (
        <div className="flex flex-col items-center gap-6 py-8">
          <p className="text-sm text-muted-foreground">Memorize the sequence</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {sequence.map((num, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{
                  scale: i === showingIndex ? 1.2 : 0.8,
                  opacity: i === showingIndex ? 1 : 0.3,
                }}
                className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl text-lg sm:text-xl font-bold ${
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
          <p className="text-sm font-medium text-muted-foreground">
            {feedback === "correct" ? "Correct!" : feedback === "wrong" ? "Wrong!" : `Enter the sequence (${sequence.length} numbers)`}
          </p>

          {/* User input display */}
          <div className="flex flex-wrap gap-2 min-h-[48px] sm:min-h-[56px] items-center justify-center">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl text-base sm:text-lg font-bold ${
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
          <div className="grid grid-cols-3 gap-2 w-full max-w-[180px] sm:max-w-[240px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNumberClick(num)}
                className="touch-manipulation flex h-12 sm:h-14 items-center justify-center rounded-xl bg-card border-2 border-border text-base sm:text-lg md:text-xl font-bold hover:border-primary/30 hover:bg-accent transition-all active:scale-[0.97]"
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
