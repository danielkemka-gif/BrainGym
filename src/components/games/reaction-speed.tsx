"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

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

export function ReactionSpeedGame({ level, config, gradient, onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<"countdown" | "play" | "result">("countdown");
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [nextTargetId, setNextTargetId] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const targetTimestamps = useRef<Map<number, number>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const totalTargets = config.params.targets || 10;
  const targetSize = config.params.size || 60;

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    const t = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setPhase("play");
          setTimeLeft(Math.floor(config.timeLimitMs / 1000));
          setTimerRunning(true);
          spawnTarget();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, config.timeLimitMs]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setTimerRunning(false);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  function spawnTarget() {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const padding = 10;

    const id = nextTargetId;
    setNextTargetId((n) => n + 1);
    targetTimestamps.current.set(id, Date.now());

    setTargets((prev) => [
      ...prev.filter((t) => !t.hit),
      {
        id,
        x: Math.random() * (rect.width - targetSize - padding * 2) + padding,
        y: Math.random() * (rect.height - targetSize - padding * 2) + padding,
        size: targetSize,
        hit: false,
      },
    ]);
  }

  const handleTargetClick = useCallback((id: number) => {
    const spawnTime = targetTimestamps.current.get(id);
    if (spawnTime) {
      setReactionTimes((prev) => [...prev, Date.now() - spawnTime]);
    }
    targetTimestamps.current.delete(id);

    setTargets((prev) => prev.filter((t) => t.id !== id));
    setHitCount((c) => c + 1);
    setScore((s) => s + 50);

    // Spawn next target after a small delay
    setTimeout(() => spawnTarget(), 200);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleMiss() {
    setMissCount((c) => c + 1);
    setScore((s) => Math.max(0, s - 10));
  }

  function endGame() {
    setTimerRunning(false);
    const finalScore = score;
    const finalStars = finalScore >= config.targetScore3 ? 3 : finalScore >= config.targetScore2 ? 2 : finalScore >= config.targetScore ? 1 : 0;
    const avgReaction = reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 0;
    // Bonus for fast reactions
    const speedBonus = avgReaction < 300 ? 50 : avgReaction < 500 ? 25 : 0;
    const totalScore = finalScore + speedBonus;
    const totalStars = totalScore >= config.targetScore3 ? 3 : totalScore >= config.targetScore2 ? 2 : totalScore >= config.targetScore ? 1 : 0;
    onComplete(totalScore, totalStars, timeLeft * 1000);
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* HUD */}
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="rounded-lg p-2 hover:bg-accent min-h-[44px] flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            {hitCount}/{totalTargets} hit
          </div>
          <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${timeLeft <= 5 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-muted"}`}>
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
        className={`relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} cursor-crosshair`}
      >
        {/* Countdown */}
        {phase === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-6xl font-bold text-white"
            >
              {countdown}
            </motion.div>
          </div>
        )}

        {/* Targets */}
        <AnimatePresence>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              onClick={() => handleTargetClick(target.id)}
              className="absolute flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white hover:scale-110 transition-all"
              style={{
                left: target.x,
                top: target.y,
                width: target.size,
                height: target.size,
              }}
            >
              <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${gradient}`} />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      {phase === "play" && (
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <span>Misses: {missCount}</span>
          {reactionTimes.length > 0 && (
            <span>Avg: {Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)}ms</span>
          )}
        </div>
      )}
    </div>
  );
}
