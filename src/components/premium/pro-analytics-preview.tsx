"use client";

import { useState } from "react";
import { Crown, Sparkles, TrendingUp, Lock, ArrowRight } from "lucide-react";
import { SmartPaywallModal } from "./smart-paywall-modal";

interface ProAnalyticsPreviewProps {
  title?: string;
  subtitle?: string;
}

export function ProAnalyticsPreview({
  title = "30-Day & 90-Day Cognitive Trend Analytics",
  subtitle = "Pro users unlock full historical trend graphs across Memory, Focus, Speed, Logic, and Brain Age progression.",
}: ProAnalyticsPreviewProps) {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        {/* Simulated Blurred Chart Background */}
        <div className="space-y-4 filter blur-[6px] opacity-40 select-none pointer-events-none">
          <div className="flex justify-between items-center">
            <div className="h-6 w-48 bg-muted rounded-lg" />
            <div className="h-6 w-24 bg-muted rounded-lg" />
          </div>
          <div className="h-44 w-full bg-gradient-to-r from-violet-500/20 via-primary/20 to-emerald-500/20 rounded-2xl flex items-end p-4 gap-2">
            {[40, 65, 55, 80, 75, 90, 85, 95, 88, 92, 98].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/40 rounded-t-lg" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 bg-muted rounded-xl" />
            <div className="h-16 bg-muted rounded-xl" />
            <div className="h-16 bg-muted rounded-xl" />
          </div>
        </div>

        {/* Overlay Pro Lock Card */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-background/60 backdrop-blur-[2px] text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-md">
            <Lock className="h-6 w-6" />
          </div>

          <div className="max-w-md space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pro Feature Preview
            </span>
            <h3 className="text-base sm:text-lg font-black text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
          </div>

          <button
            onClick={() => setShowPaywall(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-5 py-2.5 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/25 active:scale-95 transition touch-manipulation min-h-[44px]"
          >
            <Crown className="h-4 w-4" />
            <span>SEE MY FULL BRAIN ANALYTICS</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <SmartPaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        featureName="Advanced 90-Day Trend Analytics"
        featureDescription="Track your Brain Score progression, category radar charts, and long-term neuroplastic growth."
      />
    </>
  );
}
