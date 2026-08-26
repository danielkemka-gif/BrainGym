"use client";

import { BrainMomentumState, CognitiveDomain } from "@/lib/brain-momentum-engine";
import { ArrowUpRight, ArrowDownRight, Minus, Sparkles, ShieldCheck } from "lucide-react";

interface CognitiveProfileBreakdownProps {
  momentum: BrainMomentumState;
}

export function CognitiveProfileBreakdown({
  momentum,
}: CognitiveProfileBreakdownProps) {
  const domains: CognitiveDomain[] = [
    "Memory",
    "Focus",
    "Processing Speed",
    "Attention",
    "Problem Solving",
    "Reaction Time",
    "Working Memory",
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 className="text-lg font-black text-foreground tracking-tight">
            Personal Cognitive Profile
          </h2>
          <p className="text-xs text-muted-foreground">
            Measured against your own historical baseline — not a universal or diagnostic score.
          </p>
        </div>
        <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-2.5 py-1 rounded-full w-fit">
          7 Domains Calibrated
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {domains.map((dom) => {
          const perf = momentum.domainProfiles[dom] || {
            domain: dom,
            currentScore: 75,
            baselineScore: 75,
            trend: "stable",
            trendPercentage: 0,
            confidenceLevel: "calibrated",
            recentAttemptsCount: 4,
          };

          let trendIcon = <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
          let trendBadge = "bg-muted text-muted-foreground border-border";
          let trendLabel = "Stable";

          if (perf.trend === "improving") {
            trendIcon = <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />;
            trendBadge = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
            trendLabel = `+${Math.abs(perf.trendPercentage)}% vs Baseline`;
          } else if (perf.trend === "needs_attention") {
            trendIcon = <ArrowDownRight className="h-3.5 w-3.5 text-amber-500" />;
            trendBadge = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
            trendLabel = `${perf.trendPercentage}% vs Baseline`;
          }

          return (
            <div
              key={dom}
              className="rounded-2xl border border-border/80 bg-background/80 p-4 space-y-2.5 shadow-sm transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-foreground truncate">{dom}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${trendBadge}`}>
                  {trendIcon}
                  <span>{trendLabel}</span>
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-foreground">{perf.currentScore}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    (Base: {perf.baselineScore})
                  </span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {perf.confidenceLevel === "high_confidence" ? "Calibrated (10+ logs)" : "Active baseline"}
                </span>
              </div>

              {/* Mini progress bar */}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    perf.trend === "improving"
                      ? "bg-emerald-500"
                      : perf.trend === "needs_attention"
                      ? "bg-amber-500"
                      : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, perf.currentScore))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
