"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GameIntro } from "./game-intro";
import { Countdown } from "./countdown";

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  hit: boolean;
}

interface Props {
  level: number;
  config: { targetScore: number; targetScore2: number; targetScore3: number; timeLimitMs: number; params: Record<string, number> };
  gradient: string;
  onComplete: (score: number, stars: number, timeLeftMs: number) => void;
  onExit: () => void;
}

type Phase = "intro" | "countdown" | "play" | "result";

export function ReactionSpeedGame({ level, config, gradient, onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const scoreRef = useRef(0);
  const reactionTimesRef = useRef<number[]>([]);
  const timeLeftRef = useRef(0);
  const nextIdRef = useRef(0);
  const targetTimestamps = useRef<Map<number, number>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  const totalTargets = config.params.targets || 10;
  const targetSize = Math.max(44, config.params.size || 60);
  const difficulty = level <= 3 ? "easy" : level <= 6 ? "medium" : level <= 8 ? "hard" : level <= 9 ? "expert" : "master";

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Game timer — reads live values from refs so the end score is always accurate
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearInterval(t);
        setTimerRunning(false);
        finishGame();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning, config]);

  function spawnTarget() {
    const container = containerRef.current;
    if (!container) return;

    const id = nextIdRef.current;
    nextIdRef.current += 1;
    targetTimestamps.current.set(id, Date.now());

    setTargets((prev) => [
      ...prev.filter((t) => !t.hit),
      {
        id,
        x: Math.random() * Math.max(10, container.clientWidth - targetSize - 20) + 10,
        y: Math.random() * Math.max(10, container.clientHeight - targetSize - 20) + 10,
        size: targetSize,
        hit: false,
      },
    ]);
  }

  // Spawn the first target as soon as play starts
  useEffect(() => {
    if (phase !== "play" || targets.length > 0) return;
    const t = setTimeout(spawnTarget, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function beginGame() {
    setPhase("play");
    const initialTime = Math.floor(config.timeLimitMs / 1000);
    setTimeLeft(initialTime);
    timeLeftRef.current = initialTime;
    setTimerRunning(true);
  }

  const handleTargetClick = useCallback((id: number) => {
    const spawnTime = targetTimestamps.current.get(id);
    if (spawnTime) {
      reactionTimesRef.current = [...reactionTimesRef.current, Date.now() - spawnTime];
      setReactionTimes(reactionTimesRef.current);
    }
    targetTimestamps.current.delete(id);

    setTargets((prev) => prev.filter((t) => t.id !== id));
    setHitCount((c) => c + 1);
    scoreRef.current += 50;
    setScore(scoreRef.current);

    setTimeout(() => spawnTarget(), 200);
  }, []);

  function handleMiss() {
    setMissCount((c) => c + 1);
    scoreRef.current = Math.max(0, scoreRef.current - 10);
    setScore(scoreRef.current);
  }

  function finishGame() {
    setTimerRunning(false);
    const finalScore = scoreRef.current;
    const avgReaction =
      reactionTimesRef.current.length > 0
        ? reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
        : 0;
    const speedBonus = avgReaction < 300 ? 50 : avgReaction < 500 ? 25 : 0;
    const totalScore = finalScore + speedBonus;
    const totalStars = totalScore >= config.targetScore3 ? 3 : totalScore >= config.targetScore2 ? 2 : totalScore >= config.targetScore ? 1 : 0;
    onCompleteRef.current(totalScore, totalStars, timeLeftRef.current * 1000);
  }

  // ─── Intro ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntro
        title="Reaction Speed"
        description="Tap the targets as fast as you can before time runs out."
        steps={[
          "Wait for your cue, then tap the glowing target.",
          "Hit targets quickly — fast taps earn a speed bonus.",
          "Don't tap empty space: every miss costs points.",
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
    return <Countdown label="Get ready to tap..." onDone={beginGame} />;
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
            {hitCount}/{totalTargets} hit
          </div>
          <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${timeLeft <= 5 ? "bg-red-500/10 text-red-500" : "bg-muted"}`}>
            {timeLeft}s
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">{score}</div>
        </div>
      </div>

      {/* Game area */}
      <div
        ref={containerRef}
        onClick={(e) => {
          if (e.target === containerRef.current) handleMiss();
        }}
        className={`relative h-[400px] w-full touch-manipulation overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} cursor-crosshair select-none`}
      >
        <AnimatePresence>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              onClick={() => handleTargetClick(target.id)}
              aria-label="Tap target"
              className="absolute flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white"
              style={{
                left: target.x,
                top: target.y,
                width: target.size,
                height: target.size,
                minWidth: 44,
                minHeight: 44,
              }}
            >
              <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${gradient}`} />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span>Misses: {missCount}</span>
        {reactionTimes.length > 0 && (
          <span>Avg: {Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)}ms</span>
        )}
      </div>
    </div>
  );
}
