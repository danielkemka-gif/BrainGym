/**
 * AKUCHE DAILY OPENING & INSPIRATION TYPES
 */

export type AkucheInspirationTheme =
  | "Clarity & Mental Models"
  | "Decision-Making & Strategy"
  | "Critical Thinking & Inversion"
  | "Execution & Taking Action"
  | "Resilience & Adversity"
  | "Emotional Mastery & Equanimity"
  | "Career, Wealth & Leverage"
  | "Relationships & Boundaries"
  | "Mastery & Deep Learning"
  | "Discipline & Compounding Habits"
  | "Vision, Purpose & Long Horizons"
  | "Problem Solving & Innovation"
  | "Self-Awareness & Blind Spots"
  | "Focus, Energy & Deep Work"
  | "Timeless Wisdom & Philosophy";

export interface AkucheDailyMessage {
  id: string;
  theme: string;
  focusWord: string;
  message: string;
  reflectionPrompt: string;
  microAction: string;
  authorQuoteRef?: string;
}

export interface AkucheDailyInspirationState {
  lastSeenDate: string; // YYYY-MM-DD
  todaysMessageId: string;
  seenMessageIds: string[];
  favoriteMessageIds: string[];
}
