"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/types";
import { Avatar } from "@/components/ui/avatar";
import { Globe, ChevronDown, MoreHorizontal, Shield, Crown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SIDEBAR_ICONS } from "@/lib/icons";
import { useBrand } from "@/lib/brand-context";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import { AppInstallCard } from "@/components/dashboard/app-install-card";

const PRIMARY_NAV = [
  { href: "/dashboard", label: "Home", iconKey: "dashboard" },
  { href: "/dashboard/think", label: "Think", iconKey: "think" },
  { href: "/dashboard/ask", label: "Ask", iconKey: "ask" },
  { href: "/dashboard/progress", label: "Progress", iconKey: "progress" },
  { href: "/dashboard/profile", label: "My Akuche", iconKey: "profile" },
] as const;

const MORE_NAV = [
  { href: "/dashboard/move", label: "Move", iconKey: "move" },
  { href: "/dashboard/surprise", label: "Surprise Me", iconKey: "surprise" },
  { href: "/dashboard/journeys", label: "Journeys", iconKey: "journeys" },
  { href: "/dashboard/decisions", label: "Decision Lab", iconKey: "decision-lab" },
  { href: "/dashboard/journal", label: "Thinking Journal", iconKey: "journal" },
  { href: "/dashboard/transformation", label: "Transformation", iconKey: "progress" },
  { href: "/dashboard/library", label: "Activities", iconKey: "library" },
  { href: "/dashboard/daily-challenge", label: "Daily Challenge", iconKey: "challenge" },
  { href: "/dashboard/missions", label: "Missions", iconKey: "missions" },
  { href: "/dashboard/challenges", label: "Challenges", iconKey: "challenges" },
  { href: "/dashboard/leaderboard", label: "Leaderboard", iconKey: "leaderboard" },
  { href: "/dashboard/reports", label: "Reports", iconKey: "reports" },
  { href: "/dashboard/history", label: "History", iconKey: "history" },
  { href: "/dashboard/chat", label: "Community", iconKey: "chat" },
] as const;

const SETTINGS_NAV = { href: "/dashboard/settings", label: "Settings", iconKey: "settings" } as const;

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, supabase } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const { brand } = useBrand();
  const [profile, setProfile] = useState<{ name: string | null; username: string | null; avatar_url: string | null } | null>(null);
  const [showLang, setShowLang] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isMoreActive = MORE_NAV.some((item) => pathname === item.href);

  useEffect(() => {
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
  }, [user, supabase]);

  function renderNavItem(item: { href: string; label?: string; labelKey?: string; iconKey: string }) {
    const active = pathname === item.href;
    const Icon = SIDEBAR_ICONS[item.iconKey];
    const label = item.label ?? ((item.labelKey && (t as unknown as Record<string, string>)[item.labelKey]) || item.labelKey || item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring ${
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
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2">
            <AkucheBrandLogo variant="horizontal" size="sm" />
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

        {/* Primary nav — core items */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {/* Quick Explore / Search button */}
          <button
            onClick={() => {
              onClose();
              window.dispatchEvent(new Event("braingym:open-navigator"));
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors min-h-[44px] touch-manipulation mb-2"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/20">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <span>Search All Features</span>
          </button>

          {PRIMARY_NAV.map((item) => renderNavItem(item))}

          {/* Quick Install to Phone Button */}
          <div className="my-2">
            <AppInstallCard variant="compact" />
          </div>

          {/* More dropdown */}
          <div>
            <button
              onClick={() => setShowMore(!showMore)}
              aria-expanded={showMore}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring ${
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

          {/* Prominent Premium Promo Card */}
          <div className="my-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-purple-500/10 border border-amber-500/30 p-3 text-center space-y-2">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
              <Crown className="h-4 w-4 fill-current" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs text-foreground flex items-center justify-center gap-1">
                <span>AKUCHE Pro</span>
                <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-extrabold text-amber-600 dark:text-amber-400">PRO</span>
              </h4>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Unlock 177+ real-world drills, AI Socratic Coach & unlimited thinking practice.
              </p>
            </div>
            <Link
              href="/pricing"
              onClick={onClose}
              className="block w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white py-1.5 text-xs font-bold hover:brightness-105 shadow-sm transition active:scale-95 touch-manipulation"
            >
              Upgrade Now ⭐
            </Link>
          </div>
        </nav>

        {/* Bottom: Settings + Language + Theme */}
        <div className="border-t border-border p-3 space-y-2">
          {renderNavItem(SETTINGS_NAV)}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring ${
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
              className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring"
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
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors min-h-[44px] ${
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
