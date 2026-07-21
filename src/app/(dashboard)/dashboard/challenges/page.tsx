"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, DIFFICULTIES } from "@/lib/constants";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  duration_days: number;
  goal_type: string;
  goal_amount: number;
  start_date: string;
  end_date: string;
  created_by: string;
  is_public: boolean;
  max_participants: number;
  created_at: string;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});
  const [userChallenges, setUserChallenges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    duration_days: 7,
    goal_type: "xp" as string,
    goal_amount: 500,
  });

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setError("You must be signed in to view challenges.");
        setLoading(false);
        return;
      }
      setUserId(user.id);

      Promise.all([
        supabase
          .from("challenges")
          .select("*")
          .or(`is_public.eq.true,created_by.eq.${user.id}`)
          .gte("end_date", new Date().toISOString().split("T")[0])
          .order("start_date", { ascending: true }),
        supabase
          .from("challenge_participants")
          .select("challenge_id")
          .eq("user_id", user.id),
      ]).then(([challengesRes, userChallengesRes]) => {
        if (challengesRes.error) {
          setError(challengesRes.error.message);
          setLoading(false);
          return;
        }

        const data = challengesRes.data as Challenge[];
        const challengeIds = data.map((c) => c.id);
        setChallenges(data);
        setUserChallenges(new Set((userChallengesRes.data ?? []).map((p) => p.challenge_id)));

        // Count participants per challenge
        if (challengeIds.length > 0) {
          supabase
            .from("challenge_participants")
            .select("challenge_id")
            .in("challenge_id", challengeIds)
            .then(({ data: participants }) => {
              const counts: Record<string, number> = {};
              for (const p of participants ?? []) {
                counts[p.challenge_id] = (counts[p.challenge_id] ?? 0) + 1;
              }
              setParticipantCounts(counts);
            });
        }
        setLoading(false);
      }).catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load challenges.");
        setLoading(false);
      });
    });
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setCreateError("Title is required.");
      return;
    }
    if (!userId) {
      setCreateError("You must be signed in to create a challenge.");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const supabase = createClient();
      const startDate = new Date().toISOString().split("T")[0];
      const endDate = new Date(Date.now() + form.duration_days * 86400000).toISOString().split("T")[0];

      const { data, error: insertError } = await supabase
        .from("challenges")
        .insert({
          title: form.title.trim(),
          description: form.description.trim() || null,
          category: form.category || null,
          difficulty: form.difficulty || null,
          duration_days: form.duration_days,
          goal_type: form.goal_type,
          goal_amount: form.goal_amount,
          start_date: startDate,
          end_date: endDate,
          created_by: userId,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Auto-join the challenge
      const { error: joinError } = await supabase.from("challenge_participants").insert({
        challenge_id: data.id,
        user_id: userId,
      });
      if (joinError) throw joinError;

      setChallenges((prev) => [data as Challenge, ...prev]);
      setUserChallenges((prev) => new Set(prev).add(data.id));
      setShowCreate(false);
      setCreateError(null);
      setForm({ title: "", description: "", category: "", difficulty: "", duration_days: 7, goal_type: "xp", goal_amount: 500 });
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create challenge.");
    } finally {
      setCreating(false);
    }
  }

  const filtered = challenges.filter((c) =>
    categoryFilter ? c.category === categoryFilter : true
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community Challenges</h1>
          <p className="text-sm text-muted-foreground">
            Join group challenges and train together
          </p>
        </div>
        <button
          onClick={() => setShowCreate((p) => !p)}
          className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create Challenge
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-semibold">New Challenge</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Any</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="capitalize">{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Duration (days)</label>
              <input
                type="number"
                min={1}
                max={90}
                value={form.duration_days}
                onChange={(e) => setForm((f) => ({ ...f, duration_days: Number(e.target.value) }))}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Goal type</label>
              <select
                value={form.goal_type}
                onChange={(e) => setForm((f) => ({ ...f, goal_type: e.target.value }))}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="xp">Total XP</option>
                <option value="workouts">Workouts</option>
                <option value="streak">Streak days</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Goal amount</label>
              <input
                type="number"
                min={1}
                value={form.goal_amount}
                onChange={(e) => setForm((f) => ({ ...f, goal_amount: Number(e.target.value) }))}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          {createError && (
            <p className="text-sm text-destructive">{createError}</p>
          )}
          <button
            type="submit"
            disabled={creating}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create & Join"}
          </button>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-sm text-primary hover:underline">
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No active challenges</p>
          <p className="text-sm text-muted-foreground">
            Create one to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const cat = CATEGORIES.find((x) => x.id === c.category);
            const joined = userChallenges.has(c.id);
            const pCount = participantCounts[c.id] ?? 0;
            return (
              <Link
                key={c.id}
                href={`/dashboard/challenges/${c.id}`}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-muted-foreground/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {cat && (
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {cat?.label ?? "General"}
                    </span>
                  </div>
                  {joined && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Joined
                    </span>
                  )}
                </div>

                <h3 className="mb-1 font-semibold">{c.title}</h3>
                {c.description && (
                  <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                    {c.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.duration_days} days</span>
                  <span>{pCount} participant{pCount !== 1 ? "s" : ""}</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-muted px-2 py-0.5 capitalize">
                    {c.goal_type}
                  </span>
                  <span className="text-muted-foreground">
                    {c.goal_amount.toLocaleString()} goal
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
