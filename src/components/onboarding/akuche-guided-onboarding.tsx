"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Brain,
  Sparkles,
  ArrowRight,
  Briefcase,
  DollarSign,
  MessageSquare,
  Target,
  Heart,
  HelpCircle,
  Check,
  X,
  Compass,
} from "lucide-react";

interface AkucheGuidedOnboardingProps {
  forceOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
  mode?: "modal" | "inline";
}

export const PERSONALISATION_OPTIONS = [
  {
    id: "business_career",
    label: "My Business or Career",
    icon: Briefcase,
    hint: "Strategy, work bottlenecks, projects & professional growth",
  },
  {
    id: "money_finance",
    label: "Money and Financial Decisions",
    icon: DollarSign,
    hint: "Pricing, cash flow, investments & sound financial choices",
  },
  {
    id: "relationships_communication",
    label: "Relationships and Communication",
    icon: MessageSquare,
    hint: "Difficult conversations, partnerships & clear communication",
  },
  {
    id: "goals_growth",
    label: "Goals and Personal Growth",
    icon: Target,
    hint: "Setting ambitious targets, discipline & milestone execution",
  },
  {
    id: "thinking_problem_solving",
    label: "Thinking and Problem-Solving",
    icon: Brain,
    hint: "Critical reasoning, cognitive models & unmasking assumptions",
  },
  {
    id: "habits_wellbeing",
    label: "My Habits and Well-being",
    icon: Heart,
    hint: "Daily focus, mental composure, routine & reducing overwhelm",
  },
  {
    id: "something_else",
    label: "Something Else",
    icon: Compass,
    hint: "Any other dilemma, idea, or situation you want to deconstruct",
  },
];

export function AkucheGuidedOnboarding({
  forceOpen = false,
  onClose,
  onComplete,
  mode = "modal",
}: AkucheGuidedOnboardingProps) {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"welcome" | "personalise">("welcome");
  const [selectedOption, setSelectedOption] = useState<string>("business_career");
  const [freeTextNote, setFreeTextNote] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setStep("welcome");
      return;
    }

    let isMounted = true;

    async function checkFirstTimeStatus() {
      // 1. Check local storage first
      if (typeof window !== "undefined") {
        const localDone = localStorage.getItem("akuche_onboarding_completed");
        if (localDone === "true") {
          return;
        }
      }

      // 2. If authenticated, check server-side profile to respect cross-device returning users
      if (user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_complete")
            .eq("user_id", user.id)
            .maybeSingle();

          if (profile && profile.onboarding_complete) {
            if (typeof window !== "undefined") {
              localStorage.setItem("akuche_onboarding_completed", "true");
            }
            return;
          }
        } catch {
          // Graceful fallback to local storage
        }
      }

      if (isMounted) {
        setIsOpen(true);
      }
    }

    checkFirstTimeStatus();

    return () => {
      isMounted = false;
    };
  }, [forceOpen, user, supabase]);

  const markCompletedOnServer = async (chosenOption?: string, note?: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("akuche_onboarding_completed", "true");
      if (chosenOption) {
        localStorage.setItem("akuche_selected_focus", chosenOption);
      }
    }

    if (user) {
      try {
        await supabase
          .from("profiles")
          .update({
            onboarding_complete: true,
            goals: chosenOption ? [chosenOption] : ["General Clarity"],
          })
          .eq("user_id", user.id);
      } catch (err) {
        console.error("Failed to update profile onboarding status:", err);
      }
    }
  };

  const handleExploreFirst = async () => {
    await markCompletedOnServer();
    setIsOpen(false);
    if (onClose) onClose();
    if (onComplete) onComplete();
    router.push("/dashboard");
  };

  const handleFinishPersonalisation = async (skip: boolean = false) => {
    setSaving(true);
    const chosen = skip ? undefined : selectedOption;
    await markCompletedOnServer(chosen, freeTextNote);
    setSaving(false);
    setIsOpen(false);
    if (onClose) onClose();
    if (onComplete) onComplete();

    // If user provided a specific note, take them straight to their first coaching conversation
    if (!skip && freeTextNote.trim()) {
      router.push(`/dashboard/ask?prompt=${encodeURIComponent(freeTextNote.trim())}`);
    } else {
      router.push("/dashboard");
    }
  };

  if (!isOpen) return null;

  const content = (
    <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl text-foreground">
      {/* Dismiss button if force opened */}
      {forceOpen && (
        <button
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* ─── STAGE 1: FIRST-VISIT WELCOME EXPERIENCE (EXACT COPY) ─── */}
      {step === "welcome" ? (
        <div className="space-y-6 text-center py-2 animate-in fade-in duration-300">
          <div className="mx-auto flex justify-center">
            <AkucheBrandLogo variant="mark" size="lg" animate />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-heading">
              Welcome to Akuche.
            </h1>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto text-left sm:text-center">
              <p>
                Life presents us with questions, challenges, and decisions every day.
              </p>
              <p>
                Akuche helps you think things through, explore your options, and take practical steps towards the things that matter to you.
              </p>
              <p className="font-semibold text-foreground/90">
                You don&apos;t have to figure everything out at once. Let&apos;s start with what matters to you today.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep("personalise")}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 touch-manipulation cursor-pointer"
            >
              <span>Let&apos;s Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleExploreFirst}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-border bg-background hover:bg-accent text-foreground font-semibold text-sm transition-all active:scale-[0.98] touch-manipulation cursor-pointer"
            >
              Explore First
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-muted-foreground">
              Train Your Mind · Decide Better · Live Better
            </span>
          </div>
        </div>
      ) : (
        /* ─── STAGE 2: SHORT LIGHTWEIGHT PERSONALISATION FLOW ─── */
        <div className="space-y-5 py-1 animate-in fade-in duration-300">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold text-primary">
              <Sparkles className="h-3 w-3" />
              <span>Step 2 of 2 · Quick Setup</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading">
              What would you like a little help with today?
            </h2>
            <p className="text-xs text-muted-foreground">
              Choose one area to focus on. You can change this anytime.
            </p>
          </div>

          {/* 7 Options List */}
          <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
            {PERSONALISATION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-left touch-manipulation ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-xs"
                      : "border-border/80 bg-background hover:bg-muted/60 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold block truncate text-foreground">
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground block line-clamp-1">
                        {opt.hint}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional Free-Text Input */}
          <div className="space-y-1.5 pt-1 border-t border-border/60">
            <label
              htmlFor="onboarding-free-text"
              className="text-xs font-bold text-foreground flex items-center justify-between"
            >
              <span>Tell me a little about what you&apos;re trying to work through (optional)</span>
            </label>
            <input
              id="onboarding-free-text"
              type="text"
              value={freeTextNote}
              onChange={(e) => setFreeTextNote(e.target.value)}
              placeholder="E.g. Deciding between two career offers, or pricing my first service..."
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleFinishPersonalisation(true)}
              disabled={saving}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Skip for now
            </button>

            <button
              type="button"
              onClick={() => handleFinishPersonalisation(false)}
              disabled={saving}
              className="py-3 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs sm:text-sm shadow-md transition active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              <span>{freeTextNote.trim() ? "Talk to Akuche" : "Continue to Akuche"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (mode === "inline") {
    return <div className="w-full max-w-lg mx-auto">{content}</div>;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Akuche"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      {content}
    </div>
  );
}
