import { AgeTierId, AgeAdaptedCurriculumLesson, AGE_TIER_CONFIGS } from "./types";
import { DAILY_CURRICULUM_LESSONS, DailyCurriculumLesson } from "@/lib/daily-curriculum";
import { CognitiveChallenge } from "@/lib/challenges-engine/types";

const STORAGE_KEY_USER_AGE_TIER = "braingym_user_age_tier_v1";

/**
 * Derive age tier bracket from user's numerical age
 */
export function deriveAgeTierFromAge(age?: number | null): AgeTierId {
  if (!age || isNaN(age)) return "26-30";
  if (age <= 19) return "15-19";
  if (age <= 25) return "20-25";
  if (age <= 30) return "26-30";
  if (age <= 35) return "31-35";
  if (age <= 40) return "36-40";
  if (age <= 45) return "41-45";
  return "46-50+";
}

/**
 * Get active user age tier (defaults to '26-30' or saved preference from onboarding form)
 */
export function getActiveUserAgeTier(): AgeTierId {
  if (typeof window === "undefined") return "26-30";
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER_AGE_TIER);
    if (saved && AGE_TIER_CONFIGS.some((c) => c.id === saved)) {
      return saved as AgeTierId;
    }
  } catch {
    // ignore
  }
  return "26-30";
}

/**
 * Save active user age tier (called on onboarding completion or settings)
 */
export function setActiveUserAgeTier(tier: AgeTierId): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_USER_AGE_TIER, tier);
  } catch (err) {
    console.warn("Could not save age tier to localStorage", err);
  }
}

/**
 * Adapt a CognitiveChallenge for a specific age tier by tailoring
 * the scenario narrative, stakes, and options (A, B, C, D).
 */
function adaptQuestionForAgeTier(base: CognitiveChallenge, tier: AgeTierId, idx: number): CognitiveChallenge {
  switch (tier) {
    case "15-19":
      return {
        ...base,
        id: `${base.id}-15-19-${idx}`,
        title: base.title,
        question: `During high school exam preparations or classroom presentations: ${base.question}`,
        educationalWhy: `For teenage brain development, the prefrontal cortex is actively developing inhibitory pathways. ${base.educationalWhy}`,
      };

    case "20-25":
      return {
        ...base,
        id: `${base.id}-20-25-${idx}`,
        title: base.title,
        question: `On campus during thesis defense or in your first job internship: ${base.question}`,
        educationalWhy: `In early career and university environments, deliberate cognitive pause interrupts threat loops and sharpens memory recall. ${base.educationalWhy}`,
      };

    case "31-35":
      return {
        ...base,
        id: `${base.id}-31-35-${idx}`,
        title: base.title,
        question: `Managing workplace deliverables while coordinating household and family responsibilities: ${base.question}`,
        educationalWhy: `Balancing career growth with domestic responsibilities requires deliberate glucose and dopamine management. ${base.educationalWhy}`,
      };

    case "36-40":
      return {
        ...base,
        id: `${base.id}-36-40-${idx}`,
        title: base.title,
        question: `In high-stakes team leadership, corporate strategy, and family asset decisions: ${base.question}`,
        educationalWhy: `Mid-career cognitive longevity relies on rapid emotional regulation and strategic clarity under pressure. ${base.educationalWhy}`,
      };

    case "41-45":
      return {
        ...base,
        id: `${base.id}-41-45-${idx}`,
        title: base.title,
        question: `Navigating organizational management and mentoring adolescents at home: ${base.question}`,
        educationalWhy: `Executive neural networks thrive when high-level decision fatigue is mitigated by parasympathetic resets. ${base.educationalWhy}`,
      };

    case "46-50+":
      return {
        ...base,
        id: `${base.id}-46-50-${idx}`,
        title: base.title,
        question: `Directing organizational vision, mentoring others, and preserving sharp neuroplastic mental vitality: ${base.question}`,
        educationalWhy: `Cognitive longevity research shows that active semantic retrieval practice protects hippocampal volume. ${base.educationalWhy}`,
      };

    case "26-30":
    default:
      return base;
  }
}

/**
 * Adapt a DailyCurriculumLesson for a specific age tier
 */
export function getAgeAdaptedLesson(lesson: DailyCurriculumLesson, tier: AgeTierId): AgeAdaptedCurriculumLesson {
  const config = AGE_TIER_CONFIGS.find((c) => c.id === tier) || AGE_TIER_CONFIGS[2];

  let adaptedChallenge = lesson.challenge;
  let adaptedSolution = lesson.solution;
  let adaptedActionRule = lesson.actionRule;
  let adaptedRoleTarget = `${config.label} · ${config.stageTitle}`;

  if (tier === "15-19") {
    adaptedChallenge =
      "When a teacher puts you on the spot in class, or you open an unexpected tough exam paper, your mind goes blank, your hands sweat, and you panic.";
    adaptedSolution =
      "Exam pressure triggers an acute adrenaline surge that constricts working memory in the developing prefrontal cortex. Taking 2 deep nasal breaths stimulates the vagus nerve and unlocks recall.";
    adaptedActionRule =
      "Take a 3-second breathing pause before starting any exam or answering a teacher today. Read the question twice calmly before writing.";
  } else if (tier === "20-25") {
    adaptedChallenge =
      "During campus project defenses or job internship interviews, unexpected questions cause your heart to race, making you stumble over your words.";
    adaptedSolution =
      "Perceived social evaluation activates the amygdala's threat loop. A 2-second tactical pause interrupts this reaction, restoring fast articulate speech.";
    adaptedActionRule =
      "In your next meeting or interview today, pause for 2 seconds, smile, and say: 'That is a critical question. Here is how I break it down.'";
  } else if (tier === "31-35") {
    adaptedChallenge =
      "Balancing business cash flow, workplace team deadlines, and household toddler tantrums leaves your mental bandwidth completely drained by 6 PM.";
    adaptedSolution =
      "Decision fatigue depletes prefrontal glucose. Without a transitional reset, work stress spills over into domestic impatience.";
    adaptedActionRule =
      "Take a 90-second breathing pause in your car or at your front door before entering home: 'Work is finished. I enter with peace and patience.'";
  } else if (tier === "36-40") {
    adaptedChallenge =
      "Navigating corporate politics, team leadership conflicts, and rising school fees creates persistent low-grade anxiety that impairs sleep and strategic thinking.";
    adaptedSolution =
      "Chronic cortisol blunts neurogenesis in the hippocampus. Structured daily mental gating restores executive clarity and restful deep sleep.";
    adaptedActionRule =
      "Write your 3 core strategic decisions on paper each morning. Batch all emails into two 25-minute focus windows.";
  } else if (tier === "41-45") {
    adaptedChallenge =
      "Leading complex organizational teams while communicating with teenagers at home who resist advice creates emotional exhaustion.";
    adaptedSolution =
      "Teenagers interpret emotional reactivity as threat. Demonstrating calm vagal composure allows mutual prefrontal co-regulation.";
    adaptedActionRule =
      "Apply the 10-Second Listening Rule: When communicating with family or staff, listen completely without formulating a comeback.";
  } else if (tier === "46-50+") {
    adaptedChallenge =
      "Managing demanding organizational responsibilities while desiring to preserve sharp memory, quick recall, and long-term cognitive vitality.";
    adaptedSolution =
      "Neuroplasticity continues throughout life. Combining cardiovascular walking with retrieval drills triggers BDNF (Brain-Derived Neurotrophic Factor).";
    adaptedActionRule =
      "Engage in a 10-minute blind handwritten concept recall sprint each morning to fortify semantic neural pathways.";
  }

  const adaptedQuestions = lesson.phase1Questions.map((q, idx) => adaptQuestionForAgeTier(q, tier, idx));

  return {
    lessonId: lesson.id,
    ageTier: tier,
    topicTitle: lesson.topicTitle,
    roleTarget: adaptedRoleTarget,
    challenge: adaptedChallenge,
    solution: adaptedSolution,
    actionRule: adaptedActionRule,
    culturalWisdom: lesson.culturalWisdom,
    phase1Questions: adaptedQuestions,
    phase2PhysicalTask: lesson.phase2PhysicalTask,
  };
}
