"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  TrendingDown,
  Calculator,
  Target,
  Users,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

const BUSINESS_MODULES = [
  {
    id: "sales-churn",
    icon: TrendingDown,
    title: "Diagnose Sales Slowdown or Customer Churn",
    description: "Isolate whether customers are leaving after onboarding (retention leak), hesitating at purchase (conversion friction), or failing to discover you (lead drop).",
    prompt: "My business sales have declined over the past few months. Help me diagnose whether this is a lead drop, conversion friction, or a post-onboarding churn leak, and guide me through the right next steps.",
  },
  {
    id: "pricing-margins",
    icon: Calculator,
    title: "Pricing, Cash Flow & Unit Economics",
    description: "Determine whether your pricing covers customer acquisition and operating overhead without running out of cash at month-end.",
    prompt: "My business revenue is growing every month, but we still have no cash profit left at the end of the month. Help me audit my unit economics, gross margins, and operating expenses.",
  },
  {
    id: "idea-validation",
    icon: Target,
    title: "Validate an Idea Before Spending on Development",
    description: "Test market demand, customer willingness to pay, and problem urgency before hiring software developers or manufacturing inventory.",
    prompt: "I have a new business / B2B SaaS idea. How do I validate customer demand, secure pre-commitments, and test willingness to pay before spending money on software development?",
  },
  {
    id: "b2b-proposals",
    icon: Users,
    title: "B2B Sales Proposals & Deal Closing",
    description: "Shift from cold, unread PDF proposals to pre-qualified discovery conversations with executive budget holders.",
    prompt: "I have sent proposals to multiple corporate clients but the responses have not been favorable. Help me audit my sales qualification, proposal structure, and follow-up strategy.",
  },
  {
    id: "capacity-expansion",
    icon: AlertTriangle,
    title: "Expansion, Co-founders & Key Hiring",
    description: "Evaluate whether bringing on a partner, hiring staff, or opening a second location is solving proven demand or taking on speculative risk.",
    prompt: "I am deciding whether to hire a key employee / bring on a technical co-founder for equity or keep growing with existing cash flow. Help me evaluate the trade-offs and risks.",
  },
];

export default function BusinessWorkspacePage() {
  const router = useRouter();

  const handleStartPrompt = (prompt: string) => {
    router.push(`/dashboard/ask?workspace=business&prompt=${encodeURIComponent(prompt)}`);
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
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Briefcase className="h-4 w-4" />
          </span>
          <span className="text-xs font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
            MY BUSINESS WORKSPACE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
          Commercial Clarity &amp; Strategy
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Designed for entrepreneurs, founders, MSMEs and business owners navigating real-world market constraints, capital limitations, customer retention and commercial growth.
        </p>
      </div>

      {/* Freeform Prompt Hero */}
      <section className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-foreground">
            What business challenge are you working through?
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Describe your customer situation, revenue bottleneck, or growth decision in your own words. Akuche will investigate root causes before prescribing action.
        </p>
        <button
          onClick={() => router.push("/dashboard/ask?workspace=business")}
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs tracking-wide shadow-sm transition flex items-center justify-center gap-2"
        >
          <span>Open Business Coaching Session</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* Diagnostic Modules Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
          Common Business Dilemmas
        </h2>
        <div className="space-y-3">
          {BUSINESS_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => handleStartPrompt(mod.prompt)}
                className="group rounded-3xl border border-border bg-card p-4 sm:p-5 hover:border-emerald-500/60 hover:shadow-sm transition cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20 transition">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-emerald-600 transition">
                      {mod.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-0.5 pt-1">
                    <span>Diagnose</span>
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
