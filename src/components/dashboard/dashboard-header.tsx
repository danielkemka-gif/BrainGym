"use client";

import { useState } from "react";
import { Share2, Check, Sparkles, Calendar, Users } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "Thinker" }: DashboardHeaderProps) {
  const [copied, setCopied] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = userName ? userName.split(" ")[0] : "Thinker";

  const todayDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const handleShareApp = async () => {
    const text = `Hey! I'm training my brain for real-life performance with BrainGym 🧠⚡.\n\nTry today's workout and test your mind with me: https://braingym-live.vercel.app/`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "BrainGym — Train Your Brain for Real Life",
          text,
          url: "https://braingym-live.vercel.app/",
        });
        return;
      } catch {
        // fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
          Ready to sharpen your mind for real life today?
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{todayDate}</span>
        </span>

        {/* ALWAYS-VISIBLE SHARE BUTTON */}
        <button
          onClick={handleShareApp}
          title="Share BrainGym with friends"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-violet-600 text-white px-3.5 py-1.5 text-xs font-black shadow-md shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[36px]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-300" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>Share App</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
