"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DailyBrainDrop,
  isCardSaved,
  saveBrainCard,
  removeSavedCard,
  recordMissionCompletion,
} from "@/lib/brain-universe";
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Share2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Brain,
  Clock,
  ArrowRight,
  HelpCircle,
  Zap,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface TodaysBrainHeroCardProps {
  drop: DailyBrainDrop;
}

export function TodaysBrainHeroCard({ drop }: TodaysBrainHeroCardProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [selectedMicroAnswer, setSelectedMicroAnswer] = useState<string | null>(null);
  const [mythAnswered, setMythAnswered] = useState<boolean | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    setSaved(isCardSaved(drop.id));
  }, [drop.id]);

  const handleToggleBookmark = () => {
    if (saved) {
      removeSavedCard(drop.id);
      setSaved(false);
    } else {
      saveBrainCard(drop);
      setSaved(true);
    }
  };

  const handleCompleteMission = async () => {
    if (missionCompleted) return;
    setMissionCompleted(true);
    await recordMissionCompletion(drop, user?.id);
  };

  const handleShare = async () => {
    const text = `Today's Brain Discovery on BrainGym: 🧠\n\n"${drop.title}"\n\n💡 ${drop.discovery}\n\n👉 Try This: ${drop.useItToday.action}\n\nDiscover more on BrainGym: https://braingym-live.vercel.app/`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: drop.title,
          text,
          url: "https://braingym-live.vercel.app/",
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-6 sm:p-8 shadow-xl space-y-5 transition-all">
      {/* Subtle Glow Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-primary">
            DAILY BRAIN DROP
          </span>
          <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
            {drop.category}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleBookmark}
            title={saved ? "Saved to My Brain Library" : "Save Brain Card"}
            className={`rounded-xl border p-2 transition active:scale-90 ${
              saved
                ? "border-amber-500/50 bg-amber-500/15 text-amber-500"
                : "border-border bg-background/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>

          <button
            onClick={handleShare}
            title="Share Discovery"
            className="rounded-xl border border-border bg-background/80 p-2 text-muted-foreground hover:text-foreground transition active:scale-90"
          >
            {copiedShare ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ─── 1. BIG IDEA (ONE WOW PRINCIPLE) ─────────────────────────────────── */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
          {drop.title}
        </h1>
        <p className="text-sm sm:text-base text-foreground/90 font-medium leading-relaxed">
          {drop.discovery}
        </p>
      </div>

      {/* ─── 2. WHY IT MATTERS ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-background/80 p-3.5 space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
          Why It Matters
        </span>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          {drop.whyItMatters}
        </p>
      </div>

      {/* ─── 3. USE IT TODAY (PRACTICAL ACTION MISSION) ──────────────────────── */}
      <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/15 via-background to-violet-500/15 p-4 sm:p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-primary flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-primary fill-primary" />
            USE IT TODAY
          </span>
          <span className="text-[10px] font-bold text-muted-foreground">
            +{drop.useItToday.xpReward} XP Reward
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-black text-foreground">
          {drop.useItToday.action}
        </h3>

        <p className="text-xs sm:text-sm text-foreground/80 font-medium leading-relaxed">
          {drop.useItToday.mission}
        </p>

        <div className="pt-1">
          <button
            onClick={handleCompleteMission}
            disabled={missionCompleted}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-black transition min-h-[46px] active:scale-[0.98] ${
              missionCompleted
                ? "bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 cursor-default"
                : "bg-primary text-white shadow-md shadow-primary/25 hover:brightness-110"
            }`}
          >
            {missionCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>MISSION COMPLETED (+{drop.useItToday.xpReward} XP)</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>TRY THIS MISSION TODAY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── 4. OPTIONAL INTERACTIVE MICRO-CHALLENGE / MYTH CHECK ────────────── */}
      {drop.microChallenge && (
        <div className="rounded-2xl border border-border bg-background/90 p-4 space-y-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            60-Second Micro-Challenge
          </span>
          <p className="text-xs sm:text-sm font-bold text-foreground">
            {drop.microChallenge.question}
          </p>

          <div className="space-y-1.5 pt-1">
            {drop.microChallenge.options.map((opt, idx) => {
              const isSelected = selectedMicroAnswer === opt;
              const isCorrect = opt === drop.microChallenge?.correctAnswer;
              let btnClass = "border-border bg-card hover:border-primary/40 text-foreground";

              if (selectedMicroAnswer !== null) {
                if (isSelected && isCorrect) {
                  btnClass = "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black";
                } else if (isSelected && !isCorrect) {
                  btnClass = "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400";
                } else if (isCorrect) {
                  btnClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedMicroAnswer !== null}
                  onClick={() => setSelectedMicroAnswer(opt)}
                  className={`w-full text-left rounded-xl border p-2.5 text-xs font-semibold transition active:scale-[0.99] flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {selectedMicroAnswer !== null && isCorrect && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 ml-1.5" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedMicroAnswer !== null && (
            <p className="text-[11px] text-muted-foreground pt-1 italic leading-relaxed animate-in fade-in">
              {drop.microChallenge.explanation}
            </p>
          )}
        </div>
      )}

      {/* ─── 5. PROGRESSIVE DISCLOSURE (LEARN MORE) ──────────────────────────── */}
      <div className="pt-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full inline-flex items-center justify-between rounded-2xl border border-border bg-card/80 px-4 py-3 text-xs font-bold text-muted-foreground hover:text-foreground transition active:scale-[0.99] min-h-[42px]"
        >
          <span className="flex items-center gap-1.5 text-foreground font-black">
            <Brain className="h-4 w-4 text-primary" />
            {isExpanded ? "Hide Scientific Context" : "Learn More & Scientific Context"}
          </span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {isExpanded && (
          <div className="mt-3 rounded-2xl border border-border bg-background p-4 space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-muted-foreground">
                Scientific Context &amp; Evidence
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
                {drop.scientificContext.evidenceLevel}
              </span>
            </div>

            <p className="text-foreground/90 font-medium leading-relaxed">
              {drop.scientificContext.explanation}
            </p>

            {drop.scientificContext.keyStudy && (
              <div className="rounded-xl bg-muted/60 p-2.5 text-[10px] text-muted-foreground italic border-l-2 border-primary">
                Reference: {drop.scientificContext.keyStudy}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-border/60">
              <span className="text-[10px] text-muted-foreground font-mono">
                {drop.cardId}
              </span>
              <Link
                href={`/dashboard/workout?domain=${drop.relatedWorkoutDomain.toLowerCase()}`}
                className="inline-flex items-center gap-1 text-[11px] font-black text-primary hover:underline"
              >
                <span>Train {drop.relatedWorkoutDomain} Now</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
