"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DailyCurriculumLesson } from "@/lib/daily-curriculum/types";
import { randomizeOptions } from "@/lib/answer-randomizer";
import { ChallengeOption } from "@/lib/challenges-engine/types";
import { ExerciseAvatarGraphic } from "@/components/physical-activities/exercise-avatar-graphic";
import { QuestionGraphicAvatar } from "@/components/workout/question-graphic-avatar";
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
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

interface ConnectedDailyWorkoutEngineProps {
  lesson: DailyCurriculumLesson;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function ConnectedDailyWorkoutEngine({ lesson }: ConnectedDailyWorkoutEngineProps) {
  const { user } = useAuth();

  // Phase State: 'phase1_questions' | 'phase2_physical' | 'workout_summary'
  const [workoutPhase, setWorkoutPhase] = useState<"phase1_questions" | "phase2_physical" | "workout_summary">("phase1_questions");

  // Phase 1 Question Index & State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [displayOptions, setDisplayOptions] = useState<ChallengeOption[]>([]);
  const [questionsScore, setQuestionsScore] = useState(0);

  // Phase 2 Physical Task State
  const [physicalTimerSeconds, setPhysicalTimerSeconds] = useState(lesson.phase2PhysicalTask.durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [physicalTaskCompleted, setPhysicalTaskCompleted] = useState(false);

  const currentQuestion = lesson.phase1Questions[currentQuestionIndex] || lesson.phase1Questions[0];

  // Randomize options on each question
  useEffect(() => {
    if (!currentQuestion) return;
    setSelectedOptionId(null);
    setIsAnswerCorrect(null);
    setDisplayOptions(randomizeOptions(currentQuestion.options || []));
  }, [currentQuestionIndex, currentQuestion]);

  // Physical Timer countdown
  useEffect(() => {
    if (!isTimerRunning || physicalTimerSeconds <= 0) return;
    const interval = setInterval(() => {
      setPhysicalTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setPhysicalTaskCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, physicalTimerSeconds]);

  const handleSelectOption = (option: ChallengeOption) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(option.id);
    const correct = option.isCorrect;
    setIsAnswerCorrect(correct);
    if (correct) {
      setQuestionsScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < lesson.phase1Questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Transition to Phase 2: Physical Task
      setWorkoutPhase("phase2_physical");
    }
  };

  const handleCompletePhysicalTask = async () => {
    setPhysicalTaskCompleted(true);
    setWorkoutPhase("workout_summary");

    // Sync XP to Supabase
    if (user?.id) {
      try {
        const supabase = createClient();
        const totalXpAward = 100; // 50 XP (Questions) + 50 XP (Physical)
        await supabase.from("xp_ledger").insert({
          user_id: user.id,
          amount: totalXpAward,
          source_type: "daily_connected_workout",
          source_id: lesson.id,
          description: `Completed 2-Phase Connected Workout: ${lesson.topicTitle}`,
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
              current_streak: (profile.current_streak || 14) + 1,
            })
            .eq("user_id", user.id);
        }
      } catch (err) {
        console.warn("Workout XP sync fallback:", err);
      }
    }
  };

  // Format timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-3 sm:px-4 py-2 pb-24 overflow-x-hidden touch-manipulation">
      {/* ─── 1. CLEAR TITLE AT THE TOP ───────────────────────────────────────── */}
      <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-violet-600/10 p-5 sm:p-6 space-y-2 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              TOPIC TEST
            </span>
            <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[9px] font-bold text-muted-foreground">
              {lesson.category}
            </span>
          </div>

          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
            {lesson.phase1Questions.length} Questions + 1 Physical Task
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug">
          {lesson.topicTitle}
        </h1>

        <p className="text-xs text-muted-foreground font-medium">
          Answer each multiple-choice question (A, B, C, D) below, then practice what you&apos;ve learnt in the physical task.
        </p>
      </div>

      {/* ─── 2. PHASE PROGRESS STEPPER ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
              workoutPhase === "phase1_questions"
                ? "bg-primary text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            1
          </span>
          <span className="text-xs font-black text-foreground">
            Phase 1: Questions ({currentQuestionIndex + 1}/{lesson.phase1Questions.length})
          </span>
        </div>

        <ArrowRight className="h-4 w-4 text-muted-foreground" />

        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
              workoutPhase === "phase2_physical"
                ? "bg-emerald-500 text-white animate-pulse"
                : workoutPhase === "workout_summary"
                ? "bg-emerald-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </span>
          <span className="text-xs font-black text-foreground">
            Phase 2: Physical Task
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* PHASE 1: CONNECTED QUESTIONS (WITH A, B, C, D BADGES + GRAPHIC AVATAR)  */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {workoutPhase === "phase1_questions" && currentQuestion && (
        <div className="rounded-3xl border-2 border-primary/40 bg-card p-5 sm:p-7 space-y-4 shadow-xl animate-in fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                QUESTION {currentQuestionIndex + 1} OF {lesson.phase1Questions.length}
              </span>
              <h3 className="text-base sm:text-lg font-black text-foreground">
                {currentQuestion.title}
              </h3>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-extrabold text-primary">
              +15 XP
            </span>
          </div>

          {/* Contextual Question Graphic Avatar Representation */}
          <QuestionGraphicAvatar
            category={currentQuestion.category}
            subcategory={currentQuestion.subcategory}
            skill={currentQuestion.cognitiveSkill}
          />

          {/* Question Prompt */}
          <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed">
            {currentQuestion.question}
          </p>

          {/* Explicit A, B, C, D Options */}
          <div className="space-y-2.5 pt-1">
            {displayOptions.map((opt, idx) => {
              const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.isCorrect;
              let btnClass = "border-border bg-background hover:border-primary/40 text-foreground";
              let badgeClass = "bg-muted text-foreground border-border";

              if (selectedOptionId !== null) {
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
                  disabled={selectedOptionId !== null}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left rounded-2xl border p-3.5 sm:p-4 text-xs sm:text-sm font-semibold transition active:scale-[0.99] flex items-start gap-3 ${btnClass}`}
                >
                  {/* A, B, C, D Letter Badge */}
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-black ${badgeClass}`}
                  >
                    {letter}
                  </span>

                  <span className="flex-1 leading-relaxed">{opt.label}</span>

                  {selectedOptionId !== null && isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-1 mt-0.5" />
                  )}
                  {selectedOptionId !== null && isSelected && !isCorrect && (
                    <XCircle className="h-4 w-4 text-rose-500 shrink-0 ml-1 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Continue */}
          {selectedOptionId !== null && (
            <div className="space-y-4 pt-2 animate-in fade-in">
              <div className="rounded-2xl bg-muted/70 p-3.5 text-xs text-muted-foreground leading-relaxed border-l-2 border-primary">
                <span className="font-bold text-foreground block mb-0.5">Educational Explanation:</span>
                {currentQuestion.educationalWhy}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[48px]"
              >
                <span>
                  {currentQuestionIndex + 1 < lesson.phase1Questions.length
                    ? "NEXT QUESTION ➔"
                    : "PROCEED TO PHASE 2: PHYSICAL TASK ➔"}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* PHASE 2: CONNECTED PHYSICAL TASK                                       */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {workoutPhase === "phase2_physical" && (
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-card p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                PHASE 2: PHYSICAL &amp; REAL-LIFE TASK
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                {lesson.phase2PhysicalTask.title}
              </h2>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
              +{lesson.phase2PhysicalTask.xpReward} XP
            </span>
          </div>

          {/* Graphic Avatar Exercise Illustration */}
          <div className="flex justify-center py-2">
            <ExerciseAvatarGraphic
              type={lesson.phase2PhysicalTask.illustrationType}
              size="hero"
            />
          </div>

          {/* Physical Action Instructions */}
          <div className="rounded-2xl bg-background border border-border p-4 space-y-1.5 shadow-sm">
            <span className="text-[10px] font-black uppercase text-foreground">
              🏃 WHAT TO DO (PHYSICAL ACTION)
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
              {lesson.phase2PhysicalTask.physicalAction}
            </p>
          </div>

          {/* Why It Connects to Today's Lesson */}
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
              🧠 WHY THIS CONNECTS TO TODAY&apos;S LESSON
            </span>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              {lesson.phase2PhysicalTask.cognitiveConnection}
            </p>
          </div>

          {/* Timer Display */}
          <div className="rounded-2xl bg-background border border-border p-4 text-center space-y-2">
            <span className="text-[10px] font-black uppercase text-muted-foreground">
              TASK TIMER
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-black text-foreground tracking-wider">
              {formatTimer(physicalTimerSeconds)}
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

          {/* Complete Task CTA */}
          <button
            onClick={handleCompletePhysicalTask}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 text-sm font-black shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition min-h-[52px]"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>I COMPLETED THIS PHYSICAL TASK (+{lesson.phase2PhysicalTask.xpReward} XP)</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* WORKOUT SUMMARY & PRIMARY BUTTON TO PHYSICAL ACTIVITIES                */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {workoutPhase === "workout_summary" && (
        <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-card to-teal-600/10 p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <Confetti active={true} />

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30">
            <Trophy className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              WORKOUT COMPLETE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Great Job on Today&apos;s Training!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You mastered the topic, answered the test questions, and completed your physical task.
            </p>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-background/90 p-3.5 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">XP EARNED</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">+100 XP</span>
            </div>
            <div className="rounded-2xl border border-border bg-background/90 p-3.5 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">COINS</span>
              <span className="text-xl font-black text-amber-500">+40 🪙</span>
            </div>
            <div className="rounded-2xl border border-border bg-background/90 p-3.5 space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">QUESTIONS SCORE</span>
              <span className="text-xl font-black text-primary">{questionsScore}/{lesson.phase1Questions.length} Correct</span>
            </div>
          </div>

          {/* ─── PRIMARY BUTTON LEADING TO PHYSICAL ACTIVITIES ─────────────────── */}
          <div className="space-y-3 pt-2">
            <Link
              href="/dashboard/physical"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 text-white py-4 px-6 text-sm font-black shadow-xl shadow-emerald-600/30 transition active:scale-95 min-h-[54px]"
            >
              <Activity className="h-5 w-5" />
              <span>PRACTICE WHAT YOU&apos;VE LEARNT: GO TO PHYSICAL ACTIVITIES ➔</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-xs font-bold hover:bg-accent transition min-h-[44px]"
            >
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
