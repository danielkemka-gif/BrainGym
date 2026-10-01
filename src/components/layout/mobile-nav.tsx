"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { Home, Dumbbell, TrendingUp, User } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const mobileTabs = [
    { href: "/dashboard", label: t.nav_dashboard || "Home", icon: Home },
    { href: "/dashboard/challenges", label: t.nav_challenges || "Train", icon: Dumbbell },
    { href: "/dashboard/progress", label: t.nav_progress || "Progress", icon: TrendingUp },
    { href: "/dashboard/settings", label: t.settings_profile || "Profile", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex w-full max-w-md items-stretch justify-around px-3 py-1">
        {mobileTabs.map((tab) => {
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
