"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  COGNITIVE_DOMAINS,
  CognitiveDomainId,
  COGNITIVE_RANKS,
  getRankByScore,
} from "@/lib/cognitive-matrix";
import { useAuth } from "@/lib/auth";
import {
  Brain,
  Zap,
  Target,
  BookOpen,
  Search,
  Scale,
  RefreshCw,
  MessageSquare,
  Hash,
  Puzzle,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Shield,
  Lightbulb,
} from "lucide-react";

interface DomainScore {
  domainId: CognitiveDomainId;
  score: number; // 0 to 100
}

export function CognitiveProfileRadar() {
  const { user, supabase } = useAuth();
  const [domainScores, setDomainScores] = useState<Record<CognitiveDomainId, number>>({
    processing_speed: 78,
    working_memory: 84,
    attention_focus: 71,
    learn_recall: 80,
    logical_reasoning: 89,
    decision_making: 74,
    mental_flexibility: 82,
    verbal_reasoning: 76,
    numerical_reasoning: 85,
    problem_solving: 79,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await supabase
          .from("brain_scores")
          .select("category_id, score")
          .eq("user_id", user.id);

        if (data && data.length > 0) {
          const updated = { ...domainScores };
          setDomainScores(updated);
        }
      } catch (err) {
        console.warn("Load brain scores warning:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, supabase]);

  const scoresList = Object.entries(domainScores) as [CognitiveDomainId, number][];
  const averageScore = Math.round(
    scoresList.reduce((sum, [, score]) => sum + score, 0) / scoresList.length
  );
  const currentRank = getRankByScore(averageScore);

  // Find Strongest & Growth Opportunity
  const sorted = [...scoresList].sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0];
  const growthOpp = sorted[sorted.length - 1];

  const strongestDomain = COGNITIVE_DOMAINS[strongest[0]];
  const growthDomain = COGNITIVE_DOMAINS[growthOpp[0]];

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-violet-500/20">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <span>Personalized Cognitive Profile</span>
              <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-bold text-violet-600 dark:text-violet-400">
                10 Pillars
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Dynamic neural assessment calibrated across all 10 cognitive domains
            </p>
          </div>
        </div>

        {/* Cognitive Rank Badge */}
        <div className="flex items-center gap-2 rounded-2xl bg-muted/60 border border-border px-3.5 py-2">
          <span className="text-2xl">{currentRank.emoji}</span>
          <div className="text-left">
            <span className="block text-[10px] uppercase font-bold text-muted-foreground">
              Cognitive Rank
            </span>
            <span className="text-xs sm:text-sm font-black text-foreground">
              Level {currentRank.level}: {currentRank.title}
            </span>
          </div>
        </div>
      </div>

      {/* Highlights: Strongest Skill, Growth Opportunity, Current Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-green-700 dark:text-green-300 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Strongest Skill
          </span>
          <p className="text-sm font-black text-foreground">
            {strongestDomain.name} ({strongest[1]}/100)
          </p>
          <p className="text-[11px] text-muted-foreground">{strongestDomain.badgeTitle}</p>
        </div>

        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Growth Opportunity
          </span>
          <p className="text-sm font-black text-foreground">
            {growthDomain.name} ({growthOpp[1]}/100)
          </p>
          <p className="text-[11px] text-muted-foreground">Targeted for today&apos;s workout</p>
        </div>

        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
            <Target className="h-3 w-3" /> Current Focus
          </span>
          <p className="text-sm font-black text-foreground">Avoiding Impulsive Answers</p>
          <p className="text-[11px] text-muted-foreground">Pause &amp; test all constraints</p>
        </div>
      </div>

      {/* 10-Pillar Interactive Visual Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Cognitive Domain Breakdown</span>
          <span>Index Score</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {scoresList.map(([domainId, score]) => {
            const domain = COGNITIVE_DOMAINS[domainId];
            return (
              <div
                key={domainId}
                className="rounded-xl border border-border/80 bg-card/60 p-3 space-y-2 hover:border-primary/40 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{domain.badgeEmoji}</span>
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-none">
                        {domain.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">{domain.tagline}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-foreground">{score}</span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, backgroundColor: domain.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/dashboard/training"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-4 text-xs sm:text-sm font-bold shadow-md hover:brightness-105 transition min-h-[44px] touch-manipulation active:scale-95"
        >
          <Zap className="h-4 w-4" /> Start 6-Step Daily Training Loop
        </Link>
        <Link
          href="/dashboard/decision-lab"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-3 px-4 text-xs sm:text-sm font-bold text-foreground hover:bg-accent transition min-h-[44px] touch-manipulation active:scale-95"
        >
          <Scale className="h-4 w-4" /> Decision Lab
        </Link>
      </div>
    </div>
  );
}
