"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";
import { ArrowLeft, Clock, Zap, Coins, CheckCircle2, Share2, BookOpen, Lightbulb, Star } from "lucide-react";

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
  beginner: { label: "Beginner", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  intermediate: { label: "Intermediate", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  advanced: { label: "Advanced", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("activities")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setActivity(data);
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
    } catch {
      // silent
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
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
          className="mt-4 text-sm text-primary hover:underline"
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

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Hero */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

        <div className="relative">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
              {emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/70">{category?.label}</span>
                <span className="text-white/30">·</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${diff.bg} ${diff.color}`}>
                  {diff.label}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white">{activity.title}</h1>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5" />
              {activity.estimated_time}s
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              +{activity.xp} XP
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <Coins className="h-3.5 w-3.5" />
              +{activity.coins} coins
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {activity.description && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">{activity.description}</p>
        </div>
      )}

      {/* Instructions */}
      {activity.instructions && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-semibold">How to do this</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {activity.instructions}
          </p>
        </div>
      )}

      {/* Tips */}
      {activity.tips && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Lightbulb className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="font-semibold">Pro Tips</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {activity.tips}
          </p>
        </div>
      )}

      {/* Benefits */}
      {activity.benefits && activity.benefits.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Star className="h-4 w-4 text-violet-400" />
            </div>
            <h2 className="font-semibold">What you&apos;ll gain</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {activity.benefits.map((b, i) => (
              <span
                key={i}
                className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {completed ? (
          <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/5 py-3 text-sm font-medium text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            Completed! +{activity.xp} XP +{activity.coins} coins
          </div>
        ) : (
          <button
            onClick={markComplete}
            disabled={completing}
            className="flex-[2] inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl hover:shadow-green-500/30 disabled:opacity-50"
          >
            {completing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Mark as Done
              </>
            )}
          </button>
        )}
        <button
          onClick={() => router.push("/dashboard/library")}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium hover:bg-accent"
        >
          Browse More
        </button>
      </div>
    </div>
  );
}
