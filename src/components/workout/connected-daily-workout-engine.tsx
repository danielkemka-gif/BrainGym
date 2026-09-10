"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RealLifeScenario,
  getTodaysPersonalizedScenario,
  getActiveUserRole,
  advanceDailyMissionStep,
  saveBrainGymReflection,
  getTodaysDailyMissionProgress,
} from "@/lib/mental-fitness";
import { DailyCurriculumLesson } from "@/lib/daily-curriculum/types";
import { randomizeOptions } from "@/lib/answer-randomizer";
import { ChallengeOption } from "@/lib/challenges-engine/types";
import { ExerciseAvatarGraphic } from "@/components/physical-activities/exercise-avatar-graphic";
import { QuestionGraphicAvatar } from "@/components/workout/question-graphic-avatar";
import { JournalShareCardModal } from "@/components/journal/journal-share-card-modal";
import { Confetti } from "@/components/ui/confetti";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Coins,
  ArrowRight,
  Brain,
  Footprints,
  Dumbbell,
  ShieldCheck,
  Trophy,
  Activity,
  ArrowLeft,
  Quote,
  Target,
  BookOpen,
  Share2,
  HelpCircle,
  Pencil,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

interface ConnectedDailyWorkoutEngineProps {
  lesson?: DailyCurriculumLesson;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function ConnectedDailyWorkoutEngine({ lesson }: ConnectedDailyWorkoutEngineProps) {
  const { user } = useAuth();

  // Load active role & scenario
  const userRole = getActiveUserRole();
  const scenario: RealLifeScenario = getTodaysPersonalizedScenario(userRole);

  // 5-Step Flow State: 1: Scenario | 2: Decision | 3: Brain Challenge | 4: Physical Task | 5: Journal | 6: Mission Complete
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Step 2: Decision State
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  // Step 3: Brain Challenge State
  const [selectedChallengeOptionId, setSelectedChallengeOptionId] = useState<string | null>(null);
  const [isChallengeCorrect, setIsChallengeCorrect] = useState<boolean | null>(null);
  const [challengeOptions, setChallengeOptions] = useState<ChallengeOption[]>([]);

  // Step 4: Physical Task State
  const [taskTimerSeconds, setTaskTimerSeconds] = useState(scenario.physicalActionTask.durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  // Step 5: Journal State
  const [reflectionText, setReflectionText] = useState(scenario.suggestedReflectionTemplate);
  const [isSavingJournal, setIsSavingJournal] = useState(false);

  // Social Share Card Modal State
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (scenario.relatedBrainChallenge.options) {
      setChallengeOptions(randomizeOptions(scenario.relatedBrainChallenge.options));
    }
  }, [scenario]);

  // Physical Timer countdown
  useEffect(() => {
    if (!isTimerRunning || taskTimerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTaskTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setTaskCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, taskTimerSeconds]);

  // ─── STEP HANDLERS ─────────────────────────────────────────────────────────

  const handleSelectDecision = (optionId: string) => {
    if (selectedDecisionId) return;
    setSelectedDecisionId(optionId);
  };

  const handleProceedToChallenge = () => {
    advanceDailyMissionStep(2, { selectedOptionId: selectedDecisionId });
    setCurrentStep(3);
  };

  const handleSelectChallengeOption = (option: ChallengeOption) => {
    if (selectedChallengeOptionId) return;
    setSelectedChallengeOptionId(option.id);
    setIsChallengeCorrect(option.isCorrect);
  };

  const handleProceedToPhysicalTask = () => {
    advanceDailyMissionStep(3, { brainChallengeCompleted: true });
    setCurrentStep(4);
  };

  const handleCompletePhysicalTask = () => {
    setTaskCompleted(true);
    advanceDailyMissionStep(4, { physicalTaskCompleted: true });
    setCurrentStep(5);
  };

  const handleSaveReflectionAndComplete = async () => {
    setIsSavingJournal(true);

    // Save to Supabase brain_journal table
    await saveBrainGymReflection(
      scenario.title,
      reflectionText,
      scenario.brainInsightTakeaway,
      user?.id
    );

    // Sync XP & Streaks to Supabase
    if (user?.id) {
      try {
        const supabase = createClient();
        const totalXpAward = 150;
        await supabase.from("xp_ledger").insert({
          user_id: user.id,
          amount: totalXpAward,
          source_type: "daily_mission_complete",
          source_id: scenario.id,
          description: `Completed 5-Step Real-Life Mission: ${scenario.title}`,
        });

        const { data: profile } = await supabase
          .from("profiles")
          .select("total_xp, coins, current_streak")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({
              total_xp: (profile.total_xp || 0) + totalXpAward,
              coins: (profile.coins || 0) + 40,
              current_streak: (profile.current_streak || 7) + 1,
            })
            .eq("user_id", user.id);
        }
      } catch (err) {
        console.warn("Supabase XP sync fallback:", err);
      }
    }

    advanceDailyMissionStep(5, { journalEntryText: reflectionText, isCompleted: true });
    setIsSavingJournal(false);
    setCurrentStep(6);
  };

  const selectedDecision = scenario.decisionOptions.find((o) => o.id === selectedDecisionId);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-3 sm:px-4 py-2 pb-24 overflow-x-hidden touch-manipulation">
      {/* ─── 5-STEP MISSION PROGRESS STEPPER ─────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm flex items-center justify-between overflow-x-auto no-scrollbar gap-1">
        {[
          { num: 1, label: "Scenario" },
          { num: 2, label: "Decision" },
          { num: 3, label: "Challenge" },
          { num: 4, label: "Action" },
          { num: 5, label: "Journal" },
        ].map((s) => {
          const isDone = currentStep > s.num || (currentStep === 6);
          const isCurrent = currentStep === s.num;
          return (
            <div key={s.num} className="flex items-center gap-1.5 shrink-0">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black transition-all ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                    ? "bg-primary text-white ring-2 ring-primary/30 animate-pulse"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? "✓" : s.num}
              </span>
              <span
                className={`text-[11px] font-bold hidden sm:inline ${
                  isCurrent ? "text-foreground font-black" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
              {s.num < 5 && <ArrowRight className="h-3 w-3 text-muted-foreground/50 mx-0.5" />}
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 1: TODAY'S REAL-LIFE SCENARIO (PROPERLY CENTRALIZED)             */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 1 && (
        <div className="rounded-3xl border-2 border-primary/40 bg-card p-5 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          {/* 1. Centralized Step Header & Title */}
          <div className="flex flex-col items-center justify-center text-center gap-2 border-b border-border/60 pb-4">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase text-primary tracking-widest">
                STEP 1 OF 5 · REAL-LIFE SCENARIO
              </span>
            </div>

            <div className="flex items-center justify-center my-1">
              <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-primary/10 border border-primary/20 shadow-sm">
                {scenario.coverEmoji}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground text-center max-w-xl mx-auto leading-snug">
              {scenario.title}
            </h2>

            {/* Sub-badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
              <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                {scenario.roleCategory} Edition
              </span>
              <span className="text-[10px] font-black text-muted-foreground bg-muted border border-border rounded-full px-3 py-1">
                ~{scenario.estimatedMinutes} Mins
              </span>
              <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1">
                Skill: {scenario.cognitiveSkillInvolved}
              </span>
            </div>
          </div>

          {/* 2. Centralized & Well-Arranged Situation Analysis Box */}
          <div className="rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-primary/10 via-background to-primary/5 p-5 sm:p-6 space-y-4 shadow-md max-w-xl mx-auto">
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <div className="inline-flex items-center gap-1.5 text-primary">
                <Target className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-wider">
                  SITUATION ANALYSIS
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                Could this dilemma happen to you? Read carefully:
              </span>
            </div>

            {/* Well-arranged Centralized Narrative Quote */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-sm text-center">
              <Quote className="h-5 w-5 text-primary mx-auto mb-2 opacity-70" />
              <p className="text-sm sm:text-base text-foreground font-semibold leading-relaxed">
                &ldquo;{scenario.scenarioNarrative}&rdquo;
              </p>
            </div>

            {/* Why This Matters Breakdown */}
            <div className="rounded-xl bg-muted/70 border border-border/80 p-3.5 sm:p-4 space-y-1 text-left">
              <span className="text-[10px] font-black text-primary uppercase flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5" />
                WHY THIS MATTERS &amp; HOW TO THINK:
              </span>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                {scenario.contextWhyItMatters}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              advanceDailyMissionStep(1);
              setCurrentStep(2);
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white py-4 px-6 text-sm font-black shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[52px]"
          >
            <span>NEXT: MAKE YOUR DECISION (WHAT WOULD YOU DO?) ➔</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 2: DECISION POINT ("WHAT WOULD YOU DO?")                          */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 2 && (
        <div className="rounded-3xl border-2 border-primary/40 bg-card p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              STEP 2 OF 5 · DECISION POINT
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">
              Skill: {scenario.cognitiveSkillInvolved}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {scenario.decisionPrompt}
            </h2>
            <p className="text-xs text-muted-foreground">
              Select how you would actually respond in this real-life situation.
            </p>
          </div>

          {/* Realistic Options A, B, C, D */}
          <div className="space-y-3">
            {scenario.decisionOptions.map((opt) => {
              const isSelected = selectedDecisionId === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={Boolean(selectedDecisionId)}
                  onClick={() => handleSelectDecision(opt.id)}
                  className={`w-full text-left rounded-2xl border p-4 text-xs sm:text-sm transition active:scale-[0.99] flex items-start gap-3.5 ${
                    isSelected
                      ? opt.isRecommended
                        ? "border-emerald-500 bg-emerald-500/10 font-bold shadow-sm"
                        : "border-amber-500 bg-amber-500/10 font-bold shadow-sm"
                      : selectedDecisionId
                      ? "opacity-50 border-border bg-background"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
                      isSelected
                        ? opt.isRecommended
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-amber-500 text-white border-amber-500"
                        : "bg-muted text-foreground border-border"
                    }`}
                  >
                    {opt.letter}
                  </span>

                  <div className="flex-1 space-y-1">
                    <p className="text-foreground leading-relaxed font-semibold">{opt.text}</p>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">
                      Style: {opt.thinkingStyle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Brain Insight & Consequences Breakdown */}
          {selectedDecision && (
            <div className="rounded-2xl bg-muted/80 p-5 space-y-3 text-xs leading-relaxed border-l-4 border-primary animate-in fade-in">
              <div>
                <span className="text-[10px] font-black uppercase text-primary block">
                  REAL-LIFE CONSEQUENCES:
                </span>
                <p className="text-foreground font-medium mt-0.5">
                  {selectedDecision.consequences}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-primary block">
                  BRAIN INSIGHT:
                </span>
                <p className="text-muted-foreground mt-0.5">
                  {selectedDecision.brainExplanation}
                </p>
              </div>

              <div className="pt-1 border-t border-border/60">
                <p className="text-xs font-black text-foreground italic flex items-center gap-1.5">
                  <Quote className="h-3.5 w-3.5 text-primary" />
                  &ldquo;{scenario.brainInsightTakeaway}&rdquo;
                </p>
              </div>

              <button
                onClick={handleProceedToChallenge}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-3 px-4 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[44px]"
              >
                <span>TEST THIS SKILL WITH A BRAIN CHALLENGE ➔</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 3: RELATED BRAIN CHALLENGE                                        */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 3 && (
        <div className="rounded-3xl border-2 border-primary/40 bg-card p-6 sm:p-8 space-y-5 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              STEP 3 OF 5 · CONNECTED BRAIN CHALLENGE
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary">
              +30 XP
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              {scenario.relatedBrainChallenge.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Train your neural circuits to apply this cognitive skill under pressure.
            </p>
          </div>

          <QuestionGraphicAvatar
            category={scenario.relatedBrainChallenge.category}
            subcategory={scenario.relatedBrainChallenge.subcategory}
            skill={scenario.relatedBrainChallenge.cognitiveSkill}
          />

          <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed">
            {scenario.relatedBrainChallenge.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {challengeOptions.map((opt, idx) => {
              const letter = OPTION_LETTERS[idx] || "A";
              const isSelected = selectedChallengeOptionId === opt.id;
              const isCorrect = opt.isCorrect;
              let btnClass = "border-border bg-background hover:border-primary/40 text-foreground";
              let badgeClass = "bg-muted text-foreground border-border";

              if (selectedChallengeOptionId !== null) {
                if (isSelected && isCorrect) {
                  btnClass = "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black";
                  badgeClass = "bg-emerald-500 text-white border-emerald-500";
                } else if (isSelected && !isCorrect) {
                  btnClass = "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400";
                  badgeClass = "bg-rose-500 text-white border-rose-500";
                } else if (isCorrect) {
                  btnClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                  badgeClass = "bg-emerald-500/80 text-white border-emerald-500";
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={selectedChallengeOptionId !== null}
                  onClick={() => handleSelectChallengeOption(opt)}
                  className={`w-full text-left rounded-2xl border p-3.5 sm:p-4 text-xs sm:text-sm font-semibold transition active:scale-[0.99] flex items-start gap-3 ${btnClass}`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-black ${badgeClass}`}>
                    {letter}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt.label}</span>
                  {selectedChallengeOptionId !== null && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-1 mt-0.5" />}
                  {selectedChallengeOptionId !== null && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-rose-500 shrink-0 ml-1 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Proceed */}
          {selectedChallengeOptionId && (
            <div className="space-y-4 pt-2 animate-in fade-in">
              <div className="rounded-2xl bg-muted/70 p-3.5 text-xs text-muted-foreground leading-relaxed border-l-2 border-primary">
                <span className="font-bold text-foreground block mb-0.5">Educational Explanation:</span>
                {scenario.relatedBrainChallenge.educationalWhy}
              </div>

              <button
                onClick={handleProceedToPhysicalTask}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[48px]"
              >
                <span>PROCEED TO STEP 4: REAL-LIFE PHYSICAL TASK ➔</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 4: REAL-LIFE PHYSICAL / ACTION TASK                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 4 && (
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-card p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              STEP 4 OF 5 · REAL-LIFE ACTION TASK
            </span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
              +{scenario.physicalActionTask.xpReward} XP
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {scenario.physicalActionTask.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Take today&apos;s mental fitness lesson and put it into physical action.
            </p>
          </div>

          {/* Graphic Avatar */}
          <div className="flex justify-center py-2">
            <ExerciseAvatarGraphic
              type={scenario.physicalActionTask.illustrationType}
              size="hero"
            />
          </div>

          {/* Instructions */}
          <div className="rounded-2xl bg-background border border-border p-4 space-y-1.5 shadow-sm">
            <span className="text-[10px] font-black uppercase text-foreground">
              🏃 PHYSICAL ACTION TO PERFORM TODAY
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
              {scenario.physicalActionTask.physicalAction}
            </p>
          </div>

          {/* Why it connects */}
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
              🧠 WHY THIS CONNECTS TO YOUR BRAIN
            </span>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              {scenario.physicalActionTask.cognitiveConnection}
            </p>
          </div>

          {/* Timer */}
          <div className="rounded-2xl bg-background border border-border p-4 text-center space-y-2">
            <span className="text-[10px] font-black uppercase text-muted-foreground">
              TASK TIMER (~{scenario.physicalActionTask.durationMinutes} MINS)
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-black text-foreground tracking-wider">
              {formatTimer(taskTimerSeconds)}
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="rounded-xl bg-muted px-4 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition"
              >
                {isTimerRunning ? "Pause Timer" : "Start Timer"}
              </button>
            </div>
          </div>

          {/* Complete CTA */}
          <button
            onClick={handleCompletePhysicalTask}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 text-sm font-black shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition min-h-[52px]"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>I COMPLETED THIS REAL-LIFE TASK ➔</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 5: MY BRAINGYM JOURNAL & PERSONAL EXPERIENCE                      */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 5 && (
        <div className="rounded-3xl border-2 border-violet-500/40 bg-card p-5 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black uppercase text-violet-600 dark:text-violet-400 tracking-wider">
                STEP 5 OF 5 · MY BRAINGYM JOURNAL
              </span>
            </div>
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-black text-violet-600 dark:text-violet-400">
              +50 XP Bonus
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Type Your Personal Experience
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Type what happened in your life, what decision you made, or what you learned today. Once typed, you can preview and share your reflection card directly to WhatsApp, LinkedIn, or Facebook.
            </p>
          </div>

          {/* Guided Prompt Inspiration Chips */}
          <div className="rounded-2xl bg-muted/60 p-4 space-y-2 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-foreground flex items-center gap-1.5">
                <Pencil className="h-3.5 w-3.5 text-primary" />
                GUIDED PROMPT INSPIRATION (TAP TO ADD):
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {scenario.journalPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setReflectionText((prev) =>
                      prev ? `${prev}\n\n• ${p}: ` : `• ${p}: `
                    );
                  }}
                  className="text-left rounded-xl bg-background hover:bg-card border border-border hover:border-primary/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition font-medium active:scale-95"
                >
                  💡 {p}
                </button>
              ))}
            </div>
          </div>

          {/* Dedicated Typing Space */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wide text-foreground flex items-center gap-1.5">
                <span>✍️ YOUR PERSONAL EXPERIENCE &amp; REFLECTION:</span>
              </label>
              <span className="text-[10px] font-bold text-muted-foreground">
                {reflectionText.trim().split(/\s+/).filter(Boolean).length} Words
              </span>
            </div>

            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              rows={5}
              placeholder="Type your personal experience here... (e.g. When I faced this situation at work/home, I noticed... Going forward, I will...)"
              className="w-full rounded-2xl border-2 border-border focus:border-primary bg-background p-4 text-xs sm:text-sm font-medium text-foreground focus:outline-none transition leading-relaxed shadow-inner"
            />
          </div>

          {/* Social Share & Complete Action CTAs */}
          <div className="space-y-3 pt-1">
            {/* Direct Social Share Card Trigger */}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/25 transition active:scale-95 min-h-[48px]"
            >
              <Share2 className="h-4 w-4" />
              <span>PREVIEW &amp; SHARE TO SOCIAL MEDIA (WHATSAPP / LINKEDIN / FB) ➔</span>
            </button>

            {/* Save and Complete Button */}
            <button
              onClick={handleSaveReflectionAndComplete}
              disabled={isSavingJournal || !reflectionText.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-primary to-indigo-600 text-white py-4 px-6 text-sm sm:text-base font-black shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition min-h-[54px]"
            >
              <Sparkles className="h-5 w-5 fill-white" />
              <span>{isSavingJournal ? "Saving..." : "SAVE REFLECTION & COMPLETE MISSION 🎉"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 6: TODAY'S MISSION COMPLETE 🎉 & SOCIAL SHARE CARD                 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 6 && (
        <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-card to-teal-600/10 p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <Confetti active={true} />

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 text-3xl">
            🎉
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              TODAY&apos;S MISSION COMPLETE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Mastery Achieved!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              You navigated the scenario, made your decision, trained your cognitive challenge, executed the physical task, and journaled your reflection.
            </p>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
            <div className="rounded-2xl border border-border bg-background/90 p-3 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">XP EARNED</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">+150 XP</span>
            </div>
            <div className="rounded-2xl border border-border bg-background/90 p-3 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">COINS</span>
              <span className="text-lg font-black text-amber-500">+40 🪙</span>
            </div>
            <div className="rounded-2xl border border-border bg-background/90 p-3 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">STREAK</span>
              <span className="text-lg font-black text-primary">Active 🔥</span>
            </div>
          </div>

          {/* Today's Key Takeaway Banner */}
          <div className="rounded-2xl bg-background/80 border border-primary/20 p-4 space-y-1 max-w-md mx-auto shadow-sm">
            <span className="text-[10px] font-black uppercase text-primary">
              TODAY&apos;S KEY TAKEAWAY
            </span>
            <p className="text-sm font-black text-foreground italic">
              &ldquo;{scenario.brainInsightTakeaway}&rdquo;
            </p>
          </div>

          {/* Actions: Social Share Card + Journal + Dashboard */}
          <div className="space-y-2.5 max-w-md mx-auto pt-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white py-4 px-6 text-sm font-black shadow-xl shadow-emerald-600/30 transition active:scale-95 min-h-[52px]"
            >
              <Share2 className="h-5 w-5" />
              <span>SHARE REFLECTION AS SOCIAL POST ➔</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/journal"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card hover:bg-muted py-3 px-4 text-xs font-bold text-foreground transition min-h-[44px]"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                <span>View My Journal</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card hover:bg-muted py-3 px-4 text-xs font-bold text-foreground transition min-h-[44px]"
              >
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── SOCIAL SHARE CARD MODAL ────────────────────────────────────────── */}
      <JournalShareCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        challengeTitle={scenario.title}
        takeaway={scenario.brainInsightTakeaway}
        reflectionText={reflectionText}
      />
    </div>
  );
}
