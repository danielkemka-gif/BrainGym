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
 * Age-aware difficulty preferences.
 * Teens: lean beginner/intermediate (more fun, less pressure)
 * Young adults: balanced mix (career growth focus)
 * Adults: lean intermediate/advanced (efficiency focus)
 * Seniors: lean beginner/intermediate (health + memory focus)
 */
const AGE_DIFFICULTY_WEIGHTS: Record<string, Record<string, number>> = {
  teen: { beginner: 3, intermediate: 2, advanced: 1 },
  young_adult: { beginner: 1, intermediate: 2, advanced: 2 },
  adult: { beginner: 1, intermediate: 2, advanced: 3 },
  senior: { beginner: 3, intermediate: 2, advanced: 1 },
};

/**
 * Picks N activities spread across categories.
 * Age-aware: adjusts difficulty mix based on user's age group.
 */
export function pickDailyActivities(
  pool: RawActivity[],
  count = WORKOUT_ACTIVITIES_PER_DAY,
  ageGroup?: string
): RawActivity[] {
  if (pool.length === 0) return [];
  if (pool.length <= count) return [...pool];

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

  // Apply age-aware difficulty weighting
  const weights = ageGroup ? AGE_DIFFICULTY_WEIGHTS[ageGroup] : null;
  let filteredPool = pool;
  if (weights) {
    // Create weighted pool: repeat activities based on difficulty weight
    const weighted: RawActivity[] = [];
    for (const a of pool) {
      const w = weights[a.difficulty] || 1;
      for (let i = 0; i < w; i++) {
        weighted.push(a);
      }
    }
    filteredPool = weighted;
  }

  // Group by category
  const byCategory: Record<string, RawActivity[]> = {};
  for (const a of filteredPool) {
    if (!byCategory[a.category_id]) byCategory[a.category_id] = [];
    byCategory[a.category_id].push(a);
  }

  const picked: RawActivity[] = [];
  const pickedIds = new Set<string>();
  const categories = Object.keys(byCategory);

  // Round-robin: pick one from each category
  let rounds = 0;
  const maxRounds = Math.max(...Object.values(byCategory).map((a) => a.length));
  while (picked.length < count && rounds < maxRounds) {
    for (const cat of categories) {
      const shuffled = seededShuffle(byCategory[cat]);
      if (shuffled.length > rounds) {
        const act = shuffled[rounds];
        if (!pickedIds.has(act.id)) {
          picked.push(act);
          pickedIds.add(act.id);
          if (picked.length >= count) break;
        }
      }
    }
    rounds++;
  }

  // Fill remaining from pool if needed
  if (picked.length < count) {
    const remaining = seededShuffle(pool).filter(
      (a) => !pickedIds.has(a.id)
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
