import { CognitiveChallenge } from "./types";

export const FAMILY_RELATIONSHIPS_CHALLENGES: CognitiveChallenge[] = [
  // ─── ACTIVE LISTENING & CONFLICT DE-ESCALATION ────────────────────────────
  {
    id: "fam-listen-01",
    title: "De-escalating a Heated Argument at Home",
    category: "Emotional Intelligence",
    subcategory: "Active Listening & Emotional Regulation",
    difficulty: "intermediate",
    type: "critical_scenario",
    estimatedTimeSec: 40,
    cognitiveSkill: "Vagal Modulation & Verbal De-escalation",
    instruction: "Select the response that activates relational trust and lowers physiological arousal.",
    question: "After a long day, your spouse or family member expresses intense frustration about household chores being forgotten: 'You never notice how much work I do around here!' What is the most emotionally intelligent initial response?",
    options: [
      {
        id: "opt-1",
        label: "Reflect the underlying emotion first: 'You are feeling overwhelmed and unappreciated right now, and that is completely valid. Let me listen.'",
        isCorrect: true,
        explanation: "Validating emotional affect immediately downregulates the speaker's amygdala, shifting the interaction from combat to collaboration.",
      },
      {
        id: "opt-2",
        label: "List every chore you personally completed over the last 14 days to prove them logically wrong.",
        isCorrect: false,
        explanation: "Counter-attacking with logical scorekeeping escalates defensiveness and invalidates emotional distress.",
      },
      {
        id: "opt-3",
        label: "Walk away abruptly and tell them to calm down before speaking to you.",
        isCorrect: false,
        explanation: "Telling an upset person to 'calm down' triggers acute feelings of emotional abandonment and invalidation.",
      },
      {
        id: "opt-4",
        label: "Sigh loudly and roll your eyes to express silent irritation.",
        isCorrect: false,
        explanation: "Contempt (eye-rolling) is clinically recognized as the single strongest predictor of relationship breakdown.",
      },
    ],
    educationalWhy: "Affect labeling ('You are feeling overwhelmed') shifts neural activity from the amygdala to the right ventrolateral prefrontal cortex.",
    xpReward: 40,
    coinReward: 15,
  },

  // ─── PARENTING & ATTENTIONAL PATIENCE ──────────────────────────────────────
  {
    id: "fam-parent-02",
    title: "Navigating a Toddler's Public Tantrum with Calm Authority",
    category: "Mental Wellness",
    subcategory: "Parenting & Attentional Patience",
    difficulty: "beginner",
    type: "wellness_reflection",
    estimatedTimeSec: 35,
    cognitiveSkill: "Parasympathetic Downregulation & Co-Regulation",
    instruction: "Identify the co-regulation protocol that rapidly restores safety.",
    question: "A 4-year-old child starts crying and screaming in a supermarket in Bridgetown because they cannot get a box of sweets. What parental co-regulation technique works best neurologically?",
    options: [
      {
        id: "opt-1",
        label: "Get down to eye level, maintain calm slow breathing, use a gentle low tone of voice, and hold physical space until the storm passes.",
        isCorrect: true,
        explanation: "Children's developing prefrontal cortex lacks top-down self-regulation; they co-regulate their nervous system against the calm physiology of the parent.",
      },
      {
        id: "opt-2",
        label: "Shout louder than the child to show everyone in the supermarket that you are in control.",
        isCorrect: false,
        explanation: "Yelling introduces threat signals, pushing the child deeper into sympathetic fight-or-flight panic.",
      },
      {
        id: "opt-3",
        label: "Give in immediately and buy the sweets so the crying stops.",
        isCorrect: false,
        explanation: "Rewarding emotional outbursts reinforces operant conditioning for escalating tantrums in the future.",
      },
      {
        id: "opt-4",
        label: "Threaten to leave the child behind in the supermarket.",
        isCorrect: false,
        explanation: "Threats of abandonment induce toxic developmental anxiety in young children.",
      },
    ],
    educationalWhy: "Mirror neurons and vagal pathways mean your child's nervous system directly mirrors your internal autonomic state.",
    xpReward: 35,
    coinReward: 15,
  },

  // ─── MEMORY FOR FAMILY MILESTONES & NAMES ──────────────────────────────────
  {
    id: "fam-mem-03",
    title: "Remembering Extended Family Details & Milestones",
    category: "Memory",
    subcategory: "Associative Episodic Recall",
    difficulty: "intermediate",
    type: "memory_recall",
    estimatedTimeSec: 45,
    cognitiveSkill: "Associative Encoding & Semantic Linking",
    instruction: "Use mnemonic association to recall multi-generational family connections.",
    question: "At a family reunion in Port of Spain, you meet your cousin's new partner, Dr. Kwame (a pediatric dentist who loves reggae music and marathon running). How do you anchor this in memory so you remember their name and details next year?",
    options: [
      {
        id: "opt-1",
        label: "Create a vivid visual anchor: Picture Kwame running in a marathon with a giant toothbrush in hand, humming a classic Bob Marley melody.",
        isCorrect: true,
        explanation: "Dual-coding and bizarre, emotionally rich mental imagery engage both the visual cortex and hippocampus for permanent recall.",
      },
      {
        id: "opt-2",
        label: "Repeat the name 'Kwame' 100 times silently in your head without forming any visual associations.",
        isCorrect: false,
        explanation: "Rote phonological repetition lacks semantic depth and decays rapidly from working memory.",
      },
      {
        id: "opt-3",
        label: "Hope that you will naturally remember next year without any mental effort.",
        isCorrect: false,
        explanation: "Without active encoding, episodic details fade within 48 hours according to the Ebbinghaus forgetting curve.",
      },
      {
        id: "opt-4",
        label: "Ask them to wear a name tag at all future family gatherings.",
        isCorrect: false,
        explanation: "Relying on external crutches prevents personal hippocampal mnemonic strengthening.",
      },
    ],
    educationalWhy: "Mnemonic association links new episodic information to existing well-established neural networks in the temporal lobe.",
    xpReward: 40,
    coinReward: 20,
  },
];
