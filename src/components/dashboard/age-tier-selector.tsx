"use client";

import { useState } from "react";
import {
  AgeTierId,
  AGE_TIER_CONFIGS,
  getActiveUserAgeTier,
  setActiveUserAgeTier,
} from "@/lib/age-tiers";
import { UserCheck, Sparkles, ChevronDown, Check } from "lucide-react";

interface AgeTierSelectorProps {
  selectedTier: AgeTierId;
  onTierChange: (tier: AgeTierId) => void;
  className?: string;
}

export function AgeTierSelector({
  selectedTier,
  onTierChange,
  className = "",
}: AgeTierSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeConfig = AGE_TIER_CONFIGS.find((c) => c.id === selectedTier) || AGE_TIER_CONFIGS[2];

  const handleSelect = (tier: AgeTierId) => {
    setActiveUserAgeTier(tier);
    onTierChange(tier);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 hover:bg-primary/15 px-3.5 py-1.5 text-xs font-bold text-foreground transition active:scale-95 shadow-sm"
        title="Change Age Category & Life Stage"
      >
        <span className="text-base">{activeConfig.emoji}</span>
        <div className="text-left">
          <span className="text-[10px] uppercase tracking-wider text-primary font-black block leading-none">
            AGE CATEGORY
          </span>
          <span className="text-xs font-black text-foreground">
            {activeConfig.label} ({activeConfig.stageTitle.split(",")[0]})
          </span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Modal / Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-3xl border-2 border-primary/40 bg-card p-4 shadow-2xl space-y-2 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-2 px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                SELECT YOUR LIFE STAGE &amp; AGE CATEGORY
              </span>
              <span className="text-[10px] text-muted-foreground font-bold">
                Tailors all daily scenarios
              </span>
            </div>

            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {AGE_TIER_CONFIGS.map((cfg) => {
                const isSelected = selectedTier === cfg.id;
                return (
                  <button
                    key={cfg.id}
                    onClick={() => handleSelect(cfg.id)}
                    className={`w-full text-left rounded-2xl p-3 border transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border/60 bg-background hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl p-1.5 rounded-xl bg-card border border-border shrink-0">
                        {cfg.emoji}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-foreground">
                            {cfg.label}
                          </span>
                          <span className="text-[9px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                            {cfg.stageTitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {cfg.stageSubtitle}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
