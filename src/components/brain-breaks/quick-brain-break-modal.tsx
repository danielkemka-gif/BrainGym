"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BrainBreakActivity,
  QUICK_BRAIN_BREAKS,
  recordCompletedBrainBreak,
} from "@/lib/brain-breaks";
import { ContextualChallengeVisual } from "@/components/visuals/contextual-challenge-visual";
import { Confetti } from "@/components/ui/confetti";
import {
  X,
  Zap,
  Timer,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface QuickBrainBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId?: string;
}

export function QuickBrainBreakModal({
  isOpen,
  onClose,
  activityId,
}: QuickBrainBreakModalProps) {
  const [activity, setActivity] = useState<BrainBreakActivity>(QUICK_BRAIN_BREAKS[0]);
  const [gameState, setGameState] = useState<"ready" | "playing" | "success" | "failed">("ready");
  const [timeLeft, setTimeLeft] = useState(60);
  const [reactionStartTime, setReactionStartTime] = useState<number | null>(null);
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const [reactionWaiting, setReactionWaiting] = useState(false);
  const [reactionReady, setReactionReady] = useState(false);
  
  // Memory Flash State
  const [memorySequence, setMemorySequence] = useState<string[]>([]);
  const [memoryRevealed, setMemoryRevealed] = useState(true);
  const [userSelection, setUserSelection] = useState<string[]>([]);

  // Rapid Logic State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const chosen = activityId
        ? QUICK_BRAIN_BREAKS.find((b) => b.id === activityId) || QUICK_BRAIN_BREAKS[0]
        : QUICK_BRAIN_BREAKS[Math.floor(Math.random() * QUICK_BRAIN_BREAKS.length)];
      setActivity(chosen);
      setGameState("ready");
      setTimeLeft(chosen.durationSeconds);
      setUserSelection([]);
      setSelectedOption(null);
      setReactionReady(false);
      setReactionWaiting(false);
    }
  }, [isOpen, activityId]);

  // Handle countdown timer when playing
  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      setGameState("failed");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Start game handler
  const handleStartGame = () => {
    setGameState("playing");
    setTimeLeft(activity.durationSeconds);

    if (activity.id === "memory-flash") {
      const symbols = ["⚡", "🧠", "🎯", "💎"];
      const shuffled = [...symbols].sort(() => 0.5 - Math.random());
      setMemorySequence(shuffled);
      setMemoryRevealed(true);
      setUserSelection([]);

      // Hide sequence after 2.5 seconds
      setTimeout(() => {
        setMemoryRevealed(false);
      }, 2500);
    } else if (activity.id === "reaction-reflex") {
      setReactionWaiting(true);
      setReactionReady(false);
      const delay = 1500 + Math.random() * 2500;
      setTimeout(() => {
        setReactionWaiting(false);
        setReactionReady(true);
        setReactionStartTime(Date.now());
      }, delay);
    }
  };

  // Memory Flash Choice Selection
  const handleMemoryChoice = (symbol: string) => {
    if (userSelection.length >= memorySequence.length) return;
    const nextSelection = [...userSelection, symbol];
    setUserSelection(nextSelection);

    if (nextSelection.length === memorySequence.length) {
      const isCorrect = nextSelection.every((val, idx) => val === memorySequence[idx]);
      if (isCorrect) {
        finishSuccess();
      } else {
        setGameState("failed");
      }
    }
  };

  // Reaction Tap Handler
  const handleReactionTap = () => {
    if (reactionWaiting) {
      // Tapped too early
      setReactionWaiting(false);
      setGameState("failed");
      return;
    }

    if (reactionReady && reactionStartTime) {
      const diff = Date.now() - reactionStartTime;
      setReactionMs(diff);
      finishSuccess(diff);
    }
  };

  // Logic Option Selection
  const handleLogicSelect = (idx: number, isCorrect: boolean) => {
    setSelectedOption(idx);
    if (isCorrect) {
      finishSuccess();
    } else {
      setTimeout(() => setGameState("failed"), 400);
    }
  };

  const finishSuccess = useCallback((ms?: number) => {
    recordCompletedBrainBreak(activity.pointsAwarded, ms);
    setGameState("success");
  }, [activity.pointsAwarded]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 shadow-2xl text-center space-y-4 touch-manipulation overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-[10px] font-black uppercase">
              ⚡ 60-SEC BRAIN BREAK
            </span>
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              {timeLeft}s
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ─── STATE 1: READY / INTRODUCTION ─────────────────────────────── */}
        {gameState === "ready" && (
          <div className="space-y-4 py-2">
            <div className="mx-auto flex justify-center">
              <ContextualChallengeVisual category={activity.category} size="lg" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-primary tracking-wider">
                {activity.tagline}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                {activity.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
                {activity.description}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/50 p-3 flex items-center justify-around text-xs font-bold text-muted-foreground">
              <span>⏱️ {activity.durationSeconds} Seconds</span>
              <span>⭐ +{activity.pointsAwarded} Brain Points</span>
              <span>🔥 +{activity.xpAwarded} XP</span>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white font-black py-3.5 px-6 shadow-xl shadow-primary/30 transition hover:brightness-110 active:scale-95 min-h-[48px]"
            >
              <Zap className="h-5 w-5 fill-white" />
              <span>START 60s DRILL ➔</span>
            </button>
          </div>
        )}

        {/* ─── STATE 2: PLAYING ───────────────────────────────────────────── */}
        {gameState === "playing" && (
          <div className="space-y-4 py-2">
            {/* MEMORY FLASH DRILL */}
            {activity.id === "memory-flash" && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground">
                  {memoryRevealed
                    ? "Memorize the sequence now!"
                    : "Tap the symbols in their original order:"}
                </p>

                {memoryRevealed ? (
                  <div className="flex items-center justify-center gap-2 py-4">
                    {memorySequence.map((sym, i) => (
                      <div
                        key={i}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 border-2 border-primary text-2xl shadow-md animate-in zoom-in"
                      >
                        {sym}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* User Selected Slots */}
                    <div className="flex items-center justify-center gap-2 min-h-[56px]">
                      {memorySequence.map((_, i) => (
                        <div
                          key={i}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background text-xl font-black"
                        >
                          {userSelection[i] || ""}
                        </div>
                      ))}
                    </div>

                    {/* Options to click */}
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {["⚡", "🧠", "🎯", "💎"].map((sym) => (
                        <button
                          key={sym}
                          onClick={() => handleMemoryChoice(sym)}
                          className="flex h-14 items-center justify-center rounded-2xl border border-border bg-card text-2xl shadow hover:bg-muted active:scale-95 transition min-h-[48px]"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NEURAL REFLEX SPEED DRILL */}
            {activity.id === "reaction-reflex" && (
              <div className="space-y-4">
                <button
                  onClick={handleReactionTap}
                  className={`w-full h-44 rounded-3xl flex flex-col items-center justify-center transition-all p-4 ${
                    reactionReady
                      ? "bg-emerald-500 text-white shadow-2xl shadow-emerald-500/50 scale-105"
                      : "bg-amber-500/20 border-2 border-amber-500/40 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {reactionReady ? (
                    <>
                      <Zap className="h-10 w-10 fill-white animate-bounce" />
                      <span className="text-xl font-black mt-2">TAP NOW!</span>
                    </>
                  ) : (
                    <>
                      <Timer className="h-8 w-8 animate-spin-slow" />
                      <span className="text-sm font-bold mt-2">Wait for GREEN...</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-muted-foreground">
                  Do not tap until the box turns bright green.
                </p>
              </div>
            )}

            {/* RAPID LOGIC DRILL */}
            {(activity.id === "rapid-logic" || activity.id === "odd-one-out" || activity.id === "focus-lock") && (
              <div className="space-y-3 text-left">
                <div className="rounded-2xl bg-muted/60 p-3.5 border border-border space-y-1">
                  <span className="text-[10px] font-black uppercase text-primary">QUESTION</span>
                  <p className="text-xs sm:text-sm font-bold text-foreground">
                    &ldquo;All neural pulses generate energy. No dormant synapses are pulses. Therefore, can a dormant synapse generate pulse energy?&rdquo;
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {[
                    { text: "No, never logically possible", isCorrect: true },
                    { text: "Yes, under certain circumstances", isCorrect: false },
                    { text: "Insufficient data provided", isCorrect: false },
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLogicSelect(idx, opt.isCorrect)}
                      className={`w-full text-left p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-between min-h-[48px] ${
                        selectedOption === idx
                          ? opt.isCorrect
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-500/20 border-red-500 text-red-600"
                          : "border-border bg-card hover:bg-muted text-foreground"
                      }`}
                    >
                      <span>{opt.text}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── STATE 3: SUCCESS ───────────────────────────────────────────── */}
        {gameState === "success" && (
          <div className="space-y-4 py-3 animate-in zoom-in-95">
            <Confetti active={true} />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white text-2xl shadow-lg shadow-emerald-500/30">
              ⚡
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                QUICK BREAK COMPLETE!
              </span>
              <h3 className="text-xl font-black text-foreground">
                Mental Clarity Restored
              </h3>
              {reactionMs && (
                <p className="text-xs font-bold text-primary">
                  Reflex Speed: {reactionMs} ms
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-background/90 border border-border p-3 flex justify-around text-xs font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">
                +{activity.pointsAwarded} Brain Points
              </span>
              <span className="text-primary">+{activity.xpAwarded} XP</span>
            </div>

            <button
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white font-black py-3.5 px-6 shadow-xl shadow-emerald-600/30 transition hover:brightness-110 min-h-[48px]"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>CONTINUE ➔</span>
            </button>
          </div>
        )}

        {/* ─── STATE 4: FAILED / TRY AGAIN ────────────────────────────────── */}
        {gameState === "failed" && (
          <div className="space-y-4 py-3 animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white text-2xl shadow-lg shadow-amber-500/30">
              <AlertCircle className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">Nice Attempt!</h3>
              <p className="text-xs text-muted-foreground">
                Speed drills sharpen with repetition. Want to try once more?
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleStartGame}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary text-white font-black py-3 px-4 text-xs transition min-h-[44px]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>TRY AGAIN</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center rounded-2xl border border-border bg-card text-foreground font-bold py-3 px-4 text-xs transition min-h-[44px]"
              >
                <span>DONE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
