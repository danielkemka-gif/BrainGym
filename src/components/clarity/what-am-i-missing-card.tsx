"use client";

import React, { useState } from "react";
import {
  WhatAmIMissingAnalysis,
  analyzeWhatAmIMissing,
} from "@/lib/akuche/what-am-i-missing";
import { saveMemoryItem } from "@/lib/akuche/memory-engine";
import {
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
} from "lucide-react";
import Link from "next/link";

interface WhatAmIMissingCardProps {
  initialPrompt?: string;
  domain?: "business" | "career" | "potential" | "life";
  onSavedToMap?: () => void;
}

export function WhatAmIMissingCard({
  initialPrompt = "",
  domain,
  onSavedToMap,
}: WhatAmIMissingCardProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [analysis, setAnalysis] = useState<WhatAmIMissingAnalysis | null>(() =>
    initialPrompt.trim() ? analyzeWhatAmIMissing(initialPrompt, domain) : null
  );
  const [loading, setLoading] = useState(false);
  const [sourceLabel, setSourceLabel] = useState<"ai" | "local" | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/ai/blindspots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: prompt.trim(), domain }),
      });
      if (res.ok) {
        const data = await res.json();
        const a = data.analysis;
        if (a && Array.isArray(a.blindSpots)) {
          setAnalysis({
            situationSummary: prompt.trim().slice(0, 120),
            domain: domain || "general",
            missingInformation: Array.isArray(a.missingQuestions) ? a.missingQuestions : [],
            hiddenAssumptions: Array.isArray(a.assumptions) ? a.assumptions : [],
            alternativeExplanations: Array.isArray(a.alternativeInterpretations)
              ? a.alternativeInterpretations
              : [],
            potentialBlindSpots: Array.isArray(a.blindSpots) ? a.blindSpots : [],
            unexaminedRisks: [],
            conflictingPriorities: [],
            singlePriorityQuestion:
              (Array.isArray(a.missingQuestions) && a.missingQuestions[0]) ||
              "What single assumption needs to be verified before you commit?",
            suggestedAction:
              typeof a.smallestTest === "string"
                ? a.smallestTest
                : "Test your riskiest assumption on a small scale within 48 hours.",
          });
          setSourceLabel(data.responseSource === "live_ai" ? "ai" : "local");
          setExpanded(true);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fall back gracefully to local structured engine
    }
    const localRes = analyzeWhatAmIMissing(prompt, domain);
    setAnalysis(localRes);
    setSourceLabel("local");
    setExpanded(true);
    setLoading(false);
  };

  const handleSaveToMap = () => {
    if (!analysis) return;
    saveMemoryItem({
      category: "pattern",
      title: `What Am I Missing: ${analysis.situationSummary.slice(0, 45)}...`,
      content: `Hidden Assumptions: ${analysis.hiddenAssumptions.join(" | ")}. Alternative Explanations: ${analysis.alternativeExplanations.join(" | ")}. Priority Question: ${analysis.singlePriorityQuestion}`,
      confidence: 0.9,
      verificationStatus: "confirmed",
      sourceContext: "What Am I Missing Intelligence Engine",
    });
    setSaved(true);
    onSavedToMap?.();
  };

  return (
    <div className="rounded-2xl border-2 border-amber-500/25 bg-gradient-to-br from-card via-amber-950/10 to-card p-4 sm:p-5 shadow-md">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black tracking-wide text-foreground uppercase">
                What Am I Missing?
              </h3>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Signature Intelligence
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Expose hidden assumptions, unexamined risks & blind spots before deciding
            </p>
          </div>
        </div>

        {analysis && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Input Form if not analyzed yet or wants to re-analyze */}
      {!analysis && (
        <form onSubmit={handleAnalyze} className="space-y-3 mt-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your current challenge, proposal, or stuck point (e.g. 'I keep sending proposals but no one is buying' or 'I feel burned out at my job')..."
            rows={3}
            className="w-full rounded-xl border bg-background/80 p-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 text-xs font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {loading
                ? "Analyzing Blind Spots..."
                : "Expose Blind Spots & What I'm Missing"}
            </span>
          </button>
        </form>
      )}

      {/* Analysis Results */}
      {analysis && expanded && (
        <div className="space-y-3 mt-3 pt-3 border-t">
          {/* 1. Missing Information */}
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
              <Eye className="h-3.5 w-3.5" />
              <span>Missing Information You May Need</span>
            </div>
            <ul className="space-y-1 text-xs text-foreground/90 pl-5 list-disc">
              {analysis.missingInformation.map((info, i) => (
                <li key={i}>{info}</li>
              ))}
            </ul>
          </div>

          {/* 2. Hidden Assumptions */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Hidden Assumptions Taken for Granted</span>
            </div>
            <ul className="space-y-1 text-xs text-foreground/90 pl-5 list-disc">
              {analysis.hiddenAssumptions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 3. Alternative Explanations */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Alternative Explanations Worth Considering</span>
            </div>
            <ul className="space-y-1 text-xs text-foreground/90 pl-5 list-disc">
              {analysis.alternativeExplanations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 4. Priority Diagnostic Question */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>The #1 Purposeful Question to Investigate First</span>
            </div>
            <p className="text-sm font-semibold text-foreground italic">
              &ldquo;{analysis.singlePriorityQuestion}&rdquo;
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={handleSaveToMap}
              disabled={saved}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 disabled:opacity-60 transition"
            >
              {saved ? (
                <>
                  <BookmarkCheck className="h-4 w-4 text-emerald-500" />
                  <span>Saved to Clarity Map</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Save to Clarity Map</span>
                </>
              )}
            </button>

            <Link
              href={`/dashboard/ask?prompt=${encodeURIComponent(analysis.singlePriorityQuestion)}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition"
            >
              <span>Explore This in Conversation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
