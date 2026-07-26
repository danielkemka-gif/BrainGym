"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  BarChart3,
  Settings,
  ArrowLeft,
} from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activities", label: "Activities", icon: Activity },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside
      role="navigation"
      aria-label="Admin navigation"
      className="fixed left-0 top-0 z-40 hidden h-full w-60 flex-col border-r border-border bg-background lg:flex"
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-4 w-4 text-primary" />
        </div>
        <span className="text-lg font-bold">Admin</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {ADMIN_NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to app
        </Link>
      </div>
    </aside>
  );
}
