"use client";

import Link from "next/link";
import { Brain, Target, Zap, Lightbulb, Compass, ArrowRight } from "lucide-react";

interface DomainScore {
  name: string;
  score: number;
  icon: any;
  color: string;
  bgColor: string;
  slug: string;
}

const DOMAINS: DomainScore[] = [
  {
    name: "Memory",
    score: 82,
    icon: Brain,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500",
    slug: "memory",
  },
  {
    name: "Focus & Attention",
    score: 74,
    icon: Target,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    slug: "focus",
  },
  {
    name: "Reaction Speed",
    score: 88,
    icon: Zap,
    color: "text-violet-500",
    bgColor: "bg-violet-500",
    slug: "thinking",
  },
  {
    name: "Logic & Reasoning",
    score: 79,
    icon: Lightbulb,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    slug: "learning",
  },
  {
    name: "Executive Decisions",
    score: 85,
    icon: Compass,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    slug: "emotional-intelligence",
  },
];

export function CognitiveDomainsWidget() {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-foreground">
              Cognitive Profile
            </h3>
            <p className="text-[11px] text-muted-foreground">
              5 Core Brain Dimensions
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/progress"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 min-h-[32px] touch-manipulation"
        >
          <span>Analytics</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {DOMAINS.map((domain) => {
          const Icon = domain.icon;
          return (
            <div key={domain.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Icon className={`h-3.5 w-3.5 ${domain.color}`} />
                  <span>{domain.name}</span>
                </div>
                <span className="font-extrabold text-foreground">{domain.score}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${domain.bgColor} rounded-full transition-all duration-500`}
                  style={{ width: `${domain.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/dashboard/library"
        className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-muted/60 hover:bg-muted py-2.5 text-xs font-bold text-foreground transition min-h-[40px] touch-manipulation"
      >
        <span>Train Specific Domain in Library →</span>
      </Link>
    </div>
  );
}
