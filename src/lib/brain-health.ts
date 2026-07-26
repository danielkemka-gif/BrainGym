import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface BrainHealthSnapshot {
  id: string;
  user_id: string;
  snapshot_date: string;
  overall_score: number;
  memory_score: number;
  focus_score: number;
  logic_score: number;
  speed_score: number;
  fitness_score: number;
  streak_health: number;
  consistency_health: number;
  engagement_health: number;
  recovery_health: number;
  summary_text: string;
  recommendations: string[];
  created_at: string;
}

export interface BrainHealthSummary {
  period: 'week' | 'month';
  start_date: string;
  end_date: string;
  avg_overall: number;
  trend: 'improving' | 'stable' | 'declining';
  trend_delta: number;
  best_category: { name: string; score: number };
  weakest_category: { name: string; score: number };
  workouts_completed: number;
  avg_session_length: number;
  streak_days: number;
  momentum_avg: number;
  top_recommendation: string;
}

export function getHealthColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-blue-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-red-500';
}

export function getHealthLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
}

export async function generateBrainHealthSnapshot(userId: string): Promise<BrainHealthSnapshot | null> {
  // Gather data
  const [
    scoresRes,
    streakRes,
    workoutsRes,
    momentumRes,
    recentLogsRes,
  ] = await Promise.all([
    supabase
      .from('brain_scores')
      .select('category_id, score')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(50),
    supabase
      .from('streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('workout_sessions')
      .select('date, completed_at, started_at')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0])
      .order('date', { ascending: false }),
    supabase
      .from('brain_momentum')
      .select('score')
      .eq('user_id', userId)
      .order('calculated_at', { ascending: false })
      .limit(7),
    supabase
      .from('activity_logs')
      .select('date, activity_id')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30),
  ]);

  // Category scores
  const categoryMap = new Map<string, number[]>();
  for (const s of scoresRes.data ?? []) {
    const arr = categoryMap.get(s.category_id) || [];
    arr.push(s.score);
    categoryMap.set(s.category_id, arr);
  }

  const catNames: Record<string, string> = {
    '00000000-0000-0000-0000-000000000001': 'Memory',
    '00000000-0000-0000-0000-000000000002': 'Focus',
    '00000000-0000-0000-0000-000000000003': 'Logic',
    '00000000-0000-0000-0000-000000000004': 'Learning',
    '00000000-0000-0000-0000-000000000005': 'Health',
    '00000000-0000-0000-0000-000000000006': 'Creativity',
    '00000000-0000-0000-0000-000000000007': 'Emotional Intelligence',
  };

  const avgScores: Record<string, number> = {};
  for (const [cat, scores] of categoryMap) {
    avgScores[cat] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  const memory = avgScores['00000000-0000-0000-0000-000000000001'] ?? 50;
  const focus = avgScores['00000000-0000-0000-0000-000000000002'] ?? 50;
  const logic = avgScores['00000000-0000-0000-0000-000000000003'] ?? 50;
  const speed = avgScores['00000000-0000-0000-0000-000000000004'] ?? 50;
  const fitness = avgScores['00000000-0000-0000-0000-000000000005'] ?? 50;

  const overall = Math.round((memory + focus + logic + speed + fitness) / 5);

  // Streak health (0-100)
  const streak = streakRes.data?.current_streak ?? 0;
  const longest = streakRes.data?.longest_streak ?? 1;
  const streakHealth = Math.min(100, Math.round((streak / Math.max(longest, 1)) * 100));

  // Consistency (workouts in last 30 days)
  const workouts = workoutsRes.data ?? [];
  const consistencyHealth = Math.min(100, Math.round((workouts.length / 30) * 100));

  // Engagement (unique days with activity)
  const uniqueDays = new Set(recentLogsRes.data?.map(l => l.date)).size;
  const engagementHealth = Math.min(100, Math.round((uniqueDays / 30) * 100));

  // Momentum
  const momentumScores = momentumRes.data ?? [];
  const momentumAvg = momentumScores.length > 0
    ? Math.round(momentumScores.reduce((a, b) => a + b.score, 0) / momentumScores.length)
    : 50;
  const recoveryHealth = momentumAvg;

  // Generate recommendations
  const recommendations: string[] = [];
  if (memory < 50) recommendations.push('Try 3 memory activities this week to boost recall');
  if (focus < 50) recommendations.push('Focus sessions can help — aim for 15-minute blocks');
  if (logic < 50) recommendations.push('Logic puzzles will sharpen your reasoning skills');
  if (streakHealth < 50) recommendations.push('Even a 5-minute workout keeps your streak alive');
  if (consistencyHealth < 50) recommendations.push('Try to train at least 4 days this week');
  if (engagementHealth < 50) recommendations.push('Mix up your activities — try a new category');

  if (recommendations.length === 0) {
    recommendations.push('You\'re doing great! Keep maintaining your current pace');
  }

  // Summary
  const summary = `Brain Health: ${overall}/100. ${streak > 0 ? `${streak}-day streak active.` : 'No active streak.'} ${
    recommendations[0]
  }`;

  return {
    id: '',
    user_id: userId,
    snapshot_date: new Date().toISOString().split('T')[0],
    overall_score: overall,
    memory_score: Math.round(memory),
    focus_score: Math.round(focus),
    logic_score: Math.round(logic),
    speed_score: Math.round(speed),
    fitness_score: Math.round(fitness),
    streak_health: streakHealth,
    consistency_health: consistencyHealth,
    engagement_health: engagementHealth,
    recovery_health: recoveryHealth,
    summary_text: summary,
    recommendations,
    created_at: new Date().toISOString(),
  };
}

export async function getWeeklyHealthSummary(userId: string): Promise<BrainHealthSummary> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);

  const [scoresNow, scoresPrev, workoutsRes, momentumRes] = await Promise.all([
    supabase
      .from('brain_scores')
      .select('category_id, score')
      .eq('user_id', userId)
      .gte('date', weekAgo.toISOString().split('T')[0])
      .order('date', { ascending: false }),
    supabase
      .from('brain_scores')
      .select('category_id, score')
      .eq('user_id', userId)
      .gte('date', new Date(weekAgo.getTime() - 7 * 86400000).toISOString().split('T')[0])
      .lt('date', weekAgo.toISOString().split('T')[0]),
    supabase
      .from('workout_sessions')
      .select('date, started_at, completed_at')
      .eq('user_id', userId)
      .gte('date', weekAgo.toISOString().split('T')[0]),
    supabase
      .from('brain_momentum')
      .select('score')
      .eq('user_id', userId)
      .gte('calculated_at', weekAgo.toISOString()),
  ]);

  const thisWeekScores = scoresNow.data ?? [];
  const prevWeekScores = scoresPrev.data ?? [];

  const avgNow = thisWeekScores.length > 0
    ? Math.round(thisWeekScores.reduce((a, b) => a + b.score, 0) / thisWeekScores.length)
    : 50;
  const avgPrev = prevWeekScores.length > 0
    ? Math.round(prevWeekScores.reduce((a, b) => a + b.score, 0) / prevWeekScores.length)
    : avgNow;

  const delta = avgNow - avgPrev;
  const trend = delta > 3 ? 'improving' : delta < -3 ? 'declining' : 'stable';

  // Best/weakest category
  const catMap = new Map<string, number[]>();
  for (const s of thisWeekScores) {
    const arr = catMap.get(s.category_id) || [];
    arr.push(s.score);
    catMap.set(s.category_id, arr);
  }

  const names: Record<string, string> = {
    '00000000-0000-0000-0000-000000000001': 'Memory',
    '00000000-0000-0000-0000-000000000002': 'Focus',
    '00000000-0000-0000-0000-000000000003': 'Logic',
    '00000000-0000-0000-0000-000000000004': 'Learning',
    '00000000-0000-0000-0000-000000000005': 'Health',
    '00000000-0000-0000-0000-000000000006': 'Creativity',
    '00000000-0000-0000-0000-000000000007': 'Emotional Intelligence',
  };

  let bestCat = { name: 'Memory', score: 0 };
  let weakCat = { name: 'Memory', score: 100 };
  for (const [cat, scores] of catMap) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg > bestCat.score) bestCat = { name: names[cat] || cat, score: Math.round(avg) };
    if (avg < weakCat.score) weakCat = { name: names[cat] || cat, score: Math.round(avg) };
  }

  const momentumScores = momentumRes.data ?? [];
  const momentumAvg = momentumScores.length > 0
    ? Math.round(momentumScores.reduce((a, b) => a + b.score, 0) / momentumScores.length)
    : 50;

  const workouts = workoutsRes.data ?? [];

  return {
    period: 'week',
    start_date: weekAgo.toISOString().split('T')[0],
    end_date: now.toISOString().split('T')[0],
    avg_overall: avgNow,
    trend,
    trend_delta: delta,
    best_category: bestCat,
    weakest_category: weakCat,
    workouts_completed: workouts.length,
    avg_session_length: 15,
    streak_days: workouts.length,
    momentum_avg: momentumAvg,
    top_recommendation: `Focus on ${weakCat.name} — your ${bestCat.name} is strong at ${bestCat.score}/100`,
  };
}
