"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { BRAND_CONFIG } from "@/config/brand";
import { Brain, TrendingUp, ArrowRight } from "lucide-react";

export function SkillDevelopmentProfile() {
  const { t, isRtl } = useI18n();

  // 8 Cognitive skills data with non-medical fitness progress values
  const skills = [
    { name: t.skill_decision_making, level: 82, trend: "+8%", color: "bg-amber-500" },
    { name: t.skill_problem_solving, level: 78, trend: "+6%", color: "bg-pink-500" },
    { name: t.skill_reasoning, level: 85, trend: "+11%", color: "bg-violet-500" },
    { name: t.skill_focus, level: 74, trend: "+5%", color: "bg-blue-500" },
    { name: t.skill_cognitive_flexibility, level: 80, trend: "+9%", color: "bg-emerald-500" },
    { name: t.skill_memory, level: 76, trend: "+4%", color: "bg-indigo-500" },
    { name: t.skill_processing_speed, level: 83, trend: "+7%", color: "bg-yellow-500" },
    { name: t.skill_creativity, level: 79, trend: "+6%", color: "bg-cyan-500" },
  ];

  return (
    <div className={`rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-sm ${isRtl ? "text-right" : "text-left"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Brain className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-black uppercase tracking-wider text-foreground">
            {t.skill_development_title}
          </span>
        </div>

        <Link
          href="/dashboard/progress"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <span>{t.nav_progress}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
        <TrendingUp className="h-3.5 w-3.5 inline mr-1" />
        {t.skill_improvement_prefix} <strong>{t.skill_reasoning}</strong> (+11%) &amp; <strong>{t.skill_decision_making}</strong> (+8%).
      </div>

      {/* 8 Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {skills.map((s) => (
          <div key={s.name} className="rounded-2xl bg-background/80 border border-border p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground truncate">{s.name}</span>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{s.trend}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.level}%` }} />
            </div>
            <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold">
              <span>Pace</span>
              <span>{s.level}/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
