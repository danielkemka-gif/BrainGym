"use client";

import { CATEGORIES } from "@/lib/constants";
import { Lock } from "lucide-react";
import { CATEGORY_ICONS, TIER_ICONS } from "@/lib/icons";

const TIERS = [
  { name: "Novice", activities: 0, score: 0 },
  { name: "Apprentice", activities: 5, score: 30 },
  { name: "Practitioner", activities: 15, score: 50 },
  { name: "Expert", activities: 30, score: 70 },
  { name: "Master", activities: 50, score: 85 },
] as const;

interface SkillTreeProps {
  activityCounts: Record<string, number>;
  scores: Record<string, number>;
}

function getUnlockedTier(activityCount: number, score: number) {
  let unlocked = 0;
  for (let i = 0; i < TIERS.length; i++) {
    const tier = TIERS[i];
    if (activityCount >= tier.activities && score >= tier.score) {
      unlocked = i;
    }
  }
  return unlocked;
}

export function SkillTree({ activityCounts, scores }: SkillTreeProps) {
  return (
    <div className="space-y-4">
      {CATEGORIES.map((category) => {
        const count = activityCounts[category.id] ?? 0;
        const score = scores[category.id] ?? 0;
        const unlockedTier = getUnlockedTier(count, score);

        return (
          <div key={category.id}>
            <div className="mb-2 flex items-center gap-2">
              {(() => { const CatIcon = CATEGORY_ICONS[category.slug]; return CatIcon ? <CatIcon className="h-4 w-4" style={{ color: category.color }} /> : null; })()}
              <span className="text-sm font-semibold" style={{ color: category.color }}>
                {category.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {count} activities · {score} score
              </span>
            </div>

            <div className="flex items-center gap-0">
              {TIERS.map((tier, i) => {
                const isUnlocked = i <= unlockedTier;
                const isNext = i === unlockedTier + 1;

                return (
                  <div key={tier.name} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all sm:h-12 sm:w-12 ${
                          isUnlocked
                            ? "border-transparent"
                            : isNext
                              ? "border-dashed border-muted-foreground/40"
                              : "border-border"
                        }`}
                        style={
                          isUnlocked
                            ? {
                                backgroundColor: `${category.color}20`,
                                borderColor: category.color,
                                boxShadow: `0 0 12px ${category.color}40`,
                              }
                            : undefined
                        }
                      >
                        {isUnlocked ? (
                          (() => { const TierIcon = TIER_ICONS[tier.name]; return TierIcon ? <TierIcon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: category.color }} /> : null; })()
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                      </div>
                      <span
                        className={`mt-1 text-[10px] font-medium sm:text-xs ${
                          isUnlocked ? "text-foreground" : "text-muted-foreground/50"
                        }`}
                      >
                        {tier.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60">
                        {tier.activities > 0 && `${tier.activities}+`}
                        {tier.score > 0 && ` / ${tier.score}+`}
                      </span>
                    </div>

                    {i < TIERS.length - 1 && (
                      <div
                        className={`mx-0.5 mb-5 h-0.5 w-4 sm:w-6 ${
                          i < unlockedTier ? "" : "bg-border"
                        }`}
                        style={
                          i < unlockedTier
                            ? { backgroundColor: category.color }
                            : undefined
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
