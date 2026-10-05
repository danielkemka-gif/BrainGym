"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, Check } from "lucide-react";

interface ContextualGuidanceBannerProps {
  featureKey: "train" | "goals" | "ask" | "progress" | "journeys" | "insights" | "decisions" | string;
  title: string;
  description: string;
}

export function ContextualGuidanceBanner({
  featureKey,
  title,
  description,
}: ContextualGuidanceBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(`akuche_guidance_${featureKey}_dismissed`);
      if (!dismissed) {
        setVisible(true);
      }
    }
  }, [featureKey]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`akuche_guidance_${featureKey}_dismissed`, "true");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card p-3.5 sm:p-4 shadow-sm animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground mt-0.5 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-foreground">
              {title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-primary/15 hover:bg-primary text-primary hover:text-primary-foreground px-2.5 py-1 text-[11px] font-bold transition active:scale-95"
          title="Dismiss guidance"
        >
          <Check className="h-3 w-3" />
          <span>GOT IT</span>
        </button>
      </div>
    </div>
  );
}
