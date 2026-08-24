"use client";

import Link from "next/link";
import { Trophy, Flame, Brain, Zap, ArrowRight, ShieldCheck } from "lucide-react";

interface AchievementCardData {
  title: string;
  description: string;
  icon: any;
  xpReward: number;
  unlocked: boolean;
  color: string;
}

const FEATURED_ACHIEVEMENTS: AchievementCardData[] = [
  {
    title: "7-Day Ignition",
    description: "Maintained a perfect 7-day daily workout streak",
    icon: Flame,
    xpReward: 100,
    unlocked: true,
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  },
  {
    title: "Memory Maven",
    description: "Scored over 85% on 5 visual memory challenges",
    icon: Brain,
    xpReward: 150,
    unlocked: true,
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    title: "Lightning Reflex",
    description: "Achieved sub-280ms speed on Reaction Test",
    icon: Zap,
    xpReward: 200,
    unlocked: false,
    color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
  },
];

export function DashboardAchievementsSection() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Trophy className="h-4 w-4" />
          </div>
          <h3 className="text-base font-black text-foreground">
            ACHIEVEMENTS
          </h3>
        </div>

        <Link
          href="/dashboard/challenges"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 min-h-[32px] touch-manipulation"
        >
          <span>View All (18)</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {FEATURED_ACHIEVEMENTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`rounded-2xl border p-3.5 space-y-2 transition ${
                item.unlocked ? item.color : "border-border bg-muted/20 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-background text-foreground shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase text-primary">
                  +{item.xpReward} XP
                </span>
              </div>
              <div>
                <p className="text-xs font-black text-foreground">{item.title}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
