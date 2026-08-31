"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Trophy,
  Plus,
  ArrowRight,
  Flame,
  Search,
  Sparkles,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  KeyRound,
  Filter,
  ArrowLeft,
  Share2,
} from "lucide-react";
import {
  fetchUserGroupChallenges,
  fetchDiscoverGroupChallenges,
  fetchGroupChallengeByCode,
  GroupChallenge,
  ChallengeCategory,
} from "@/lib/group-challenges";

const DISCOVER_CATEGORIES: (ChallengeCategory | "All")[] = [
  "All",
  "Popular",
  "For Entrepreneurs",
  "For Students",
  "For Professionals",
  "Focus",
  "Memory",
  "Faith & Community",
  "Corporate / Teams",
];

export default function GroupChallengesHomePage() {
  const router = useRouter();

  // Tab State: 'my_challenges' | 'discover'
  const [activeTab, setActiveTab] = useState<"my_challenges" | "discover">("my_challenges");

  // Sub-filter for My Challenges: 'active' | 'upcoming' | 'completed' | 'created'
  const [myFilter, setMyFilter] = useState<"active" | "upcoming" | "completed" | "created">("active");

  // Filter for Discover
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | "All">("All");

  // Data States
  const [myChallenges, setMyChallenges] = useState<{
    active: GroupChallenge[];
    upcoming: GroupChallenge[];
    completed: GroupChallenge[];
    created: GroupChallenge[];
  }>({ active: [], upcoming: [], completed: [], created: [] });

  const [discoverList, setDiscoverList] = useState<GroupChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Join by Code Modal State
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSearching, setCodeSearching] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const userChallenges = await fetchUserGroupChallenges();
    setMyChallenges(userChallenges);

    const publicChallenges = await fetchDiscoverGroupChallenges(selectedCategory);
    setDiscoverList(publicChallenges);
    setLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;

    setCodeSearching(true);
    setCodeError("");
    const challenge = await fetchGroupChallengeByCode(inviteCodeInput);
    setCodeSearching(false);

    if (challenge) {
      setCodeModalOpen(false);
      router.push(`/dashboard/group-challenges/join/${challenge.code}`);
    } else {
      setCodeError("Challenge not found. Please verify the code and try again.");
    }
  };

  const currentMyList = myChallenges[myFilter] || [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-3 sm:px-4 lg:px-6 py-4 pb-24 overflow-x-hidden touch-manipulation">
      {/* ─── HEADER & PRIMARY ACTION ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-bold text-primary">Group Challenges</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            <span>Group Challenges</span>
            <span className="text-xl">🏆</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Challenge yourself, your friends, WhatsApp groups, and teams in structured cognitive training.
          </p>
        </div>

        {/* Action Buttons: Create + Join by Code */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCodeModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card hover:bg-muted py-3 px-3.5 text-xs font-bold text-foreground transition active:scale-95 min-h-[44px]"
          >
            <KeyRound className="h-4 w-4 text-primary" />
            <span>Join by Code</span>
          </button>

          <Link
            href="/dashboard/group-challenges/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-white py-3 px-5 text-xs sm:text-sm font-black shadow-lg shadow-primary/25 transition active:scale-95 min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            <span>CREATE A CHALLENGE</span>
          </Link>
        </div>
      </div>

      {/* ─── TOP-LEVEL TABS (MY CHALLENGES VS DISCOVER) ──────────────────────── */}
      <div className="flex items-center gap-2 rounded-2xl bg-muted/60 p-1 border border-border">
        <button
          onClick={() => setActiveTab("my_challenges")}
          className={`flex-1 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeTab === "my_challenges"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="h-4 w-4 text-primary" />
          <span>My Challenges ({myChallenges.active.length + myChallenges.created.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("discover")}
          className={`flex-1 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeTab === "discover"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search className="h-4 w-4 text-emerald-500" />
          <span>Discover Public Challenges</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: MY CHALLENGES                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "my_challenges" && (
        <div className="space-y-4 animate-in fade-in">
          {/* Sub-Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(
              [
                { key: "active", label: `Active (${myChallenges.active.length})` },
                { key: "upcoming", label: `Upcoming (${myChallenges.upcoming.length})` },
                { key: "completed", label: `Completed (${myChallenges.completed.length})` },
                { key: "created", label: `Created by Me (${myChallenges.created.length})` },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setMyFilter(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition border ${
                  myFilter === f.key
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List of Challenges */}
          {currentMyList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMyList.map((ch) => (
                <div
                  key={ch.id}
                  className="rounded-3xl border-2 border-primary/30 bg-card p-5 space-y-4 shadow-md hover:border-primary transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl p-2 rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
                          {ch.coverEmoji}
                        </span>
                        <div>
                          <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                            DAY {ch.currentDay} OF {ch.durationDays} · {ch.type}
                          </span>
                          <h3 className="text-base font-black text-foreground leading-snug">
                            {ch.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {ch.description}
                    </p>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="rounded-xl bg-background border border-border p-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">
                          HOST
                        </span>
                        <span className="text-xs font-black text-foreground truncate block">
                          {ch.hostName.split(" ")[0]}
                        </span>
                      </div>

                      <div className="rounded-xl bg-background border border-border p-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">
                          MEMBERS
                        </span>
                        <span className="text-xs font-black text-foreground">
                          {ch.participantsCount}
                        </span>
                      </div>

                      <div className="rounded-xl bg-background border border-border p-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">
                          STREAK
                        </span>
                        <span className="text-xs font-black text-amber-500 flex items-center justify-center gap-0.5">
                          <Flame className="h-3 w-3 fill-amber-500" />
                          7d
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-muted-foreground">Your Progress</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">
                          {ch.overallCompletionRate}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500"
                          style={{ width: `${ch.overallCompletionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="pt-2">
                    <Link
                      href={`/dashboard/group-challenges/${ch.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white py-2.5 px-4 text-xs font-black shadow-md transition active:scale-95 min-h-[42px]"
                    >
                      <span>Open Challenge Dashboard</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center space-y-3">
              <span className="text-3xl block">🏆</span>
              <h3 className="text-base font-black text-foreground">No challenges found in this tab</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Ready to challenge your friends, colleagues, or fellowship? Create a custom challenge in 2 minutes!
              </p>
              <Link
                href="/dashboard/group-challenges/create"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-white py-2.5 px-5 text-xs font-black shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Create a Challenge</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: DISCOVER PUBLIC CHALLENGES                                      */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "discover" && (
        <div className="space-y-4 animate-in fade-in">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {DISCOVER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Discover Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discoverList.map((ch) => (
              <div
                key={ch.id}
                className="rounded-3xl border-2 border-border bg-card p-5 space-y-4 shadow-md hover:border-emerald-500/50 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                        {ch.coverEmoji}
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                          {ch.category} · {ch.durationDays} DAYS
                        </span>
                        <h3 className="text-base font-black text-foreground leading-snug">
                          {ch.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground border-t border-border pt-2.5">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      {ch.participantsCount} participants
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {ch.overallCompletionRate}% avg completion
                    </span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/group-challenges/join/${ch.code}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 text-xs font-black shadow-md transition active:scale-95 min-h-[42px]"
                >
                  <span>Join Challenge</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── JOIN BY CODE MODAL ──────────────────────────────────────────────── */}
      {codeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl border-2 border-primary/40 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-primary">
                ENTER INVITE CODE
              </span>
              <button
                onClick={() => setCodeModalOpen(false)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">
                Join a Private Challenge
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter the challenge code shared by your WhatsApp admin, team lead, or teacher.
              </p>
            </div>

            <form onSubmit={handleJoinByCode} className="space-y-3">
              <input
                type="text"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                placeholder="e.g. BG-ENTR-30"
                className="w-full uppercase font-mono tracking-wider rounded-xl border border-border bg-background px-4 py-3 text-sm font-black text-foreground focus:border-primary focus:outline-none"
                autoFocus
              />

              {codeError && (
                <p className="text-xs font-bold text-rose-500">{codeError}</p>
              )}

              <button
                type="submit"
                disabled={codeSearching || !inviteCodeInput.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-3 px-4 text-xs font-black shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition"
              >
                <span>{codeSearching ? "Searching..." : "Find Challenge ➔"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
