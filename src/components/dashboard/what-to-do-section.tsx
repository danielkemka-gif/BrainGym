"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { CheckCircle2, Circle, ListChecks, PartyPopper } from "lucide-react";

interface Task {
  id: string;
  label: string;
  href: string;
  hint: string;
}

const TASKS: Task[] = [
  { id: "workout", label: "Complete a brain workout", href: "/dashboard/workout", hint: "Pick activities from your daily plan" },
  { id: "challenge", label: "Play the daily challenge", href: "/dashboard/challenge", hint: "A fresh puzzle every day" },
  { id: "score", label: "Log a brain score", href: "/dashboard/library", hint: "Take a quick game to update it" },
  { id: "streak", label: "Keep your streak alive", href: "/dashboard/progress", hint: "One session a day is all it takes" },
];

export function WhatToDoSection() {
  const { user, supabase } = useAuth();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];

    Promise.all([
      supabase.from("activity_logs").select("date").eq("user_id", user.id).eq("date", today),
      supabase.from("daily_challenge_scores").select("id").eq("user_id", user.id).gte("date", today).limit(1),
      supabase.from("brain_scores").select("id").eq("user_id", user.id).eq("date", today).limit(1),
      supabase.from("streaks").select("current_streak").eq("user_id", user.id).maybeSingle(),
    ]).then(([workout, challenge, score, streak]) => {
      const completed = new Set<string>();
      if ((workout.data ?? []).length > 0) completed.add("workout");
      if ((challenge.data ?? []).length > 0) completed.add("challenge");
      if ((score.data ?? []).length > 0) completed.add("score");
      if ((streak.data?.current_streak ?? 0) > 0) completed.add("streak");
      setDone(completed);
      setLoading(false);
    });
  }, [user, supabase]);

  const progress = done.size;
  const allDone = progress === TASKS.length;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">What to do today</h3>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progress}/{TASKS.length} done</span>
          <span>{Math.round((progress / TASKS.length) * 100)}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(progress / TASKS.length) * 100}%` }}
          />
        </div>
      </div>

      {allDone && !loading && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600">
          <PartyPopper className="h-4 w-4" />
          All done for today — brilliant!
        </div>
      )}

      <ul className="mt-3 space-y-1">
        {TASKS.map((task) => {
          const isDone = done.has(task.id);
          return (
            <li key={task.id}>
              <Link
                href={task.href}
                className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent"
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0">
                  <span className={`block text-sm ${isDone ? "text-muted-foreground line-through" : "font-medium"}`}>
                    {task.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">{task.hint}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
