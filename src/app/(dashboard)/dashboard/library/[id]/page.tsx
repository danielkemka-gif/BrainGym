"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";
import { ArrowLeft, Clock, Zap, Coins, CheckCircle2, Share2, BookOpen, Lightbulb, Star, Lock, Sparkles } from "lucide-react";
import { CATEGORY_ILLUSTRATIONS } from "@/components/brain-illustrations";
import { WhyThisMatters } from "@/components/ui/why-this-matters";
import { ActivityCelebration } from "@/components/ui/activity-celebration";
import { isActivityUnlocked } from "@/lib/activity-levels";
import Link from "next/link";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  estimated_time: number;
  xp: number;
  coins: number;
  benefits: string[] | null;
  instructions: string | null;
  tips: string | null;
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

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  beginner: { label: "Level 1 · Novice", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  intermediate: { label: "Level 2 · Practitioner", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  advanced: { label: "Level 3 · Master", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [userCategoryPoints, setUserCategoryPoints] = useState(0);

  const dismissCelebration = useCallback(() => setShowCelebration(false), []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("activities")
      .select("*")
      .eq("id", id)
      .single()
      .then(async ({ data }) => {
        if (data) {
          setActivity(data);

          // Fetch user's category points
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: logs } = await supabase
              .from("activity_logs")
              .select("xp_earned, activities!inner(category_id)")
              .eq("user_id", user.id)
              .eq("activities.category_id", data.category_id);

            if (logs) {
              const total = logs.reduce((sum: number, log: any) => sum + (log.xp_earned || 40), 0);
              setUserCategoryPoints(total);
            }
          }
        }
        setLoading(false);
      });
  }, [id]);

  async function markComplete() {
    if (!activity || completing) return;
    setCompleting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date().toISOString();
      const today = now.split("T")[0];

      await supabase.from("activity_logs").insert({
        user_id: user.id,
        activity_id: activity.id,
        date: today,
        xp_earned: activity.xp,
        coins_earned: activity.coins,
      });

      await supabase.from("xp_ledger").insert({
        user_id: user.id,
        amount: activity.xp,
        reason: "activity_complete",
        reference_type: "activity",
        reference_id: activity.id,
      });

      await supabase.from("coins_ledger").insert({
        user_id: user.id,
        amount: activity.coins,
        reason: "activity_complete",
        reference_type: "activity",
        reference_id: activity.id,
      });

      setCompleted(true);
      setShowCelebration(true);
    } catch {
      // ignore
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="text-5xl">😵</span>
        <p className="mt-4 text-lg font-medium">Activity not found</p>
        <button
          onClick={() => router.push("/dashboard/library")}
          className="mt-4 rounded-lg px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 min-h-[44px]"
        >
          Back to library
        </button>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === activity.category_id);
  const diff = DIFFICULTY_CONFIG[activity.difficulty] || DIFFICULTY_CONFIG.beginner;
  const gradient = CATEGORY_GRADIENTS[category?.slug || ""] || "from-gray-500 to-gray-600";
  const emoji = CATEGORY_EMOJIS[category?.slug || ""] || "🧠";

  const lockStatus = isActivityUnlocked(activity.difficulty, userCategoryPoints);

  return (
    <div className="mx-auto w-full max-w-full space-y-5 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
      <ActivityCelebration
        show={showCelebration}
        xp={activity.xp}
        coins={activity.coins}
        title={activity.title}
        onDismiss={dismissCelebration}
      />

      {/* Hero */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-5 sm:p-7 shadow-lg`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

        <div className="relative space-y-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-sm hover:bg-white/25 transition-all min-h-[38px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm overflow-hidden text-white shadow-md">
              {(() => { const Illust = CATEGORY_ILLUSTRATIONS[category?.slug || ""]; return Illust ? <Illust className="h-12 w-12" /> : emoji; })()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white/80">{category?.label}</span>
                <span className="text-white/40">·</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${diff.bg} ${diff.color} backdrop-blur-sm`}>
                  {diff.label}
                </span>
              </div>
              <h1 className="text-balance text-xl sm:text-2xl font-black text-white">{activity.title}</h1>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5" />
              {activity.estimated_time}s
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              +{activity.xp} XP
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              <Coins className="h-3.5 w-3.5" />
              +{activity.coins} coins
            </div>
          </div>
        </div>
      </div>

      {/* Level Lock Warning Card */}
      {!lockStatus.unlocked && (
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-card to-orange-500/10 p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">
                Locked at {lockStatus.levelTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                You need <strong className="text-foreground">{lockStatus.pointsNeeded} more points</strong> in {category?.label} to unlock this activity.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((userCategoryPoints / lockStatus.requiredPoints) * 100))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground font-bold">
              <span>{userCategoryPoints} pts earned</span>
              <span>{lockStatus.requiredPoints} pts needed for Level {lockStatus.requiredLevel}</span>
            </div>
          </div>

          <Link
            href="/dashboard/workout"
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-xs sm:text-sm font-black text-primary-foreground shadow-md hover:brightness-110 active:scale-95 transition min-h-[44px]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Play Daily Workout to Earn Category Points →</span>
          </Link>
        </div>
      )}

      {/* Description */}
      {activity.description && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{activity.description}</p>
        </div>
      )}

      {/* Why this matters */}
      <WhyThisMatters categorySlug={category?.slug || ""} />

      {/* Instructions */}
      {activity.instructions && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-foreground text-sm">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Instructions</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {activity.instructions}
          </p>
        </div>
      )}

      {/* Benefits */}
      {activity.benefits && activity.benefits.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-foreground text-sm">
            <Star className="h-4 w-4 text-amber-500" />
            <span>Cognitive Benefits</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            {activity.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Completion button (only if unlocked) */}
      {lockStatus.unlocked && (
        <div className="pt-2">
          {completed ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>Completed! +{activity.xp} XP Earned</span>
            </div>
          ) : (
            <button
              onClick={markComplete}
              disabled={completing}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 py-4 px-6 text-sm sm:text-base font-black text-white shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition disabled:opacity-50 min-h-[52px] touch-manipulation"
            >
              <Zap className="h-5 w-5" />
              <span>{completing ? "Recording Points..." : "Complete Activity (+XP)"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
