"use client";

import { useState } from "react";
import { Brain, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { CognitiveVerificationQuestion, VerificationResult } from "@/lib/verification/types";

interface CognitiveRecallModalProps {
  questions: CognitiveVerificationQuestion[];
  activityTitle: string;
  durationSeconds: number;
  expectedDurationSec: number;
  onComplete: (result: VerificationResult) => void;
  onSkip?: () => void;
}

export function CognitiveRecallModal({
  questions,
  activityTitle,
  durationSeconds,
  expectedDurationSec,
  onComplete,
  onSkip,
}: CognitiveRecallModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; isCorrect: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);

    const isCorrect = option === currentQ.correctAnswer;
    const newAnswers = [...answers, { questionId: currentQ.id, isCorrect }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
        const correctCount = newAnswers.filter((a) => a.isCorrect).length;
        const accuracyPct = Math.round((correctCount / questions.length) * 100);

        const status = accuracyPct >= 70 ? "VERIFIED" : accuracyPct >= 40 ? "PARTIALLY_VERIFIED" : "SELF_REPORTED";
        const confidence = accuracyPct >= 70 ? "high" : accuracyPct >= 40 ? "medium" : "low";

        const result: VerificationResult = {
          method: "cognitive_recall",
          status,
          confidence,
          durationSeconds,
          expectedDurationSeconds: expectedDurationSec,
          cognitiveRecallScore: {
            totalQuestions: questions.length,
            correctAnswers: correctCount,
            accuracyPercent: accuracyPct,
          },
          evidenceSummary: `Post-activity cognitive recall verified with ${accuracyPct}% accuracy (${correctCount}/${questions.length} correct).`,
          xpModifier: status === "VERIFIED" ? 1.0 : status === "PARTIALLY_VERIFIED" ? 0.75 : 0.5,
          verifiedAt: new Date().toISOString(),
        };

        onComplete(result);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border-2 border-primary/50 bg-card p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/25">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                Post-Activity Cognitive Verification
              </span>
              <h3 className="text-base sm:text-lg font-black text-foreground">
                Quick Recall Check ({currentIndex + 1}/{questions.length})
              </h3>
            </div>
          </div>

          <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-[10px] font-extrabold text-primary">
            {currentQ.cognitiveSkill}
          </span>
        </div>

        {/* Question Prompt */}
        <div className="rounded-2xl bg-background/90 border border-border p-4 space-y-2">
          <p className="text-sm sm:text-base font-bold text-foreground leading-snug">
            {currentQ.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === currentQ.correctAnswer;
            let btnClass = "border-border bg-background hover:border-primary/40 text-foreground";

            if (selectedOption !== null) {
              if (isSelected && isCorrect) {
                btnClass = "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black";
              } else if (isSelected && !isCorrect) {
                btnClass = "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold";
              } else if (isCorrect) {
                btnClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left rounded-2xl border-2 p-3.5 text-xs sm:text-sm transition-all active:scale-[0.99] flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {selectedOption !== null && isCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                )}
                {selectedOption !== null && isSelected && !isCorrect && (
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Skip fallback if requested */}
        {onSkip && selectedOption === null && (
          <div className="text-center pt-1">
            <button
              onClick={onSkip}
              className="text-[11px] font-bold text-muted-foreground hover:text-foreground"
            >
              Skip verification &amp; self-report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
