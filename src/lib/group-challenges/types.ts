/**
 * BRAINGYM GROUP CHALLENGE SYSTEM — TYPE DEFINITIONS
 * Transforms BrainGym into a social mental fitness & community challenge platform.
 */

export type ChallengeType =
  | "Daily Brain Workout"
  | "Memory Challenge"
  | "Focus Challenge"
  | "Mental Agility Challenge"
  | "Productivity Challenge"
  | "Brain Momentum Challenge"
  | "Custom Challenge";

export type ChallengeAudience =
  | "Anyone with the link"
  | "Private invitation only"
  | "Organization members"
  | "My community/group"
  | "Invite by code";

export type ChallengeCategory =
  | "Popular"
  | "For Entrepreneurs"
  | "For Students"
  | "For Professionals"
  | "Focus"
  | "Memory"
  | "Productivity"
  | "Mental Agility"
  | "Beginner"
  | "Faith & Community"
  | "Corporate / Teams";

export interface ChallengeTeam {
  id: string;
  challengeId: string;
  name: string; // e.g. "Sales", "Marketing", "Grade 12", "Youth Fellowship"
  membersCount: number;
  completionRate: number; // 0 - 100%
  averageStreak: number;
  rank: number;
}

export interface ChallengeAnnouncement {
  id: string;
  challengeId: string;
  authorName: string;
  authorRole: string; // e.g. "Host", "Admin"
  title: string;
  message: string;
  createdAt: string;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role?: "host" | "participant" | "team_lead";
  teamId?: string;
  teamName?: string;
  currentStreak: number;
  completedDays: number[]; // e.g. [1, 2, 3, 4, 5, 6, 7]
  completionPercentage: number; // 0 - 100%
  points: number;
  overallRank: number;
  consistencyScore: number; // based on daily check-ins
  improvementScore: number; // based on growth delta
  joinedAt: string;
  lastActiveAt: string;
}

export interface GroupChallenge {
  id: string;
  code: string; // Unique short code e.g. "BG-GROWTH-30"
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  hostRoleTitle?: string; // e.g. "Community Lead", "HR Director", "Class Captain"
  type: ChallengeType;
  category: ChallengeCategory;
  targetRole: string; // e.g. "For Entrepreneurs & Founders", "For High School Scholars"
  durationDays: number; // 3, 7, 14, 21, 30, etc.
  currentDay: number; // e.g. 12
  startDate: string;
  endDate: string;
  isPrivate: boolean;
  audience: ChallengeAudience;
  participantsCount: number;
  activeTodayCount: number;
  overallCompletionRate: number; // 0 - 100%
  coverEmoji: string; // e.g. "🚀", "🧠", "💼", "📚"
  coverGradient: string;
  hasTeams: boolean;
  teams?: ChallengeTeam[];
  announcements?: ChallengeAnnouncement[];
  dailyActivityTitle?: string;
  dailyActivityDurationMin?: number;
  isCompleted?: boolean;
}

export interface ChallengeCreationInput {
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  targetRole: string;
  durationDays: number;
  startDate: string;
  audience: ChallengeAudience;
  isPrivate: boolean;
  coverEmoji?: string;
  hasTeams?: boolean;
  teamNames?: string[];
}
