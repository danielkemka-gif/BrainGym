"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllJourneys,
  getJourneyById,
  getActiveJourneyId,
  setActiveJourneyId,
  getJourneyProgress,
  completeJourneyStage,
  AkucheJourney,
  UserJourneyProgress,
} from "@/lib/akuche/journeys-engine";
import { ContextualGuidanceBanner } from "@/components/layout/contextual-guidance-banner";
import {
  Compass,
  Briefcase,
  DollarSign,
  Zap,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Flame,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function JourneysPage() {
  const [journeys] = useState<AkucheJourney[]>(getAllJourneys());
  const [activeJourneyId, setActiveJourneyState] = useState<string>("build-business");
  const [progress, setProgress] = useState<UserJourneyProgress | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<AkucheJourney | null>(null);

  const refreshState = () => {
    const activeId = getActiveJourneyId();
    setActiveJourneyState(activeId);
    const j = getJourneyById(activeId) || journeys[0];
    setSelectedJourney(j);
    setProgress(getJourneyProgress(activeId));
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleSelectJourney = (id: string) => {
    setActiveJourneyId(id);
    setActiveJourneyState(id);
    const j = getJourneyById(id);
    if (j) setSelectedJourney(j);
    setProgress(getJourneyProgress(id));
  };

  const handleCompleteStage = (stageIdx: number) => {
    if (!selectedJourney) return;
    const updated = completeJourneyStage(selectedJourney.id, stageIdx);
    setProgress(updated);
  };

  if (!selectedJourney || !progress) return null;

  const currentStage =
    selectedJourney.stages[progress.currentStageIndex] || selectedJourney.stages[0];
  const percentComplete = Math.round(
    (progress.completedStages.length / selectedJourney.stages.length) * 100
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 overflow-x-hidden px-3 sm:px-4 py-3 pb-24 touch-manipulation">
      <ContextualGuidanceBanner
        featureKey="journeys"
        title="Structured Journeys from Idea to Execution"
        description="Follow progressive, step-by-step tracks designed to eliminate guesswork and build consistent real-world momentum."
      />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Compass className="h-4 w-4" />
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Akuche Journeys
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Structured roadmaps that turn ambiguous life goals into clear sequential milestones.
        </p>
      </div>

      {/* ─── ACTIVE JOURNEY HERO CARD (WHERE AM I? WHAT'S NEXT?) ─── */}
      <div className="rounded-2xl sm:rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-black text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              CURRENT ACTIVE JOURNEY
            </span>
            <h2 className="text-lg sm:text-xl font-black text-foreground mt-1.5">
              {selectedJourney.title}
            </h2>
            <p className="text-xs text-muted-foreground">{selectedJourney.tagline}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-foreground">
              {progress.completedStages.length} of {selectedJourney.stages.length} Milestones
            </span>
            <div className="w-32 sm:w-36 h-2 rounded-full bg-muted overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current Active Stage */}
        <div className="space-y-3 rounded-2xl border border-border/80 bg-background/80 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <span>STAGE {currentStage.stageNumber} OF {selectedJourney.stages.length}</span>
              <span>·</span>
              <span>{currentStage.category}</span>
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              ~{currentStage.estimatedMinutes} min
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {currentStage.title}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {currentStage.objective}
          </p>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs space-y-1">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
              TODAY&apos;S PRACTICAL ACTION:
            </span>
            <p className="text-foreground">{currentStage.practicalAction}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              <span className="font-semibold">Done when:</span> {currentStage.doneWhen}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
            <Link
              href={`/dashboard/ask?prompt=${encodeURIComponent(
                `Help me work on ${selectedJourney.title} - Stage ${currentStage.stageNumber}: ${currentStage.title}. Context: ${currentStage.practicalAction}`
              )}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Ask Akuche for Guidance</span>
            </Link>

            <button
              onClick={() => handleCompleteStage(progress.currentStageIndex)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark Milestone Complete</span>
            </button>
          </div>
        </div>

        {/* All Stages Stepper */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
            Journey Sequence
          </span>
          <div className="space-y-1.5">
            {selectedJourney.stages.map((stg, idx) => {
              const isDone = progress.completedStages.includes(idx);
              const isCurrent = progress.currentStageIndex === idx;

              return (
                <div
                  key={stg.id}
                  onClick={() => {
                    if (isDone || isCurrent) {
                      setProgress((prev) =>
                        prev ? { ...prev, currentStageIndex: idx } : prev
                      );
                    }
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                    isCurrent
                      ? "border-emerald-500 bg-emerald-500/10 font-bold text-foreground"
                      : isDone
                      ? "border-border/60 bg-card/60 text-muted-foreground"
                      : "border-border/40 bg-muted/20 text-muted-foreground/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-emerald-600/20 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isDone ? "✓" : stg.stageNumber}
                    </span>
                    <span className="text-xs truncate">{stg.title}</span>
                  </div>

                  <span className="text-[10px] uppercase font-bold shrink-0">
                    {isDone ? "Completed" : isCurrent ? "Active" : "Locked"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── ALL AVAILABLE JOURNEYS ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
          Explore Other Journeys ({journeys.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {journeys.map((j) => {
            const isActive = j.id === activeJourneyId;
            const jProg = getJourneyProgress(j.id);
            const jPercent = Math.round(
              (jProg.completedStages.length / j.stages.length) * 100
            );

            return (
              <div
                key={j.id}
                onClick={() => handleSelectJourney(j.id)}
                className={`group rounded-2xl border p-4 transition cursor-pointer ${
                  isActive
                    ? "border-emerald-500 bg-card ring-2 ring-emerald-500/20"
                    : "border-border/80 bg-card/70 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                    {j.category} · {j.stages.length} Stages
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-foreground mt-2 group-hover:text-emerald-600 transition">
                  {j.title}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                  {j.tagline}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-2">
                  <span>{jProg.completedStages.length} of {j.stages.length} done</span>
                  <span className="font-bold">{jPercent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
