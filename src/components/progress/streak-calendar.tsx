"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function StreakCalendar() {
  const [dates, setDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("activity_logs")
        .select("date")
        .eq("user_id", user.id)
        .then(({ data }) => {
          if (data) setDates(new Set(data.map((l) => l.date)));
        });
    });
  }, []);

  const today = new Date();
  const days: Date[] = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  for (const d of days) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-semibold">Activity Calendar</h2>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((d) => {
              const key = d.toISOString().split("T")[0];
              const active = dates.has(key);
              const isToday =
                key === today.toISOString().split("T")[0];
              return (
                <div
                  key={key}
                  title={key}
                  className={`h-3 w-3 rounded-sm ${
                    isToday
                      ? "ring-2 ring-primary ring-offset-1 ring-offset-card"
                      : active
                        ? "bg-primary"
                        : "bg-muted"
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-muted" />
        <div className="h-3 w-3 rounded-sm bg-primary/30" />
        <div className="h-3 w-3 rounded-sm bg-primary/60" />
        <div className="h-3 w-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
