import { CognitiveChallenge } from "./types";

export const PERSONAL_GROWTH_MINDSET_CHALLENGES: CognitiveChallenge[] = [
  // ─── OVERCOMING PROCRASTINATION & FRICTION ────────────────────────────────
  {
    id: "pg-proc-01",
    title: "The 2-Minute Activation Energy Rule for Procrastination",
    category: "Executive Decisions",
    subcategory: "Behavioral Momentum & Basal Ganglia",
    difficulty: "beginner",
    type: "critical_scenario",
    estimatedTimeSec: 30,
    cognitiveSkill: "Activation Energy Reduction & Behavioral Momentum",
    instruction: "Choose the method that overcomes basal ganglia task resistance.",
    question: "You have been avoiding starting a complex report for 3 days because it feels intimidating. What cognitive trick bypasses the brain's initial task aversion?",
    options: [
      {
        id: "opt-1",
        label: "Commit to working on the task for just 120 seconds (opening the file and writing one sentence), giving yourself permission to stop after 2 minutes.",
        isCorrect: true,
        explanation: "The brain resists perceived metabolic effort; shrinking the task to 2 minutes lowers the activation energy threshold, and once started, behavioral momentum takes over.",
      },
      {
        id: "opt-2",
        label: "Wait until 11 PM the night before the deadline so adrenaline forces you to panic-write.",
        isCorrect: false,
        explanation: "Panic-driven work produces high cortisol, errors, and severe mental exhaustion.",
      },
      {
        id: "opt-3",
        label: "Scroll social media until you suddenly feel inspired and motivated.",
        isCorrect: false,
        explanation: "Motivation follows action, not passive consumption; social scrolling drains dopamine reserves.",
      },
      {
        id: "opt-4",
        label: "Decide that you are naturally lazy and abandon the project.",
        isCorrect: false,
        explanation: "Procrastination is an emotional regulation issue, not a fixed character trait.",
      },
    ],
    educationalWhy: "Behavioral momentum triggers striatal dopamine release once action commences, reducing perceived effort.",
    xpReward: 35,
    coinReward: 15,
  },

  // ─── DIGITAL DOPAMINE & PHONE ADDICTION ────────────────────────────────────
  {
    id: "pg-phone-02",
    title: "Breaking the Compulsive Morning Phone-Check Loop",
    category: "Focus & Attention",
    subcategory: "Habit Loops & Reward Prediction Error",
    difficulty: "intermediate",
    type: "focus_fire",
    estimatedTimeSec: 35,
    cognitiveSkill: "Impulse Inhibition & Dopamine Reset",
    instruction: "Identify the morning habit design that protects your cognitive focus.",
    question: "Waking up and immediately checking notifications floods the brain with cortisol, adrenaline, and unpredictable dopamine hits. What environmental design cue best protects morning mental clarity?",
    options: [
      {
        id: "opt-1",
        label: "Charge your phone outside the bedroom and delay checking emails/social media until 30 minutes after waking, starting the day with water and natural light.",
        isCorrect: true,
        explanation: "Physical friction stops automatic habit loops, while morning photons reset the master circadian clock in the suprachiasmatic nucleus.",
      },
      {
        id: "opt-2",
        label: "Keep the phone under your pillow with full volume so you never miss an alert.",
        isCorrect: false,
        explanation: "Keeping high-stimulus devices in the sleep environment elevates baseline vigilance and disrupts deep sleep stages.",
      },
      {
        id: "opt-3",
        label: "Check 5 different news apps in bed before opening your eyes fully.",
        isCorrect: false,
        explanation: "Morning outrage and alarming headlines prime the amygdala for all-day chronic anxiety.",
      },
      {
        id: "opt-4",
        label: "Rely purely on willpower while holding the phone in your hand.",
        isCorrect: false,
        explanation: "Willpower is a finite prefrontal resource easily overwhelmed by frictionless dopamine cues.",
      },
    ],
    educationalWhy: "Environmental friction removes decision fatigue and prevents early morning dopaminergic hijacking.",
    xpReward: 40,
    coinReward: 20,
  },
];
