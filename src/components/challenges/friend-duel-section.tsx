"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Swords, Clock, CheckCircle, XCircle, ArrowRight, Plus } from "lucide-react";

interface Duel {
  id: string;
  challenge_id: string;
  challenger_id: string;
  opponent_id: string;
  challenger_progress: number;
  opponent_progress: number;
  winner_id: string | null;
  status: string;
  created_at: string;
  challenge?: {
    title: string;
    goal_type: string;
    goal_amount: number;
    duration_days: number;
    end_date: string;
  };
  opponent_name?: string;
  challenger_name?: string;
}

interface Partner {
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  current_streak: number;
}

export function FriendDuelSection() {
  const [duels, setDuels] = useState<Duel[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [duelGoal, setDuelGoal] = useState("workouts");
  const [duelAmount, setDuelAmount] = useState(5);
  const [duelDays, setDuelDays] = useState(7);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    // Fetch duels
    const { data: duelData } = await supabase
      .from("friend_duels")
      .select("*, challenges!inner(title, goal_type, goal_amount, duration_days, end_date)")
      .or(`challenger_id.eq.${user.id},opponent_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    // Fetch partners
    const { data: partnerData } = await supabase
      .from("accountability_partners")
      .select("from_user_id, to_user_id, status")
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .eq("status", "accepted");

    if (partnerData && partnerData.length > 0) {
      const partnerIds = partnerData.map((p) =>
        p.from_user_id === user.id ? p.to_user_id : p.from_user_id
      );

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name, avatar_url")
        .in("user_id", partnerIds);

      const { data: streaks } = await supabase
        .from("streaks")
        .select("user_id, current_streak")
        .in("user_id", partnerIds);

      const streakMap = Object.fromEntries(
        (streaks ?? []).map((s) => [s.user_id, s.current_streak])
      );

      setPartners(
        (profiles ?? []).map((p) => ({
          user_id: p.user_id,
          name: p.name,
          avatar_url: p.avatar_url,
          current_streak: streakMap[p.user_id] ?? 0,
        }))
      );
    }

    // Fetch names for duels
    if (duelData && duelData.length > 0) {
      const allIds = new Set<string>();
      for (const d of duelData) {
        allIds.add(d.challenger_id);
        allIds.add(d.opponent_id);
      }
      const { data: nameProfiles } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", [...allIds]);

      const nameMap = Object.fromEntries(
        (nameProfiles ?? []).map((p) => [p.user_id, p.name ?? "Anonymous"])
      );

      setDuels(
        duelData.map((d) => ({
          ...d,
          challenge: d.challenges,
          challenger_name: nameMap[d.challenger_id] ?? "Anonymous",
          opponent_name: nameMap[d.opponent_id] ?? "Anonymous",
        }))
      );
    }

    setLoading(false);
  }

  async function createDuel() {
    if (!selectedPartner || !userId) return;
    setCreating(true);
    const supabase = createClient();

    const { data, error } = await supabase.rpc("create_duel", {
      p_challenger_id: userId,
      p_opponent_id: selectedPartner,
      p_title: `Duel: ${duelGoal} challenge`,
      p_goal_type: duelGoal,
      p_goal_amount: duelAmount,
      p_duration_days: duelDays,
    });

    if (!error) {
      setShowCreate(false);
      setSelectedPartner(null);
      fetchData();
    }
    setCreating(false);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Swords className="h-4 w-4 text-amber-500" />
          Friend Duels
        </h3>
        {partners.length > 0 && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 min-h-[44px]"
          >
            <Plus className="h-3.5 w-3.5" />
            Challenge
          </button>
        )}
      </div>

      {/* Create Duel Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <p className="text-sm font-medium">Choose opponent</p>
              <div className="grid grid-cols-2 gap-2">
                {partners.map((p) => (
                  <button
                    key={p.user_id}
                    onClick={() => setSelectedPartner(p.user_id)}
                    className={`flex items-center gap-2 rounded-xl p-3 text-left transition-all ${
                      selectedPartner === p.user_id
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {p.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-xs font-medium truncate">{p.name ?? "Partner"}</p>
                      <p className="text-[10px] text-muted-foreground">{p.current_streak}🔥 streak</p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedPartner && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground">Goal</label>
                      <select
                        value={duelGoal}
                        onChange={(e) => setDuelGoal(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                      >
                        <option value="workouts">Workouts</option>
                        <option value="xp">XP</option>
                        <option value="streak">Streak Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Target</label>
                      <input
                        type="number"
                        value={duelAmount}
                        onChange={(e) => setDuelAmount(parseInt(e.target.value) || 1)}
                        min={1}
                        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Days</label>
                      <input
                        type="number"
                        value={duelDays}
                        onChange={(e) => setDuelDays(parseInt(e.target.value) || 1)}
                        min={1}
                        max={30}
                        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                  <button
                    onClick={createDuel}
                    disabled={creating}
                    className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 min-h-[44px]"
                  >
                    {creating ? "Creating..." : "Start Duel"}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duels List */}
      {duels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center">
          <Swords className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {partners.length > 0
              ? "No active duels — challenge a partner!"
              : "Add a partner first to start dueling"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {duels.map((duel) => {
            const isChallenger = duel.challenger_id === userId;
            const myProgress = isChallenger ? duel.challenger_progress : duel.opponent_progress;
            const theirProgress = isChallenger ? duel.opponent_progress : duel.challenger_progress;
            const opponentName = isChallenger ? duel.opponent_name : duel.challenger_name;
            const goal = duel.challenge?.goal_amount ?? 5;
            const myPct = Math.min(100, (myProgress / goal) * 100);
            const theirPct = Math.min(100, (theirProgress / goal) * 100);
            const iWon = duel.winner_id === userId;
            const theyWon = duel.winner_id && duel.winner_id !== userId;

            return (
              <div
                key={duel.id}
                className={`rounded-2xl border p-4 ${
                  iWon ? "border-green-500/30 bg-green-500/5" :
                  theyWon ? "border-red-500/30 bg-red-500/5" :
                  "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">
                    vs {opponentName}
                  </p>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    duel.status === "completed"
                      ? iWon ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                      : "bg-blue-500/10 text-blue-600"
                  }`}>
                    {duel.status === "completed" ? (
                      iWon ? <><CheckCircle className="h-3 w-3" /> Won!</> : <><XCircle className="h-3 w-3" /> Lost</>
                    ) : (
                      <><Clock className="h-3 w-3" /> Active</>
                    )}
                  </span>
                </div>

                {/* Progress bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-medium">You: {myProgress}/{goal}</span>
                      <span className="text-muted-foreground">{Math.round(myPct)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${myPct}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground">Them: {theirProgress}/{goal}</span>
                      <span className="text-muted-foreground">{Math.round(theirPct)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-muted-foreground/30"
                        initial={{ width: 0 }}
                        animate={{ width: `${theirPct}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
