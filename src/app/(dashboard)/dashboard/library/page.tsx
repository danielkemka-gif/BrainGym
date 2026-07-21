"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FilterBar } from "@/components/library/filter-bar";
import { ActivityCard } from "@/components/library/activity-card";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  estimated_time: number;
  xp: number;
  category_id: string;
}

export default function LibraryPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let query = supabase.from("activities").select("*").eq("is_active", true);

    if (category) query = query.eq("category_id", category);
    if (difficulty) query = query.eq("difficulty", difficulty);

    query.order("category_id").then(({ data }) => {
      if (data) setActivities(data);
      setLoading(false);
    });
  }, [category, difficulty]);

  const filtered = activities.filter((a) =>
    search
      ? a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Library</h1>
        <p className="text-sm text-muted-foreground">
          Explore all brain training activities
        </p>
      </div>

      <FilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No activities found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      )}
    </div>
  );
}
