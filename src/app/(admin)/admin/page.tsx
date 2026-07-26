"use client";

import { useState, useEffect } from "react";
import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import {
  Users,
  Activity,
  Brain,
  Crown,
  Zap,
  TrendingUp,
  UserPlus,
  Dumbbell,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalSessions: number;
  premiumUsers: number;
  totalActivities: number;
  avgBrainScore: number;
  newSignupsWeek: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse" role="status" aria-live="polite" aria-label="Loading admin dashboard">
        <div className="h-7 w-48 rounded-lg bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your BrainGym platform
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          trend={stats ? { value: stats.newSignupsWeek, positive: true } : undefined}
        />
        <AdminStatsCard
          icon={Zap}
          label="Active Today"
          value={stats?.activeToday ?? 0}
          iconClassName="bg-amber-500/10 [&_svg]:text-amber-500"
        />
        <AdminStatsCard
          icon={Dumbbell}
          label="Total Workouts"
          value={stats?.totalSessions ?? 0}
          iconClassName="bg-emerald-500/10 [&_svg]:text-emerald-500"
        />
        <AdminStatsCard
          icon={Crown}
          label="Premium Users"
          value={stats?.premiumUsers ?? 0}
          iconClassName="bg-violet-500/10 [&_svg]:text-violet-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatsCard
          icon={Activity}
          label="Activities"
          value={stats?.totalActivities ?? 0}
          iconClassName="bg-sky-500/10 [&_svg]:text-sky-500"
        />
        <AdminStatsCard
          icon={Brain}
          label="Avg Brain Score"
          value={`${stats?.avgBrainScore ?? 0}%`}
          iconClassName="bg-rose-500/10 [&_svg]:text-rose-500"
        />
        <AdminStatsCard
          icon={UserPlus}
          label="New Signups (7d)"
          value={stats?.newSignupsWeek ?? 0}
          iconClassName="bg-green-500/10 [&_svg]:text-green-500"
        />
      </div>
    </div>
  );
}
