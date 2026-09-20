"use client";

import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  Circle,
  Award,
  Sparkles,
  Zap,
  Flame,
} from "lucide-react";

export function WeeklyBrainQuestCard() {
  const questItems = [
    { title: "Complete 5 Daily Workouts", current: 4, target: 5, done: false },
    { title: "Finish 2 Real-Life Brain Missions", current: 2, target: 2, done: true },
    { title: "Complete 1 60s Memory Break", current: 1, target: 1, done: true },
    { title: "Take 1 Decision Trap Drill", current: 1, target: 1, done: true },
  ];

  const totalDone = questItems.filter((q) => q.done || q.current >= q.target).length;
  const progressPercent = Math.round((totalDone / questItems.length) * 100);

  return (
    <div className="rounded-3xl border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-card to-primary/10 p-5 sm:p-6 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          <span className="text-xs font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
            THIS WEEK&apos;S BRAIN QUEST
          </span>
        </div>

        <span className="rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-0.5 text-xs font-black text-violet-600 dark:text-violet-400">
          Reward: +200 Brain Points 🏆
        </span>
      </div>

      <div className="space-y-1 text-left">
        <h3 className="text-lg sm:text-xl font-black text-foreground">
          &ldquo;THINK BEFORE YOU ACT&rdquo;
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Build deliberate cognitive friction before making reactive snap choices.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span>Quest Progress: {totalDone}/{questItems.length} Goals</span>
          <span className="text-foreground font-black">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1">
        {questItems.map((item, idx) => {
          const isFinished = item.done || item.current >= item.target;
          return (
            <div
              key={idx}
              className={`rounded-2xl border p-3 flex items-center justify-between text-xs font-bold transition ${
                isFinished
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-background/80 border-border text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isFinished ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span>{item.title}</span>
              </div>
              <span className="text-[11px] font-black">
                {item.current}/{item.target}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
