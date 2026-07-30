"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Zap, Brain, CheckCircle, Sparkles } from "lucide-react";

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

      <div className="relative px-4 py-6 text-center sm:px-6 sm:py-8">
        {hasWorkout ? (
          <>
            <div className="mx-auto mb-3 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-green-500/10">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">
              {t.dashboard_greeting}{userName ? `, ${userName}` : ""}!
            </h2>
            <div className="mt-4 flex flex-col items-center gap-2.5 sm:mt-5 sm:flex-row sm:justify-center sm:gap-3">
              <Link
                href="/dashboard/challenge"
                className="inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-6 sm:px-8 text-sm font-medium text-primary hover:bg-primary/20 transition-all sm:w-auto min-h-[44px] touch-manipulation active:scale-[0.97]"
              >
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.nav_quick_fire}
              </Link>
              <Link
                href="/dashboard/library"
                className="inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 sm:px-8 text-sm font-medium hover:bg-accent transition-all sm:w-auto min-h-[44px] touch-manipulation active:scale-[0.97]"
              >
                <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.nav_activities}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-3 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">
              {userName ? `${t.dashboard_greeting}, ${userName}!` : `${t.dashboard_greeting}!`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.dashboard_subtitle}
            </p>
            <div className="mt-4 flex flex-col items-center gap-2.5 sm:mt-5 sm:flex-row sm:justify-center sm:gap-3">
              <Link
                href="/dashboard/challenge"
                className="inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 sm:px-8 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] sm:w-auto min-h-[44px] touch-manipulation active:scale-[0.97]"
              >
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.dashboard_start_training}
              </Link>
              <Link
                href="/dashboard/library"
                className="inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 sm:px-8 text-sm font-medium hover:bg-accent transition-all sm:w-auto"
              >
                <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.nav_activities}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
