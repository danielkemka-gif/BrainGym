"use client";

import React, { useState } from "react";
import { BrainGoal, saveGoal, logGoalResult } from "@/lib/goals/goals-engine";
import { useI18n } from "@/lib/i18n";
import { X, Target, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";

interface GoalModalProps {
  isOpen: boolean;
  isLogMode: boolean;
  goal: BrainGoal | null;
  onClose: () => void;
  onSaved: () => void;
}

export function GoalModal({ isOpen, isLogMode, goal, onClose, onSaved }: GoalModalProps) {
  const { t, isRtl } = useI18n();

  // Edit Goal state
  const [title, setTitle] = useState(goal?.title || "");
  const [currentSituation, setCurrentSituation] = useState(goal?.currentSituation || "");
  const [target, setTarget] = useState(goal?.target || 10);
  const [currentProgress, setCurrentProgress] = useState(goal?.currentProgress || 0);
  const [unit, setUnit] = useState(goal?.unit || "units");
  const [nextAction, setNextAction] = useState(goal?.nextAction || "");

  // Log Result state
  const [metricLabel, setMetricLabel] = useState("Actions Taken");
  const [metricValue, setMetricValue] = useState("");
  const [progressIncrement, setProgressIncrement] = useState(1);
  const [reflection, setReflection] = useState("");
  const [nextAdjustment, setNextAdjustment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await saveGoal({
      id: goal?.id,
      title: title.trim(),
      currentSituation: currentSituation.trim(),
      target: Number(target) || 10,
      currentProgress: Number(currentProgress) || 0,
      unit: unit.trim() || "units",
      nextAction: nextAction.trim() || "Take next step",
      isActive: true,
    });
    setSubmitting(false);
    onSaved();
    onClose();
  };

  const handleLogResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    setSubmitting(true);
    await logGoalResult(goal.id, {
      metricLabel: metricLabel.trim() || "Outcome",
      metricValue: metricValue.trim() || "Completed step",
      progressIncrement: Number(progressIncrement) || 0,
      reflection: reflection.trim() || "Action completed and evaluated.",
      nextAdjustment: nextAdjustment.trim() || goal.nextAction,
    });
    setSubmitting(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border bg-background p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Target className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-foreground">
              {isLogMode ? "Log Results & Reflection" : (goal ? "Edit Active Goal" : "Set New Goal")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isLogMode && goal ? (
          <form onSubmit={handleLogResult} className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-3 text-xs">
              <span className="font-bold text-muted-foreground">Active Goal:</span>
              <p className="font-extrabold text-foreground mt-0.5">{goal.title}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Current progress: {goal.currentProgress} / {goal.target} {goal.unit}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                What did you do / what happened?
              </label>
              <input
                type="text"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
                placeholder="e.g. Contacted 10 prospects · 4 replies · 1 signed"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Progress to add to your target:
              </label>
              <input
                type="number"
                min="0"
                value={progressIncrement}
                onChange={(e) => setProgressIncrement(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Reflection: What did you learn from this outcome?
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="e.g. Personalized opening lines got a 3x higher response rate..."
                rows={2}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Next Adjusted Action:
              </label>
              <input
                type="text"
                value={nextAdjustment}
                onChange={(e) => setNextAdjustment(e.target.value)}
                placeholder="e.g. Send follow-up messages to the 4 interested leads tomorrow morning"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground transition min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 min-h-[44px]"
              >
                {submitting ? "Saving..." : "Record & Update Goal"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveGoal} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Goal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Get 10 new customers this month"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Current Situation
              </label>
              <input
                type="text"
                value={currentSituation}
                onChange={(e) => setCurrentSituation(e.target.value)}
                placeholder="e.g. Reaching out through referrals and WhatsApp"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Current
                </label>
                <input
                  type="number"
                  min="0"
                  value={currentProgress}
                  onChange={(e) => setCurrentProgress(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Target
                </label>
                <input
                  type="number"
                  min="1"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="customers"
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Next Immediate Action
              </label>
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="e.g. Contact 10 qualified prospects before 6 PM"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground transition min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 min-h-[44px]"
              >
                {submitting ? "Saving..." : "Save Goal"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
