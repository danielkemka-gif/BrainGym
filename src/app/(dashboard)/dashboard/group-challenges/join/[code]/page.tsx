"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Flame,
  Zap,
} from "lucide-react";
import {
  fetchGroupChallengeByCode,
  joinGroupChallenge,
  GroupChallenge,
} from "@/lib/group-challenges";
import { useAuth } from "@/lib/auth";

export default function JoinChallengePage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [challenge, setChallenge] = useState<GroupChallenge | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGroupChallengeByCode(resolvedParams.code).then((res) => {
      if (res) {
        setChallenge(res);
        if (res.teams && res.teams.length > 0) {
          setSelectedTeamId(res.teams[0].id);
        }
      } else {
        setError("Challenge not found or invite code expired.");
      }
      setLoading(false);
    });
  }, [resolvedParams.code]);

  const handleJoin = async () => {
    if (!challenge) return;
    setJoining(true);

    const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Brain Challenger";

    try {
      await joinGroupChallenge(
        challenge.id,
        {
          id: user?.id || "current-user",
          name: userName,
          avatar: "⚡",
        },
        selectedTeamId
      );

      router.push(`/dashboard/group-challenges/${challenge.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to join challenge.");
      setJoining(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="mx-auto w-full max-w-lg p-8 text-center space-y-4 animate-pulse">
        <div className="h-12 w-12 bg-muted rounded-full mx-auto" />
        <div className="h-6 bg-muted rounded-xl w-2/3 mx-auto" />
        <div className="h-24 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="mx-auto w-full max-w-md p-8 text-center space-y-4">
        <span className="text-4xl block">🔍</span>
        <h2 className="text-xl font-black text-foreground">Challenge Not Found</h2>
        <p className="text-xs text-muted-foreground">{error || "Please check your link."}</p>
        <Link
          href="/dashboard/group-challenges"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-white py-2.5 px-5 text-xs font-black"
        >
          <span>Explore Challenges</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6 px-3 sm:px-4 py-8 pb-24 touch-manipulation animate-in fade-in">
      <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-violet-600/15 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        {/* Host Avatar Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-white shadow-xl shadow-primary/30 text-3xl">
          {challenge.coverEmoji || "👑"}
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest block">
            YOU&apos;VE BEEN INVITED TO JOIN:
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
            {challenge.title}
          </h1>
          <p className="text-xs font-bold text-muted-foreground">
            Hosted by <span className="text-foreground">{challenge.hostName}</span> · {challenge.hostRoleTitle || "Community Lead"}
          </p>
        </div>

        {/* Challenge Highlights */}
        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed max-w-md mx-auto">
          {challenge.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-border bg-background/90 p-2.5 space-y-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase block">
              DURATION
            </span>
            <span className="text-xs sm:text-sm font-black text-foreground">
              {challenge.durationDays} Days
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-background/90 p-2.5 space-y-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase block">
              MEMBERS
            </span>
            <span className="text-xs sm:text-sm font-black text-foreground">
              {challenge.participantsCount} Joined
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-background/90 p-2.5 space-y-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase block">
              AVG COMPLETION
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
              {challenge.overallCompletionRate}%
            </span>
          </div>
        </div>

        {/* Team Selection (if applicable) */}
        {challenge.hasTeams && challenge.teams && challenge.teams.length > 0 && (
          <div className="space-y-2 text-left bg-background/70 border border-border p-4 rounded-2xl">
            <label className="text-xs font-black text-foreground uppercase tracking-wider block">
              Select Your Team / Department
            </label>
            <div className="grid grid-cols-1 gap-2">
              {challenge.teams.map((tm) => (
                <button
                  key={tm.id}
                  type="button"
                  onClick={() => setSelectedTeamId(tm.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                    selectedTeamId === tm.id
                      ? "border-primary bg-primary/10 text-primary font-black"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tm.name}</span>
                  <span className="text-[10px] font-normal">{tm.membersCount} members</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Join CTA */}
        <div className="pt-2">
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white py-4 px-6 text-sm sm:text-base font-black shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition min-h-[54px]"
          >
            <Zap className="h-5 w-5 fill-white" />
            <span>{joining ? "Joining Challenge..." : "JOIN CHALLENGE NOW ➔"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
