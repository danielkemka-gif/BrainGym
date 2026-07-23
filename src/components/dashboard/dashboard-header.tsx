"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getLevelProgress } from "@/lib/scoring";
import { CATEGORIES } from "@/lib/constants";
import { Zap, Brain, Trophy, Sparkles } from "lucide-react";

const CATEGORY_GRADIENTS: Record<string, string> = {
  memory: "from-indigo-500 to-violet-600",
  focus: "from-amber-400 to-orange-500",
  thinking: "from-emerald-400 to-teal-600",
  learning: "from-sky-400 to-blue-600",
  health: "from-rose-400 to-red-500",
  creativity: "from-pink-400 to-fuchsia-600",
  "emotional-intelligence": "from-violet-400 to-purple-600",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  memory: <Brain className="h-6 w-6" />,
  focus: <Zap className="h-6 w-6" />,
  thinking: <Sparkles className="h-6 w-6" />,
  learning: <Brain className="h-6 w-6" />,
  health: <Sparkles className="h-6 w-6" />,
  creativity: <Sparkles className="h-6 w-6" />,
  "emotional-intelligence": <Trophy className="h-6 w-6" />,
};

export function DashboardHeader() {
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [totalXp, setTotalXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

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
      ]).then(([avatar, xp, coin]) => {
        setAvatarUrl(avatar);
        setTotalXp(xp);
        setCoins(coin);
        setLoading(false);
      });
    });
  }, []);

  const { level } = getLevelProgress(totalXp);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/30"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-lg font-bold text-white">
            {userName ? userName.charAt(0).toUpperCase() : "?"}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold">
            Hey {userName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s train your brain today
          </p>
        </div>
      </div>
      {!loading && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
            <span className="text-sm font-bold text-primary">{coins}</span>
            <span className="text-xs text-muted-foreground">coins</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1.5">
            <Trophy className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-sm font-bold text-violet-400">Lvl {level.level}</span>
          </div>
        </div>
      )}
    </div>
  );
}
