import { BRAIN_UNIVERSE_DROPS } from "./content-library";
import { DailyBrainDrop } from "./types";
import { createClient } from "@/lib/supabase/client";

const INTERACTION_STORAGE_KEY = "braingym_brain_drop_interactions_v1";

export interface DropInteractionState {
  viewedDropIds: string[];
  completedMissionIds: string[];
  solvedMicroChallengeIds: string[];
  lastViewedDate: string;
}

export function getDropInteractionState(): DropInteractionState {
  if (typeof window === "undefined") {
    return {
      viewedDropIds: [],
      completedMissionIds: [],
      solvedMicroChallengeIds: [],
      lastViewedDate: new Date().toISOString().split("T")[0],
    };
  }
  try {
    const raw = localStorage.getItem(INTERACTION_STORAGE_KEY);
    if (!raw) {
      return {
        viewedDropIds: [],
        completedMissionIds: [],
        solvedMicroChallengeIds: [],
        lastViewedDate: new Date().toISOString().split("T")[0],
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      viewedDropIds: [],
      completedMissionIds: [],
      solvedMicroChallengeIds: [],
      lastViewedDate: new Date().toISOString().split("T")[0],
    };
  }
}

export function saveDropInteractionState(state: DropInteractionState) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(INTERACTION_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }
}

export function getTodaysDailyBrainDrop(
  userGoals?: string[],
  weakDomain?: string
): DailyBrainDrop {
  const drops = BRAIN_UNIVERSE_DROPS;
  const todayStr = new Date().toISOString().split("T")[0];
  
  // Calculate deterministic day-of-year seed
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = (hash << 5) - hash + todayStr.charCodeAt(i);
    hash |= 0;
  }
  const daySeed = Math.abs(hash);

  // If user has specific weak domain, attempt to prioritize relevant drop
  if (weakDomain) {
    const matchingDomainDrops = drops.filter(
      (d) => d.relatedWorkoutDomain.toLowerCase() === weakDomain.toLowerCase()
    );
    if (matchingDomainDrops.length > 0) {
      return matchingDomainDrops[daySeed % matchingDomainDrops.length];
    }
  }

  // Otherwise pick from library according to day seed
  return drops[daySeed % drops.length];
}

export async function recordMissionCompletion(
  drop: DailyBrainDrop,
  userId?: string
): Promise<{ success: boolean; xpAwarded: number }> {
  const state = getDropInteractionState();
  if (!state.completedMissionIds.includes(drop.id)) {
    state.completedMissionIds.push(drop.id);
    saveDropInteractionState(state);
  }

  const xpAwarded = drop.useItToday.xpReward;

  if (userId) {
    try {
      const supabase = createClient();
      await supabase.from("xp_ledger").insert({
        user_id: userId,
        amount: xpAwarded,
        source_type: "daily_brain_mission",
        source_id: drop.id,
        description: `Completed Daily Brain Mission: ${drop.useItToday.action}`,
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("total_xp")
        .eq("user_id", userId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ total_xp: (profile.total_xp || 0) + xpAwarded })
          .eq("user_id", userId);
      }
    } catch (err) {
      console.warn("Mission XP sync fallback:", err);
    }
  }

  return { success: true, xpAwarded };
}
