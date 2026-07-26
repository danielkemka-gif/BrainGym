"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/types";
import { Avatar } from "@/components/ui/avatar";
import { Globe, ChevronDown, MoreHorizontal, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SIDEBAR_ICONS } from "@/lib/icons";

const PRIMARY_NAV = [
  { href: "/dashboard", labelKey: "nav_dashboard", iconKey: "dashboard" },
  { href: "/dashboard/workout", labelKey: "nav_workout", iconKey: "workout" },
  { href: "/dashboard/games", labelKey: "nav_games", iconKey: "games" },
  { href: "/dashboard/challenge", labelKey: "nav_quick_fire", iconKey: "challenge" },
  { href: "/dashboard/coach", labelKey: "nav_ai_coach", iconKey: "coach" },
  { href: "/dashboard/progress", labelKey: "nav_progress", iconKey: "progress" },
] as const;

const MORE_NAV = [
  { href: "/dashboard/library", labelKey: "nav_activities", iconKey: "library" },
  { href: "/dashboard/daily-challenge", labelKey: "nav_daily_challenge", iconKey: "challenge" },
  { href: "/dashboard/shop", labelKey: "nav_shop", iconKey: "shop" },
  { href: "/dashboard/missions", labelKey: "nav_missions", iconKey: "missions" },
  { href: "/dashboard/challenges", labelKey: "nav_challenges", iconKey: "challenges" },
  { href: "/dashboard/leaderboard", labelKey: "nav_leaderboard", iconKey: "leaderboard" },
  { href: "/dashboard/history", labelKey: "nav_history", iconKey: "history" },
  { href: "/dashboard/reports", labelKey: "nav_reports", iconKey: "reports" },
  { href: "/dashboard/chat", labelKey: "nav_chat", iconKey: "chat" },
  { href: "/dashboard/journal", labelKey: "nav_journal", iconKey: "journal" },
  { href: "/dashboard/share", labelKey: "nav_share_card", iconKey: "share" },
  { href: "/dashboard/decision-lab", labelKey: "nav_decision_lab", iconKey: "decision-lab" },
] as const;

const SETTINGS_NAV = { href: "/dashboard/settings", labelKey: "nav_settings", iconKey: "settings" } as const;

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { t, locale, setLocale } = useI18n();
  const [profile, setProfile] = useState<{ name: string | null; username: string | null; avatar_url: string | null } | null>(null);
  const [showLang, setShowLang] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isMoreActive = MORE_NAV.some((item) => pathname === item.href);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("name, username, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
      supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          setIsAdmin(!!data);
        });
    });
  }, []);

  function renderNavItem(item: { href: string; labelKey: string; iconKey: string }) {
    const active = pathname === item.href;
    const Icon = SIDEBAR_ICONS[item.iconKey];
    const label = (t as unknown as Record<string, string>)[item.labelKey] ?? item.labelKey;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {label}
      </Link>
    );
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        role="navigation"
        aria-label="Main navigation"
        className={`fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-border bg-background transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
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

        {/* Profile */}
        {profile && (
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Avatar src={profile.avatar_url} name={profile.name || ""} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{profile.name || "User"}</p>
              {profile.username && (
                <p className="text-xs text-muted-foreground truncate">@{profile.username}</p>
              )}
            </div>
          </div>
        )}

        {/* Primary nav — 6 core items */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {PRIMARY_NAV.map((item) => renderNavItem(item))}

          {/* More dropdown */}
          <div>
            <button
              onClick={() => setShowMore(!showMore)}
              aria-expanded={showMore}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                isMoreActive || showMore
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <MoreHorizontal className="h-4 w-4 shrink-0" />
              More
              <ChevronDown
                className={`ml-auto h-3.5 w-3.5 transition-transform ${
                  showMore ? "rotate-180" : ""
                }`}
              />
            </button>
            {showMore && (
              <div className="mt-0.5 space-y-0.5 pl-2">
                {MORE_NAV.map((item) => renderNavItem(item))}
              </div>
            )}
          </div>
        </nav>

        {/* Bottom: Settings + Language + Theme */}
        <div className="border-t border-border p-3 space-y-2">
          {renderNavItem(SETTINGS_NAV)}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                pathname.startsWith("/admin")
                  ? "bg-violet-500/10 text-violet-500 font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Shield className="h-4 w-4 shrink-0" />
              Admin Panel
            </Link>
          )}

          <div className="relative flex items-center gap-1">
            <button
              onClick={() => setShowLang(!showLang)}
              aria-expanded={showLang}
              aria-label="Change language"
              className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Globe className="h-4 w-4" />
              <span>{LOCALES.find((l) => l.id === locale)?.nativeLabel ?? "English"}</span>
            </button>
            <ThemeToggle size="sm" />
          </div>
          {showLang && (
            <div className="absolute bottom-full left-3 right-3 mb-1 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50">
              {LOCALES.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setLocale(loc.id);
                    setShowLang(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    locale === loc.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span className="text-base">{loc.flag}</span>
                  <span>{loc.nativeLabel}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {t.nav_tagline}
          </p>
        </div>
      </aside>
    </>
  );
}
