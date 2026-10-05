"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  Sparkles,
  ArrowRight,
  Brain,
  HelpCircle,
  Target,
  Zap,
  CheckCircle2,
  TrendingUp,
  Layers,
  ChevronRight,
  Send,
  X,
} from "lucide-react";

interface AkucheGuidedOnboardingProps {
  forceOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

const LIFE_DOMAINS = [
  "Business & Sales",
  "Money & Finance",
  "Career & Work",
  "Education & Learning",
  "Relationships & Family",
  "Decision-Making",
  "Productivity & Habits",
  "Personal Development",
  "Leadership & Strategy",
  "Technology & AI",
  "Emotional Situations",
  "Life Planning",
];

const EXAMPLE_FIRST_PROMPTS = [
  "I want to make ₦5 million before the end of the year.",
  "Should I start a business or keep my 9-to-5 job?",
  "How do I prepare for an important interview?",
  "I'm overwhelmed and need a daily productivity plan.",
];

export function AkucheGuidedOnboarding({
  forceOpen = false,
  onClose,
  onComplete,
}: AkucheGuidedOnboardingProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [firstQuestionInput, setFirstQuestionInput] = useState("");

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentScreen(0);
      return;
    }

    if (typeof window !== "undefined") {
      const seen = localStorage.getItem("akuche_onboarding_master_v2");
      if (!seen) {
        setIsOpen(true);
      }
    }
  }, [forceOpen]);

  const handleNext = () => {
    if (currentScreen < 5) {
      setCurrentScreen((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = (initialPrompt?: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("akuche_onboarding_master_v2", "true");
    }
    setIsOpen(false);
    if (onClose) onClose();
    if (onComplete) onComplete();

    const promptToSend = (initialPrompt || firstQuestionInput).trim();
    if (promptToSend) {
      router.push(`/dashboard/ask?prompt=${encodeURIComponent(promptToSend)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-background p-5 sm:p-8 shadow-2xl text-foreground max-h-[92vh] overflow-y-auto">
        {/* Close Button if opened on demand */}
        {forceOpen && (
          <button
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* ─── SCREEN 0: MINIMALIST OPENING SPLASH ─── */}
        {currentScreen === 0 && (
          <div className="py-8 text-center space-y-6 animate-fade-in">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
              <Sparkles className="h-10 w-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                AKUCHE
              </h1>
              <p className="text-sm sm:text-base font-bold text-primary">
                Think better. Act smarter. Grow intentionally.
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto pt-2 leading-relaxed">
                Your intelligent personal thinking, problem-solving, and action companion.
              </p>
            </div>

            <button
              onClick={() => setCurrentScreen(1)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-primary/90 active:scale-95 min-h-[48px] touch-manipulation w-full sm:w-auto"
            >
              <span>Explore Akuche</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ─── SCREEN 1: THINK ─── */}
        {currentScreen === 1 && (
          <div className="py-4 space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
              <Brain className="h-4 w-4" />
              <span>STEP 1 OF 4 · THINK</span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Your mind is your most important tool.
            </h2>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm leading-relaxed text-foreground/90 space-y-2">
              <p>
                Akuche helps you think through real situations, challenges, decisions, and opportunities.
              </p>
              <p className="font-semibold text-foreground">
                Move from confusion to clarity, from clarity to action, and from action to measurable progress.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold shadow-md transition hover:bg-primary/90 active:scale-95 min-h-[48px] touch-manipulation"
            >
              <span>CONTINUE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ─── SCREEN 2: ASK ─── */}
        {currentScreen === 2 && (
          <div className="py-4 space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
              <HelpCircle className="h-4 w-4" />
              <span>STEP 2 OF 4 · ASK</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                Have a question? Ask Akuche.
              </h2>
              <p className="text-xs text-muted-foreground">
                You never have to guess what you&apos;re allowed to ask. Ask about any real area of life:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-foreground/90">
              {LIFE_DOMAINS.map((domain, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="truncate">{domain}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold shadow-md transition hover:bg-primary/90 active:scale-95 min-h-[48px] touch-manipulation"
            >
              <span>CONTINUE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ─── SCREEN 3: THINK + SOLVE ─── */}
        {currentScreen === 3 && (
          <div className="py-4 space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
              <Target className="h-4 w-4" />
              <span>STEP 3 OF 4 · THINK + SOLVE</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                Don&apos;t just get answers. Learn how to think.
              </h2>
              <p className="text-xs text-muted-foreground">
                When you bring a challenge, Akuche reasons through it with you:
              </p>
            </div>

            <div className="space-y-2 text-xs text-foreground/90">
              {[
                "1. Understand your exact situation & context",
                "2. Break down the core bottleneck and assumptions",
                "3. Reverse-engineer numbers and unit economics",
                "4. Compare realistic options and trade-offs",
                "5. Recommend practical, high-leverage next moves",
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50 border border-border/60"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">{step}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold shadow-md transition hover:bg-primary/90 active:scale-95 min-h-[48px] touch-manipulation"
            >
              <span>CONTINUE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ─── SCREEN 4: ACT ─── */}
        {currentScreen === 4 && (
          <div className="py-4 space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
              <Zap className="h-4 w-4" />
              <span>STEP 4 OF 4 · ACT</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                An idea becomes valuable when you act on it.
              </h2>
              <p className="text-xs text-muted-foreground">
                Akuche connects thinking directly to real execution:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-foreground">
              <div className="p-3 rounded-2xl bg-card border border-border flex items-center gap-2">
                <Target className="h-4 w-4 text-primary shrink-0" />
                <span>Meaningful Goals</span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Daily Actions</span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Mental Challenges</span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Progress & Growth</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen(5)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold shadow-md transition hover:bg-primary/90 active:scale-95 min-h-[48px] touch-manipulation"
            >
              <span>START MY AKUCHE JOURNEY</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ─── SCREEN 5: INTERACTIVE FIRST EXPERIENCE ("LET'S TRY AKUCHE") ─── */}
        {currentScreen === 5 && (
          <div className="py-3 space-y-4 animate-fade-in">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>LET&apos;S TRY AKUCHE</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                &ldquo;Tell me something you&apos;re currently trying to achieve, solve or understand.&rdquo;
              </h3>
            </div>

            <div className="space-y-2">
              <textarea
                rows={3}
                value={firstQuestionInput}
                onChange={(e) => setFirstQuestionInput(e.target.value)}
                placeholder="For example: I want to make ₦5 million before the end of the year..."
                className="w-full resize-none rounded-2xl border border-border bg-card px-3.5 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none leading-relaxed"
              />

              <button
                onClick={() => handleComplete(firstQuestionInput)}
                disabled={!firstQuestionInput.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition hover:bg-primary/90 disabled:opacity-40 active:scale-95 min-h-[44px] touch-manipulation"
              >
                <span>ASK AKUCHE</span>
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block text-center">
                Or choose one of these:
              </span>
              <div className="space-y-1.5">
                {EXAMPLE_FIRST_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleComplete(prompt)}
                    className="w-full text-left p-2.5 rounded-xl border border-border/70 bg-card/80 hover:bg-card hover:border-primary/40 text-xs font-medium text-foreground transition active:scale-95 touch-manipulation flex items-center justify-between gap-2"
                  >
                    <span className="truncate">«{prompt}»</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => handleComplete()}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
