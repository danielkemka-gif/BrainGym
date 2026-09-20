// ─────────────────────────────────────────────────────────────────────────────
// REAL-LIFE BRAIN MISSIONS ENGINE: Practical Offline Mental Fitness Habit System
// ─────────────────────────────────────────────────────────────────────────────

export interface RealLifeBrainMission {
  id: string;
  title: string;
  category: "focus" | "memory" | "decision_making" | "observation" | "emotional_intelligence" | "logic";
  skillLabel: string;
  instruction: string;
  whyItMatters: string;
  pointsReward: number;
  xpReward: number;
}

export const REAL_LIFE_BRAIN_MISSIONS: RealLifeBrainMission[] = [
  {
    id: "pause-before-reply",
    title: "Pause Before You Reply",
    category: "decision_making",
    skillLabel: "DECISION MAKING",
    instruction: "Before responding to one difficult message today, wait 10 seconds and read it twice.",
    whyItMatters: "Breaks instinctive emotional reaction loops and engages prefrontal executive evaluation.",
    pointsReward: 15,
    xpReward: 50,
  },
  {
    id: "name-recall-challenge",
    title: "Name Recall Challenge",
    category: "memory",
    skillLabel: "MEMORY",
    instruction: "Remember the name of someone you meet or converse with today without checking your phone.",
    whyItMatters: "Trains active working memory consolidation and social attention encoding.",
    pointsReward: 15,
    xpReward: 50,
  },
  {
    id: "distraction-free-sprint",
    title: "Distraction-Free Sprint",
    category: "focus",
    skillLabel: "FOCUS",
    instruction: "Spend 20 minutes on one priority task without opening WhatsApp, email, or social media.",
    whyItMatters: "Builds sustained attentional stamina and resists digital fragmentation.",
    pointsReward: 15,
    xpReward: 50,
  },
  {
    id: "observation-walk",
    title: "The Observation Walk",
    category: "observation",
    skillLabel: "OBSERVATION",
    instruction: "Notice five things on your normal route or commute that you usually overlook.",
    whyItMatters: "Shifts the brain from automatic autopilot to deliberate environmental awareness.",
    pointsReward: 15,
    xpReward: 50,
  },
  {
    id: "two-alternatives",
    title: "The Two Alternatives Rule",
    category: "decision_making",
    skillLabel: "DECISION MAKING",
    instruction: "Before making an important choice today, deliberately write down two viable alternative options.",
    whyItMatters: "Combats confirmation bias and narrow framing traps.",
    pointsReward: 15,
    xpReward: 50,
  },
  {
    id: "empathetic-listening",
    title: "Active Listening Pause",
    category: "emotional_intelligence",
    skillLabel: "EMOTIONAL INTELLIGENCE",
    instruction: "In your next conversation, listen completely until the speaker finishes before preparing your reply.",
    whyItMatters: "Strengthens theory of mind, conversational presence, and social empathy.",
    pointsReward: 15,
    xpReward: 50,
  },
];

const MISSION_STATE_KEY = "braingym_active_real_life_mission";
const COMPLETED_MISSIONS_KEY = "braingym_completed_real_life_missions";

export interface ActiveMissionState {
  missionId: string;
  status: "idle" | "in_progress" | "completed";
  acceptedDate?: string;
  completedDate?: string;
}

export function getTodaysBrainMission(): RealLifeBrainMission {
  const dayIndex = new Date().getDay(); // 0-6
  return REAL_LIFE_BRAIN_MISSIONS[dayIndex % REAL_LIFE_BRAIN_MISSIONS.length];
}

export function getActiveBrainMissionState(): ActiveMissionState {
  const defaultMission = getTodaysBrainMission();
  if (typeof window === "undefined") {
    return {
      missionId: defaultMission.id,
      status: "idle",
    };
  }

  try {
    const raw = localStorage.getItem(MISSION_STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Reset if from previous day
      const today = new Date().toDateString();
      if (parsed.acceptedDate && new Date(parsed.acceptedDate).toDateString() !== today) {
        return {
          missionId: defaultMission.id,
          status: "idle",
        };
      }
      return parsed;
    }
  } catch (e) {
    console.warn("Could not parse brain mission state", e);
  }

  return {
    missionId: defaultMission.id,
    status: "idle",
  };
}

export function acceptBrainMission(missionId: string): ActiveMissionState {
  const state: ActiveMissionState = {
    missionId,
    status: "in_progress",
    acceptedDate: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MISSION_STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save mission state", e);
    }
  }

  return state;
}

export function completeBrainMission(missionId: string): ActiveMissionState {
  const state: ActiveMissionState = {
    missionId,
    status: "completed",
    completedDate: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MISSION_STATE_KEY, JSON.stringify(state));
      // Append to completed history
      const historyRaw = localStorage.getItem(COMPLETED_MISSIONS_KEY);
      const history: Array<{ id: string; completedAt: string }> = historyRaw
        ? JSON.parse(historyRaw)
        : [];
      history.unshift({ id: missionId, completedAt: new Date().toISOString() });
      localStorage.setItem(COMPLETED_MISSIONS_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn("Could not complete mission", e);
    }
  }

  return state;
}

export function getCompletedMissionsHistory(): Array<{ id: string; completedAt: string }> {
  if (typeof window === "undefined") return [];
  try {
    const historyRaw = localStorage.getItem(COMPLETED_MISSIONS_KEY);
    return historyRaw ? JSON.parse(historyRaw) : [];
  } catch {
    return [];
  }
}
