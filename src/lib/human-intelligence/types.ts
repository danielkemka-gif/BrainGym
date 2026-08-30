/**
 * HUMAN BRAIN INTELLIGENCE & REAL-LIFE VITAL WISDOM — TYPE DEFINITIONS
 * 
 * "Designed for real human beings living real lives — in work, business, family, finance, and learning."
 */

export type HumanLifePillar =
  | "career_work"
  | "business_entrepreneur"
  | "student_academic"
  | "family_parenting"
  | "finance_wealth"
  | "relationships_empathy"
  | "personal_development";

export interface CulturalWisdom {
  quote: string;
  origin: string; // e.g. "African Proverb", "Caribbean Proverb", "Universal Human Wisdom"
  cognitiveMeaning: string;
}

export interface HumanBrainBriefing {
  id: string;
  pillar: HumanLifePillar;
  pillarLabel: string;
  roleTarget: string; // e.g. "For Workers & Employees", "For Business Owners & Traders", "For Students & Scholars", "For Parents & Families", "For Financial Discipline"
  dailyHeadline: string;
  realLifeScenario: string; // The human dilemma
  theBrainSecret: string; // The neuroscientific / psychological mechanism
  culturalWisdom?: CulturalWisdom;
  theTwoMinuteAction: string; // Practical, bite-sized immediate action
  xpReward: number;
}
