"use client";

import Link from "next/link";
import {
  Compass,
  Brain,
  Scale,
  Briefcase,
  Award,
  DollarSign,
  Lightbulb,
  Zap,
  Target,
  ArrowRight,
  ArrowLeft,
  Flame,
  BookOpen,
} from "lucide-react";

const EXPLORE_CATEGORIES = [
  {
    title: "Critical Thinking",
    icon: Brain,
    color: "emerald",
    description: "Challenge cognitive biases, separate facts from assumptions, and expose logical fallacies.",
    exercises: [
      { name: "Assumption Stress Test", href: "/dashboard/think", badge: "Core Exercise" },
      { name: "Cognitive Reflex Drills", href: "/dashboard/daily-challenge", badge: "2-Min Drill" },
    ],
  },
  {
    title: "Problem Solving",
    icon: Target,
    color: "blue",
    description: "Deconstruct complex obstacles into root mechanisms before attempting solutions.",
    exercises: [
      { name: "First-Principles Breakdown", href: "/dashboard/think", badge: "Framework" },
      { name: "Five-Why Diagnostic Engine", href: "/dashboard/ask?prompt=Guide+me+through+a+Five-Why+diagnostic+on+my+current+bottleneck", badge: "Interactive" },
    ],
  },
  {
    title: "Decision Intelligence",
    icon: Scale,
    color: "amber",
    description: "Evaluate high-stakes trade-offs, identify downside risks, and avoid irreversible mistakes.",
    exercises: [
      { name: "Decision Lab Analysis", href: "/dashboard/decisions", badge: "Decision Lab" },
      { name: "Worst-Case Survivability Matrix", href: "/dashboard/decisions", badge: "Risk Tool" },
    ],
  },
  {
    title: "Business Thinking",
    icon: Briefcase,
    color: "emerald",
    description: "Master unit economics, pricing power, customer acquisition, and retention systems.",
    exercises: [
      { name: "Customer Churn Diagnostic", href: "/dashboard/business", badge: "Workspace" },
      { name: "Unit Economics Audit", href: "/dashboard/business", badge: "Strategy" },
    ],
  },
  {
    title: "Career Development",
    icon: Award,
    color: "blue",
    description: "Build measurable performance evidence, stakeholder visibility, and promotion leverage.",
    exercises: [
      { name: "Promotion Readiness Audit", href: "/dashboard/career", badge: "Workspace" },
      { name: "Executive Visibility Strategy", href: "/dashboard/career", badge: "Career Tool" },
    ],
  },
  {
    title: "Financial Intelligence",
    icon: DollarSign,
    color: "amber",
    description: "Preserve liquidity runway, audit cash commitments, and make disciplined capital choices.",
    exercises: [
      { name: "Downside Risk & Cash Runway", href: "/dashboard/life", badge: "Finance Tool" },
      { name: "Debt vs Investment Trade-off", href: "/dashboard/life", badge: "Calculator" },
    ],
  },
  {
    title: "Self-Awareness & Metacognition",
    icon: Compass,
    color: "purple",
    description: "Observe your own thinking patterns, emotional triggers, and decision habits.",
    exercises: [
      { name: "Thinking Mirror Observation", href: "/dashboard/ask?mode=thinking_mirror", badge: "Reflection" },
      { name: "Personal Thinking Journal", href: "/dashboard/journal", badge: "Journal" },
    ],
  },
  {
    title: "Creative & Lateral Thinking",
    icon: Lightbulb,
    color: "purple",
    description: "Break rigid patterns, discover adjacent possibilities, and generate novel options.",
    exercises: [
      { name: "Opposite World Reversal", href: "/dashboard/think", badge: "Lateral" },
      { name: "Adjacent Opportunity Finder", href: "/dashboard/potential", badge: "Innovation" },
    ],
  },
];

export default function ExplorePage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-7 overflow-x-hidden px-3 sm:px-6 py-4 pb-28 text-foreground font-sans">
      {/* Header */}
      <div className="space-y-2 border-b border-border/60 pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition mb-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Compass className="h-4 w-4" />
          </span>
          <span className="text-xs font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
            EXPLORE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
          Thinking &amp; Intelligence Drills
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Structured learning modules and cognitive exercises designed to strengthen critical thinking, decision-making, and commercial reasoning.
        </p>
      </div>

      {/* Featured Quick Challenge */}
      <div className="rounded-3xl border border-emerald-500/30 bg-card p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Daily Mental Fitness
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Flame className="h-3.5 w-3.5" />
            <span>2-Min Drill</span>
          </span>
        </div>
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-foreground font-heading">
            Cognitive Warm-up &amp; Reflexes
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Quick exercises in logical deduction, pattern recognition, and focus to sharpen your mind before tackling difficult problems.
          </p>
        </div>
        <div className="pt-1">
          <Link
            href="/dashboard/daily-challenge"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs"
          >
            <span>Start Daily Workout</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 8 Structured Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EXPLORE_CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/50">
                {cat.exercises.map((ex, exIdx) => (
                  <Link
                    key={exIdx}
                    href={ex.href}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 text-xs font-semibold text-foreground/90 transition group"
                  >
                    <span className="group-hover:text-emerald-600 transition truncate max-w-[70%]">
                      {ex.name}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition shrink-0">
                      {ex.badge}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
