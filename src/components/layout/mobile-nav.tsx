"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Compass, TrendingUp, User } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const mobileTabs = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/ask", label: "Ask", icon: Sparkles },
    { href: "/dashboard/journeys", label: "Think & Move", icon: Compass },
    { href: "/dashboard/insights", label: "Insights", icon: TrendingUp },
    { href: "/dashboard/profile", label: "My Akuche", icon: User },
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
            (tab.href === "/dashboard/journeys" &&
              (pathname.startsWith("/dashboard/journeys") ||
                pathname.startsWith("/dashboard/decisions") ||
                pathname.startsWith("/dashboard/journal") ||
                pathname.startsWith("/dashboard/workout"))) ||
            (tab.href === "/dashboard/insights" &&
              (pathname.startsWith("/dashboard/insights") ||
                pathname.startsWith("/dashboard/progress") ||
                pathname.startsWith("/dashboard/reports"))) ||
            (tab.href === "/dashboard/ask" &&
              (pathname === "/dashboard/ask" || pathname === "/dashboard/coach")) ||
            (tab.href === "/dashboard/profile" &&
              (pathname.startsWith("/dashboard/profile") ||
                pathname.startsWith("/dashboard/settings")));

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
