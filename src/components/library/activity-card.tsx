"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { Clock, Zap, Coins, Lock, Sparkles, ArrowRight, ShieldAlert, X } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/icons";
import { CATEGORY_ILLUSTRATIONS } from "@/components/brain-illustrations";
import { WhyThisMatters } from "@/components/ui/why-this-matters";
import { isActivityUnlocked } from "@/lib/activity-levels";

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
  beginner: { label: "Level 1 · Novice", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  intermediate: { label: "Level 2 · Practitioner", color: "text-amber-400", bg: "bg-amber-500/10" },
  advanced: { label: "Level 3 · Master", color: "text-rose-400", bg: "bg-rose-500/10" },
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

interface ActivityCardProps {
  activity: Activity;
  index?: number;
  userCategoryPoints?: number;
}

export function ActivityCard({
  activity,
  index = 0,
  userCategoryPoints = 0,
}: ActivityCardProps) {
  const [showLockedModal, setShowLockedModal] = useState(false);
  const category = CATEGORIES.find((c) => c.id === activity.category_id);
  const diff = DIFFICULTY_CONFIG[activity.difficulty] || DIFFICULTY_CONFIG.beginner;
  const gradient = CATEGORY_GRADIENTS[category?.slug || ""] || "from-gray-500 to-gray-600";
  const Icon = CATEGORY_ICONS[category?.slug || ""] || CATEGORY_ICONS.memory;

  const lockStatus = isActivityUnlocked(activity.difficulty, userCategoryPoints);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!lockStatus.unlocked) {
      e.preventDefault();
      setShowLockedModal(true);
    }
  };

  return (
    <>
      <Link
        href={lockStatus.unlocked ? `/dashboard/library/${activity.id}` : "#"}
        onClick={handleCardClick}
        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          lockStatus.unlocked
            ? "border-border bg-card hover:border-transparent hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            : "border-border/60 bg-muted/20 opacity-90 cursor-pointer"
        }`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Gradient header */}
        <div className={`relative h-24 bg-gradient-to-br ${gradient} p-4 ${!lockStatus.unlocked ? "saturate-50" : ""}`}>
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white drop-shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
              {(() => {
                const Illust = CATEGORY_ILLUSTRATIONS[category?.slug || ""];
                return Illust ? <Illust className="h-7 w-7" /> : <Icon className="h-4.5 w-4.5" />;
              })()}
            </div>

            {/* Level / Lock Badge */}
            {lockStatus.unlocked ? (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${diff.bg} ${diff.color} backdrop-blur-sm`}>
                {diff.label}
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-black/50 border border-white/20 px-2.5 py-0.5 text-[10px] font-black text-amber-300 backdrop-blur-md">
                <Lock className="h-3 w-3" />
                <span>Locked · Level {lockStatus.requiredLevel}</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="truncate text-sm font-bold text-white drop-shadow-md">{activity.title}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {activity.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {activity.description}
            </p>
          )}

          {/* Level Unlock Requirement Bar if Locked */}
          {!lockStatus.unlocked ? (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] text-amber-700 dark:text-amber-300 font-medium flex items-center justify-between">
              <span>Earn {lockStatus.pointsNeeded} more pts to unlock</span>
              <Lock className="h-3.5 w-3.5 shrink-0" />
            </div>
          ) : (
            <WhyThisMatters categorySlug={category?.slug || ""} />
          )}

          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {activity.estimated_time}s
              </div>
              <div className="flex items-center gap-1 text-violet-500 font-bold">
                <Zap className="h-3 w-3" />
                +{activity.xp} XP
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Coins className="h-3 w-3" />
                +{activity.coins}
              </div>
            </div>

            {!lockStatus.unlocked && (
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                {lockStatus.levelTitle}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Locked Activity Level Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-card border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
              <Lock className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Level Locked Challenge
              </span>
              <h3 className="text-lg font-black text-foreground">{activity.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This activity unlocks at <strong className="text-foreground">{lockStatus.levelTitle}</strong>. You need <strong className="text-foreground">{lockStatus.pointsNeeded} more points</strong> in this category to unlock it.
              </p>
            </div>

            {/* Progress bar in category */}
            <div className="rounded-2xl bg-muted/60 border border-border p-3 text-left space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">Category Progress:</span>
                <span className="text-foreground">{userCategoryPoints} / {lockStatus.requiredPoints} pts</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((userCategoryPoints / lockStatus.requiredPoints) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/dashboard/workout"
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-3 text-xs sm:text-sm font-black text-primary-foreground shadow-md hover:brightness-110 active:scale-95 transition min-h-[44px]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Train Daily Workout to Earn Points →</span>
              </Link>
              <button
                onClick={() => setShowLockedModal(false)}
                className="flex items-center justify-center rounded-2xl border border-border px-4 py-2.5 text-xs font-bold hover:bg-muted active:scale-95 transition min-h-[38px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
