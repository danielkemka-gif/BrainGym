"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QuickBrainBreakModal } from "@/components/brain-breaks/quick-brain-break-modal";
import { Layers, Zap, ArrowRight, Swords, Compass } from "lucide-react";

export function DashboardQuickExploreStrip() {
  const [showBrainBreakModal, setShowBrainBreakModal] = useState(false);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
          WHAT TO EXPLORE NEXT
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Quick Option 1: Brain Arena */}
        <Link
          href="/dashboard/challenges"
          className="rounded-2xl border border-border bg-card hover:bg-muted p-3.5 flex flex-col justify-between space-y-2 shadow-sm transition active:scale-95"
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">🏟️</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="text-xs font-black text-foreground block">Brain Arena</span>
            <span className="text-[10px] text-muted-foreground block">8 Mental Domains</span>
          </div>
        </Link>

        {/* Quick Option 2: 60s Spontaneous Break */}
        <button
          onClick={() => setShowBrainBreakModal(true)}
          className="rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 p-3.5 flex flex-col justify-between space-y-2 shadow-sm transition active:scale-95 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">⚡</span>
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="text-xs font-black text-foreground block">60s Brain Break</span>
            <span className="text-[10px] text-primary font-bold block">Quick Reflex Drill</span>
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
