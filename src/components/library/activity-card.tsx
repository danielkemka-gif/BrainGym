"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { Clock, Zap, Coins } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/icons";
import { CATEGORY_ILLUSTRATIONS } from "@/components/brain-illustrations";
import { WhyThisMatters } from "@/components/ui/why-this-matters";

const CATEGORY_GRADIENTS: Record<string, string> = {
  memory: "from-indigo-500 to-violet-600",
  focus: "from-amber-400 to-orange-500",
  thinking: "from-emerald-400 to-teal-600",
  learning: "from-sky-400 to-blue-600",
  health: "from-rose-400 to-red-500",
  creativity: "from-pink-400 to-fuchsia-600",
  "emotional-intelligence": "from-violet-400 to-purple-600",
};

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  beginner: { label: "Beginner", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  intermediate: { label: "Intermediate", color: "text-amber-400", bg: "bg-amber-500/10" },
  advanced: { label: "Advanced", color: "text-rose-400", bg: "bg-rose-500/10" },
};

interface Activity {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  estimated_time: number;
  xp: number;
  coins: number;
  category_id: string;
}

export function ActivityCard({ activity, index = 0 }: { activity: Activity; index?: number }) {
  const category = CATEGORIES.find((c) => c.id === activity.category_id);
  const diff = DIFFICULTY_CONFIG[activity.difficulty] || DIFFICULTY_CONFIG.beginner;
  const gradient = CATEGORY_GRADIENTS[category?.slug || ""] || "from-gray-500 to-gray-600";
  const Icon = CATEGORY_ICONS[category?.slug || ""] || CATEGORY_ICONS.memory;

  return (
    <Link
      href={`/dashboard/library/${activity.id}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-transparent hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient header */}
      <div className={`relative h-24 bg-gradient-to-br ${gradient} p-4`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
        <div className="relative flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white drop-shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
            {(() => { const Illust = CATEGORY_ILLUSTRATIONS[category?.slug || ""]; return Illust ? <Illust className="h-7 w-7" /> : <Icon className="h-4.5 w-4.5" />; })()}
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${diff.bg} ${diff.color}`}>
            {diff.label}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="truncate text-sm font-bold text-white drop-shadow-md">{activity.title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {activity.description && (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
            {activity.description}
          </p>
        )}
        <div className="mb-3">
          <WhyThisMatters categorySlug={category?.slug || ""} />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {activity.estimated_time}s
          </div>
          <div className="flex items-center gap-1 text-xs text-violet-400">
            <Zap className="h-3 w-3" />
            +{activity.xp}
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Coins className="h-3 w-3" />
            +{activity.coins}
          </div>
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </Link>
  );
}
