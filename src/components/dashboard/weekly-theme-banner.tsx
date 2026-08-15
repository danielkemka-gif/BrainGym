"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { getWeeklyTheme, getWeekRange } from "@/lib/themes";

export function WeeklyThemeBanner() {
  const theme = useMemo(() => getWeeklyTheme(new Date()), []);
  const range = useMemo(() => getWeekRange(new Date()), []);

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-2xl">
          {theme.emoji}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">{theme.name}</h3>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
              +{Math.round((theme.bonus - 1) * 100)}% XP
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{theme.description}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            {theme.focusHint}
          </p>
        </div>
      </div>
      <span className="mt-2 block text-[10px] uppercase tracking-wide text-muted-foreground/70">
        Theme of {range.start} – {range.end}
      </span>
    </div>
  );
}
