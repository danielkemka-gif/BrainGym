"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Brain,
  Eye,
  FileQuestion,
  HelpCircle,
} from "lucide-react";
import {
  getLatestClaritySnapshot,
  getMemoryItems,
  getCommitments,
  AkucheClaritySnapshot,
  AkucheMemoryItem,
  AkucheCommitment,
} from "@/lib/akuche/memory-engine";

export default function MyClarityPage() {
  const [snapshot, setSnapshot] = useState<AkucheClaritySnapshot | null>(null);
  const [memories, setMemories] = useState<AkucheMemoryItem[]>([]);
  const [commitments, setCommitments] = useState<AkucheCommitment[]>([]);

  useEffect(() => {
    setSnapshot(getLatestClaritySnapshot());
    setMemories(getMemoryItems());
    setCommitments(getCommitments());
  }, []);

  const hasData =
    Boolean(snapshot) ||
    memories.length > 0 ||
    commitments.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-7 overflow-x-hidden px-3 sm:px-6 py-4 pb-28 text-foreground font-sans">
      {/* Header */}
      <div className="space-y-2 border-b border-border/60 pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition mb-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Compass className="h-4 w-4" />
          </span>
          <span className="text-xs font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
            MY CLARITY
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight">
          Personal Clarity Hub
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Revisit important insights, verified facts, active challenges, and open questions from your coaching conversations.
        </p>
      </div>

      {!hasData ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 sm:p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Lightbulb className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No Clarity Snapshot Recorded Yet
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            When you explore a business dilemma, career transition, or personal decision with Akuche, your key insights, discovered opportunities, and next moves will appear here.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/ask"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs"
            >
              <span>Start a Thinking Session</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Challenges I'm Working Through */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                Challenges I&apos;m Working Through
              </h2>
            </div>
            {snapshot && snapshot.majorChallenges.length > 0 ? (
              <ul className="space-y-2 text-xs">
                {snapshot.majorChallenges.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-foreground/90 leading-relaxed">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{typeof item === "string" ? item : item.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                No active obstacles flagged. Your current focus is clear.
              </p>
            )}
          </section>

          {/* Section 2: Important Things I've Discovered & Confirmed Facts */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                Confirmed Facts &amp; Grounded Realities
              </h2>
            </div>
            {memories.length > 0 ? (
              <div className="space-y-2">
                {memories.slice(0, 5).map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{mem.title}</span>
                      <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-emerald-600">
                        {mem.verificationStatus}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {mem.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No stored memories yet. As you talk with Akuche, confirmed facts will be organized here.
              </p>
            )}
          </section>

          {/* Section 3: Opportunities I've Identified */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Lightbulb className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                Opportunities Identified
              </h2>
            </div>
            {snapshot && snapshot.possibleOpportunities.length > 0 ? (
              <ul className="space-y-2 text-xs">
                {snapshot.possibleOpportunities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-foreground/90 leading-relaxed">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{typeof item === "string" ? item : item.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                Opportunities uncovered during strategy conversations will be tracked here.
              </p>
            )}
          </section>

          {/* Section 4: Recommended Next Actions */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Target className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                Recommended Next Actions
              </h2>
            </div>
            {snapshot && snapshot.recommendedNextActions.length > 0 ? (
              <ul className="space-y-2 text-xs">
                {snapshot.recommendedNextActions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-foreground/90 leading-relaxed">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                No outstanding action steps pending.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
