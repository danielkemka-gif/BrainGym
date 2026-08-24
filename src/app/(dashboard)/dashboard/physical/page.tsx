"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PHYSICAL_ACTIVITIES_LIBRARY,
  getDailyPhysicalMission,
  getPhysicalActivitiesByCategory,
  searchPhysicalActivities,
  HABIT_STACKS,
  calculatePhysicalBrainScore,
  PhysicalCategory,
} from "@/lib/physical-activities";
import {
  Activity,
  Footprints,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  Coins,
  ArrowRight,
  Flame,
  Layers,
  Compass,
  ArrowLeft,
  Bell,
} from "lucide-react";

const CATEGORIES: { label: string; value: string; icon: string }[] = [
  { label: "All Activities", value: "All", icon: "🌟" },
  { label: "Focus & Attention", value: "Focus & Concentration", icon: "🧘" },
  { label: "Real-World Memory", value: "Memory", icon: "🧠" },
  { label: "Learning & Language", value: "Learning & Language", icon: "📚" },
  { label: "Creativity", value: "Creativity", icon: "💡" },
  { label: "Emotional Fitness", value: "Emotional Intelligence", icon: "❤️" },
  { label: "Decision & Planning", value: "Executive Decisions", icon: "📋" },
  { label: "Movement & Body", value: "Movement & Physical Health", icon: "🏃" },
  { label: "Brain + Hand", value: "Brain + Hand Coordination", icon: "✍️" },
  { label: "Sensory Awareness", value: "Sensory Awareness", icon: "🍵" },
  { label: "Music & Rhythm", value: "Music & Rhythm", icon: "🎧" },
  { label: "Sleep & Recovery", value: "Sleep & Recovery", icon: "🌙" },
  { label: "Nutrition & Water", value: "Nutrition & Hydration", icon: "💧" },
  { label: "Novelty & Change", value: "Novelty & Route Change", icon: "🧭" },
  { label: "Social Brain", value: "Social Brain & Leadership", icon: "🤝" },
];

export function ActivityIllustrationBadge({ type }: { type: string }) {
  const getEmoji = () => {
    switch (type) {
      case "meditation":
        return "🧘‍♂️";
      case "walking":
        return "🚶‍♂️";
      case "reading":
        return "📖";
      case "drawing":
        return "🎨";
      case "listening":
        return "🎧";
      case "speaking":
        return "🗣️";
      case "handwriting":
        return "✍️";
      case "eating":
        return "🍲";
      case "sleeping":
        return "🌙";
      case "nature":
        return "🌲";
      case "planning":
        return "📋";
      case "music":
        return "🎵";
      case "hydration":
        return "💧";
      case "coordination":
        return "🤸";
      default:
        return "🧠";
    }
  };

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-2xl shadow-sm">
      {getEmoji()}
    </div>
  );
}

export default function PhysicalActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"library" | "stacks">("library");

  const dailyMission = getDailyPhysicalMission();
  const physicalScore = calculatePhysicalBrainScore(["foc-act-01", "mov-act-01", "nut-act-01"]);

  const filteredActivities = searchQuery
    ? searchPhysicalActivities(searchQuery)
    : getPhysicalActivitiesByCategory(selectedCategory);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-3 sm:px-4 lg:px-6 py-2 pb-16 overflow-x-hidden">
      {/* ─── TOP NAVIGATION / BREADCRUMB ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[36px]"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs font-bold text-foreground">Physical Activities</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/reminders"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold hover:bg-accent transition min-h-[36px]"
          >
            <Bell className="h-3.5 w-3.5 text-primary" />
            <span>Smart Reminders</span>
          </Link>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
            🏃 Physical Score: {physicalScore.totalScore}/100
          </span>
        </div>
      </div>

      {/* ─── HERO BANNER: PHYSICAL REAL-WORLD TRAINING ────────────────────── */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-card to-teal-600/10 p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Footprints className="h-3.5 w-3.5" />
              <span>Real-World Offline Training</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              BRAINGYM PHYSICAL ACTIVITIES
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Train your mind away from the screen. Movement, deep focus, real-world memory, language acquisition, and sensory habits that build long-term brain health.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2">
            <button
              onClick={() => setActiveTab("library")}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition min-h-[40px] ${
                activeTab === "library"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-muted hover:bg-accent text-foreground"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>150+ Activities</span>
            </button>
            <button
              onClick={() => setActiveTab("stacks")}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition min-h-[40px] ${
                activeTab === "stacks"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-muted hover:bg-accent text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Habit Stacks</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── TODAY'S PHYSICAL BRAIN MISSION CARD ──────────────────────────── */}
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ActivityIllustrationBadge type={dailyMission.illustrationType} />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                🎯 Today&apos;s Physical Brain Mission
              </span>
              <h2 className="text-lg sm:text-xl font-black text-foreground">
                {dailyMission.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dailyMission.tagline}
              </p>
            </div>
          </div>

          <Link
            href={`/dashboard/physical/${dailyMission.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 text-xs sm:text-sm font-black shadow-md shadow-emerald-600/25 transition active:scale-[0.98] min-h-[48px] touch-manipulation whitespace-nowrap"
          >
            <span>START MISSION ({dailyMission.duration})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="rounded-xl bg-background/80 border border-border p-2.5">
            <span className="text-muted-foreground font-semibold">⏱️ Duration: </span>
            <span className="font-black text-foreground">{dailyMission.duration} offline</span>
          </div>
          <div className="rounded-xl bg-background/80 border border-border p-2.5">
            <span className="text-muted-foreground font-semibold">⚡ Reward: </span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">+{dailyMission.xpReward} XP · +{dailyMission.coinReward} 🪙</span>
          </div>
          <div className="rounded-xl bg-background/80 border border-border p-2.5">
            <span className="text-muted-foreground font-semibold">🧠 Skill: </span>
            <span className="font-black text-foreground">{dailyMission.whatItSupports[0]}</span>
          </div>
        </div>
      </div>

      {/* ─── TAB CONTENT ─────────────────────────────────────────────────── */}
      {activeTab === "stacks" ? (
        /* ─── HABIT STACKS VIEW ───────────────────────────────────────────── */
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-foreground">
              Habit Stacking Routines
            </h2>
            <p className="text-xs text-muted-foreground">
              Combine complementary physical activities into powerful morning, afternoon, and evening routines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HABIT_STACKS.map((stack) => (
              <div
                key={stack.id}
                className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-primary">
                      {stack.timeOfDay} Stack
                    </span>
                    <span className="text-xs text-muted-foreground font-bold">
                      ⏱️ {stack.totalMinutes} min
                    </span>
                  </div>
                  <h3 className="text-base font-black text-foreground">
                    {stack.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stack.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/80 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    +{stack.bonusXp} Bonus XP
                  </span>
                  <Link
                    href={`/dashboard/physical/${stack.activities[0]}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline min-h-[36px]"
                  >
                    <span>Start Stack</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ─── 150+ ACTIVITIES EXPLORER VIEW ──────────────────────────────── */
        <div className="space-y-5">
          {/* Search Bar & Category Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search 150+ physical activities, skills, or habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>

            {/* Horizontal Scrollable Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setSearchQuery("");
                  }}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition min-h-[36px] touch-manipulation ${
                    selectedCategory === cat.value
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25"
                      : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map((act) => (
              <Link
                key={act.id}
                href={`/dashboard/physical/${act.id}`}
                className="rounded-3xl border border-border bg-card hover:border-emerald-500/40 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 active:scale-[0.99] group touch-manipulation"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <ActivityIllustrationBadge type={act.illustrationType} />
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-extrabold text-muted-foreground">
                      ⏱️ {act.duration}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                      {act.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-foreground group-hover:text-emerald-500 transition-colors">
                      {act.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {act.tagline}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-muted-foreground">
                    ⚡ +{act.xpReward} XP · +{act.coinReward} 🪙
                  </span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Start →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
