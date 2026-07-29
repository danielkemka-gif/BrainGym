"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getLevelProgress } from "@/lib/scoring";
import { useI18n } from "@/lib/i18n";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, Share2 } from "lucide-react";
import Link from "next/link";

const GREETINGS: Record<string, string[]> = {
  teen: ["Hey", "Yo", "What's up", "Ready to level up"],
  young_adult: ["Hey", "Welcome back", "Let's crush it", "Time to grow"],
  adult: ["Hello", "Welcome back", "Great to see you", "Ready to train"],
  senior: ["Hello", "Welcome back", "Good to see you", "Let's stay sharp"],
};

function getGreeting(ageGroup: string): string {
  const options = GREETINGS[ageGroup] || GREETINGS.adult;
  return options[Math.floor(Math.random() * options.length)];
}

const SUBTITLES: Record<string, string[]> = {
  teen: [
    "Your brain is your superpower — let's train it!",
    "Level up your study game today!",
    "Every workout makes you sharper for exams!",
    "Build habits now that last a lifetime!",
  ],
  young_adult: [
    "Your career edge starts with a sharper mind.",
    "Invest in your greatest asset — your brain.",
    "Peak performance starts here.",
    "Growth mindset, activated!",
  ],
  adult: [
    "Keep your mind sharp and your edge sharp.",
    "A few minutes of training goes a long way.",
    "Your brain deserves the same workout as your body.",
    "Stay sharp, stay ahead.",
  ],
  senior: [
    "Your mind is a garden — let's keep it blooming.",
    "Every day is a chance to learn something new.",
    "Mental fitness is the best investment.",
    "A sharp mind knows no age.",
  ],
};

function getSubtitle(ageGroup: string): string {
  const options = SUBTITLES[ageGroup] || SUBTITLES.adult;
  return options[Math.floor(Math.random() * options.length)];
}

export function DashboardHeader() {
  const { t } = useI18n();
  const { user, supabase } = useAuth();
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [totalXp, setTotalXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [ageGroup, setAgeGroup] = useState("adult");
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
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
        .select("avatar_url, age_group")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => ({
          avatar: data?.avatar_url || "",
          ageGroup: data?.age_group || "adult",
        })),
      supabase
        .from("xp_ledger")
        .select("amount")
        .eq("user_id", user.id)
        .then(({ data }) =>
          data ? data.reduce((s, r) => s + r.amount, 0) : 0
        ),
      supabase
        .from("coins_ledger")
        .select("amount")
        .eq("user_id", user.id)
        .then(({ data }) =>
          data ? data.reduce((s, r) => s + r.amount, 0) : 0
        ),
    ]).then(([profile, xp, coin]) => {
      setAvatarUrl(profile.avatar);
      setAgeGroup(profile.ageGroup);
      setTotalXp(xp);
      setCoins(coin);
      setGreeting(getGreeting(profile.ageGroup));
      setSubtitle(getSubtitle(profile.ageGroup));
      setLoading(false);
    });
  }, [user, supabase]);

  const { level } = getLevelProgress(totalXp);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar src={avatarUrl} name={userName} size="lg" level={level.level} />
        <div className="min-w-0">
          <h1 className="text-lg font-bold sm:text-xl truncate">
            {greeting || t.dashboard_greeting} {userName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {subtitle || t.dashboard_subtitle}
          </p>
        </div>
      </div>
      {!loading && (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard/invite"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="text-xs font-bold hidden sm:inline">Share</span>
          </Link>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
            <span className="text-sm font-bold text-primary">{coins}</span>
            <span className="text-xs text-muted-foreground">{t.dashboard_coins}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1.5">
            <Trophy className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-sm font-bold text-violet-400">{t.dashboard_level} {level.level}</span>
          </div>
        </div>
      )}
    </div>
  );
}
