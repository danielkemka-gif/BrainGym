/**
 * BRAINGYM FOUR CORE OUTCOMES & MASTER MISSION MANIFESTO
 * 
 * Master Product Mission:
 * «BrainGym is a mental fitness platform designed to help people develop the ability
 * to THINK, SOLVE, DECIDE and ADAPT in real life.»
 * 
 * Core Philosophy:
 * «You train your body. You educate yourself. You develop your career. You grow spiritually.
 * But you also need to deliberately train the mind you use to navigate all of them.
 * That's BrainGym — Mental Fitness for Real Life.»
 */

import { CoreMentalFitnessArea } from "./types";

export type CoreOutcomeCategory = "THINK" | "SOLVE" | "DECIDE" | "ADAPT";

export interface CoreOutcomeDefinition {
  id: CoreOutcomeCategory;
  title: string;
  verb: string;
  tagline: string;
  emoji: string;
  color: string;
  description: string;
  capabilitiesTrained: string[];
  realLifeTransfer: string;
  mappedMentalSkills: CoreMentalFitnessArea[];
}

export const FOUR_CORE_OUTCOMES: CoreOutcomeDefinition[] = [
  {
    id: "THINK",
    title: "THINK",
    verb: "Deep Analysis & Clarity",
    tagline: "Cut through noise and analyze clearly",
    emoji: "🧠",
    color: "#6366f1",
    description: "Focus attention, remember critical details, question assumptions, and evaluate information critically.",
    capabilitiesTrained: [
      "Sustain deep focus amid digital distraction",
      "Retain working memory for real-time calculations",
      "Identify hidden patterns in data and human behavior",
      "Question false premises and verify claims",
      "Separate factual signals from emotional noise",
    ],
    realLifeTransfer: "Interpreting complex reports, spotting misdirection, and mastering academic/professional concepts faster.",
    mappedMentalSkills: ["Focus", "Memory", "Critical thinking"],
  },
  {
    id: "SOLVE",
    title: "SOLVE",
    verb: "Creative Problem Breakdown",
    tagline: "Break bottlenecks and engineer solutions",
    emoji: "🧩",
    color: "#10b981",
    description: "Deconstruct complex obstacles, generate lateral alternatives, and overcome resource constraints.",
    capabilitiesTrained: [
      "Break complex multi-variable problems into simple steps",
      "Generate divergent lateral options under tight constraints",
      "Navigate unfamiliar, ambiguous operational hurdles",
      "Synthesize zero-cost grassroots workarounds",
      "Solve bottlenecks without panic or delay",
    ],
    realLifeTransfer: "Fixing operational breakdowns at work, resolving cash bottlenecks in business, and solving everyday logistics.",
    mappedMentalSkills: ["Problem-solving", "Creativity"],
  },
  {
    id: "DECIDE",
    title: "DECIDE",
    verb: "Strategic Decision-Making",
    tagline: "Evaluate trade-offs and choose wisely",
    emoji: "⚖️",
    color: "#3b82f6",
    description: "Evaluate options rationally, project second-order consequences, manage risk, and resist impulse pressure.",
    capabilitiesTrained: [
      "Forecast second- and third-order consequences",
      "Resist peer pressure, FOMO, and impulsive panic concessions",
      "Weigh risk vs reward with clear trade-off bounds",
      "Make high-confidence choices with incomplete data",
      "Preserve personal and commercial boundaries",
    ],
    realLifeTransfer: "Pricing negotiations, career transitions, major investments, and family life choices.",
    mappedMentalSkills: ["Decision-making", "Self-awareness"],
  },
  {
    id: "ADAPT",
    title: "ADAPT",
    verb: "Agile Resilience & Mental Flexibility",
    tagline: "Pivot smoothly when circumstances change",
    emoji: "🌊",
    color: "#06b6d4",
    description: "Pivot smoothly when plans fail, update outdated assumptions, and thrive under uncertainty.",
    capabilitiesTrained: [
      "Shift mental frameworks rapidly when facts change",
      "Maintain emotional composure during sudden disruptions",
      "Learn and extract strategic lessons from failure",
      "Navigate unfamiliar environments and cultures",
      "Update long-held assumptions in light of new evidence",
    ],
    realLifeTransfer: "Surviving sudden economic shifts, adjusting project directions, and thriving across changing life stages.",
    mappedMentalSkills: ["Adaptability", "Self-awareness"],
  },
];

export const MASTER_VALUE_PROPOSITION = {
  headline: "Mental Fitness for Real Life",
  promise: "Train the mind you use to navigate life.",
  manifesto: [
    "You train your body in the gym.",
    "You educate yourself in school and books.",
    "You develop your career in business and work.",
    "You grow spiritually in your faith community.",
    "But you also need to deliberately train the mind you use to navigate all of them.",
    "That's BrainGym.",
  ],
  transferContinuum: "School → Work → Business → Family → Community → Life",
  theBigQuestion: "«How well can you use your mind when real life gives you a problem?»",
};
