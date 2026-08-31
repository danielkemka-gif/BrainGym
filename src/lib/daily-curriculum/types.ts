/**
 * DAILY CONNECTED CURRICULUM — TYPE DEFINITIONS
 * 
 * "From the Dashboard Lesson -> Multiple-Choice Questions -> Physical Task.
 *  Everything connected in a coherent pedagogical flow, just like a gym lesson."
 */

import { CognitiveChallenge } from "@/lib/challenges-engine/types";

export interface ConnectedPhysicalTask {
  id: string;
  title: string;
  illustrationType:
    | "meditation"
    | "walking"
    | "reading"
    | "drawing"
    | "listening"
    | "speaking"
    | "handwriting"
    | "eating"
    | "sleeping"
    | "nature"
    | "planning"
    | "music"
    | "hydration"
    | "coordination";
  durationMinutes: number;
  physicalAction: string;
  cognitiveConnection: string; // Explains how physical movement directly reinforces today's topic
  xpReward: number;
  coinReward: number;
}

export interface DailyCurriculumLesson {
  id: string;
  dayIndex: number;
  topicTitle: string;
  category: "Work & Career" | "Business & Wealth" | "Study & Learning" | "Family & Home" | "Emotional Intelligence" | "Focus & Mindset";
  roleTarget: string; // e.g. "For Professionals, Students, Founders & Families"
  topicEmoji?: string; // e.g. "💰" for Finance, "📚" for Knowledge/Learning, "💼" for Work
  topicIllustration?: "finance" | "knowledge" | "workplace" | "family" | "relationship" | "focus" | "mindset";
  
  // ─── STEP 1: DASHBOARD LESSON ──────────────────────────────────────────────
  challenge: string; // The real-life dilemma
  solution: string; // The neuroscientific mechanism & solution
  actionRule: string; // The practical 2-minute rule of thumb
  culturalWisdom?: {
    quote: string;
    origin: string;
    meaning: string;
  };

  // ─── STEP 2: WORKOUT PHASE 1 (CONNECTED QUESTIONS) ─────────────────────────
  phase1Questions: CognitiveChallenge[];

  // ─── STEP 3: WORKOUT PHASE 2 (CONNECTED PHYSICAL TASK) ─────────────────────
  phase2PhysicalTask: ConnectedPhysicalTask;
}
