"use client";

import React from "react";
import Link from "next/link";
import { NotificationBell } from "@/components/layout/notification-bell";
import { OpenNavigatorButton } from "@/components/layout/feature-navigator";
import { Crown } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  userName: string | null;
}

export function Topbar({ onMenuClick, userName }: TopbarProps) {
  return (
    <header
      role="banner"
      className="flex min-h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-3 sm:px-4"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:hidden active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Feature Explorer search pill */}
        <OpenNavigatorButton variant="pill" />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sleek, Compact Pro Badge */}
        <Link
          href="/pricing"
          aria-label="Upgrade to Pro"
          className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-[11px] font-black transition active:scale-95 touch-manipulation"
        >
          <Crown className="h-3 w-3 fill-current text-amber-500 shrink-0" />
          <span>PRO</span>
        </Link>

        <span className="text-xs font-bold text-muted-foreground hidden sm:inline truncate max-w-[120px]">
          {userName ?? "Thinker"}
        </span>

        <NotificationBell />
      </div>
    </header>
  );
}
