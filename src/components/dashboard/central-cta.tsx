"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Zap, Brain } from "lucide-react";

export function CentralCTA() {
  const { t } = useI18n();
  const [hasWorkout, setHasWorkout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      const name =
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "there";
      setUserName(name.split(" ")[0]);

      const today = new Date().toISOString().split("T")[0];
      supabase
        .from("daily_workouts")
        .select("status")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle()
        .then(({ data }) => {
          setHasWorkout(data?.status === "completed");
          setLoading(false);
        });
    });
  }, []);

  if (loading) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 border border-primary/20">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative px-6 py-8 text-center">
        {hasWorkout ? (
          <>
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-3xl">
              🎉
            </div>
            <h2 className="text-xl font-bold">
              {t.dashboard_greeting}{userName ? `, ${userName}` : ""}! 🎉
            </h2>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard/challenge"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-8 text-sm font-medium text-primary hover:bg-primary/20 transition-all sm:w-auto"
              >
                <Zap className="h-5 w-5" />
                {t.nav_quick_fire}
              </Link>
              <Link
                href="/dashboard/library"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 text-sm font-medium hover:bg-accent transition-all sm:w-auto"
              >
                <Brain className="h-5 w-5" />
                {t.nav_activities}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              ⚡
            </div>
            <h2 className="text-xl font-bold">
              {userName ? `${t.dashboard_greeting}, ${userName}! 👋` : `${t.dashboard_greeting}! 👋`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.dashboard_subtitle}
            </p>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard/challenge"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-8 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] sm:w-auto"
              >
                <Zap className="h-5 w-5" />
                {t.dashboard_start_training}
              </Link>
              <Link
                href="/dashboard/library"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 text-sm font-medium hover:bg-accent transition-all sm:w-auto"
              >
                <Brain className="h-5 w-5" />
                {t.nav_activities}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
