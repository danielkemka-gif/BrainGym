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
        label: "The sample size evaluated across coastal cities was too small to draw mathematical conclusions.",
        isCorrect: false,
      },
      {
        id: "o3",
        label: "Eating ice cream impairs physical digestion and causes immediate severe cramps in all swimmers.",
        isCorrect: false,
      },
      {
        id: "o4",
        label: "The correlation is purely fictional and ice cream consumption does not actually peak in summer.",
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
        label: "To the wings and tail sections because that is where the bullet damage is clearly visible.",
        isCorrect: false,
      },
      {
        id: "o3",
        label: "Evenly across the entire aircraft surface without performing structural weight calculations.",
        isCorrect: false,
      },
      {
        id: "o4",
        label: "Only to the landing gear to ensure planes can land safely regardless of in-flight fuselage damage.",
        isCorrect: false,
      },
    ],
    educationalWhy: "Abraham Wald's discovery of survivorship bias demonstrated that what is missing from a dataset is often more informative than what is present.",
    xpReward: 60,
    coinReward: 15,
  },
];
