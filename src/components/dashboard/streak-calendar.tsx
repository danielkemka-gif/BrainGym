"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const DAYS = 91; // ~13 weeks
const CELL_SIZE = 11;
const GAP = 2;
const TOTAL = CELL_SIZE + GAP;

function getColor(count: number, isFuture: boolean): string {
  if (isFuture) return "bg-muted/30";
  if (count === 0) return "bg-muted/60";
  if (count === 1) return "bg-primary/20";
  if (count === 2) return "bg-primary/40";
  if (count <= 4) return "bg-primary/60";
  return "bg-primary/90";
}

function getTooltip(count: number, dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  if (count === 0) return `${label} — no activity`;
  if (count === 1) return `${label} — 1 activity`;
  return `${label} — ${count} activities`;
}

export function StreakCalendar() {
  const [activityMap, setActivityMap] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const since = new Date(Date.now() - DAYS * 86400000).toISOString().split("T")[0];
      supabase
        .from("activity_logs")
        .select("date")
        .eq("user_id", user.id)
        .gte("date", since)
        .then(({ data }) => {
          const map = new Map<string, number>();
          for (const row of data ?? []) {
            map.set(row.date, (map.get(row.date) ?? 0) + 1);
          }
          setActivityMap(map);
          setLoading(false);
        });
    });
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (DAYS - 1));

  // Align start to Sunday
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const weeks: { date: Date; dateStr: string; count: number; isFuture: boolean }[][] = [];
  let currentWeek: { date: Date; dateStr: string; count: number; isFuture: boolean }[] = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate || currentWeek.length > 0) {
    const dateStr = cursor.toISOString().split("T")[0];
    const isFuture = cursor > today;
    const count = activityMap.get(dateStr) ?? 0;

    currentWeek.push({ date: new Date(cursor), dateStr, count, isFuture });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    cursor.setDate(cursor.getDate() + 1);
    if (cursor > endDate && currentWeek.length === 0) break;
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const totalActive = Array.from(activityMap.values()).reduce((s, c) => s + (c > 0 ? 1 : 0), 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Activity</h3>
        <span className="text-xs text-muted-foreground">{totalActive} active days</span>
      </div>

      {loading ? (
        <div className="h-[110px] animate-pulse rounded-lg bg-muted" />
      ) : (
        <div className="relative overflow-x-auto">
          <div
            className="inline-grid gap-y-[2px]"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, ${TOTAL}px)` }}
          >
            {weeks.map((week, wi) =>
              week.map((day, di) => (
                <div
                  key={day.dateStr}
                  className={`rounded-sm ${getColor(day.count, day.isFuture)} cursor-default transition-colors hover:ring-1 hover:ring-primary/40`}
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({ text: getTooltip(day.count, day.dateStr), x: rect.left + rect.width / 2, y: rect.top - 8 });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))
            )}
          </div>

          {/* Month labels */}
          <div className="mt-2 flex gap-1">
            {weeks.filter((_, i) => {
              if (i === 0) return true;
              const firstDayOfWeek = weeks[i][0]?.date;
              const prevFirstDay = weeks[i - 1][0]?.date;
              return firstDayOfWeek && prevFirstDay && firstDayOfWeek.getMonth() !== prevFirstDay.getMonth();
            }).map((week) => (
              <span
                key={week[0].dateStr}
                className="text-[9px] text-muted-foreground"
                style={{ marginLeft: week === weeks[0] ? 0 : 4 }}
              >
                {week[0].date.toLocaleDateString("en-US", { month: "short" })}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 5].map((c) => (
          <div key={c} className={`rounded-sm ${getColor(c, false)}`} style={{ width: 10, height: 10 }} />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs font-medium shadow-md"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
