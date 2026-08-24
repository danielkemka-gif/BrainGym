"use client";

import { useAuth } from "@/lib/auth";
import { Sparkles, Calendar } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "Thinker" }: DashboardHeaderProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = userName ? userName.split(" ")[0] : "Thinker";

  const todayDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
          Ready to sharpen your mind today?
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 border border-border px-3 py-1 text-xs font-semibold text-muted-foreground w-fit">
          <Calendar className="h-3.5 w-3.5" />
          <span>{todayDate}</span>
        </span>
      </div>
    </div>
  );
}
