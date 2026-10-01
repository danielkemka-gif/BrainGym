"use client";

import React from "react";
import { LoggedWorkoutHistoryItem } from "@/lib/journal/journal-sync";
import { useI18n } from "@/lib/i18n";
import { X, Calendar, Award, Compass, Footprints, Pencil, BookOpen } from "lucide-react";

interface WorkoutReviewModalProps {
  workout: LoggedWorkoutHistoryItem | null;
  onClose: () => void;
}

export function WorkoutReviewModal({ workout, onClose }: WorkoutReviewModalProps) {
  const { t, isRtl } = useI18n();

  if (!workout) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider block">
              {t.review_workout_modal_title}
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground">{workout.title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {workout.date}
              </span>
              <span>•</span>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                {workout.skill}
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                +{workout.xpEarned} XP
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. Scenario Summary */}
        <div className="space-y-1 rounded-2xl bg-muted/50 border border-border p-3.5">
          <span className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
            <BookOpen className="h-3 w-3 text-primary" />
            {t.review_scenario_label}
          </span>
          <p className="text-xs text-foreground font-medium leading-relaxed">
            &ldquo;{workout.scenarioSummary}&rdquo;
          </p>
        </div>

        {/* 2. Chosen Decision */}
        <div className="space-y-1 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5">
          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Compass className="h-3 w-3" />
            {t.review_decision_label}
          </span>
          <p className="text-xs text-foreground font-bold">
            {workout.userDecisionText}
          </p>
        </div>

        {/* 3. Real-World Action */}
        <div className="space-y-1 rounded-2xl bg-violet-500/10 border border-violet-500/20 p-3.5">
          <span className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-400 flex items-center gap-1">
            <Footprints className="h-3 w-3" />
            {t.review_action_label}
          </span>
          <p className="text-xs text-foreground font-medium">
            {workout.realWorldAction}
          </p>
        </div>

        {/* 4. Reflection */}
        <div className="space-y-1 rounded-2xl bg-background border border-border p-3.5">
          <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
            <Pencil className="h-3 w-3" />
            {t.review_reflection_label}
          </span>
          <p className="text-xs text-foreground/90 font-medium whitespace-pre-line leading-relaxed">
            {workout.reflectionText}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-primary text-white py-3 text-xs font-black hover:brightness-110 active:scale-95 transition"
        >
          {t.review_close}
        </button>
      </div>
    </div>
  );
}
