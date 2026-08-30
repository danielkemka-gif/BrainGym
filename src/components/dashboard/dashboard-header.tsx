"use client";

import { useState } from "react";
import {
  Share2,
  Check,
  Calendar,
  Copy,
  X,
  MessageCircle,
  Send,
  Globe,
  Sparkles,
} from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "Thinker" }: DashboardHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = userName ? userName.split(" ")[0] : "Thinker";

  const todayDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const shareUrl = "https://braingym-live.vercel.app/";
  const shareText = `Hey! I'm training my brain for real-life performance with BrainGym 🧠⚡. Try today's 2-phase workout and test your mind with me: ${shareUrl}`;

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
          title: "BrainGym — Train Your Brain for Real Life",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // user dismissed or fallback to modal
      }
    }
    setShowShareModal(true);
  };

  return (
    <>
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
            onClick={handleNativeShare}
            title="Share BrainGym with friends"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-violet-600 text-white px-3.5 py-1.5 text-xs font-black shadow-md shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[36px]"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share App</span>
          </button>
        </div>
      </div>

      {/* ─── INTERACTIVE SHARE MODAL ─────────────────────────────────────────── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl border-2 border-primary/40 bg-card p-6 shadow-2xl space-y-4 relative text-center">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-md shadow-primary/25">
              <Share2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">
                Share BrainGym
              </h3>
              <p className="text-xs text-muted-foreground">
                Invite your friends, colleagues, and family to train their brains together.
              </p>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-bold">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white p-3 shadow-sm transition active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white p-3 shadow-sm transition active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>Telegram</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 text-white p-3 shadow-sm transition active:scale-95"
              >
                <Globe className="h-4 w-4" />
                <span>Twitter / X</span>
              </a>

              {/* Copy Link */}
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background hover:bg-muted p-3 text-foreground shadow-sm transition active:scale-95"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
