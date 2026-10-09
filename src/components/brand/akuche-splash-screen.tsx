"use client";

import React, { useState, useEffect } from "react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  getInspiringWord,
  getTodaysInspiringWord,
  InspiringWordItem,
} from "@/lib/inspiring-words-engine";
import {
  playWarmWelcomeChime,
  isAudioWelcomeEnabled,
  setAudioWelcomeEnabled,
} from "@/lib/audio/welcome-chime";
import { Volume2, VolumeX, Sparkles, ArrowRight } from "lucide-react";

export function AkucheSplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [wordItem, setWordItem] = useState<InspiringWordItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Generate fresh inspiring word for this session
    const item = getTodaysInspiringWord();
    setWordItem(item);
    setSoundEnabled(isAudioWelcomeEnabled());

    // Play warm welcome chime
    playWarmWelcomeChime();

    // Auto-advance timer: ushers the user smoothly to the dashboard after 2.8s
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2400);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2850);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleDismissImmediately = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
    }, 200);
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

  if (!visible || !wordItem) return null;

  return (
    <div
      onClick={handleDismissImmediately}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#042F24] text-white p-6 transition-all duration-500 ease-out cursor-pointer select-none ${
        fading ? "opacity-0 scale-102 pointer-events-none" : "opacity-100 scale-100"
      }`}
      aria-hidden="true"
    >
      {/* Top Bar with Sound Toggle */}
      <div className="w-full max-w-md flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-black tracking-widest uppercase text-emerald-400/80">
            AKUCHE SPACE
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggleSound}
          className="rounded-full p-2 text-emerald-300/80 hover:text-white hover:bg-emerald-900/50 transition active:scale-90"
          title={soundEnabled ? "Mute Welcome Sound" : "Enable Welcome Sound"}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Main Center Content: Brand + Animated Inspiring Word */}
      <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-sm px-4 animate-in fade-in zoom-in-95 duration-700">
        {/* Glowing Brand Mark */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
          <div className="relative z-10 transform transition hover:scale-105">
            <AkucheBrandLogo variant="mark" size="xl" animate />
          </div>
        </div>

        {/* The Animated Inspiring Word */}
        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300 shadow-sm">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Today&apos;s Focus · {wordItem.theme}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-300 to-emerald-100 animate-fade-in drop-shadow-sm">
            {wordItem.word}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed max-w-xs mx-auto pt-1">
            &ldquo;{wordItem.mantra}&rdquo;
          </p>
        </div>
      </div>

      {/* Bottom Footer: Ushers user into Dashboard */}
      <div className="w-full max-w-md flex flex-col items-center space-y-3 pb-4">
        {/* Subtle Progress Loading Line */}
        <div className="w-28 h-1 rounded-full bg-emerald-950 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full animate-pulse" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300/80 hover:text-white transition">
          <span>Entering your thinking space</span>
          <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
        </div>

        <p className="text-[10px] text-emerald-400/50">
          Tap anywhere to start immediately
        </p>
      </div>
    </div>
  );
}
