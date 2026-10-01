"use client";

import React, { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/types";
import { Flame, ChevronDown } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  streakDays?: number;
}

export function DashboardHeader({
  userName = "Thinker",
  streakDays = 4,
}: DashboardHeaderProps) {
  const { locale, setLocale, t, isRtl } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLocaleOption = LOCALES.find((l) => l.id === locale) || LOCALES[0];
  const firstName = userName ? userName.split(" ")[0] : t.general_anonymous;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 pt-1 pb-1">
      <div className="space-y-0.5 min-w-0">
        <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate">
          {t.dashboard_greeting}, {firstName} 👋
        </h1>
        <p className="text-xs text-muted-foreground font-medium truncate">
          {t.dashboard_subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Quick Language Selector Pill */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            aria-label="Switch Language"
            className="flex items-center gap-1 rounded-full border border-border bg-card/90 hover:bg-muted px-2.5 py-1 text-xs font-bold text-foreground transition active:scale-95 shadow-sm"
          >
            <span className="text-sm">{currentLocaleOption.flag}</span>
            <span className="text-[10px] font-black uppercase">{currentLocaleOption.id}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          {showLangMenu && (
            <div className={`absolute ${isRtl ? "left-0" : "right-0"} mt-2 z-50 w-44 rounded-2xl border border-border bg-card p-1.5 shadow-2xl animate-in fade-in zoom-in-95 space-y-0.5`}>
              <div className="px-2.5 py-1 text-[10px] font-black uppercase text-muted-foreground">
                {t.settings_language}
              </div>
              {LOCALES.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setLocale(loc.id);
                    setShowLangMenu(false);
                  }}
                  className={`flex w-full items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition ${
                    locale === loc.id
                      ? "bg-primary/10 text-primary font-black"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{loc.flag}</span>
                    <span>{loc.nativeLabel}</span>
                  </div>
                  {loc.dir === "rtl" && (
                    <span className="text-[9px] font-black text-amber-500 uppercase">RTL</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Compact High-Contrast Streak Pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-black text-amber-600 dark:text-amber-400 shadow-sm">
          <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span>{streakDays} {t.general_streak.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
