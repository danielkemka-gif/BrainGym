"use client";

import React, { useState, useEffect } from "react";
import {
  getTodaysDailyMessage,
  getRandomInspiration,
  toggleFavoriteMessage,
  isMessageFavorited,
  getFavoriteMessages,
} from "@/lib/inspiration/daily-opening-engine";
import { AkucheDailyMessage } from "@/lib/inspiration/types";
import { DailyOpeningScreen } from "@/components/brand/daily-opening-screen";
import {
  Sparkles,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Share2,
  Check,
  Zap,
  HelpCircle,
  Maximize2,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export function DailyInspirationCard() {
  const [message, setMessage] = useState<AkucheDailyMessage | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [favoritesList, setFavoritesList] = useState<AkucheDailyMessage[]>([]);

  useEffect(() => {
    const item = getTodaysDailyMessage();
    setMessage(item);
    setIsFavorited(isMessageFavorited(item.id));
  }, []);

  const handleShuffle = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const next = getRandomInspiration();
      setMessage(next);
      setIsFavorited(isMessageFavorited(next.id));
      setIsRefreshing(false);
    }, 250);
  };

  const handleToggleFavorite = () => {
    if (!message) return;
    const nextState = toggleFavoriteMessage(message.id);
    setIsFavorited(nextState);
  };

  const handleShare = async () => {
    if (!message) return;
    const shareText = `✨ AKUCHE DAILY FOCUS: ${message.focusWord}\n\n"${message.message}"\n\n🎯 Action: ${message.microAction}\n\nThink Better · Decide Better · Live Better\nhttps://brain-gym-nsu6.vercel.app`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Akuche Focus: ${message.focusWord}`,
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
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Non-blocking
    }
  };

  const handleOpenFavorites = () => {
    setFavoritesList(getFavoriteMessages());
    setShowFavoritesModal(true);
  };

  if (!message) return null;

  return (
    <>
      {showFullScreen && (
        <DailyOpeningScreen
          forceOpen
          onClose={() => setShowFullScreen(false)}
        />
      )}

      <div className="rounded-3xl bg-gradient-to-br from-[#042F24] via-[#064234] to-[#021A14] border border-emerald-500/30 p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-amber-400/5 blur-2xl pointer-events-none" />

        {/* Header: Theme Tag + Utility Actions */}
        <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-emerald-300/90 block">
                Today&apos;s Akuche Principle
              </span>
              <span className="text-xs font-bold text-emerald-100">
                {message.theme}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Draw another insight */}
            <button
              type="button"
              onClick={handleShuffle}
              className={`p-2 rounded-xl text-emerald-300/80 hover:text-white hover:bg-emerald-800/40 transition active:scale-95 ${
                isRefreshing ? "animate-spin" : ""
              }`}
              title="Draw another insight from library"
              aria-label="Draw another insight"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Favorite toggle */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className="p-2 rounded-xl text-emerald-300/80 hover:text-white hover:bg-emerald-800/40 transition active:scale-95"
              title={isFavorited ? "Saved in favorites" : "Save to favorites"}
              aria-label={isFavorited ? "Saved in favorites" : "Save to favorites"}
            >
              {isFavorited ? (
                <BookmarkCheck className="h-4 w-4 text-amber-400 fill-amber-400" />
              ) : (
                <Bookmark className="h-4 w-4 text-emerald-300/80" />
              )}
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl text-emerald-300/80 hover:text-white hover:bg-emerald-800/40 transition active:scale-95 relative"
              title="Share this principle"
              aria-label="Share this principle"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Share2 className="h-4 w-4 text-emerald-300/80" />
              )}
            </button>

            {/* Fullscreen Daily Opening Replay */}
            <button
              type="button"
              onClick={() => setShowFullScreen(true)}
              className="p-2 rounded-xl text-emerald-300/80 hover:text-white hover:bg-emerald-800/40 transition active:scale-95"
              title="Open full-screen daily view"
              aria-label="Open full-screen daily view"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Principle Headline */}
        <div className="mb-3 relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-amber-200 to-emerald-200">
            {message.focusWord}
          </h3>
        </div>

        {/* Deep Insight Text */}
        <div className="relative mb-5 z-10">
          <p className="text-sm sm:text-base text-emerald-50/95 font-medium leading-relaxed">
            &ldquo;{message.message}&rdquo;
          </p>
        </div>

        {/* Reflection & Micro Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 relative z-10">
          {/* Reflection */}
          <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/40 p-3.5 backdrop-blur-sm">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90">
                  Reflect
                </span>
                <p className="text-xs text-emerald-100/90 font-medium leading-snug">
                  {message.reflectionPrompt}
                </p>
              </div>
            </div>
          </div>

          {/* Micro Action */}
          <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/40 p-3.5 backdrop-blur-sm">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90">
                  10-Min Micro Action
                </span>
                <p className="text-xs text-emerald-100/90 font-medium leading-snug">
                  {message.microAction}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40 text-xs relative z-10">
          <button
            type="button"
            onClick={handleOpenFavorites}
            className="inline-flex items-center gap-1.5 text-emerald-300/80 hover:text-white font-semibold transition"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>Saved Library</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFullScreen(true)}
            className="inline-flex items-center gap-1 text-emerald-300 hover:text-white font-bold transition group"
          >
            <span>Full Experience</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Saved Favorites Modal */}
      {showFavoritesModal && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl bg-[#042F24] border border-emerald-500/30 p-6 text-white shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-800/50">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-black tracking-tight">
                  Saved Wisdom ({favoritesList.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFavoritesModal(false)}
                className="p-1.5 rounded-full text-emerald-400 hover:bg-emerald-900/50"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {favoritesList.length === 0 ? (
                <div className="text-center py-10 text-emerald-300/70 space-y-2">
                  <Bookmark className="h-8 w-8 mx-auto opacity-50" />
                  <p className="text-sm font-medium">
                    You have not bookmarked any daily principles yet.
                  </p>
                  <p className="text-xs text-emerald-400/60">
                    Tap the bookmark icon on any daily message to save it here.
                  </p>
                </div>
              ) : (
                favoritesList.map((fav) => (
                  <div
                    key={fav.id}
                    className="rounded-2xl bg-emerald-950/70 border border-emerald-800/50 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-300">
                        {fav.theme}
                      </span>
                      <span className="text-xs font-black tracking-wider text-emerald-300">
                        {fav.focusWord}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                      &ldquo;{fav.message}&rdquo;
                    </p>
                    <div className="text-[11px] text-emerald-400/80 pt-1 border-t border-emerald-900/50">
                      🎯 <span className="font-semibold">{fav.microAction}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
