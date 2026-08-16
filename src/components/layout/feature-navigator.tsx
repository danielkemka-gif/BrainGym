"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Compass,
  Zap,
  Gamepad2,
  Brain,
  Bot,
  Scale,
  Trophy,
  Star,
  ShoppingCart,
  Clock,
  BarChart3,
  Share2,
  Users,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Command,
} from "lucide-react";

export const OPEN_NAVIGATOR_EVENT = "braingym:open-navigator";

export interface NavFeature {
  id: string;
  title: string;
  category: "daily" | "ai" | "progress" | "community" | "guide";
  description: string;
  href: string;
  badge?: string;
  reward?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  keywords: string[];
}

export const APP_FEATURES: NavFeature[] = [
  {
    id: "guide",
    title: "Feature Guide & Manual",
    category: "guide",
    description: "Read the complete clarity guide on how all BrainGym features, scoring, and pillars work.",
    href: "/dashboard/guide",
    badge: "Start Here",
    icon: BookOpen,
    color: "from-amber-500 to-orange-600",
    keywords: ["guide", "how it works", "manual", "tutorial", "help", "clarity", "onboarding", "features", "learn"],
  },
  {
    id: "workout",
    title: "Today's Brain Workout",
    category: "daily",
    description: "5 daily real-life activities tailored to your brain goals to build lasting habits.",
    href: "/dashboard/workout",
    badge: "Daily Routine",
    reward: "+50 XP",
    icon: Zap,
    color: "from-emerald-500 to-teal-600",
    keywords: ["workout", "daily", "activities", "habits", "exercise", "routine", "today", "checklist"],
  },
  {
    id: "daily-challenge",
    title: "Daily Challenge (Brain Age)",
    category: "daily",
    description: "Play 3 quick cognitive tests in under 2 minutes to calculate your today's Brain Age.",
    href: "/dashboard/daily-challenge",
    badge: "Brain Age Test",
    reward: "+40 XP",
    icon: Sparkles,
    color: "from-purple-500 to-indigo-600",
    keywords: ["daily challenge", "brain age", "test", "assessment", "score", "quick", "age"],
  },
  {
    id: "games",
    title: "Quick-Fire Brain Games",
    category: "daily",
    description: "Memory Match, Number Sequence, and Word Scramble speed challenges with multiple levels.",
    href: "/dashboard/games",
    badge: "Arcade Training",
    reward: "+30 XP",
    icon: Gamepad2,
    color: "from-blue-500 to-cyan-600",
    keywords: ["games", "memory match", "number sequence", "word scramble", "puzzle", "speed", "mini games"],
  },
  {
    id: "library",
    title: "Activity Library (7 Pillars)",
    category: "daily",
    description: "Explore 177+ actionable real-life brain exercises across Memory, Focus, Health, and more.",
    href: "/dashboard/library",
    badge: "177+ Activities",
    icon: Brain,
    color: "from-pink-500 to-rose-600",
    keywords: ["library", "activities", "categories", "memory", "focus", "thinking", "learning", "health", "creativity", "emotional"],
  },
  {
    id: "coach",
    title: "AI Brain Coach",
    category: "ai",
    description: "Your personalized AI trainer analyzing your weekly trends, scores, and cognitive performance.",
    href: "/dashboard/coach",
    badge: "AI Trainer",
    icon: Bot,
    color: "from-violet-500 to-purple-600",
    keywords: ["ai coach", "coach", "trainer", "advice", "personalized", "insights", "ai"],
  },
  {
    id: "decision-lab",
    title: "Decision Lab",
    category: "ai",
    description: "Evaluate complex real-world ethical, business, and relationship dilemmas with AI scoring.",
    href: "/dashboard/decision-lab",
    badge: "Wisdom Training",
    reward: "+100 XP",
    icon: Scale,
    color: "from-amber-600 to-yellow-500",
    keywords: ["decision lab", "scenarios", "wisdom", "case studies", "judgment", "ethics", "business", "dilemma"],
  },
  {
    id: "progress",
    title: "Progress & Brain Score",
    category: "progress",
    description: "View your XP rank progression (Bronze to Mastermind), level status, and category scores.",
    href: "/dashboard/progress",
    badge: "Analytics",
    icon: BarChart3,
    color: "from-indigo-500 to-blue-600",
    keywords: ["progress", "brain score", "xp", "level", "stats", "chart", "growth", "rank"],
  },
  {
    id: "shop",
    title: "Brain Coins Shop",
    category: "progress",
    description: "Spend your earned Brain Coins on Streak Freezes, custom avatars, and premium tools.",
    href: "/dashboard/shop",
    badge: "Rewards",
    icon: ShoppingCart,
    color: "from-amber-500 to-yellow-600",
    keywords: ["shop", "store", "coins", "spend", "rewards", "streak freeze", "buy", "perks"],
  },
  {
    id: "missions",
    title: "Life Missions",
    category: "progress",
    description: "Align daily brain training with real-life outcomes (Pass Exams, Career Growth, Discipline).",
    href: "/dashboard/missions",
    badge: "Life Goals",
    reward: "Bonus Coins",
    icon: Star,
    color: "from-rose-500 to-orange-500",
    keywords: ["missions", "life missions", "goals", "exams", "career", "focus", "habits"],
  },
  {
    id: "leaderboard",
    title: "Weekly Leaderboard",
    category: "community",
    description: "See global rankings, weekly top performers, and compete for the Mastermind league.",
    href: "/dashboard/leaderboard",
    badge: "Competition",
    icon: Trophy,
    color: "from-amber-400 to-yellow-500",
    keywords: ["leaderboard", "rankings", "top", "competition", "weekly", "scores", "global"],
  },
  {
    id: "invite",
    title: "Invite Friends & Earn Coins",
    category: "community",
    description: "Share your invite link with friends. Both of you receive 100 bonus Brain Coins upon signup.",
    href: "/dashboard/invite",
    badge: "+100 Coins Each",
    icon: Users,
    color: "from-teal-500 to-emerald-600",
    keywords: ["invite", "referral", "friends", "share link", "earn coins", "bonus", "refer"],
  },
  {
    id: "challenges",
    title: "Brain Battles & Challenges",
    category: "community",
    description: "Create and accept head-to-head 1v1 brain challenges with friends.",
    href: "/dashboard/challenges",
    badge: "1v1 Battles",
    icon: Award,
    color: "from-cyan-500 to-blue-600",
    keywords: ["challenges", "battle", "1v1", "friends", "versus", "pvp"],
  },
  {
    id: "share",
    title: "Share Stats Card",
    category: "community",
    description: "Generate and download a high-res custom trading card showing your Level, XP, and top skills.",
    href: "/dashboard/share",
    badge: "Social Card",
    icon: Share2,
    color: "from-purple-500 to-pink-600",
    keywords: ["share", "card", "stats card", "instagram", "whatsapp", "download", "trading card"],
  },
  {
    id: "history",
    title: "Workout History",
    category: "progress",
    description: "Browse past workout logs, completion history, and activity timestamps.",
    href: "/dashboard/history",
    badge: "Logs",
    icon: Clock,
    color: "from-gray-600 to-slate-700",
    keywords: ["history", "logs", "past workouts", "completed", "timeline"],
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "All Features" },
  { id: "daily", label: "Daily & Games" },
  { id: "ai", label: "AI & Decision Lab" },
  { id: "progress", label: "Progress & Shop" },
  { id: "community", label: "Community & Share" },
  { id: "guide", label: "Guide & Manual" },
];

export function FeatureNavigator() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd/Ctrl + K or /)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }

    const openListener = () => {
      setOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(OPEN_NAVIGATOR_EVENT, openListener);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(OPEN_NAVIGATOR_EVENT, openListener);
    };
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveTab("all");
    }
  }, [open]);

  const filteredFeatures = useMemo(() => {
    return APP_FEATURES.filter((feature) => {
      const matchesTab = activeTab === "all" || feature.category === activeTab;
      if (!matchesTab) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase().trim();
      return (
        feature.title.toLowerCase().includes(q) ||
        feature.description.toLowerCase().includes(q) ||
        feature.keywords.some((kw) => kw.toLowerCase().includes(q))
      );
    });
  }, [query, activeTab]);

  function handleSelect(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-start justify-center p-0 sm:p-6 sm:pt-16 bg-black/75 backdrop-blur-md">
          {/* Backdrop click to close */}
          <div className="fixed inset-0" onClick={() => setOpen(false)} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[90dvh] sm:max-h-[85vh] flex flex-col rounded-t-[28px] sm:rounded-3xl border border-border bg-card shadow-2xl overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Feature Navigator"
          >
            {/* Mobile Drag/Grab Indicator */}
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Search Header */}
            <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-muted/30">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search BrainGym features, games, AI coach..."
                className="w-full bg-transparent text-base sm:text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-background/80 border border-border px-2 py-1 rounded-md">
                <span>ESC to close</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="sm:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 overflow-x-auto border-b border-border bg-background scrollbar-none text-xs">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all touch-manipulation min-h-[32px] ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Feature Results List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-border/40">
              {filteredFeatures.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <Compass className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No features matched &quot;{query}&quot;</p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Try searching for workout, memory, coins, coach, decision lab, or leaderboard.
                  </p>
                </div>
              ) : (
                filteredFeatures.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.id}
                      onClick={() => handleSelect(feat.href)}
                      className="group flex items-start gap-3.5 p-3 rounded-2xl hover:bg-accent/70 cursor-pointer transition-all active:scale-[0.99] touch-manipulation"
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.color} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h4 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                            {feat.title}
                          </h4>
                          {feat.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                              {feat.badge}
                            </span>
                          )}
                          {feat.reward && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {feat.reward}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {feat.description}
                        </p>
                      </div>
                      <div className="hidden sm:flex self-center items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Open</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with Guide Shortcut */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-6 py-3 border-t border-border bg-muted/40 text-xs" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">Want to understand how everything works?</span>
              </div>
              <button
                onClick={() => handleSelect("/dashboard/guide")}
                className="font-semibold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto py-1"
              >
                <span>Read Feature Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function OpenNavigatorButton({
  variant = "pill",
  className = "",
}: {
  variant?: "pill" | "icon" | "button";
  className?: string;
}) {
  function handleClick() {
    window.dispatchEvent(new Event(OPEN_NAVIGATOR_EVENT));
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        aria-label="Explore features and search"
        title="Explore features (Ctrl+K)"
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ${className}`}
      >
        <Compass className="h-5 w-5 text-primary" />
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-all active:scale-[0.98] min-h-[40px] touch-manipulation ${className}`}
      >
        <Compass className="h-4 w-4" />
        <span>Explore All Features</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`group flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur-sm px-3.5 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground shadow-sm transition-all min-h-[38px] ${className}`}
    >
      <Search className="h-3.5 w-3.5 text-primary" />
      <span className="hidden sm:inline">Search & explore features...</span>
      <span className="sm:hidden">Explore...</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
        <Command className="h-2.5 w-2.5" />K
      </kbd>
    </button>
  );
}
