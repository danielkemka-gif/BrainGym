"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Dumbbell, Target, TrendingUp } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const mobileTabs = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/ask", label: "Ask Akuche", icon: Sparkles },
    { href: "/dashboard/daily-challenge", label: "Train", icon: Dumbbell },
    { href: "/dashboard/goals", label: "Goals", icon: Target },
    { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex w-full max-w-md items-stretch justify-around px-1 py-1">
        {mobileTabs.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href === "/dashboard" && pathname === "/dashboard") ||
            (tab.href === "/dashboard/ask" &&
              (pathname.startsWith("/dashboard/ask") ||
                pathname.startsWith("/dashboard/coach") ||
                pathname.startsWith("/dashboard/chat"))) ||
            (tab.href === "/dashboard/daily-challenge" &&
              (pathname.startsWith("/dashboard/daily-challenge") ||
                pathname.startsWith("/dashboard/challenges") ||
                pathname.startsWith("/dashboard/challenge") ||
                pathname.startsWith("/dashboard/library") ||
                pathname.startsWith("/dashboard/workout"))) ||
            (tab.href === "/dashboard/goals" &&
              pathname.startsWith("/dashboard/goals")) ||
            (tab.href === "/dashboard/progress" &&
              (pathname.startsWith("/dashboard/progress") ||
                pathname.startsWith("/dashboard/insights") ||
                pathname.startsWith("/dashboard/reports") ||
                pathname.startsWith("/dashboard/transformation") ||
                pathname.startsWith("/dashboard/history")));

          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-bold transition-all min-h-[48px] focus-visible:ring-2 focus-visible:ring-ring active:scale-95 touch-manipulation ${
                active
                  ? "text-emerald-600 dark:text-emerald-400 font-black"
                  : "text-muted-foreground hover:text-foreground font-semibold"
              }`}
            >
              <span
                className={`p-1 rounded-xl transition ${
                  active ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : ""
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                />
              </span>
              <span className="truncate max-w-full">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
