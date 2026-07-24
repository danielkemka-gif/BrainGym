"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BRAIN_QUESTIONS, type BrainQuestion } from "@/lib/brain-questions";
import { CATEGORIES, QUICK_FIRE_DURATIONS } from "@/lib/constants";
import {
  ArrowLeft, Clock, Zap, Trophy, Coins, RotateCcw,
  CheckCircle2, XCircle, Flame, Send, Lightbulb, Star, Target
} from "lucide-react";

const CAT_EMOJI: Record<string, string> = {
  memory: "🧠", focus: "🎯", thinking: "💡", learning: "📚",
  health: "❤️", creativity: "🎨", "emotional-intelligence": "🤝",
};

const CORRECT_REACTIONS = [
  "Sharp! You too sabi! 🎯",
  "Oga, your brain no dey play! 💪",
  "Chop knuckle! You don get am! ✊",
  "Na you be the real Oga! 👑",
  "Your brain dey fire on all cylinders! 🔥",
  "Wahala! You too correct! ⚡",
  "No wahala at all! You sabi! ✅",
  "E choke! You nail am! 🎯",
];

const WRONG_REACTIONS = [
  "No wahala, you go get the next one! 💪",
  "E no go always easy — that na how we learn! 📚",
  "No give up! Your brain dey grow with every question! 🧠",
  "Hmmm, e happen! Try the next one! 🎯",
  "Learning na the real win! Keep going! 🔥",
  "Every mistake na step to being better! 💡",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "setup" | "countdown" | "active" | "feedback" | "finished";
type AnswerState = "unanswered" | "correct" | "wrong";

export default function ChallengePage() {
  const [duration, setDuration] = useState(60);
  const [phase, setPhase] = useState<Phase>("setup");
  const [countdownValue, setCountdownValue] = useState(3);

  const [questions, setQuestions] = useState<BrainQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);

  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [showHint, setShowHint] = useState(false);

  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [questionLog, setQuestionLog] = useState<{
    question: string; correct: boolean; xp: number; coins: number; category: string;
  }[]>([]);

  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const qTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = questions[currentIndex];

  // Pick questions on start
  const pickQuestions = useCallback(() => {
    const shuffled = shuffle(BRAIN_QUESTIONS);
    const maxQ = duration <= 30 ? 8 : duration <= 60 ? 12 : 16;
    return shuffled.slice(0, Math.min(maxQ, shuffled.length));
  }, [duration]);

  // Start challenge
  const startChallenge = useCallback(() => {
    const picked = pickQuestions();
    if (picked.length === 0) { setError("No questions available."); return; }
    setQuestions(picked);
    setCurrentIndex(0);
    setTimeLeft(duration);
    setStreak(0); setBestStreak(0); setCorrectCount(0);
    setTotalXp(0); setTotalCoins(0); setQuestionLog([]);
    setPhase("countdown");
    setCountdownValue(3);
  }, [duration, pickQuestions]);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdownValue <= 0) { setPhase("active"); return; }
    const t = setTimeout(() => setCountdownValue(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdownValue]);

  // Global timer
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Per-question timer
  useEffect(() => {
    if (phase !== "active" || answerState !== "unanswered" || !current) return;
    const qTime = current.difficulty === "beginner" ? 20 : current.difficulty === "intermediate" ? 25 : 30;
    setQuestionTimeLeft(qTime);
    qTimerRef.current = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          if (qTimerRef.current) clearInterval(qTimerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (qTimerRef.current) clearInterval(qTimerRef.current); };
  }, [phase, currentIndex, answerState, current]);

  // Focus input on text questions
  useEffect(() => {
    if (phase === "active" && current?.type === "text-input" && answerState === "unanswered") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase, current, answerState, currentIndex]);

  function isCorrect(answer: string): boolean {
    if (!current) return false;
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    if (current.type === "text-input") {
      return norm(answer) === norm(current.correctAnswer);
    }
    return answer === current.correctAnswer;
  }

  const handleSubmit = useCallback((timedOut = false) => {
    if (answerState !== "unanswered" || !current) return;
    if (qTimerRef.current) clearInterval(qTimerRef.current);

    let correct = false;
    if (!timedOut) {
      if (current.type === "multiple-choice" && selectedOption) {
        correct = isCorrect(selectedOption);
      } else if (current.type === "text-input" && textInput.trim()) {
        correct = isCorrect(textInput);
      }
    }

    const streakBonus = correct ? Math.min(streak + 1, 5) : 0;
    const xp = correct ? (current.xp + streakBonus * 3) : 0;
    const coins = correct ? current.coins : 0;

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setCorrectCount(c => c + 1);
    } else {
      setStreak(0);
    }
    setTotalXp(x => x + xp);
    setTotalCoins(c => c + coins);
    setQuestionLog(log => [...log, {
      question: current.question.substring(0, 50) + "...",
      correct, xp, coins, category: current.category,
    }]);
    setAnswerState(correct ? "correct" : "wrong");
  }, [answerState, current, selectedOption, textInput, streak, bestStreak]);

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setTextInput("");
      setShowHint(false);
      setAnswerState("unanswered");
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("finished");
    }
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  }

  // ═══ SETUP ═══
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-4xl shadow-lg shadow-orange-500/20">
            ⚡
          </div>
          <h1 className="text-2xl font-bold">Quick-Fire Brain Quiz</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Test your brain with fun questions across Memory, Focus, Thinking, and more!
            Race against the clock — faster answers earn more XP!
          </p>

          <div className="mt-6 rounded-xl border border-border bg-background p-4 text-left">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" /> How e dey work
            </h3>
            <div className="space-y-3">
              {[
                "Pick your time — 30s (quick blast), 60s (sweet spot), or 90s (full brain workout)",
                "Each question get multiple choice OR type-your-answer mode",
                "Answer correct = XP + coins. Fast answer = MORE bonus!",
                "Get consecutive answers correct = Streak combo = DOUBLE bonus! 🔥",
                "If you no know, use the hint — but e go reduce your XP small",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brain categories</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(c => (
                <span key={c.id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
                  {CAT_EMOJI[c.id] || "🧠"} {c.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Choose your time limit</p>
            <div className="flex justify-center gap-3">
              {QUICK_FIRE_DURATIONS.map(d => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`rounded-xl border px-6 py-3 text-sm font-medium transition-all ${
                    duration === d
                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "border-border hover:border-muted-foreground"
                  }`}>
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <button onClick={startChallenge}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98]">
            <Zap className="h-4 w-4" />
            Oya, Start! 🔥
          </button>
        </div>
      </div>
    );
  }

  // ═══ COUNTDOWN ═══
  if (phase === "countdown") {
    const phrases: Record<number, string> = { 3: "Get ready...", 2: "Set...", 1: "Oya GO! 🚀" };
    return (
      <div className="mx-auto flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-6 text-8xl font-bold text-primary animate-bounce">
            {countdownValue || "GO!"}
          </div>
          <p className="text-lg text-muted-foreground font-medium">{phrases[countdownValue] || "Go!"}</p>
        </div>
      </div>
    );
  }

  // ═══ FINISHED ═══
  if (phase === "finished") {
    const total = questions.length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const grade = accuracy >= 90 ? "Oga Level! 🏆" : accuracy >= 70 ? "You too sabi! 🔥"
      : accuracy >= 50 ? "Not bad at all! 💪" : "Keep practicing, you go get there! 🧠";
    const reaction = accuracy >= 80
      ? CORRECT_REACTIONS[Math.floor(Math.random() * CORRECT_REACTIONS.length)]
      : "Every question na learning opportunity!";

    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-4xl shadow-lg shadow-green-500/20">
            🎉
          </div>
          <h2 className="text-2xl font-bold">{grade}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{reaction}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-2xl font-bold text-green-500">{correctCount}</p>
              </div>
              <p className="text-xs text-muted-foreground">Correct out of {total}</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Coins className="h-4 w-4 text-amber-500" />
                <p className="text-2xl font-bold text-amber-500">{totalCoins}</p>
              </div>
              <p className="text-xs text-muted-foreground">Coins earned</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-violet-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4 text-violet-400" />
                <p className="text-2xl font-bold text-violet-400">+{totalXp}</p>
              </div>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
            <div className="rounded-xl bg-orange-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <p className="text-2xl font-bold text-orange-500">{bestStreak}</p>
              </div>
              <p className="text-xs text-muted-foreground">Best streak</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-muted/50 p-3">
            <p className="text-sm font-medium">Accuracy: <span className="text-primary font-bold">{accuracy}%</span></p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                style={{ width: `${accuracy}%` }} />
            </div>
          </div>

          {questionLog.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-background p-4 text-left">
              <h3 className="mb-3 text-sm font-semibold">Question breakdown</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {questionLog.map((log, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {log.correct
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      : <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                    <span className="truncate text-muted-foreground flex-1">{log.question}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {log.xp > 0 && <span className="text-xs text-violet-400">+{log.xp}xp</span>}
                      {log.coins > 0 && <span className="text-xs text-amber-500">+{log.coins}c</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={() => { setPhase("setup"); setSelectedOption(null); setTextInput(""); setAnswerState("unanswered"); }}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <RotateCcw className="h-4 w-4" /> Play Again
            </button>
            <Link href="/dashboard"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium hover:bg-accent">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══ ACTIVE / FEEDBACK ═══
  if (!current) { setPhase("finished"); return null; }
  const category = CATEGORIES.find(c => c.id === current.category);
  const progress = questions.length > 0 ? (currentIndex + 1) / questions.length : 0;
  const timePercent = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const isUrgent = timeLeft <= 10;
  const qTimePercent = current.difficulty === "beginner" ? 20 : current.difficulty === "intermediate" ? 25 : 30;
  const qTimeVisual = (questionTimeLeft / qTimePercent) * 100;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("setup"); }}
          className="text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-500 animate-pulse">
              <Flame className="h-3 w-3" /> {streak}x streak!
            </div>
          )}
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${isUrgent ? "bg-red-500/10 text-red-500" : "bg-muted"}`}>
            <Clock className="h-3.5 w-3.5" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          {currentIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Time bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all duration-1000 ${isUrgent ? "bg-red-500" : "bg-primary"}`}
          style={{ width: `${timePercent}%` }} />
      </div>

      {/* Question timer */}
      {answerState === "unanswered" && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full transition-all duration-1000 ${
            qTimeVisual < 30 ? "bg-red-500" : qTimeVisual < 60 ? "bg-yellow-500" : "bg-green-500"
          }`} style={{ width: `${qTimeVisual}%` }} />
        </div>
      )}

      {/* Progress */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Category + Difficulty */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{CAT_EMOJI[current.category] || "🧠"}</span>
            <span className="text-sm text-muted-foreground">{category?.label}</span>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            current.difficulty === "beginner" ? "text-green-500 bg-green-500/10"
              : current.difficulty === "intermediate" ? "text-yellow-500 bg-yellow-500/10"
              : "text-red-500 bg-red-500/10"
          }`}>{current.difficulty}</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Question text */}
          <h2 className="text-lg font-bold leading-relaxed">{current.question}</h2>

          {/* Multiple Choice */}
          {current.type === "multiple-choice" && current.options && (
            <div className="space-y-2">
              {current.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrectOpt = answerState !== "unanswered" && opt === current.correctAnswer;
                const isWrongSelected = answerState === "wrong" && isSelected && opt !== current.correctAnswer;
                return (
                  <button key={i} onClick={() => { if (answerState === "unanswered") setSelectedOption(opt); }}
                    disabled={answerState !== "unanswered"}
                    className={`w-full rounded-xl border p-4 text-left text-sm font-medium transition-all ${
                      isCorrectOpt
                        ? "border-green-500 bg-green-500/10 text-green-500"
                        : isWrongSelected
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground/50 hover:bg-muted/50"
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                      {isCorrectOpt && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
                      {isWrongSelected && <XCircle className="ml-auto h-4 w-4 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Text Input */}
          {current.type === "text-input" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input ref={inputRef} type="text" value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && textInput.trim() && answerState === "unanswered") handleSubmit(); }}
                  disabled={answerState !== "unanswered"}
                  placeholder="Type your answer here..."
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50" />
                {answerState === "unanswered" && (
                  <button onClick={() => handleSubmit()} disabled={!textInput.trim()}
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </div>
              {answerState !== "unanswered" && (
                <p className={`text-sm font-medium ${answerState === "correct" ? "text-green-500" : "text-red-500"}`}>
                  Correct answer: <span className="font-bold">{current.correctAnswer}</span>
                </p>
              )}
            </div>
          )}

          {/* Hint */}
          {current.hint && answerState === "unanswered" && (
            <div>
              {!showHint ? (
                <button onClick={() => setShowHint(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <Lightbulb className="h-3 w-3" /> Need a hint? (-2 XP)
                </button>
              ) : (
                <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/10 p-3">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">💡 {current.hint}</p>
                </div>
              )}
            </div>
          )}

          {/* XP + Coins */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-3 py-1.5">
              <Trophy className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-bold text-violet-400">+{current.xp + (streak > 0 ? streak * 3 : 0)} XP</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-500">+{current.coins} coins</span>
            </div>
          </div>

          {/* Feedback */}
          {answerState !== "unanswered" && (
            <div className={`rounded-xl p-4 border ${
              answerState === "correct"
                ? "bg-green-500/5 border-green-500/10"
                : "bg-red-500/5 border-red-500/10"
            }`}>
              <p className="text-sm font-semibold mb-1">
                {answerState === "correct"
                  ? CORRECT_REACTIONS[Math.floor(Math.random() * CORRECT_REACTIONS.length)]
                  : WRONG_REACTIONS[Math.floor(Math.random() * WRONG_REACTIONS.length)]}
              </p>
              <p className="text-sm text-muted-foreground">{current.explanation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {answerState === "unanswered" ? (
          <>
            <button onClick={() => handleSubmit()}
              disabled={current.type === "multiple-choice" ? !selectedOption : !textInput.trim()}
              className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50">
              Submit Answer
            </button>
          </>
        ) : (
          <button onClick={nextQuestion}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl active:scale-[0.98]">
            {currentIndex < questions.length - 1 ? "Next Question →" : "See Results 🎉"}
          </button>
        )}
      </div>
    </div>
  );
}
