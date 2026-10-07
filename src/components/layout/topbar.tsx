"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { NotificationBell } from "@/components/layout/notification-bell";
import { Crown, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import { AppInstallCard } from "@/components/dashboard/app-install-card";

interface TopbarProps {
  onMenuClick: () => void;
  userName: string | null;
}

export function Topbar({ onMenuClick, userName }: TopbarProps) {
  const { user } = useAuth();
  const [streakDays, setStreakDays] = useState(4);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.current_streak !== undefined) {
          setStreakDays(data.current_streak);
        }
      });
  }, [user]);

  const displayName = userName ? userName.split(" ")[0] : "Thinker";

  return (
    <header
      role="banner"
      className="sticky top-0 z-30 flex min-h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-3 sm:px-4"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Left: Mobile Menu + Welcome Greeting */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:hidden active:scale-95 shrink-0"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Welcome Button / Greeting at the Top with Akuche Mark */}
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-1.5 shrink-0">
            <AkucheBrandLogo variant="mark" size="xs" />
          </Link>
          <span className="text-sm sm:text-base font-black text-foreground tracking-tight truncate">
            Welcome, {displayName} 👋
          </span>
        </div>
      </div>

      {/* Right: Install App Button + Pro Version Button + Streak + Notification Bell */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Install on Phone Button */}
        <AppInstallCard variant="button" />

        {/* Compact Pro Button at the top */}
        <Link
          href="/pricing"
          aria-label="Upgrade to Pro"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-2.5 sm:px-3 py-1 text-xs font-black shadow-xs transition active:scale-95 touch-manipulation min-h-[36px]"
        >
          <Crown className="h-3.5 w-3.5 fill-current text-white shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-wider">PRO</span>
        </Link>

        {/* Streak Pill */}
        <div className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-600 dark:text-amber-400">
          <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500 animate-bounce" />
          <span>{streakDays}d</span>
        </div>

        <NotificationBell />
      </div>
    </header>
  );
}
