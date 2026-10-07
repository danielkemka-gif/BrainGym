"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  getLastSession,
  calculateActionStreak,
  getCommitments,
  resolveCommitment,
  recordActionStreakActivity,
  AkucheCommitment,
  AkucheLastSession,
} from "@/lib/akuche/memory-engine";
import { getActiveJourneyId, getJourneyById, getJourneyProgress } from "@/lib/akuche/journeys-engine";
import { AkucheGuidedOnboarding } from "@/components/onboarding/akuche-guided-onboarding";
import { MyMemoryModal } from "@/components/memory/my-memory-modal";
import { AppInstallCard } from "@/components/dashboard/app-install-card";
import { RealWorldAssignmentCard } from "@/components/dashboard/real-world-assignment-card";
import { AkucheMomentBanner } from "@/components/dashboard/akuche-moment-banner";
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  HelpCircle,
  Compass,
  TrendingUp,
  Brain,
  Zap,
  Send,
  RotateCcw,
  Shield,
  Clock,
  Shuffle,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good day");
  const [askInput, setAskInput] = useState("");
  const [lastSession, setLastSessionState] = useState<AkucheLastSession | null>(null);
  const [streakData, setStreakData] = useState({ currentStreak: 1, bestStreak: 3, totalActionsCompleted: 0 });
  const [commitments, setCommitments] = useState<AkucheCommitment[]>([]);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [todayActivityDone, setTodayActivityDone] = useState(false);
  const [challengeMeActive, setChallengeMeActive] = useState(false);
  const [surpriseMeActive, setSurpriseMeActive] = useState(false);

  // Replay onboarding helper
  const [showOnboarding, setShowOnboarding] = useState(false);

  const refreshState = () => {
    // 1. Time-of-day greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // 2. Last session & journey progress
    const session = getLastSession();
    if (session) {
      setLastSessionState(session);
    } else {
      const activeJId = getActiveJourneyId();
      const j = getJourneyById(activeJId);
      if (j) {
        const prog = getJourneyProgress(activeJId);
        const stage = j.stages[prog.currentStageIndex] || j.stages[0];
        setLastSessionState({
          type: "journey_step",
          title: j.title,
          subtitle: `Stage ${stage.stageNumber}: ${stage.title}`,
          route: "/dashboard/journeys",
          progressText: `Stage ${stage.stageNumber} of ${j.stages.length}`,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // 3. Action streak & commitments
    setStreakData(calculateActionStreak());
    setCommitments(getCommitments().filter((c) => c.status === "pending"));
  };

  useEffect(() => {
    refreshState();
  }, []);

  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Friend";

  const handleCompleteTodayActivity = () => {
    setTodayActivityDone(true);
    recordActionStreakActivity({
      type: "action",
      title: "Today's Akuche Activity Completed",
      details: "Diagnosed single commercial bottleneck and mapped next action.",
    });
    setStreakData(calculateActionStreak());
  };

  const handleResolvePendingCommitment = (
    id: string,
    status: "done" | "partly_done" | "not_yet"
  ) => {
    resolveCommitment(id, status);
    refreshState();
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 overflow-x-hidden px-3 sm:px-4 py-3 pb-24 touch-manipulation">
      {/* Optional First-Time Guided Onboarding */}
      {showOnboarding && (
        <AkucheGuidedOnboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Memory Modal */}
      <MyMemoryModal
        isOpen={showMemoryModal}
        onClose={() => setShowMemoryModal(false)}
      />

      {/* ─── 1. GREETING & CALM IDENTITY (SECTION 7 & 8) ─── */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            {greeting}, {userName}.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Think better. Decide better. Do better.
          </p>
        </div>

        {/* Action Streak Pill (Section 15) */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-3 py-1.5 shadow-xs shrink-0">
          <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span className="text-xs font-black text-foreground">
            {streakData.currentStreak}d Action Streak
          </span>
        </div>
      </div>

      {/* ─── APP INSTALL BANNER (EASY 1-TAP INSTALLATION ON PHONES) ─── */}
      <AppInstallCard variant="banner" />

      {/* ─── 2. PENDING COMMITMENT CHECK-IN (SECTION 20 ACCOUNTABILITY) ─── */}
      {commitments.length > 0 && (
        <div className="rounded-2xl sm:rounded-3xl border-2 border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 shadow-sm space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>YOUR COMMITMENT IS WAITING</span>
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Accountability Check
            </span>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              &ldquo;{commitments[0].title}&rdquo;
            </h3>
            {commitments[0].description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {commitments[0].description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              onClick={() => handleResolvePendingCommitment(commitments[0].id, "done")}
              className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-emerald-700 transition active:scale-95"
            >
              Done ✓
            </button>
            <button
              onClick={() => handleResolvePendingCommitment(commitments[0].id, "partly_done")}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition"
            >
              Partly done
            </button>
            <button
              onClick={() => handleResolvePendingCommitment(commitments[0].id, "not_yet")}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition"
            >
              Not yet
            </button>
          </div>
        </div>
      )}

      {/* ─── 3. "CONTINUE WHERE I STOPPED" (SECTIONS 1, 9 & 41) ─── */}
      {lastSession && (
        <div className="rounded-2xl sm:rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-card to-card p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-xs">
              <RotateCcw className="h-3 w-3" />
              YOU STOPPED HERE
            </span>
            {lastSession.progressText && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {lastSession.progressText}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              {lastSession.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lastSession.subtitle}
            </p>
          </div>

          <div className="pt-1">
            <Link
              href={lastSession.route}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
              <span>Continue →</span>
            </Link>
          </div>
        </div>
      )}

      {/* ─── 4. LARGE OBVIOUS "ASK AKUCHE" BAR (SECTION 8 & 12) ─── */}
      <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 shadow-sm space-y-2.5">
        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>What are you thinking about?</span>
        </label>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!askInput.trim()) return;
            window.location.href = `/dashboard/ask?prompt=${encodeURIComponent(askInput)}`;
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder="e.g. I want to make ₦5m before December..."
            className="flex-1 min-w-0 rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!askInput.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-[11px] text-muted-foreground scrollbar-none">
          <span className="font-semibold shrink-0">Try:</span>
          {[
            "Make ₦5m in 30 days",
            "Should I leave my job?",
            "Get 10 B2B clients",
            "Overcome procrastination",
          ].map((suggestion, i) => (
            <Link
              key={i}
              href={`/dashboard/ask?prompt=${encodeURIComponent(suggestion)}`}
              className="rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 text-foreground/80 hover:border-emerald-500/40 hover:text-foreground transition shrink-0 whitespace-nowrap"
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </div>

      {/* ─── 5. TODAY'S AKUCHE: SINGLE MEANINGFUL ACTIVITY (SECTION 14) ─── */}
      <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
              TODAY&apos;S AKUCHE · ACT
            </span>
          </div>
          {todayActivityDone ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Completed</span>
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground font-semibold">
              ~5 min exercise
            </span>
          )}
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Contact 1 Warm Decision-Maker with a Pilot Solution.
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            Do not wait for passive inquiries. Send 1 direct WhatsApp message asking if your target contact has a priority need for your core skill this month.
          </p>
        </div>

        {!todayActivityDone && (
          <div className="pt-1 flex items-center justify-between gap-3">
            <Link
              href="/dashboard/ask?prompt=Help me craft a 1-sentence WhatsApp outreach message for my core skill."
              className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Draft message with Akuche →
            </Link>

            <button
              onClick={handleCompleteTodayActivity}
              className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-emerald-700 transition active:scale-95"
            >
              Mark Done ✓
            </button>
          </div>
        )}
      </div>

      {/* ─── 6. THE 5 PRIMARY ACTION GATEWAYS (PHASE 2 SECTION 7) ─── */}
      <div className="space-y-2.5">
        <span className="text-xs font-black text-foreground uppercase tracking-wider block">
          What Do You Need Today?
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {/* 1. THINK SOMETHING THROUGH */}
          <Link
            href="/dashboard/think"
            className="group flex flex-col justify-between p-4 rounded-3xl border border-border/80 bg-card hover:border-emerald-500/40 hover:bg-card/90 transition shadow-xs touch-manipulation min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Brain className="h-4 w-4" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-emerald-600 transition" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-foreground block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                THINK SOMETHING THROUGH
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">
                For a situation, problem or decision
              </span>
            </div>
          </Link>

          {/* 2. ASK AKUCHE */}
          <Link
            href="/dashboard/ask"
            className="group flex flex-col justify-between p-4 rounded-3xl border border-border/80 bg-card hover:border-blue-500/40 hover:bg-card/90 transition shadow-xs touch-manipulation min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <HelpCircle className="h-4 w-4" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-blue-600 transition" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-foreground block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                ASK AKUCHE
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">
                For questions and guided conversations
              </span>
            </div>
          </Link>

          {/* 3. TODAY'S CHALLENGE */}
          <Link
            href="/dashboard/daily-challenge"
            className="group flex flex-col justify-between p-4 rounded-3xl border border-border/80 bg-card hover:border-amber-500/40 hover:bg-card/90 transition shadow-xs touch-manipulation min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Target className="h-4 w-4" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-amber-600 transition" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-foreground block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                TODAY&apos;S CHALLENGE
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">
                A personalised mental or practical activity
              </span>
            </div>
          </Link>

          {/* 4. MOVE */}
          <Link
            href="/dashboard/move"
            className="group flex flex-col justify-between p-4 rounded-3xl border border-border/80 bg-card hover:border-rose-500/40 hover:bg-card/90 transition shadow-xs touch-manipulation min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Zap className="h-4 w-4" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-rose-600 transition" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-foreground block group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
                MOVE
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">
                A short 2–5 minute physical reset for brain clarity
              </span>
            </div>
          </Link>

          {/* 5. SURPRISE ME */}
          <Link
            href="/dashboard/surprise"
            className="group flex flex-col justify-between p-4 rounded-3xl border border-border/80 bg-card hover:border-purple-500/40 hover:bg-card/90 transition shadow-xs touch-manipulation min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Shuffle className="h-4 w-4" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-purple-600 transition" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-foreground block group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                SURPRISE ME
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">
                Let Akuche choose something useful for you
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── OUTSIDE YOUR PHONE REAL-WORLD CHALLENGE (SECTION 34) ─── */}
      <RealWorldAssignmentCard />

      {/* ─── AKUCHE MOMENT OBSERVATION (SECTION 12) ─── */}
      <AkucheMomentBanner />

      {/* Dynamic Drawer for Challenge Me / Surprise Me */}
      {challengeMeActive && (
        <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-4 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-900 dark:text-amber-300">
              ⚡ ON-DEMAND CHALLENGE
            </span>
            <button
              onClick={() => setChallengeMeActive(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-foreground font-semibold">
            &ldquo;List 3 painful headaches your best skill solves, find 1 business owner who suffers from it, and ask them 1 diagnostic question before 5:00 PM.&rdquo;
          </p>
          <div className="pt-1">
            <button
              onClick={() => {
                handleCompleteTodayActivity();
                setChallengeMeActive(false);
              }}
              className="rounded-xl bg-emerald-600 text-white px-4 py-1.5 text-xs font-bold"
            >
              Accept Challenge &amp; Log
            </button>
          </div>
        </div>
      )}

      {surpriseMeActive && (
        <div className="rounded-2xl border-2 border-purple-500/30 bg-purple-500/5 p-4 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-900 dark:text-purple-300">
              🎲 AKUCHE REMEMBERS
            </span>
            <button
              onClick={() => setSurpriseMeActive(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-foreground font-semibold">
            &ldquo;Selling high-ticket services directly to business owners generates cash 10x faster than perfecting unvalidated websites.&rdquo;
          </p>
          <span className="text-[10px] text-muted-foreground block">
            From your income planning conversation.
          </span>
        </div>
      )}

      {/* ─── 7. APP INSTALL CARD (EASY MOBILE & HOME SCREEN INSTALLATION) ─── */}
      <AppInstallCard />

      {/* ─── 8. SMART RECOMMENDATIONS (SECTION 8 & 17) ─── */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
          Recommended Next Actions
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/dashboard/journeys"
            className="group block rounded-2xl border border-border/80 bg-card p-4 shadow-sm hover:border-emerald-500/40 transition"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                JOURNEY MILESTONE
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-emerald-600 transition" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground mt-1">
              Build My Business: Stage 1
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Discover your core strength and craft your 1-sentence value offer.
            </p>
          </Link>

          <Link
            href="/dashboard/insights"
            className="group block rounded-2xl border border-border/80 bg-card p-4 shadow-sm hover:border-emerald-500/40 transition"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                WEEKLY REVIEW
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-purple-600 transition" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground mt-1">
              Review Your Action Trajectory
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Review your weekly execution and lock in next week&apos;s priority.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
