"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { Clock, Zap, Coins } from "lucide-react";

const CATEGORY_GRADIENTS: Record<string, string> = {
  memory: "from-indigo-500 to-violet-600",
  focus: "from-amber-400 to-orange-500",
  thinking: "from-emerald-400 to-teal-600",
  learning: "from-sky-400 to-blue-600",
  health: "from-rose-400 to-red-500",
  creativity: "from-pink-400 to-fuchsia-600",
  "emotional-intelligence": "from-violet-400 to-purple-600",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  memory: "🧠",
  focus: "🎯",
  thinking: "💡",
  learning: "📚",
  health: "❤️",
  creativity: "🎨",
  "emotional-intelligence": "🤝",
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
  const emoji = CATEGORY_EMOJIS[category?.slug || ""] || "🧠";

  return (
    <Link
      href={`/dashboard/library/${activity.id}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-transparent hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient header */}
      <div className={`relative h-24 bg-gradient-to-br ${gradient} p-4`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex items-start justify-between">
          <span className="text-3xl drop-shadow-lg">{emoji}</span>
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
