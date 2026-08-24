"use client";

import { Sparkles } from "lucide-react";

export function DailyMotivationFooter() {
  return (
    <div className="rounded-2xl bg-muted/30 border border-border/60 p-4 text-center space-y-1">
      <p className="text-xs sm:text-sm font-semibold text-muted-foreground italic flex items-center justify-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
        <span>&ldquo;Small daily improvements create a stronger mind.&rdquo;</span>
      </p>
      <p className="text-[10px] text-muted-foreground/70 font-medium">
        BrainGym Mental Vitality Principle
      </p>
    </div>
  );
}
