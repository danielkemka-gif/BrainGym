"use client";

import { useState } from "react";
import { Crown, Sparkles, Check, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { PLANS } from "@/lib/paystack/plans";

interface SmartPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  featureDescription?: string;
}

const PRO_BENEFITS = [
  "Unlimited daily workouts & specialized skill training (Memory, Focus, Speed, Logic)",
  "Personalized AI brain training engine (\"Your Focus Needs Attention\")",
  "Personal AI Brain Coach with recommendations based on your real performance",
  "Advanced Brain Momentum analytics & category weight breakdowns",
  "Full access to 177+ real-world cognitive activities",
  "Specialized Premium Challenges (7d Memory, 14d Focus, 21d Speed, 60d Fitness)",
  "Advanced 7d/30d/60d/90d progress trends & Monthly Brain Reports",
  "100% Ad-Free uninterrupted training experience",
];

export function SmartPaywallModal({
  isOpen,
  onClose,
  featureName = "This Premium Feature",
  featureDescription = "Unlock deeper personalization, unlimited workouts, and your personal AI Brain Coach with BrainGym Pro.",
}: SmartPaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleUnlockPro() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/paystack/initialize", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Could not initialize checkout. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStartTrial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscription/initialize-trial", { method: "POST" });
      const data = await res.json();
      if (data.status === "trialing") {
        window.location.reload();
      } else {
        handleUnlockPro();
      }
    } catch {
      setError("Failed to start trial. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const plan = PLANS.premium;
  const priceDisplay = plan.currency === "NGN"
    ? `₦${(plan.amount / 100).toLocaleString()} / month`
    : `$${(plan.amount / 100).toFixed(2)} / month`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-card via-card to-amber-500/10 p-5 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top Header Badge */}
        <div className="text-center space-y-2 pt-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 animate-pulse">
            <Crown className="h-7 w-7" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-black uppercase text-amber-700 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5" /> BrainGym Pro
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            UNLOCK YOUR FULL BRAIN POTENTIAL
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            <strong className="text-foreground">{featureName}</strong> is a BrainGym Pro feature. {featureDescription}
          </p>
        </div>

        {/* Pro Benefits List */}
        <div className="rounded-2xl border border-border/80 bg-background/80 p-3.5 sm:p-4 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Everything Included With Pro:
          </span>
          <div className="space-y-2 text-xs text-foreground font-medium">
            {PRO_BENEFITS.map((benefit, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-black mt-0.5">
                  ✓
                </span>
                <span className="leading-snug text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Pill */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">
              Subscription
            </span>
            <p className="text-lg sm:text-xl font-black text-foreground">{priceDisplay}</p>
          </div>
          <span className="text-[11px] font-bold text-muted-foreground">Cancel anytime</span>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 p-2.5 text-xs text-destructive text-center">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleUnlockPro}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-3.5 text-sm sm:text-base font-black text-white shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-[0.98] transition touch-manipulation min-h-[50px]"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Crown className="h-4 w-4" />
                <span>UNLOCK BRAINGYM PRO NOW</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-xs font-bold text-muted-foreground hover:text-foreground py-2 touch-manipulation"
          >
            Not Now — Keep Training Free
          </button>
        </div>
      </div>
    </div>
  );
}
