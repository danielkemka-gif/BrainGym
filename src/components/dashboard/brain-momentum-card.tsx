'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateMomentum,
  getMomentumTrend,
  getMomentumLabel,
  type BrainMomentum,
  type MomentumTrend,
} from '@/lib/momentum';
import { useAuth } from '@/lib/auth';
import { Zap, TrendingUp, TrendingDown, Minus, Calendar, Target, Flame, Sparkles } from 'lucide-react';

export function BrainMomentumCard() {
  const { user, supabase } = useAuth();
  const [momentum, setMomentum] = useState<BrainMomentum | null>(null);
  const [trend, setTrend] = useState<MomentumTrend[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [m, t] = await Promise.all([
        calculateMomentum(user.id),
        getMomentumTrend(user.id, 30),
      ]);

      setMomentum(m);
      setTrend(t);
    } catch (err) {
      console.error('Failed to load momentum:', err);
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

  if (!momentum) return null;

  const { label, color, emoji } = getMomentumLabel(momentum.score);
  const delta = momentum.score - momentum.previous_score;
  const trendData = trend.slice(-14); // last 14 days for chart
  const maxScore = Math.max(...trendData.map((t) => t.score), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Brain Momentum</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your cognitive growth velocity</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{momentum.score}</div>
          <div className={`flex items-center gap-1 text-xs font-medium ${color}`}>
            {emoji} {label}
          </div>
        </div>
      </div>

      {/* Trend indicator */}
      <div className="flex items-center gap-2 mb-4">
        {delta > 0 ? (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
            <TrendingUp className="w-4 h-4" /> +{delta} from yesterday
          </div>
        ) : delta < 0 ? (
          <div className="flex items-center gap-1 text-orange-500 dark:text-orange-400 text-sm font-medium">
            <TrendingDown className="w-4 h-4" /> {delta} from yesterday
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm font-medium">
            <Minus className="w-4 h-4" /> No change
          </div>
        )}
      </div>

      {/* Mini sparkline chart */}
      {trendData.length > 1 && (
        <div className="mb-4 sm:mb-6 h-20">
          <svg viewBox={`0 0 ${trendData.length * 10} 80`} className="w-full h-full">
            <defs>
              <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(139,92,246)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(139,92,246)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={`M 0 80 ${trendData
                .map((t, i) => `L ${i * 10 + 5} ${80 - (t.score / maxScore) * 70}`)
                .join(' ')} L ${(trendData.length - 1) * 10 + 5} 80 Z`}
              fill="url(#momentumGradient)"
            />
            {/* Line */}
            <polyline
              points={trendData
                .map((t, i) => `${i * 10 + 5},${80 - (t.score / maxScore) * 70}`)
                .join(' ')}
              fill="none"
              stroke="rgb(139,92,246)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Factor breakdown */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <FactorBar icon={<Flame className="w-3.5 h-3.5" />} label="Streak" value={momentum.streak_factor} max={30} color="from-orange-500 to-red-500" />
        <FactorBar icon={<Calendar className="w-3.5 h-3.5" />} label="Consistency" value={momentum.consistency_factor} max={25} color="from-blue-500 to-cyan-500" />
        <FactorBar icon={<TrendingUp className="w-3.5 h-3.5" />} label="Growth" value={momentum.growth_factor} max={25} color="from-green-500 to-emerald-500" />
        <FactorBar icon={<Sparkles className="w-3.5 h-3.5" />} label="Engagement" value={momentum.engagement_factor} max={20} color="from-purple-500 to-pink-500" />
      </div>
    </motion.div>
  );
}

function FactorBar({
  icon,
  label,
  value,
  max,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          {icon} {label}
        </div>
        <span className="text-gray-500 dark:text-gray-400 font-mono">{Math.round(value)}/{max}</span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}
