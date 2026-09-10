"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  X,
  Sparkles,
  ArrowRight,
  Compass,
  Dumbbell,
  BookOpen,
  BarChart3,
  Trophy,
  Flame,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface GuideMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideMeModal({ isOpen, onClose }: GuideMeModalProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  // Context-specific guidance based on current route
  let pageTitle = "Dashboard Guidance";
  let pageExplanation = "This is your mental fitness command center. Complete today's 5-step mission to sharpen your thinking, earn XP, and protect your streak.";
  let nextActionLabel = "Start Today's 5-Step Mission";
  let nextActionHref = "/dashboard/workout";

  if (pathname?.includes("/workout")) {
    pageTitle = "Today's 5-Step Workout Session";
    pageExplanation = "Here you practice: 1) Real-Life Scenario, 2) Decision Point (What would you do?), 3) Cognitive Challenge, 4) Physical Task, 5) Journal Reflection.";
    nextActionLabel = "Continue Workout Steps";
    nextActionHref = "/dashboard/workout";
  } else if (pathname?.includes("/journal")) {
    pageTitle = "My BrainGym Journal";
    pageExplanation = "Write down takeaways from your daily scenarios, track your cognitive growth over time, and generate beautiful shareable reflection cards for social media.";
    nextActionLabel = "Write a Reflection";
    nextActionHref = "/dashboard/journal";
  } else if (pathname?.includes("/progress")) {
    pageTitle = "Your Cognitive Progress & Streaks";
    pageExplanation = "Track your brain baselines, XP growth, consistency score, unbroken streak calendar, and unlocked mental fitness badges.";
    nextActionLabel = "Back to Daily Mission";
    nextActionHref = "/dashboard";
  } else if (pathname?.includes("/games")) {
    pageTitle = "Brain Games Arena";
    pageExplanation = "Play targeted cognitive mini-games customized to your life stage and career demands (memory recall, impulse gating, executive focus).";
    nextActionLabel = "Play a Brain Drill";
    nextActionHref = "/dashboard/games";
  } else if (pathname?.includes("/group-challenges")) {
    pageTitle = "Group Challenges & Community";
    pageExplanation = "Challenge your WhatsApp groups, team, church, or classmates to structured 3 to 30-day mental consistency competitions.";
    nextActionLabel = "Explore Group Challenges";
    nextActionHref = "/dashboard/group-challenges";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border-2 border-primary/40 bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                BRAINGYM NAVIGATOR &amp; GUIDE
              </span>
              <h3 className="text-sm sm:text-base font-black text-foreground">
                {pageTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm font-bold p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Location Explanation */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
          <span className="text-[10px] font-black uppercase text-primary tracking-wide block">
            📍 WHERE AM I &amp; WHAT SHOULD I DO?
          </span>
          <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
            {pageExplanation}
          </p>
        </div>

        {/* ─── THE 5-STEP DAILY LOOP ─────────────────────────────────────────── */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
            THE DAILY BRAINGYM METHOD:
          </span>
          <div className="space-y-1.5 text-xs">
            {[
              { step: "1. Read Scenario", desc: "A realistic real-world dilemma relevant to your life stage" },
              { step: "2. Make Decision", desc: "Choose your response & uncover the neuroscience insight" },
              { step: "3. Brain Challenge", desc: "Train the related cognitive skill with targeted exercises" },
              { step: "4. Physical Task", desc: "Apply the principle in a simple 5-minute real-world action" },
              { step: "5. Journal & Reflect", desc: "Write your takeaway, earn +150 XP & keep your streak alive" },
            ].map((s, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-background border border-border/80">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-black shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <strong className="text-foreground block">{s.step}</strong>
                  <span className="text-[11px] text-muted-foreground">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
          <Link
            href="/dashboard/journal"
            onClick={onClose}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground flex items-center justify-between"
          >
            <span>My Journal 📖</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
          <Link
            href="/dashboard/progress"
            onClick={onClose}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground flex items-center justify-between"
          >
            <span>My Streaks &amp; XP 🔥</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <Link
            href={nextActionHref}
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-white py-3.5 px-5 text-xs sm:text-sm font-black shadow-lg shadow-primary/25 transition active:scale-95 min-h-[48px]"
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>{nextActionLabel} ➔</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
