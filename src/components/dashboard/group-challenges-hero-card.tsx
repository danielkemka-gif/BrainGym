"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Trophy,
  ArrowRight,
  Flame,
  Plus,
  Sparkles,
  CheckCircle2,
  Share2,
} from "lucide-react";
import {
  fetchUserGroupChallenges,
  GroupChallenge,
} from "@/lib/group-challenges";

export function GroupChallengesHeroCard() {
  const [activeChallenge, setActiveChallenge] = useState<GroupChallenge | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserGroupChallenges().then(({ active, created }) => {
      const featured = active[0] || created[0];
      setActiveChallenge(featured || null);
      setTotalCount(active.length + created.length);
      setLoading(false);
    });
  }, []);

  return (
    <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-violet-600/10 via-card to-primary/10 p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-primary">
            GROUP CHALLENGES
          </span>
        </div>

        <Link
          href="/dashboard/group-challenges"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>View All ({totalCount})</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
          Challenge Yourself. Challenge Your Friends. Challenge Your Team.
        </h2>
        <p className="text-xs text-muted-foreground font-medium">
          Join WhatsApp communities, schools, companies, and friends building daily mental consistency.
        </p>
      </div>

      {/* ─── ACTIVE CHALLENGE PREVIEW CARD ──────────────────────────────────── */}
      {activeChallenge ? (
        <div className="rounded-2xl border border-border/90 bg-background/95 p-4 space-y-3 shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
                {activeChallenge.coverEmoji}
              </span>
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase text-primary tracking-wider">
                  ACTIVE CHALLENGE · DAY {activeChallenge.currentDay} OF {activeChallenge.durationDays}
                </span>
                <h3 className="text-sm sm:text-base font-black text-foreground leading-snug">
                  {activeChallenge.title}
                </h3>
              </div>
            </div>

            <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border rounded-full px-2.5 py-0.5 shrink-0 flex items-center gap-1">
              <Users className="h-3 w-3" />
              {activeChallenge.participantsCount} participants
            </span>
          </div>

          {/* Progress Bar & Stats */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Your Progress</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">
                {activeChallenge.overallCompletionRate}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                style={{ width: `${activeChallenge.overallCompletionRate}%` }}
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/dashboard/group-challenges/${activeChallenge.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-2.5 px-4 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[40px]"
            >
              <span>Continue Challenge</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/dashboard/group-challenges/create"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-border bg-card hover:bg-muted py-2.5 px-3 text-xs font-bold text-foreground transition active:scale-95 min-h-[40px]"
            >
              <Plus className="h-3.5 w-3.5 text-primary" />
              <span>New</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State / Prompt to Create or Join */
        <div className="rounded-2xl border border-dashed border-border p-4 text-center space-y-3 bg-background/50">
          <p className="text-xs text-muted-foreground">
            You haven&apos;t joined any group challenges yet. Start one for your WhatsApp group or team!
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link
              href="/dashboard/group-challenges/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white py-2 px-4 text-xs font-black shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create a Challenge</span>
            </Link>
            <Link
              href="/dashboard/group-challenges"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card py-2 px-3 text-xs font-bold"
            >
              <span>Explore Challenges</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
