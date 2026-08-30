import { CognitiveChallenge } from "./types";

export const ACADEMICS_LEARNING_CHALLENGES: CognitiveChallenge[] = [
  // ─── ACTIVE RECALL & EXAM MASTERY ──────────────────────────────────────────
  {
    id: "acad-recall-01",
    title: "The Feynman Technique: Explaining Complex Concepts Simply",
    category: "Critical Thinking",
    subcategory: "Semantic Synthesis & Conceptual Clarity",
    difficulty: "intermediate",
    type: "critical_scenario",
    estimatedTimeSec: 40,
    cognitiveSkill: "Conceptual Restructuring & Pedagogical Transfer",
    instruction: "Identify the study method that reveals hidden gaps in comprehension.",
    question: "Fatima is preparing for a medical biochemistry exam in Ibadan. She has read the textbook chapter three times. What is the ultimate cognitive test of whether she genuinely understands the material?",
    options: [
      {
        id: "opt-1",
        label: "Explain the biochemical cycle out loud in plain, non-technical language as if teaching a 10-year-old child, without looking at notes.",
        isCorrect: true,
        explanation: "The Feynman Technique eliminates the illusion of competence by forcing you to simplify jargon and expose exact knowledge gaps.",
      },
      {
        id: "opt-2",
        label: "Highlight all key sentences in yellow, blue, and pink highlighters.",
        isCorrect: false,
        explanation: "Highlighting is passive motor engagement that provides minimal synaptic consolidation in long-term memory.",
      },
      {
        id: "opt-3",
        label: "Read the textbook chapter a fourth time while listening to upbeat music.",
        isCorrect: false,
        explanation: "Rereading induces a false feeling of familiarity without testing actual retrieval pathways.",
      },
      {
        id: "opt-4",
        label: "Copy the chapter word-for-word into a new notebook.",
        isCorrect: false,
        explanation: "Mechanical copying bypasses semantic processing, resulting in low long-term retention.",
      },
    ],
    educationalWhy: "Explaining concepts simply requires active semantic reconstruction in the bilateral frontoparietal learning network.",
    xpReward: 40,
    coinReward: 15,
  },

  // ─── EXAM ANXIETY & COGNITIVE RECOVERY ──────────────────────────────────────
  {
    id: "acad-anx-02",
    title: "Overcoming Sudden Exam Panic Blank-Out",
    category: "Mental Wellness",
    subcategory: "Autonomic Stress Regulation",
    difficulty: "beginner",
    type: "wellness_reflection",
    estimatedTimeSec: 35,
    cognitiveSkill: "Sympathetic Reset & Working Memory Recovery",
    instruction: "Select the rapid recovery technique for exam-induced mental freeze.",
    question: "During a national professional certification exam, a student opens the test booklet, sees a difficult question, and suddenly feels their heart race and mind go completely blank. What is the fastest neurological protocol to restore working memory?",
    options: [
      {
        id: "opt-1",
        label: "Take two deep nasal 'physiological sighs' (double inhale through nose, long slow exhale through mouth), skip to an easy question, and return in 5 minutes.",
        isCorrect: true,
        explanation: "The physiological sigh rapidly expands collapsed alveoli, offloads CO2, stimulates vagal tone, and brings prefrontal working memory back online.",
      },
      {
        id: "opt-2",
        label: "Stare intensely at the difficult question and tense all your muscles until an answer appears.",
        isCorrect: false,
        explanation: "Physical tension elevates sympathetic adrenaline, further starving the prefrontal cortex of blood flow.",
      },
      {
        id: "opt-3",
        label: "Tell yourself that you are going to fail the entire exam and panic.",
        isCorrect: false,
        explanation: "Catastrophizing triggers a full amygdala hijacking, locking out rational problem-solving networks.",
      },
      {
        id: "opt-4",
        label: "Hand in the test paper and give up immediately.",
        isCorrect: false,
        explanation: "Mental freezes are temporary physiological states that resolve within 90 seconds of regulated breathing.",
      },
    ],
    educationalWhy: "The physiological sigh is the fastest behavioral tool known to neuroscience for reducing autonomic arousal in real time.",
    xpReward: 35,
    coinReward: 15,
  },
];
