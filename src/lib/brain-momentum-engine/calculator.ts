import {
  BrainMomentumState,
  CognitiveDomain,
  DomainPerformance,
  MomentumTier,
  UserCognitiveProfile,
} from "./types";

export const COGNITIVE_DOMAINS: CognitiveDomain[] = [
  "Memory",
  "Focus",
  "Processing Speed",
  "Attention",
  "Problem Solving",
  "Reaction Time",
  "Working Memory",
];

export function getMomentumTier(score: number): {
  tier: MomentumTier;
  tierLabel: string;
  tierDescription: string;
} {
  if (score >= 85) {
    return {
      tier: "peak",
      tierLabel: "Peak Momentum",
      tierDescription: "Your neural training rhythm and consistency are operating at maximum velocity.",
    };
  }
  if (score >= 70) {
    return {
      tier: "strong",
      tierLabel: "Strong Momentum",
      tierDescription: "You have built formidable training momentum and cognitive adaptability this week.",
    };
  }
  if (score >= 50) {
    return {
      tier: "good",
      tierLabel: "Good Momentum",
      tierDescription: "Solid cognitive rhythm with steady performance across multiple training sessions.",
    };
  }
  if (score >= 30) {
    return {
      tier: "building",
      tierLabel: "Building Momentum",
      tierDescription: "Your daily habit is taking root. A few more consistent sessions will propel your momentum.",
    };
  }
  return {
    tier: "getting_started",
    tierLabel: "Getting Started",
    tierDescription: "Complete today's workout to start building your cognitive momentum.",
  };
}

export function calculatePersonalBaseline(
  historicalScores: number[],
  fallbackScore: number = 75
): number {
  if (!historicalScores || historicalScores.length === 0) return fallbackScore;
  const sum = historicalScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / historicalScores.length);
}

export function calculateDomainPerformance(
  domain: CognitiveDomain,
  currentScore: number,
  historicalScores: number[]
): DomainPerformance {
  const baselineScore = calculatePersonalBaseline(historicalScores, currentScore || 75);
  const delta = currentScore - baselineScore;
  const trendPercentage = baselineScore > 0 ? Number(((delta / baselineScore) * 100).toFixed(1)) : 0;

  let trend: DomainPerformance["trend"] = "stable";
  if (trendPercentage >= 4) trend = "improving";
  else if (trendPercentage <= -4) trend = "needs_attention";

  const count = historicalScores.length;
  const confidenceLevel =
    count >= 10 ? "high_confidence" : count >= 3 ? "calibrated" : "preliminary";

  return {
    domain,
    currentScore,
    baselineScore,
    trend,
    trendPercentage,
    confidenceLevel,
    recentAttemptsCount: count,
  };
}

export function calculateBrainMomentum(
  profile: Partial<UserCognitiveProfile> & {
    recentScores?: Record<string, number>;
    historicalDomainScores?: Record<string, number[]>;
    weeklyWorkoutsCount?: number;
    challengesCompletedWeekly?: number;
    previousMomentumScore?: number;
  }
): BrainMomentumState {
  const streak = profile.streak ?? 1;
  const weeklyWorkouts = profile.weeklyWorkoutsCount ?? Math.min(7, Math.max(1, streak));
  const challengesWeekly = profile.challengesCompletedWeekly ?? 2;
  const recentScores = profile.recentScores ?? {};
  const historicalScores = profile.historicalDomainScores ?? {};
  const previousScore = profile.previousMomentumScore ?? 72;

  // 1. Consistency Component (0 to 25 points)
  // Rewards weekly frequency and active streak
  const consistencyScore = Math.min(25, Math.round((weeklyWorkouts / 7) * 18 + Math.min(7, streak) * 1));

  // 2. Performance Component (0 to 25 points)
  // Average across all evaluated cognitive domains
  const domainScoreValues = COGNITIVE_DOMAINS.map(
    (d) => recentScores[d] ?? profile.domainScores?.[d] ?? 75
  );
  const avgDomainScore =
    domainScoreValues.reduce((a, b) => a + b, 0) / domainScoreValues.length;
  const performanceScore = Math.min(25, Math.round((avgDomainScore / 100) * 25));

  // 3. Improvement vs Personal Baseline Component (0 to 20 points)
  // Rewards positive trends over historical personal performance
  let baselineDeltasSum = 0;
  COGNITIVE_DOMAINS.forEach((d) => {
    const current = recentScores[d] ?? 75;
    const base = calculatePersonalBaseline(historicalScores[d] ?? [], current);
    baselineDeltasSum += current - base;
  });
  const avgBaselineDelta = baselineDeltasSum / COGNITIVE_DOMAINS.length;
  // Centered at 10 points for 0 delta, scaled +/- up to 20
  const improvementScore = Math.max(0, Math.min(20, Math.round(10 + avgBaselineDelta * 0.8)));

  // 4. Challenge Component (0 to 15 points)
  const challengeScore = Math.min(15, challengesWeekly * 5);

  // 5. Activity & Variety Component (0 to 15 points)
  const activeDomainsCount = COGNITIVE_DOMAINS.filter(
    (d) => (recentScores[d] ?? 0) > 0
  ).length;
  const activityScore = Math.min(15, Math.round((activeDomainsCount / COGNITIVE_DOMAINS.length) * 15));

  // Total Score (0 to 100)
  const rawTotal =
    consistencyScore +
    performanceScore +
    improvementScore +
    challengeScore +
    activityScore;

  const score = Math.max(0, Math.min(100, rawTotal));
  const weeklyDelta = score - previousScore;
  const tierInfo = getMomentumTier(score);

  // Build domain performance profiles
  const domainProfiles: Record<CognitiveDomain, DomainPerformance> = {} as any;
  let highestScore = -1;
  let lowestScore = 999;
  let strongestDomain: CognitiveDomain = "Memory";
  let domainNeedingAttention: CognitiveDomain = "Focus";

  COGNITIVE_DOMAINS.forEach((domain) => {
    const cur = recentScores[domain] ?? profile.domainScores?.[domain] ?? 75;
    const history = historicalScores[domain] ?? [cur];
    const perf = calculateDomainPerformance(domain, cur, history);
    domainProfiles[domain] = perf;

    if (cur > highestScore) {
      highestScore = cur;
      strongestDomain = domain;
    }
    if (cur < lowestScore) {
      lowestScore = cur;
      domainNeedingAttention = domain;
    }
  });

  // Construct specific why reasons
  const reasons: string[] = [];
  if (weeklyWorkouts >= 4) {
    reasons.push(`Maintained high workout consistency (${weeklyWorkouts} sessions this week)`);
  } else {
    reasons.push(`Logging ${4 - weeklyWorkouts} more session(s) will unlock a +8 momentum surge`);
  }

  const strongestPerf = domainProfiles[strongestDomain];
  if (strongestPerf && strongestPerf.trendPercentage > 0) {
    reasons.push(`${strongestDomain} performance is +${strongestPerf.trendPercentage}% above your personal baseline`);
  } else {
    reasons.push(`${strongestDomain} remains your most solid domain`);
  }

  if (challengesWeekly > 0) {
    reasons.push(`Completed ${challengesWeekly} high-difficulty challenges`);
  }

  const attentionPerf = domainProfiles[domainNeedingAttention];
  if (attentionPerf && attentionPerf.trend === "needs_attention") {
    reasons.push(`${domainNeedingAttention} is ${Math.abs(attentionPerf.trendPercentage)}% below your normal range`);
  }

  return {
    score,
    previousScore,
    weeklyDelta,
    tier: tierInfo.tier,
    tierLabel: tierInfo.tierLabel,
    tierDescription: tierInfo.tierDescription,
    reasons,
    components: {
      consistency: consistencyScore,
      performance: performanceScore,
      improvement: improvementScore,
      challenge: challengeScore,
      activity: activityScore,
    },
    domainProfiles,
    strongestDomain,
    domainNeedingAttention,
    lastCalculatedAt: new Date().toISOString(),
  };
}
