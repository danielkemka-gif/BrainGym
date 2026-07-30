'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  getJourneyStats,
  type JourneySnapshot,
} from '@/lib/reminders';
import { useAuth } from '@/lib/auth';
import { Calendar, TrendingUp, Award, Flame, Zap, Target, Sparkles } from 'lucide-react';

interface JourneyStats {
  totalWorkouts: number;
  totalXp: number;
  totalCoins: number;
  totalDays: number;
  avgBrainScore: number;
  currentStreak: number;
  longestStreak: number;
  yearsActive: number;
}

export function ThreeSixFiveJourney() {
  const { user, supabase } = useAuth();
  const [stats, setStats] = useState<JourneyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const journeyStats = await getJourneyStats(user.id);
      setStats(journeyStats);
    } catch (err) {
      console.error('Failed to load journey:', err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const milestones = [
    { icon: <Flame className="w-4 h-4" />, label: 'Day 1', achieved: stats.totalDays >= 1, color: 'text-orange-500' },
    { icon: <Target className="w-4 h-4" />, label: '7-Day Streak', achieved: stats.longestStreak >= 7, color: 'text-blue-500' },
    { icon: <Zap className="w-4 h-4" />, label: '30-Day Streak', achieved: stats.longestStreak >= 30, color: 'text-purple-500' },
    { icon: <Sparkles className="w-4 h-4" />, label: '100 Workouts', achieved: stats.totalWorkouts >= 100, color: 'text-yellow-500' },
    { icon: <TrendingUp className="w-4 h-4" />, label: 'Brain Score 80+', achieved: stats.avgBrainScore >= 80, color: 'text-green-500' },
    { icon: <Award className="w-4 h-4" />, label: '1000 XP', achieved: stats.totalXp >= 1000, color: 'text-pink-500' },
  ];

  const achievedCount = milestones.filter(m => m.achieved).length;
  const progressPct = Math.round((achievedCount / milestones.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Your Brain Journey</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stats.totalDays} days of training</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{progressPct}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{achievedCount}/{milestones.length} milestones</div>
        </div>
      </div>

      {/* Milestone progress ring */}
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="rgb(229,231,235)"
              strokeWidth="6"
              className="dark:stroke-gray-700"
            />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="url(#journeyGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${progressPct * 2.64} ${264 - progressPct * 2.64}`}
            />
            <defs>
              <linearGradient id="journeyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(139,92,246)" />
                <stop offset="100%" stopColor="rgb(236,72,153)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalWorkouts}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">workouts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3 mb-4 sm:mb-6">
        <div className="text-center">
          <div className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{stats.totalXp.toLocaleString()}</div>
          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total XP</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalCoins.toLocaleString()}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Coins</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.avgBrainScore}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Avg Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.longestStreak}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Best Streak</div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        {milestones.map((milestone, i) => (
          <motion.div
            key={milestone.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              milestone.achieved
                ? 'bg-green-50 dark:bg-green-900/10'
                : 'bg-gray-50 dark:bg-gray-800/30 opacity-60'
            }`}
          >
            <div className={`${milestone.achieved ? milestone.color : 'text-gray-400'}`}>
              {milestone.icon}
            </div>
            <span className={`text-sm flex-1 ${milestone.achieved ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              {milestone.label}
            </span>
            {milestone.achieved && (
              <span className="text-green-500 text-xs">✓</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
