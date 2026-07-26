"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shuffle, Timer } from "lucide-react";

const WORD_POOLS: Record<string, string[]> = {
  easy: ["brain", "smart", "focus", "think", "learn", "study", "memory", "puzzle", "swift", "logic", "sharp", "quick", "speed", "train"],
  medium: ["cognitive", "exercise", "workout", "neuron", "synapse", "analysis", "strategy", "creative", "intuition", "reaction", "sequence", "pattern"],
  hard: ["concentration", "intelligence", "neuroscience", "algorithm", "perception", "reasoning", "comprehension", "metacognition", "mindfulness"],
  expert: ["neuroplasticity", "psychology", "metamemory", "executive", "dyslexia", "aphasia"],
  master: ["electroencephalography", "neuropsychology", "psychophysiology", "neurotransmitter"],
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scramble(word: string): string {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const result = chars.join("");
  return result === word && word.length > 2 ? scramble(word) : result;
}

interface Props {
  level: number;
  config: { targetScore: number; targetScore2: number; targetScore3: number; timeLimitMs: number; params: Record<string, number> };
  gradient: string;
  onComplete: (score: number, stars: number, timeLeftMs: number) => void;
  onExit: () => void;
}

export function WordScrambleGame({ level, config, gradient, onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<"play" | "result">("play");
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const wordCount = config.params.words || 3;
  const timePerWord = config.params.timePerWord || 10;

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setTimerRunning(false);
          const finalStars = score >= config.targetScore3 ? 3 : score >= config.targetScore2 ? 2 : score >= config.targetScore ? 1 : 0;
          onComplete(score, finalStars, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning, score, config, onComplete]);

  function startGame() {
    const difficulty = level <= 3 ? "easy" : level <= 6 ? "medium" : level <= 8 ? "hard" : level <= 9 ? "expert" : "master";
    const pool = WORD_POOLS[difficulty] || WORD_POOLS.easy;
    const selected = shuffleArray(pool).slice(0, wordCount);
    setWords(selected);
    setCurrentWordIndex(0);
    setScrambled(scramble(selected[0]));
    setUserInput("");
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(Math.floor(config.timeLimitMs / 1000));
    setTimerRunning(true);
    setPhase("play");
  }

  function checkWord() {
    const correct = words[currentWordIndex];
    if (userInput.toLowerCase() === correct.toLowerCase()) {
      setFeedback("correct");
      const wordScore = Math.max(10, 30 + (correct.length * 5));
      setScore((s) => s + wordScore);
      setCorrectCount((c) => c + 1);
    } else {
      setFeedback("wrong");
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentWordIndex + 1 >= wordCount) {
        setTimerRunning(false);
        const finalScore = userInput.toLowerCase() === correct.toLowerCase() ? score + 30 : score;
        const finalStars = finalScore >= config.targetScore3 ? 3 : finalScore >= config.targetScore2 ? 2 : finalScore >= config.targetScore ? 1 : 0;
        onComplete(finalScore, finalStars, timeLeft * 1000);
      } else {
        const nextIdx = currentWordIndex + 1;
        setCurrentWordIndex(nextIdx);
        setScrambled(scramble(words[nextIdx]));
        setUserInput("");
      }
    }, 600);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && userInput.length > 0) {
      checkWord();
    }
  }

  // Start on mount
  useEffect(() => { startGame(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "play" && words.length === 0) return null;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* HUD */}
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="rounded-lg p-2 hover:bg-accent min-h-[44px] flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">{currentWordIndex + 1}/{wordCount}</div>
          <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${timeLeft <= 10 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-muted"}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">{score}</div>
        </div>
      </div>

      {/* Word */}
      <div className="flex flex-col items-center gap-6 py-8">
        <p className="text-sm text-muted-foreground">Unscramble this word</p>
        <div className={`flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${gradient} px-4 py-4 sm:px-8 sm:py-5`}>
          {scrambled.split("").map((char, i) => (
            <motion.span
              key={`${currentWordIndex}-${i}`}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              className="text-2xl sm:text-3xl font-bold text-white uppercase"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {feedback && (
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-lg font-bold ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
          >
            {feedback === "correct" ? "Correct!" : "Wrong!"}
          </motion.p>
        )}

        {/* Input */}
        <div className="w-full max-w-xs">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            placeholder="Type your answer..."
            className="h-12 w-full rounded-xl border-2 border-border bg-card px-4 text-center text-lg font-semibold uppercase tracking-widest focus:border-primary/50 focus:outline-none"
          />
        </div>

        <button
          onClick={checkWord}
          disabled={userInput.length === 0}
          className={`rounded-xl bg-gradient-to-r ${gradient} px-8 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 min-h-[48px]`}
        >
          Submit
        </button>

        <p className="text-xs text-muted-foreground">
          {correctCount}/{wordCount} correct
        </p>
      </div>
    </div>
  );
}
