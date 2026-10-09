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
import { FollowUpCheckIn } from "@/components/dashboard/follow-up-check-in";
import { DailyInspirationCard } from "@/components/dashboard/daily-inspiration-card";
import { AppInstallCard } from "@/components/dashboard/app-install-card";
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Brain,
  Send,
  RotateCcw,
  Target,
  Compass,
  Lightbulb,
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
      details: "Completed daily thinking challenge & action.",
    });
    setStreakData(calculateActionStreak());
  };

  // Determine the SINGLE most relevant primary action based on actual user context
  const pendingCommitment = commitments[0];

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

      {/* ─── 1. GREETING & CALM IDENTITY ─── */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            {greeting}, {userName}.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Think better. Decide better. Live better.
          </p>
        </div>

        {/* Action Streak Pill */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-3 py-1.5 shadow-xs shrink-0">
          <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span className="text-xs font-black text-foreground">
            {streakData.currentStreak}d Action Streak
          </span>
        </div>
      </div>

      {/* ─── 2. PROMINENT 1-TAP APP INSTALL (FOR PHONE HOME SCREEN) ─── */}
      <AppInstallCard variant="banner" />

      {/* ─── 3. TODAY'S AKUCHE DAILY INSPIRATION & PRINCIPLE ─── */}
      <DailyInspirationCard />

      {/* ─── 4. PROACTIVE ACCOUNTABILITY FOLLOW-UP ─── */}
      <FollowUpCheckIn onResolved={refreshState} />

      {/* ─── 5. THE ONE CLEAR PRIMARY ACTION (SECTION 4A) ─── */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-card p-5 sm:p-6 shadow-md space-y-4">
        {/* Case A: User has an active unfinished journey */}
        {lastSession ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/15 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <RotateCcw className="h-3 w-3" />
                <span>CONTINUE WHERE YOU STOPPED</span>
              </span>
              {lastSession.progressText && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {lastSession.progressText}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground">
                {lastSession.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {lastSession.subtitle}
              </p>
            </div>

            <Link
              href={lastSession.route}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-6 py-3 text-sm font-bold shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
              <span>Resume Session</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : pendingCommitment ? (
          /* Case B: User has an outstanding action commitment */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Target className="h-3 w-3" />
                <span>REVIEW YOUR NEXT STEP</span>
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground">
                {pendingCommitment.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {pendingCommitment.description || "Move this commitment from thought into tangible reality today."}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  resolveCommitment(pendingCommitment.id, "done");
                  refreshState();
                }}
                className="rounded-2xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold hover:bg-emerald-700 transition"
              >
                Mark as Done ✓
              </button>
              <Link
                href="/dashboard/progress"
                className="rounded-2xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition"
              >
                View in Progress
              </Link>
            </div>
          </div>
        ) : !todayActivityDone ? (
          /* Case C: Today's Daily Challenge */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-3 w-3" />
                <span>START TODAY&apos;S CHALLENGE</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-semibold">
                ~5 min
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground">
                Identify Your Single Highest-Leverage Bottleneck
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Cut through secondary tasks. Map the one constraint that is holding back your primary goal.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/dashboard/daily-challenge"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold hover:bg-emerald-700 transition"
              >
                <span>Begin Activity</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={handleCompleteTodayActivity}
                className="rounded-2xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition"
              >
                Mark Done ✓
              </button>
            </div>
          </div>
        ) : (
          /* Case D: Default "Think Something Through" */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Brain className="h-3 w-3" />
                <span>THINK SOMETHING THROUGH</span>
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground">
                What situation or decision is on your mind?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Work through options, clarify trade-offs, and find the right move forward.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!askInput.trim()) return;
                window.location.href = `/dashboard/think?prompt=${encodeURIComponent(askInput)}`;
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Tell Akuche what you're trying to figure out..."
                className="flex-1 min-w-0 rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!askInput.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-40"
                aria-label="Submit thought"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ─── 6. THE 4 CORE MAIN FEATURES (SECTION 4B) ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-foreground uppercase tracking-wider block">
            Core Akuche Spaces
          </span>
          <span className="text-[11px] text-muted-foreground">
            Clear, purposeful thinking
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. THINK SOMETHING THROUGH */}
          <Link
            href="/dashboard/think"
            className="group flex flex-col justify-between p-5 rounded-3xl border border-border/80 bg-card hover:border-emerald-500/40 hover:bg-card/90 transition shadow-xs touch-manipulation min-h-[125px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Brain className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-emerald-600 transition" />
            </div>
            <div className="pt-2">
              <span className="text-sm font-black text-foreground block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                Think Something Through
              </span>
              <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                Deconstruct a dilemma, evaluate real trade-offs, and choose your best move.
              </span>
            </div>
          </Link>

          {/* 2. ASK AKUCHE */}
          <Link
            href="/dashboard/ask"
            className="group flex flex-col justify-between p-5 rounded-3xl border border-border/80 bg-card hover:border-blue-500/40 hover:bg-card/90 transition shadow-xs touch-manipulation min-h-[125px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <HelpCircle className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-blue-600 transition" />
            </div>
            <div className="pt-2">
              <span className="text-sm font-black text-foreground block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                Ask Akuche
              </span>
              <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                Ask questions about career, business, relationships, or money for calm clarity.
              </span>
            </div>
          </Link>

          {/* 3. TODAY'S CHALLENGE */}
          <Link
            href="/dashboard/daily-challenge"
            className="group flex flex-col justify-between p-5 rounded-3xl border border-border/80 bg-card hover:border-amber-500/40 hover:bg-card/90 transition shadow-xs touch-manipulation min-h-[125px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Target className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-amber-600 transition" />
            </div>
            <div className="pt-2">
              <span className="text-sm font-black text-foreground block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                Today&apos;s Challenge
              </span>
              <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                A 5-minute practical exercise to train mental models and decisive action.
              </span>
            </div>
          </Link>

          {/* 4. MY PROGRESS */}
          <Link
            href="/dashboard/progress"
            className="group flex flex-col justify-between p-5 rounded-3xl border border-border/80 bg-card hover:border-purple-500/40 hover:bg-card/90 transition shadow-xs touch-manipulation min-h-[125px]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <TrendingUp className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-purple-600 transition" />
            </div>
            <div className="pt-2">
              <span className="text-sm font-black text-foreground block group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                My Progress
              </span>
              <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                Review completed commitments, thinking streaks, and decision history.
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── 7. CONTEXTUAL INTELLIGENT GUIDANCE (SECTION 4D) ─── */}
      <div className="rounded-2xl bg-muted/40 border border-border/60 p-4 flex items-start gap-3 text-xs text-muted-foreground">
        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-foreground font-semibold">Not sure where to start?</strong> Tap{" "}
          <Link href="/dashboard/think" className="text-emerald-600 dark:text-emerald-400 underline font-medium">
            Think Something Through
          </Link>{" "}
          to lay out any situation, or ask a direct question using{" "}
          <Link href="/dashboard/ask" className="text-emerald-600 dark:text-emerald-400 underline font-medium">
            Ask Akuche
          </Link>.
        </p>
      </div>
    </div>
  );
}
