"use client";

import Link from "next/link";
import { WeeklyBrainReport } from "@/lib/brain-momentum-engine";
import {
  Sparkles,
  TrendingUp,
  Target,
  Trophy,
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface WeeklyBrainReportCardProps {
  report: WeeklyBrainReport;
}

export function WeeklyBrainReportCard({ report }: WeeklyBrainReportCardProps) {
  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 p-6 sm:p-7 shadow-lg space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/25">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
              Cognitive Fitness Summary
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              YOUR WEEK IN BRAIN FITNESS
            </h2>
          </div>
        </div>

        <span className="rounded-full bg-background border border-border px-3 py-1 text-xs font-bold text-muted-foreground">
          {report.weekStart}
        </span>
      </div>

      {/* 5-Metric Quick Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase block">
            Brain Momentum
          </span>
          <p className="text-xl font-black text-foreground flex items-center gap-1">
            <span>{report.momentumScore}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              (+{Math.max(1, report.momentumDelta)})
            </span>
          </p>
        </div>

        <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase block">
            Strongest Area
          </span>
          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 truncate">
            {report.strongestArea}
          </p>
        </div>

        <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase block">
            Focus Area
          </span>
          <p className="text-sm font-black text-amber-600 dark:text-amber-400 truncate">
            {report.areaNeedingAttention}
          </p>
        </div>

        <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase block">
            Consistency
          </span>
          <p className="text-xl font-black text-foreground">
            {report.consistencyDays}/7 Days
          </p>
        </div>
      </div>

      {/* Next Week's Focus Banner */}
      <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-1.5">
        <span className="text-[11px] font-black uppercase text-primary flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Next Week&apos;s Adaptive Focus
        </span>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          &ldquo;{report.nextWeekFocus}&rdquo;
        </p>
      </div>

      {/* CTA */}
      <div className="pt-1">
        <Link
          href="/dashboard"
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-5 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[46px]"
        >
          <span>TRAIN TODAY&apos;S PRESCRIBED PLAN</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
