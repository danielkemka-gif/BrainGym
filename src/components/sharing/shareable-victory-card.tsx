"use client";

import { useState } from "react";
import { Share2, Copy, Check, Download, Sparkles, Flame, Brain, TrendingUp } from "lucide-react";

interface ShareableVictoryCardProps {
  userName?: string;
  activityTitle: string;
  score: number;
  streakDays: number;
  momentumScore: number;
  onClose?: () => void;
}

export function ShareableVictoryCard({
  userName = "Thinker",
  activityTitle,
  score,
  streakDays,
  momentumScore,
  onClose,
}: ShareableVictoryCardProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I trained my brain today on BrainGym! 🧠🔥\n\n• Challenge: ${activityTitle}\n• Score: ${score}%\n• Active Streak: ${streakDays} Days\n• Brain Momentum: ${momentumScore}/100\n\nCan you beat my score? Try BrainGym: https://braingym-live.vercel.app/`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "My BrainGym Victory",
          text: shareText,
          url: "https://braingym-live.vercel.app/",
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-600/10 p-6 sm:p-7 shadow-2xl space-y-5 text-center">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          Branded Victory Card
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        )}
      </div>

      {/* ─── THE CARD CANVAS PREVIEW ───────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/60 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white text-left space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-black text-sm">
              🧠
            </div>
            <span className="font-black text-sm tracking-wider text-white">
              BRAINGYM™
            </span>
          </div>
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
            #BrainGym
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider block">
            I Trained My Brain Today
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {activityTitle}
          </h3>
          <p className="text-xs text-white/70 font-medium">Athlete: {userName}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-sm border border-white/10">
            <span className="text-[9px] text-white/60 font-bold uppercase block">Score</span>
            <span className="text-lg font-black text-white">{score}%</span>
          </div>
          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-sm border border-white/10">
            <span className="text-[9px] text-white/60 font-bold uppercase block">Streak</span>
            <span className="text-lg font-black text-orange-400 flex items-center justify-center gap-0.5">
              <Flame className="h-4 w-4 fill-current" />
              {streakDays}d
            </span>
          </div>
          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-sm border border-white/10">
            <span className="text-[9px] text-white/60 font-bold uppercase block">Momentum</span>
            <span className="text-lg font-black text-violet-400">{momentumScore}/100</span>
          </div>
        </div>

        <div className="pt-2 text-center border-t border-white/10">
          <p className="text-xs font-bold text-white/90">
            &ldquo;Can you beat my score?&rdquo;
          </p>
        </div>
      </div>

      {/* Share Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
        <button
          onClick={handleNativeShare}
          className="w-full flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 px-5 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[48px]"
        >
          <Share2 className="h-4 w-4" />
          <span>SHARE MY PROGRESS</span>
        </button>

        <button
          onClick={handleCopy}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-xs font-bold text-foreground hover:bg-accent active:scale-95 transition min-h-[48px]"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? "COPIED TO CLIPBOARD!" : "COPY CHALLENGE"}</span>
        </button>
      </div>
    </div>
  );
}
