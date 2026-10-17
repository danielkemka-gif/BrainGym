"use client";

import { AkucheGuidedOnboarding } from "@/components/onboarding/akuche-guided-onboarding";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-3 py-6 pb-[env(safe-area-inset-bottom)] touch-manipulation">
      <AkucheGuidedOnboarding mode="inline" forceOpen />
    </div>
  );
}
