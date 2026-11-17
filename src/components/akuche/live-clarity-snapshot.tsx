"use client";

import React, { useState } from "react";
import {
  AkucheClaritySnapshot,
  AkucheThinkingMirrorPattern,
  saveMemoryItem,
} from "@/lib/akuche/memory-engine";
import {
  Compass,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Eye,
  Lightbulb,
  ArrowRight,
  Brain,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

interface LiveClaritySnapshotProps {
  snapshot: AkucheClaritySnapshot | null;
  thinkingMirror?: AkucheThinkingMirrorPattern | null;
  compact?: boolean;
  onMemoryConfirmed?: () => void;
}

export function LiveClaritySnapshot({
  snapshot,
  thinkingMirror,
  compact = false,
  onMemoryConfirmed,
}: LiveClaritySnapshotProps) {
  const [expanded, setExpanded] = useState(!compact);
  const [confirmedTexts, setConfirmedTexts] = useState<Record<string, boolean>>({});

  if (!snapshot && !thinkingMirror) {
    return null;
  }

  const handleConfirmInterpretation = (
    text: string,
    category: "goal" | "profile" | "project" | "decision" | "commitment" | "pattern"
  ) => {
    saveMemoryItem({
      category,
      title: category === "goal" ? "Confirmed Opportunity / Goal" : "Confirmed Context",
      content: text,
      confidence: 1.0,
      verificationStatus: "confirmed",
      sourceContext: "Live Clarity Snapshot (User Confirmed)",
    });
    setConfirmedTexts((prev) => ({ ...prev, [text]: true }));
    onMemoryConfirmed?.();
  };

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-slate-900/95 via-indigo-950/30 to-slate-900/95 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide text-white uppercase">
                Live Clarity Snapshot
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Separating <span className="text-emerald-300 font-medium">Confirmed Facts</span> from{" "}
              <span className="text-amber-300 font-medium">AI Interpretations</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 rounded-lg border border-slate-700/70 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          {expanded ? (
            <>
              <span>Hide</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>Inspect</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {/* What You Are Currently Dealing With */}
      {snapshot && (
        <div className="mt-3 rounded-xl bg-slate-950/60 border border-slate-800/80 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300 mb-1.5">
            What You Are Currently Dealing With ({snapshot.subject})
          </div>
          <ul className="space-y-1.5">
            {snapshot.currentlyDealingWith.map((item, idx) => {
              const isConfirmed = item.source === "confirmed" || confirmedTexts[item.text];
              return (
                <li key={idx} className="text-xs sm:text-sm text-slate-200 flex items-start justify-between gap-2">
                  <span className="leading-relaxed">• {item.text}</span>
                  <StatusBadge
                    isConfirmed={isConfirmed}
                    onConfirm={() => handleConfirmInterpretation(item.text, "project")}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && snapshot && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Major Challenges */}
          <div className="rounded-xl bg-slate-900/70 border border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 mb-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Major Challenges</span>
            </div>
            <ul className="space-y-2">
              {snapshot.majorChallenges.map((item, idx) => {
                const isConfirmed = item.source === "confirmed" || confirmedTexts[item.text];
                return (
                  <li key={idx} className="text-xs text-slate-300 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="leading-relaxed">• {item.text}</span>
                      <StatusBadge
                        isConfirmed={isConfirmed}
                        onConfirm={() => handleConfirmInterpretation(item.text, "project")}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Areas Requiring Attention */}
          <div className="rounded-xl bg-slate-900/70 border border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-2">
              <Eye className="h-3.5 w-3.5" />
              <span>Areas Requiring Attention</span>
            </div>
            <ul className="space-y-2">
              {snapshot.areasRequiringAttention.map((item, idx) => {
                const isConfirmed = item.source === "confirmed" || confirmedTexts[item.text];
                return (
                  <li key={idx} className="text-xs text-slate-300 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="leading-relaxed">• {item.text}</span>
                      <StatusBadge
                        isConfirmed={isConfirmed}
                        onConfirm={() => handleConfirmInterpretation(item.text, "decision")}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Possible Opportunities */}
          <div className="rounded-xl bg-slate-900/70 border border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-2">
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Possible Opportunities</span>
            </div>
            <ul className="space-y-2">
              {snapshot.possibleOpportunities.map((item, idx) => {
                const isConfirmed = item.source === "confirmed" || confirmedTexts[item.text];
                return (
                  <li key={idx} className="text-xs text-slate-300 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="leading-relaxed">• {item.text}</span>
                      <StatusBadge
                        isConfirmed={isConfirmed}
                        onConfirm={() => handleConfirmInterpretation(item.text, "goal")}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Recommended Next Actions */}
          <div className="rounded-xl bg-slate-900/70 border border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-2">
              <ArrowRight className="h-3.5 w-3.5" />
              <span>Recommended Next Actions</span>
            </div>
            <ul className="space-y-1.5">
              {snapshot.recommendedNextActions.map((action, idx) => (
                <li key={idx} className="text-xs text-slate-200 leading-relaxed flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Thinking Mirror Observation (Signature System #2) */}
      {thinkingMirror && (
        <div className="mt-3 rounded-xl border border-purple-500/30 bg-purple-950/25 p-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
              <Brain className="h-3.5 w-3.5" />
              <span>THINKING MIRROR: {thinkingMirror.patternName}</span>
            </div>
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-200 border border-purple-500/30">
              {thinkingMirror.type === "blind_spot"
                ? "Potential Blind Spot"
                : thinkingMirror.type === "strength"
                ? "Cognitive Strength"
                : "Decision Habit"}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{thinkingMirror.observation}</p>
          <p className="mt-1.5 text-xs font-medium text-purple-200 italic">
            Self-Reflection Prompt: &ldquo;{thinkingMirror.selfAwarenessPrompt}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  isConfirmed,
  onConfirm,
}: {
  isConfirmed: boolean;
  onConfirm: () => void;
}) {
  if (isConfirmed) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
        <CheckCircle2 className="h-2.5 w-2.5" />
        Confirmed
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
        <Sparkles className="h-2.5 w-2.5" />
        AI Interpreted
      </span>
      <button
        type="button"
        onClick={onConfirm}
        title="Confirm this matches your real situation"
        className="inline-flex items-center gap-0.5 rounded-md bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500/40 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 hover:text-emerald-200 transition"
      >
        <Check className="h-2.5 w-2.5" />
        Confirm
      </button>
    </span>
  );
}
