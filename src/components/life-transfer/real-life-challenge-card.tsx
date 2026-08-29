"use client";

import { useState } from "react";
import { LifeTransferChallenge } from "@/lib/life-transfer/types";
import { recordLifeTransferSubmission } from "@/lib/life-performance/engine";
import {
  Compass,
  Sparkles,
  Clock,
  CheckCircle2,
  Brain,
  ShieldCheck,
  Send,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface RealLifeChallengeCardProps {
  challenge: LifeTransferChallenge;
}

export function RealLifeChallengeCard({ challenge }: RealLifeChallengeCardProps) {
  const { user } = useAuth();
  const [recordedValue, setRecordedValue] = useState("");
  const [reflection, setReflection] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordedValue || isSubmitted) return;

    setSubmitting(true);
    await recordLifeTransferSubmission(
      challenge.id,
      challenge.title,
      challenge.targetDomain,
      recordedValue,
      challenge.whatToRecord.unit,
      reflection,
      challenge.xpReward,
      user?.id
    );
    setSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/15 via-card to-orange-500/15 p-6 sm:p-7 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Brain-to-Life Application Challenge
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
              {challenge.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-1 text-xs font-bold text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-foreground" />
            <span>{challenge.durationMinutes} Min</span>
          </span>
          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400">
            +{challenge.xpReward} XP
          </span>
        </div>
      </div>

      {/* 4-Part Structured Explanation: WHAT TO DO · WHY · RECORD · SKILL */}
      <div className="space-y-3 text-xs">
        <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
          <span className="text-[10px] font-black uppercase text-foreground flex items-center gap-1">
            👉 WHAT TO DO
          </span>
          <p className="text-foreground/90 font-medium leading-relaxed">
            {challenge.whatToDo}
          </p>
        </div>

        <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
          <span className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
            💡 WHY YOU ARE DOING IT
          </span>
          <p className="text-muted-foreground font-medium leading-relaxed">
            {challenge.whyYouAreDoingIt}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground px-1">
          <span>🧠 Skill Trained: <strong className="text-foreground">{challenge.whatSkillItTrains}</strong></span>
          <span className="capitalize">Category: {challenge.lifePerformanceCategory.replace(/_/g, " ")}</span>
        </div>
      </div>

      {/* ─── WHAT TO RECORD (INTERACTIVE SUBMISSION FORM) ───────────────────── */}
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="rounded-2xl border-2 border-primary/30 bg-card p-4 space-y-3 shadow-sm">
          <span className="text-[11px] font-black uppercase text-primary block">
            📝 RECORD TODAY&apos;S REAL-LIFE RESULT
          </span>

          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">
              {challenge.whatToRecord.label} ({challenge.whatToRecord.unit || "result"})
            </label>
            <input
              type="text"
              required
              placeholder={challenge.whatToRecord.placeholder || "Enter result..."}
              value={recordedValue}
              onChange={(e) => setRecordedValue(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground block">
              Quick Reflection / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="How did your focus feel? What did you notice?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !recordedValue}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-3.5 px-5 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[46px] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>SUBMIT REAL-LIFE RESULT (+{challenge.xpReward} XP)</span>
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 p-4 text-center space-y-1.5 animate-in fade-in">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>REAL-LIFE CHALLENGE COMPLETED &amp; RECORDED!</span>
          </div>
          <p className="text-xs text-foreground font-semibold">
            Result: {recordedValue} {challenge.whatToRecord.unit || ""} · +{challenge.xpReward} XP Awarded
          </p>
          <p className="text-[11px] text-muted-foreground italic">
            This data has been added to your Life Performance Index and Transformation Report.
          </p>
        </div>
      )}
    </div>
  );
}
