"use client";

import { useState } from "react";
import { Share2, Check, Copy, Users, Sparkles, Flame } from "lucide-react";

export function DashboardShareBanner() {
  const [copied, setCopied] = useState(false);

  const inviteText = `I'm training my brain on BrainGym! 🧠🔥 Daily 2-phase workouts, real-life challenges, and mental performance. Join me here: https://braingym-live.vercel.app/`;

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Join me on BrainGym",
          text: inviteText,
          url: "https://braingym-live.vercel.app/",
        });
        return;
      } catch {
        // fallback to copy
      }
    }
    handleCopy();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-card to-violet-600/10 p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-md shadow-primary/25">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-black text-foreground">
            Share BrainGym with Friends
          </h3>
          <p className="text-xs text-muted-foreground">
            Invite friends, classmates, or colleagues to train together and compare streaks.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <button
          onClick={handleNativeShare}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary hover:bg-primary/90 text-white px-4 py-2.5 text-xs font-black shadow-md shadow-primary/20 transition active:scale-95 min-h-[42px]"
        >
          <Share2 className="h-4 w-4" />
          <span>Share with Friends</span>
        </button>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-2xl border border-border bg-background hover:bg-accent p-2.5 text-foreground transition active:scale-95 min-h-[42px] min-w-[42px]"
          title="Copy invite link"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
        </button>
      </div>
    </div>
  );
}
