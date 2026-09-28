"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, DIFFICULTIES } from "@/lib/constants";
import { FriendDuelSection } from "@/components/challenges/friend-duel-section";
import { LiveBrainDuel } from "@/components/challenges/live-brain-duel";
import { ThirtyDayChallenge } from "@/components/challenges/thirty-day-challenge";
import { BrainArenaHub } from "@/components/challenges/brain-arena-hub";
import { Swords, Users, Handshake, Sparkles, Award, Layers, Plus } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"arena" | "thirty-day" | "duel" | "community" | "friends">("arena");

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
    <div className="mx-auto w-full max-w-5xl space-y-6 px-3 sm:px-4 lg:px-6 py-4 pb-24 overflow-x-hidden touch-manipulation">
      {/* ─── Top Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <span>Challenges &amp; Arena</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
              Training Grounds 🏆
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore 8 cognitive domains, 30-day transformation programs, live 1v1 duels, and group challenges.
          </p>
        </div>

        <Link
          href="/dashboard/group-challenges"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted py-2 px-3.5 text-xs font-bold text-foreground transition active:scale-95 shrink-0"
        >
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>WhatsApp Groups</span>
        </Link>
      </div>

      {/* ─── Tabs Navigation ──────────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("arena")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] touch-manipulation ${
            activeTab === "arena"
              ? "bg-gradient-to-r from-primary to-violet-600 text-white shadow-md shadow-primary/20"
              : "border border-border bg-card hover:bg-muted text-muted-foreground"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Brain Arena</span>
        </button>

        <button
          onClick={() => setActiveTab("thirty-day")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] touch-manipulation ${
            activeTab === "thirty-day"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20"
              : "border border-border bg-card hover:bg-muted text-muted-foreground"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>30-Day Transformation</span>
        </button>

        <button
          onClick={() => setActiveTab("duel")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] touch-manipulation ${
            activeTab === "duel"
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/20"
              : "border border-border bg-card hover:bg-muted text-muted-foreground"
          }`}
        >
          <Swords className="h-4 w-4" />
          <span>Live 1v1 Duels</span>
        </button>

        <button
          onClick={() => setActiveTab("community")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] touch-manipulation ${
            activeTab === "community"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "border border-border bg-card hover:bg-muted text-muted-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Community Challenges</span>
        </button>

        <button
          onClick={() => setActiveTab("friends")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] touch-manipulation ${
            activeTab === "friends"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "border border-border bg-card hover:bg-muted text-muted-foreground"
          }`}
        >
          <Handshake className="h-4 w-4" />
          <span>Friend Accountability</span>
        </button>
      </div>

      {/* ─── TAB CONTENT ──────────────────────────────────────────────────── */}
      {/* Tab: Brain Arena */}
      {activeTab === "arena" && (
        <div className="space-y-6 animate-in fade-in">
          <BrainArenaHub />
        </div>
      )}

      {/* Tab: 30-Day Transformation Challenge */}
      {activeTab === "thirty-day" && (
        <div className="space-y-6 animate-in fade-in">
          <ThirtyDayChallenge />
        </div>
      )}

      {/* Tab: Live 1v1 Brain Duel */}
      {activeTab === "duel" && (
        <div className="space-y-6 animate-in fade-in">
          <LiveBrainDuel />
        </div>
      )}

      {/* Tab: Community Challenges */}
      {activeTab === "community" && (
        <div className="space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-foreground">Community &amp; Custom Challenges</h2>
            <button
              onClick={() => setShowCreate((p) => !p)}
              className="touch-manipulation inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 active:scale-[0.97] min-h-[38px]"
            >
              {showCreate ? "Cancel" : "+ Create Challenge"}
            </button>
          </div>

          {/* Create form */}
          {showCreate && (
            <form onSubmit={handleCreate} className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4 w-full max-w-full overflow-x-hidden shadow-sm">
              <h3 className="font-bold text-sm">New Community Challenge</h3>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Any</option>
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d} className="capitalize">{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-bold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-black text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          )}

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategoryFilter("")}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                categoryFilter === ""
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  categoryFilter === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Challenges Grid */}
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">Loading challenges...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2">
              <p className="text-xs text-muted-foreground">No custom challenges found. Create one above!</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => {
                const cat = CATEGORIES.find((x) => x.id === c.category);
                const joined = userChallenges.has(c.id);
                const pCount = participantCounts[c.id] ?? 0;
                return (
                  <Link
                    key={c.id}
                    href={`/dashboard/challenges/${c.id}`}
                    className="touch-manipulation rounded-2xl border border-border bg-card p-4 space-y-3 transition hover:border-primary/50 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {cat?.label ?? "General"}
                      </span>
                      {joined && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Joined ✓
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-foreground leading-snug">{c.title}</h3>
                    {c.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed text-justify">
                        {c.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                      <span>⏱️ {c.duration_days} days</span>
                      <span>👥 {pCount} participants</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Friend Accountability */}
      {activeTab === "friends" && (
        <div className="space-y-6 animate-in fade-in">
          <FriendDuelSection />
        </div>
      )}
    </div>
  );
}
