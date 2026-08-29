import { LifeTransferChallenge, LifeRole, LifeStageBand } from "./types";

export const LIFE_TRANSFER_CHALLENGES: LifeTransferChallenge[] = [
  // ─── 1. STUDENTS (13–24) ───────────────────────────────────────────────────
  {
    id: "xf-std-memory-recall",
    title: "The 3-Minute Blind Study Recall",
    targetDomain: "Memory",
    lifeRoles: ["student", "job_seeker", "other"],
    ageBands: ["teen_13_17", "young_adult_18_24"],
    whatToDo: "Study one page of your current subject or reading material for 10 minutes. Then close your notes completely and write down every core concept, formula, or key term you remember.",
    whyYouAreDoingIt: "Passive rereading creates an illusion of competence. Active blind retrieval forces hippocampal synaptic consolidation, yielding up to 300% greater exam retention.",
    durationMinutes: 13,
    whatToRecord: {
      label: "Number of key concepts recalled accurately",
      type: "count",
      unit: "concepts",
      placeholder: "e.g. 7",
    },
    whatSkillItTrains: "Synaptic Retrieval & Exam Long-Term Retention",
    xpReward: 35,
    lifePerformanceCategory: "study_recall",
  },
  {
    id: "xf-std-focus-sprint",
    title: "The Zero-Tab Deep Study Block",
    targetDomain: "Focus",
    lifeRoles: ["student", "job_seeker"],
    ageBands: ["teen_13_17", "young_adult_18_24"],
    whatToDo: "Work on a single homework assignment, reading passage, or exam prep problem for 25 minutes. Keep your phone in another room and close all browser tabs except the active assignment.",
    whyYouAreDoingIt: "Every task switch creates attention residue that halves working memory capacity. Single-tasking protects your prefrontal cortex from cognitive fatigue.",
    durationMinutes: 25,
    whatToRecord: {
      label: "Total uninterrupted study minutes completed",
      type: "number",
      unit: "mins",
      placeholder: "e.g. 25",
    },
    whatSkillItTrains: "Sustained Attentional Stamina & Distraction Resistance",
    xpReward: 40,
    lifePerformanceCategory: "deep_work",
  },

  // ─── 2. PROFESSIONALS & EMPLOYEES (25–49) ──────────────────────────────────
  {
    id: "xf-pro-interruption-audit",
    title: "The 30-Minute Deep Work Sprint & Interruption Audit",
    targetDomain: "Focus",
    lifeRoles: ["employee", "professional", "consultant", "freelancer"],
    ageBands: ["adult_25_34", "prime_35_49"],
    whatToDo: "Select your highest-priority professional task. Work on it continuously for 30 minutes with notifications muted. Keep a tally of every time you felt the urge to check email, chat, or open another app.",
    whyYouAreDoingIt: "Measuring self-distraction urges builds metacognitive awareness, allowing executive inhibition networks to strengthen over time.",
    durationMinutes: 30,
    whatToRecord: {
      label: "Number of distraction urges resisted",
      type: "count",
      unit: "urges",
      placeholder: "e.g. 3",
    },
    whatSkillItTrains: "Executive Inhibitory Control & Deep-Work Endurance",
    xpReward: 45,
    lifePerformanceCategory: "interruption_resilience",
  },
  {
    id: "xf-pro-meeting-distillation",
    title: "The 60-Second Meeting Takeaway Distillation",
    targetDomain: "Processing Speed",
    lifeRoles: ["employee", "professional", "consultant", "business_owner"],
    ageBands: ["adult_25_34", "prime_35_49", "mature_50_64"],
    whatToDo: "Immediately after your next meeting or phone call, spend 60 seconds summarizing the 3 most critical decisions and next actions from memory without opening the meeting notes.",
    whyYouAreDoingIt: "Rapid semantic synthesis engages the left prefrontal cortex to filter signal from noise under time pressure.",
    durationMinutes: 2,
    whatToRecord: {
      label: "Number of actionable decisions synthesized",
      type: "count",
      unit: "actions",
      placeholder: "e.g. 3",
    },
    whatSkillItTrains: "Rapid Information Synthesis & Action Prioritization",
    xpReward: 30,
    lifePerformanceCategory: "deep_work",
  },

  // ─── 3. ENTREPRENEURS & BUSINESS OWNERS (25–60+) ───────────────────────────
  {
    id: "xf-ent-inversion-audit",
    title: "Strategic Inversion: The 5-Failure Mode Analysis",
    targetDomain: "Problem Solving",
    lifeRoles: ["entrepreneur", "business_owner", "consultant"],
    ageBands: ["adult_25_34", "prime_35_49", "mature_50_64", "senior_65_plus"],
    whatToDo: "Pick a major strategic decision or upcoming project. Write down 5 ways this project could completely fail, then formulate one concrete operational guardrail for each.",
    whyYouAreDoingIt: "Cognitive inversion bypasses natural optimism bias and uncovers structural blind spots before committing capital or time.",
    durationMinutes: 15,
    whatToRecord: {
      label: "Number of structural risks mitigated with guardrails",
      type: "count",
      unit: "guardrails",
      placeholder: "e.g. 5",
    },
    whatSkillItTrains: "Strategic Risk Foresight & Consequential Reasoning",
    xpReward: 50,
    lifePerformanceCategory: "strategic_problem_solving",
  },
  {
    id: "xf-ent-five-solutions",
    title: "The 5-Solution Rule Before Decision",
    targetDomain: "Decision Making",
    lifeRoles: ["entrepreneur", "business_owner", "professional"],
    ageBands: ["adult_25_34", "prime_35_49", "mature_50_64"],
    whatToDo: "When facing a current operational roadblock today, force yourself to write 5 distinctly different options before selecting the path forward.",
    whyYouAreDoingIt: "The brain naturally latches onto the first available solution (anchoring bias). Forcing 5 alternatives stimulates divergent lateral neural pathways.",
    durationMinutes: 10,
    whatToRecord: {
      label: "Number of distinctly different solutions generated",
      type: "count",
      unit: "options",
      placeholder: "e.g. 5",
    },
    whatSkillItTrains: "Lateral Option Generation & Bias Reduction",
    xpReward: 40,
    lifePerformanceCategory: "strategic_problem_solving",
  },

  // ─── 4. CREATIVES (ALL AGES) ───────────────────────────────────────────────
  {
    id: "xf-cre-ten-ideas",
    title: "The 10-Idea Rapid Divergence Sprint",
    targetDomain: "Creativity",
    lifeRoles: ["creative", "freelancer", "entrepreneur", "other"],
    ageBands: ["teen_13_17", "young_adult_18_24", "adult_25_34", "prime_35_49", "mature_50_64"],
    whatToDo: "Set a 5-minute timer. Pick a creative problem or title and write 10 wildly different concepts without self-censoring or editing.",
    whyYouAreDoingIt: "Temporarily disengaging the dorsolateral prefrontal 'inner critic' allows the default mode network to make novel associational leaps.",
    durationMinutes: 5,
    whatToRecord: {
      label: "Total novel ideas generated in 5 minutes",
      type: "count",
      unit: "ideas",
      placeholder: "e.g. 10",
    },
    whatSkillItTrains: "Divergent Ideation & Mental Flexibility",
    xpReward: 35,
    lifePerformanceCategory: "idea_output",
  },

  // ─── 5. MATURE ADULTS & SENIORS (50–65+) ───────────────────────────────────
  {
    id: "xf-sen-event-sequencing",
    title: "Daily Event & Appointment Mental Sequencing",
    targetDomain: "Memory",
    lifeRoles: ["retired", "parent", "other", "consultant"],
    ageBands: ["mature_50_64", "senior_65_plus"],
    whatToDo: "Review your schedule, appointments, or grocery items for today. Close your calendar and mentally reconstruct the exact chronological order and locations from memory.",
    whyYouAreDoingIt: "Chronological sequencing exercises the hippocampus and entorhinal cortex, preserving daily executive organization and episodic sharpness.",
    durationMinutes: 5,
    whatToRecord: {
      label: "Items or appointments sequenced accurately from memory",
      type: "count",
      unit: "items",
      placeholder: "e.g. 6",
    },
    whatSkillItTrains: "Episodic Chronological Recall & Mental Organization",
    xpReward: 35,
    lifePerformanceCategory: "everyday_memory",
  },
  {
    id: "xf-sen-new-route",
    title: "The Novel Environmental Route Scan",
    targetDomain: "Cognitive Flexibility",
    lifeRoles: ["retired", "parent", "other"],
    ageBands: ["mature_50_64", "senior_65_plus"],
    whatToDo: "Take a slightly different physical route on your walk or drive today. Actively spot 5 new landmarks or visual features you have never consciously noticed before.",
    whyYouAreDoingIt: "Novel spatial navigation triggers cholinergic pathways, stimulating neuroplastic adaptation in mature neural circuits.",
    durationMinutes: 15,
    whatToRecord: {
      label: "Number of newly noticed environmental features",
      type: "count",
      unit: "features",
      placeholder: "e.g. 5",
    },
    whatSkillItTrains: "Spatial Neuroplasticity & Environmental Awareness",
    xpReward: 40,
    lifePerformanceCategory: "everyday_memory",
  },
];

export function getLifeTransferChallengeForUser(
  userRole?: LifeRole,
  userAgeBand?: LifeStageBand,
  targetDomain?: string
): LifeTransferChallenge {
  const list = LIFE_TRANSFER_CHALLENGES;

  // 1. Match by domain and role
  if (targetDomain) {
    const domainMatches = list.filter(
      (c) => c.targetDomain.toLowerCase() === targetDomain.toLowerCase()
    );
    if (domainMatches.length > 0) {
      if (userRole) {
        const roleMatch = domainMatches.find((c) => c.lifeRoles.includes(userRole));
        if (roleMatch) return roleMatch;
      }
      return domainMatches[0];
    }
  }

  // 2. Match by role
  if (userRole) {
    const roleMatches = list.filter((c) => c.lifeRoles.includes(userRole));
    if (roleMatches.length > 0) {
      const seed = new Date().getDate();
      return roleMatches[seed % roleMatches.length];
    }
  }

  // 3. Match by age band
  if (userAgeBand) {
    const ageMatches = list.filter((c) => c.ageBands.includes(userAgeBand));
    if (ageMatches.length > 0) {
      const seed = new Date().getDate();
      return ageMatches[seed % ageMatches.length];
    }
  }

  return list[0];
}
