import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_DOMAINS = new Set([
  "business",
  "career",
  "relationships",
  "personal",
  "finance",
  "family",
  "learning",
  "general",
]);

const VALID_STATUSES = new Set(["active", "paused", "completed", "archived"]);

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("akuche_goals")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ goals: [], tableReady: false, error: error.message });
  }
  return NextResponse.json({ goals: data ?? [], tableReady: true });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 180) : "";
  if (!title) {
    return NextResponse.json({ error: "Goal title is required" }, { status: 400 });
  }

  const domain = VALID_DOMAINS.has(body?.domain) ? body.domain : "personal";
  const { data, error } = await supabase
    .from("akuche_goals")
    .insert({
      user_id: user.id,
      title,
      description: typeof body?.description === "string" ? body.description.trim().slice(0, 1000) : null,
      domain,
      target_date: typeof body?.target_date === "string" && body.target_date ? body.target_date : null,
      success_criteria:
        typeof body?.success_criteria === "string"
          ? body.success_criteria.trim().slice(0, 500)
          : null,
      progress_percent: 0,
      status: "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ goal: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Goal id is required" }, { status: 400 });

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body?.title === "string" && body.title.trim()) {
    updates.title = body.title.trim().slice(0, 180);
  }
  if (typeof body?.description === "string") {
    updates.description = body.description.trim().slice(0, 1000);
  }
  if (VALID_DOMAINS.has(body?.domain)) updates.domain = body.domain;
  if (VALID_STATUSES.has(body?.status)) updates.status = body.status;
  if (typeof body?.progress_percent === "number") {
    updates.progress_percent = Math.max(0, Math.min(100, Math.round(body.progress_percent)));
    if (updates.progress_percent === 100 && !body?.status) {
      updates.status = "completed";
    }
  }
  if (typeof body?.target_date === "string") {
    updates.target_date = body.target_date || null;
  }

  const { data, error } = await supabase
    .from("akuche_goals")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ goal: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Goal id is required" }, { status: 400 });

  const { error } = await supabase
    .from("akuche_goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
