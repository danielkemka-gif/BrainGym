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
  Briefcase,
  Award,
  Heart,
  TrendingUp,
  Mic,
  Compass,
  CheckCircle2,
  Clock,
  Zap,
  Eye,
  Scale,
} from "lucide-react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";

const STARTER_PROMPTS = [
  {
    category: "Business",
    label: "💼 Declining Sales",
    prompt: "My business sales have reduced significantly. Help me understand what is happening and diagnose the real bottleneck.",
  },
  {
    category: "Career",
    label: "📈 Career Stagnation",
    prompt: "I have worked in the same organisation for six years without a promotion. Help me evaluate what is holding me back.",
  },
  {
    category: "Potential",
    label: "🎯 Graduate Direction",
    prompt: "I just graduated and feel confused about my career direction. Help me explore my strengths and build a 90-day plan.",
  },
  {
    category: "Life",
    label: "⚖️ Difficult Decision",
    prompt: "I am facing a major life decision with competing priorities. Help me examine the trade-offs and consequences calmly.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [askInput, setAskInput] = useState("");
  const [lastSession, setLastSessionState] = useState<AkucheLastSession | null>(null);
  const [streakData, setStreakData] = useState({ currentStreak: 1, bestStreak: 1, totalActionsCompleted: 0 });
  const [commitments, setCommitments] = useState<AkucheCommitment[]>([]);
  const [activeGoal, setActiveGoal] = useState<BrainGoal | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLastSessionState(getLastSession());
    setStreakData(calculateActionStreak());
    setCommitments(getCommitments().filter((c) => c.status === "pending"));

    getActiveGoal().then((g) => {
      if (g) setActiveGoal(g);
    });

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
        href: lastSession.route || "/dashboard/ask",
        badge: "Previous Session",
      };
    }
    return null;
  };

  const continueItem = getContinueItem();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 overflow-x-hidden px-3 sm:px-6 py-4 pb-28 text-foreground font-sans">
      {/* ─── SECTION 1: HEADER & OFFICIAL BRAND IDENTITY ─── */}
      <header className="flex items-center justify-between pt-1 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AkucheBrandLogo variant="mark" size="xs" />
            <span className="text-xs font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
              AKUCHE
            </span>
            <span className="text-muted-foreground/60 text-xs">·</span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              Personal Clarity Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
            {firstName ? `Welcome to Akuche, ${firstName}.` : "Welcome to Akuche."}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Understand Better. Move Forward.
          </p>
        </div>

        <Link
          href="/dashboard/profile"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-foreground font-bold hover:border-emerald-500/50 transition text-xs shadow-xs"
          title="My Profile & Personal Context"
          aria-label="My Profile"
        >
          {firstName ? firstName.charAt(0).toUpperCase() : "A"}
        </Link>
      </header>

      {/* ─── SECTION 2: CONVERSATIONAL CLARITY HERO INPUT ─── */}
      <section
        aria-labelledby="clarity-input-heading"
        className="rounded-3xl border-2 border-emerald-600/30 bg-card p-5 sm:p-7 shadow-sm space-y-4"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            <Sparkles className="h-3 w-3" />
            <span>Personal Clarity Partner</span>
          </div>
          <h2
            id="clarity-input-heading"
            className="text-lg sm:text-xl font-black text-foreground font-heading tracking-tight"
          >
            What would you like to understand better today?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Bring a challenge, a question, an idea or a situation. Let&apos;s make sense of it together.
          </p>
        </div>

        <form onSubmit={handleStartTalk} className="space-y-3 pt-1">
          <div className="relative rounded-2xl border border-border bg-background focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
            <textarea
              ref={textareaRef}
              rows={3}
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              placeholder="Tell Akuche what's on your mind..."
              className="w-full resize-none bg-transparent p-3.5 sm:p-4 pr-12 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed min-h-[92px]"
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
              Or explore a common challenge:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STARTER_PROMPTS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => router.push(`/dashboard/ask?prompt=${encodeURIComponent(chip.prompt)}`)}
                  className="rounded-full border border-border/80 bg-background hover:border-emerald-500/40 hover:bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold text-foreground/80 hover:text-foreground transition active:scale-95 touch-manipulation"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.99] min-h-[48px]"
          >
            <span>START CLARITY CONVERSATION</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>

      {/* ─── SECTION 3: FOUR ATTRACTIVE AUDIENCE ENTRY POINTS ─── */}
      <section aria-labelledby="pathways-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 id="pathways-heading" className="text-sm font-black uppercase tracking-wider text-foreground">
              Specialised Workspaces
            </h2>
            <p className="text-xs text-muted-foreground">
              Deep, domain-informed intelligence tailored to your actual circumstances.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card 1: My Business */}
          <Link
            href="/dashboard/business"
            className="group rounded-3xl border border-border bg-card p-4 sm:p-5 hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Briefcase className="h-4 w-4" />
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                  Primary Focus
                </span>
              </div>
              <h3 className="text-base font-black text-foreground group-hover:text-emerald-600 transition">
                My Business
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Understand business challenges, customer churn, sales bottlenecks, pricing and realistic growth opportunities.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              <span>Open Business Workspace</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 2: My Career */}
          <Link
            href="/dashboard/career"
            className="group rounded-3xl border border-border bg-card p-4 sm:p-5 hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Award className="h-4 w-4" />
                </span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700 dark:text-blue-300">
                  Professionals
                </span>
              </div>
              <h3 className="text-base font-black text-foreground group-hover:text-emerald-600 transition">
                My Career
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Understand professional stagnation, promotion evidence, executive visibility, workplace dynamics and salary negotiation.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              <span>Open Career Workspace</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 3: My Potential */}
          <Link
            href="/dashboard/potential"
            className="group rounded-3xl border border-border bg-card p-4 sm:p-5 hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[9px] font-black uppercase text-purple-700 dark:text-purple-300">
                  Youth &amp; Graduates
                </span>
              </div>
              <h3 className="text-base font-black text-foreground group-hover:text-emerald-600 transition">
                My Potential
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Explore your natural strengths, career directions, 90-day graduate roadmap and high-retention study strategies.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              <span>Open Potential Workspace</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 4: My Life */}
          <Link
            href="/dashboard/life"
            className="group rounded-3xl border border-border bg-card p-4 sm:p-5 hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Heart className="h-4 w-4" />
                </span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase text-amber-700 dark:text-amber-300">
                  Everyday Life
                </span>
              </div>
              <h3 className="text-base font-black text-foreground group-hover:text-emerald-600 transition">
                My Life
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Understand everyday personal challenges, relationship communication, financial emergency runway and life transitions.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              <span>Open Life Workspace</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </section>

      {/* ─── SECTION 4: THE THREE-PILLAR INTELLIGENCE HIERARCHY ─── */}
      <section className="rounded-3xl border border-border/80 bg-muted/20 p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center justify-between border-b border-border/50 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
              The Three-Pillar Framework
            </h2>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            Understand → Decide → Progress
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-card border border-border/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <Eye className="h-3.5 w-3.5" />
              <span>1. CLARITY</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Understand what is actually happening. Separate visible symptoms from underlying root problems.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
              <Scale className="h-3.5 w-3.5" />
              <span>2. DECISION</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Evaluate choices, trade-offs, constraints, and long-term consequences without artificial pressure.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>3. PROGRESS</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Translate understanding into realistic next steps, track milestones, and review outcomes over time.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: CONTINUE WHERE YOU STOPPED ─── */}
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
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10">
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
              className="inline-flex items-center gap-2 rounded-xl bg-background border border-border hover:border-emerald-500 px-4 py-2 text-xs font-bold text-foreground transition active:scale-95 shadow-xs"
            >
              <span>{continueItem.cta}</span>
            </Link>
          </div>
        </section>
      )}

      {/* ─── SECTION 6: MY CLARITY & MY PROGRESS PREVIEW ─── */}
      <section className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span>Personal Clarity &amp; Progress Hub</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Review your verified insights, active commitments, and cognitive fitness.
            </p>
          </div>
          <Link
            href="/dashboard/clarity"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
          >
            My Clarity →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Focus Streak</span>
            <div className="text-lg font-black text-foreground">
              {streakData.currentStreak} <span className="text-xs font-normal text-muted-foreground">days</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Logged Actions</span>
            <div className="text-lg font-black text-foreground">
              {streakData.totalActionsCompleted} <span className="text-xs font-normal text-muted-foreground">done</span>
            </div>
          </div>

          <Link
            href="/dashboard/explore"
            className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5 col-span-2 sm:col-span-1 hover:bg-emerald-500/15 transition block"
          >
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold uppercase">Explore Drills</span>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <span>Thinking Gym</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
