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
  const category = url.searchParams.get("category") || "";
  const difficulty = url.searchParams.get("difficulty") || "";

  let query = admin
    .from("activities")
    .select("id, title, description, category_id, difficulty, estimated_time, xp, coins, is_active", { count: "exact" });

  if (category) query = query.eq("category_id", category);
  if (difficulty) query = query.eq("difficulty", difficulty);

  const { data: activities, count, error } = await query.order("title");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ activities: activities ?? [], totalCount: count ?? 0 });
}

export async function POST(request: NextRequest) {
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

  const { data, error } = await admin
    .from("activities")
    .insert({
      title: body.title,
      description: body.description,
      category_id: body.category_id,
      difficulty: body.difficulty,
      estimated_time: body.estimated_time,
      xp: body.xp,
      coins: body.coins,
      instructions: body.instructions,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ activity: data });
}
