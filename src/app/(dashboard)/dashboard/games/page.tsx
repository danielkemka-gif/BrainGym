"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ALL_GAMES, type GameProgress } from "@/lib/games/config";
import { GAME_ICONS } from "@/lib/icons";
import { GAME_ILLUSTRATIONS } from "@/components/brain-illustrations";
import { Star, Lock, Play, Zap } from "lucide-react";
import { motion } from "framer-motion";

function DifficultyBadge({ d }: { d: string }) {
  const colors: Record<string, string> = {
    easy: "bg-green-500/10 text-green-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    hard: "bg-orange-500/10 text-orange-500",
    expert: "bg-red-500/10 text-red-500",
    master: "bg-purple-500/10 text-purple-500",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${colors[d] || colors.easy}`}>
      {d}
    </span>
  );
}

function GameCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-28 animate-pulse bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-2 animate-pulse rounded-full bg-muted" />
        <div className="h-12 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export default function GamesHubPage() {
  const [progress, setProgress] = useState<GameProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) return;
        const { data: progressData } = await supabase
          .from("game_progress")
          .select("user_id, game_id, level_number, stars, score, best_time_ms, completed_at")
          .eq("user_id", data.user.id);
        setProgress(progressData || []);
      } catch {
        // ignore — games still playable without saved progress
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function getGameStats(gameId: string) {
    const levels = progress.filter((p) => p.game_id === gameId);
    const completedLevels = levels.filter((p) => p.stars > 0);
    const totalStars = levels.reduce((sum, p) => sum + p.stars, 0);
    const maxStars = 30; // 10 levels * 3 stars
    const highestLevel = completedLevels.length > 0
      ? Math.max(...completedLevels.map((p) => p.level_number))
      : 0;
    return { completedLevels: completedLevels.length, totalStars, maxStars, highestLevel };
  }

  // First unlocked & not-yet-completed level → quick-start target
  function getNextPlayable(gameId: string): number {
    const levels = progress.filter((p) => p.game_id === gameId);
    if (levels.length === 0) return 1;
    for (let lvl = 1; lvl <= 10; lvl++) {
      const p = levels.find((x) => x.level_number === lvl);
      const prev = levels.find((x) => x.level_number === lvl - 1);
      const unlocked = lvl === 1 || (prev && prev.stars > 0);
      if (unlocked && (!p || p.stars === 0)) return lvl;
    }
    return 10;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Brain Games</h1>
        <p className="text-sm text-muted-foreground">
          Train your brain with addictive mini-games. Earn stars, unlock levels, become a master!
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/10 p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-2xl font-bold text-amber-500">
            {progress.reduce((s, p) => s + p.stars, 0)}
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Stars</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/10 p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-2xl font-bold text-violet-500">
            {progress.filter((p) => p.stars > 0).length}
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Levels</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/10 p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-2xl font-bold text-green-500">
            {ALL_GAMES.filter((g) => getGameStats(g.id).completedLevels > 0).length}/{ALL_GAMES.length}
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Played</p>
        </div>
      </div>

      {/* Daily Challenge — prominent CTA */}
      <Link
        href="/dashboard/daily-challenge"
        className="group touch-manipulation block overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 active:scale-[0.99]"
      >
        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-lg shadow-primary/25">
            <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold">Daily Brain Age Challenge</h3>
            <p className="text-sm text-muted-foreground">
              Play 3 quick games — discover your brain age for today
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
            Daily
          </span>
        </div>
      </Link>

      {/* Game cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <GameCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {ALL_GAMES.map((game, i) => {
            const stats = getGameStats(game.id);
            const progressPercent = (stats.totalStars / stats.maxStars) * 100;
            const nextLevel = getNextPlayable(game.id);

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.08, 0.3) }}
                className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Header (links to level select) */}
                <Link
                  href={`/dashboard/games/${game.id}`}
                  className="group block"
                  aria-label={`${game.title} levels`}
                >
                  <div className={`relative overflow-hidden bg-gradient-to-br ${game.gradient} p-4 sm:p-6`}>
                    <div className="relative flex items-center gap-3 sm:gap-4">
                      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/20 text-white">
                        {(() => { const Illust = GAME_ILLUSTRATIONS[game.iconKey]; return Illust ? <Illust className="h-10 w-10 sm:h-12 sm:w-12" /> : (() => { const GameIcon = GAME_ICONS[game.iconKey]; return GameIcon ? <GameIcon className="h-6 w-6 sm:h-7 sm:w-7" /> : null; })(); })()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white">{game.title}</h3>
                        <p className="text-sm text-white/80">{game.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Progress */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{stats.completedLevels}/10</span>
                      <span className="text-xs text-muted-foreground">levels</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold">{stats.totalStars}/30</span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${game.gradient} transition-all`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Quick start */}
                  <Link
                    href={`/dashboard/games/${game.id}?level=${nextLevel}`}
                    className={`mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${game.gradient} text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] touch-manipulation min-h-[44px]`}
                  >
                    <Play className="h-4 w-4 fill-current" />
                    {stats.completedLevels === 0 ? `Start Level ${nextLevel}` : `Play Level ${nextLevel}`}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
