"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  type UserMission,
  fetchWeeklyMissions,
  generateWeeklyMissions,
  refreshMissionProgress,
  claimMissionReward,
  getWeekDateRange,
  getDaysRemaining,
} from "@/lib/missions";
import { MISSION_ICONS } from "@/lib/icons";
import { Check } from "lucide-react";

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min(100, (current / target) * 100);
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function MissionCard({
  mission,
  onClaim,
  claiming,
}: {
  mission: UserMission;
  onClaim: (id: string) => void;
  claiming: string | null;
}) {
  const isClaimable = mission.completed && !mission.claimed;
  const isClaimed = mission.claimed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
        isClaimed
          ? "border-emerald-500/20 bg-emerald-500/5"
          : isClaimable
          ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/5"
          : "border-border bg-card"
      }`}
    >
      {isClaimable && (
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
      )}

      <div className="relative flex items-start gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
            isClaimed
              ? "bg-emerald-500/10"
              : isClaimable
              ? "bg-primary/10"
              : "bg-muted"
          }`}
        >
          {isClaimed ? (
            <Check className="h-5 w-5 text-emerald-500" />
          ) : (
            (() => { const MissionIcon = MISSION_ICONS[mission.icon || ""]; return MissionIcon ? <MissionIcon className="h-5 w-5 text-primary" /> : null; })()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold ${
                isClaimed ? "text-emerald-600 line-through" : ""
              }`}
            >
              {mission.title}
            </h3>
            {isClaimed && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                CLAIMED
              </span>
            )}
            {isClaimable && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                READY
              </span>
            )}
          </div>

          <p className="mt-0.5 text-sm text-muted-foreground">
            {mission.description}
          </p>

          <div className="mt-3 space-y-2">
            <ProgressBar
              current={mission.current_value}
              target={mission.target_value}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {mission.current_value}
                </span>
                /{mission.target_value}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-violet-500/10 px-2 py-0.5 font-medium text-violet-500">
                  +{mission.xp_reward} XP
                </span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-amber-500">
                  +{mission.coin_reward} 🪙
                </span>
              </div>
            </div>
          </div>
        </div>

        {isClaimable && (
          <button
            onClick={() => onClaim(mission.id)}
            disabled={claiming === mission.id}
            className="flex-shrink-0 rounded-xl bg-gradient-to-r from-primary to-emerald-400 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
          >
            {claiming === mission.id ? "Claiming..." : "Claim"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchWeeklyMissions();
    setMissions(data);
    if (data.length > 0) {
      setWeekStart(data[0].week_start);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const updated = await refreshMissionProgress();
    setMissions(updated);
    setRefreshing(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const newMissions = await generateWeeklyMissions();
    setMissions(newMissions);
    if (newMissions.length > 0) {
      setWeekStart(newMissions[0].week_start);
    }
    setGenerating(false);
  };

  const handleClaim = async (missionId: string) => {
    setClaiming(missionId);
    const result = await claimMissionReward(missionId);
    if (result.success) {
      setMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, claimed: true } : m))
      );
    }
    setClaiming(null);
  };

  const completedCount = missions.filter((m) => m.completed).length;
  const claimedCount = missions.filter((m) => m.claimed).length;
  const totalXpAvailable = missions.reduce((s, m) => s + m.xp_reward, 0);
  const totalXpEarned = missions
    .filter((m) => m.claimed)
    .reduce((s, m) => s + m.xp_reward, 0);
  const daysRemaining = weekStart ? getDaysRemaining(weekStart) : 7;
  const weekLabel = weekStart ? getWeekDateRange(weekStart) : "";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Weekly Missions</h1>
        <p className="text-sm text-muted-foreground">
          Complete challenges every week to earn XP and coins
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : missions.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-4xl">
            🎯
          </div>
          <p className="text-lg font-semibold">No missions this week</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Generate a fresh set of weekly missions tailored to your level and
            start earning rewards
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-400 px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
          >
            {generating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating...
              </>
            ) : (
              "🎯 Generate Missions"
            )}
          </button>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-primary/10 p-4 text-center"
            >
              <p className="text-2xl font-bold text-primary">
                {completedCount}/{missions.length}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/10 p-4 text-center"
            >
              <p className="text-2xl font-bold text-violet-500">
                {totalXpEarned}/{totalXpAvailable}
              </p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/10 p-4 text-center"
            >
              <p className="text-2xl font-bold text-amber-500">
                {missions
                  .filter((m) => m.claimed)
                  .reduce((s, m) => s + m.coin_reward, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Coins Earned</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/10 p-4 text-center"
            >
              <p className="text-2xl font-bold text-red-500">
                {daysRemaining}d
              </p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </motion.div>
          </div>

          {/* Week label + refresh */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {weekLabel} &middot; {daysRemaining} day
              {daysRemaining !== 1 ? "s" : ""} left
            </p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              <span
                className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
              >
                🔄
              </span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Mission cards */}
          <div className="space-y-3">
            {missions.map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <MissionCard
                  mission={mission}
                  onClaim={handleClaim}
                  claiming={claiming}
                />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
