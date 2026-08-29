/**
 * BRAIN KNOWLEDGE UNIVERSE & DAILY BRAIN DROP — TYPE DEFINITIONS
 * 
 * "Deep underneath. Simple on top."
 * Powers the "Today's Brain" daily briefing, micro-experiments, and knowledge cards.
 */

export type BrainUniverseCategory =
  | "Memory"
  | "Focus"
  | "Concentration"
  | "Learning"
  | "Intelligence"
  | "Creativity"
  | "Critical Thinking"
  | "Problem Solving"
  | "Decision Making"
  | "Attention"
  | "Mental Energy"
  | "Sleep and the Brain"
  | "Exercise and the Brain"
  | "Nutrition and the Brain"
  | "Habits"
  | "Productivity"
  | "Emotions"
  | "Stress"
  | "Psychology"
  | "Neuroscience"
  | "Cognitive Biases"
  | "Communication"
  | "Leadership"
  | "Entrepreneurship"
  | "Studying"
  | "Reading"
  | "Digital Distraction"
  | "Social Media and the Brain"
  | "Technology and Cognition"
  | "AI and the Brain"
  | "Brain Ageing"
  | "Children's Learning"
  | "Teenagers and the Brain"
  | "Brain Myths"
  | "Brain Experiments"
  | "Memory Techniques"
  | "Learning Techniques";

export type BrainDropType =
  | "discovery"
  | "experiment"
  | "myth"
  | "story"
  | "technique";

export type EvidenceLevel =
  | "Well established"
  | "Promising research"
  | "Active study";

export interface BrainDropUseItToday {
  action: string;
  mission: string;
  durationMinutes: number;
  xpReward: number;
}

export interface BrainDropScientificContext {
  explanation: string;
  evidenceLevel: EvidenceLevel;
  keyStudy?: string;
  relatedConcept?: string;
}

export interface BrainDropMicroChallenge {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface BrainDropMythCheck {
  claim: string;
  isTrue: boolean;
  revealExplanation: string;
}

export interface DailyBrainDrop {
  id: string;
  cardId: string; // e.g. "CARD-#004821"
  type: BrainDropType;
  category: BrainUniverseCategory;
  title: string;
  discovery: string; // The core 1-sentence Big Idea
  whyItMatters: string; // Simple, punchy rationale
  useItToday: BrainDropUseItToday;
  scientificContext: BrainDropScientificContext;
  microChallenge?: BrainDropMicroChallenge;
  mythCheck?: BrainDropMythCheck;
  relatedWorkoutDomain: string; // e.g. "Focus", "Memory", "Processing Speed"
  tags: string[];
}

export interface SavedBrainCard {
  cardId: string;
  dropId: string;
  title: string;
  category: BrainUniverseCategory;
  discovery: string;
  action: string;
  savedAt: string;
  masteryLevel: "new" | "reinforce" | "apply" | "master";
}
