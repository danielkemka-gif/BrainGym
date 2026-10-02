"use client";

import React, { useState, useEffect } from "react";
import { BrainGoal, getActiveGoal, logGoalResult, updateGoalProgress } from "@/lib/goals/goals-engine";
import { useI18n } from "@/lib/i18n";
import { Target, ArrowRight, CheckCircle2, Plus, Sparkles, Pencil, RefreshCw } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/80 bg-card/60 p-4 sm:p-5 text-center transition-all">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
          <Target className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-foreground">No Active Goal Set</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          BrainGym turns your mental workouts into real-life outcomes. Set your first goal to track progress.
        </p>
        <button
          onClick={() => {
            setIsLoggingResult(false);
            setShowModal(true);
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          {t.goal_create_cta || "Set a Goal"}
        </button>
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
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 p-4 sm:p-5 shadow-sm transition-all hover:border-border hover:shadow-md">
      {/* Top Banner with Active Badge and Action */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-black text-amber-600 dark:text-amber-400">
            <Target className="h-3.5 w-3.5" />
            {t.goal_active_title || "ACTIVE GOAL"}
          </span>
          <span className="text-[11px] font-bold text-muted-foreground">
            {progressPercent}% completed
          </span>
        </div>

        <button
          onClick={() => {
            setIsLoggingResult(false);
            setShowModal(true);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition"
          title="Edit goal"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Goal Title */}
      <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight line-clamp-2">
        {goal.title}
      </h3>

      {/* Progress Bar & Metric Numbers */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span>{goal.currentSituation || "Progress"}</span>
          <span className="text-foreground font-black">
            {goal.currentProgress} / {goal.target} {goal.unit}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Next Action Box */}
      {goal.nextAction && (
        <div className="mt-3.5 rounded-xl border border-primary/20 bg-primary/5 p-2.5 sm:p-3 text-xs flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="font-extrabold text-foreground uppercase tracking-wider text-[10px] block text-primary">
              {t.goal_next_action_label || "Next Action"}
            </span>
            <p className="font-medium text-foreground/90 mt-0.5 leading-relaxed">
              {goal.nextAction}
            </p>
          </div>
        </div>
      )}

      {/* Action Footer Button */}
      <div className="mt-3.5 flex items-center justify-end gap-2">
        <button
          onClick={() => {
            setIsLoggingResult(true);
            setShowModal(true);
          }}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 text-xs font-bold transition active:scale-95 min-h-[44px]"
        >
          <CheckCircle2 className="h-4 w-4" />
          {t.goal_log_result_cta || "Log Result & Adjust"}
          <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
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
