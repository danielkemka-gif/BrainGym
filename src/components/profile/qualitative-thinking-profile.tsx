"use client";

import React, { useState, useEffect } from "react";
import { UserThinkingProfile, getThinkingProfile, ThinkingRating } from "@/lib/profile/thinking-profile-engine";
import { useI18n } from "@/lib/i18n";
import { Brain, ChevronDown, ChevronUp, Sparkles, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";

export function QualitativeThinkingProfile() {
  const { t, isRtl } = useI18n();
  const [profile, setProfile] = useState<UserThinkingProfile | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getThinkingProfile().then((p) => setProfile(p));
  }, []);

  if (!profile) return null;

  const getRatingBadge = (rating: ThinkingRating) => {
    switch (rating) {
      case "Strong":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Strong
          </span>
        );
      case "Developing":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-black text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="h-3 w-3" />
            Developing
          </span>
        );
      case "Needs Practice":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-black text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-3 w-3" />
            Needs Practice
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Observational Insight Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Brain className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider text-primary">
            {t.profile_thinking_dimensions_title || "YOUR THINKING PROFILE"}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
          {profile.behavioralObservation}
        </p>

        <div className="mt-3.5 flex flex-wrap gap-2 pt-2 border-t border-border/60 text-[11px]">
          <div className="rounded-lg bg-background/80 px-2.5 py-1 font-bold text-foreground border border-border">
            <span className="text-muted-foreground mr-1">Top Strength:</span>
            <span className="text-emerald-500">{profile.topStrength}</span>
          </div>
          <div className="rounded-lg bg-background/80 px-2.5 py-1 font-bold text-foreground border border-border">
            <span className="text-muted-foreground mr-1">Growth Area:</span>
            <span className="text-amber-500">{profile.primaryGrowthArea}</span>
          </div>
        </div>
      </div>

      {/* 10 Dimensions List / Grid */}
      <div className="space-y-2">
        {profile.dimensions.map((dim) => {
          const isExpanded = expandedId === dim.id;
          return (
            <div
              key={dim.id}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isExpanded ? "border-primary/40 bg-card shadow-sm" : "border-border/70 bg-card/60 hover:bg-card hover:border-border"
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : dim.id)}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left min-h-[48px] touch-manipulation"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-lg shrink-0">{dim.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                      {dim.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground line-clamp-1">
                      {dim.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getRatingBadge(dim.rating)}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-3.5 pb-4 pt-1 border-t border-border/50 text-xs space-y-2 bg-muted/20">
                  <div>
                    <span className="font-extrabold text-foreground uppercase tracking-wider text-[10px] block text-muted-foreground mb-0.5">
                      Pattern Observation
                    </span>
                    <p className="text-foreground/90 font-medium leading-relaxed">
                      {dim.observation}
                    </p>
                  </div>
                  <div>
                    <span className="font-extrabold text-primary uppercase tracking-wider text-[10px] block mb-0.5">
                      Targeted Practice Drill
                    </span>
                    <p className="text-foreground/90 font-medium leading-relaxed">
                      {dim.recommendedFocus}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
