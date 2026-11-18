"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  Sparkles,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Award,
  Heart,
  Scale,
} from "lucide-react";
import { AkucheClarityMap } from "@/components/clarity/clarity-map";
import { WhatAmIMissingCard } from "@/components/clarity/what-am-i-missing-card";

export default function MyClarityPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-7 overflow-x-hidden px-3 sm:px-6 py-4 pb-28 text-foreground font-sans">
      {/* Header */}
      <div className="space-y-2 border-b border-border/60 pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition mb-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Compass className="h-4 w-4" />
          </span>
          <span className="text-xs font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
            PERSONAL CLARITY INTELLIGENCE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
          Clarity &amp; Intelligence Hub
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Understand what is really happening in your circumstances. Expose hidden assumptions, explore blind spots, and chart a sensible way forward.
        </p>
      </div>

      {/* Signature Intelligence 1: What Am I Missing? */}
      <section className="space-y-2">
        <WhatAmIMissingCard onSavedToMap={() => setRefreshKey((k) => k + 1)} />
      </section>

      {/* Signature Intelligence 2: The Akuche Clarity Map */}
      <section className="space-y-2">
        <AkucheClarityMap key={refreshKey} />
      </section>

      {/* Workspace Quick Jump */}
      <section className="rounded-3xl border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Explore Focused Workspaces
          </h3>
          <Link
            href="/dashboard/decisions"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Decision Lab</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Link
            href="/dashboard/business"
            className="p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition flex flex-col gap-1"
          >
            <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-foreground">Business Intel</span>
            <span className="text-[10px] text-muted-foreground">Bottlenecks &amp; Sales</span>
          </Link>

          <Link
            href="/dashboard/career"
            className="p-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition flex flex-col gap-1"
          >
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-foreground">Career Intel</span>
            <span className="text-[10px] text-muted-foreground">Promotion &amp; Leverage</span>
          </Link>

          <Link
            href="/dashboard/potential"
            className="p-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition flex flex-col gap-1"
          >
            <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-foreground">Youth Potential</span>
            <span className="text-[10px] text-muted-foreground">Direction &amp; 90-Day Plan</span>
          </Link>

          <Link
            href="/dashboard/life"
            className="p-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition flex flex-col gap-1"
          >
            <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <span className="text-xs font-bold text-foreground">Life Intel</span>
            <span className="text-[10px] text-muted-foreground">Decisions &amp; Trade-offs</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
