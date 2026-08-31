import { DailyCurriculumLesson } from "./types";
import { WORKPLACE_FINANCE_CHALLENGES } from "@/lib/challenges-engine/workplace-finance";
import { FAMILY_RELATIONSHIPS_CHALLENGES } from "@/lib/challenges-engine/family-relationships";
import { ACADEMICS_LEARNING_CHALLENGES } from "@/lib/challenges-engine/academics-learning";
import { PERSONAL_GROWTH_MINDSET_CHALLENGES } from "@/lib/challenges-engine/personal-growth-mindset";
import { FOCUS_CHALLENGES } from "@/lib/challenges-engine/focus-attention";
import { MEMORY_CHALLENGES } from "@/lib/challenges-engine/memory";
import { EQ_CHALLENGES } from "@/lib/challenges-engine/emotional-intelligence";
import { CRITICAL_THINKING_CHALLENGES } from "@/lib/challenges-engine/critical-thinking";
import { EXECUTIVE_DECISION_CHALLENGES } from "@/lib/challenges-engine/executive-decisions";
import { LOGIC_CHALLENGES } from "@/lib/challenges-engine/logic";

export const DAILY_CURRICULUM_LESSONS: DailyCurriculumLesson[] = [
  // ─── LESSON 1: HIGH-PRESSURE WORK CONVERSATIONS & COMPOSURE ───────────────
  {
    id: "lesson-01-workplace-composure",
    dayIndex: 1,
    topicTitle: "How to Stay Calm & Think Clearly in High-Pressure Meetings & Negotiations",
    category: "Work & Career",
    roleTarget: "For Workers, Managers, Traders & Entrepreneurs",
    topicEmoji: "💼",
    topicIllustration: "workplace",
    challenge:
      "When someone challenges your proposal, criticizes your work, or gives an unexpected low offer, your heart races, your voice tightens, and your working memory freezes.",
    solution:
      "Perceived social threat triggers the amygdala to dump adrenaline and constrict prefrontal blood vessels. Taking a deliberate 3-second nasal inhale immediately stimulates the vagus nerve, preventing the mental blank-out and restoring executive decision speed.",
    actionRule:
      "Take a 2-second tactical pause before replying to any high-stakes question today. Smile slightly and open with: 'That is a valuable point. Let me break down the facts.'",
    culturalWisdom: {
      quote: "Smooth seas do not make skillful sailors.",
      origin: "African Proverb",
      meaning: "High-pressure moments are your cognitive gym; treat every difficult conversation as executive weight training.",
    },
    phase1Questions: [
      WORKPLACE_FINANCE_CHALLENGES[0], // High-Stakes Negotiation in Lagos
      WORKPLACE_FINANCE_CHALLENGES[3], // Leadership Conflict in Nairobi
      EQ_CHALLENGES[0] || WORKPLACE_FINANCE_CHALLENGES[2],
      FAMILY_RELATIONSHIPS_CHALLENGES[0], // De-escalating Heated Argument
      EXECUTIVE_DECISION_CHALLENGES[0] || WORKPLACE_FINANCE_CHALLENGES[1],
      CRITICAL_THINKING_CHALLENGES[0] || WORKPLACE_FINANCE_CHALLENGES[0],
    ],
    phase2PhysicalTask: {
      id: "phys-task-01",
      title: "10-Minute Mindful Breath & Posture Reset Walk",
      illustrationType: "walking",
      durationMinutes: 10,
      physicalAction: "Walk briskly for 10 minutes outdoors. Every 2 minutes, pause for 3 slow 4-4-6 breaths (inhale 4s, hold 4s, exhale 6s) while keeping your spine straight and shoulders relaxed.",
      cognitiveConnection: "Synchronizes motor pacing with parasympathetic vagal tone, teaching your nervous system to stay relaxed while active under pressure.",
      xpReward: 50,
      coinReward: 20,
    },
  },

  // ─── LESSON 2: DEEP FOCUS & AUDITORY GATING IN NOISY ENVIRONMENTS ──────────
  {
    id: "lesson-02-focus-auditory-gating",
    dayIndex: 2,
    topicTitle: "Protecting Deep Focus in Noisy Open Offices & Busy Markets",
    category: "Focus & Mindset",
    roleTarget: "For Students, Creators, Employees & Business Owners",
    topicEmoji: "🎯",
    topicIllustration: "focus",
    challenge:
      "Office chatter, traffic noise, and phone notifications constantly break your train of thought, leaving you mentally exhausted after getting almost nothing done.",
    solution:
      "Human speech involuntarily invades Wernicke's language area in the temporal lobe. Masking background speech with continuous brown noise or binaural 40Hz frequencies gates auditory distraction at the thalamus level, saving 50% of your prefrontal energy.",
    actionRule:
      "Full-screen your work document, put on steady brown noise or instrumental beats, and set a visible 25-minute Deep Work sprint timer with your phone out of sight.",
    culturalWisdom: {
      quote: "He who chases two rats catches neither.",
      origin: "West African Proverb",
      meaning: "Single-tasking with full depth accomplishes more in 25 minutes than 4 hours of fragmented multitasking.",
    },
    phase1Questions: [
      WORKPLACE_FINANCE_CHALLENGES[2], // Deep Work in Open Office in Accra
      PERSONAL_GROWTH_MINDSET_CHALLENGES[1], // Breaking Morning Phone Loop
      FOCUS_CHALLENGES[0] || WORKPLACE_FINANCE_CHALLENGES[0],
      PERSONAL_GROWTH_MINDSET_CHALLENGES[0], // Procrastination 2-Minute Rule
      FOCUS_CHALLENGES[1] || WORKPLACE_FINANCE_CHALLENGES[2],
      WORKPLACE_FINANCE_CHALLENGES[4], // Financial Impulse Control
    ],
    phase2PhysicalTask: {
      id: "phys-task-02",
      title: "15-Minute Zero-Notification Deep Study / Work Sprint",
      illustrationType: "planning",
      durationMinutes: 15,
      physicalAction: "Sit at your workspace with all browser tabs closed except one. Set a 15-minute physical timer and maintain single-task physical focus without touching your phone.",
      cognitiveConnection: "Builds physical inhibitory stamina in the basal ganglia by resisting the physical urge to pick up devices.",
      xpReward: 50,
      coinReward: 20,
    },
  },

  // ─── LESSON 3: ACTIVE RECALL & RAPID LEARNING (BOOK / KNOWLEDGE) ───────────
  {
    id: "lesson-03-active-recall-learning",
    dayIndex: 3,
    topicTitle: "How to Retain 80% of What You Read Without Passive Highlighting",
    category: "Study & Learning",
    roleTarget: "For Students, Scholars, Researchers & Lifelong Learners",
    topicEmoji: "📚",
    topicIllustration: "knowledge",
    challenge:
      "You spend hours reading textbooks, notes, or training manuals, but 24 hours later your mind goes completely blank when trying to recall key points.",
    solution:
      "Passive reading creates an 'illusion of competence.' Actively pulling information out of memory without looking (retrieval practice) triggers synaptic consolidation in the hippocampus, producing 300% greater long-term retention.",
    actionRule:
      "After finishing any reading today, close your book and write a 3-bullet summary in simple everyday language as if explaining it to a 10-year-old (The Feynman Technique).",
    culturalWisdom: {
      quote: "Wisdom is like a baobab tree; no one person can embrace it alone.",
      origin: "Ghanaian / Akan Proverb",
      meaning: "True mastery comes from explaining concepts simply to others, not silent passive memorization.",
    },
    phase1Questions: [
      ACADEMICS_LEARNING_CHALLENGES[0], // Feynman Technique in Ibadan
      ACADEMICS_LEARNING_CHALLENGES[1], // Overcoming Sudden Exam Panic
      MEMORY_CHALLENGES[0] || ACADEMICS_LEARNING_CHALLENGES[0],
      FAMILY_RELATIONSHIPS_CHALLENGES[2], // Remembering Family Milestones
      MEMORY_CHALLENGES[1] || ACADEMICS_LEARNING_CHALLENGES[0],
      LOGIC_CHALLENGES[0] || ACADEMICS_LEARNING_CHALLENGES[1],
    ],
    phase2PhysicalTask: {
      id: "phys-task-03",
      title: "5-Minute Blind Handwritten Concept Recall",
      illustrationType: "handwriting",
      durationMinutes: 5,
      physicalAction: "Take a physical pen and blank paper. For 5 uninterrupted minutes, write down every key concept, formula, or work decision you studied today without checking any notes.",
      cognitiveConnection: "Handwriting engages fine-motor kinesthetic neural loops in the motor cortex, reinforcing semantic memory pathways.",
      xpReward: 50,
      coinReward: 20,
    },
  },

  // ─── LESSON 4: FINANCIAL IMPULSE CONTROL & WEALTH (MONEY / FINANCE) ────────
  {
    id: "lesson-04-financial-impulse-control",
    dayIndex: 4,
    topicTitle: "The 48-Hour Dopamine Rule: Mastering Financial Discipline & Impulse Gating",
    category: "Business & Wealth",
    roleTarget: "For Traders, Earners, Families & Wealth Builders",
    topicEmoji: "💰",
    topicIllustration: "finance",
    challenge:
      "You see attractive deals, gadgets, or luxury items online, feel an intense urge to buy immediately, and later suffer from financial stress and regret.",
    solution:
      "Dopamine peaks during the anticipation of a purchase, not the satisfaction of owning it. Adding a 48-hour temporal buffer allows the striatum's dopamine craving spike to cool down, restoring rational prefrontal financial budgeting.",
    actionRule:
      "Place every non-essential purchase on a 48-hour 'Cooling List'. If you still need it after 2 days and it fits your budget, only then proceed.",
    culturalWisdom: {
      quote: "Every mickle mek a muckle (Every small bit adds up to wealth).",
      origin: "Jamaican / Caribbean Proverb",
      meaning: "Micro-disciplines repeated daily compound into generational stability and financial peace of mind.",
    },
    phase1Questions: [
      WORKPLACE_FINANCE_CHALLENGES[4], // Financial Impulse Control 48-Hour Rule
      WORKPLACE_FINANCE_CHALLENGES[1], // Kingston SME Cash Flow Optimization
      PERSONAL_GROWTH_MINDSET_CHALLENGES[0], // Procrastination 2-Minute Rule
      WORKPLACE_FINANCE_CHALLENGES[0], // Negotiation in Lagos
      EXECUTIVE_DECISION_CHALLENGES[1] || WORKPLACE_FINANCE_CHALLENGES[1],
      CRITICAL_THINKING_CHALLENGES[1] || WORKPLACE_FINANCE_CHALLENGES[4],
    ],
    phase2PhysicalTask: {
      id: "phys-task-04",
      title: "10-Minute Financial Clarity & Budget Inventory",
      illustrationType: "drawing",
      durationMinutes: 10,
      physicalAction: "Write down your 3 core financial priorities for this month on a card and place it in your physical wallet as a visual friction reminder before opening cash or cards.",
      cognitiveConnection: "Creates physical and visual friction between emotional impulse cues and financial execution.",
      xpReward: 50,
      coinReward: 20,
    },
  },

  // ─── LESSON 5: FAMILY PATIENCE & ACTIVE LISTENING AT HOME ──────────────────
  {
    id: "lesson-05-family-patience-empathy",
    dayIndex: 5,
    topicTitle: "De-escalating Arguments & Cultivating Empathy at Home After Exhausting Days",
    category: "Family & Home",
    roleTarget: "For Parents, Spouses, Siblings & Extended Families",
    topicEmoji: "👨‍👩‍👧‍👦",
    topicIllustration: "family",
    challenge:
      "After a long day in traffic and work, minor household issues cause you to snap in anger at family members or spouses, damaging relational warmth.",
    solution:
      "Decision fatigue depletes glucose in the dorsolateral prefrontal cortex. Your brain's emotional brake is simply tired. Pausing for 90 seconds before entering home resets your nervous system from work stress to family sanctuary.",
    actionRule:
      "Sit quietly for 90 seconds outside your front door before entering. Take 5 deep breaths and remind your mind: 'Work is finished. I am entering my home with patience and love.'",
    culturalWisdom: {
      quote: "Ubuntu: I am because we are.",
      origin: "Southern African Philosophy",
      meaning: "Our cognitive and emotional wellness thrives on collective community safety and gentle empathy at home.",
    },
    phase1Questions: [
      FAMILY_RELATIONSHIPS_CHALLENGES[0], // De-escalating Heated Argument at Home
      FAMILY_RELATIONSHIPS_CHALLENGES[1], // Supermarket Tantrum Co-regulation
      FAMILY_RELATIONSHIPS_CHALLENGES[2], // Remembering Family Milestones
      EQ_CHALLENGES[1] || FAMILY_RELATIONSHIPS_CHALLENGES[0],
      WORKPLACE_FINANCE_CHALLENGES[3], // Resolving Leadership Conflict
      PERSONAL_GROWTH_MINDSET_CHALLENGES[1], // Morning Phone Loop
    ],
    phase2PhysicalTask: {
      id: "phys-task-05",
      title: "10-Minute Guided Box Breathing & Sensory Wind-Down",
      illustrationType: "meditation",
      durationMinutes: 10,
      physicalAction: "Sit comfortably in a quiet space with eyes closed. Inhale for 4s, hold for 4s, exhale for 6s, and hold for 2s. Repeat for 10 minutes to release accumulated physical tension.",
      cognitiveConnection: "Downregulates sympathetic nervous system tone, restoring emotional patience and prefrontal empathy.",
      xpReward: 50,
      coinReward: 20,
    },
  },
];

export function getTodaysCurriculumLesson(): DailyCurriculumLesson {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_CURRICULUM_LESSONS[dayOfYear % DAILY_CURRICULUM_LESSONS.length];
}

export function getCurriculumLessonById(id: string): DailyCurriculumLesson | undefined {
  return DAILY_CURRICULUM_LESSONS.find((l) => l.id === id);
}
