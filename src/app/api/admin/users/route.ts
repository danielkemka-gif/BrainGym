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

  // Get profiles
  let query = admin
    .from("profiles")
    .select("user_id, name, username, level, xp, is_premium, created_at, last_active", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,username.ilike.%${search}%`);
  }

  const { data: profiles, count: totalCount, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with email from auth + admin status
  const userIds = (profiles ?? []).map((p) => p.user_id);

  const [adminUsersRes, ...authResults] = await Promise.all([
    admin.from("admins").select("user_id"),
    ...userIds.map((id) =>
      admin.auth.admin.getUserById(id).catch(() => ({ data: { user: null } }))
    ),
  ]);

  const adminUserIds = new Set(adminUsersRes.data?.map((a) => a.user_id) ?? []);
  const emailMap: Record<string, string> = {};

  authResults.forEach((res, i) => {
    const u = res.data?.user;
    if (u?.email) emailMap[userIds[i]] = u.email;
  });

  const enriched = (profiles ?? []).map((p) => ({
    ...p,
    email: emailMap[p.user_id] || null,
    isAdmin: adminUserIds.has(p.user_id),
  }));

  return NextResponse.json({ users: enriched, totalCount: totalCount ?? 0 });
}
