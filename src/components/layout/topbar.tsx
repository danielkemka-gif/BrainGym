"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
      <header role="banner" className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <button
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {userName ?? "User"}
        </span>
        <button
          onClick={handleSignOut}
          className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground min-h-[44px]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
