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
      {/* STEP 1: TODAY'S REAL-LIFE SCENARIO                                     */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 1 && (
        <div className="rounded-3xl border-2 border-primary/40 bg-card p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl p-1.5 rounded-xl bg-primary/10 border border-primary/20">
                {scenario.coverEmoji}
              </span>
              <div>
                <span className="text-[10px] font-black uppercase text-primary tracking-wider block">
                  STEP 1 OF 5 · REAL-LIFE SCENARIO
                </span>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {scenario.title}
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-black text-muted-foreground bg-muted border border-border rounded-full px-2.5 py-0.5">
              ~{scenario.estimatedMinutes} Mins
            </span>
          </div>

          {/* Scenario Narrative Box */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2 shadow-sm">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              THE SITUATION (COULD THIS HAPPEN TO YOU?)
            </span>
            <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
              &ldquo;{scenario.scenarioNarrative}&rdquo;
            </p>
          </div>

          {/* Why it Matters Context */}
          <div className="rounded-2xl border border-border bg-background p-4 space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              WHY THIS MATTERS
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {scenario.contextWhyItMatters}
            </p>
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              advanceDailyMissionStep(1);
              setCurrentStep(2);
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white py-4 px-6 text-sm font-black shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[52px]"
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
      {/* STEP 5: MY BRAINGYM JOURNAL & REFLECTION                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 5 && (
        <div className="rounded-3xl border-2 border-violet-500/40 bg-card p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-400 tracking-wider">
              STEP 5 OF 5 · MY BRAINGYM JOURNAL
            </span>
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-black text-violet-600 dark:text-violet-400">
              +50 XP Bonus
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Write Today&apos;s Reflection
            </h2>
            <p className="text-xs text-muted-foreground">
              What did you discover about your thinking? What will you do differently tomorrow?
            </p>
          </div>

          {/* Prompts */}
          <div className="rounded-2xl bg-muted/60 p-4 space-y-2">
            <span className="text-[10px] font-black uppercase text-foreground block">
              💡 GUIDED PROMPT QUESTIONS:
            </span>
            <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
              {scenario.journalPrompts.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Reflection Text Area */}
          <div className="space-y-2">
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              rows={4}
              placeholder="Write your reflection note here..."
              className="w-full rounded-2xl border border-border bg-background p-4 text-xs sm:text-sm font-medium text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Finish & Save */}
          <button
            onClick={handleSaveReflectionAndComplete}
            disabled={isSavingJournal || !reflectionText.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-primary to-indigo-600 text-white py-4 px-6 text-sm sm:text-base font-black shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition min-h-[54px]"
          >
            <Sparkles className="h-5 w-5 fill-white" />
            <span>{isSavingJournal ? "Saving..." : "SAVE REFLECTION & COMPLETE MISSION 🎉"}</span>
          </button>
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
