"use client";

import { useState, useEffect } from "react";
import {
  BENCHMARK_PERSONAS,
  BenchmarkPersona,
  getActiveBenchmarkPersonaId,
  applyBenchmarkPersona,
  getActivePersonalizationProfile,
  UserPersonalizationProfile,
} from "@/lib/personalization";
import {
  Users,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  Sliders,
  X,
} from "lucide-react";

interface PersonaPreviewSwitcherProps {
  onPersonaChange?: (profile: UserPersonalizationProfile) => void;
  variant?: "floating" | "inline" | "header_badge";
}

export function PersonaPreviewSwitcher({
  onPersonaChange,
  variant = "floating",
}: PersonaPreviewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<UserPersonalizationProfile | null>(null);

  useEffect(() => {
    setActivePersonaId(getActiveBenchmarkPersonaId());
    setActiveProfile(getActivePersonalizationProfile());
  }, []);

  const handleSelectPersona = (persona: BenchmarkPersona) => {
    const updated = applyBenchmarkPersona(persona.id);
    setActivePersonaId(persona.id);
    setActiveProfile(updated);
    if (onPersonaChange) {
      onPersonaChange(updated);
    }
    setIsOpen(false);
    // Trigger full page refresh so all dashboard and workout views immediately re-render with new persona context
    window.location.reload();
  };

  return (
    <>
      {/* Trigger Button */}
      {variant === "floating" && (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card/90 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-foreground shadow-lg hover:border-primary hover:bg-primary/10 active:scale-95 transition touch-manipulation"
          title="Switch User Persona & Age Context for Testing"
        >
          <Users className="h-4 w-4 text-primary animate-pulse" />
          <span className="hidden sm:inline">Test Life Persona:</span>
          <span className="font-extrabold text-primary">
            {activeProfile?.name || "Active Persona"} ({activeProfile?.ageRange})
          </span>
        </button>
      )}

      {variant === "inline" && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-black uppercase text-primary tracking-wider">
                Multi-Generational Persona Switcher
              </span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground">
              Instant QA Verification
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Test how BrainGym adapts content and real-life scenarios for different life stages:
          </p>
          <div className="flex flex-wrap gap-2">
            {BENCHMARK_PERSONAS.map((persona) => {
              const isSelected = activePersonaId === persona.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => handleSelectPersona(persona)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 touch-manipulation ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  <span>{persona.name} ({persona.age}y)</span>
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal View */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
                <Brain className="h-4 w-4" />
                <span>One Brain. Different Lives. Same Mental Fitness.</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                Select a Life Persona to Test
              </h2>
              <p className="text-xs text-muted-foreground">
                See how BrainGym trains the exact same universal mental abilities (Decision-Making, Focus, Memory, Problem-Solving) while adapting context and difficulty to each persona.
              </p>
            </div>

            {/* Personas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {BENCHMARK_PERSONAS.map((persona) => {
                const isSelected = activePersonaId === persona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => handleSelectPersona(persona)}
                    className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
                        : "border-border bg-background hover:border-primary/40 hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-foreground">
                        {persona.name}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                        {persona.ageRange} ({persona.age} yrs)
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-primary mt-1">
                      {persona.lifeSituations.join(" · ")}
                    </p>

                    <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                      {persona.bio}
                    </p>

                    <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Primary: <strong>{persona.primaryGoal}</strong></span>
                      <span className="font-bold text-foreground">Level {persona.currentDifficultyLevel}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl bg-muted/60 p-3.5 text-xs text-muted-foreground border-l-2 border-primary space-y-1">
              <span className="font-bold text-foreground block">
                🛡️ Universal Framework Guarantee:
              </span>
              <p>
                No matter which persona is selected, BrainGym maintains the same universal cognitive standards. Teens receive youth-safe scenarios, adults receive workplace/financial dilemmas, and seniors receive strategic/mentorship challenges—all training universal mental fitness.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
