"use client";

import { DecisionLab } from "@/components/decisions/decision-lab";
import { ContextualGuidanceBanner } from "@/components/layout/contextual-guidance-banner";

export default function DecisionsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 overflow-x-hidden px-3 sm:px-4 py-3 pb-24 touch-manipulation">
      <ContextualGuidanceBanner
        featureKey="decisions"
        title="Make high-stakes choices with clarity"
        description="Run your dilemmas through the 12-step guided framework. Calculate downside worst-cases, design 24-hour test actions, and build 30-day review loops."
      />
      <DecisionLab />
    </div>
  );
}
