import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();

  const [
    profilesRes,
    sessionsRes,
    subscriptionsRes,
    activitiesRes,
    scoresRes,
  ] = await Promise.all([
    admin.from("profiles").select("user_id, created_at", { count: "exact", head: true }),
    admin.from("workout_sessions").select("user_id", { count: "exact", head: true }),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    admin.from("activities").select("id", { count: "exact", head: true }),
    admin.from("brain_scores").select("score"),
  ]);

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const { count: totalUsers } = profilesRes;
  const { count: totalSessions } = sessionsRes;
  const { count: premiumUsers } = subscriptionsRes;
  const { count: totalActivities } = activitiesRes;

  // New signups this week
  const { count: newSignupsWeek } = await admin
    .from("profiles")
    .select("user_id", { count: "exact", head: true })
    .gte("created_at", oneWeekAgo.toISOString());

  // Active today (distinct users in workout_sessions today)
  const { data: activeTodayData } = await admin
    .from("workout_sessions")
    .select("user_id")
    .gte("completed_at", today.toISOString());
  const activeToday = new Set(activeTodayData?.map((s) => s.user_id) ?? []).size;

  // Average brain score
  const scores = scoresRes.data ?? [];
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((s, r) => s + (r.score ?? 0), 0) / scores.length)
    : 0;

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    activeToday,
    totalSessions: totalSessions ?? 0,
    premiumUsers: premiumUsers ?? 0,
    totalActivities: totalActivities ?? 0,
    avgBrainScore: avgScore,
    newSignupsWeek: newSignupsWeek ?? 0,
  });
}
