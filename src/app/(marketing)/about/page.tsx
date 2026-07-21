"use client";

import { motion } from "framer-motion";
import { Brain, Eye, Target, Heart } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "Real Skills, Not Games",
    description:
      "We don't build puzzles. We build habits that translate directly to better thinking, focus, and decision-making in your daily life.",
  },
  {
    icon: Eye,
    title: "Science-Backed",
    description:
      "Every activity on BrainGym is rooted in cognitive science, behavioral psychology, and proven learning methodologies.",
  },
  {
    icon: Target,
    title: "Progress Over Perfection",
    description:
      "We celebrate consistency, not intensity. A 5-minute workout is better than none. Small steps compound into remarkable growth.",
  },
  {
    icon: Heart,
    title: "Human-Centered AI",
    description:
      "Our AI doesn't judge. It coaches, encourages, and adapts. Technology should make us more human, not less.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border/40 bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              We believe in
              <br />
              <span className="text-primary">cognitive fitness</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Just as physical exercise keeps your body healthy, mental
              exercise keeps your mind sharp. BrainGym makes that practice
              daily, personal, and effective.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg leading-relaxed text-muted-foreground"
            >
              The modern world demands more from our minds than ever before.
              We consume enormous amounts of information, make countless
              decisions daily, and juggle multiple responsibilities — yet we
              rarely train the underlying cognitive skills that make all of
              this possible.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground"
            >
              BrainGym was created to fill that gap. We combine the best of
              cognitive science, AI personalization, and habit formation to
              help people become better thinkers, better learners, and better
              leaders.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Our values
          </motion.h2>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border/50 bg-card p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
