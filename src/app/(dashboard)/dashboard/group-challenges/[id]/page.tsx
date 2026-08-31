"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Users,
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Share2,
  Calendar,
  ShieldCheck,
  Megaphone,
  Plus,
  Award,
  Crown,
  TrendingUp,
  Activity,
  MessageCircle,
  Clock,
} from "lucide-react";
import {
  fetchGroupChallengeById,
  fetchChallengeLeaderboard,
  completeDailyGroupChallenge,
  generateWhatsAppInviteUrl,
  GroupChallenge,
  ChallengeParticipant,
} from "@/lib/group-challenges";
import { useAuth } from "@/lib/auth";
import { Confetti } from "@/components/ui/confetti";

export default function SingleChallengeDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user } = useAuth();

  const [challenge, setChallenge] = useState<GroupChallenge | null>(null);
  const [leaderboardTab, setLeaderboardTab] = useState<"overall" | "consistent" | "streak" | "improved" | "teams">("overall");
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([]);
  const [userParticipant, setUserParticipant] = useState<ChallengeParticipant | null>(null);

  // Completion State
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);

  // Host announcement modal
  const [showHostModal, setShowHostModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");

  const loadChallenge = async () => {
    setLoading(true);
    const ch = await fetchGroupChallengeById(resolvedParams.id);
    if (ch) {
      setChallenge(ch);
      const lb = await fetchChallengeLeaderboard(ch.id);
      setParticipants(lb.overall);
      setUserParticipant(lb.userParticipant);
      if (lb.userParticipant?.completedDays.includes(ch.currentDay)) {
        setTodayCompleted(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadChallenge();
  }, [resolvedParams.id]);

  const handleCompleteToday = async () => {
    if (!challenge) return;
    setTodayCompleted(true);
    setShowCelebration(true);
    await completeDailyGroupChallenge(challenge.id, user?.id || "current-user", challenge.currentDay);
    loadChallenge();
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl p-8 text-center space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded-2xl w-1/3" />
        <div className="h-64 bg-muted rounded-3xl" />
        <div className="h-32 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="mx-auto w-full max-w-md p-8 text-center space-y-4">
        <span className="text-4xl block">🔍</span>
        <h2 className="text-xl font-black text-foreground">Challenge Not Found</h2>
        <Link
          href="/dashboard/group-challenges"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-white py-2.5 px-5 text-xs font-black"
        >
          <span>Back to Group Challenges</span>
        </Link>
      </div>
    );
  }

  const isHost = challenge.hostId === user?.id || challenge.hostId === "current-user" || challenge.hostName === "Daniel Kemka";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-3 sm:px-4 lg:px-6 py-4 pb-24 overflow-x-hidden touch-manipulation animate-in fade-in">
      {/* Celebration Confetti */}
      {showCelebration && <Confetti active={true} />}

      {/* ─── BREADCRUMB & TOP ACTIONS ───────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <Link
          href="/dashboard/group-challenges"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Challenges</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* WhatsApp Share Button */}
          <a
            href={generateWhatsAppInviteUrl(challenge)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-black shadow-sm transition active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Share to WhatsApp</span>
          </a>

          {/* Certificate Button */}
          <Link
            href={`/dashboard/group-challenges/${challenge.id}/certificate`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card hover:bg-muted px-3 py-1.5 text-xs font-bold text-foreground transition active:scale-95"
          >
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>Certificate</span>
          </Link>
        </div>
      </div>

      {/* ─── 1. TOP HEADER STATS & METRICS HERO ──────────────────────────────── */}
      <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-violet-600/15 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 rounded-xl bg-primary/10 border border-primary/20">
              {challenge.coverEmoji}
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                DAY {challenge.currentDay} OF {challenge.durationDays} · {challenge.type}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                {challenge.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-muted border border-border rounded-full px-3 py-1">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>{challenge.participantsCount} Members</span>
          </div>
        </div>

        {/* 4 Core Vital Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {/* Day Progress */}
          <div className="rounded-2xl border border-border bg-background/95 p-3 space-y-0.5 shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              CHALLENGE TIMELINE
            </span>
            <span className="text-lg font-black text-foreground">
              Day {challenge.currentDay} of {challenge.durationDays}
            </span>
          </div>

          {/* User Progress */}
          <div className="rounded-2xl border border-border bg-background/95 p-3 space-y-0.5 shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              YOUR PROGRESS
            </span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {userParticipant?.completionPercentage || 80}%
            </span>
          </div>

          {/* Current Streak */}
          <div className="rounded-2xl border border-border bg-background/95 p-3 space-y-0.5 shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              CURRENT STREAK
            </span>
            <span className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
              <Flame className="h-4 w-4 fill-amber-500" />
              {userParticipant?.currentStreak || 7} Days
            </span>
          </div>

          {/* Rank */}
          <div className="rounded-2xl border border-border bg-background/95 p-3 space-y-0.5 shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              YOUR RANK
            </span>
            <span className="text-lg font-black text-primary">
              #{userParticipant?.overallRank || 8} of {challenge.participantsCount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-muted-foreground">Overall Challenge Completion</span>
            <span className="text-primary font-black">{challenge.overallCompletionRate}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-violet-600 to-emerald-500 transition-all duration-500"
              style={{ width: `${challenge.overallCompletionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── 2. SMART ACCOUNTABILITY NUDGE ──────────────────────────────────── */}
      {!todayCompleted && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-foreground">
                Your Challenge Is Waiting For You!
              </h4>
              <p className="text-[11px] text-muted-foreground">
                You are 1 activity away from keeping your {userParticipant?.currentStreak || 7}-day streak alive.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. TODAY'S CHALLENGE ACTIVITY CARD ─────────────────────────────── */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-card p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-500" />
            <span className="text-xs font-black uppercase text-foreground">
              TODAY&apos;S BRAINGYM ACTIVITY · DAY {challenge.currentDay}
            </span>
          </div>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-0.5">
            +100 Points &amp; +1 Streak
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-black text-foreground">
            {challenge.dailyActivityTitle || "High-Stakes Decision Speed & Composure Drill"}
          </h3>
          <p className="text-xs text-muted-foreground">
            Duration: ~{challenge.dailyActivityDurationMin || 10} minutes · Level: Adaptive
          </p>
        </div>

        {todayCompleted ? (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-center space-y-2 animate-in zoom-in-95">
            <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>Today&apos;s Challenge Completed!</span>
            </div>
            <p className="text-xs text-muted-foreground">
              +100 Points added to your team and personal leaderboard standing. Keep it up tomorrow!
            </p>
          </div>
        ) : (
          <div className="pt-2">
            <button
              onClick={handleCompleteToday}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 text-white py-4 px-6 text-sm font-black shadow-lg shadow-emerald-600/25 active:scale-95 transition min-h-[52px]"
            >
              <Zap className="h-5 w-5 fill-white animate-bounce" />
              <span>START TODAY&apos;S CHALLENGE NOW ➔</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── 4. HOST DASHBOARD (VISIBLE TO HOST/CREATOR) ────────────────────── */}
      {isHost && (
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-orange-500/10 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <span className="text-xs font-black uppercase text-foreground">
                HOST MANAGEMENT DASHBOARD
              </span>
            </div>
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
              Host Controls Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="rounded-xl bg-background border border-border p-2.5">
              <span className="text-[9px] text-muted-foreground uppercase block font-bold">ACTIVE TODAY</span>
              <span className="text-sm font-black text-foreground">{challenge.activeTodayCount}</span>
            </div>
            <div className="rounded-xl bg-background border border-border p-2.5">
              <span className="text-[9px] text-muted-foreground uppercase block font-bold">COMPLETED TODAY</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {Math.round(challenge.activeTodayCount * 0.88)}
              </span>
            </div>
            <div className="rounded-xl bg-background border border-border p-2.5">
              <span className="text-[9px] text-muted-foreground uppercase block font-bold">LONGEST STREAK</span>
              <span className="text-sm font-black text-amber-500">12 Days</span>
            </div>
            <div className="rounded-xl bg-background border border-border p-2.5">
              <span className="text-[9px] text-muted-foreground uppercase block font-bold">AT RISK (NEEDS NUDGE)</span>
              <span className="text-sm font-black text-rose-500">5 Members</span>
            </div>
          </div>

          {/* Host Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={generateWhatsAppInviteUrl(challenge)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3.5 py-2 text-xs font-bold shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Send WhatsApp Encouragement Nudge</span>
            </a>

            <button
              onClick={() => alert("Announcement posted to challenge feed!")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted"
            >
              <Megaphone className="h-3.5 w-3.5 text-primary" />
              <span>Post Announcement</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── 5. MULTI-CATEGORY & TEAM LEADERBOARD ───────────────────────────── */}
      <div className="rounded-3xl border-2 border-border bg-card p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-foreground">
            Challenge Leaderboard
          </h3>
          <p className="text-xs text-muted-foreground">
            Rankings emphasize daily consistency, unbroken streaks, and growth rather than pure quiz speed.
          </p>
        </div>

        {/* Leaderboard Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-border">
          {[
            { key: "overall", label: "Overall Standings" },
            { key: "consistent", label: "Most Consistent" },
            { key: "streak", label: "Highest Streak" },
            { key: "improved", label: "Most Improved" },
            ...(challenge.hasTeams ? [{ key: "teams", label: "Team Leaderboard" }] : []),
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setLeaderboardTab(tab.key as any)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition ${
                leaderboardTab === tab.key
                  ? "bg-primary text-white font-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── INDIVIDUAL PARTICIPANTS TABLE ─────────────────────────────────── */}
        {leaderboardTab !== "teams" && (
          <div className="space-y-2">
            {participants.map((p, idx) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
                  p.userId === "current-user"
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black ${
                      idx === 0
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                        : idx === 1
                        ? "bg-slate-300 text-slate-900"
                        : idx === 2
                        ? "bg-amber-700 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-foreground">
                      {p.userName} {p.userId === "current-user" && "(You)"}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {p.teamName || "Challenger"} · {p.completionPercentage}% completion
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                    <Flame className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{p.currentStreak}d</span>
                  </div>

                  <span className="text-xs sm:text-sm font-black text-primary min-w-[60px]">
                    {p.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── TEAM LEADERBOARD ──────────────────────────────────────────────── */}
        {leaderboardTab === "teams" && challenge.teams && (
          <div className="space-y-3">
            {challenge.teams.map((tm, idx) => (
              <div
                key={tm.id}
                className="p-4 rounded-2xl border border-border bg-background space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-black">
                      #{idx + 1}
                    </span>
                    <h4 className="text-sm font-black text-foreground">{tm.name}</h4>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {tm.completionRate}% Team Participation
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500"
                    style={{ width: `${tm.completionRate}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                  <span>{tm.membersCount} active members</span>
                  <span>Avg streak: {tm.averageStreak} days</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 6. HOST ANNOUNCEMENTS FEED ─────────────────────────────────────── */}
      {challenge.announcements && challenge.announcements.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Megaphone className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-black uppercase text-foreground">
              Challenge Announcements
            </h3>
          </div>

          <div className="space-y-2.5">
            {challenge.announcements.map((ann) => (
              <div key={ann.id} className="p-3.5 rounded-2xl bg-muted/60 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-foreground">{ann.title}</span>
                  <span className="text-[10px] text-muted-foreground">{ann.createdAt}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ann.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
