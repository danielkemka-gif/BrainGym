"use client";

import React, { useState, useEffect } from "react";
import {
  getPendingFollowUpCheckIn,
  resolveCommitment,
  AkucheFollowUpCheckIn,
  addCommitment,
} from "@/lib/akuche/memory-engine";
import { CheckCircle2, AlertTriangle, ArrowRight, X, Sparkles, RefreshCw, HelpCircle } from "lucide-react";
import Link from "next/link";

interface FollowUpCheckInProps {
  onResolved?: () => void;
}

export function FollowUpCheckIn({ onResolved }: FollowUpCheckInProps) {
  const [checkIn, setCheckIn] = useState<AkucheFollowUpCheckIn | null>(null);
  const [status, setStatus] = useState<"idle" | "obstacle_flow" | "resolved">("idle");
  const [obstacleInput, setObstacleInput] = useState("");
  const [resolvedMessage, setResolvedMessage] = useState("");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const item = getPendingFollowUpCheckIn();
    setCheckIn(item);
  }, []);

  if (!checkIn || dismissed) return null;

  const handleAction = (action: "done" | "partly_done" | "obstacle" | "pivoted" | "dismiss") => {
    if (action === "dismiss") {
      setDismissed(true);
      return;
    }

    if (action === "obstacle") {
      setStatus("obstacle_flow");
      return;
    }

    if (checkIn.type === "commitment") {
      resolveCommitment(checkIn.id, action);
    }

    if (action === "done") {
      setResolvedMessage("Brilliant work! Taking real action is what separates intention from progress. Keep this momentum going.");
    } else if (action === "partly_done") {
      setResolvedMessage("Good progress. Partial execution is still meaningful forward motion. What is the remaining piece to finish?");
    } else if (action === "pivoted") {
      setResolvedMessage("Smart adaptation. Knowing when to pivot is a key thinking superpower.");
    }

    setStatus("resolved");
    if (onResolved) onResolved();
  };

  const handleObstacleSubmit = () => {
    if (checkIn.type === "commitment") {
      resolveCommitment(
        checkIn.id,
        "obstacle",
        obstacleInput || "Encountered unexpected friction"
      );
    }

    setResolvedMessage(
      obstacleInput
        ? `Noted: "${obstacleInput}". Stumbling blocks are data, not failure. Let's adjust the plan to make the next step simpler.`
        : "Obstacle logged without judgment. Whenever you feel ready, we can break this into a smaller 5-minute task."
    );
    setStatus("resolved");
    if (onResolved) onResolved();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-card to-card p-5 shadow-lg shadow-emerald-950/5 animate-fade-in mb-6">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
        title="Dismiss for now"
      >
        <X className="h-4 w-4" />
      </button>

      {status === "idle" && (
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Continuity Follow-Up
            </span>
            <span className="text-xs text-muted-foreground">No judgment · Just clarity</span>
          </div>

          <div>
            <h3 className="text-base font-bold text-foreground">
              {checkIn.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {checkIn.prompt}
            </p>
          </div>

          {/* Action Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {checkIn.suggestedActions.map((act, idx) => (
              <button
                key={idx}
                onClick={() => handleAction(act.action)}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition border ${
                  act.action === "done"
                    ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700"
                    : act.action === "partly_done"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                    : act.action === "obstacle"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                    : "bg-muted/60 text-foreground border-border hover:bg-muted"
                }`}
              >
                {act.action === "done" && <CheckCircle2 className="h-3.5 w-3.5" />}
                {act.action === "obstacle" && <AlertTriangle className="h-3.5 w-3.5" />}
                {act.action === "partly_done" && <RefreshCw className="h-3.5 w-3.5" />}
                {act.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "obstacle_flow" && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              Diagnose the Friction
            </span>
          </div>
          <h3 className="text-sm font-bold text-foreground">
            What got in the way of completing this step?
          </h3>
          <p className="text-xs text-muted-foreground">
            Understanding friction points helps Akuche calibrate simpler, more realistic next moves.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {[
              "Ran out of time",
              "Unsure how to start",
              "Too complicated",
              "Procrastinated",
              "Waiting on someone else",
            ].map((reason) => (
              <button
                key={reason}
                onClick={() => setObstacleInput(reason)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  obstacleInput === reason
                    ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                    : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {reason}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Or type what happened..."
              value={obstacleInput}
              onChange={(e) => setObstacleInput(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleObstacleSubmit}
              className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              Update Plan
            </button>
          </div>
        </div>
      )}

      {status === "resolved" && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-bold">Follow-Up Recorded</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {resolvedMessage}
          </p>
          <div className="flex items-center justify-between pt-1">
            <Link
              href="/dashboard/think"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Explore new thinking session</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
