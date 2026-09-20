"use client";

import React, { useState, useEffect } from "react";
import {
  RealLifeBrainMission,
  getTodaysBrainMission,
  getActiveBrainMissionState,
  acceptBrainMission,
  completeBrainMission,
  ActiveMissionState,
} from "@/lib/brain-missions";
import { Confetti } from "@/components/ui/confetti";
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
} from "lucide-react";

interface RealLifeMissionCardProps {
  onComplete?: () => void;
  compact?: boolean;
}

export function RealLifeMissionCard({ onComplete, compact = false }: RealLifeMissionCardProps) {
  const [mission, setMission] = useState<RealLifeBrainMission | null>(null);
  const [state, setState] = useState<ActiveMissionState>({
    missionId: "",
    status: "idle",
  });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const todays = getTodaysBrainMission();
    setMission(todays);
    setState(getActiveBrainMissionState());
  }, []);

  if (!mission) return null;

  const handleAccept = () => {
    const updated = acceptBrainMission(mission.id);
    setState(updated);
  };

  const handleComplete = () => {
    const updated = completeBrainMission(mission.id);
    setState(updated);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
    if (onComplete) onComplete();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-card to-primary/10 p-4 sm:p-5 shadow-sm space-y-3">
      {showCelebration && <Confetti active={true} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Compass className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          <span className="text-[11px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">
            TODAY&apos;S BRAIN MISSION
          </span>
        </div>

        <span className="rounded-full bg-background/90 border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
          {mission.skillLabel}
        </span>
      </div>

      {/* Mission Title & Instruction */}
      <div className="space-y-1 text-left">
        <h3 className="text-base sm:text-lg font-black text-foreground">
          {mission.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          &ldquo;{mission.instruction}&rdquo;
        </p>
      </div>

      {!compact && (
        <div className="rounded-2xl bg-background/80 border border-border p-2.5 text-[11px] text-muted-foreground flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>{mission.whyItMatters}</span>
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="pt-1">
        {state.status === "idle" && (
          <button
            onClick={handleAccept}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-primary text-white font-black py-3 px-5 text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition min-h-[46px]"
          >
            <Sparkles className="h-4 w-4" />
            <span>I&apos;LL TRY THIS TODAY ➔</span>
          </button>
        )}

        {state.status === "in_progress" && (
          <button
            onClick={handleComplete}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-3 px-5 text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition min-h-[46px] animate-pulse"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>MARK AS COMPLETED TODAY [ DONE ✓ ]</span>
          </button>
        )}

        {state.status === "completed" && (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/40 p-3 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Mission Completed for Today!</span>
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">
              +{mission.pointsReward} pts
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
