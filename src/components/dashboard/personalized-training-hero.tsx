"use client";

import { useState } from "react";
import { useEntitlements } from "@/lib/entitlements";
import { SmartPaywallModal } from "@/components/premium/smart-paywall-modal";
import { Sparkles, Target, Brain, Crown, ArrowRight, Zap, Play } from "lucide-react";
import Link from "next/link";

export function PersonalizedTrainingHero() {
  const { isPro, isTrial } = useEntitlements();
  const [showPaywall, setShowPaywall] = useState(false);

  if (isPro || isTrial) {
    return (
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-r from-primary/15 via-card to-purple-600/15 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/25">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                  Pro AI Recommendation
                </span>
                <span className="text-xs font-bold text-foreground">
                  Your Focus Needs Attention
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Your recent focus scores (71) have been below your memory baseline (86). Today&apos;s recommended 8-minute session targets sustained concentration.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/workout"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition touch-manipulation min-h-[44px] shrink-0"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>START RECOMMENDED WORKOUT</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Free User Preview
  return (
    <>
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-purple-500/10 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300">
                  BrainGym Pro Feature
                </span>
                <span className="text-xs font-bold text-foreground">
                  Personalized AI Brain Training
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Pro members receive daily workouts dynamically adapted to strengthen their weakest cognitive skills (e.g. Focus &amp; Reaction Speed).
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPaywall(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-amber-500/20 active:scale-95 transition touch-manipulation min-h-[44px] shrink-0"
          >
            <Crown className="h-4 w-4" />
            <span>Explore Pro Workouts</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <SmartPaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        featureName="Personalized AI Brain Training"
        featureDescription="Get daily workouts that automatically adapt to your strengths, weaknesses, and cognitive trends."
      />
    </>
  );
}
