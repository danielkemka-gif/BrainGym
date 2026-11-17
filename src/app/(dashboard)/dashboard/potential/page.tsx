"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Compass,
  GraduationCap,
  BookOpen,
  Target,
  Zap,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const POTENTIAL_MODULES = [
  {
    id: "graduate-roadmap",
    icon: Compass,
    title: "New Graduate: 90-Day Career Direction Roadmap",
    description: "Break out of paralysis and confusion. Formulate structured 90-day career experiments to identify where your strengths meet market demand.",
    prompt: "I just graduated (or am 21 years old) and don't know what career direction to pursue. Help me explore my interests, natural abilities, and constraints, and build a concrete 90-day action plan.",
  },
  {
    id: "strengths-discovery",
    icon: Sparkles,
    title: "Strengths, Aptitudes & Unique Value Discovery",
    description: "Identify the tasks where you learn fastest, solve problems effortlessly, and produce above-average quality compared to your peers.",
    prompt: "Help me identify my core cognitive strengths, natural problem-solving aptitudes, and how to apply them to marketable opportunities.",
  },
  {
    id: "learning-science",
    icon: BookOpen,
    title: "Active Recall & Feynman Learning Method",
    description: "Stop wasting hours passively rereading. Use active recall, concept explanation, and study sprints to master complex topics and pass exams.",
    prompt: "I am spending hours studying or reading, but forgetting concepts quickly. Teach me how to apply the Feynman technique and active recall to retain complex material with less effort.",
  },
  {
    id: "digital-skills",
    icon: Zap,
    title: "High-Leverage Digital Skills & Future Readiness",
    description: "Map which digital skills (technical, analytical, marketing, or design) have the highest immediate employment and freelance market demand.",
    prompt: "Which modern digital and analytical skills have the strongest market demand today, and how do I build a portfolio of proof projects over the next 3 months?",
  },
  {
    id: "personal-discipline",
    icon: Target,
    title: "Personal Discipline & Breaking Procrastination",
    description: "Lower the friction of daily action. Replace vague aspirations with consistent execution routines.",
    prompt: "I struggle with procrastination and consistency with my personal goals. Help me design a daily routine with minimum friction so I stay disciplined.",
  },
];

export default function PotentialWorkspacePage() {
  const router = useRouter();

  const handleStartPrompt = (prompt: string) => {
    router.push(`/dashboard/ask?workspace=potential&prompt=${encodeURIComponent(prompt)}`);
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
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-xs font-black tracking-widest uppercase text-purple-600 dark:text-purple-400">
            MY POTENTIAL WORKSPACE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
          Strengths, Learning &amp; Direction
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Designed for young adults, students and graduates (18+) discovering their capabilities, mapping career paths, mastering learning science, and building future independence.
        </p>
      </div>

      {/* Freeform Prompt Hero */}
      <section className="rounded-3xl border border-purple-500/30 bg-purple-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <h2 className="text-sm font-bold text-foreground">
            What area of your life or learning do you want to explore?
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Whether feeling unsure about career choices, preparing for exams, or wanting to master a new skill, tell Akuche what you are trying to understand.
        </p>
        <button
          onClick={() => router.push("/dashboard/ask?workspace=potential")}
          className="w-full py-3.5 px-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs tracking-wide shadow-sm transition flex items-center justify-center gap-2"
        >
          <span>Open Potential Coaching Session</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* Diagnostic Modules Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
          Growth &amp; Exploration Pathways
        </h2>
        <div className="space-y-3">
          {POTENTIAL_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => handleStartPrompt(mod.prompt)}
                className="group rounded-3xl border border-border bg-card p-4 sm:p-5 hover:border-purple-500/60 hover:shadow-sm transition cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-purple-600 transition">
                      {mod.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 shrink-0 flex items-center gap-0.5 pt-1">
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
