"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QUICK_BRAIN_BREAKS } from "@/lib/brain-breaks";
import { QuickBrainBreakModal } from "@/components/brain-breaks/quick-brain-break-modal";
import { ContextualChallengeVisual } from "@/components/visuals/contextual-challenge-visual";
import {
  Swords,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  Flame,
  CheckCircle2,
} from "lucide-react";

const ARENA_DOMAINS = [
  {
    id: "focus",
    name: "Focus & Attention",
    emoji: "🎯",
    tagline: "Resist distraction & sustain depth",
    drillsCount: 14,
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/30",
  },
  {
    id: "memory",
    name: "Working Memory",
    emoji: "🧩",
    tagline: "Retain & manipulate complex data",
    drillsCount: 18,
    color: "from-purple-500/10 to-violet-500/10 border-purple-500/30",
  },
  {
    id: "problem_solving",
    name: "Problem Solving",
    emoji: "💡",
    tagline: "Break down multi-variable dilemmas",
    drillsCount: 16,
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/30",
  },
  {
    id: "decision_making",
    name: "Decision Making",
    emoji: "⚖️",
    tagline: "Evaluate trade-offs & spot biases",
    drillsCount: 12,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30",
  },
  {
    id: "creativity",
    name: "Divergent Creativity",
    emoji: "🎨",
    tagline: "Generate unexpected solutions",
    drillsCount: 10,
    color: "from-pink-500/10 to-rose-500/10 border-pink-500/30",
  },
  {
    id: "observation",
    name: "Visual Observation",
    emoji: "🔍",
    tagline: "Scan details & detect discrepancies",
    drillsCount: 15,
    color: "from-cyan-500/10 to-sky-500/10 border-cyan-500/30",
  },
  {
    id: "speed",
    name: "Neural Processing Speed",
    emoji: "⚡",
    tagline: "Fast reaction & cognitive agility",
    drillsCount: 11,
    color: "from-yellow-500/10 to-amber-500/10 border-yellow-500/30",
  },
  {
    id: "emotional_intelligence",
    name: "Emotional Intelligence",
    emoji: "🤝",
    tagline: "Theory of mind & empathy resonance",
    drillsCount: 9,
    color: "from-rose-500/10 to-red-500/10 border-rose-500/30",
  },
];

export function BrainArenaHub() {
  const [activeBreakId, setActiveBreakId] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* ─── 1. HERO ARENA BANNER ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-violet-600/15 p-5 sm:p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              BRAIN ARENA
            </span>
          </div>

          <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-[11px] font-bold text-primary">
            Universal Mental Gym
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            How Sharp Are You Today?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Train specific cognitive domains or take spontaneous 60-second mental drills.
          </p>
        </div>

        {/* Quick Start Main Daily Challenge CTA */}
        <div className="pt-1">
          <Link
            href="/dashboard/workout"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white font-black py-3 px-5 text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition min-h-[46px]"
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>START TODAY&apos;S PRIMARY WORKOUT ➔</span>
          </Link>
        </div>
      </div>

      {/* ─── 2. 60-SECOND QUICK BRAIN BREAKS STRIP ─────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-black uppercase text-foreground">
              60-SECOND QUICK BRAIN BREAKS
            </span>
          </div>
          <span className="text-[11px] font-bold text-muted-foreground">Spontaneous Drills</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {QUICK_BRAIN_BREAKS.slice(0, 4).map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBreakId(b.id)}
              className="flex flex-col items-start justify-between rounded-2xl border border-border bg-card p-3 text-left hover:border-primary/50 hover:bg-primary/5 transition active:scale-95 shadow-sm min-h-[96px]"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base">{b.category === "memory" ? "🧠" : b.category === "speed" ? "⚡" : b.category === "logic" ? "📐" : "🔍"}</span>
                <span className="text-[10px] font-black uppercase text-primary">60s</span>
              </div>
              <div>
                <span className="text-xs font-black text-foreground block line-clamp-1">{b.title}</span>
                <span className="text-[10px] text-muted-foreground block line-clamp-1">{b.tagline}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── 3. 8 COGNITIVE TRAINING DOMAINS ────────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-xs font-black uppercase text-foreground">
              8 COGNITIVE FITNESS DOMAINS
            </span>
          </div>
          <span className="text-[11px] font-bold text-muted-foreground">Curated Tracks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ARENA_DOMAINS.map((domain) => (
            <div
              key={domain.id}
              className={`rounded-3xl border bg-gradient-to-br ${domain.color} p-4 flex items-center justify-between shadow-sm`}
            >
              <div className="space-y-1 flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{domain.emoji}</span>
                  <h3 className="text-sm font-black text-foreground">{domain.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{domain.tagline}</p>
                <div className="pt-1 flex items-center gap-2">
                  <Link
                    href={`/dashboard/workout`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                  >
                    <span>Train this domain</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Contextual Visual Thumbnail */}
              <ContextualChallengeVisual category={domain.id} size="sm" className="shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Brain Break Modal */}
      <QuickBrainBreakModal
        isOpen={Boolean(activeBreakId)}
        onClose={() => setActiveBreakId(null)}
        activityId={activeBreakId || undefined}
      />
    </div>
  );
}
