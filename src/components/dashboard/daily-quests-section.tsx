'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateDailyQuests,
  getTodayQuests,
  updateQuestProgress,
  claimQuestReward,
  getQuestCategoryIcon,
  getQuestDifficultyColor,
  type DailyQuest,
} from '@/lib/quests';
import { useAuth } from '@/lib/auth';
import { Check, Gift, Clock, Sparkles, RefreshCw } from 'lucide-react';

export function DailyQuestsSection() {
  const { user, supabase } = useAuth();
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadQuests = useCallback(async () => {
    if (!user) return;
    try {
      const todayQuests = await getTodayQuests(user.id);
      if (todayQuests.length === 0) {
        setQuests([]);
      } else {
        setQuests(todayQuests);
      }
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newQuests = await generateDailyQuests(user.id);
      setQuests(newQuests);
    } catch (err) {
      console.error('Failed to generate quests:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleClaim = async (questId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const success = await claimQuestReward(questId, user.id);
      if (success) {
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
        );
      }
    } catch (err) {
      console.error('Failed to claim reward:', err);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const completedCount = quests.filter((q) => q.completed).length;
  const allCompleted = quests.length > 0 && completedCount === quests.length;

  return (
    <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Daily Brain Quests</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Complete quests to earn bonus XP</p>
          </div>
        </div>
        {quests.length > 0 && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {completedCount}/{quests.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">completed</div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {quests.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">No quests yet today!</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
              </span>
            ) : (
              'Generate Today\'s Quests'
            )}
          </button>
        </div>
      )}

      {/* Quest cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {quests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-xl border transition-all ${
                quest.completed
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                  : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Category icon */}
                <div className="text-2xl">{getQuestCategoryIcon(quest.category)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{quest.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getQuestDifficultyColor(quest.difficulty)}`}>
                      {quest.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{quest.description}</p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, (1 / quest.goal_value) * 100)}%`,
                        }}
                        className={`h-full rounded-full ${
                          quest.completed
                            ? 'bg-green-500'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {quest.completed ? '✓' : `1/${quest.goal_value}`}
                    </span>
                  </div>
                </div>

                {/* Rewards */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <Sparkles className="w-3 h-3" /> +{quest.xp_reward} XP
                  </div>
                  <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                    💰 +{quest.coin_reward}
                  </div>
                  {quest.momentum_bonus > 0 && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      ⚡ +{quest.momentum_bonus}
                    </div>
                  )}
                </div>

                {/* Claim button */}
                {quest.completed && !quest.claimed && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => handleClaim(quest.id)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium hover:opacity-90 transition"
                  >
                    <Gift className="w-3.5 h-3.5" />
                  </motion.button>
                )}
                {quest.claimed && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* All completed celebration */}
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 text-center p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-800"
        >
          <div className="text-2xl mb-1">🎉</div>
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
            All quests completed! Your brain is on fire!
          </p>
        </motion.div>
      )}
    </div>
  );
}
