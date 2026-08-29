/**
 * LIFE PERFORMANCE & BRAIN TRANSFORMATION ENGINE — TYPES
 * 
 * Tracks in-app Brain Fitness alongside real-world functional Life Performance.
 */

export interface RealLifeMetricSnapshot {
  baseline: number;
  current: number;
  deltaPercent: number;
  unit: string;
}

export interface RealLifeActivityLog {
  id: string;
  challengeId: string;
  challengeTitle: string;
  date: string;
  domain: string;
  recordedValue: number | string;
  unit?: string;
  reflectionNotes?: string;
  xpEarned: number;
  completedAt: string;
}

export interface LifePerformanceState {
  overallScore: number; // 0 to 100
  brainFitnessScore: number; // In-app cognitive performance (0 to 100)
  brainMomentumScore: number; // Consistency & habit momentum (0 to 100)
  metrics: {
    deepWorkMinutesAvg: RealLifeMetricSnapshot;
    studyRecallAccuracy: RealLifeMetricSnapshot;
    ideasPerChallenge: RealLifeMetricSnapshot;
    interruptionResilience: RealLifeMetricSnapshot;
  };
  completedChallengesCount: number;
  totalTrainingDays: number;
  recentLogs: RealLifeActivityLog[];
  lastUpdated: string;
}

export interface BrainTransformationReport {
  periodDays: 30 | 60 | 90 | 180;
  periodLabel: string;
  startDate: string;
  endDate: string;
  brainMomentum: { start: number; current: number };
  brainFitness: { start: number; current: number };
  lifePerformance: { start: number; current: number };
  domainChanges: {
    domain: string;
    startScore: number;
    currentScore: number;
    deltaPercent: number;
  }[];
  realLifeProgress: {
    label: string;
    startValue: string;
    currentValue: string;
    improvementSummary: string;
  }[];
  biggestDevelopment: {
    domain: string;
    title: string;
    narrative: string;
  };
  journeyStats: {
    workoutsCompleted: number;
    lifeChallengesCompleted: number;
    trainingDays: number;
    longestStreak: number;
  };
}
