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

export function MissionsSection() {
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("missions")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["active"])
        .then(({ data }) => {
          if (data) setMissions(data);
        });
    });
  }, []);

  if (missions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-semibold">Active Missions</h2>
      <div className="space-y-2">
        {missions.map((m) => (
          <div key={m.id} className="rounded-xl border border-border bg-background p-3">
            <p className="text-sm font-medium">{m.title}</p>
            {m.description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {m.duration_days} day mission
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
