"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  saveMemoryItem,
  recordActionStreakActivity,
  addCommitment,
} from "@/lib/akuche/memory-engine";
import { saveDecisionRecord } from "@/lib/akuche/decisions-engine";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Brain,
  HelpCircle,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Flame,
  Calendar,
  Layers,
  ChevronRight,
  Shield,
  Lightbulb,
  Send,
  Compass,
} from "lucide-react";

type ThinkCategory = "problem" | "decision" | "goal" | "situation" | "challenge" | "custom";

interface OptionDetail {
  id: string;
  name: string;
  headline: string;
  benefit: string;
  downside: string;
  requires: string;
}

export default function ThinkPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State machine for step-by-step thinking experience
  // 0: Category Selector / Input
  // 1: Single Clarifying Question
  // 2: Situation Map (What I'm Hearing)
  // 3: Options Comparison (Options A, B, C)
  // 4: Decision Weighting & Recommendation
  // 5: Realistic Action Plan (Today, Tomorrow, This week)
  // 6: Follow-up & Next step lock
  const [step, setStep] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<ThinkCategory>("problem");
  const [situationText, setSituationText] = useState("");
  const [clarifyingAnswer, setClarifyingAnswer] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("Growth");
  const [selectedOptionId, setSelectedOptionId] = useState<string>("B");
  const [customAction, setCustomAction] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const ENTRY_POINTS = [
    {
      id: "problem" as ThinkCategory,
      title: "A PROBLEM",
      description: "“I have a problem I need to solve.”",
      icon: AlertTriangle,
      color: "text-amber-500 bg-amber-500/10",
      placeholder: "e.g. I keep applying for roles or pitching clients, but nobody is responding...",
    },
    {
      id: "decision" as ThinkCategory,
      title: "A DECISION",
      description: "“I have two or more choices.”",
      icon: Sliders,
      color: "text-emerald-500 bg-emerald-500/10",
      placeholder: "e.g. Should I leave my full-time job to focus on my business full-time, or keep both?",
    },
    {
      id: "goal" as ThinkCategory,
      title: "A GOAL",
      description: "“I know what I want, but I don't know how to get there.”",
      icon: Target,
      color: "text-blue-500 bg-blue-500/10",
      placeholder: "e.g. I want to build a reliable ₦1.5M monthly recurring income stream before December...",
    },
    {
      id: "situation" as ThinkCategory,
      title: "A SITUATION",
      description: "“Something is happening and I need to understand it.”",
      icon: Compass,
      color: "text-purple-500 bg-purple-500/10",
      placeholder: "e.g. A key partnership or deal has suddenly stalled and communication has gone quiet...",
    },
    {
      id: "challenge" as ThinkCategory,
      title: "A CHALLENGE",
      description: "“Give me something to think about.”",
      icon: Lightbulb,
      color: "text-rose-500 bg-rose-500/10",
      placeholder: "e.g. Test my business model against high inflation and low consumer purchasing power...",
    },
  ];

  // Dynamic clarifying question based on situation
  const getClarifyingQuestion = () => {
    const text = situationText.toLowerCase();
    if (text.includes("job") || text.includes("career") || text.includes("interview")) {
      return "What stage is breaking down most often: getting initial responses, or converting interviews into offers?";
    }
    if (text.includes("money") || text.includes("business") || text.includes("client") || text.includes("sales")) {
      return "Are you speaking directly to warm qualified decision-makers, or relying mostly on passive channels (websites, cold forms)?";
    }
    if (text.includes("relationship") || text.includes("partner") || text.includes("family")) {
      return "What is the single unspoken expectation that is creating tension in this dynamic?";
    }
    return "What is the single biggest unknown variable or bottleneck preventing clear progress right now?";
  };

  // Dynamic Situation Synthesis
  const getSituationSynthesis = () => {
    return {
      summary: situationText.trim() || "You are assessing a critical path decision with competing trade-offs.",
      factors: [
        "Positioning & Direct Targeting: Whether your current approach is reaching the right audience.",
        "Resource Allocation: Balancing speed, capital, and emotional energy without burning out.",
        "Execution Feedback Loop: Tightening the cycle between taking an action and testing results.",
      ],
      unknown: clarifyingAnswer.trim()
        ? `Clarified context: "${clarifyingAnswer.slice(0, 100)}..."`
        : "The true conversion rate when you pitch directly to pre-qualified contacts.",
    };
  };

  // Generated Realistic Options
  const getOptions = (): OptionDetail[] => {
    return [
      {
        id: "A",
        name: "Option A: Tighten & Optimize Existing Strategy",
        headline: "Double down on your current path by refining the value proposition and targeting.",
        benefit: "Low switching cost, leverages existing assets and momentum immediately.",
        downside: "If the core premise is flawed, you risk continuing in an unprofitable direction.",
        requires: "3–5 days of rigorous testing with measurable daily outreach.",
      },
      {
        id: "B",
        name: "Option B: Pivot to High-Leverage Pilot Experiment",
        headline: "Test a direct, simplified 24-hour micro-offer on warm contacts before making large commitments.",
        benefit: "Fastest clarity with real real-world validation in under 48 hours.",
        downside: "Requires direct communication and confronting immediate market feedback.",
        requires: "Crafting a 1-sentence value offer and sending 5 personal messages.",
      },
      {
        id: "C",
        name: "Option C: Build Missing Core Capability First",
        headline: "Pause active pitching to upgrade the primary bottleneck skill or portfolio proof.",
        benefit: "Significantly higher conversion rate when you re-launch.",
        downside: "Delays immediate cash flow and can become a form of productive procrastination.",
        requires: "Strict 7-day learning sprint with a tangible output by day 7.",
      },
    ];
  };

  const PRIORITY_FACTORS = [
    { label: "⚡ Speed", value: "Speed", desc: "Fastest time to result" },
    { label: "💰 Money", value: "Money", desc: "Highest income potential" },
    { label: "🛡️ Stability", value: "Stability", desc: "Lowest downside risk" },
    { label: "🚀 Growth", value: "Growth", desc: "Highest long-term compounding" },
    { label: "🔀 Flexibility", value: "Flexibility", desc: "Reversible options" },
    { label: "📚 Learning", value: "Learning", desc: "Maximum skill acquisition" },
  ];

  const handleStartThinking = (cat?: ThinkCategory) => {
    if (cat) setSelectedCategory(cat);
    if (!situationText.trim()) return;
    setStep(1);
  };

  const handleClarifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleProceedToOptions = () => {
    setStep(3);
  };

  const handleProceedToDecision = () => {
    setStep(4);
  };

  const handleProceedToActionPlan = () => {
    setStep(5);
  };

  const handleFinalizeAndSave = () => {
    const allOptions = getOptions();
    const selectedOpt = allOptions.find((o) => o.id === selectedOptionId) || allOptions[1];
    
    // Save to Long Term Memory
    saveMemoryItem({
      category: "decision",
      title: `Thinking: ${situationText.slice(0, 45)}...`,
      content: `Selected: ${selectedOpt.name}. Priority: ${selectedPriority}. Immediate Action: ${customAction || "Execute Step 1 (Today's action)."}.`,
      sourceContext: "Think Screen Session",
    });

    // Save as Decision Record
    const primaryCategory: "Business" | "Career" | "Money" | "Personal" | "Education" | "Relationships" =
      selectedCategory === "decision" ? "Business" : "Personal";

    saveDecisionRecord({
      title: situationText.slice(0, 60),
      category: primaryCategory,
      optionA: allOptions[0]?.name || "Option 1",
      optionB: allOptions[1]?.name || "Option 2",
      advantagesA: [allOptions[0]?.benefit || "Direct approach"],
      advantagesB: [allOptions[1]?.benefit || "Alternative route"],
      risksA: [allOptions[0]?.downside || "Execution risk"],
      risksB: [allOptions[1]?.downside || "Opportunity cost"],
      worstCaseA: "Reversible experiment",
      worstCaseB: "Adjust within 7 days",
      isReversible: true,
      experiment24h: customAction || "Execute Step 1 micro-test today and log results",
      finalChoice: selectedOpt.name,
      rationale: `Prioritized for ${selectedPriority}.`,
      actionSteps: [
        customAction || "Step 1: Execute immediate micro-action today",
        "Step 2: Consolidate tomorrow's momentum",
        "Step 3: Review weekly milestones",
      ],
    });

    // Save Commitment
    addCommitment(
      `Execute Step 1: ${selectedOpt.name}`,
      "Lock in today's micro-action and record results in Akuche.",
      "Before end of today"
    );

    recordActionStreakActivity({
      type: "decision",
      title: "Completed Structured Thinking Session",
      details: `Mapped: "${situationText.slice(0, 35)}..." with realistic next step.`,
    });

    setSavedSuccess(true);
    setStep(6);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-3 sm:px-4 py-3 pb-28 text-foreground touch-manipulation">
      {/* ─── STAGE 0: ENTRY POINTS & NATURAL LANGUAGE INPUT (SECTION 12) ─── */}
      {step === 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="space-y-1.5 pt-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Brain className="h-3.5 w-3.5" />
              <span>THINK WITH AKUCHE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              What are you trying to figure out?
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Let&apos;s work through it together. Move from confusion to clarity, decision and action.
            </p>
          </div>

          {/* Natural Entry Point Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ENTRY_POINTS.map((entry) => {
              const Icon = entry.icon;
              const isSelected = selectedCategory === entry.id;
              return (
                <button
                  key={entry.id}
                  onClick={() => {
                    setSelectedCategory(entry.id);
                    if (!situationText) {
                      setSituationText(entry.placeholder.replace("e.g. ", ""));
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition active:scale-95 touch-manipulation flex items-start gap-3 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500 shadow-sm"
                      : "border-border/80 bg-card hover:border-emerald-500/30"
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${entry.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-foreground block tracking-tight">
                      {entry.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-tight">
                      {entry.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Large Natural Language Text Input */}
          <div className="rounded-3xl border-2 border-emerald-500/30 bg-card p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                <span>Describe it in your own words</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                Natural Language
              </span>
            </div>

            <textarea
              rows={4}
              value={situationText}
              onChange={(e) => setSituationText(e.target.value)}
              placeholder="Tell me what is happening in your situation. Write freely..."
              className="w-full rounded-2xl border border-border bg-background p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground italic">
                Akuche will break down factors, test assumptions &amp; map realistic options.
              </span>

              <button
                onClick={() => handleStartThinking()}
                disabled={!situationText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/20 disabled:opacity-40 transition active:scale-95"
              >
                <span>Think It Through</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STAGE 1: SINGLE CLARIFYING QUESTION (SECTION 13) ─── */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <span>STEP 1 OF 5 · CLARIFYING THE ESSENCE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              “I understand the situation better now.”
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Before we jump into recommendations, I need to understand one key factor:
            </p>
          </div>

          <div className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base font-bold text-foreground">
                {getClarifyingQuestion()}
              </p>
            </div>

            <form onSubmit={handleClarifySubmit} className="space-y-3 pt-2">
              <textarea
                rows={3}
                value={clarifyingAnswer}
                onChange={(e) => setClarifyingAnswer(e.target.value)}
                placeholder="Type your brief response..."
                className="w-full rounded-2xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none resize-none"
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
                >
                  ← Edit Situation
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold shadow-xs active:scale-95 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── STAGE 2: SITUATION MAP (SECTION 14) ─── */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              STEP 2 OF 5 · SITUATION MAP
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              What I&apos;m Hearing
            </h2>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
            {/* Situation Summary */}
            <div className="space-y-1 border-b border-border/60 pb-3">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                YOUR SITUATION
              </span>
              <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                &ldquo;{getSituationSynthesis().summary}&rdquo;
              </p>
            </div>

            {/* Diagnostic Factors */}
            <div className="space-y-2 border-b border-border/60 pb-3">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                WHAT MAY BE HAPPENING
              </span>
              <ul className="space-y-1.5 text-xs text-foreground/90">
                {getSituationSynthesis().factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 text-[10px] font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Unknown Variable */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                WHAT WE STILL DON&apos;T KNOW
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {getSituationSynthesis().unknown}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
            >
              ← Back
            </button>

            <button
              onClick={handleProceedToOptions}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/20 active:scale-95 transition"
            >
              <span>Let&apos;s Investigate Options</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STAGE 3: OPTIONS COMPARISON (SECTION 15) ─── */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              STEP 3 OF 5 · EXPLORE OPTIONS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              You Have 3 Realistic Paths
            </h2>
            <p className="text-xs text-muted-foreground">
              Compare benefits, downsides, and real requirements for each option.
            </p>
          </div>

          <div className="space-y-3">
            {getOptions().map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-4 sm:p-5 rounded-3xl border-2 cursor-pointer transition active:scale-[0.99] touch-manipulation space-y-3 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-1 ring-emerald-500"
                      : "border-border/80 bg-card hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-black text-foreground">
                      {opt.name}
                    </h3>
                    <span
                      className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {opt.headline}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="bg-background/80 rounded-xl p-2.5 border border-border/60">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        ✓ Potential Benefit:
                      </span>
                      <span className="text-muted-foreground">{opt.benefit}</span>
                    </div>

                    <div className="bg-background/80 rounded-xl p-2.5 border border-border/60">
                      <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                        ⚠ Potential Downside:
                      </span>
                      <span className="text-muted-foreground">{opt.downside}</span>
                    </div>

                    <div className="bg-background/80 rounded-xl p-2.5 border border-border/60">
                      <span className="font-bold text-purple-600 dark:text-purple-400 block mb-0.5">
                        ⚙ What It Requires:
                      </span>
                      <span className="text-muted-foreground">{opt.requires}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
            >
              ← Back
            </button>

            <button
              onClick={handleProceedToDecision}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/20 active:scale-95 transition"
            >
              <span>Weight Priorities &amp; Decide</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STAGE 4: DECISION WEIGHTING (SECTION 16) ─── */}
      {step === 4 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              STEP 4 OF 5 · DECISION WEIGHTING
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Which Matters Most to You Right Now?
            </h2>
            <p className="text-xs text-muted-foreground">
              Tell Akuche your primary priority to stress-test your chosen path.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRIORITY_FACTORS.map((p) => {
              const active = selectedPriority === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSelectedPriority(p.value)}
                  className={`p-3.5 rounded-2xl border text-left transition active:scale-95 touch-manipulation ${
                    active
                      ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500 shadow-xs"
                      : "border-border/80 bg-card hover:border-emerald-500/30"
                  }`}
                >
                  <span className="text-xs font-black text-foreground block">
                    {p.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Socratic Recommendation Box */}
          <div className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <Lightbulb className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-foreground">
                  Based on prioritizing <span className="text-emerald-600 dark:text-emerald-400 font-black">{selectedPriority}</span>, Option {selectedOptionId} currently fits your situation best.
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  <strong>What could change this recommendation?</strong> If you secure immediate committed client pre-orders within 48 hours, you can bypass Option C and proceed straight to active fulfillment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(3)}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
            >
              ← Back
            </button>

            <button
              onClick={handleProceedToActionPlan}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/20 active:scale-95 transition"
            >
              <span>Build Realistic Action Plan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STAGE 5: REALISTIC ACTION PLAN (SECTION 17) ─── */}
      {step === 5 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              STEP 5 OF 5 · YOUR ACTION PLAN
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Your Realistic First Action
            </h2>
            <p className="text-xs text-muted-foreground">
              No 17-step bloated plan. Just 3 progressive milestones to create immediate momentum.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
            {/* Step 1: Today */}
            <div className="flex items-start gap-3 border-b border-border/60 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-xs shadow-xs">
                TODAY
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  Draft &amp; Send 1 Direct Pilot Message
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Send 1 direct WhatsApp message asking if your target contact has an immediate need for your core skill this month.
                </p>
              </div>
            </div>

            {/* Step 2: Tomorrow */}
            <div className="flex items-start gap-3 border-b border-border/60 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground font-black text-xs">
                TOMORROW
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  Evaluate Response &amp; Identify 5 Matched Roles/Clients
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Record the objection or interest, and refine your 1-sentence value pitch accordingly.
                </p>
              </div>
            </div>

            {/* Step 3: This Week */}
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground font-black text-xs">
                THIS WEEK
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  Submit 3 Targeted Applications / Complete 2 Pilot Pitches
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Focus on quality and customized positioning rather than generic volume.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(4)}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
            >
              ← Back
            </button>

            <button
              onClick={handleFinalizeAndSave}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition"
            >
              <span>Start Step 1 (Today)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STAGE 6: FOLLOW-UP & CONTINUITY (SECTION 18) ─── */}
      {step === 6 && (
        <div className="py-6 text-center space-y-6 animate-fade-in">
          <div className="mx-auto flex justify-center">
            <AkucheBrandLogo variant="mark" size="xl" animate />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Action Locked &amp; Saved.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold">
              “Come back after you&apos;ve done this and we&apos;ll review what happened.”
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Akuche has saved this decision into your personal memory portfolio and queued your 24-hour accountability follow-up on your Home dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
            >
              <span>Go to Home Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => {
                setStep(0);
                setSituationText("");
                setClarifyingAnswer("");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Think Another Situation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
