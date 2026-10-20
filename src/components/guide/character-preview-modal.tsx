"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KucheCharacter, KucheAnimationState } from "./kuche-character";
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  Heart,
  HelpCircle,
  CheckCircle2,
  Brain,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Volume2,
} from "lucide-react";

export function CharacterPreviewModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeState, setActiveState] = useState<KucheAnimationState>("idle");
  const [activeSize, setActiveSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  const [direction, setDirection] = useState<"left" | "right" | "up" | "down">("right");
  const [reducedMotion, setReducedMotion] = useState(false);

  if (!isOpen) return null;

  const STATES: {
    key: KucheAnimationState;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: "idle",
      label: "1. Idle",
      description: "Subtle breathing, periodic natural blinking every 4s, floating spark.",
      icon: RotateCcw,
    },
    {
      key: "welcome",
      label: "2. Welcome",
      description: "Warm open smile, smooth right-hand greeting wave, golden sparkles.",
      icon: Sparkles,
    },
    {
      key: "explain",
      label: "3. Explain",
      description: "Attentive gaze toward interface, extended index finger pointing with directional beam.",
      icon: ArrowRight,
    },
    {
      key: "encourage",
      label: "4. Encourage",
      description: "Empathetic nod, supportive thumbs-up, soft radiating emerald aura.",
      icon: Heart,
    },
    {
      key: "success",
      label: "5. Success",
      description: "Celebratory triumph bounce, celebratory confetti burst, happy crescent eyes.",
      icon: CheckCircle2,
    },
    {
      key: "thinking",
      label: "6. Thinking",
      description: "Head tilts 4°, pensive hand to chin, eyes glance upward, orbiting thought dots.",
      icon: Brain,
    },
    {
      key: "hidden",
      label: "7. Hidden",
      description: "Collapses cleanly out of view to avoid obstructing user actions.",
      icon: EyeOff,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kuche Character Animation Showcase"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 select-none overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-border/80 bg-card text-foreground shadow-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                CHARACTER DEMONSTRATION
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-heading">
                Meet &quot;Kuche&quot;
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Akuche&apos;s friendly onboarding guide &amp; contextual thinking companion.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
            aria-label="Close character preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Character Stage Showcase */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-muted/30 to-card p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
          {/* Background grid accent */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

          {/* Character Render */}
          <div className="relative z-10 flex items-center justify-center py-2">
            <KucheCharacter
              state={activeState}
              size={activeSize}
              pointingDirection={direction}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Current State Indicator */}
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Active State:</span>
              <strong className="uppercase">{activeState}</strong>
            </span>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1.5">
              {STATES.find((s) => s.key === activeState)?.description}
            </p>
          </div>
        </div>

        {/* State Selector Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Select Animation State to Test:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STATES.map((s) => {
              const Icon = s.icon;
              const isSelected = activeState === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveState(s.key)}
                  className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition text-left touch-manipulation ${
                    isSelected
                      ? "border-[#167A52] bg-[#167A52]/10 text-[#167A52] dark:text-emerald-400 shadow-xs"
                      : "border-border/70 bg-card hover:bg-muted text-foreground/80"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Direction Controls (Active when Explain is chosen) */}
        {activeState === "explain" && (
          <div className="p-3 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-1.5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">
              Pointing Direction for &quot;Explain&quot;:
            </span>
            <div className="flex gap-2">
              {(["left", "right", "up", "down"] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setDirection(dir)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition ${
                    direction === dir
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size & Motion Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-semibold">Scale:</span>
            {(["sm", "md", "lg", "xl"] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setActiveSize(sz)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition ${
                  activeSize === sz
                    ? "bg-[#167A52] text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-muted-foreground">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="rounded border-border text-[#167A52] focus:ring-[#167A52]"
            />
            <span>Test Reduced Motion</span>
          </label>
        </div>

        {/* Footer with Close */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-[#167A52] hover:bg-[#10563C] text-white text-xs font-bold transition active:scale-95 shadow-xs"
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
}
