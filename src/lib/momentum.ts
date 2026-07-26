import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface BrainMomentum {
  id: string;
  user_id: string;
  score: number;
  previous_score: number;
  streak_factor: number;
  consistency_factor: number;
  growth_factor: number;
  engagement_factor: number;
  score_date: string;
  calculated_at: string;
  created_at: string;
}

export interface MomentumTrend {
  score: number;
  calculated_at: string;
}

export interface MomentumProjection {
  day: number;
  projected_score: number;
  scenario: string;
}

export function getMomentumLabel(score: number): { label: string; color: string; emoji: string } {
  if (score >= 90) return { label: 'Unstoppable', color: 'text-yellow-400', emoji: '🔥' };
  if (score >= 75) return { label: 'Soaring', color: 'text-green-400', emoji: '🚀' };
  if (score >= 60) return { label: 'Building', color: 'text-blue-400', emoji: '📈' };
  if (score >= 40) return { label: 'Warming Up', color: 'text-purple-400', emoji: '⚡' };
  if (score >= 20) return { label: 'Recovering', color: 'text-orange-400', emoji: '🔄' };
  return { label: 'Getting Started', color: 'text-gray-400', emoji: '🌱' };
}

export async function calculateMomentum(userId: string): Promise<BrainMomentum | null> {
  const { data, error } = await supabase.rpc('calculate_momentum', { p_user_id: userId });
  if (error) throw error;
  return data;
}

export async function getMomentumTrend(userId: string, days: number = 30): Promise<MomentumTrend[]> {
  const { data, error } = await supabase.rpc('get_momentum_trend', {
    p_user_id: userId,
    p_days: days,
  });
  if (error) throw error;
  return data || [];
}

export async function simulateMomentum(
  userId: string,
  days: number = 30,
  frequency: number = 0.7,
  intensity: number = 1.0
): Promise<MomentumProjection[]> {
  const { data, error } = await supabase.rpc('simulate_momentum', {
    p_user_id: userId,
    p_days: days,
    p_workout_frequency: frequency,
    p_intensity: intensity,
  });
  if (error) throw error;
  return data || [];
}
