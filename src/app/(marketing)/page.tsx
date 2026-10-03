"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Lightbulb,
  Compass,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Zap,
  ShieldCheck,
  Scale,
  Workflow,
  MessageSquare,
} from "lucide-react";

const pillars = [
  {
    step: "01",
    icon: Lightbulb,
    title: "Think Better",
    subtitle: "Sharpen critical thinking & spot hidden biases",
    description:
      "Go beyond superficial answers. Practice mental models, logical deduction, and challenge AI outputs to sharpen your independent cognitive clarity.",
    badge: "Cognitive Agility",
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
  },
  {
    step: "02",
    icon: Compass,
    title: "Solve Real Problems",
    subtitle: "Break down complex life & work challenges",
    description:
      "Deconstruct ambiguous situations in business, career, money, and personal decisions into solvable pieces: What We Know, Assumptions, and Trade-offs.",
    badge: "Socratic Deconstruction",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
  },
  {
    step: "03",
    icon: Target,
    title: "Turn Thinking Into Action",
    subtitle: "Daily missions with real accountability",
    description:
      "Insight without execution is just theory. Every workout and problem deconstruction concludes with a concrete Today's Mission you can execute and log.",
    badge: "Action Loop",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Grow With Purpose",
    subtitle: "Qualitative profile across 10 dimensions",
    description:
      "Track your personal cognitive trajectory across 10 dimensions with qualitative observational insights and tailored workouts that adapt to your growth.",
    badge: "Adaptive Growth",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
  },
];

const coreLoopSteps = [
  { step: "ASK", label: "Ask AKUCHE", desc: "Bring any question, bottleneck, or goal." },
  { step: "THINK", label: "Think & Analyze", desc: "Examine assumptions, risks, and blind spots." },
  { step: "SOLVE", label: "Solve & Decide", desc: "Evaluate options and choose optimal paths." },
  { step: "ACT", label: "Take Action", desc: "Execute a concrete Today's Mission in real life." },
  { step: "GROW", label: "Measure & Grow", desc: "Reflect on outcomes and build mental stamina." },
];

const testimonials = [
  {
    quote:
      "ChatGPT gives answers, but AKUCHE forces me to think through the variables myself. It has radically improved how I make high-stakes business decisions.",
    author: "Emeka O.",
    role: "Tech Founder & Entrepreneur",
  },
  {
    quote:
      "The 'Challenge the AI' and 'Think for Yourself' workouts helped me spot logical fallacies in my team proposals. Truly transformative.",
    author: "Elena R.",
    role: "Senior Product Strategist",
  },
  {
    quote:
      "The 5-step loop (ASK → THINK → SOLVE → ACT → GROW) keeps me disciplined. I'm not just accumulating trivia; I'm solving real-world challenges.",
    author: "David K.",
    role: "Engineering Lead",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-16 lg:pb-24 border-b border-border/40">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="absolute left-1/2 top-0 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl space-y-6"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TRAIN YOUR MIND FOR REAL LIFE</span>
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl text-foreground">
              TRAIN YOUR MIND.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                SOLVE REAL PROBLEMS.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
              <strong className="text-foreground font-semibold">AKUCHE</strong> helps you think better, solve real-life challenges, make superior decisions, and turn insight into action.
            </p>

            {/* Core Philosophy Loop Interactive Bar */}
            <div className="pt-2 pb-4">
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold tracking-wide text-foreground shadow-sm">
                <span className="text-emerald-400">ASK</span>
                <span className="text-muted-foreground/60">→</span>
                <span className="text-teal-400">THINK</span>
                <span className="text-muted-foreground/60">→</span>
                <span className="text-cyan-400">SOLVE</span>
                <span className="text-muted-foreground/60">→</span>
                <span className="text-amber-400">ACT</span>
                <span className="text-muted-foreground/60">→</span>
                <span className="text-emerald-300">GROW</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3.5 sm:flex-row pt-2">
              <Link
                href="/signup"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 px-8 text-base font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto touch-manipulation"
              >
                <span>START WITH AKUCHE</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-8 text-base font-semibold text-foreground transition-all hover:bg-accent sm:w-auto touch-manipulation"
              >
                <span>EXPLORE DASHBOARD</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy & The 5-Step Loop Section */}
      <section className="py-20 bg-muted/20 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              The AKUCHE Operating Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              HOW AKUCHE TRANSFORMS THINKING
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              A continuous loop designed to bridge the gap between mental clarity and real-world results.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {coreLoopSteps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 relative shadow-sm hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                    STEP {i + 1}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">{item.step}</span>
                </div>
                <h3 className="font-bold text-base text-foreground pt-1">{item.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Four Core Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              BUILT FOR REAL-LIFE COGNITIVE EXCELLENCE
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              AKUCHE combines Socratic coaching, structured problem deconstruction, and deliberate cognitive workouts.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`rounded-3xl border ${pillar.border} bg-card/60 backdrop-blur-sm p-8 space-y-4 hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <pillar.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {pillar.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-400">{pillar.subtitle}</p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Differentiation vs Generic AI */}
      <section className="py-20 bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-card to-card/50 p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
              <Scale className="h-3.5 w-3.5" />
              <span>THE AKUCHE DIFFERENCE</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">
              &ldquo;ChatGPT gives you answers. AKUCHE trains your mind to think, evaluate and act.&rdquo;
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We do not outsource your thinking. AKUCHE acts as your intellectual sparring partner, guiding you through socratic inquiry, unmasking hidden assumptions, and holding you accountable to real execution.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-muted-foreground">
              <span className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Non-Medical Mental Fitness
              </span>
              <span className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 10 Cognitive Dimensions
              </span>
              <span className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Real-World Problem Engine
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Trusted by Ambitious Thinkers
            </h2>
            <p className="text-base text-muted-foreground">
              See how learners, founders, and professionals train their minds with AKUCHE.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-4"
              >
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.author}</p>
                  <p className="text-xs text-emerald-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="border-t border-border/40 bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
              Ready to train your mind for real life?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Join AKUCHE today. Strengthen your thinking, solve real-world problems, and turn insight into action.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 px-10 text-base font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <span>GET STARTED WITH AKUCHE</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
