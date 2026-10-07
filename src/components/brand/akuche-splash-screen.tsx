"use client";

import React, { useState, useEffect } from "react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";

export function AkucheSplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash on initial session / link visit
    const hasSeenSplash = sessionStorage.getItem("akuche_splash_seen");
    if (hasSeenSplash) {
      setVisible(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 900);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("akuche_splash_seen", "true");
    }, 1300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#042F24] text-white transition-opacity duration-400 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center space-y-4 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        {/* Animated Brand Mark */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
          <AkucheBrandLogo variant="mark" size="xl" animate />
        </div>

        {/* Wordmark */}
        <div className="space-y-1 pt-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-widest uppercase text-white flex items-center justify-center gap-1.5">
            <span>AKUCHE</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-ping" />
          </h1>
          <p className="text-xs sm:text-sm font-bold text-emerald-300 tracking-wider">
            Think Better · Decide Better · Live Better
          </p>
        </div>

        {/* Subtle loading pulse bar */}
        <div className="w-24 h-1 rounded-full bg-emerald-950 overflow-hidden mt-4">
          <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
