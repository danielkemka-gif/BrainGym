import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface DailyQuest {
  id: string;
  user_id: string;
  quest_date: string;
  category: string;
  difficulty: string;
  title: string;
  description: string;
  goal_type: string;
  goal_value: number;
  xp_reward: number;
  coin_reward: number;
  momentum_bonus: number;
  completed: boolean;
  completed_at: string | null;
  claimed: boolean;
  created_at: string;
}

export interface QuestProgress {
  id: string;
  quest_id: string;
  user_id: string;
  current_value: number;
  last_updated: string;
}

export function getQuestCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    memory: '🧠',
    focus: '🎯',
    logic: '🧩',
    speed: '⚡',
    fitness: '💪',
  };
  return icons[category] || '✨';
}

export function getQuestDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return colors[difficulty] || colors.medium;
}

export async function generateDailyQuests(userId: string): Promise<DailyQuest[]> {
  const { data, error } = await supabase.rpc('generate_daily_quests', { p_user_id: userId });
  if (error) throw error;
  return data || [];
}

export async function getTodayQuests(userId: string): Promise<DailyQuest[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_quests')
    .select('*')
    .eq('user_id', userId)
    .eq('quest_date', today)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function updateQuestProgress(
  questId: string,
  userId: string,
  increment: number = 1
): Promise<DailyQuest | null> {
  const { data, error } = await supabase.rpc('update_quest_progress', {
    p_quest_id: questId,
    p_user_id: userId,
    p_increment: increment,
  });
  if (error) throw error;
  return data;
}

export async function claimQuestReward(questId: string, userId: string): Promise<boolean> {
  const { data: quest, error: fetchError } = await supabase
    .from('daily_quests')
    .select('xp_reward, coin_reward, momentum_bonus, claimed, completed')
    .eq('id', questId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !quest || quest.claimed || !quest.completed) return false;

  // Grant XP via secure function
  const { error: xpError } = await supabase.rpc('grant_xp', {
    p_user_id: userId,
    p_amount: quest.xp_reward,
    p_reason: 'daily_quest',
    p_reference_type: 'daily_quest',
    p_reference_id: questId,
  });
  if (xpError) throw xpError;

  // Grant coins via secure function
  const { error: coinError } = await supabase.rpc('grant_coins', {
    p_user_id: userId,
    p_amount: quest.coin_reward,
    p_reason: 'daily_quest',
    p_reference_type: 'daily_quest',
    p_reference_id: questId,
  });
  if (coinError) throw coinError;

  // Mark as claimed
  const { error: claimError } = await supabase
    .from('daily_quests')
    .update({ claimed: true })
    .eq('id', questId);
  if (claimError) throw claimError;

  return true;
}
