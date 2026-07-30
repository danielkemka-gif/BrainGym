"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Brain, Clock, Trophy, Coins, ArrowRight, Gamepad2 } from "lucide-react";
import Link from "next/link";
import type { BrainTask } from "@/lib/brain-tasks";

interface BrainTaskPlayerProps {
  task: BrainTask;
  onComplete: (score: number) => void;
}

export function BrainTaskPlayer({ task, onComplete }: BrainTaskPlayerProps) {
  const [phase, setPhase] = useState<"read" | "doing" | "done">("read");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(task.timeLimitSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [timeTakenMs, setTimeTakenMs] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startDoing() {
    setPhase("doing");
    setTimerRunning(true);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimerRunning(false);
          setPhase("done");
          const taken = Date.now() - startRef.current;
          setTimeTakenMs(taken);
          const s = task.pointsCalculation({ userValue: "", timeTakenMs: taken });
          setScore(s);
          setTimeout(() => onComplete(s), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleSubmit() {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    const taken = Date.now() - startRef.current;
    setTimeTakenMs(taken);
    const s = task.pointsCalculation({ userValue: userInput, timeTakenMs: taken });
    setScore(s);
    setPhase("done");
    setTimeout(() => onComplete(s), 1500);
  }

  function handleDone() {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    const taken = Date.now() - startRef.current;
    setTimeTakenMs(taken);
    const s = task.pointsCalculation({ timeTakenMs: taken });
    setScore(s);
    setPhase("done");
    setTimeout(() => onComplete(s), 1500);
  }

  const timePercent = (timeLeft / task.timeLimitSeconds) * 100;

  if (phase === "done") {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-6"
        >
          <div className="text-4xl mb-3">🧠</div>
          <p className="text-lg font-bold">
            {score >= 400 ? "Excellent!" : score >= 200 ? "Well done!" : score > 0 ? "Good effort!" : "Nice try!"}
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <div className="rounded-lg bg-violet-500/10 px-3 py-2">
              <p className="text-lg font-bold text-violet-400">+{score}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
            <div className="rounded-lg bg-amber-500/10 px-3 py-2">
              <p className="text-lg font-bold text-amber-400">+{task.coinReward}</p>
              <p className="text-xs text-muted-foreground">coins</p>
            </div>
          </div>
        </motion.div>

        {task.linkedGame && task.linkedGamePath && (
          <Link
            href={task.linkedGamePath}
            className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:bg-primary/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Try the full {task.linkedGameTitle}</p>
              <p className="text-xs text-muted-foreground">Train this skill with the complete game</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary shrink-0" />
          </Link>
        )}
      </div>
    );
  }

  if (phase === "read") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Brain className="h-4 w-4 text-primary" />
          <span className="font-medium text-primary">Brain Task</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold">
            +{task.xpReward} XP
          </span>
        </div>

        <h3 className="text-lg font-bold">{task.title}</h3>
        <p className="text-sm text-muted-foreground">{task.description}</p>

        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm leading-relaxed font-medium">{task.instruction}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {task.timeLimitSeconds}s time limit
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5 text-violet-400" /> Up to 500 pts
          </span>
        </div>

        <button
          onClick={startDoing}
          className="touch-manipulation inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl active:scale-[0.97]"
        >
          I&apos;m Ready — Start! <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // phase === "doing"
  const isMindfulness = task.type === "mindfulness";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
          <Brain className="h-4 w-4" /> Brain Task
        </span>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
          timeLeft <= 5 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-muted"
        }`}>
          <Clock className="h-3.5 w-3.5" />
          {timeLeft}s
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            timeLeft <= 5 ? "bg-red-500" : "bg-primary"
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      <h3 className="font-bold">{task.title}</h3>

      {!isMindfulness ? (
        <div className="space-y-3">
          <textarea
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            autoFocus
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            placeholder="Type your answer here..."
          />
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim()}
            className="touch-manipulation inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl active:scale-[0.97] disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Breathe deeply and focus. When you&apos;re done, tap the button below.
            </p>
            <div className="text-6xl mb-4 animate-pulse">🧘</div>
            <p className="text-xs text-muted-foreground">
              {Math.floor((task.timeLimitSeconds - timeLeft) / 60)}:{((task.timeLimitSeconds - timeLeft) % 60).toString().padStart(2, "0")} elapsed
            </p>
          </div>
          <button
            onClick={handleDone}
            className="touch-manipulation inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl active:scale-[0.97]"
          >
            I&apos;m Done Breathing
          </button>
        </div>
      )}
    </div>
  );
}
