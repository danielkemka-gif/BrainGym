"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  ArrowRight,
  Brain,
  Scale,
  Target,
  Sparkles,
  HelpCircle,
  X,
  BookOpen,
} from "lucide-react";

interface AkucheBookExperienceProps {
  forceOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

export function AkucheBookExperience({
  forceOpen = false,
  onClose,
  onComplete,
}: AkucheBookExperienceProps) {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"cover" | "introduction" | "welcome">("cover");
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    // Determine user's first name if available
    if (user) {
      const rawName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "";
      if (rawName) {
        setFirstName(rawName.split(" ")[0]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setStage("cover");
      return;
    }

    // Check if user has already experienced or dismissed the book introduction
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("akuche_book_intro_completed");
      if (completed === "true") {
        return;
      }
    }

    // Check server profile for cross-device returning users
    async function checkServerProfile() {
      if (user) {
        try {
          const { data } = await supabase
            .from("profiles")
            .select("onboarding_complete")
            .eq("user_id", user.id)
            .maybeSingle();

          if (data?.onboarding_complete) {
            if (typeof window !== "undefined") {
              localStorage.setItem("akuche_book_intro_completed", "true");
            }
            return;
          }
          setIsOpen(true);
        } catch {
          setIsOpen(true);
        }
      } else {
        // Unauthenticated first-time visitor
        if (typeof window !== "undefined") {
          const completed = localStorage.getItem("akuche_book_intro_completed");
          if (!completed) {
            setIsOpen(true);
          }
        }
      }
    }

    checkServerProfile();
  }, [forceOpen, user, supabase]);

  const markCompleted = async () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("akuche_book_intro_completed", "true");
    }
    if (user) {
      try {
        await supabase
          .from("profiles")
          .update({ onboarding_complete: true })
          .eq("user_id", user.id);
      } catch (err) {
        console.error("Failed to update profile completion:", err);
      }
    }
  };

  const handleFinishAndNavigate = async (destinationUrl: string) => {
    await markCompleted();
    setIsOpen(false);
    if (onClose) onClose();
    if (onComplete) onComplete();
    router.push(destinationUrl);
  };

  const handleSkipToDashboard = async () => {
    await markCompleted();
    setIsOpen(false);
    if (onClose) onClose();
    if (onComplete) onComplete();
    router.push("/dashboard");
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Akuche Book Experience"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto select-none"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-[#FFFFFF] dark:bg-[#122119] text-[#17231D] dark:text-[#F7F9F5] shadow-2xl p-6 sm:p-10 max-h-[94vh] overflow-y-auto transition-all duration-300">
        {/* Optional Close / Skip Button */}
        <button
          type="button"
          onClick={handleSkipToDashboard}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
          title="Skip to Dashboard"
          aria-label="Skip to Dashboard"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ─── STAGE A: THE COVER ─── */}
        {stage === "cover" && (
          <div className="flex flex-col items-center justify-center text-center space-y-8 py-6 sm:py-10 animate-in fade-in zoom-in-95 duration-400">
            {/* Subtle Brand Mark */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-28 w-28 rounded-full bg-emerald-500/15 blur-2xl" />
              <AkucheBrandLogo variant="mark" size="xl" animate />
            </div>

            {/* Dominant Book Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground font-heading">
                AKUCHE
              </h1>
              <p className="text-base sm:text-lg font-medium text-muted-foreground leading-relaxed">
                Think clearly. Choose wisely. Move forward.
              </p>
            </div>

            {/* Generous Whitespace & Single Primary Action */}
            <div className="pt-4 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setStage("introduction")}
                className="w-full py-4 px-8 rounded-2xl bg-[#167A52] hover:bg-[#10563C] text-white font-black text-base shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer touch-manipulation"
              >
                <span>OPEN AKUCHE</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─── STAGE B: THE INTRODUCTION PAGE ─── */}
        {stage === "introduction" && (
          <div className="space-y-6 text-center sm:text-left py-4 sm:py-6 animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#167A52] dark:text-emerald-400">
                Introduction
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground font-heading">
                AKUCHE
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                Your personal AI thinking and life coach.
              </p>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
              <p>
                Life sometimes presents us with difficult decisions, confusing situations, and problems we don&apos;t know how to solve.
              </p>
              <p>
                Akuche helps you think through these situations, explore your options, make better decisions, and take practical steps forward.
              </p>
              <p className="font-semibold text-foreground">
                You don&apos;t have to figure everything out alone.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setStage("welcome")}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#167A52] hover:bg-[#10563C] text-white font-black text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <span>LET&apos;S BEGIN</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleSkipToDashboard}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-xs sm:text-sm font-semibold transition"
              >
                Skip to Home
              </button>
            </div>
          </div>
        )}

        {/* ─── STAGE C: THE PERSONAL WELCOME & 4 CHOICES ─── */}
        {stage === "welcome" && (
          <div className="space-y-5 py-2 animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
                {firstName ? `Welcome, ${firstName}.` : "Welcome."}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                I&apos;m here to help you think things through, work through challenges, and make progress on the things that matter to you.
              </p>
              <p className="text-xs text-muted-foreground/90">
                You don&apos;t need to know where to start. We&apos;ll figure that out together.
              </p>
            </div>

            <div className="pt-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#167A52] dark:text-emerald-400 mb-2.5">
                WHAT WOULD YOU LIKE HELP WITH TODAY?
              </h3>

              <div className="space-y-2.5">
                {/* 1. SOMETHING IS BOTHERING ME */}
                <button
                  type="button"
                  onClick={() =>
                    handleFinishAndNavigate(
                      "/dashboard/ask?prompt=" +
                        encodeURIComponent("Something is bothering me. Help me think through this difficult situation step by step.")
                    )
                  }
                  className="w-full p-3.5 rounded-2xl border border-border/80 bg-background hover:border-[#167A52] hover:bg-[#167A52]/5 transition text-left group flex items-start gap-3 touch-manipulation"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-foreground block group-hover:text-[#167A52] dark:group-hover:text-emerald-400 transition">
                      1. SOMETHING IS BOTHERING ME
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Help me think through a problem or difficult situation.
                    </p>
                  </div>
                </button>

                {/* 2. I WANT TO MAKE A BETTER DECISION */}
                <button
                  type="button"
                  onClick={() =>
                    handleFinishAndNavigate(
                      "/dashboard/decisions"
                    )
                  }
                  className="w-full p-3.5 rounded-2xl border border-border/80 bg-background hover:border-[#167A52] hover:bg-[#167A52]/5 transition text-left group flex items-start gap-3 touch-manipulation"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition">
                    <Scale className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-foreground block group-hover:text-[#167A52] dark:group-hover:text-emerald-400 transition">
                      2. I WANT TO MAKE A BETTER DECISION
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Help me understand my options and their possible consequences.
                    </p>
                  </div>
                </button>

                {/* 3. I WANT TO ACHIEVE SOMETHING */}
                <button
                  type="button"
                  onClick={() => handleFinishAndNavigate("/dashboard/goals")}
                  className="w-full p-3.5 rounded-2xl border border-border/80 bg-background hover:border-[#167A52] hover:bg-[#167A52]/5 transition text-left group flex items-start gap-3 touch-manipulation"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition">
                    <Target className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-foreground block group-hover:text-[#167A52] dark:group-hover:text-emerald-400 transition">
                      3. I WANT TO ACHIEVE SOMETHING
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Help me turn a goal into practical steps.
                    </p>
                  </div>
                </button>

                {/* 4. I WANT TO TRAIN MY MIND */}
                <button
                  type="button"
                  onClick={() => handleFinishAndNavigate("/dashboard/daily-challenge")}
                  className="w-full p-3.5 rounded-2xl border border-border/80 bg-background hover:border-[#167A52] hover:bg-[#167A52]/5 transition text-left group flex items-start gap-3 touch-manipulation"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition">
                    <Brain className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-foreground block group-hover:text-[#167A52] dark:group-hover:text-emerald-400 transition">
                      4. I WANT TO TRAIN MY MIND
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Help me improve my thinking through guided mental exercises.
                    </p>
                  </div>
                </button>

                {/* 5. I'M NOT SURE YET */}
                <button
                  type="button"
                  onClick={() =>
                    handleFinishAndNavigate(
                      "/dashboard/ask?prompt=" +
                        encodeURIComponent("I'm not sure yet where to begin. Help me explore what to focus on first.")
                    )
                  }
                  className="w-full p-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 hover:border-primary transition text-left group flex items-center justify-between touch-manipulation"
                >
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                    I&apos;m not sure yet. Help me find my starting point.
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
