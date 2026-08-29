"use client";

import { useState } from "react";
import Link from "next/link";
import {
  generateTransformationReport,
  BrainTransformationReport,
} from "@/lib/life-performance";
import {
  Sparkles,
  TrendingUp,
  Brain,
  Briefcase,
  Zap,
  Flame,
  ArrowRight,
  Share2,
  Calendar,
  CheckCircle2,
  Award,
  ArrowLeft,
  Target,
} from "lucide-react";
import { ShareableVictoryCard } from "@/components/sharing/shareable-victory-card";

export default function TransformationPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<30 | 60 | 90 | 180>(90);
  const [showShareModal, setShowShareModal] = useState(false);

  const report: BrainTransformationReport = generateTransformationReport(selectedPeriod);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-3 sm:px-4 lg:px-6 py-4 pb-24 overflow-x-hidden touch-manipulation">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Personal Neuroplastic Transformation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Brain &amp; Real-Life Transformation
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            &ldquo;BrainGym does not train people to become better at BrainGym. It trains your brain for your real life.&rdquo;
          </p>
        </div>

        {/* Period Switcher (30d / 60d / 90d / 180d) */}
        <div className="inline-flex rounded-2xl bg-muted p-1 border border-border text-xs font-bold w-fit shrink-0">
          {[30, 60, 90, 180].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedPeriod(days as any)}
              className={`px-3.5 py-2 rounded-xl transition ${
                selectedPeriod === days
                  ? "bg-card text-foreground font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* ─── 1. CORE BEFORE & AFTER HERO TILES ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Brain Momentum */}
        <div className="rounded-3xl border-2 border-violet-500/40 bg-gradient-to-br from-violet-500/15 via-card to-purple-500/10 p-5 space-y-2 shadow-md">
          <span className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-400 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" />
            Brain Momentum
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-muted-foreground line-through">
              {report.brainMomentum.start}
            </span>
            <ArrowRight className="h-4 w-4 text-violet-500" />
            <span className="text-3xl font-black text-foreground">
              {report.brainMomentum.current}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Consistent cognitive habit velocity over {selectedPeriod} days.
          </p>
        </div>

        {/* In-App Brain Fitness */}
        <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-indigo-500/10 p-5 space-y-2 shadow-md">
          <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
            <Brain className="h-3.5 w-3.5" />
            Brain Fitness (In-App)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-muted-foreground line-through">
              {report.brainFitness.start}
            </span>
            <ArrowRight className="h-4 w-4 text-primary" />
            <span className="text-3xl font-black text-foreground">
              {report.brainFitness.current}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Multi-domain cognitive capacity across memory, speed &amp; focus.
          </p>
        </div>

        {/* Real-Life Performance */}
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-card to-teal-500/10 p-5 space-y-2 shadow-md">
          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            Life Performance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-muted-foreground line-through">
              {report.lifePerformance.start}
            </span>
            <ArrowRight className="h-4 w-4 text-emerald-500" />
            <span className="text-3xl font-black text-foreground">
              {report.lifePerformance.current}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Measurable real-world execution: deep work, recall &amp; decision stamina.
          </p>
        </div>
      </div>

      {/* ─── 2. REAL-LIFE FUNCTIONAL PROGRESS (THE PROOF) ────────────────────── */}
      <div className="rounded-3xl border-2 border-border bg-card p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Transfer to Everyday Life
            </span>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              Real-World Functional Measurement
            </h2>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            4 Real-World Indicators Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {report.realLifeProgress.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-background/90 p-4 space-y-2 shadow-sm"
            >
              <span className="text-xs font-black text-foreground block">
                {item.label}
              </span>

              <div className="flex items-baseline gap-2 text-sm font-black">
                <span className="text-muted-foreground line-through font-bold text-xs">
                  {item.startValue}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-base text-emerald-600 dark:text-emerald-400 font-black">
                  {item.currentValue}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {item.improvementSummary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. BIGGEST DEVELOPMENT SPOTLIGHT ───────────────────────────────── */}
      <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10 p-6 sm:p-7 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-wider">
          <Award className="h-4 w-4" />
          <span>YOUR BIGGEST DEVELOPMENT AREA</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-foreground">
          {report.biggestDevelopment.title} ({report.biggestDevelopment.domain})
        </h3>

        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
          {report.biggestDevelopment.narrative}
        </p>
      </div>

      {/* ─── 4. COGNITIVE DOMAIN BEFORE & AFTER DELTAS ──────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-black text-foreground">
          Cognitive Domain Shifts ({selectedPeriod}-Day Trajectory)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {report.domainChanges.map((dom) => (
            <div
              key={dom.domain}
              className="rounded-2xl border border-border/80 bg-background p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-foreground">{dom.domain}</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">
                  +{dom.deltaPercent}%
                </span>
              </div>

              <div className="flex items-baseline gap-2 text-xs font-bold">
                <span className="text-muted-foreground line-through">{dom.startScore}</span>
                <ArrowRight className="h-3 w-3 text-primary" />
                <span className="text-sm font-black text-foreground">{dom.currentScore}/100</span>
              </div>

              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                  style={{ width: `${dom.currentScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 5. JOURNEY STATS & SHARE ACTION ─────────────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center w-full sm:w-auto">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">Workouts</span>
            <span className="text-base font-black text-foreground">{report.journeyStats.workoutsCompleted}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">Life Challenges</span>
            <span className="text-base font-black text-foreground">{report.journeyStats.lifeChallengesCompleted}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">Training Days</span>
            <span className="text-base font-black text-foreground">{report.journeyStats.trainingDays}d</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">Longest Streak</span>
            <span className="text-base font-black text-orange-500">{report.journeyStats.longestStreak}d</span>
          </div>
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-6 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[46px] shrink-0"
        >
          <Share2 className="h-4 w-4" />
          <span>SHARE MY TRANSFORMATION</span>
        </button>
      </div>

      {/* Share Victory Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg">
            <ShareableVictoryCard
              activityTitle={`${selectedPeriod}-Day Brain Transformation`}
              score={report.lifePerformance.current}
              streakDays={report.journeyStats.longestStreak}
              momentumScore={report.brainMomentum.current}
              onClose={() => setShowShareModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
