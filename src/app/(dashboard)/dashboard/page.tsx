"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getLastSession,
  calculateActionStreak,
  getCommitments,
  AkucheCommitment,
  AkucheLastSession,
} from "@/lib/akuche/memory-engine";
import { getActiveGoal, BrainGoal } from "@/lib/goals/goals-engine";
import {
  ArrowRight,
  Send,
  Brain,
  Sparkles,
  Target,
  Compass,
  TrendingUp,
  Mic,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [greeting, setGreeting] = useState("Good morning");
  const [askInput, setAskInput] = useState("");
  const [lastSession, setLastSessionState] = useState<AkucheLastSession | null>(null);
  const [streakData, setStreakData] = useState({ currentStreak: 1, bestStreak: 1, totalActionsCompleted: 0 });
  const [commitments, setCommitments] = useState<AkucheCommitment[]>([]);
  const [activeGoal, setActiveGoal] = useState<BrainGoal | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // 1. Local time-of-day greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // 2. Fetch real user session state
    setLastSessionState(getLastSession());
    setStreakData(calculateActionStreak());
    setCommitments(getCommitments().filter((c) => c.status === "pending"));

    getActiveGoal().then((g) => {
      if (g) setActiveGoal(g);
    });

    // 3. Speech Recognition support check
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      }
    }
  }, []);

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.user_metadata?.name?.split(" ")[0] ||
    (user?.email ? user.email.split("@")[0].replace(/[0-9._-]/g, " ").trim().split(" ")[0] : null) ||
    "";

  const handleStartTalk = (e: React.FormEvent) => {
    e.preventDefault();
    if (askInput.trim()) {
      router.push(`/dashboard/ask?prompt=${encodeURIComponent(askInput.trim())}`);
    } else {
      router.push("/dashboard/ask");
    }
  };

  const handleToggleVoice = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setAskInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  // Determine the Single Most Relevant Next Step (Section 4)
  const getSingleNextStep = () => {
    // 1. Pending commitment (if real)
    const pending = commitments[0];
    if (pending) {
      return {
        title: pending.title,
        description: pending.description || "Review this commitment and mark your progress.",
        cta: "REVIEW MY PLAN →",
        href: "/dashboard/goals",
      };
    }

    // 2. Active goal with immediate next action
    if (activeGoal && activeGoal.nextAction) {
      return {
        title: activeGoal.title,
        description: activeGoal.nextAction,
        cta: "CONTINUE →",
        href: "/dashboard/goals",
      };
    }

    // 3. Last session / journey
    if (lastSession) {
      return {
        title: lastSession.title,
        description: lastSession.subtitle || "Resume and conclude this structured thinking plan.",
        cta: "CONTINUE →",
        href: lastSession.route || "/dashboard/journeys",
      };
    }

    // 4. Default for new user with no history: a gentle start
    return {
      title: "Establish Your Focus",
      description: "Take 4 minutes to identify your single highest-leverage priority today.",
      cta: "BEGIN →",
      href: "/dashboard/daily-challenge",
    };
  };

  const nextStep = getSingleNextStep();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 overflow-x-hidden px-4 sm:px-6 py-4 pb-28 text-foreground font-sans">
      {/* ─── SECTION 1: HEADER ─── */}
      <header className="flex items-center justify-between pt-2 border-b border-border/50 pb-4">
        <div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-heading uppercase">
            AKUCHE
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Think clearly. Choose wisely. Move forward.
          </p>
        </div>

        <Link
          href="/dashboard/profile"
          data-guide="profile"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/80 bg-card text-foreground font-bold hover:bg-muted transition text-xs shadow-xs"
          title="My Profile & Settings"
          aria-label="My Profile"
        >
          {firstName ? firstName.charAt(0).toUpperCase() : "A"}
        </Link>
      </header>

      {/* ─── SECTION 2: PERSONAL GREETING ─── */}
      <section aria-labelledby="personal-greeting-heading" className="space-y-1">
        <h1
          id="personal-greeting-heading"
          className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight"
        >
          {firstName ? `${greeting}, ${firstName}.` : `${greeting}.`}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Let&apos;s make today a little clearer.
        </p>
      </section>

      {/* ─── SECTION 3: THE PRIMARY ACTION (WHAT'S ON YOUR MIND?) ─── */}
      <section
        data-guide="think"
        aria-labelledby="primary-action-heading"
        className="rounded-3xl border-2 border-[#167A52]/40 bg-[#FFFFFF] dark:bg-[#122119] p-6 sm:p-8 shadow-sm space-y-4"
      >
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#167A52] dark:text-emerald-400">
            Coaching Partner
          </span>
          <h2
            id="primary-action-heading"
            className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight"
          >
            WHAT&apos;S ON YOUR MIND?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Tell me what you&apos;re thinking about, what you&apos;re struggling with, or what you&apos;d like to achieve.
          </p>
        </div>

        <form onSubmit={handleStartTalk} className="space-y-3 pt-1">
          <div className="relative">
            <input
              type="text"
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              placeholder="Type a dilemma, decision, or question..."
              className="w-full h-13 pl-4 pr-12 rounded-2xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#167A52] focus:ring-1 focus:ring-[#167A52] transition"
            />
            {speechSupported && (
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Voice Dictation"
                aria-label="Voice Dictation"
              >
                <Mic className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#167A52] hover:bg-[#10563C] text-white font-black text-sm tracking-wide shadow-md shadow-emerald-950/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            <span>TALK TO AKUCHE</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>

      {/* ─── SECTION 4: ONE RELEVANT NEXT STEP ─── */}
      <section
        data-guide="actions"
        aria-labelledby="next-step-heading"
        className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3
            id="next-step-heading"
            className="text-xs font-black uppercase tracking-wider text-muted-foreground"
          >
            YOUR NEXT STEP
          </h3>
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-foreground font-heading">
            {nextStep.title}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {nextStep.description}
          </p>
        </div>

        <div className="pt-1">
          <Link
            href={nextStep.href}
            className="inline-flex items-center gap-2 rounded-xl bg-background border border-border/90 hover:border-[#167A52] px-5 py-2.5 text-xs font-bold text-foreground transition active:scale-95 shadow-xs"
          >
            <span>{nextStep.cta}</span>
          </Link>
        </div>
      </section>

      {/* ─── SECTION 5: MIND TRAINING (VISUALLY SECONDARY) ─── */}
      <section
        data-guide="clarity"
        aria-labelledby="mind-training-heading"
        className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-2.5"
      >
        <div className="space-y-1">
          <h3
            id="mind-training-heading"
            className="text-base font-bold text-foreground font-heading"
          >
            WANT TO EXERCISE YOUR MIND?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Explore guided activities that help you practise thinking and other cognitive skills.
          </p>
        </div>

        <div className="pt-1">
          <Link
            href="/dashboard/daily-challenge"
            className="inline-flex items-center gap-2 rounded-xl bg-muted/70 hover:bg-muted text-foreground px-5 py-2.5 text-xs font-bold transition active:scale-95"
          >
            <span>EXPLORE MIND TRAINING →</span>
          </Link>
        </div>
      </section>

      {/* ─── SECTION 6: SUBTLE PROGRESS INDICATOR ─── */}
      <section
        data-guide="progress"
        aria-labelledby="progress-indicator-heading"
        className="rounded-3xl border border-border/60 bg-muted/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
      >
        <div className="text-muted-foreground">
          {streakData.totalActionsCompleted > 0 ? (
            <span>
              You&apos;ve completed{" "}
              <strong className="text-foreground">
                {streakData.totalActionsCompleted} activity milestone
                {streakData.totalActionsCompleted > 1 ? "s" : ""}
              </strong>{" "}
              with a {streakData.currentStreak}-day focus streak.
            </span>
          ) : (
            <span>Your journey is just beginning.</span>
          )}
        </div>

        <Link
          href="/dashboard/progress"
          className="text-xs font-bold text-[#167A52] dark:text-emerald-400 hover:underline shrink-0"
        >
          VIEW MY PROGRESS →
        </Link>
      </section>
    </div>
  );
}
