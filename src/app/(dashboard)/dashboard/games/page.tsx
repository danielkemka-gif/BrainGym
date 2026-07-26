"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ALL_GAMES, type GameProgress } from "@/lib/games/config";
import { GAME_ICONS } from "@/lib/icons";
import { Star, Lock, Zap } from "lucide-react";
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
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${colors[d] || colors.easy}`}>
      {d}
    </span>
  );
}

export default function GamesHubPage() {
  const [progress, setProgress] = useState<GameProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { setLoading(false); return; }
      supabase
        .from("game_progress")
        .select("user_id, game_id, level_number, stars, score, best_time_ms, completed_at")
        .eq("user_id", data.user.id)
        .then(({ data }) => {
          setProgress(data || []);
          setLoading(false);
        });
    });
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

  return (
    <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Brain Games</h1>
        <p className="text-sm text-muted-foreground">
          Train your brain with addictive mini-games. Earn stars, unlock levels, become a master!
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">
            {progress.reduce((s, p) => s + p.stars, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Total Stars</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-violet-500">
            {progress.filter((p) => p.stars > 0).length}
          </p>
          <p className="text-xs text-muted-foreground">Levels Cleared</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">
            {ALL_GAMES.filter((g) => getGameStats(g.id).completedLevels > 0).length}/{ALL_GAMES.length}
          </p>
          <p className="text-xs text-muted-foreground">Games Played</p>
        </div>
      </div>

      {/* Daily Challenge — prominent CTA */}
      <Link
        href="/dashboard/daily-challenge"
        className="group block overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
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
            NEW
          </span>
        </div>
      </Link>

      {/* Game cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {ALL_GAMES.map((game, i) => {
          const stats = getGameStats(game.id);
          const progressPercent = (stats.totalStars / stats.maxStars) * 100;

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/dashboard/games/${game.id}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-transparent hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Gradient header */}
                <div className={`relative overflow-hidden bg-gradient-to-br ${game.gradient} p-4 sm:p-6`}>
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-black/10 blur-2xl" />
                  <div className="relative flex items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/20 text-white">
                      {(() => { const GameIcon = GAME_ICONS[game.iconKey]; return GameIcon ? <GameIcon className="h-6 w-6 sm:h-7 sm:w-7" /> : null; })()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{game.title}</h3>
                      <p className="text-sm text-white/70">{game.description}</p>
                    </div>
                  </div>
                </div>

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

                  {/* Level badges */}
                  <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
                    {Array.from({ length: 10 }, (_, lvl) => {
                      const p = progress.find(
                        (pr) => pr.game_id === game.id && pr.level_number === lvl + 1
                      );
                      const stars = p?.stars || 0;
                      const unlocked = lvl === 0 || progress.some(
                        (pr) => pr.game_id === game.id && pr.level_number === lvl && pr.stars > 0
                      );
                      return (
                        <div
                          key={lvl}
                          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${
                            stars === 3
                              ? "bg-amber-500/20 text-amber-500"
                              : stars > 0
                              ? "bg-green-500/20 text-green-500"
                              : unlocked
                              ? "bg-muted text-muted-foreground"
                              : "bg-muted/50 text-muted-foreground/50"
                          }`}
                        >
                          {stars === 3 ? <Star className="h-3 w-3 fill-current" /> : stars === 2 ? <Star className="h-3 w-3 fill-current opacity-60" /> : stars === 1 ? <Star className="h-3 w-3 fill-current opacity-30" /> : unlocked ? <span className="text-[10px] font-bold">{lvl + 1}</span> : <Lock className="h-2.5 w-2.5" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
