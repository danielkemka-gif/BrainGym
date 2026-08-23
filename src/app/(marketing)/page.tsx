"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Lightbulb,
  Book,
  Heart,
  Palette,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

const categories = [
  {
    icon: Brain,
    label: "Memory",
    color: "from-indigo-500 to-indigo-600",
    shadow: "shadow-indigo-500/20",
  },
  {
    icon: Target,
    label: "Focus",
    color: "from-amber-500 to-amber-600",
    shadow: "shadow-amber-500/20",
  },
  {
    icon: Lightbulb,
    label: "Thinking",
    color: "from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: Book,
    label: "Learning",
    color: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: Heart,
    label: "Health",
    color: "from-red-500 to-red-600",
    shadow: "shadow-red-500/20",
  },
  {
    icon: Palette,
    label: "Creativity",
    color: "from-pink-500 to-pink-600",
    shadow: "shadow-pink-500/20",
  },
  {
    icon: Users,
    label: "EQ",
    color: "from-purple-500 to-purple-600",
    shadow: "shadow-purple-500/20",
  },
];

const features = [
  {
    icon: Zap,
    title: "Daily Workouts",
    description:
      "5 activities in 15 minutes. Meditation, reading, walking, learning, and reflection.",
  },
  {
    icon: Sparkles,
    title: "AI Coach",
    description:
      "Your personal brain coach analyzes your patterns and gives personalized recommendations.",
  },
  {
    icon: TrendingUp,
    title: "Deep Analytics",
    description:
      "Track your Brain Score across 7 categories. See your growth over days, weeks, and months.",
  },
  {
    icon: Award,
    title: "Gamification",
    description:
      "Earn XP, coins, and achievements. Build streaks. Level up from Bronze to Mastermind.",
  },
];

const testimonials = [
  {
    quote:
      "BrainGym replaced my scattered self-improvement attempts with a focused daily practice.",
    author: "Alex K.",
    role: "Software Engineer",
  },
  {
    quote:
      "The Decision Lab scenarios made me realize how I actually think under pressure. Game changer.",
    author: "Maria S.",
    role: "Product Manager",
  },
  {
    quote:
      "My focus score improved 40% in 8 weeks. I no longer dread deep work sessions.",
    author: "James L.",
    role: "Graduate Student",
  },
];


export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 sm:pt-28 pb-16">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>THE DAILY GYM FOR YOUR MIND</span>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              TRAIN YOUR BRAIN.
              <br />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">EVERY DAY.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-xl text-muted-foreground leading-relaxed font-medium">
              BrainGym is to the brain what a gym is to the body. Build a morning habit that makes you think faster, focus deeper, remember accurately, and stay razor sharp for life.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 px-8 text-base font-black text-white shadow-xl shadow-primary/30 transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto touch-manipulation"
              >
                <span>START TRAINING YOUR BRAIN</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card/80 px-8 text-base font-bold transition-all hover:bg-accent sm:w-auto touch-manipulation"
              >
                <span>TAKE THE BRAIN TEST (2 MIN)</span>
              </Link>
            </div>
          </motion.div>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-2.5"
          >
            {categories.map((cat) => (
              <div
                key={cat.label}
                className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${cat.color} px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md ${cat.shadow}`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5-Step How It Works Section */}
      <section className="border-t border-border/40 bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple Daily Habit Loop</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              HOW BRAINGYM WORKS
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              A 5-step scientifically structured habit that fits effortlessly into your morning routine.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { step: "1", title: "Wake-Up Prompt", desc: "Receive your morning brain activation reminder." },
              { step: "2", title: "5–10 Min Workout", desc: "Complete 5 balanced cognitive drills tailored to you." },
              { step: "3", title: "Brain Momentum", desc: "Watch your Brain Score (0–100) & Momentum rise." },
              { step: "4", title: "Beat Yourself", desc: "Outperform yesterday's personal best baseline." },
              { step: "5", title: "Come Back Sharper", desc: "Lock in your streak and return sharper tomorrow." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 relative shadow-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-sm">
                  {item.step}
                </span>
                <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by thinkers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands training their brains daily.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border/50 bg-card p-6"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      className="h-4 w-4 fill-primary text-primary"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mb-4 text-sm text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="text-sm font-medium">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start your brain training today
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              15 minutes a day. Real results. No games.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
