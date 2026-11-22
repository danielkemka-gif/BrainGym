import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getActivityById,
  MENTAL_FITNESS_CATALOG,
} from "@/lib/mental-fitness/catalog/activities";
import {
  computeNextDifficulty,
  getPersonalizedRecommendations,
  type ActivityLogSummary,
  type CategoryPreference,
} from "@/lib/mental-fitness/personalization";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let recentLogs: ActivityLogSummary[] = [];
  let preferences: CategoryPreference[] = [];
  let timeBudgetMins = 15;

  if (user) {
    const [logsRes, prefsRes, settingsRes] = await Promise.allSettled([
      supabase
        .from("akuche_activity_logs")
        .select("activity_id, category, difficulty, enjoyment_rating, difficulty_feedback, completed_at")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(40),
      supabase
        .from("akuche_activity_preferences")
        .select("category, current_difficulty, enjoyment_score, completions_count, last_completed_at")
        .eq("user_id", user.id),
      supabase
        .from("user_settings")
        .select("time_budget_mins")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    if (logsRes.status === "fulfilled" && Array.isArray(logsRes.value.data)) {
      recentLogs = logsRes.value.data as ActivityLogSummary[];
    }
    if (prefsRes.status === "fulfilled" && Array.isArray(prefsRes.value.data)) {
      preferences = prefsRes.value.data as CategoryPreference[];
    }
    if (settingsRes.status === "fulfilled" && settingsRes.value.data?.time_budget_mins) {
      timeBudgetMins = settingsRes.value.data.time_budget_mins;
    }
  }

  const recommendations = getPersonalizedRecommendations(
    recentLogs,
    preferences,
    timeBudgetMins
  );

  return NextResponse.json({
    totalActivities: MENTAL_FITNESS_CATALOG.length,
    recommendations,
    recentLogs: recentLogs.slice(0, 15),
    preferences,
    completedCount: recentLogs.length,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const activityId = typeof body?.activity_id === "string" ? body.activity_id : "";
  const activity = getActivityById(activityId);
  if (!activity) {
    return NextResponse.json({ error: "Unknown activity_id" }, { status: 400 });
  }

  const enjoymentRating =
    typeof body?.enjoyment_rating === "number"
      ? Math.max(1, Math.min(5, Math.round(body.enjoyment_rating)))
      : null;

  const difficultyFeedback =
    body?.difficulty_feedback === "too_easy" ||
    body?.difficulty_feedback === "just_right" ||
    body?.difficulty_feedback === "too_hard"
      ? body.difficulty_feedback
      : null;

  const score =
    typeof body?.score === "number" && Number.isFinite(body.score)
      ? Math.max(0, Math.min(10000, Math.round(body.score)))
      : null;

  const reflectionNote =
    typeof body?.reflection_note === "string"
      ? body.reflection_note.trim().slice(0, 1000)
      : null;

  const { data: logRow, error: logErr } = await supabase
    .from("akuche_activity_logs")
    .insert({
      user_id: user.id,
      activity_id: activity.id,
      category: activity.category,
      skill_focus: activity.skillFocus,
      activity_type: activity.activityType,
      difficulty: activity.difficulty,
      duration_mins: activity.durationMins,
      score,
      enjoyment_rating: enjoymentRating,
      difficulty_feedback: difficultyFeedback,
      reflection_note: reflectionNote,
    })
    .select()
    .single();

  if (logErr) {
    return NextResponse.json({ error: logErr.message }, { status: 500 });
  }

  // Adapt user's category difficulty & enjoyment profile
  const { data: existingPref } = await supabase
    .from("akuche_activity_preferences")
    .select("*")
    .eq("user_id", user.id)
    .eq("category", activity.category)
    .maybeSingle();

  const prevCount = existingPref?.completions_count || 0;
  const prevEnjoy = Number(existingPref?.enjoyment_score ?? 3.5);
  const nextEnjoy =
    enjoymentRating !== null
      ? Number(((prevEnjoy * Math.min(prevCount, 5) + enjoymentRating) / (Math.min(prevCount, 5) + 1)).toFixed(2))
      : prevEnjoy;

  const nextDiff = computeNextDifficulty(
    existingPref?.current_difficulty || activity.difficulty,
    difficultyFeedback
  );

  await supabase.from("akuche_activity_preferences").upsert(
    {
      user_id: user.id,
      category: activity.category,
      current_difficulty: nextDiff,
      enjoyment_score: nextEnjoy,
      completions_count: prevCount + 1,
      last_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,category" }
  );

  return NextResponse.json({
    logged: true,
    log: logRow,
    adaptedDifficulty: nextDiff,
    feedbackMessage:
      difficultyFeedback === "too_easy"
        ? `Logged! We'll calibrate your ${activity.categoryLabel} recommendations toward ${nextDiff}.`
        : difficultyFeedback === "too_hard"
        ? `Logged! We'll ease ${activity.categoryLabel} recommendations to ${nextDiff} so practice stays engaging.`
        : `Well done—${activity.name} recorded to your Mental Fitness practice.`,
  });
}
