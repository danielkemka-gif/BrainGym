"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getDecisionRecords,
  saveDecisionRecord,
  submitDecisionReview,
  AkucheDecisionRecord,
} from "@/lib/akuche/decisions-engine";
import {
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Plus,
  ShieldCheck,
  RotateCcw,
  Zap,
} from "lucide-react";

export function DecisionLab() {
  const [records, setRecords] = useState<AkucheDecisionRecord[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AkucheDecisionRecord["category"]>("Business");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [advantagesA, setAdvantagesA] = useState("");
  const [advantagesB, setAdvantagesB] = useState("");
  const [risksA, setRisksA] = useState("");
  const [risksB, setRisksB] = useState("");
  const [worstCaseA, setWorstCaseA] = useState("");
  const [worstCaseB, setWorstCaseB] = useState("");
  const [isReversible, setIsReversible] = useState(true);
  const [experiment24h, setExperiment24h] = useState("");
  const [finalChoice, setFinalChoice] = useState("");
  const [rationale, setRationale] = useState("");
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState("");

  // Review state
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [actualOutcome, setActualOutcome] = useState("");
  const [wasChoiceCorrect, setWasChoiceCorrect] = useState(true);
  const [lessonsLearned, setLessonsLearned] = useState("");

  const refresh = () => {
    setRecords(getDecisionRecords());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSave = () => {
    if (!title.trim() || !finalChoice.trim()) return;

    saveDecisionRecord({
      title,
      category,
      optionA: optionA || "Option A",
      optionB: optionB || "Option B",
      advantagesA: advantagesA.split("\n").filter((s) => s.trim()),
      advantagesB: advantagesB.split("\n").filter((s) => s.trim()),
      risksA: risksA.split("\n").filter((s) => s.trim()),
      risksB: risksB.split("\n").filter((s) => s.trim()),
      worstCaseA: worstCaseA || "Surviving temporary cash or emotional friction.",
      worstCaseB: worstCaseB || "Surviving temporary cash or emotional friction.",
      isReversible,
      experiment24h: experiment24h || "Conduct 1 informational interview or run a 24-hour test.",
      finalChoice,
      rationale,
      actionSteps: [step1, step2, step3].filter((s) => s.trim()),
    });

    setIsCreating(false);
    setStep(1);
    // Reset fields
    setTitle("");
    setOptionA("");
    setOptionB("");
    setAdvantagesA("");
    setAdvantagesB("");
    setRisksA("");
    setRisksB("");
    setWorstCaseA("");
    setWorstCaseB("");
    setExperiment24h("");
    setFinalChoice("");
    setRationale("");
    setStep1("");
    setStep2("");
    setStep3("");
    refresh();
  };

  const handleReviewSubmit = (id: string) => {
    if (!actualOutcome.trim() || !lessonsLearned.trim()) return;
    submitDecisionReview(id, {
      actualOutcome,
      wasChoiceCorrect,
      lessonsLearned,
    });
    setReviewingId(null);
    setActualOutcome("");
    setLessonsLearned("");
    refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HelpCircle className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Akuche Decision Lab
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Evaluate high-stakes crossroads with Socratic clarity, downside calculations, and 30-day review loops.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold shadow-sm transition hover:bg-emerald-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Decision Protocol</span>
          </button>
        )}
      </div>

      {/* ─── CREATION WIZARD ─── */}
      {isCreating && (
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-card p-4 sm:p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>STEP {step} OF 4</span>
            </div>
            <button
              onClick={() => {
                setIsCreating(false);
                setStep(1);
              }}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              Cancel
            </button>
          </div>

          {/* STEP 1: DEFINE DILEMMA */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  What specific decision are you facing?
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Should I leave my job to start a B2B consultancy?"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Option A (The Primary / New Route)
                  </label>
                  <input
                    type="text"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    placeholder="e.g. Launch the B2B consultancy full-time"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Option B (The Alternative / Safe Route)
                  </label>
                  <input
                    type="text"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="e.g. Build the consultancy as a side hustle while retaining salary"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  disabled={!title.trim() || !optionA.trim() || !optionB.trim()}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition hover:bg-emerald-700 disabled:opacity-40"
                >
                  <span>Next: Downside &amp; Risks</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DOWNSIDE & WORST-CASE ANALYSIS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-3">
                  <h4 className="text-xs font-black text-foreground">
                    Option A: Advantages &amp; Worst-Case
                  </h4>
                  <textarea
                    rows={2}
                    value={advantagesA}
                    onChange={(e) => setAdvantagesA(e.target.value)}
                    placeholder="Advantages (1 per line)..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={worstCaseA}
                    onChange={(e) => setWorstCaseA(e.target.value)}
                    placeholder="Worst-case scenario if Option A fails..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-3">
                  <h4 className="text-xs font-black text-foreground">
                    Option B: Advantages &amp; Worst-Case
                  </h4>
                  <textarea
                    rows={2}
                    value={advantagesB}
                    onChange={(e) => setAdvantagesB(e.target.value)}
                    placeholder="Advantages (1 per line)..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={worstCaseB}
                    onChange={(e) => setWorstCaseB(e.target.value)}
                    placeholder="Worst-case scenario if Option B fails..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Is this a Reversible Decision? (Two-Way Door)
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Can you undo this decision within 30 days if results disappoint?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReversible(!isReversible)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isReversible
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isReversible ? "Yes (Reversible)" : "No (One-Way Door)"}
                </button>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition hover:bg-emerald-700"
                >
                  <span>Next: 24h Test &amp; Choice</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: 24-HOUR TEST & FINAL CHOICE */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Design a 24-Hour Micro-Experiment</span>
                </label>
                <input
                  type="text"
                  value={experiment24h}
                  onChange={(e) => setExperiment24h(e.target.value)}
                  placeholder="e.g. Call 3 potential clients to pitch the pilot before quitting"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Your Final Decisive Choice
                </label>
                <input
                  type="text"
                  value={finalChoice}
                  onChange={(e) => setFinalChoice(e.target.value)}
                  placeholder="e.g. Option B: Retain job and secure 2 pilot clients first"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Why this choice makes the most sense (Rationale)
                </label>
                <textarea
                  rows={2}
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Eliminates financial panic, gives 60 days of validation..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
                <button
                  disabled={!finalChoice.trim()}
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition hover:bg-emerald-700 disabled:opacity-40"
                >
                  <span>Next: Action Plan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ACTION PLAN */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">
                  Define 3 Immediate Execution Steps
                </label>
                <input
                  type="text"
                  value={step1}
                  onChange={(e) => setStep1(e.target.value)}
                  placeholder="Step 1: Write down 1-page pilot service offer today"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={step2}
                  onChange={(e) => setStep2(e.target.value)}
                  placeholder="Step 2: Message 5 target prospects tomorrow morning"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={step3}
                  onChange={(e) => setStep3(e.target.value)}
                  placeholder="Step 3: Review pilot results in 14 days"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
                <p className="font-bold">Akuche 30-Day Decision Promise:</p>
                <p className="mt-0.5 text-[11px] opacity-90">
                  This decision will be locked with its action plan. In 30 days, Akuche will prompt you for an objective outcome review to evaluate what happened and improve your future judgment.
                </p>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold shadow-md transition hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Lock Decision &amp; Save</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── PAST DECISIONS LIST ─── */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
          Your Decision Portfolio &amp; 30-Day Loops ({records.length})
        </h3>

        {records.length === 0 && !isCreating && (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-6 text-center space-y-2">
            <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="text-xs font-bold text-foreground">
              You haven&apos;t recorded a decision yet.
            </p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Whenever you are facing a difficult personal, career, or business fork in the road, use the Decision Lab to eliminate second-guessing.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2 text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Evaluate a Decision</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {records.map((r) => {
            const isReviewDue =
              r.status === "active" &&
              new Date(r.reviewDueAt).getTime() <= new Date().getTime();

            return (
              <div
                key={r.id}
                className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                      {r.category} · {r.isReversible ? "Reversible (Two-Way)" : "Irreversible (One-Way)"}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-foreground mt-1">
                      {r.title}
                    </h4>
                  </div>

                  {r.status === "reviewed" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Reviewed</span>
                    </span>
                  ) : isReviewDue ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 animate-pulse">
                      <Clock className="h-3.5 w-3.5" />
                      <span>30-Day Review Ready</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Review in 30d</span>
                    </span>
                  )}
                </div>

                <div className="rounded-xl bg-muted/30 p-3 text-xs space-y-1">
                  <p className="font-bold text-foreground">
                    Chosen: <span className="text-emerald-600 dark:text-emerald-400">{r.finalChoice}</span>
                  </p>
                  {r.rationale && (
                    <p className="text-muted-foreground text-[11px]">{r.rationale}</p>
                  )}
                </div>

                {r.actionSteps && r.actionSteps.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-foreground">Execution Steps:</span>
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                      {r.actionSteps.map((stepText, idx) => (
                        <li key={idx}>{stepText}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 30-Day Review Box */}
                {r.status === "reviewed" && r.outcomeReview && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>30-Day Retrospective:</span>
                    </div>
                    <p className="text-foreground">{r.outcomeReview.actualOutcome}</p>
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-semibold">Lesson Learned:</span> {r.outcomeReview.lessonsLearned}
                    </p>
                  </div>
                )}

                {/* Review Action Button */}
                {r.status === "active" && reviewingId !== r.id && (
                  <button
                    onClick={() => setReviewingId(r.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Complete 30-Day Retrospective</span>
                  </button>
                )}

                {reviewingId === r.id && (
                  <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-3">
                    <h5 className="text-xs font-bold text-foreground">
                      30-Day Retrospective: How did this decision play out?
                    </h5>
                    <textarea
                      rows={2}
                      value={actualOutcome}
                      onChange={(e) => setActualOutcome(e.target.value)}
                      placeholder="What happened in reality? (Results, revenue, peace of mind)..."
                      className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={lessonsLearned}
                      onChange={(e) => setLessonsLearned(e.target.value)}
                      placeholder="What did you learn about your assumptions?"
                      className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setReviewingId(null)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!actualOutcome.trim() || !lessonsLearned.trim()}
                        onClick={() => handleReviewSubmit(r.id)}
                        className="rounded-lg bg-emerald-600 text-white px-4 py-1.5 text-xs font-bold disabled:opacity-40"
                      >
                        Save Retrospective
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
