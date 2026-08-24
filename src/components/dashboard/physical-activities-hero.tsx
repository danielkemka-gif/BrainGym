"use client";

import Link from "next/link";
import { Footprints, ArrowRight, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { getDailyPhysicalMission } from "@/lib/physical-activities";

export function PhysicalActivitiesHero() {
  const mission = getDailyPhysicalMission();

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/15 via-card to-teal-600/10 p-5 sm:p-6 shadow-lg space-y-4">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25">
              <Footprints className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Real-World Offline Training
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                BRAINGYM PHYSICAL ACTIVITIES
              </h3>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 w-fit">
            🏃 150+ Offline Exercises
          </span>
        </div>

        <div className="rounded-2xl bg-background/80 border border-border/80 p-3.5 flex items-start gap-3">
          <span className="text-2xl pt-0.5">{mission.icon}</span>
          <div className="min-w-0">
            <p className="text-xs font-black text-foreground">
              Today&apos;s Mission: {mission.title}
            </p>
            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
              {mission.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <Link
            href="/dashboard/physical"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3.5 text-xs sm:text-sm font-black shadow-md shadow-emerald-600/25 hover:brightness-110 active:scale-[0.98] transition min-h-[48px] touch-manipulation"
          >
            <Footprints className="h-4 w-4" />
            <span>OPEN PHYSICAL ACTIVITIES GYM</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>

          <Link
            href={`/dashboard/physical/${mission.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card hover:bg-accent px-4 py-3.5 text-xs font-bold transition min-h-[48px] touch-manipulation"
          >
            <span>Start Today&apos;s Mission ({mission.duration})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
