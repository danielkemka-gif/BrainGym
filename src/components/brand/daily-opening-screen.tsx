"use client";

import React, { useState, useEffect, useRef } from "react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  getTodaysDailyMessage,
  markDailyOpeningCompleted,
  shouldShowDailyOpening,
  toggleFavoriteMessage,
  isMessageFavorited,
} from "@/lib/inspiration/daily-opening-engine";
import { AkucheDailyMessage } from "@/lib/inspiration/types";
import {
  playWarmWelcomeChime,
  isAudioWelcomeEnabled,
  setAudioWelcomeEnabled,
} from "@/lib/audio/welcome-chime";
import {
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Share2,
  Check,
  Zap,
  HelpCircle,
  X,
} from "lucide-react";

interface DailyOpeningScreenProps {
  forceOpen?: boolean;
  onClose?: () => void;
  displayDurationSeconds?: number; // default ~12s
}

export function DailyOpeningScreen({
  forceOpen = false,
  onClose,
  displayDurationSeconds = 12,
}: DailyOpeningScreenProps) {
  // Stages: 'logo' (Stage 1) -> 'inspiration' (Stage 2 & 3) -> 'exiting' -> closed
  const [stage, setStage] = useState<"hidden" | "logo" | "inspiration" | "exiting">("hidden");
  const [messageItem, setMessageItem] = useState<AkucheDailyMessage | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(displayDurationSeconds);

  const autoTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if daily opening should be presented today
    const needsOpening = forceOpen || shouldShowDailyOpening();
    if (!needsOpening) return;

    const item = getTodaysDailyMessage();
    setMessageItem(item);
    setIsFavorited(isMessageFavorited(item.id));
    setSoundEnabled(isAudioWelcomeEnabled());
    setSecondsRemaining(displayDurationSeconds);

    // Stage 1: Reveal logo first
    setStage("logo");

    // Play welcome chime
    playWarmWelcomeChime();

    // Transition from Logo (Stage 1) to Inspiration (Stage 2) after 1.8s
    const logoTimer = setTimeout(() => {
      setStage("inspiration");
    }, 1800);

    return () => {
      clearTimeout(logoTimer);
      if (autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [forceOpen, displayDurationSeconds]);

  // Stage 2 & 3 Timer: Run the 12-second countdown during the inspiration reading stage
  useEffect(() => {
    if (stage !== "inspiration" || !messageItem) return;

    // Countdown tick
    countdownIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-enter dashboard after exactly displayDurationSeconds
    autoTransitionTimerRef.current = setTimeout(() => {
      handleCompleteAndExit();
    }, displayDurationSeconds * 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current);
    };
  }, [stage, messageItem, displayDurationSeconds]);

  const handleCompleteAndExit = () => {
    if (messageItem) {
      markDailyOpeningCompleted(messageItem.id);
    }
    setStage("exiting");
    setTimeout(() => {
      setStage("hidden");
      if (onClose) onClose();
    }, 450);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !soundEnabled;
    setSoundEnabled(next);
    setAudioWelcomeEnabled(next);
    if (next) {
      playWarmWelcomeChime();
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!messageItem) return;
    const nextState = toggleFavoriteMessage(messageItem.id);
    setIsFavorited(nextState);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!messageItem) return;

    const shareText = `✨ AKUCHE DAILY FOCUS: ${messageItem.focusWord}\n\n"${messageItem.message}"\n\n🎯 Micro Action: ${messageItem.microAction}\n\nThink Better · Decide Better · Live Better\nhttps://brain-gym-nsu6.vercel.app`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Akuche Daily Focus: ${messageItem.focusWord}`,
          text: shareText,
          url: "https://brain-gym-nsu6.vercel.app",
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Non-blocking
    }
  };

  if (stage === "hidden" || !messageItem) return null;

  const isExiting = stage === "exiting";

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-gradient-to-b from-[#021A14] via-[#042F24] to-[#01140F] text-white p-4 sm:p-6 transition-all duration-500 ease-out select-none overflow-y-auto ${
        isExiting ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Today's Akuche Daily Launch & Inspiration"
    >
      {/* ─── STAGE 1: AKUCHE LOGO ENTRANCE (0s - 1.8s) ─── */}
      {stage === "logo" && (
        <div className="flex-1 w-full flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-40 w-40 rounded-full bg-emerald-500/25 blur-3xl animate-pulse" />
            <div className="relative z-10 transform scale-125">
              <AkucheBrandLogo variant="mark" size="xl" animate />
            </div>
          </div>
          <div className="space-y-1 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-amber-200 to-emerald-200">
              AKUCHE
            </h2>
            <p className="text-xs font-semibold text-emerald-300/80 tracking-widest uppercase">
              Think Better · Decide Better · Live Better
            </p>
          </div>
        </div>
      )}

      {/* ─── STAGE 2 & 3: DAILY INSPIRATION & 12-SECOND REFLECTION ─── */}
      {(stage === "inspiration" || stage === "exiting") && (
        <>
          {/* Top Bar with Brand Tag and Utility Actions */}
          <header className="w-full max-w-lg flex items-center justify-between pt-2 pb-2 animate-in fade-in duration-500">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-black tracking-widest uppercase text-emerald-400/90">
                DAILY FOCUS · AKUCHE
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={handleToggleSound}
                className="rounded-full p-2 text-emerald-300/80 hover:text-white hover:bg-emerald-900/60 transition active:scale-90"
                title={soundEnabled ? "Mute Welcome Sound" : "Enable Welcome Sound"}
                aria-label={soundEnabled ? "Mute Welcome Sound" : "Enable Welcome Sound"}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-emerald-300" />
                ) : (
                  <VolumeX className="h-4 w-4 text-emerald-500/60" />
                )}
              </button>

              {/* Bookmark / Favorite */}
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="rounded-full p-2 text-emerald-300/80 hover:text-white hover:bg-emerald-900/60 transition active:scale-90"
                title={isFavorited ? "Remove from Saved" : "Save this insight"}
                aria-label={isFavorited ? "Saved in Favorites" : "Save to Favorites"}
              >
                {isFavorited ? (
                  <BookmarkCheck className="h-4 w-4 text-amber-400 fill-amber-400" />
                ) : (
                  <Bookmark className="h-4 w-4 text-emerald-300/80" />
                )}
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full p-2 text-emerald-300/80 hover:text-white hover:bg-emerald-900/60 transition active:scale-90 relative"
                title="Share Today's Focus"
                aria-label="Share Today's Focus"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Share2 className="h-4 w-4 text-emerald-300/80" />
                )}
              </button>

              {/* Close (if force opened) */}
              {forceOpen && (
                <button
                  type="button"
                  onClick={handleCompleteAndExit}
                  className="rounded-full p-2 text-emerald-400/70 hover:text-white hover:bg-emerald-900/60 transition"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 w-full max-w-lg flex flex-col items-center justify-center my-auto py-4 space-y-5 text-center animate-in fade-in zoom-in-95 duration-500">
            {/* Subtle Brand Mark */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
              <div className="relative z-10 transform transition hover:scale-105 duration-300">
                <AkucheBrandLogo variant="mark" size="md" animate />
              </div>
            </div>

            {/* Theme Pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{messageItem.theme}</span>
            </div>

            {/* Focus Word Headline */}
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-widest font-black text-emerald-400/70">
                Today&apos;s Core Principle
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-amber-200 to-emerald-200 drop-shadow-md">
                {messageItem.focusWord}
              </h1>
            </div>

            {/* The Deep Insight Message */}
            <div className="relative max-w-md px-4 sm:px-6">
              <div className="text-emerald-500/20 text-6xl font-serif absolute -top-5 left-1 select-none pointer-events-none">
                &ldquo;
              </div>
              <p className="relative z-10 text-base sm:text-lg text-emerald-50 font-medium leading-relaxed drop-shadow-sm">
                {messageItem.message}
              </p>
            </div>

            {/* Thoughtful Reflection & Action Cards */}
            <div className="w-full space-y-2.5 pt-1 text-left">
              {/* Reflection Prompt Box */}
              <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/40 p-3.5 backdrop-blur-sm transition hover:border-emerald-700/60">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-900/60 text-amber-300 shrink-0 mt-0.5">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90">
                      Daily Reflection Prompt
                    </span>
                    <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-snug">
                      {messageItem.reflectionPrompt}
                    </p>
                  </div>
                </div>
              </div>

              {/* 10-Min Micro Action Box */}
              <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/40 p-3.5 backdrop-blur-sm transition hover:border-emerald-700/60">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-400 shrink-0 mt-0.5">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90">
                      Today&apos;s 10-Min Micro Action
                    </span>
                    <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-snug">
                      {messageItem.microAction}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 3 Intentional Pause Guidance */}
            <p className="text-xs font-semibold text-emerald-300/80 italic pt-1">
              &ldquo;Take a moment. What does this mean for your day?&rdquo;
            </p>
          </main>

          {/* Footer / CTA & Auto-Timer Section */}
          <footer className="w-full max-w-lg flex flex-col items-center space-y-3 pt-3 pb-2 animate-in fade-in duration-500">
            {/* 12-Second Progress Bar */}
            <div className="w-full bg-emerald-950/80 h-1.5 rounded-full overflow-hidden border border-emerald-800/40">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 transition-all duration-1000 ease-linear rounded-full"
                style={{
                  width: `${((displayDurationSeconds - secondsRemaining) / displayDurationSeconds) * 100}%`,
                }}
              />
            </div>

            {/* Primary CTA: "Begin My Day" */}
            <button
              type="button"
              onClick={handleCompleteAndExit}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-base tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Begin My Day</span>
              {secondsRemaining > 0 && (
                <span className="text-xs font-bold text-emerald-950/75 bg-emerald-300/50 px-2 py-0.5 rounded-full">
                  {secondsRemaining}s
                </span>
              )}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Subtitle tag */}
            <div className="flex items-center gap-2 text-[11px] text-emerald-300/70">
              <span>Think Better</span>
              <span>·</span>
              <span>Decide Better</span>
              <span>·</span>
              <span>Live Better</span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
