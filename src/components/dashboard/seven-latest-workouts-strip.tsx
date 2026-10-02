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
import { History, ArrowRight, Award, Calendar, CheckCircle2, Eye } from "lucide-react";

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
    <div className={`rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-background p-4 sm:p-5 space-y-3.5 shadow-sm ${isRtl ? "text-right" : "text-left"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <History className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
              TRAINING LOG
            </span>
            <h3 className="text-xs sm:text-sm font-black text-foreground">
              {t.latest_workouts_title}
            </h3>
          </div>
        </div>

        <Link
          href="/dashboard/journal"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline group"
        >
          <span>{t.nav_journal}</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <p className="text-[11px] text-muted-foreground font-medium">
        {t.latest_workouts_subtitle}
      </p>

      {/* Workouts List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted/60 animate-pulse" />
          ))}
        </div>
      ) : workouts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground bg-muted/20 space-y-1">
          <p className="font-bold text-foreground">No workouts recorded yet</p>
          <p>{t.latest_workouts_empty}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {workouts.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWorkout(w)}
              className="group w-full rounded-2xl bg-card hover:bg-muted/70 border border-border hover:border-primary/40 p-3.5 transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3 text-left shadow-xs"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[9px] font-black text-primary uppercase">
                    {w.skill}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" />
                    {w.date}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {w.title}
                </h4>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  +{w.xpEarned} XP
                </span>
                <span className="inline-flex items-center gap-1 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary px-2.5 py-1 text-[10px] font-black transition-colors">
                  <Eye className="h-3 w-3" />
                  <span>Review</span>
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
