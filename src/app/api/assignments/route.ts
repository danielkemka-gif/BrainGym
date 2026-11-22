import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_PRIORITIES = new Set(["low", "medium", "high"]);
const VALID_STATUSES = new Set([
  "proposed",
  "accepted",
  "in_progress",
  "completed",
  "postponed",
  "blocked",
  "abandoned",
]);

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const statusFilter = new URL(request.url).searchParams.get("status");
  let query = supabase
    .from("akuche_assignments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(80);

  if (statusFilter && VALID_STATUSES.has(statusFilter)) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ assignments: [], tableReady: false, error: error.message });
  }
  return NextResponse.json({ assignments: data ?? [], tableReady: true });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 180) : "";
  const whatToDo = typeof body?.what_to_do === "string" ? body.what_to_do.trim().slice(0, 1000) : "";

  if (!title || !whatToDo) {
    return NextResponse.json(
      { error: "Assignment title and what_to_do are required" },
      { status: 400 }
    );
  }

  const status = VALID_STATUSES.has(body?.status) ? body.status : "accepted";
  const priority = VALID_PRIORITIES.has(body?.priority) ? body.priority : "medium";
  const duration = Math.max(
    5,
    Math.min(480, Number(body?.estimated_duration_mins) || 15)
  );

  // Default deadline to 48 hours from now if none provided
  const deadline =
    typeof body?.deadline === "string" && body.deadline
      ? body.deadline
      : new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("akuche_assignments")
    .insert({
      user_id: user.id,
      goal_id: typeof body?.goal_id === "string" && body.goal_id ? body.goal_id : null,
      conversation_id:
        typeof body?.conversation_id === "string" && body.conversation_id
          ? body.conversation_id
          : null,
      parent_assignment_id:
        typeof body?.parent_assignment_id === "string" && body.parent_assignment_id
          ? body.parent_assignment_id
          : null,
      title,
      why_it_matters:
        typeof body?.why_it_matters === "string" && body.why_it_matters.trim()
          ? body.why_it_matters.trim().slice(0, 500)
          : "Moves your current priority forward through real action.",
      what_to_do: whatToDo,
      instructions: Array.isArray(body?.instructions)
        ? body.instructions.slice(0, 8).map((s: unknown) => String(s).slice(0, 260))
        : [],
      expected_outcome:
        typeof body?.expected_outcome === "string"
          ? body.expected_outcome.trim().slice(0, 500)
          : null,
      estimated_duration_mins: duration,
      deadline,
      priority,
      domain: typeof body?.domain === "string" ? body.domain.slice(0, 40) : "personal",
      status,
      supporting_resources: Array.isArray(body?.supporting_resources)
        ? body.supporting_resources.slice(0, 5)
        : [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Schedule a gentle human follow-up reminder automatically when an assignment is accepted
  if (data && (status === "accepted" || status === "in_progress")) {
    const followUpAt = new Date(
      Math.max(Date.now() + 12 * 60 * 60 * 1000, new Date(deadline).getTime() - 4 * 60 * 60 * 1000)
    ).toISOString();

    await supabase
      .from("akuche_reminders")
      .upsert(
        {
          user_id: user.id,
          category: "assignment",
          title: `Check-in: ${title.slice(0, 80)}`,
          message: `You planned to work on "${title}". Did you get a chance to start, or would a smaller version help today?`,
          action_url: "/dashboard/goals",
          context_id: data.id,
          scheduled_for: followUpAt,
          dedupe_key: `assignment_checkin_${data.id}`,
          status: "scheduled",
        },
        { onConflict: "user_id,dedupe_key" }
      )
      .then(() => {}, () => {});
  }

  return NextResponse.json({ assignment: data }, { status: 201 });
}
