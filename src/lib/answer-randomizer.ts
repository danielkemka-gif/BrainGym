/**
 * BRAINGYM ANSWER RANDOMIZATION & POSITION BALANCING ENGINE
 * 
 * Guarantees:
 * 1. Fisher-Yates unbiased shuffling of options at display and workout generation time.
 * 2. Perfect integrity of the correct answer (isCorrect flag and correctAnswer strings remain 100% accurate).
 * 3. Uniform distribution across positions A, B, C, D (~25% each over sessions).
 * 4. Zero predictable patterns (no A->B->C->D cycles).
 */

/**
 * High-entropy Fisher-Yates array shuffler
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Seeded Fisher-Yates shuffler for deterministic yet non-linear randomization
 */
export function seededShuffle<T>(array: T[], seedNumber: number): T[] {
  const result = [...array];
  let s = Math.abs(seedNumber) || 1234567;
  for (let i = result.length - 1; i > 0; i--) {
    // Linear congruential generator step
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = Math.floor((s / 4294967296) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles options for any challenge/question array (string[] or object[]) while preserving items.
 */
export function randomizeOptions<T>(options: T[], seed?: number): T[] {
  if (!options || options.length <= 1) return options;
  return seed !== undefined ? seededShuffle(options, seed) : fisherYatesShuffle(options);
}

/**
 * Randomizes options for an InteractiveChallenge / CognitiveChallenge
 */
export function randomizeChallenge<T extends { options: any[] }>(challenge: T, seed?: number): T {
  if (!challenge || !Array.isArray(challenge.options) || challenge.options.length <= 1) {
    return challenge;
  }

  const shuffledOptions = randomizeOptions(challenge.options, seed);
  return {
    ...challenge,
    options: shuffledOptions,
  };
}

/**
 * Distribution Verification Report structure
 */
export interface DistributionReport {
  totalQuestionsEvaluated: number;
  positionCounts: {
    A: number;
    B: number;
    C: number;
    D: number;
    other: number;
  };
  percentages: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  isBalanced: boolean; // True if every standard option (A-D) is between 20% and 30%
  integrityVerified: boolean; // True if every shuffled question maintained its correct answer
}

/**
 * Audits a collection of questions to verify distribution balance & answer integrity
 */
export function auditOptionDistribution(
  challengesList: Array<{ options: Array<{ isCorrect?: boolean; label?: string }> }>,
  iterationsPerItem: number = 100
): DistributionReport {
  const counts = { A: 0, B: 0, C: 0, D: 0, other: 0 };
  let totalEvaluated = 0;
  let integrityPassed = true;

  for (const c of challengesList) {
    if (!c.options || c.options.length === 0) continue;

    // Verify exactly one correct answer initially
    const initialCorrectCount = c.options.filter((o) => o.isCorrect === true).length;

    for (let i = 0; i < iterationsPerItem; i++) {
      const shuffled = randomizeOptions(c.options);
      totalEvaluated++;

      // Check integrity
      const shuffledCorrectCount = shuffled.filter((o) => o.isCorrect === true).length;
      if (shuffledCorrectCount !== initialCorrectCount) {
        integrityPassed = false;
      }

      // Find index of correct option
      const correctIdx = shuffled.findIndex((o) => o.isCorrect === true);
      if (correctIdx === 0) counts.A++;
      else if (correctIdx === 1) counts.B++;
      else if (correctIdx === 2) counts.C++;
      else if (correctIdx === 3) counts.D++;
      else counts.other++;
    }
  }

  const pct = (val: number) => ((val / totalEvaluated) * 100).toFixed(2) + "%";
  const numA = (counts.A / totalEvaluated) * 100;
  const numB = (counts.B / totalEvaluated) * 100;
  const numC = (counts.C / totalEvaluated) * 100;
  const numD = (counts.D / totalEvaluated) * 100;

  const isBalanced =
    numA >= 20 && numA <= 30 &&
    numB >= 20 && numB <= 30 &&
    numC >= 20 && numC <= 30 &&
    numD >= 20 && numD <= 30;

  return {
    totalQuestionsEvaluated: totalEvaluated,
    positionCounts: counts,
    percentages: {
      A: pct(counts.A),
      B: pct(counts.B),
      C: pct(counts.C),
      D: pct(counts.D),
    },
    isBalanced,
    integrityVerified: integrityPassed,
  };
}
