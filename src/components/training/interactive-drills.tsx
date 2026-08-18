"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  COGNITIVE_DOMAINS,
  CognitiveDomainId,
  DrillItem,
} from "@/lib/cognitive-matrix";
import {
  calculateAntiGamingScore,
  evaluateAdaptiveDifficulty,
  UserPerformanceRecord,
} from "@/lib/cognitive-engine";
import {
  generateStructuredFeedback,
  StructuredFeedbackCard,
} from "@/lib/feedback-engine";
import {
  Zap,
  Brain,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Share2,
  ChevronRight,
  Scale,
  BookOpen,
} from "lucide-react";

interface InteractiveDrillPlayerProps {
  drill: DrillItem;
  onComplete: (result: {
    score: number;
    accuracy: number;
    timeTakenMs: number;
    feedback: StructuredFeedbackCard;
  }) => void;
  onNext?: () => void;
  stepNumber?: number;
  totalSteps?: number;
}

export function InteractiveDrillPlayer({
  drill,
  onComplete,
  onNext,
  stepNumber = 1,
  totalSteps = 6,
}: InteractiveDrillPlayerProps) {
  const domain = COGNITIVE_DOMAINS[drill.domain];
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(drill.timeLimitSeconds);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeTakenMs, setTimeTakenMs] = useState(0);
  const [feedbackCard, setFeedbackCard] = useState<StructuredFeedbackCard | null>(null);
  const [scoreResult, setScoreResult] = useState<{ score: number; efficiencyBonus: number; isSpeedRewarded: boolean } | null>(null);
  const [reflectionAnswer, setReflectionAnswer] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Rapid Categorization / Rule Switch specific states
  const [rapidIndex, setRapidIndex] = useState(0);
  const [rapidCorrectCount, setRapidCorrectCount] = useState(0);

  // Speed Comparison specific states
  const [compIndex, setCompIndex] = useState(0);
  const [compCorrectCount, setCompCorrectCount] = useState(0);

  // Target Detection specific states
  const [streamIndex, setStreamIndex] = useState(0);
  const [streamDetections, setStreamDetections] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown
  useEffect(() => {
    setStartTime(Date.now());
    setTimeRemaining(drill.timeLimitSeconds);
    setHasSubmitted(false);
    setSelectedOptionId(null);
    setFeedbackCard(null);
    setScoreResult(null);
    setReflectionAnswer("");
    setReflectionSaved(false);
    setRapidIndex(0);
    setRapidCorrectCount(0);
    setCompIndex(0);
    setCompCorrectCount(0);
    setStreamIndex(0);
    setStreamDetections(0);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [drill]);

  // Handle Standard Multiple Choice / Logic Submission
  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const elapsed = Date.now() - startTime;
    setTimeTakenMs(elapsed);
    setSelectedOptionId(optionId);
    setHasSubmitted(true);

    const selected = drill.options?.find((o) => o.id === optionId);
    const isCorrect = selected?.isCorrect ?? false;
    const accuracy = isCorrect ? 100 : 0;

    const antiGaming = calculateAntiGamingScore({
      accuracy: accuracy / 100,
      difficultyTier: drill.difficulty,
      timeTakenMs: elapsed,
      targetDurationSeconds: drill.timeLimitSeconds,
    });
    setScoreResult(antiGaming);

    const feedback = generateStructuredFeedback({
      drill,
      accuracy,
      timeTakenMs: elapsed,
      historicalAvgMs: drill.timeLimitSeconds * 500,
      isCorrect,
      selectedOptionText: selected?.text,
      activeDomain: drill.domain,
    });
    setFeedbackCard(feedback);

    onComplete({
      score: antiGaming.score,
      accuracy,
      timeTakenMs: elapsed,
      feedback,
    });
  };

  // Handle Rapid Categorization Choice
  const handleRapidCategoryClick = (category: string) => {
    const items = drill.customData?.items || [];
    const currentItem = items[rapidIndex];
    if (!currentItem) return;

    const isMatch = currentItem.category === category;
    const nextCorrect = isMatch ? rapidCorrectCount + 1 : rapidCorrectCount;
    setRapidCorrectCount(nextCorrect);

    if (rapidIndex + 1 < items.length) {
      setRapidIndex((prev) => prev + 1);
    } else {
      // Completed all items in sprint
      if (timerRef.current) clearInterval(timerRef.current);
      const elapsed = Date.now() - startTime;
      setTimeTakenMs(elapsed);
      setHasSubmitted(true);

      const accuracy = (nextCorrect / items.length) * 100;
      const isOverallSuccess = accuracy >= 70;

      const antiGaming = calculateAntiGamingScore({
        accuracy: accuracy / 100,
        difficultyTier: drill.difficulty,
        timeTakenMs: elapsed,
        targetDurationSeconds: drill.timeLimitSeconds,
      });
      setScoreResult(antiGaming);

      const feedback = generateStructuredFeedback({
        drill,
        accuracy,
        timeTakenMs: elapsed,
        historicalAvgMs: drill.timeLimitSeconds * 500,
        isCorrect: isOverallSuccess,
        activeDomain: drill.domain,
      });
      setFeedbackCard(feedback);

      onComplete({
        score: antiGaming.score,
        accuracy,
        timeTakenMs: elapsed,
        feedback,
      });
    }
  };

  // Handle Speed Comparison Choice
  const handleSpeedComparisonChoice = (userAnswerIdentical: boolean) => {
    const pairs = drill.customData?.pairs || [];
    const currentPair = pairs[compIndex];
    if (!currentPair) return;

    const isCorrect = currentPair.identical === userAnswerIdentical;
    const nextCorrect = isCorrect ? compCorrectCount + 1 : compCorrectCount;
    setCompCorrectCount(nextCorrect);

    if (compIndex + 1 < pairs.length) {
      setCompIndex((prev) => prev + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      const elapsed = Date.now() - startTime;
      setTimeTakenMs(elapsed);
      setHasSubmitted(true);

      const accuracy = (nextCorrect / pairs.length) * 100;
      const isOverallSuccess = accuracy >= 75;

      const antiGaming = calculateAntiGamingScore({
        accuracy: accuracy / 100,
        difficultyTier: drill.difficulty,
        timeTakenMs: elapsed,
        targetDurationSeconds: drill.timeLimitSeconds,
      });
      setScoreResult(antiGaming);

      const feedback = generateStructuredFeedback({
        drill,
        accuracy,
        timeTakenMs: elapsed,
        historicalAvgMs: drill.timeLimitSeconds * 500,
        isCorrect: isOverallSuccess,
        activeDomain: drill.domain,
      });
      setFeedbackCard(feedback);

      onComplete({
        score: antiGaming.score,
        accuracy,
        timeTakenMs: elapsed,
        feedback,
      });
    }
  };

  // Handle Rule Switch Choice
  const handleRuleSwitchTap = (side: "LEFT" | "RIGHT") => {
    const custom = drill.customData;
    const items = custom?.items || [];
    const currentItem = items[rapidIndex];
    if (!currentItem) return;

    const isAfterSwitch = rapidIndex >= (custom?.switchAfterRound ?? 4);
    const expectedSide = isAfterSwitch ? currentItem.threshold : currentItem.parity;
    const isCorrect = expectedSide === side;
    const nextCorrect = isCorrect ? rapidCorrectCount + 1 : rapidCorrectCount;
    setRapidCorrectCount(nextCorrect);

    if (rapidIndex + 1 < items.length) {
      setRapidIndex((prev) => prev + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      const elapsed = Date.now() - startTime;
      setTimeTakenMs(elapsed);
      setHasSubmitted(true);

      const accuracy = (nextCorrect / items.length) * 100;
      const isOverallSuccess = accuracy >= 75;

      const antiGaming = calculateAntiGamingScore({
        accuracy: accuracy / 100,
        difficultyTier: drill.difficulty,
        timeTakenMs: elapsed,
        targetDurationSeconds: drill.timeLimitSeconds,
      });
      setScoreResult(antiGaming);

      const feedback = generateStructuredFeedback({
        drill,
        accuracy,
        timeTakenMs: elapsed,
        historicalAvgMs: drill.timeLimitSeconds * 500,
        isCorrect: isOverallSuccess,
        activeDomain: drill.domain,
      });
      setFeedbackCard(feedback);

      onComplete({
        score: antiGaming.score,
        accuracy,
        timeTakenMs: elapsed,
        feedback,
      });
    }
  };

  const timerPercent = (timeRemaining / drill.timeLimitSeconds) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Header / Progress Pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-bold shadow-sm"
            style={{ backgroundColor: domain.color }}
          >
            {domain.badgeEmoji}
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              <span>{domain.name}</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                (Step {stepNumber}/{totalSteps})
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{domain.tagline}</p>
          </div>
        </div>

        {/* Live Timer Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
            timeRemaining <= 5
              ? "bg-red-500/20 text-red-600 animate-pulse border border-red-500/40"
              : "bg-muted text-foreground border border-border"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>{timeRemaining}s</span>
        </div>
      </div>

      {/* Visual Timer Progress Line */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full transition-all duration-1000 rounded-full"
          style={{
            width: `${timerPercent}%`,
            backgroundColor: timeRemaining <= 5 ? "#ef4444" : domain.color,
          }}
        />
      </div>

      {/* Main Interactive Drill Box */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {drill.title}
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            Level {drill.difficulty}/10
          </span>
        </div>

        {/* Context / Scenario description if present */}
        {drill.context && (
          <div className="rounded-xl bg-muted/40 border border-border/60 p-3.5 text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans whitespace-pre-line">
            {drill.context}
          </div>
        )}

        {/* Main Prompt */}
        <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
          {drill.prompt}
        </h2>

        {/* ── Drill Type 1: Rapid Categorization ── */}
        {drill.type === "rapid_categorization" && !hasSubmitted && (
          <div className="space-y-4 py-2">
            {(() => {
              const items = drill.customData?.items || [];
              const cur = items[rapidIndex];
              const categories: string[] = drill.customData?.categories || ["Odd", "Even"];
              return (
                <div className="text-center space-y-4">
                  <div className="text-xs text-muted-foreground">
                    Item {rapidIndex + 1} of {items.length}
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-primary font-mono tracking-wider py-4 bg-primary/5 rounded-2xl border border-primary/20">
                    {cur?.item}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleRapidCategoryClick(cat)}
                        className="py-3 px-4 rounded-xl border border-border bg-card text-foreground font-bold text-sm hover:border-primary hover:bg-primary/5 transition active:scale-95 touch-manipulation min-h-[48px]"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Drill Type 2: Rule Switch ── */}
        {drill.type === "rule_switch" && !hasSubmitted && (
          <div className="space-y-4 py-2">
            {(() => {
              const custom = drill.customData;
              const items = custom?.items || [];
              const cur = items[rapidIndex];
              const isSwitched = rapidIndex >= (custom?.switchAfterRound || 4);
              const activeRuleText = isSwitched ? custom?.switchRule?.text : custom?.initialRule?.text;

              return (
                <div className="text-center space-y-4">
                  {/* Dynamic Rule Banner */}
                  <div
                    className={`rounded-xl p-3 text-xs font-bold transition-all ${
                      isSwitched
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 animate-bounce"
                        : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    ⚡ {activeRuleText}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Round {rapidIndex + 1} of {items.length}
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-foreground font-mono py-4 bg-muted/40 rounded-2xl border border-border">
                    {cur?.val}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleRuleSwitchTap("LEFT")}
                      className="py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition active:scale-95 touch-manipulation min-h-[48px]"
                    >
                      ⬅️ LEFT
                    </button>
                    <button
                      onClick={() => handleRuleSwitchTap("RIGHT")}
                      className="py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition active:scale-95 touch-manipulation min-h-[48px]"
                    >
                      RIGHT ➡️
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Drill Type 3: Speed Comparison ── */}
        {drill.type === "speed_comparison" && !hasSubmitted && (
          <div className="space-y-4 py-2">
            {(() => {
              const pairs = drill.customData?.pairs || [];
              const cur = pairs[compIndex];
              return (
                <div className="text-center space-y-4">
                  <div className="text-xs text-muted-foreground">
                    Comparison {compIndex + 1} of {pairs.length}
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-muted/40 rounded-2xl border border-border">
                    <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                      {cur?.a}
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                      {cur?.b}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSpeedComparisonChoice(true)}
                      className="py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition active:scale-95 touch-manipulation min-h-[48px]"
                    >
                      ✓ 100% IDENTICAL
                    </button>
                    <button
                      onClick={() => handleSpeedComparisonChoice(false)}
                      className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition active:scale-95 touch-manipulation min-h-[48px]"
                    >
                      ✗ DIFFERENT
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Standard Multiple Choice / Decision / Deduction Options ── */}
        {drill.options && !hasSubmitted && (
          <div className="space-y-2.5 pt-2">
            {drill.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className="w-full flex items-start gap-3 rounded-xl border border-border p-3.5 sm:p-4 text-left transition hover:border-primary hover:bg-primary/5 active:scale-[0.98] touch-manipulation min-h-[48px]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-muted-foreground/30 text-xs font-bold text-muted-foreground mt-0.5">
                  {opt.id.toUpperCase()}
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                  {opt.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Post-Submission Feedback & Actionable Micro-Lesson ── */}
      {hasSubmitted && feedbackCard && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-md space-y-4 animate-in fade-in-50 duration-300">
          {/* Result Banner */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              {feedbackCard.accuracyPercent >= 70 ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-amber-500" />
              )}
              <h4 className="text-sm sm:text-base font-bold text-foreground">
                {feedbackCard.resultText}
              </h4>
            </div>

            {scoreResult && (
              <div className="text-right">
                <span className="text-sm font-black text-violet-600 dark:text-violet-400">
                  +{scoreResult.score} XP
                </span>
                {scoreResult.efficiencyBonus > 0 && (
                  <span className="block text-[10px] text-green-600 font-semibold">
                    +{scoreResult.efficiencyBonus}% Speed Bonus
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Micro-Lesson & Explanation */}
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-3.5 text-xs sm:text-sm space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <Lightbulb className="h-4 w-4 shrink-0" />
              <span>Cognitive Micro-Lesson:</span>
            </div>
            <p className="text-foreground/90 font-medium leading-relaxed">
              {feedbackCard.microLesson}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-primary/20">
              💡 {drill.explanation}
            </p>
          </div>

          {/* Mistake & Bias Analysis */}
          <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1">
            <p className="font-semibold text-foreground/90">Thinking Analysis:</p>
            <p className="text-muted-foreground">{feedbackCard.mistakeAnalysis}</p>
          </div>

          {/* Metacognitive Reflection Prompt (Section 21) */}
          <div className="rounded-xl border border-border/70 p-3.5 space-y-2">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>🧠 Metacognitive Reflection:</span>
            </p>
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              &ldquo;{feedbackCard.reflectionQuestion}&rdquo;
            </p>
            {!reflectionSaved ? (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={reflectionAnswer}
                  onChange={(e) => setReflectionAnswer(e.target.value)}
                  placeholder="Type a 1-sentence insight..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setReflectionSaved(true)}
                  disabled={!reflectionAnswer.trim()}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-xs text-green-600 font-semibold">✓ Reflection noted</p>
            )}
          </div>

          {/* Next Activity Action Button */}
          {onNext && (
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 py-3 px-6 text-sm font-bold text-primary-foreground shadow-md transition hover:shadow-lg active:scale-95 min-h-[48px] touch-manipulation"
            >
              <span>Next Training Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
