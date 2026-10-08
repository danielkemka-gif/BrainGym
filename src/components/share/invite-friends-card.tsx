"use client";

import React, { useState } from "react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Linkedin,
  Facebook,
  Twitter,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

export function InviteFriendsCard() {
  const [copied, setCopied] = useState(false);

  // Dynamic site URL resolution
  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://akuche.app";
  };

  const shareTitle = "Akuche — Think Better. Decide Better. Live Better.";
  const shareMessage =
    "I've been using Akuche to think through difficult decisions, clarify my goals, and take practical daily action. Join me here: " +
    getShareUrl();

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: getShareUrl(),
        });
        return;
      } catch (err) {
        // Fallback to copy if user dismissed or unsupported
      }
    }
    handleCopyLink();
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      "Thinking through decisions and building daily action with @AkucheApp. Think Better, Decide Better, Live Better."
    )}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-card to-card p-5 sm:p-6 shadow-md space-y-4">
      {/* Glow Accent */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-foreground tracking-tight">
                Invite Friends &amp; Share Akuche
              </h3>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                Share Link
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Share the app link with your friends, colleagues, and network so they can join.
            </p>
          </div>
        </div>

        {/* 1-Tap Primary Share Button */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs sm:text-sm font-black shadow-md shadow-emerald-900/20 transition active:scale-95 touch-manipulation shrink-0"
        >
          <Share2 className="h-4 w-4" />
          <span>Share App Link</span>
        </button>
      </div>

      {/* Copy Link Input Bar */}
      <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/80 p-1.5 shadow-xs">
        <div className="flex-1 px-3 py-1 text-xs text-muted-foreground truncate font-mono">
          {typeof window !== "undefined" ? window.location.origin : "https://akuche.app"}
        </div>
        <button
          type="button"
          onClick={handleCopyLink}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
            copied
              ? "bg-emerald-600 text-white"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied! ✓" : "Copy Link"}</span>
        </button>
      </div>

      {/* Direct Social Channels */}
      <div className="pt-1">
        <span className="text-[11px] font-bold text-muted-foreground block mb-2 uppercase tracking-wider">
          Quick Share via:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={shareToWhatsApp}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 p-2.5 text-xs font-bold transition active:scale-95 touch-manipulation"
          >
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            <span>WhatsApp</span>
          </button>

          {/* Twitter / X */}
          <button
            type="button"
            onClick={shareToTwitter}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted p-2.5 text-xs font-bold text-foreground transition active:scale-95 touch-manipulation"
          >
            <Twitter className="h-4 w-4 text-sky-500" />
            <span>X / Twitter</span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={shareToFacebook}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted p-2.5 text-xs font-bold text-foreground transition active:scale-95 touch-manipulation"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            <span>Facebook</span>
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            onClick={shareToLinkedIn}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted p-2.5 text-xs font-bold text-foreground transition active:scale-95 touch-manipulation"
          >
            <Linkedin className="h-4 w-4 text-sky-700" />
            <span>LinkedIn</span>
          </button>

          {/* Telegram */}
          <button
            type="button"
            onClick={shareToTelegram}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted p-2.5 text-xs font-bold text-foreground transition active:scale-95 touch-manipulation"
          >
            <Send className="h-4 w-4 text-sky-500" />
            <span>Telegram</span>
          </button>
        </div>
      </div>
    </div>
  );
}
