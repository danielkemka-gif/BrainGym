import { CognitiveChallenge } from "./types";

export const BOSS_CHALLENGES: CognitiveChallenge[] = [
  {
    id: "boss-01",
    title: "The Apollo Executive Crisis (Boss Challenge)",
    category: "Boss Challenge",
    subcategory: "Multi-Skill Crisis Triage",
    difficulty: "expert",
    type: "boss_multitask",
    estimatedTimeSec: 45,
    cognitiveSkill: "Multi-Domain Synthesis (Memory + Strategy + Speed)",
    instruction: "Read the multi-variable telemetry alert for 10 seconds. You must synthesize 3 constraints simultaneously.",
    memorizeDurationSec: 10,
    memorizeStory: "System Alarm: Main Oxygen Tank 2 at 18% (Critical). Secondary Power Grid Offline. Mission Clock: 04:32 remaining. Directive: Route backup battery bus B before pressurizing cabin.",
    question: "According to the emergency directive, what must be executed BEFORE pressurizing the cabin?",
    options: [
      {
        id: "o1",
        label: "Route backup battery bus B first (Preserves electrical life).",
        isCorrect: true,
      },
      {
        id: "o2",
        label: "Pressurize cabin immediately without battery routing.",
        isCorrect: false,
      },
      {
        id: "o3",
        label: "Vent Tank 2 completely into space.",
        isCorrect: false,
      },
    ],
    educationalWhy: "Boss challenges evaluate multi-system cognitive load capacity: holding crisis constraints in memory while executing sequential logic.",
    xpReward: 120,
    coinReward: 35,
  },
  {
    id: "boss-02",
    title: "The Grandmaster Logic & Anomaly Gauntlet",
    category: "Boss Challenge",
    subcategory: "High-Speed Logical Anomaly",
    difficulty: "expert",
    type: "boss_multitask",
    estimatedTimeSec: 40,
    cognitiveSkill: "High-Frequency Discrepancy & Logic",
    instruction: "Evaluate the compound proposition under extreme speed.",
    question: "Condition: If ALL A are B, and NO B are C, and SOME D are A: Which statement is IRREFUTABLY TRUE?",
    options: [
      { id: "o1", label: "Some D are NOT C (Because those D are A, and thus B, which cannot be C).", isCorrect: true },
      { id: "o2", label: "All D are C.", isCorrect: false },
      { id: "o3", label: "All C are A.", isCorrect: false },
      { id: "o4", label: "No D are B.", isCorrect: false },
    ],
    educationalWhy: "Euler/Venn multi-subset deduction tests peak working memory abstraction without pen and paper.",
    xpReward: 120,
    coinReward: 35,
  },
];
