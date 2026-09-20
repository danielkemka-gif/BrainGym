"use client";

import { useState } from "react";
import {
  UNIVERSAL_COMMUNITY_CHALLENGES,
  UniversalCommunityChallenge,
} from "@/lib/personalization";
import {
  Users,
  Lightbulb,
  Sparkles,
  X,
  Compass,
  ArrowRight,
  BookOpen,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

interface SeeHowOthersThinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId?: string;
}

export function SeeHowOthersThinkModal({
  isOpen,
  onClose,
  challengeId = "uc-community-50k",
}: SeeHowOthersThinkModalProps) {
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState(0);
  const challenge =
    UNIVERSAL_COMMUNITY_CHALLENGES[selectedChallengeIndex] ||
    UNIVERSAL_COMMUNITY_CHALLENGES[0];

  const [activePerspectiveIndex, setActivePerspectiveIndex] = useState(0);
  const [userSubmission, setUserSubmission] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
            <Users className="h-4 w-4" />
            <span>INTERGENERATIONAL THINKING · SEE HOW OTHERS THINK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            {challenge.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            BrainGym connects people across generations. Everyone receives the same universal challenge—explore how different life stages solve it!
          </p>
        </div>

        {/* Challenge Prompt Banner */}
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/10 p-4 sm:p-5 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
            🎯 THE UNIVERSAL QUESTION
          </span>
          <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed">
            &ldquo;{challenge.prompt}&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">
            {challenge.contextNarrative}
          </p>
        </div>

        {/* Intergenerational Perspective Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-foreground">
              Multi-Generational Perspectives (5 Life Stages)
            </span>
            <span className="text-[11px] text-muted-foreground">
              Tap any generation to view reasoning
            </span>
          </div>

          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {challenge.perspectives.map((p, idx) => {
              const isActive = activePerspectiveIndex === idx;
              return (
                <button
                  key={p.personaLabel}
                  onClick={() => setActivePerspectiveIndex(idx)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 touch-manipulation ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {p.personaLabel}
                </button>
              );
            })}
          </div>

          {/* Active Perspective Card */}
          {challenge.perspectives[activePerspectiveIndex] && (
            <div className="rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div>
                  <span className="text-[11px] font-black uppercase text-primary block">
                    {challenge.perspectives[activePerspectiveIndex].personaLabel} ({challenge.perspectives[activePerspectiveIndex].ageBracket})
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-foreground mt-0.5">
                    {challenge.perspectives[activePerspectiveIndex].approachTitle}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground bg-card border px-2 py-1 rounded-full">
                  Key: {challenge.perspectives[activePerspectiveIndex].keyPriority}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                &ldquo;{challenge.perspectives[activePerspectiveIndex].reasoning}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* User Submission Box */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-xs font-black uppercase text-foreground">
              What Would Be Your Approach?
            </span>
          </div>

          {hasSubmitted ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Your perspective has been anonymously added to today&apos;s intergenerational thinking pool!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={userSubmission}
                onChange={(e) => setUserSubmission(e.target.value)}
                rows={3}
                placeholder="Type your strategic approach here... What would you prioritize?"
                className="w-full rounded-xl border border-border bg-background p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
              />
              <button
                onClick={() => {
                  if (userSubmission.trim().length > 5) {
                    setHasSubmitted(true);
                  }
                }}
                disabled={userSubmission.trim().length < 5}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 px-4 text-xs font-black hover:bg-primary/90 disabled:opacity-50 transition active:scale-95"
              >
                <span>Submit My Approach & Compare ➔</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
