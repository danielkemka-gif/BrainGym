"use client";

import Link from "next/link";
import { EightStepWorkoutEngine } from "@/components/workout/eight-step-workout-engine";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, Dumbbell } from "lucide-react";

export default function WorkoutPage() {
  const { t, isRtl } = useI18n();

  return (
    <div className="mx-auto w-full max-w-xl space-y-4 px-3 sm:px-4 py-3 pb-24 overflow-x-hidden touch-manipulation">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[36px]"
        >
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{t.nav_dashboard}</span>
        </Link>

        <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-[10px] font-black text-primary flex items-center gap-1">
          <Dumbbell className="h-3 w-3" />
          <span>8-STEP THINK → DECIDE → ACT</span>
        </span>
      </div>

      {/* 8-Step Real-Life Mental Fitness Engine */}
      <EightStepWorkoutEngine />
    </div>
  );
}
