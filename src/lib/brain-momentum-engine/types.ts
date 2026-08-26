/**
 * BRAIN MOMENTUM ENGINE™ — TYPE DEFINITIONS
 * 
 * Continuous 4-Stage Architecture:
 * ASSESS → PRESCRIBE → TRAIN → TRANSFER
 */

import { InteractiveChallenge } from "../interactive-challenges";
import { PhysicalActivity } from "../physical-activities";

export type CognitiveDomain =
  | "Memory"
  | "Focus"
  | "Processing Speed"
  | "Attention"
  | "Problem Solving"
  | "Reaction Time"
  | "Working Memory";

export type MomentumTier =
  | "getting_started"
  | "building"
  | "good"
  | "strong"
  | "peak";

export type DomainTrend = "improving" | "stable" | "needs_attention";

export interface DomainPerformance {
  domain: CognitiveDomain;
  currentScore: number; // 0 to 100
  baselineScore: number; // User's personal historical baseline
  trend: DomainTrend;
  trendPercentage: number; // e.g. +8% or -5% vs personal baseline
  confidenceLevel: "preliminary" | "calibrated" | "high_confidence";
  recentAttemptsCount: number;
}

export interface BrainMomentumState {
  score: number; // 0 to 100 (Non-medical fitness metric)
  previousScore: number;
  weeklyDelta: number; // e.g. +6
  tier: MomentumTier;
  tierLabel: string; // e.g. "Strong Momentum"
  tierDescription: string;
  reasons: string[]; // List of specific reasons why score changed
  components: {
    consistency: number; // 0-25
    performance: number; // 0-25
    improvement: number; // 0-20
    challenge: number; // 0-15
    activity: number; // 0-15
  };
  domainProfiles: Record<CognitiveDomain, DomainPerformance>;
  strongestDomain: CognitiveDomain;
  domainNeedingAttention: CognitiveDomain;
  lastCalculatedAt: string;
}

export type WorkoutDurationMode = "quick" | "standard" | "deep";

export interface RealWorldTransferExercise {
  id: string;
  domain: CognitiveDomain;
  title: string;
  tagline: string;
  instruction: string;
  durationMinutes: number;
  whyItMatters: string;
  responsibleDisclaimer: string;
  xpReward: number;
}

export interface PrescribedDailyWorkout {
  id: string;
  date: string;
  focusDomains: CognitiveDomain[];
  durationMode: WorkoutDurationMode;
  estimatedMinutes: number;
  reasoningWhy: string;
  cognitiveExercises: InteractiveChallenge[];
  challengeExercise: InteractiveChallenge;
  realWorldTransfer: RealWorldTransferExercise;
  physicalTask: PhysicalActivity;
  isCompletedToday: boolean;
  totalXpReward: number;
  totalCoinsReward: number;
}

export interface WeeklyBrainReport {
  weekStart: string;
  momentumScore: number;
  momentumDelta: number;
  strongestArea: CognitiveDomain;
  areaNeedingAttention: CognitiveDomain;
  bestImprovement: string;
  consistencyDays: number; // e.g. 5 of 7 days
  totalTrainingMinutes: number;
  challengesCompleted: number;
  nextWeekFocus: string;
}

export interface UserCognitiveProfile {
  userId: string;
  primaryGoal: string;
  preferredDuration: WorkoutDurationMode;
  streak: number;
  bestStreak: number;
  workoutsCompletedTotal: number;
  workoutsCompletedThisWeek: number;
  domainBaselines: Record<CognitiveDomain, number>;
  domainScores: Record<CognitiveDomain, number>;
  momentumHistory: Array<{ date: string; score: number }>;
  recentWorkoutIds: string[];
}
