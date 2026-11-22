import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PATCH /api/assignments/[id]
 * Supports the complete human, non-shaming Akuche assignment lifecycle:
 * - accept | start | modify | postpone | complete | block | abandon | smaller_version
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  const action = typeof body?.action === "string" ? body.action : "modify";

  const { data: existing, error: fetchErr } = await supabase
    .from("akuche_assignments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  }

  // Special action: Create a smaller, 5-to-10 minute realistic version of an overwhelming assignment
  if (action === "smaller_version") {
    const smallerMins = Math.max(5, Math.min(10, Math.round((existing.estimated_duration_mins || 20) / 3)));
    const firstStep =
      Array.isArray(existing.instructions) && existing.instructions.length > 0
        ? String(existing.instructions[0])
        : `Spend just ${smallerMins} minutes starting "${existing.title}"—stopping after the first small move is a win.`;

    const { data: child, error: childErr } = await supabase
      .from("akuche_assignments")
      .insert({
        user_id: user.id,
        goal_id: existing.goal_id,
        conversation_id: existing.conversation_id,
        parent_assignment_id: existing.id,
        title: `Smaller Step: ${existing.title}`,
        why_it_matters: existing.why_it_matters,
        what_to_do: firstStep,
        instructions: [
          `Set a ${smallerMins}-minute timer with zero pressure to finish everything.`,
          firstStep,
          "Note one thing that felt easier or harder than expected.",
        ],
        expected_outcome: "Build momentum with a realistic low-friction start.",
        estimated_duration_mins: smallerMins,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        priority: existing.priority,
        domain: existing.domain,
        status: "accepted",
      })
      .select()
      .single();

    if (childErr) return NextResponse.json({ error: childErr.message }, { status: 500 });

    // Pause/postpone parent gently so user focuses on the smaller step
    await supabase
      .from("akuche_assignments")
      .update({ status: "postponed", updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .eq("user_id", user.id);

    return NextResponse.json({
      assignment: child,
      supportiveNote:
        "Good call shrinking the step. Momentum comes from realistic wins, not forcing an oversized plan.",
    });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (action === "accept") {
    updates.status = "accepted";
  } else if (action === "start") {
    updates.status = "in_progress";
  } else if (action === "complete") {
    updates.status = "completed";
    updates.completed_at = new Date().toISOString();
    if (typeof body?.completion_feedback === "string") {
      updates.completion_feedback = body.completion_feedback.trim().slice(0, 1500);
    }
    if (typeof body?.outcome_rating === "number") {
      updates.outcome_rating = Math.max(1, Math.min(5, Math.round(body.outcome_rating)));
    }
    // Cancel pending check-in reminder for completed assignment
    await supabase
      .from("akuche_reminders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("context_id", id)
      .eq("status", "scheduled");
  } else if (action === "postpone") {
    updates.status = "postponed";
    const postponeDays = Math.max(1, Math.min(30, Number(body?.days) || 2));
    const newDeadline =
      typeof body?.deadline === "string" && body.deadline
        ? body.deadline
        : new Date(Date.now() + postponeDays * 24 * 60 * 60 * 1000).toISOString();
    updates.postponed_until = newDeadline;
    updates.deadline = newDeadline;
  } else if (action === "block") {
    updates.status = "blocked";
    updates.blocker_reason =
      typeof body?.blocker_reason === "string"
        ? body.blocker_reason.trim().slice(0, 600)
        : "Hit an unexpected obstacle";
  } else if (action === "abandon") {
    updates.status = "abandoned";
    updates.abandon_reason =
      typeof body?.abandon_reason === "string"
        ? body.abandon_reason.trim().slice(0, 600)
        : "No longer matches current priorities";
    await supabase
      .from("akuche_reminders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("context_id", id)
      .eq("status", "scheduled");
  } else {
    // modify
    if (typeof body?.title === "string" && body.title.trim()) {
      updates.title = body.title.trim().slice(0, 180);
    }
    if (typeof body?.what_to_do === "string" && body.what_to_do.trim()) {
      updates.what_to_do = body.what_to_do.trim().slice(0, 1000);
    }
    if (typeof body?.why_it_matters === "string") {
      updates.why_it_matters = body.why_it_matters.trim().slice(0, 500);
    }
    if (Array.isArray(body?.instructions)) {
      updates.instructions = body.instructions.slice(0, 8).map((s: unknown) => String(s).slice(0, 260));
    }
    if (typeof body?.estimated_duration_mins === "number") {
      updates.estimated_duration_mins = Math.max(5, Math.min(480, body.estimated_duration_mins));
    }
    if (typeof body?.deadline === "string") {
      updates.deadline = body.deadline || null;
    }
    if (body?.priority === "low" || body?.priority === "medium" || body?.priority === "high") {
      updates.priority = body.priority;
    }
  }

  const { data: updated, error: updErr } = await supabase
    .from("akuche_assignments")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  const supportiveNote =
    action === "block"
      ? "Thanks for naming the blocker honestly—let's either shrink this step or talk through how to work around it in Coaching."
      : action === "postpone"
      ? "Rescheduled cleanly. Adjusting timing to fit real life is smart discipline."
      : action === "abandon"
      ? "Dropped cleanly with zero guilt. Focusing on what truly matters now is progress."
      : action === "complete"
      ? "Completed and logged! Taking a moment to notice what worked builds real confidence."
      : undefined;

  return NextResponse.json({ assignment: updated, supportiveNote });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const { error } = await supabase
    .from("akuche_assignments")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
