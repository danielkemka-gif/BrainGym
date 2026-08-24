"use client";

import Link from "next/link";
import { Sparkles, Brain, Footprints, BookOpen, Heart, Moon, ArrowRight, CheckCircle2 } from "lucide-react";

export function TodaysBrainPlanCard() {
  const planItems = [
    {
      action: "THINK",
      label: "7-Round In-App Workout",
      time: "5m",
      icon: Brain,
      color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
      href: "/dashboard/workout",
    },
    {
      action: "MOVE",
      label: "15-Min Brisk Brain Walk",
      time: "15m",
      icon: Footprints,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      href: "/dashboard/physical/mov-act-01",
    },
    {
      action: "LEARN",
      label: "Learn 3 New Words / Greetings",
      time: "10m",
      icon: BookOpen,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      href: "/dashboard/physical/lrn-act-01",
    },
    {
      action: "CONNECT",
      label: "Active Listening Conversation",
      time: "5m",
      icon: Heart,
      color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
      href: "/dashboard/physical/soc-act-01",
    },
    {
      action: "RECOVER",
      label: "30-Min Pre-Sleep Digital Sunset",
      time: "30m",
      icon: Moon,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      href: "/dashboard/physical/slp-act-01",
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              YOUR BRAIN PLAN TODAY
            </h3>
            <p className="text-xs text-muted-foreground">
              Holistic mental performance: Think • Move • Learn • Connect • Recover
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-muted-foreground">5 Daily Anchors</span>
      </div>

      <div className="space-y-2">
        {planItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.action}
              href={item.href}
              className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/60 p-3 sm:p-3.5 transition active:scale-[0.99] group touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-primary">
                      {item.action}
                    </span>
                    <span className="text-[10px] text-muted-foreground">• ⏱️ {item.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
