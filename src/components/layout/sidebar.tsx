"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  { href: "/dashboard/decision-lab", label: "Decision Lab", icon: "⚖" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

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
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/dashboard" className="text-lg font-bold" onClick={onClose}>
            BrainGym
          </Link>
        </div>

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
