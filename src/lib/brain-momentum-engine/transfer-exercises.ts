import { RealWorldTransferExercise, CognitiveDomain } from "./types";

export const REAL_WORLD_TRANSFER_EXERCISES: RealWorldTransferExercise[] = [
  // ─── WORKING MEMORY ────────────────────────────────────────────────────────
  {
    id: "xf-wm-01",
    domain: "Working Memory",
    title: "5-Step Reverse Recall Anchor",
    tagline: "Before checking your phone, mentally name the last 5 things you did today in exact reverse order.",
    instruction: "Pause for 30 seconds. Without looking at notes or screens, mentally reconstruct the last 5 distinct physical actions you completed today in reverse sequence.",
    durationMinutes: 1,
    whyItMatters: "Mentally traversing episodic event timelines engages dorsolateral prefrontal working memory buffers.",
    responsibleDisclaimer: "This activity is designed to practise everyday working memory retention and mental sequencing.",
    xpReward: 25,
  },
  {
    id: "xf-wm-02",
    domain: "Working Memory",
    title: "The Mental Grocery Cart Ledger",
    tagline: "Before checking your shopping list or receipt, recall 6 items and estimate the total in your head.",
    instruction: "Mentally hold 6 items in working memory while multiplying their approximate prices before checking the paper list.",
    durationMinutes: 2,
    whyItMatters: "Dual-task working memory exercises require simultaneous memory maintenance and arithmetic manipulation.",
    responsibleDisclaimer: "This activity is designed to practise dual-task cognitive retention during everyday errands.",
    xpReward: 25,
  },

  // ─── FOCUS & ATTENTION ──────────────────────────────────────────────────────
  {
    id: "xf-foc-01",
    domain: "Focus",
    title: "The 15-Minute Zero-Switching Block",
    tagline: "Spend the next 15 minutes completing one task with zero app or tab switches.",
    instruction: "Pick your next urgent task. Close all other tabs and put your phone face down. Work continuously for 15 minutes without glancing at notifications.",
    durationMinutes: 15,
    whyItMatters: "Single-task focus eliminates cognitive attention residue and strengthens top-down attentional control.",
    responsibleDisclaimer: "This activity is designed to practise sustained attention and minimize task-switching friction.",
    xpReward: 35,
  },
  {
    id: "xf-foc-02",
    domain: "Focus",
    title: "The Mindful Environmental Scan",
    tagline: "Look around your immediate environment and identify 5 specific details you had not consciously noticed before.",
    instruction: "Spend 2 minutes observing your room or office. Spot 5 subtle physical features (textures, shadows, objects, patterns) you normally overlook.",
    durationMinutes: 2,
    whyItMatters: "Active visual search exercises selective visual attention in the parietal cortex.",
    responsibleDisclaimer: "This activity is designed to practise conscious visual observation and situational awareness.",
    xpReward: 20,
  },

  // ─── MEMORY ─────────────────────────────────────────────────────────────────
  {
    id: "xf-mem-01",
    domain: "Memory",
    title: "The 20-Second Room Recall Challenge",
    tagline: "Look around your room for 20 seconds. Close your eyes and name 8 objects you remember.",
    instruction: "Scan your surroundings for 20 seconds. Close your eyes and name 8 distinct items and their spatial positions in the room.",
    durationMinutes: 2,
    whyItMatters: "Translating brief visual sensory exposure into verbal memory recall stimulates hippocampal binding.",
    responsibleDisclaimer: "This activity is designed to practise active spatial recall and visual encoding.",
    xpReward: 25,
  },
  {
    id: "xf-mem-02",
    domain: "Memory",
    title: "The Name & Association Peg",
    tagline: "When meeting someone or hearing a new name today, create a visual association peg.",
    instruction: "Associate the person's name with an unforgettable mental image or distinct visual feature to lock it into long-term recall.",
    durationMinutes: 2,
    whyItMatters: "Elaborative encoding builds richer neural retrieval cues than passive repetition.",
    responsibleDisclaimer: "This activity is designed to practise associative memory techniques in social and professional settings.",
    xpReward: 25,
  },

  // ─── PROCESSING SPEED ───────────────────────────────────────────────────────
  {
    id: "xf-spd-01",
    domain: "Processing Speed",
    title: "Mental Subtotal Speed Sprint",
    tagline: "Mentally calculate the total of three simple prices or numbers before reaching for a calculator.",
    instruction: "Whenever you see 3 prices or quantities today, sum them mentally within 5 seconds before checking on a screen.",
    durationMinutes: 1,
    whyItMatters: "Rapid mental arithmetic activates intraparietal sulcus numerical pathways under time pressure.",
    responsibleDisclaimer: "This activity is designed to practise mental math agility and numeric processing speed.",
    xpReward: 25,
  },
  {
    id: "xf-spd-02",
    domain: "Processing Speed",
    title: "The 30-Second Fast Categorizer",
    tagline: "In 30 seconds, mentally name 10 items in a specific category (e.g. African cities, kitchen utensils).",
    instruction: "Set a 30-second timer. Rapidly name 10 distinct items in a single category without pausing.",
    durationMinutes: 1,
    whyItMatters: "Verbal fluency tasks measure rapid lexical retrieval speed from semantic memory stores.",
    responsibleDisclaimer: "This activity is designed to practise lexical retrieval speed and cognitive fluency.",
    xpReward: 25,
  },

  // ─── PROBLEM SOLVING & REASONING ───────────────────────────────────────────
  {
    id: "xf-ps-01",
    domain: "Problem Solving",
    title: "The Inversion Question Drill",
    tagline: "When facing a roadblock today, ask: 'How could I guarantee the absolute worst outcome here?'",
    instruction: "Write down 3 ways to make the problem drastically worse, then systematically invert those points to reveal the optimal solution.",
    durationMinutes: 5,
    whyItMatters: "Inversion bypasses standard cognitive biases by reframing problem spaces from failure modes.",
    responsibleDisclaimer: "This activity is designed to practise lateral problem solving and bias reduction in decision making.",
    xpReward: 30,
  },
  {
    id: "xf-ps-02",
    domain: "Problem Solving",
    title: "The Second-Order Consequence Check",
    tagline: "Before making a key decision today, ask: 'And then what happens 3 months from now?'",
    instruction: "Trace the ripple effects of your upcoming decision past the immediate first-order outcome into secondary systemic consequences.",
    durationMinutes: 3,
    whyItMatters: "Second-order thinking trains executive prefrontal evaluation of long-term tradeoffs.",
    responsibleDisclaimer: "This activity is designed to practise strategic foresight and consequential reasoning.",
    xpReward: 30,
  },

  // ─── REACTION TIME & REFLEX ────────────────────────────────────────────────
  {
    id: "xf-rx-01",
    domain: "Reaction Time",
    title: "The Tactile Reflex Catch",
    tagline: "Drop an object (like an eraser or coin) from one hand and catch it with the opposite hand before it drops 30cm.",
    instruction: "Hold a small soft object at chest height with your right hand. Drop it and catch it cleanly with your left hand. Repeat 5 times per side.",
    durationMinutes: 2,
    whyItMatters: "Visual-motor coordination requires millisecond-level sensory feedback loops through the motor cortex and cerebellum.",
    responsibleDisclaimer: "This activity is designed to practise physical eye-hand coordination and reaction alertness.",
    xpReward: 25,
  },
];

export function getTransferExerciseForDomain(domain: CognitiveDomain): RealWorldTransferExercise {
  const matches = REAL_WORLD_TRANSFER_EXERCISES.filter((e) => e.domain === domain);
  if (matches.length > 0) {
    const seed = new Date().getDate();
    return matches[seed % matches.length];
  }
  return REAL_WORLD_TRANSFER_EXERCISES[0];
}
