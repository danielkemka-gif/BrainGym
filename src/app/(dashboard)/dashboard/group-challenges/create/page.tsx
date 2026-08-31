"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Users,
  Copy,
  Check,
  Share2,
  Trophy,
  Calendar,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import {
  createGroupChallenge,
  generateWhatsAppInviteUrl,
  generateInviteLink,
  ChallengeType,
  ChallengeAudience,
  ChallengeCategory,
  GroupChallenge,
} from "@/lib/group-challenges";
import { useAuth } from "@/lib/auth";
import { Confetti } from "@/components/ui/confetti";

const CHALLENGE_TYPES: { type: ChallengeType; emoji: string; desc: string }[] = [
  { type: "Daily Brain Workout", emoji: "🧠", desc: "Balanced daily training across memory, focus & reasoning." },
  { type: "Brain Momentum Challenge", emoji: "🚀", desc: "Build unbroken cognitive streaks and personal baselines." },
  { type: "Focus Challenge", emoji: "🎯", desc: "Deep work stamina, auditory gating & digital impulse control." },
  { type: "Memory Challenge", emoji: "📚", desc: "Active recall, Feynman technique & rapid retention." },
  { type: "Mental Agility Challenge", emoji: "⚡", desc: "Executive decision speed, composure & conflict de-escalation." },
  { type: "Productivity Challenge", emoji: "⏱️", desc: "Overcoming procrastination & high-output focus." },
];

const DURATION_OPTIONS = [
  { days: 3, label: "3 Days (Sprint)" },
  { days: 7, label: "7 Days (1 Week)" },
  { days: 14, label: "14 Days (2 Weeks)" },
  { days: 21, label: "21 Days (Habit Builder)" },
  { days: 30, label: "30 Days (Mastery Challenge)" },
];

const AUDIENCE_OPTIONS: { audience: ChallengeAudience; isPrivate: boolean; desc: string }[] = [
  { audience: "Anyone with the link", isPrivate: false, desc: "Public — anyone with your invite link can join directly." },
  { audience: "Invite by code", isPrivate: true, desc: "Private — participants must enter a unique challenge code." },
  { audience: "My community/group", isPrivate: false, desc: "Community — tailored for WhatsApp groups & fellowships." },
  { audience: "Organization members", isPrivate: true, desc: "Corporate / School — structured with team leaderboards." },
];

export default function CreateChallengePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Multi-Step State: 1 | 2 | 3 | 4 | 5 (Success/Share)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState<ChallengeType>("Brain Momentum Challenge");
  const [category, setCategory] = useState<ChallengeCategory>("For Entrepreneurs");
  const [durationDays, setDurationDays] = useState(30);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [audience, setAudience] = useState<ChallengeAudience>("Anyone with the link");
  const [isPrivate, setIsPrivate] = useState(false);
  const [enableTeams, setEnableTeams] = useState(false);
  const [teamNamesText, setTeamNamesText] = useState("Sales, Marketing, Engineering, Operations");

  // Created Challenge Result
  const [createdChallenge, setCreatedChallenge] = useState<GroupChallenge | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleFinishCreation = async () => {
    const hostName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Challenge Host";
    const teamNames = enableTeams ? teamNamesText.split(",").map((t) => t.trim()).filter(Boolean) : [];

    const newChallenge = await createGroupChallenge(
      {
        title: title || `${durationDays}-Day Mental Fitness Challenge`,
        description: description || `Join us for a ${durationDays}-day brain training journey to build focus, memory, and consistency.`,
        type: selectedType,
        category,
        targetRole: "All Challengers",
        durationDays,
        startDate,
        audience,
        isPrivate,
        coverEmoji: CHALLENGE_TYPES.find((t) => t.type === selectedType)?.emoji || "🚀",
        hasTeams: enableTeams,
        teamNames,
      },
      {
        id: user?.id || "current-user",
        name: hostName,
        avatar: "👑",
        roleTitle: "Challenge Creator",
      }
    );

    setCreatedChallenge(newChallenge);
    setStep(5);
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-3 sm:px-4 py-4 pb-24 overflow-x-hidden touch-manipulation">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <Link
          href="/dashboard/group-challenges"
          className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Cancel &amp; Return</span>
        </Link>

        <span className="text-xs font-black uppercase text-primary">
          Step {step} of 4
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              step >= s ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 1: NAME YOUR CHALLENGE                                            */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-6 sm:p-8 space-y-5 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              STEP 1 OF 4
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Name Your Challenge
            </h2>
            <p className="text-xs text-muted-foreground">
              Give your challenge an inspiring name that motivates your participants.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Challenge Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 30-Day Mental Fitness & Focus Challenge"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Description &amp; Purpose (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="e.g. For our tech community to build laser-sharp focus and eliminate distractions during our Q3 sprint."
                className="w-full rounded-2xl border border-border bg-background p-4 text-xs sm:text-sm font-medium text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!title.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition min-h-[48px]"
          >
            <span>NEXT: CHOOSE CHALLENGE TYPE ➔</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 2: CHOOSE CHALLENGE TYPE                                          */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-6 sm:p-8 space-y-5 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              STEP 2 OF 4
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Choose Challenge Type
            </h2>
            <p className="text-xs text-muted-foreground">
              Select the primary cognitive focus for your group.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHALLENGE_TYPES.map((t) => (
              <button
                key={t.type}
                onClick={() => setSelectedType(t.type)}
                className={`text-left rounded-2xl border p-4 transition space-y-1 ${
                  selectedType === t.type
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.emoji}</span>
                  <h4 className="text-xs sm:text-sm font-black text-foreground">{t.type}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="rounded-2xl border border-border bg-background px-4 py-3 text-xs font-bold text-foreground"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[48px]"
            >
              <span>NEXT: SET DURATION ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 3: SET DURATION & TEAMS                                           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-6 sm:p-8 space-y-5 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              STEP 3 OF 4
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Set Duration &amp; Structure
            </h2>
            <p className="text-xs text-muted-foreground">
              Choose how many days this challenge will run.
            </p>
          </div>

          {/* Duration Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Duration</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d.days}
                  onClick={() => setDurationDays(d.days)}
                  className={`rounded-2xl border p-3 text-xs font-bold transition text-center ${
                    durationDays === d.days
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Teams Toggle */}
          <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-foreground">
                  Enable Teams / Departments
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Allow participants to compete in groups (e.g. Sales, Marketing, Grade 12).
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableTeams}
                onChange={(e) => setEnableTeams(e.target.checked)}
                className="h-5 w-5 rounded accent-primary cursor-pointer"
              />
            </div>

            {enableTeams && (
              <div className="space-y-1 pt-2 animate-in fade-in">
                <label className="text-[11px] font-bold text-muted-foreground">
                  Team Names (comma separated)
                </label>
                <input
                  type="text"
                  value={teamNamesText}
                  onChange={(e) => setTeamNamesText(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="rounded-2xl border border-border bg-background px-4 py-3 text-xs font-bold text-foreground"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[48px]"
            >
              <span>NEXT: AUDIENCE &amp; ACCESS ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 4: AUDIENCE & ACCESS                                              */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-6 sm:p-8 space-y-5 shadow-xl animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              STEP 4 OF 4
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Who Can Join?
            </h2>
            <p className="text-xs text-muted-foreground">
              Control access and privacy for your participants.
            </p>
          </div>

          <div className="space-y-2.5">
            {AUDIENCE_OPTIONS.map((opt) => (
              <button
                key={opt.audience}
                onClick={() => {
                  setAudience(opt.audience);
                  setIsPrivate(opt.isPrivate);
                }}
                className={`w-full text-left rounded-2xl border p-4 transition space-y-1 ${
                  audience === opt.audience
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-foreground">{opt.audience}</h4>
                  {opt.isPrivate && (
                    <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      Private Code
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(3)}
              className="rounded-2xl border border-border bg-background px-4 py-3 text-xs font-bold text-foreground"
            >
              Back
            </button>
            <button
              onClick={handleFinishCreation}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[48px]"
            >
              <Sparkles className="h-4 w-4 fill-white" />
              <span>CREATE CHALLENGE &amp; GET SHARE LINK ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 5: SUCCESS & WHATSAPP INSTANT SHARE                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {step === 5 && createdChallenge && (
        <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10 p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <Confetti active={true} />

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30">
            <Trophy className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              CHALLENGE CREATED SUCCESSFULLY!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {createdChallenge.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Your challenge is ready. Share the invite link with your WhatsApp group or team now!
            </p>
          </div>

          {/* Unique Code Box */}
          <div className="rounded-2xl border border-border bg-background p-4 space-y-1 max-w-sm mx-auto shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              CHALLENGE INVITE CODE
            </span>
            <div className="text-2xl font-mono font-black text-primary tracking-widest">
              {createdChallenge.code}
            </div>
          </div>

          {/* Instant WhatsApp Share CTA */}
          <div className="space-y-3 max-w-md mx-auto pt-2">
            <a
              href={generateWhatsAppInviteUrl(createdChallenge)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white py-4 px-6 text-sm font-black shadow-xl shadow-emerald-600/30 transition active:scale-95 min-h-[52px]"
            >
              <MessageCircle className="h-5 w-5" />
              <span>SHARE TO WHATSAPP ➔</span>
            </a>

            <button
              onClick={() => handleCopy(generateInviteLink(createdChallenge))}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card hover:bg-muted py-3 px-4 text-xs font-bold text-foreground transition active:scale-95 min-h-[44px]"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              <span>{copiedLink ? "Invite Link Copied!" : "Copy Invite Link"}</span>
            </button>

            <Link
              href={`/dashboard/group-challenges/${createdChallenge.id}`}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-4 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[44px]"
            >
              <span>Go to Challenge Dashboard ➔</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
