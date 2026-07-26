"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

const CATEGORY_BENEFITS: Record<string, { why: string; science: string }> = {
  memory: {
    why: "Strong memory helps you retain information, recall names & faces, and learn new skills faster.",
    science: "Studies show regular memory training can improve recall by 20-30% within 4 weeks.",
  },
  focus: {
    why: "Better focus means fewer distractions, deeper work, and more productivity in less time.",
    science: "Just 10 minutes of focus training daily can extend your attention span by 15% in 2 weeks.",
  },
  thinking: {
    why: "Sharper thinking helps you solve problems faster, make better decisions, and think critically.",
    science: "Logic puzzles strengthen prefrontal cortex connections, improving reasoning speed by 18%.",
  },
  learning: {
    why: "Faster learning means you pick up new skills, languages, and knowledge more efficiently.",
    science: "Active recall practice has been proven to double retention compared to passive review.",
  },
  health: {
    why: "Brain health supports mood, sleep quality, and protects against age-related cognitive decline.",
    science: "Physical + mental exercise together reduce dementia risk by up to 28% (Lancet Commission).",
  },
  creativity: {
    why: "Creativity helps you innovate, find unique solutions, and express yourself more effectively.",
    science: "Divergent thinking exercises increase creative output by 40% in just 3 sessions.",
  },
  "emotional-intelligence": {
    why: "Better emotional awareness improves relationships, leadership, and stress management.",
    science: "EQ training reduces workplace conflict by 30% and improves team performance by 25%.",
  },
};

export function WhyThisMatters({ categorySlug }: { categorySlug: string }) {
  const [open, setOpen] = useState(false);
  const benefit = CATEGORY_BENEFITS[categorySlug];
  if (!benefit) return null;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Info className="h-3 w-3" />
        Why this matters
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl border border-border bg-card p-3 shadow-xl"
          >
            <p className="text-xs font-medium leading-relaxed">{benefit.why}</p>
            <p className="mt-1.5 text-[10px] text-muted-foreground italic">{benefit.science}</p>
            <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 border-r border-b border-border bg-card" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
