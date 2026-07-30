"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface UserMission {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  completed: boolean;
  claimed: boolean;
  xp_reward: number;
  coin_reward: number;
}

export function MissionsSection() {
  const { user, supabase } = useAuth();
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    const weekStart = monday.toISOString().split("T")[0];

    supabase
      .from("user_missions")
      .select("id, title, description, target_value, current_value, completed, claimed, xp_reward, coin_reward")
      .eq("user_id", user.id)
      .eq("week_start", weekStart)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMissions(data);
        setLoading(false);
      });
  }, [user, supabase]);

  if (loading || missions.length === 0) return null;

  const incompleteCount = missions.filter((m) => !m.completed).length;
  const completedCount = missions.filter((m) => m.completed && !m.claimed).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-semibold">Weekly Missions</h3>
        <Link
          href="/dashboard/missions"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {missions.slice(0, 4).map((m) => {
          const progress = Math.min(m.current_value / m.target_value, 1);
          return (
            <div key={m.id} className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium truncate flex-1">{m.title}</p>
                {m.completed && m.claimed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                ) : (
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {m.current_value}/{m.target_value}
                  </span>
                )}
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    m.completed ? "bg-green-500" : "bg-primary"
                  }`}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {(incompleteCount > 0 || completedCount > 0) && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{incompleteCount} remaining</span>
          {completedCount > 0 && (
            <span className="font-medium text-amber-500">{completedCount} ready to claim</span>
          )}
        </div>
      )}
    </div>
  );
}
