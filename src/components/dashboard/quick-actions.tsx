"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Zap, ShoppingCart, Gamepad2 } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/icons";
import { CATEGORY_ILLUSTRATIONS } from "@/components/brain-illustrations";

const CATEGORY_THEMES: Record<string, { gradient: string; glow: string; ring: string; bg: string }> = {
  memory: {
    gradient: "from-indigo-500 to-violet-600",
    glow: "group-hover:shadow-indigo-500/25",
    ring: "ring-indigo-500/20",
    bg: "bg-indigo-500/5",
  },
  focus: {
    gradient: "from-amber-400 to-orange-500",
    glow: "group-hover:shadow-amber-500/25",
    ring: "ring-amber-500/20",
    bg: "bg-amber-500/5",
  },
  thinking: {
    gradient: "from-emerald-400 to-teal-600",
    glow: "group-hover:shadow-emerald-500/25",
    ring: "ring-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  learning: {
    gradient: "from-sky-400 to-blue-600",
    glow: "group-hover:shadow-sky-500/25",
    ring: "ring-sky-500/20",
    bg: "bg-sky-500/5",
  },
  health: {
    gradient: "from-rose-400 to-red-500",
    glow: "group-hover:shadow-rose-500/25",
    ring: "ring-rose-500/20",
    bg: "bg-rose-500/5",
  },
  creativity: {
    gradient: "from-pink-400 to-fuchsia-600",
    glow: "group-hover:shadow-pink-500/25",
    ring: "ring-pink-500/20",
    bg: "bg-pink-500/5",
  },
  "emotional-intelligence": {
    gradient: "from-violet-400 to-purple-600",
    glow: "group-hover:shadow-violet-500/25",
    ring: "ring-violet-500/20",
    bg: "bg-violet-500/5",
  },
};

const FEATURE_LINKS = [
  {
    href: "/dashboard/daily-challenge",
    label: "Daily Challenge",
    description: "Play 3 games, get your brain age",
    icon: Zap,
    gradient: "from-primary to-violet-600",
    glow: "group-hover:shadow-primary/25",
  },
  {
    href: "/dashboard/games",
    label: "Brain Games",
    description: "5 games, 10 levels each",
    icon: Gamepad2,
    gradient: "from-emerald-500 to-teal-600",
    glow: "group-hover:shadow-emerald-500/25",
  },
  {
    href: "/dashboard/shop",
    label: "Coin Shop",
    description: "Spend coins on power-ups",
    icon: ShoppingCart,
    gradient: "from-amber-500 to-orange-600",
    glow: "group-hover:shadow-amber-500/25",
  },
];

export function QuickActions() {
  const { t } = useI18n();

  const CATEGORY_SLOGANS: Record<string, string> = {
    memory: t.cat_memory_desc,
    focus: t.cat_focus_desc,
    thinking: t.cat_thinking_desc,
    learning: t.cat_learning_desc,
    health: t.cat_health_desc,
    creativity: t.cat_creativity_desc,
    "emotional-intelligence": t.cat_ei_desc,
  };

  const CATEGORY_LABELS: Record<string, string> = {
    memory: t.cat_memory,
    focus: t.cat_focus,
    thinking: t.cat_thinking,
    learning: t.cat_learning,
    health: t.cat_health,
    creativity: t.cat_creativity,
    "emotional-intelligence": t.cat_ei,
  };

  return (
    <div className="space-y-5">
      {/* Feature quick links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FEATURE_LINKS.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-transparent hover:shadow-xl min-h-[44px] touch-manipulation active:scale-[0.97] ${feature.glow}`}
          >
            <div className={`mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${feature.gradient}`}>
              <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <p className="text-sm font-semibold">{feature.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{feature.description}</p>
            <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>

      {/* Category training links */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{t.dashboard_brain_training}</h2>
        <Link
          href="/dashboard/library"
          className="flex items-center gap-1 rounded-lg py-2 px-2 -mr-2 text-xs text-muted-foreground hover:text-foreground min-h-[44px]"
        >
          {t.dashboard_view_all} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.slug];
          const theme = CATEGORY_THEMES[cat.slug];
          if (!Icon || !theme) return null;
          return (
            <Link
              key={cat.id}
              href={`/dashboard/library?category=${cat.id}`}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-transparent hover:shadow-xl hover:-translate-y-0.5 min-h-[44px] touch-manipulation active:scale-[0.97] ${theme.glow}`}
            >
              {/* Icon with decorative ring */}
              <div className="relative mb-3">
                <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${theme.gradient} overflow-hidden`}>
                  {(() => { const Illust = CATEGORY_ILLUSTRATIONS[cat.slug]; return Illust ? <Illust className="w-7 h-7 sm:w-9 sm:h-9" /> : <Icon className="h-5 w-5" />; })()}
                </div>
                {/* Decorative orbit ring */}
                <div className={`absolute -inset-1 rounded-xl ring-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${theme.ring}`} />
              </div>

              <p className="text-sm font-semibold">{CATEGORY_LABELS[cat.slug]}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {CATEGORY_SLOGANS[cat.slug]}
              </p>
              <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
