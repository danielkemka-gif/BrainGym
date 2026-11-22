import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
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
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
  const search = url.searchParams.get("search") || "";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Get profiles using verified existing columns (avoids schema drift HTTP 500)
  let query = admin
    .from("profiles")
    .select("user_id, name, username, created_at, updated_at", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,username.ilike.%${search}%`);
  }

  const { data: profiles, count: totalCount, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with email from auth + admin status + levels + subscriptions
  const userIds = (profiles ?? []).map((p) => p.user_id);

  const [adminUsersRes, levelsRes, subsRes, ...authResults] = await Promise.all([
    admin.from("admins").select("user_id"),
    userIds.length > 0
      ? admin.from("user_levels").select("user_id, level, total_xp").in("user_id", userIds)
      : Promise.resolve({ data: [] }),
    userIds.length > 0
      ? admin.from("subscriptions").select("user_id, status, plan_tier").in("user_id", userIds)
      : Promise.resolve({ data: [] }),
    ...userIds.map((id) =>
      admin.auth.admin.getUserById(id).catch(() => ({ data: { user: null } }))
    ),
  ]);

  const adminUserIds = new Set(adminUsersRes.data?.map((a) => a.user_id) ?? []);
  const levelMap = new Map(
    (levelsRes.data ?? []).map((l: { user_id: string; level: number; total_xp: number }) => [
      l.user_id,
      l,
    ])
  );
  const subMap = new Map(
    (subsRes.data ?? []).map((s: { user_id: string; status: string; plan_tier?: string }) => [
      s.user_id,
      s,
    ])
  );
  const emailMap: Record<string, string> = {};

  authResults.forEach((res, i) => {
    const u = res.data?.user;
    if (u?.email) emailMap[userIds[i]] = u.email;
  });

  const enriched = (profiles ?? []).map((p) => {
    const lvl = levelMap.get(p.user_id);
    const sub = subMap.get(p.user_id);
    return {
      ...p,
      level: lvl?.level ?? 1,
      xp: lvl?.total_xp ?? 0,
      is_premium: sub?.status === "active" || sub?.status === "trialing",
      last_active: p.updated_at,
      email: emailMap[p.user_id] || null,
      isAdmin: adminUserIds.has(p.user_id),
    };
  });

  return NextResponse.json({ users: enriched, totalCount: totalCount ?? 0 });
}
