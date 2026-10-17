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
import { getActiveGoal, BrainGoal } from "@/lib/goals/goals-engine";
import { AkucheGuidedOnboarding } from "@/components/onboarding/akuche-guided-onboarding";
import { MyMemoryModal } from "@/components/memory/my-memory-modal";
import { FollowUpCheckIn } from "@/components/dashboard/follow-up-check-in";
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
  Calendar,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good day");
  const [askInput, setAskInput] = useState("");
  const [lastSession, setLastSessionState] = useState<AkucheLastSession | null>(null);
  const [streakData, setStreakData] = useState({ currentStreak: 1, bestStreak: 3, totalActionsCompleted: 0 });
  const [commitments, setCommitments] = useState<AkucheCommitment[]>([]);
  const [activeGoal, setActiveGoal] = useState<BrainGoal | null>(null);
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

    // 4. Active goal
    getActiveGoal().then((g) => {
      if (g) setActiveGoal(g);
    });
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
      title: "Completed Daily Cognitive Challenge",
      details: "Trained first-principles bottleneck analysis.",
    });
    setStreakData(calculateActionStreak());
  };

  // Determine Next Best Move logic transparently
  const pendingCommitment = commitments[0];

  const getNextBestMove = () => {
    if (pendingCommitment) {
      return {
        badge: "PENDING COMMITMENT",
        reason: "Recommended because you have a commitment pending follow-through.",
        title: pendingCommitment.title,
        desc: pendingCommitment.description || "Move this decision from intention into completed action.",
        cta: "REVIEW MY COMMITMENT",
        href: "/dashboard/progress",
        isAction: true,
        actionType: "resolveCommitment",
        commitmentId: pendingCommitment.id,
      };
    }

    if (lastSession) {
      return {
        badge: "CONTINUE WHERE YOU LEFT OFF",
        reason: "Recommended because you have an active thinking path in progress.",
        title: lastSession.title,
        desc: lastSession.subtitle || "Resume and conclude this structured decision.",
        cta: "CONTINUE MY PLAN",
        href: lastSession.route || "/dashboard/journeys",
        isAction: false,
      };
    }

    if (!todayActivityDone) {
      return {
        badge: "DAILY COGNITIVE STRETCH",
        reason: "Recommended because starting with a 4-minute cognitive exercise primes your focus.",
        title: "Identify Your Single Highest-Leverage Bottleneck",
        desc: "Strip away secondary noise. Map the exact constraint holding back your primary objective.",
        cta: "START BRAIN CHALLENGE",
        href: "/dashboard/daily-challenge",
        isAction: false,
      };
    }

    return {
      badge: "THINK SOMETHING THROUGH",
      reason: "Recommended because your core commitments are up to date.",
      title: "What situation or decision is on your mind?",
      desc: "Work through options, evaluate trade-offs, and chart your optimal move forward.",
      cta: "THINK IT THROUGH",
      href: "/dashboard/think",
      isAction: false,
    };
  };

  const nextMove = getNextBestMove();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

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

      {/* ─── A. COMPACT WELCOME HEADER ─── */}
      <div className="flex items-center justify-between gap-3 pt-1 border-b border-border/60 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            {greeting}, {userName}. Ready to make today count?
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Train Your Mind. Transform Your Life.
          </p>
        </div>

        {/* Action Streak & Date Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-3 py-1.5 shadow-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-3 py-1.5 shadow-xs">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-black text-foreground">
              {streakData.currentStreak}d Streak
            </span>
          </div>
        </div>
      </div>

      {/* ─── PROACTIVE ACCOUNTABILITY CHECK-IN ─── */}
      <FollowUpCheckIn onResolved={refreshState} />

      {/* ─── B. YOUR NEXT BEST MOVE (PROMINENT CARD) ─── */}
      <section
        aria-labelledby="next-best-move-title"
        className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-6 shadow-md space-y-3.5"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" />
            <span>{nextMove.badge}</span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            {nextMove.reason}
          </span>
        </div>

        <div>
          <h2
            id="next-best-move-title"
            className="text-lg sm:text-xl font-black text-foreground"
          >
            {nextMove.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            {nextMove.desc}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          {nextMove.isAction && nextMove.commitmentId ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (nextMove.commitmentId) {
                    resolveCommitment(nextMove.commitmentId, "done");
                    refreshState();
                  }
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3 text-xs sm:text-sm font-bold shadow-sm transition hover:bg-primary/90 active:scale-95"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark as Done ✓</span>
              </button>
              <Link
                href="/dashboard/progress"
                className="rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground transition"
              >
                View Details
              </Link>
            </div>
          ) : (
            <Link
              href={nextMove.href}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3 text-xs sm:text-sm font-bold shadow-sm transition hover:bg-primary/90 active:scale-95"
            >
              <span>{nextMove.cta}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      {/* ─── C. BRAIN TRAINING CARD ─── */}
      <section
        aria-labelledby="brain-training-title"
        className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Brain className="h-4 w-4" />
            </span>
            <div>
              <h3
                id="brain-training-title"
                className="text-sm sm:text-base font-black text-foreground"
              >
                Brain Training
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Skill: Critical Thinking &amp; Cognitive Agility
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
              todayActivityDone
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
            }`}
          >
            {todayActivityDone ? "Completed Today ✓" : "Ready for Today"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/50">
          <div>
            <span className="text-xs sm:text-sm font-bold text-foreground block">
              Daily Challenge: The First-Principles Bottleneck Buster
            </span>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> ~4 min
              </span>
              <span>•</span>
              <span>Practical decision exercise</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!todayActivityDone ? (
              <>
                <Link
                  href="/dashboard/daily-challenge"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold shadow-xs hover:bg-primary/90 transition"
                >
                  <span>Start Challenge</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={handleCompleteTodayActivity}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition"
                >
                  Mark Done ✓
                </button>
              </>
            ) : (
              <Link
                href="/dashboard/challenges"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition"
              >
                <span>Browse All Challenges</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── D. ASK AKUCHE CARD ─── */}
      <section
        aria-labelledby="ask-akuche-title"
        className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-3.5"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <HelpCircle className="h-4 w-4" />
          </span>
          <div>
            <h3
              id="ask-akuche-title"
              className="text-sm sm:text-base font-black text-foreground"
            >
              Something on your mind? Let&apos;s think it through.
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Objective, Socratic AI coaching for business, career, relationships, and everyday life.
            </p>
          </div>
        </div>

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
            placeholder="Tell Akuche what you're trying to figure out..."
            className="flex-1 min-w-0 rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={!askInput.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:opacity-40"
            aria-label="Submit query"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {/* Quick starter topics */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {[
            "Price a product or service",
            "Evaluate a major decision",
            "Resolve a communication conflict",
            "Prioritize my 90-day goals",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                window.location.href = `/dashboard/ask?prompt=${encodeURIComponent(prompt)}`;
              }}
              className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition active:scale-95 touch-manipulation"
            >
              + {prompt}
            </button>
          ))}
        </div>
      </section>

      {/* ─── E. MY COMMITMENTS CARD ─── */}
      <section
        aria-labelledby="my-commitments-title"
        className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Target className="h-4 w-4" />
            </span>
            <div>
              <h3
                id="my-commitments-title"
                className="text-sm sm:text-base font-black text-foreground"
              >
                My Commitments
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Action follow-through turns thinking into tangible reality.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-foreground">
            {commitments.length} Active
          </span>
        </div>

        {commitments.length > 0 ? (
          <div className="space-y-2 pt-1">
            {commitments.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-border/70 bg-background"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-foreground block truncate">
                    {c.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">
                    {c.description || "Action commitment in progress"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    resolveCommitment(c.id, "done");
                    refreshState();
                  }}
                  className="rounded-xl bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-primary/90 transition shrink-0"
                >
                  Done ✓
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl border border-dashed border-border/80 bg-background/50 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              No outstanding action commitments right now. All caught up!
            </p>
            <Link
              href="/dashboard/progress"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>View commitment history</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </section>

      {/* ─── F. MY PROGRESS CARD ─── */}
      <section
        aria-labelledby="my-progress-title"
        className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <h3
                id="my-progress-title"
                className="text-sm sm:text-base font-black text-foreground"
              >
                My Progress
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Real metrics tracking your cognitive consistency and milestone execution.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/progress"
            className="text-xs font-bold text-primary hover:underline"
          >
            Full Report →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl border border-border/80 bg-background text-center">
            <span className="text-lg font-black text-primary block leading-none">
              {streakData.currentStreak} Days
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Active Streak
            </span>
          </div>

          <div className="p-3 rounded-2xl border border-border/80 bg-background text-center">
            <span className="text-lg font-black text-foreground block leading-none">
              {streakData.totalActionsCompleted}
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Actions Met
            </span>
          </div>

          <div className="p-3 rounded-2xl border border-border/80 bg-background text-center col-span-2 sm:col-span-1">
            <span className="text-xs font-black text-foreground block truncate">
              {activeGoal ? `${activeGoal.currentProgress}/${activeGoal.target} ${activeGoal.unit}` : "6/10 Milestones"}
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Active Goal
            </span>
          </div>
        </div>

        {/* Goal bar */}
        {activeGoal && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
              <span className="truncate max-w-[200px] text-foreground font-bold">
                Goal: {activeGoal.title}
              </span>
              <span>
                {Math.round((activeGoal.currentProgress / (activeGoal.target || 1)) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((activeGoal.currentProgress / (activeGoal.target || 1)) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </section>

      {/* ─── G. PROGRESSIVE DISCLOSURE / CORE AKUCHE SPACES ─── */}
      <section className="space-y-3">
        <span className="text-xs font-black text-foreground uppercase tracking-wider block">
          Explore Core Spaces
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Link
            href="/dashboard/think"
            className="p-3.5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:bg-card/90 transition text-center space-y-1.5 group touch-manipulation min-h-[90px] flex flex-col items-center justify-center"
          >
            <Brain className="h-5 w-5 text-primary group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-foreground block">
              Think It Through
            </span>
          </Link>

          <Link
            href="/dashboard/goals"
            className="p-3.5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:bg-card/90 transition text-center space-y-1.5 group touch-manipulation min-h-[90px] flex flex-col items-center justify-center"
          >
            <Target className="h-5 w-5 text-amber-500 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-foreground block">
              Goals
            </span>
          </Link>

          <Link
            href="/dashboard/journeys"
            className="p-3.5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:bg-card/90 transition text-center space-y-1.5 group touch-manipulation min-h-[90px] flex flex-col items-center justify-center"
          >
            <Compass className="h-5 w-5 text-blue-500 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-foreground block">
              Journeys
            </span>
          </Link>

          <Link
            href="/dashboard/decisions"
            className="p-3.5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:bg-card/90 transition text-center space-y-1.5 group touch-manipulation min-h-[90px] flex flex-col items-center justify-center"
          >
            <RotateCcw className="h-5 w-5 text-purple-500 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-foreground block">
              Decision Lab
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
