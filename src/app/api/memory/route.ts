import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeContextText } from "@/lib/akuche/safety";

const VALID_CATEGORIES = new Set([
  "profile",
  "goal",
  "decision",
  "commitment",
  "pattern",
  "project",
]);

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const category = new URL(request.url).searchParams.get("category");
  let query = supabase
    .from("akuche_memories")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (category && VALID_CATEGORIES.has(category)) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ memories: [], tableReady: false, error: error.message });
  }

  return NextResponse.json({ memories: data ?? [], tableReady: true });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const category = VALID_CATEGORIES.has(body?.category) ? body.category : "profile";
  const title = sanitizeContextText(String(body?.title || ""), 120);
  const content = sanitizeContextText(String(body?.content || ""), 600);

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const clientId =
    typeof body?.client_id === "string" && body.client_id.trim()
      ? body.client_id.trim()
      : `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const verificationStatus =
    body?.verification_status === "ai_interpreted" ? "ai_interpreted" : "confirmed";

  const { data, error } = await supabase
    .from("akuche_memories")
    .upsert(
      {
        user_id: user.id,
        client_id: clientId,
        category,
        title,
        content,
        source_context: body?.source_context
          ? sanitizeContextText(String(body.source_context), 140)
          : "User-approved memory",
        verification_status: verificationStatus,
        confidence: verificationStatus === "confirmed" ? 1.0 : 0.75,
        tags: Array.isArray(body?.tags)
          ? body.tags.slice(0, 8).map((t: unknown) => sanitizeContextText(String(t), 30))
          : [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,client_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ memory: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const id = typeof body?.id === "string" ? body.id : "";
  const clientId = typeof body?.client_id === "string" ? body.client_id : "";

  if (!id && !clientId) {
    return NextResponse.json({ error: "Memory id or client_id is required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body?.title === "string" && body.title.trim()) {
    updates.title = sanitizeContextText(body.title, 120);
  }
  if (typeof body?.content === "string" && body.content.trim()) {
    updates.content = sanitizeContextText(body.content, 600);
  }
  if (body?.category && VALID_CATEGORIES.has(body.category)) {
    updates.category = body.category;
  }
  if (body?.verification_status === "confirmed" || body?.verification_status === "ai_interpreted") {
    updates.verification_status = body.verification_status;
    if (body.verification_status === "confirmed") updates.confidence = 1.0;
  }

  let query = supabase.from("akuche_memories").update(updates).eq("user_id", user.id);
  query = id ? query.eq("id", id) : query.eq("client_id", clientId);

  const { data, error } = await query.select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ memory: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const purgeAll = url.searchParams.get("all") === "true";
  const id = url.searchParams.get("id");
  const clientId = url.searchParams.get("client_id");

  if (purgeAll) {
    const [m, c, s, p] = await Promise.allSettled([
      supabase.from("akuche_memories").delete().eq("user_id", user.id),
      supabase.from("akuche_conversations").delete().eq("user_id", user.id),
      supabase.from("akuche_clarity_snapshots").delete().eq("user_id", user.id),
      supabase.from("akuche_thinking_patterns").delete().eq("user_id", user.id),
    ]);
    return NextResponse.json({
      purged: true,
      results: [m.status, c.status, s.status, p.status],
    });
  }

  if (!id && !clientId) {
    return NextResponse.json({ error: "Provide id, client_id, or all=true" }, { status: 400 });
  }

  let query = supabase.from("akuche_memories").delete().eq("user_id", user.id);
  query = id ? query.eq("id", id) : query.eq("client_id", clientId!);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
