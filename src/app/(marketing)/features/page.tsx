"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Lightbulb,
  Book,
  Heart,
  Palette,
  Users,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  MessageSquare,
  BarChart,
  Dumbbell,
  Trophy,
  Clock,
} from "lucide-react";

const categories = [
  {
    icon: Brain,
    name: "Memory",
    description:
      "Strengthen short-term and long-term memory through recall exercises, mnemonics, and spatial memory techniques.",
    color: "from-indigo-500 to-indigo-600",
    shadow: "shadow-indigo-500/20",
    items: [
      "Free recall exercises",
      "Memory palace technique",
      "Name recall challenges",
      "Spaced repetition practice",
    ],
  },
  {
    icon: Target,
    name: "Focus",
    description:
      "Build deep concentration and eliminate distractions with structured attention training.",
    color: "from-amber-500 to-amber-600",
    shadow: "shadow-amber-500/20",
    items: [
      "Pomodoro sessions",
      "Deep work blocks",
      "Mindful breathing",
      "Digital detox hours",
    ],
  },
  {
    icon: Lightbulb,
    name: "Thinking",
    description:
      "Sharpen critical thinking, decision-making, and problem-solving with mental models.",
    color: "from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/20",
    items: [
      "Decision journaling",
      "First principles analysis",
      "Inversion exercises",
      "Premortem analysis",
    ],
  },
  {
    icon: Book,
    name: "Learning",
    description:
      "Accelerate skill acquisition with proven learning techniques.",
    color: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20",
    items: [
      "Feynman technique",
      "Active recall sessions",
      "Teaching others",
      "Cross-discipline reading",
    ],
  },
  {
    icon: Heart,
    name: "Health",
    description:
      "Physical habits that directly support cognitive performance and brain health.",
    color: "from-red-500 to-red-600",
    shadow: "shadow-red-500/20",
    items: [
      "Walking & exercise",
      "Sleep hygiene",
      "Nutrition for brain health",
      "Stress management",
    ],
  },
  {
    icon: Palette,
    name: "Creativity",
    description:
      "Unlock creative thinking and innovation through structured exercises.",
    color: "from-pink-500 to-pink-600",
    shadow: "shadow-pink-500/20",
    items: [
      "Morning pages",
      "Brainstorming techniques",
      "Constraint creation",
      "Idea combination",
    ],
  },
  {
    icon: Users,
    name: "Emotional Intelligence",
    description:
      "Understand emotions, build better relationships, and lead with empathy.",
    color: "from-purple-500 to-purple-600",
    shadow: "shadow-purple-500/20",
    items: [
      "Emotion labeling",
      "Active listening",
      "Empathy exercises",
      "Nonviolent communication",
    ],
  },
];

const coreFeatures = [
  {
    icon: Dumbbell,
    title: "Daily Brain Workouts",
    description:
      "Each day brings 5 carefully selected activities taking about 15 minutes total. A mix of categories keeps your training balanced.",
  },
  {
    icon: Sparkles,
    title: "AI Coach",
    description:
      "Your personal AI coach analyzes your performance and adapts your workouts. It notices patterns, celebrates wins, and suggests improvements.",
  },
  {
    icon: MessageSquare,
    title: "Decision Lab",
    description:
      "Weekly real-world scenarios that test your reasoning. The AI evaluates your thinking — not as right or wrong, but as an opportunity to grow.",
  },
  {
    icon: Trophy,
    title: "Life Missions",
    description:
      "Choose a 30-day mission aligned with your goals. The AI creates a personalized daily plan to help you achieve it.",
  },
  {
    icon: BarChart,
    title: "Brain Score Analytics",
    description:
      "Track your progress across 7 categories with detailed charts. See your Brain Fitness Score, category breakdowns, and long-term trends.",
  },
  {
    icon: Award,
    title: "Gamification & Streaks",
    description:
      "Earn XP, coins, and achievements. Build streaks. Climb from Bronze to Mastermind. Stay motivated with friendly competition.",
  },
  {
    icon: Clock,
    title: "Progress Reports",
    description:
      "Weekly, monthly, and yearly reports show your growth. Understand what's working and where to focus next.",
  },
  {
    icon: TrendingUp,
    title: "Personalized Recommendations",
    description:
      "The more you train, the smarter the recommendations get. Activities adapt to your goals, performance, and preferences.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border/40 bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>7 Dimensions of Cognitive Fitness</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Train every part of your brain
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              BrainGym covers all the cognitive skills that matter for real
              life — from memory and focus to emotional intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-lg"
              >
                <div
                  className={`mb-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${cat.color} px-3 py-1.5 text-sm font-medium text-white shadow-lg ${cat.shadow}`}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.name}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  {cat.description}
                </p>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="border-t border-border/40 bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything included
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              BrainGym combines science-backed training with AI-powered
              personalization.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-primary/20"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
