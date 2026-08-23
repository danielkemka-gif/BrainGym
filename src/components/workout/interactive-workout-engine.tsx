"use client";

import { useState, useEffect, useRef } from "react";
import { InteractiveChallenge, ChallengeOption } from "@/lib/interactive-challenges";
import { Sparkles, CheckCircle2, XCircle, Clock, Zap, Trophy, Coins, ArrowRight, Eye, Brain } from "lucide-react";

interface WorkoutResultSummary {
  totalXp: number;
  totalCoins: number;
  accuracyPercent: number;
  avgReactionTimeMs: number;
  categoryScores: Record<string, number>;
  weakestCategory: string;
  strongestCategory: string;
}

interface InteractiveWorkoutEngineProps {
  challenges: InteractiveChallenge[];
  onComplete: (summary: WorkoutResultSummary) => void;
}

export function InteractiveWorkoutEngine({ challenges, onComplete }: InteractiveWorkoutEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"memorize" | "question" | "feedback">("memorize");
  const [memorizeCountdown, setMemorizeCountdown] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [roundStats, setRoundStats] = useState<{
    challengeId: string;
    category: string;
    isCorrect: boolean;
    reactionTimeMs: number;
    xp: number;
    coins: number;
  }[]>([]);

  const questionStartTimeRef = useRef<number>(0);
  const currentChallenge = challenges[currentIndex];

  // Set up phase on challenge change
  useEffect(() => {
    if (!currentChallenge) return;

    setSelectedOptionId(null);
    setIsCorrect(null);

    if (currentChallenge.memorizeDurationSec && currentChallenge.memorizeDurationSec > 0) {
      setPhase("memorize");
      setMemorizeCountdown(currentChallenge.memorizeDurationSec);
    } else {
      setPhase("question");
      questionStartTimeRef.current = Date.now();
    }
  }, [currentIndex, currentChallenge]);

  // Handle countdown for memorize phase
  useEffect(() => {
    if (phase !== "memorize" || memorizeCountdown <= 0) return;

    const timer = setInterval(() => {
      setMemorizeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase("question");
          questionStartTimeRef.current = Date.now();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, memorizeCountdown]);

  function handleSelectOption(option: ChallengeOption) {
    if (phase === "feedback" || selectedOptionId) return;

    const reactionTimeMs = Math.max(200, Date.now() - questionStartTimeRef.current);
    setSelectedOptionId(option.id);
    setIsCorrect(option.isCorrect);
    setPhase("feedback");

    const stat = {
      challengeId: currentChallenge.id,
      category: currentChallenge.category,
      isCorrect: option.isCorrect,
      reactionTimeMs,
      xp: option.isCorrect ? currentChallenge.xpReward : 10,
      coins: option.isCorrect ? currentChallenge.coinReward : 2,
    };

    setRoundStats((prev) => [...prev, stat]);
  }

  function handleNextChallenge() {
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Compute final workout summary
      const allStats = [...roundStats];
      const totalXp = allStats.reduce((acc, curr) => acc + curr.xp, 0);
      const totalCoins = allStats.reduce((acc, curr) => acc + curr.coins, 0);
      const correctCount = allStats.filter((s) => s.isCorrect).length;
      const accuracyPercent = Math.round((correctCount / allStats.length) * 100);
      const avgReactionTimeMs = Math.round(
        allStats.reduce((acc, curr) => acc + curr.reactionTimeMs, 0) / (allStats.length || 1)
      );

      // Category breakdown
      const catPerformance: Record<string, { total: number; correct: number }> = {};
      for (const s of allStats) {
        if (!catPerformance[s.category]) {
          catPerformance[s.category] = { total: 0, correct: 0 };
        }
        catPerformance[s.category].total += 1;
        if (s.isCorrect) catPerformance[s.category].correct += 1;
      }

      const categoryScores: Record<string, number> = {};
      let weakestCategory = "Focus";
      let strongestCategory = "Memory";
      let minRatio = 2;
      let maxRatio = -1;

      for (const [cat, data] of Object.entries(catPerformance)) {
        const score = Math.round((data.correct / data.total) * 100);
        categoryScores[cat] = Math.max(50, score);
        if (score < minRatio) {
          minRatio = score;
          weakestCategory = cat;
        }
        if (score > maxRatio) {
          maxRatio = score;
          strongestCategory = cat;
        }
      }

      onComplete({
        totalXp: totalXp + 100, // Session bonus
        totalCoins: totalCoins + 25,
        accuracyPercent,
        avgReactionTimeMs,
        categoryScores,
        weakestCategory,
        strongestCategory,
      });
    }
  }

  const progressPercent = Math.round(((currentIndex + 1) / challenges.length) * 100);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {/* ─── Top Progress Bar & Header ────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-foreground">
              Challenge {currentIndex + 1} of {challenges.length}
            </span>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-black text-primary">
            {currentChallenge.category}
          </span>
        </div>

        {/* Progress Line */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-violet-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ─── Main Challenge Card ─────────────────────────────────────────── */}
      <div className="rounded-3xl border-2 border-border bg-card p-5 sm:p-7 shadow-lg space-y-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            {currentChallenge.title}
          </span>
          <h2 className="text-base sm:text-lg font-black text-foreground mt-0.5">
            {currentChallenge.instruction}
          </h2>
        </div>

        {/* ─── Phase 1: Memorization Screen ──────────────────────────────── */}
        {phase === "memorize" && (
          <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 p-5 text-center space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-center gap-2 text-primary font-black text-sm">
              <Eye className="h-5 w-5 animate-pulse" />
              <span>MEMORIZE NOW: {memorizeCountdown}s</span>
            </div>

            {/* If Items Grid */}
            {currentChallenge.memorizeItems && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
                {currentChallenge.memorizeItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center rounded-2xl bg-card border-2 border-border p-3.5 text-sm sm:text-base font-black shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}

            {/* If Story Text */}
            {currentChallenge.memorizeStory && (
              <div className="rounded-2xl bg-card/90 border border-border p-4 text-left text-sm sm:text-base font-medium text-foreground leading-relaxed">
                &ldquo;{currentChallenge.memorizeStory}&rdquo;
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Focus your attention. This image will disappear in {memorizeCountdown} seconds!
            </p>
          </div>
        )}

        {/* ─── Phase 2: Question & Interactive Options ──────────────────── */}
        {(phase === "question" || phase === "feedback") && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Question Text */}
            <div className="rounded-2xl bg-muted/40 border border-border p-4">
              <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed">
                {currentChallenge.question}
              </p>
            </div>

            {/* 4 Interactive Choice Buttons */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentChallenge.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const isThisOptionCorrect = option.isCorrect;

                let buttonStyle = "border-border bg-card hover:bg-muted/60 text-foreground";
                let badgeStyle = "bg-muted text-muted-foreground";

                if (phase === "feedback") {
                  if (isThisOptionCorrect) {
                    buttonStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/40";
                    badgeStyle = "bg-emerald-500 text-white";
                  } else if (isSelected && !isThisOptionCorrect) {
                    buttonStyle = "border-red-500 bg-red-500/15 text-red-700 dark:text-red-300 font-bold";
                    badgeStyle = "bg-red-500 text-white";
                  } else {
                    buttonStyle = "border-border bg-card/40 text-muted-foreground opacity-50";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    disabled={phase === "feedback"}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition-all active:scale-[0.98] touch-manipulation min-h-[56px] ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black ${badgeStyle}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{option.label}</span>
                    </div>

                    {phase === "feedback" && isThisOptionCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    )}
                    {phase === "feedback" && isSelected && !isThisOptionCorrect && (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ─── Instant Educational Feedback Card ──────────────────────── */}
            {phase === "feedback" && (
              <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
                <div
                  className={`rounded-2xl p-4 border space-y-1.5 ${
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span>EXCELLENT! CORRECT (+{currentChallenge.xpReward} XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-amber-500" />
                        <span>NOT QUITE — HERE&apos;S WHY:</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {currentChallenge.educationalWhy}
                  </p>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextChallenge}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 px-6 py-4 text-sm sm:text-base font-black text-white shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition touch-manipulation min-h-[52px]"
                >
                  <span>
                    {currentIndex + 1 < challenges.length ? "NEXT CHALLENGE →" : "FINISH WORKOUT →"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
