"use client";

import React, { useState } from "react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Share2,
  Flame,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  Check,
  TrendingUp,
  Download,
} from "lucide-react";

interface ShareProgressCardProps {
  currentStreak?: number;
  totalActions?: number;
}

export function ShareProgressCard({
  currentStreak = 1,
  totalActions = 1,
}: ShareProgressCardProps) {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"whatsapp_status" | "facebook" | "linkedin" | "instagram_tiktok">("whatsapp_status");

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://akuche.app";
  };

  const getStatusText = () => {
    return `🔥 Just logged my daily clarity session on Akuche (${currentStreak}-day Action Streak)! \n\nThink Better · Decide Better · Live Better.\nJoin me here: ${getShareUrl()}`;
  };

  const getLinkedInText = () => {
    return `Making decisions and executing with clarity.\n\nI've been using Akuche to structure my daily thinking, reverse-engineer my business goals, and build consistent daily action. Currently on a ${currentStreak}-day Action Streak with ${totalActions} completed milestones.\n\nCheck it out here: ${getShareUrl()} #Akuche #Mindset #DecisionMaking #Productivity #PersonalGrowth`;
  };

  const getFacebookText = () => {
    return `Loving my daily thinking and decision sessions on Akuche! Think Better, Decide Better, Live Better. Join here: ${getShareUrl()}`;
  };

  const getInstagramTikTokCaption = () => {
    return `Building daily momentum with Akuche 🧠✨\nStreak: ${currentStreak} Days 🔥\nThink Better · Decide Better · Live Better.\nLink in bio: ${getShareUrl()}\n\n#Akuche #ThinkBetter #DecideBetter #DailyGrowth #Focus #Discipline #Mindset`;
  };

  const handleCopyCaption = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    }
  };

  const handleNativeShare = async (text: string) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "My Akuche Progress",
          text: text,
          url: getShareUrl(),
        });
        return;
      } catch {
        // Fallback
      }
    }
    handleCopyCaption(text);
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(getStatusText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}&quote=${encodeURIComponent(getFacebookText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getStatusText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-card to-card p-5 sm:p-6 shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
            <Flame className="h-6 w-6 fill-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-foreground tracking-tight">
                Share Your Akuche Experience
              </h3>
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300">
                {currentStreak}d Streak
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inspire your network by sharing your streak and daily thinking progress to your status and posts.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleNativeShare(getStatusText())}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs sm:text-sm font-black shadow-md shadow-emerald-900/20 transition active:scale-95 touch-manipulation shrink-0"
        >
          <Share2 className="h-4 w-4" />
          <span>Share Progress</span>
        </button>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/60 pb-2 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setSelectedFormat("whatsapp_status")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            selectedFormat === "whatsapp_status"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>WhatsApp Status</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedFormat("facebook")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            selectedFormat === "facebook"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Facebook className="h-3.5 w-3.5" />
          <span>Facebook Post / Status</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedFormat("linkedin")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            selectedFormat === "linkedin"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Linkedin className="h-3.5 w-3.5" />
          <span>LinkedIn</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedFormat("instagram_tiktok")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            selectedFormat === "instagram_tiktok"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Instagram className="h-3.5 w-3.5" />
          <span>Instagram / TikTok</span>
        </button>
      </div>

      {/* Preview & 1-Tap Share Buttons */}
      {selectedFormat === "whatsapp_status" && (
        <div className="rounded-2xl border border-border/80 bg-background/80 p-3.5 space-y-3">
          <div className="text-xs text-foreground/90 leading-relaxed font-mono whitespace-pre-line bg-card p-3 rounded-xl border border-border/60">
            {getStatusText()}
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={shareToWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs active:scale-95 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Share to WhatsApp Status</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopyCaption(getStatusText())}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition active:scale-95"
            >
              {copiedCaption ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCaption ? "Copied! ✓" : "Copy Status"}</span>
            </button>
          </div>
        </div>
      )}

      {selectedFormat === "facebook" && (
        <div className="rounded-2xl border border-border/80 bg-background/80 p-3.5 space-y-3">
          <div className="text-xs text-foreground/90 leading-relaxed font-mono whitespace-pre-line bg-card p-3 rounded-xl border border-border/60">
            {getFacebookText()}
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={shareToFacebook}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold shadow-xs active:scale-95 transition"
            >
              <Facebook className="h-4 w-4" />
              <span>Post to Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopyCaption(getFacebookText())}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition active:scale-95"
            >
              {copiedCaption ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCaption ? "Copied! ✓" : "Copy Post"}</span>
            </button>
          </div>
        </div>
      )}

      {selectedFormat === "linkedin" && (
        <div className="rounded-2xl border border-border/80 bg-background/80 p-3.5 space-y-3">
          <div className="text-xs text-foreground/90 leading-relaxed font-mono whitespace-pre-line bg-card p-3 rounded-xl border border-border/60">
            {getLinkedInText()}
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={shareToLinkedIn}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 text-xs font-bold shadow-xs active:scale-95 transition"
            >
              <Linkedin className="h-4 w-4" />
              <span>Share on LinkedIn</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopyCaption(getLinkedInText())}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition active:scale-95"
            >
              {copiedCaption ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCaption ? "Copied! ✓" : "Copy Article Text"}</span>
            </button>
          </div>
        </div>
      )}

      {selectedFormat === "instagram_tiktok" && (
        <div className="rounded-2xl border border-border/80 bg-background/80 p-3.5 space-y-3">
          <div className="text-xs text-foreground/90 leading-relaxed font-mono whitespace-pre-line bg-card p-3 rounded-xl border border-border/60">
            {getInstagramTikTokCaption()}
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleCopyCaption(getInstagramTikTokCaption())}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-xs font-bold shadow-xs active:scale-95 transition"
            >
              {copiedCaption ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCaption ? "Caption Copied! ✓" : "Copy Caption for Story/Video"}</span>
            </button>
            <a
              href="/akuche-logo.png"
              download="akuche-badge.png"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition active:scale-95"
            >
              <Download className="h-3.5 w-3.5 text-emerald-500" />
              <span>Download Badge Image</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
