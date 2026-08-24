"use client";

import Link from "next/link";
import { Footprints, ArrowRight, Clock, Sparkles, CheckCircle2, MapPin } from "lucide-react";
import { getDailyPhysicalMission } from "@/lib/physical-activities";

export function TodaysPhysicalTaskCard() {
  const mission = getDailyPhysicalMission();

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-teal-600/10 p-6 sm:p-8 shadow-xl transition-all hover:border-emerald-500/60">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative space-y-5">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25">
              <Footprints className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Activity 2 · Offline Real-World
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                TODAY&apos;S PHYSICAL TASK
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
              🏃 +{mission.xpReward} XP
            </span>
          </div>
        </div>

        {/* Short Description & Task Name */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-foreground">
            {mission.title}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {mission.tagline}
          </p>
        </div>

        {/* What to do & Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-bold">
          <div className="flex items-center gap-2 rounded-xl bg-background/80 border border-border p-3 sm:col-span-2">
            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Action</span>
              <span className="text-foreground font-medium line-clamp-1">{mission.whatToDo[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-background/80 border border-border p-3">
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Est. Time</span>
              <span className="text-foreground font-black">{mission.duration} Offline</span>
            </div>
          </div>
        </div>

        {/* Big Action CTA Button */}
        <div className="pt-2">
          <Link
            href={`/dashboard/physical/${mission.id}`}
            className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 text-white px-6 py-4 sm:py-5 text-base sm:text-lg font-black shadow-lg shadow-emerald-600/25 transition-all hover:brightness-110 active:scale-[0.98] touch-manipulation min-h-[56px]"
          >
            <Footprints className="h-6 w-6" />
            <span>START PHYSICAL TASK ({mission.duration})</span>
            <ArrowRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
