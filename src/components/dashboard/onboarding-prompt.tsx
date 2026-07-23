"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { X, ArrowRight, Zap, Brain, Trophy, Sparkles, Target } from "lucide-react";

const PROMPTS = [
  {
    id: "first-workout",
    gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    border: "border-emerald-500/20",
    icon: <Zap className="h-6 w-6 text-emerald-400" />,
    title: "Kick off your first workout!",
    description:
      "It only takes 5 minutes. Complete it and earn coins, XP, and build your streak.",
    href: "/dashboard/challenge",
    cta: "Start Workout",
    emoji: "⚡",
  },
  {
    id: "browse-activities",
    gradient: "from-indigo-500/20 via-violet-500/10 to-purple-500/20",
    border: "border-indigo-500/20",
    icon: <Brain className="h-6 w-6 text-indigo-400" />,
    title: "Explore 177+ brain exercises",
    description:
      "Memory, Focus, Thinking, Learning, Creativity — pick what excites you.",
    href: "/dashboard/library",
    cta: "Browse Activities",
    emoji: "🧠",
  },
  {
    id: "ai-coach",
    gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
    border: "border-amber-500/20",
    icon: <Target className="h-6 w-6 text-amber-400" />,
    title: "Meet your AI Coach",
    description:
      "Get personalized tips and a custom training plan tailored to your goals.",
    href: "/dashboard/coach",
    cta: "Talk to Coach",
    emoji: "🤖",
  },
  {
    id: "leaderboard",
    gradient: "from-pink-500/20 via-rose-500/10 to-red-500/20",
    border: "border-pink-500/20",
    icon: <Trophy className="h-6 w-6 text-pink-400" />,
    title: "See the leaderboard",
    description:
      "Compare your progress with other BrainGym members and climb the ranks.",
    href: "/dashboard/leaderboard",
    cta: "View Rankings",
    emoji: "🏆",
  },
];

export function OnboardingPrompt() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [hasWorkouts, setHasWorkouts] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      const name =
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "there";
      setUserName(name.split(" ")[0]);

      Promise.all([
        supabase
          .from("profiles")
          .select("avatar_url")
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data }) => data?.avatar_url || ""),
        supabase
          .from("daily_workouts")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)
          .then(({ data }) => (data && data.length > 0 ? true : false)),
      ]).then(([avatar, workouts]) => {
        setAvatarUrl(avatar);
        setHasWorkouts(workouts);

        const key = `braingym_onboarding_prompt_dismissed_${user.id}`;
        const wasDismissed = localStorage.getItem(key);

        if (!wasDismissed && !workouts) {
          setVisible(true);
        }
      });
    });
  }, []);

  function handleDismiss() {
    setDismissed(true);
    setVisible(false);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        localStorage.setItem(
          `braingym_onboarding_prompt_dismissed_${user.id}`,
          "true"
        );
      }
    });
  }

  if (!visible || dismissed) return null;

  const prompt = PROMPTS[currentPrompt];
  const isLast = currentPrompt === PROMPTS.length - 1;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${prompt.border} bg-gradient-to-br ${prompt.gradient} p-6 transition-all`}
    >
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl">
            {prompt.emoji}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold">{prompt.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {prompt.description}
          </p>
          <Link
            href={prompt.href}
            onClick={handleDismiss}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {prompt.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-1.5">
          {PROMPTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPrompt(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentPrompt
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {currentPrompt > 0 && (
            <button
              onClick={() => setCurrentPrompt((s) => s - 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
            >
              Back
            </button>
          )}
          {!isLast ? (
            <button
              onClick={() => setCurrentPrompt((s) => s + 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
            >
              Got it!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
