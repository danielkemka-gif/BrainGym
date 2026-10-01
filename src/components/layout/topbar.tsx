"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "@/components/layout/notification-bell";
import { OPEN_TOUR_EVENT } from "@/components/dashboard/welcome-tour";
import { OpenNavigatorButton } from "@/components/layout/feature-navigator";
import { useI18n } from "@/lib/i18n";
import { LOCALES, Locale } from "@/lib/i18n/types";
import { Crown, Globe, ChevronDown } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  userName: string | null;
}

export function Topbar({ onMenuClick, userName }: TopbarProps) {
  const router = useRouter();
  const { locale, setLocale, t, isRtl } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const currentLocaleOption = LOCALES.find((l) => l.id === locale) || LOCALES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header role="banner" className="flex min-h-14 items-center justify-between border-b border-border bg-background px-3 sm:px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Feature Explorer search pill */}
        <OpenNavigatorButton variant="pill" />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Quick Language Switcher Dropdown */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            aria-label="Change Language"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card/90 hover:bg-muted px-2.5 py-1 text-xs font-bold text-foreground transition active:scale-95 min-h-[36px]"
          >
            <span className="text-base leading-none">{currentLocaleOption.flag}</span>
            <span className="text-[11px] font-black uppercase tracking-wider">{currentLocaleOption.id}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          {showLangMenu && (
            <div className={`absolute ${isRtl ? "left-0" : "right-0"} mt-2 z-50 w-44 rounded-2xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 space-y-0.5`}>
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

        {/* Prominent Premium Upgrade Badge */}
        <Link
          href="/pricing"
          aria-label="Upgrade to Premium Membership"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white px-2.5 sm:px-3 py-1.5 text-xs font-bold shadow-sm shadow-amber-500/25 transition active:scale-[0.97] min-h-[36px] touch-manipulation"
        >
          <Crown className="h-3.5 w-3.5 fill-current text-white shrink-0" />
          <span className="hidden sm:inline">Go Premium</span>
          <span className="sm:hidden">Pro ⭐</span>
        </Link>

        <span className="text-sm text-muted-foreground hidden sm:inline">
          {userName ?? "User"}
        </span>
        <div className="hidden sm:block">
          <NotificationBell />
        </div>
        <button
          onClick={() => window.dispatchEvent(new Event(OPEN_TOUR_EVENT))}
          aria-label="Help and how to get started"
          title="How to get started"
          className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </button>
        <button
          onClick={handleSignOut}
          className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground min-h-[36px]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
