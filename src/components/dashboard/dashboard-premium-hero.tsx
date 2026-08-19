"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  Crown,
  Sparkles,
  Zap,
  Bot,
  Brain,
  ShieldCheck,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function DashboardPremiumHero() {
  const { user, supabase } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await supabase
          .from("subscriptions")
          .select("status, plan_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (data && (data.status === "active" || data.status === "trialing")) {
          setIsPremium(true);
        }
      } catch (err) {
        console.warn("Check subscription error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, supabase]);

  if (loading) return null;

  // If already premium, show a sleek Pro Badge with quick perks
  if (isPremium) {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-primary/10 p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-foreground">
                BrainGym Pro Member Active
              </span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                VIP ⭐
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              All 177+ real-world drills, unlimited AI coach, and 10-domain analytics unlocked.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/coach"
          className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary px-3.5 py-1.5 text-xs font-semibold transition"
        >
          <span>Ask AI Coach</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // Non-premium hero card with benefits
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-card to-purple-600/15 p-4 sm:p-6 shadow-md">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative space-y-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-400/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-foreground flex items-center gap-1.5">
                <span>BrainGym Premium Membership</span>
                <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                  PRO ⭐
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                Supercharge your cognitive training for real-world life and peak performance
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 w-fit">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Try Free Trial</span>
          </span>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          <div className="flex items-start gap-2.5 rounded-xl bg-card/80 border border-border/80 p-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">All 177+ Drills &amp; Workouts</h4>
              <p className="text-[11px] text-muted-foreground">
                Unlock full memory, thinking, speed, and emotional intelligence workouts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-card/80 border border-border/80 p-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Unlimited 24/7 AI Brain Coach</h4>
              <p className="text-[11px] text-muted-foreground">
                Personalized AI feedback, decision trade-off analysis, and habit coaching.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-card/80 border border-border/80 p-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">10-Domain Cognitive Profile</h4>
              <p className="text-[11px] text-muted-foreground">
                Complete neural radar metrics, brain age tracking, and weekly progress reports.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-card/80 border border-border/80 p-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Streak Freeze Protection</h4>
              <p className="text-[11px] text-muted-foreground">
                Protect your workout streak automatically when busy or traveling.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-card/80 border border-border/80 p-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">2x Bonus Coins &amp; Rewards</h4>
              <p className="text-[11px] text-muted-foreground">
                Double coins on all drills, shop cosmetics, and exclusive Master Thinker titles.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-card/80 border border-border/80 p-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Ad-Free &amp; Priority Access</h4>
              <p className="text-[11px] text-muted-foreground">
                100% focused, distraction-free environment with early access to new games.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/pricing"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110 active:scale-95 touch-manipulation min-h-[48px]"
          >
            <Crown className="h-4 w-4" />
            <span>Upgrade to Premium — Unlock All Features</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/pricing"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4 px-2 py-1"
          >
            View Pricing Plans (From ₦3,500/mo)
          </Link>
        </div>
      </div>
    </div>
  );
}
