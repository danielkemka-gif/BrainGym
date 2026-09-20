"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PersonalizedMentalWorkout,
  getTodaysRecommendedWorkout,
  getActivePersonalizationProfile,
  recordWorkoutResult,
  UserPersonalizationProfile,
} from "@/lib/personalization";
import {
  advanceDailyMissionStep,
  saveBrainGymReflection,
  getTodaysDailyMissionProgress,
} from "@/lib/mental-fitness";
import { DailyCurriculumLesson } from "@/lib/daily-curriculum/types";
import { randomizeOptions } from "@/lib/answer-randomizer";
import { ChallengeOption } from "@/lib/challenges-engine/types";
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
  Award,
} from "lucide-react";
import { QuickBrainBreakModal } from "@/components/brain-breaks/quick-brain-break-modal";
import { RealLifeMissionCard } from "@/components/missions/real-life-mission-card";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

interface ConnectedDailyWorkoutEngineProps {
  lesson?: DailyCurriculumLesson;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function ConnectedDailyWorkoutEngine({ lesson }: ConnectedDailyWorkoutEngineProps) {
  const { user } = useAuth();

  // Load active personalization profile & recommended workout
  const [profile, setProfile] = useState<UserPersonalizationProfile | null>(null);
  const [workout, setWorkout] = useState<PersonalizedMentalWorkout | null>(null);

  // 7-Step Sequence: 1: Scenario | 2: Think | 3: Decide | 4: Brain Question | 5: Life Challenge | 6: Journal | 7: Workout Complete
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  // Step 3: Decision State
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  // Step 4: Brain Question State
  const [selectedChallengeOptionId, setSelectedChallengeOptionId] = useState<string | null>(null);
  const [isChallengeCorrect, setIsChallengeCorrect] = useState<boolean | null>(null);
  const [challengeOptions, setChallengeOptions] = useState<ChallengeOption[]>([]);

  // Step 5: Your Life Challenge (Action Assignment)
  const [taskTimerSeconds, setTaskTimerSeconds] = useState(300); // 5 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  // Step 6: Journal State
  const [reflectionText, setReflectionText] = useState("");
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);

  // Social Share Card Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBrainBreakModal, setShowBrainBreakModal] = useState(false);
  const [showMissionCard, setShowMissionCard] = useState(false);

  useEffect(() => {
    const userProfile = getActivePersonalizationProfile();
    const recommendedWorkout = getTodaysRecommendedWorkout(userProfile);
    setProfile(userProfile);
    setWorkout(recommendedWorkout);
    setReflectionText(recommendedWorkout.suggestedReflectionTemplate);
    setTaskTimerSeconds(recommendedWorkout.yourLifeChallenge.durationMinutes * 60);

    if (recommendedWorkout.relatedBrainChallenge.options) {
      setChallengeOptions(randomizeOptions(recommendedWorkout.relatedBrainChallenge.options));
    }
  }, []);

  // Life Challenge Timer countdown
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

  if (!workout || !profile) {
    return (
      <div className="mx-auto w-full max-w-2xl p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded-xl w-1/3 mx-auto" />
        <div className="h-64 bg-muted rounded-3xl" />
      </div>
    );
  }

  // ─── STEP HANDLERS ─────────────────────────────────────────────────────────

  const handleSelectDecision = (optionId: string) => {
    if (selectedDecisionId) return;
    setSelectedDecisionId(optionId);
  };

  const handleProceedToChallenge = () => {
    advanceDailyMissionStep(2, { selectedOptionId: selectedDecisionId });
    setCurrentStep(4);
  };

  const handleSelectChallengeOption = (option: ChallengeOption) => {
    if (selectedChallengeOptionId) return;
    setSelectedChallengeOptionId(option.id);
    setIsChallengeCorrect(option.isCorrect);
  };

  const handleProceedToLifeTask = () => {
    advanceDailyMissionStep(3, { brainChallengeCompleted: true });
    setCurrentStep(5);
  };

  const handleCompleteLifeTask = () => {
    setTaskCompleted(true);
    advanceDailyMissionStep(4, { physicalTaskCompleted: true });
    setCurrentStep(6);
  };

  const handleSaveReflectionAndComplete = async () => {
    setIsSavingJournal(true);

    const isDecisionCorrect = workout.decisionOptions.find(
      (o) => o.id === selectedDecisionId
    )?.isRecommended ?? true;

    // Record performance and dynamically adapt difficulty level!
    const result = recordWorkoutResult(
      workout.universalSkill,
      isDecisionCorrect,
      workout.difficultyLevel
    );

    if (result.promotedToLevel) {
      setLevelUpMessage(result.message);
    }

    // Save to Supabase brain_journal table
    await saveBrainGymReflection(
      workout.title,
      reflectionText,
      workout.brainInsightTakeaway,
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
          source_id: workout.id,
          description: `Completed Personalized Mental Workout: ${workout.title}`,
        });

        const { data: userProf } = await supabase
          .from("profiles")
          .select("total_xp, coins, current_streak")
          .eq("user_id", user.id)
          .single();

        if (userProf) {
          await supabase
            .from("profiles")
            .update({
              total_xp: (userProf.total_xp || 0) + totalXpAward,
              coins: (userProf.coins || 0) + 40,
              current_streak: (userProf.current_streak || 7) + 1,
            })
            .eq("user_id", user.id);
        }
      } catch (err) {
        console.warn("Supabase XP sync fallback:", err);
      }
    }

    advanceDailyMissionStep(5, { journalEntryText: reflectionText, isCompleted: true });
    setIsSavingJournal(false);
    setCurrentStep(7);
  };

  const selectedDecision = workout.decisionOptions.find((o) => o.id === selectedDecisionId);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-3 sm:px-4 py-2 pb-24 overflow-x-hidden touch-manipulation">
      {/* ─── WORKOUT STEPPER ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm flex items-center justify-between overflow-x-auto no-scrollbar gap-1">
        {[
          { num: 1, label: "Scenario" },
          { num: 2, label: "Think" },
          { num: 3, label: "Decide" },
          { num: 4, label: "Brain Drill" },
          { num: 5, label: "Life Task" },
          { num: 6, label: "Journal" },
        ].map((s) => {
          const isDone = currentStep > s.num || currentStep === 7;
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
              {s.num < 6 && <ArrowRight className="h-3 w-3 text-muted-foreground/50 mx-0.5" />}
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 1: PERSONALIZED SCENARIO                                          */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 1 && (
        <div className="rounded-3xl border-2 border-primary/40 bg-card p-5 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex flex-col items-center justify-center text-center gap-2 border-b border-border/60 pb-4">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase text-primary tracking-widest">
                STEP 1 OF 6 · REAL-LIFE SCENARIO
              </span>
            </div>

            <div className="flex items-center justify-center my-1">
              <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-primary/10 border border-primary/20 shadow-sm">
                {workout.coverEmoji}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground text-center max-w-xl mx-auto leading-snug">
              {workout.title}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
              <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                Universal Skill: {workout.universalSkill}
              </span>
              <span className="text-[10px] font-black text-muted-foreground bg-muted border border-border rounded-full px-3 py-1">
                Level {profile.currentDifficultyLevel}
              </span>
              <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1">
                ~{workout.estimatedMinutes} Mins
              </span>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-primary/10 via-background to-primary/5 p-5 sm:p-6 space-y-4 shadow-md max-w-xl mx-auto">
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-sm text-center">
              <Quote className="h-5 w-5 text-primary mx-auto mb-2 opacity-70" />
              <p className="text-sm sm:text-base text-foreground font-semibold leading-relaxed">
                &ldquo;{workout.scenarioNarrative}&rdquo;
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white py-4 px-6 text-sm font-black shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[52px]"
          >
            <span>NEXT: ANALYZE THE SITUATION (THINK) ➔</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 2: THINK (SITUATION ANALYSIS)                                     */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 2 && (
        <div className="rounded-3xl border-2 border-primary/40 bg-card p-5 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              STEP 2 OF 6 · THINK &amp; ANALYZE
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">
              Skill: {workout.universalSkill}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Deconstruct the Real-Life Dilemma
            </h2>
            <p className="text-xs text-muted-foreground">
              Before jumping to a conclusion, examine the hidden trap and underlying cognitive principle.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-muted/60 p-4 border-l-4 border-primary space-y-1">
              <span className="text-xs font-black uppercase text-primary">
                🧩 CORE DILEMMA:
              </span>
              <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                {workout.situationAnalysis.coreDilemma}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/60 p-4 border-l-4 border-amber-500 space-y-1">
              <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">
                ⚠️ THE HIDDEN TRAP:
              </span>
              <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                {workout.situationAnalysis.hiddenTrap}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/60 p-4 border-l-4 border-violet-500 space-y-1">
              <span className="text-xs font-black uppercase text-violet-600 dark:text-violet-400">
                🧠 COGNITIVE PRINCIPLE:
              </span>
              <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                {workout.situationAnalysis.cognitivePrinciple}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(3)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white py-4 px-6 text-sm font-black shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[52px]"
          >
            <span>PROCEED: CHOOSE YOUR DECISION (WHAT WOULD YOU DO?) ➔</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 3: DECIDE / SOLVE (OPTIONS A, B, C, D)                            */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 3 && (
        <div className="rounded-3xl border-2 border-primary/40 bg-card p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              STEP 3 OF 6 · DECISION POINT
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">
              Level {profile.currentDifficultyLevel}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {workout.decisionPrompt}
            </h2>
            <p className="text-xs text-muted-foreground">
              Select how you would genuinely respond in this situation.
            </p>
          </div>

          <div className="space-y-3">
            {workout.decisionOptions.map((opt) => {
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
                  &ldquo;{workout.brainInsightTakeaway}&rdquo;
                </p>
              </div>

              <button
                onClick={handleProceedToChallenge}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-3 px-4 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[44px]"
              >
                <span>TEST THIS SKILL WITH A BRAIN QUESTION ➔</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 4: BRAIN QUESTION (COGNITIVE DRILL)                                */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 4 && (
        <div className="rounded-3xl border-2 border-primary/40 bg-card p-6 sm:p-8 space-y-5 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              STEP 4 OF 6 · BRAIN QUESTION
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary">
              +30 XP
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              {workout.relatedBrainChallenge.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Train your neural circuits to apply this cognitive skill under pressure.
            </p>
          </div>

          <QuestionGraphicAvatar
            category={workout.relatedBrainChallenge.category}
            subcategory={workout.relatedBrainChallenge.subcategory}
            skill={workout.relatedBrainChallenge.cognitiveSkill}
          />

          <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed">
            {workout.relatedBrainChallenge.question}
          </p>

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

          {selectedChallengeOptionId && (
            <div className="space-y-4 pt-2 animate-in fade-in">
              <div className="rounded-2xl bg-muted/70 p-3.5 text-xs text-muted-foreground leading-relaxed border-l-2 border-primary">
                <span className="font-bold text-foreground block mb-0.5">Educational Explanation:</span>
                {workout.relatedBrainChallenge.educationalWhy}
              </div>

              <button
                onClick={handleProceedToLifeTask}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[48px]"
              >
                <span>PROCEED TO STEP 5: YOUR LIFE CHALLENGE ➔</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 5: YOUR LIFE CHALLENGE (REAL-WORLD ACTION TASK)                   */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 5 && (
        <div className="rounded-3xl border-2 border-amber-500/40 bg-card p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
              STEP 5 OF 6 · YOUR LIFE CHALLENGE
            </span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400">
              +50 XP
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {workout.yourLifeChallenge.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Take today&apos;s mental workout out of the screen and apply it directly into your day.
            </p>
          </div>

          <div className="rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 p-5 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500 shrink-0" />
              <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">
                ACTION INSTRUCTION:
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed">
              &ldquo;{workout.yourLifeChallenge.instruction}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">
              💡 {workout.yourLifeChallenge.contextWhy}
            </p>
          </div>

          <div className="rounded-2xl bg-background border border-border p-4 text-center space-y-2">
            <span className="text-[10px] font-black uppercase text-muted-foreground">
              TASK TIMER (~{workout.yourLifeChallenge.durationMinutes} MINS)
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

          <button
            onClick={handleCompleteLifeTask}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 text-sm font-black shadow-lg shadow-amber-600/30 hover:brightness-110 active:scale-95 transition min-h-[52px]"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>I COMPLETED THIS REAL-LIFE CHALLENGE ➔</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 6: MY BRAINGYM JOURNAL & REFLECTION                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 6 && (
        <div className="rounded-3xl border-2 border-violet-500/40 bg-card p-5 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black uppercase text-violet-600 dark:text-violet-400 tracking-wider">
                STEP 6 OF 6 · MY BRAINGYM JOURNAL
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
              Record what happened, what decision you made, or what you learned today.
            </p>
          </div>

          <div className="rounded-2xl bg-muted/60 p-4 space-y-2 border border-border/60">
            <span className="text-[10px] font-black uppercase text-foreground flex items-center gap-1.5">
              <Pencil className="h-3.5 w-3.5 text-primary" />
              GUIDED PROMPT INSPIRATION (TAP TO ADD):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {workout.journalPrompts.map((p, idx) => (
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wide text-foreground">
                ✍️ YOUR PERSONAL EXPERIENCE &amp; REFLECTION:
              </label>
              <span className="text-[10px] font-bold text-muted-foreground">
                {reflectionText.trim().split(/\s+/).filter(Boolean).length} Words
              </span>
            </div>

            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              rows={5}
              placeholder="Type your personal experience here..."
              className="w-full rounded-2xl border-2 border-border focus:border-primary bg-background p-4 text-xs sm:text-sm font-medium text-foreground focus:outline-none transition leading-relaxed shadow-inner"
            />
          </div>

          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/25 transition active:scale-95 min-h-[48px]"
            >
              <Share2 className="h-4 w-4" />
              <span>PREVIEW &amp; SHARE TO SOCIAL MEDIA (WHATSAPP / LINKEDIN / FB) ➔</span>
            </button>

            <button
              onClick={handleSaveReflectionAndComplete}
              disabled={isSavingJournal || !reflectionText.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-primary to-indigo-600 text-white py-4 px-6 text-sm sm:text-base font-black shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition min-h-[54px]"
            >
              <Sparkles className="h-5 w-5 fill-white" />
              <span>{isSavingJournal ? "Saving..." : "SAVE REFLECTION & COMPLETE WORKOUT 🎉"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 7: WORKOUT COMPLETE 🔥 & RETENTION NEXT STEPS                      */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 7 && (
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-teal-600/10 p-5 sm:p-7 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
          <Confetti active={true} />

          {/* 1. STATUS HEADER & SKILL TRAINED */}
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              WORKOUT COMPLETE 🔥
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              You Trained: {workout.universalSkill.toUpperCase()}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              You completed today&apos;s deliberate mental workout and strengthened your real-life cognitive readiness.
            </p>
          </div>

          {/* 2. REWARD & STREAK SUMMARY */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="rounded-2xl border border-border bg-background/90 p-3 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">POINTS</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">+25 Brain Points</span>
            </div>
            <div className="rounded-2xl border border-border bg-background/90 p-3 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">STREAK</span>
              <span className="text-lg font-black text-primary">Protected 🔥</span>
            </div>
          </div>

          {/* 3. TODAY'S KEY TAKEAWAY */}
          <div className="rounded-2xl bg-background/80 border border-primary/20 p-3.5 space-y-1 max-w-md mx-auto shadow-sm text-left">
            <span className="text-[10px] font-black uppercase text-primary block">
              TODAY&apos;S KEY TAKEAWAY
            </span>
            <p className="text-xs sm:text-sm font-black text-foreground italic">
              &ldquo;{workout.brainInsightTakeaway}&rdquo;
            </p>
          </div>

          {/* 4. YOUR NEXT STEP (MAX 2 OPTIONAL ACTIONS) */}
          <div className="space-y-2.5 max-w-md mx-auto pt-1 text-left">
            <span className="text-[11px] font-black uppercase text-muted-foreground tracking-wider block">
              YOUR NEXT STEP (OPTIONAL)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setShowBrainBreakModal(true)}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition active:scale-95 text-left"
              >
                <div>
                  <span className="block text-[10px] font-black uppercase">GOT 60 SECONDS?</span>
                  <span className="text-xs font-black">Try a Brain Break ➔</span>
                </div>
                <Zap className="h-4 w-4 shrink-0" />
              </button>

              <button
                onClick={() => setShowMissionCard(!showMissionCard)}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-bold text-xs transition active:scale-95 text-left"
              >
                <div>
                  <span className="block text-[10px] font-black uppercase">REAL LIFE</span>
                  <span className="text-xs font-black">Today&apos;s Mission ➔</span>
                </div>
                <Compass className="h-4 w-4 shrink-0" />
              </button>
            </div>

            {/* Inline Real-Life Mission Card when toggled */}
            {showMissionCard && (
              <div className="pt-2 animate-in fade-in">
                <RealLifeMissionCard compact={true} />
              </div>
            )}
          </div>

          {/* 5. TOMORROW'S ANTICIPATION PREVIEW */}
          <div className="rounded-2xl bg-muted/50 border border-border p-3.5 max-w-md mx-auto text-left space-y-1">
            <span className="text-[10px] font-black uppercase text-muted-foreground block">
              TOMORROW 🧠
            </span>
            <p className="text-xs sm:text-sm font-bold text-foreground">
              <span className="text-primary font-black">Decision Making</span> — &ldquo;Can you spot the trap before you make the choice?&rdquo;
            </p>
            <span className="text-[11px] text-muted-foreground font-semibold block pt-0.5">
              See you tomorrow.
            </span>
          </div>

          {/* 6. PRIMARY EXIT / SOCIAL SHARE */}
          <div className="space-y-2 max-w-md mx-auto pt-1">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-3.5 px-6 text-sm shadow-xl shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition min-h-[48px]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>RETURN TO DASHBOARD</span>
            </Link>

            <button
              onClick={() => setShowShareModal(true)}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground py-2 min-h-[36px]"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Reflection Post</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick 60-Second Brain Break Modal */}
      <QuickBrainBreakModal
        isOpen={showBrainBreakModal}
        onClose={() => setShowBrainBreakModal(false)}
      />

      {/* Social Share Card Modal */}
      <JournalShareCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        challengeTitle={workout.title}
        takeaway={workout.brainInsightTakeaway}
        reflectionText={reflectionText}
      />
    </div>
  );
}
