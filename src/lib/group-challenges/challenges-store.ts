import {
  GroupChallenge,
  ChallengeParticipant,
  ChallengeTeam,
  ChallengeAnnouncement,
  ChallengeCreationInput,
  ChallengeCategory,
} from "./types";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY_CHALLENGES = "braingym_group_challenges_v1";
const STORAGE_KEY_PARTICIPANTS = "braingym_group_participants_v1";

// ─── INITIAL SEED CHALLENGES ────────────────────────────────────────────────
const INITIAL_CHALLENGES: GroupChallenge[] = [
  {
    id: "gc-entrepreneur-30",
    code: "BG-ENTR-30",
    title: "30-Day Entrepreneur Brain & Decision Challenge",
    description: "Train emotional composure under market pressure, financial impulse gating, and razor-sharp executive focus.",
    hostId: "host-daniel",
    hostName: "Daniel Kemka",
    hostAvatar: "🧠",
    hostRoleTitle: "BrainGym Founder",
    type: "Brain Momentum Challenge",
    category: "For Entrepreneurs",
    targetRole: "Founders, Traders, CEOs & Business Builders",
    durationDays: 30,
    currentDay: 12,
    startDate: "2026-08-01",
    endDate: "2026-08-30",
    isPrivate: false,
    audience: "Anyone with the link",
    participantsCount: 87,
    activeTodayCount: 68,
    overallCompletionRate: 78,
    coverEmoji: "🚀",
    coverGradient: "from-amber-500/20 via-card to-emerald-500/20",
    hasTeams: true,
    teams: [
      { id: "team-tech", challengeId: "gc-entrepreneur-30", name: "Tech Founders", membersCount: 32, completionRate: 88, averageStreak: 9, rank: 1 },
      { id: "team-retail", challengeId: "gc-entrepreneur-30", name: "Retail & SME Traders", membersCount: 28, completionRate: 81, averageStreak: 7, rank: 2 },
      { id: "team-agri", challengeId: "gc-entrepreneur-30", name: "Agri & Exports", membersCount: 27, completionRate: 72, averageStreak: 6, rank: 3 },
    ],
    announcements: [
      {
        id: "ann-1",
        challengeId: "gc-entrepreneur-30",
        authorName: "Daniel Kemka",
        authorRole: "Host",
        title: "Halfway Milestone Approaches! 🔥",
        message: "Great job to everyone keeping their streaks alive! The 48-Hour Financial Impulse rule is showing up in our top scores.",
        createdAt: "2 days ago",
      },
    ],
    dailyActivityTitle: "High-Stakes Price Negotiation & 4-4-6 Reset Walk",
    dailyActivityDurationMin: 10,
  },
  {
    id: "gc-students-21",
    code: "BG-STUDY-21",
    title: "21-Day Active Recall & Exam Mastery Sprint",
    description: "Ditch passive highlighting. Master the Feynman technique, spaced recall, and conquering exam panic blocks.",
    hostId: "host-sarah",
    hostName: "Dr. Sarah Adebayo",
    hostAvatar: "📚",
    hostRoleTitle: "Neuroscience Educator",
    type: "Memory Challenge",
    category: "For Students",
    targetRole: "Scholars, University Students & Exam Candidates",
    durationDays: 21,
    currentDay: 8,
    startDate: "2026-08-10",
    endDate: "2026-08-31",
    isPrivate: false,
    audience: "Anyone with the link",
    participantsCount: 142,
    activeTodayCount: 119,
    overallCompletionRate: 84,
    coverEmoji: "🎓",
    coverGradient: "from-indigo-500/20 via-card to-cyan-500/20",
    hasTeams: true,
    teams: [
      { id: "team-med", challengeId: "gc-students-21", name: "Medical & Health Sciences", membersCount: 54, completionRate: 92, averageStreak: 8, rank: 1 },
      { id: "team-eng", challengeId: "gc-students-21", name: "Engineering & Tech", membersCount: 48, completionRate: 86, averageStreak: 7, rank: 2 },
      { id: "team-law", challengeId: "gc-students-21", name: "Law & Humanities", membersCount: 40, completionRate: 79, averageStreak: 5, rank: 3 },
    ],
    announcements: [
      {
        id: "ann-2",
        challengeId: "gc-students-21",
        authorName: "Dr. Sarah Adebayo",
        authorRole: "Host",
        title: "Day 8: Active Blind Recall Test",
        message: "Remember: Do not open your textbook before writing down your 3 core bullet points!",
        createdAt: "5 hours ago",
      },
    ],
    dailyActivityTitle: "Feynman Technique & Blind Handwritten Recall",
    dailyActivityDurationMin: 8,
  },
  {
    id: "gc-focus-14",
    code: "BG-FOCUS-14",
    title: "14-Day Deep Focus & Digital Detox Challenge",
    description: "Eliminate morning phone addiction, master open-office auditory gating, and build 4 hours of daily deep work stamina.",
    hostId: "host-kofi",
    hostName: "Kofi Mensah",
    hostAvatar: "🎯",
    hostRoleTitle: "Productivity Coach",
    type: "Focus Challenge",
    category: "Focus",
    targetRole: "Remote Workers, Software Engineers & Creators",
    durationDays: 14,
    currentDay: 4,
    startDate: "2026-08-15",
    endDate: "2026-08-29",
    isPrivate: false,
    audience: "Anyone with the link",
    participantsCount: 65,
    activeTodayCount: 53,
    overallCompletionRate: 89,
    coverEmoji: "⚡",
    coverGradient: "from-teal-500/20 via-card to-blue-500/20",
    hasTeams: false,
    announcements: [],
    dailyActivityTitle: "Auditory Distraction Gating & Zero-Phone Sprint",
    dailyActivityDurationMin: 15,
  },
  {
    id: "gc-church-30",
    code: "BG-COMM-30",
    title: "30-Day Family Patience, Empathy & Mental Wellness",
    description: "Strengthen relational warmth, active empathetic listening, and mental health in homes and community fellowships.",
    hostId: "host-pastor-emmanuel",
    hostName: "Pastor Emmanuel O.",
    hostAvatar: "🏡",
    hostRoleTitle: "Community Pastor",
    type: "Daily Brain Workout",
    category: "Faith & Community",
    targetRole: "Families, Couples, Youth Groups & Fellowships",
    durationDays: 30,
    currentDay: 15,
    startDate: "2026-08-01",
    endDate: "2026-08-30",
    isPrivate: false,
    audience: "My community/group",
    participantsCount: 94,
    activeTodayCount: 82,
    overallCompletionRate: 86,
    coverEmoji: "🕊️",
    coverGradient: "from-rose-500/20 via-card to-orange-500/20",
    hasTeams: true,
    teams: [
      { id: "team-couples", challengeId: "gc-church-30", name: "Couples & Parents", membersCount: 38, completionRate: 91, averageStreak: 12, rank: 1 },
      { id: "team-youth", challengeId: "gc-church-30", name: "Youth Fellowship", membersCount: 34, completionRate: 85, averageStreak: 9, rank: 2 },
      { id: "team-leaders", challengeId: "gc-church-30", name: "Community Leaders", membersCount: 22, completionRate: 80, averageStreak: 8, rank: 3 },
    ],
    announcements: [
      {
        id: "ann-3",
        challengeId: "gc-church-30",
        authorName: "Pastor Emmanuel O.",
        authorRole: "Host",
        title: "Patience is a Mental Muscle",
        message: "Practicing the 90-second front-door reset before greeting family tonight makes all the difference!",
        createdAt: "Yesterday",
      },
    ],
    dailyActivityTitle: "De-escalating Domestic Fatigue & Box Breathing",
    dailyActivityDurationMin: 10,
  },
];

// ─── INITIAL PARTICIPANTS SEED ──────────────────────────────────────────────
const INITIAL_PARTICIPANTS: ChallengeParticipant[] = [
  {
    id: "p-user-1",
    challengeId: "gc-entrepreneur-30",
    userId: "current-user",
    userName: "You (Champion)",
    userAvatar: "⚡",
    role: "participant",
    teamId: "team-tech",
    teamName: "Tech Founders",
    currentStreak: 7,
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    completionPercentage: 80,
    points: 1240,
    overallRank: 8,
    consistencyScore: 94,
    improvementScore: 88,
    joinedAt: "2026-08-01",
    lastActiveAt: "Today",
  },
  {
    id: "p-grace",
    challengeId: "gc-entrepreneur-30",
    userId: "u-grace",
    userName: "Grace Okafor",
    userAvatar: "🌟",
    role: "participant",
    teamId: "team-tech",
    teamName: "Tech Founders",
    currentStreak: 12,
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    completionPercentage: 100,
    points: 1580,
    overallRank: 1,
    consistencyScore: 99,
    improvementScore: 95,
    joinedAt: "2026-08-01",
    lastActiveAt: "Today",
  },
  {
    id: "p-tunde",
    challengeId: "gc-entrepreneur-30",
    userId: "u-tunde",
    userName: "Tunde Bakare",
    userAvatar: "🔥",
    role: "participant",
    teamId: "team-retail",
    teamName: "Retail & SME Traders",
    currentStreak: 11,
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    completionPercentage: 92,
    points: 1490,
    overallRank: 2,
    consistencyScore: 96,
    improvementScore: 91,
    joinedAt: "2026-08-01",
    lastActiveAt: "Today",
  },
  {
    id: "p-amara",
    challengeId: "gc-entrepreneur-30",
    userId: "u-amara",
    userName: "Amara Nwosu",
    userAvatar: "💎",
    role: "participant",
    teamId: "team-agri",
    teamName: "Agri & Exports",
    currentStreak: 10,
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    completionPercentage: 88,
    points: 1390,
    overallRank: 3,
    consistencyScore: 92,
    improvementScore: 90,
    joinedAt: "2026-08-01",
    lastActiveAt: "Today",
  },
  {
    id: "p-kwame",
    challengeId: "gc-entrepreneur-30",
    userId: "u-kwame",
    userName: "Kwame Asante",
    userAvatar: "🦁",
    role: "participant",
    teamId: "team-tech",
    teamName: "Tech Founders",
    currentStreak: 9,
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    completionPercentage: 83,
    points: 1310,
    overallRank: 4,
    consistencyScore: 89,
    improvementScore: 87,
    joinedAt: "2026-08-01",
    lastActiveAt: "Today",
  },
  {
    id: "p-zainab",
    challengeId: "gc-entrepreneur-30",
    userId: "u-zainab",
    userName: "Zainab Al-Hassan",
    userAvatar: "🌸",
    role: "participant",
    teamId: "team-retail",
    teamName: "Retail & SME Traders",
    currentStreak: 8,
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8],
    completionPercentage: 80,
    points: 1260,
    overallRank: 5,
    consistencyScore: 88,
    improvementScore: 86,
    joinedAt: "2026-08-01",
    lastActiveAt: "Today",
  },
];

// ─── STORAGE ACCESSORS ──────────────────────────────────────────────────────
function getLocalChallenges(): GroupChallenge[] {
  if (typeof window === "undefined") return INITIAL_CHALLENGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHALLENGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
      return INITIAL_CHALLENGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CHALLENGES;
  }
}

function saveLocalChallenges(challenges: GroupChallenge[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(challenges));
  } catch (err) {
    console.warn("Could not save challenges to localStorage", err);
  }
}

function getLocalParticipants(): ChallengeParticipant[] {
  if (typeof window === "undefined") return INITIAL_PARTICIPANTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(INITIAL_PARTICIPANTS));
      return INITIAL_PARTICIPANTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PARTICIPANTS;
  }
}

function saveLocalParticipants(participants: ChallengeParticipant[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(participants));
  } catch (err) {
    console.warn("Could not save participants to localStorage", err);
  }
}

// ─── STORE API FUNCTIONS ────────────────────────────────────────────────────

/**
 * Fetch all challenges the user is participating in or has created
 */
export async function fetchUserGroupChallenges(userId?: string): Promise<{
  active: GroupChallenge[];
  upcoming: GroupChallenge[];
  completed: GroupChallenge[];
  created: GroupChallenge[];
}> {
  const challenges = getLocalChallenges();
  const participants = getLocalParticipants();

  const joinedChallengeIds = new Set(
    participants.filter((p) => !userId || p.userId === userId || p.userId === "current-user").map((p) => p.challengeId)
  );

  const myJoined = challenges.filter((c) => joinedChallengeIds.has(c.id));
  const myCreated = challenges.filter((c) => c.hostId === userId || c.hostId === "current-user" || c.hostName === "Daniel Kemka");

  const active = myJoined.filter((c) => !c.isCompleted && c.currentDay <= c.durationDays);
  const upcoming = myJoined.filter((c) => c.currentDay === 0);
  const completed = myJoined.filter((c) => c.isCompleted || c.currentDay > c.durationDays);

  return { active, upcoming, completed, created: myCreated };
}

/**
 * Fetch discoverable / public challenges with optional category filter
 */
export async function fetchDiscoverGroupChallenges(category?: ChallengeCategory | "All"): Promise<GroupChallenge[]> {
  const challenges = getLocalChallenges();
  if (!category || category === "All") return challenges;
  return challenges.filter((c) => c.category === category);
}

/**
 * Fetch single challenge by ID
 */
export async function fetchGroupChallengeById(challengeId: string): Promise<GroupChallenge | null> {
  const challenges = getLocalChallenges();
  return challenges.find((c) => c.id === challengeId) || null;
}

/**
 * Fetch single challenge by short Invite Code (e.g. "BG-ENTR-30")
 */
export async function fetchGroupChallengeByCode(code: string): Promise<GroupChallenge | null> {
  const normalized = code.trim().toUpperCase();
  const challenges = getLocalChallenges();
  return challenges.find((c) => c.code.toUpperCase() === normalized) || null;
}

/**
 * Fetch participants and multi-category leaderboard for a challenge
 */
export async function fetchChallengeLeaderboard(challengeId: string): Promise<{
  overall: ChallengeParticipant[];
  mostConsistent: ChallengeParticipant[];
  highestStreak: ChallengeParticipant[];
  mostImproved: ChallengeParticipant[];
  userParticipant: ChallengeParticipant | null;
}> {
  const participants = getLocalParticipants().filter((p) => p.challengeId === challengeId);

  const overall = [...participants].sort((a, b) => b.points - a.points);
  const mostConsistent = [...participants].sort((a, b) => b.consistencyScore - a.consistencyScore);
  const highestStreak = [...participants].sort((a, b) => b.currentStreak - a.currentStreak);
  const mostImproved = [...participants].sort((a, b) => b.improvementScore - a.improvementScore);

  const userParticipant = participants.find((p) => p.userId === "current-user") || participants[0] || null;

  return {
    overall,
    mostConsistent,
    highestStreak,
    mostImproved,
    userParticipant,
  };
}

/**
 * Create a new Group Challenge
 */
export async function createGroupChallenge(
  input: ChallengeCreationInput,
  host: { id: string; name: string; avatar?: string; roleTitle?: string }
): Promise<GroupChallenge> {
  const challenges = getLocalChallenges();
  const shortCode = `BG-${input.title.slice(0, 4).toUpperCase()}-${input.durationDays}`;
  const id = `gc-custom-${Date.now()}`;

  const teams: ChallengeTeam[] = (input.teamNames || []).map((tName, idx) => ({
    id: `team-${id}-${idx}`,
    challengeId: id,
    name: tName,
    membersCount: idx === 0 ? 1 : 0,
    completionRate: 100,
    averageStreak: 1,
    rank: idx + 1,
  }));

  const newChallenge: GroupChallenge = {
    id,
    code: shortCode,
    title: input.title,
    description: input.description,
    hostId: host.id || "current-user",
    hostName: host.name || "Community Host",
    hostAvatar: host.avatar || "👑",
    hostRoleTitle: host.roleTitle || "Challenge Host",
    type: input.type,
    category: input.category,
    targetRole: input.targetRole,
    durationDays: input.durationDays,
    currentDay: 1,
    startDate: input.startDate || new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + input.durationDays * 86400000).toISOString().split("T")[0],
    isPrivate: input.isPrivate,
    audience: input.audience,
    participantsCount: 1,
    activeTodayCount: 1,
    overallCompletionRate: 100,
    coverEmoji: input.coverEmoji || "🚀",
    coverGradient: "from-primary/20 via-card to-violet-600/20",
    hasTeams: Boolean(input.hasTeams && teams.length > 0),
    teams: teams.length > 0 ? teams : undefined,
    announcements: [
      {
        id: `ann-${Date.now()}`,
        challengeId: id,
        authorName: host.name || "Host",
        authorRole: "Host",
        title: "Welcome to the Challenge!",
        message: "Invite your friends, colleagues, or WhatsApp group using the share button below. Let's build consistency together!",
        createdAt: "Just now",
      },
    ],
    dailyActivityTitle: `${input.type} — Day 1 Focus`,
    dailyActivityDurationMin: 10,
  };

  challenges.unshift(newChallenge);
  saveLocalChallenges(challenges);

  // Automatically add the creator as participant #1
  const participants = getLocalParticipants();
  const hostParticipant: ChallengeParticipant = {
    id: `p-${id}-host`,
    challengeId: id,
    userId: host.id || "current-user",
    userName: host.name || "You (Host)",
    userAvatar: host.avatar || "👑",
    role: "host",
    teamId: teams[0]?.id,
    teamName: teams[0]?.name,
    currentStreak: 1,
    completedDays: [1],
    completionPercentage: 100,
    points: 100,
    overallRank: 1,
    consistencyScore: 100,
    improvementScore: 100,
    joinedAt: new Date().toISOString(),
    lastActiveAt: "Today",
  };
  participants.unshift(hostParticipant);
  saveLocalParticipants(participants);

  return newChallenge;
}

/**
 * Join an existing Group Challenge
 */
export async function joinGroupChallenge(
  challengeId: string,
  user: { id: string; name: string; avatar?: string },
  teamId?: string
): Promise<{ success: boolean; participant: ChallengeParticipant }> {
  const challenges = getLocalChallenges();
  const participants = getLocalParticipants();

  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  // Check if already joined
  const existing = participants.find((p) => p.challengeId === challengeId && (p.userId === user.id || p.userId === "current-user"));
  if (existing) {
    return { success: true, participant: existing };
  }

  const team = challenge.teams?.find((t) => t.id === teamId) || challenge.teams?.[0];

  const newParticipant: ChallengeParticipant = {
    id: `p-${challengeId}-${Date.now()}`,
    challengeId,
    userId: user.id || "current-user",
    userName: user.name || "You (Challenger)",
    userAvatar: user.avatar || "🧠",
    role: "participant",
    teamId: team?.id,
    teamName: team?.name,
    currentStreak: 1,
    completedDays: [challenge.currentDay],
    completionPercentage: Math.round((1 / challenge.durationDays) * 100),
    points: 100,
    overallRank: participants.filter((p) => p.challengeId === challengeId).length + 1,
    consistencyScore: 90,
    improvementScore: 85,
    joinedAt: new Date().toISOString(),
    lastActiveAt: "Today",
  };

  participants.push(newParticipant);
  saveLocalParticipants(participants);

  // Update challenge participant counts
  challenge.participantsCount += 1;
  challenge.activeTodayCount += 1;
  if (team) {
    team.membersCount += 1;
  }
  saveLocalChallenges(challenges);

  return { success: true, participant: newParticipant };
}

/**
 * Complete today's daily activity for a challenge
 */
export async function completeDailyGroupChallenge(
  challengeId: string,
  userId: string = "current-user",
  dayNumber: number
): Promise<{ success: boolean; newPoints: number; newStreak: number }> {
  const participants = getLocalParticipants();
  const participant = participants.find(
    (p) => p.challengeId === challengeId && (p.userId === userId || p.userId === "current-user")
  );

  if (!participant) {
    throw new Error("Participant not found");
  }

  if (!participant.completedDays.includes(dayNumber)) {
    participant.completedDays.push(dayNumber);
    participant.currentStreak += 1;
    participant.points += 100;
    participant.completionPercentage = Math.min(100, Math.round((participant.completedDays.length / 30) * 100));
    participant.consistencyScore = Math.min(100, participant.consistencyScore + 2);
    participant.lastActiveAt = "Today";
    saveLocalParticipants(participants);
  }

  return {
    success: true,
    newPoints: participant.points,
    newStreak: participant.currentStreak,
  };
}

/**
 * Generate a ready-to-send WhatsApp invitation message & URL
 */
export function generateWhatsAppInviteUrl(challenge: GroupChallenge): string {
  const appUrl = `https://braingym-live.vercel.app/dashboard/group-challenges/join/${challenge.code}`;
  const text = `Hey everyone! 🧠🔥\n\nI've created a BrainGym Group Challenge:\n*${challenge.title}*\n\n• Duration: ${challenge.durationDays} Days\n• Goal: Build daily focus, sharp memory & mental consistency\n• Challenge Code: *${challenge.code}*\n\nTap here to join our team now:\n${appUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/**
 * Generate quick invite link for copying
 */
export function generateInviteLink(challenge: GroupChallenge): string {
  return `https://braingym-live.vercel.app/dashboard/group-challenges/join/${challenge.code}`;
}
