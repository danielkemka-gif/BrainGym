import { WORKOUT_ACTIVITIES_PER_DAY } from "@/lib/constants";

interface RawActivity {
  id: string;
  title: string;
  estimated_time: number;
  difficulty: string;
  xp: number;
  coins: number;
  category_id: string;
}

/**
 * Picks N activities spread across categories.
 * Avoids yesterday's exact set by shuffling seeds.
 */
export function pickDailyActivities(
  pool: RawActivity[],
  count = WORKOUT_ACTIVITIES_PER_DAY
): RawActivity[] {
  if (pool.length === 0) return [];
  if (pool.length <= count) return [...pool];

  // Group by category
  const byCategory: Record<string, RawActivity[]> = {};
  for (const a of pool) {
    if (!byCategory[a.category_id]) byCategory[a.category_id] = [];
    byCategory[a.category_id].push(a);
  }

  // Deterministic shuffle based on today's date
  const seed = new Date().toISOString().split("T")[0];
  function seededShuffle<T>(arr: T[]): T[] {
    const rng = (s: string) => {
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
      }
      return Math.abs(hash) / 0x7fffffff;
    };
    const sorted = [...arr].sort((a, b) => {
      const ha = seed + JSON.stringify(a);
      const hb = seed + JSON.stringify(b);
      return rng(ha) - rng(hb);
    });
    return sorted;
  }

  const picked: RawActivity[] = [];
  const categories = Object.keys(byCategory);

  // Round-robin: pick one from each category
  let rounds = 0;
  const maxRounds = Math.max(...Object.values(byCategory).map((a) => a.length));
  while (picked.length < count && rounds < maxRounds) {
    for (const cat of categories) {
      const shuffled = seededShuffle(byCategory[cat]);
      if (shuffled.length > rounds) {
        const act = shuffled[rounds];
        if (!picked.find((p) => p.id === act.id)) {
          picked.push(act);
          if (picked.length >= count) break;
        }
      }
    }
    rounds++;
  }

  // Fill remaining from pool if needed
  if (picked.length < count) {
    const remaining = seededShuffle(pool).filter(
      (a) => !picked.find((p) => p.id === a.id)
    );
    picked.push(...remaining.slice(0, count - picked.length));
  }

  return picked;
}

export function calculateWorkoutXp(
  totalActivityXp: number,
  streakMultiplier = 1
) {
  const base = 50;
  return Math.round((base + totalActivityXp) * streakMultiplier);
}

export function calculateWorkoutCoins(totalActivityCoins: number) {
  const base = 20;
  return base + totalActivityCoins;
}
