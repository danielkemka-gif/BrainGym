"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FilterBar } from "@/components/library/filter-bar";
import { ActivityCard } from "@/components/library/activity-card";
import { CATEGORIES } from "@/lib/constants";
import { Sparkles, Target, Zap } from "lucide-react";

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
  const [userCompleted, setUserCompleted] = useState<Record<string, number>>({});

  useEffect(() => {
    const supabase = createClient();

    // Fetch activities (no is_active filter)
    supabase
      .from("activities")
      .select("id, title, description, difficulty, estimated_time, xp, coins, category_id")
      .then(({ data, error }) => {
        if (data) setActivities(data as Activity[]);
        setLoading(false);
      });

    // Fetch user's completed activity counts per category
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("activity_logs")
        .select("activity_id, activities(category_id)")
        .eq("user_id", user.id)
        .then(({ data }) => {
          if (!data) return;
          const counts: Record<string, number> = {};
          data.forEach((log: any) => {
            const catId = log.activities?.category_id;
            if (catId) counts[catId] = (counts[catId] || 0) + 1;
          });
          setUserCompleted(counts);
        });
    });
  }, []);

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
  }));

  const totalCompleted = Object.values(userCompleted).reduce((s, n) => s + n, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-purple-500/10 p-6">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold">Activity Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            177+ brain training exercises across 7 categories
          </p>
          {/* Stats */}
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">{activities.length} exercises</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-1.5">
              <Target className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-medium">{totalCompleted} completed</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-medium">7 categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category overview (when no filter active) */}
      {!category && !search && !difficulty && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categoriesWithCounts.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-transparent hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
            >
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl transition-transform group-hover:scale-110 ${CATEGORY_GRADIENTS[cat.slug]}`}>
                {CATEGORY_EMOJIS[cat.slug]}
              </div>
              <p className="text-sm font-semibold">{cat.label}</p>
              <p className="text-xs text-muted-foreground">{cat.count} exercises</p>
              {cat.completed > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min((cat.completed / cat.count) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">{cat.completed} completed</p>
                </div>
              )}
            </button>
          ))}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-lg font-medium">No activities found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => { setSearch(""); setCategory(""); setDifficulty(""); }}
            className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <ActivityCard key={a.id} activity={a} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
