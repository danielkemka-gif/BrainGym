"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  getActiveGoal,
  getAllGoals,
  saveGoal,
  updateGoalProgress,
  logGoalResult,
  BrainGoal,
  GoalResultLog,
} from "@/lib/goals/goals-engine";
import {
  Target,
  Plus,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  RotateCcw,
  Clock,
  Compass,
  Edit3,
  X,
  Send,
} from "lucide-react";

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<BrainGoal[]>([]);
  const [activeGoal, setActiveGoal] = useState<BrainGoal | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal / Form state for new / edit goal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSituation, setFormSituation] = useState("");
  const [formTarget, setFormTarget] = useState(10);
  const [formProgress, setFormProgress] = useState(0);
  const [formUnit, setFormUnit] = useState("milestones");
  const [formNextAction, setFormNextAction] = useState("");

  // Reflection log state
  const [showReflectModal, setShowReflectModal] = useState(false);
  const [reflectMetric, setReflectMetric] = useState("");
  const [reflectObservation, setReflectObservation] = useState("");
  const [reflectNextMove, setReflectNextMove] = useState("");
  const [incrementCount, setIncrementCount] = useState(1);

  const loadGoals = async () => {
    setLoading(true);
    const all = await getAllGoals(user?.id);
    const active = await getActiveGoal(user?.id);
    setGoals(all);
    setActiveGoal(active);
    setLoading(false);
  };

  useEffect(() => {
    loadGoals();
  }, [user]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormTitle("");
    setFormSituation("");
    setFormTarget(10);
    setFormProgress(0);
    setFormUnit("milestones");
    setFormNextAction("");
    setShowModal(true);
  };

  const handleOpenEdit = (goal: BrainGoal) => {
    setEditingId(goal.id);
    setFormTitle(goal.title);
    setFormSituation(goal.currentSituation || "");
    setFormTarget(goal.target);
    setFormProgress(goal.currentProgress);
    setFormUnit(goal.unit || "units");
    setFormNextAction(goal.nextAction || "");
    setShowModal(true);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    await saveGoal(
      {
        id: editingId || undefined,
        title: formTitle.trim(),
        currentSituation: formSituation.trim(),
        target: Number(formTarget) || 10,
        currentProgress: Number(formProgress) || 0,
        unit: formUnit.trim() || "milestones",
        nextAction: formNextAction.trim() || "Execute next key step",
        isActive: true,
      },
      user?.id
    );

    setShowModal(false);
    await loadGoals();
  };

  const handleLogReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoal) return;

    await logGoalResult(
      activeGoal.id,
      {
        metricLabel: "Progress Update",
        metricValue: reflectMetric || `+${incrementCount} ${activeGoal.unit}`,
        reflection: reflectObservation,
        nextAdjustment: reflectNextMove,
        progressIncrement: Number(incrementCount) || 1,
      },
      user?.id
    );

    setShowReflectModal(false);
    setReflectMetric("");
    setReflectObservation("");
    setReflectNextMove("");
    setIncrementCount(1);
    await loadGoals();
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 overflow-x-hidden px-3 sm:px-4 py-3 pb-28 text-foreground touch-manipulation">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-b border-border/60 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black text-primary uppercase tracking-wider mb-1">
            <Target className="h-3.5 w-3.5" />
            <span>Assess · Practise · Apply · Review · Adapt</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Goals &amp; Execution
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Turn your decisions into measurable goals, daily action steps, and adaptive learning.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-3 text-xs sm:text-sm font-bold shadow-sm transition hover:bg-primary/90 active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* ─── ACTIVE GOAL DISPLAY ─── */}
      {activeGoal ? (
        <section
          aria-labelledby="active-goal-title"
          className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-6 shadow-md space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Target className="h-4 w-4" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  PRIMARY ACTIVE GOAL
                </span>
                <h2
                  id="active-goal-title"
                  className="text-lg sm:text-xl font-black text-foreground"
                >
                  {activeGoal.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEdit(activeGoal)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Goal</span>
              </button>
              <button
                onClick={() => setShowReflectModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3.5 py-1.5 text-xs font-bold shadow-xs hover:bg-primary/90 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Log Progress</span>
              </button>
            </div>
          </div>

          {activeGoal.currentSituation && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Current Situation:</strong> {activeGoal.currentSituation}
            </p>
          )}

          {/* Progress Bar & Numeric Target */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-foreground">
                Progress: {activeGoal.currentProgress} / {activeGoal.target} {activeGoal.unit}
              </span>
              <span className="text-primary font-black">
                {Math.round((activeGoal.currentProgress / (activeGoal.target || 1)) * 100)}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((activeGoal.currentProgress / (activeGoal.target || 1)) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Next Key Action Step */}
          {activeGoal.nextAction && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-primary/20 bg-background/80">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                  NEXT ACTION STEP
                </span>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {activeGoal.nextAction}
                </span>
              </div>

              <button
                onClick={() => setShowReflectModal(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold shadow-xs hover:bg-primary/90 transition shrink-0"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Mark Action Done</span>
              </button>
            </div>
          )}
        </section>
      ) : (
        <div className="p-8 rounded-3xl border border-dashed border-border bg-card text-center space-y-3">
          <Target className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No active goal yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Set your first goal to begin tracking decisions, milestones, and daily progress.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Goal</span>
          </button>
        </div>
      )}

      {/* ─── LEARNING & REFLECTION HISTORY (ADAPT CYCLE) ─── */}
      {activeGoal && activeGoal.resultsHistory && activeGoal.resultsHistory.length > 0 && (
        <section className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-primary">
                <RotateCcw className="h-4 w-4" />
              </span>
              <h3 className="text-sm sm:text-base font-black text-foreground">
                Reflection &amp; Adjustment Log
              </h3>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Review &amp; Adapt
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {activeGoal.resultsHistory.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl border border-border/70 bg-background space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-primary">{log.metricValue}</span>
                  <span className="text-muted-foreground">
                    {new Date(log.date).toLocaleDateString()}
                  </span>
                </div>
                {log.reflection && (
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    <strong className="text-muted-foreground">Reflection:</strong> {log.reflection}
                  </p>
                )}
                {log.nextAdjustment && (
                  <p className="text-xs text-primary font-medium leading-relaxed">
                    <strong>Adjustment:</strong> {log.nextAdjustment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── CREATE / EDIT MODAL ─── */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl text-foreground space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base sm:text-lg font-black text-foreground">
                {editingId ? "Edit Goal" : "Create New Goal"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Goal Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Acquire 10 new clients this quarter"
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Current Situation</label>
                <textarea
                  rows={2}
                  value={formSituation}
                  onChange={(e) => setFormSituation(e.target.value)}
                  placeholder="Where do things stand right now?"
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Target</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formTarget}
                    onChange={(e) => setFormTarget(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Current</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formProgress}
                    onChange={(e) => setFormProgress(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Unit</label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="clients, milestones..."
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Immediate Next Action</label>
                <input
                  type="text"
                  value={formNextAction}
                  onChange={(e) => setFormNextAction(e.target.value)}
                  placeholder="The single concrete action step you will execute next"
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary text-primary-foreground px-5 py-2 text-xs font-bold shadow-xs hover:bg-primary/90 transition"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── REFLECTION & PROGRESS MODAL ─── */}
      {showReflectModal && activeGoal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl text-foreground space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-foreground">
                  Log Goal Progress &amp; Reflection
                </h3>
                <p className="text-xs text-muted-foreground">
                  Assess what happened, record the learning, and set the next adjustment.
                </p>
              </div>
              <button
                onClick={() => setShowReflectModal(false)}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLogReflection} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">
                    Units Completed (+{activeGoal.unit})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={incrementCount}
                    onChange={(e) => setIncrementCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Metric Summary</label>
                  <input
                    type="text"
                    value={reflectMetric}
                    onChange={(e) => setReflectMetric(e.target.value)}
                    placeholder="e.g. 5 contacted, 2 scheduled"
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">
                  What did you observe or learn from this step?
                </label>
                <textarea
                  rows={2}
                  required
                  value={reflectObservation}
                  onChange={(e) => setReflectObservation(e.target.value)}
                  placeholder="e.g. Direct voice notes got 3x higher response rate than email..."
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">
                  Next Adaptive Adjustment
                </label>
                <input
                  type="text"
                  required
                  value={reflectNextMove}
                  onChange={(e) => setReflectNextMove(e.target.value)}
                  placeholder="e.g. Send voice notes to the next 10 prospects tomorrow"
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowReflectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary text-primary-foreground px-5 py-2 text-xs font-bold shadow-xs hover:bg-primary/90 transition"
                >
                  Save Reflection &amp; Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
