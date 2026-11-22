"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  ACTIVITY_TYPE_LABELS,
  type MentalFitnessActivity,
} from "@/lib/mental-fitness/catalog/schema";

interface ActivityRunnerModalProps {
  activity: MentalFitnessActivity;
  onClose: () => void;
  onCompleted: (message: string) => void;
}

const RECALL_SETS = [
  ["lantern", "harbor", "ginger", "compass", "notebook", "umbrella"],
  ["bridge", "mango", "clockwork", "kettle", "horizon", "velvet"],
  ["market", "bicycle", "cedar", "whistle", "envelope", "river"],
];

const PATTERN_PUZZLES = [
  { seq: "3, 6, 12, 24, ?", answer: "48", hint: "Each number doubles the previous one." },
  { seq: "5, 9, 14, 20, 27, ?", answer: "35", hint: "The difference increases by +1 each step (+4, +5, +6, +7, +8)." },
  { seq: "81, 27, 9, 3, ?", answer: "1", hint: "Divide each term by 3." },
];

const WORD_CLUES = [
  { clue: "Clear and brief in expression (7 letters)", answer: "concise" },
  { clue: "Ability to bounce back from difficulty (10 letters)", answer: "resilience" },
  { clue: "Practical and focused on real results (9 letters)", answer: "pragmatic" },
];

export function ActivityRunnerModal({
  activity,
  onClose,
  onCompleted,
}: ActivityRunnerModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(Math.min(activity.durationMins, 10) * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Breathing pacer (4-4-4-4)
  const [breathTick, setBreathTick] = useState(0);

  // Mental arithmetic state
  const [mathProblems] = useState(() =>
    Array.from({ length: 5 }, (_, i) => {
      const a = 14 + ((i * 17 + 9) % 38);
      const b = 12 + ((i * 13 + 7) % 29);
      return { q: `${a} + ${b}`, ans: a + b };
    })
  );
  const [mathAnswers, setMathAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [mathChecked, setMathChecked] = useState(false);

  // Memory recall state
  const recallWords = useMemo(
    () => RECALL_SETS[new Date().getDate() % RECALL_SETS.length],
    []
  );
  const [recallPhase, setRecallPhase] = useState<"study" | "test">("study");
  const [recallInput, setRecallInput] = useState("");

  // Pattern & word state
  const [puzzleIdx] = useState(() => new Date().getDate() % PATTERN_PUZZLES.length);
  const [puzzleInput, setPuzzleInput] = useState("");
  const [puzzleChecked, setPuzzleChecked] = useState(false);
  const [wordInput, setWordInput] = useState("");
  const [wordChecked, setWordChecked] = useState(false);

  // Reflection & calibration state
  const [note, setNote] = useState("");
  const [enjoyment, setEnjoyment] = useState(4);
  const [difficultyFeedback, setDifficultyFeedback] = useState<
    "too_easy" | "just_right" | "too_hard"
  >("just_right");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      setBreathTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const breathPhaseIndex = Math.floor((breathTick % 16) / 4);
  const breathPhases = ["Inhale calmly (4s)", "Hold gently (4s)", "Exhale slowly (4s)", "Rest (4s)"];
  const breathCountdown = 4 - (breathTick % 4);

  const mathScore = mathProblems.reduce(
    (acc, p, idx) => acc + (Number(mathAnswers[idx].trim()) === p.ans ? 1 : 0),
    0
  );

  const recallMatches = recallWords.filter((w) =>
    recallInput.toLowerCase().includes(w.toLowerCase())
  ).length;

  async function handleFinish() {
    setSubmitting(true);
    let computedScore: number | undefined;
    if (activity.interactiveWidget === "mental_arithmetic") computedScore = mathScore * 20;
    if (activity.interactiveWidget === "memory_recall")
      computedScore = Math.round((recallMatches / recallWords.length) * 100);

    try {
      const res = await fetch("/api/gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_id: activity.id,
          enjoyment_rating: enjoyment,
          difficulty_feedback: difficultyFeedback,
          score: computedScore,
          reflection_note: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      onCompleted(
        data.feedbackMessage || `Completed "${activity.name}". Great practice!`
      );
    } catch {
      onCompleted(`Completed "${activity.name}".`);
    } finally {
      setSubmitting(false);
    }
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              <span>{activity.categoryLabel}</span>
              <span>·</span>
              <span>{ACTIVITY_TYPE_LABELS[activity.activityType]}</span>
              <span>·</span>
              <span className="capitalize">{activity.difficulty}</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground mt-1">
              {activity.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Skill focus: <strong className="text-foreground">{activity.skillFocus}</strong> ·{" "}
              {activity.durationMins} min · Recommended {activity.recommendedFrequency}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close activity runner"
            className="rounded-xl border border-border p-2 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed">{activity.description}</p>

        {/* Step-by-step instructions */}
        <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            How to do it
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-foreground">
            {activity.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Interactive Game Link if backed by full arcade game */}
        {activity.interactiveRoute && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-foreground">Interactive Game Ready</p>
              <p className="text-xs text-muted-foreground">
                Play one full round, then come back (or log your difficulty rating below).
              </p>
            </div>
            <Link
              href={activity.interactiveRoute}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
            >
              Launch Game <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Built-in Interactive Widgets */}
        {activity.interactiveWidget === "breathing_pacer" && (
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 text-center space-y-3">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald-500/50 bg-emerald-500/15">
              <div>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {timerRunning ? breathCountdown : "4"}
                </p>
                <p className="text-[11px] font-semibold text-muted-foreground">sec</p>
              </div>
            </div>
            <p className="text-sm font-bold text-foreground">
              {timerRunning ? breathPhases[breathPhaseIndex] : "Press Start for 4-4-4-4 Box Breathing"}
            </p>
            <button
              type="button"
              onClick={() => setTimerRunning((r) => !r)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
            >
              {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {timerRunning ? "Pause Pacer" : "Start Breathing Pacer"}
            </button>
          </div>
        )}

        {activity.interactiveWidget === "timer" && (
          <div className="rounded-2xl border border-border bg-background p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">
                  {mm}:{ss}
                </p>
                <p className="text-[11px] text-muted-foreground">Guided practice timer</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTimerRunning((r) => !r)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white"
              >
                {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {timerRunning ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsLeft(Math.min(activity.durationMins, 10) * 60);
                }}
                className="rounded-xl border border-border p-2 hover:bg-muted"
                aria-label="Reset timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {activity.interactiveWidget === "mental_arithmetic" && (
          <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
            <p className="text-xs font-bold text-foreground">Solve all 5 mentally:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mathProblems.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2">
                  <span className="text-sm font-mono font-semibold">{p.q} =</span>
                  <input
                    type="number"
                    value={mathAnswers[idx]}
                    onChange={(e) => {
                      const next = [...mathAnswers];
                      next[idx] = e.target.value;
                      setMathAnswers(next);
                    }}
                    className="w-20 rounded-lg border border-border bg-muted/40 px-2 py-1 text-sm text-right"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMathChecked(true)}
                className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white"
              >
                Check Answers
              </button>
              {mathChecked && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Score: {mathScore} / {mathProblems.length}
                </span>
              )}
            </div>
          </div>
        )}

        {activity.interactiveWidget === "memory_recall" && (
          <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
            {recallPhase === "study" ? (
              <>
                <p className="text-xs font-bold text-foreground">
                  Weave these 6 words into one vivid sentence, then tap &ldquo;Hide &amp; Test&rdquo;:
                </p>
                <div className="flex flex-wrap gap-2">
                  {recallWords.map((w) => (
                    <span
                      key={w}
                      className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-sm font-bold text-foreground"
                    >
                      {w}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setRecallPhase("test")}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Hide Words &amp; Test Recall
                </button>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-foreground">
                  Type all 6 words you remember (separated by spaces or commas):
                </p>
                <input
                  type="text"
                  value={recallInput}
                  onChange={(e) => setRecallInput(e.target.value)}
                  placeholder="Type remembered words..."
                  className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    Matched: {recallMatches} / {recallWords.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRecallPhase("study")}
                    className="underline text-muted-foreground"
                  >
                    Peek again
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activity.interactiveWidget === "pattern_logic" && (
          <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
            <p className="text-xs font-bold text-foreground">What number completes this pattern?</p>
            <p className="text-lg font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {PATTERN_PUZZLES[puzzleIdx].seq}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={puzzleInput}
                onChange={(e) => setPuzzleInput(e.target.value)}
                placeholder="Your answer"
                className="w-32 rounded-xl border border-border px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => setPuzzleChecked(true)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
              >
                Check
              </button>
            </div>
            {puzzleChecked && (
              <p className="text-xs text-foreground">
                {puzzleInput.trim() === PATTERN_PUZZLES[puzzleIdx].answer
                  ? `Spot on! ${PATTERN_PUZZLES[puzzleIdx].hint}`
                  : `Answer: ${PATTERN_PUZZLES[puzzleIdx].answer}. Rule: ${PATTERN_PUZZLES[puzzleIdx].hint}`}
              </p>
            )}
          </div>
        )}

        {activity.interactiveWidget === "word_challenge" && (
          <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
            <p className="text-xs font-bold text-foreground">Crossword / Vocabulary Clue:</p>
            <p className="text-sm font-semibold text-foreground">
              {WORD_CLUES[puzzleIdx % WORD_CLUES.length].clue}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                placeholder="Type the word"
                className="flex-1 rounded-xl border border-border px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => setWordChecked(true)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
              >
                Check
              </button>
            </div>
            {wordChecked && (
              <p className="text-xs text-foreground">
                {wordInput.trim().toLowerCase() === WORD_CLUES[puzzleIdx % WORD_CLUES.length].answer
                  ? "Correct! Try using this word naturally in a sentence below."
                  : `Answer: "${WORD_CLUES[puzzleIdx % WORD_CLUES.length].answer}".`}
              </p>
            )}
          </div>
        )}

        {/* Takeaway / Writing Prompt */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Your note, answer, or takeaway (optional)
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Jot down your exercise work or one thing you noticed..."
            className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* Variations + Scientific & Safety Notes */}
        <div className="space-y-2 text-xs">
          <div className="rounded-xl border border-border bg-muted/30 p-3 flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Honest note:</strong> {activity.scientificNote}
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Safety &amp; pacing:</strong> {activity.safetyGuidance}
            </p>
          </div>
        </div>

        {/* Personalization Feedback */}
        <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
          <p className="text-xs font-bold text-foreground">
            Calibrate your next recommendations:
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground block">How did it feel?</span>
              <div className="flex gap-1.5">
                {(
                  [
                    ["too_easy", "Too Easy"],
                    ["just_right", "Just Right"],
                    ["too_hard", "Too Hard"],
                  ] as const
                ).map(([val, lbl]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDifficultyFeedback(val)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                      difficultyFeedback === val
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground block">Enjoyment (1–5)</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEnjoyment(n)}
                    className={`h-8 w-8 rounded-lg border text-xs font-bold ${
                      enjoyment === n
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleFinish}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {submitting ? "Logging..." : "Complete & Adapt"}
          </button>
        </div>
      </div>
    </div>
  );
}
