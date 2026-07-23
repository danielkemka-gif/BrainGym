"use client";

import { CATEGORIES } from "@/lib/constants";
import { Search, X } from "lucide-react";

const CATEGORY_EMOJIS: Record<string, string> = {
  memory: "🧠",
  focus: "🎯",
  thinking: "💡",
  learning: "📚",
  health: "❤️",
  creativity: "🎨",
  "emotional-intelligence": "🤝",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  memory: "from-indigo-500 to-violet-600",
  focus: "from-amber-400 to-orange-500",
  thinking: "from-emerald-400 to-teal-600",
  learning: "from-sky-400 to-blue-600",
  health: "from-rose-400 to-red-500",
  creativity: "from-pink-400 to-fuchsia-600",
  "emotional-intelligence": "from-violet-400 to-purple-600",
};

const DIFFICULTIES = [
  { value: "", label: "All" },
  { value: "beginner", label: "Beginner", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { value: "intermediate", label: "Intermediate", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { value: "advanced", label: "Advanced", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
];

interface FilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: string) => void;
  totalResults: number;
}

export function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  totalResults,
}: FilterBarProps) {
  const hasFilters = search || category || difficulty;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search 177+ brain exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setCategory("")}
          className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
            !category
              ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50 hover:bg-accent"
          }`}
        >
          All 🌟
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(category === cat.id ? "" : cat.id)}
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
              category === cat.id
                ? `border-transparent bg-gradient-to-r ${CATEGORY_GRADIENTS[cat.id]} text-white shadow-md`
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50 hover:bg-accent"
            }`}
          >
            {CATEGORY_EMOJIS[cat.id]} {cat.label}
          </button>
        ))}
      </div>

      {/* Difficulty pills + result count */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                difficulty === d.value
                  ? d.value === ""
                    ? "border-primary bg-primary text-primary-foreground"
                    : d.color + " border"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          {totalResults} {totalResults === 1 ? "activity" : "activities"}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={() => { setSearch(""); setCategory(""); setDifficulty(""); }}
          className="text-xs text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
