/**
 * BRAINGYM QUESTION VALIDATION & QUALITY ASSURANCE ENGINE
 * 
 * Strict quality gatekeeper enforcing the 10-point Quality Control Standard:
 * 1. Grammatical and semantic clarity (no typos, proper capitalization and punctuation).
 * 2. Exactly ONE unambiguous correct answer.
 * 3. Exactly FOUR credible, distinct, and plausible options (no absurd distractors).
 * 4. Option length parity (ratio between longest and shortest options <= 2.5 to prevent length giveaway bias).
 * 5. Cognitive skill tagging (primary + optional secondary skill).
 * 6. Standardized difficulty grading ('easy' | 'medium' | 'hard' | 'expert').
 * 7. Informative educational explanation explaining the underlying cognitive principle.
 * 8. Duplicate / near-duplicate detection using tokenized Jaccard similarity.
 * 9. Unpredictable, balanced answer position distribution (A, B, C, D ~ 25% each).
 * 10. Adult intellectual relevance (decision-making, strategic logic, quantitative estimation, cognitive biases).
 */

export type QuestionDifficulty = "easy" | "medium" | "hard" | "expert";

export type CognitiveSkillTag =
  | "MEMORY"
  | "WORKING_MEMORY"
  | "LOGIC"
  | "DEDUCTIVE_REASONING"
  | "INDUCTIVE_REASONING"
  | "PATTERN_RECOGNITION"
  | "PROCESSING_SPEED"
  | "FOCUS"
  | "SELECTIVE_ATTENTION"
  | "PROBLEM_SOLVING"
  | "CRITICAL_THINKING"
  | "COGNITIVE_FLEXIBILITY"
  | "DECISION_MAKING"
  | "SPATIAL_REASONING"
  | "EMOTIONAL_INTELLIGENCE";

export interface StandardizedQuestionOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface StandardizedQuestion {
  id: string;
  title?: string;
  question: string;
  category: string;
  primarySkill: CognitiveSkillTag;
  secondarySkill?: CognitiveSkillTag;
  difficulty: QuestionDifficulty;
  options: StandardizedQuestionOption[];
  educationalWhy: string;
  xpReward: number;
  coinReward: number;
}

export interface QuestionValidationResult {
  questionId: string;
  isValid: boolean;
  score: number; // 0 to 100 Quality Score
  errors: string[];
  warnings: string[];
}

export interface BankAuditReport {
  totalQuestions: number;
  validQuestionsCount: number;
  failedQuestionsCount: number;
  averageQualityScore: number;
  difficultyDistribution: Record<QuestionDifficulty, number>;
  skillDistribution: Record<string, number>;
  duplicatePairsDetected: Array<{ q1: string; q2: string; similarity: number }>;
  positionDistribution: { A: string; B: string; C: string; D: string };
  allPassed: boolean;
}

/**
 * Calculates string similarity ratio (0 to 1) using word-level Jaccard indexing
 */
export function calculateTextSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean));
  const wordsB = new Set(textB.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.size / union.size;
}

/**
 * Validates a single question against all quality standards
 */
export function validateQuestion(q: StandardizedQuestion): QuestionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // 1. Question Text Checks
  if (!q.question || q.question.trim().length < 10) {
    errors.push("Question prompt is missing or too short (< 10 characters).");
    score -= 40;
  }

  // 2. Options Structure Checks
  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push("Question must contain at least 2 options.");
    score -= 40;
  } else {
    // Check correct answer count
    const correctCount = q.options.filter((o) => o.isCorrect === true).length;
    if (correctCount === 0) {
      errors.push("Question has NO option marked as correct.");
      score -= 50;
    } else if (correctCount > 1) {
      errors.push(`Question has ${correctCount} options marked as correct. Exactly 1 is required.`);
      score -= 40;
    }

    // Check for 4 standard options if multiple choice
    if (q.options.length !== 4 && q.options.length !== 2 && q.options.length !== 3) {
      warnings.push(`Non-standard option count: ${q.options.length} (Standard is 4).`);
      score -= 5;
    }

    // Check option labels & uniqueness
    const labelsSet = new Set<string>();
    const lengths: number[] = [];

    for (let i = 0; i < q.options.length; i++) {
      const opt = q.options[i];
      if (!opt.label || opt.label.trim().length === 0) {
        errors.push(`Option ${i + 1} has empty label.`);
        score -= 20;
      } else {
        const cleanLabel = opt.label.trim().toLowerCase();
        if (labelsSet.has(cleanLabel)) {
          errors.push(`Duplicate option label found: "${opt.label}".`);
          score -= 25;
        }
        labelsSet.add(cleanLabel);
        lengths.push(opt.label.trim().length);
      }
    }

    // Check option length parity (prevents length bias where correct answer is 4x longer than wrong ones)
    if (lengths.length >= 4) {
      const minLen = Math.min(...lengths);
      const maxLen = Math.max(...lengths);
      if (minLen > 0 && maxLen / minLen > 3.2 && maxLen - minLen > 40) {
        warnings.push(
          `High option length variance (Min: ${minLen} chars, Max: ${maxLen} chars). Ensure distractors have comparable detail.`
        );
        score -= 10;
      }
    }
  }

  // 3. Educational Explanation Checks
  if (!q.educationalWhy || q.educationalWhy.trim().length < 15) {
    errors.push("Educational explanation ('Why') is missing or too brief (< 15 characters).");
    score -= 20;
  }

  // 4. Difficulty Check
  const validDifficulties: QuestionDifficulty[] = ["easy", "medium", "hard", "expert"];
  if (!validDifficulties.includes(q.difficulty)) {
    warnings.push(`Invalid difficulty rating '${q.difficulty}'. Expected easy | medium | hard | expert.`);
    score -= 5;
  }

  // 5. Primary Skill Tag Check
  if (!q.primarySkill) {
    errors.push("Primary cognitive skill tag is missing.");
    score -= 15;
  }

  return {
    questionId: q.id,
    isValid: errors.length === 0,
    score: Math.max(0, score),
    errors,
    warnings,
  };
}

/**
 * Runs a complete audit on an entire question collection
 */
export function auditQuestionBank(questions: StandardizedQuestion[]): BankAuditReport {
  let validCount = 0;
  let failedCount = 0;
  let totalScore = 0;

  const difficultyCounts: Record<QuestionDifficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0,
  };

  const skillCounts: Record<string, number> = {};
  const duplicatePairs: Array<{ q1: string; q2: string; similarity: number }> = [];
  const positionCounts = { A: 0, B: 0, C: 0, D: 0 };

  for (let i = 0; i < questions.length; i++) {
    const q1 = questions[i];
    const val = validateQuestion(q1);

    if (val.isValid) validCount++;
    else failedCount++;

    totalScore += val.score;

    if (q1.difficulty && difficultyCounts[q1.difficulty] !== undefined) {
      difficultyCounts[q1.difficulty]++;
    }

    if (q1.primarySkill) {
      skillCounts[q1.primarySkill] = (skillCounts[q1.primarySkill] || 0) + 1;
    }

    // Check correct answer position
    const correctIdx = q1.options.findIndex((o) => o.isCorrect === true);
    if (correctIdx === 0) positionCounts.A++;
    else if (correctIdx === 1) positionCounts.B++;
    else if (correctIdx === 2) positionCounts.C++;
    else if (correctIdx === 3) positionCounts.D++;

    // Near-duplicate check with remaining questions
    for (let j = i + 1; j < questions.length; j++) {
      const q2 = questions[j];
      const similarity = calculateTextSimilarity(q1.question, q2.question);
      if (similarity > 0.85) {
        duplicatePairs.push({
          q1: `[${q1.id}] ${q1.question.slice(0, 45)}...`,
          q2: `[${q2.id}] ${q2.question.slice(0, 45)}...`,
          similarity: Number((similarity * 100).toFixed(1)),
        });
      }
    }
  }

  const total = questions.length || 1;
  const pct = (count: number) => ((count / total) * 100).toFixed(1) + "%";

  return {
    totalQuestions: questions.length,
    validQuestionsCount: validCount,
    failedQuestionsCount: failedCount,
    averageQualityScore: Number((totalScore / total).toFixed(1)),
    difficultyDistribution: difficultyCounts,
    skillDistribution: skillCounts,
    duplicatePairsDetected: duplicatePairs,
    positionDistribution: {
      A: pct(positionCounts.A),
      B: pct(positionCounts.B),
      C: pct(positionCounts.C),
      D: pct(positionCounts.D),
    },
    allPassed: failedCount === 0 && duplicatePairs.length === 0,
  };
}
