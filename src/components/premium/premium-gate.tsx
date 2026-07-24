"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLANS } from "@/lib/paystack/plans";
import { Clock } from "lucide-react";

interface Props {
  children: React.ReactNode;
  feature: string;
}

function getDaysRemaining(periodEnd: string): number {
  const end = new Date(periodEnd).getTime();
  const now = Date.now();
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function PremiumGate({ children, feature }: Props) {
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [trialEnd, setTrialEnd] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

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
          const isActive = data?.status === "active" || data?.status === "trialing";
          setSubscribed(isActive);
          if (data?.status === "trialing" && data.current_period_end) {
            setTrialEnd(data.current_period_end);
          }
          setLoading(false);
        });
    });
  }, []);

  async function handleUpgrade() {
    setChecking(true);
    try {
      const res = await fetch("/api/paystack/initialize", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch { /* */ }
    setChecking(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (subscribed) {
    return <>{children}</>;
  }

  const plan = PLANS.premium;
  const priceDisplay = plan.currency === "NGN"
    ? `₦${(plan.amount / 100).toLocaleString()}`
    : `$${(plan.amount / 100).toFixed(2)}`;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-12 text-center">
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-2xl">⭐</span>
        </div>
        <h2 className="mb-2 text-xl font-bold">Premium Feature</h2>
        <p className="mb-1 text-sm text-muted-foreground">
          {feature} is available exclusively to Premium members.
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Upgrade to unlock unlimited access.
        </p>

        <div className="mb-6 space-y-2 text-left">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-primary">✓</span>
              <span className="text-muted-foreground">{f}</span>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <span className="text-3xl font-bold">{priceDisplay}</span>
          <span className="text-sm text-muted-foreground"> /month</span>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={checking}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {checking ? "Redirecting..." : "Upgrade to Premium"}
        </button>

        <p className="mt-3 text-xs text-muted-foreground">
          Cancel anytime. Secure checkout via Paystack.
        </p>
      </div>
    </div>
  );
}
