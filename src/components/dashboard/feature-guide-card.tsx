"use client";

import Link from "next/link";
import { BookOpen, Compass, Sparkles, ArrowRight, Zap, Brain, Bot, Scale } from "lucide-react";
import { OPEN_NAVIGATOR_EVENT } from "@/components/layout/feature-navigator";

export function FeatureGuideCard() {
  function handleOpenNavigator() {
    window.dispatchEvent(new Event(OPEN_NAVIGATOR_EVENT));
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-violet-500/10 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-md">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                New to BrainGym? Explore Features & Clarity Guide
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                <Sparkles className="h-3 w-3" /> Quick Start
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              Learn how the 7 brain fitness pillars, Brain Age tests, Decision Lab, and AI Coach work together to train your mental performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleOpenNavigator}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-all min-h-[40px] touch-manipulation active:scale-[0.98]"
          >
            <Compass className="h-4 w-4 text-primary" />
            <span>Search Features</span>
          </button>
          <Link
            href="/dashboard/guide"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm transition-all min-h-[40px] touch-manipulation active:scale-[0.98]"
          >
            <span>Read Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
