"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { recordActionStreakActivity } from "@/lib/akuche/memory-engine";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Activity,
  Heart,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Flame,
  Zap,
} from "lucide-react";

interface PhysicalActivity {
  id: string;
  title: string;
  category: "stretch" | "balance" | "coordination" | "walking" | "mobility" | "reaction";
  durationSeconds: number;
  durationLabel: string;
  difficulty: "Gentle" | "Moderate" | "Energizing";
  description: string;
  whyItMatters: string;
  instructions: string[];
  safetyNote?: string;
  iconBg: string;
}

const MOVE_ACTIVITIES: PhysicalActivity[] = [
  {
    id: "neck-shoulder-release",
    title: "Desk Oxygenation & Neck Release",
    category: "stretch",
    durationSeconds: 120,
    durationLabel: "2 mins",
    difficulty: "Gentle",
    description: "Release upper thoracic tension and restore oxygen flow to the cerebral cortex.",
    whyItMatters: "Prolonged sitting restricts carotid blood flow and decreases mental focus by up to 23%.",
    instructions: [
      "Sit upright with your spine tall and shoulders dropped away from your ears.",
      "Gently tilt your right ear to your right shoulder. Hold for 3 slow, deep diaphragmatic breaths.",
      "Repeat smoothly on the left side.",
      "Interlace your fingers behind your head and gently open your elbows to expand your chest.",
    ],
    safetyNote: "Never jerk or force neck motion. Keep all movements smooth and pain-free.",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "vestibular-balance",
    title: "1-Leg Vestibular Balance & Focus",
    category: "balance",
    durationSeconds: 180,
    durationLabel: "3 mins",
    difficulty: "Moderate",
    description: "Calibrate your cerebellum and vestibular balance network for enhanced decision stability.",
    whyItMatters: "Single-leg balance activates cerebellum-prefrontal neural pathways linked to cognitive control.",
    instructions: [
      "Stand tall near a wall or sturdy surface for light support if needed.",
      "Lift your right foot 4 inches off the floor, engaging your core and gazing at a fixed point ahead.",
      "Hold for 45 seconds while maintaining calm, steady nasal breathing.",
      "Switch to your left leg for 45 seconds.",
      "Repeat for a second cycle.",
    ],
    safetyNote: "Keep a chair or wall within reach to maintain safety if balance feels unsteady.",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "bilateral-coordination",
    title: "Cross-Body Bilateral Coordination",
    category: "coordination",
    durationSeconds: 180,
    durationLabel: "3 mins",
    difficulty: "Energizing",
    description: "Integrate both left and right brain hemispheres with alternating cross-lateral marching.",
    whyItMatters: "Cross-body movements stimulate the corpus callosum, improving creative problem-solving.",
    instructions: [
      "Stand upright with comfortable feet positioning.",
      "Raise your right knee while touching it with your left hand or elbow across your body midline.",
      "Alternate rhythmically: left knee to right hand/elbow.",
      "Maintain a smooth, steady march cadence for 90 seconds, rest 15s, and repeat.",
    ],
    safetyNote: "Maintain a steady pace and stop if you feel dizzy.",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    id: "mindful-brisk-walk",
    title: "5-Minute Cognitive Clarity Walk",
    category: "walking",
    durationSeconds: 300,
    durationLabel: "5 mins",
    difficulty: "Gentle",
    description: "Step away from your phone and walk to stimulate neurogenesis and optic flow.",
    whyItMatters: "Optic flow (visual movement past your eyes) deactivates the amygdala and calms anxiety.",
    instructions: [
      "Put your phone in your pocket or leave it on your desk.",
      "Walk briskly outdoors or in an open indoor space for 5 uninterrupted minutes.",
      "Observe 3 distant objects and maintain relaxed, panoramic peripheral vision.",
      "Breathe in for 4 steps, exhale for 4 steps.",
    ],
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "hip-spine-mobility",
    title: "Spinal Wave & Hip Opener",
    category: "mobility",
    durationSeconds: 180,
    durationLabel: "3 mins",
    difficulty: "Gentle",
    description: "Mobilize the posterior chain and release lower back stiffness from sitting.",
    whyItMatters: "Freeing spinal mobility reduces physical distraction and improves sustained concentration.",
    instructions: [
      "Stand with feet shoulder-width apart, knees soft.",
      "Gently roll your spine down vertebra by vertebra toward your toes, knees bent comfortably.",
      "Inhale, slowly roll back up, and reach both arms overhead.",
      "Perform 6 smooth repetitions.",
    ],
    safetyNote: "Bend your knees generously to protect your lower back.",
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

export default function MovePage() {
  const { user } = useAuth();
  const [activeActivity, setActiveActivity] = useState<PhysicalActivity | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timerSeconds === 0) {
      setIsRunning(false);
      setIsCompleted(true);
      if (activeActivity) {
        recordActionStreakActivity({
          type: "action",
          title: `Completed Physical Activity: ${activeActivity.title}`,
          details: `Energized brain with ${activeActivity.durationLabel} of ${activeActivity.category} movement.`,
        });
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerSeconds, activeActivity]);

  const handleStartActivity = (act: PhysicalActivity) => {
    setActiveActivity(act);
    setTimerSeconds(act.durationSeconds);
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handlePauseResume = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    if (activeActivity) {
      setTimerSeconds(activeActivity.durationSeconds);
      setIsRunning(false);
      setIsCompleted(false);
    }
  };

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-3 sm:px-4 py-3 pb-28 text-foreground touch-manipulation">
      {/* ─── ACTIVE MOVEMENT PLAYER MODAL ─── */}
      {activeActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl border-2 border-emerald-500/40 bg-card p-5 sm:p-6 shadow-2xl space-y-5 text-foreground max-h-[92vh] overflow-y-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {activeActivity.category.toUpperCase()} · {activeActivity.difficulty}
              </span>
              <button
                onClick={() => {
                  setActiveActivity(null);
                  setIsRunning(false);
                }}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground p-1"
              >
                Close ✕
              </button>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">
                {activeActivity.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeActivity.description}
              </p>
            </div>

            {/* Timer Display */}
            <div className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-2">
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                {formatTime(timerSeconds)}
              </div>
              <p className="text-xs text-muted-foreground font-semibold">
                {isCompleted ? "Activity Completed! Great job." : isRunning ? "In progress · Breathe naturally" : "Paused"}
              </p>
            </div>

            {/* Controls */}
            {!isCompleted ? (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handlePauseResume}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 text-sm font-bold shadow-md active:scale-95 transition min-h-[46px]"
                >
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isRunning ? "Pause" : "Resume"}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-2xl border border-border bg-background p-3.5 text-muted-foreground hover:text-foreground transition active:scale-95"
                  title="Reset Timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3 pt-1">
                <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Logged in Your Action Streak!</span>
                </div>
                <button
                  onClick={() => setActiveActivity(null)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-sm font-bold shadow-md transition"
                >
                  <span>Done</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step-by-step instructions */}
            <div className="rounded-2xl bg-muted/40 border border-border/60 p-3.5 space-y-2 text-xs text-left">
              <span className="font-bold text-foreground block text-[11px] uppercase tracking-wider">
                Instructions:
              </span>
              <ol className="space-y-1.5 text-foreground/90 text-[11px] list-decimal list-inside">
                {activeActivity.instructions.map((inst, i) => (
                  <li key={i} className="leading-relaxed">
                    {inst}
                  </li>
                ))}
              </ol>

              {activeActivity.safetyNote && (
                <div className="flex items-start gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-xl mt-2 border border-amber-500/20">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{activeActivity.safetyNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── HEADER (SECTION 26) ─── */}
      <div className="space-y-1.5 pt-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Activity className="h-3.5 w-3.5" />
          <span>PHYSICAL CLARITY · SECTION 26</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Move
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Your mind works better when your body does too. Quick 2–5 minute physical resets to oxygenate your brain.
        </p>
      </div>

      {/* ─── ACTIVITY CARDS LIST ─── */}
      <div className="space-y-3">
        {MOVE_ACTIVITIES.map((act) => (
          <div
            key={act.id}
            className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-3 hover:border-emerald-500/30 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${act.iconBg}`}>
                  <Activity className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-foreground">
                      {act.title}
                    </h3>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase">
                      {act.durationLabel} · {act.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background/60 border border-border/60 p-3 text-[11px] text-foreground/80 leading-relaxed">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                🧠 Brain Impact:
              </span>
              <span>{act.whyItMatters}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground">
                No equipment required
              </span>

              <button
                onClick={() => handleStartActivity(act)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold shadow-xs active:scale-95 transition"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Start ({act.durationLabel})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
