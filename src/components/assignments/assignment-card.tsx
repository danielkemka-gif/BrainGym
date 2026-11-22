"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  CalendarClock,
  MessageSquare,
  Shrink,
  XCircle,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";

export interface AkucheAssignment {
  id: string;
  goal_id?: string | null;
  title: string;
  why_it_matters: string;
  what_to_do: string;
  instructions: string[];
  expected_outcome?: string | null;
  estimated_duration_mins: number;
  deadline?: string | null;
  priority: "low" | "medium" | "high";
  domain: string;
  status:
    | "proposed"
    | "accepted"
    | "in_progress"
    | "completed"
    | "postponed"
    | "blocked"
    | "abandoned";
  blocker_reason?: string | null;
  abandon_reason?: string | null;
  completion_feedback?: string | null;
  outcome_rating?: number | null;
  completed_at?: string | null;
  created_at: string;
}

interface AssignmentCardProps {
  assignment: AkucheAssignment;
  onUpdated: (updated?: AkucheAssignment, supportiveNote?: string) => void;
  compact?: boolean;
}

const STATUS_BADGE: Record<AkucheAssignment["status"], { label: string; cls: string }> = {
  proposed: { label: "Proposed", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  accepted: { label: "Active", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  in_progress: { label: "In Progress", cls: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30" },
  completed: { label: "Completed", cls: "bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-600/40" },
  postponed: { label: "Postponed", cls: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30" },
  blocked: { label: "Blocked", cls: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30" },
  abandoned: { label: "Dropped", cls: "bg-muted text-muted-foreground border-border" },
};

export function AssignmentCard({ assignment, onUpdated, compact = false }: AssignmentCardProps) {
  const [expanded, setExpanded] = useState(!compact);
  const [busy, setBusy] = useState(false);
  const [activeAction, setActiveAction] = useState<
    null | "complete" | "block" | "abandon" | "modify"
  >(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(4);
  const [reason, setReason] = useState("");
  const [editTitle, setEditTitle] = useState(assignment.title);
  const [editAction, setEditAction] = useState(assignment.what_to_do);
  const [editMins, setEditMins] = useState(assignment.estimated_duration_mins);

  async function runAction(payload: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/assignments/${assignment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveAction(null);
        setFeedback("");
        setReason("");
        onUpdated(data.assignment, data.supportiveNote);
      }
    } finally {
      setBusy(false);
    }
  }

  const badge = STATUS_BADGE[assignment.status] || STATUS_BADGE.accepted;
  const isFinished = assignment.status === "completed" || assignment.status === "abandoned";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition hover:border-emerald-500/30">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
              {badge.label}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {assignment.estimated_duration_mins} min
            </span>
            <span className="text-xs capitalize text-muted-foreground">
              · {assignment.domain}
            </span>
            {assignment.deadline && !isFinished && (
              <span className="text-xs text-muted-foreground">
                · Due {new Date(assignment.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-foreground leading-snug">
            {assignment.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {assignment.what_to_do}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse assignment details" : "Expand assignment details"}
          className="shrink-0 rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-border/60 pt-3">
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Why It Matters
            </p>
            <p className="mt-0.5 text-sm text-foreground">{assignment.why_it_matters}</p>
          </div>

          {Array.isArray(assignment.instructions) && assignment.instructions.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Simple Steps
              </p>
              <ol className="space-y-1.5 pl-4 list-decimal text-sm text-foreground/90">
                {assignment.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {assignment.expected_outcome && (
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Expected outcome:</strong> {assignment.expected_outcome}
            </p>
          )}

          {assignment.status === "blocked" && assignment.blocker_reason && (
            <div className="rounded-xl bg-orange-500/10 border border-orange-500/25 p-3 text-xs text-orange-800 dark:text-orange-200">
              <strong>Blocker noted:</strong> {assignment.blocker_reason}
            </div>
          )}

          {assignment.status === "completed" && assignment.completion_feedback && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-900 dark:text-emerald-200">
              <strong>What you learned:</strong> {assignment.completion_feedback}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!isFinished && (
        <div className="mt-4 flex flex-wrap gap-2">
          {assignment.status === "proposed" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => runAction({ action: "accept" })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 min-h-[40px]"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Accept Assignment
            </button>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => setActiveAction(activeAction === "complete" ? null : "complete")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 min-h-[40px]"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Complete
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => runAction({ action: "smaller_version" })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 min-h-[40px]"
          >
            <Shrink className="h-3.5 w-3.5 text-emerald-600" />
            Smaller Version
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => runAction({ action: "postpone", days: 2 })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 min-h-[40px]"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Postpone +2d
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => setActiveAction(activeAction === "modify" ? null : "modify")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 min-h-[40px]"
          >
            <Pencil className="h-3.5 w-3.5" />
            Modify
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => setActiveAction(activeAction === "block" ? null : "block")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 min-h-[40px]"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
            Blocked
          </button>

          <Link
            href={`/dashboard/ask?mode=accountability&prompt=${encodeURIComponent(
              `I need help with my assignment: "${assignment.title}". Here is where I'm stuck:`
            )}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 min-h-[40px]"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Ask Coach
          </Link>

          <button
            type="button"
            disabled={busy}
            onClick={() => setActiveAction(activeAction === "abandon" ? null : "abandon")}
            className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground min-h-[40px]"
          >
            <XCircle className="h-3.5 w-3.5" />
            Drop
          </button>
        </div>
      )}

      {/* Inline Sub-Panels for Complete / Block / Abandon / Modify */}
      {activeAction === "complete" && (
        <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-3">
          <p className="text-xs font-bold text-foreground">
            Quick outcome check (saved to your journey):
          </p>
          <textarea
            rows={2}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What happened? What worked or surprised you?"
            className="w-full rounded-xl border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Usefulness:</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold border ${
                    rating === n
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                runAction({
                  action: "complete",
                  completion_feedback: feedback,
                  outcome_rating: rating,
                })
              }
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save & Mark Complete"}
            </button>
          </div>
        </div>
      )}

      {activeAction === "block" && (
        <div className="mt-3 rounded-xl border border-orange-500/30 bg-orange-500/5 p-3.5 space-y-2.5">
          <p className="text-xs font-semibold text-foreground">
            What got in the way? (No judgment—naming the blocker helps us adapt it.)
          </p>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Waiting on a response, too busy this week, unsure how to word it..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => runAction({ action: "block", blocker_reason: reason })}
            className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            Save Blocker
          </button>
        </div>
      )}

      {activeAction === "abandon" && (
        <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3.5 space-y-2.5">
          <p className="text-xs font-semibold text-foreground">
            Why are you dropping this assignment? (Helps Akuche learn what fits you.)
          </p>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Priorities changed, no longer relevant..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => runAction({ action: "abandon", abandon_reason: reason })}
            className="rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background disabled:opacity-50"
          >
            Confirm Drop
          </button>
        </div>
      )}

      {activeAction === "modify" && (
        <div className="mt-3 rounded-xl border border-border bg-muted/30 p-3.5 space-y-2.5">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium"
            placeholder="Assignment title"
          />
          <textarea
            rows={2}
            value={editAction}
            onChange={(e) => setEditAction(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            placeholder="What you will do"
          />
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs text-muted-foreground flex items-center gap-2">
              Est. minutes:
              <input
                type="number"
                min={5}
                max={240}
                value={editMins}
                onChange={(e) => setEditMins(Number(e.target.value) || 15)}
                className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground"
              />
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                runAction({
                  action: "modify",
                  title: editTitle,
                  what_to_do: editAction,
                  estimated_duration_mins: editMins,
                })
              }
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {assignment.status === "completed" && (
        <div className="mt-3 pt-2 border-t border-border/50 flex justify-end">
          <Link
            href={`/dashboard/share?milestone=problem_solved&summary=${encodeURIComponent(
              `Completed: ${assignment.title}. ${assignment.completion_feedback || ""}`
            )}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Share this milestone
          </Link>
        </div>
      )}
    </div>
  );
}
