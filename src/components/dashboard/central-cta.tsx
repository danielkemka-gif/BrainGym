"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Zap, Brain, Trophy, Flame, Coins } from "lucide-react";

export function CentralCTA() {
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
      {/* Background decorations */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative px-6 py-8 text-center">
        {hasWorkout ? (
          <>
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-3xl">
              🎉
            </div>
            <h2 className="text-xl font-bold">Great work today{userName ? `, ${userName}` : ""}!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ve completed today&apos;s workout. Come back tomorrow to keep your streak alive!
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/challenge"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary/10 px-5 text-sm font-medium text-primary hover:bg-primary/20 transition-all"
              >
                <Zap className="h-4 w-4" />
                Play Quick-Fire
              </Link>
              <Link
                href="/dashboard/library"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-medium hover:bg-accent transition-all"
              >
                <Brain className="h-4 w-4" />
                Browse Activities
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              ⚡
            </div>
            <h2 className="text-xl font-bold">
              {userName ? `Ready to train, ${userName}?` : "Ready to train?"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump into your daily workout or try a Quick-Fire challenge
            </p>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard/challenge"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-8 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] sm:w-auto"
              >
                <Zap className="h-5 w-5" />
                Start Training Now
              </Link>
              <Link
                href="/dashboard/library"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 text-sm font-medium hover:bg-accent transition-all sm:w-auto"
              >
                <Brain className="h-5 w-5" />
                Browse Activities
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              ⏱ ~5 min · Earn XP & coins · Build your streak
            </p>
          </>
        )}
      </div>
    </div>
  );
}
