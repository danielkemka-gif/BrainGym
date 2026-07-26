import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
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

  const [profileRes, authRes, sessionsRes, scoresRes, adminRes] = await Promise.all([
    admin.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    admin.auth.admin.getUserById(userId).catch(() => ({ data: { user: null } })),
    admin.from("workout_sessions").select("id, completed_at").eq("user_id", userId),
    admin.from("brain_scores").select("category_id, score").eq("user_id", userId),
    admin.from("admins").select("user_id").eq("user_id", userId).maybeSingle(),
  ]);

  if (!profileRes.data) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    profile: profileRes.data,
    email: authRes.data?.user?.email || null,
    totalSessions: sessionsRes.data?.length ?? 0,
    brainScores: scoresRes.data ?? [],
    isAdmin: !!adminRes.data,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
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
  const body = await request.json();

  if (body.action === "make_admin") {
    const { error } = await admin.from("admins").insert({ user_id: userId });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.action === "remove_admin") {
    const { error } = await admin.from("admins").delete().eq("user_id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
