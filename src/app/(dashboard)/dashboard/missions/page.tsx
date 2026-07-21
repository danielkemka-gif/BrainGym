"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Mission {
  id: string;
  title: string;
  description: string | null;
  duration_days: number;
  status: string;
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("missions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setMissions(data);
          setLoading(false);
        });
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Missions</h1>
        <p className="text-sm text-muted-foreground">
          Track your long-term challenges
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : missions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No missions yet</p>
          <p className="text-sm text-muted-foreground">
            Missions will appear here when your coach assigns them
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{m.title}</h3>
                  {m.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {m.description}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    m.status === "active"
                      ? "bg-green-500/10 text-green-500"
                      : m.status === "completed"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {m.duration_days} day mission
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
