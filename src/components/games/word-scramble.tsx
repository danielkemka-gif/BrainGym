"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GameIntro } from "./game-intro";
import { Countdown } from "./countdown";

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

type Phase = "intro" | "countdown" | "play" | "result";

export function WordScrambleGame({ level, config, gradient, onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const scoreRef = useRef(0);
  const timeLeftRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wordCount = config.params.words || 3;
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
        const finalStars = scoreRef.current >= config.targetScore3 ? 3 : scoreRef.current >= config.targetScore2 ? 2 : scoreRef.current >= config.targetScore ? 1 : 0;
        onCompleteRef.current(scoreRef.current, finalStars, 0);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning, config]);

  function beginGame() {
    const pool = WORD_POOLS[difficulty] || WORD_POOLS.easy;
    const selected = shuffleArray(pool).slice(0, wordCount);
    setWords(selected);
    setCurrentWordIndex(0);
    setScrambled(scramble(selected[0]));
    setUserInput("");
    setScore(0);
    scoreRef.current = 0;
    setCorrectCount(0);
    const initialTime = Math.floor(config.timeLimitMs / 1000);
    setTimeLeft(initialTime);
    timeLeftRef.current = initialTime;
    setTimerRunning(true);
    setPhase("play");
  }

  function checkWord() {
    if (feedback || phase !== "play") return;
    const correct = words[currentWordIndex];
    const isCorrect = userInput.trim().toLowerCase() === correct.toLowerCase();

    if (isCorrect) {
      const wordScore = Math.max(10, 30 + correct.length * 5);
      scoreRef.current += wordScore;
      setScore(scoreRef.current);
      setCorrectCount((c) => c + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }

    if (transitionRef.current) clearTimeout(transitionRef.current);
    transitionRef.current = setTimeout(() => {
      setFeedback(null);
      if (currentWordIndex + 1 >= wordCount) {
        setTimerRunning(false);
        const finalStars = scoreRef.current >= config.targetScore3 ? 3 : scoreRef.current >= config.targetScore2 ? 2 : scoreRef.current >= config.targetScore ? 1 : 0;
        onCompleteRef.current(scoreRef.current, finalStars, timeLeftRef.current * 1000);
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

  // ─── Intro ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntro
        title="Word Scramble"
        description="Unscramble the letters to form the hidden word as fast as you can."
        steps={[
          "Study the scrambled letters on screen.",
          "Type the correct word into the box.",
          "Press Submit or Enter — longer words earn more points!",
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
    return <Countdown label="Get ready to unscramble..." onDone={beginGame} />;
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
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">{currentWordIndex + 1}/{wordCount}</div>
          <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${timeLeft <= 10 ? "bg-red-500/10 text-red-500" : "bg-muted"}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">{score}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all`}
          style={{ width: `${((currentWordIndex + (feedback === "correct" ? 1 : 0)) / wordCount) * 100}%` }}
        />
      </div>

      {/* Word */}
      <div className="flex flex-col items-center gap-6 py-8">
        <p className="text-sm text-muted-foreground">Unscramble this word</p>
        <div className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-2xl bg-gradient-to-br ${gradient} px-4 py-4 sm:px-8 sm:py-5`}>
          {scrambled.split("").map((char, i) => (
            <motion.span
              key={`${currentWordIndex}-${i}`}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase"
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
          <label htmlFor="word-answer" className="sr-only">
            Type your answer
          </label>
          <input
            id="word-answer"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            placeholder="Type your answer..."
            className="h-12 w-full rounded-xl border-2 border-border bg-card px-4 text-center text-lg font-semibold uppercase tracking-widest focus:border-primary/50 focus:outline-none"
          />
        </div>

        <button
          onClick={checkWord}
          disabled={userInput.length === 0 || !!feedback}
          className={`rounded-xl bg-gradient-to-r ${gradient} px-8 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 min-h-[48px] touch-manipulation`}
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
