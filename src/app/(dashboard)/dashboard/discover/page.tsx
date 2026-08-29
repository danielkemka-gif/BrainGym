"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BRAIN_UNIVERSE_DROPS,
  DailyBrainDrop,
  SavedBrainCard,
  getSavedBrainCards,
  isCardSaved,
  saveBrainCard,
  removeSavedCard,
} from "@/lib/brain-universe";
import {
  Compass,
  Bookmark,
  BookmarkCheck,
  Brain,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "myths" | "cards">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [savedCards, setSavedCards] = useState<SavedBrainCard[]>([]);
  const [mythAnswers, setMythAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSavedCards(getSavedBrainCards());
  }, []);

  const handleToggleCard = (drop: DailyBrainDrop) => {
    if (isCardSaved(drop.id)) {
      const updated = removeSavedCard(drop.id);
      setSavedCards(updated);
    } else {
      const updated = saveBrainCard(drop);
      setSavedCards(updated);
    }
  };

  const categories = ["All", "Focus", "Memory", "Habits", "Brain Myths", "Sleep and the Brain", "Exercise and the Brain", "Decision Making", "Stress", "Digital Distraction"];

  const filteredDrops = BRAIN_UNIVERSE_DROPS.filter((d) => {
    const matchesSearch =
      searchQuery === "" ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.discovery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || d.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const mythDrops = BRAIN_UNIVERSE_DROPS.filter((d) => d.type === "myth" || d.mythCheck);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-3 sm:px-4 lg:px-6 py-4 pb-24 overflow-x-hidden touch-manipulation">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Knowledge Universe
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-0.5">
            Discover Your Brain
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore daily brain discoveries, myth busters, and your personal Brain Card collection.
          </p>
        </div>

        {/* Ask Your Brain CTA */}
        <Link
          href="/dashboard/coach"
          className="inline-flex items-center gap-1.5 rounded-2xl bg-violet-600 text-white px-4 py-2.5 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[42px] shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask Your Brain AI</span>
        </Link>
      </div>

      {/* Tabs Switcher: Feed | Myths | Saved Cards */}
      <div className="flex items-center gap-1 rounded-2xl bg-muted p-1 border border-border text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab("feed")}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === "feed"
              ? "bg-card text-foreground font-black shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🧠 Brain Feed ({BRAIN_UNIVERSE_DROPS.length})
        </button>
        <button
          onClick={() => setActiveTab("myths")}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === "myths"
              ? "bg-card text-foreground font-black shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🔍 Myth Busters
        </button>
        <button
          onClick={() => setActiveTab("cards")}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === "cards"
              ? "bg-card text-foreground font-black shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🗂️ My Brain Cards ({savedCards.length})
        </button>
      </div>

      {/* Search & Category Filter */}
      {activeTab === "feed" && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search concepts (e.g. attention residue, BDNF, retrieval, dopamine)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap border transition ${
                  selectedCategory === cat
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 1: BRAIN FEED ─────────────────────────────────────────────── */}
      {activeTab === "feed" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDrops.map((drop) => {
            const isSaved = savedCards.some((c) => c.dropId === drop.id || c.cardId === drop.cardId);
            return (
              <div
                key={drop.id}
                className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-[10px] font-extrabold text-primary">
                      {drop.category}
                    </span>
                    <button
                      onClick={() => handleToggleCard(drop)}
                      className={`rounded-xl border p-1.5 transition ${
                        isSaved
                          ? "border-amber-500 bg-amber-500/10 text-amber-500"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <h3 className="text-base font-black text-foreground leading-snug">
                    {drop.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {drop.discovery}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="rounded-xl bg-background/80 p-2.5 text-[11px] text-foreground font-semibold flex items-center justify-between">
                    <span className="truncate">👉 {drop.useItToday.action}</span>
                    <span className="text-[10px] text-primary font-black shrink-0 ml-1">
                      +{drop.useItToday.xpReward} XP
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-mono">{drop.cardId}</span>
                    <Link
                      href={`/dashboard/workout?domain=${drop.relatedWorkoutDomain.toLowerCase()}`}
                      className="text-primary font-bold hover:underline"
                    >
                      Train Domain →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB 2: MYTH BUSTERS ────────────────────────────────────────────── */}
      {activeTab === "myths" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-foreground font-medium">
            Test your intuition against scientific reality. Answer each myth to bust misconceptions!
          </div>

          {mythDrops.map((drop) => {
            const check = drop.mythCheck || {
              claim: drop.title,
              isTrue: false,
              revealExplanation: drop.discovery,
            };
            const answered = mythAnswers[drop.id] !== undefined;

            return (
              <div
                key={drop.id}
                className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 text-[10px] font-black text-amber-600 dark:text-amber-400">
                    BRAIN MYTH CHECK
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">{drop.cardId}</span>
                </div>

                <h3 className="text-base font-black text-foreground">
                  &ldquo;{check.claim}&rdquo;
                </h3>

                {!answered ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setMythAnswers((prev) => ({ ...prev, [drop.id]: true }))}
                      className="flex-1 rounded-xl border border-border bg-background hover:bg-accent py-2.5 text-xs font-black text-foreground transition active:scale-95"
                    >
                      TRUE
                    </button>
                    <button
                      onClick={() => setMythAnswers((prev) => ({ ...prev, [drop.id]: false }))}
                      className="flex-1 rounded-xl border border-border bg-background hover:bg-accent py-2.5 text-xs font-black text-foreground transition active:scale-95"
                    >
                      FALSE
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-background/90 border border-border p-4 space-y-1.5 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{check.isTrue ? "Correct! This is True." : "Busted! This is a Myth."}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {check.revealExplanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB 3: MY BRAIN CARDS COLLECTION ───────────────────────────────── */}
      {activeTab === "cards" && (
        <div className="space-y-4">
          {savedCards.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-10 text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Bookmark className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black text-foreground">No Saved Brain Cards Yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Bookmark discoveries in the Brain Feed or on your Daily Brain Drop to build your personal knowledge library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedCards.map((card) => (
                <div
                  key={card.cardId}
                  className="rounded-3xl border-2 border-primary/30 bg-card p-5 space-y-3 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-black text-primary">
                        {card.category}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">{card.cardId}</span>
                    </div>
                    <h4 className="text-sm font-black text-foreground">{card.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.discovery}</p>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-foreground truncate">👉 {card.action}</span>
                    <button
                      onClick={() => {
                        const updated = removeSavedCard(card.cardId);
                        setSavedCards(updated);
                      }}
                      className="text-[10px] font-bold text-muted-foreground hover:text-rose-500 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
