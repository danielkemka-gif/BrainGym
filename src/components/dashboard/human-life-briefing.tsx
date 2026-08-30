"use client";

import { useState } from "react";
import {
  HUMAN_BRAIN_BRIEFINGS,
  HumanBrainBriefing,
  HumanLifePillar,
} from "@/lib/human-intelligence";
import {
  Briefcase,
  TrendingUp,
  GraduationCap,
  Heart,
  DollarSign,
  Users,
  Sparkles,
  Zap,
  CheckCircle2,
  Quote,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export function HumanLifeBriefing() {
  const { user } = useAuth();
  const [selectedPillar, setSelectedPillar] = useState<HumanLifePillar>("career_work");
  const [appliedPillars, setAppliedPillars] = useState<string[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);

  const activeBriefing =
    HUMAN_BRAIN_BRIEFINGS.find((b) => b.pillar === selectedPillar) ||
    HUMAN_BRAIN_BRIEFINGS[0];

  const isApplied = appliedPillars.includes(activeBriefing.id);

  const handleApplyAction = async () => {
    if (isApplied) return;
    setLoadingAction(true);

    setAppliedPillars((prev) => [...prev, activeBriefing.id]);

    if (user?.id) {
      try {
        const supabase = createClient();
        await supabase.from("xp_ledger").insert({
          user_id: user.id,
          amount: activeBriefing.xpReward,
          source_type: "human_brain_briefing_action",
          source_id: activeBriefing.id,
          description: `Applied Daily Human Action: ${activeBriefing.dailyHeadline}`,
        });

        const { data: profile } = await supabase
          .from("profiles")
          .select("total_xp")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ total_xp: (profile.total_xp || 0) + activeBriefing.xpReward })
            .eq("user_id", user.id);
        }
      } catch (err) {
        console.warn("XP sync fallback:", err);
      }
    }
    setLoadingAction(false);
  };

  const pillarsList: {
    id: HumanLifePillar;
    label: string;
    icon: any;
    color: string;
  }[] = [
    { id: "career_work", label: "Work & Career", icon: Briefcase, color: "text-blue-500" },
    { id: "business_entrepreneur", label: "Business & Trade", icon: TrendingUp, color: "text-emerald-500" },
    { id: "student_academic", label: "Study & Exams", icon: GraduationCap, color: "text-indigo-500" },
    { id: "family_parenting", label: "Family & Home", icon: Heart, color: "text-rose-500" },
    { id: "finance_wealth", label: "Finance & Money", icon: DollarSign, color: "text-amber-500" },
    { id: "relationships_empathy", label: "Relationships", icon: Users, color: "text-violet-500" },
    { id: "personal_development", label: "Mindset & Habits", icon: Sparkles, color: "text-teal-500" },
  ];

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-card via-background to-primary/5 p-5 sm:p-7 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Vital Daily Intelligence For Real Human Life
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Daily Human Brain Briefing
          </h2>
          <p className="text-xs text-muted-foreground">
            Practical brain wisdom tailored to your work, business, family, and personal growth.
          </p>
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 w-fit">
          {activeBriefing.roleTarget}
        </span>
      </div>

      {/* Role & Life Pillar Switcher Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {pillarsList.map((p) => {
          const Icon = p.icon;
          const isActive = selectedPillar === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPillar(p.id)}
              className={`inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-black whitespace-nowrap transition active:scale-95 border min-h-[38px] ${
                isActive
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : p.color}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── BRIEFING CARD CONTENT ───────────────────────────────────────────── */}
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Headline */}
        <h3 className="text-lg sm:text-xl font-black text-foreground leading-snug">
          {activeBriefing.dailyHeadline}
        </h3>

        {/* 1. Real-Life Dilemma */}
        <div className="rounded-2xl border border-border bg-card/80 p-4 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" />
            THE REAL-LIFE SITUATION
          </span>
          <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
            {activeBriefing.realLifeScenario}
          </p>
        </div>

        {/* 2. The Brain Secret */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-primary fill-primary" />
            THE BRAIN SECRET (WHY THIS HAPPENS)
          </span>
          <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
            {activeBriefing.theBrainSecret}
          </p>
        </div>

        {/* 3. Cultural Wisdom / Proverb */}
        {activeBriefing.culturalWisdom && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1">
                <Quote className="h-3.5 w-3.5" />
                CULTURAL WISDOM
              </span>
              <span>{activeBriefing.culturalWisdom.origin}</span>
            </div>
            <p className="text-xs sm:text-sm font-black text-foreground italic">
              &ldquo;{activeBriefing.culturalWisdom.quote}&rdquo;
            </p>
            <p className="text-[11px] text-muted-foreground">
              {activeBriefing.culturalWisdom.cognitiveMeaning}
            </p>
          </div>
        )}

        {/* 4. The 2-Minute Practical Action Box */}
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-background to-teal-500/15 p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              THE 2-MINUTE ACTION TO APPLY TODAY
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">
              +{activeBriefing.xpReward} XP Reward
            </span>
          </div>

          <p className="text-xs sm:text-sm text-foreground font-bold leading-relaxed">
            {activeBriefing.theTwoMinuteAction}
          </p>

          <button
            onClick={handleApplyAction}
            disabled={isApplied || loadingAction}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-black transition min-h-[46px] active:scale-[0.98] ${
              isApplied
                ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 cursor-default"
                : "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 hover:brightness-110"
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>APPLIED TO MY DAY (+{activeBriefing.xpReward} XP EARNED)</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>I WILL APPLY THIS IN MY LIFE TODAY</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
