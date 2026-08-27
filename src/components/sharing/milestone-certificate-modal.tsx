"use client";

import { useState } from "react";
import { Trophy, Award, Sparkles, Download, Share2, Check, X } from "lucide-react";

interface MilestoneCertificateModalProps {
  streakDays: number;
  userName?: string;
  onClose: () => void;
}

export function MilestoneCertificateModal({
  streakDays,
  userName = "Thinker",
  onClose,
}: MilestoneCertificateModalProps) {
  const [copied, setCopied] = useState(false);

  const getMilestoneInfo = (days: number) => {
    if (days >= 90) return { title: "BrainGym Elite", badge: "👑", subtitle: "90-Day Cognitive Plasticity Mastery" };
    if (days >= 60) return { title: "Mental Fitness Warrior", badge: "🛡️", subtitle: "60-Day Unstoppable Habit Momentum" };
    if (days >= 30) return { title: "BrainGym Champion", badge: "🏆", subtitle: "30-Day Neuroplastic Habit Transformation" };
    if (days >= 14) return { title: "Habit Builder", badge: "⚡", subtitle: "14-Day Consistent Cognitive Conditioning" };
    return { title: "First Commitment", badge: "🌱", subtitle: "7-Day Consistent Brain Training Foundation" };
  };

  const milestone = getMilestoneInfo(streakDays);
  const todayStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const shareText = `I just earned the official "${milestone.title}" Certificate on BrainGym for completing a ${streakDays}-day mental fitness streak! 🧠🏅 #BrainGym https://braingym-live.vercel.app/`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `BrainGym Milestone: ${milestone.title}`,
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl border-2 border-amber-500/50 bg-card p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ─── OFFICIAL CERTIFICATE CANVAS ───────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl border-4 border-amber-500/80 bg-gradient-to-br from-amber-950/20 via-background to-amber-900/30 p-6 sm:p-8 space-y-4 shadow-xl">
          {/* Certificate Header */}
          <div className="space-y-1">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/30">
              {milestone.badge}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block pt-1">
              Official Certificate of Achievement
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {milestone.title}
            </h2>
            <p className="text-xs text-muted-foreground font-semibold">
              {milestone.subtitle}
            </p>
          </div>

          {/* Recipient & Streak */}
          <div className="py-3 border-y border-amber-500/30 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Awarded To
            </span>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {userName}
            </p>
            <p className="text-xs font-black text-amber-600 dark:text-amber-400">
              For maintaining a continuous {streakDays}-Day Mental Fitness Streak
            </p>
          </div>

          {/* Footer Seal & Date */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
            <div className="text-left">
              <span className="font-bold block text-foreground">Date Awarded:</span>
              <span>{todayStr}</span>
            </div>
            <div className="flex items-center gap-1 font-black text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-xl bg-amber-500/10">
              <Award className="h-3.5 w-3.5" />
              <span>VERIFIED COGNITIVE STREAK</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleShare}
            className="w-full flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-3.5 px-5 text-xs font-black shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition min-h-[48px]"
          >
            <Share2 className="h-4 w-4" />
            <span>SHARE CERTIFICATE</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-xs font-bold hover:bg-accent transition min-h-[48px]"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Sparkles className="h-4 w-4 text-amber-500" />}
            <span>{copied ? "COPIED TO CLIPBOARD!" : "COPY BRAG TEXT"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
