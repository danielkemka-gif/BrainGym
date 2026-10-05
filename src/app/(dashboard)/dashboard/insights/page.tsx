"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getPersonalInsights,
  getActionLogs,
  calculateActionStreak,
  AkuchePersonalInsight,
  AkucheActionLog,
} from "@/lib/akuche/memory-engine";
import { getDecisionRecords } from "@/lib/akuche/decisions-engine";
import { ContextualGuidanceBanner } from "@/components/layout/contextual-guidance-banner";
import {
  Sparkles,
  TrendingUp,
  Flame,
  CheckCircle2,
  Calendar,
  Search,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Zap,
  Target,
  Compass,
  Lightbulb,
} from "lucide-react";

export default function InsightsPage() {
  const [insights, setInsights] = useState<AkuchePersonalInsight[]>([]);
  const [logs, setLogs] = useState<AkucheActionLog[]>([]);
  const [streakData, setStreakData] = useState({ currentStreak: 1, bestStreak: 3, totalActionsCompleted: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"week" | "month" | "insights" | "learned" | "progress">("week");

  useEffect(() => {
    setInsights(getPersonalInsights());
    setLogs(getActionLogs());
    setStreakData(calculateActionStreak());
  }, []);

  const decisions = getDecisionRecords();
  const completedActionsCount = logs.filter((l) => l.type === "action" || l.type === "journey_step").length;
  const reflectionsCount = logs.filter((l) => l.type === "reflection").length;

  const filteredLogs = searchQuery.trim()
    ? logs.filter((l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.details && l.details.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : logs;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 overflow-x-hidden px-3 sm:px-4 py-3 pb-24 touch-manipulation">
      <ContextualGuidanceBanner
        featureKey="insights"
        title="Personal Insights & Trajectory Reviews"
        description="Discover behavioral patterns, review your weekly momentum, and objectively measure your execution vs planned intentions."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Akuche Insights &amp; Reviews
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Turn daily execution into long-term self-knowledge and measurable wisdom.
          </p>
        </div>

        {/* Action Streak Indicator */}
        <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card px-3.5 py-2 shadow-xs">
          <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
          <div>
            <span className="text-xs font-black text-foreground block leading-none">
              {streakData.currentStreak}-Day Action Streak
            </span>
            <span className="text-[10px] text-muted-foreground">
              {streakData.totalActionsCompleted} actions completed
            </span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab("week")}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
            activeTab === "week"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
          }`}
        >
          Your Week
        </button>
        <button
          onClick={() => setActiveTab("month")}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
            activeTab === "month"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
          }`}
        >
          Your Month
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
            activeTab === "insights"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
          }`}
        >
          Personal Insights ({insights.length})
        </button>
        <button
          onClick={() => setActiveTab("learned")}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
            activeTab === "learned"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
          }`}
        >
          What Have I Learned?
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
            activeTab === "progress"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
          }`}
        >
          Am I Making Progress?
        </button>
      </div>

      {/* ─── TAB 1: YOUR WEEK WITH AKUCHE (SECTION 42) ─── */}
      {activeTab === "week" && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-3xl border-2 border-emerald-500/30 bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-black text-white">
                <Calendar className="h-3.5 w-3.5" />
                YOUR WEEK WITH AKUCHE
              </span>
              <span className="text-xs text-muted-foreground font-semibold">Weekly Synthesis</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
                <span className="text-xl sm:text-2xl font-black text-foreground block">
                  {completedActionsCount}
                </span>
                <span className="text-[11px] text-muted-foreground">Actions Executed</span>
              </div>
              <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                  {decisions.length}
                </span>
                <span className="text-[11px] text-muted-foreground">Decisions Evaluated</span>
              </div>
              <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
                <span className="text-xl sm:text-2xl font-black text-amber-500 block">
                  {streakData.currentStreak}d
                </span>
                <span className="text-[11px] text-muted-foreground">Action Streak</span>
              </div>
              <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
                <span className="text-xl sm:text-2xl font-black text-foreground block">
                  {reflectionsCount}
                </span>
                <span className="text-[11px] text-muted-foreground">Reflections Logged</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
                <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  What Changed This Week?
                </h4>
                <p className="text-xs text-foreground leading-relaxed">
                  You converted high-level goals into direct outreach milestones. By identifying your core high-value skill and testing offers directly, you eliminated speculative guesswork.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
                <h4 className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                  What Needs Attention?
                </h4>
                <p className="text-xs text-foreground leading-relaxed">
                  Focus on closing active discovery conversations with 48-hour incentive pricing rather than opening too many new cold chats simultaneously.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 space-y-1">
                <h4 className="text-xs font-black text-foreground uppercase tracking-wider">
                  Next Week&apos;s Recommended Priority
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Execute 5 warm client check-ins and collect your first 50% pilot deposit before Thursday.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: YOUR MONTH (SECTION 43) ─── */}
      {activeTab === "month" && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-black text-white">
                <Sparkles className="h-3.5 w-3.5" />
                MONTHLY TRAJECTORY REVIEW
              </span>
              <span className="text-xs text-muted-foreground font-semibold">30-Day View</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Akuche compares your planned commitments against completed actions over the last 30 days.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-background/60">
                <span className="text-xs font-bold text-foreground">Strategic Clarity</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">High (92%)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-background/60">
                <span className="text-xs font-bold text-foreground">Action Velocity ($R = P \times Q$)</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Consistent</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-background/60">
                <span className="text-xs font-bold text-foreground">Decision Follow-Through</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">100% Locked</span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1.5">
              <span className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                3 Priorities for Next Month:
              </span>
              <ul className="list-disc list-inside text-xs text-foreground space-y-1">
                <li>Scale from single pilot projects to standard monthly retainer agreements.</li>
                <li>Implement a 2-minute daily reflection rhythm before 7:00 PM.</li>
                <li>Conduct your 30-day Decision Lab retrospective reviews.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: PERSONAL INSIGHTS (SECTIONS 23 & 25) ─── */}
      {activeTab === "insights" && (
        <div className="space-y-3 animate-fade-in">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-2 hover:border-emerald-500/30 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                    {ins.category}
                  </span>
                  <h4 className="text-sm font-bold text-foreground">{ins.title}</h4>
                </div>
                <span className="text-[10px] text-muted-foreground">Pattern Unlocked</span>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed">
                {ins.observation}
              </p>

              <div className="rounded-xl bg-muted/30 p-2.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Recommendation: </span>
                {ins.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 4: WHAT HAVE I LEARNED? (SECTION 45) ─── */}
      {activeTab === "learned" && (
        <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-black text-foreground">
              What Akuche Has Learned About You
            </h3>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Synthesized from your completed challenges, decision matrices, and reflections over time:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl border border-border/70 bg-background/60 space-y-1">
              <span className="font-bold text-foreground block">
                1. Core Execution Strength: Reverse-Engineering Math
              </span>
              <p className="text-muted-foreground">
                You experience immediate relief from overwhelm when abstract goals are broken into numerical pipelines ($R = P \times Q$).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-border/70 bg-background/60 space-y-1">
              <span className="font-bold text-foreground block">
                2. Decision Pattern: Reversible Experimentation
              </span>
              <p className="text-muted-foreground">
                You make the soundest commitments when you design 24-hour low-risk micro-experiments before making irreversible moves.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-border/70 bg-background/60 space-y-1">
              <span className="font-bold text-foreground block">
                3. Growth Lever: Direct Outreach Over Speculation
              </span>
              <p className="text-muted-foreground">
                Your highest-velocity results occur during direct 1-on-1 conversations rather than passive digital preparation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: AM I MAKING PROGRESS? (SECTION 46) ─── */}
      {activeTab === "progress" && (
        <div className="rounded-3xl border-2 border-emerald-500/30 bg-card p-5 sm:p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-black text-foreground">
                Objective Reality Check
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-semibold">Honest Evaluation</span>
          </div>

          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-2 text-xs">
            <p className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
              Yes. You are converting thought into action.
            </p>
            <p className="text-foreground leading-relaxed">
              You have maintained an active {streakData.currentStreak}-day action streak and executed {streakData.totalActionsCompleted} real-world milestones. Your focus is moving in the right direction.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
              Where to tighten the system:
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Do not let completed actions linger without logging outcomes. When you finish a task, log it immediately to trigger your next logical step.
            </p>
          </div>

          <Link
            href="/dashboard/ask?prompt=Am I making real progress on my income and business goals, and what is my biggest bottleneck?"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <span>Ask Akuche for a deeper analytical breakdown</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* ─── SMART SEARCH & ACTION LOGS TIMELINE (SECTION 26) ─── */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
            Execution Timeline &amp; Activity Log ({logs.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past actions, notes..."
              className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-6 text-center text-xs text-muted-foreground">
            No activities match your search.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-card/80 p-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <span className="font-bold text-foreground block">{log.title}</span>
                    {log.details && (
                      <span className="text-muted-foreground text-[11px] block mt-0.5">
                        {log.details}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-muted-foreground shrink-0">{log.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
