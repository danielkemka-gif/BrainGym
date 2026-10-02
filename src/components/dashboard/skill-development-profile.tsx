"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { BRAND_CONFIG } from "@/config/brand";
import { Brain, TrendingUp, ArrowRight, Sparkles } from "lucide-react";

export function SkillDevelopmentProfile() {
  const { t, isRtl } = useI18n();

  // 8 Cognitive skills data with non-medical fitness progress values
  const skills = [
    { id: "decision_making", name: t.skill_decision_making, level: 84, trend: "+8%", icon: "🧭", color: "from-amber-500 to-orange-500" },
    { id: "reasoning", name: t.skill_reasoning, level: 88, trend: "+11%", icon: "⚖️", color: "from-violet-500 to-purple-600" },
    { id: "problem_solving", name: t.skill_problem_solving, level: 79, trend: "+6%", icon: "🧩", color: "from-pink-500 to-rose-600" },
    { id: "focus", name: t.skill_focus, level: 76, trend: "+5%", icon: "🎯", color: "from-blue-500 to-cyan-600" },
    { id: "cognitive_flexibility", name: t.skill_cognitive_flexibility, level: 82, trend: "+9%", icon: "🔄", color: "from-emerald-500 to-teal-600" },
    { id: "processing_speed", name: t.skill_processing_speed, level: 85, trend: "+7%", icon: "⚡", color: "from-yellow-500 to-amber-500" },
    { id: "memory", name: t.skill_memory, level: 78, trend: "+4%", icon: "🧠", color: "from-indigo-500 to-blue-600" },
    { id: "creativity", name: t.skill_creativity, level: 80, trend: "+6%", icon: "💡", color: "from-cyan-500 to-teal-500" },
  ];

  return (
    <div className={`rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-background p-4 sm:p-5 space-y-3.5 shadow-sm ${isRtl ? "text-right" : "text-left"}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              COGNITIVE AGILITY
            </span>
            <h3 className="text-xs sm:text-sm font-black text-foreground">
              {t.skill_development_title}
            </h3>
          </div>
        </div>

        <Link
          href="/dashboard/progress"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline group"
        >
          <span>{t.nav_progress}</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Positive Non-Medical Coaching Insight Pill */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
        <TrendingUp className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
        <p className="leading-relaxed">
          {t.skill_improvement_prefix} <strong className="font-black text-foreground">{t.skill_reasoning}</strong> (+11%) &amp; <strong className="font-black text-foreground">{t.skill_decision_making}</strong> (+8%).
        </p>
      </div>

      {/* 8 Skills Modern Micro-Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {skills.map((s) => (
          <div
            key={s.id}
            className="group rounded-2xl bg-card/90 hover:bg-muted/70 border border-border p-3 space-y-2 transition-all hover:border-primary/40 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-base leading-none">{s.icon}</span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400">
                {s.trend}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-foreground block truncate">
                {s.name}
              </span>

              {/* Progress Bar with Gradient */}
              <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all duration-500`}
                  style={{ width: `${s.level}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold pt-0.5">
                <span>Mastery</span>
                <span className="font-bold text-foreground">{s.level}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
