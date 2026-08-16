"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "@/components/layout/notification-bell";
import { OPEN_TOUR_EVENT } from "@/components/dashboard/welcome-tour";
import { OpenNavigatorButton } from "@/components/layout/feature-navigator";

interface TopbarProps {
  onMenuClick: () => void;
  userName: string | null;
}

export function Topbar({ onMenuClick, userName }: TopbarProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
      <header role="banner" className="flex min-h-14 items-center justify-between border-b border-border bg-background px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
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

      <div className="flex items-center gap-2 sm:gap-3">
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
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </button>
        <button
          onClick={handleSignOut}
          className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground min-h-[44px] min-w-[44px]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
