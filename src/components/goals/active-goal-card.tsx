"use client";

import React, { useState, useEffect } from "react";
import { BrainGoal, getActiveGoal } from "@/lib/goals/goals-engine";
import { useI18n } from "@/lib/i18n";
import { Target, ArrowRight, CheckCircle2, Plus, Sparkles, Pencil } from "lucide-react";
import { GoalModal } from "./goal-modal";

interface ActiveGoalCardProps {
  onGoalUpdated?: () => void;
}

export function ActiveGoalCard({ onGoalUpdated }: ActiveGoalCardProps) {
  const { t, isRtl } = useI18n();
  const [goal, setGoal] = useState<BrainGoal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggingResult, setIsLoggingResult] = useState(false);

  const loadGoal = () => {
    getActiveGoal().then((g) => setGoal(g));
  };

  useEffect(() => {
    loadGoal();
  }, []);

  const handleGoalSaved = () => {
    loadGoal();
    if (onGoalUpdated) onGoalUpdated();
  };

  if (!goal) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/80 bg-card/60 p-3.5 text-center transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold text-foreground">Set your first active goal</span>
          </div>
          <button
            onClick={() => {
              setIsLoggingResult(false);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs transition active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            {t.goal_create_cta || "Set Goal"}
          </button>
        </div>
        {showModal && (
          <GoalModal
            isOpen={showModal}
            isLogMode={isLoggingResult}
            goal={goal}
            onClose={() => setShowModal(false)}
            onSaved={handleGoalSaved}
          />
        )}
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round((goal.currentProgress / (goal.target || 1)) * 100));

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 p-3.5 sm:p-4 shadow-xs space-y-2.5 transition-all hover:border-border">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-600 dark:text-amber-400">
            <Target className="h-3 w-3" />
            {t.goal_active_title || "ACTIVE GOAL"}
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
            {goal.title}
          </h3>
        </div>

        <button
          onClick={() => {
            setIsLoggingResult(false);
            setShowModal(true);
          }}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition shrink-0"
          title="Edit goal"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </div>

      {/* Progress Bar & Ratio */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
          <span>{goal.currentSituation || "Progress"}</span>
          <span className="text-foreground font-black">
            {goal.currentProgress} / {goal.target} {goal.unit} ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Next Action & Log Button */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50 text-xs">
        <div className="min-w-0 flex-1 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="text-foreground/90 font-medium truncate text-[11px]">
            {goal.nextAction}
          </span>
        </div>

        <button
          onClick={() => {
            setIsLoggingResult(true);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-[11px] font-bold transition active:scale-95 shrink-0"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{t.goal_log_result_cta || "Log Result"}</span>
        </button>
      </div>

      {showModal && (
        <GoalModal
          isOpen={showModal}
          isLogMode={isLoggingResult}
          goal={goal}
          onClose={() => setShowModal(false)}
          onSaved={handleGoalSaved}
        />
      )}
    </div>
  );
}
