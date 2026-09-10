/**
 * BRAINGYM REAL-LIFE MENTAL FITNESS — TYPE DEFINITIONS
 * 
 * Central Philosophy:
 * «Train your mind. Improve how you think. Make better decisions. Apply it in real life.»
 * 
 * 5-Step Sequence:
 * SCENARIO -> DECISION (WHAT WOULD YOU DO?) -> BRAIN CHALLENGE -> REAL-LIFE ACTION -> JOURNAL -> IMPROVE
 */

import { CognitiveChallenge } from "@/lib/challenges-engine/types";
import { ConnectedPhysicalTask } from "@/lib/daily-curriculum/types";

export type UserRoleCategory =
  | "Student"
  | "Entrepreneur"
  | "BusinessOwner"
  | "Professional"
  | "Parent"
  | "Executive"
  | "JobSeeker"
  | "Retiree";

export interface DecisionOption {
  id: string;
  letter: "A" | "B" | "C" | "D";
  text: string;
  thinkingStyle: string; // e.g. "Reactive Concession", "Defensive Resistance", "Strategic Inquiry", "Avoidance"
  isRecommended: boolean;
  consequences: string; // What happens in real life when this choice is made
  brainExplanation: string; // Neuroscience & cognitive rationale
}

export interface RealLifeScenario {
  id: string;
  title: string;
  topicCategory: "Decision Making" | "Work & Career" | "Business & Wealth" | "Study & Learning" | "Family & Home" | "Emotional Intelligence" | "Focus & Mindset";
  roleCategory: UserRoleCategory;
  ageBracket?: string; // e.g. "15-19", "20-25", "26-35", "36-50+"
  estimatedMinutes: number;
  coverEmoji: string;
  coverIllustration?: "finance" | "knowledge" | "workplace" | "family" | "relationship" | "focus" | "mindset";
  
  // ─── STEP 1: THE REAL-LIFE SCENARIO ───────────────────────────────────────
  scenarioNarrative: string;
  contextWhyItMatters: string;
  
  // ─── STEP 2: DECISION POINT ("WHAT WOULD YOU DO?") ─────────────────────────
  decisionPrompt: string;
  decisionOptions: DecisionOption[];
  brainInsightTakeaway: string; // Short memorable principle: e.g. "Pause. Understand. Then decide."
  cognitiveSkillInvolved: string; // e.g. "Inhibitory Control & Value Anchoring"

  // ─── STEP 3: RELATED BRAIN CHALLENGE ───────────────────────────────────────
  relatedBrainChallenge: CognitiveChallenge;

  // ─── STEP 4: REAL-LIFE PHYSICAL / ACTION TASK ──────────────────────────────
  physicalActionTask: ConnectedPhysicalTask;

  // ─── STEP 5: JOURNAL & REFLECTION PROMPTS ──────────────────────────────────
  journalPrompts: string[];
  suggestedReflectionTemplate: string;
}

export interface DailyMissionProgress {
  date: string; // YYYY-MM-DD
  scenarioId: string;
  currentStep: 1 | 2 | 3 | 4 | 5 | 6; // 1: Scenario, 2: Decision, 3: Brain Challenge, 4: Physical Task, 5: Journal, 6: Completed
  completedSteps: number[]; // e.g. [1, 2, 3]
  selectedOptionId: string | null;
  brainChallengeCompleted: boolean;
  physicalTaskCompleted: boolean;
  journalEntryText: string;
  isCompleted: boolean;
  xpEarned: number;
  coinsEarned: number;
  completedAt?: string;
}

export interface RoleConfig {
  id: UserRoleCategory;
  label: string;
  emoji: string;
  description: string;
  sampleScenarios: string[];
}

export const USER_ROLES: RoleConfig[] = [
  {
    id: "Student",
    label: "Student & Scholar",
    emoji: "🎒",
    description: "Examinations, concentration, peer pressure, study habits, and time management.",
    sampleScenarios: ["Exam hall freeze response", "Group project free-riders", "Social media study distraction"],
  },
  {
    id: "Entrepreneur",
    label: "Entrepreneur & Founder",
    emoji: "🚀",
    description: "Pricing negotiations, cash flow, competition, uncertainty, and opportunity selection.",
    sampleScenarios: ["Major customer demanding 30% discount", "Pivot vs persevere", "Runway budgeting under inflation"],
  },
  {
    id: "BusinessOwner",
    label: "Business Owner / SME",
    emoji: "🏪",
    description: "Customer complaints, staff management, sales, delegation, and reputation.",
    sampleScenarios: ["Late supplier delivery resolving", "Handling a public customer review", "Empowering staff vs micromanaging"],
  },
  {
    id: "Professional",
    label: "Professional / Worker",
    emoji: "💼",
    description: "Workplace pressure, deadlines, meetings, difficult colleagues, and career growth.",
    sampleScenarios: ["Sudden presentation in leadership meeting", "Defending personal boundaries", "Navigating office politics"],
  },
  {
    id: "Parent",
    label: "Parent & Family",
    emoji: "🏡",
    description: "Communicating with children, domestic patience, emotional intelligence, and work-family balance.",
    sampleScenarios: ["Toddler/teen emotional outburst", "Transitioning from work traffic to calm home", "Balancing career sprint with family time"],
  },
  {
    id: "Executive",
    label: "Manager / Executive",
    emoji: "🏢",
    description: "Leadership, strategic decisions, team conflict, delegation, and crisis triage.",
    sampleScenarios: ["Two top managers in conflict", "Crisis management under public scrutiny", "Resource allocation across divisions"],
  },
  {
    id: "JobSeeker",
    label: "Job Seeker & Career Starter",
    emoji: "🎓",
    description: "Interviews, rejection resilience, CV decisions, networking, and confidence.",
    sampleScenarios: ["Overcoming freeze in salary question", "Bouncing back from interview rejection", "Cold networking message formulation"],
  },
  {
    id: "Retiree",
    label: "Retiree / Older Adult",
    emoji: "👑",
    description: "Memory preservation, mentorship, social connection, daily routine, and emotional wellbeing.",
    sampleScenarios: ["Synthesizing life wisdom for youth", "Active associative memory maintenance", "Adapting to lifestyle transition"],
  },
];
