/**
 * BRAINGYM AGE-TIERED CONTEXTUAL SCENARIO ENGINE — TYPES
 * Adapts every daily topic, challenge, questions (A, B, C, D), and physical task
 * to the exact life experience and cognitive requirements of each age category.
 */

import { CognitiveChallenge } from "@/lib/challenges-engine/types";
import { ConnectedPhysicalTask } from "@/lib/daily-curriculum/types";

export type AgeTierId =
  | "15-19" // Secondary / High School & Exam Preps
  | "20-25" // University, Youth Service, Internships & Early Career
  | "26-30" // Early Career, First Ventures & Serious Relationships
  | "31-35" // Mid-Career Professionals, Business Growth & Young Families
  | "36-40" // Established Leaders, Corporate Growth & School-Age Parenting
  | "41-45" // Senior Executives, Enterprise Founders & Teen Parenting
  | "46-50+"; // Leadership, Mentorship, Health & Cognitive Longevity

export interface AgeTierConfig {
  id: AgeTierId;
  label: string;
  stageTitle: string;
  stageSubtitle: string;
  emoji: string;
  focusAreas: string[];
  sampleContext: string;
}

export interface AgeAdaptedCurriculumLesson {
  lessonId: string;
  ageTier: AgeTierId;
  topicTitle: string;
  roleTarget: string;
  challenge: string; // Tailored real-world dilemma
  solution: string; // Neuroscience mechanism in context
  actionRule: string; // 2-min rule of thumb
  culturalWisdom?: {
    quote: string;
    origin: string;
    meaning: string;
  };
  phase1Questions: CognitiveChallenge[]; // 6 age-adapted questions with A, B, C, D
  phase2PhysicalTask: ConnectedPhysicalTask; // Age-adapted physical task
}

export const AGE_TIER_CONFIGS: AgeTierConfig[] = [
  {
    id: "15-19",
    label: "15–19 Years",
    stageTitle: "High School, Exam Preps & Teen Focus",
    stageSubtitle: "JAMB/WAEC/SAT prep, social media focus, sports & peer dynamics",
    emoji: "🎒",
    focusAreas: ["Exam Retention", "Resisting Social Media Loops", "Exam Anxiety", "Peer Composure"],
    sampleContext: "Managing study pressure, phone distraction, and school exams.",
  },
  {
    id: "20-25",
    label: "20–25 Years",
    stageTitle: "University, Internships & Early Career",
    stageSubtitle: "Campus projects, job interviews, early budget & digital dopamine",
    emoji: "🎓",
    focusAreas: ["Active Feynman Study", "Interview Presence", "Early Budgeting", "Digital Dopamine Gating"],
    sampleContext: "University exams, internships, first jobs, and independent living.",
  },
  {
    id: "26-30",
    label: "26–30 Years",
    stageTitle: "Early Career, Startups & Relationships",
    stageSubtitle: "Workplace meetings, salary negotiations, starting businesses & burnout",
    emoji: "🚀",
    focusAreas: ["Meeting Composure", "Financial Impulse Gating", "Deep Work Stamina", "Career Pivots"],
    sampleContext: "Office politics, business deals, financial independence, and lifestyle budgeting.",
  },
  {
    id: "31-35",
    label: "31–35 Years",
    stageTitle: "Mid-Career, Business Growth & Young Family",
    stageSubtitle: "Team management, cash flow volatility, toddler parenting & domestic calm",
    emoji: "💼",
    focusAreas: ["Executive Decision Speed", "Cash Flow Stress", "Parenting Patience", "Energy Management"],
    sampleContext: "Balancing career scaling, SME cash flow, and domestic patience at home.",
  },
  {
    id: "36-40",
    label: "36–40 Years",
    stageTitle: "Established Leaders & Family Foundation",
    stageSubtitle: "Corporate leadership, school fees budgeting, mid-career vitality & EQ",
    emoji: "🏢",
    focusAreas: ["Strategic Negotiation", "Decision Fatigue Reset", "Family Asset Building", "Emotional Regulation"],
    sampleContext: "High-stakes stakeholder decisions, multi-project focus, and family wealth building.",
  },
  {
    id: "41-45",
    label: "41–45 Years",
    stageTitle: "Senior Executives & Teen Parenting",
    stageSubtitle: "Enterprise management, teen emotional co-regulation & stress recovery",
    emoji: "👔",
    focusAreas: ["Crisis De-escalation", "Teenager Communication", "Cognitive Recovery", "Wealth Preservation"],
    sampleContext: "Leading large organizations, mentoring adolescents, and protecting mental bandwidth.",
  },
  {
    id: "46-50+",
    label: "46–50+ Years",
    stageTitle: "Leadership, Mentorship & Cognitive Longevity",
    stageSubtitle: "Strategic wisdom, mentorship, sleep architecture & neuroplastic maintenance",
    emoji: "👑",
    focusAreas: ["Working Memory Preservation", "Mentorship Communication", "Vagal Sleep Reset", "Legacy Focus"],
    sampleContext: "Long-term legacy, strategic mentorship, and neuroprotective brain habits.",
  },
];
