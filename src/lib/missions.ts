import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";

export interface MissionTemplate {
  mission_type: string;
  title: string;
  description: string;
  icon: string;
  target_value: number;
  xp_reward: number;
  coin_reward: number;
  min_level: number;
}

export interface UserMission {
  id: string;
  user_id: string;
  mission_type: string;
  title: string;
  description: string | null;
  icon: string | null;
  target_value: number;
  current_value: number;
  xp_reward: number;
  coin_reward: number;
  week_start: string;
  completed: boolean;
  claimed: boolean;
  created_at: string;
}

const MISSION_TEMPLATES: MissionTemplate[] = [
  {
    mission_type: "activity_count",
    title: "Activity Explorer",
    description: "Complete {target} activities this week",
    icon: "target",
    target_value: 3,
    xp_reward: 75,
    coin_reward: 25,
    min_level: 1,
  },
  {
    mission_type: "activity_count",
    title: "Brain Burner",
    description: "Complete {target} activities this week",
    icon: "flame",
    target_value: 7,
    xp_reward: 150,
    coin_reward: 50,
    min_level: 2,
  },
  {
    mission_type: "activity_count",
    title: "Marathon Mind",
    description: "Complete {target} activities this week",
    icon: "timer",
    target_value: 15,
    xp_reward: 350,
    coin_reward: 100,
    min_level: 4,
  },
  {
    mission_type: "xp_earned",
    title: "XP Hunter",
    description: "Earn {target} XP this week",
    icon: "star",
    target_value: 100,
    xp_reward: 50,
    coin_reward: 20,
    min_level: 1,
  },
  {
    mission_type: "xp_earned",
    title: "XP Grinder",
    description: "Earn {target} XP this week",
    icon: "diamond",
    target_value: 500,
    xp_reward: 125,
    coin_reward: 50,
    min_level: 2,
  },
  {
    mission_type: "xp_earned",
    title: "XP Legend",
    description: "Earn {target} XP this week",
    icon: "crown",
    target_value: 1500,
    xp_reward: 300,
    coin_reward: 100,
    min_level: 5,
  },
  {
    mission_type: "streak_maintain",
    title: "Consistency King",
    description: "Maintain a {target}-day streak",
    icon: "flame",
    target_value: 3,
    xp_reward: 60,
    coin_reward: 20,
    min_level: 1,
  },
  {
    mission_type: "streak_maintain",
    title: "Unstoppable",
    description: "Maintain a {target}-day streak",
    icon: "zap",
    target_value: 5,
    xp_reward: 120,
    coin_reward: 40,
    min_level: 2,
  },
  {
    mission_type: "streak_maintain",
    title: "Streak Master",
    description: "Maintain a {target}-day streak",
    icon: "award",
    target_value: 7,
    xp_reward: 250,
    coin_reward: 75,
    min_level: 4,
  },
  {
    mission_type: "workout_count",
    title: "Workout Warrior",
    description: "Complete {target} daily workouts",
    icon: "dumbbell",
    target_value: 3,
    xp_reward: 80,
    coin_reward: 30,
    min_level: 1,
  },
  {
    mission_type: "workout_count",
    title: "Workout Machine",
    description: "Complete {target} daily workouts",
    icon: "dumbbell",
    target_value: 5,
    xp_reward: 180,
    coin_reward: 60,
    min_level: 3,
  },
  {
    mission_type: "category_variety",
    title: "Renaissance Mind",
    description: "Try {target} different categories",
    icon: "palette",
    target_value: 3,
    xp_reward: 90,
    coin_reward: 35,
    min_level: 1,
  },
  {
    mission_type: "category_variety",
    title: "Polymath",
    description: "Try {target} different categories",
    icon: "layers",
    target_value: 5,
    xp_reward: 200,
    coin_reward: 70,
    min_level: 3,
  },
  {
    mission_type: "category_variety",
    title: "Renaissance Human",
    description: "Try all {target} categories",
    icon: "sparkles",
    target_value: 7,
    xp_reward: 350,
    coin_reward: 120,
    min_level: 5,
  },
  {
    mission_type: "quiz_accuracy",
    title: "Sharpshooter",
    description: "Complete a quiz with {target}%+ accuracy",
    icon: "target",
    target_value: 80,
    xp_reward: 100,
    coin_reward: 40,
    min_level: 2,
  },
  {
    mission_type: "quiz_accuracy",
    title: "Perfectionist",
    description: "Complete a quiz with {target}%+ accuracy",
    icon: "star",
    target_value: 90,
    xp_reward: 200,
    coin_reward: 75,
    min_level: 3,
  },
];

function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

function getUserLevel(totalXp: number): number {
  const levels = [
    0, 500, 1500, 4000, 10000, 20000, 35000, 55000, 80000, 120000, 170000,
    230000, 300000, 400000, 500000,
  ];
  let level = 1;
  for (let i = 0; i < levels.length; i++) {
    if (totalXp >= levels[i]) level = i + 1;
  }
  return level;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function generateWeeklyMissions(): Promise<UserMission[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const weekStart = getCurrentWeekStart();

  const { data: existing } = await supabase
    .from("user_missions")
    .select("id")
    .eq("user_id", user.id)
    .eq("week_start", weekStart)
    .limit(1);

  if (existing && existing.length > 0) return [];

  const { data: levelData } = await supabase
    .from("user_levels")
    .select("total_xp")
    .eq("user_id", user.id)
    .single();

  const userLevel = getUserLevel(levelData?.total_xp ?? 0);

  const eligible = MISSION_TEMPLATES.filter((t) => t.min_level <= userLevel);
  const shuffled = shuffle(eligible);
  const selected = shuffled.slice(0, Math.min(6, shuffled.length));

  const missionsToInsert = selected.map((t) => ({
    user_id: user.id,
    mission_type: t.mission_type,
    title: t.title,
    description: t.description.replace("{target}", String(t.target_value)),
    icon: t.icon,
    target_value: t.target_value,
    current_value: 0,
    xp_reward: t.xp_reward,
    coin_reward: t.coin_reward,
    week_start: weekStart,
  }));

  const { data: inserted, error } = await supabase
    .from("user_missions")
    .insert(missionsToInsert)
    .select();

  if (error) {
    console.error("Failed to generate missions:", error);
    return [];
  }

  return (inserted as UserMission[]) ?? [];
}

export async function fetchWeeklyMissions(): Promise<UserMission[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const weekStart = getCurrentWeekStart();

  const { data } = await supabase
    .from("user_missions")
    .select("*")
    .eq("user_id", user.id)
    .eq("week_start", weekStart)
    .order("created_at", { ascending: true });

  return (data as UserMission[]) ?? [];
}

export async function refreshMissionProgress(): Promise<UserMission[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const weekStart = getCurrentWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const missions = await fetchWeeklyMissions();
  if (missions.length === 0) return [];

  const updates: PromiseLike<unknown>[] = [];

  for (const mission of missions) {
    if (mission.completed) continue;

    let currentValue = 0;

    switch (mission.mission_type) {
      case "activity_count": {
        const { count } = await supabase
          .from("activity_logs")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("date", weekStart)
          .lt("date", weekEnd.toISOString().split("T")[0]);
        currentValue = count ?? 0;
        break;
      }
      case "xp_earned": {
        const { data: xpRows } = await supabase
          .from("xp_ledger")
          .select("amount")
          .eq("user_id", user.id)
          .gt("amount", 0)
          .gte("created_at", weekStart + "T00:00:00Z")
          .lt("created_at", weekEnd.toISOString());
        currentValue = (xpRows ?? []).reduce((sum, r) => sum + r.amount, 0);
        break;
      }
      case "streak_maintain": {
        const { data: streak } = await supabase
          .from("streaks")
          .select("current_streak")
          .eq("user_id", user.id)
          .maybeSingle();
        currentValue = streak?.current_streak ?? 0;
        break;
      }
      case "workout_count": {
        const { count } = await supabase
          .from("daily_workouts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "completed")
          .gte("date", weekStart)
          .lt("date", weekEnd.toISOString().split("T")[0]);
        currentValue = count ?? 0;
        break;
      }
      case "category_variety": {
        const { data: logs } = await supabase
          .from("activity_logs")
          .select("activity_id, activities(category_id)")
          .eq("user_id", user.id)
          .gte("date", weekStart)
          .lt("date", weekEnd.toISOString().split("T")[0]);
        const cats = new Set(
          (logs ?? []).map(
            (l: Record<string, unknown>) =>
              (l.activities as Record<string, unknown>)?.category_id as string
          ).filter(Boolean)
        );
        currentValue = cats.size;
        break;
      }
      case "quiz_accuracy": {
        const { data: scores } = await supabase
          .from("brain_scores")
          .select("score")
          .eq("user_id", user.id)
          .gte(
            "date",
            weekStart
          )
          .lt("date", weekEnd.toISOString().split("T")[0]);
        const maxScore = (scores ?? []).reduce(
          (max, s) => Math.max(max, s.score),
          0
        );
        currentValue = maxScore;
        break;
      }
    }

    const newCompleted = currentValue >= mission.target_value;

    if (currentValue !== mission.current_value || newCompleted !== mission.completed) {
      updates.push(
        supabase
          .from("user_missions")
          .update({
            current_value: Math.min(currentValue, mission.target_value),
            completed: newCompleted,
          })
          .eq("id", mission.id)
          .then(() => {})
      );
    }
  }

  await Promise.all(updates.map((u) => Promise.resolve(u)));

  return fetchWeeklyMissions();
}

export async function claimMissionReward(
  missionId: string
): Promise<{ success: boolean; xp?: number; coins?: number; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in" };

  const { data: mission } = await supabase
    .from("user_missions")
    .select("*")
    .eq("id", missionId)
    .eq("user_id", user.id)
    .single();

  if (!mission) return { success: false, error: "Mission not found" };
  if (!mission.completed) return { success: false, error: "Mission not completed" };
  if (mission.claimed) return { success: false, error: "Already claimed" };

  const xpAmount = mission.xp_reward;
  const coinAmount = mission.coin_reward;

  // Award rewards via grant_xp and grant_coins RPCs
  try {
    await supabase.rpc("grant_xp", {
      p_user_id: user.id,
      p_amount: xpAmount,
      p_reason: `mission_${mission.mission_type}`,
      p_reference_type: "user_missions",
      p_reference_id: mission.id,
    });
    await supabase.rpc("grant_coins", {
      p_user_id: user.id,
      p_amount: coinAmount,
      p_reason: `mission_${mission.mission_type}`,
      p_reference_type: "user_missions",
      p_reference_id: mission.id,
    });
  } catch {
    // Fallback direct inserts if RPC not yet deployed
    await Promise.allSettled([
      supabase.from("xp_ledger").insert({
        user_id: user.id,
        amount: xpAmount,
        reason: "mission",
        reference_type: "user_missions",
        reference_id: mission.id,
      }),
      supabase.from("coins_ledger").insert({
        user_id: user.id,
        amount: coinAmount,
        reason: "mission",
        reference_type: "user_missions",
        reference_id: mission.id,
      }),
    ]);
  }

  const { error: updateError } = await supabase
    .from("user_missions")
    .update({ claimed: true })
    .eq("id", mission.id);

  if (updateError) {
    return { success: false, error: "Failed to update mission status" };
  }

  return { success: true, xp: xpAmount, coins: coinAmount };
}

export function getWeekDateRange(weekStart: string): string {
  const start = new Date(weekStart + "T00:00:00Z");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function getDaysRemaining(weekStart: string): number {
  const start = new Date(weekStart + "T00:00:00Z");
  const now = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(7, diff));
}
