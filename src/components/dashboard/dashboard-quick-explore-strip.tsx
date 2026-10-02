"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { QuickBrainBreakModal } from "@/components/brain-breaks/quick-brain-break-modal";
import { Layers, Zap, ArrowRight, Swords, Compass, Sparkles } from "lucide-react";

export function DashboardQuickExploreStrip() {
  const { t, isRtl } = useI18n();
  const [showBrainBreakModal, setShowBrainBreakModal] = useState(false);

  return (
    <div className={`space-y-3 ${isRtl ? "text-right" : "text-left"}`}>
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          WHAT TO EXPLORE NEXT
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Quick Option 1: Brain Arena */}
        <Link
          href="/dashboard/challenges"
          className="group rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-background hover:border-primary/50 p-4 flex flex-col justify-between space-y-3 shadow-sm transition-all duration-200 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-xl border border-primary/20">
              🏟️
            </div>
            <Layers className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-black text-foreground block group-hover:text-primary transition-colors">
              Brain Arena
            </span>
            <span className="text-[10px] text-muted-foreground block font-medium">
              8 Cognitive Domains
            </span>
          </div>
        </Link>

        {/* Quick Option 2: 60s Spontaneous Break */}
        <button
          onClick={() => setShowBrainBreakModal(true)}
          className="group rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-background hover:border-amber-500/60 p-4 flex flex-col justify-between space-y-3 shadow-sm transition-all duration-200 active:scale-[0.98] text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-xl border border-amber-500/30">
              ⚡
            </div>
            <Zap className="h-4 w-4 text-amber-500 transition-transform group-hover:scale-110" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-black text-foreground block group-hover:text-amber-500 transition-colors">
              60s Brain Break
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
              Quick Reflex Drill
            </span>
          </div>
        </button>
      </div>

      {/* 60-Second Quick Brain Break Modal */}
      <QuickBrainBreakModal
        isOpen={showBrainBreakModal}
        onClose={() => setShowBrainBreakModal(false)}
      />
    </div>
  );
}
