"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Award,
  Download,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Crown,
  MessageCircle,
} from "lucide-react";
import {
  fetchGroupChallengeById,
  fetchChallengeLeaderboard,
  GroupChallenge,
  ChallengeParticipant,
} from "@/lib/group-challenges";
import { useAuth } from "@/lib/auth";

export default function ChallengeCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user } = useAuth();

  const [challenge, setChallenge] = useState<GroupChallenge | null>(null);
  const [participant, setParticipant] = useState<ChallengeParticipant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupChallengeById(resolvedParams.id).then(async (ch) => {
      if (ch) {
        setChallenge(ch);
        const lb = await fetchChallengeLeaderboard(ch.id);
        setParticipant(lb.userParticipant);
      }
      setLoading(false);
    });
  }, [resolvedParams.id]);

  const participantName =
    participant?.userName || user?.user_metadata?.name || user?.email?.split("@")[0] || "BrainGym Challenger";

  const completionDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const certificateUrl = `https://braingym-live.vercel.app/dashboard/group-challenges/${resolvedParams.id}/certificate`;
  const shareText = `I proudly completed the ${challenge?.title || "BrainGym Challenge"} on BrainGym with ${participant?.completionPercentage || 96}% participation! 🧠🏆\n\nTrain your brain with me here: ${certificateUrl}`;

  if (loading || !challenge) {
    return (
      <div className="mx-auto w-full max-w-2xl p-8 text-center space-y-4 animate-pulse">
        <div className="h-64 bg-muted rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-3 sm:px-4 py-6 pb-24 touch-manipulation animate-in fade-in">
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/group-challenges/${challenge.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Challenge</span>
        </Link>

        <span className="text-xs font-black uppercase text-amber-500 flex items-center gap-1">
          <Award className="h-4 w-4" />
          <span>Official Verified Certificate</span>
        </span>
      </div>

      {/* ─── DIGITAL CERTIFICATE CANVAS CARD ─────────────────────────────────── */}
      <div className="relative rounded-3xl border-4 border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-card to-amber-600/10 p-8 sm:p-12 text-center space-y-6 shadow-2xl overflow-hidden">
        {/* Certificate Decorative Watermark Border */}
        <div className="absolute inset-2 border-2 border-dashed border-amber-500/30 rounded-2xl pointer-events-none" />

        {/* Crown Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xl shadow-amber-500/30">
          <Award className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
            BRAINGYM COGNITIVE FITNESS PLATFORM
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-foreground tracking-tight">
            Certificate of Completion
          </h1>
          <p className="text-xs text-muted-foreground">
            Official Verification Code: BG-CERT-{challenge.code}-{Date.now().toString().slice(-4)}
          </p>
        </div>

        {/* Recipient */}
        <div className="space-y-2 py-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
            THIS CERTIFIES THAT
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-primary underline decoration-primary/30 underline-offset-8">
            {participantName}
          </h2>
        </div>

        {/* Challenge Achievement Text */}
        <div className="space-y-1 max-w-lg mx-auto text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
          <p>
            has successfully completed the structured <strong>{challenge.durationDays}-Day</strong> cognitive training curriculum in
          </p>
          <p className="text-base font-black text-foreground">
            &ldquo;{challenge.title}&rdquo;
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-black pt-1">
            with {participant?.completionPercentage || 96}% verified participation &amp; unbroken mental momentum.
          </p>
        </div>

        {/* Signatures & Verification Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-amber-500/30 text-xs">
          <div className="text-left space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">
              CHALLENGE HOST
            </span>
            <span className="font-black text-foreground">{challenge.hostName}</span>
            <span className="text-[9px] text-muted-foreground block">{challenge.hostRoleTitle || "Lead"}</span>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">
              DATE AWARDED
            </span>
            <span className="font-black text-foreground">{completionDate}</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block flex items-center justify-end gap-1">
              <CheckCircle2 className="h-3 w-3 inline" /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* ─── ACTION BUTTONS (WHATSAPP SHARE / DOWNLOAD) ────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-6 text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 transition active:scale-95 min-h-[48px]"
        >
          <MessageCircle className="h-4 w-4" />
          <span>SHARE TO WHATSAPP ➔</span>
        </a>

        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card hover:bg-muted py-3.5 px-6 text-xs sm:text-sm font-bold text-foreground transition active:scale-95 min-h-[48px]"
        >
          <Download className="h-4 w-4" />
          <span>Save / Print Certificate</span>
        </button>
      </div>
    </div>
  );
}
