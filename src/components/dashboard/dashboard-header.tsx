"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLevelProgress } from "@/lib/scoring";
import { useI18n } from "@/lib/i18n";
import { Avatar } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

export function DashboardHeader() {
  const { t } = useI18n();
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
        <Avatar src={avatarUrl} name={userName} size="lg" level={level.level} />
        <div>
          <h1 className="text-xl font-bold">
            {t.dashboard_greeting} {userName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.dashboard_subtitle}
          </p>
        </div>
      </div>
      {!loading && (
        <div className="flex items-center gap-3">
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
