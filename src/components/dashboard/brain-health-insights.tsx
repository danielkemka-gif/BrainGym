'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  generateBrainHealthSnapshot,
  getWeeklyHealthSummary,
  getHealthColor,
  getHealthLabel,
  type BrainHealthSnapshot,
  type BrainHealthSummary,
} from '@/lib/brain-health';
import { useAuth } from '@/lib/auth';
import { Heart, TrendingUp, TrendingDown, Minus, Sparkles, Target, Flame, Shield, Zap } from 'lucide-react';

export function BrainHealthInsights() {
  const { user, supabase } = useAuth();
  const [snapshot, setSnapshot] = useState<BrainHealthSnapshot | null>(null);
  const [weekly, setWeekly] = useState<BrainHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [snap, wk] = await Promise.all([
        generateBrainHealthSnapshot(user.id),
        getWeeklyHealthSummary(user.id),
      ]);

      setSnapshot(snap);
      setWeekly(wk);
    } catch (err) {
      console.error('Failed to load brain health:', err);
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
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!snapshot || !weekly) return null;

  const trendIcon = weekly.trend === 'improving' ? <TrendingUp className="w-4 h-4 text-green-500" />
    : weekly.trend === 'declining' ? <TrendingDown className="w-4 h-4 text-red-500" />
    : <Minus className="w-4 h-4 text-gray-400" />;

  const domains = [
    { label: 'Memory', score: snapshot.memory_score, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Focus', score: snapshot.focus_score, icon: <Target className="w-3.5 h-3.5" /> },
    { label: 'Logic', score: snapshot.logic_score, icon: <Shield className="w-3.5 h-3.5" /> },
    { label: 'Speed', score: snapshot.speed_score, icon: <Zap className="w-3.5 h-3.5" /> },
    { label: 'Health', score: snapshot.fitness_score, icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Brain Health</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Weekly cognitive health summary</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getHealthColor(snapshot.overall_score)}`}>
            {snapshot.overall_score}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getHealthLabel(snapshot.overall_score)}
          </div>
        </div>
      </div>

      {/* Trend + Weekly stats */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-1.5 text-sm">
          {trendIcon}
          <span className={`font-medium ${
            weekly.trend === 'improving' ? 'text-green-600 dark:text-green-400'
              : weekly.trend === 'declining' ? 'text-red-600 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {weekly.trend === 'improving' ? `+${weekly.trend_delta}` : weekly.trend === 'declining' ? `${weekly.trend_delta}` : 'Stable'}
          </span>
          <span className="text-gray-400 dark:text-gray-500">vs last week</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Flame className="w-3 h-3" /> {weekly.workouts_completed} workouts
        </div>
      </div>

      {/* Domain scores radar (simplified bar chart) */}
      <div className="space-y-3 mb-4 sm:mb-6">
        {domains.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 w-16">
              {d.icon} {d.label}
            </div>
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.score}%` }}
                transition={{ duration: 1, delay: 0.1 }}
                className={`h-full rounded-full ${
                  d.score >= 70 ? 'bg-green-500' : d.score >= 50 ? 'blue-500' : 'bg-orange-500'
                }`}
              />
            </div>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-8 text-right">
              {d.score}
            </span>
          </div>
        ))}
      </div>

      {/* Best + Weakest */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
          <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Strongest</div>
          <div className="text-sm font-semibold text-green-700 dark:text-green-300">
            {weekly.best_category.name} ({weekly.best_category.score})
          </div>
        </div>
        <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800">
          <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Focus Area</div>
          <div className="text-sm font-semibold text-orange-700 dark:text-orange-300">
            {weekly.weakest_category.name} ({weekly.weakest_category.score})
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        {snapshot.recommendations.slice(0, 2).map((rec, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="text-purple-500 mt-0.5">•</span>
            {rec}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
