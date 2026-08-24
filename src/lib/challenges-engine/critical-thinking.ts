import { CognitiveChallenge } from "./types";

export const CRITICAL_THINKING_CHALLENGES: CognitiveChallenge[] = [
  {
    id: "crt-01",
    title: "Correlation vs Causation Trap",
    category: "Critical Thinking",
    subcategory: "Scientific Rigor",
    difficulty: "intermediate",
    type: "critical_scenario",
    estimatedTimeSec: 20,
    cognitiveSkill: "Causal Inference Analysis",
    instruction: "Evaluate the statistical statement critically.",
    question: "'Ice cream sales and drowning incidents both peak in July. Therefore, eating ice cream causes drowning.' What is the logical flaw?",
    options: [
      {
        id: "o1",
        label: "Confounding variable: Hot summer weather causes both higher ice cream consumption and more swimming.",
        isCorrect: true,
      },
      {
        id: "o2",
        label: "The sample size was too small.",
        isCorrect: false,
      },
      {
        id: "o3",
        label: "Ice cream digestion causes cramps immediately in all swimmers.",
        isCorrect: false,
      },
    ],
    educationalWhy: "Identifying lurking third variables (confounders) is the cornerstone of scientific and critical reasoning.",
    xpReward: 50,
    coinReward: 12,
  },
  {
    id: "crt-02",
    title: "The Survivorship Bias Flaw",
    category: "Critical Thinking",
    subcategory: "Cognitive Bias Detection",
    difficulty: "advanced",
    type: "critical_scenario",
    estimatedTimeSec: 25,
    cognitiveSkill: "Survivorship Bias Evaluation",
    instruction: "Analyze the historical aircraft armor problem (Abraham Wald).",
    question: "Bombers returning from combat have bullet holes clustered in the wings and tail. Where should engineers add extra armor?",
    options: [
      {
        id: "o1",
        label: "To the cockpit and engines—planes hit there did not survive to be inspected (Survivorship Bias).",
        isCorrect: true,
      },
      {
        id: "o2",
        label: "To the wings and tail because that is where the holes are visible.",
        isCorrect: false,
      },
      {
        id: "o3",
        label: "Evenly spread over the entire plane without extra weight calculations.",
        isCorrect: false,
      },
    ],
    educationalWhy: "Abraham Wald's discovery of survivorship bias demonstrated that what is missing from a dataset is often more informative than what is present.",
    xpReward: 60,
    coinReward: 15,
  },
];
