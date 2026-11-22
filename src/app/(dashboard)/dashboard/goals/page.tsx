"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  Plus,
  Target,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AssignmentCard, type AkucheAssignment } from "@/components/assignments/assignment-card";

interface AkucheGoal {
  id: string;
  title: string;
  description?: string | null;
  domain: string;
  status: "active" | "paused" | "completed" | "archived";
  target_date?: string | null;
  progress_percent: number;
  created_at: string;
}

const DOMAIN_OPTIONS = [
  { value: "business", label: "Business" },
  { value: "career", label: "Career & Workplace" },
  { value: "relationships", label: "Relationships" },
  { value: "personal", label: "Personal Life" },
  { value: "finance", label: "Financial Decisions" },
  { value: "family", label: "Family & Social" },
  { value: "learning", label: "Learning & Education" },
];

export default function GoalsAndAssignmentsPage() {
  const [tab, setTab] = useState<"assignments" | "goals">("assignments");
  const [statusFilter, setStatusFilter] = useState<"active" | "completed" | "all">("active");
  const [assignments, setAssignments] = useState<AkucheAssignment[]>([]);
  const [goals, setGoals] = useState<AkucheGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  // Create Assignment form
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [aTitle, setATitle] = useState("");
  const [aWhat, setAWhat] = useState("");
  const [aWhy, setAWhy] = useState("");
  const [aMins, setAMins] = useState(15);
  const [aDomain, setADomain] = useState("personal");
  const [saving, setSaving] = useState(false);

  // Create Goal form
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [gTitle, setGTitle] = useState("");
  const [gDesc, setGDesc] = useState("");
  const [gDomain, setGDomain] = useState("personal");
  const [gTargetDate, setGTargetDate] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, gRes] = await Promise.all([
        fetch("/api/assignments"),
        fetch("/api/goals"),
      ]);
      if (aRes.ok) {
        const aData = await aRes.json();
        setAssignments(Array.isArray(aData.assignments) ? aData.assignments : []);
      }
      if (gRes.ok) {
        const gData = await gRes.json();
        setGoals(Array.isArray(gData.goals) ? gData.goals : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!aTitle.trim() || !aWhat.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aTitle.trim(),
          what_to_do: aWhat.trim(),
          why_it_matters:
            aWhy.trim() || "Turns intention into measurable real-world progress.",
          instructions: [aWhat.trim()],
          estimated_duration_mins: aMins,
          domain: aDomain,
          status: "accepted",
        }),
      });
      if (res.ok) {
        setATitle("");
        setAWhat("");
        setAWhy("");
        setShowNewAssignment(false);
        setBanner("Assignment saved to your account with a gentle follow-up scheduled.");
        await loadData();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!gTitle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: gTitle.trim(),
          description: gDesc.trim() || undefined,
          domain: gDomain,
          target_date: gTargetDate || undefined,
        }),
      });
      if (res.ok) {
        setGTitle("");
        setGDesc("");
        setGTargetDate("");
        setShowNewGoal(false);
        setBanner("Goal created and synced across devices.");
        await loadData();
      }
    } finally {
      setSaving(false);
    }
  }

  async function updateGoalProgress(goal: AkucheGoal, nextProgress: number) {
    await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: goal.id, progress_percent: nextProgress }),
    });
    await loadData();
  }

  async function deleteGoal(id: string) {
    await fetch(`/api/goals?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadData();
  }

  const activeAssignments = assignments.filter((a) =>
    ["proposed", "accepted", "in_progress", "blocked", "postponed"].includes(a.status)
  );
  const completedAssignments = assignments.filter((a) => a.status === "completed");
  const visibleAssignments =
    statusFilter === "active"
      ? activeAssignments
      : statusFilter === "completed"
      ? completedAssignments
      : assignments;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-28 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Action & Accountability
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Assignments & Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Turn coaching clarity into realistic next steps—synced across every device.
          </p>
        </div>

        <Link
          href="/dashboard/ask?mode=action"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 min-h-[44px]"
        >
          <MessageSquare className="h-4 w-4" />
          Co-design an Assignment
        </Link>
      </header>

      {banner && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-200">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
            {banner}
          </span>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Honest Summary Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-3.5 text-center">
          <p className="text-2xl font-bold text-foreground">{activeAssignments.length}</p>
          <p className="text-xs text-muted-foreground">Active Steps</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3.5 text-center">
          <p className="text-2xl font-bold text-emerald-600">{completedAssignments.length}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3.5 text-center">
          <p className="text-2xl font-bold text-foreground">
            {goals.filter((g) => g.status === "active").length}
          </p>
          <p className="text-xs text-muted-foreground">Active Goals</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("assignments")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition min-h-[40px] ${
              tab === "assignments"
                ? "bg-emerald-600 text-white"
                : "bg-muted/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Assignments ({assignments.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("goals")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition min-h-[40px] ${
              tab === "goals"
                ? "bg-emerald-600 text-white"
                : "bg-muted/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Target className="h-4 w-4" />
            Goals ({goals.length})
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            tab === "assignments"
              ? setShowNewAssignment((v) => !v)
              : setShowNewGoal((v) => !v)
          }
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted min-h-[40px]"
        >
          <Plus className="h-4 w-4" />
          New {tab === "assignments" ? "Assignment" : "Goal"}
        </button>
      </div>

      {/* ASSIGNMENTS TAB */}
      {tab === "assignments" && (
        <div className="space-y-4">
          {showNewAssignment && (
            <form
              onSubmit={handleCreateAssignment}
              className="rounded-2xl border border-emerald-500/30 bg-card p-4 space-y-3 shadow-sm"
            >
              <h2 className="text-sm font-bold text-foreground">Create a Realistic Assignment</h2>
              <input
                type="text"
                required
                value={aTitle}
                onChange={(e) => setATitle(e.target.value)}
                placeholder="Assignment title (e.g. Message 3 past customers for feedback)"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
              <textarea
                rows={2}
                required
                value={aWhat}
                onChange={(e) => setAWhat(e.target.value)}
                placeholder="Exactly what you will do (keep it doable and concrete)"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
              <input
                type="text"
                value={aWhy}
                onChange={(e) => setAWhy(e.target.value)}
                placeholder="Why this matters to you (optional)"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={aDomain}
                  onChange={(e) => setADomain(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs"
                >
                  {DOMAIN_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Duration (min):
                  <input
                    type="number"
                    min={5}
                    max={240}
                    value={aMins}
                    onChange={(e) => setAMins(Number(e.target.value) || 15)}
                    className="w-20 rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                  />
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="ml-auto rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Assignment"}
                </button>
              </div>
            </form>
          )}

          <div className="flex gap-2">
            {(["active", "completed", "all"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize border ${
                  statusFilter === f
                    ? "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "border-border text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-28 rounded-2xl border border-border bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : visibleAssignments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center space-y-3">
              <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-600/70" />
              <h3 className="text-base font-bold text-foreground">
                No {statusFilter === "completed" ? "completed" : "active"} assignments yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Akuche only creates assignments when a concrete step genuinely serves your goal.
                Talk through a situation in Coaching or add one small next step above.
              </p>
              <Link
                href="/dashboard/ask"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white"
              >
                Start a Coaching Session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onUpdated={(_, note) => {
                    if (note) setBanner(note);
                    loadData();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* GOALS TAB */}
      {tab === "goals" && (
        <div className="space-y-4">
          {showNewGoal && (
            <form
              onSubmit={handleCreateGoal}
              className="rounded-2xl border border-emerald-500/30 bg-card p-4 space-y-3"
            >
              <h2 className="text-sm font-bold text-foreground">Add a Meaningful Goal</h2>
              <input
                type="text"
                required
                value={gTitle}
                onChange={(e) => setGTitle(e.target.value)}
                placeholder="What do you want to achieve or change?"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
              <textarea
                rows={2}
                value={gDesc}
                onChange={(e) => setGDesc(e.target.value)}
                placeholder="What would success look like in plain terms? (optional)"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={gDomain}
                  onChange={(e) => setGDomain(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs"
                >
                  {DOMAIN_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={gTargetDate}
                  onChange={(e) => setGTargetDate(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="ml-auto rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
                >
                  {saving ? "Saving..." : "Save Goal"}
                </button>
              </div>
            </form>
          )}

          {goals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center space-y-2">
              <Target className="h-8 w-8 mx-auto text-emerald-600/70" />
              <p className="text-sm font-semibold text-foreground">No goals saved yet</p>
              <p className="text-xs text-muted-foreground">
                Add 1–2 priorities so Akuche can tailor your coaching and check-ins around what matters most.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="rounded-2xl border border-border bg-card p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                        {g.domain} · {g.status}
                      </span>
                      <h3 className="text-base font-bold text-foreground mt-0.5">{g.title}</h3>
                      {g.description && (
                        <p className="text-sm text-muted-foreground mt-1">{g.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteGoal(g.id)}
                      aria-label="Delete goal"
                      className="rounded-lg p-2 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Real-world progress</span>
                      <span className="font-bold text-foreground">{g.progress_percent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{ width: `${g.progress_percent}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => updateGoalProgress(g, pct)}
                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
                            g.progress_percent === pct
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                      <Link
                        href={`/dashboard/ask?mode=strategy&prompt=${encodeURIComponent(
                          `Help me plan the next realistic step for my goal: "${g.title}"`
                        )}`}
                        className="ml-auto text-xs font-semibold text-emerald-600 hover:underline self-center"
                      >
                        Strategize with Coach →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
