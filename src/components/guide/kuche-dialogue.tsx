"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles, Check, ChevronRight } from "lucide-react";

export interface KucheDialogueOption {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface KucheDialogueProps {
  badge?: string;
  title?: string;
  message: string;
  options?: KucheDialogueOption[];
  onClose?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  stepIndicator?: { current: number; total: number };
  actionCta?: string;
  actionHref?: string;
  className?: string;
}

export function KucheDialogue({
  badge,
  title,
  message,
  options,
  onClose,
  onNext,
  onPrev,
  stepIndicator,
  actionCta,
  actionHref,
  className = "",
}: KucheDialogueProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`relative w-full max-w-sm rounded-3xl border border-border/80 bg-card/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl text-foreground text-left ${className}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby="kuche-dialogue-title"
    >
      {/* Top Bar with Badge, Steps and Close */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#167A52]/10 dark:bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#167A52] dark:text-emerald-400">
              <Sparkles className="h-3 w-3" />
              <span>{badge}</span>
            </span>
          )}
          {stepIndicator && (
            <span className="text-[10px] font-bold text-muted-foreground">
              {stepIndicator.current}/{stepIndicator.total}
            </span>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition touch-manipulation"
            aria-label="Dismiss guide tip"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Title */}
      {title && (
        <h3
          id="kuche-dialogue-title"
          className="text-base font-black tracking-tight text-foreground font-heading mb-1.5"
        >
          {title}
        </h3>
      )}

      {/* Message Body */}
      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal mb-3.5">
        {message}
      </p>

      {/* Optional Direct Action Link */}
      {actionCta && actionHref && (
        <div className="mb-3">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167A52] dark:text-emerald-400 hover:underline active:scale-98 transition"
          >
            <span>{actionCta}</span>
          </Link>
        </div>
      )}

      {/* Custom Options List (e.g. Onboarding 3 paths) */}
      {options && options.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={opt.onClick}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between touch-manipulation active:scale-[0.98] ${
                opt.primary
                  ? "bg-[#167A52] hover:bg-[#10563C] text-white shadow-xs"
                  : "bg-muted/60 hover:bg-muted text-foreground border border-border/60"
              }`}
            >
              <span>{opt.label}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-70" />
            </button>
          ))}
        </div>
      )}

      {/* Step Stepper Navigation (Previous / Next) */}
      {(onNext || onPrev) && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60 mt-2">
          {onPrev ? (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-[#167A52] hover:bg-[#10563C] text-white text-xs font-bold shadow-xs active:scale-95 transition"
            >
              <span>Next</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
