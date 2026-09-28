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
  Calendar,
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
    <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-4 sm:p-5 shadow-lg space-y-4">
      {/* ─── Header: Section Title & Count ─────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-primary">
            GROUP CHALLENGES
          </span>
        </div>

        <Link
          href="/dashboard/group-challenges"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>Explore All ({totalCount})</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* ─── ACTIVE CHALLENGE BOX (ELEGANTLY ALIGNED & JUSTIFIED) ─────────── */}
      {activeChallenge ? (
        <div className="rounded-2xl border border-border bg-background/90 p-4 sm:p-5 space-y-3.5 shadow-sm">
          {/* Top Row: Category Pill & Member Count */}
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
              DAY {activeChallenge.currentDay} OF {activeChallenge.durationDays}
            </span>

            <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3 text-primary" />
              <span>{activeChallenge.participantsCount} Members</span>
            </span>
          </div>

          {/* Title & Emoji Header */}
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-2xl shadow-inner">
              {activeChallenge.coverEmoji}
            </span>
            <div className="space-y-0.5 min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight leading-snug">
                {activeChallenge.title}
              </h3>
              <p className="text-[11px] font-bold text-primary">
                Hosted by {activeChallenge.hostName} · {activeChallenge.category}
              </p>
            </div>
          </div>

          {/* Description Text: Readable & Justified */}
          {activeChallenge.description && (
            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed text-justify bg-muted/30 rounded-xl p-3 border border-border/40">
              {activeChallenge.description}
            </p>
          )}

          {/* Progress Bar & Rate */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Team Consistency Rate</span>
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

          {/* Primary Action Button */}
          <div className="pt-1">
            <Link
              href={`/dashboard/group-challenges/${activeChallenge.id}`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:brightness-110 text-white py-3 px-4 text-xs sm:text-sm font-black shadow-md shadow-primary/20 transition active:scale-95 min-h-[44px]"
            >
              <span>ENTER CHALLENGE ARENA ➔</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border p-5 text-center space-y-3 bg-background/50">
          <p className="text-xs text-muted-foreground">
            Join WhatsApp communities, schools, companies, and friends building daily mental consistency.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link
              href="/dashboard/group-challenges/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white py-2.5 px-4 text-xs font-black shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Challenge</span>
            </Link>
            <Link
              href="/dashboard/group-challenges"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card py-2.5 px-3 text-xs font-bold"
            >
              <span>Explore</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
