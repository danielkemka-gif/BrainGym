"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getTodaysCurriculumLesson, DailyCurriculumLesson } from "@/lib/daily-curriculum";
import { ConnectedDailyWorkoutEngine } from "@/components/workout/connected-daily-workout-engine";
import { AgeTierId, getActiveUserAgeTier } from "@/lib/age-tiers";
import { ArrowLeft, Dumbbell } from "lucide-react";

export default function WorkoutPage() {
  const searchParams = useSearchParams();
  const ageTierParam = (searchParams?.get("ageTier") as AgeTierId) || getActiveUserAgeTier();
  const lesson: DailyCurriculumLesson = getTodaysCurriculumLesson();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-3 sm:px-4 py-3 pb-24 overflow-x-hidden touch-manipulation">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[36px]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>

        <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-[10px] font-black text-primary flex items-center gap-1">
          <Dumbbell className="h-3 w-3" />
          <span>2-PHASE GYM SESSION</span>
        </span>
      </div>

      {/* Connected 2-Phase Workout Engine with Age Tier Support */}
      <ConnectedDailyWorkoutEngine lesson={lesson} initialAgeTier={ageTierParam} />
    </div>
  );
}
