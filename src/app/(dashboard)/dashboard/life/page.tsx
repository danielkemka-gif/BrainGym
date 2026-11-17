"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Scale,
  Users,
  Wallet,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from "lucide-react";

const LIFE_MODULES = [
  {
    id: "major-decisions",
    icon: Scale,
    title: "Navigating a Major Life or Relocation Decision",
    description: "Evaluate complex choices involving family, career, or geography by examining long-term trade-offs, constraints, and worst-case survivability.",
    prompt: "I am facing a major life decision involving competing priorities. Help me examine the alternatives, evaluate the trade-offs, and establish a sensible direction.",
  },
  {
    id: "relationship-communication",
    icon: Users,
    title: "Difficult Conversations & Relationship Tension",
    description: "Separate the surface argument (e.g. household budget or extended family obligations) from the deeper unspoken needs underneath.",
    prompt: "My partner / family member and I keep arguing every time we try to discuss a sensitive issue. Help me understand what is really driving the disagreement and how to communicate constructively.",
  },
  {
    id: "personal-finance",
    icon: Wallet,
    title: "Personal Finance, Emergency Cash & Debt Priorities",
    description: "Protect your downside risk and emergency savings buffer before taking on high-interest loans or speculative investments.",
    prompt: "Help me evaluate a financial dilemma involving debt payoff versus investing, factoring in my emergency cash buffer and downside risk.",
  },
  {
    id: "burnout-overwhelm",
    icon: Heart,
    title: "Burnout, Overwhelm & Priority Triage",
    description: "Pause and separate what is within your direct control from the noise when carrying too many competing demands.",
    prompt: "I feel overwhelmed, burned out, and mentally exhausted by competing pressures. Help me triage what is within my control and identify one grounded next step.",
  },
];

export default function LifeWorkspacePage() {
  const router = useRouter();

  const handleStartPrompt = (prompt: string) => {
    router.push(`/dashboard/ask?workspace=challenge&prompt=${encodeURIComponent(prompt)}`);
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
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Heart className="h-4 w-4" />
          </span>
          <span className="text-xs font-black tracking-widest uppercase text-amber-600 dark:text-amber-400">
            MY LIFE WORKSPACE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
          Everyday Life &amp; Decision Clarity
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Designed for individuals navigating real-life dilemmas, interpersonal relationships, family communication, financial trade-offs, and personal balance.
        </p>
      </div>

      {/* Professional Boundaries & Safety Notice */}
      <div className="rounded-2xl border border-border bg-muted/40 p-3.5 sm:p-4 text-xs text-muted-foreground flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Responsible Intelligence Notice:</strong> Akuche is an AI thinking partner designed to help you organize thoughts and examine options. It does not replace qualified medical, legal, psychiatric, or licensed financial professionals.
        </p>
      </div>

      {/* Freeform Prompt Hero */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-sm font-bold text-foreground">
            What personal situation is on your mind?
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Bring any life choice, family matter, or personal decision. Akuche will help you unpack the facts, challenge assumptions, and find calm clarity.
        </p>
        <button
          onClick={() => router.push("/dashboard/ask?workspace=challenge")}
          className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs tracking-wide shadow-sm transition flex items-center justify-center gap-2"
        >
          <span>Open Life Coaching Session</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* Diagnostic Modules Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
          Everyday Dilemmas &amp; Pathways
        </h2>
        <div className="space-y-3">
          {LIFE_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => handleStartPrompt(mod.prompt)}
                className="group rounded-3xl border border-border bg-card p-4 sm:p-5 hover:border-amber-500/60 hover:shadow-sm transition cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/20 transition">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-amber-600 transition">
                      {mod.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 flex items-center gap-0.5 pt-1">
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
