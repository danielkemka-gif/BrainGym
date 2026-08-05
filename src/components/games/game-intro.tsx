"use client";

import { ArrowLeft, Play, Clock, Trophy, Target } from "lucide-react";

interface GameIntroProps {
  title: string;
  description: string;
  steps: string[];
  level: number;
  difficulty: string;
  timeLimitSec: number;
  goal: string;
  gradient: string;
  onStart: () => void;
  onBack: () => void;
}

export function GameIntro({
  title,
  description,
  steps,
  level,
  difficulty,
  timeLimitSec,
  goal,
  gradient,
  onStart,
  onBack,
}: GameIntroProps) {
  const mins = Math.floor(timeLimitSec / 60);
  const secs = timeLimitSec % 60;
  const timeLabel = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <div className="mx-auto max-w-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back to level select"
          className="flex min-h-[44px] items-center justify-center rounded-lg p-2 hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
      </div>

      <div className="mt-4 flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          <Target className="h-7 w-7" />
        </div>
        <p className="text-center text-sm text-muted-foreground">{description}</p>

        <div className="w-full space-y-2.5">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-muted/50 p-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        <div className="flex w-full items-center justify-around gap-2 rounded-xl border border-border p-3 text-center">
          <div>
            <p className="text-sm font-bold">Level {level}</p>
            <p className="text-[11px] capitalize text-muted-foreground">{difficulty}</p>
          </div>
          <div className="h-9 w-px bg-border" />
          <div>
            <p className="flex items-center justify-center gap-1 text-sm font-bold">
              <Clock className="h-3.5 w-3.5" /> {timeLabel}
            </p>
            <p className="text-[11px] text-muted-foreground">Time limit</p>
          </div>
          <div className="h-9 w-px bg-border" />
          <div>
            <p className="flex items-center justify-center gap-1 text-sm font-bold">
              <Trophy className="h-3.5 w-3.5" /> {goal}
            </p>
            <p className="text-[11px] text-muted-foreground">Goal</p>
          </div>
        </div>

        <button
          onClick={onStart}
          className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${gradient} text-base font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98] min-h-[48px] touch-manipulation`}
        >
          <Play className="h-5 w-5 fill-current" /> Start Game
        </button>
      </div>
    </div>
  );
}
