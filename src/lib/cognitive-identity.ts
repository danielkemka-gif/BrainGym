import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface CognitiveIdentity {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_emoji: string;
  tier: number;
  category: string;
  required_level: number;
  required_workouts: number;
  required_streak: number;
  required_brain_score: number;
  required_achievements: number;
  required_categories: number;
  is_active: boolean;
  created_at: string;
}

export interface UserIdentity {
  id: string;
  user_id: string;
  identity_id: string;
  unlocked_at: string;
  is_active: boolean;
  identity?: CognitiveIdentity;
}

export function getIdentityCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    explorer: 'Explorer',
    memory: 'Memory',
    focus: 'Focus',
    logic: 'Logic',
    speed: 'Speed',
    elite: 'Elite',
  };
  return labels[category] || category;
}

export function getIdentityCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    explorer: 'from-gray-500 to-gray-600',
    memory: 'from-purple-500 to-indigo-600',
    focus: 'from-blue-500 to-cyan-600',
    logic: 'from-green-500 to-emerald-600',
    speed: 'from-yellow-500 to-orange-600',
    elite: 'from-red-500 to-pink-600',
  };
  return colors[category] || 'from-gray-500 to-gray-600';
}

export function getTierLabel(tier: number): string {
  const labels: Record<number, string> = {
    1: 'Bronze',
    2: 'Silver',
    3: 'Gold',
  };
  return labels[tier] || 'Bronze';
}

export async function getAllIdentities(): Promise<CognitiveIdentity[]> {
  const { data, error } = await supabase
    .from('cognitive_identities')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('tier', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getUserIdentities(userId: string): Promise<UserIdentity[]> {
  const { data, error } = await supabase
    .from('user_identities')
    .select('*, identity:cognitive_identities(*)')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getActiveIdentity(userId: string): Promise<CognitiveIdentity | null> {
  const { data, error } = await supabase
    .from('user_identities')
    .select('identity:cognitive_identities(*)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();
  if (error) return null;
  return data?.identity as unknown as CognitiveIdentity | null;
}

export async function setActiveIdentity(userId: string, identityId: string): Promise<boolean> {
  // Deactivate all current
  await supabase
    .from('user_identities')
    .update({ is_active: false })
    .eq('user_id', userId);

  // Activate selected
  const { error } = await supabase
    .from('user_identities')
    .update({ is_active: true })
    .eq('user_id', userId)
    .eq('identity_id', identityId);

  return !error;
}

export async function checkAndUnlockIdentities(userId: string): Promise<CognitiveIdentity[]> {
  const { data, error } = await supabase.rpc('check_and_unlock_identities', { p_user_id: userId });
  if (error) throw error;
  return data || [];
}
