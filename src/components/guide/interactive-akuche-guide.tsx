"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Brain,
  Target,
  TrendingUp,
  Compass,
  MessageSquare,
  Zap,
  HelpCircle,
  RotateCcw,
  Check,
  Scale,
  Briefcase,
  DollarSign,
  GraduationCap,
  Heart,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import { saveGoal } from "@/lib/goals/goals-engine";

export const GUIDE_STORAGE_KEY = "akuche_interactive_guide_completed";

interface InteractiveAkucheGuideProps {
  onComplete?: () => void;
  initialStep?: number;
}

const SAMPLE_PROMPTS = [
  {
    category: "Money & Business",
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    title: "Generate ₦5M Revenue",
    prompt: "I want to generate ₦5,000,000 before the end of the year. Break this down into an execution plan with unit economics ($R = P \\times Q$).",
    description: "Reverse-engineer target revenue into daily outreach, pricing, and client volume.",
  },
  {
    category: "Customer Acquisition",
    icon: Briefcase,
    color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
    title: "Get 10 B2B Clients",
    prompt: "How do I acquire 10 high-paying B2B clients for my service using WhatsApp, LinkedIn, and direct warm outreach with zero ad budget?",
    description: "A practical sales outreach cadence tailored to local African business realities.",
  },
  {
    category: "Career & Work",
    icon: Scale,
    color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30",
    title: "9-to-5 vs Business",
    prompt: "Should I stay in my 9-to-5 job or transition into full-time business? Help me evaluate the trade-offs, financial runway, and downside risks.",
    description: "Stress-test a major crossroads with two-way door decision analysis.",
  },
  {
    category: "Personal Decisions",
    icon: Scale,
    color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
    title: "Evaluate Two Job Offers",
    prompt: "I have two job offers: one pays 40% higher now, but the other offers remote flexibility and greater learning. Help me choose wisely.",
    description: "Balance immediate financial return with long-term compound growth.",
  },
  {
    category: "Education & Study",
    icon: GraduationCap,
    color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    title: "Exam Sprint in 3 Weeks",
    prompt: "I have professional certification exams in 3 weeks and feel overwhelmed. Design a high-retention active recall study sprint for me.",
    description: "Convert high-pressure study material into manageable daily blocks.",
  },
  {
    category: "Relationships",
    icon: Heart,
    color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
    title: "Setting Financial Boundaries",
    prompt: "How do I set boundaries with a close family member who repeatedly asks for financial loans without damaging our relationship?",
    description: "Clear, empathetic communication scripts that protect your boundaries.",
  },
];

export function InteractiveAkucheGuide({ onComplete, initialStep = 1 }: InteractiveAkucheGuideProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(initialStep);
  const totalSteps = 5;

  const [selectedPrompt, setSelectedPrompt] = useState(SAMPLE_PROMPTS[0].prompt);
  const [customQuestion, setCustomQuestion] = useState("");
  const [actionCommitment, setActionCommitment] = useState("");
  const [savedCommitmentSuccess, setSavedCommitmentSuccess] = useState(false);

  useEffect(() => {
    const stepParam = searchParams?.get("step");
    if (stepParam) {
      const parsed = parseInt(stepParam, 10);
      if (parsed >= 1 && parsed <= totalSteps) {
        setStep(parsed);
      }
    }
  }, [searchParams]);

  const markCompleteAndExit = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(GUIDE_STORAGE_KEY, "true");
    }
    if (onComplete) {
      onComplete();
    } else {
      router.push("/dashboard");
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      markCompleteAndExit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTryInAskAkuche = (queryText: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(GUIDE_STORAGE_KEY, "true");
    }
    router.push(`/dashboard/ask?prompt=${encodeURIComponent(queryText.trim())}`);
  };

  const handleSaveSampleCommitment = async () => {
    const title = actionCommitment.trim() || "Complete today's priority task before 6:00 PM";
    await saveGoal({
      title,
      currentSituation: "Created during the Akuche interactive guide tour",
      target: 1,
      currentProgress: 0,
      unit: "action",
      nextAction: "Execute step 1 today",
      isActive: true,
    });
    setSavedCommitmentSuccess(true);
    setTimeout(() => setSavedCommitmentSuccess(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-3 sm:px-6 py-4 pb-28 text-foreground font-sans">
      {/* ─── GUIDE STEP HEADER & CONTROLS ─── */}
      <header className="rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AkucheBrandLogo variant="mark" size="sm" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Interactive Product Guide
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                Welcome to Akuche
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition active:scale-95"
              title="Restart Tutorial from Step 1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restart</span>
            </button>
            <button
              onClick={markCompleteAndExit}
              className="inline-flex items-center gap-1 rounded-xl bg-muted/60 hover:bg-muted px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition active:scale-95"
            >
              <span>Skip Tour</span>
            </button>
          </div>
        </div>

        {/* Step Progress Indicator (Step X of 5) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-primary font-black uppercase tracking-wider text-[11px]">
              Step {step} of {totalSteps}
            </span>
            <span className="text-muted-foreground">
              {step === 1 && "Welcome & Mission"}
              {step === 2 && "Dashboard Navigation"}
              {step === 3 && "Demonstrate Ask Akuche"}
              {step === 4 && "Goals & Commitments"}
              {step === 5 && "Track Real Progress"}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 h-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i < step
                    ? "bg-primary"
                    : i === step
                    ? "bg-primary shadow-xs"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* ─── STAGE 1: WELCOME & PURPOSE ─── */}
      {step === 1 && (
        <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Stage 1: Welcome</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
              Think Better. Decide Better. Live Better.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Life regularly brings us complicated situations: business dilemmas, career forks in the road, financial goals, and personal relationship decisions that feel difficult to untangle alone.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-3">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wide flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                ✓
              </span>
              <span>What Akuche Does For You:</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-primary font-black mt-0.5">•</span>
                <span><strong>Think through real-life problems:</strong> We diagnose root bottlenecks rather than superficial symptoms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-black mt-0.5">•</span>
                <span><strong>Evaluate realistic options:</strong> Weigh advantages, disadvantages, costs, and risks without guesswork.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-black mt-0.5">•</span>
                <span><strong>Make reasoned decisions:</strong> Gain conviction on what matters most to your priorities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-black mt-0.5">•</span>
                <span><strong>Take practical action:</strong> Every coaching session concludes with &ldquo;YOUR NEXT MOVE&rdquo; so you make tangible progress.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
            <span className="text-xs text-muted-foreground">
              Ready to see where everything lives?
            </span>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 text-sm font-bold shadow-sm transition active:scale-95"
            >
              <span>Explore Dashboard Navigation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* ─── STAGE 2: DASHBOARD NAVIGATION ─── */}
      {step === 2 && (
        <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <Compass className="h-3.5 w-3.5" />
              <span>Stage 2: Dashboard Navigation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
              The 4 Main Pillars of Your Experience
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Akuche is structured around 4 connected destinations. Here is what each section does in simple English:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Ask Akuche */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-2 hover:border-primary/50 transition">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">1. Ask Akuche</h3>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Your Thinking Partner</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bring any challenge, money goal, career dilemma, or question. Akuche helps you diagnose the situation, compare trade-offs, and gives you a concrete next move.
              </p>
              <Link
                href="/dashboard/ask"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
              >
                Go to Ask Akuche →
              </Link>
            </div>

            {/* 2. Train */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-2 hover:border-primary/50 transition">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">2. Train (Mental Fitness)</h3>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Daily Drills</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Short 2-minute cognitive warm-ups in memory recall, logical deduction, and focus stamina that sharpen your mental clarity and reflexes.
              </p>
              <Link
                href="/dashboard/daily-challenge"
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline pt-1"
              >
                Go to Daily Challenge →
              </Link>
            </div>

            {/* 3. Goals */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-2 hover:border-primary/50 transition">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">3. Goals & Commitments</h3>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Turn Insights to Action</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Record your real-world commitments, set deadlines, track numerical progress, and log reflective adjustments when things don&apos;t go as planned.
              </p>
              <Link
                href="/dashboard/goals"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline pt-1"
              >
                Go to Goals →
              </Link>
            </div>

            {/* 4. Progress */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-2 hover:border-primary/50 transition">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">4. Progress</h3>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Measurable Momentum</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review your active focus streak, total completed milestone actions, and real skill growth. We only display metrics from actual actions you log.
              </p>
              <Link
                href="/dashboard/progress"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1"
              >
                Go to Progress →
              </Link>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 text-sm font-bold shadow-sm transition active:scale-95"
            >
              <span>Demonstrate Ask Akuche</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* ─── STAGE 3: DEMONSTRATE ASK AKUCHE ─── */}
      {step === 3 && (
        <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <Zap className="h-3.5 w-3.5" />
              <span>Stage 3: Demonstrate Ask Akuche</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
              Test Real Socratic Coaching
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ask Akuche does not simulate canned answers. Submitted questions are processed by the real AI backend with full mathematical breakdowns, trade-off comparisons, and direct next moves.
            </p>
          </div>

          {/* Sample Prompts Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              Select a sample prompt or customize your own:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAMPLE_PROMPTS.map((item, idx) => {
                const isSelected = selectedPrompt === item.prompt;
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPrompt(item.prompt);
                      setCustomQuestion("");
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition active:scale-98 touch-manipulation flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded-lg border text-xs ${item.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                        &ldquo;{item.prompt}&rdquo;
                      </p>
                    </div>

                    <span className="text-[10px] text-primary font-bold mt-2 flex items-center gap-1">
                      {isSelected ? "✓ Selected" : "Tap to select"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Question Input Box */}
          <div className="rounded-2xl border-2 border-primary/40 bg-background p-4 space-y-3">
            <label className="text-xs font-bold text-foreground block">
              Active Question to Submit to Ask Akuche:
            </label>
            <textarea
              rows={3}
              value={customQuestion || selectedPrompt}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Type any dilemma, decision, or goal you want to work through..."
              className="w-full rounded-xl border border-border bg-card p-3 text-base sm:text-sm text-foreground focus:border-primary focus:outline-none leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-muted-foreground">
                Tapping below submits directly to the live AI coaching engine.
              </span>
              <button
                type="button"
                onClick={() => handleTryInAskAkuche(customQuestion || selectedPrompt)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
              >
                <span>Ask Akuche This Question</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 text-sm font-bold shadow-sm transition active:scale-95"
            >
              <span>Explain Goals & Commitments</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* ─── STAGE 4: EXPLAIN GOALS AND COMMITMENTS ─── */}
      {step === 4 && (
        <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <Target className="h-3.5 w-3.5" />
              <span>Stage 4: Goals & Commitments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
              Turn Insights into Practical Execution
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Insight without action is just entertainment. Akuche connects your thinking sessions directly to real commitments you can execute, measure, and review.
            </p>
          </div>

          {/* The Clarity-to-Action Cycle */}
          <div className="rounded-2xl border border-border bg-background p-4 sm:p-5 space-y-3">
            <h3 className="font-bold text-sm text-foreground">
              The 5-Step Action Loop:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <span className="font-bold text-primary block">1. ASSESS</span>
                <span className="text-[11px] text-muted-foreground">Describe your challenge honestly.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <span className="font-bold text-primary block">2. DECIDE</span>
                <span className="text-[11px] text-muted-foreground">Evaluate trade-offs and pick a path.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <span className="font-bold text-primary block">3. COMMIT</span>
                <span className="text-[11px] text-muted-foreground">Record a specific action with a deadline.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <span className="font-bold text-primary block">4. MEASURE</span>
                <span className="text-[11px] text-muted-foreground">Log what actually happened.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <span className="font-bold text-primary block">5. ADAPT</span>
                <span className="text-[11px] text-muted-foreground">Adjust next steps based on real learning.</span>
              </div>
            </div>
          </div>

          {/* Quick Commitment Creator */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-3">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Try It Now: Set a Simple Action Commitment</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter one concrete task you will complete today. This saves into your real Goals engine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={actionCommitment}
                onChange={(e) => setActionCommitment(e.target.value)}
                placeholder="e.g. Message 5 business owners on WhatsApp before 5 PM"
                className="flex-1 rounded-xl border border-border bg-card px-3.5 py-2.5 text-base sm:text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveSampleCommitment}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 text-xs font-bold transition active:scale-95 shrink-0"
              >
                <Check className="h-4 w-4" />
                <span>Save Commitment</span>
              </button>
            </div>

            {savedCommitmentSuccess && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>Commitment recorded to your active goals! You can review it on the Goals page anytime.</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 text-sm font-bold shadow-sm transition active:scale-95"
            >
              <span>Explain Progress Tracking</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* ─── STAGE 5: EXPLAIN PROGRESS ─── */}
      {step === 5 && (
        <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Stage 5: Explain Progress</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
              Real Metrics from Real Actions
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not invent artificial scores or vanity stats. Akuche measures progress exclusively through actions you take and track.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl border border-border bg-background space-y-1.5">
              <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 block">
                Focus Streak
              </span>
              <h3 className="text-lg font-bold text-foreground">Daily Consistency</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Builds when you complete a thinking session, workout, or goal milestone each day. No punitive resets.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-background space-y-1.5">
              <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">
                Milestones Completed
              </span>
              <h3 className="text-lg font-bold text-foreground">Tangible Outputs</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every action commitment you mark done increments your completed milestone counter.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-background space-y-1.5">
              <span className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400 block">
                Adaptive Adjustments
              </span>
              <h3 className="text-lg font-bold text-foreground">Reflection Log</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you log what worked or what didn&apos;t, Akuche remembers your learnings so you avoid repeating mistakes.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-3">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground font-heading">
                You&apos;re Ready to Use Akuche!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                You now know where to ask for clarity, how to train your mind, how to set practical commitments, and where to track progress.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={markCompleteAndExit}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3.5 text-sm font-bold shadow-md transition active:scale-95"
              >
                <span>Finish Guide & Open Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground px-4 py-3.5 text-xs font-semibold transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restart Tutorial</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
