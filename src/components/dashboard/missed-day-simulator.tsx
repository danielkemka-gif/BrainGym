'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { simulateMomentum, getMomentumLabel, type MomentumProjection } from '@/lib/momentum';
import { createClient } from '@/lib/supabase/client';
import { Calendar, TrendingDown, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

export function MissedDaySimulator() {
  const [projections, setProjections] = useState<MomentumProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentScore, setCurrentScore] = useState(50);
  const supabase = createClient();

  const loadSimulations = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current score
      const { data: momentum } = await supabase
        .from('brain_momentum')
        .select('score')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      const score = momentum?.score ?? 50;
      setCurrentScore(score);

      // Simulate 0% training frequency (missing all days)
      const missAll = await simulateMomentum(user.id, 7, 0.0, 1.0);
      // Simulate 50% frequency
      const missSome = await simulateMomentum(user.id, 7, 0.5, 1.0);
      // Simulate 100% frequency
      const trainAll = await simulateMomentum(user.id, 7, 1.0, 1.0);

      // Combine into single view: take the "miss all" as the default scenario
      setProjections(missAll);
    } catch (err) {
      console.error('Failed to load simulations:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadSimulations();
  }, [loadSimulations]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (projections.length === 0) return null;

  const finalScore = projections[projections.length - 1]?.projected_score ?? currentScore;
  const scoreDrop = currentScore - finalScore;
  const willDropBelow60 = finalScore < 60;
  const willDropBelow40 = finalScore < 40;
  const { emoji, label } = getMomentumLabel(finalScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl backdrop-blur-sm border p-6 ${
        willDropBelow40
          ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
          : willDropBelow60
          ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
          : 'bg-white/50 dark:bg-white/5 border-gray-200 dark:border-gray-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            willDropBelow40
              ? 'bg-gradient-to-br from-red-500 to-red-600'
              : 'bg-gradient-to-br from-orange-500 to-amber-600'
          }`}>
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">What If You Miss?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">See how missing days affects your momentum</p>
          </div>
        </div>
      </div>

      {/* Current vs Projected */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 text-center p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentScore}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Today</div>
        </div>
        <TrendingDown className="w-5 h-5 text-orange-500 shrink-0" />
        <div className="flex-1 text-center p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{finalScore}</div>
          <div className="text-xs text-orange-500 dark:text-orange-400">In 7 days (no training)</div>
        </div>
      </div>

      {/* Drop indicator */}
      <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/10">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
          You'd lose {scoreDrop} points and drop to {label} {emoji}
        </span>
      </div>

      {/* Day-by-day mini chart */}
      <div className="h-16 mb-3">
        <svg viewBox={`0 0 ${projections.length * 20} 60`} className="w-full h-full">
          <defs>
            <linearGradient id="missGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(249,115,22)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="rgb(249,115,22)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 60 ${projections
              .map((p, i) => `L ${i * 20 + 10} ${60 - (p.projected_score / 100) * 50}`)
              .join(' ')} L ${(projections.length - 1) * 20 + 10} 60 Z`}
            fill="url(#missGrad)"
          />
          <polyline
            points={projections
              .map((p, i) => `${i * 20 + 10},${60 - (p.projected_score / 100) * 50}`)
              .join(' ')}
            fill="none"
            stroke="rgb(249,115,22)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Motivation */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {scoreDrop > 15
            ? "That's a significant drop. Even a quick 5-minute session can keep your momentum going!"
            : scoreDrop > 5
            ? "A few missed days add up. Try to squeeze in at least one session."
            : "Your momentum is resilient! Keep training to maintain it."}
        </p>
      </div>
    </motion.div>
  );
}
