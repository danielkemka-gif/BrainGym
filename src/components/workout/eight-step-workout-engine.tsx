"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { BRAND_CONFIG } from "@/config/brand";
import {
  getTodaysRealWorldChallenge,
  markChallengeCompletedLocally,
  RealWorldChallengeDefinition,
  LocalizedChallengeContent,
  DecisionOption,
} from "@/lib/real-world-thinking-engine";
import { logCompletedWorkoutToJournal } from "@/lib/journal/journal-sync";
import { ContextualChallengeVisual } from "@/components/visuals/contextual-challenge-visual";
import { JournalShareCardModal } from "@/components/journal/journal-share-card-modal";
import { QuickBrainBreakModal } from "@/components/brain-breaks/quick-brain-break-modal";
import { Confetti } from "@/components/ui/confetti";
import {
  Brain,
  Lightbulb,
  Scale,
  Compass,
  Zap,
  Footprints,
  Pencil,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
  Flame,
  Award,
} from "lucide-react";

type WorkoutStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export function EightStepWorkoutEngine() {
  const { user } = useAuth();
  const { locale, t, isRtl } = useI18n();

  const [challenge, setChallenge] = useState<RealWorldChallengeDefinition | null>(null);
  const [content, setContent] = useState<LocalizedChallengeContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Current Active Step
  const [currentStep, setCurrentStep] = useState<WorkoutStep>(1);

  // Step 2: Think selections
  const [identifiedFacts, setIdentifiedFacts] = useState<string[]>([]);

  // Step 4: Decision state
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  // Step 5: Cognitive Drill state
  const [selectedDrillOptionId, setSelectedDrillOptionId] = useState<string | null>(null);
  const [isDrillCorrect, setIsDrillCorrect] = useState<boolean | null>(null);

  // Step 6: Action state
  const [actionTimerSeconds, setActionTimerSeconds] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [actionCommitted, setActionCommitted] = useState(false);

  // Step 7: Reflection state
  const [reflectionText, setReflectionText] = useState("");

  // Step 8: Completion state
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBrainBreakModal, setShowBrainBreakModal] = useState(false);

  useEffect(() => {
    getTodaysRealWorldChallenge(user?.id, 2, locale).then(({ challenge: assignedChallenge }) => {
      setChallenge(assignedChallenge);
      const localized = assignedChallenge.translations[locale] || assignedChallenge.translations.en;
      setContent(localized || null);
      if (localized?.suggestedTakeaway) {
        setReflectionText(localized.suggestedTakeaway);
      }
      setLoading(false);
    });
  }, [user, locale]);

  // Action timer countdown
  useEffect(() => {
    if (!isTimerRunning || actionTimerSeconds <= 0) return;
    const interval = setInterval(() => {
      setActionTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setActionCommitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, actionTimerSeconds]);

  if (loading || !challenge || !content) {
    return (
      <div className="mx-auto w-full max-w-xl p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded-xl w-1/3 mx-auto" />
        <div className="h-64 bg-muted rounded-3xl" />
        <div className="h-12 bg-muted rounded-2xl" />
      </div>
    );
  }

  // ─── STEP PROGRESS BAR ───────────────────────────────────────────────────────
  const stepTitles = [
    t.step_1_scenario,
    t.step_2_think,
    t.step_3_analyse,
    t.step_4_decide,
    t.step_5_brain_challenge,
    t.step_6_act,
    t.step_7_reflect,
    t.step_8_record,
  ];

  const handleFinishAndRecord = async () => {
    setIsSavingRecord(true);
    const chosenOption = content.decisionOptions.find((o) => o.id === selectedDecisionId);

    markChallengeCompletedLocally(challenge.id, user?.id, {
      selectedDecisionId: selectedDecisionId || undefined,
      isRecommendedChoice: chosenOption?.isRecommended,
      cognitiveDrillScore: isDrillCorrect ? 100 : 75,
      actionCommitted: true,
      userReflectionText: reflectionText,
      xpEarned: challenge.xpReward,
      coinsEarned: challenge.coinReward,
      locale,
    });

    await logCompletedWorkoutToJournal(
      challenge,
      {
        selectedDecisionId: selectedDecisionId || undefined,
        cognitiveDrillScore: isDrillCorrect ? 100 : 75,
        userReflectionText: reflectionText,
        xpEarned: challenge.xpReward,
        coinsEarned: challenge.coinReward,
      },
      locale
    );

    setIsSavingRecord(false);
    setCurrentStep(8);
  };

  return (
    <div className={`mx-auto w-full max-w-xl space-y-4 pb-24 touch-manipulation ${isRtl ? "text-right" : "text-left"}`}>
      {/* ─── 8-STEP PROGRESS TRACKER ────────────────────────────────────────── */}
      <div className="space-y-1.5 bg-card border border-border p-3.5 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-primary font-black uppercase text-[10px] sm:text-xs">
            {stepTitles[currentStep - 1]}
          </span>
          <span className="text-muted-foreground text-[10px] sm:text-xs">
            {currentStep} {t.general_of} 8
          </span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─── STEP 1: REAL-LIFE SCENARIO ──────────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase">
                {content.contextPill}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-foreground">{content.title}</h2>
            </div>
            <ContextualChallengeVisual category={challenge.skill} size="sm" />
          </div>

          <div className="rounded-2xl bg-muted/60 border border-border p-4 text-xs sm:text-sm font-medium text-foreground leading-relaxed">
            &ldquo;{content.scenarioNarrative}&rdquo;
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-bold">
              <Clock className="h-3.5 w-3.5" />
              {challenge.estimatedMinutes} min session · +{challenge.xpReward} XP
            </span>

            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-3 text-xs sm:text-sm font-black text-white hover:brightness-110 active:scale-95 transition shadow-md shadow-primary/25"
            >
              <span>{t.step_next}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 2: THINK & IDENTIFY ────────────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
              <Lightbulb className="h-3.5 w-3.5" />
              {t.step_2_think}
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground">{t.step_think_instruction}</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground block">Key Facts & Underlying Tensions:</span>
            {content.keyFactsToIdentify.map((fact, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-2xl bg-muted/50 border border-border p-3 text-xs font-semibold text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{fact}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-amber-500 block">Hidden Assumptions to Challenge:</span>
            {content.hiddenAssumptions.map((assump, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs font-semibold text-foreground"
              >
                <span className="text-amber-500 font-black">⚠️</span>
                <span>{assump}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={() => setCurrentStep(1)}
              className="rounded-2xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              {t.step_back}
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-3 text-xs sm:text-sm font-black text-white hover:brightness-110 active:scale-95 transition shadow-md shadow-primary/25"
            >
              <span>{t.step_next}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 3: ANALYSE PERSPECTIVES ───────────────────────────────────── */}
      {currentStep === 3 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
              <Scale className="h-3.5 w-3.5" />
              {t.step_3_analyse}
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground">{t.step_analyse_instruction}</h2>
          </div>

          <div className="space-y-3">
            {content.perspectives.map((p, idx) => (
              <div key={idx} className="rounded-2xl bg-muted/40 border border-border p-3.5 space-y-1.5">
                <span className="text-xs font-black text-foreground block">{p.title}</span>
                <p className="text-xs text-muted-foreground font-medium">{p.viewpoint}</p>
                <div className="rounded-xl bg-background/80 p-2 text-[11px] text-amber-600 dark:text-amber-400 font-bold border border-border/40">
                  Risk / Trade-off: {p.risk}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={() => setCurrentStep(2)}
              className="rounded-2xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              {t.step_back}
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-3 text-xs sm:text-sm font-black text-white hover:brightness-110 active:scale-95 transition shadow-md shadow-primary/25"
            >
              <span>{t.step_next}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 4: DECIDE & EVALUATE ──────────────────────────────────────── */}
      {currentStep === 4 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" />
              {t.step_4_decide}
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground">{content.decideQuestion}</h2>
          </div>

          <div className="space-y-2.5">
            {content.decisionOptions.map((opt) => {
              const isSelected = selectedDecisionId === opt.id;
              return (
                <div key={opt.id} className="space-y-2">
                  <button
                    onClick={() => setSelectedDecisionId(opt.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition active:scale-[0.99] flex items-start gap-3 ${
                      isSelected
                        ? opt.isRecommended
                          ? "border-emerald-500 bg-emerald-500/10 shadow-md"
                          : "border-amber-500 bg-amber-500/10 shadow-md"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        isSelected
                          ? opt.isRecommended
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {opt.letter}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-foreground leading-relaxed">
                      {opt.text}
                    </span>
                  </button>

                  {/* Immediate Feedback when selected */}
                  {isSelected && (
                    <div className="rounded-2xl bg-background border border-border p-3 text-xs space-y-1.5 animate-in fade-in">
                      <div className="font-bold text-foreground">{opt.strategyRationale}</div>
                      <div className="text-muted-foreground text-[11px]">
                        <span className="font-bold text-primary">Consequence: </span>
                        {opt.immediateConsequence}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={() => setCurrentStep(3)}
              className="rounded-2xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              {t.step_back}
            </button>
            <button
              disabled={!selectedDecisionId}
              onClick={() => setCurrentStep(5)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-3 text-xs sm:text-sm font-black text-white hover:brightness-110 active:scale-95 transition shadow-md shadow-primary/25 disabled:opacity-40"
            >
              <span>{t.step_next}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 5: COGNITIVE DRILL ─────────────────────────────────────────── */}
      {currentStep === 5 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              {t.step_5_brain_challenge}
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground">
              {content.cognitiveDrill.question}
            </h2>
          </div>

          <p className="text-xs text-muted-foreground font-semibold">
            {content.cognitiveDrill.prompt}
          </p>

          <div className="space-y-2">
            {content.cognitiveDrill.options.map((dOpt) => {
              const isSelected = selectedDrillOptionId === dOpt.id;
              return (
                <button
                  key={dOpt.id}
                  onClick={() => {
                    if (selectedDrillOptionId) return;
                    setSelectedDrillOptionId(dOpt.id);
                    setIsDrillCorrect(dOpt.isCorrect);
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition active:scale-[0.99] flex items-start gap-2.5 text-xs font-bold ${
                    isSelected
                      ? dOpt.isCorrect
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card hover:border-primary/50 text-foreground"
                  }`}
                >
                  {isSelected && dOpt.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />}
                  {isSelected && !dOpt.isCorrect && <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />}
                  <span>{dOpt.text}</span>
                </button>
              );
            })}
          </div>

          {selectedDrillOptionId && (
            <div className="rounded-2xl bg-background border border-border p-3 text-xs font-medium text-muted-foreground animate-in fade-in">
              {content.cognitiveDrill.options.find((o) => o.id === selectedDrillOptionId)?.explanation}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={() => setCurrentStep(4)}
              className="rounded-2xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              {t.step_back}
            </button>
            <button
              disabled={!selectedDrillOptionId}
              onClick={() => setCurrentStep(6)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-3 text-xs sm:text-sm font-black text-white hover:brightness-110 active:scale-95 transition shadow-md shadow-primary/25 disabled:opacity-40"
            >
              <span>{t.step_next}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 6: REAL-WORLD ACTION ───────────────────────────────────────── */}
      {currentStep === 6 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
              <Footprints className="h-3.5 w-3.5" />
              {t.step_6_act}
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground">
              {content.realLifeAction.actionTitle}
            </h2>
          </div>

          <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 text-xs sm:text-sm font-bold text-foreground leading-relaxed">
            &ldquo;{content.realLifeAction.instruction}&rdquo;
          </div>

          <p className="text-xs text-muted-foreground font-medium">
            {content.realLifeAction.contextWhy}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={() => setCurrentStep(5)}
              className="rounded-2xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              {t.step_back}
            </button>
            <button
              onClick={() => {
                setActionCommitted(true);
                setCurrentStep(7);
              }}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-3 text-xs sm:text-sm font-black text-white hover:brightness-110 active:scale-95 transition shadow-md shadow-primary/25"
            >
              <span>I&apos;LL DO THIS TODAY ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 7: REFLECT & JOURNAL ───────────────────────────────────────── */}
      {currentStep === 7 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
              <Pencil className="h-3.5 w-3.5" />
              {t.step_7_reflect}
            </span>
            <h2 className="text-base sm:text-lg font-black text-foreground">
              {content.reflectionQuestions[0] || t.step_reflect_instruction}
            </h2>
          </div>

          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={4}
            placeholder={t.step_reflect_placeholder}
            className="w-full rounded-2xl border border-border bg-background p-3.5 text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={() => setCurrentStep(6)}
              className="rounded-2xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              {t.step_back}
            </button>
            <button
              disabled={isSavingRecord}
              onClick={handleFinishAndRecord}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-xs sm:text-sm font-black text-white hover:brightness-110 active:scale-95 transition shadow-lg shadow-emerald-600/30"
            >
              <span>{isSavingRecord ? "Saving..." : t.step_submit_reflection}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 8: RECORD & CELEBRATION ────────────────────────────────────── */}
      {currentStep === 8 && (
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-card p-5 sm:p-7 space-y-5 shadow-2xl text-center animate-in zoom-in-95">
          <Confetti active={true} duration={3000} />

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {t.challenge_completed_cta}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {content.title}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
            <div className="rounded-2xl bg-background border border-border p-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">XP EARNED</span>
              <span className="text-base font-black text-primary">+{challenge.xpReward} XP</span>
            </div>
            <div className="rounded-2xl bg-background border border-border p-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">STREAK</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">PROTECTED 🔥</span>
            </div>
          </div>

          {/* Key Takeaway Card */}
          <div className="rounded-2xl bg-muted/60 border border-border p-4 text-xs font-semibold text-foreground text-left space-y-1">
            <span className="text-[10px] font-black uppercase text-primary block">CORE TAKEAWAY</span>
            <p>&ldquo;{content.suggestedTakeaway}&rdquo;</p>
          </div>

          {/* Tomorrow Preview Teaser */}
          <div className="rounded-2xl bg-background/90 border border-border p-3.5 text-xs text-left space-y-1">
            <span className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-400 block">
              {t.challenge_tomorrow_preview_title}
            </span>
            <p className="text-muted-foreground font-medium">
              {t.challenge_tomorrow_preview_desc}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-md shadow-primary/25 hover:brightness-110 active:scale-95"
            >
              <span>Back to Dashboard ➔</span>
            </Link>

            <button
              onClick={() => setShowShareModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card py-3.5 px-5 text-xs font-bold text-foreground hover:bg-muted"
            >
              <Share2 className="h-4 w-4 text-primary" />
              <span>{t.journal_share_card_cta}</span>
            </button>
          </div>

          {/* Share Modal */}
          {showShareModal && (
            <JournalShareCardModal
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
              challengeTitle={content.title}
              takeaway={content.suggestedTakeaway}
              reflectionText={reflectionText}
            />
          )}
        </div>
      )}
    </div>
  );
}
