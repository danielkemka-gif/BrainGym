"use client";

import { Zap, TrendingUp, Sparkles } from "lucide-react";
import { HabitMetricState } from "@/lib/habit-engine";

interface BrainMomentumWidgetProps {
  habit: HabitMetricState;
}

export function BrainMomentumWidget({ habit }: BrainMomentumWidgetProps) {
  const score = habit.momentumScore || 78;

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Zap className="h-5 w-5 fill-amber-500/20" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Consistency Index
            </span>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              BRAIN MOMENTUM
            </h3>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-black text-foreground">
            {score}
          </span>
          <span className="text-xs font-bold text-muted-foreground">/ 100</span>
        </div>
      </div>

      {/* Horizontal Meter */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-violet-600 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
          <span>Warming Up (0)</span>
          <span>Consistent (50)</span>
          <span>Peak Velocity (100)</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
        &ldquo;{habit.momentumReason || "You're building strong mental consistency through daily morning routines."}&rdquo;
      </p>
    </div>
  );
}
