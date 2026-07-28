"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { LEAGUES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, ArrowUp, ArrowDown, Minus, Crown, Shield, Medal, Star } from "lucide-react";
import type { LeagueId } from "@/lib/constants";

interface LeaderboardEntry {
  user_id: string;
  total_xp: number;
  weekly_xp: number;
  name: string | null;
  avatar_url: string | null;
  league: LeagueId;
  promoted: boolean;
  relegated: boolean;
}

const LEAGUE_ICONS: Record<LeagueId, typeof Trophy> = {
  bronze: Medal,
  silver: Shield,
  gold: Crown,
  platinum: Star,
  diamond: Trophy,
  mastermind: Crown,
};

export default function LeaderboardPage() {
  const { t } = useI18n();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<LeagueId | "all">("all");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLeague, setUserLeague] = useState<LeagueId | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });

    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    Promise.all([
      supabase
        .from("xp_ledger")
        .select("user_id, amount")
        .gte("created_at", weekAgo),
      supabase
        .from("user_leagues")
        .select("user_id, league, weekly_xp, promoted, relegated")
        .order("week_start", { ascending: false })
        .limit(200),
    ]).then(([xpRes, leagueRes]) => {
      const logs = xpRes.data ?? [];
      const leagues = leagueRes.data ?? [];

      // Build weekly XP totals
      const xpMap: Record<string, number> = {};
      for (const log of logs) {
        xpMap[log.user_id] = (xpMap[log.user_id] ?? 0) + log.amount;
      }

      // Build league map (latest entry per user)
      const leagueMap: Record<string, { league: LeagueId; weekly_xp: number; promoted: boolean; relegated: boolean }> = {};
      for (const entry of leagues) {
        if (!leagueMap[entry.user_id]) {
          leagueMap[entry.user_id] = {
            league: entry.league as LeagueId,
            weekly_xp: entry.weekly_xp,
            promoted: entry.promoted,
            relegated: entry.relegated,
          };
        }
      }

      const allUserIds = [...new Set([...Object.keys(xpMap), ...Object.keys(leagueMap)])];

      // Fetch profiles
      supabase
        .from("profiles")
        .select("user_id, name, avatar_url")
        .in("user_id", allUserIds)
        .then(({ data: profiles }) => {
          const profileMap = Object.fromEntries(
            (profiles ?? []).map((p) => [p.user_id, p])
          );

          const allEntries: LeaderboardEntry[] = allUserIds.map((id) => ({
            user_id: id,
            total_xp: xpMap[id] ?? 0,
            weekly_xp: leagueMap[id]?.weekly_xp ?? xpMap[id] ?? 0,
            name: profileMap[id]?.name ?? null,
            avatar_url: profileMap[id]?.avatar_url ?? null,
            league: leagueMap[id]?.league ?? "bronze",
            promoted: leagueMap[id]?.promoted ?? false,
            relegated: leagueMap[id]?.relegated ?? false,
          }));

          // Sort by weekly XP
          allEntries.sort((a, b) => b.weekly_xp - a.weekly_xp);
          setEntries(allEntries);

          if (userId) {
            const my = allEntries.find((e) => e.user_id === userId);
            if (my) {
              setMyEntry(my);
              setUserLeague(my.league);
              setSelectedLeague(my.league);
            }
          }

          setLoading(false);
        });
    });
  }, [userId]);

  const filteredEntries = selectedLeague === "all"
    ? entries
    : entries.filter((e) => e.league === selectedLeague);

  const leagueStats = LEAGUES.map((l) => ({
    ...l,
    count: entries.filter((e) => e.league === l.id).length,
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold sm:text-2xl flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" />
          Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Weekly league rankings — compete and climb the tiers
        </p>
      </div>

      {/* My League Card */}
      {myEntry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${LEAGUES.find((l) => l.id === myEntry.league)?.gradient ?? "from-zinc-400 to-zinc-500"}`}>
              {(() => {
                const LeagueIcon = LEAGUE_ICONS[myEntry.league];
                return <LeagueIcon className="h-5 w-5 text-white" />;
              })()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {LEAGUES.find((l) => l.id === myEntry.league)?.label ?? "Bronze"} League
              </p>
              <p className="text-xs text-muted-foreground">
                {myEntry.weekly_xp.toLocaleString()} XP this week
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {myEntry.promoted && (
                <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                  <ArrowUp className="h-3 w-3" /> Promoted
                </span>
              )}
              {myEntry.relegated && (
                <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                  <ArrowDown className="h-3 w-3" /> Relegated
                </span>
              )}
              {!myEntry.promoted && !myEntry.relegated && (
                <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  <Minus className="h-3 w-3" /> Stable
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* League Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1" role="tablist">
        <button
          onClick={() => setSelectedLeague("all")}
          role="tab"
          aria-selected={selectedLeague === "all"}
          className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            selectedLeague === "all"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent"
          }`}
        >
          All
        </button>
        {LEAGUES.map((league) => {
          const Icon = LEAGUE_ICONS[league.id];
          const isSelected = selectedLeague === league.id;
          return (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              role="tab"
              aria-selected={isSelected}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-gradient-to-r " + league.gradient + " text-white"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{league.label}</span>
              <span className="text-xs opacity-70">({leagueStats.find((l) => l.id === league.id)?.count ?? 0})</span>
            </button>
          );
        })}
      </div>

      {/* Entries */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No entries in this league</p>
          <p className="text-sm text-muted-foreground">
            Complete workouts to earn XP and join the rankings
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredEntries.slice(0, 50).map((entry, i) => {
              const isMe = entry.user_id === userId;
              const rank = i + 1;
              return (
                <motion.div
                  key={entry.user_id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                    isMe
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      rank === 1
                        ? "bg-yellow-500/20 text-yellow-500"
                        : rank === 2
                          ? "bg-gray-400/20 text-gray-400"
                          : rank === 3
                            ? "bg-amber-700/20 text-amber-700"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {rank}
                  </span>
                  <Avatar src={entry.avatar_url} name={entry.name ?? ""} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">
                      {entry.name ?? "Anonymous"}
                      {isMe && <span className="ml-1.5 text-xs text-primary">(You)</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {LEAGUES.find((l) => l.id === entry.league)?.emoji} {LEAGUES.find((l) => l.id === entry.league)?.label}
                      </span>
                      {entry.promoted && (
                        <span className="text-[10px] font-medium text-green-500">↑ Promoted</span>
                      )}
                      {entry.relegated && (
                        <span className="text-[10px] font-medium text-red-500">↓ Relegated</span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums">
                    {entry.weekly_xp.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">XP</span>
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* League Tier Info */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">League Tiers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {LEAGUES.map((league) => (
            <div key={league.id} className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
              <span className="text-lg">{league.emoji}</span>
              <div>
                <p className="text-xs font-medium">{league.label}</p>
                <p className="text-[10px] text-muted-foreground">{league.minXP}+ XP</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Top 20% promote, bottom 20% demote. Rankings reset every Monday.
        </p>
      </div>
    </div>
  );
}
