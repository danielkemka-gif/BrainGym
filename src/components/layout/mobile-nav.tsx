"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { SIDEBAR_ICONS } from "@/lib/icons";

const TABS = [
  { href: "/dashboard", labelKey: "nav_dashboard", iconKey: "dashboard" },
  { href: "/dashboard/workout", labelKey: "nav_workout", iconKey: "workout" },
  { href: "/dashboard/challenges", labelKey: "nav_challenges", iconKey: "challenges" },
  { href: "/dashboard/chat", labelKey: "nav_chat", iconKey: "chat" },
  { href: "/dashboard/progress", labelKey: "nav_progress", iconKey: "progress" },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const labels = t as unknown as Record<string, string>;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex w-full max-w-md items-stretch justify-around px-2">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const Icon = SIDEBAR_ICONS[tab.iconKey];
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-medium transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] touch-manipulation ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-accent-foreground"
              }`}
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span className="truncate max-w-full">
                {labels[tab.labelKey] ?? tab.labelKey}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
