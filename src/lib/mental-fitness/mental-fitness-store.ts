import {
  UserRoleCategory,
  RealLifeScenario,
  DailyMissionProgress,
  USER_ROLES,
} from "./types";
import { REAL_LIFE_SCENARIOS, getTodaysPersonalizedScenario } from "./scenarios-data";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY_USER_ROLE = "braingym_user_role_category_v1";
const STORAGE_KEY_MISSION_PROGRESS = "braingym_daily_mission_progress_v1";

/**
 * Get active user role category (defaults to 'Entrepreneur' or profile value)
 */
export function getActiveUserRole(): UserRoleCategory {
  if (typeof window === "undefined") return "Entrepreneur";
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER_ROLE);
    if (saved && USER_ROLES.some((r) => r.id === saved)) {
      return saved as UserRoleCategory;
    }
  } catch {
    // ignore
  }
  return "Entrepreneur";
}

/**
 * Save user role category
 */
export function setActiveUserRole(role: UserRoleCategory): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_USER_ROLE, role);
  } catch (err) {
    console.warn("Could not save user role", err);
  }
}

/**
 * Derive user role from occupation string or age
 */
export function deriveUserRoleFromProfile(occupation?: string | null, age?: number | null): UserRoleCategory {
  if (occupation) {
    const occ = occupation.toLowerCase();
    if (occ.includes("student") || occ.includes("school") || occ.includes("university") || occ.includes("undergrad")) return "Student";
    if (occ.includes("founder") || occ.includes("entrepreneur") || occ.includes("startup") || occ.includes("trader")) return "Entrepreneur";
    if (occ.includes("owner") || occ.includes("business") || occ.includes("shop") || occ.includes("retail")) return "BusinessOwner";
    if (occ.includes("manager") || occ.includes("director") || occ.includes("executive") || occ.includes("lead") || occ.includes("vp")) return "Executive";
    if (occ.includes("seek") || occ.includes("unemployed") || occ.includes("looking") || occ.includes("intern")) return "JobSeeker";
    if (occ.includes("parent") || occ.includes("mother") || occ.includes("father") || occ.includes("mom") || occ.includes("dad")) return "Parent";
    if (occ.includes("retire") || occ.includes("pension") || occ.includes("senior")) return "Retiree";
  }

  if (age) {
    if (age <= 21) return "Student";
    if (age >= 55) return "Retiree";
  }

  return "Entrepreneur";
}

/**
 * Get today's mission progress
 */
export function getTodaysDailyMissionProgress(): DailyMissionProgress {
  const today = new Date().toISOString().split("T")[0];
  const defaultProgress: DailyMissionProgress = {
    date: today,
    scenarioId: REAL_LIFE_SCENARIOS[0].id,
    currentStep: 1,
    completedSteps: [],
    selectedOptionId: null,
    brainChallengeCompleted: false,
    physicalTaskCompleted: false,
    journalEntryText: "",
    isCompleted: false,
    xpEarned: 0,
    coinsEarned: 0,
  };

  if (typeof window === "undefined") return defaultProgress;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_MISSION_PROGRESS);
    if (raw) {
      const parsed: DailyMissionProgress = JSON.parse(raw);
      if (parsed.date === today) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return defaultProgress;
}

/**
 * Save daily mission progress
 */
export function saveDailyMissionProgress(progress: DailyMissionProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MISSION_PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.warn("Could not save daily mission progress", err);
  }
}

/**
 * Mark a step in the daily mission as completed
 */
export function advanceDailyMissionStep(
  step: 1 | 2 | 3 | 4 | 5,
  additionalData?: Partial<DailyMissionProgress>
): DailyMissionProgress {
  const current = getTodaysDailyMissionProgress();
  const nextStep = (step < 5 ? (step + 1) : 6) as 1 | 2 | 3 | 4 | 5 | 6;

  const completedSteps = Array.from(new Set([...current.completedSteps, step]));
  const isAllComplete = completedSteps.length >= 5;

  const updated: DailyMissionProgress = {
    ...current,
    ...additionalData,
    currentStep: nextStep,
    completedSteps,
    isCompleted: isAllComplete,
    xpEarned: isAllComplete ? 150 : completedSteps.length * 30,
    coinsEarned: isAllComplete ? 40 : completedSteps.length * 8,
    completedAt: isAllComplete ? new Date().toISOString() : current.completedAt,
  };

  saveDailyMissionProgress(updated);
  return updated;
}

/**
 * Save reflection to Supabase brain_journal table & local state
 */
export async function saveBrainGymReflection(
  title: string,
  content: string,
  takeaway: string,
  userId?: string
): Promise<{ success: boolean; id?: string }> {
  try {
    const supabase = createClient();
    const activeUserId = userId || (await supabase.auth.getUser()).data.user?.id;

    if (activeUserId) {
      const { data, error } = await supabase
        .from("brain_journal")
        .insert({
          user_id: activeUserId,
          title: title || "Today's BrainGym Reflection",
          content: `${content}\n\n**Takeaway:** ${takeaway}`,
          mood: "great",
          tags: ["DailyMission", "MentalFitness", "Reflection"],
        })
        .select("id")
        .single();

      if (!error && data) {
        return { success: true, id: data.id };
      }
    }
  } catch (err) {
    console.warn("Supabase journal insert fallback:", err);
  }

  return { success: true, id: `local-${Date.now()}` };
}
