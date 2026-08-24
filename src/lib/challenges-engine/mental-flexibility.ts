import { CognitiveChallenge } from "./types";

export const MENTAL_FLEXIBILITY_CHALLENGES: CognitiveChallenge[] = [
  {
    id: "flx-01",
    title: "Wisconsin Card Sorting Rule Switch",
    category: "Mental Flexibility",
    subcategory: "Cognitive Set-Shifting",
    difficulty: "intermediate",
    type: "mental_flexibility",
    estimatedTimeSec: 20,
    cognitiveSkill: "Set-Shifting & Rule Adaptation",
    instruction: "Rule 1 was: Sort by COLOR. The rule has just SWITCHED to: Sort by SHAPE.",
    question: "Which target matches the NEW rule for: 🟢 Green Triangle ?",
    options: [
      { id: "o1", label: "🔺 Red Triangle (Matches SHAPE)", isCorrect: true },
      { id: "o2", label: "🟩 Green Square (Matches old COLOR rule)", isCorrect: false },
      { id: "o3", label: "🔵 Blue Circle (No match)", isCorrect: false },
    ],
    educationalWhy: "Inhibiting a previously rewarded sorting rule and switching to a new dimension exercises the frontoparietal control network.",
    xpReward: 50,
    coinReward: 12,
  },
  {
    id: "flx-02",
    title: "Reverse Inversion Command",
    category: "Mental Flexibility",
    subcategory: "Inhibitory Switch",
    difficulty: "intermediate",
    type: "mental_flexibility",
    estimatedTimeSec: 15,
    cognitiveSkill: "Inversive Mental Flexibility",
    instruction: "When the indicator says 'REVERSE', select the OPPOSITE of what is true.",
    question: "Condition: [ REVERSE MODE ACTIVE ] Is 15 greater than 8?",
    options: [
      { id: "o1", label: "NO (Inverted False response)", isCorrect: true },
      { id: "o2", label: "YES (Standard True response)", isCorrect: false },
    ],
    educationalWhy: "Rapidly flipping response contingencies tests cognitive flexibility under working memory load.",
    xpReward: 45,
    coinReward: 10,
  },
];
