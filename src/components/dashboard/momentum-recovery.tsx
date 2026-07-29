'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  simulateMomentum,
  getMomentumLabel,
  type MomentumProjection,
} from '@/lib/momentum';
import { useAuth } from '@/lib/auth';
import { TrendingUp, Calendar, Zap, AlertTriangle } from 'lucide-react';

export function MomentumRecovery() {
  const { user, supabase } = useAuth();
  const [projections, setProjections] = useState<MomentumProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [frequency, setFrequency] = useState(0.7);

  const loadProjections = useCallback(async () => {
    if (!user) return;
    try {
      const data = await simulateMomentum(user.id, 14, frequency);
      setProjections(data);
    } catch (err) {
      console.error('Failed to load projections:', err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, frequency]);

  useEffect(() => {
    loadProjections();
  }, [loadProjections]);

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

  if (projections.length === 0) return null;

  const maxScore = Math.max(...projections.map((p) => p.projected_score), 100);
  const scenarios = {
    training: projections.filter((p) => p.scenario === 'training').length,
    resting: projections.filter((p) => p.scenario === 'resting').length,
    recovering: projections.filter((p) => p.scenario === 'recovering').length,
  };

  return (
    <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Consistency Forecast</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">See how your training affects momentum</p>
          </div>
        </div>
      </div>

      {/* Frequency slider */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Training Frequency</span>
          <span className="font-mono">{Math.round(frequency * 100)}% of days</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={frequency}
          onChange={(e) => {
            setFrequency(parseFloat(e.target.value));
            setLoading(true);
          }}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Rarely</span>
          <span>Most days</span>
          <span>Every day</span>
        </div>
      </div>

      {/* Projection chart */}
      <div className="h-40 mb-4">
        <svg viewBox={`0 0 ${projections.length * 20} 140`} className="w-full h-full">
          <defs>
            <linearGradient id="projGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(6,182,212)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(6,182,212)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area */}
          <path
            d={`M 0 140 ${projections
              .map((p, i) => `L ${i * 20 + 10} ${140 - (p.projected_score / maxScore) * 120}`)
              .join(' ')} L ${(projections.length - 1) * 20 + 10} 140 Z`}
            fill="url(#projGradient)"
          />
          {/* Line */}
          <polyline
            points={projections
              .map((p, i) => `${i * 20 + 10},${140 - (p.projected_score / maxScore) * 120}`)
              .join(' ')}
            fill="none"
            stroke="rgb(6,182,212)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Scenario dots */}
          {projections.map((p, i) => (
            <circle
              key={i}
              cx={i * 20 + 10}
              cy={140 - (p.projected_score / maxScore) * 120}
              r="3"
              fill={
                p.scenario === 'training'
                  ? 'rgb(34,197,94)'
                  : p.scenario === 'resting'
                  ? 'rgb(234,179,8)'
                  : 'rgb(239,68,68)'
              }
            />
          ))}
        </svg>
      </div>

      {/* Scenario legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-600 dark:text-gray-400">Training ({scenarios.training}d)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-gray-600 dark:text-gray-400">Resting ({scenarios.resting}d)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-gray-600 dark:text-gray-400">Recovering ({scenarios.recovering}d)</span>
        </div>
      </div>

      {/* Key insight */}
      {frequency < 0.5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
            <AlertTriangle className="w-4 h-4" />
            <span>Training less than 50% of days causes momentum to decline</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
