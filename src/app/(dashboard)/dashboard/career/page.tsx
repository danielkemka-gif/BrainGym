"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  TrendingUp,
  ShieldCheck,
  Eye,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Briefcase,
} from "lucide-react";

const CAREER_MODULES = [
  {
    id: "promotion-stagnation",
    icon: Award,
    title: "Breaking Through Promotion Stagnation (6+ Years in Role)",
    description: "Diagnose why sustained hard work has not translated into advancement by examining measurable business impact, executive sponsorship, and promotion criteria.",
    prompt: "I have worked in the same organisation for six years, but I am not progressing or getting promoted. Help me diagnose what is missing—whether visible impact, executive sponsorship, or competency alignment—and plan a way forward.",
  },
  {
    id: "performance-evidence",
    icon: ShieldCheck,
    title: "Documenting Measurable Impact & Portfolio Evidence",
    description: "Translate your daily tasks and responsibilities into undeniable commercial evidence: revenue generated, costs reduced, or operational efficiencies delivered.",
    prompt: "Help me turn my current job responsibilities into clear, quantifiable performance evidence that proves my readiness for a senior leadership role or higher compensation.",
  },
  {
    id: "executive-visibility",
    icon: Eye,
    title: "Executive Visibility & Stakeholder Relationships",
    description: "Build genuine organizational sponsorship beyond your direct manager so decision-makers understand the value of your contribution.",
    prompt: "I feel invisible to executive decision-makers in my company even though my work is strong. How do I build visibility, strategic communication, and executive relationships without corporate politics?",
  },
  {
    id: "career-transition",
    icon: TrendingUp,
    title: "Career Transition & Offer Evaluation",
    description: "Evaluate whether to transition to a new company, switch industries, or negotiate your current role, factoring in financial runway and leverage.",
    prompt: "I am considering leaving my job for a new role / career transition. Help me evaluate the push factors versus pull opportunities, examine my financial runway, and compare my options.",
  },
  {
    id: "compensation-negotiation",
    icon: DollarSign,
    title: "Salary & Compensation Negotiation",
    description: "Structure a data-backed case for a raise or counter-offer based on market benchmarks and demonstrated leverage.",
    prompt: "I am preparing to negotiate my compensation and salary review. Help me build a compelling, professional case grounded in market value and measurable business value.",
  },
];

export default function CareerWorkspacePage() {
  const router = useRouter();

  const handleStartPrompt = (prompt: string) => {
    router.push(`/dashboard/ask?workspace=career&prompt=${encodeURIComponent(prompt)}`);
  };

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
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Award className="h-4 w-4" />
          </span>
          <span className="text-xs font-black tracking-widest uppercase text-blue-600 dark:text-blue-400">
            MY CAREER WORKSPACE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
          Professional Advancement &amp; Positioning
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Designed for employees, executives, job seekers and professionals seeking promotion, greater workplace leverage, executive visibility, and compensation growth.
        </p>
      </div>

      {/* Freeform Prompt Hero */}
      <section className="rounded-3xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-foreground">
            What career situation do you want to navigate?
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Tell Akuche about your role, workplace dynamics, or career crossroads. We will help you see the situation clearly and formulate a realistic advancement strategy.
        </p>
        <button
          onClick={() => router.push("/dashboard/ask?workspace=career")}
          className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-sm transition flex items-center justify-center gap-2"
        >
          <span>Open Career Coaching Session</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* Diagnostic Modules Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
          Career Advancement Pathways
        </h2>
        <div className="space-y-3">
          {CAREER_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => handleStartPrompt(mod.prompt)}
                className="group rounded-3xl border border-border bg-card p-4 sm:p-5 hover:border-blue-500/60 hover:shadow-sm transition cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20 transition">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-blue-600 transition">
                      {mod.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 flex items-center gap-0.5 pt-1">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-11">
                  {mod.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
