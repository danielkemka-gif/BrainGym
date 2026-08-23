"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type SubscriptionTier = "free" | "trialing" | "pro" | "expired" | "cancelled";

export interface SubscriptionState {
  tier: SubscriptionTier;
  isPro: boolean;
  isTrial: boolean;
  isFree: boolean;
  trialDaysRemaining: number;
  periodEnd: string | null;
  planName: string;
  loading: boolean;
}

export interface Entitlements {
  // Free & Pro
  dailyWorkout: boolean;
  basicBrainMomentum: boolean;
  basicStreak: boolean;
  streakShields: boolean;
  xpAndLevels: boolean;
  coins: boolean;
  basicAchievements: boolean;
  quickFireQuiz: boolean;
  basicBrainAge: boolean;
  basicProgress: boolean;
  thirtyDayChallenge: boolean;
  dailyReminders: boolean;

  // Pro & Trial Exclusives
  unlimitedWorkouts: boolean;
  personalizedTrainingEngine: boolean;
  brainCoach: boolean;
  advancedMomentumBreakdown: boolean;
  advancedAnalyticsTrends: boolean;
  fullActivityLibrary: boolean;
  premiumChallenges: boolean;
  monthlyReport: boolean;
  adFree: boolean;
}

export function getEntitlements(tier: SubscriptionTier): Entitlements {
  const isProOrTrial = tier === "pro" || tier === "trialing";

  return {
    // Free features
    dailyWorkout: true,
    basicBrainMomentum: true,
    basicStreak: true,
    streakShields: true,
    xpAndLevels: true,
    coins: true,
    basicAchievements: true,
    quickFireQuiz: true,
    basicBrainAge: true,
    basicProgress: true,
    thirtyDayChallenge: true,
    dailyReminders: true,

    // Pro exclusive features
    unlimitedWorkouts: isProOrTrial,
    personalizedTrainingEngine: isProOrTrial,
    brainCoach: isProOrTrial,
    advancedMomentumBreakdown: isProOrTrial,
    advancedAnalyticsTrends: isProOrTrial,
    fullActivityLibrary: isProOrTrial,
    premiumChallenges: isProOrTrial,
    monthlyReport: isProOrTrial,
    adFree: isProOrTrial,
  };
}

export function useEntitlements() {
  const [state, setState] = useState<SubscriptionState>({
    tier: "free",
    isPro: false,
    isTrial: false,
    isFree: true,
    trialDaysRemaining: 0,
    periodEnd: null,
    planName: "BrainGym Free",
    loading: true,
  });

  const fetchSubscription = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, plan_tier, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();

      if (sub) {
        const rawStatus = (sub.status || "").toLowerCase();
        let tier: SubscriptionTier = "free";
        let isTrial = false;
        let daysLeft = 0;

        if (rawStatus === "active" || rawStatus === "pro") {
          tier = "pro";
        } else if (rawStatus === "trialing") {
          tier = "trialing";
          isTrial = true;
          if (sub.current_period_end) {
            const diff = new Date(sub.current_period_end).getTime() - Date.now();
            daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
            if (daysLeft === 0) tier = "expired";
          }
        } else if (rawStatus === "cancelled" || rawStatus === "canceled") {
          tier = "cancelled";
        } else if (rawStatus === "expired") {
          tier = "expired";
        }

        const isPro = tier === "pro" || tier === "trialing";
        const isFree = !isPro;
        const planName = tier === "pro" ? "BrainGym Pro" : isTrial ? `Pro Trial (${daysLeft}d left)` : "BrainGym Free";

        setState({
          tier,
          isPro,
          isTrial,
          isFree,
          trialDaysRemaining: daysLeft,
          periodEnd: sub.current_period_end || null,
          planName,
          loading: false,
        });
      } else {
        setState({
          tier: "free",
          isPro: false,
          isTrial: false,
          isFree: true,
          trialDaysRemaining: 0,
          periodEnd: null,
          planName: "BrainGym Free",
          loading: false,
        });
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const entitlements = getEntitlements(state.tier);

  return {
    ...state,
    entitlements,
    refreshSubscription: fetchSubscription,
  };
}
