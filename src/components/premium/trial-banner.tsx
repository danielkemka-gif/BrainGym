"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Clock, Sparkles } from "lucide-react";

interface TrialInfo {
  status: string;
  periodEnd: string | null;
}

function getDaysRemaining(periodEnd: string): number {
  const end = new Date(periodEnd).getTime();
  const now = Date.now();
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function TrialBanner() {
  const [trial, setTrial] = useState<TrialInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      supabase
        .from("subscriptions")
        .select("status, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.status === "trialing" && data.current_period_end) {
            setTrial({ status: data.status, periodEnd: data.current_period_end });
          }
          setLoading(false);
        });
    });
  }, []);

  if (loading || !trial || !trial.periodEnd) return null;

  const daysRemaining = getDaysRemaining(trial.periodEnd);

  if (daysRemaining <= 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">
            Free Trial Active
          </p>
          <p className="text-xs text-muted-foreground">
            You have <strong className="text-primary">{daysRemaining} {daysRemaining === 1 ? "day" : "days"}</strong> of premium access remaining
          </p>
        </div>
        <a
          href="/dashboard/pricing"
          className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Upgrade Now
        </a>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all"
          style={{ width: `${Math.max(5, (daysRemaining / 14) * 100)}%` }}
        />
      </div>
    </div>
  );
}
