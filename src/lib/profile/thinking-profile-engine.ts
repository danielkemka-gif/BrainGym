/**
 * Qualitative Thinking Profile Engine
 * 10 Cognitive Dimensions with Qualitative Growth Ratings and Observational Insights.
 * 
 * Non-medical, observational, and encouraging.
 */

export type ThinkingRating = "Developing" | "Strong" | "Needs Practice";

export interface ThinkingDimensionProfile {
  id: string;
  name: string;
  icon: string;
  rating: ThinkingRating;
  description: string;
  observation: string;
  recommendedFocus: string;
}

export interface UserThinkingProfile {
  overallSummary: string;
  behavioralObservation: string;
  dimensions: ThinkingDimensionProfile[];
  topStrength: string;
  primaryGrowthArea: string;
}

const DEFAULT_PROFILE: UserThinkingProfile = {
  overallSummary: "Your thinking patterns show strong creative hypothesis generation and rapid problem decomposition, with room to strengthen systematic fact verification before committing to decisions.",
  behavioralObservation: "Across your recent workouts, you frequently identify creative alternatives quickly. You can elevate your decision quality further by pausing to identify hidden assumptions and unknown risks before taking action.",
  topStrength: "Creativity & Problem Solving",
  primaryGrowthArea: "Decision Making & Critical Verification",
  dimensions: [
    {
      id: "critical_thinking",
      name: "Critical Thinking",
      icon: "🔍",
      rating: "Developing",
      description: "Evaluating evidence, identifying biases, and questioning assumptions.",
      observation: "Consistently questions surface statements; occasionally accepts plausible sounding assumptions without verification.",
      recommendedFocus: "Practice the 'Challenge The AI' workout mode to spot subtle logical flaws.",
    },
    {
      id: "problem_solving",
      name: "Problem Solving",
      icon: "🧩",
      rating: "Strong",
      description: "Deconstructing complex situations into clear, solvable steps.",
      observation: "High proficiency in breaking multi-variable dilemmas into manageable root causes.",
      recommendedFocus: "Continue applying 5-step problem deconstruction in real-life work scenarios.",
    },
    {
      id: "decision_making",
      name: "Decision Making",
      icon: "🧭",
      rating: "Developing",
      description: "Weighing trade-offs, calculating risks, and choosing optimal paths.",
      observation: "Makes decisive choices; tends to underestimate second-order execution risks under time pressure.",
      recommendedFocus: "Use the Socratic 'WHAT WE DON'T KNOW' checklist before committing capital or time.",
    },
    {
      id: "focus",
      name: "Focus",
      icon: "🎯",
      rating: "Strong",
      description: "Sustaining attention, filtering distractions, and deep concentration.",
      observation: "Maintains high attention density during 5-10 minute mental challenges.",
      recommendedFocus: "Apply 25-minute deep focus sprints to high-priority business and study tasks.",
    },
    {
      id: "memory",
      name: "Memory",
      icon: "🧠",
      rating: "Developing",
      description: "Retaining information, active recall, and mental retrieval models.",
      observation: "Effective short-term working retention; benefits from spaced review of recorded journal reflections.",
      recommendedFocus: "Review your past 7 days of journal reflections every Sunday.",
    },
    {
      id: "reasoning",
      name: "Reasoning",
      icon: "⚖️",
      rating: "Strong",
      description: "Logical deduction, structured arguments, and sound rationale.",
      observation: "Clear deductive chains when identifying factual contradictions in scenarios.",
      recommendedFocus: "Formulate counter-arguments before presenting important ideas to colleagues or clients.",
    },
    {
      id: "creativity",
      name: "Creativity",
      icon: "💡",
      rating: "Strong",
      description: "Generating novel perspectives, lateral thinking, and innovative solutions.",
      observation: "Excellent at generating non-obvious alternatives when conventional methods stall.",
      recommendedFocus: "Combine lateral thinking with concrete execution checklists.",
    },
    {
      id: "communication",
      name: "Communication",
      icon: "💬",
      rating: "Developing",
      description: "Articulating ideas with clarity, persuasion, and emotional empathy.",
      observation: "Understands stakeholder perspectives well; can sharpen brevity in action requests.",
      recommendedFocus: "Structure messages with clear context, proposed action, and expected deadline.",
    },
    {
      id: "adaptability",
      name: "Adaptability",
      icon: "🔄",
      rating: "Strong",
      description: "Pivoting under uncertainty and reframing unexpected constraints.",
      observation: "Readily adjusts when unexpected constraints (e.g. power, budget, deadlines) arise.",
      recommendedFocus: "Maintain calm composure during sudden schedule shifts.",
    },
    {
      id: "strategic_thinking",
      name: "Strategic Thinking",
      icon: "♟️",
      rating: "Developing",
      description: "Long-term planning, second-order consequences, and system thinking.",
      observation: "Good awareness of immediate outcomes; developing longer 6-12 month horizon planning.",
      recommendedFocus: "Map out 'If this happens, what happens next?' for major commitments.",
    },
    {
      id: "execution",
      name: "Execution",
      icon: "⚡",
      rating: "Needs Practice",
      description: "Turning thinking into concrete action, measuring results, and follow-through.",
      observation: "Generates sound plans; follow-through benefits from setting immediate 6 PM action deadlines.",
      recommendedFocus: "Complete Today's Mission and tap [Mark as Completed] before day end.",
    },
  ],
};

const PROFILE_STORAGE_KEY = "braingym_thinking_profile_qualitative_v1";

export async function getThinkingProfile(userId?: string): Promise<UserThinkingProfile> {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function updateThinkingDimensionRating(
  dimensionId: string,
  newRating: ThinkingRating,
  newObservation?: string
): Promise<UserThinkingProfile> {
  const profile = await getThinkingProfile();
  const target = profile.dimensions.find((d) => d.id === dimensionId);
  if (target) {
    target.rating = newRating;
    if (newObservation) target.observation = newObservation;
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }
  return profile;
}
