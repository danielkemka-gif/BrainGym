"use client";

import Link from "next/link";
import { Swords, Gamepad2, Scale, MessageCircle, ArrowRight, Compass } from "lucide-react";

const ACCESS_ITEMS = [
  {
    title: "1v1 Brain Duel",
    description: "Challenge players live in 3-minute cognitive battles",
    icon: Swords,
    color: "text-orange-500 bg-orange-500/10",
    href: "/dashboard/challenges",
  },
  {
    title: "Activity Library",
    description: "Explore 177+ level-gated drills across 7 categories",
    icon: Gamepad2,
    color: "text-emerald-500 bg-emerald-500/10",
    href: "/dashboard/library",
  },
  {
    title: "Decision Lab",
    description: "Test strategic decisions & overcome cognitive biases",
    icon: Scale,
    color: "text-blue-500 bg-blue-500/10",
    href: "/dashboard/decision-lab",
  },
  {
    title: "Thinker Community",
    description: "Connect, share insights & discuss daily mind strategies",
    icon: MessageCircle,
    color: "text-violet-500 bg-violet-500/10",
    href: "/dashboard/chat",
  },
];

export function QuickAccessSection() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Compass className="h-4 w-4" />
          </div>
          <h3 className="text-base font-black text-foreground">
            EXPLORE BRAINGYM
          </h3>
        </div>

        <span className="text-xs text-muted-foreground font-medium">177+ Exercises</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACCESS_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-start justify-between rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/60 p-4 transition-all active:scale-[0.98] min-h-[72px] touch-manipulation group"
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-black text-foreground">{item.title}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{item.description}</p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
