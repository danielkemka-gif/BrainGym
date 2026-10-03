// ─────────────────────────────────────────────────────────────────────────────
// BRAINGYM INTELLIGENT DAILY TASK SELECTION & ANTI-REPETITION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

import {
  DailyFitnessTask,
  UserDailyTaskAssignment,
  CognitivePillar,
  TaskDifficultyLevel,
} from "./types";
import { getFullTaskLibrary, getTaskById } from "./task-generator-repository";
import { createClient } from "@/lib/supabase/client";

const LOCAL_STORAGE_ASSIGNMENTS_KEY = "braingym_user_daily_assignments_v2";
const LOCAL_STORAGE_COMPLETED_KEY = "braingym_user_completed_tasks_history_v2";

/**
 * Deterministic calendar date formatter with timezone fallback (e.g. Africa/Lagos / UTC+1).
 */
export function getDeterministicDateString(timeZone = "Africa/Lagos"): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date()); // Formats to "YYYY-MM-DD"
  } catch {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}

/**
 * 7-Day Cognitive Domain Weekly Rotation Matrix:
 * Ensures users get a balanced, varied workout routine throughout the week.
 */
const DAY_OF_WEEK_DOMAINS: Record<number, CognitivePillar[]> = {
  0: ["emotional_intelligence", "strategic_thinking"], // Sunday
  1: ["focus", "logic"],                               // Monday
  2: ["memory", "observation"],                         // Tuesday
  3: ["decision_making", "critical_thinking"],         // Wednesday
  4: ["problem_solving", "logic"],                     // Thursday
  5: ["creativity", "speed"],                          // Friday
  6: ["strategic_thinking", "focus"],                  // Saturday
};

/**
 * Get user's completed task history.
 */
export function getCompletedTaskIds(userId?: string | null): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_COMPLETED_KEY}_${userId || "anon"}`);
    if (raw) {
      const parsed: string[] = JSON.parse(raw);
      return new Set(parsed);
    }
  } catch (e) {
    console.warn("Could not read completed task history", e);
  }

  return new Set();
}

/**
 * Record a task as completed in local storage.
 */
export function recordCompletedTaskId(taskId: string, userId?: string | null) {
  if (typeof window === "undefined") return;

  try {
    const existing = getCompletedTaskIds(userId);
    existing.add(taskId);
    localStorage.setItem(
      `${LOCAL_STORAGE_COMPLETED_KEY}_${userId || "anon"}`,
      JSON.stringify(Array.from(existing))
    );
  } catch (e) {
    console.warn("Could not save completed task ID", e);
  }
}

/**
 * Get stored assignment for today if it exists (Ensures idempotency on refresh).
 */
export function getStoredTodayAssignment(
  todayDate: string,
  userId?: string | null
): UserDailyTaskAssignment | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_ASSIGNMENTS_KEY}_${userId || "anon"}`);
    if (raw) {
      const assignments: Record<string, UserDailyTaskAssignment> = JSON.parse(raw);
      if (assignments[todayDate]) {
        return assignments[todayDate];
      }
    }
  } catch (e) {
    console.warn("Could not parse stored daily assignments", e);
  }

  return null;
}

/**
 * Save an assignment to local storage.
 */
export function saveTodayAssignment(
  assignment: UserDailyTaskAssignment,
  userId?: string | null
) {
  if (typeof window === "undefined") return;

  try {
    const key = `${LOCAL_STORAGE_ASSIGNMENTS_KEY}_${userId || "anon"}`;
    const raw = localStorage.getItem(key);
    const assignments: Record<string, UserDailyTaskAssignment> = raw ? JSON.parse(raw) : {};
    assignments[assignment.assignmentDate] = assignment;
    localStorage.setItem(key, JSON.stringify(assignments));
  } catch (e) {
    console.warn("Could not save today assignment", e);
  }
}

/**
 * PRIMARY ENTRY POINT: Get Today's Assigned BrainGym Daily Challenge.
 * 
 * Rules:
 * 1. Idempotency: If today's task is already assigned, return it immediately.
 * 2. Anti-Repetition: Exclude all tasks previously completed by this user.
 * 3. Daily Rotation: Rotate domains according to the day of week.
 * 4. Adaptive Level: Match user's difficulty level (1 to 5).
 */
export async function getTodaysAssignedDailyTask(
  userId?: string | null,
  userLevel: TaskDifficultyLevel = 3,
  timeZone = "Africa/Lagos"
): Promise<{ task: DailyFitnessTask; assignment: UserDailyTaskAssignment; isCompletedToday: boolean }> {
  const todayDate = getDeterministicDateString(timeZone);

  // 1. Check local storage for today's assignment first (Fastest path, zero latency)
  const storedLocal = getStoredTodayAssignment(todayDate, userId);
  if (storedLocal && storedLocal.taskSnapshot) {
    return {
      task: storedLocal.taskSnapshot,
      assignment: storedLocal,
      isCompletedToday: storedLocal.status === "completed",
    };
  }

  // 2. Check Supabase user_daily_task_assignments if online & authenticated
  if (userId) {
    try {
      const supabase = createClient();
      const { data: remoteAssignment } = await supabase
        .from("user_daily_task_assignments")
        .select("*")
        .eq("user_id", userId)
        .eq("assignment_date", todayDate)
        .maybeSingle();

      if (remoteAssignment) {
        const matchingTask = getTaskById(remoteAssignment.task_id);
        if (matchingTask) {
          const assignment: UserDailyTaskAssignment = {
            id: remoteAssignment.id,
            userId,
            taskId: remoteAssignment.task_id,
            assignmentDate: todayDate,
            status: remoteAssignment.status,
            score: remoteAssignment.score || 0,
            xpEarned: remoteAssignment.xp_earned || 0,
            coinsEarned: remoteAssignment.coins_earned || 0,
            startedAt: remoteAssignment.started_at,
            completedAt: remoteAssignment.completed_at,
            taskSnapshot: matchingTask,
          };
          saveTodayAssignment(assignment, userId);
          return {
            task: matchingTask,
            assignment,
            isCompletedToday: assignment.status === "completed",
          };
        }
      }
    } catch (err) {
      console.warn("Supabase assignment fetch fallback:", err);
    }
  }

  // 3. New Task Assignment: Select an uncompleted task matching day & level
  const fullLibrary = getFullTaskLibrary();
  const completedIds = getCompletedTaskIds(userId);

  // Filter candidate pool by excluding completed tasks
  let candidatePool = fullLibrary.filter((t) => !completedIds.has(t.id));

  // If candidate pool is exhausted, reset pool to full library
  if (candidatePool.length === 0) {
    candidatePool = fullLibrary;
  }

  // Day of week domain focus
  const dayOfWeek = new Date().getDay();
  const preferredDomains = DAY_OF_WEEK_DOMAINS[dayOfWeek] || ["focus", "logic"];

  // Match domain and level
  let filtered = candidatePool.filter(
    (t) => preferredDomains.includes(t.category) && Math.abs(t.difficulty - userLevel) <= 1
  );

  if (filtered.length === 0) {
    filtered = candidatePool.filter((t) => preferredDomains.includes(t.category));
  }

  if (filtered.length === 0) {
    filtered = candidatePool;
  }

  // Deterministic seed based on date and user ID
  let seedNum = 0;
  const seedString = `${todayDate}_${userId || "anon_user"}`;
  for (let i = 0; i < seedString.length; i++) {
    seedNum = (seedNum << 5) - seedNum + seedString.charCodeAt(i);
    seedNum |= 0;
  }
  const selectedIndex = Math.abs(seedNum) % filtered.length;
  const chosenTask = filtered[selectedIndex];

  // 4. Create and persist new assignment
  const newAssignment: UserDailyTaskAssignment = {
    id: `assign-${todayDate}-${chosenTask.id}`,
    userId: userId || "anon",
    taskId: chosenTask.id,
    assignmentDate: todayDate,
    status: "assigned",
    score: 0,
    xpEarned: chosenTask.xpReward,
    coinsEarned: chosenTask.coinReward,
    startedAt: new Date().toISOString(),
    taskSnapshot: chosenTask,
  };

  saveTodayAssignment(newAssignment, userId);

  // Sync to Supabase in background
  if (userId) {
    try {
      const supabase = createClient();
      supabase
        .from("user_daily_task_assignments")
        .upsert(
          {
            user_id: userId,
            task_id: chosenTask.id,
            assignment_date: todayDate,
            status: "assigned",
            xp_earned: chosenTask.xpReward,
            coins_earned: chosenTask.coinReward,
            started_at: new Date().toISOString(),
          },
          { onConflict: "user_id,assignment_date" }
        )
        .then(() => {});
    } catch (err) {
      console.warn("Supabase background sync:", err);
    }
  }

  return {
    task: chosenTask,
    assignment: newAssignment,
    isCompletedToday: false,
  };
}

/**
 * Mark today's assigned task as completed.
 */
export async function completeAssignedDailyTask(
  userId: string | null | undefined,
  taskId: string,
  score = 100,
  timeZone = "Africa/Lagos"
): Promise<UserDailyTaskAssignment> {
  const todayDate = getDeterministicDateString(timeZone);
  const task = getTaskById(taskId);
  const xpReward = task?.xpReward || 50;
  const coinReward = task?.coinReward || 20;

  recordCompletedTaskId(taskId, userId);

  const completedAssignment: UserDailyTaskAssignment = {
    id: `assign-${todayDate}-${taskId}`,
    userId: userId || "anon",
    taskId,
    assignmentDate: todayDate,
    status: "completed",
    score,
    xpEarned: xpReward,
    coinsEarned: coinReward,
    completedAt: new Date().toISOString(),
    taskSnapshot: task || ({} as DailyFitnessTask),
  };

  saveTodayAssignment(completedAssignment, userId);

  // Persist to Supabase
  if (userId) {
    try {
      const supabase = createClient();
      await supabase
        .from("user_daily_task_assignments")
        .upsert(
          {
            user_id: userId,
            task_id: taskId,
            assignment_date: todayDate,
            status: "completed",
            score,
            xp_earned: xpReward,
            coins_earned: coinReward,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,assignment_date" }
        );

      // Award XP to profiles table and xp_ledger
      await supabase.from("xp_ledger").insert({
        user_id: userId,
        amount: xpReward,
        source_type: "daily_challenge_complete",
        source_id: taskId,
        description: `Completed AKUCHE Daily: ${task?.title || taskId}`,
      });

      const { data: prof } = await supabase
        .from("profiles")
        .select("total_xp, coins, current_streak")
        .eq("user_id", userId)
        .single();

      if (prof) {
        await supabase
          .from("profiles")
          .update({
            total_xp: (prof.total_xp || 0) + xpReward,
            coins: (prof.coins || 0) + coinReward,
            current_streak: (prof.current_streak || 7) + 1,
          })
          .eq("user_id", userId);
      }
    } catch (err) {
      console.warn("Supabase completion sync fallback:", err);
    }
  }

  return completedAssignment;
}
