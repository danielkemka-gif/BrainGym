"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Compass,
  Zap,
  Gamepad2,
  Brain,
  Bot,
  Scale,
  Trophy,
  Star,
  ShoppingCart,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock,
  Award,
  ChevronDown,
  Shield,
  Layers,
  HeartPulse,
  ScanEye,
  BrainCircuit,
  Orbit,
  GraduationCap,
  WandSparkles,
  Handshake,
} from "lucide-react";
import { OPEN_NAVIGATOR_EVENT } from "@/components/layout/feature-navigator";

interface PillarInfo {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  benefit: string;
  activities: string[];
  whyItMatters: string;
}

const PILLARS: PillarInfo[] = [
  {
    id: "memory",
    name: "Memory Fitness",
    icon: BrainCircuit,
    color: "from-blue-500 to-indigo-600",
    benefit: "Faster recall, reduced forgetfulness, improved study capacity.",
    whyItMatters: "Trains working memory and neuro-plasticity so you remember names, facts, and key information effortlessly.",
    activities: [
      "Memorize 10 new vocabulary words",
      "Recall yesterday's chronological events in detail",
      "Learn and dial a phone number from memory",
      "Memory card matches & number sequence recall",
    ],
  },
  {
    id: "focus",
    name: "Focus Fitness",
    icon: ScanEye,
    color: "from-cyan-500 to-teal-600",
    benefit: "Laser concentration, reduced distractions, sustained deep work.",
    whyItMatters: "Builds your attention span and mental stamina in a world of constant notifications and digital noise.",
    activities: [
      "15-minute mindfulness breathing meditation",
      "No-phone challenge for 2 continuous hours",
      "25-minute Pomodoro deep work sprint",
      "Speed reading with comprehension checks",
    ],
  },
  {
    id: "thinking",
    name: "Thinking & Logic Fitness",
    icon: Orbit,
    color: "from-violet-500 to-purple-600",
    benefit: "Better decision-making, analytical problem solving, strategic vision.",
    whyItMatters: "Sharpens deductive reasoning and cognitive flexibility to break down complex challenges into clear steps.",
    activities: [
      "Debate counter-arguments on a complex topic",
      "Solve a weekly Decision Lab case study",
      "Lateral thinking & reverse-problem puzzles",
      "Strategic game exercises (chess, logic)",
    ],
  },
  {
    id: "emotional",
    name: "Emotional Intelligence Fitness",
    icon: Handshake,
    color: "from-rose-500 to-pink-600",
    benefit: "Stronger leadership, emotional regulation, deeper relationships.",
    whyItMatters: "Strengthens self-awareness and empathy so you stay composed during disagreements and stressful interactions.",
    activities: [
      "Put yourself in another person's shoes during conflict",
      "Daily gratitude journal (3 specific reflections)",
      "Practice 10 minutes of active, uninterrupted listening",
      "Emotional trigger identification exercise",
    ],
  },
  {
    id: "learning",
    name: "Learning Fitness",
    icon: GraduationCap,
    color: "from-amber-500 to-orange-600",
    benefit: "Accelerated learning curve, mental flexibility, knowledge synthesis.",
    whyItMatters: "Teaches your brain to acquire new skills rapidly and retain complex frameworks long-term.",
    activities: [
      "Learn one new concept outside your primary domain",
      "Read 20 minutes of high-density non-fiction",
      "Explain a difficult topic in simple terms (Feynman technique)",
      "Watch an educational lecture and write 3 takeaways",
    ],
  },
  {
    id: "health",
    name: "Brain Health & Nutrition",
    icon: HeartPulse,
    color: "from-emerald-500 to-green-600",
    benefit: "High energy levels, zero brain fog, long-term neuro-protection.",
    whyItMatters: "Your physical brain tissue requires clean fuel, restorative sleep, and blood circulation to operate at its peak.",
    activities: [
      "Zero refined sugar challenge for 24 hours",
      "Hydration protocol (2.5L+ clean water daily)",
      "Eat brain-nourishing foods (walnuts, almonds, berries)",
      "Walk 5,000+ steps outdoors in natural daylight",
    ],
  },
  {
    id: "creativity",
    name: "Creativity & Lateral Fitness",
    icon: WandSparkles,
    color: "from-fuchsia-500 to-pink-600",
    benefit: "Unconventional solutions, creative thinking, mental agility.",
    whyItMatters: "Breaks rigid thought loops to uncover innovative solutions in your work, business, and daily life.",
    activities: [
      "Generate 10 rapid solutions for a everyday problem",
      "Reverse-thinking: solve the exact opposite scenario",
      "Creative journaling & concept sketches",
      "Connect two completely unrelated concepts into a new idea",
    ],
  },
];

const FAQS = [
  {
    q: "How does BrainGym differ from typical puzzle apps?",
    a: "Most brain apps only offer mini arcade puzzles, which make you good at those specific games but rarely translate to real life. BrainGym combines interactive speed games with 89+ real-life habit activities (sleep, nutrition, decision case studies, emotional control, and focus sprints) to create true cognitive improvement.",
  },
  {
    q: "How is my daily Brain Age calculated?",
    a: "When you take the 2-minute Daily Challenge, the app measures three factors: speed (processing latency), accuracy (working memory), and pattern recognition. Your performance is scored against age-graded baseline benchmarks to give you your real-time Brain Age for that day.",
  },
  {
    q: "What are Brain Coins and how do I use them?",
    a: "Brain Coins are earned by completing daily workouts, keeping your streak alive, achieving missions, and inviting friends. You can spend them in the Brain Coins Shop (/dashboard/shop) to buy Streak Freezes, custom Brain Avatars, and unlock premium cognitive features.",
  },
  {
    q: "What is the Decision Lab?",
    a: "The Decision Lab (/dashboard/decision-lab) presents realistic scenarios from business, leadership, relationships, and finance. You evaluate the dilemma and submit your reasoning. The AI evaluates your judgment based on empathy, long-term thinking, and strategic logic.",
  },
  {
    q: "How does the referral system work?",
    a: "When you copy and share your invite link (/dashboard/invite) with friends, whenever they sign up and start training, both you and your friend immediately receive 100 bonus Brain Coins.",
  },
];

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<"loop" | "pillars" | "scoring" | "ai" | "faq">("loop");
  const [readChapters, setReadChapters] = useState<Record<string, boolean>>({});

  function markRead(chapterId: string) {
    setReadChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  }

  function openNavigator() {
    window.dispatchEvent(new Event(OPEN_NAVIGATOR_EVENT));
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 sm:space-y-8 pb-32 sm:pb-16 overflow-x-hidden">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-indigo-950/40 via-background to-violet-950/30 p-5 sm:p-8 backdrop-blur-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Compass className="h-3.5 w-3.5" />
            <span>BrainGym Onboarding & Feature Manual</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            How BrainGym Works
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
            Gain complete clarity on the 7 brain fitness pillars, daily workout habits, Brain Age benchmarks, and AI decision systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={openNavigator}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition active:scale-[0.98] min-h-[44px] touch-manipulation"
            >
              <Compass className="h-4 w-4" />
              <span>Launch Feature Navigator</span>
            </button>
            <Link
              href="/dashboard/workout"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition active:scale-[0.98] min-h-[44px] touch-manipulation"
            >
              <Zap className="h-4 w-4 text-emerald-500" />
              <span>Start Today&apos;s Workout</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-2 scrollbar-none text-xs sm:text-sm">
        {[
          { id: "loop", label: "1. The Daily Loop", icon: Zap },
          { id: "pillars", label: "2. 7 Brain Pillars", icon: Brain },
          { id: "ai", label: "3. AI Coach & Decision Lab", icon: Bot },
          { id: "scoring", label: "4. XP, Ranks & Coins", icon: Trophy },
          { id: "faq", label: "5. FAQ & Clarity", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium whitespace-nowrap transition-all touch-manipulation min-h-[40px] ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: The Daily Loop */}
      {activeTab === "loop" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Your 15-Minute Daily Mental Fitness Routine
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think of BrainGym like a physical fitness gym. You don&apos;t get stronger by reading exercise articles; you get stronger by executing daily reps. Here is how your daily training flow works:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">1</span>
                  Today&apos;s Workout (5 Activities)
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every morning, the app curates 5 practical activities matching your goals. Check them off as you complete them throughout the day to earn XP and Brain Coins.
                </p>
                <Link href="/dashboard/workout" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1">
                  Go to Workout →
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">2</span>
                  Daily Challenge (Calculate Brain Age)
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Play 3 quick speed tests in under 2 minutes (Memory, Processing, Focus) to see today&apos;s calculated Brain Age and benchmark your daily mental clarity.
                </p>
                <Link href="/dashboard/daily-challenge" className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:underline pt-1">
                  Take Daily Challenge →
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold">3</span>
                  Decision Lab & AI Coach Check-in
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tackle a real-world case study dilemma or get personalized habit feedback from your AI Brain Coach.
                </p>
                <Link href="/dashboard/decision-lab" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 hover:underline pt-1">
                  Open Decision Lab →
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold">4</span>
                  Streak Protection & Brain Coins
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Completing your daily workout maintains your active streak. Earned coins can be redeemed in the Shop for Streak Freezes and rewards.
                </p>
                <Link href="/dashboard/shop" className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:underline pt-1">
                  Visit Brain Shop →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: 7 Brain Pillars */}
      {activeTab === "pillars" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              The 7 Pillars of Cognitive Fitness
            </h2>
            <p className="text-sm text-muted-foreground">
              BrainGym categorizes over 177+ activities and scoring parameters into 7 essential brain performance dimensions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${pillar.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground">{pillar.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{pillar.benefit}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Why it matters: </strong>
                    {pillar.whyItMatters}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sample Real-Life Exercises:</p>
                    <ul className="space-y-1">
                      {pillar.activities.map((act, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Tab 3: AI Coach & Decision Lab */}
      {activeTab === "ai" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bot className="h-5 w-5 text-violet-500" />
              AI Brain Coach & Decision Lab
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              BrainGym incorporates state-of-the-art AI cognitive modeling to provide personalized mental training that adapts to your actual performance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">AI Brain Coach</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your AI Coach monitors which categories you practice most, identifies cognitive blind spots (e.g. skipping focus or emotional exercises), and gives actionable daily advice.
                </p>
                <div className="rounded-xl bg-background/80 p-3 border border-border text-xs italic text-muted-foreground">
                  &quot;Daniel, your focus score dropped 8% this week. Try taking a 15-minute screen-free walk before your afternoon deep work.&quot;
                </div>
                <Link
                  href="/dashboard/coach"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-violet-500 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-600 transition"
                >
                  <span>Chat with AI Coach</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white">
                    <Scale className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">Decision Lab</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every week, tackle realistic dilemma case studies across business ethics, team leadership, financial allocation, and interpersonal relationships.
                </p>
                <div className="rounded-xl bg-background/80 p-3 border border-border text-xs italic text-muted-foreground">
                  &quot;A vendor delivers faulty materials right before a major product launch. What is your immediate and long-term response?&quot;
                </div>
                <Link
                  href="/dashboard/decision-lab"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-600 transition"
                >
                  <span>Solve Decision Scenarios</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 4: Scoring, Ranks & Coins */}
      {activeTab === "scoring" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              XP Points, Level Tiers & Brain Coins
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Level Tiers */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Cognitive Level Ranks</h3>
                <div className="space-y-2">
                  {[
                    { rank: "Beginner Brain", xp: "0 – 500 XP", color: "text-slate-400" },
                    { rank: "Active Thinker", xp: "501 – 2,000 XP", color: "text-emerald-500" },
                    { rank: "Smart Brain", xp: "2,001 – 5,000 XP", color: "text-blue-500" },
                    { rank: "Genius Tier", xp: "5,001 – 10,000 XP", color: "text-purple-500" },
                    { rank: "Elite Thinker", xp: "10,001 – 25,000 XP", color: "text-amber-500" },
                    { rank: "Mastermind", xp: "25,001+ XP", color: "text-rose-500 font-bold" },
                  ].map((tier, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/30 text-xs">
                      <span className={`font-semibold ${tier.color}`}>{tier.rank}</span>
                      <span className="font-mono text-muted-foreground">{tier.xp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brain Coins & Shop */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Brain Coins & Rewards</h3>
                <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3 text-xs">
                  <p className="text-muted-foreground leading-relaxed">
                    Brain Coins are our internal reward currency. You earn coins for:
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Completing daily workouts (+10 to +25 coins)</li>
                    <li>• 7-Day & 30-Day streak milestones (+50 to +200 coins)</li>
                    <li>• Inviting friends to train (+100 bonus coins each)</li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      href="/dashboard/shop"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Explore Brain Coins Shop</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 5: FAQ & Clarity */}
      {activeTab === "faq" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about navigating and mastering BrainGym:
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
                <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">?</span>
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
