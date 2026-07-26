"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  ShieldOff,
  Trophy,
  Brain,
  Calendar,
  Dumbbell,
} from "lucide-react";

interface UserProfile {
  user_id: string;
  name: string | null;
  username: string | null;
  age_group: string | null;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  is_premium: boolean;
  created_at: string;
  last_active: string | null;
}

interface UserDetail {
  profile: UserProfile;
  email: string | null;
  totalSessions: number;
  brainScores: { category_id: string; score: number }[];
  isAdmin: boolean;
}

const CATEGORY_NAMES: Record<string, string> = {
  a0000000000000000000000000000001: "Memory",
  a0000000000000000000000000000002: "Focus",
  a0000000000000000000000000000003: "Thinking",
  a0000000000000000000000000000004: "Learning",
  a0000000000000000000000000000005: "Health",
  a0000000000000000000000000000006: "Creativity",
  a0000000000000000000000000000007: "Emotional Intelligence",
};

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users/${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  async function handleAdminToggle(makeAdmin: boolean) {
    setActionLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: makeAdmin ? "make_admin" : "remove_admin" }),
    });
    setData((prev) => (prev ? { ...prev, isAdmin: makeAdmin } : prev));
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse" role="status" aria-live="polite" aria-label="Loading user">
        <div className="h-7 w-48 rounded-lg bg-muted" />
        <div className="h-48 rounded-2xl bg-muted/50" />
        <div className="h-64 rounded-2xl bg-muted/50" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">User not found</p>
        <Link href="/admin/users" className="mt-4 text-sm text-primary hover:underline">
          Back to users
        </Link>
      </div>
    );
  }

  const { profile, email, totalSessions, brainScores, isAdmin } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{profile.name || "Unnamed User"}</h1>
          <p className="text-sm text-muted-foreground">{email || profile.username || "—"}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span className="text-xs">Level</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{profile.level}</p>
          <p className="text-xs text-muted-foreground">{profile.xp.toLocaleString()} XP</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span className="text-xs">Coins</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{profile.coins.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Dumbbell className="h-4 w-4" />
            <span className="text-xs">Workouts</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{totalSessions}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Joined</span>
          </div>
          <p className="mt-1 text-lg font-bold">
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Admin actions */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Admin Actions</h2>
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <button
              onClick={() => handleAdminToggle(false)}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            >
              <ShieldOff className="h-4 w-4" />
              Remove Admin
            </button>
          ) : (
            <button
              onClick={() => handleAdminToggle(true)}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
            >
              <Shield className="h-4 w-4" />
              Make Admin
            </button>
          )}
          <span className="text-xs text-muted-foreground">
            {isAdmin ? "This user has admin privileges" : "This user is a regular member"}
          </span>
        </div>
      </div>

      {/* Brain scores */}
      {brainScores.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Brain Scores</h2>
          <div className="space-y-3">
            {brainScores.map((s) => (
              <div key={s.category_id} className="flex items-center gap-3">
                <span className="w-36 text-sm text-muted-foreground">
                  {CATEGORY_NAMES[s.category_id] || s.category_id.slice(0, 8)}
                </span>
                <div className="flex-1">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-sm font-medium">{s.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile details */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Profile Details</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">User ID</p>
            <p className="font-mono text-sm">{profile.user_id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Username</p>
            <p className="text-sm">{profile.username || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Age Group</p>
            <p className="text-sm">{profile.age_group || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Premium</p>
            <p className="text-sm">{profile.is_premium ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="text-sm">{profile.streak} days</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Active</p>
            <p className="text-sm">
              {profile.last_active
                ? new Date(profile.last_active).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
