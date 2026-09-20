/**
 * BRAINGYM PERSONALIZED MENTAL FITNESS ENGINE — TYPE SYSTEM
 * 
 * Central Product Philosophy:
 * «ONE BRAIN. DIFFERENT LIVES. SAME MENTAL FITNESS.»
 * 
 * 1. 8 Core Mental Fitness Areas (Universal across all ages)
 * 2. Multi-factor personalization: AGE + LIFE SITUATION + GOALS + INTERESTS + PERFORMANCE + DIFFICULTY
 * 3. Difficulty based purely on demonstrated performance (Levels 1 to 6+), NOT age
 * 4. Content Safety: Youth-safe guardrails for <18, dignified empowerment for older adults
 */

import { CognitiveChallenge } from "@/lib/challenges-engine/types";
import { ConnectedPhysicalTask } from "@/lib/daily-curriculum/types";

// ─── 1. 8 CORE MENTAL FITNESS AREAS (UNIVERSAL FRAMEWORK) ────────────────────
export type CoreMentalFitnessArea =
  | "Focus"
  | "Memory"
  | "Problem-solving"
  | "Decision-making"
  | "Critical thinking"
  | "Creativity"
  | "Adaptability"
  | "Self-awareness";

export interface MentalFitnessAreaConfig {
  id: CoreMentalFitnessArea;
  name: string;
  emoji: string;
  description: string;
  color: string;
  realLifeApplication: string;
}

export const CORE_MENTAL_FITNESS_AREAS: MentalFitnessAreaConfig[] = [
  {
    id: "Focus",
    name: "Focus & Attention",
    emoji: "🎯",
    description: "Sustained concentration, selective attention, and distraction immunity.",
    color: "#f59e0b",
    realLifeApplication: "Finishing high-priority tasks without digital disruption or scattered thinking.",
  },
  {
    id: "Memory",
    name: "Memory & Working Retention",
    emoji: "🧠",
    description: "Working memory capacity, associative recall, and structured mental retention.",
    color: "#6366f1",
    realLifeApplication: "Holding multiple facts in mind while making real-time calculations or remembering key agreements.",
  },
  {
    id: "Problem-solving",
    name: "Problem-Solving",
    emoji: "🧩",
    description: "Root-cause diagnostics, structured breakdown, and obstacle navigation.",
    color: "#10b981",
    realLifeApplication: "Diagnosing breakdowns calmly and creating viable step-by-step solutions under constraints.",
  },
  {
    id: "Decision-making",
    name: "Decision-Making",
    emoji: "⚖️",
    description: "Risk assessment, consequence evaluation, trade-off analysis, and impulse control.",
    color: "#3b82f6",
    realLifeApplication: "Evaluating options rationally before committing time, reputation, or money.",
  },
  {
    id: "Critical thinking",
    name: "Critical Thinking",
    emoji: "🔍",
    description: "Cognitive bias detection, premise validation, and separating signal from noise.",
    color: "#8b5cf6",
    realLifeApplication: "Questioning dubious claims, validating data, and avoiding costly emotional traps.",
  },
  {
    id: "Creativity",
    name: "Creativity & Lateral Thinking",
    emoji: "💡",
    description: "Divergent thinking, novel synthesis, and non-obvious angle generation.",
    color: "#ec4899",
    realLifeApplication: "Finding unconventional ways around bottlenecks and creating unique value.",
  },
  {
    id: "Adaptability",
    name: "Adaptability & Mental Flexibility",
    emoji: "🌊",
    description: "Cognitive shifting, resilience under sudden change, and updating outdated assumptions.",
    color: "#06b6d4",
    realLifeApplication: "Pivoting smoothly when plans fail without losing mental composure or momentum.",
  },
  {
    id: "Self-awareness",
    name: "Self-Awareness & Metacognition",
    emoji: "🪞",
    description: "Emotional state tracking, thought pattern monitoring, and personal trigger recognition.",
    color: "#14b8a6",
    realLifeApplication: "Recognizing your own stress, biases, and fatigue before they cause costly mistakes.",
  },
];

// ─── 2. AGE RANGES & LIFE SITUATIONS ─────────────────────────────────────────
export type AgeRangeBracket = "13-17" | "18-25" | "26-45" | "46-59" | "60+";

export const AGE_RANGE_OPTIONS: { id: AgeRangeBracket; label: string; description: string }[] = [
  { id: "13-17", label: "13–17 Years", description: "Secondary school, exams, peer decisions, personal responsibility & habits" },
  { id: "18-25", label: "18–25 Years", description: "Higher education, career launch, networking, budgeting & independence" },
  { id: "26-45", label: "26–45 Years", description: "Career growth, business building, leadership, family decisions & peak productivity" },
  { id: "46-59", label: "46–59 Years", description: "Executive leadership, strategic investment, mentorship & life balance" },
  { id: "60+", label: "60+ Years", description: "Lifelong learning, wisdom synthesis, purpose, cognitive longevity & mentoring" },
];

export type LifeSituationType =
  | "Student"
  | "University student"
  | "Employee"
  | "Entrepreneur"
  | "Business owner"
  | "Professional"
  | "Job seeker"
  | "Retired"
  | "Homemaker"
  | "Educator"
  | "Other";

export const LIFE_SITUATIONS: { id: LifeSituationType; label: string; emoji: string }[] = [
  { id: "Student", label: "Secondary / High School Student", emoji: "🎒" },
  { id: "University student", label: "University / College Student", emoji: "🎓" },
  { id: "Employee", label: "Employee / Team Member", emoji: "💼" },
  { id: "Entrepreneur", label: "Entrepreneur / Startup Founder", emoji: "🚀" },
  { id: "Business owner", label: "Business Owner / SME Merchant", emoji: "🏪" },
  { id: "Professional", label: "Corporate Professional / Specialist", emoji: "👔" },
  { id: "Job seeker", label: "Job Seeker / Career Switcher", emoji: "🔍" },
  { id: "Educator", label: "Teacher / Lecturer / Trainer", emoji: "📚" },
  { id: "Homemaker", label: "Homemaker / Family Lead", emoji: "🏡" },
  { id: "Retired", label: "Retired / Senior Thinker", emoji: "👑" },
  { id: "Other", label: "Other Life Context", emoji: "✨" },
];

export type UserInterestType =
  | "Business"
  | "Technology"
  | "Sports"
  | "Money"
  | "Education"
  | "Career"
  | "Family"
  | "Creativity"
  | "Leadership"
  | "Social issues"
  | "Everyday life";

export const USER_INTEREST_OPTIONS: { id: UserInterestType; label: string; emoji: string }[] = [
  { id: "Business", label: "Business & Commerce", emoji: "💼" },
  { id: "Technology", label: "Technology & AI", emoji: "💻" },
  { id: "Money", label: "Money & Personal Finance", emoji: "💰" },
  { id: "Career", label: "Career & Workplace", emoji: "📈" },
  { id: "Education", label: "Education & Learning", emoji: "📖" },
  { id: "Leadership", label: "Leadership & Influence", emoji: "👑" },
  { id: "Creativity", label: "Creativity & Design", emoji: "🎨" },
  { id: "Sports", label: "Sports & Physical Performance", emoji: "⚽" },
  { id: "Family", label: "Family & Relationships", emoji: "🏡" },
  { id: "Social issues", label: "Community & Social Impact", emoji: "🌍" },
  { id: "Everyday life", label: "Everyday Life & Street Smarts", emoji: "🚶" },
];

// ─── 3. ADAPTIVE DIFFICULTY LEVELS (PERFORMANCE-BASED, 1 TO 6+) ──────────────
export type AdaptiveDifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface DifficultyLevelConfig {
  level: AdaptiveDifficultyLevel;
  title: string;
  complexityDescription: string;
  minWorkoutsRequired: number;
  accuracyThreshold: number; // e.g. 0.70 = 70%
}

export const DIFFICULTY_LEVELS_CONFIG: Record<AdaptiveDifficultyLevel, DifficultyLevelConfig> = {
  1: {
    level: 1,
    title: "Level 1 — Basic Recognition",
    complexityDescription: "Clear variables, straightforward cause-and-effect with obvious indicators.",
    minWorkoutsRequired: 0,
    accuracyThreshold: 0,
  },
  2: {
    level: 2,
    title: "Level 2 — Simple Application",
    complexityDescription: "Applying core mental frameworks to direct single-variable dilemmas.",
    minWorkoutsRequired: 3,
    accuracyThreshold: 0.65,
  },
  3: {
    level: 3,
    title: "Level 3 — Multiple Variables",
    complexityDescription: "Evaluating competing priorities (time vs money vs relationship).",
    minWorkoutsRequired: 7,
    accuracyThreshold: 0.70,
  },
  4: {
    level: 4,
    title: "Level 4 — Ambiguity & Incomplete Data",
    complexityDescription: "Making decisions when information is incomplete and pressure is present.",
    minWorkoutsRequired: 14,
    accuracyThreshold: 0.75,
  },
  5: {
    level: 5,
    title: "Level 5 — Conflicting Signals",
    complexityDescription: "Navigating conflicting interests, emotional biases, and second-order effects.",
    minWorkoutsRequired: 25,
    accuracyThreshold: 0.80,
  },
  6: {
    level: 6,
    title: "Level 6+ — Complex Real-World Reasoning",
    complexityDescription: "High-stakes systemic trade-offs, deceptive narratives, and strategic foresight.",
    minWorkoutsRequired: 40,
    accuracyThreshold: 0.85,
  },
};

// ─── 4. RICH CONTENT TAGGING SCHEMA ──────────────────────────────────────────
export type ContentAgeSuitability = "13+" | "18+" | "all";
export type ContentSafetyCategory = "youth_safe" | "general_adult" | "all_audiences";

export interface ContentTaggingMetadata {
  skill: CoreMentalFitnessArea;
  difficulty: AdaptiveDifficultyLevel;
  ageSuitability: ContentAgeSuitability;
  lifeContext: LifeSituationType[];
  interests: UserInterestType[];
  format: "scenario_workout" | "cognitive_drill" | "universal_challenge";
  estimatedDurationMin: number;
  realLifeApplication: boolean;
  safetyCategory: ContentSafetyCategory;
  culturalGrounding?: "Nigerian_African" | "Universal_Global";
}

// ─── 5. USER PERSONALIZATION PROFILE ─────────────────────────────────────────
export interface UserPersonalizationProfile {
  userId?: string;
  name: string;
  ageRange: AgeRangeBracket;
  exactAge?: number;
  lifeSituations: LifeSituationType[];
  primaryGoal: CoreMentalFitnessArea;
  selectedGoals: CoreMentalFitnessArea[];
  interests: UserInterestType[];
  currentDifficultyLevel: AdaptiveDifficultyLevel;
  skillMasteryLevels: Record<CoreMentalFitnessArea, AdaptiveDifficultyLevel>;
  completedWorkoutsCount: number;
  skillWorkoutsCompleted: Record<CoreMentalFitnessArea, number>;
  totalAccuracyScore: number; // 0 to 1
  recentScores: { date: string; skill: CoreMentalFitnessArea; isCorrect: boolean; level: AdaptiveDifficultyLevel }[];
  streakDays: number;
}

// ─── 6. REAL-LIFE ASSIGNMENT ("YOUR LIFE CHALLENGE") ─────────────────────────
export interface YourLifeChallenge {
  id: string;
  title: string;
  instruction: string;
  contextWhy: string;
  durationMinutes: number;
  verificationQuestion: string;
  reflectionPrompt: string;
}

// ─── 7. PERSONALIZED WORKOUT STRUCTURE ("DAILY 10") ─────────────────────────
export interface PersonalizedDecisionOption {
  id: string;
  letter: "A" | "B" | "C" | "D";
  text: string;
  thinkingStyle: string;
  isRecommended: boolean;
  consequences: string;
  brainExplanation: string;
}

export interface PersonalizedMentalWorkout {
  id: string;
  title: string;
  universalSkill: CoreMentalFitnessArea;
  difficultyLevel: AdaptiveDifficultyLevel;
  estimatedMinutes: number;
  tags: ContentTaggingMetadata;
  coverEmoji: string;
  coverIllustration?: "finance" | "knowledge" | "workplace" | "family" | "relationship" | "focus" | "mindset";

  // Step 1: Personalized Scenario
  scenarioNarrative: string;
  
  // Step 2: Think (Situation Analysis)
  situationAnalysis: {
    coreDilemma: string;
    hiddenTrap: string;
    cognitivePrinciple: string;
  };

  // Step 3: Decide / Solve (Options A, B, C, D)
  decisionPrompt: string;
  decisionOptions: PersonalizedDecisionOption[];
  
  // Step 4: Explanation & Cognitive Insight
  brainInsightTakeaway: string;
  neuroscienceRationale: string;

  // Step 5: Brain Question (Cognitive Drill related to the skill)
  relatedBrainChallenge: CognitiveChallenge;

  // Step 6: Your Life Challenge (Real-World Assignment)
  yourLifeChallenge: YourLifeChallenge;

  // Step 7: Reflection & Journaling
  journalPrompts: string[];
  suggestedReflectionTemplate: string;
}

// ─── 8. UNIVERSAL CHALLENGES & "SEE HOW OTHERS THINK" ────────────────────────
export interface IntergenerationalPerspective {
  personaLabel: string; // e.g. "16-Year-Old Secondary Student", "35-Year-Old Team Lead", "60-Year-Old Community Elder"
  ageBracket: AgeRangeBracket;
  lifeContext: LifeSituationType;
  approachTitle: string;
  reasoning: string;
  keyPriority: string;
}

export interface UniversalCommunityChallenge {
  id: string;
  title: string;
  prompt: string;
  universalSkill: CoreMentalFitnessArea;
  contextNarrative: string;
  perspectives: IntergenerationalPerspective[];
  reflectionQuestion: string;
}

// ─── 9. 5 TEST PERSONAS FOR VERIFICATION ─────────────────────────────────────
export interface BenchmarkPersona {
  id: string;
  name: string;
  age: number;
  ageRange: AgeRangeBracket;
  lifeSituations: LifeSituationType[];
  primaryGoal: CoreMentalFitnessArea;
  interests: UserInterestType[];
  currentDifficultyLevel: AdaptiveDifficultyLevel;
  bio: string;
}

export const BENCHMARK_PERSONAS: BenchmarkPersona[] = [
  {
    id: "persona-16-student",
    name: "Tobi Adebayo",
    age: 16,
    ageRange: "13-17",
    lifeSituations: ["Student"],
    primaryGoal: "Decision-making",
    interests: ["Education", "Technology", "Everyday life"],
    currentDifficultyLevel: 2,
    bio: "16-year-old secondary school student preparing for exams while balancing peer pressure and smartphone distractions.",
  },
  {
    id: "persona-22-graduate",
    name: "Amina Bello",
    age: 22,
    ageRange: "18-25",
    lifeSituations: ["University student", "Job seeker"],
    primaryGoal: "Critical thinking",
    interests: ["Career", "Money", "Technology"],
    currentDifficultyLevel: 3,
    bio: "22-year-old recent university graduate navigating first job interviews, starting income, and early adulthood independence.",
  },
  {
    id: "persona-35-professional",
    name: "Chidi Okafor",
    age: 35,
    ageRange: "26-45",
    lifeSituations: ["Professional", "Employee"],
    primaryGoal: "Focus",
    interests: ["Career", "Leadership", "Family"],
    currentDifficultyLevel: 4,
    bio: "35-year-old corporate department lead balancing heavy deadline pressures, meeting overload, and family responsibilities.",
  },
  {
    id: "persona-48-entrepreneur",
    name: "Folake Alabi",
    age: 48,
    ageRange: "46-59",
    lifeSituations: ["Entrepreneur", "Business owner"],
    primaryGoal: "Problem-solving",
    interests: ["Business", "Money", "Leadership"],
    currentDifficultyLevel: 5,
    bio: "48-year-old enterprise founder managing cash flow constraints, key customer negotiations, and team delegation.",
  },
  {
    id: "persona-60-senior",
    name: "Elder Dauda Mensah",
    age: 62,
    ageRange: "60+",
    lifeSituations: ["Retired", "Business owner", "Educator"],
    primaryGoal: "Memory",
    interests: ["Leadership", "Education", "Everyday life", "Family"],
    currentDifficultyLevel: 4,
    bio: "62-year-old experienced mentor and community board adviser focusing on mental acuity, purpose, and intergenerational wisdom.",
  },
];
