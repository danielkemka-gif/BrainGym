import { CognitiveVerificationQuestion } from "./types";

export const COGNITIVE_VERIFICATION_BANK: Record<string, CognitiveVerificationQuestion[]> = {
  // ─── MEMORY WALK VERIFICATION ──────────────────────────────────────────────
  "memory-walk": [
    {
      id: "mw-q1",
      question: "Which sequence of items were you tasked to encode during your walk?",
      options: [
        "Oak Tree → Red Vehicle → Blue Door → Street Lamp",
        "Bicycle → Yellow Sign → White Dog → Stone Wall",
        "Coffee Cup → Postal Box → Green Gate → Park Bench",
        "Silver Car → Brick Wall → Potted Plant → Road Sign",
      ],
      correctAnswer: "Oak Tree → Red Vehicle → Blue Door → Street Lamp",
      explanation: "Spatial sequential encoding strengthens episodic memory in the hippocampus.",
      cognitiveSkill: "Episodic Recall",
    },
    {
      id: "mw-q2",
      question: "In reverse order, what was the 3rd object in your walk's target anchor list?",
      options: ["Red Vehicle", "Oak Tree", "Blue Door", "Street Lamp"],
      correctAnswer: "Red Vehicle",
      explanation: "Reverse sequence retrieval exercises dorsolateral prefrontal working memory.",
      cognitiveSkill: "Working Memory Manipulation",
    },
    {
      id: "mw-q3",
      question: "Which sensory detail was designated as your environmental sound anchor?",
      options: [
        "Birdsong or distant traffic rhythm",
        "Footstep cadence on gravel",
        "Wind rustling through canopy leaves",
        "Running water or fountain splash",
      ],
      correctAnswer: "Birdsong or distant traffic rhythm",
      explanation: "Auditory sensory grounding enhances multi-sensory associative memory.",
      cognitiveSkill: "Sensory Grounding",
    },
  ],

  // ─── OBSERVATION CHALLENGE VERIFICATION ────────────────────────────────────
  "observation-challenge": [
    {
      id: "obs-q1",
      question: "How many distinct architectural or natural textures were you instructed to consciously catalog?",
      options: ["4 distinct textures", "2 simple colors", "7 vehicle brands", "10 street numbers"],
      correctAnswer: "4 distinct textures",
      explanation: "Fine-grain texture discrimination recruits high-resolution visual processing pathways.",
      cognitiveSkill: "Visual Discrimination",
    },
    {
      id: "obs-q2",
      question: "Which environmental anomaly did you actively seek during your observation session?",
      options: [
        "Unusual color contrasts or unexpected geometric patterns",
        "Loud engine noises or horn blasts",
        "Litter along the curb line",
        "Cloud shapes resembling animals",
      ],
      correctAnswer: "Unusual color contrasts or unexpected geometric patterns",
      explanation: "Anomaly detection trains bottom-up attentional salience and novelty detection.",
      cognitiveSkill: "Attentional Salience",
    },
  ],

  // ─── BALANCE + RECALL VERIFICATION ─────────────────────────────────────────
  "balance-recall": [
    {
      id: "bal-q1",
      question: "While holding your single-leg balance pose, what mental math sequence did you complete?",
      options: [
        "Counting backwards from 100 by increments of 7",
        "Multiplying single-digit prime numbers",
        "Spelling 5-letter words in reverse",
        "Recalling phone numbers backwards",
      ],
      correctAnswer: "Counting backwards from 100 by increments of 7",
      explanation: "Dual-task interference challenges the cerebellum and prefrontal cortex simultaneously.",
      cognitiveSkill: "Dual-Task Cognitive Balance",
    },
    {
      id: "bal-q2",
      question: "What was the 3rd number reached in the 100 - 7 cadence?",
      options: ["79", "86", "93", "72"],
      correctAnswer: "79",
      explanation: "100 → 93 → 86 → 79. Working memory arithmetic verification confirmed.",
      cognitiveSkill: "Numeric Working Memory",
    },
  ],

  // ─── GENERAL PHYSICAL VERIFICATION ─────────────────────────────────────────
  "general-physical": [
    {
      id: "gen-q1",
      question: "During your physical brain habit, which cognitive regulation principle did you practice?",
      options: [
        "Rhythmic diaphragmatic breathing with 4-4-6 cadence",
        "Speed sprinting without rest intervals",
        "Listening to fast-tempo music with high volume",
        "Holding your breath during maximum exertion",
      ],
      correctAnswer: "Rhythmic diaphragmatic breathing with 4-4-6 cadence",
      explanation: "Controlled breathwork activates parasympathetic vagal tone, reducing cortisol and mental fatigue.",
      cognitiveSkill: "Autonomic Nervous System Regulation",
    },
    {
      id: "gen-q2",
      question: "What physical sensation served as your mindful check-in cue halfway through the activity?",
      options: [
        "Heart rate rhythm and shoulder tension release",
        "Muscle burn in the quadriceps",
        "Perspiration rate on the forehead",
        "Cold temperature on the fingertips",
      ],
      correctAnswer: "Heart rate rhythm and shoulder tension release",
      explanation: "Interoceptive awareness strengthens insular cortex mind-body connectivity.",
      cognitiveSkill: "Interoceptive Awareness",
    },
  ],
};

export function getVerificationQuestionsForActivity(activityId: string): CognitiveVerificationQuestion[] {
  const normalized = activityId.toLowerCase();
  if (normalized.includes("walk") || normalized.includes("outdoor")) {
    return COGNITIVE_VERIFICATION_BANK["memory-walk"];
  }
  if (normalized.includes("observation") || normalized.includes("nature") || normalized.includes("commute")) {
    return COGNITIVE_VERIFICATION_BANK["observation-challenge"];
  }
  if (normalized.includes("balance") || normalized.includes("posture") || normalized.includes("yoga")) {
    return COGNITIVE_VERIFICATION_BANK["balance-recall"];
  }
  return COGNITIVE_VERIFICATION_BANK["general-physical"];
}
