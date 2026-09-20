"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, TrendingUp, User } from "lucide-react";

const MOBILE_TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/challenges", label: "Train", icon: Dumbbell },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Profile", icon: User },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex w-full max-w-md items-stretch justify-around px-3 py-1">
        {MOBILE_TABS.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-bold transition-all min-h-[48px] focus-visible:ring-2 focus-visible:ring-ring active:scale-95 touch-manipulation ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`p-1 rounded-xl transition ${active ? "bg-primary/10" : ""}`}>
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
              </span>
              <span className="truncate max-w-full font-bold">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
