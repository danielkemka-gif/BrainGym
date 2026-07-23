"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◉" },
  { href: "/dashboard/library", label: "Activities", icon: "⊞" },
  { href: "/dashboard/challenge", label: "Quick-Fire", icon: "⚡" },
  { href: "/dashboard/coach", label: "AI Coach", icon: "🧠" },
  { href: "/dashboard/progress", label: "Progress", icon: "▤" },
  { href: "/dashboard/reports", label: "Reports", icon: "📊" },
  { href: "/dashboard/history", label: "History", icon: "⏱" },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "☰" },
  { href: "/dashboard/missions", label: "Missions", icon: "★" },
  { href: "/dashboard/challenges", label: "Challenges", icon: "🏆" },
  { href: "/dashboard/journal", label: "Journal", icon: "📓" },
  { href: "/dashboard/share", label: "Share Card", icon: "📤" },
  { href: "/dashboard/decision-lab", label: "Decision Lab", icon: "⚖" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ name: string | null; username: string | null } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("name, username")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    });
  }, []);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-border bg-background transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <img
            src="/logo.png"
            alt="BrainGym"
            className="h-8 w-8 rounded-lg object-contain"
          />
          <Link href="/dashboard" className="text-lg font-bold" onClick={onClose}>
            BrainGym
          </Link>
        </div>

        {profile && (
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium truncate">{profile.name || "User"}</p>
            {profile.username && (
              <p className="text-xs text-muted-foreground truncate">@{profile.username}</p>
            )}
          </div>
        )}

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            Train Your Brain For Real Life
          </p>
        </div>
      </aside>
    </>
  );
}
