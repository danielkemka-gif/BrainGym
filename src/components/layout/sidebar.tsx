"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/i18n/types";
import { Avatar } from "@/components/ui/avatar";
import { Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SIDEBAR_ICONS } from "@/lib/icons";

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { t, locale, setLocale } = useI18n();
  const [profile, setProfile] = useState<{ name: string | null; username: string | null; avatar_url: string | null } | null>(null);
  const [showLang, setShowLang] = useState(false);

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
    });
  }, []);

  const navItems = [
    { href: "/dashboard", label: t.nav_dashboard, iconKey: "dashboard" },
    { href: "/dashboard/workout", label: t.nav_workout ?? "Workout", iconKey: "workout" },
    { href: "/dashboard/library", label: t.nav_activities, iconKey: "library" },
    { href: "/dashboard/challenge", label: t.nav_quick_fire, iconKey: "challenge" },
    { href: "/dashboard/games", label: t.nav_games ?? "Games", iconKey: "games" },
    { href: "/dashboard/coach", label: t.nav_ai_coach, iconKey: "coach" },
    { href: "/dashboard/progress", label: t.nav_progress, iconKey: "progress" },
    { href: "/dashboard/reports", label: t.nav_reports, iconKey: "reports" },
    { href: "/dashboard/history", label: t.nav_history, iconKey: "history" },
    { href: "/dashboard/leaderboard", label: t.nav_leaderboard, iconKey: "leaderboard" },
    { href: "/dashboard/missions", label: t.nav_missions, iconKey: "missions" },
    { href: "/dashboard/challenges", label: t.nav_challenges, iconKey: "challenges" },
    { href: "/dashboard/chat", label: t.nav_chat, iconKey: "chat" },
    { href: "/dashboard/journal", label: t.nav_journal, iconKey: "journal" },
    { href: "/dashboard/share", label: t.nav_share_card, iconKey: "share" },
    { href: "/dashboard/decision-lab", label: t.nav_decision_lab, iconKey: "decision-lab" },
    { href: "/dashboard/settings", label: t.nav_settings, iconKey: "settings" },
  ];

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

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = SIDEBAR_ICONS[item.iconKey];
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
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Language & Theme */}
        <div className="relative border-t border-border p-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowLang(!showLang)}
              className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
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
