"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  getLatestCompletedWorkouts,
  LoggedWorkoutHistoryItem,
} from "@/lib/journal/journal-sync";
import { WorkoutReviewModal } from "./workout-review-modal";
import { History, ArrowRight, Award, Calendar, CheckCircle2 } from "lucide-react";

export function SevenLatestWorkoutsStrip() {
  const { user } = useAuth();
  const { t, isRtl } = useI18n();

  const [workouts, setWorkouts] = useState<LoggedWorkoutHistoryItem[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<LoggedWorkoutHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestCompletedWorkouts(user?.id).then((items) => {
      setWorkouts(items);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className={`rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-3 shadow-sm ${isRtl ? "text-right" : "text-left"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <History className="h-4 w-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-foreground">
            {t.latest_workouts_title}
          </span>
        </div>

        <Link
          href="/dashboard/journal"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <span>{t.nav_journal}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <p className="text-[11px] text-muted-foreground font-medium">
        {t.latest_workouts_subtitle}
      </p>

      {/* Workouts List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : workouts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          {t.latest_workouts_empty}
        </div>
      ) : (
        <div className="space-y-2">
          {workouts.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWorkout(w)}
              className="w-full rounded-2xl bg-background/80 hover:bg-muted/80 border border-border p-3 transition active:scale-[0.99] flex items-center justify-between gap-3 text-left"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-black text-primary uppercase">
                    {w.skill}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-0.5">
                    <Calendar className="h-2.5 w-2.5" />
                    {w.date}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground truncate">{w.title}</h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  +{w.xpEarned} XP
                </span>
                <span className="rounded-xl bg-primary/10 px-2 py-1 text-[10px] font-black text-primary">
                  Review ➔
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Tap-to-Review Modal */}
      {selectedWorkout && (
        <WorkoutReviewModal
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </div>
  );
}
