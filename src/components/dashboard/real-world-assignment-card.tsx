"use client";

import React, { useState } from "react";
import {
  Smartphone,
  CheckCircle2,
  Clock,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Flame,
  X,
  MessageSquare,
} from "lucide-react";
import { recordActionStreakActivity, saveMemoryItem } from "@/lib/akuche/memory-engine";

interface RealWorldChallenge {
  id: string;
  title: string;
  category: string;
  timeEstimate: string;
  instruction: string;
  whyItMatters: string;
  exampleQuestion?: string;
}

const DAILY_REAL_WORLD_CHALLENGES: RealWorldChallenge[] = [
  {
    id: "rwc-1",
    title: "Ask One Customer The Friction Question",
    category: "Business & Sales",
    timeEstimate: "3 minutes",
    instruction: "Reach out to one past or potential customer and ask: 'What is one thing that almost stopped you from buying, or what is your biggest headache with this right now?'",
    whyItMatters: "Direct customer friction is 10x more valuable than guessing in isolation.",
  },
  {
    id: "rwc-2",
    title: "Take a 5-Minute Walk Without Your Phone",
    category: "Clarity & Focus",
    timeEstimate: "5 minutes",
    instruction: "Leave your phone on your desk. Walk outside or around your room for 5 uninterrupted minutes with only your thoughts.",
    whyItMatters: "Default-mode brain network activates during screen-free ambulation, resolving subconscious bottlenecks.",
  },
  {
    id: "rwc-3",
    title: "Explain Your Core Idea to a Non-Expert",
    category: "Communication & Thinking",
    timeEstimate: "4 minutes",
    instruction: "Explain what you are currently building or deciding to a friend or colleague in 2 simple sentences without using technical jargon.",
    whyItMatters: "If you cannot explain it simply, you haven't identified the core leverage point yet.",
  },
  {
    id: "rwc-4",
    title: "The 24-Hour Micro-Test",
    category: "Decision-Making",
    timeEstimate: "5 minutes",
    instruction: "Before overthinking a decision for another week, take ONE low-risk micro-action today that gathers real evidence.",
    whyItMatters: "Action produces information that contemplation cannot.",
  },
  {
    id: "rwc-5",
    title: "Audit Your Top Procrastinated Task",
    category: "Personal Discipline",
    timeEstimate: "2 minutes",
    instruction: "Identify the one task you've avoided for 3+ days. Break it down until the first sub-step takes less than 60 seconds to do.",
    whyItMatters: "Procrastination is usually an emotional reaction to ambiguity, not laziness.",
  },
];

export function RealWorldAssignmentCard() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "done" | "not_yet" | "learning">("idle");
  const [learningNote, setLearningNote] = useState("");
  const [showLearningModal, setShowLearningModal] = useState(false);

  const currentChallenge = DAILY_REAL_WORLD_CHALLENGES[challengeIndex % DAILY_REAL_WORLD_CHALLENGES.length];

  const handleMarkDone = () => {
    setStatus("done");
    recordActionStreakActivity({
      type: "challenge",
      title: `Completed Real-World Action: ${currentChallenge.title}`,
      details: currentChallenge.instruction,
    });
    saveMemoryItem({
      category: "commitment",
      title: `Real-World Task Done: ${currentChallenge.title}`,
      content: `Executed outside-phone challenge: "${currentChallenge.instruction}".`,
      sourceContext: "Real-World Assignment Engine",
    });
  };

  const handleSaveLearning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learningNote.trim()) return;
    setStatus("learning");
    recordActionStreakActivity({
      type: "reflection",
      title: `Reflection on: ${currentChallenge.title}`,
      details: learningNote.trim(),
    });
    saveMemoryItem({
      category: "pattern",
      title: `Learning: ${currentChallenge.title}`,
      content: learningNote.trim(),
      sourceContext: "Real-World Assignment Reflection",
    });
    setShowLearningModal(false);
  };

  const handleNextChallenge = () => {
    setStatus("idle");
    setChallengeIndex((prev) => prev + 1);
  };

  return (
    <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-4 sm:p-5 shadow-sm space-y-3.5">
      {/* Header Pill */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-black text-emerald-700 dark:text-emerald-300">
          <Smartphone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>OUTSIDE YOUR PHONE CHALLENGE</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
          <Clock className="h-3 w-3" />
          {currentChallenge.timeEstimate}
        </span>
      </div>

      {/* Main Assignment Instruction */}
      <div className="space-y-1.5">
        <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight">
          {currentChallenge.title}
        </h3>
        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
          &ldquo;{currentChallenge.instruction}&rdquo;
        </p>
      </div>

      {/* Why It Matters */}
      <div className="rounded-2xl bg-card/80 border border-border/80 p-2.5 sm:p-3 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-foreground">Why this matters: </strong>
          <span>{currentChallenge.whyItMatters}</span>
        </div>
      </div>

      {/* Status Feedback / Action Buttons */}
      {status === "idle" && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleMarkDone}
            className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 text-xs font-bold shadow-sm transition active:scale-95 touch-manipulation min-h-[44px]"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Done</span>
          </button>

          <button
            onClick={() => setShowLearningModal(true)}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground px-3.5 py-2.5 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[44px]"
          >
            <MessageSquare className="h-4 w-4 text-emerald-500" />
            <span>I Learned Something</span>
          </button>

          <button
            onClick={() => setStatus("not_yet")}
            className="rounded-xl px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition min-h-[44px]"
          >
            Not yet
          </button>
        </div>
      )}

      {status === "done" && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-3.5 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                Action Executed &amp; Recorded!
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Added to your Action Streak and Personal Memory.
              </p>
            </div>
          </div>
          <button
            onClick={handleNextChallenge}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline shrink-0"
          >
            Next Challenge →
          </button>
        </div>
      )}

      {status === "learning" && (
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/15 p-3.5 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-white">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black text-blue-900 dark:text-blue-200">
                Insight Saved to Memory!
              </p>
              <p className="text-[11px] text-blue-700 dark:text-blue-400">
                Akuche will incorporate this lesson into future recommendations.
              </p>
            </div>
          </div>
          <button
            onClick={handleNextChallenge}
            className="text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline shrink-0"
          >
            Next Challenge →
          </button>
        </div>
      )}

      {status === "not_yet" && (
        <div className="rounded-2xl border border-border bg-card p-3 flex items-center justify-between gap-3 animate-fade-in">
          <p className="text-xs text-muted-foreground">
            No pressure. Come back whenever you&apos;re ready to take action.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs font-bold text-primary hover:underline shrink-0"
          >
            Try Now
          </button>
        </div>
      )}

      {/* "I Learned Something" Modal */}
      {showLearningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h4 className="text-sm font-black text-foreground flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-emerald-500" />
                <span>What Did You Learn?</span>
              </h4>
              <button
                onClick={() => setShowLearningModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLearning} className="space-y-3">
              <textarea
                rows={3}
                value={learningNote}
                onChange={(e) => setLearningNote(e.target.value)}
                placeholder="e.g. When I asked the client, they mentioned that price wasn't the issue — they were worried about setup time..."
                className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                required
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLearningModal(false)}
                  className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-bold shadow-sm"
                >
                  Save Insight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
