"use client";

import { useState, useEffect, useRef } from "react";
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
  Sparkles,
  Target,
  Brain,
  TrendingUp,
  Mic,
  Compass,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
} from "lucide-react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";

const POPULAR_CHIPS = [
  { label: "💰 ₦5M Plan", prompt: "I want to generate ₦5,000,000 before the end of the year. Break this down into an execution plan." },
  { label: "⚖️ 9-to-5 vs Business", prompt: "Should I stay in my 9-to-5 job or transition into full-time business? Help me evaluate the trade-offs." },
  { label: "💼 10 B2B Clients", prompt: "How do I acquire 10 high-paying B2B clients for my service with zero ad budget?" },
  { label: "🎯 Overcome Procrastination", prompt: "I am overwhelmed and need a daily productivity plan to finish my highest priority." },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [greeting, setGreeting] = useState("Welcome back");
  const [askInput, setAskInput] = useState("");
  const [lastSession, setLastSessionState] = useState<AkucheLastSession | null>(null);
  const [streakData, setStreakData] = useState({ currentStreak: 1, bestStreak: 1, totalActionsCompleted: 0 });
  const [commitments, setCommitments] = useState<AkucheCommitment[]>([]);
  const [activeGoal, setActiveGoal] = useState<BrainGoal | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [dailyClarityDismissed, setDailyClarityDismissed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 1. Time-of-day greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // 2. Load actual user data
    setLastSessionState(getLastSession());
    setStreakData(calculateActionStreak());
    setCommitments(getCommitments().filter((c) => c.status === "pending"));

    getActiveGoal().then((g) => {
      if (g) setActiveGoal(g);
    });

    // 3. Speech recognition check
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

  // Determine Continue Where You Stopped item
  const getContinueItem = () => {
    if (commitments[0]) {
      return {
        title: commitments[0].title,
        description: commitments[0].description || "Action commitment awaiting execution.",
        cta: "Review Commitment →",
        href: "/dashboard/goals",
        badge: "Active Commitment",
      };
    }
    if (activeGoal && activeGoal.nextAction) {
      return {
        title: activeGoal.title,
        description: `Next Action: ${activeGoal.nextAction}`,
        cta: "Continue Goal →",
        href: "/dashboard/goals",
        badge: "Active Goal",
      };
    }
    if (lastSession) {
      return {
        title: lastSession.title,
        description: lastSession.subtitle || "Resume and conclude your thinking plan.",
        cta: "Resume Session →",
        href: lastSession.route || "/dashboard/journeys",
        badge: "Previous Session",
      };
    }
    return null;
  };

  const continueItem = getContinueItem();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-7 overflow-x-hidden px-3 sm:px-6 py-4 pb-28 text-foreground font-sans">
      {/* ─── SECTION 3.A: WELCOME SECTION ─── */}
      <header className="flex items-center justify-between pt-1 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AkucheBrandLogo variant="mark" size="xs" />
            <span className="text-xs font-black tracking-widest uppercase text-primary">
              AKUCHE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
            {firstName ? `${greeting}, ${firstName}.` : `${greeting}.`}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            What would you like to make progress on today?
          </p>
        </div>

        <Link
          href="/dashboard/profile"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-foreground font-bold hover:border-primary/50 transition text-xs shadow-xs"
          title="My Profile & Settings"
          aria-label="My Profile"
        >
          {firstName ? firstName.charAt(0).toUpperCase() : "A"}
        </Link>
      </header>

      {/* ─── INTERACTIVE GUIDE SHORTCUT BANNER ─── */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0 shadow-xs">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-foreground block">
              New to Akuche? Take the interactive tour
            </span>
            <span className="text-[11px] text-muted-foreground">
              Learn how to ask, train your mind, and turn decisions into action.
            </span>
          </div>
        </div>
        <Link
          href="/dashboard/guide"
          className="inline-flex items-center gap-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-2 font-bold text-xs shrink-0 shadow-xs transition active:scale-95"
        >
          <span>Open Guide</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ─── SECTION 3.B: PRIMARY ACTION: ASK AKUCHE ─── */}
      <section
        aria-labelledby="ask-akuche-heading"
        className="rounded-3xl border-2 border-primary/40 bg-card p-5 sm:p-7 shadow-sm space-y-4"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" />
            <span>Primary Coaching Partner</span>
          </div>
          <h2
            id="ask-akuche-heading"
            className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight"
          >
            ASK AKUCHE
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Tell Akuche what you are trying to understand, decide or improve. We will break it down into options and a concrete next move.
          </p>
        </div>

        <form onSubmit={handleStartTalk} className="space-y-3 pt-1">
          {/* Large, comfortable multi-line input box */}
          <div className="relative rounded-2xl border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
            <textarea
              ref={textareaRef}
              rows={3}
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              placeholder="What is on your mind? Tell Akuche what you are trying to understand, decide or improve."
              className="w-full resize-none bg-transparent p-3.5 sm:p-4 pr-12 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed min-h-[84px]"
            />

            {speechSupported && (
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`absolute right-3 bottom-3 p-2 rounded-xl transition ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                title="Voice Dictation"
                aria-label="Voice Dictation"
              >
                <Mic className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick starter prompt chips */}
          <div className="space-y-1.5 pt-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Or tap a popular challenge:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => router.push(`/dashboard/ask?prompt=${encodeURIComponent(chip.prompt)}`)}
                  className="rounded-full border border-border/80 bg-background hover:border-primary/40 hover:bg-primary/5 px-3 py-1 text-[11px] font-semibold text-foreground/80 hover:text-foreground transition active:scale-95 touch-manipulation"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.99] min-h-[48px]"
          >
            <span>TALK TO AKUCHE</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>

      {/* ─── SECTION 3.C: DAILY CLARITY (ONE PERSONALIZED ACTIVITY) ─── */}
      {!dailyClarityDismissed && (
        <section
          aria-labelledby="daily-clarity-heading"
          className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-primary">
                <Zap className="h-3.5 w-3.5" />
              </span>
              <h2
                id="daily-clarity-heading"
                className="text-xs font-black uppercase tracking-wider text-primary"
              >
                DAILY CLARITY
              </h2>
            </div>
            <button
              onClick={() => setDailyClarityDismissed(true)}
              className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
            >
              Skip for today
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-heading">
              Today&apos;s High-Leverage Decision
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              &ldquo;What single action or choice today will make the rest of your week materially easier or clearer?&rdquo;
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={() =>
                router.push(
                  "/dashboard/ask?prompt=" +
                    encodeURIComponent(
                      "Help me identify my single highest-leverage decision today. Ask me 2 clarifying questions to find out what will move the needle most."
                    )
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 text-xs font-bold transition active:scale-95"
            >
              <span>Reflect on Today&apos;s Focus →</span>
            </button>
          </div>
        </section>
      )}

      {/* ─── SECTION 3.D: CONTINUE WHERE YOU STOPPED ─── */}
      {continueItem && (
        <section
          aria-labelledby="continue-heading"
          className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="h-3.5 w-3.5" />
              </span>
              <h2
                id="continue-heading"
                className="text-xs font-black uppercase tracking-wider text-muted-foreground"
              >
                CONTINUE WHERE YOU STOPPED
              </h2>
            </div>
            <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
              {continueItem.badge}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-heading">
              {continueItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {continueItem.description}
            </p>
          </div>

          <div className="pt-1">
            <Link
              href={continueItem.href}
              className="inline-flex items-center gap-2 rounded-xl bg-background border border-border hover:border-primary px-4 py-2 text-xs font-bold text-foreground transition active:scale-95 shadow-xs"
            >
              <span>{continueItem.cta}</span>
            </Link>
          </div>
        </section>
      )}

      {/* ─── SECTION 3.E: PROGRESS SUMMARY ─── */}
      <section
        aria-labelledby="progress-summary-heading"
        className="rounded-3xl border border-border/70 bg-muted/20 p-5 sm:p-6 space-y-3.5"
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <h2
              id="progress-summary-heading"
              className="text-xs font-black uppercase tracking-wider text-muted-foreground"
            >
              YOUR PROGRESS
            </h2>
          </div>
          <Link
            href="/dashboard/progress"
            className="text-xs font-bold text-primary hover:underline"
          >
            Full Report →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-card border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Focus Streak</span>
            <div className="text-lg font-black text-foreground">
              {streakData.currentStreak} <span className="text-xs font-normal text-muted-foreground">days</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-card border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Completed Actions</span>
            <div className="text-lg font-black text-foreground">
              {streakData.totalActionsCompleted} <span className="text-xs font-normal text-muted-foreground">logged</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-card border border-border/60 space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Active Goal Target</span>
            <div className="text-lg font-black text-primary">
              {activeGoal ? `${activeGoal.currentProgress}/${activeGoal.target}` : "1 Active"}
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUICK MENTAL TRAINING SHORTCUT ─── */}
      <section className="rounded-3xl border border-border/70 bg-card p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Mental Fitness
            </span>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Cognitive Warm-up Drills
            </h3>
            <p className="text-xs text-muted-foreground">
              Quick 2-minute memory and logic reflexes to train your thinking before key decisions.
            </p>
          </div>
          <Link
            href="/dashboard/daily-challenge"
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 px-3.5 py-2 text-xs font-bold transition shrink-0 active:scale-95"
          >
            <span>Train</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
