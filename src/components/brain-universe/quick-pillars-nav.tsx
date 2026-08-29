"use client";

import Link from "next/link";
import { Compass, Dumbbell, BarChart3, Bot, ArrowRight, Sparkles } from "lucide-react";

export function QuickPillarsNav() {
  const pillars = [
    {
      title: "DISCOVER",
      subtitle: "Brain Feed, Myths, Experiments & Cards",
      icon: Compass,
      href: "/dashboard/discover",
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "TRAIN",
      subtitle: "Daily Workout, Body+Brain & Games",
      icon: Dumbbell,
      href: "/dashboard/workout",
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      title: "MY BRAIN",
      subtitle: "Momentum, Baselines & 90-Day Journey",
      icon: BarChart3,
      href: "/dashboard/progress",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "COACH",
      subtitle: "AI Brain Coach & 'Ask Your Brain'",
      icon: Bot,
      href: "/dashboard/coach",
      color: "text-violet-500",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
      {pillars.map((p) => {
        const Icon = p.icon;
        return (
          <Link
            key={p.title}
            href={p.href}
            className="rounded-2xl border border-border bg-card/90 hover:bg-card p-3.5 space-y-2 transition active:scale-[0.98] shadow-sm hover:border-primary/40 group"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${p.bg} ${p.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
            </div>

            <div>
              <span className="text-xs font-black text-foreground block tracking-tight">
                {p.title}
              </span>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {p.subtitle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
