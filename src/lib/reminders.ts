import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface SmartReminder {
  id: string;
  user_id: string;
  reminder_type: string;
  title: string;
  message: string;
  scheduled_for: string;
  sent_at: string | null;
  dismissed_at: string | null;
  is_read: boolean;
  action_url: string | null;
  priority: number;
  created_at: string;
}

export interface JourneySnapshot {
  id: string;
  user_id: string;
  snapshot_date: string;
  year: number;
  month: number;
  workouts_count: number;
  total_xp: number;
  total_coins: number;
  streak_days: number;
  brain_score_avg: number;
  level_start: number;
  level_end: number;
  achievements_unlocked: number;
  created_at: string;
}

export function getReminderIcon(type: string): string {
  const icons: Record<string, string> = {
    missed_workout: '⏰',
    streak_risk: '🔥',
    streak_milestone: '🎉',
    comeback: '💪',
    weekly_summary: '📊',
    quest_reminder: '🎯',
    achievement_near: '🏆',
  };
  return icons[type] || '🔔';
}

export function getReminderColor(type: string): string {
  const colors: Record<string, string> = {
    missed_workout: 'from-orange-500 to-amber-500',
    streak_risk: 'from-red-500 to-pink-500',
    streak_milestone: 'from-green-500 to-emerald-500',
    comeback: 'from-blue-500 to-indigo-500',
    weekly_summary: 'from-purple-500 to-violet-500',
    quest_reminder: 'from-yellow-500 to-amber-500',
    achievement_near: 'from-pink-500 to-rose-500',
  };
  return colors[type] || 'from-gray-500 to-gray-600';
}

export async function getUnreadReminders(userId: string): Promise<SmartReminder[]> {
  const { data, error } = await supabase
    .from('smart_reminders')
    .select('*')
    .eq('user_id', userId)
    .is('dismissed_at', null)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5);
  if (error) throw error;
  return data || [];
}

export async function dismissReminder(reminderId: string): Promise<void> {
  const { error } = await supabase
    .from('smart_reminders')
    .update({ dismissed_at: new Date().toISOString(), is_read: true })
    .eq('id', reminderId);
  if (error) throw error;
}

export async function generateReminders(userId: string): Promise<SmartReminder[]> {
  const { data, error } = await supabase.rpc('generate_smart_reminders', { p_user_id: userId });
  if (error) throw error;
  return data || [];
}

export async function purchaseStreakFreeze(userId: string, freezeCount: number, coinsSpent: number): Promise<boolean> {
  // Record purchase
  const { error: purchaseError } = await supabase
    .from('streak_freeze_purchases')
    .insert({
      user_id: userId,
      freeze_count: freezeCount,
      coins_spent: coinsSpent,
    });
  if (purchaseError) throw purchaseError;

  // Grant freezes via secure function
  for (let i = 0; i < freezeCount; i++) {
    const { error } = await supabase.rpc('grant_streak_freeze', { p_user_id: userId });
    if (error) throw error;
  }

  return true;
}

export async function getJourneySnapshots(userId: string, year: number): Promise<JourneySnapshot[]> {
  const { data, error } = await supabase
    .from('journey_snapshots')
    .select('*')
    .eq('user_id', userId)
    .eq('year', year)
    .order('month', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getJourneyStats(userId: string): Promise<{
  totalWorkouts: number;
  totalXp: number;
  totalCoins: number;
  totalDays: number;
  avgBrainScore: number;
  currentStreak: number;
  longestStreak: number;
  yearsActive: number;
}> {
  const [workoutsRes, xpRes, coinsRes, streakRes, scoresRes] = await Promise.all([
    supabase.from('workout_sessions').select('date', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('xp_ledger').select('amount').eq('user_id', userId),
    supabase.from('coins_ledger').select('amount').eq('user_id', userId),
    supabase.from('streaks').select('current_streak, longest_streak').eq('user_id', userId).maybeSingle(),
    supabase.from('brain_scores').select('score').eq('user_id', userId).order('date', { ascending: false }).limit(30),
  ]);

  const totalXp = xpRes.data?.reduce((s, l) => s + l.amount, 0) ?? 0;
  const totalCoins = coinsRes.data?.reduce((s, l) => s + l.amount, 0) ?? 0;
  const avgBrainScore = scoresRes.data && scoresRes.data.length > 0
    ? Math.round(scoresRes.data.reduce((a, b) => a + b.score, 0) / scoresRes.data.length)
    : 0;

  // Count unique workout days
  const uniqueDays = new Set(workoutsRes.data?.map(w => w.date)).size;

  return {
    totalWorkouts: workoutsRes.count ?? 0,
    totalXp,
    totalCoins,
    totalDays: uniqueDays,
    avgBrainScore,
    currentStreak: streakRes.data?.current_streak ?? 0,
    longestStreak: streakRes.data?.longest_streak ?? 0,
    yearsActive: 1,
  };
}
