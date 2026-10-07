"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  Zap,
  Target,
  RotateCcw,
} from "lucide-react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";

export interface ActivityFeedbackProps {
  isOpen: boolean;
  activityTitle: string;
  categoryName: string;
  skillsPracticed: string[];
  cognitiveInsight: string;
  realLifeApplication: string;
  xpEarned?: number;
  onContinue: () => void;
  onRetry?: () => void;
  nextActivityHref?: string;
}

export function ActivityFeedbackModal({
  isOpen,
  activityTitle,
  categoryName,
  skillsPracticed,
  cognitiveInsight,
  realLifeApplication,
  xpEarned = 50,
  onContinue,
  onRetry,
  nextActivityHref = "/dashboard",
}: ActivityFeedbackProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-background p-5 sm:p-7 shadow-2xl text-foreground space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Brand Mark & Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="mx-auto flex justify-center mb-2">
            <AkucheBrandLogo variant="mark" size="md" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Good thinking.
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Session complete · {activityTitle}
          </p>
        </div>

        {/* Skills Practiced Section (Section 29) */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5" />
            <span>YOU PRACTISED:</span>
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {skillsPracticed.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-xl bg-card border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-foreground shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Cognitive & Life Transfer Insight */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>HOW THIS TRANSFERS TO REAL LIFE:</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
            {realLifeApplication || cognitiveInsight}
          </p>
        </div>

        {/* Subtle XP Token Display */}
        <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-emerald-500" />
            <span>Action points logged</span>
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            +{xpEarned} XP
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card hover:bg-muted text-foreground px-4 py-3 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Practice Again</span>
            </button>
          )}

          <Link
            href={nextActivityHref}
            onClick={onContinue}
            className="flex-1 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/20 transition active:scale-95 touch-manipulation min-h-[48px]"
          >
            <span>Continue Your Journey</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
