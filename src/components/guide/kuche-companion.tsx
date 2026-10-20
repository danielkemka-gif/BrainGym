"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { KucheCharacter, KucheAnimationState } from "./kuche-character";
import { KucheDialogue } from "./kuche-dialogue";
import { KUCHE_TOUR_STEPS, TourStep } from "./kuche-tour-steps";
import { Sparkles, HelpCircle, Compass, Target, X, ChevronUp, Eye, EyeOff } from "lucide-react";

export const START_KUCHE_TOUR_EVENT = "akuche:start-tour";
export const KUCHE_CELEBRATE_EVENT = "akuche:guide-celebrate";
export const KUCHE_STATE_EVENT = "akuche:guide-set-state";

export function KucheCompanion() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [mode, setMode] = useState<"onboarding" | "tour" | "contextual" | "minimized" | "hidden">("minimized");
  const [characterState, setCharacterState] = useState<KucheAnimationState>("idle");
  const [pointingDirection, setPointingDirection] = useState<"left" | "right" | "up" | "down">("right");
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [contextualMessage, setContextualMessage] = useState<{
    badge: string;
    title: string;
    text: string;
    actionCta?: string;
    actionHref?: string;
  } | null>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [guideEnabled, setGuideEnabled] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // 1. Check user preferences & reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const userPrefReduced = localStorage.getItem("akuche_guide_reduced_motion") === "true";
    setReducedMotion(mediaQuery.matches || userPrefReduced);

    // Guide enabled preference
    const enabled = localStorage.getItem("akuche_guide_enabled");
    if (enabled === "false") {
      setGuideEnabled(false);
      setMode("hidden");
      return;
    }

    // First time onboarding check (only on dashboard root)
    const onboardingSeen = localStorage.getItem("akuche_guide_onboarding_v1");
    if (!onboardingSeen && pathname === "/dashboard") {
      const timer = setTimeout(() => {
        setMode("onboarding");
        setCharacterState("welcome");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // 2. Keyboard & form focus safety: auto-minimize when typing on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // 3. Listen to global custom events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStartTour = () => {
      setCurrentTourIndex(0);
      setMode("tour");
      setCharacterState("explain");
      const firstStep = KUCHE_TOUR_STEPS[0];
      setPointingDirection(firstStep.pointingDirection);
    };

    const handleCelebrate = () => {
      setCharacterState("success");
      setContextualMessage({
        badge: "MOMENTUM UNLOCKED",
        title: "Action Completed!",
        text: "Well done! You turned insight into real execution. That's how thinking becomes tangible progress.",
      });
      setMode("contextual");
      setTimeout(() => {
        setCharacterState("idle");
      }, 4500);
    };

    const handleSetState = (e: CustomEvent) => {
      if (e.detail?.state) {
        setCharacterState(e.detail.state);
      }
    };

    window.addEventListener(START_KUCHE_TOUR_EVENT, handleStartTour);
    window.addEventListener(KUCHE_CELEBRATE_EVENT, handleCelebrate);
    window.addEventListener(KUCHE_STATE_EVENT, handleSetState as EventListener);

    return () => {
      window.removeEventListener(START_KUCHE_TOUR_EVENT, handleStartTour);
      window.removeEventListener(KUCHE_CELEBRATE_EVENT, handleCelebrate);
      window.removeEventListener(KUCHE_STATE_EVENT, handleSetState as EventListener);
    };
  }, []);

  // 4. Update pointing direction when tour step changes
  useEffect(() => {
    if (mode === "tour") {
      const step = KUCHE_TOUR_STEPS[currentTourIndex];
      if (step) {
        setPointingDirection(step.pointingDirection);
        setCharacterState("explain");

        // Scroll target into view gently if present
        if (typeof document !== "undefined" && step.targetSelector) {
          const el = document.querySelector(step.targetSelector);
          if (el) {
            el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
          }
        }
      }
    }
  }, [currentTourIndex, mode, reducedMotion]);

  if (!guideEnabled || mode === "hidden" || isKeyboardOpen) {
    return null;
  }

  // Dismiss onboarding
  const handleDismissOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("akuche_guide_onboarding_v1", "true");
    }
    setMode("minimized");
    setCharacterState("idle");
  };

  // Start guided tour
  const handleStartTourFromOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("akuche_guide_onboarding_v1", "true");
    }
    setCurrentTourIndex(0);
    setMode("tour");
    setCharacterState("explain");
  };

  // Tour navigation
  const handleNextTourStep = () => {
    if (currentTourIndex < KUCHE_TOUR_STEPS.length - 1) {
      setCurrentTourIndex((prev) => prev + 1);
    } else {
      // Completed tour! Celebrate
      setCharacterState("success");
      setContextualMessage({
        badge: "TOUR COMPLETE",
        title: "You're All Set!",
        text: "You know your way around Akuche. Whenever you need clarity, I'll be right here to think things through.",
      });
      setMode("contextual");
      setTimeout(() => {
        setMode("minimized");
        setCharacterState("idle");
      }, 4500);
    }
  };

  const handlePrevTourStep = () => {
    if (currentTourIndex > 0) {
      setCurrentTourIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      aria-label="Akuche Guide Companion"
      className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none select-none max-w-sm"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* ─── A. DIALOGUE CARD ─── */}
      <AnimatePresence mode="wait">
        {mode === "onboarding" && (
          <div className="pointer-events-auto w-full">
            <KucheDialogue
              badge="MEET KUCHE"
              title="Welcome to Akuche!"
              message="I'm here to help you think clearly, make better decisions, and turn your ideas into action. What would you like us to work on today?"
              onClose={handleDismissOnboarding}
              options={[
                {
                  label: "Help me make a decision",
                  primary: true,
                  onClick: () => {
                    handleDismissOnboarding();
                    router.push("/dashboard/decisions");
                  },
                },
                {
                  label: "Help me achieve a goal",
                  onClick: () => {
                    handleDismissOnboarding();
                    router.push("/dashboard/goals");
                  },
                },
                {
                  label: "Help me understand Akuche (Tour)",
                  onClick: handleStartTourFromOnboarding,
                },
              ]}
            />
          </div>
        )}

        {mode === "tour" && (
          <div className="pointer-events-auto w-full">
            {(() => {
              const step = KUCHE_TOUR_STEPS[currentTourIndex];
              return (
                <KucheDialogue
                  badge={step.badge}
                  title={step.title}
                  message={step.message}
                  actionCta={step.actionCta}
                  actionHref={step.actionHref}
                  stepIndicator={{
                    current: currentTourIndex + 1,
                    total: KUCHE_TOUR_STEPS.length,
                  }}
                  onPrev={currentTourIndex > 0 ? handlePrevTourStep : undefined}
                  onNext={handleNextTourStep}
                  onClose={() => {
                    setMode("minimized");
                    setCharacterState("idle");
                  }}
                />
              );
            })()}
          </div>
        )}

        {mode === "contextual" && contextualMessage && (
          <div className="pointer-events-auto w-full">
            <KucheDialogue
              badge={contextualMessage.badge}
              title={contextualMessage.title}
              message={contextualMessage.text}
              actionCta={contextualMessage.actionCta}
              actionHref={contextualMessage.actionHref}
              onClose={() => {
                setMode("minimized");
                setCharacterState("idle");
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ─── B. THE CHARACTER AVATAR DOCKED TRIGGER ─── */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Floating companion character */}
        <div
          onClick={() => {
            if (mode === "minimized") {
              setMode("onboarding");
              setCharacterState("welcome");
            } else {
              setMode("minimized");
              setCharacterState("idle");
            }
          }}
          className="relative transition-transform active:scale-95 cursor-pointer touch-manipulation group"
          title={mode === "minimized" ? "Open Kuche Guide" : "Minimize Kuche"}
        >
          {/* Subtle glow plate behind avatar */}
          <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-md group-hover:bg-emerald-500/35 transition" />

          {/* Character in responsive size */}
          <div className="relative rounded-full border-2 border-[#167A52]/40 bg-card/90 backdrop-blur-md p-1 shadow-xl">
            <KucheCharacter
              state={characterState}
              size={mode === "minimized" ? "sm" : "md"}
              pointingDirection={pointingDirection}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Quick status badge if minimized */}
          {mode === "minimized" && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[9px] font-bold shadow-xs">
              ✦
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
