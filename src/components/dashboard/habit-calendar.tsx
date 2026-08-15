"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { Calendar } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  isSameMonth,
  isToday,
  format,
} from "date-fns";

export function HabitCalendar() {
  const { user, supabase } = useAuth();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [days, setDays] = useState<Set<string>>(new Set());
  const [scoredDays, setScoredDays] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const monthKey = format(month, "yyyy-MM");

  useEffect(() => {
    if (!user) return;
    const from = format(startOfMonth(month), "yyyy-MM-dd");
    const to = format(endOfMonth(month), "yyyy-MM-dd");

    Promise.all([
      supabase
        .from("activity_logs")
        .select("date")
        .eq("user_id", user.id)
        .gte("date", from)
        .lte("date", to),
      supabase
        .from("brain_scores")
        .select("date")
        .eq("user_id", user.id)
        .gte("date", from)
        .lte("date", to),
    ]).then(([activity, scores]) => {
      setDays(new Set((activity.data ?? []).map((r) => r.date)));
      setScoredDays(new Set((scores.data ?? []).map((r) => r.date)));
      setLoading(false);
    });
  }, [user, supabase, monthKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const cells = useMemo(() => {
    const start = startOfWeek(month, { weekStartsOn: 1 });
    const end = endOfWeekFor(month);
    return eachDayOfInterval({ start, end });
  }, [month]);

  const nextMonth = () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  const prevMonth = () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Habit Calendar</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
          >
            ‹
          </button>
          <span className="w-24 text-center text-sm font-medium">
            {format(month, "MMMM yyyy")}
          </span>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const active = days.has(key);
          const scored = scoredDays.has(key);
          return (
            <div
              key={key}
              className={`relative flex h-9 items-center justify-center rounded-md text-xs ${
                isSameMonth(day, month) ? "" : "text-muted-foreground/40"
              } ${active ? "bg-primary/20" : scored ? "bg-emerald-500/15" : "bg-muted/40"}`}
              title={`${format(day, "EEE d MMM")}${active ? " — workout done" : ""}${scored ? " — brain score" : ""}`}
            >
              {format(day, "d")}
              {isToday(day) && (
                <span className="absolute inset-0 rounded-md ring-2 ring-primary" />
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="mt-3 h-8 animate-pulse rounded bg-muted" />
      )}

      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-primary/20" /> Workout
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-emerald-500/15" /> Brain score
        </span>
      </div>
    </div>
  );
}

function endOfWeekFor(month: Date): Date {
  const end = endOfMonth(month);
  const day = end.getDay(); // 0=Sun
  const diff = day === 0 ? 0 : 7 - day;
  return new Date(end.getFullYear(), end.getMonth(), end.getDate() + diff);
}
