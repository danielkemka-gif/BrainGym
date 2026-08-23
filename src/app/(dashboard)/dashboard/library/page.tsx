"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FilterBar } from "@/components/library/filter-bar";
import { ActivityCard } from "@/components/library/activity-card";
import { CATEGORIES } from "@/lib/constants";
import { EmptyState } from "@/components/shared";
import { Search, Sparkles, Target, Zap, Lock, Unlock, Trophy, ShieldCheck, ChevronRight } from "lucide-react";
import { getCategoryLevelProgress, ACTIVITY_LEVELS } from "@/lib/activity-levels";
import Link from "next/link";

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

export default function LibraryPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [userCategoryPoints, setUserCategoryPoints] = useState<Record<string, number>>({});
  const [userCompleted, setUserCompleted] = useState<Record<string, number>>({});

  // Honor ?category= deep links (e.g. from dashboard category cards)
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("category");
      if (q) setCategory(q);
    } catch {
      // ignore malformed URLs
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Fetch activities
    supabase
      .from("activities")
      .select("id, title, description, difficulty, estimated_time, xp, coins, category_id")
      .then(({ data }) => {
        if (data) setActivities(data as Activity[]);
        setLoading(false);
      });

    // Fetch user's completed activity logs and compute category points
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const { data: logs } = await supabase
        .from("activity_logs")
        .select("activity_id, xp_earned, activities(category_id)")
        .eq("user_id", user.id);

      if (logs) {
        const counts: Record<string, number> = {};
        const points: Record<string, number> = {};

        logs.forEach((log: any) => {
          const catId = log.activities?.category_id;
          if (catId) {
            counts[catId] = (counts[catId] || 0) + 1;
            points[catId] = (points[catId] || 0) + (log.xp_earned || 40);
          }
        });

        setUserCompleted(counts);
        setUserCategoryPoints(points);
      }
    });
  }, []);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === category);
  const activeCategoryPoints = category ? userCategoryPoints[category] || 0 : 0;
  const levelProgress = getCategoryLevelProgress(activeCategoryPoints);

  const filtered = activities.filter((a) => {
    const matchesSearch = search
      ? a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory = category ? a.category_id === category : true;
    const matchesDifficulty = difficulty ? a.difficulty === difficulty : true;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Group by category for featured view
  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: activities.filter((a) => a.category_id === cat.id).length,
    completed: userCompleted[cat.id] || 0,
    points: userCategoryPoints[cat.id] || 0,
  }));

  const totalCompleted = Object.values(userCompleted).reduce((s, n) => s + n, 0);

  return (
    <div className="mx-auto w-full max-w-full space-y-5 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-purple-500/10 p-5 sm:p-7 border border-primary/20 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Gamified Progression System
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
              Activity Library &amp; Level Gating
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Level 1 (Novice) is unlocked. Score points by training to unlock Level 2 (Practitioner) and Level 3 (Master)!
            </p>
          </div>

          <Link
            href="/dashboard/workout"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[42px]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Train to Unlock Next Level</span>
          </Link>
        </div>

        {/* 4 Level Roadmap Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          {ACTIVITY_LEVELS.map((lvl) => (
            <div
              key={lvl.level}
              className="rounded-2xl bg-background/80 border border-border/80 p-2.5 space-y-0.5 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">
                  {lvl.badge} Level {lvl.level}
                </span>
                <span className="text-[10px] font-extrabold text-primary">
                  {lvl.minPoints === 0 ? "Unlocked" : `${lvl.minPoints} pts`}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{lvl.title.split("(")[0]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Category Level Progress Bar (when a category is selected) */}
      {category && activeCategoryObj && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-4 sm:p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{CATEGORY_EMOJIS[activeCategoryObj.slug] || "🧠"}</span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-foreground">
                  {activeCategoryObj.label} Level Progress
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {levelProgress.badge} Currently at <strong className="text-foreground">{levelProgress.levelTitle}</strong> ({activeCategoryPoints} points earned)
                </p>
              </div>
            </div>

            {!levelProgress.isMaxLevel ? (
              <span className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400">
                🔒 {levelProgress.pointsNeeded} pts until Level {levelProgress.nextLevel}
              </span>
            ) : (
              <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                👑 Max Level Unlocked!
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-violet-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground font-bold">
              <span>Level {levelProgress.currentLevel} ({activeCategoryPoints} pts)</span>
              <span>
                {levelProgress.isMaxLevel ? "Grandmaster" : `Level ${levelProgress.nextLevel} (${levelProgress.nextLevelPoints} pts)`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category overview (when no category active) */}
      {!category && !search && !difficulty && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categoriesWithCounts.map((cat) => {
            const prog = getCategoryLevelProgress(cat.points);
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 sm:p-4 text-left transition-all hover:border-transparent hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl transition-transform group-hover:scale-110 ${CATEGORY_GRADIENTS[cat.slug]}`}>
                  {CATEGORY_EMOJIS[cat.slug]}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-foreground">{cat.label}</p>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Lvl {prog.currentLevel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{cat.points} pts earned</p>
                <div className="mt-2.5 space-y-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${prog.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{prog.pointsNeeded > 0 ? `${prog.pointsNeeded} pts to Lvl ${prog.nextLevel}` : "Max Level"}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        totalResults={filtered.length}
      />

      {/* Activity grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No activities found"
          description="Try adjusting your search or filters"
          action={
            <button
              onClick={() => { setSearch(""); setCategory(""); setDifficulty(""); }}
              className="mt-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <ActivityCard
              key={a.id}
              activity={a}
              index={i}
              userCategoryPoints={userCategoryPoints[a.category_id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
