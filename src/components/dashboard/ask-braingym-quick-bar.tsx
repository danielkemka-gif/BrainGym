"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Sparkles, Mic, ArrowRight } from "lucide-react";

export function AskBrainGymQuickBar() {
  const { t, isRtl } = useI18n();

  return (
    <Link
      href="/dashboard/ask"
      className="group block overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-3.5 shadow-sm transition-all hover:border-primary/40 hover:bg-card hover:shadow-md touch-manipulation min-h-[52px]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-foreground block truncate">
              {t.ask_header_title || "Have a problem or decision to solve?"}
            </span>
            <span className="text-[11px] text-muted-foreground block truncate">
              {t.ask_input_placeholder || "Ask AKUCHE · Socratic Problem Solving"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground group-hover:text-primary transition">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-primary">
            <Mic className="h-4 w-4" />
          </span>
          <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isRtl ? "rotate-180" : ""}`} />
        </div>
      </div>
    </Link>
  );
}
