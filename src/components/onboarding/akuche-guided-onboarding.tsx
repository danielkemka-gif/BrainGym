"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Brain,
  Sparkles,
  ArrowRight,
  Compass,
  Briefcase,
  Users,
  Target,
  Heart,
  CheckCircle2,
  X,
} from "lucide-react";

interface AkucheGuidedOnboardingProps {
  forceOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

const FOCUS_CATEGORIES = [
  {
    id: "thinking",
    label: "Thinking & problem-solving",
    icon: Brain,
    desc: "Sharpen critical thinking, logic, and clarity under uncertainty",
  },
  {
    id: "memory",
    label: "Memory & concentration",
    icon: Sparkles,
    desc: "Strengthen focus, recall, and cognitive working memory",
  },
  {
    id: "business",
    label: "Business & financial decisions",
    icon: Briefcase,
    desc: "Make sound commercial choices, evaluate risks, and scale value",
  },
  {
    id: "relationships",
    label: "Relationships & communication",
    icon: Users,
    desc: "Communicate with precision, resolve conflict, and build trust",
  },
  {
    id: "goals",
    label: "Goals, discipline & habits",
    icon: Target,
    desc: "Turn decisions into tangible action, daily streaks, and follow-through",
  },
  {
    id: "wellbeing",
    label: "Personal wellbeing",
    icon: Heart,
    desc: "Maintain mental composure, manage overwhelm, and build resilience",
  },
];

export function AkucheGuidedOnboarding({
  forceOpen = false,
  onClose,
  onComplete,
}: AkucheGuidedOnboardingProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"welcome" | "categories">("welcome");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "thinking",
    "business",
  ]);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setStep("welcome");
      return;
    }

    if (typeof window !== "undefined") {
      const seen = localStorage.getItem("akuche_onboarding_completed_v3");
      if (!seen) {
        setIsOpen(true);
      }
    }
  }, [forceOpen]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinish = (action: "journey" | "explore") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("akuche_onboarding_completed_v3", "true");
      localStorage.setItem(
        "akuche_user_focus_areas",
        JSON.stringify(selectedCategories)
      );
    }
    setIsOpen(false);
    if (onClose) onClose();
    if (onComplete) onComplete();

    if (action === "journey") {
      // Direct user to start their first brain challenge or consulting session
      router.push("/dashboard/daily-challenge");
    } else {
      router.push("/dashboard");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Akuche Onboarding"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-border/90 bg-card p-6 sm:p-8 shadow-2xl text-foreground max-h-[92vh] overflow-y-auto">
        {/* Dismiss / Close button if force opened */}
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

        {/* ─── STAGE 1: WELCOME & VISION ─── */}
        {step === "welcome" ? (
          <div className="space-y-6 text-center animate-fade-in py-2">
            <div className="mx-auto flex justify-center">
              <AkucheBrandLogo variant="mark" size="lg" animate />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Welcome to Akuche.
              </h1>
              <p className="text-sm sm:text-base font-bold text-primary">
                Your AI Brain Training Coach.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Train your mind. Think clearly. Make better decisions in
                business, relationships and everyday life.
              </p>
            </div>

            {/* Core Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setStep("categories")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 text-xs sm:text-sm font-bold shadow-md transition hover:bg-primary/90 active:scale-95 min-h-[48px] touch-manipulation uppercase tracking-wider"
              >
                <span>START MY JOURNEY</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleFinish("explore")}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-border bg-background hover:bg-muted text-foreground px-6 py-3.5 text-xs sm:text-sm font-bold transition active:scale-95 min-h-[48px] touch-manipulation uppercase tracking-wider"
              >
                <span>EXPLORE AKUCHE</span>
              </button>
            </div>
          </div>
        ) : (
          /* ─── STAGE 2: MULTI-SELECT FOCUS AREAS ─── */
          <div className="space-y-5 animate-fade-in py-1">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black text-primary uppercase tracking-wider">
                <Compass className="h-3.5 w-3.5" />
                <span>Personalize Your Training</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-foreground">
                What areas would you like to focus on?
              </h2>
              <p className="text-xs text-muted-foreground">
                Select all that matter to you right now. You can change these anytime.
              </p>
            </div>

            {/* Multi-Select Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {FOCUS_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-start gap-3 p-3 text-left rounded-2xl border transition active:scale-95 touch-manipulation min-h-[64px] ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40"
                        : "border-border/80 bg-background hover:border-border"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-foreground block truncate">
                          {cat.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {cat.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Confirm & Launch Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleFinish("journey")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3.5 text-xs sm:text-sm font-bold shadow-md transition hover:bg-primary/90 active:scale-95 min-h-[48px] touch-manipulation uppercase tracking-wider"
              >
                <span>CONTINUE TO MY DASHBOARD</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setStep("welcome")}
                className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground py-1"
              >
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
