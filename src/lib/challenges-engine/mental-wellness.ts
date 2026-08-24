import { CognitiveChallenge } from "./types";

export const MENTAL_WELLNESS_CHALLENGES: CognitiveChallenge[] = [
  {
    id: "wel-01",
    title: "The Box Breathing Vagal Reset",
    category: "Mental Wellness",
    subcategory: "Stress Regulation",
    difficulty: "beginner",
    type: "wellness_reflection",
    estimatedTimeSec: 20,
    cognitiveSkill: "Autonomic Nervous System Regulation",
    instruction: "When experiencing acute mental overwhelm, which breathing ratio activates the parasympathetic rest response?",
    question: "What is the standard Box Breathing cadence used by high-performance performers?",
    options: [
      {
        id: "o1",
        label: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s (Box Breathing Cadence).",
        isCorrect: true,
      },
      {
        id: "o2",
        label: "Rapid shallow chest hyperventilation for sixty continuous seconds.",
        isCorrect: false,
      },
      {
        id: "o3",
        label: "Holding breath for three full minutes until experiencing lightheadedness.",
        isCorrect: false,
      },
      {
        id: "o4",
        label: "Inhale 10s → Exhale 1s with maximum forced thoracic muscular compression.",
        isCorrect: false,
      },
    ],
    educationalWhy: "Controlled 4-4-4-4 box breathing stimulates the vagus nerve, slowing heart rate and lowering circulating cortisol.",
    xpReward: 45,
    coinReward: 10,
  },
  {
    id: "wel-02",
    title: "Cognitive Reframing of Fatigue",
    category: "Mental Wellness",
    subcategory: "Mindset Calibration",
    difficulty: "intermediate",
    type: "wellness_reflection",
    estimatedTimeSec: 20,
    cognitiveSkill: "Cognitive Reappraisal",
    instruction: "You feel mental resistance before beginning an important deep work session.",
    question: "Which mental framing promotes long-term neuroplastic growth?",
    options: [
      {
        id: "o1",
        label: "'This mental friction is the physical sensation of neural pathways strengthening through effort.'",
        isCorrect: true,
      },
      {
        id: "o2",
        label: "'I feel friction because I lack inherent genetic talent and should abandon the task completely.'",
        isCorrect: false,
      },
      {
        id: "o3",
        label: "'I must postpone all creative and technical work until I feel completely inspired and rested.'",
        isCorrect: false,
      },
      {
        id: "o4",
        label: "'Cognitive fatigue indicates that my brain capacity has reached its permanent structural ceiling.'",
        isCorrect: false,
      },
    ],
    educationalWhy: "Carol Dweck's growth mindset research shows reframing effort as neural adaptation dramatically boosts sustained persistence.",
    xpReward: 50,
    coinReward: 12,
  },
];
