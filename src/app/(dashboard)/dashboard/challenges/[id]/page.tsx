"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  duration_days: number;
  goal_type: string;
  goal_amount: number;
  start_date: string;
  end_date: string;
  created_by: string;
  max_participants: number;
}

interface Participant {
  user_id: string;
  total_progress: number;
  joined_at: string;
  profiles: { name: string | null } | null;
}

interface DailyProgress {
  date: string;
  xp_earned: number;
  workouts_completed: number;
}

interface RawParticipant {
  user_id: string;
  total_progress: number;
  joined_at: string;
}

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [myProgress, setMyProgress] = useState<DailyProgress[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const isCreator = userId === challenge?.created_by;
  const isParticipant = participants.some((p) => p.user_id === userId);
  const myTotal = participants.find((p) => p.user_id === userId)?.total_progress ?? 0;
  const progressPct = challenge ? Math.min((myTotal / challenge.goal_amount) * 100, 100) : 0;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setError("You must be signed in to view this challenge.");
        setLoading(false);
        return;
      }
      setUserId(user.id);

      Promise.all([
        supabase.from("challenges").select("*").eq("id", id).single(),
        supabase
          .from("challenge_participants")
          .select("user_id, total_progress, joined_at")
          .eq("challenge_id", id)
          .then(async (r) => {
            const data = r.data as RawParticipant[] | null;
            if (!data || data.length === 0) return [];

            const userIds = data.map((p) => p.user_id);

            const { data: profiles } = await supabase
              .from("profiles")
              .select("user_id, name")
              .in("user_id", userIds);

            const profileMap = Object.fromEntries(
              (profiles ?? []).map((p) => [p.user_id, p])
            );

            return data.map((p) => ({
              ...p,
              profiles: profileMap[p.user_id] ?? null,
            })) as Participant[];
          }),
      ]).then(async ([challengeRes, parts]) => {
        if (challengeRes.error) {
          setError(challengeRes.error.message);
          setLoading(false);
          return;
        }
        setChallenge(challengeRes.data as Challenge);
        setParticipants(parts.sort((a: Participant, b: Participant) => b.total_progress - a.total_progress));

        // Fetch daily progress if participant
        const partsArr = parts as Participant[];
        if (partsArr.some((p) => p.user_id === user.id)) {
          const { data: myPartData } = await supabase
            .from("challenge_participants")
            .select("id")
            .eq("challenge_id", id)
            .eq("user_id", user.id)
            .single();

          if (myPartData) {
            const { data: dp } = await supabase
              .from("challenge_daily_progress")
              .select("date, xp_earned, workouts_completed")
              .eq("participant_id", myPartData.id)
              .order("date", { ascending: false })
              .limit(30);

            setMyProgress((dp ?? []) as DailyProgress[]);
          }
        }
        setLoading(false);
      }).catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load challenge.");
        setLoading(false);
      });
    });
  }, [id]);

  async function handleJoin() {
    if (!userId) return;
    setJoining(true);
    setJoinError(null);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("challenge_participants").insert({
        challenge_id: id,
        user_id: userId,
      });
      if (insertError) throw insertError;
      window.location.reload();
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Failed to join challenge. Please try again.");
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-lg font-medium">{error ?? "Challenge not found"}</p>
        <button onClick={() => router.back()} className="mt-2 text-sm text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === challenge.category);
  const daysElapsed = Math.floor(
    (Date.now() - new Date(challenge.start_date).getTime()) / 86400000
  );
  const daysTotal = challenge.duration_days;
  const timePct = Math.min((daysElapsed / daysTotal) * 100, 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to challenges
      </button>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {cat && (
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
              )}
              <span className="text-xs text-muted-foreground">{cat?.label ?? "General"}</span>
              {challenge.difficulty && (
                <>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs capitalize text-muted-foreground">{challenge.difficulty}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold">{challenge.title}</h1>
            {challenge.description && (
              <p className="mt-2 text-muted-foreground">{challenge.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {!isParticipant && !isCreator ? (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                {joining ? "Joining..." : "Join Challenge"}
              </button>
            ) : (
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                Participant
              </span>
            )}
            {joinError && (
              <p className="max-w-64 text-right text-xs text-destructive">{joinError}</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-lg font-bold">{challenge.duration_days}</p>
            <p className="text-xs text-muted-foreground">Days</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold capitalize">{challenge.goal_type}</p>
            <p className="text-xs text-muted-foreground">Goal type</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{challenge.goal_amount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Target</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{participants.length}</p>
            <p className="text-xs text-muted-foreground">Participants</p>
          </div>
        </div>

        {/* Challenge progress bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Time remaining: {daysTotal - daysElapsed} days</span>
            <span>{Math.round(timePct)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${timePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* My progress */}
      {isParticipant && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">My Progress</h2>
          <div className="mb-3 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{myTotal.toLocaleString()} / {challenge.goal_amount.toLocaleString()} {challenge.goal_type}</span>
              <span className="text-xs text-muted-foreground">{Math.round(progressPct)}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          {myProgress.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="text-xs text-muted-foreground">Recent days</p>
              <div className="flex items-end gap-1.5" style={{ height: 60 }}>
                {[...myProgress].reverse().slice(-14).map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-t bg-green-500 transition-all"
                      style={{
                        height: `${Math.max((d.xp_earned / Math.max(...myProgress.map((p) => p.xp_earned), 1)) * 100, 3)}%`,
                        opacity: 0.4 + (d.xp_earned > 0 ? 0.6 : 0),
                      }}
                    />
                    <span className="text-[9px] text-muted-foreground">
                      {new Date(d.date).getDate()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Leaderboard</h2>
        {participants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No participants yet</p>
        ) : (
          <div className="space-y-2">
            {participants.map((p, i) => (
              <div
                key={p.user_id}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
                  p.user_id === userId ? "border-primary/30 bg-primary/5" : "border-transparent bg-muted/30"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0
                      ? "bg-yellow-500/20 text-yellow-500"
                      : i === 1
                        ? "bg-gray-400/20 text-gray-400"
                        : i === 2
                          ? "bg-amber-700/20 text-amber-700"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">
                    {p.profiles?.name ?? "Anonymous"}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium">
                  {p.total_progress.toLocaleString()} {challenge.goal_type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
